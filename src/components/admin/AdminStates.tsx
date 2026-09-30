import type { ReactNode } from "react";

export function AdminEmptyState({ title = "Chưa có dữ liệu", description = "Các bản ghi mới sẽ hiển thị tại đây.", action }: { title?: string; description?: string; action?: ReactNode }) {
  return <div className="px-5 py-10 text-center" role="status"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs text-[var(--admin-muted)]">{description}</p>{action && <div className="mt-4">{action}</div>}</div>;
}

export function AdminLoadingState() {
  return <div role="status" aria-label="Đang tải dữ liệu" className="space-y-4"><span className="sr-only">Đang tải dữ liệu…</span><div className="admin-skeleton h-6 w-48" /><div className="admin-metrics grid grid-cols-2 border sm:grid-cols-3 xl:grid-cols-6">{Array.from({length: 6}, (_, index) => <div key={index} className="border-r p-4"><div className="admin-skeleton h-3 w-24 max-w-full" /><div className="admin-skeleton mt-3 h-7 w-12" /></div>)}</div><div className="admin-panel overflow-hidden"><div className="border-b p-4"><div className="admin-skeleton h-4 w-40" /></div><div className="border-b bg-slate-50 p-3"><div className="admin-skeleton h-3 w-full" /></div>{Array.from({length: 5}, (_, index) => <div key={index} className="grid grid-cols-4 gap-4 border-b p-4"><div className="admin-skeleton h-4" /><div className="admin-skeleton h-4" /><div className="admin-skeleton h-4" /><div className="admin-skeleton h-4" /></div>)}</div></div>;
}
