"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { notifyError, notifySuccess } from "@/lib/notify";

export function InvoicePaymentForm({ invoiceId, remaining, status }: { invoiceId: string; remaining: number; status: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState(String(remaining));
  const [method, setMethod] = useState("CASH");
  const [paidAt, setPaidAt] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setAmount(String(remaining)); }, [remaining]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}/payments`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, amount: Number(amount), ...(paidAt ? { paidAt: new Date(paidAt).toISOString() } : {}), ...(notes.trim() ? { notes: notes.trim() } : {}) }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không ghi nhận được thanh toán.");
      notifySuccess("Đã ghi nhận thanh toán vào hóa đơn.");
      setNotes(""); setPaidAt(""); router.refresh();
    } catch (failure) { setError(notifyError(failure, "Không ghi nhận được thanh toán.")); }
    finally { setBusy(false); }
  }

  if (status === "CANCELLED" || status === "PAID" || remaining <= 0) return null;
  return <form onSubmit={(event) => void submit(event)} className="admin-panel p-5">
    <h2 className="flex items-center gap-2 text-sm font-semibold"><CreditCard size={17} className="text-blue-700" />Ghi nhận thanh toán</h2>
    <p className="mt-1 text-xs text-[var(--admin-muted)]">Thanh toán được lưu trực tiếp trong hóa đơn và cập nhật báo cáo doanh thu.</p>
    <div className="mt-4 space-y-3">
      <label className="block text-xs font-medium">Số tiền nhận (₫)<input type="number" min={1} max={remaining} step={1} required className="field mt-1.5 w-full" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
      <label className="block text-xs font-medium">Phương thức<select className="field mt-1.5 w-full" value={method} onChange={(event) => setMethod(event.target.value)}><option value="CASH">Tiền mặt</option><option value="BANK_TRANSFER">Chuyển khoản</option><option value="CARD">Thẻ</option><option value="OTHER">Khác</option></select></label>
      <label className="block text-xs font-medium">Thời gian thanh toán<input type="datetime-local" className="field mt-1.5 w-full" value={paidAt} onChange={(event) => setPaidAt(event.target.value)} /><span className="mt-1 block font-normal text-[var(--admin-muted)]">Để trống để lấy thời điểm hiện tại.</span></label>
      <label className="block text-xs font-medium">Ghi chú<textarea className="field mt-1.5 min-h-16 w-full py-2" maxLength={1000} value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
    </div>
    {error && <p role="alert" className="mt-3 text-xs text-red-700">{error}</p>}
    <button type="submit" className="btn btn-primary mt-4 w-full" disabled={busy}>{busy ? "Đang lưu…" : "Xác nhận thanh toán"}</button>
  </form>;
}
