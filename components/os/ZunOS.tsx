"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { BootScreen } from "./BootScreen";
import { Desktop } from "./Desktop";
import { LoginScreen } from "./LoginScreen";
import { OSProvider, useOS } from "./OSProvider";

type Phase = "boot" | "login" | "desktop";

export function ZunOS() {
  return (
    <OSProvider>
      <Shell />
    </OSProvider>
  );
}

function Shell() {
  const os = useOS();
  const [phase, setPhase] = useState<Phase>("boot");

  /* a reload inside the same tab session skips straight to the desktop */
  useEffect(() => {
    let booted = false;
    try {
      booted = sessionStorage.getItem("zunos.booted") === "1";
    } catch {
      /* storage blocked — boot normally */
    }
    if (booted) queueMicrotask(() => setPhase("desktop"));
  }, []);

  const enter = useCallback(() => {
    setPhase("desktop");
    try { sessionStorage.setItem("zunos.booted", "1"); } catch { /* ignore */ }
    os.openApp("finder");
    window.setTimeout(
      () => os.notify("👋", "ZUN OS에 오신 걸 환영합니다", "Dock을 스쳐보고, ⌘K로 검색하고, 바탕화면을 우클릭해 보세요."),
      700,
    );
  }, [os]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Desktop />
      <AnimatePresence>
        {phase === "boot" && <BootScreen key="boot" reduce={os.reduce} onDone={() => setPhase("login")} />}
        {phase === "login" && <LoginScreen key="login" reduce={os.reduce} onEnter={enter} />}
      </AnimatePresence>
    </div>
  );
}
