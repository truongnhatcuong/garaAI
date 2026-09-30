import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { apiError, ResourceError } from "@/server/services/resource-service";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

const moneySchema = z.number().finite().min(0).max(999999999999.99);
const linesSchema = z.object({
  laborCost: moneySchema.optional(),
  lines: z.array(z.union([
    z.object({ id: z.string().min(1), quantity: z.number().int().min(1).max(1000), unitPrice: moneySchema.optional() }).strict(),
    z.object({ type: z.enum(["SERVICE", "PART"]), catalogId: z.string().min(1), quantity: z.number().int().min(1).max(1000), unitPrice: moneySchema.optional() }).strict(),
  ])).max(50),
}).strict();

export async function PATCH(request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const input = linesSchema.parse(await request.json());
    const db = getPrisma();
    const result = await db.$transaction(async (tx) => {
      await tx.appointmentBookingMutex.update({ where: { id: 1 }, data: { version: { increment: 1 } } });
      const order = await tx.repairOrder.findFirst({ where: { id, deletedAt: null }, include: { lines: true } });
      if (!order) throw new ResourceError("Không tìm thấy phiếu sửa chữa.", 404);
      if (order.status === "CANCELLED") throw new ResourceError("Phiếu đã hủy, không thể sửa hạng mục.", 409);
      const invoices = await tx.invoice.count({ where: { repairOrderId: id, deletedAt: null, status: { not: "CANCELLED" } } });
      if (invoices) throw new ResourceError("Phiếu đã có hóa đơn. Hãy xử lý hóa đơn trước khi đổi hạng mục.", 409);
      const keptIds = input.lines.filter((line): line is { id: string; quantity: number; unitPrice?: number } => "id" in line);
      if (new Set(keptIds.map((line) => line.id)).size !== keptIds.length) throw new ResourceError("Hạng mục bị lặp trong yêu cầu.", 400);
      if (keptIds.some((line) => !order.lines.some((existing) => existing.id === line.id))) throw new ResourceError("Hạng mục không thuộc phiếu này.", 400);
      await tx.repairOrderLine.deleteMany({ where: { repairOrderId: id, id: { notIn: keptIds.map((line) => line.id) } } });
      let estimateTotal = new Prisma.Decimal(0);
      for (const [index, line] of input.lines.entries()) {
        if ("id" in line) {
          const existing = order.lines.find((item) => item.id === line.id)!;
          const unitPrice = new Prisma.Decimal(line.unitPrice ?? existing.unitPrice);
          const total = unitPrice.mul(line.quantity);
          estimateTotal = estimateTotal.add(total);
          await tx.repairOrderLine.update({ where: { id: line.id }, data: { quantity: line.quantity, unitPrice, total, sortOrder: index } });
        } else {
          const catalog = line.type === "SERVICE"
            ? await tx.service.findFirst({ where: { id: line.catalogId, status: "ACTIVE", deletedAt: null }, select: { id: true, title: true, price: true } })
            : await tx.part.findFirst({ where: { id: line.catalogId, status: "ACTIVE", deletedAt: null }, select: { id: true, name: true, price: true } });
          if (!catalog) throw new ResourceError(`Hạng mục ${index + 1} không còn trong danh mục.`, 400);
          const unitPrice = new Prisma.Decimal(line.unitPrice ?? catalog.price);
          const total = unitPrice.mul(line.quantity);
          estimateTotal = estimateTotal.add(total);
          await tx.repairOrderLine.create({ data: {
            repairOrderId: id,
            type: line.type,
            description: "title" in catalog ? catalog.title : catalog.name,
            quantity: line.quantity,
            unitPrice,
            total,
            sortOrder: index,
            ...(line.type === "SERVICE" ? { serviceId: catalog.id } : { partId: catalog.id }),
          } });
        }
      }
      const laborCost = new Prisma.Decimal(input.laborCost ?? order.laborCost);
      const totalCost = estimateTotal.add(laborCost);
      await tx.repairOrder.update({ where: { id }, data: { laborCost, estimateTotal: totalCost } });
      return { estimateTotal: totalCost.toString() };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
    return Response.json(result);
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message, details: failure.details }, { status: failure.status });
  }
}
