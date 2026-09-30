import Link from "next/link";
import { notFound } from "next/navigation";
import { Status } from "@/components/ui/AppUi";
import { InvoicePaymentForm } from "@/components/admin/InvoicePaymentForm";
import { MembershipTierBadge } from "@/components/shared/MembershipTierBadge";
import { resourceConfig, displayValue } from "@/lib/resource-config";
import { statusTone } from "@/lib/status";
import { getPrisma } from "@/server/db";

const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
const dateTime = (value: Date) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(value);
const methods: Record<string, string> = { CASH: "Tiền mặt", BANK_TRANSFER: "Chuyển khoản", CARD: "Thẻ", OTHER: "Khác" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getPrisma().invoice.findFirst({
    where: { id, deletedAt: null },
    include: {
      customer: true,
      vehicle: true,
      repairOrder: { include: { lines: { include: { part: { select: { cost: true } } }, orderBy: { sortOrder: "asc" } } } },
      payments: { where: { deletedAt: null }, orderBy: { paidAt: "desc" } },
    },
  });
  if (!invoice) notFound();
  const payments = invoice.payments.filter((payment) => payment.status === "COMPLETED");
  const paid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const remaining = Math.max(0, Number(invoice.total) - paid);
  const serviceTotal = invoice.repairOrder?.lines.filter((line) => line.type === "SERVICE").reduce((sum, line) => sum + Number(line.total), 0) ?? 0;
  const partTotal = invoice.repairOrder?.lines.filter((line) => line.type === "PART").reduce((sum, line) => sum + Number(line.total), 0) ?? 0;
  const partLines = invoice.repairOrder?.lines.filter((line) => line.type === "PART") ?? [];
  const partCost = partLines.reduce((sum, line) => sum + Number(line.part?.cost ?? 0) * line.quantity, 0);
  const missingPartCost = partLines.some((line) => !line.part);
  const discountPercent = Number(invoice.subtotal) > 0 ? Number(invoice.discount) / Number(invoice.subtotal) * 100 : 0;
  const percent = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(discountPercent);

  return <div className="mx-auto max-w-5xl space-y-5">
    <div><Link href="/admin/invoices" className="admin-text-link text-xs">← Hóa đơn</Link><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div><h1 className="admin-page-title">{invoice.code}</h1><p className="mt-1 text-sm text-[var(--admin-muted)]">Phát hành {dateTime(invoice.issuedAt)} · {invoice.customer.name}</p></div><Status tone={statusTone(invoice.status)}>{displayValue(invoice.status, "status", resourceConfig.invoices)}</Status></div></div>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <section className="admin-panel p-5"><h2 className="text-sm font-semibold">Thông tin hóa đơn</h2><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-[var(--admin-muted)]">Khách hàng</dt><dd className="mt-1 font-medium">{invoice.customer.name}</dd></div><div><dt className="text-[var(--admin-muted)]">Phương tiện</dt><dd className="mt-1 font-medium">{invoice.vehicle ? `${invoice.vehicle.plate} · ${invoice.vehicle.name}` : "—"}</dd></div><div><dt className="text-[var(--admin-muted)]">Phiếu sửa chữa</dt><dd className="mt-1 font-medium">{invoice.repairOrder ? <Link className="admin-text-link" href={`/admin/repair-orders/${invoice.repairOrder.id}`}>{invoice.repairOrder.code}</Link> : "Chứng từ cũ không liên kết phiếu"}</dd></div><div><dt className="text-[var(--admin-muted)]">Hạng hội viên hiện tại</dt><dd className="mt-1"><MembershipTierBadge tier={invoice.customer.tier} /></dd></div></dl></section>
        <section className="admin-panel overflow-hidden"><h2 className="border-b px-5 py-4 text-sm font-semibold">Chi tiết dịch vụ và phụ tùng</h2>{invoice.repairOrder ? <><div className="overflow-x-auto"><table className="app-table admin-table"><thead><tr><th>Hạng mục</th><th>Loại</th><th className="text-right!">SL</th><th className="text-right!">Đơn giá</th><th className="text-right!">Thành tiền</th></tr></thead><tbody>{invoice.repairOrder.lines.map((line) => <tr key={line.id}><td>{line.description}</td><td>{line.type === "PART" ? "Phụ tùng" : "Dịch vụ"}</td><td className="text-right!">{line.quantity}</td><td className="text-right!">{money(Number(line.unitPrice))}</td><td className="text-right!">{money(Number(line.total))}</td></tr>)}<tr><td className="font-medium">Tiền công</td><td>Công sửa chữa</td><td className="text-right!">1</td><td className="text-right!">{money(Number(invoice.repairOrder.laborCost))}</td><td className="text-right!">{money(Number(invoice.repairOrder.laborCost))}</td></tr></tbody></table></div><div className="grid gap-2 border-t bg-slate-50 px-5 py-4 text-sm sm:grid-cols-2"><p>Dịch vụ: <strong>{money(serviceTotal)}</strong></p><p>Phụ tùng: <strong>{money(partTotal)}</strong></p></div></> : <p className="p-5 text-sm text-[var(--admin-muted)]">Hóa đơn cũ không có chi tiết hạng mục liên kết.</p>}</section>
        <section className="admin-panel p-5"><h2 className="text-sm font-semibold">Lịch sử thanh toán</h2>{payments.length ? <div className="mt-4 divide-y rounded-lg border">{payments.map((payment) => <div key={payment.id} className="flex flex-wrap justify-between gap-2 p-3 text-sm"><div><p className="font-medium">{methods[payment.method] ?? payment.method}</p><p className="text-xs text-[var(--admin-muted)]">{payment.paidAt ? dateTime(payment.paidAt) : "Chưa có thời gian"} · {payment.code}</p></div><strong>{money(Number(payment.amount))}</strong></div>)}</div> : <p className="mt-3 text-sm text-[var(--admin-muted)]">Chưa ghi nhận thanh toán.</p>}</section>
      </div>
      <aside className="space-y-5"><section className="admin-panel p-5"><h2 className="text-sm font-semibold">Tổng thanh toán</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-2"><dt>Tạm tính</dt><dd>{money(Number(invoice.subtotal))}</dd></div><div className="flex justify-between gap-2"><dt>Ưu đãi đã áp dụng ({percent}%)</dt><dd>-{money(Number(invoice.discount))}</dd></div><div className="flex justify-between gap-2"><dt>Thuế{invoice.taxPercent !== null ? ` (${Number(invoice.taxPercent).toLocaleString("vi-VN")}%)` : ""}</dt><dd>{money(Number(invoice.tax))}</dd></div><div className="flex justify-between gap-2 border-t pt-3 font-semibold"><dt>Tổng hóa đơn</dt><dd>{money(Number(invoice.total))}</dd></div><div className="flex justify-between gap-2"><dt>Đã thanh toán</dt><dd className="text-emerald-700">{money(paid)}</dd></div><div className="flex justify-between gap-2 border-t pt-3 text-base font-semibold"><dt>Còn phải trả</dt><dd className="text-blue-800">{money(remaining)}</dd></div></dl></section>
        <section className="admin-panel p-5"><h2 className="text-sm font-semibold">Giá vốn phụ tùng</h2>{partLines.length ? <><div className="mt-3 space-y-3">{partLines.map((line) => <div key={line.id} className="flex justify-between gap-3 text-xs"><span className="min-w-0 text-slate-600">{line.description} · SL {line.quantity}</span><strong className="shrink-0">{line.part ? money(Number(line.part.cost) * line.quantity) : "Chưa có giá vốn"}</strong></div>)}</div><div className="mt-4 flex justify-between gap-3 border-t pt-3 text-sm font-semibold"><span>{missingPartCost ? "Giá vốn đã có" : "Tổng giá vốn"}</span><span>{money(partCost)}</span></div></> : <p className="mt-3 text-xs text-[var(--admin-muted)]">Hóa đơn không có phụ tùng.</p>}<p className="mt-3 text-xs text-[var(--admin-muted)]">Giá vốn lấy từ danh mục phụ tùng hiện tại; chi phí vận hành được theo dõi ở Báo cáo tài chính.</p></section>
        <InvoicePaymentForm invoiceId={invoice.id} remaining={remaining} status={invoice.status} /></aside>
    </div>
  </div>;
}
