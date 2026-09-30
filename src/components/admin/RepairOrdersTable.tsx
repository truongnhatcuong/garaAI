"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Search } from "lucide-react";
import type { Repair } from "@/types";
import { Status } from "@/components/ui/AppUi";
import { AdminEmptyState } from "@/components/admin/AdminStates";

export function RepairOrdersTable({ rows }: { rows: Repair[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [technician, setTechnician] = useState("");
  const statuses = [...new Set(rows.map((row) => row.status))];
  const technicians = [...new Set(rows.map((row) => row.technician))];
  const filtered = rows.filter((row) => `${row.plate} ${row.customer} ${row.vehicle}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")) && (!status || row.status === status) && (!technician || row.technician === technician));
  return <section className="admin-panel overflow-hidden" aria-label="Danh sách phiếu sửa chữa">
    <div className="flex flex-col gap-3 border-b px-4 py-3 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-sm font-semibold">Danh sách phiếu</h2><p className="mt-0.5 text-xs text-[var(--admin-muted)]" aria-live="polite">{filtered.length} phiếu</p></div><div className="grid gap-2 sm:grid-cols-3"><div className="relative"><Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-[var(--admin-muted)]" /><input aria-label="Tìm biển số, khách hàng hoặc xe" className="field w-full pl-9! sm:w-56" placeholder="Biển số, khách hàng, xe" value={query} onChange={(event) => setQuery(event.target.value)} /></div><select aria-label="Lọc trạng thái" className="field" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tất cả trạng thái</option>{statuses.map((value) => <option key={value}>{value}</option>)}</select><select aria-label="Lọc kỹ thuật viên" className="field" value={technician} onChange={(event) => setTechnician(event.target.value)}><option value="">Tất cả KTV</option>{technicians.map((value) => <option key={value}>{value}</option>)}</select></div></div>
    {filtered.length ? <><div className="hidden overflow-x-auto md:block" tabIndex={0} role="region" aria-label="Bảng phiếu sửa chữa"><table className="app-table admin-table"><thead><tr><th scope="col">Giờ</th><th scope="col">Xe / biển số</th><th scope="col">Khách hàng</th><th scope="col">Kỹ thuật viên</th><th scope="col">Trạng thái</th><th scope="col" className="text-right!">Thao tác</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.plate}><td className="font-medium tabular-nums">{row.time}</td><td><strong>{row.plate}</strong><span className="mt-0.5 block text-xs text-[var(--admin-muted)]">{row.vehicle}</span></td><td>{row.customer}</td><td>{row.technician}</td><td><Status tone={row.tone}>{row.status}</Status></td><td className="text-right!">{row.plate === "43A-123.45" ? <Link href="/admin/repair-orders/SC-2024-0891" title="Xem phiếu sửa chữa" aria-label="Xem phiếu sửa chữa" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"><Eye size={16} /></Link> : <span className="text-xs text-[var(--admin-muted)]">—</span>}</td></tr>)}</tbody></table></div><div className="divide-y md:hidden">{filtered.map((row) => <div className="px-4 py-3" key={row.plate}><div className="flex items-start justify-between gap-2"><div><strong>{row.plate}</strong><p className="mt-0.5 text-xs text-[var(--admin-muted)]">{row.vehicle} · {row.customer}</p></div><span className="text-xs tabular-nums">{row.time}</span></div><div className="mt-2 flex items-center justify-between gap-2"><Status tone={row.tone}>{row.status}</Status>{row.plate === "43A-123.45" && <Link href="/admin/repair-orders/SC-2024-0891" title="Xem phiếu sửa chữa" aria-label="Xem phiếu sửa chữa" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"><Eye size={16} /></Link>}</div></div>)}</div></> : <AdminEmptyState title="Không có phiếu phù hợp" description="Thử từ khóa hoặc bộ lọc khác." />}
    <div className="border-t px-4 py-2.5 text-xs text-[var(--admin-muted)]">{filtered.length} / {rows.length} phiếu</div>
  </section>;
}
