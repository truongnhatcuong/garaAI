import Link from "next/link";
import { ArrowRight, CalendarCheck2, Headset, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/shared/Brand";

const footerGroups = [
  {
    title: "Khám phá",
    links: [
      { label: "Trang chủ", href: "/" },
      { label: "Dịch vụ", href: "/services" },
      { label: "Đặt lịch bảo dưỡng", href: "/appointments" },
      { label: "Trợ lý AI", href: "/ai-assistant" },
    ],
  },
  {
    title: "Quản lý xe",
    links: [
      { label: "Xe của tôi", href: "/vehicles" },
      { label: "Theo dõi sửa chữa", href: "/repairs" },
      { label: "Báo giá & hóa đơn", href: "/invoices" },
      { label: "Hồ sơ cá nhân", href: "/profile" },
    ],
  },
];

export function CustomerFooter() {
  return (
    <footer className="mt-auto bg-[#091c34] text-white" aria-label="Thông tin và điều hướng cuối trang">
      <div className="border-b border-white/10 bg-[#0c2d57]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div>
            <p className="font-[family-name:var(--font-jakarta)] text-lg font-bold tracking-tight">Sẵn sàng chăm sóc chiếc xe của bạn?</p>
            <p className="mt-1 text-xs leading-relaxed text-blue-100/80">Đặt lịch dễ dàng và theo dõi mọi bước trong một nơi.</p>
          </div>
          <Link href="/appointments" className="inline-flex min-h-10 w-fit items-center gap-2 rounded-lg bg-white px-4 text-xs font-bold text-[#0b3e9a] transition hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><CalendarCheck2 size={16} /> Đặt lịch ngay <ArrowRight size={15} /></Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-[1.35fr_.8fr_.9fr_1fr] lg:gap-12 lg:py-16">
        <div>
          <Brand inverse large className="w-fit" />
          <p className="mt-5 max-w-[310px] text-[13px] leading-7 text-slate-300">Nền tảng giúp bạn đặt lịch, theo dõi sửa chữa và lưu giữ lịch sử chăm sóc xe một cách rõ ràng.</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1.5 text-[11px] font-semibold text-blue-100"><ShieldCheck size={14} /> Minh bạch trên từng hành trình</span>
        </div>

        {footerGroups.map((group) => <nav key={group.title} aria-label={group.title}>
          <h2 className="font-[family-name:var(--font-jakarta)] text-sm font-bold">{group.title}</h2>
          <ul className="mt-5 space-y-3.5">{group.links.map((item) => <li key={item.href}><Link href={item.href} className="text-[13px] text-slate-300 transition hover:text-white hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300">{item.label}</Link></li>)}</ul>
        </nav>)}

        <div>
          <h2 className="font-[family-name:var(--font-jakarta)] text-sm font-bold">Cần hỗ trợ?</h2>
          <p className="mt-5 text-[13px] leading-6 text-slate-300">Bạn có thể hỏi trợ lý AI về tình trạng xe hoặc xem lại tiến độ sửa chữa bất cứ lúc nào.</p>
          <Link href="/ai-assistant" className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/20 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:border-blue-300 hover:bg-white/10"><Headset size={16} /> Hỏi trợ lý AI <ArrowRight size={14} /></Link>
        </div>
      </div>

      <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-4 py-5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between md:px-6"><p>© {new Date().getFullYear()} Gara Ôtô · AutoCare AI. Bảo lưu mọi quyền.</p><p>Chăm xe rõ ràng từ đầu đến cuối.</p></div></div>
    </footer>
  );
}
