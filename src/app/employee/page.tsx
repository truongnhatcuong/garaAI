import { redirect } from "next/navigation";
import { ClipboardList, Mail, Warehouse } from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { ChangePasswordForm } from "@/components/shared/ChangePasswordForm";
import { EmployeeLogoutButton } from "@/components/employee/EmployeeLogoutButton";
import { EmployeeBayList } from "@/components/employee/EmployeeBayList";
import { Status } from "@/components/ui/AppUi";
import { resourceConfig, displayValue } from "@/lib/resource-config";
import { statusTone } from "@/lib/status";
import { getPrisma } from "@/server/db";
import { getCurrentUser } from "@/server/services/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role !== "EMPLOYEE" || !user.employeeId || !user.employee) redirect("/");

  const db = getPrisma();
  const [orders, bays, completedCount] = await Promise.all([
    db.repairOrder.findMany({
      where: { technicianId: user.employeeId, deletedAt: null, status: { notIn: ["QUALITY_CHECK", "READY_FOR_PICKUP", "COMPLETED", "CANCELLED"] } },
      include: {
        customer: { select: { name: true, phone: true } },
        vehicle: { select: { name: true, plate: true } },
        advisor: { select: { name: true } },
        lines: { select: { id: true, type: true, description: true, quantity: true }, orderBy: { sortOrder: "asc" } },
      },
      orderBy: { updatedAt: "desc" }, take: 20,
    }),
    db.workshopBay.findMany({ where: { employeeId: user.employeeId, deletedAt: null }, include: { vehicle: { select: { name: true, plate: true } } }, orderBy: { code: "asc" } }),
    db.repairOrder.count({ where: { technicianId: user.employeeId, deletedAt: null, status: "COMPLETED" } }),
  ]);

  return <div className="min-h-dvh bg-slate-50">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3"><Brand /><EmployeeLogoutButton /></div></header>
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Không gian nhân viên</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Xin chào, {user.employee.name}</h1><p className="mt-1 text-sm text-slate-600">Công việc và khoang sửa chữa được phân cho bạn.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <section className="card p-5"><ClipboardList className="text-blue-700" size={20} /><p className="mt-3 text-2xl font-bold">{orders.length}</p><p className="text-sm text-slate-600">Phiếu đang xử lý</p></section>
        <section className="card p-5"><Warehouse className="text-blue-700" size={20} /><p className="mt-3 text-2xl font-bold">{bays.length}</p><p className="text-sm text-slate-600">Khoang được phân</p></section>
        <section className="card p-5"><ClipboardList className="text-emerald-700" size={20} /><p className="mt-3 text-2xl font-bold">{completedCount}</p><p className="text-sm text-slate-600">Phiếu đã hoàn tất</p></section>
      </div>
      <section className="card p-5">
        <h2 className="text-base font-semibold">Phiếu sửa chữa của tôi</h2>
        {orders.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{orders.map((order) => <article key={order.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">{order.code}</strong><Status tone={statusTone(order.status)}>{displayValue(order.status, "status", resourceConfig["repair-orders"])}</Status></div>
          <p className="mt-2 text-sm font-medium">{order.vehicle.name} · {order.vehicle.plate}</p>
          <div className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
            <p>Khách hàng: <span className="font-medium text-slate-900">{order.customer.name}{order.customer.phone ? ` · ${order.customer.phone}` : ""}</span></p>
            <p>Khoang: <span className="font-medium text-slate-900">{order.bayCode ?? "Chưa phân khoang"}</span></p>
            {order.odometerKm !== null && <p>ODO: <span className="font-medium text-slate-900">{order.odometerKm.toLocaleString("vi-VN")} km</span></p>}
            {order.advisor && <p>Cố vấn: <span className="font-medium text-slate-900">{order.advisor.name}</span></p>}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3"><h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dịch vụ và phụ tùng trên phiếu</h3>
            {order.lines.length ? <ul className="mt-2 space-y-1.5">{order.lines.map((line) => <li key={line.id} className="flex justify-between gap-3 text-sm"><span>{line.description}</span><span className="shrink-0 text-xs text-slate-500">{line.type === "PART" ? "Phụ tùng" : "Dịch vụ"} · SL {line.quantity}</span></li>)}</ul> : <p className="mt-2 text-xs text-slate-500">Phiếu chưa có dịch vụ hoặc phụ tùng.</p>}
          </div>
          {order.diagnosis && <p className="mt-3 whitespace-pre-wrap text-xs text-slate-600"><span className="font-semibold text-slate-900">Chẩn đoán:</span> {order.diagnosis}</p>}
          {order.notes && <p className="mt-2 whitespace-pre-wrap text-xs text-slate-600"><span className="font-semibold text-slate-900">Ghi chú:</span> {order.notes}</p>}
        </article>)}</div> : <p className="mt-3 text-sm text-slate-600">Chưa có phiếu đang xử lý.</p>}
      </section>
      <EmployeeBayList bays={bays} />
      <section className="card flex items-center gap-3 p-5"><Mail size={18} className="text-blue-700" /><p className="text-sm">Thông báo từ quản trị sẽ được gửi đến <strong>{user.email}</strong>.</p></section>
      <ChangePasswordForm />
    </main>
  </div>;
}
