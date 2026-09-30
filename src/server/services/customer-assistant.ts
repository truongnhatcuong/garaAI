import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPrisma } from "@/server/db";

const dateTime = (value: Date) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(value);
const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;

export async function getCustomerAssistantPrompt() {
  return readFile(path.join(process.cwd(), "prompts", "customer-assistant.md"), "utf8");
}

export async function getCustomerAssistantContext(customerId: string) {
  const db = getPrisma();
  const customer = await db.customer.findFirst({ where: { id: customerId, deletedAt: null }, select: { name: true, tier: true } });
  if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
  const [tier, vehicles, appointments, repairs, invoices, services, parts] = await Promise.all([
    db.membershipTier.findUnique({ where: { code: customer.tier }, select: { discountPercent: true } }),
    db.vehicle.findMany({ where: { customerId, deletedAt: null }, select: { plate: true, name: true, odometerKm: true, warranty: true }, orderBy: { createdAt: "desc" }, take: 10 }),
    db.appointment.findMany({ where: { customerId, deletedAt: null }, select: { code: true, startsAt: true, status: true, vehicle: { select: { plate: true } }, service: { select: { title: true } } }, orderBy: { startsAt: "desc" }, take: 6 }),
    db.repairOrder.findMany({ where: { customerId, deletedAt: null }, select: { code: true, status: true, diagnosis: true, vehicle: { select: { plate: true } }, lines: { select: { type: true, description: true, quantity: true }, orderBy: { sortOrder: "asc" } } }, orderBy: { createdAt: "desc" }, take: 5 }),
    db.invoice.findMany({ where: { customerId, deletedAt: null }, select: { code: true, status: true, total: true, issuedAt: true, vehicle: { select: { plate: true } }, payments: { where: { deletedAt: null, status: "COMPLETED" }, select: { amount: true } } }, orderBy: { issuedAt: "desc" }, take: 5 }),
    db.service.findMany({ where: { status: "ACTIVE", deletedAt: null }, select: { title: true, description: true, durationMinutes: true, price: true }, orderBy: { title: "asc" }, take: 30 }),
    db.part.findMany({ where: { status: "ACTIVE", deletedAt: null }, select: { name: true, brand: true, price: true, stockQty: true }, orderBy: { name: "asc" }, take: 30 }),
  ]);
  return JSON.stringify({
    today: dateTime(new Date()),
    customer: { name: customer.name, tier: customer.tier, discountPercent: tier?.discountPercent.toNumber() ?? 0 },
    vehicles: vehicles.map((vehicle) => ({ ...vehicle })),
    appointments: appointments.map((appointment) => ({ code: appointment.code, time: dateTime(appointment.startsAt), status: appointment.status, plate: appointment.vehicle.plate, service: appointment.service?.title ?? null })),
    repairs: repairs.map((repair) => ({ code: repair.code, status: repair.status, plate: repair.vehicle.plate, diagnosis: repair.diagnosis?.slice(0, 500) ?? null, items: repair.lines.map((line) => ({ type: line.type, name: line.description, quantity: line.quantity })) })),
    invoices: invoices.map((invoice) => ({ code: invoice.code, status: invoice.status, plate: invoice.vehicle?.plate ?? null, issuedAt: dateTime(invoice.issuedAt), total: money(invoice.total.toNumber()), paid: money(invoice.payments.reduce((sum, payment) => sum + payment.amount.toNumber(), 0)) })),
    services: services.map((service) => ({ name: service.title, description: service.description?.slice(0, 300) ?? null, durationMinutes: service.durationMinutes, price: money(service.price.toNumber()) })),
    parts: parts.map((part) => ({ name: part.name, brand: part.brand, price: money(part.price.toNumber()), available: part.stockQty > 0 })),
  });
}
