"use client";

import { useEffect, useId, useState } from "react";
import { Check, Search, X } from "lucide-react";
import type { ResourceKey } from "@/lib/resource-config";

type Row = Record<string, unknown> & { id: string };
type Result = { items?: Row[]; error?: string };

function labels(resource: ResourceKey, row: Row) {
  const primary = resource === "vehicles" ? row.plate
    : resource === "services" ? row.title
    : row.name ?? row.code ?? row.title ?? row.plate ?? row.sku ?? row.id;
  const secondary = resource === "customers" ? [row.phone, row.email]
    : resource === "vehicles" ? [row.name, (row.customer as Row | undefined)?.name]
    : resource === "services" ? [row.code]
    : resource === "employees" ? [row.code, row.email, row.specialty]
    : resource === "invoices" ? [(row.customer as Row | undefined)?.name]
    : resource === "repair-orders" ? [(row.vehicle as Row | undefined)?.plate]
    : [];
  return { primary: String(primary ?? row.id), secondary: secondary.filter(Boolean).map(String).join(" · ") };
}

export function RelationPicker({ resource, label, value, initialRecord, onChange }: {
  resource: ResourceKey;
  label: string;
  value: string;
  initialRecord?: Row;
  onChange: (id: string) => void;
}) {
  const listId = useId();
  const [query, setQuery] = useState(initialRecord ? labels(resource, initialRecord).primary : "");
  const [items, setItems] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!value || initialRecord) return;
    const controller = new AbortController();
    fetch(`/api/${resource}/${value}`, { signal: controller.signal, cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<Row> : null)
      .then((row) => { if (row) setQuery((current) => current || labels(resource, row).primary); })
      .catch(() => {});
    return () => controller.abort();
  }, [resource, value, initialRecord]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ pageSize: "20", search: query.trim() });
        const response = await fetch(`/api/${resource}?${params}`, { signal: controller.signal, cache: "no-store" });
        const result = await response.json() as Result;
        if (!response.ok) throw new Error(result.error ?? "Không tải được danh sách.");
        setItems(result.items ?? []);
        setActiveIndex(0);
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Không tìm được dữ liệu.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, query ? 250 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [resource, query, open]);

  function choose(row: Row) {
    onChange(row.id);
    setQuery(labels(resource, row).primary);
    setOpen(false);
    setError("");
  }

  return <div className="relative" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <div className="relative">
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" />
      <input
        role="combobox" aria-label={`Tìm và chọn ${label.toLowerCase()}`}
        aria-autocomplete="list" aria-expanded={open} aria-controls={listId}
        aria-activedescendant={open && items[activeIndex] ? `${listId}-${items[activeIndex].id}` : undefined}
        className="field w-full pl-9! pr-9!" placeholder={`Gõ tên hoặc mã ${label.toLowerCase()}...`}
        autoComplete="off" value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => { setQuery(event.target.value); setItems([]); setLoading(true); onChange(""); setOpen(true); }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActiveIndex((index) => Math.min(index + 1, Math.max(0, items.length - 1))); }
          if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)); }
          if (event.key === "Enter" && open && items[activeIndex]) { event.preventDefault(); choose(items[activeIndex]); }
        }}
      />
      {query && <button type="button" aria-label={`Bỏ chọn ${label.toLowerCase()}`} title="Xóa lựa chọn" className="absolute right-1 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded text-[var(--admin-muted)] hover:bg-slate-100" onClick={() => { setQuery(""); setItems([]); onChange(""); setOpen(true); }}><X size={14} /></button>}
    </div>
    {open && <div id={listId} role="listbox" aria-label={`Kết quả ${label.toLowerCase()}`} className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-[var(--admin-line)] bg-white p-1 shadow-xl">
      {loading ? <p className="px-3 py-2 text-xs text-[var(--admin-muted)]">Đang tìm…</p>
        : error ? <p role="alert" className="px-3 py-2 text-xs text-red-700">{error}</p>
        : items.length ? items.map((row, index) => {
          const text = labels(resource, row);
          return <div key={row.id} id={`${listId}-${row.id}`} role="option" aria-selected={value === row.id}
            className={`flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-left hover:bg-blue-50 ${index === activeIndex ? "bg-blue-50" : ""}`}
            onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setActiveIndex(index)} onClick={() => choose(row)}>
            <span className="min-w-0"><strong className="block truncate text-xs font-medium">{text.primary}</strong>{text.secondary && <span className="block truncate text-[11px] text-[var(--admin-muted)]">{text.secondary}</span>}</span>
            {value === row.id && <Check size={15} className="shrink-0 text-blue-700" />}
          </div>;
        }) : <p className="px-3 py-2 text-xs text-[var(--admin-muted)]">Không tìm thấy kết quả. Thử tên, mã hoặc số điện thoại khác.</p>}
    </div>}
  </div>;
}
