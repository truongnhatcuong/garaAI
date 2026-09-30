import type { ReactNode } from "react";

export function TableAction({ label, children, danger = false, onClick }: { label: string; children: ReactNode; danger?: boolean; onClick: () => void }) {
  return <button type="button" title={label} aria-label={label} onClick={onClick} className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-primary)] ${danger ? "text-red-700 hover:bg-red-50" : "text-[var(--admin-ink)] hover:bg-slate-100"}`}>{children}</button>;
}
