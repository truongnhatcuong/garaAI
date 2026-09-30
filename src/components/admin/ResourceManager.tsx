"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowDown, ArrowRight, ArrowUp, Download, Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { displayValue, fieldValue, resourceConfig, type ResourceKey } from "@/lib/resource-config";
import { ResourceFormDialog } from "@/components/admin/ResourceFormDialog";
import { AdminEmptyState } from "@/components/admin/AdminStates";
import { TableAction } from "@/components/admin/TableAction";
import { notifyError, notifySuccess } from "@/lib/notify";
import { Status } from "@/components/ui/AppUi";
import { MembershipTierBadge } from "@/components/shared/MembershipTierBadge";
import { statusTone } from "@/lib/status";

type Row = Record<string, unknown> & { id: string };
type ListResponse = { items: Row[]; pagination: { page: number; pageSize: number; total: number; totalPages: number }; error?: string };
const emptyList: ListResponse = { items: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } };
const rowLabel = (row: Row) => String(row.name ?? row.title ?? row.plate ?? row.code ?? row.sku ?? row.id);

function AppointmentNextAction({ row, onNavigate }: { row: Row; onNavigate: (href: string) => void }) {
  const linked = row.repairOrder as { id: string; code: string; deletedAt: string | null } | null;
  if (linked?.deletedAt) return <span className="self-center text-xs text-slate-500">Phiếu đã ẩn</span>;
  if (linked) return <button type="button" className="btn btn-soft text-xs" onClick={() => onNavigate(`/admin/repair-orders/${linked.id}`)}>Mở phiếu {linked.code}<ArrowRight size={14} /></button>;
  if (["CANCELLED", "COMPLETED"].includes(String(row.status))) return null;
  return <button type="button" className="btn btn-primary text-xs" onClick={() => onNavigate(`/admin/repair-orders/new?appointmentId=${encodeURIComponent(row.id)}`)}>Tiếp nhận → Tạo phiếu</button>;
}

export function ResourceManager({ resource, embedded = false }: { resource: ResourceKey; embedded?: boolean }) {
  const config = resourceConfig[resource];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = searchParams.toString();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [list, setList] = useState<ListResponse>(emptyList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const [form, setForm] = useState<{ mode: "create" | "edit"; record?: Row } | null>(null);
  const [detail, setDetail] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [working, setWorking] = useState(false);
  const query = searchParams.get("search") ?? "";
  useEffect(() => { setSearch(query); }, [query]);
  const updateParams = useCallback((changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) { if (value) next.set(key, value); else next.delete(key); }
    if (!("page" in changes)) next.delete("page");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  }, [params, pathname, router]);
  useEffect(() => {
    if (search === query) return;
    const timer = setTimeout(() => updateParams({ search }), 350);
    return () => clearTimeout(timer);
  }, [search, query, updateParams]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    fetch(`/api/${resource}?${params}`, { cache: "no-store", signal: controller.signal }).then(async (response) => {
      const data = await response.json() as ListResponse;
      if (!response.ok) throw new Error(data.error ?? "Không tải được dữ liệu.");
      setList(data);
    }).catch((failure: unknown) => { if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Không tải được dữ liệu."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [resource, params, version]);
  useEffect(() => {
    if (resource !== "bays") return;
    let active = true;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      fetch(`/api/bays?${params}`, { cache: "no-store" })
        .then(async (response) => {
          const data = await response.json() as ListResponse;
          if (response.ok && active) setList(data);
        })
        .catch(() => {});
    }, 15000);
    return () => { active = false; window.clearInterval(timer); };
  }, [resource, params]);
  async function openDetail(row: Row) {
    try {
      const response = await fetch(`/api/${resource}/${row.id}`, { cache: "no-store" });
      const data = await response.json() as Row & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Không tải được chi tiết.");
      setDetail(data);
    } catch (failure) { notifyError(failure, "Không tải được chi tiết."); }
  }
  async function remove() {
    if (!deleting) return;
    setWorking(true);
    try {
      const response = await fetch(`/api/${resource}/${deleting.id}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Không xóa được dữ liệu.");
      setDeleting(null); setVersion((value) => value + 1); notifySuccess(`Đã xóa ${config.singular}.`);
    } catch (failure) { notifyError(failure, "Không xóa được dữ liệu."); }
    finally { setWorking(false); }
  }
  async function exportExcel() {
    try {
      const response = await fetch(`/api/${resource}/export?${params}`);
      if (!response.ok) { const data = await response.json() as { error?: string }; throw new Error(data.error ?? "Không xuất được Excel."); }
      const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `autocare-${resource}.xlsx`; link.click(); URL.revokeObjectURL(url);
      notifySuccess("Đã xuất Excel theo bộ lọc hiện tại.");
    } catch (failure) { notifyError(failure, "Không xuất được Excel."); }
  }
  const sort = searchParams.get("sort") ?? config.defaultSort;
  const direction = searchParams.get("direction") ?? "desc";
  const page = list.pagination.page;
  return <div className="space-y-4">
    {resource === "invoices" && <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">Hóa đơn được xuất từ phiếu sửa chữa đã hoàn tất. Mở phiếu để xuất hóa đơn; xem chi tiết hóa đơn để ghi nhận thanh toán.</p>}
    {!embedded && <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="admin-page-title">{config.title}</h1><p className="mt-1 text-xs text-[var(--admin-muted)]">Quản lý {config.singular} và hồ sơ liên quan.</p></div><button type="button" className={resource === "invoices" ? "hidden" : "btn btn-primary"} onClick={() => resource === "repair-orders" ? router.push("/admin/repair-orders/new") : setForm({ mode: "create" })}><Plus size={15} />{resource === "repair-orders" ? "Tạo phiếu trực tiếp" : "Thêm mới"}</button></div>}
    <section className="admin-panel overflow-hidden" aria-label={`Danh sách ${config.title}`}>
      <div className="flex flex-col gap-3 border-b p-4 xl:flex-row xl:items-center xl:justify-between"><div className="flex items-center gap-3"><h2 className="text-sm font-semibold">{embedded ? config.title : "Danh sách"}</h2><span className="text-xs text-[var(--admin-muted)]">{list.pagination.total} bản ghi</span></div><div className="flex flex-wrap gap-2"><div className="relative min-w-[180px] flex-1 xl:w-56 xl:flex-none"><Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-[var(--admin-muted)]" /><input aria-label={`Tìm ${config.singular}`} className="field w-full pl-9!" placeholder="Tìm kiếm" value={search} onChange={(event) => setSearch(event.target.value)} /></div>{config.statusOptions && <select aria-label="Lọc trạng thái" className="field max-w-[180px] flex-1" value={searchParams.get("status") ?? ""} onChange={(event) => updateParams({ status: event.target.value })}><option value="">Tất cả trạng thái</option>{config.statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>}{resource === "parts" && <select aria-label="Lọc tồn kho" className="field" value={searchParams.get("stock") ?? "all"} onChange={(event) => updateParams({ stock: event.target.value === "all" ? null : event.target.value })}><option value="all">Tất cả tồn kho</option><option value="low">Dưới mức tối thiểu</option></select>}{config.dateField && <><input aria-label="Từ ngày" type="date" className="field" value={searchParams.get("from") ?? ""} onChange={(event) => updateParams({ from: event.target.value })} /><input aria-label="Đến ngày" type="date" className="field" value={searchParams.get("to") ?? ""} onChange={(event) => updateParams({ to: event.target.value })} /></>}{config.exportable && <button type="button" onClick={exportExcel} className="btn btn-soft"><Download size={14} />Xuất Excel</button>}{embedded && <button type="button" className={resource === "invoices" ? "hidden" : "btn btn-primary"} onClick={() => resource === "repair-orders" ? router.push("/admin/repair-orders/new") : setForm({ mode: "create" })}><Plus size={15} />Thêm</button>}</div></div>
      {error ? <div className="px-4 py-9 text-center" role="alert"><p className="text-sm text-red-700">{error}</p><button className="btn btn-soft mt-3" onClick={() => setVersion((value) => value + 1)}>Thử lại</button></div> : loading ? <div role="status" aria-label="Đang tải" className="space-y-0">{Array.from({ length: 5 }, (_, index) => <div className="flex gap-4 border-b px-4 py-4" key={index}><div className="admin-skeleton h-4 w-28" /><div className="admin-skeleton h-4 w-40" /><div className="admin-skeleton h-4 w-28" /></div>)}</div> : list.items.length ? <><div className="hidden overflow-x-auto md:block" tabIndex={0} role="region" aria-label="Bảng dữ liệu"><table className="app-table admin-table"><thead><tr>{config.columns.map((column) => <th key={column.key} scope="col" className={column.numeric ? "text-right!" : ""}>{config.sortFields.includes(column.key) ? <button type="button" className="inline-flex items-center gap-1" onClick={() => updateParams({ sort: column.key, direction: sort === column.key && direction === "asc" ? "desc" : "asc" })}>{column.label}{sort === column.key ? direction === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} /> : null}</button> : column.label}</th>)}<th scope="col" className="text-right!">Thao tác</th></tr></thead><tbody>{list.items.map((row) => <tr key={row.id}>{config.columns.map((column) => <td key={column.key} className={column.numeric ? "text-right! tabular-nums" : ""}>{column.key === "status" ? <Status tone={statusTone(String(fieldValue(row, "status") ?? ""))}>{displayValue(fieldValue(row, "status"), "status", config)}</Status> : resource === "customers" && column.key === "tier" ? <MembershipTierBadge tier={row.tier} /> : displayValue(fieldValue(row, column.key), column.key, config)}</td>)}<td className="text-right!"><div className="flex justify-end gap-1">{resource === "appointments" && <AppointmentNextAction row={row} onNavigate={(href) => router.push(href)} />}<TableAction label={`Xem ${rowLabel(row)}`} onClick={() => resource === "repair-orders" ? router.push(`/admin/repair-orders/${row.id}`) : resource === "invoices" ? router.push(`/admin/invoices/${row.id}`) : void openDetail(row)}><Eye size={16} /></TableAction>{resource !== "invoices" && <><TableAction label={`Sửa ${rowLabel(row)}`} onClick={() => setForm({ mode: "edit", record: row })}><Pencil size={16} /></TableAction><TableAction label={`Xóa ${rowLabel(row)}`} danger onClick={() => setDeleting(row)}><Trash2 size={16} /></TableAction></>}</div></td></tr>)}</tbody></table></div><div className="divide-y md:hidden">{list.items.map((row) => <div key={row.id} className="flex items-start justify-between gap-2 px-4 py-3"><button onClick={() => resource === "repair-orders" ? router.push(`/admin/repair-orders/${row.id}`) : resource === "invoices" ? router.push(`/admin/invoices/${row.id}`) : void openDetail(row)} className="min-w-0 flex-1 text-left"><strong className="text-sm">{displayValue(fieldValue(row, config.columns[0].key), config.columns[0].key, config)}</strong><span className="mt-1 block text-xs text-[var(--admin-muted)]">{config.columns.slice(1, 3).map((column) => displayValue(fieldValue(row, column.key), column.key, config)).join(" · ")}</span>{resource === "customers" && <span className="mt-2 flex flex-wrap items-center gap-2"><MembershipTierBadge tier={row.tier} /><span className="text-xs text-[var(--admin-muted)]">{displayValue(row.repairCount, "repairCount")} lần sửa hoàn tất</span></span>}{config.statusOptions && <span className="mt-2 block"><Status tone={statusTone(String(fieldValue(row, "status") ?? ""))}>{displayValue(fieldValue(row, "status"), "status", config)}</Status></span>}</button><div className={resource === "appointments" ? "flex max-w-[55%] flex-wrap justify-end gap-1" : "flex shrink-0 gap-1"}>{resource === "appointments" && <AppointmentNextAction row={row} onNavigate={(href) => router.push(href)} />}<TableAction label={`Xem ${rowLabel(row)}`} onClick={() => resource === "repair-orders" ? router.push(`/admin/repair-orders/${row.id}`) : resource === "invoices" ? router.push(`/admin/invoices/${row.id}`) : void openDetail(row)}><Eye size={16} /></TableAction>{resource !== "invoices" && <><TableAction label={`Sửa ${rowLabel(row)}`} onClick={() => setForm({ mode: "edit", record: row })}><Pencil size={16} /></TableAction><TableAction label={`Xóa ${rowLabel(row)}`} danger onClick={() => setDeleting(row)}><Trash2 size={16} /></TableAction></>}</div></div>)}</div></> : <AdminEmptyState title="Chưa có kết quả" description="Thử đổi bộ lọc hoặc thêm bản ghi mới." action={<button className={resource === "invoices" ? "hidden" : "btn btn-primary"} onClick={() => resource === "repair-orders" ? router.push("/admin/repair-orders/new") : setForm({ mode: "create" })}>Thêm {config.singular}</button>} />}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5 text-xs text-[var(--admin-muted)]"><span>{list.pagination.total ? `${(page - 1) * list.pagination.pageSize + 1}–${Math.min(page * list.pagination.pageSize, list.pagination.total)} / ${list.pagination.total}` : "0 bản ghi"}</span><div className="flex items-center gap-2"><select aria-label="Số dòng mỗi trang" className="field h-8!" value={searchParams.get("pageSize") ?? "20"} onChange={(event) => updateParams({ pageSize: event.target.value })}><option value="10">10 / trang</option><option value="20">20 / trang</option><option value="50">50 / trang</option></select><button type="button" className="btn btn-soft h-8!" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })}>Trước</button><span>{page} / {Math.max(1, list.pagination.totalPages)}</span><button type="button" className="btn btn-soft h-8!" disabled={page >= list.pagination.totalPages} onClick={() => updateParams({ page: String(page + 1) })}>Sau</button></div></div>
    </section>
    {form && <ResourceFormDialog resource={resource} mode={form.mode} record={form.record} onClose={() => setForm(null)} onSaved={(message) => { setForm(null); setVersion((value) => value + 1); notifySuccess(message); }} />}
    {detail && <Dialog.Root open onOpenChange={(open) => { if (!open) setDetail(null); }}><Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" /><Dialog.Popup className="admin-theme fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[min(580px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border bg-white shadow-xl"><div className="flex items-center justify-between border-b px-5 py-4"><Dialog.Title className="text-base font-semibold">{rowLabel(detail)}</Dialog.Title><Dialog.Close aria-label="Đóng" className="p-1"><X size={18} /></Dialog.Close></div><dl className="grid gap-x-6 gap-y-4 p-5 sm:grid-cols-2">{config.fields.map((field) => <div key={field.name}><dt className="text-xs text-[var(--admin-muted)]">{field.label}</dt><dd className="mt-1 text-sm font-medium">{field.name === "status" ? <Status tone={statusTone(String(detail.status ?? ""))}>{displayValue(detail.status, "status", config)}</Status> : resource === "customers" && field.name === "tier" ? <MembershipTierBadge tier={detail.tier} /> : field.relation ? displayValue(fieldValue(detail, `${field.name.slice(0,-2)}.${field.relation === "services" ? "title" : resourceConfig[field.relation].columns[0].key}`), field.name) : displayValue(detail[field.name], field.name, config)}</dd></div>)}{resource === "customers" && <div><dt className="text-xs text-[var(--admin-muted)]">Lần sửa hoàn tất</dt><dd className="mt-1 text-sm font-medium">{displayValue(detail.repairCount, "repairCount")}</dd></div>}</dl><div className="flex justify-end gap-2 border-t px-5 py-3">{resource === "appointments" && <AppointmentNextAction row={detail} onNavigate={(href) => { setDetail(null); router.push(href); }} />}<button className="btn btn-soft" onClick={() => { setForm({ mode: "edit", record: detail }); setDetail(null); }}>Sửa</button></div></Dialog.Popup></Dialog.Portal></Dialog.Root>}
    {deleting && <Dialog.Root open onOpenChange={(open) => { if (!open && !working) setDeleting(null); }}><Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" /><Dialog.Popup className="admin-theme fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-5 shadow-xl"><Dialog.Title className="text-base font-semibold">Xóa {config.singular}?</Dialog.Title><p className="mt-2 text-sm text-[var(--admin-muted)]">{rowLabel(deleting)} sẽ được ẩn khỏi danh sách. Lịch sử liên quan vẫn được giữ lại.</p><div className="mt-5 flex justify-end gap-2"><button type="button" className="btn btn-soft" onClick={() => setDeleting(null)}>Hủy</button><button type="button" disabled={working} onClick={() => void remove()} className="btn border border-red-700 bg-red-700 text-white disabled:opacity-50">Xóa</button></div></Dialog.Popup></Dialog.Portal></Dialog.Root>}
  </div>;
}
