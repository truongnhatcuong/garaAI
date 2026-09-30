"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifyError, notifySuccess } from "@/lib/notify";

export function ChangePasswordForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const currentPassword = String(fields.get("currentPassword") ?? "");
    const newPassword = String(fields.get("newPassword") ?? "");
    const confirmPassword = String(fields.get("confirmPassword") ?? "");
    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu mới chưa khớp.");
      notifyError(new Error("Xác nhận mật khẩu mới chưa khớp."), "Không thể đổi mật khẩu.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể đổi mật khẩu.");
      form.reset();
      notifySuccess("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      router.push("/login");
      router.refresh();
    } catch (failure) {
      setError(notifyError(failure, "Không thể đổi mật khẩu."));
    } finally {
      setBusy(false);
    }
  }

  return <section id="change-password" className="card scroll-mt-24 p-6">
    <h2 className="text-base font-semibold">Đổi mật khẩu</h2>
    <p className="mt-1 text-sm text-slate-600">Sau khi đổi, bạn cần đăng nhập lại trên các thiết bị.</p>
    <form onSubmit={(event) => void submit(event)} className="mt-5 max-w-md space-y-4">
      <label className="block text-sm font-medium">Mật khẩu hiện tại<input className="field mt-1 w-full" name="currentPassword" type="password" autoComplete="current-password" required /></label>
      <label className="block text-sm font-medium">Mật khẩu mới<input className="field mt-1 w-full" name="newPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label>
      <label className="block text-sm font-medium">Xác nhận mật khẩu mới<input className="field mt-1 w-full" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary">{busy ? "Đang cập nhật…" : "Đổi mật khẩu"}</button>
    </form>
  </section>;
}
