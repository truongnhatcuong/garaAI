import { ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { googleMapsDirectionsUrl, type SiteMap } from "@/lib/site-map";

export function GarageMapSection({ map }: { map: SiteMap }) {
  if (!map.address || !map.embedUrl) return null;

  return <section id="vi-tri-gara" className="bg-[#f0f5ff] py-[70px] md:py-[94px]" aria-labelledby="garage-map-title">
    <div className="mx-auto grid w-[calc(100%-32px)] max-w-[1240px] items-center gap-8 md:w-[calc(100%-48px)] lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[.11em] text-[#0d3bb9]"><MapPin size={16} /> GHÉ THĂM GARA</span>
        <h2 id="garage-map-title" className="mt-3 max-w-[450px] font-[family-name:var(--font-jakarta)] text-[clamp(29px,3.4vw,43px)] leading-[1.2] font-extrabold tracking-[-.055em]">Tìm đường đến <span className="text-[#0d3bb9]">{map.placeName}.</span></h2>
        <p className="mt-4 max-w-[420px] text-[13px] leading-[1.75] text-[#65738c]">Ghé gara để kỹ thuật viên kiểm tra và tư vấn trực tiếp cho chiếc xe của bạn.</p>
        <div className="mt-7 rounded-xl border border-[#dce7fa] bg-white p-5 shadow-[0_8px_24px_#2349850b]">
          <span className="text-[11px] font-extrabold tracking-[.1em] text-[#62748f]">ĐỊA CHỈ GARA</span>
          <address className="mt-2 not-italic text-sm font-semibold leading-6 text-[#0b1930]">{map.address}</address>
          <a href={googleMapsDirectionsUrl(map.address)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0d3bb9] px-4 text-xs font-bold text-white transition hover:bg-[#0b329f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d3bb9]"><Navigation size={16} /> Mở chỉ đường <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="overflow-hidden rounded-[18px] border border-[#dce7fa] bg-white p-2 shadow-[0_20px_45px_#163c7514]">
        <iframe title={`Bản đồ vị trí ${map.placeName}`} src={map.embedUrl} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="h-[320px] w-full rounded-xl border-0 sm:h-[400px]" />
      </div>
    </div>
  </section>;
}
