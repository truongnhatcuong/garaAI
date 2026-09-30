"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { notifyError, notifySuccess } from "@/lib/notify";

export function AdminProfileForm({ name, email, phone, createdAt }: { name: string; email: string; phone: string; createdAt: string }) {
  const router = useRouter();
  const [currentName, setCurrentName] = useState(name);
  const [currentPhone, setCurrentPhone] = useState(phone);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = currentName.trim();
    const nextPhone = currentPhone.trim();
    if (nextName.length < 2 || nextName.length > 100) {
      setError("Tên phải có từ 2 đến 100 ký tự.");
      return;
    }
    if (nextPhone && !/^[+\d\s().-]{9,20}$/.test(nextPhone)) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nextName, phone: nextPhone }),
      });
      const result = await response.json() as { name?: string; phone?: string | null; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể cập nhật hồ sơ.");
      setCurrentName(result.name ?? nextName);
      setCurrentPhone(result.phone ?? "");
      notifySuccess("Đã cập nhật thông tin tài khoản.");
      router.refresh();
    } catch (failure) {
      setError(notifyError(failure, "Không thể cập nhật hồ sơ."));
    } finally {
      setBusy(false);
    }
  }

  return <section id="profile" className="admin-panel scroll-mt-24 p-5">
    <h2 className="text-base font-semibold">Thông tin tài khoản</h2>
    <p className="mt-1 text-sm text-[var(--admin-muted)]">Tên hiển thị trên thanh quản trị. Email dùng để đăng nhập.</p>
    <form onSubmit={(event) => void submit(event)} className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">Họ và tên<input className="field mt-1 w-full" value={currentName} onChange={(event) => setCurrentName(event.target.value)} minLength={2} maxLength={100} required autoComplete="name" /></label>
      <label className="block text-sm font-medium">Số điện thoại<input className="field mt-1 w-full" value={currentPhone} onChange={(event) => setCurrentPhone(event.target.value)} type="tel" maxLength={20} autoComplete="tel" placeholder="Chưa cập nhật" /></label>
      <label className="block text-sm font-medium">Email đăng nhập<input className="field mt-1 w-full bg-slate-50" value={email} readOnly type="email" /></label>
      <label className="block text-sm font-medium">Vai trò<input className="field mt-1 w-full bg-slate-50" value="Quản trị viên" readOnly /></label>
      <label className="block text-sm font-medium">Ngày tạo tài khoản<input className="field mt-1 w-full bg-slate-50" value={new Date(createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} readOnly /></label>
      {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2"><button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-50">{busy ? "Đang lưu…" : "Lưu thông tin"}</button></div>
    </form>
  </section>;
}
