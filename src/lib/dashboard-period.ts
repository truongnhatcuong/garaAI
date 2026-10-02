export type DashboardPeriodKind = "day" | "week" | "month" | "quarter" | "year";

export type DashboardBucket = {
  start: Date;
  end: Date;
  label: string;
  rangeLabel: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

function vietnamMidnight(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day) - VIETNAM_OFFSET_MS);
}

function dateParts(date: Date) {
  const local = new Date(date.getTime() + VIETNAM_OFFSET_MS);
  return { year: local.getUTCFullYear(), month: local.getUTCMonth() + 1, day: local.getUTCDate() };
}

function formatLocalDate(date: Date) {
  const { year, month, day } = dateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function shortDate(date: Date) {
  const { month, day } = dateParts(date);
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
}

function parseDate(value: string | undefined, now: Date) {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const parsed = vietnamMidnight(year, month, day);
    if (formatLocalDate(parsed) === value) return parsed;
  }
  const today = dateParts(now);
  return vietnamMidnight(today.year, today.month, today.day);
}

export function resolveDashboardPeriod(kindValue?: string, dateValue?: string, now = new Date()) {
  const kind: DashboardPeriodKind = ["day", "week", "month", "quarter", "year"].includes(kindValue ?? "")
    ? kindValue as DashboardPeriodKind
    : "month";
  const selected = parseDate(dateValue, now);
  const { year, month, day } = dateParts(selected);
  let start: Date;
  let end: Date;
  let label: string;

  switch (kind) {
    case "day":
      start = selected;
      end = new Date(start.getTime() + DAY_MS);
      label = `Ngày ${shortDate(start)}/${year}`;
      break;
    case "week": {
      const weekday = (new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7;
      start = new Date(selected.getTime() - weekday * DAY_MS);
      end = new Date(start.getTime() + 7 * DAY_MS);
      label = `${shortDate(start)} – ${shortDate(new Date(end.getTime() - DAY_MS))}/${dateParts(new Date(end.getTime() - DAY_MS)).year}`;
      break;
    }
    case "month":
      start = vietnamMidnight(year, month, 1);
      end = vietnamMidnight(year, month + 1, 1);
      label = `Tháng ${month}/${year}`;
      break;
    case "quarter": {
      const firstMonth = Math.floor((month - 1) / 3) * 3 + 1;
      start = vietnamMidnight(year, firstMonth, 1);
      end = vietnamMidnight(year, firstMonth + 3, 1);
      label = `Quý ${Math.floor((month - 1) / 3) + 1}/${year}`;
      break;
    }
    case "year":
      start = vietnamMidnight(year, 1, 1);
      end = vietnamMidnight(year + 1, 1, 1);
      label = `Năm ${year}`;
  }

  return { kind, date: formatLocalDate(selected), start, end, label };
}

export type DashboardPeriod = ReturnType<typeof resolveDashboardPeriod>;

export function adjacentPeriodDate(period: DashboardPeriod, direction: -1 | 1) {
  const { year, month, day } = dateParts(period.start);
  switch (period.kind) {
    case "day": return formatLocalDate(new Date(period.start.getTime() + direction * DAY_MS));
    case "week": return formatLocalDate(new Date(period.start.getTime() + direction * 7 * DAY_MS));
    case "month": return formatLocalDate(vietnamMidnight(year, month + direction, 1));
    case "quarter": return formatLocalDate(vietnamMidnight(year, month + direction * 3, 1));
    case "year": return formatLocalDate(vietnamMidnight(year + direction, 1, day));
  }
}

export function buildDashboardBuckets(period: DashboardPeriod): DashboardBucket[] {
  const buckets: DashboardBucket[] = [];
  for (let cursor = period.start; cursor < period.end;) {
    let next: Date;
    if (period.kind === "year") {
      const { year, month } = dateParts(cursor);
      next = vietnamMidnight(year, month + 1, 1);
    } else {
      const step = period.kind === "day" ? 3 * 60 * 60 * 1000 : period.kind === "week" ? DAY_MS : 7 * DAY_MS;
      next = new Date(Math.min(cursor.getTime() + step, period.end.getTime()));
    }
    const last = new Date(next.getTime() - 1);
    const label = period.kind === "day"
      ? `${String((cursor.getUTCHours() + 7) % 24).padStart(2, "0")}:00`
      : period.kind === "year"
        ? `Thg ${dateParts(cursor).month}`
        : shortDate(cursor);
    const nextHour = (next.getUTCHours() + 7) % 24;
    const rangeLabel = period.kind === "day"
      ? `${label} – ${String(nextHour === 0 ? 24 : nextHour).padStart(2, "0")}:00, ${shortDate(cursor)}`
      : `${shortDate(cursor)} – ${shortDate(last)}`;
    buckets.push({ start: cursor, end: next, label, rangeLabel });
    cursor = next;
  }
  return buckets;
}
