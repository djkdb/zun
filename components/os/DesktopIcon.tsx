"use client";

import { useRef, useState } from "react";
import { APPS } from "./registry";
import { useOS } from "./OSProvider";
import type { AppId } from "./types";

export function DesktopIcon({ appId, index }: { appId: AppId; index: number }) {
  const os = useOS();
  const app = APPS[appId];
  const [selected, setSelected] = useState(false);
  const last = useRef(0);

  const activate = () => os.openApp(appId);

  return (
    <button
      type="button"
      onBlur={() => setSelected(false)}
      onFocus={() => setSelected(true)}
      onPointerDown={(e) => {
        e.stopPropagation();
        setSelected(true);
        const now = Date.now();
        if (os.narrow || now - last.current < 430) activate();
        last.current = now;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      }}
      style={{ top: index * 88 }}
      className={`absolute right-1.5 w-24 rounded-[3px] px-1 pb-2 pt-1.5 text-center transition-colors max-[760px]:static max-[760px]:w-full ${
        selected ? "bg-select/80 outline outline-1 outline-accent/70" : "hover:bg-fg/10"
      }`}
    >
      <span aria-hidden className="block text-[34px] leading-none drop-shadow-[0_3px_7px_rgba(0,0,0,.5)]">
        {app.icon}
      </span>
      <span className="mx-auto mt-1 inline-block max-w-full truncate rounded-[3px] bg-bg/55 px-1.5 py-0.5 text-[11.5px] leading-tight text-fg backdrop-blur-[2px]">
        {app.deskName ?? app.name}
      </span>
    </button>
  );
}
