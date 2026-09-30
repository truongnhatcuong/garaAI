import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { withGeneratedCode } from "@/server/services/generated-code";
import { apiError, ResourceError } from "@/server/services/resource-service";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const inputSchema = z.object({
  method: z.enum(["CASH", "BANK_TRANSFER", "CARD", "OTHER"]),
  amount: z.number().finite().positive().max(999999999999.99),
  paidAt: z.coerce.date().optional(),
  notes: z.string().trim().max(1000).optional(),
}).strict();

export async function POST(request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const input = inputSchema.parse(await request.json());
    if (input.paidAt && Number.isNaN(input.paidAt.getTime())) throw new ResourceError("Thời gian thanh toán không hợp lệ.", 400);
    const db = getPrisma();
    const record = await withGeneratedCode("payments", (code) => db.$transaction(async (tx) => {
      await tx.appointmentBookingMutex.update({ where: { id: 1 }, data: { version: { increment: 1 } } });
      const invoice = await tx.invoice.findFirst({ where: { id, deletedAt: null }, include: { payments: { where: { deletedAt: null, status: "COMPLETED" }, select: { amount: true } } } });
      if (!invoice) throw new ResourceError("Không tìm thấy hóa đơn.", 404);
      if (invoice.status === "CANCELLED") throw new ResourceError("Hóa đơn đã hủy, không thể ghi nhận thanh toán.", 409);
      if (invoice.status === "PAID") throw new ResourceError("Hóa đơn đã thanh toán đủ.", 409);
      const paid = invoice.payments.reduce((sum, payment) => sum.add(payment.amount), new Prisma.Decimal(0));
      const remaining = invoice.total.sub(paid);
      const amount = new Prisma.Decimal(input.amount);
      if (remaining.lte(0)) throw new ResourceError("Hóa đơn không còn số tiền phải thanh toán.", 409);
      if (amount.gt(remaining)) throw new ResourceError(`Số tiền vượt phần còn lại ${remaining.toString()} ₫.`, 400);
      const payment = await tx.payment.create({ data: { code, invoiceId: id, amount, method: input.method, status: "COMPLETED", paidAt: input.paidAt ?? new Date(), notes: input.notes } });
      await tx.invoice.update({ where: { id }, data: { status: paid.add(amount).gte(invoice.total) ? "PAID" : "PARTIALLY_PAID" } });
      return payment;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, maxWait: 5000, timeout: 15000 }));
    return Response.json({ id: record.id, code: record.code }, { status: 201 });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message, details: failure.details }, { status: failure.status });
  }
}
