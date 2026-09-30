"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifyError, notifySuccess } from "@/lib/notify";

type Expense = { id: string; title: string; amount: number; spentAt: string };
const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;

export function ExpenseManager({ expenses }: { expenses: Expense[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    setBusy(true);
    try {
      const response = await fetch("/api/admin/expenses", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: values.get("title"), amount: Number(values.get("amount")) }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không lưu được chi phí.");
      form.reset();
      notifySuccess("Đã ghi nhận chi phí.");
      router.refresh();
    } catch (error) { notifyError(error, "Không lưu được chi phí."); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/expenses/${id}`, { method: "DELETE" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không xóa được chi phí.");
      notifySuccess("Đã xóa khoản chi.");
      router.refresh();
    } catch (error) { notifyError(error, "Không xóa được chi phí."); }
    finally { setBusy(false); }
  }

  return <section className="admin-panel p-5">
    <h2 className="text-base font-semibold">Chi phí vận hành hôm nay</h2>
    <p className="mt-1 text-sm text-[var(--admin-muted)]">Ghi tiền công, điện nước hoặc khoản chi khác. Giá vốn phụ tùng từ phiếu sửa chữa được tính riêng.</p>
    <form onSubmit={(event) => void add(event)} className="mt-4 flex flex-wrap items-end gap-3">
      <label className="min-w-48 flex-1 text-xs font-medium">Nội dung<input name="title" className="field mt-1 w-full" required minLength={2} maxLength={191} placeholder="Ví dụ: Tiền công kỹ thuật" /></label>
      <label className="w-40 text-xs font-medium">Số tiền (VND)<input name="amount" type="number" className="field mt-1 w-full" required min="1" step="0.01" /></label>
      <button disabled={busy} className="btn btn-primary">Ghi chi phí</button>
    </form>
    <div className="mt-4 divide-y border-t">
      {expenses.length ? expenses.map((expense) => <div key={expense.id} className="flex items-center justify-between gap-3 py-2 text-sm"><span>{expense.title}<span className="ml-2 text-xs text-[var(--admin-muted)]">{new Date(expense.spentAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" })}</span></span><span className="flex shrink-0 items-center gap-3"><strong>{money(expense.amount)}</strong><button type="button" disabled={busy} onClick={() => void remove(expense.id)} className="text-xs text-red-700">Xóa</button></span></div>) : <p className="py-3 text-sm text-[var(--admin-muted)]">Chưa ghi nhận chi phí vận hành.</p>}
    </div>
  </section>;
}
