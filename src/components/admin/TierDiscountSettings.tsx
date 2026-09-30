"use client";

import { useState } from "react";
import { notifyError, notifySuccess } from "@/lib/notify";

type Tier = { code: string; label: string; discountPercent: number };

export function TierDiscountSettings({ tiers }: { tiers: Tier[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(tiers.map((tier) => [tier.code, String(tier.discountPercent)])),
  );
  const [busy, setBusy] = useState<string | null>(null);

  async function save(code: string) {
    const discountPercent = Number(values[code]);
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      notifyError(new Error("Ưu đãi phải từ 0% đến 100%."), "Ưu đãi không hợp lệ.");
      return;
    }
    setBusy(code);
    try {
      const response = await fetch("/api/admin/membership-tiers", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, discountPercent }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không lưu được mức ưu đãi.");
      notifySuccess("Đã lưu mức ưu đãi hội viên.");
    } catch (error) { notifyError(error, "Không lưu được mức ưu đãi."); }
    finally { setBusy(null); }
  }

  return <section className="admin-panel p-5">
    <h2 className="text-base font-semibold">Ưu đãi theo hạng thành viên</h2>
    <p className="mt-1 text-sm text-[var(--admin-muted)]">Phần trăm được áp dụng trên tiền tạm tính khi lập hóa đơn mới. Hóa đơn đã phát hành giữ nguyên số tiền.</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {tiers.map((tier) => <div key={tier.code} className="flex items-end gap-3 rounded-lg border p-3">
        <label className="min-w-0 flex-1 text-sm font-medium">Hạng {tier.label}<span className="mt-1 flex items-center gap-2"><input aria-label={`Giảm giá hạng ${tier.label}`} type="number" min="0" max="100" step="0.01" className="field w-full" value={values[tier.code] ?? "0"} onChange={(event) => setValues((current) => ({ ...current, [tier.code]: event.target.value }))} /><span>%</span></span></label>
        <button type="button" disabled={busy !== null} onClick={() => void save(tier.code)} className="btn btn-primary">{busy === tier.code ? "Đang lưu…" : "Lưu"}</button>
      </div>)}
    </div>
  </section>;
}
