"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Quantised pointer direction relative to an element, in [-1, 1]. */
export function useLookAt(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [look, setLook] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / Math.max(r.width, 160);
        const dy = (e.clientY - cy) / Math.max(r.height, 160);
        const qx = Math.abs(dx) < 0.25 ? 0 : Math.sign(dx);
        const qy = dy < -0.35 ? -1 : dy > 0.6 ? 1 : 0;
        if (qx !== last.x || qy !== last.y) {
          last = { x: qx, y: qy };
          setLook(last);
        }
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, enabled]);
  return look;
}
