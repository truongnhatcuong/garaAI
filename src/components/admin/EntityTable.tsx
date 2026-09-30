"use client";

import { useState } from "react";
import { Eye, Search, X } from "lucide-react";
import { Status } from "@/components/ui/AppUi";
import { Button } from "@/components/ui/button";
import { AdminEmptyState } from "@/components/admin/AdminStates";
import { TableAction } from "@/components/admin/TableAction";

const pageSize = 10;
const numericColumn = (column: string) => /^(chi tiêu|giá|tổng tiền|doanh thu|chi phí|lợi nhuận|odo|số xe)/i.test(column);
const statusTone = (value: string) => {
  if (/hoàn|hoạt|đã đến|xác nhận/i.test(value)) return "green";
  if (/chờ|đang sửa|đang xử lý/i.test(value)) return "amber";
  if (/hủy|quá hạn/i.test(value)) return "red";
  return "slate";
};

export function EntityTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[] | null>(null);
  const statuses = [...new Set(rows.map((row) => row[row.length - 1]))];
  const filtered = rows.filter((row) => row.join(" ").toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")) && (!status || row[row.length - 1] === status));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const updateQuery = (value: string) => { setQuery(value); setPage(1); };
  const updateStatus = (value: string) => { setStatus(value); setPage(1); };

  return <>
    <section className="admin-panel overflow-hidden" aria-label={`Danh sách ${title.toLowerCase()}`}>
      <div className="flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div><h2 className="text-sm font-semibold">Danh sách</h2><p className="mt-0.5 text-xs text-[var(--admin-muted)]" aria-live="polite">{filtered.length} bản ghi</p></div>
        <div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-[var(--admin-muted)]" /><input aria-label={`Tìm kiếm ${title.toLowerCase()}`} className="field w-full pl-9! sm:w-60" placeholder="Tìm trong danh sách" value={query} onChange={(event) => updateQuery(event.target.value)} /></div><select aria-label="Lọc trạng thái" className="field w-full sm:w-44" value={status} onChange={(event) => updateStatus(event.target.value)}><option value="">Tất cả trạng thái</option>{statuses.map((value) => <option key={value}>{value}</option>)}</select></div>
      </div>
      {visible.length ? <>
        <div className="hidden overflow-x-auto md:block" tabIndex={0} role="region" aria-label="Bảng dữ liệu, cuộn ngang để xem thêm"><table className="app-table admin-table"><thead><tr>{columns.map((column) => <th scope="col" key={column} className={numericColumn(column) ? "text-right!" : ""}>{column}</th>)}<th scope="col" className="text-right!">Thao tác</th></tr></thead><tbody>{visible.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((value, cell) => <td key={cell} className={numericColumn(columns[cell]) ? "text-right! tabular-nums" : ""}>{cell === 0 ? <span className="font-semibold">{value}</span> : cell === row.length - 1 ? <Status tone={statusTone(value)}>{value}</Status> : value}</td>)}<td className="text-right!"><TableAction label={`Xem ${row[0]}`} onClick={() => setSelected(row)}><Eye size={16} /></TableAction></td></tr>)}</tbody></table></div>
        <div className="divide-y md:hidden">{visible.map((row, index) => <button type="button" onClick={() => setSelected(row)} key={`${row[0]}-${index}`} className="block w-full px-4 py-3 text-left"><span className="flex items-center justify-between gap-2"><strong className="text-sm">{row[0]}</strong><Status tone={statusTone(row[row.length - 1])}>{row[row.length - 1]}</Status></span><span className="mt-1 block text-xs text-[var(--admin-muted)]">{row.slice(1, Math.min(row.length - 1, 3)).join(" · ")}</span></button>)}</div>
      </> : <AdminEmptyState title={rows.length ? "Không tìm thấy kết quả" : "Chưa có bản ghi"} description={rows.length ? "Thử từ khóa khác hoặc xóa bộ lọc." : "Các bản ghi mới sẽ hiển thị tại đây."} action={rows.length ? <Button className="btn btn-soft" onClick={() => { updateQuery(""); updateStatus(""); }}>Xóa bộ lọc</Button> : undefined} />}
      <div className="flex items-center justify-between gap-3 border-t px-4 py-2.5 text-xs text-[var(--admin-muted)]"><span>{filtered.length ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} / ${filtered.length}` : "0 bản ghi"}</span>{totalPages > 1 && <div className="flex gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="disabled:opacity-40">Trước</button><span>{currentPage} / {totalPages}</span><button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="disabled:opacity-40">Sau</button></div>}</div>
    </section>
    {selected && <section className="admin-panel p-4" aria-label="Chi tiết bản ghi"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">{selected[0]}</h2><Button variant="ghost" size="icon" aria-label="Đóng chi tiết" onClick={() => setSelected(null)}><X size={17} /></Button></div><dl className="mt-3 grid gap-x-6 gap-y-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">{columns.map((column, index) => <div key={column}><dt className="text-xs text-[var(--admin-muted)]">{column}</dt><dd className="mt-1 text-sm font-medium">{selected[index]}</dd></div>)}</dl></section>}
  </>;
}
