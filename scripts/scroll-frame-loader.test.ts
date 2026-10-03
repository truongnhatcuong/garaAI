import assert from "node:assert/strict";
import test from "node:test";
import { ScrollFrameLoader, type ScrollFrame } from "../src/lib/scroll-frame-loader";

const tick = () => new Promise<void>((resolve) => setImmediate(resolve));
async function settle() {
  for (let index = 0; index < 20; index++) await tick();
}

function fakeFrame(release: () => void): ScrollFrame {
  return { image: {} as CanvasImageSource, width: 1280, height: 720, release };
}

test("reverse scrolling reuses compressed frames while releasing decoded frames", async () => {
  const downloads = new Map<string, number>();
  let alive = 0;
  let released = 0;
  const loader = new ScrollFrameLoader({
    count: 10, url: String, decodedLimit: 3, encodedByteLimit: 100,
    onFrame: () => undefined,
    fetchFrame: async (url) => {
      downloads.set(url, (downloads.get(url) ?? 0) + 1);
      return new Blob([url]);
    },
    decodeFrame: async () => {
      alive++;
      return fakeFrame(() => { alive--; released++; });
    },
  });
  loader.seek(0, 1);
  loader.setPreloading(true);
  await settle();
  loader.seek(9, 1);
  await settle();
  assert.ok(loader.get(9));
  assert.ok(alive <= 3);
  loader.seek(0, -1);
  await settle();
  assert.ok(loader.get(0));
  assert.equal(downloads.get("0"), 1);
  assert.ok(released > 0);
  loader.dispose();
  assert.equal(alive, 0);
});

test("large scroll jumps prioritize the requested frame over distant downloads", async () => {
  const requested: string[] = [];
  const loader = new ScrollFrameLoader({
    count: 10, url: String, decodedLimit: 2, encodedByteLimit: 100, fetchConcurrency: 1,
    onFrame: () => undefined,
    fetchFrame: (url, signal) => {
      requested.push(url);
      return new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
      });
    },
  });
  loader.seek(0, 1);
  loader.seek(9, 1);
  await settle();
  assert.deepEqual(requested, ["0", "9"]);
  loader.dispose();
  await settle();
});

test("fallback frames never move against the current scroll direction", async () => {
  const loader = new ScrollFrameLoader({
    count: 10, url: String, decodedLimit: 3, encodedByteLimit: 100,
    onFrame: () => undefined,
    fetchFrame: async (url) => new Blob([url]),
    decodeFrame: async () => fakeFrame(() => undefined),
  });
  loader.seek(4, 1);
  await settle();
  assert.equal(loader.closest(6, 5, 1)?.index, 5);
  assert.equal(loader.closest(2, 3, -1)?.index, 3);
  assert.equal(loader.closest(6, 6, 1), undefined);
  loader.dispose();
});

test("a frame that finishes decoding after unmount is released immediately", async () => {
  let finish: ((frame: ScrollFrame) => void) | undefined;
  let released = 0;
  let updates = 0;
  const loader = new ScrollFrameLoader({
    count: 1, url: String, decodedLimit: 1, encodedByteLimit: 100,
    onFrame: () => { updates++; },
    fetchFrame: async () => new Blob(["frame"]),
    decodeFrame: () => new Promise((resolve) => { finish = resolve; }),
  });
  loader.seek(0, 1);
  await settle();
  assert.ok(finish);
  loader.dispose();
  finish(fakeFrame(() => { released++; }));
  await settle();
  assert.equal(released, 1);
  assert.equal(updates, 0);
});

test("a slow background decode leaves capacity for a new exact frame", async () => {
  const started: number[] = [];
  const waiting: ((frame: ScrollFrame) => void)[] = [];
  const loader = new ScrollFrameLoader({
    count: 10, url: String, decodedLimit: 4, encodedByteLimit: 100,
    onFrame: () => undefined,
    fetchFrame: async (url) => new Blob([url]),
    decodeFrame: async (blob) => {
      const index = Number(await blob.text());
      started.push(index);
      if (index === 0) return fakeFrame(() => undefined);
      return new Promise((resolve) => { waiting.push(resolve); });
    },
  });
  loader.seek(0, 1);
  await settle();
  assert.deepEqual(started, [0, 1]);
  loader.seek(5, 1);
  await settle();
  assert.deepEqual(started, [0, 1, 5]);
  loader.dispose();
  for (const resolve of waiting) resolve(fakeFrame(() => undefined));
  await settle();
});

test("preloading stays in a bounded window and follows forward and reverse scrolling", async () => {
  const downloads: number[] = [];
  const loader = new ScrollFrameLoader({
    count: 480, url: String, decodedLimit: 3, encodedByteLimit: 1000,
    preloadAhead: 6, preloadBehind: 2,
    onFrame: () => undefined,
    fetchFrame: async (url) => {
      downloads.push(Number(url));
      return new Blob([url]);
    },
    decodeFrame: async () => fakeFrame(() => undefined),
  });
  loader.seek(0, 1);
  loader.setPreloading(true);
  await settle();
  assert.deepEqual([...downloads].sort((a, b) => a - b), [0, 1, 2, 3, 4, 5, 6]);
  downloads.length = 0;
  loader.seek(100, 1);
  await settle();
  assert.equal(downloads[0], 100);
  assert.ok(downloads.every((index) => index >= 98 && index <= 106));
  assert.ok(loader.get(100));
  downloads.length = 0;
  loader.seek(50, -1);
  await settle();
  assert.equal(downloads[0], 50);
  assert.ok(downloads.every((index) => index >= 44 && index <= 52));
  assert.ok(loader.get(50));
  loader.dispose();
});

test("pausing aborts requests and does not start more work until resumed", async () => {
  const requests: string[] = [];
  let aborted = 0;
  const loader = new ScrollFrameLoader({
    count: 480, url: String, decodedLimit: 3, encodedByteLimit: 1000,
    fetchConcurrency: 2,
    onFrame: () => undefined,
    fetchFrame: (url, signal) => {
      requests.push(url);
      return new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => {
          aborted++;
          reject(new DOMException("Aborted", "AbortError"));
        }, { once: true });
      });
    },
  });
  loader.seek(0, 1);
  loader.setPreloading(true);
  loader.setActive(false);
  await settle();
  assert.equal(aborted, 2);
  assert.equal(requests.length, 2);
  loader.seek(100, 1);
  await settle();
  assert.equal(requests.length, 2);
  loader.setActive(true);
  await settle();
  assert.equal(requests[2], "100");
  assert.equal(requests.length, 4);
  loader.dispose();
  await settle();
});

test("evicted preloads do not cause repeated downloads when the byte budget is full", async () => {
  const downloads = new Map<string, number>();
  const loader = new ScrollFrameLoader({
    count: 20, url: String, decodedLimit: 2, encodedByteLimit: 5,
    preloadAhead: 10, preloadBehind: 2,
    onFrame: () => undefined,
    fetchFrame: async (url) => {
      downloads.set(url, (downloads.get(url) ?? 0) + 1);
      return new Blob([url]);
    },
    decodeFrame: async () => fakeFrame(() => undefined),
  });
  loader.seek(0, 1);
  loader.setPreloading(true);
  await settle();
  assert.equal(downloads.size, 11);
  assert.ok([...downloads.values()].every((times) => times === 1));
  loader.dispose();
});
