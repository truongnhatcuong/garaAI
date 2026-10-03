"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { autocareScrollFrames } from "@/generated/autocare-scroll-frames";
import { ScrollFrameLoader } from "@/lib/scroll-frame-loader";
import { scrollCanvasSize, ScrollPerformanceMonitor } from "@/lib/scroll-performance";

const { count, width, height, path, version } =
  autocareScrollFrames;
const frameUrl = (index: number) =>
  `${path}${String(index + 1).padStart(4, "0")}.webp?v=${version}`;

// How far into the scroll (as a fraction of the section) the hero copy stays
// visible before gracefully fading away to let the frame sequence take over.
const HEADING_FADE_RANGE = 0.14;
// Lower = smoother/slower trailing, higher = snappier/closer to raw scroll.
const SCRUB_SMOOTHING = 0.18;
// Last slice of the scroll where the frame sequence dissolves into the
// section below, instead of handing off with a hard, jarring cut.
const END_TRANSITION_RANGE = 0.16;

export function ScrollVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const loaderOverlayRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const endTransitionRef = useRef<HTMLDivElement>(null);
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) {
      loaderOverlayRef.current?.classList.add("opacity-0", "pointer-events-none");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const device = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    });
    // Device hints affect only background loading, never image quality.
    const conservativeLoading = Boolean(
      device.connection?.saveData
      || ["slow-2g", "2g"].includes(device.connection?.effectiveType ?? "")
      || (device.deviceMemory && device.deviceMemory <= 4)
      || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4),
    );
    let paintInterval = 1000 / 60;
    const performanceMonitor = new ScrollPerformanceMonitor();
    let nearby = true;
    let visible = true;
    let target = 0;
    let drawn = -1;
    let direction = 1;
    let animationFrame = 0;
    let disposed = false;
    let hasPainted = false;
    let rawProgress = 0;
    let smoothProgress = 0;
    let rawDirection = 1;
    let cssWidth = 0;
    let cssHeight = 0;
    let lastDrawTime = 0;
    // Keep the poster visible if an image download fails instead of blocking on a spinner.
    const loadingTimeout = window.setTimeout(() => {
      loaderOverlayRef.current?.classList.add("opacity-0", "pointer-events-none");
    }, 1800);

    // Entrance reveal for the overlay copy, independent of the long scrub so
    // it feels intentional the moment the section comes into view.
    const entrance = headingRef.current && !reducedMotion
      ? gsap.fromTo(
          headingRef.current.children,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.15 },
        )
      : null;
    if (headingRef.current && reducedMotion) {
      gsap.set(headingRef.current.children, { opacity: 1, y: 0 });
    }
    if (reducedMotion) {
      scrollCueRef.current?.style.setProperty("display", "none");
      progressFillRef.current?.parentElement?.style.setProperty(
        "display",
        "none",
      );
    }

    const draw = (now: number) => {
      animationFrame = 0;
      if (disposed || !nearby || document.hidden) return;
      const exact = loader.get(target);
      const selected = exact
        ? { index: target, frame: exact }
        : loader.closest(target, drawn, direction);
      if (!selected || drawn === selected.index) return;
      const { frame, index } = selected;
      if (!cssWidth || !cssHeight) return;
      // Bound raster work on high-refresh displays without changing image detail.
      if (now - lastDrawTime < paintInterval) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }
      const scale = Math.max(cssWidth / frame.width, cssHeight / frame.height);
      const imageWidth = frame.width * scale;
      const imageHeight = frame.height * scale;
      const focus =
        cssWidth / cssHeight < 0.8 ? 0.4 + (index / (count - 1)) * 0.25 : 0.5;
      context.drawImage(
        frame.image,
        (cssWidth - imageWidth) * focus,
        (cssHeight - imageHeight) / 2,
        imageWidth,
        imageHeight,
      );
      drawn = index;
      lastDrawTime = now - ((now - lastDrawTime) % paintInterval);
      if (counterRef.current)
        counterRef.current.textContent = `${String(index + 1).padStart(3, "0")} / ${count}`;
      if (!hasPainted) {
        hasPainted = true;
        window.clearTimeout(loadingTimeout);
        // First frame is on screen: dismiss the loading veil so the reveal
        // feels instant instead of waiting for every asset to settle.
        loaderOverlayRef.current?.classList.add(
          "opacity-0",
          "pointer-events-none",
        );
      }
    };

    const requestDraw = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(draw);
    };

    const resizeCanvas = () => {
      const nextCssWidth = canvas.clientWidth;
      const nextCssHeight = canvas.clientHeight;
      const cssChanged = cssWidth !== nextCssWidth || cssHeight !== nextCssHeight;
      cssWidth = nextCssWidth;
      cssHeight = nextCssHeight;
      if (!cssWidth || !cssHeight) return;
      const { width: backingWidth, height: backingHeight, ratio } = scrollCanvasSize(
        cssWidth, cssHeight, window.devicePixelRatio,
      );
      if (!cssChanged && canvas.width === backingWidth && canvas.height === backingHeight) return;
      canvas.width = backingWidth;
      canvas.height = backingHeight;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      drawn = -1;
      requestDraw();
    };

    const createLoader = () =>
      new ScrollFrameLoader({
        count: reducedMotion ? 1 : count,
        url: frameUrl,
        decodedLimit: reducedMotion ? 1 : conservativeLoading ? 8 : 12,
        encodedByteLimit: (conservativeLoading ? 8 : 16) * 1024 * 1024,
        fetchConcurrency: conservativeLoading ? 2 : 4,
        preloadAhead: conservativeLoading ? 12 : 24,
        preloadBehind: 6,
        onFrame: requestDraw,
      });

    const updateFrame = (progress: number, nextDirection: number) => {
      const next = Math.min(
        count - 1,
        Math.max(0, Math.round(progress * (count - 1))),
      );
      const changedDirection =
        nextDirection !== 0 && direction !== nextDirection;
      if (next === target && !changedDirection && loader.get(next)) return;
      if (nextDirection) direction = nextDirection;
      target = next;
      loader.seek(next, direction);
      requestDraw();
    };

    // Drives every scroll-coupled visual (frame target, progress rail, cue
    // fade, heading parallax, end-of-section dissolve) from a single,
    // smoothed progress value.
    const applyProgress = (progress: number, dir: number) => {
      updateFrame(progress, dir);
      if (progressFillRef.current)
        progressFillRef.current.style.transform = `scaleX(${progress})`;
      if (scrollCueRef.current && !reducedMotion) {
        scrollCueRef.current.style.opacity = String(
          Math.max(0, 1 - progress * 16),
        );
      }
      if (headingRef.current && !reducedMotion) {
        const fade = Math.min(1, progress / HEADING_FADE_RANGE);
        headingRef.current.style.opacity = String(1 - fade);
        headingRef.current.style.transform = `translateY(${-fade * 28}px)`;
      }
      // The overlay handles the dissolve without a full-screen color filter.
      const endStart = 1 - END_TRANSITION_RANGE;
      const endEase = Math.max(0, (progress - endStart) / END_TRANSITION_RANGE);
      if (endTransitionRef.current) {
        endTransitionRef.current.style.opacity = String(endEase);
      }
      // Keep translateZ(0) in the computed transform so the canvas stays on
      // its own GPU layer once the inline style takes over from the
      // Tailwind class.
      canvas.style.transform = `translateZ(0) scale(${1 + endEase * 0.04})`;
    };

    const loader = createLoader();
    loader.seek(0, 1);
    const updateActivity = () => {
      loader.setActive(nearby && !document.hidden);
      loader.setPreloading(nearby && !reducedMotion);
      performanceMonitor.reset();
      if (nearby && !document.hidden) requestDraw();
    };
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        nearby = entry.isIntersecting;
        updateActivity();
      },
      { rootMargin: "50% 0px" },
    );
    preloadObserver.observe(section);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      performanceMonitor.reset();
    });
    visibilityObserver.observe(section);
    document.addEventListener("visibilitychange", updateActivity);
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", resizeCanvas, { passive: true });
    resizeCanvas();

    // A gentle lerp decouples frame-stepping from raw scroll events, so fast
    // wheel/trackpad bursts glide between frames instead of snapping — the
    // single biggest lever for perceived scroll smoothness here.
    const smoothTick = () => {
      if (!visible || document.hidden) {
        performanceMonitor.reset();
        return;
      }
      const delta = rawProgress - smoothProgress;
      if (Math.abs(delta) < 0.00005) {
        performanceMonitor.reset();
        return;
      }
      if (paintInterval < 1000 / 30 && performanceMonitor.record(performance.now())) {
        paintInterval = 1000 / 30;
      }
      // Keep the trailing speed consistent on 30, 60 and 120 Hz displays.
      const smoothing = 1 - Math.pow(1 - SCRUB_SMOOTHING, gsap.ticker.deltaRatio(60));
      smoothProgress += delta * smoothing;
      if (Math.abs(rawProgress - smoothProgress) < 0.0008)
        smoothProgress = rawProgress;
      applyProgress(smoothProgress, rawDirection);
    };
    if (!reducedMotion) gsap.ticker.add(smoothTick);

    const trigger = reducedMotion
      ? null
      : ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            rawProgress = self.progress;
            if (self.direction) rawDirection = self.direction;
          },
          onRefresh: (self) => {
            rawProgress = self.progress;
            // Resizes shouldn't replay a long lerp catch-up animation.
            smoothProgress = self.progress;
            if (self.direction) rawDirection = self.direction;
            applyProgress(rawProgress, rawDirection);
          },
        });
    if (trigger) {
      rawProgress = trigger.progress;
      smoothProgress = trigger.progress;
      applyProgress(trigger.progress, trigger.direction || 1);
    } else {
      applyProgress(0, 1);
    }

    return () => {
      disposed = true;
      trigger?.kill();
      entrance?.kill();
      window.clearTimeout(loadingTimeout);
      if (!reducedMotion) gsap.ticker.remove(smoothTick);
      resizeObserver.disconnect();
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", updateActivity);
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrame);
      loader.dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Khám phá AutoCare AI qua hình ảnh"
      className="relative z-50 h-[450vh] bg-[#08131d] text-white motion-reduce:h-screen"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Image
          src={frameUrl(0)}
          width={width}
          height={height}
          alt=""
          unoptimized
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[40%_center] md:object-center"
        />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Chuỗi hình ảnh chiếc xe trong xưởng, thay đổi theo vị trí cuộn trang"
          className="absolute inset-0 h-full w-full will-change-transform [transform:translateZ(0)]"
        />

        {/* End-of-scroll dissolve: softens the hard cut into the section
            below by washing the final frames with the page's light theme
            before the sticky canvas releases. */}
        <div
          ref={endTransitionRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[15] bg-[linear-gradient(0deg,#e7efff_0%,#e7efffcc_22%,transparent_62%)] opacity-0"
        />

        {/* Loading veil: hides the raw <Image> swap-in jank while the canvas
            warms up its first decoded frame, then fades away permanently. */}
        <div
          ref={loaderOverlayRef}
          aria-hidden="true"
          className="absolute inset-0 z-20 flex items-center justify-center bg-[#06111b] transition-opacity duration-700 ease-out"
        >
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#5bc9df]" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#06111bd9_0%,#06111b54_45%,transparent_75%),linear-gradient(0deg,#06111bc7_0%,transparent_38%)]"
        />

        {/* Scroll progress rail: a persistent, high-signal affordance for how
            much of the experience is left, echoing the frame counter. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 h-[3px] w-full bg-white/10"
        >
          <div
            ref={progressFillRef}
            className="h-full w-full origin-left bg-gradient-to-r from-[#5bc9df] to-[#9fe8f1] [transform:scaleX(0)]"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 mx-auto flex w-[calc(100%-40px)] max-w-[1360px] flex-col justify-between py-8 md:w-[calc(100%-96px)] md:py-12">
          <div className="flex items-start justify-between gap-4 text-[10px] font-bold tracking-[.2em] text-[#d8e9f6] md:text-xs">
            <span>
              AUTOCARE AI <span className="mx-2 text-[#5bc9df]">/</span> TRẢI
              NGHIỆM XƯỞNG
            </span>
            <span ref={counterRef} className="tabular-nums">
              001 / {count}
            </span>
          </div>
          <div
            ref={headingRef}
            className="max-w-[700px] pb-16 will-change-transform md:pb-14"
          >
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[.26em] text-[#85dbe8] md:text-xs">
              Chăm sóc xe theo cách bạn có thể tin tưởng
            </span>
            <h2 className="font-[family-name:var(--font-jakarta)] text-[clamp(2.5rem,7vw,6.2rem)] font-extrabold leading-[1.04] tracking-[-.065em]">
              Từng chi tiết.
              <br />
              <span className="text-[#9fe8f1]">Một hành trình an tâm.</span>
            </h2>
            <p className="mt-5 max-w-[460px] text-sm leading-relaxed text-[#d9e5ed] md:text-base">
              Cuộn để khám phá không gian chăm sóc xe và bắt đầu hành trình của
              bạn cùng AutoCare AI.
            </p>
          </div>
        </div>

        {/* Scroll cue: nudges first-time visitors to keep scrolling, fades
            out quickly once they start interacting with the section. */}
        <div
          ref={scrollCueRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[#d8e9f6] transition-opacity md:bottom-10"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[.3em] text-[#85dbe8] md:text-[10px]">
            Cuộn xuống
          </span>
          <svg
            width="18"
            height="26"
            viewBox="0 0 18 26"
            fill="none"
            className="animate-bounce"
          >
            <rect
              x="1"
              y="1"
              width="16"
              height="24"
              rx="8"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
            <circle cx="9" cy="8" r="2" fill="currentColor" />
          </svg>
        </div>
        <a
          ref={skipLinkRef}
          href="#home-content"
          aria-label="Bỏ qua trải nghiệm 3D, đến nội dung trang chủ"
          className="absolute bottom-6 right-5 z-30 inline-flex min-h-11 items-center gap-1.5 px-2 text-[10px] font-medium text-white/60 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fe8f1] motion-reduce:transition-none md:bottom-10 md:right-12"
        >
          Bỏ qua 3D <ArrowDown size={12} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
