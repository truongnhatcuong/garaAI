import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { z, ZodError } from "zod";
import { getPrisma } from "@/server/db";
import { hashPassword, requireAdmin } from "@/server/services/auth";
import { resourceConfig, type ResourceKey } from "@/lib/resource-config";
import { generatedCodeConfig } from "@/lib/generated-code-config";
import { withGeneratedCode } from "@/server/services/generated-code";
import { parseListQuery, resourceInputSchema, type ListQuery } from "@/server/validation/resources";
import { ImageInputError, processImageDeletionJobs } from "@/server/services/image-service";
import { AppointmentBookingError, isActiveAppointmentStatus, reserveAppointment } from "@/server/services/appointment-booking";
import { syncTodayReport } from "@/server/services/financial-report";
import { bayStatus } from "@/lib/bay-status";

type Row = Record<string, unknown>;
type CrudDelegate = {
  findMany(args: object): Promise<Row[]>;
  findFirst(args: object): Promise<Row | null>;
  count(args: object): Promise<number>;
  create(args: object): Promise<Row>;
  update(args: object): Promise<Row>;
};
export class ResourceError extends Error { constructor(message: string, public status: number) { super(message); } }
const closedRepairStatuses = ["COMPLETED", "CANCELLED"] as const;
function repairIsActive(status: unknown) { return !closedRepairStatuses.includes(status as typeof closedRepairStatuses[number]); }
const bayHoldingStatuses = ["INTAKE", "WAITING_APPROVAL", "WAITING_PARTS", "REPAIRING"] as const;
function repairHoldsBay(status: unknown) { return bayHoldingStatuses.includes(status as typeof bayHoldingStatuses[number]); }
type RepairAssignment = { id?: string; bayCode?: unknown; vehicleId?: unknown; technicianId?: unknown; status?: unknown; updatedAt?: unknown };
export async function claimRepairBay(tx: Prisma.TransactionClient, order: RepairAssignment) {
  const code = String(order.bayCode);
  const other = await tx.repairOrder.findFirst({ where: { bayCode: code, deletedAt: null, status: { in: [...bayHoldingStatuses] }, ...(order.id ? { id: { not: order.id } } : {}) }, select: { code: true } });
  if (other) throw new ResourceError(`Khoang này đang gắn với phiếu ${other.code}.`, 409);
  const claimed = await tx.workshopBay.updateMany({
    where: { code, vehicleId: null, deletedAt: null },
    data: { vehicleId: String(order.vehicleId), employeeId: String(order.technicianId), statusText: bayStatus.inProgress, progressNote: null, reportedAt: null },
  });
  if (!claimed.count) throw new ResourceError(`Khoang ${code} không còn trống. Vui lòng chọn khoang khác.`, 409);
}
async function releaseRepairBay(tx: Prisma.TransactionClient, order: RepairAssignment) {
  if (!order.bayCode || !order.vehicleId) return;
  await tx.workshopBay.updateMany({
    where: { code: String(order.bayCode), vehicleId: String(order.vehicleId), employeeId: order.technicianId ? String(order.technicianId) : null, deletedAt: null },
    data: { vehicleId: null, employeeId: null, statusText: "Trống", progressNote: null, reportedAt: null },
  });
}
const relations: Partial<Record<ResourceKey, object>> = {
  vehicles: { customer: true },
  appointments: { customer: true, vehicle: true, service: true, repairOrder: { select: { id: true, code: true, deletedAt: true } } },
  "repair-orders": { customer: true, vehicle: true, advisor: true, technician: true },
  invoices: { customer: true, vehicle: true, repairOrder: true, payments: { where: { status: "COMPLETED", deletedAt: null }, orderBy: { paidAt: "desc" }, take: 1 } },
  payments: { invoice: true },
  notifications: { employee: true },
  bays: { vehicle: true, employee: true },
};
function delegate(resource: ResourceKey): CrudDelegate {
  const db = getPrisma();
  const models = { customers: db.customer, vehicles: db.vehicle, appointments: db.appointment, services: db.service, employees: db.employee, parts: db.part, "repair-orders": db.repairOrder, invoices: db.invoice, payments: db.payment, notifications: db.notification, bays: db.workshopBay, reports: db.report };
  return models[resource] as unknown as CrudDelegate;
}
function searchFilter(path: string, search: string): Row {
  const [field, ...rest] = path.split(".");
  if (!rest.length) return { [field]: { contains: search } };
  return { [field]: { is: searchFilter(rest.join("."), search) } };
}
function listWhere(resource: ResourceKey, query: ListQuery): Row {
  const config = resourceConfig[resource];
  const where: Row = { deletedAt: null };
  if (query.search && config.searchFields.length) where.OR = config.searchFields.map((field) => searchFilter(field, query.search));
  if (query.status && config.statusOptions) {
    if (!config.statusOptions.some((option) => option.value === query.status)) throw new ResourceError("Trạng thái lọc không hợp lệ.", 400);
    where.status = query.status;
  }
  if (query.from || query.to) {
    if (!config.dateField) throw new ResourceError("Tài nguyên này không hỗ trợ lọc ngày.", 400);
    where[config.dateField] = { ...(query.from ? { gte: query.from } : {}), ...(query.to ? { lt: new Date(query.to.getTime() + 86400000) } : {}) };
  }
  if (resource === "parts" && query.stock === "low") where.stockQty = { lte: getPrisma().part.fields.minStock };
  return where;
}
function orderBy(resource: ResourceKey, query: ListQuery): Row {
  const config = resourceConfig[resource];
  const field = query.sort && config.sortFields.includes(query.sort) ? query.sort : config.defaultSort;
  return { [field]: query.direction };
}
async function withCustomerRepairCounts(resource: ResourceKey, rows: Row[]): Promise<Row[]> {
  if (resource !== "customers" || !rows.length) return rows;
  const ids = rows.map((row) => String(row.id));
  const counts = await getPrisma().repairOrder.groupBy({
    by: ["customerId"],
    where: { customerId: { in: ids }, status: "COMPLETED", deletedAt: null },
    _count: { _all: true },
  });
  const byCustomer = new Map(counts.map((item) => [item.customerId, item._count._all]));
  return rows.map((row) => ({ ...row, repairCount: byCustomer.get(String(row.id)) ?? 0 }));
}
function withInvoicePaymentSummary(resource: ResourceKey, rows: Row[]): Row[] {
  if (resource !== "invoices") return rows;
  const methods: Record<string, string> = { CASH: "Tiền mặt", BANK_TRANSFER: "Chuyển khoản", CARD: "Thẻ", OTHER: "Khác" };
  return rows.map((row) => {
    const latest = (row.payments as Row[] | undefined)?.[0];
    return { ...row, paymentMethodLabel: latest ? methods[String(latest.method)] ?? String(latest.method) : null, latestPaidAt: latest?.paidAt ?? null };
  });
}
export async function listResource(resource: ResourceKey, query: ListQuery) {
  await requireAdmin();
  if (resource === "reports") await syncTodayReport();
  if (resource === "repair-orders") await processImageDeletionJobs().catch((error: unknown) => console.error("Image cleanup retry failed", error));
  const model = delegate(resource);
  const where = listWhere(resource, query);
  const total = await model.count({ where });
  const items = await model.findMany({ where, orderBy: orderBy(resource, query), skip: (query.page - 1) * query.pageSize, take: query.pageSize, ...(relations[resource] ? { include: relations[resource] } : {}) });
  return { items: await withCustomerRepairCounts(resource, withInvoicePaymentSummary(resource, items)), pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) } };
}
export async function listForExport(resource: ResourceKey, params: URLSearchParams) {
  await requireAdmin();
  if (resource === "reports") await syncTodayReport();
  const parsed = parseListQuery(params);
  const model = delegate(resource);
  const where = listWhere(resource, parsed);
  const items: Row[] = [];
  for (let skip = 0; ; skip += 500) {
    const batch = await model.findMany({ where, orderBy: orderBy(resource, parsed), skip, take: 500, ...(relations[resource] ? { include: relations[resource] } : {}) });
    items.push(...await withCustomerRepairCounts(resource, withInvoicePaymentSummary(resource, batch)));
    if (batch.length < 500) break;
  }
  return items;
}
export async function getResource(resource: ResourceKey, id: string) {
  await requireAdmin();
  const row = await delegate(resource).findFirst({ where: { id, deletedAt: null }, ...(relations[resource] ? { include: relations[resource] } : {}) });
  if (!row) throw new ResourceError("Không tìm thấy bản ghi.", 404);
  return (await withCustomerRepairCounts(resource, [row]))[0];
}
async function validateLinks(resource: ResourceKey, data: Row, existing?: Row) {
  const db = getPrisma();
  for (const field of resourceConfig[resource].fields) {
    if (!field.relation || typeof data[field.name] !== "string") continue;
    const linked = await delegate(field.relation).findFirst({ where: { id: data[field.name], deletedAt: null } });
    if (!linked) throw new ResourceError(`${field.label} không tồn tại hoặc đã bị xóa.`, 400);
  }
  if (resource === "appointments" || resource === "repair-orders" || resource === "invoices") {
    if (typeof data.customerId === "string" && typeof data.vehicleId === "string") {
      const vehicle = await db.vehicle.findFirst({ where: { id: data.vehicleId, deletedAt: null } });
      if (!vehicle || (vehicle.customerId && vehicle.customerId !== data.customerId)) throw new ResourceError("Phương tiện không thuộc khách hàng đã chọn.", 400);
    }
  }
  if (resource === "payments" && typeof data.invoiceId === "string") {
    const invoice = await db.invoice.findFirst({ where: { id: data.invoiceId, deletedAt: null } });
    if (!invoice) throw new ResourceError("Hóa đơn không tồn tại.", 400);
  }
  if (resource === "repair-orders" && typeof data.bayCode === "string" && data.bayCode) {
    const bay = await db.workshopBay.findFirst({
      where: { code: data.bayCode, deletedAt: null },
      select: { vehicleId: true, vehicle: { select: { plate: true } } },
    });
    const active = repairHoldsBay(data.status ?? "INTAKE");
    const assignmentChanged = !existing || data.bayCode !== existing.bayCode || data.vehicleId !== existing.vehicleId || !repairHoldsBay(existing.status);
    if (!bay && (active || assignmentChanged)) throw new ResourceError("Khoang đã chọn không tồn tại. Vui lòng chọn khoang trong danh sách.", 400);
    if (bay && active && assignmentChanged) {
      if (bay.vehicleId) throw new ResourceError(`Khoang này đang có xe ${bay.vehicle?.plate ?? "khác"}. Vui lòng chọn khoang trống.`, 409);
      const otherOrder = await db.repairOrder.findFirst({
        where: { bayCode: data.bayCode, deletedAt: null, status: { in: [...bayHoldingStatuses] }, ...(existing ? { id: { not: String(existing.id) } } : {}) },
        select: { code: true },
      });
      if (otherOrder) throw new ResourceError(`Khoang này đang gắn với phiếu ${otherOrder.code}.`, 409);
    }
    if (active && !data.technicianId) throw new ResourceError("Vui lòng chọn kỹ thuật viên trước khi phân khoang.", 400);
  }
}

function withoutGeneratedCode(resource: ResourceKey, body: unknown): unknown {
  const field = generatedCodeConfig[resource]?.field;
  if (!field || !body || typeof body !== "object" || Array.isArray(body)) return body;
  const input = { ...body } as Row;
  delete input[field];
  return input;
}
const employeePasswordSchema = z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự.").max(128, "Mật khẩu tối đa 128 ký tự.");
function employeeCredentials(resource: ResourceKey, body: unknown, create: boolean) {
  if (resource !== "employees") return { input: body, password: "" };
  const input = (create
    ? z.object({ password: employeePasswordSchema }).passthrough()
    : z.object({ password: z.union([z.literal(""), employeePasswordSchema]).optional() }).passthrough()
  ).parse(body);
  const password = input.password ?? "";
  const employeeInput = { ...input };
  delete employeeInput.password;
  return { input: employeeInput, password };
}
export async function createResource(resource: ResourceKey, body: unknown) {
  await requireAdmin();
  if (resource === "reports") throw new ResourceError("Báo cáo được tính tự động từ thanh toán và chi phí.", 405);
  if (resource === "invoices") throw new ResourceError("Hãy xuất hóa đơn từ phiếu sửa chữa đã hoàn tất.", 405);
  if (resource === "payments") throw new ResourceError("Hãy ghi nhận thanh toán trong trang chi tiết hóa đơn.", 405);
  const { input, password } = employeeCredentials(resource, withoutGeneratedCode(resource, body), true);
  const data = resourceInputSchema(resource).parse(input) as Row;
  await validateLinks(resource, data);
  if (resource === "bays") {
    if (data.vehicleId && !data.employeeId) throw new ResourceError("Vui lòng chọn kỹ thuật viên khi phân xe vào khoang.", 400);
    data.statusText = data.vehicleId ? bayStatus.assigned : "Trống";
    data.progressNote = null;
    data.reportedAt = null;
  }
  if (resource === "employees") {
    data.email = String(data.email).toLowerCase();
    return withGeneratedCode(resource, (code) => getPrisma().$transaction(async (tx) => {
      const employee = await tx.employee.create({ data: { ...data, code } as Prisma.EmployeeUncheckedCreateInput });
      await tx.userAccount.create({ data: { employeeId: employee.id, name: employee.name, email: String(data.email), passwordHash: hashPassword(password), role: "EMPLOYEE" } });
      return employee;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted }));
  }
  if (resource === "repair-orders") {
    if (data.bayCode && repairIsActive(data.status ?? "INTAKE")) data.status = "REPAIRING";
    return withGeneratedCode(resource, (code) => getPrisma().$transaction(async (tx) => {
      data.code = code;
      if (data.bayCode && repairIsActive(data.status ?? "INTAKE")) await claimRepairBay(tx, data);
      return tx.repairOrder.create({ data: data as Prisma.RepairOrderUncheckedCreateInput });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted }));
  }
  const write = () => {
    if (resource === "appointments") {
      const appointment = data as { startsAt: Date; endsAt?: Date | null; serviceId?: string | null; status?: string };
      if (isActiveAppointmentStatus(appointment.status)) {
        return reserveAppointment(appointment, undefined, (tx, endsAt) => tx.appointment.create({ data: { ...data, endsAt } as Prisma.AppointmentUncheckedCreateInput }));
      }
    }
    return delegate(resource).create({ data });
  };
  const generated = generatedCodeConfig[resource];
  return generated ? withGeneratedCode(resource, (code) => {
    data[generated.field] = code;
    return write();
  }) : write();
}
export async function updateResource(resource: ResourceKey, id: string, body: unknown) {
  await requireAdmin();
  if (resource === "reports") throw new ResourceError("Báo cáo được tính tự động từ thanh toán và chi phí.", 405);
  if (resource === "invoices" || resource === "payments") throw new ResourceError("Hãy quản lý chứng từ và thanh toán trong trang chi tiết hóa đơn.", 405);
  const existing = await getResource(resource, id);
  const { input, password } = employeeCredentials(resource, withoutGeneratedCode(resource, body), false);
  const data = resourceInputSchema(resource, true).parse(input) as Row;
  if (!Object.keys(data).length) throw new ResourceError("Không có dữ liệu cần cập nhật.", 400);
  if (resource === "appointments" && existing.repairOrder && Object.entries(data).some(([field, value]) => field !== "notes" && (value instanceof Date && existing[field] instanceof Date ? value.getTime() !== (existing[field] as Date).getTime() : String(value ?? "") !== String(existing[field] ?? "")))) throw new ResourceError("Lịch hẹn đã có phiếu sửa chữa. Hãy cập nhật công việc trên phiếu.", 409);
  await validateLinks(resource, { ...existing, ...data }, existing);
  if (resource === "repair-orders") {
    const issuedInvoice = await getPrisma().invoice.findFirst({ where: { repairOrderId: id, deletedAt: null, status: { not: "CANCELLED" } }, select: { code: true } });
    if (issuedInvoice) throw new ResourceError(`Phiếu đã xuất hóa đơn ${issuedInvoice.code}, không thể thay đổi.`, 409);
    const next = { ...existing, ...data };
    if (existing.appointmentId && (next.customerId !== existing.customerId || next.vehicleId !== existing.vehicleId)) throw new ResourceError("Phiếu đã liên kết lịch hẹn, không thể đổi khách hàng hoặc xe.", 409);
    if (!repairIsActive(existing.status) && data.status && data.status !== existing.status) throw new ResourceError("Phiếu đã đóng. Lần đến tiếp theo cần lịch hẹn hoặc phiếu mới.", 409);
    const oldActive = repairHoldsBay(existing.status);
    const nextActive = repairHoldsBay(next.status);
    const moving = existing.bayCode !== next.bayCode || existing.vehicleId !== next.vehicleId;
    const claim = Boolean(nextActive && next.bayCode && (moving || !oldActive));
    const release = Boolean(oldActive && existing.bayCode && (moving || !nextActive));
    if (nextActive && next.bayCode && !next.technicianId) throw new ResourceError("Vui lòng chọn kỹ thuật viên trước khi phân khoang.", 400);
    if (claim) data.status = "REPAIRING";
    if (data.status === "READY_FOR_PICKUP" && existing.status !== "QUALITY_CHECK" && existing.status !== "READY_FOR_PICKUP") throw new ResourceError("Phiếu cần qua bước kiểm định trước khi sẵn sàng bàn giao.", 409);
    if (data.status === "COMPLETED" && existing.status !== "READY_FOR_PICKUP" && existing.status !== "COMPLETED") throw new ResourceError("Hãy kiểm định và chuyển phiếu sang Sẵn sàng bàn giao trước khi hoàn tất.", 409);
    return getPrisma().$transaction(async (tx) => {
      if (claim) await claimRepairBay(tx, { ...next, id });
      const changed = await tx.repairOrder.updateMany({ where: { id, updatedAt: existing.updatedAt as Date, deletedAt: null }, data: data as Prisma.RepairOrderUncheckedUpdateManyInput });
      if (!changed.count) throw new ResourceError("Phiếu đã được cập nhật ở nơi khác. Vui lòng tải lại trang.", 409);
      if (release) await releaseRepairBay(tx, existing);
      if (!claim && nextActive && next.bayCode && existing.technicianId !== next.technicianId) {
        const reassigned = await tx.workshopBay.updateMany({ where: { code: String(next.bayCode), vehicleId: String(next.vehicleId), employeeId: existing.technicianId ? String(existing.technicianId) : null, deletedAt: null }, data: { employeeId: String(next.technicianId), statusText: bayStatus.inProgress } });
        if (!reassigned.count) throw new ResourceError("Khoang đã thay đổi. Vui lòng tải lại trang.", 409);
      }
      if (data.status === "COMPLETED" && existing.appointmentId) await tx.appointment.updateMany({ where: { id: String(existing.appointmentId), deletedAt: null }, data: { status: "COMPLETED" } });
      if (data.status === "CANCELLED" && existing.appointmentId) await tx.appointment.updateMany({ where: { id: String(existing.appointmentId), deletedAt: null }, data: { status: "CANCELLED" } });
      return tx.repairOrder.findUniqueOrThrow({ where: { id } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
  }
  if (resource === "bays") {
    delete data.statusText;
    delete data.progressNote;
    delete data.reportedAt;
    let employeeId = data.employeeId === undefined ? existing.employeeId : data.employeeId;
    const vehicleId = data.vehicleId === undefined ? existing.vehicleId : data.vehicleId;
    if (vehicleId && !employeeId) throw new ResourceError("Vui lòng chọn kỹ thuật viên khi phân xe vào khoang.", 400);
    if (!vehicleId && employeeId) { data.employeeId = null; employeeId = null; }
    if (employeeId !== existing.employeeId || vehicleId !== existing.vehicleId) {
      const activeOrder = await getPrisma().repairOrder.findFirst({ where: { bayCode: String(existing.code), deletedAt: null, status: { in: [...bayHoldingStatuses] } }, select: { code: true } });
      if (activeOrder) throw new ResourceError(`Khoang đang được dùng trong phiếu ${activeOrder.code}. Hãy sửa phân công trên phiếu sửa chữa.`, 409);
      data.statusText = vehicleId ? bayStatus.assigned : "Trống";
      data.progressNote = null;
      data.reportedAt = null;
    }
  }
  if (resource === "employees") {
    const db = getPrisma();
    const employee = await db.employee.findUnique({ where: { id }, include: { account: { select: { id: true } } } });
    if (!employee || employee.deletedAt) throw new ResourceError("Không tìm thấy nhân viên.", 404);
    if (!employee.account && !password) throw new ResourceError("Nhân viên chưa có tài khoản. Vui lòng đặt mật khẩu ban đầu.", 400);
    const name = String(data.name ?? employee.name);
    const email = String(data.email ?? employee.email ?? "").toLowerCase();
    if (!email) throw new ResourceError("Vui lòng nhập email đăng nhập.", 400);
    data.email = email;
    return db.$transaction(async (tx) => {
      const updated = await tx.employee.update({ where: { id }, data: data as Prisma.EmployeeUncheckedUpdateInput });
      if (employee.account) {
        await tx.userAccount.update({ where: { id: employee.account.id }, data: { name, email, ...(password ? { passwordHash: hashPassword(password) } : {}) } });
        if (password) await tx.session.deleteMany({ where: { userId: employee.account.id } });
      } else {
        await tx.userAccount.create({ data: { employeeId: id, name, email, passwordHash: hashPassword(password), role: "EMPLOYEE" } });
      }
      return updated;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
  }
  if (resource === "appointments") {
    const appointment = { ...existing, ...data } as { startsAt: Date; endsAt?: Date | null; serviceId?: string | null; status?: string };
    const existingAppointment = existing as { startsAt: Date; endsAt?: Date | null; serviceId?: string | null; status?: string };
    const scheduleChanged = appointment.startsAt.getTime() !== existingAppointment.startsAt.getTime()
      || (appointment.endsAt?.getTime() ?? null) !== (existingAppointment.endsAt?.getTime() ?? null)
      || appointment.serviceId !== existingAppointment.serviceId;
    const reactivated = !isActiveAppointmentStatus(String(existing.status)) && isActiveAppointmentStatus(appointment.status);
    if (isActiveAppointmentStatus(appointment.status) && (scheduleChanged || reactivated)) {
      return reserveAppointment(appointment, id, (tx, endsAt) => tx.appointment.update({ where: { id }, data: { ...data, endsAt } as Prisma.AppointmentUncheckedUpdateInput }));
    }
  }
  return delegate(resource).update({ where: { id }, data });
}
export async function deleteResource(resource: ResourceKey, id: string) {
  await requireAdmin();
  if (resource === "reports") throw new ResourceError("Báo cáo được tính tự động từ thanh toán và chi phí.", 405);
  if (resource === "invoices" || resource === "payments") throw new ResourceError("Không thể xóa chứng từ tài chính khỏi lịch sử.", 405);
  const existing = await getResource(resource, id);
  if (resource === "appointments" && existing.repairOrder) throw new ResourceError("Lịch hẹn đã có phiếu sửa chữa, không thể xóa liên kết này.", 409);
  if (resource === "bays") {
    const activeOrder = await getPrisma().repairOrder.findFirst({
      where: { bayCode: String(existing.code), deletedAt: null, status: { in: [...bayHoldingStatuses] } },
      select: { code: true },
    });
    if (activeOrder) throw new ResourceError(`Khoang đang được dùng trong phiếu ${activeOrder.code}. Hãy chuyển phiếu sang khoang khác trước khi xóa.`, 409);
  }
  if (resource === "repair-orders") {
    const db = getPrisma();
    const issuedInvoice = await db.invoice.findFirst({ where: { repairOrderId: id, deletedAt: null, status: { not: "CANCELLED" } }, select: { code: true } });
    if (issuedInvoice) throw new ResourceError(`Phiếu đã xuất hóa đơn ${issuedInvoice.code}, không thể xóa.`, 409);
    const { result, keys } = await db.$transaction(async (tx) => {
      const evidence = await tx.repairEvidence.findMany({ where: { repairOrderId: id, imageUploadKey: { not: null } }, select: { imageUploadKey: true } });
      const keys = evidence.flatMap((item) => item.imageUploadKey ? [item.imageUploadKey] : []);
      if (keys.length) await tx.imageDeletionJob.createMany({ data: keys.map((key) => ({ key })), skipDuplicates: true });
      const result = await tx.repairOrder.update({ where: { id }, data: { deletedAt: new Date() } });
      if (repairHoldsBay(existing.status)) await releaseRepairBay(tx, existing);
      if (existing.appointmentId && repairIsActive(existing.status)) await tx.appointment.updateMany({ where: { id: String(existing.appointmentId), deletedAt: null }, data: { status: "CANCELLED" } });
      return { result, keys };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
    await processImageDeletionJobs(keys).catch((error: unknown) => console.error("Image cleanup failed", error));
    return result;
  }
  return delegate(resource).update({ where: { id }, data: { deletedAt: new Date() } });
}
export function apiError(error: unknown): { status: number; message: string; details?: unknown } {
  if (error instanceof Error && error.message === "UNAUTHORIZED") return { status: 401, message: "Vui lòng đăng nhập tài khoản quản trị." };
  if (error instanceof ResourceError) return { status: error.status, message: error.message };
  if (error instanceof AppointmentBookingError) return { status: error.status, message: error.message };
  if (error instanceof ImageInputError) return { status: 400, message: error.message };
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return { status: 409, message: "Giá trị đã tồn tại (mã, biển số, email hoặc số điện thoại)." };
    if (error.code === "P2003") return { status: 400, message: "Bản ghi liên quan không tồn tại hoặc không thể thay đổi." };
    if (error.code === "P2034") return { status: 409, message: "Dữ liệu đã thay đổi trong lúc thao tác. Vui lòng thử lại." };
  }
  if (error instanceof ZodError) return { status: 400, message: "Dữ liệu không hợp lệ.", details: error.issues };
  if (error instanceof Error && error.message.includes("DATABASE_URL")) return { status: 503, message: error.message };
  if (error instanceof Error && error.message.includes("UPLOADTHING_TOKEN")) return { status: 503, message: error.message };
  console.error("Resource request failed", error);
  return { status: 500, message: "Không thể xử lý yêu cầu. Vui lòng thử lại." };
}
