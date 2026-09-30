import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { createDatabaseAdapter } from "../src/server/database-adapter";
import { scryptSync, randomBytes } from "node:crypto";
import { inventory, repairs, services } from "../src/lib/mock-data";
import { repairEvidence } from "../src/components/admin/repairEvidence";

const db = new PrismaClient({ adapter: createDatabaseAdapter(process.env.DATABASE_URL!) });
const money = (value: string) => Number(value.replace(/[^\d]/g, ""));
const customers = [
  { name: "Nguyễn Văn A", phone: "0905123456", email: "nguyenvana@example.com", tier: "Silver", address: "128 Nguyễn Hữu Thọ, Hải Châu, Đà Nẵng" },
  { name: "Lê Thị Hương", phone: "0914555678" },
  { name: "Trần Quốc Huy", phone: "0988221432" },
  { name: "Phạm Minh Tuấn", phone: "0905000001" },
  { name: "Đỗ Văn Kiên", phone: "0905000002" },
];
const vehicleRows = [
  { plate: "43A-123.45", name: "Mazda 3 Premium 1.5L", owner: "Nguyễn Văn A", odometerKm: 42580, status: "IN_REPAIR" as const, warranty: "Còn hiệu lực" },
  { plate: "43A-888.88", name: "VinFast VF8 Plus", owner: "Nguyễn Văn A", odometerKm: 18240, status: "IN_REPAIR" as const },
  { plate: "92A-888.99", name: "Mercedes C200 (2022)", owner: "Lê Thị Hương", odometerKm: 28340, status: "IN_REPAIR" as const },
  { plate: "43B-019.22", name: "Ford Ranger (2020)", owner: "Trần Quốc Huy", status: "IN_REPAIR" as const },
  { plate: "43A-678.90", name: "Toyota Cross (2023)", owner: "Phạm Minh Tuấn", odometerKm: 14200, status: "READY" as const },
  { plate: "43E-555.12", name: "Kia Seltos (2022)", owner: "Đỗ Văn Kiên", status: "ACTIVE" as const },
  { plate: "43A-445.67", name: "Mazda CX-5" },
  { plate: "92A-332.11", name: "Toyota Fortuner" },
  { plate: "43A-899.01", name: "Honda CR-V" },
  { plate: "43A-776.54", name: "BMW 320i LCI" },
  { plate: "43E-112.33", name: "Kia Carnival 3.5" },
];
const employeeNames = ["Đặng Quốc Bảo", "Hưng VK", "Lê Hữu Tài", "Hoàng Nam", "Tuấn Kiệt", "Quốc Bảo", "Văn Thành", "Đình Trọng", "Minh Tuấn", "Tuấn TM", "Nam PH", "Dũng NA", "Thành NM", "Bảo ĐQ", "Trần Minh Tuấn"];
const bays = [
  ["01", "43A-445.67", "80% Xong", "Hoàng Nam"],
  ["02", "92A-332.11", "45% Sửa chữa", "Tuấn Kiệt"],
  ["03", "43A-123.45", "Chờ duyệt BG", "Quốc Bảo"],
  ["04", "43A-899.01", "90% Hoàn thiện", "Văn Thành"],
  ["05", "43A-776.54", "30% AI Scan", "Hưng VK"],
  ["06", "43E-112.33", "60% Tuần hoàn", "Đình Trọng"],
  ["07", "92A-888.99", "KCS 18 Hạng mục", "Minh Tuấn"],
  ["08", "43A-678.90", "Sẵn sàng giao", "Lê Hữu Tài"],
] as const;
const repairStatuses = ["WAITING_APPROVAL", "REPAIRING", "WAITING_PARTS", "READY_FOR_PICKUP", "INTAKE"] as const;

async function main() {
  for (const row of customers) {
    await db.customer.upsert({ where: { phone: row.phone }, update: {}, create: row });
  }
  const customerByName = new Map((await db.customer.findMany()).map((row) => [row.name, row.id]));
  for (const row of vehicleRows) {
    await db.vehicle.upsert({ where: { plate: row.plate }, update: {}, create: { plate: row.plate, name: row.name, odometerKm: row.odometerKm, warranty: row.warranty, status: row.status, customerId: row.owner ? customerByName.get(row.owner) : undefined } });
  }
  const vehicleByPlate = new Map((await db.vehicle.findMany()).map((row) => [row.plate, row.id]));
  for (const [index, row] of services.entries()) {
    const code = index === 0 ? "DV-BD01" : index === 2 ? "DV-PH02" : index === 4 ? "DV-ECU03" : `DV-${String(index + 1).padStart(3, "0")}`;
    await db.service.upsert({ where: { code }, update: {}, create: { code, title: row.title, description: row.description, durationMinutes: Number(row.duration.replace(/[^\d]/g, "")), price: money(row.price) } });
  }
  for (const [index, name] of employeeNames.entries()) {
    const specialty = index === 0 ? "Gầm máy · Level 3" : index === 1 ? "Điện · Chẩn đoán" : index === 2 ? "Phụ tá kỹ thuật" : null;
    await db.employee.upsert({ where: { code: `EMP-${String(index + 1).padStart(3, "0")}` }, update: {}, create: { code: `EMP-${String(index + 1).padStart(3, "0")}`, name, specialty, shiftStart: index < 3 ? "08:00" : null, shiftEnd: index < 3 ? "17:00" : null } });
  }
  const employeeByName = new Map((await db.employee.findMany()).map((row) => [row.name, row.id]));
  for (const item of inventory) {
    const match = item.stock.match(/(\d+)\s*\/\s*(\d+)\s*(.*)/);
    await db.part.upsert({ where: { sku: item.sku }, update: {}, create: { sku: item.sku, name: item.name, brand: item.brand, location: item.location, cost: money(item.cost), price: money(item.price), stockQty: Number(match?.[1] ?? 0), minStock: Number(match?.[2] ?? 0), unit: match?.[3] || "cái" } });
  }
  for (const [code, plate, statusText, employee] of bays) {
    await db.workshopBay.upsert({ where: { code }, update: {}, create: { code, vehicleId: vehicleByPlate.get(plate), employeeId: employeeByName.get(employee), statusText } });
  }
  for (const code of ["09", "10"]) {
    await db.workshopBay.upsert({ where: { code }, update: {}, create: { code, statusText: "Trống" } });
  }
  const appointments = [
    ["APT-1024", "Nguyễn Văn A", "43A-123.45", "2024-10-24T08:30:00+07:00", "ARRIVED"],
    ["APT-1025", "Lê Thị Hương", "92A-888.99", "2024-10-24T09:00:00+07:00", "IN_PROGRESS"],
    ["APT-1026", "Đỗ Văn Kiên", "43E-555.12", "2024-10-24T11:00:00+07:00", "CONFIRMED"],
  ] as const;
  for (const [code, customer, plate, date, status] of appointments) {
    await db.appointment.upsert({ where: { code }, update: {}, create: { code, customerId: customerByName.get(customer)!, vehicleId: vehicleByPlate.get(plate)!, startsAt: new Date(date), status } });
  }
  for (const [index, row] of repairs.entries()) {
    const code = index === 0 ? "SC-2024-0891" : `SC-2024-${String(892 + index).padStart(4, "0")}`;
    await db.repairOrder.upsert({ where: { code }, update: {}, create: { code, customerId: customerByName.get(row.customer)!, vehicleId: vehicleByPlate.get(row.plate)!, advisorId: employeeByName.get(row.advisor), technicianId: employeeByName.get(row.technician), scheduledAt: new Date(`2024-10-24T${row.time}:00+07:00`), status: repairStatuses[index], bayCode: index === 0 ? "03" : undefined, odometerKm: index === 0 ? 42580 : undefined, diagnosis: index === 0 ? "Má phanh mòn sát đế kim loại 2mm. Đĩa phanh trước xuất hiện rãnh nhiệt sâu 0.3mm cần láng phẳng triệt để." : undefined, estimateTotal: index === 0 ? 2354400 : undefined } });
  }
  const repair = await db.repairOrder.findUniqueOrThrow({ where: { code: "SC-2024-0891" } });
  if (!(await db.repairOrderLine.count({ where: { repairOrderId: repair.id } }))) {
    const lines = [
      ["PART", "Bộ má phanh đĩa trước chính hãng Mazda", "Còn 4 bộ", 1, 1250000],
      ["SERVICE", "Láng đĩa phanh trước trên máy CNC", "-", 2, 250000],
      ["PART", "Dầu phanh cao cấp Castrol Brake Fluid DOT4 1L", "Còn 18 chai", 1, 280000],
      ["SERVICE", "Gói công thợ kỹ thuật & cân chỉnh phanh điện tử EPB", "-", 1, 150000],
    ] as const;
    await db.repairOrderLine.createMany({ data: lines.map(([type, description, stockNote, quantity, unitPrice], sortOrder) => ({ repairOrderId: repair.id, type, description, stockNote, quantity, unitPrice, total: quantity * unitPrice, sortOrder })) });
  }
  if (!(await db.repairTask.count({ where: { repairOrderId: repair.id } }))) {
    const steps = ["Tháo bánh xe & tháo cùm phanh trước hai bên", "Đo độ dày đĩa phanh & kiểm tra heo thắng", "Tháo đĩa phanh đưa vào máy láng CNC", "Vệ sinh cùm phanh & tra mỡ chịu nhiệt", "Lắp má phanh mới & thay dầu DOT4"];
    await db.repairTask.createMany({ data: steps.map((description, sortOrder) => ({ repairOrderId: repair.id, description, sortOrder, status: sortOrder < 2 ? "COMPLETED" : "PENDING" })) });
  }
  if (!(await db.repairEvidence.count({ where: { repairOrderId: repair.id } }))) {
    await db.repairEvidence.createMany({ data: repairEvidence.map((item, sortOrder) => ({ repairOrderId: repair.id, imageUrl: item.src, caption: item.label, sortOrder })) });
  }
  const invoices = [
    ["EST-2024-8901", "Nguyễn Văn A", "43A-123.45", 2354400, "PENDING_APPROVAL"],
    ["INV-2024-0870", "Phạm Minh Tuấn", "43A-678.90", 4820000, "PAID"],
    ["INV-2024-0891", "Nguyễn Văn A", "43A-123.45", 2354400, "UNPAID"],
    ["INV-2024-0712", "Nguyễn Văn A", "43A-123.45", 1280000, "PAID"],
  ] as const;
  for (const [code, customer, plate, total, status] of invoices) {
    await db.invoice.upsert({ where: { code }, update: {}, create: { code, customerId: customerByName.get(customer)!, vehicleId: vehicleByPlate.get(plate), repairOrderId: code === "EST-2024-8901" ? repair.id : undefined, issuedAt: new Date(code.includes("0712") ? "2024-07-12T00:00:00+07:00" : "2024-10-24T00:00:00+07:00"), total, status, subtotal: code.includes("0891") || code.includes("8901") ? 2280000 : total, discount: code.includes("0891") || code.includes("8901") ? 100000 : 0, tax: code.includes("0891") || code.includes("8901") ? 174400 : 0 } });
  }
  for (const code of ["INV-2024-0870", "INV-2024-0712"]) {
    const invoice = await db.invoice.findUniqueOrThrow({ where: { code } });
    await db.payment.upsert({ where: { code: `PAY-${code.slice(4)}` }, update: {}, create: { code: `PAY-${code.slice(4)}`, invoiceId: invoice.id, amount: invoice.total, status: "COMPLETED", method: "OTHER", paidAt: invoice.issuedAt } });
  }
  await db.notification.upsert({ where: { id: "seed-low-stock" }, update: {}, create: { id: "seed-low-stock", title: "Kiểm tra phụ tùng dưới mức tồn tối thiểu", type: "WARNING" } });
  for (const [period, revenue, cost, profit] of [["2024-10-01", 685200000, 402400000, 282800000], ["2024-09-01", 642100000, 389200000, 252900000]] as const) {
    const periodStart = new Date(`${period}T00:00:00+07:00`);
    await db.report.upsert({ where: { periodStart }, update: {}, create: { periodStart, revenue, cost, profit } });
  }
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const salt = randomBytes(16).toString("hex");
    const passwordHash = `${salt}:${scryptSync(process.env.ADMIN_PASSWORD, salt, 64).toString("hex")}`;
    await db.userAccount.upsert({ where: { email: process.env.ADMIN_EMAIL.toLowerCase() }, update: {}, create: { name: process.env.ADMIN_NAME?.trim() || "Quản trị viên", email: process.env.ADMIN_EMAIL.toLowerCase(), passwordHash, role: "ADMIN" } });
  }
  console.log("AutoCare seed complete");
}

main().finally(async () => db.$disconnect());
