"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/hooks";

type CursorState = "default" | "pointer" | "project" | "link" | "text" | "hidden";

/**
 * Desktop-only pixel cursor. A 6px electric-blue square with a stepped ring.
 * Native cursor is hidden via the `has-custom-cursor` class on <html>.
 * Elements opt into states via data-cursor="project|link|pointer|text".
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("hidden");
  const enabled = useFinePointer();
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (!raf) raf = requestAnimationFrame(tick);
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor], a, button, input, textarea, [role=button]");
      if (!target) {
        setState("default");
        setLabel("");
        return;
      }
      const c = target.dataset.cursor as CursorState | undefined;
      if (c === "project" || c === "link") {
        setState(c);
        setLabel(c === "project" ? "OPEN" : "GO");
      } else if (target.matches("input, textarea") || c === "text") {
        setState("text");
        setLabel("");
      } else {
        setState("pointer");
        setLabel("");
      }
    };
    const tick = () => {
      rx += (x - rx) * 0.28;
      ry += (y - ry) * 0.28;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    const leave = () => setState("hidden");
    const enter = () => setState("default");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      document.documentElement.classList.remove("has-custom-cursor");
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  const big = state === "project" || state === "link";
  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3px] -mt-[3px] h-[6px] w-[6px] bg-white mix-blend-difference transition-opacity duration-150",
          state === "hidden" && "opacity-0",
          state === "text" && "h-[18px] w-[2px] -mt-[9px] -ml-px",
        )}
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center font-pixel text-[9px] tracking-widest text-accent-strong transition-[width,height,margin,opacity,background-color] duration-200 ease-out",
          state === "hidden" && "opacity-0",
          big ? "-ml-6 -mt-6 h-12 w-12 bg-accent-soft pixel-border-accent" : state === "pointer" ? "-ml-4 -mt-4 h-8 w-8 pixel-border-accent" : "-ml-3 -mt-3 h-6 w-6 pixel-border",
          state === "text" && "opacity-0",
        )}
        style={{ willChange: "transform" }}
      >
        {big && label}
      </div>
    </>
  );
}
