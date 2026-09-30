import type { LucideIcon } from "lucide-react";
import { EntityTable } from "@/components/admin/EntityTable";

export function EntityPage({ title, description, columns, rows }: {
  title: string;
  description: string;
  icon: LucideIcon;
  columns: string[];
  rows: string[][];
  action?: string;
}) {
  return <div className="mx-auto max-w-[1500px] space-y-4">
    <div><h1 className="admin-page-title">{title}</h1><p className="mt-1 text-xs text-[var(--admin-muted)]">{description}</p></div>
    <EntityTable title={title} columns={columns} rows={rows} />
  </div>;
}
