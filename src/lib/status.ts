export type StatusTone = "blue" | "amber" | "red" | "green" | "slate";

export function statusTone(status: string): StatusTone {
  if (["CANCELLED", "FAILED"].includes(status)) return "red";
  if (["PENDING", "PENDING_APPROVAL", "WAITING_APPROVAL", "WAITING_PARTS", "UNPAID", "PARTIALLY_PAID", "DRAFT"].includes(status)) return "amber";
  if (["COMPLETED", "PAID", "ACTIVE"].includes(status)) return "green";
  if (["CONFIRMED", "ARRIVED", "IN_PROGRESS", "IN_REPAIR", "REPAIRING", "QUALITY_CHECK", "READY", "READY_FOR_PICKUP", "INTAKE"].includes(status)) return "blue";
  return "slate";
}
