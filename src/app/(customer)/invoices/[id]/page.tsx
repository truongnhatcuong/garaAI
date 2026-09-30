import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ReceiptText } from "lucide-react";
import { Status } from "@/components/ui/AppUi";
import { MembershipTierBadge } from "@/components/shared/MembershipTierBadge";
import { displayValue, resourceConfig } from "@/lib/resource-config";
import { statusTone } from "@/lib/status";
import { getPrisma } from "@/server/db";
import { getInvoiceCustomerId, invoiceDate, invoiceMoney } from "@/server/services/customer-invoices";

const methods: Record<string, string> = { CASH: "Tiền mặt", BANK_TRANSFER: "Chuyển khoản", CARD: "Thẻ", OTHER: "Khác" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const customerId = await getInvoiceCustomerId();
  const { id } = await params;
  const invoice = await getPrisma().invoice.findFirst({
    where: { id, customerId, deletedAt: null },
    select: {
      code: true, issuedAt: true, subtotal: true, discount: true, tax: true, taxPercent: true, total: true, status: true,
      customer: { select: { name: true, tier: true } },
      vehicle: { select: { plate: true, name: true } },
      repairOrder: { select: { code: true, laborCost: true, lines: { orderBy: { sortOrder: "asc" }, select: { id: true, description: true, type: true, quantity: true, unitPrice: true, total: true } } } },
      payments: { where: { deletedAt: null }, orderBy: { paidAt: "desc" }, select: { id: true, code: true, method: true, status: true, paidAt: true, amount: true } },
    },
  });
  if (!invoice) notFound();
  const paid = invoice.payments.filter((payment) => payment.status === "COMPLETED").reduce((sum, payment) => sum + Number(payment.amount), 0);
  const remaining = Math.max(0, Number(invoice.total) - paid);
  const percent = Number(invoice.subtotal) > 0 ? Number(invoice.discount) / Number(invoice.subtotal) * 100 : 0;
  const formatMoney = (value: { toString(): string } | number) => invoiceMoney(Number(value));
  const payable = ["UNPAID", "PARTIALLY_PAID"].includes(invoice.status);

  return <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
    <Link href="/invoices" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"><ArrowLeft size={16} />Hóa đơn của tôi</Link>
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Chi tiết hóa đơn</p><h1 className="mt-2 break-all text-2xl font-bold text-slate-950">{invoice.code}</h1><p className="mt-2 text-sm text-slate-500">Phát hành ngày {invoiceDate(invoice.issuedAt)}</p></div><Status tone={statusTone(invoice.status)}>{displayValue(invoice.status, "status", resourceConfig.invoices)}</Status></header>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-5">
        <section className="card p-5 sm:p-6"><h2 className="font-semibold text-slate-900">Thông tin của bạn</h2><dl className="mt-4 grid gap-5 text-sm sm:grid-cols-2"><div><dt className="text-xs text-slate-500">Khách hàng</dt><dd className="mt-1 font-medium">{invoice.customer.name}</dd></div><div><dt className="text-xs text-slate-500">Xe</dt><dd className="mt-1 font-medium">{invoice.vehicle ? invoice.vehicle.plate + " · " + invoice.vehicle.name : "Chưa ghi nhận"}</dd></div><div><dt className="text-xs text-slate-500">Phiếu sửa chữa</dt><dd className="mt-1 font-medium">{invoice.repairOrder?.code ?? "Chưa có phiếu liên kết"}</dd></div><div><dt className="mb-1 text-xs text-slate-500">Hạng hội viên hiện tại</dt><dd><MembershipTierBadge tier={invoice.customer.tier} /></dd></div></dl></section>
        <section className="card overflow-hidden"><h2 className="border-b px-5 py-4 font-semibold text-slate-900">Dịch vụ, phụ tùng và tiền công</h2>
          {invoice.repairOrder ? <><div className="divide-y divide-slate-100">{invoice.repairOrder.lines.map((line) => <div key={line.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4"><div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{line.description}</p><p className="mt-1 text-xs text-slate-500">{line.type === "PART" ? "Phụ tùng" : "Dịch vụ"} · {line.quantity} × {formatMoney(line.unitPrice)}</p></div><strong className="text-sm tabular-nums">{formatMoney(line.total)}</strong></div>)}</div><div className="flex justify-between gap-3 border-t bg-slate-50 px-5 py-4 text-sm"><span>Tiền công</span><strong>{formatMoney(invoice.repairOrder.laborCost)}</strong></div></> : <p className="px-5 py-6 text-sm text-slate-500">Hóa đơn này chưa có chi tiết hạng mục liên kết. Bạn có thể liên hệ gara để được hỗ trợ đối chiếu.</p>}
        </section>
        <section className="card p-5 sm:p-6"><h2 className="font-semibold text-slate-900">Lịch sử thanh toán</h2>{invoice.payments.length ? <ul className="mt-4 divide-y divide-slate-100">{invoice.payments.map((payment) => <li key={payment.id} className="flex flex-wrap justify-between gap-3 py-3"><div><p className="text-sm font-medium">{methods[payment.method] ?? payment.method}</p><p className="mt-1 text-xs text-slate-500">{payment.paidAt ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(payment.paidAt) : "Chưa ghi nhận thời gian"}</p><p className="mt-1 break-all text-xs text-slate-500">{payment.code}</p></div><div className="space-y-1 text-right"><p className="text-sm font-semibold">{formatMoney(payment.amount)}</p><Status tone={statusTone(payment.status)}>{displayValue(payment.status, "status", resourceConfig.payments)}</Status></div></li>)}</ul> : <p className="mt-3 text-sm text-slate-500">Chưa ghi nhận khoản thanh toán nào.</p>}</section>
      </div>
      <aside className="card overflow-hidden lg:sticky lg:top-24"><div className="border-b bg-blue-50 px-5 py-5"><ReceiptText size={20} className="text-blue-700" /><h2 className="mt-3 font-semibold text-slate-900">Tổng thanh toán</h2><p className="mt-1 text-3xl font-bold tracking-tight text-blue-800">{formatMoney(invoice.total)}</p></div><dl className="space-y-4 p-5 text-sm"><div className="flex justify-between gap-3"><dt>Tạm tính</dt><dd>{formatMoney(invoice.subtotal)}</dd></div><div className="flex justify-between gap-3 text-emerald-800"><dt>Ưu đãi đã áp dụng ({new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(percent)}%)</dt><dd className="shrink-0">−{formatMoney(invoice.discount)}</dd></div><div className="flex justify-between gap-3"><dt>Thuế{invoice.taxPercent !== null ? ` (${Number(invoice.taxPercent).toLocaleString("vi-VN")}%)` : ""}</dt><dd>{formatMoney(invoice.tax)}</dd></div><div className="flex justify-between gap-3 border-t pt-4"><dt>Đã thanh toán</dt><dd className="font-semibold text-emerald-700">{invoiceMoney(paid)}</dd></div>{payable && <div className="flex justify-between gap-3 font-semibold"><dt>Còn phải trả</dt><dd className="text-blue-800">{invoiceMoney(remaining)}</dd></div>}</dl><p className="border-t px-5 py-4 text-xs leading-relaxed text-slate-500">{invoice.status === "CANCELLED" ? "Hóa đơn đã hủy. Liên hệ gara nếu cần đối chiếu khoản đã thanh toán." : invoice.status === "PAID" ? "Gara đã ghi nhận thanh toán hoàn tất cho hóa đơn này." : payable ? "Vui lòng thanh toán theo hướng dẫn của gara. Khi gara xác nhận, trạng thái sẽ được cập nhật tại đây." : "Đây là chứng từ đang chờ xử lý. Gara sẽ xác nhận số tiền cần thanh toán."}</p></aside>
    </div>
  </div>;
}
