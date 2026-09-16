"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { APPS, DOCK_ORDER } from "./registry";
import { useOS } from "./OSProvider";
import type { AppId } from "./types";

export function Dock() {
  const os = useOS();
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [centers, setCenters] = useState<Record<string, number>>({});
  const barRef = useRef<HTMLDivElement | null>(null);

  /* icon centres are measured from the DOM, never read during render */
  const measure = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    const next: Record<string, number> = {};
    bar.querySelectorAll<HTMLElement>("[data-dock-icon]").forEach((el) => {
      const r = el.getBoundingClientRect();
      next[el.dataset.dockIcon as string] = r.left + r.width / 2;
    });
    setCenters(next);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, os.windows.length]);

  const minimized = os.windows.filter((w) => w.isMinimized);
  const running = new Set(os.windows.map((w) => w.appId));

  return (
    <div
      ref={barRef}
      onPointerEnter={measure}
      onPointerMove={(e) => { if (!os.narrow && !os.reduce) setMouseX(e.clientX); }}
      onPointerLeave={() => setMouseX(null)}
      className="absolute bottom-1.5 left-1/2 z-[8000] flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-end gap-1 rounded-[22px] border border-white/25 bg-white/15 p-1.5 shadow-[0_20px_44px_-16px_rgba(0,0,0,.6)] backdrop-blur-2xl backdrop-saturate-200 max-[760px]:bottom-0 max-[760px]:left-0 max-[760px]:w-full max-[760px]:max-w-none max-[760px]:translate-x-0 max-[760px]:justify-start max-[760px]:overflow-x-auto max-[760px]:rounded-none max-[760px]:border-x-0 max-[760px]:border-b-0 max-[760px]:px-2 max-[760px]:pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      {DOCK_ORDER.map((id) => (
        <DockIcon key={id} appId={id} mouseX={mouseX} center={centers[id]} running={running.has(id)} />
      ))}

      <div className="mx-1 w-px self-stretch bg-white/25 max-[760px]:hidden" aria-hidden />

      {minimized.map((w) => (
        <button
          key={w.id}
          type="button"
          title={w.title}
          aria-label={`${w.title} 복원`}
          onClick={() => os.focusWindow(w.id)}
          className="relative grid h-10 w-[52px] flex-none place-items-center overflow-hidden rounded-md border border-white/35 bg-gradient-to-b from-[#4d5570] to-[#2b3145] text-lg shadow-md transition-transform hover:-translate-y-1 max-[760px]:hidden"
        >
          <span className="absolute inset-x-0 top-0 h-2 border-b border-white/20 bg-white/15" aria-hidden />
          {APPS[w.appId].icon}
        </button>
      ))}
      {minimized.length > 0 && (
        <div className="mx-1 w-px self-stretch bg-white/25 max-[760px]:hidden" aria-hidden />
      )}

      <DockIcon appId="trash" mouseX={mouseX} center={centers.trash} running={running.has("trash")} />
    </div>
  );
}

function DockIcon({
  appId, mouseX, center, running,
}: { appId: AppId; mouseX: number | null; center?: number; running: boolean }) {
  const os = useOS();
  const app = APPS[appId];
  const [bounce, setBounce] = useState(0);

  const scale =
    mouseX !== null && center !== undefined
      ? Math.max(1, 1.58 - Math.abs(mouseX - center) / 130)
      : 1;

  const launch = () => {
    const mine = os.windows.filter((w) => w.appId === appId);
    if (!mine.length) {
      if (!os.reduce) setBounce((b) => b + 1);
      os.openApp(appId);
      return;
    }
    const hidden = mine.find((w) => w.isMinimized);
    os.focusWindow(hidden?.id ?? mine[mine.length - 1].id);
  };

  return (
    <motion.button
      type="button"
      data-dock-icon={appId}
      title={app.name}
      aria-label={app.name}
      onClick={launch}
      animate={bounce ? { y: [0, -20, 0, -7, 0] } : { y: 0 }}
      transition={bounce ? { duration: 0.62, ease: "easeOut" } : { duration: 0.15 }}
      style={{ scale, transformOrigin: "bottom center" }}
      className="group relative grid h-[52px] w-[52px] flex-none place-items-center rounded-[13px] border-none bg-gradient-to-b from-white/45 to-[#8e99b8]/35 text-[27px] shadow-[inset_0_1px_0_rgba(255,255,255,.45),0_2px_5px_rgba(0,0,0,.25)] transition-transform max-[760px]:h-11 max-[760px]:w-11 max-[760px]:text-[22px] max-[760px]:!scale-100"
    >
      <span aria-hidden>{app.icon}</span>
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-md border border-line-strong bg-bg-2/95 px-2 py-1 text-[11.5px] text-fg opacity-0 shadow-lg backdrop-blur-lg transition-opacity group-hover:opacity-100 max-[760px]:hidden">
        {app.name}
      </span>
      <span
        aria-hidden
        className={`absolute -bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-fg transition-opacity ${
          running ? "opacity-80" : "opacity-0"
        }`}
      />
    </motion.button>
  );
}
