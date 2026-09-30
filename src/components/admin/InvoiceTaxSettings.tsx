"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { invoiceTaxSchema } from "@/lib/invoice-tax";
import { notifyError, notifySuccess } from "@/lib/notify";

export function InvoiceTaxSettings({ taxPercent }: { taxPercent: number }) {
  const router = useRouter();
  const [value, setValue] = useState(String(taxPercent));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = invoiceTaxSchema.safeParse({ taxPercent: value.trim() ? Number(value) : NaN });
    if (!parsed.success) { setError("Nhập mức thuế từ 0% đến 100%, tối đa 2 chữ số thập phân."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/invoice-settings", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data),
      });
      const result = await response.json() as { taxPercent: number; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không lưu được mức thuế.");
      setValue(String(result.taxPercent));
      notifySuccess("Đã lưu mức thuế cho hóa đơn mới.");
      router.refresh();
    } catch (failure) { setError(notifyError(failure, "Không lưu được mức thuế.")); }
    finally { setBusy(false); }
  }

  return <section className="admin-panel p-5">
    <h2 className="text-base font-semibold">Thuế hóa đơn</h2>
    <p id="invoice-tax-help" className="mt-1 text-sm text-[var(--admin-muted)]">Thuế tính trên số tiền sau ưu đãi hội viên khi xuất hóa đơn mới. Hóa đơn đã xuất giữ nguyên mức thuế và số tiền. Nhập 0 nếu không tính thuế.</p>
    <form onSubmit={save} className="mt-5 flex flex-wrap items-end gap-3">
      <label className="w-full text-sm font-medium sm:w-64">Thuế hóa đơn (%)
        <input type="number" required min="0" max="100" step="0.01" disabled={busy} aria-describedby="invoice-tax-help invoice-tax-error" aria-invalid={Boolean(error)} className="field mt-2 w-full" value={value} onChange={(event) => { setValue(event.target.value); setError(""); }} />
      </label>
      <button type="submit" disabled={busy} className="btn btn-primary">{busy ? "Đang lưu…" : "Lưu mức thuế"}</button>
      <p id="invoice-tax-error" role={error ? "alert" : undefined} className="w-full text-sm text-red-700">{error}</p>
    </form>
  </section>;
}
