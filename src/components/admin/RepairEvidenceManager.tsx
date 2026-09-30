"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { TableAction } from "@/components/admin/TableAction";
import { notifyError, notifySuccess } from "@/lib/notify";

type Evidence = { id: string; imageUrl: string; imageUploadKey: string | null; caption: string | null };

export function RepairEvidenceManager({ orderId, initialItems }: { orderId: string; initialItems: Evidence[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Evidence | null>(null);
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const base = `/api/repair-orders/${orderId}/evidence`;

  async function refresh() {
    const response = await fetch(base, { cache: "no-store" });
    const data = await response.json() as { items?: Evidence[]; error?: string };
    if (!response.ok) throw new Error(data.error ?? "Không tải được ảnh.");
    setItems(data.items ?? []);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing && !files.length) { setError(notifyError(new Error("Chọn ít nhất một ảnh."), "Chọn ít nhất một ảnh.")); return; }
    setBusy(true); setError("");
    try {
      const form = new FormData();
      form.set("caption", caption);
      if (editing) { if (files[0]) form.set("image", files[0]); }
      else files.forEach((file) => form.append("images", file));
      const response = await fetch(editing ? `${base}/${editing.id}` : base, { method: editing ? "PATCH" : "POST", body: form });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Không lưu được ảnh.");
      await refresh();
      setEditing(null); setCaption(""); setFiles([]); setFileInputKey((value) => value + 1);
      notifySuccess("Đã lưu ảnh.");
    } catch (failure) { setError(notifyError(failure, "Không lưu được ảnh.")); }
    finally { setBusy(false); }
  }

  async function remove(item: Evidence) {
    if (!window.confirm("Xóa ảnh này?")) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`${base}/${item.id}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Không xóa được ảnh.");
      await refresh(); notifySuccess("Đã xóa ảnh.");
    } catch (failure) { setError(notifyError(failure, "Không xóa được ảnh.")); }
    finally { setBusy(false); }
  }

  return <section className="admin-panel p-5"><h2 className="text-sm font-semibold">Ảnh kiểm tra</h2>
    {items.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{items.map((item) => <figure key={item.id} className="min-w-0 rounded-md border p-2"><div className="relative h-40 overflow-hidden rounded-md bg-slate-100"><Image src={item.imageUrl} alt={item.caption ?? "Ảnh kiểm tra xe"} fill unoptimized className="object-cover" /></div><figcaption className="mt-2 flex items-center justify-between gap-2"><span className="min-w-0 truncate text-xs text-[var(--admin-muted)]">{item.caption || "Chưa có chú thích"}</span><span className="flex shrink-0 gap-1"><TableAction label="Xem ảnh" onClick={() => window.open(item.imageUrl, "_blank", "noopener,noreferrer")}><Eye size={16} /></TableAction><TableAction label="Sửa ảnh" onClick={() => { setEditing(item); setCaption(item.caption ?? ""); setFiles([]); setError(""); }}><Pencil size={16} /></TableAction><TableAction label="Xóa ảnh" danger onClick={() => void remove(item)}><Trash2 size={16} /></TableAction></span></figcaption></figure>)}</div> : <p className="mt-3 text-sm text-[var(--admin-muted)]">Chưa có ảnh kiểm tra.</p>}
    <form onSubmit={(event) => void submit(event)} className="mt-5 space-y-3 border-t pt-4"><h3 className="text-sm font-medium">{editing ? "Sửa ảnh" : "Thêm ảnh"}</h3><label className="block text-xs font-medium">{editing ? "Ảnh thay thế (để trống nếu chỉ sửa chú thích)" : "Ảnh (tối đa 10 ảnh, mỗi ảnh 8 MB)"}<input key={`${editing?.id ?? "new"}-${fileInputKey}`} className="field mt-1.5 w-full" type="file" accept="image/*" multiple={!editing} onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /></label><label className="block text-xs font-medium">Chú thích<input className="field mt-1.5 w-full" maxLength={255} value={caption} onChange={(event) => setCaption(event.target.value)} /></label>{error && <p role="alert" className="text-xs text-red-700">{error}</p>}<div className="flex gap-2"><button disabled={busy} className="btn btn-primary disabled:opacity-50" type="submit">{busy ? "Đang xử lý…" : editing ? "Lưu thay đổi" : "Tải ảnh lên"}</button>{editing && <button type="button" className="btn btn-soft" onClick={() => { setEditing(null); setCaption(""); setFiles([]); setFileInputKey((value) => value + 1); }}>Hủy</button>}</div></form>
  </section>;
}
