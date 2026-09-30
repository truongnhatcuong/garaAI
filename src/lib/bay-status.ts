import type { StatusTone } from "@/lib/status";

export const bayStatus = {
  assigned: "Chờ thực hiện",
  inProgress: "Đang sửa",
  blocked: "Cần hỗ trợ",
  done: "Đã hoàn tất",
} as const;

export function bayStatusTone(value: string | null | undefined): StatusTone {
  if (value === "Trống") return "green";
  if (value === bayStatus.done) return "green";
  if (value === bayStatus.inProgress || value === "Đang thực hiện") return "blue";
  if (value === bayStatus.blocked) return "red";
  if (value === bayStatus.assigned) return "amber";
  return "slate";
}
