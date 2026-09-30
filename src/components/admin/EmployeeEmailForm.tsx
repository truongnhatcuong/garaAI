"use client";

import { useState, type FormEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Mail, Plus, X } from "lucide-react";
import { RelationPicker } from "@/components/admin/RelationPicker";
import { notifyError, notifySuccess } from "@/lib/notify";

export function EmployeeEmailForm() {
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function closeForm() {
    setOpen(false);
    setEmployeeId("");
    setSubject("");
    setMessage("");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!employeeId) { setError("Vui lòng chọn nhân viên nhận email."); return; }
    if (!event.currentTarget.reportValidity()) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/send-employee-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, subject, message }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không gửi được email.");
      closeForm();
      notifySuccess("Đã gửi email cho nhân viên.");
    } catch (failure) {
      setError(notifyError(failure, "Không gửi được email."));
    } finally {
      setBusy(false);
    }
  }

  return <div className="mx-auto flex max-w-4xl flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="admin-page-title">Thông báo</h1>
      <p className="mt-1 text-sm text-[var(--admin-muted)]">Theo dõi cập nhật từ nhân viên và gửi email khi cần.</p>
    </div>
    <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={16} />Thêm thông báo</button>
    <Dialog.Root open={open} onOpenChange={(next) => { if (!busy) { if (next) setOpen(true); else closeForm(); } }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" />
        <Dialog.Popup className="admin-theme fixed left-1/2 top-1/2 z-50 max-h-[min(90vh,800px)] w-[min(580px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border bg-white shadow-xl">
          <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
            <div><Dialog.Title className="text-base font-semibold">Gửi thông báo cho nhân viên</Dialog.Title><Dialog.Description className="mt-1 text-xs text-[var(--admin-muted)]">Email gửi trực tiếp đến hộp thư nhân viên và không lưu trong danh sách thông báo.</Dialog.Description></div>
            <Dialog.Close aria-label="Đóng" disabled={busy} className="rounded-md p-1 text-[var(--admin-muted)] hover:bg-slate-100"><X size={18} /></Dialog.Close>
          </div>
          <form onSubmit={(event) => void submit(event)}>
            <div className="space-y-4 p-5">
              <div className="text-sm font-medium"><p>Nhân viên nhận <span className="text-red-700">*</span></p><div className="mt-1"><RelationPicker resource="employees" label="Nhân viên" value={employeeId} onChange={setEmployeeId} /></div></div>
              <label className="block text-sm font-medium">Tiêu đề <span className="text-red-700">*</span><input className="field mt-1 w-full" required maxLength={150} value={subject} onChange={(event) => setSubject(event.target.value)} /></label>
              <label className="block text-sm font-medium">Nội dung <span className="text-red-700">*</span><textarea className="field mt-1 min-h-40 w-full py-2" required maxLength={5000} value={message} onChange={(event) => setMessage(event.target.value)} /></label>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-3">
              <button type="button" disabled={busy} className="btn btn-soft" onClick={closeForm}>Hủy</button>
              <button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-50"><Mail size={16} />{busy ? "Đang gửi…" : "Gửi email"}</button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>;
}
