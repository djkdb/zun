"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";
import { seeded } from "@/lib/utils";
import { cn } from "@/lib/utils";

const COLS = 24;
const ROWS = 5;

/**
 * Pixel dissolve at a section boundary. A band of blocks in the *previous*
 * section's colour disintegrates in random order as the boundary scrolls past.
 * Use sparingly (Hero → About only).
 */
export function PixelDissolve({ color = "var(--bg-1)", className }: { color?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "end 45%"] });
  const thresholds = useMemo(
    () => Array.from({ length: COLS * ROWS }, (_, i) => 0.05 + seeded(i * 7 + 3) * 0.85),
    [],
  );
  if (reduce) return null;
  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none relative h-24 w-full overflow-hidden md:h-32", className)}>
      <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
        {thresholds.map((t, i) => (
          <Block key={i} progress={scrollYProgress} threshold={t} color={color} />
        ))}
      </div>
    </div>
  );
}

function Block({ progress, threshold, color }: { progress: MotionValue<number>; threshold: number; color: string }) {
  const opacity = useTransform(progress, (p) => (p < threshold ? 1 : 0));
  return <motion.div style={{ opacity, background: color }} />;
}

/**
 * Pixel reveal for panels/modals: a grid of blocks that dissolves away on mount.
 * Wrap the content; blocks sit on top and disappear in random order.
 */
export function PixelReveal({ children, className, durationMs = 380, color = "var(--bg)" }: { children: React.ReactNode; className?: string; durationMs?: number; color?: string }) {
  const reduce = useReducedMotion();
  const cells = useMemo(() => Array.from({ length: 12 * 8 }, (_, i) => seeded(i * 13 + 1)), []);
  return (
    <div className={cn("relative", className)}>
      {children}
      {!reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: "repeat(12, 1fr)", gridTemplateRows: "repeat(8, 1fr)" }}>
          {cells.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.001, delay: (r * durationMs) / 1000 }}
              style={{ background: color }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
