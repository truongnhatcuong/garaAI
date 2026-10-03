import assert from "node:assert/strict";
import test from "node:test";
import { scrollCanvasSize, ScrollPerformanceMonitor } from "../src/lib/scroll-performance";

test("canvas allocations stay bounded on desktop, mobile and 4K high-DPR screens", () => {
  for (const [width, height, dpr] of [[1920, 1080, 2], [3840, 2160, 3], [390, 844, 3]]) {
    const size = scrollCanvasSize(width, height, dpr);
    // Allow a rounding error of one row and column.
    assert.ok(size.width * size.height <= 1920 * 1080 + size.width + size.height);
    assert.ok(size.ratio <= 2);
    if (width === 1920) assert.equal(size.ratio, 1);
    if (width === 390) assert.equal(size.ratio, 2);
  }
});

test("sustained slow animation reduces painting frequency, while 60 and 120 Hz remain normal", () => {
  for (const fps of [30, 60, 120]) {
    const monitor = new ScrollPerformanceMonitor();
    let slow = false;
    for (let index = 1; index <= 90; index++) {
      slow ||= monitor.record(index * 1000 / fps);
    }
    assert.equal(slow, fps === 30);
  }
});

test("idle gaps, resets and isolated stalls do not downgrade quality", () => {
  const monitor = new ScrollPerformanceMonitor();
  let now = 100;
  for (let index = 0; index < 100; index++) {
    now += index === 25 ? 100 : 1000 / 60;
    assert.equal(monitor.record(now), false);
  }
  monitor.reset();
  for (let index = 0; index < 20; index++) {
    now += 50;
    assert.equal(monitor.record(now), false);
  }
  now += 5000;
  assert.equal(monitor.record(now), false);
  for (let index = 0; index < 40; index++) {
    now += 1000 / 60;
    assert.equal(monitor.record(now), false);
  }
});
