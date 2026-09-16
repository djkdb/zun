"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { APPS, DOCK_ORDER } from "./registry";
import { useOS } from "./OSProvider";
import type { AppId } from "./types";

export function Dock() {
  const os = useOS();
  const minimized = os.windows.filter((w) => w.isMinimized);
  const running = new Set(os.windows.map((w) => w.appId));

  return (
    <div
      className="absolute bottom-2 left-1/2 z-[8000] flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-end gap-1 rounded-[4px] border border-line-strong bg-bg-1/80 p-1.5 shadow-[0_20px_44px_-16px_rgba(0,0,0,.7)] backdrop-blur-xl max-[760px]:bottom-0 max-[760px]:left-0 max-[760px]:w-full max-[760px]:max-w-none max-[760px]:translate-x-0 max-[760px]:justify-start max-[760px]:overflow-x-auto max-[760px]:rounded-none max-[760px]:border-x-0 max-[760px]:border-b-0 max-[760px]:px-2 max-[760px]:pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      {DOCK_ORDER.map((id) => (
        <DockIcon key={id} appId={id} running={running.has(id)} />
      ))}

      <div className="mx-1 w-px self-stretch bg-line-strong max-[760px]:hidden" aria-hidden />

      {minimized.map((w) => (
        <button
          key={w.id}
          type="button"
          title={w.title}
          aria-label={`${w.title} 복원`}
          onClick={() => os.focusWindow(w.id)}
          className="relative grid h-10 w-[50px] flex-none place-items-center overflow-hidden rounded-[3px] border border-line-strong bg-bg-2/80 text-lg transition-colors hover:border-accent/60 max-[760px]:hidden"
        >
          <span className="absolute inset-x-0 top-0 h-2 border-b border-line bg-bg-3/70" aria-hidden />
          {APPS[w.appId].icon}
        </button>
      ))}
      {minimized.length > 0 && (
        <div className="mx-1 w-px self-stretch bg-line-strong max-[760px]:hidden" aria-hidden />
      )}

      <DockIcon appId="trash" running={running.has("trash")} />
    </div>
  );
}

function DockIcon({ appId, running }: { appId: AppId; running: boolean }) {
  const os = useOS();
  const app = APPS[appId];
  const [bounce, setBounce] = useState(0);


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
      className="group relative grid h-[50px] w-[50px] flex-none place-items-center rounded-[4px] border border-line bg-bg-2/70 text-[24px] transition-colors hover:border-accent/60 hover:bg-bg-3/70 max-[760px]:h-11 max-[760px]:w-11 max-[760px]:text-[21px] max-[760px]:!scale-100"
    >
      <span aria-hidden>{app.icon}</span>
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-[3px] border border-line-strong bg-bg-1 px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 max-[760px]:hidden">
        {app.name}
      </span>
      <span
        aria-hidden
        className={`absolute inset-x-2 -bottom-[3px] h-[2px] bg-accent transition-opacity ${
          running ? "opacity-100" : "opacity-0"
        }`}
      />
    </motion.button>
  );
}
