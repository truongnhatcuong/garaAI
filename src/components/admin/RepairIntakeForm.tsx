"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Plus, Trash2, Wrench } from "lucide-react";
import { RelationPicker } from "@/components/admin/RelationPicker";
import { RepairBaySelect } from "@/components/admin/RepairBaySelect";
import { notifyError, notifySuccess } from "@/lib/notify";

type AppointmentPrefill = {
  id: string;
  code: string;
  customer: { id: string; name: string; phone: string | null; email: string | null };
  vehicle: { id: string; plate: string; name: string; customerId: string | null };
  service: { id: string; title: string; price: number } | null;
  notes: string | null;
  startsAt: string;
};
type DraftLine = { type: "SERVICE" | "PART"; catalogId: string; label: string; unitPrice: number; quantity: number };
const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;

export function RepairIntakeForm({ appointment }: { appointment: AppointmentPrefill | null }) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(appointment?.customer.id ?? "");
  const [vehicleId, setVehicleId] = useState(appointment?.vehicle.id ?? "");
  const [advisorId, setAdvisorId] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [bayCode, setBayCode] = useState("");
  const [odometerKm, setOdometerKm] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState(appointment?.notes ?? "");
  const [laborCost, setLaborCost] = useState("0");
  const [lines, setLines] = useState<DraftLine[]>(appointment?.service ? [{ type: "SERVICE", catalogId: appointment.service.id, label: appointment.service.title, unitPrice: appointment.service.price, quantity: 1 }] : []);
  const [pickerKey, setPickerKey] = useState(0);
  const [addingCatalog, setAddingCatalog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const serviceTotal = lines.filter((line) => line.type === "SERVICE").reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const partTotal = lines.filter((line) => line.type === "PART").reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const estimate = serviceTotal + partTotal + Number(laborCost || 0);

  async function addCatalog(type: DraftLine["type"], id: string) {
    if (!id) return;
    setAddingCatalog(true);
    try {
      const response = await fetch(`/api/${type === "SERVICE" ? "services" : "parts"}/${id}`, { cache: "no-store" });
      const row = await response.json() as { title?: string; name?: string; price?: string | number; error?: string };
      if (!response.ok) throw new Error(row.error ?? "Không tải được hạng mục.");
      const price = Number(row.price);
      if (!Number.isFinite(price)) throw new Error("Giá hạng mục không hợp lệ.");
      setLines((current) => {
        const found = current.find((line) => line.type === type && line.catalogId === id);
        if (found) return current.map((line) => line === found ? { ...line, quantity: line.quantity + 1 } : line);
        return [...current, { type, catalogId: id, label: String(row.title ?? row.name ?? "Hạng mục"), unitPrice: price, quantity: 1 }];
      });
      setPickerKey((value) => value + 1);
    } catch (failure) { notifyError(failure, "Không thêm được hạng mục."); }
    finally { setAddingCatalog(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customerId || !vehicleId) { setError("Chọn khách hàng và xe trước khi tạo phiếu."); return; }
    if (bayCode && !technicianId) { setError("Chọn kỹ thuật viên trước khi phân khoang."); return; }
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/admin/repair-intake", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(appointment ? { appointmentId: appointment.id } : {}),
          customerId, vehicleId,
          ...(advisorId ? { advisorId } : {}),
          ...(technicianId ? { technicianId } : {}),
          ...(bayCode ? { bayCode } : {}),
          ...(odometerKm ? { odometerKm: Number(odometerKm) } : {}),
          laborCost: Number(laborCost || 0),
          ...(diagnosis.trim() ? { diagnosis: diagnosis.trim() } : {}),
          ...(notes.trim() ? { notes: notes.trim() } : {}),
          lines: lines.map(({ type, catalogId, quantity }) => ({ type, catalogId, quantity })),
        }),
      });
      const result = await response.json() as { id?: string; code?: string; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error ?? "Không tạo được phiếu.");
      notifySuccess(`Đã tạo phiếu ${result.code ?? "sửa chữa"}.`);
      router.push(`/admin/repair-orders/${result.id}`);
      router.refresh();
    } catch (failure) { setError(notifyError(failure, "Không tạo được phiếu.")); }
    finally { setSaving(false); }
  }

  return <form onSubmit={(event) => void submit(event)} className="space-y-5">
    {appointment && <div className="flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"><ClipboardCheck size={18} /><strong>Lịch {appointment.code}</strong><span>· {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(appointment.startsAt))}</span><span className="text-blue-700">· Dịch vụ đã đặt được đưa vào phiếu, có thể điều chỉnh sau khi kiểm tra xe.</span></div>}
    <section className="admin-panel p-5">
      <h2 className="text-sm font-semibold">01 · Khách hàng và xe</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {appointment ? <><div><p className="text-xs text-[var(--admin-muted)]">Khách hàng</p><p className="mt-1 font-medium">{appointment.customer.name}{appointment.customer.phone ? ` · ${appointment.customer.phone}` : ""}</p></div><div><p className="text-xs text-[var(--admin-muted)]">Phương tiện</p><p className="mt-1 font-medium">{appointment.vehicle.plate} · {appointment.vehicle.name}</p></div></> : <>
          <div><p className="mb-1.5 text-xs font-medium">Khách hàng *</p><RelationPicker resource="customers" label="Khách hàng" value={customerId} onChange={(id) => { setCustomerId(id); setVehicleId(""); setBayCode(""); }} /></div>
          <div><p className="mb-1.5 text-xs font-medium">Phương tiện *</p><RelationPicker key={customerId} resource="vehicles" label="Phương tiện" value={vehicleId} onChange={(id) => { setVehicleId(id); setBayCode(""); }} /></div>
        </>}
      </div>
      {!appointment && <p className="mt-3 text-xs text-[var(--admin-muted)]">Chưa có hồ sơ? <Link className="admin-text-link" href="/admin/customers" target="_blank">Thêm khách hàng</Link> và <Link className="admin-text-link" href="/admin/vehicles" target="_blank">thêm xe</Link> trong tab mới, rồi quay lại tìm trong ô chọn.</p>}
    </section>
    <section className="admin-panel p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold"><Wrench size={17} className="text-blue-700" />02 · Dịch vụ và phụ tùng</h2>
      <p className="mt-1 text-xs text-[var(--admin-muted)]">Chọn từ danh mục. Giá được lưu theo thời điểm lập phiếu; số lượng có thể điều chỉnh trước khi lưu.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div><p className="mb-1.5 text-xs font-medium">Thêm dịch vụ</p><RelationPicker key={`service-${pickerKey}`} resource="services" label="Dịch vụ" value="" onChange={(id) => { if (id) void addCatalog("SERVICE", id); }} /></div>
        <div><p className="mb-1.5 text-xs font-medium">Thêm phụ tùng</p><RelationPicker key={`part-${pickerKey}`} resource="parts" label="Phụ tùng" value="" onChange={(id) => { if (id) void addCatalog("PART", id); }} /></div>
      </div>
      {addingCatalog && <p className="mt-2 text-xs text-blue-700">Đang thêm hạng mục…</p>}
      {lines.length ? <div className="mt-4 divide-y rounded-lg border border-slate-200">{lines.map((line) => <div key={`${line.type}-${line.catalogId}`} className="flex flex-wrap items-center gap-3 p-3"><div className="min-w-0 flex-1"><p className="text-sm font-medium">{line.label}</p><p className="text-xs text-[var(--admin-muted)]">{line.type === "SERVICE" ? "Dịch vụ" : "Phụ tùng"} · {money(line.unitPrice)} / đơn vị</p></div><label className="text-xs">Số lượng<input aria-label={`Số lượng ${line.label}`} type="number" min={1} max={1000} required className="field mt-1 w-20" value={line.quantity} onChange={(event) => setLines((current) => current.map((item) => item === line ? { ...item, quantity: Number(event.target.value) } : item))} /></label><strong className="w-28 text-right text-sm">{money(line.unitPrice * line.quantity)}</strong><button type="button" aria-label={`Xóa ${line.label}`} className="rounded-md p-2 text-red-700 hover:bg-red-50" onClick={() => setLines((current) => current.filter((item) => item !== line))}><Trash2 size={16} /></button></div>)}</div> : <p className="mt-4 rounded-lg border border-dashed p-4 text-sm text-[var(--admin-muted)]">Chưa có hạng mục. Có thể lưu phiếu tiếp nhận rồi bổ sung sau khi chẩn đoán.</p>}
      <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-[1fr_auto]">
        <div><p>Dịch vụ: <strong>{money(serviceTotal)}</strong></p><p className="mt-1">Phụ tùng: <strong>{money(partTotal)}</strong></p></div>
        <label className="text-xs font-medium">Tiền công tự thêm<input type="number" min={0} step={1} className="field mt-1 w-44" value={laborCost} onChange={(event) => setLaborCost(event.target.value)} /></label>
        <p className="border-t pt-3 font-semibold sm:col-span-2 sm:text-right">Tổng chi phí phiếu <span className="ml-3 text-lg text-blue-800">{money(estimate)}</span></p>
      </div>
    </section>
    <section className="admin-panel p-5">
      <h2 className="text-sm font-semibold">03 · Phân công và ghi nhận</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><p className="mb-1.5 text-xs font-medium">Cố vấn</p><RelationPicker resource="employees" label="Cố vấn" value={advisorId} onChange={setAdvisorId} /></div>
        <div><p className="mb-1.5 text-xs font-medium">Kỹ thuật viên</p><RelationPicker resource="employees" label="Kỹ thuật viên" value={technicianId} onChange={(id) => { setTechnicianId(id); setBayCode(""); }} /></div>
        <div><p className="text-xs font-medium">Khoang sửa chữa</p><RepairBaySelect value={bayCode} vehicleId={vehicleId} technicianId={technicianId} currentBayCode="" onChange={setBayCode} /><p className="mt-1 text-[11px] text-[var(--admin-muted)]">Để trống nếu xe chưa vào sửa; phiếu sẽ ở trạng thái Tiếp nhận.</p></div>
        <label className="text-xs font-medium">ODO (km)<input type="number" min={0} className="field mt-1.5 w-full" value={odometerKm} onChange={(event) => setOdometerKm(event.target.value)} /></label>
        <label className="text-xs font-medium sm:col-span-2">Chẩn đoán ban đầu<textarea className="field mt-1.5 min-h-20 w-full py-2" maxLength={5000} value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} /></label>
        <label className="text-xs font-medium sm:col-span-2">Ghi chú tiếp nhận<textarea className="field mt-1.5 min-h-20 w-full py-2" maxLength={5000} value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
      </div>
    </section>
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <div className="flex justify-end"><button className="btn btn-primary" type="submit" disabled={saving || addingCatalog}><Plus size={16} />{saving ? "Đang tạo phiếu…" : "Tạo phiếu sửa chữa"}</button></div>
  </form>;
}
