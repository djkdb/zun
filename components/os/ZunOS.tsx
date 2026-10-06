"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { BootScreen } from "./BootScreen";
import { Desktop } from "./Desktop";
import { LoginScreen } from "./LoginScreen";
import { guideSeen } from "./guide";
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
    if (booted)
      queueMicrotask(() => {
        setPhase("desktop");
        if (!guideSeen()) os.setGuide(true);
      });
  }, [os]);

  const enter = useCallback(() => {
    setPhase("desktop");
    try { sessionStorage.setItem("zunos.booted", "1"); } catch { /* ignore */ }

    /*
      Where the visitor starts:
      - First visit: the usage guide, on an otherwise clear desktop. Its
        "만든 것부터 보기" button is the warm start, so 보관함 is not opened
        as well — on a wide screen the two landed on top of each other.
      - Returning, wide screen: 보관함 opens straight away, as before.
      - Returning, phone: nothing opens. A phone window fills nearly the whole
        screen, so opening one hides the desktop and its icons until it is
        closed. 760px is the same breakpoint the layout switches on.
      The guide also replaces the old welcome toast: same message, but it
      stays until read instead of timing out.
    */
    if (!guideSeen()) {
      window.setTimeout(() => os.setGuide(true), 450);
    } else if (!window.matchMedia("(max-width: 760px)").matches) {
      os.openApp("finder");
    }
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
