import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/server/db";

export function todayBoundsVietnam(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const start = new Date(Date.UTC(value("year"), value("month") - 1, value("day")) - 7 * 60 * 60 * 1000);
  return { start, end: new Date(start.getTime() + 86400000) };
}

export async function getTodayFinancials() {
  const db = getPrisma();
  const { start, end } = todayBoundsVietnam();
  const [payments, expenses] = await Promise.all([
    db.payment.findMany({
      where: { status: "COMPLETED", deletedAt: null, paidAt: { gte: start, lt: end }, invoice: { deletedAt: null, status: { not: "CANCELLED" } } },
      include: { invoice: { include: { repairOrder: { include: { lines: { include: { part: true } } } } } } },
    }),
    db.expense.aggregate({ _sum: { amount: true }, where: { deletedAt: null, spentAt: { gte: start, lt: end } } }),
  ]);
  const revenue = payments.reduce((sum, payment) => sum.add(payment.amount), new Prisma.Decimal(0));
  const partCost = payments.reduce((sum, payment) => {
    const invoiceTotal = payment.invoice.total;
    if (invoiceTotal.lte(0)) return sum;
    const invoicePartCost = payment.invoice.repairOrder?.lines.reduce((lineSum, line) =>
      line.type === "PART" && line.part
        ? lineSum.add(line.part.cost.mul(line.quantity))
        : lineSum, new Prisma.Decimal(0)) ?? new Prisma.Decimal(0);
    const fraction = Prisma.Decimal.min(payment.amount.div(invoiceTotal), new Prisma.Decimal(1));
    return sum.add(invoicePartCost.mul(fraction));
  }, new Prisma.Decimal(0)).toDecimalPlaces(2);
  const expenseCost = expenses._sum.amount ?? new Prisma.Decimal(0);
  const cost = partCost.add(expenseCost);
  return { start, end, revenue, partCost, expenseCost, cost, profit: revenue.sub(cost), paymentCount: payments.length };
}

export async function syncTodayReport() {
  const summary = await getTodayFinancials();
  const data = { revenue: summary.revenue, cost: summary.cost, profit: summary.profit, deletedAt: null };
  await getPrisma().report.upsert({
    where: { periodStart: summary.start },
    create: { periodStart: summary.start, ...data },
    update: data,
  });
  return summary;
}
