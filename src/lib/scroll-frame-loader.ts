export type ScrollFrame = {
  image: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
};

type LoaderOptions = {
  count: number;
  url: (index: number) => string;
  decodedLimit: number;
  encodedByteLimit: number;
  onFrame: () => void;
  fetchConcurrency?: number;
  preloadAhead?: number;
  preloadBehind?: number;
  fetchFrame?: (url: string, signal: AbortSignal) => Promise<Blob>;
  decodeFrame?: (blob: Blob) => Promise<ScrollFrame>;
};

async function fetchFrame(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal, cache: "force-cache" });
  if (!response.ok) throw new Error(`Frame unavailable: ${response.status}`);
  return response.blob();
}

async function decodeFrame(blob: Blob): Promise<ScrollFrame> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(blob);
      return { image: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
    } catch {
      // Some browsers support ImageBitmap but not every WebP decoder path.
    }
  }
  const image = new Image();
  const url = URL.createObjectURL(blob);
  image.decoding = "async";
  try {
    image.src = url;
    await image.decode();
    return { image, width: image.naturalWidth, height: image.naturalHeight, release: () => image.removeAttribute("src") };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Keep compressed downloads for reverse scrolling, and only decode a nearby window. */
export class ScrollFrameLoader {
  private readonly blobs = new Map<number, Blob>();
  private readonly frames = new Map<number, ScrollFrame>();
  private readonly fetching = new Map<number, AbortController>();
  private readonly decoding = new Set<number>();
  private readonly downloaded = new Set<number>();
  private readonly failed = new Set<number>();
  private wanted: number[] = [];
  private encodedBytes = 0;
  private target = 0;
  private direction = 1;
  private preloading = false;
  private active = true;
  private disposed = false;

  constructor(private readonly options: LoaderOptions) {}

  seek(index: number, direction: number) {
    if (this.disposed) return;
    this.target = Math.max(0, Math.min(this.options.count - 1, index));
    this.direction = direction < 0 ? -1 : 1;
    this.wanted = this.order(this.options.decodedLimit).slice(0, this.options.decodedLimit);

    this.cancelDistantDownloads();
    this.pump();
  }

  setPreloading(enabled: boolean) {
    if (this.disposed) return;
    this.preloading = enabled;
    this.cancelDistantDownloads();
    this.pump();
  }

  setActive(active: boolean) {
    if (this.disposed) return;
    this.active = active;
    if (!active) {
      for (const controller of this.fetching.values()) controller.abort();
    }
    this.pump();
  }

  get(index: number) {
    const frame = this.frames.get(index);
    const blob = this.blobs.get(index);
    if (blob) {
      this.blobs.delete(index);
      this.blobs.set(index, blob);
    }
    return frame;
  }

  closest(index: number, previous: number, direction: number) {
    let nearest: { index: number; frame: ScrollFrame } | undefined;
    for (const [candidate, frame] of this.frames) {
      // While the exact frame decodes, keep movement in the user's scroll direction.
      const allowed = direction > 0
        ? candidate <= index && (previous < 0 || candidate >= previous)
        : candidate >= index && (previous < 0 || candidate <= previous);
      if (allowed && (!nearest || Math.abs(candidate - index) < Math.abs(nearest.index - index))) nearest = { index: candidate, frame };
    }
    return nearest;
  }

  dispose() {
    this.disposed = true;
    for (const controller of this.fetching.values()) controller.abort();
    for (const frame of this.frames.values()) frame.release();
    this.frames.clear();
    this.blobs.clear();
    this.encodedBytes = 0;
  }

  private order(radius: number, behind = radius) {
    const indices = [this.target];
    for (let offset = 1; offset <= Math.max(radius, behind); offset++) {
      const candidates = [];
      if (offset <= radius) candidates.push(this.target + offset * this.direction);
      if (offset <= behind) candidates.push(this.target - offset * this.direction);
      for (const candidate of candidates) {
        if (candidate >= 0 && candidate < this.options.count) indices.push(candidate);
      }
    }
    return indices;
  }

  private fetchOrder() {
    return this.preloading
      ? this.order(
          this.options.preloadAhead ?? this.options.decodedLimit * 3,
          this.options.preloadBehind ?? this.options.decodedLimit,
        )
      : this.wanted;
  }

  private cancelDistantDownloads() {
    const needed = new Set(this.fetchOrder());
    for (const [index, controller] of this.fetching) {
      if (!needed.has(index)) controller.abort();
    }
  }

  private storeBlob(index: number, blob: Blob) {
    this.blobs.set(index, blob);
    this.encodedBytes += blob.size;
    while (this.encodedBytes > this.options.encodedByteLimit && this.blobs.size > 1) {
      const oldest = [...this.blobs.keys()].find((candidate) => !this.wanted.includes(candidate))
        ?? [...this.blobs.keys()].find((candidate) => candidate !== this.target);
      if (oldest === undefined) break;
      this.encodedBytes -= this.blobs.get(oldest)!.size;
      this.blobs.delete(oldest);
    }
  }

  private pump() {
    if (this.disposed || !this.active) return;
    this.pumpDecoding();
    const order = this.fetchOrder();
    const concurrency = this.options.fetchConcurrency ?? 4;
    for (const index of order) {
      if (this.fetching.size >= concurrency) break;
      if (this.blobs.has(index) || this.frames.has(index) || this.fetching.has(index) || this.failed.has(index)) continue;
      // Do not repeatedly refill an evicted background frame when the byte budget is full.
      if (this.downloaded.has(index) && !this.wanted.includes(index)) continue;
      const controller = new AbortController();
      this.fetching.set(index, controller);
      void (this.options.fetchFrame ?? fetchFrame)(this.options.url(index), controller.signal)
        .then((blob) => {
          if (this.disposed || controller.signal.aborted) return;
          this.downloaded.add(index);
          this.storeBlob(index, blob);
        })
        .catch(() => {
          if (!controller.signal.aborted && !this.disposed) this.failed.add(index);
        })
        .finally(() => {
          this.fetching.delete(index);
          this.pump();
        });
    }
  }

  private pumpDecoding() {
    const targetBlob = this.blobs.get(this.target);
    if (targetBlob && !this.frames.has(this.target) && !this.decoding.has(this.target) && !this.failed.has(this.target) && this.decoding.size < 2) {
      this.startDecoding(this.target, targetBlob);
    }
    // Keep one decode slot available for the next exact scroll position.
    if (this.decoding.size > 0) return;
    for (const index of this.wanted) {
      const blob = this.blobs.get(index);
      if (!blob || this.frames.has(index) || this.decoding.has(index) || this.failed.has(index)) continue;
      this.startDecoding(index, blob);
      break;
    }
  }

  private startDecoding(index: number, blob: Blob) {
    this.decoding.add(index);
    void (this.options.decodeFrame ?? decodeFrame)(blob)
      .then((frame) => {
        if (this.disposed || !this.wanted.includes(index)) {
          frame.release();
          return;
        }
        this.frames.set(index, frame);
        while (this.frames.size > this.options.decodedLimit) {
          const farthest = [...this.frames.keys()].sort((a, b) => Math.abs(b - this.target) - Math.abs(a - this.target))[0];
          this.frames.get(farthest)!.release();
          this.frames.delete(farthest);
        }
        if (this.active) this.options.onFrame();
      })
      .catch(() => { if (!this.disposed) this.failed.add(index); })
      .finally(() => {
        this.decoding.delete(index);
        this.pump();
      });
  }
}
