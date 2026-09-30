import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { withGeneratedCode } from "@/server/services/generated-code";
import { apiError, claimRepairBay, ResourceError } from "@/server/services/resource-service";

export const runtime = "nodejs";

const intakeSchema = z.object({
  appointmentId: z.string().min(1).optional(),
  customerId: z.string().min(1),
  vehicleId: z.string().min(1),
  advisorId: z.string().min(1).optional(),
  technicianId: z.string().min(1).optional(),
  bayCode: z.string().min(1).optional(),
  odometerKm: z.number().int().min(0).optional(),
  laborCost: z.number().finite().min(0).max(999999999999).optional(),
  diagnosis: z.string().trim().max(5000).optional(),
  notes: z.string().trim().max(5000).optional(),
  lines: z.array(z.object({
    type: z.enum(["SERVICE", "PART"]),
    catalogId: z.string().min(1),
    quantity: z.number().int().min(1).max(1000),
  })).max(50),
}).strict();

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = intakeSchema.parse(await request.json());
    if (input.bayCode && !input.technicianId) throw new ResourceError("Chọn kỹ thuật viên trước khi phân khoang.", 400);
    const db = getPrisma();
    const create = () => withGeneratedCode("repair-orders", (code) => db.$transaction(async (tx) => {
      await tx.appointmentBookingMutex.update({ where: { id: 1 }, data: { version: { increment: 1 } } });
      const vehicle = await tx.vehicle.findFirst({ where: { id: input.vehicleId, deletedAt: null }, select: { customerId: true } });
      const customer = await tx.customer.findFirst({ where: { id: input.customerId, deletedAt: null }, select: { id: true } });
      if (!customer || !vehicle || vehicle.customerId !== input.customerId) throw new ResourceError("Xe không thuộc khách hàng đã chọn.", 400);
      if (input.advisorId) {
        const advisor = await tx.employee.findFirst({ where: { id: input.advisorId, status: "ACTIVE", deletedAt: null }, select: { id: true } });
        if (!advisor) throw new ResourceError("Cố vấn không còn hoạt động.", 400);
      }
      if (input.technicianId) {
        const technician = await tx.employee.findFirst({ where: { id: input.technicianId, status: "ACTIVE", deletedAt: null }, select: { id: true } });
        if (!technician) throw new ResourceError("Kỹ thuật viên không còn hoạt động.", 400);
      }
      const appointment = input.appointmentId ? await tx.appointment.findFirst({
        where: { id: input.appointmentId, deletedAt: null },
        select: { id: true, code: true, customerId: true, vehicleId: true, startsAt: true, status: true },
      }) : null;
      if (input.appointmentId && !appointment) throw new ResourceError("Lịch hẹn không tồn tại.", 404);
      if (appointment) {
        if (appointment.customerId !== input.customerId || appointment.vehicleId !== input.vehicleId) throw new ResourceError("Khách hàng hoặc xe không khớp lịch hẹn.", 400);
        if (["CANCELLED", "COMPLETED"].includes(appointment.status)) throw new ResourceError("Lịch hẹn đã kết thúc, không thể tiếp nhận.", 409);
        const linked = await tx.repairOrder.findUnique({ where: { appointmentId: appointment.id }, select: { code: true } });
        if (linked) throw new ResourceError(`Lịch hẹn đã có phiếu ${linked.code}.`, 409);
      }
      const openOrder = await tx.repairOrder.findFirst({ where: { vehicleId: input.vehicleId, deletedAt: null, status: { notIn: ["COMPLETED", "CANCELLED"] } }, select: { code: true } });
      if (openOrder) throw new ResourceError(`Xe đang có phiếu ${openOrder.code} chưa hoàn tất. Hãy xử lý phiếu đó trước.`, 409);
      const lines: Prisma.RepairOrderLineCreateWithoutRepairOrderInput[] = [];
      let estimateTotal = new Prisma.Decimal(0);
      for (const [index, item] of input.lines.entries()) {
        const catalog = item.type === "SERVICE"
          ? await tx.service.findFirst({ where: { id: item.catalogId, status: "ACTIVE", deletedAt: null }, select: { id: true, title: true, price: true } })
          : await tx.part.findFirst({ where: { id: item.catalogId, status: "ACTIVE", deletedAt: null }, select: { id: true, name: true, price: true } });
        if (!catalog) throw new ResourceError(`Hạng mục ${index + 1} không còn trong danh mục.`, 400);
        const total = catalog.price.mul(item.quantity);
        estimateTotal = estimateTotal.add(total);
        lines.push({
          type: item.type,
          description: "title" in catalog ? catalog.title : catalog.name,
          quantity: item.quantity,
          unitPrice: catalog.price,
          total,
          sortOrder: index,
          ...(item.type === "SERVICE" ? { service: { connect: { id: catalog.id } } } : { part: { connect: { id: catalog.id } } }),
        });
      }
      if (input.bayCode) await claimRepairBay(tx, { bayCode: input.bayCode, vehicleId: input.vehicleId, technicianId: input.technicianId });
      const laborCost = new Prisma.Decimal(input.laborCost ?? 0);
      const created = await tx.repairOrder.create({
        data: {
          code,
          customerId: input.customerId,
          vehicleId: input.vehicleId,
          appointmentId: appointment?.id,
          advisorId: input.advisorId,
          technicianId: input.technicianId,
          bayCode: input.bayCode,
          scheduledAt: appointment?.startsAt ?? new Date(),
          status: input.bayCode ? "REPAIRING" : "INTAKE",
          odometerKm: input.odometerKm,
          diagnosis: input.diagnosis,
          notes: input.notes,
          laborCost,
          estimateTotal: estimateTotal.add(laborCost),
          lines: { create: lines },
        },
      });
      if (appointment) {
        const updated = await tx.appointment.updateMany({ where: { id: appointment.id, status: { notIn: ["CANCELLED", "COMPLETED"] }, deletedAt: null }, data: { status: "IN_PROGRESS" } });
        if (!updated.count) throw new ResourceError("Lịch hẹn vừa thay đổi. Vui lòng tải lại trang.", 409);
      }
      return created;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, maxWait: 5000, timeout: 15000 }));
    let order: Awaited<ReturnType<typeof create>> | null = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try { order = await create(); break; }
      catch (error) {
        const retryable = error instanceof Prisma.PrismaClientKnownRequestError
          && (error.code === "P2034" || (error.code === "P2039" && /write conflict|deadlock|lock wait timeout|9007|1213/i.test(error.message)));
        if (!retryable || attempt === 2) throw error;
      }
    }
    if (!order) throw new ResourceError("Không thể tạo phiếu lúc này. Vui lòng thử lại.", 409);
    return Response.json({ id: order.id, code: order.code }, { status: 201 });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message, details: failure.details }, { status: failure.status });
  }
}
