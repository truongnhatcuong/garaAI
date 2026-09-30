import "server-only";
import { z } from "zod";
import { getPrisma } from "@/server/db";
import { getCurrentUser } from "@/server/services/auth";
import { ResourceError } from "@/server/services/resource-service";
import { reserveAppointment } from "@/server/services/appointment-booking";
import { withGeneratedCode } from "@/server/services/generated-code";
import { parseListQuery } from "@/server/validation/resources";

export async function requireCustomer() { const user = await getCurrentUser(); if (!user || user.role !== "CUSTOMER" || !user.customerId) throw new ResourceError("Vui lòng đăng nhập tài khoản chủ xe.", 401); return user; }
export async function listMine(resource: string, params: URLSearchParams) {
  const user = await requireCustomer(); const query = parseListQuery(params); const db = getPrisma(); const base = { customerId: user.customerId!, deletedAt: null }; const page = query.page, pageSize = query.pageSize; const direction = query.direction; const pagination = (total: number) => ({ page, pageSize, total, totalPages: Math.ceil(total / pageSize) });
  if (resource === "profile") {
    const [tier, repairCount] = await Promise.all([
      db.membershipTier.findUnique({ where: { code: user.customer!.tier } }),
      db.repairOrder.count({ where: { customerId: user.customerId!, status: "COMPLETED", deletedAt: null } }),
    ]);
    return { ...user.customer!, discountPercent: tier?.discountPercent.toNumber() ?? 0, repairCount };
  }
  if (resource === "vehicles") { const where = { ...base, ...(query.status && ["ACTIVE", "IN_REPAIR", "READY"].includes(query.status) ? { status: query.status as "ACTIVE" } : {}), ...(query.search ? { OR: [{ plate: { contains: query.search } }, { name: { contains: query.search } }] } : {}) }; const [total, items] = await Promise.all([db.vehicle.count({ where }), db.vehicle.findMany({ where, orderBy: { [query.sort && ["plate", "name", "createdAt"].includes(query.sort) ? query.sort : "createdAt"]: direction }, skip: (page - 1) * pageSize, take: pageSize })]); return { items, pagination: pagination(total) }; }
  if (resource === "appointments") { const where = { ...base, ...(query.status && ["PENDING", "CONFIRMED", "ARRIVED", "IN_PROGRESS", "CANCELLED", "COMPLETED"].includes(query.status) ? { status: query.status as "PENDING" } : {}), ...(query.search ? { OR: [{ code: { contains: query.search } }, { vehicle: { is: { plate: { contains: query.search } } } }] } : {}) }; const [total, items] = await Promise.all([db.appointment.count({ where }), db.appointment.findMany({ where, include: { vehicle: true, service: true }, orderBy: { [query.sort && ["startsAt", "createdAt"].includes(query.sort) ? query.sort : "startsAt"]: direction }, skip: (page - 1) * pageSize, take: pageSize })]); return { items, pagination: pagination(total) }; }
  if (resource === "invoices") { const where = { ...base, ...(query.status && ["DRAFT", "PENDING_APPROVAL", "UNPAID", "PARTIALLY_PAID", "PAID", "CANCELLED"].includes(query.status) ? { status: query.status as "DRAFT" } : {}), ...(query.search ? { code: { contains: query.search } } : {}) }; const [total, items] = await Promise.all([db.invoice.count({ where }), db.invoice.findMany({ where, include: { vehicle: true, payments: true }, orderBy: { [query.sort && ["issuedAt", "total", "createdAt"].includes(query.sort) ? query.sort : "issuedAt"]: direction }, skip: (page - 1) * pageSize, take: pageSize })]); return { items, pagination: pagination(total) }; }
  if (resource === "repairs") { const where = { ...base, ...(query.status && ["INTAKE", "WAITING_APPROVAL", "WAITING_PARTS", "REPAIRING", "QUALITY_CHECK", "READY_FOR_PICKUP", "COMPLETED", "CANCELLED"].includes(query.status) ? { status: query.status as "INTAKE" } : {}), ...(query.search ? { OR: [{ code: { contains: query.search } }, { vehicle: { is: { plate: { contains: query.search } } } }] } : {}) }; const [total, items] = await Promise.all([db.repairOrder.count({ where }), db.repairOrder.findMany({ where, include: { vehicle: true, lines: { orderBy: { sortOrder: "asc" } } }, orderBy: { [query.sort && ["createdAt", "scheduledAt", "status"].includes(query.sort) ? query.sort : "createdAt"]: direction }, skip: (page - 1) * pageSize, take: pageSize })]); return { items, pagination: pagination(total) }; }
  throw new ResourceError("Tài nguyên không tồn tại.", 404);
}
const vehicleSchema = z.object({ plate: z.string().trim().min(5).max(30), name: z.string().trim().min(2).max(255), vin: z.preprocess((value) => value === "" ? undefined : value, z.string().trim().max(100).optional()), odometerKm: z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().int().min(0).optional()), warranty: z.preprocess((value) => value === "" ? undefined : value, z.string().trim().max(255).optional()) });
const appointmentSchema = z.object({ vehicleId: z.string().min(1), serviceId: z.string().min(1), startsAt: z.coerce.date(), notes: z.string().max(5000).optional() });
const profileSchema = z.object({ name: z.string().trim().min(2), phone: z.string().trim().min(9), address: z.string().trim().max(255).optional() });
export async function createMine(resource: string, body: unknown) {
  const user = await requireCustomer();
  const db = getPrisma();
  if (resource === "vehicles") return db.vehicle.create({ data: { ...vehicleSchema.parse(body), customerId: user.customerId! } });
  if (resource === "appointments") {
    const data = appointmentSchema.parse(body);
    const vehicle = await db.vehicle.findFirst({ where: { id: data.vehicleId, customerId: user.customerId!, deletedAt: null } });
    if (!vehicle) throw new ResourceError("Không tìm thấy xe của bạn.", 400);
    const service = await db.service.findFirst({ where: { id: data.serviceId, status: "ACTIVE", deletedAt: null } });
    if (!service) throw new ResourceError("Dịch vụ không khả dụng.", 400);
    return withGeneratedCode("appointments", (code) => reserveAppointment(data, undefined, (tx, endsAt) => tx.appointment.create({
      data: {
        ...data,
        endsAt,
        code,
        customerId: user.customerId!,
      },
    })));
  }
  throw new ResourceError("Tài nguyên không hỗ trợ tạo mới.", 404);
}

export async function updateMine(resource: string, id: string, body: unknown) {
  const user = await requireCustomer();
  const db = getPrisma();
  if (resource === "profile") return db.customer.update({ where: { id: user.customerId! }, data: profileSchema.parse(body) });
  if (resource === "vehicles") {
    const row = await db.vehicle.findFirst({ where: { id, customerId: user.customerId!, deletedAt: null } });
    if (!row) throw new ResourceError("Không tìm thấy xe.", 404);
    return db.vehicle.update({ where: { id }, data: vehicleSchema.partial().parse(body) });
  }
  if (resource === "appointments") {
    const row = await db.appointment.findFirst({ where: { id, customerId: user.customerId!, deletedAt: null } });
    if (!row) throw new ResourceError("Không tìm thấy lịch hẹn.", 404);
    if (row.status !== "PENDING") throw new ResourceError("Chỉ sửa được lịch hẹn đang chờ xác nhận.", 400);
    const data = appointmentSchema.partial().parse(body);
    if (data.vehicleId) {
      const vehicle = await db.vehicle.findFirst({ where: { id: data.vehicleId, customerId: user.customerId!, deletedAt: null } });
      if (!vehicle) throw new ResourceError("Không tìm thấy xe của bạn.", 400);
    }
    if (data.serviceId) {
      const service = await db.service.findFirst({ where: { id: data.serviceId, status: "ACTIVE", deletedAt: null } });
      if (!service) throw new ResourceError("Dịch vụ không khả dụng.", 400);
    }
    const scheduleChanged = (data.startsAt !== undefined && data.startsAt.getTime() !== row.startsAt.getTime())
      || (data.serviceId !== undefined && data.serviceId !== row.serviceId);
    if (scheduleChanged) {
      return reserveAppointment({ startsAt: data.startsAt ?? row.startsAt, serviceId: data.serviceId ?? row.serviceId }, id,
        (tx, endsAt) => tx.appointment.update({ where: { id }, data: { ...data, endsAt } }));
    }
    return db.appointment.update({ where: { id }, data });
  }
  throw new ResourceError("Tài nguyên không hỗ trợ cập nhật.", 404);
}
export async function deleteMine(resource: string, id: string) { const user = await requireCustomer(); const db = getPrisma(); if (resource === "vehicles") { const row = await db.vehicle.findFirst({ where: { id, customerId: user.customerId!, deletedAt: null } }); if (!row) throw new ResourceError("Không tìm thấy xe.", 404); return db.vehicle.update({ where: { id }, data: { deletedAt: new Date() } }); } if (resource === "appointments") { const row = await db.appointment.findFirst({ where: { id, customerId: user.customerId!, deletedAt: null } }); if (!row) throw new ResourceError("Không tìm thấy lịch hẹn.", 404); if (row.status !== "PENDING") throw new ResourceError("Chỉ hủy được lịch hẹn đang chờ xác nhận.", 400); return db.appointment.update({ where: { id }, data: { status: "CANCELLED" } }); } throw new ResourceError("Tài nguyên không hỗ trợ xóa.", 404); }
