import assert from "node:assert/strict";
import test from "node:test";
import { adjacentPeriodDate, buildDashboardBuckets, resolveDashboardPeriod } from "../src/lib/dashboard-period";

test("week starts on Monday in Vietnam and crosses a year boundary", () => {
  const period = resolveDashboardPeriod("week", "2026-01-01");
  assert.equal(period.start.toISOString(), "2025-12-28T17:00:00.000Z");
  assert.equal(period.end.toISOString(), "2026-01-04T17:00:00.000Z");
  assert.equal(buildDashboardBuckets(period).length, 7);
  assert.equal(adjacentPeriodDate(period, -1), "2025-12-22");
});

test("month handles leap day and buckets cover the full period without gaps", () => {
  const period = resolveDashboardPeriod("month", "2024-02-29");
  assert.equal(period.start.toISOString(), "2024-01-31T17:00:00.000Z");
  assert.equal(period.end.toISOString(), "2024-02-29T17:00:00.000Z");
  const buckets = buildDashboardBuckets(period);
  assert.equal(buckets[0].start.getTime(), period.start.getTime());
  assert.equal(buckets.at(-1)?.end.getTime(), period.end.getTime());
  for (let index = 1; index < buckets.length; index++) {
    assert.equal(buckets[index].start.getTime(), buckets[index - 1].end.getTime());
  }
  assert.equal(adjacentPeriodDate(period, 1), "2024-03-01");
});

test("quarter and year navigation follows calendar boundaries", () => {
  const quarter = resolveDashboardPeriod("quarter", "2026-12-31");
  assert.equal(quarter.start.toISOString(), "2026-09-30T17:00:00.000Z");
  assert.equal(quarter.end.toISOString(), "2026-12-31T17:00:00.000Z");
  assert.equal(adjacentPeriodDate(quarter, 1), "2027-01-01");
  const year = resolveDashboardPeriod("year", "2026-06-15");
  assert.equal(buildDashboardBuckets(year).length, 12);
});

test("invalid dates use the current Vietnam date", () => {
  const now = new Date("2026-10-01T18:30:00.000Z");
  assert.equal(resolveDashboardPeriod("day", "2026-02-31", now).date, "2026-10-02");
  assert.equal(resolveDashboardPeriod("unknown", undefined, now).kind, "month");
});
