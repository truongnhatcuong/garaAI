import "dotenv/config";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { createDatabaseAdapter } from "../src/server/database-adapter";

const db = new PrismaClient({ adapter: createDatabaseAdapter(process.env.DATABASE_URL!) });
const tag = randomUUID().slice(0, 8);
const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const ids = { admin: "", employee: "", customer: "", vehicle: "", service: "", part: "", appointments: [] as string[], orders: [] as string[], invoices: [] as string[], accounts: [] as string[], sessions: [] as string[] };
const bayCodes = [`TEST-${tag}-1`, `TEST-${tag}-2`];

function check(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }
async function request(path: string, method: string, token: string, body?: object) {
  const response = await fetch(`${base}${path}`, { method, headers: { Cookie: `autocare_session=${token}`, ...(body ? { "Content-Type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: response.status, data: await response.json() as Record<string, unknown> };
}
async function session(userId: string) {
  const token = randomBytes(32).toString("hex");
  ids.sessions.push(createHash("sha256").update(token).digest("hex"));
  await db.session.create({ data: { userId, tokenHash: ids.sessions.at(-1)!, expiresAt: new Date(Date.now() + 3600000) } });
  return token;
}

async function main() {
  try {
    const admin = await db.userAccount.create({ data: { email: `test-admin-${tag}@example.test`, passwordHash: "temporary", role: "ADMIN" } });
    ids.admin = admin.id; ids.accounts.push(admin.id);
    const employee = await db.employee.create({ data: { code: `TEST-${tag}`, name: "KTV kiểm thử", email: `test-employee-${tag}@example.test` } });
    ids.employee = employee.id;
    const employeeAccount = await db.userAccount.create({ data: { email: employee.email!, passwordHash: "temporary", role: "EMPLOYEE", employeeId: employee.id } });
    ids.accounts.push(employeeAccount.id);
    const customer = await db.customer.create({ data: { name: "Khách kiểm thử" } });
    ids.customer = customer.id;
    const vehicle = await db.vehicle.create({ data: { plate: `TEST-${tag}`, name: "Xe kiểm thử", customerId: customer.id } });
    ids.vehicle = vehicle.id;
    const service = await db.service.create({ data: { code: `TEST-${tag}`, title: "Dịch vụ kiểm thử", price: 100000, durationMinutes: 60 } });
    ids.service = service.id;
    const part = await db.part.create({ data: { sku: `TEST-${tag}`, name: "Phụ tùng kiểm thử", price: 50000, cost: 30000, stockQty: 10 } });
    ids.part = part.id;
    await db.workshopBay.createMany({ data: bayCodes.map((code) => ({ code, statusText: "Trống" })) });
    const appointment = await db.appointment.create({ data: { code: `TEST-${tag}-A`, customerId: customer.id, vehicleId: vehicle.id, serviceId: service.id, startsAt: new Date(Date.now() + 86400000), status: "ARRIVED" } });
    ids.appointments.push(appointment.id);
    const adminToken = await session(admin.id);
    const employeeToken = await session(employeeAccount.id);
    const taxSettings = await db.invoiceSettings.findUniqueOrThrow({ where: { id: 1 } });
    const taxInput = { taxPercent: taxSettings.taxPercent.toNumber() };
    check((await request("/api/admin/invoice-settings", "PATCH", employeeToken, taxInput)).status === 401, "KTV thay đổi được mức thuế");
    check((await request("/api/admin/invoice-settings", "PATCH", adminToken, { taxPercent: 101 })).status === 400, "Chấp nhận mức thuế vượt 100%");
    check((await request("/api/admin/invoice-settings", "PATCH", adminToken, taxInput)).status === 200, "Không lưu được cài đặt thuế");
    const input = { appointmentId: appointment.id, customerId: customer.id, vehicleId: vehicle.id, technicianId: employee.id, bayCode: bayCodes[0], laborCost: 200000, lines: [{ type: "SERVICE", catalogId: service.id, quantity: 1 }, { type: "PART", catalogId: part.id, quantity: 1 }] };
    const created = await request("/api/admin/repair-intake", "POST", adminToken, input);
    check(created.status === 201, `Tiếp nhận lịch: ${created.status} ${JSON.stringify(created.data)}`);
    ids.orders.push(String(created.data.id));
    const firstOrder = await db.repairOrder.findUniqueOrThrow({ where: { id: ids.orders[0] }, include: { lines: true } });
    check(firstOrder.status === "REPAIRING" && firstOrder.appointmentId === appointment.id && firstOrder.lines.length === 2 && Number(firstOrder.estimateTotal) === 350000, "Phiếu hoặc dịch vụ, phụ tùng, tiền công không được lưu đúng");
    check((await db.workshopBay.findUniqueOrThrow({ where: { code: bayCodes[0] } })).vehicleId === vehicle.id, "Khoang chưa được giữ");
    check((await request("/api/admin/repair-intake", "POST", adminToken, input)).status === 409, "Một lịch hẹn tạo được hai phiếu");
    const changedLines = await request(`/api/admin/repair-orders/${firstOrder.id}/lines`, "PATCH", adminToken, { laborCost: 250000, lines: [{ id: firstOrder.lines.find((line) => line.type === "SERVICE")!.id, quantity: 2 }, { type: "PART", catalogId: part.id, quantity: 3 }] });
    check(changedLines.status === 200, `Sửa hạng mục: ${changedLines.status} ${JSON.stringify(changedLines.data)}`);
    check(Number((await db.repairOrder.findUniqueOrThrow({ where: { id: firstOrder.id } })).estimateTotal) === 600000, "Tổng chi phí không khớp dịch vụ + phụ tùng + công");
    const restorePath = `/api/admin/repair-orders/${firstOrder.id}/restore`;
    check((await request(restorePath, "POST", employeeToken)).status === 401, "KTV khôi phục được phiếu dành cho quản trị");
    check((await request(restorePath, "POST", adminToken)).status === 409, "Khôi phục được phiếu chưa hủy");
    check((await request(`/api/repair-orders/${firstOrder.id}`, "PATCH", adminToken, { status: "CANCELLED" })).status === 200, "Không hủy được phiếu");
    const conflicting = await db.repairOrder.create({ data: { code: `TEST-${tag}-CONFLICT`, customerId: customer.id, vehicleId: vehicle.id } });
    ids.orders.push(conflicting.id);
    check((await request(restorePath, "POST", adminToken)).status === 409, "Khôi phục trùng phiếu đang xử lý của xe");
    check((await db.repairOrder.findUniqueOrThrow({ where: { id: firstOrder.id } })).status === "CANCELLED", "Khôi phục thất bại vẫn thay đổi phiếu");
    await db.repairOrder.update({ where: { id: conflicting.id }, data: { status: "CANCELLED" } });
    const restored = await request(restorePath, "POST", adminToken);
    check(restored.status === 200, `Khôi phục phiếu: ${restored.status} ${JSON.stringify(restored.data)}`);
    const reopened = await db.repairOrder.findUniqueOrThrow({ where: { id: firstOrder.id }, include: { lines: true } });
    check(reopened.status === "INTAKE" && reopened.bayCode === null && reopened.lines.length === 2 && Number(reopened.estimateTotal) === 600000, "Khôi phục không giữ nguyên hạng mục, chi phí hoặc chưa bỏ khoang cũ");
    check((await db.appointment.findUniqueOrThrow({ where: { id: appointment.id } })).status === "IN_PROGRESS", "Lịch hẹn chưa mở lại cùng phiếu");
    check((await request(restorePath, "POST", adminToken)).status === 409, "Khôi phục lặp không bị chặn");
    const moved = await request(`/api/repair-orders/${firstOrder.id}`, "PATCH", adminToken, { bayCode: bayCodes[1] });
    check(moved.status === 200, `Đổi khoang: ${moved.status} ${JSON.stringify(moved.data)}`);
    check((await db.workshopBay.findUniqueOrThrow({ where: { code: bayCodes[0] } })).vehicleId === null, "Khoang cũ chưa trống");
    const secondBay = await db.workshopBay.findUniqueOrThrow({ where: { code: bayCodes[1] } });
    check(secondBay.vehicleId === vehicle.id, "Khoang mới chưa nhận xe");
    check((await request(`/api/employee/bays/${secondBay.id}`, "PATCH", employeeToken, { status: "IN_PROGRESS", note: "Đang sửa" })).status === 200, "KTV không báo được tiến độ");
    check((await request(`/api/employee/bays/${secondBay.id}`, "PATCH", employeeToken, { status: "DONE", note: "Đã sửa xong" })).status === 200, "KTV không báo được hoàn tất");
    check((await db.repairOrder.findUniqueOrThrow({ where: { id: firstOrder.id } })).status === "QUALITY_CHECK", "Phiếu chưa chuyển kiểm định");
    check((await db.workshopBay.findUniqueOrThrow({ where: { id: secondBay.id } })).vehicleId === null, "Khoang chưa giải phóng");
    check((await request(`/api/repair-orders/${firstOrder.id}`, "PATCH", adminToken, { status: "COMPLETED" })).status === 409, "Bỏ qua kiểm định và bàn giao");
    check((await request(`/api/admin/repair-orders/${firstOrder.id}/invoice`, "POST", adminToken)).status === 409, "Xuất hóa đơn trước khi hoàn tất phiếu");
    check((await request(`/api/repair-orders/${firstOrder.id}`, "PATCH", adminToken, { status: "READY_FOR_PICKUP" })).status === 200, "Không chuyển được trạng thái sẵn sàng bàn giao");
    check((await request(`/api/repair-orders/${firstOrder.id}`, "PATCH", adminToken, { status: "COMPLETED" })).status === 200, "Không bàn giao được phiếu");
    check((await db.appointment.findUniqueOrThrow({ where: { id: appointment.id } })).status === "COMPLETED", "Lịch hẹn chưa hoàn tất cùng phiếu");
    const issued = await request(`/api/admin/repair-orders/${firstOrder.id}/invoice`, "POST", adminToken);
    check(issued.status === 201 && issued.data.id, `Xuất hóa đơn: ${issued.status} ${JSON.stringify(issued.data)}`);
    ids.invoices.push(String(issued.data.id));
    const invoice = await db.invoice.findUniqueOrThrow({ where: { id: ids.invoices[0] } });
    check(Number(invoice.subtotal) === 600000 && invoice.status === "UNPAID" && invoice.repairOrderId === firstOrder.id, "Hóa đơn không lấy đúng tổng tiền phiếu");
    check(invoice.taxPercent?.equals(taxSettings.taxPercent), "Hóa đơn không lưu mức thuế đã áp dụng");
    check(invoice.tax.equals(invoice.subtotal.sub(invoice.discount).mul(taxSettings.taxPercent).div(100).toDecimalPlaces(2)), "Thuế chưa tính trên số tiền sau ưu đãi");
    check(invoice.total.equals(invoice.subtotal.sub(invoice.discount).add(invoice.tax)), "Tổng hóa đơn chưa cộng thuế");
    const repeatedIssue = await request(`/api/admin/repair-orders/${firstOrder.id}/invoice`, "POST", adminToken);
    check(repeatedIssue.status === 201 && repeatedIssue.data.id === invoice.id, "Xuất hóa đơn lần hai tạo chứng từ trùng");
    check((await request("/api/invoices", "POST", adminToken, {})).status === 405, "Vẫn tạo được hóa đơn thủ công");
    const firstPayment = await request(`/api/admin/invoices/${invoice.id}/payments`, "POST", adminToken, { method: "CASH", amount: 100000 });
    check(firstPayment.status === 201, `Thanh toán một phần: ${firstPayment.status} ${JSON.stringify(firstPayment.data)}`);
    check((await db.invoice.findUniqueOrThrow({ where: { id: invoice.id } })).status === "PARTIALLY_PAID", "Hóa đơn chưa cập nhật thanh toán một phần");
    const remaining = Number(invoice.total) - 100000;
    const finalPayment = await request(`/api/admin/invoices/${invoice.id}/payments`, "POST", adminToken, { method: "BANK_TRANSFER", amount: remaining });
    check(finalPayment.status === 201, `Thanh toán đủ: ${finalPayment.status} ${JSON.stringify(finalPayment.data)}`);
    check((await db.invoice.findUniqueOrThrow({ where: { id: invoice.id } })).status === "PAID", "Hóa đơn chưa chuyển đã thanh toán");
    check((await db.payment.count({ where: { invoiceId: invoice.id, status: "COMPLETED" } })) === 2, "Thiếu lịch sử phương thức thanh toán");
    check((await request("/api/admin/repair-intake", "POST", adminToken, input)).status === 409, "Lịch cũ được tạo lại phiếu");
    const nextAppointment = await db.appointment.create({ data: { code: `TEST-${tag}-B`, customerId: customer.id, vehicleId: vehicle.id, serviceId: service.id, startsAt: new Date(Date.now() + 172800000), status: "ARRIVED" } });
    ids.appointments.push(nextAppointment.id);
    const next = await request("/api/admin/repair-intake", "POST", adminToken, { appointmentId: nextAppointment.id, customerId: customer.id, vehicleId: vehicle.id, lines: [{ type: "SERVICE", catalogId: service.id, quantity: 1 }] });
    check(next.status === 201 && next.data.id !== firstOrder.id, `Lần hẹn sau không tạo được phiếu mới: ${next.status} ${JSON.stringify(next.data)}`);
    ids.orders.push(String(next.data.id));
    process.stdout.write("PASS: lịch hẹn → phiếu, dịch vụ + phụ tùng + công, kiểm định, hóa đơn, thanh toán, lịch hẹn mới.\n");
  } finally {
    if (ids.employee) await db.notification.deleteMany({ where: { employeeId: ids.employee } });
    if (ids.invoices.length) {
      await db.payment.deleteMany({ where: { invoiceId: { in: ids.invoices } } });
      await db.invoice.deleteMany({ where: { id: { in: ids.invoices } } });
    }
    if (ids.orders.length) {
      await db.repairOrderLine.deleteMany({ where: { repairOrderId: { in: ids.orders } } });
      await db.repairOrder.deleteMany({ where: { id: { in: ids.orders } } });
    }
    if (ids.appointments.length) await db.appointment.deleteMany({ where: { id: { in: ids.appointments } } });
    await db.workshopBay.deleteMany({ where: { code: { in: bayCodes } } });
    if (ids.sessions.length) await db.session.deleteMany({ where: { tokenHash: { in: ids.sessions } } });
    if (ids.accounts.length) await db.userAccount.deleteMany({ where: { id: { in: ids.accounts } } });
    if (ids.part) await db.part.delete({ where: { id: ids.part } });
    if (ids.service) await db.service.delete({ where: { id: ids.service } });
    if (ids.vehicle) await db.vehicle.delete({ where: { id: ids.vehicle } });
    if (ids.customer) await db.customer.delete({ where: { id: ids.customer } });
    if (ids.employee) await db.employee.delete({ where: { id: ids.employee } });
    await db.$disconnect();
  }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
