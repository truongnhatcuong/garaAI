"use client";

import { useEffect, useRef } from "react";

export function DiagnosticVehicle() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const resizeScene = (event: MessageEvent<unknown>) => {
      const frame = frameRef.current;
      if (!frame || event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
      const data = event.data;
      if (typeof data !== "object" || data === null || !("type" in data) || data.type !== "veyra:height") return;
      if (!("height" in data) || typeof data.height !== "number" || !Number.isFinite(data.height)) return;
      if (data.height < 200 || data.height > 6000) return;
      frame.style.height = `${Math.ceil(data.height)}px`;
    };
    window.addEventListener("message", resizeScene);
    // The iframe may finish loading before React hydrates this component.
    frameRef.current?.contentWindow?.postMessage({ type: "veyra:measure" }, window.location.origin);
    return () => window.removeEventListener("message", resizeScene);
  }, []);

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl bg-[#edf4ff]">
      <iframe
        ref={frameRef}
        src="/veyra/index.html"
        title="Khám phá xe điện VEYRA — Hiểu xe từ bên trong."
        loading="lazy"
        className="block h-[700px] w-full border-0"
        onLoad={() => frameRef.current?.contentWindow?.postMessage({ type: "veyra:measure" }, window.location.origin)}
      />
    </div>
  );
}
