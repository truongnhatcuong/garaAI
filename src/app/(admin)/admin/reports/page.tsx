import { ExpenseManager } from "@/components/admin/ExpenseManager";
import Link from "next/link";
import { getPrisma } from "@/server/db";
import { syncTodayReport } from "@/server/services/financial-report";

const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;

export default async function Page() {
  const summary = await syncTodayReport();
  const [expenses, reports] = await Promise.all([
    getPrisma().expense.findMany({ where: { deletedAt: null, spentAt: { gte: summary.start, lt: summary.end } }, orderBy: { spentAt: "desc" } }),
    getPrisma().report.findMany({ where: { deletedAt: null }, orderBy: { periodStart: "desc" }, take: 20 }),
  ]);

  return <div className="mx-auto max-w-6xl space-y-5">
    <div><h1 className="admin-page-title">Báo cáo tài chính</h1><p className="mt-1 text-sm text-[var(--admin-muted)]">Tự cập nhật từ thanh toán hoàn tất và chi phí theo ngày Việt Nam.</p></div>
    <section className="grid gap-3 sm:grid-cols-3" aria-label="Tổng hợp hôm nay">
      {[["Doanh thu", summary.revenue.toNumber()], ["Chi phí", summary.cost.toNumber()], ["Thu nhập sau chi phí", summary.profit.toNumber()]].map(([label, amount]) => <div key={label} className="admin-panel p-5"><p className="text-sm text-[var(--admin-muted)]">{label}</p><strong className="mt-2 block text-2xl">{money(Number(amount))}</strong></div>)}
    </section>
    <p className="text-sm text-[var(--admin-muted)]">{summary.paymentCount} khoản thanh toán · Giá vốn phụ tùng: {money(summary.partCost.toNumber())} · Chi phí vận hành: {money(summary.expenseCost.toNumber())}. Giá vốn chỉ tính cho phụ tùng có liên kết trong phiếu sửa chữa; chưa ghi chi phí thì không tự ước lượng.</p>
    <ExpenseManager expenses={expenses.map((expense) => ({ id: expense.id, title: expense.title, amount: expense.amount.toNumber(), spentAt: expense.spentAt.toISOString() }))} />
    <section className="admin-panel overflow-hidden"><div className="flex items-center justify-between border-b p-4"><h2 className="text-base font-semibold">Lịch sử báo cáo</h2><Link href="/api/reports/export" prefetch={false} className="btn btn-soft">Xuất Excel</Link></div><div className="overflow-x-auto"><table className="app-table admin-table"><thead><tr><th>Ngày</th><th className="text-right!">Doanh thu</th><th className="text-right!">Chi phí</th><th className="text-right!">Thu nhập</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(report.periodStart)}</td><td className="text-right!">{money(report.revenue.toNumber())}</td><td className="text-right!">{money(report.cost.toNumber())}</td><td className="text-right!">{money(report.profit.toNumber())}</td></tr>)}</tbody></table></div></section>
  </div>;
}
