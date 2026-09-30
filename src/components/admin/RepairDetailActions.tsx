"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { resourceConfig } from "@/lib/resource-config";
import { notifyError, notifySuccess } from "@/lib/notify";

export function RepairDetailActions({ id, status, invoiceId }: { id: string; status: string; invoiceId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState("");
  const restoring = status === "CANCELLED";
  const next = status === "QUALITY_CHECK"
    ? { value: "READY_FOR_PICKUP", label: "Đạt kiểm định · Sẵn sàng bàn giao" }
    : status === "READY_FOR_PICKUP"
      ? { value: "COMPLETED", label: "Xác nhận đã bàn giao" }
      : null;

  async function save(nextStatus: string) {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/repair-orders/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "Không cập nhật được trạng thái.");
      }
      setOpen(false);
      notifySuccess(nextStatus === "COMPLETED" ? "Đã hoàn tất và bàn giao phiếu sửa chữa." : "Đã cập nhật trạng thái phiếu.");
      router.refresh();
    } catch (failure) { setError(notifyError(failure, "Không cập nhật được trạng thái.")); }
    finally { setBusy(false); }
  }

  async function restore() {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/repair-orders/${id}/restore`, { method: "POST" });
      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "Không khôi phục được phiếu.");
      }
      setOpen(false);
      setValue("INTAKE");
      notifySuccess("Đã khôi phục phiếu về Tiếp nhận. Bạn có thể phân khoang lại.");
      router.refresh();
    } catch (failure) { setError(notifyError(failure, "Không khôi phục được phiếu.")); }
    finally { setBusy(false); }
  }

  async function issueInvoice() {
    if (invoiceId) { router.push(`/admin/invoices/${invoiceId}`); return; }
    setIssuing(true); setError("");
    try {
      const response = await fetch(`/api/admin/repair-orders/${id}/invoice`, { method: "POST" });
      const result = await response.json() as { id?: string; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error ?? "Không xuất được hóa đơn.");
      notifySuccess("Đã xuất hóa đơn từ phiếu sửa chữa.");
      router.push(`/admin/invoices/${result.id}`);
      router.refresh();
    } catch (failure) { setError(notifyError(failure, "Không xuất được hóa đơn.")); }
    finally { setIssuing(false); }
  }

  return <div className="flex flex-wrap gap-2">
    {restoring && <button type="button" className="btn btn-primary" disabled={busy} onClick={() => { setError(""); setOpen(true); }}>Khôi phục phiếu</button>}
    {next && <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void save(next.value)}>{busy ? "Đang lưu…" : next.label}</button>}
    {!(["COMPLETED", "CANCELLED"].includes(status)) && <button type="button" className={next ? "btn btn-soft" : "btn btn-primary"} disabled={busy} onClick={() => { setValue(status); setError(""); setOpen(true); }}>Thay đổi trạng thái</button>}
    {status !== "CANCELLED" && <button type="button" className={status === "COMPLETED" ? "btn btn-primary" : "btn btn-soft opacity-55"} disabled={status !== "COMPLETED" || issuing} title={status !== "COMPLETED" ? "Hoàn tất phiếu sửa chữa trước khi xuất hóa đơn" : undefined} onClick={() => void issueInvoice()}>{issuing ? "Đang xuất…" : invoiceId ? "Xem hóa đơn" : "Xuất hóa đơn"}</button>}
    {error && !open && <p role="alert" className="w-full text-xs text-red-700">{error}</p>}
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!busy) setOpen(nextOpen); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" />
        <Dialog.Popup className="admin-theme fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-5 shadow-xl">
          <Dialog.Title className="text-base font-semibold">{restoring ? "Khôi phục phiếu sửa chữa" : "Cập nhật trạng thái phiếu"}</Dialog.Title>
          {restoring ? <Dialog.Description className="mt-4 text-sm leading-relaxed text-slate-600">Phiếu sẽ trở về Tiếp nhận, giữ nguyên hạng mục, chi phí và ghi chú. Bạn cần phân khoang lại trước khi sửa chữa. Lịch hẹn liên kết sẽ chuyển sang Đang xử lý.</Dialog.Description> : <label className="mt-4 block text-xs font-medium">Trạng thái
            <select className="field mt-2 w-full" value={value} onChange={(event) => setValue(event.target.value)}>
              {resourceConfig["repair-orders"].statusOptions?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>}
          {error && <p role="alert" className="mt-3 text-xs text-red-700">{error}</p>}
          <div className="mt-5 flex justify-end gap-2"><button type="button" className="btn btn-soft" disabled={busy} onClick={() => setOpen(false)}>Đóng</button><button type="button" className="btn btn-primary" disabled={busy} onClick={() => void (restoring ? restore() : save(value))}>{busy ? "Đang xử lý…" : restoring ? "Khôi phục phiếu" : "Lưu"}</button></div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>;
}
