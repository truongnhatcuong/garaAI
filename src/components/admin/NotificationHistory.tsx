"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { Status } from "@/components/ui/AppUi";

type Notification = { id: string; title: string; body: string | null; type: "INFO" | "WARNING" | "ERROR" | "SUCCESS"; createdAt: string };

export function NotificationHistory() {
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    function load() {
      if (document.visibilityState !== "visible") return;
      fetch("/api/notifications?pageSize=20", { cache: "no-store" })
        .then(async (response) => {
          const data = await response.json() as { items?: Notification[]; error?: string };
          if (!response.ok) throw new Error(data.error ?? "Không tải được thông báo.");
          if (active) { setItems(data.items ?? []); setError(""); }
        })
        .catch((failure: unknown) => { if (active) setError(failure instanceof Error ? failure.message : "Không tải được thông báo."); });
    }
    load();
    const timer = window.setInterval(load, 15000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  return <section className="admin-panel mx-auto max-w-4xl overflow-hidden">
    <div className="flex items-center gap-2 border-b p-5"><BellRing size={18} className="text-blue-700" /><div><h2 className="text-base font-semibold">Thông báo gần đây</h2><p className="text-xs text-[var(--admin-muted)]">Báo cáo khoang từ nhân viên được lưu tại đây. Email gửi trực tiếp không nằm trong danh sách này.</p></div></div>
    {error ? <p role="alert" className="p-5 text-sm text-red-700">{error}</p> : items.length ? <div className="divide-y">{items.map((item) => <article key={item.id} className="p-4 sm:px-5"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{item.title}</strong><Status tone={item.type === "WARNING" ? "amber" : item.type === "ERROR" ? "red" : item.type === "SUCCESS" ? "green" : "blue"}>{item.type === "WARNING" ? "Cần chú ý" : item.type === "ERROR" ? "Lỗi" : item.type === "SUCCESS" ? "Hoàn tất" : "Cập nhật"}</Status></div>{item.body && <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--admin-muted)]">{item.body}</p>}<time className="mt-2 block text-xs text-[var(--admin-muted)]" dateTime={item.createdAt}>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(item.createdAt))}</time></article>)}</div> : <p className="p-5 text-sm text-[var(--admin-muted)]">Chưa có thông báo.</p>}
  </section>;
}
