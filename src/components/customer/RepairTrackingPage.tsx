"use client";
import Image from "next/image";
import { useState } from "react";
import { Bot, Check, Download, Phone, ShieldCheck, X } from "lucide-react";
import { Status } from "@/components/ui/AppUi";
const inspections = [
  [
    "Má phanh trước",
    "CẦN THAY THẾ GẤP",
    "Độ dày mòn còn 2.0 mm, vượt giới hạn an toàn và có tiếng kim loại cạ đĩa.",
    "2.0 mm (Mòn 85%)",
    "red",
  ],
  [
    "Đĩa phanh trước",
    "CẦN LÁNG ĐĨA",
    "Bề mặt xuất hiện rãnh gợn sóng nhẹ, độ đảo 0.04 mm.",
    "0.04 mm (Vượt chuẩn)",
    "red",
  ],
  [
    "Dầu phanh DOT4",
    "CẦN THAY",
    "Độ ẩm trong dầu đạt 3.8%, làm giảm nhiệt độ sôi.",
    "3.8% (Cực hạn)",
    "red",
  ],
  [
    "Nước làm mát",
    "CẦN CHÚ Ý",
    "Bình nước phụ ở mức MIN, không phát hiện rò rỉ.",
    "Mức MIN (Châm thêm)",
    "amber",
  ],
  [
    "Lốp xe (4 bánh)",
    "TỐT",
    "Lốp mòn đều, độ sâu rãnh gai trung bình 5.5 mm.",
    "2.3 Bar / 5.5 mm",
    "green",
  ],
  [
    "Dầu máy & Lọc nhớt",
    "TỐT",
    "Dầu còn màu vàng sáng, vừa bảo dưỡng mốc 40.000 km.",
    "Còn 2.420 km",
    "green",
  ],
  [
    "Ắc quy GS 12V",
    "TỐT",
    "Điện áp tĩnh 12.6V, dòng CCA đạt 92%.",
    "12.6V / 92% CCA",
    "green",
  ],
  [
    "Hệ thống điều hòa",
    "TỐT",
    "Nhiệt độ cửa gió trung tâm đạt 7.5°C sau 3 phút.",
    "7.5°C (Lạnh sâu)",
    "green",
  ],
] as const;
const quote = [
  [
    "01",
    "Thay bộ má phanh trước chính hãng",
    "BCYD-33-28Z",
    "1 bộ",
    "1.250.000 ₫",
  ],
  [
    "02",
    "Láng đĩa phanh trước bằng máy CNC",
    "SVC-CNC-02",
    "2 đĩa",
    "500.000 ₫",
  ],
  ["03", "Thay dầu phanh tuần hoàn", "CAS-DOT4-1L", "1 bình", "280.000 ₫"],
  ["04", "Công thợ & vệ sinh cùm phanh", "LAB-BRAKE-01", "1 gói", "250.000 ₫"],
];
export function RepairTrackingPage() {
  const [modal, setModal] = useState(false);
  return (
    <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase text-slate-500">
            Trang chủ / Xe của tôi / Phiếu sửa chữa #SC-2024-0891
          </p>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="heading text-2xl font-bold">
              Theo dõi tiến độ & Báo giá
            </h1>
            <Status tone="blue">Đang chờ duyệt báo giá</Status>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-soft">
            <Download size={16} />
            Tải file PDF báo giá
          </button>
          <button className="btn btn-primary">
            <Phone size={16} />
            Gọi Cố vấn dịch vụ
          </button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="card p-5 lg:col-span-8">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                VIN: JM1BP2SHA129481
              </span>
              <h2 className="heading mt-3 text-xl font-bold">
                Mazda 3 Premium 1.5L
              </h2>
              <p className="text-xs text-slate-500">
                Màu đỏ Soul Red Crystal | Phiên bản Sedan
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 px-5 py-2 text-center">
              <small>BIỂN SỐ ĐĂNG KÝ</small>
              <b className="mono block text-xl text-blue-700">43A-123.45</b>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Số ODO hiện tại", "42.580 km"],
              ["Cố vấn dịch vụ", "Trần Minh Tuấn"],
              ["KTV Trưởng", "Đặng Quốc Bảo"],
              ["Khoang tiếp nhận", "Bay #04"],
            ].map(([a, b]) => (
              <div className="rounded-lg bg-blue-50 p-3 text-xs" key={a}>
                <span className="text-slate-500">{a}</span>
                <b className="mt-1 block">{b}</b>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-blue-100 p-3 text-xs">
            <b className="text-blue-800">
              Dự kiến hoàn thành giao xe: 16:30 Hôm nay (24/10/2024)
            </b>
          </div>
        </div>
        <div className="card p-4 lg:col-span-4">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-red-600">● LIVE CAM KHOANG MÁY</span>
            <span>CAM-BAY-04</span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg">
            <Image
              fill
              unoptimized
              className="object-cover"
              alt="Mazda 3 trên cầu nâng trong khoang kỹ thuật"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDosBKm2MMoz65ng_CfvnkhmcwnitA77iniJ-_7K8keh5Qm8ZFR27j6NTeMh-hSD2izu3vedVtVgFqalNOnoYgPwTAc6cO2PXIL_rwDjUTF9BvkIi_iE98so3fk4LH1wtsrgtINY2syDono71oCmIxXG0w0QbP8oqXVGAI6ZJ0iHs0Ccfy8xexYMWJVg_I5szTbmfkyJG9BAZYJaB40izZdEuxwuaxXsmLE3IgS5UyA2LsQiRBRWk3N"
            />
          </div>
        </div>
      </div>
      <div className="card p-5">
        <h2 className="font-bold">Tiến trình dịch vụ & Sửa chữa</h2>
        <div className="scrollbar-none mt-6 overflow-x-auto">
          <div className="relative flex min-w-[950px] justify-between">
            <div className="absolute left-8 right-8 top-5 h-1 bg-blue-100" />
            {[
              "Tiếp nhận",
              "Chẩn đoán",
              "Báo giá & Duyệt",
              "Bắt đầu làm",
              "Đang sửa chữa",
              "KCS Kiểm định",
              "Rửa xe spa",
              "Bàn giao xe",
            ].map((x, i) => (
              <div className="relative w-28 text-center" key={x}>
                <span
                  className={`mx-auto grid h-10 w-10 place-items-center rounded-full font-bold ${i < 2 ? "bg-blue-700 text-white" : i === 2 ? "bg-blue-700 text-white ring-4 ring-blue-100" : "bg-blue-100 text-slate-500"}`}
                >
                  {i < 2 ? <Check size={18} /> : i + 1}
                </span>
                <b
                  className={`mt-2 block text-[11px] ${i === 2 ? "text-blue-700" : ""}`}
                >
                  {i + 1}. {x}
                </b>
                <small className="text-[9px] text-slate-500">
                  {i < 2 ? "Hoàn tất" : i === 2 ? "ĐANG Ở ĐÂY" : "Kế tiếp"}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-4 rounded-xl bg-blue-50 p-5">
        <Bot className="shrink-0 text-blue-700" />
        <p className="text-xs leading-5">
          <b className="text-blue-700">Phân tích từ AutoCare AI:</b> Báo giá
          hoàn toàn hợp lý cho Mazda 3 ở mốc 42.580 km. Việc láng phẳng đĩa và
          thay má phanh kịp thời giúp tiết kiệm khoảng <b>3.500.000 ₫</b>.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {inspections.map(([t, s, d, v, tone]) => (
          <div
            className={`card border-t-2 p-4 ${tone === "red" ? "border-t-red-600" : tone === "green" ? "border-t-emerald-700" : "border-t-amber-600"}`}
            key={t}
          >
            <div className="flex justify-between gap-2">
              <b>{t}</b>
              <span className="rounded bg-slate-100 px-2 py-1 text-[9px] font-bold">
                {s}
              </span>
            </div>
            <p className="mt-3 min-h-16 text-[11px] leading-4 text-slate-600">
              {d}
            </p>
            <div className="mt-3 rounded bg-blue-50 p-2 text-[10px] font-bold">
              {v}
            </div>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="p-5">
          <h2 className="section-title">Bảng báo giá sửa chữa chi tiết</h2>
          <p className="text-xs text-slate-500">
            Phụ tùng chính hãng OEM và kết quả kiểm tra thực tế
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="app-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Hạng mục dịch vụ & phụ tùng</th>
                <th>Mã phụ tùng</th>
                <th>SL</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {quote.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td
                      key={c}
                      className={i === 4 ? "font-bold text-blue-700" : ""}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="rounded-lg bg-blue-50 p-4 text-xs leading-6">
            <b className="text-blue-700">
              <ShieldCheck className="mr-2 inline" size={16} />
              Cam kết minh bạch AutoCare AI
            </b>
            <p className="mt-2">
              Phụ tùng thay thế được giữ lại; linh kiện có tem QR nguồn gốc;
              không phát sinh phụ phí.
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-xs">
            <div className="flex justify-between">
              <span>Tạm tính linh kiện & công:</span>
              <b>2.280.000 ₫</b>
            </div>
            <div className="mt-2 flex justify-between text-emerald-700">
              <span>Ưu đãi thành viên:</span>
              <b>-100.000 ₫</b>
            </div>
            <div className="mt-3 flex justify-between border-t pt-3">
              <b>TỔNG CỘNG</b>
              <b className="text-2xl text-blue-700">2.354.400 ₫</b>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t p-4">
          <button onClick={() => setModal(true)} className="btn btn-primary">
            <Check size={17} />
            Duyệt báo giá & Bắt đầu sửa chữa ngay
          </button>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <div className="card relative max-w-md p-6">
            <button
              onClick={() => setModal(false)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>
            <h2 className="section-title">Xác nhận duyệt báo giá</h2>
            <p className="mt-4 text-sm leading-6">
              Bạn đồng ý duyệt tổng chi phí{" "}
              <b className="text-blue-700">2.354.400 ₫</b> cho xe Mazda 3
              (43A-123.45). Kỹ thuật viên sẽ bắt đầu sửa chữa ngay.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setModal(false)}
                className="btn btn-soft flex-1"
              >
                Xem lại
              </button>
              <button
                onClick={() => setModal(false)}
                className="btn btn-primary flex-1"
              >
                Đồng ý sửa chữa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
