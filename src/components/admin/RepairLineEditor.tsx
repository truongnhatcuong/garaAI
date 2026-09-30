"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { RelationPicker } from "@/components/admin/RelationPicker";
import { notifyError, notifySuccess } from "@/lib/notify";

type Line = { id?: string; type: "SERVICE" | "PART"; catalogId?: string; label: string; unitPrice: number; quantity: number };
const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;

export function RepairLineEditor({ orderId, initialLines, initialLaborCost, editable }: { orderId: string; initialLines: Line[]; initialLaborCost: number; editable: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [laborCost, setLaborCost] = useState(String(initialLaborCost));
  const [pickerKey, setPickerKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setLines(initialLines); setLaborCost(String(initialLaborCost)); }, [initialLines, initialLaborCost]);

  async function addCatalog(type: Line["type"], catalogId: string) {
    if (!catalogId) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/${type === "SERVICE" ? "services" : "parts"}/${catalogId}`, { cache: "no-store" });
      const row = await response.json() as { title?: string; name?: string; price?: string | number; error?: string };
      if (!response.ok) throw new Error(row.error ?? "Không tải được hạng mục.");
      const unitPrice = Number(row.price);
      if (!Number.isFinite(unitPrice)) throw new Error("Giá hạng mục không hợp lệ.");
      setLines((current) => [...current, { type, catalogId, label: String(row.title ?? row.name ?? "Hạng mục"), unitPrice, quantity: 1 }]);
      setPickerKey((value) => value + 1);
    } catch (failure) { setError(notifyError(failure, "Không thêm được hạng mục.")); }
    finally { setBusy(false); }
  }

  async function save() {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/repair-orders/${orderId}/lines`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ laborCost: Number(laborCost || 0), lines: lines.map((line) => line.id ? { id: line.id, quantity: line.quantity, unitPrice: line.unitPrice } : { type: line.type, catalogId: line.catalogId, quantity: line.quantity, unitPrice: line.unitPrice }) }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không lưu được hạng mục.");
      notifySuccess("Đã cập nhật dịch vụ, phụ tùng và báo giá dự kiến.");
      setOpen(false); router.refresh();
    } catch (failure) { setError(notifyError(failure, "Không lưu được hạng mục.")); }
    finally { setBusy(false); }
  }

  if (!editable) return null;
  if (!open) return <button type="button" className="btn btn-soft m-4 text-xs" onClick={() => setOpen(true)}><Plus size={14} />Sửa dịch vụ, phụ tùng</button>;
  return <div className="space-y-4 border-t p-4">
    <p className="text-xs text-[var(--admin-muted)]">Thêm hạng mục từ danh mục; điều chỉnh số lượng, đơn giá và tiền công trước khi xuất hóa đơn.</p>
    <div className="grid gap-3 sm:grid-cols-2">
      <div><p className="mb-1.5 text-xs font-medium">Thêm dịch vụ</p><RelationPicker key={`service-${pickerKey}`} resource="services" label="Dịch vụ" value="" onChange={(id) => { if (id) void addCatalog("SERVICE", id); }} /></div>
      <div><p className="mb-1.5 text-xs font-medium">Thêm phụ tùng</p><RelationPicker key={`part-${pickerKey}`} resource="parts" label="Phụ tùng" value="" onChange={(id) => { if (id) void addCatalog("PART", id); }} /></div>
    </div>
    <div className="divide-y rounded-lg border border-slate-200">{lines.map((line, index) => <div key={line.id ?? `${line.type}-${line.catalogId}-${index}`} className="flex flex-wrap items-center gap-3 p-3"><div className="min-w-0 flex-1"><p className="text-sm font-medium">{line.label}</p><p className="text-xs text-[var(--admin-muted)]">{line.type === "SERVICE" ? "Dịch vụ" : "Phụ tùng"}</p></div><label className="text-xs">Số lượng<input aria-label={`Số lượng ${line.label}`} type="number" min={1} max={1000} className="field mt-1 w-20" value={line.quantity} onChange={(event) => setLines((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Number(event.target.value) } : item))} /></label><label className="text-xs">Đơn giá (₫)<input aria-label={`Đơn giá ${line.label}`} type="number" min={0} step={1} className="field mt-1 w-28" value={line.unitPrice} onChange={(event) => setLines((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, unitPrice: Number(event.target.value) } : item))} /></label><strong className="w-28 text-right text-sm">{money(line.unitPrice * line.quantity)}</strong><button type="button" aria-label={`Xóa ${line.label}`} className="rounded-md p-2 text-red-700 hover:bg-red-50" onClick={() => setLines((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={16} /></button></div>)}</div>
    <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg bg-slate-50 p-3"><label className="text-xs font-medium">Tiền công tự thêm (₫)<input type="number" min={0} step={1} className="field mt-1 w-44" value={laborCost} onChange={(event) => setLaborCost(event.target.value)} /></label><p className="text-right text-sm">Tổng chi phí phiếu <strong className="ml-2 text-lg text-blue-800">{money(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0) + Number(laborCost || 0))}</strong></p></div>
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
    <div className="flex justify-end gap-2"><button type="button" className="btn btn-soft" disabled={busy} onClick={() => { setLines(initialLines); setLaborCost(String(initialLaborCost)); setOpen(false); setError(""); }}>Hủy</button><button type="button" className="btn btn-primary" disabled={busy || !Number.isFinite(Number(laborCost)) || Number(laborCost) < 0 || lines.some((line) => !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 1000 || !Number.isFinite(line.unitPrice) || line.unitPrice < 0)} onClick={() => void save()}>{busy ? "Đang lưu…" : "Lưu hạng mục"}</button></div>
  </div>;
}
