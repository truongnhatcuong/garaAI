import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export function IconBox({
  icon: Icon,
  tone = "blue",
}: {
  icon: LucideIcon;
  tone?: "blue" | "teal" | "red";
}) {
  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-lg",
        tone === "blue" && "bg-blue-50 text-blue-700",
        tone === "teal" && "bg-cyan-50 text-cyan-800",
        tone === "red" && "bg-red-50 text-red-700",
      )}
    >
      <Icon size={20} />
    </div>
  );
}
export function Status({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "amber" | "red" | "green" | "slate";
}) {
  return (
    <span
      data-tone={tone}
      className={cn(
        "status",
        tone === "blue" && "bg-blue-100 text-blue-800",
        tone === "amber" && "bg-amber-100 text-amber-800",
        tone === "red" && "bg-red-100 text-red-700",
        tone === "green" && "bg-emerald-100 text-emerald-800",
        tone === "slate" && "bg-slate-100 text-slate-700",
      )}
    >
      {children}
    </span>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.12em] text-blue-700">
            {eyebrow}
          </p>
        )}
        <h1 className="heading text-2xl font-bold tracking-tight md:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-3xl text-sm text-slate-600">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
export function EmptyPage({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <PageHeading title={title} description={description} />
      <div className="card grid min-h-[420px] place-items-center p-8 text-center">
        <div className="max-w-md">
          <Icon className="mx-auto mb-4 text-blue-700" size={42} />
          <h2 className="heading text-xl font-bold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
