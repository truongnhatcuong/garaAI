"use client";

import { useEffect, useState } from "react";

type Bay = { id: string; code: string; vehicleId: string | null; vehicle: { plate: string } | null };
type ResponseData = { items?: Bay[]; error?: string };

export function RepairBaySelect({ value, vehicleId, technicianId, currentBayCode, onChange }: {
  value: string;
  vehicleId: string;
  technicianId: string;
  currentBayCode: string;
  onChange: (code: string) => void;
}) {
  const [bays, setBays] = useState<Bay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/bays?pageSize=100&sort=code&direction=asc", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json() as ResponseData;
        if (!response.ok) throw new Error(data.error ?? "Không tải được danh sách khoang.");
        setBays(data.items ?? []);
      })
      .catch((failure: unknown) => {
        if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Không tải được danh sách khoang.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const knownCode = bays.some((bay) => bay.code === value);
  return <div>
    <select
      className="field mt-1.5 w-full"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={loading || Boolean(error) || !vehicleId || !technicianId}
      aria-label="Chọn khoang sửa chữa"
    >
      <option value="">{loading ? "Đang tải khoang…" : !vehicleId ? "Chọn xe trước" : !technicianId ? "Chọn kỹ thuật viên trước" : "Chọn khoang trống"}</option>
      {value && !loading && !knownCode && <option value={value} disabled>Khoang {value} không còn trong danh sách</option>}
      {bays.map((bay) => {
        const occupied = Boolean(bay.vehicleId);
        const current = bay.code === currentBayCode && bay.code === value;
        return <option key={bay.id} value={bay.code} disabled={occupied && !current}>
          Khoang {bay.code}{bay.vehicle?.plate ? ` · Xe ${bay.vehicle.plate}` : " · Trống"}{current ? " (đang gắn phiếu này)" : occupied ? " (đã có xe)" : ""}
        </option>;
      })}
    </select>
    {error && <span role="alert" className="mt-1 block text-xs text-red-700">{error}</span>}
    {!error && !loading && !bays.length && <span className="mt-1 block text-xs text-[var(--admin-muted)]">Chưa có khoang trong hệ thống. Tạo khoang ở mục Khoang sửa chữa trước.</span>}
    {!error && !loading && bays.length > 0 && bays.every((bay) => bay.vehicleId) && !currentBayCode && <span className="mt-1 block text-xs text-amber-700">Tất cả khoang đang có xe. Hoàn tất phiếu đang sửa hoặc giải phóng khoang ở mục Khoang sửa chữa trước khi phân công.</span>}
  </div>;
}
