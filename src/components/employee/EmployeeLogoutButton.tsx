"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { notifyError } from "@/lib/notify";

export function EmployeeLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Không thể đăng xuất.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      notifyError(error, "Không thể đăng xuất.");
      setBusy(false);
    }
  }
  return <button type="button" onClick={() => void signOut()} disabled={busy} className="btn btn-soft disabled:opacity-50"><LogOut size={16} />{busy ? "Đang đăng xuất…" : "Đăng xuất"}</button>;
}
