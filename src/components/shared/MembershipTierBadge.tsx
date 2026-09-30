import { memberTiers } from "@/lib/resource-config";

export const membershipTierColors: Record<string, { card: string; badge: string }> = {
  Bronze: { card: "border-orange-200 bg-orange-50", badge: "border-orange-300 bg-orange-100 text-orange-900" },
  Silver: { card: "border-slate-300 bg-slate-100", badge: "border-slate-400 bg-slate-200 text-slate-800" },
  Gold: { card: "border-amber-300 bg-amber-50", badge: "border-amber-400 bg-amber-100 text-amber-900" },
  Platinum: { card: "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50", badge: "border-slate-300 bg-gradient-to-r from-slate-50 to-sky-100 text-slate-800" },
  Diamond: { card: "border-cyan-200 bg-cyan-50", badge: "border-cyan-300 bg-cyan-100 text-cyan-900" },
};

export function MembershipTierBadge({ tier }: { tier: unknown }) {
  const code = typeof tier === "string" ? tier : "";
  const label = (memberTiers.find((item) => item.value === code)?.label ?? code) || "Chưa có";
  const badge = membershipTierColors[code]?.badge ?? "border-slate-200 bg-slate-50 text-slate-700";
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${badge}`}>{label}</span>;
}
