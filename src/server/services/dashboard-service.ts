import "server-only";
import { getPrisma } from "@/server/db";
import { todayBoundsVietnam } from "@/server/services/financial-report";

export async function getDashboardData() {
  const db = getPrisma();
  const { start, end } = todayBoundsVietnam();
  const active = { deletedAt: null };
  // Legacy seed records are kept in the database for reference, but are not live garage activity.
  const liveOrders = { ...active, code: { notIn: ["SC-2024-0891", "SC-2024-0892", "SC-2024-0893", "SC-2024-0894", "SC-2024-0895", "SC-2024-0896"] } };
  const liveAppointments = { ...active, code: { notIn: ["APT-1024", "APT-1025", "APT-1026"] } };
  const [appointmentsToday, repairing, waitingApproval, ready, overdue, revenue, appointments, orders, readyOrders, lowStock, notifications] = await Promise.all([
    db.appointment.count({ where: { ...liveAppointments, status: { not: "CANCELLED" }, startsAt: { gte: start, lt: end } } }),
    db.repairOrder.count({ where: { ...liveOrders, status: "REPAIRING" } }),
    db.repairOrder.count({ where: { ...liveOrders, status: "WAITING_APPROVAL" } }),
    db.repairOrder.count({ where: { ...liveOrders, status: "READY_FOR_PICKUP" } }),
    db.repairOrder.count({ where: { ...liveOrders, scheduledAt: { lt: start }, status: { in: ["INTAKE", "WAITING_APPROVAL", "WAITING_PARTS", "REPAIRING", "QUALITY_CHECK"] } } }),
    db.payment.aggregate({ _sum: { amount: true }, where: { ...active, status: "COMPLETED", paidAt: { gte: start, lt: end }, invoice: { deletedAt: null, status: { not: "CANCELLED" } } } }),
    db.appointment.findMany({ where: { ...liveAppointments, status: { not: "CANCELLED" }, startsAt: { gte: start, lt: end } }, include: { customer: true, vehicle: true, service: { select: { title: true } } }, orderBy: { startsAt: "asc" }, take: 8 }),
    db.repairOrder.findMany({ where: { ...liveOrders, status: { in: ["INTAKE", "WAITING_APPROVAL", "WAITING_PARTS", "REPAIRING", "QUALITY_CHECK"] } }, include: { customer: true, vehicle: true, technician: true }, orderBy: { updatedAt: "desc" }, take: 8 }),
    db.repairOrder.findMany({ where: { ...liveOrders, status: "READY_FOR_PICKUP" }, include: { customer: true, vehicle: true }, orderBy: { updatedAt: "desc" }, take: 5 }),
    db.part.findMany({ where: { ...active, stockQty: { lte: db.part.fields.minStock } }, orderBy: { stockQty: "asc" }, take: 5 }),
    db.notification.findMany({ where: { ...active, id: { not: "seed-low-stock" } }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return { appointmentsToday, repairing, waitingApproval, ready, overdue, revenue: revenue._sum.amount?.toNumber() ?? 0, appointments, orders, readyOrders, lowStock, notifications };
}
