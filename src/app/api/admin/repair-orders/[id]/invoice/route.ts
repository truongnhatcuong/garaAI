import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { withGeneratedCode } from "@/server/services/generated-code";
import { apiError, ResourceError } from "@/server/services/resource-service";
import { calculateInvoiceAmounts } from "@/server/services/invoice-amounts";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const db = getPrisma();
    const issue = () => withGeneratedCode("invoices", (code) => db.$transaction(async (tx) => {
      await tx.appointmentBookingMutex.update({ where: { id: 1 }, data: { version: { increment: 1 } } });
      const order = await tx.repairOrder.findFirst({
        where: { id, deletedAt: null },
        include: { customer: { select: { tier: true } }, lines: { select: { total: true } } },
      });
      if (!order) throw new ResourceError("Không tìm thấy phiếu sửa chữa.", 404);
      if (order.status !== "COMPLETED") throw new ResourceError("Chỉ xuất hóa đơn khi phiếu sửa chữa đã hoàn tất.", 409);
      const existing = await tx.invoice.findFirst({ where: { repairOrderId: id, deletedAt: null, status: { not: "CANCELLED" } }, select: { id: true, code: true } });
      if (existing) return existing;
      const subtotal = order.lines.reduce((sum, line) => sum.add(line.total), new Prisma.Decimal(order.laborCost));
      if (subtotal.lte(0)) throw new ResourceError("Phiếu chưa có chi phí dịch vụ, phụ tùng hoặc tiền công để xuất hóa đơn.", 400);
      const tier = await tx.membershipTier.findUnique({ where: { code: order.customer.tier }, select: { discountPercent: true } });
      const settings = await tx.invoiceSettings.findUnique({ where: { id: 1 } });
      const taxPercent = settings?.taxPercent ?? new Prisma.Decimal(0);
      const { discount, tax, total } = calculateInvoiceAmounts(subtotal, tier?.discountPercent ?? 0, taxPercent);
      return tx.invoice.create({ data: {
        code,
        customerId: order.customerId,
        vehicleId: order.vehicleId,
        repairOrderId: order.id,
        issuedAt: new Date(),
        subtotal,
        discount,
        taxPercent,
        tax,
        total,
        status: "UNPAID",
      }, select: { id: true, code: true } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, maxWait: 5000, timeout: 15000 }));
    let invoice: Awaited<ReturnType<typeof issue>> | null = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try { invoice = await issue(); break; }
      catch (error) {
        const retryable = error instanceof Prisma.PrismaClientKnownRequestError
          && (error.code === "P2034" || (error.code === "P2039" && /write conflict|deadlock|lock wait timeout|9007|1213/i.test(error.message)));
        if (!retryable || attempt === 2) throw error;
      }
    }
    if (!invoice) throw new ResourceError("Không thể xuất hóa đơn lúc này. Vui lòng thử lại.", 409);
    return Response.json(invoice, { status: 201 });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
