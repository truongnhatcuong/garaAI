import { inventory } from "@/lib/mock-data";
import { InventoryTable } from "@/components/admin/InventoryTable";
import { Status } from "@/components/ui/AppUi";

const bays = [
  ["01", "Mazda CX-5", "43A-445.67", "80% Xong", "Hoàng Nam"],
  ["02", "Toyota Fortuner", "92A-332.11", "45% Sửa chữa", "Tuấn Kiệt"],
  ["03", "Mazda 3", "43A-123.45", "Chờ duyệt BG", "Quốc Bảo"],
  ["04", "Honda CR-V", "43A-899.01", "90% Hoàn thiện", "Văn Thành"],
  ["05", "BMW 320i LCI", "43A-776.54", "30% AI Scan", "Hùng VK"],
  ["06", "Kia Carnival 3.5", "43E-112.33", "60% Tuần hoàn", "Đình Trọng"],
  ["07", "Mercedes C200", "92A-888.99", "KCS 18 Hạng mục", "Minh Tuấn"],
  ["08", "Toyota Corolla Cross", "43A-678.90", "Sẵn sàng giao", "Hữu Tài"],
] as const;

export function InventoryPage() {
  const critical = inventory.filter((item) => item.critical).length;
  return <div className="mx-auto max-w-[1500px] space-y-5">
    <div><h1 className="admin-page-title">Kho phụ tùng & khoang sửa chữa</h1><p className="mt-1 text-xs text-[var(--admin-muted)]">Chi nhánh Đà Nẵng Trung Tâm</p></div>
    <div className="admin-panel grid grid-cols-2 divide-x divide-y overflow-hidden border sm:grid-cols-4 sm:divide-y-0"><div className="p-4"><span className="text-xs text-[var(--admin-muted)]">Khoang đang sử dụng</span><strong className="mt-2 block text-xl font-semibold">{bays.length} / {bays.length}</strong></div><div className="p-4"><span className="text-xs text-[var(--admin-muted)]">Kỹ thuật viên được phân công</span><strong className="mt-2 block text-xl font-semibold">{new Set(bays.map((bay) => bay[4])).size}</strong></div><div className="p-4"><span className="text-xs text-[var(--admin-muted)]">Mã phụ tùng trong danh sách</span><strong className="mt-2 block text-xl font-semibold">{inventory.length}</strong></div><div className="p-4"><span className="text-xs text-[var(--admin-muted)]">Dưới mức tối thiểu</span><strong className="admin-stock-critical mt-2 block text-xl font-semibold">{critical}</strong></div></div>
    <section className="admin-panel overflow-hidden" aria-label="Tình trạng khoang sửa chữa"><div className="border-b px-4 py-3"><h2 className="text-sm font-semibold">Khoang sửa chữa</h2><p className="mt-0.5 text-xs text-[var(--admin-muted)]">Phân công hiện có tại 8 khoang</p></div><div className="hidden overflow-x-auto md:block" tabIndex={0} role="region" aria-label="Bảng khoang sửa chữa"><table className="app-table admin-table"><thead><tr><th scope="col">Khoang</th><th scope="col">Xe / biển số</th><th scope="col">Kỹ thuật viên</th><th scope="col">Trạng thái</th></tr></thead><tbody>{bays.map(([id, car, plate, state, technician]) => <tr key={id}><td className="font-semibold">{id}</td><td><span className="font-medium">{car}</span><span className="mt-0.5 block text-xs text-[var(--admin-muted)]">{plate}</span></td><td>{technician}</td><td><Status tone={state.includes("Chờ") ? "amber" : state.includes("Sẵn") ? "green" : "slate"}>{state}</Status></td></tr>)}</tbody></table></div><div className="divide-y md:hidden">{bays.map(([id, car, plate, state, technician]) => <div className="flex items-start justify-between gap-3 px-4 py-3" key={id}><div><p className="text-xs text-[var(--admin-muted)]">Khoang {id} · {technician}</p><p className="mt-0.5 text-sm font-semibold">{car}</p><p className="mt-0.5 text-xs text-[var(--admin-muted)]">{plate}</p></div><Status tone={state.includes("Chờ") ? "amber" : state.includes("Sẵn") ? "green" : "slate"}>{state}</Status></div>)}</div></section>
    <InventoryTable items={inventory} />
  </div>;
}
