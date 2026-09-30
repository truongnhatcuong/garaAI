import { DiagnosticVehicle } from "@/components/customer/DiagnosticVehicle";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CarFront,
  Check,
  ChevronRight,
  Clock3,
  Droplets,
  FileText,
  MessageCircleMore,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { getPrisma } from "@/server/db";

const highlights = [
  {
    icon: Settings2,
    title: "Bảo dưỡng định kỳ",
    detail: "Chăm sóc đúng mốc, an tâm trên mọi hành trình.",
  },
  {
    icon: Droplets,
    title: "Thay dầu & lọc nhớt",
    detail: "Giữ động cơ vận hành êm và bền bỉ hơn.",
  },
  {
    icon: ScanSearch,
    title: "Hỗ trợ tư vấn bằng AI",
    detail: "Hỏi đáp về tình trạng xe bằng ngôn ngữ dễ hiểu.",
  },
  {
    icon: Wrench,
    title: "Sửa chữa chuyên sâu",
    detail: "Theo dõi từng hạng mục từ lúc nhận xe.",
  },
];
const steps = [
  { icon: CalendarCheck2, title: "Đặt lịch", detail: "Chọn thời gian phù hợp" },
  { icon: ScanSearch, title: "Kiểm tra", detail: "Ghi nhận tình trạng xe" },
  {
    icon: FileText,
    title: "Duyệt báo giá",
    detail: "Rõ chi phí trước khi làm",
  },
  { icon: Wrench, title: "Theo dõi", detail: "Xem tiến độ sửa chữa" },
  { icon: ShieldCheck, title: "Nhận xe", detail: "Lưu hồ sơ để an tâm" },
];
const features = [
  {
    icon: FileText,
    title: "Minh bạch chi phí",
    detail: "Xem hạng mục và báo giá trước khi quyết định.",
  },
  {
    icon: CarFront,
    title: "Theo dõi chiếc xe",
    detail: "Cập nhật tiến độ và hình ảnh ở từng giai đoạn.",
  },
  {
    icon: MessageCircleMore,
    title: "Có AI đồng hành",
    detail: "Hỏi đáp về tình trạng xe bằng ngôn ngữ dễ hiểu.",
  },
  {
    icon: ShieldCheck,
    title: "Lưu lịch sử lâu dài",
    detail: "Mọi lần bảo dưỡng đều có thể tra cứu lại.",
  },
];

export async function HomePage() {
  let loadError = false;
  let services: {
    id: string;
    title: string;
    description: string | null;
    durationMinutes: number;
    price: { toString(): string };
  }[] = [];
  try {
    services = await getPrisma().service.findMany({
      where: { deletedAt: null, status: "ACTIVE" },
      orderBy: { title: "asc" },
      take: 4,
    });
  } catch {
    loadError = true;
  }

  return (
    <div className="overflow-hidden bg-white text-[#0b1930]">
      <div className="border-b border-[#d9e5ff] bg-[#e7efff] text-[#173a86]">
        <div className="mx-auto w-[calc(100%-32px)] max-w-[1240px] md:w-[calc(100%-48px)] flex min-h-[30px] items-center justify-between gap-5 text-xs font-bold tracking-[.075em]">
          <span className="inline-flex items-center gap-[7px]">
            <i className="inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-[#43d5c8] shadow-[0_0_0_4px_#43d5c82b]" />{" "}
            AUTOCARE AI · CHĂM SÓC XE THÔNG MINH
          </span>
          <span className="hidden items-center gap-2 opacity-75 md:inline-flex">
            Minh bạch từng hạng mục <b className="text-[#6c86c5]">✦</b> Chủ động
            mọi hành trình
          </span>
        </div>
      </div>

      <section className="relative bg-[radial-gradient(circle_at_76%_17%,#dceaff_0,transparent_35%),linear-gradient(125deg,#f8fbff_0%,#edf4ff_72%,#f4f8ff_100%)] pt-11 md:pt-[70px]">
        <div className="mx-auto w-[calc(100%-32px)] max-w-[1240px] md:w-[calc(100%-48px)] relative z-[1] grid items-center gap-6 md:grid-cols-2 lg:gap-12">
          <div className="pb-0 md:pb-[35px]">
            <span className="inline-flex w-fit items-center gap-[7px] rounded-full border border-[#d7e4ff] bg-[#e9f0ff] px-3 py-2 text-xs font-extrabold tracking-[.11em] text-[#0d3bb9]">
              <Sparkles size={13} /> CÔNG NGHỆ CHĂM XE THẾ HỆ MỚI
            </span>
            <h1 className="mt-[23px] max-w-[700px] font-[family-name:var(--font-jakarta)] text-[clamp(35px,8.5vw,48px)] leading-[1.13] font-extrabold tracking-[-.055em] md:text-[clamp(36px,4vw,48px)] xl:text-[63px]">
              Chăm sóc chiếc xe của bạn{" "}
              <span className="text-[#0d3bb9]">dễ dàng & minh bạch hơn.</span>
            </h1>
            <p className="mt-[23px] max-w-[570px] text-sm leading-[1.75] text-[#52637e] md:text-base">
              Từ đặt lịch đến nhận xe, mọi thông tin đều nằm trong tầm tay bạn.
              Biết xe cần gì, chi phí ra sao và tiến độ sửa chữa đến đâu.
            </p>
            <div className="mt-[29px] flex flex-col gap-[11px] min-[480px]:flex-row min-[480px]:flex-wrap">
              <Link
                href="/appointments"
                className="inline-flex min-h-12 w-full items-center justify-center gap-[9px] rounded-[9px] px-[18px] text-[13px] font-bold no-underline shadow-[0_6px_14px_#14388712] transition-transform hover:-translate-y-0.5 min-[480px]:w-auto bg-[#0d3bb9] text-white hover:bg-[#082d96]"
              >
                <CalendarCheck2 size={17} /> Đặt lịch bảo dưỡng{" "}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-12 w-full items-center justify-center gap-[9px] rounded-[9px] px-[18px] text-[13px] font-bold no-underline shadow-[0_6px_14px_#14388712] transition-transform hover:-translate-y-0.5 min-[480px]:w-auto border border-[#dbe6fb] bg-white text-[#163f9c] hover:bg-[#e8efff]"
              >
                Khám phá dịch vụ <ChevronRight size={17} />
              </Link>
            </div>
            <div className="mt-[29px] flex flex-wrap items-center gap-2 text-xs font-semibold text-[#536683] md:text-[11px] [&_svg]:text-[#0d3bb9] [&>span]:mx-[7px] [&>span]:h-4 [&>span]:w-px [&>span]:bg-[#cbd9ef]">
              <BadgeCheck size={17} /> Báo giá rõ ràng <span />{" "}
              <ShieldCheck size={17} /> Lưu toàn bộ lịch sử xe
            </div>
          </div>
          <DiagnosticVehicle />
        </div>
        <div className=" mx-auto w-[calc(100%-32px)] max-w-[1240px] md:w-[calc(100%-48px)] relative z-[1] mt-[35px] -mb-12 grid grid-cols-2 rounded-[13px] border border-[#e2e9f4] bg-white p-[5px] shadow-[0_14px_36px_#244c8310] md:mt-[55px] md:-mb-[38px] md:grid-cols-4 md:p-[18px_8px]">
          <div className="flex min-h-[42px] items-center gap-3 border-r border-b border-[#e8edf6] p-[13px] md:justify-center md:border-b-0 md:px-3">
            <ScanSearch size={20} className="shrink-0 text-[#0d3bb9]" />
            <span>
              <strong className="block text-lg font-extrabold">
                Hiểu xe hơn
              </strong>
              <small className="mt-[3px] block text-xs text-[#65738c]">
                Chẩn đoán dễ hiểu
              </small>
            </span>
          </div>
          <div className="flex min-h-[42px] items-center gap-3 border-b border-[#e8edf6] p-[13px] md:justify-center md:border-r md:border-b-0 md:px-3">
            <FileText size={20} className="shrink-0 text-[#0d3bb9]" />
            <span>
              <strong className="block text-lg font-extrabold">
                Rõ từng chi phí
              </strong>
              <small className="mt-[3px] block text-xs text-[#65738c]">
                Duyệt trước khi sửa
              </small>
            </span>
          </div>
          <div className="flex min-h-[42px] items-center gap-3 border-r border-[#e8edf6] p-[13px] md:justify-center md:px-3">
            <Clock3 size={20} className="shrink-0 text-[#0d3bb9]" />
            <span>
              <strong className="block text-lg font-extrabold">
                Theo dõi mọi lúc
              </strong>
              <small className="mt-[3px] block text-xs text-[#65738c]">
                Cập nhật tiến độ xe
              </small>
            </span>
          </div>
          <div className="flex min-h-[42px] items-center gap-3 p-[13px] md:justify-center md:px-3">
            <ShieldCheck size={20} className="shrink-0 text-[#0d3bb9]" />
            <span>
              <strong className="block text-lg font-extrabold">
                An tâm dài lâu
              </strong>
              <small className="mt-[3px] block text-xs text-[#65738c]">
                Lịch sử luôn sẵn có
              </small>
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white pt-[106px] pb-[65px] md:pt-[118px] md:pb-[91px]">
        <div className="mx-auto w-[calc(100%-32px)] max-w-[1240px] md:w-[calc(100%-48px)]">
          <div className="mb-[29px] block gap-[30px] md:flex md:items-end md:justify-between">
            <div>
              <span className="inline-flex w-fit items-center gap-[7px] text-xs font-extrabold tracking-[.11em] text-[#0d3bb9]">
                DỊCH VỤ AUTOCARE
              </span>
              <h2 className="mt-[11px] max-w-[650px] font-[family-name:var(--font-jakarta)] text-[clamp(27px,3vw,39px)] leading-[1.23] font-extrabold tracking-[-.055em]">
                Chăm xe toàn diện,{" "}
                <span className="text-[#0d3bb9]">theo cách của bạn.</span>
              </h2>
            </div>
            <p className="mt-[14px] max-w-[350px] text-[13px] leading-[1.65] text-[#65738c] md:mb-[3px] md:mt-0">
              Từ bảo dưỡng hằng ngày đến sửa chữa chuyên sâu, mỗi bước đều được
              ghi nhận rõ ràng trong hồ sơ xe.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3.5 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, title, detail }, index) => (
              <Link
                href="/services"
                className="flex min-h-[145px] flex-col rounded-xl border border-[#e5ebf5] bg-white p-5 text-[#0b1930] no-underline shadow-[0_4px_18px_#123e7a08] transition-all hover:-translate-y-[5px] hover:border-[#b5ccff] hover:shadow-[0_15px_30px_#123e7a16] min-[480px]:min-h-[233px]"
                key={title}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-[45px] w-[45px] place-items-center rounded-[10px] bg-[#edf3ff] text-[#0d3bb9]">
                    <Icon size={23} strokeWidth={1.8} />
                  </span>
                  <span className="text-xs font-extrabold tracking-[.08em] text-[#c5d3eb]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-[21px] mb-[7px] font-[family-name:var(--font-jakarta)] text-base font-bold tracking-[-.025em]">
                  {title}
                </h3>
                <p className="text-base leading-[1.55] text-[#66748a]">
                  {detail}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-[18px] text-[11px] font-extrabold text-[#0d3bb9]">
                  Xem dịch vụ <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
          {services.length > 0 && (
            <div className="mt-[58px]">
              <div className="mb-[18px] flex items-end justify-between gap-5">
                <div>
                  <span className="inline-flex w-fit items-center gap-[7px] text-xs font-extrabold tracking-[.11em] text-[#0d3bb9]">
                    ĐANG PHỤC VỤ
                  </span>
                  <h3 className="mt-1.5 font-[family-name:var(--font-jakarta)] text-[23px] tracking-[-.03em]">
                    Dịch vụ hiện có
                  </h3>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-[7px] text-xs font-extrabold text-[#0d3bb9]"
                >
                  Xem tất cả <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3.5 min-[480px]:grid-cols-2 lg:grid-cols-4">
                {services.map((service) => (
                  <article
                    className="flex min-h-[190px] flex-col rounded-[10px] border border-[#e4eaf5] bg-[#f9fbff] p-[17px]"
                    key={service.id}
                  >
                    <h4 className="text-[13px] font-bold">{service.title}</h4>
                    <p className="mt-2 mb-3 flex-1 text-[11px] leading-normal text-[#67758a]">
                      {service.description ||
                        "Xem thông tin chi tiết về dịch vụ tại AutoCare AI."}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e3eaf6] pt-[9px] text-[11px]">
                      <span className="inline-flex items-center gap-[5px]">
                        <Clock3 size={14} /> {service.durationMinutes} phút
                      </span>
                      <strong className="text-[#0d3bb9]">
                        {Number(service.price).toLocaleString("vi-VN")} ₫
                      </strong>
                    </div>
                    <Link
                      href="/appointments"
                      className="mt-[13px] inline-flex items-center gap-[5px] text-[11px] font-bold text-[#0d3bb9]"
                    >
                      Đặt lịch dịch vụ <ArrowRight size={15} />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
          {loadError && (
            <p className="mt-5 text-xs text-[#65738c]">
              Danh sách dịch vụ đang được cập nhật. Bạn vẫn có thể khám phá các
              hạng mục chăm sóc xe.
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#f0f5ff] py-[66px] md:py-[80px] md:pb-[87px]">
        <div className="mx-auto w-[calc(100%-32px)] max-w-[1240px] md:w-[calc(100%-48px)]">
          <div className="text-center">
            <span className="inline-flex w-fit items-center gap-[7px] text-xs font-extrabold tracking-[.11em] text-[#0d3bb9]">
              MỌI BƯỚC ĐỀU RÕ RÀNG
            </span>
            <h2 className="mt-2.5 mb-2 font-[family-name:var(--font-jakarta)] text-[clamp(27px,3vw,37px)] leading-[1.25] font-extrabold tracking-[-.055em]">
              Một hành trình chăm xe thật nhẹ nhàng.
            </h2>
            <p className="text-[13px] text-[#65738c]">
              Biết điều gì đang diễn ra với chiếc xe của mình, từ lúc đặt lịch
              đến khi trở lại đường.
            </p>
          </div>
          <div className="relative mt-11 grid grid-cols-2 gap-x-[15px] gap-y-[30px] min-[480px]:grid-cols-3 md:grid-cols-5 md:before:absolute md:before:top-6 md:before:right-[10%] md:before:left-[10%] md:before:h-0.5 md:before:bg-[#cad9f5]">
            {steps.map(({ icon: Icon, title, detail }, index) => (
              <div className="relative text-center" key={title}>
                <span className="mx-auto mb-[15px] grid h-[59px] w-[59px] place-items-center rounded-full border-[5px] border-[#f0f5ff] bg-[#0d3bb9] text-white [&:nth-child(even)]:bg-[#174d78]">
                  <Icon size={21} />
                </span>
                <span className="text-[9px] font-extrabold tracking-[.1em] text-[#0d3bb9]">
                  BƯỚC 0{index + 1}
                </span>
                <h3 className="my-[5px] text-[13px] font-extrabold">{title}</h3>
                <p className="mx-auto max-w-[145px] text-[11px] leading-normal text-[#65738c]">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f9fbff] py-[70px] md:py-[94px]">
        <div className="mx-auto w-[calc(100%-32px)] max-w-[1240px] md:w-[calc(100%-48px)] grid grid-cols-1 items-center gap-[31px] md:grid-cols-[.85fr_1.15fr] md:gap-[9%]">
          <div>
            <span className="inline-flex w-fit items-center gap-[7px] text-xs font-extrabold tracking-[.11em] text-[#0d3bb9]">
              MỘT NƠI CHO MỌI THÔNG TIN
            </span>
            <h2 className="mt-[14px] mb-4 max-w-[480px] font-[family-name:var(--font-jakarta)] text-[clamp(29px,3.4vw,43px)] leading-[1.2] font-extrabold tracking-[-.055em]">
              Từng quyết định chăm xe,{" "}
              <span className="text-[#0d3bb9]">đều có cơ sở.</span>
            </h2>
            <p className="mb-[25px] max-w-[475px] text-[13px] leading-[1.75] text-[#65738c]">
              Báo giá, hình ảnh sửa chữa và lịch sử bảo dưỡng được sắp xếp trong
              cùng một hồ sơ. Bạn có thể xem lại bất cứ khi nào cần.
            </p>
            <Link
              href="/repairs"
              className="inline-flex items-center gap-[7px] text-xs font-extrabold text-[#0d3bb9] no-underline"
            >
              Khám phá cách theo dõi sửa chữa <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-[13px] min-[480px]:grid-cols-2">
            {features.map(({ icon: Icon, title, detail }) => (
              <div
                className="flex min-h-[142px] flex-col gap-[7px] rounded-xl border border-[#e6edfa] bg-white p-5 shadow-[0_8px_25px_#23498508]"
                key={title}
              >
                <Icon size={22} className="text-[#0d3bb9]" />
                <strong className="mt-1 text-[13px]">{title}</strong>
                <span className="text-[11px] leading-normal text-[#65738c]">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f9fbff] pt-[34px] pb-[55px] md:pb-20">
        <div className="mx-auto w-[calc(100%-32px)] max-w-[1240px] md:w-[calc(100%-48px)]">
          <div className="relative flex min-h-[310px] items-center overflow-hidden rounded-[17px] bg-[radial-gradient(circle_at_82%_50%,#1c78a7_0%,#0b558c_28%,transparent_55%),linear-gradient(120deg,#0830a4,#07328d_58%,#064867)] text-white shadow-[0_20px_36px_#143e7d22] before:absolute before:inset-0 before:bg-[linear-gradient(#ffffff0c_1px,transparent_1px),linear-gradient(90deg,#ffffff0c_1px,transparent_1px)] before:bg-[length:40px_40px]">
            <div className="relative z-[2] w-full px-[29px] pt-[43px] pb-[185px] md:w-[57%] md:px-[55px] md:py-[45px]">
              <span className="inline-flex items-center gap-[9px] rounded-full border border-[#ffffff45] px-2.5 py-[7px] text-xs font-extrabold tracking-[.08em] text-[#d5eeff]">
                <i className="inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-[#43d5c8] shadow-[0_0_0_4px_#43d5c82b]" />{" "}
                SẴN SÀNG CHĂM SÓC XE?
              </span>
              <h2 className="mt-[17px] mb-3 font-[family-name:var(--font-jakarta)] text-[clamp(30px,3.5vw,45px)] leading-[1.17] font-extrabold tracking-[-.055em]">
                Chiếc xe khỏe hơn.
                <br />
                Bạn an tâm hơn.
              </h2>
              <p className="mb-[22px] max-w-[440px] text-[13px] leading-[1.6] text-[#d4e5f8]">
                Đặt lịch trong vài bước và bắt đầu hành trình chăm xe minh bạch
                cùng AutoCare AI.
              </p>
              <Link
                href="/appointments"
                className="inline-flex min-h-12 w-full items-center justify-center gap-[9px] rounded-[9px] px-[18px] text-[13px] font-bold no-underline shadow-[0_6px_14px_#14388712] transition-transform hover:-translate-y-0.5 min-[480px]:w-auto bg-white text-[#103ba0] hover:bg-[#e8f2ff]"
              >
                <CalendarCheck2 size={18} /> Đặt lịch ngay{" "}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div
              className="absolute inset-x-0 bottom-0 grid h-[190px] place-items-center md:inset-y-0 md:right-0 md:left-[57%] md:h-auto"
              aria-hidden="true"
            >
              <div className="absolute h-[210px] w-[210px] rounded-full border border-[#a7edff45] md:h-[270px] md:w-[270px]" />
              <div className="absolute h-[310px] w-[310px] rounded-full border border-[#a7edff21] md:h-[400px] md:w-[400px]" />
              <div className="relative z-[1] grid h-[70px] w-[70px] -rotate-12 place-items-center rounded-[21px] border border-[#bceeff9e] bg-gradient-to-br from-[#9de9ff] to-[#f6fcff] text-[#0d52a0] shadow-[0_0_0_17px_#b6ecff1c,0_22px_40px_#001d5950] md:h-[94px] md:w-[94px] md:rounded-[28px] [&_svg]:rotate-12">
                <Check size={39} strokeWidth={2.5} />
              </div>
              <span className="absolute right-[8%] bottom-[15%] z-[1] inline-flex items-center gap-[7px] rounded-lg border border-[#d2f5ff63] bg-[#ffffff18] px-[13px] py-[11px] text-xs font-extrabold tracking-[.04em] shadow-[0_14px_25px_#073b7838] backdrop-blur-lg md:right-[7%] md:bottom-[21%]">
                <Sparkles size={15} /> CHĂM XE CHỦ ĐỘNG
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
