"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import { googleMapsDirectionsUrl, siteMapSchema, type SiteMap } from "@/lib/site-map";
import { notifyError, notifySuccess } from "@/lib/notify";

export function SiteMapSettingsForm({ initialMap }: { initialMap: SiteMap }) {
  const router = useRouter();
  const [placeName, setPlaceName] = useState(initialMap.placeName);
  const [address, setAddress] = useState(initialMap.address);
  const [embedUrl, setEmbedUrl] = useState(initialMap.embedUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const preview = siteMapSchema.safeParse({ placeName, address, embedUrl });

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preview.success) {
      setError(preview.error.issues[0]?.message ?? "Thông tin bản đồ không hợp lệ.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/site-map", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preview.data),
      });
      const result = await response.json() as SiteMap & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không lưu được vị trí gara.");
      setPlaceName(result.placeName);
      setAddress(result.address);
      setEmbedUrl(result.embedUrl);
      notifySuccess("Đã cập nhật bản đồ trên trang chủ.");
      router.refresh();
    } catch (failure) {
      setError(notifyError(failure, "Không lưu được vị trí gara."));
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-panel p-5" aria-labelledby="site-map-heading">
    <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700"><MapPin size={20} /></span><div><h2 id="site-map-heading" className="text-base font-semibold">Vị trí gara trên trang chủ</h2><p className="mt-1 text-sm text-[var(--admin-muted)]">Cập nhật địa chỉ và bản đồ Google Maps để khách hàng tìm đường đến gara.</p></div></div>
    <form onSubmit={(event) => void save(event)} className="mt-5 grid gap-4">
      <label className="block text-sm font-medium">Tên địa điểm
        <input className="field mt-1 w-full" value={placeName} onChange={(event) => { setPlaceName(event.target.value); setError(""); }} minLength={2} maxLength={100} required disabled={busy} placeholder="AutoCare AI" />
      </label>
      <label className="block text-sm font-medium">Địa chỉ gara
        <input className="field mt-1 w-full" value={address} onChange={(event) => { setAddress(event.target.value); setError(""); }} maxLength={255} disabled={busy} placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành" />
      </label>
      <label className="block text-sm font-medium">Link nhúng Google Maps
        <textarea className="field mt-1 min-h-24 w-full resize-y py-2" value={embedUrl} onChange={(event) => { setEmbedUrl(event.target.value); setError(""); }} maxLength={8000} disabled={busy} placeholder="https://www.google.com/maps/embed?pb=..." aria-describedby="site-map-help" />
      </label>
      <p id="site-map-help" className="text-xs leading-5 text-[var(--admin-muted)]">Trên Google Maps, tìm địa điểm → Chia sẻ → Nhúng bản đồ → Sao chép HTML. Bạn có thể dán cả mã iframe hoặc chỉ link trong thuộc tính src. Để trống cả địa chỉ và link nếu muốn ẩn bản đồ.</p>
      {preview.success && preview.data.address && preview.data.embedUrl && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white"><iframe title="Xem trước vị trí gara" src={preview.data.embedUrl} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className="h-64 w-full border-0" /><a href={googleMapsDirectionsUrl(preview.data.address)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 hover:underline">Kiểm tra chỉ đường <ExternalLink size={13} /></a></div>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div><button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-50">{busy ? "Đang lưu…" : "Lưu vị trí gara"}</button></div>
    </form>
  </section>;
}
