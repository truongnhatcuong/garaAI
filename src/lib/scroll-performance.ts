/** Limit the backing store by pixels as well as DPR, including large monitors. */
export function scrollCanvasSize(
  cssWidth: number,
  cssHeight: number,
  devicePixelRatio: number,
) {
  const pixelBudget = 1920 * 1080;
  const ratio = Math.min(
    devicePixelRatio || 1,
    2,
    Math.sqrt(pixelBudget / (cssWidth * cssHeight)),
  );
  return {
    width: Math.max(1, Math.round(cssWidth * ratio)),
    height: Math.max(1, Math.round(cssHeight * ratio)),
    ratio,
  };
}

/** Sample active animation; reduce painting frequency only after sustained stalls. */
export class ScrollPerformanceMonitor {
  private previous = 0;
  private intervals: number[] = [];

  reset() {
    this.previous = 0;
    this.intervals = [];
  }

  record(now: number) {
    if (!this.previous || now - this.previous > 250) {
      this.previous = now;
      this.intervals = [];
      return false;
    }
    this.intervals.push(now - this.previous);
    this.previous = now;
    if (this.intervals.length > 45) this.intervals.shift();
    return this.intervals.length === 45
      && this.intervals.filter((interval) => interval > 32).length >= 18;
  }
}
