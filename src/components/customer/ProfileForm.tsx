"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { PageHeading } from "@/components/ui/AppUi";
import { notifyError, notifySuccess } from "@/lib/notify";
import { ChangePasswordForm } from "@/components/shared/ChangePasswordForm";
import { MembershipTierBadge, membershipTierColors } from "@/components/shared/MembershipTierBadge";

type CustomerProfile = {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  tier: string;
  discountPercent: number;
  repairCount: number;
};

export function ProfileForm() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/me/profile", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as CustomerProfile & { error?: string };
        if (!response.ok) throw new Error(data.error ?? "Không tải được hồ sơ.");
        setProfile(data);
      })
      .catch((failure: unknown) => setError(failure instanceof Error ? failure.message : "Không tải được hồ sơ."));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) {
      notifyError(new Error("Vui lòng kiểm tra thông tin hồ sơ."), "Vui lòng kiểm tra thông tin hồ sơ.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/me/profile/current", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      });
      const data = await response.json() as Partial<CustomerProfile> & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Không lưu được hồ sơ.");
      setProfile((current) => current ? { ...current, ...data } : current);
      notifySuccess("Đã lưu hồ sơ cá nhân.");
    } catch (failure) {
      setError(notifyError(failure, "Không lưu được hồ sơ."));
    } finally {
      setBusy(false);
    }
  }

  const colors = membershipTierColors[profile?.tier ?? ""] ?? membershipTierColors.Bronze;

  return <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
    <PageHeading title="Hồ sơ cá nhân" description="Quản lý thông tin liên hệ và quyền lợi thành viên của bạn." />
    {error && <p role="alert" className="text-sm text-red-700">{error} {error.includes("đăng nhập") && <Link href="/login" className="underline">Đăng nhập</Link>}</p>}
    {profile ? <>
      <div className="grid gap-4 sm:grid-cols-2">
        <section className={`rounded-xl border p-5 ${colors.card}`} aria-label="Hạng thành viên">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Hạng thành viên</p>
          <div className="mt-3"><MembershipTierBadge tier={profile.tier} /></div>
          <p className="mt-3 text-sm text-slate-700">Giảm <strong>{profile.discountPercent ?? 0}%</strong> trên tiền tạm tính khi lập hóa đơn.</p>
        </section>
        <section className="card p-5" aria-label="Số lần sửa chữa">
          <div className="flex items-center gap-2 text-slate-600"><Wrench size={17} /><p className="text-xs font-semibold uppercase tracking-wide">Số lần sửa chữa</p></div>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{profile.repairCount ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">Phiếu sửa chữa đã hoàn tất.</p>
          <Link href="/repairs" className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline">Xem lịch sử sửa chữa</Link>
        </section>
      </div>
      <form noValidate onSubmit={(event) => void submit(event)} className="card grid gap-5 p-6 md:grid-cols-2">
        <label className="text-sm font-semibold">Họ và tên<input name="name" required className="field mt-2 w-full" defaultValue={profile.name} /></label>
        <label className="text-sm font-semibold">Số điện thoại<input name="phone" required className="field mt-2 w-full" defaultValue={profile.phone ?? ""} /></label>
        <label className="text-sm font-semibold">Email<input disabled className="field mt-2 w-full" value={profile.email ?? ""} readOnly /></label>
        <div className="text-sm font-semibold">Hạng thành viên<div className="mt-2 flex min-h-10 items-center"><MembershipTierBadge tier={profile.tier} /></div></div>
        <label className="text-sm font-semibold md:col-span-2">Địa chỉ<input name="address" className="field mt-2 w-full" defaultValue={profile.address ?? ""} /></label>
        <button disabled={busy} className="btn btn-primary md:col-span-2">{busy ? "Đang lưu…" : "Lưu thay đổi"}</button>
      </form>
      <ChangePasswordForm />
    </> : !error && <div role="status" className="admin-skeleton h-64 rounded-lg" />}
  </div>;
}
