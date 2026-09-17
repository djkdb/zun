"use client";

import { APPS } from "./registry";
import { useOS } from "./OSProvider";
import type { AppId } from "./types";

/**
 * One tap opens it.
 *
 * This used to need a double-click inside 430 ms, copying a desktop OS. On a
 * touch screen that is unhittable, and everything else in ZUN OS — Dock,
 * sidebars, Spotlight — opens on a single press, so the icons were the only
 * thing asking for a different gesture. A plain <button> also gives keyboard
 * activation and focus for free.
 */
export function DesktopIcon({ appId, index }: { appId: AppId; index: number }) {
  const os = useOS();
  const app = APPS[appId];

  return (
    <button
      type="button"
      onClick={() => os.openApp(appId)}
      style={{ top: index * 88 }}
      className="group absolute right-1.5 w-24 rounded-[3px] px-1 pb-2 pt-1.5 text-center transition-colors hover:bg-fg/10 focus-visible:bg-select/80 active:bg-select/80 max-[760px]:static max-[760px]:w-full"
    >
      <span
        aria-hidden
        className="block text-[34px] leading-none drop-shadow-[0_3px_7px_rgba(0,0,0,.5)] transition-transform group-active:scale-95"
      >
        {app.icon}
      </span>
      <span className="mx-auto mt-1 inline-block max-w-full truncate rounded-[3px] bg-bg/55 px-1.5 py-0.5 text-[11.5px] leading-tight text-fg backdrop-blur-[2px]">
        {app.deskName ?? app.name}
      </span>
    </button>
  );
}
