"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Status } from "@/components/ui/AppUi";
import { bayStatus, bayStatusTone } from "@/lib/bay-status";
import { notifyError, notifySuccess } from "@/lib/notify";

type BayStatusCode = "ASSIGNED" | "IN_PROGRESS" | "BLOCKED" | "DONE";
type Bay = {
  id: string;
  code: string;
  statusText: string | null;
  progressNote: string | null;
  reportedAt: Date | string | null;
  vehicle: { name: string; plate: string } | null;
};

const statusOptions: { value: BayStatusCode; label: string }[] = [
  { value: "ASSIGNED", label: bayStatus.assigned },
  { value: "IN_PROGRESS", label: bayStatus.inProgress },
  { value: "BLOCKED", label: bayStatus.blocked },
  { value: "DONE", label: bayStatus.done },
];

function statusCode(value: string | null): BayStatusCode {
  if (value === "Đang thực hiện") return "IN_PROGRESS";
  return statusOptions.find((option) => option.label === value)?.value ?? "ASSIGNED";
}

function BayReportCard({ bay }: { bay: Bay }) {
  const router = useRouter();
  const [status, setStatus] = useState<BayStatusCode>(statusCode(bay.statusText));
  const [note, setNote] = useState(bay.progressNote ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setStatus(statusCode(bay.statusText));
    setNote(bay.progressNote ?? "");
  }, [bay.statusText, bay.progressNote]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "BLOCKED" && !note.trim()) {
      notifyError(new Error("Vui lòng ghi lý do cần hỗ trợ."), "Không gửi được báo cáo.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`/api/employee/bays/${encodeURIComponent(bay.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không gửi được báo cáo khoang.");
      notifySuccess(status === "DONE" ? "Đã chuyển phiếu sang chờ kiểm định và giải phóng khoang." : "Đã gửi tình trạng khoang cho quản trị.");
      router.refresh();
    } catch (error) {
      notifyError(error, "Không gửi được báo cáo khoang.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return <article className="rounded-lg border border-slate-200 bg-white p-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <strong className="text-sm">{bay.code}</strong>
      <Status tone={bayStatusTone(bay.statusText)}>{bay.statusText || "Chưa phân công việc"}</Status>
    </div>
    <p className="mt-2 text-sm text-slate-600">{bay.vehicle ? `${bay.vehicle.name} · ${bay.vehicle.plate}` : "Chưa có xe"}</p>
    {bay.reportedAt && <p className="mt-1 text-xs text-slate-500">Cập nhật lúc {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(bay.reportedAt))}</p>}
    {bay.vehicle && <form onSubmit={(event) => void submit(event)} className="mt-4 space-y-3">
      <label className="block text-xs font-medium text-slate-700">Tình trạng công việc
        <select className="field mt-1.5 w-full" value={status} onChange={(event) => setStatus(event.target.value as BayStatusCode)} disabled={busy}>
          {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label className="block text-xs font-medium text-slate-700">Báo cáo cho quản trị
        <textarea className="field mt-1.5 min-h-24 w-full py-2" maxLength={1000} placeholder="Ví dụ: Đã kiểm tra hệ thống phanh, đang chờ phụ tùng..." value={note} onChange={(event) => setNote(event.target.value)} disabled={busy} />
      </label>
      <button type="submit" className="btn btn-primary disabled:opacity-50" disabled={busy}><Send size={14} />{busy ? "Đang gửi…" : "Gửi cập nhật"}</button>
    </form>}
  </article>;
}

export function EmployeeBayList({ bays }: { bays: Bay[] }) {
  return <section className="card p-5">
    <h2 className="text-base font-semibold">Khoang sửa chữa</h2>
    <p className="mt-1 text-sm text-slate-600">Cập nhật tiến độ cho quản trị. Chọn “Đã hoàn tất” khi xong phần sửa chữa để chuyển phiếu sang kiểm định và giải phóng khoang.</p>
    {bays.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{bays.map((bay) => <BayReportCard key={bay.id} bay={bay} />)}</div> : <p className="mt-3 text-sm text-slate-600">Chưa được phân khoang sửa chữa.</p>}
  </section>;
}
