"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { BatteryCharging, Cog, Maximize2, Minimize2, Minus, Plus, RotateCcw, ScanLine, Settings2 } from "lucide-react";
import styles from "./DiagnosticVehicle.module.css";

const systems = [
  { id: "engine", title: "Động cơ", caption: "SỨC MẠNH VẬN HÀNH", icon: Cog, detail: "Động cơ tạo công suất để xe vận hành. Với động cơ đốt trong, dầu bôi trơn giúp giảm ma sát, còn hệ thống làm mát duy trì nhiệt độ làm việc. Khó khởi động, rung bất thường, hụt công suất hoặc đèn báo động cơ là những dấu hiệu cần kiểm tra. Tại gara, kỹ thuật viên có thể đọc mã lỗi, kiểm tra dầu, nước làm mát và hệ thống nạp, nhiên liệu, đánh lửa tùy loại động cơ để xác định nguyên nhân." },
  { id: "battery", title: "Hệ thống điện", caption: "NĂNG LƯỢNG & KẾT NỐI", icon: BatteryCharging, detail: "Hệ thống điện cấp nguồn cho đèn, bộ điều khiển và các thiết bị trên xe. Ở nhiều xe động cơ đốt trong, ắc quy 12 V cấp điện khi khởi động, còn máy phát nạp lại ắc quy khi động cơ chạy. Xe điện và xe hybrid có thêm hệ thống pin điện áp cao riêng. Khởi động yếu, đèn chập chờn hoặc cảnh báo sạc cần được kiểm tra bằng phép đo ắc quy, nguồn sạc, đường dây và các đầu nối để xác định nguyên nhân." },
  { id: "suspension", title: "Hệ thống treo", caption: "CÂN BẰNG & ÊM ÁI", icon: Settings2, detail: "Hệ thống treo kết nối bánh xe với thân xe. Lò xo đỡ tải và hấp thụ tác động từ mặt đường; giảm chấn kiểm soát dao động, giúp bánh xe duy trì tiếp xúc với đường. Xe nảy nhiều, lắc khi vào cua, có tiếng gõ hoặc lốp mòn không đều là những dấu hiệu cần chú ý. Kỹ thuật viên sẽ kiểm tra giảm chấn, lò xo, khớp nối và bạc cao su, đồng thời đối chiếu tình trạng lốp và góc đặt bánh xe để tìm đúng nguyên nhân." },
] as const;
const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export function DiagnosticVehicle() {
  const [active, setActive] = useState(0);
  const [scan, setScan] = useState(0);
  const [zoom, setZoom] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  const hub = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const lightAnimation = useRef<Animation | null>(null);
  const frame = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const rotation = useRef({ x: 0, y: 0 });
  const drag = useRef<{ id: number; x: number; y: number; startX: number; startY: number } | null>(null);
  const panelId = useId();
  const hintId = useId();
  const system = systems[active];
  const Icon = system.icon;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotion.current = preference.matches;
      if (preference.matches) {
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        animation.current?.cancel();
        lightAnimation.current?.cancel();
        rotation.current = { x: 0, y: 0 };
      }
    };
    const fullscreen = () => setExpanded(document.fullscreenElement === hub.current);
    update();
    preference.addEventListener("change", update);
    document.addEventListener("fullscreenchange", fullscreen);
    return () => {
      preference.removeEventListener("change", update);
      document.removeEventListener("fullscreenchange", fullscreen);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      animation.current?.cancel();
      lightAnimation.current?.cancel();
    };
  }, []);

  function tilt(x: number, y: number) {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (reducedMotion.current) return;
    rotation.current = { x: clamp(x), y: clamp(y) };
    frame.current = requestAnimationFrame(() => {
      if (!scene.current) return;
      const { x, y } = rotation.current;
      const from = getComputedStyle(scene.current).transform;
      animation.current?.cancel();
      animation.current = scene.current.animate([
        { transform: from },
        { transform: `rotateX(${-y * 10}deg) rotateY(${x * 16}deg)` },
      ], { duration: drag.current ? 110 : 500, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
      if (light.current) {
        const lightFrom = getComputedStyle(light.current).transform;
        lightAnimation.current?.cancel();
        lightAnimation.current = light.current.animate([
          { transform: lightFrom }, { transform: `translate(${x * 70}px, ${y * 35}px)` },
        ], { duration: 600, easing: "ease-out", fill: "forwards" });
      }
    });
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (drag.current?.id === event.pointerId) {
      tilt(drag.current.startX + (event.clientX - drag.current.x) / bounds.width * 3, drag.current.startY + (event.clientY - drag.current.y) / bounds.height * 2);
    } else if (event.pointerType === "mouse") {
      tilt((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
    }
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: rotation.current.x, startY: rotation.current.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const directions: Record<string, [number, number]> = { ArrowLeft: [-.2, 0], ArrowRight: [.2, 0], ArrowUp: [0, -.2], ArrowDown: [0, .2] };
    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      tilt(rotation.current.x + direction[0], rotation.current.y + direction[1]);
    } else if (event.key === "Home") { event.preventDefault(); tilt(0, 0); setZoom(0); }
  }

  async function fullscreen() {
    setError("");
    try {
      if (document.fullscreenElement === hub.current) await document.exitFullscreen();
      else if (hub.current?.requestFullscreen) await hub.current.requestFullscreen();
      else setError("Trình duyệt này chưa hỗ trợ xem toàn màn hình.");
    } catch { setError("Không mở được toàn màn hình. Bạn vẫn có thể phóng to bằng nút +."); }
  }

  return <section ref={hub} className={styles.hub} aria-label="Khám phá xe với hiệu ứng 3D">
    <div className={styles.header}>
      <div><span className={styles.brand}><span className={styles.dot} /> AUTOCARE <span className={styles.brandThin}>/ VISUAL LAB</span></span><p className={styles.subtitle}>Khám phá bên trong chiếc xe</p></div>
      <button type="button" className={styles.toolButton} onClick={() => void fullscreen()} aria-label={expanded ? "Thoát toàn màn hình" : "Xem toàn màn hình"} title={expanded ? "Thu nhỏ" : "Toàn màn hình"}>{expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
    </div>
    <div className={styles.viewport} tabIndex={0} role="group" aria-label="Góc nhìn xe tương tác" aria-describedby={hintId} onKeyDown={keyboard} onPointerMove={move} onPointerDown={startDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { drag.current = null; }} onPointerLeave={() => { if (!drag.current) tilt(0, 0); }}>
      <div className={styles.spotlight} ref={light} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true"><span /><span /></div>
      <div className={styles.viewLabel} aria-hidden="true"><span className={styles.cross}>+</span> X-RAY EXPLORER<span className={styles.viewNote}>MÔ PHỎNG TƯƠNG TÁC</span></div>
      <div className={styles.rig} data-zoom={zoom}>
        <div className={styles.scene} ref={scene}>
          <div className={styles.shadow} aria-hidden="true" />
          <div className={styles.vehicle}>
            <Image src="/images/ai-diagnostic-suv.png" alt="Xe SUV trong suốt minh họa động cơ, hệ thống điện và hệ thống treo" fill preload sizes="(max-width: 767px) 100vw, 900px" className="object-contain" draggable={false} />
            <div className={styles.scanClip} aria-hidden="true"><div key={scan} className={styles.scan} /></div>
            <div className={`${styles.componentGlow} ${styles[system.id]}`} aria-hidden="true" />
          </div>
          {systems.map((item, index) => <button key={item.id} type="button" className={`${styles.hotspot} ${styles[item.id]}`} aria-label={`Khám phá ${item.title.toLowerCase()}`} aria-pressed={active === index} aria-controls={panelId} onClick={() => setActive(index)}>
            <span className={styles.target} aria-hidden="true"><span /></span>
            <span className={styles.hotspotLabel}><span className={styles.marker}>0{index + 1}</span>{item.title}</span>
          </button>)}
        </div>
      </div>
      <div className={styles.viewportFooter}><span>CHI TIẾT TẠO NÊN KHÁC BIỆT</span><span className={styles.scale} aria-hidden="true">┊┊┊┊┃┊┊┊┊</span></div>
    </div>
    <div className={styles.toolbar}>
      <button type="button" className={styles.scanButton} onClick={() => setScan((value) => value + 1)}><ScanLine size={15} /> Quét lại</button>
      <div className={styles.viewControls}>
        <button type="button" className={styles.toolButton} disabled={zoom === 0} onClick={() => setZoom((value) => Math.max(0, value - 1))} aria-label="Thu nhỏ xe"><Minus size={15} /></button>
        <output className={styles.zoomValue} aria-label="Mức phóng to">{100 + zoom * 10}%</output>
        <button type="button" className={styles.toolButton} disabled={zoom === 2} onClick={() => setZoom((value) => Math.min(2, value + 1))} aria-label="Phóng to xe"><Plus size={15} /></button>
        <button type="button" className={styles.toolButton} onClick={() => { tilt(0, 0); setZoom(0); }} aria-label="Đặt lại góc nhìn" title="Đặt lại góc nhìn"><RotateCcw size={14} /></button>
      </div>
    </div>
    <div className={styles.systems} role="group" aria-label="Chọn hệ thống xe">
      {systems.map((item, index) => <button key={item.id} type="button" aria-pressed={active === index} aria-controls={panelId} onClick={() => setActive(index)}><item.icon size={15} /><span>{item.title}</span></button>)}
    </div>
    <div id={panelId} className={styles.detail} aria-live="polite" aria-atomic="true">
      <div className={styles.detailHeading}><span className={styles.icon}><Icon size={20} /></span><div><p className={styles.eyebrow}>{system.caption}</p><h2>{system.title}</h2></div></div>
      <p className={`text-xs mt-2 text-gray-300`}>{system.detail}</p>
    </div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
  </section>;
}
