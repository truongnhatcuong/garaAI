import { PageHeading, Status } from "@/components/ui/AppUi";
import type { LucideIcon } from "lucide-react";
export function EntityPage({ title, description, icon: Icon, columns, rows, action = "Thêm mới" }: { title: string; description: string; icon: LucideIcon; columns: string[]; rows: string[][]; action?: string }) {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <PageHeading title={title} description={description} actions={<button className="btn btn-primary">+ {action}</button>} />
      <div className="card p-4"><div className="flex flex-col gap-3 sm:flex-row"><input className="field flex-1" placeholder={`Tìm kiếm ${title.toLowerCase()}...`} /><select className="field"><option>Tất cả trạng thái</option><option>Đang hoạt động</option><option>Chờ xử lý</option></select><button className="btn btn-soft">Lọc dữ liệu</button></div></div>
      <div className="card overflow-x-auto"><table className="app-table"><thead><tr>{columns.map((x) => <th key={x}>{x}</th>)}<th>Thao tác</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((x, j) => <td key={j}>{j === 0 ? <span className="flex items-center gap-2 font-semibold"><Icon size={15} className="text-blue-700" />{x}</span> : j === r.length - 1 ? <Status tone={x.includes("Hoàn") || x.includes("Hoạt") ? "green" : "blue"}>{x}</Status> : x}</td>)}<td><button className="font-semibold text-blue-700">Xem chi tiết</button></td></tr>)}</tbody></table></div>
    </div>
  );
}
