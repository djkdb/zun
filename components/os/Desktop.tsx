"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { ContextMenu } from "./ContextMenu";
import { DesktopIcon } from "./DesktopIcon";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { Notifications } from "./Notifications";
import { PowerScreen } from "./PowerScreen";
import { Spotlight } from "./Spotlight";
import { Wallpaper } from "./Wallpaper";
import { Window } from "./Window";
import { DESKTOP_ORDER } from "./registry";
import { setDesktopEl, useOS } from "./OSProvider";

export function Desktop() {
  const os = useOS();

  // shortcuts: Meta on macOS, Control elsewhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      const k = e.key.toLowerCase();
      if (meta && (k === "k" || (e.shiftKey && k === "f") || e.key === " ")) {
        e.preventDefault();
        os.setSpotlight(true);
        return;
      }
      if (meta && k === "w" && os.focused) { e.preventDefault(); os.closeWindow(os.focused); return; }
      if (meta && k === "m" && os.focused) { e.preventDefault(); os.minimizeWindow(os.focused); return; }
      if (meta && k === "n") { e.preventDefault(); os.openApp("finder"); return; }
      if (e.key === "Escape") {
        if (os.spotlight) os.setSpotlight(false);
        else if (os.focused) os.closeWindow(os.focused);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [os]);

  return (
    <div
      ref={setDesktopEl}
      className="relative h-full w-full overflow-hidden bg-bg"
    >
      <Wallpaper />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(130% 100% at 50% 0%, transparent 55%, rgba(0,0,0,.22) 100%)" }}
      />

      <div data-menubar>
        <MenuBar />
      </div>

      {/* desktop icons */}
      <div className="absolute inset-x-2.5 bottom-28 top-9 z-10 max-[760px]:inset-x-3 max-[760px]:bottom-[8.5rem] max-[760px]:top-auto max-[760px]:grid max-[760px]:grid-cols-4 max-[760px]:gap-1.5">
        {DESKTOP_ORDER.map((id, i) => (
          <DesktopIcon key={id} appId={id} index={i} />
        ))}
      </div>

      {/* windows */}
      <div data-window className="absolute inset-0 z-20">
        <AnimatePresence>
          {os.windows.map((w) => (
            <Window key={w.id} win={w} />
          ))}
        </AnimatePresence>
      </div>

      <ContextMenu />
      <Notifications />
      <Spotlight />
      <div data-dock>
        <Dock />
      </div>
      <PowerScreen />
    </div>
  );
}
