"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = [
  "Initializing ZUN OS…",
  "Loading Projects…",
  "Loading Journey…",
  "Loading Experiments…",
  "Loading Content…",
  "Loading ZUN…",
];

/**
 * Boot is a visual flourish only — it never gates or delays real loading, and
 * it collapses to a single frame under reduced motion.
 */
export function BootScreen({ reduce, onDone }: { reduce: boolean; onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) {
      const t = window.setTimeout(onDone, 120);
      return () => window.clearTimeout(t);
    }
    if (step >= LINES.length) {
      const t = window.setTimeout(onDone, 520);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 260 : 170);
    return () => window.clearTimeout(t);
  }, [step, reduce, onDone]);

  const pct = Math.round((Math.min(step, LINES.length) / LINES.length) * 100);

  return (
    <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-6 bg-bg px-6">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid h-16 w-16 place-items-center rounded-2xl bg-fg font-pixel text-3xl leading-none text-bg"
      >
        Z
      </motion.div>

      <p className="font-pixel text-sm tracking-[0.3em] text-fg">ZUN OS</p>

      <div className="h-24 w-full max-w-sm font-mono text-[11.5px] leading-relaxed text-fg-dim">
        {LINES.slice(0, step).map((l) => (
          <p key={l}>
            <span className="text-ok">✓</span> {l}
          </p>
        ))}
      </div>

      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="ZUN OS 부팅"
        className="h-[3px] w-48 overflow-hidden rounded-sm bg-line-strong"
      >
        <motion.div
          className="h-full bg-accent"
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0.001 : 0.18 }}
        />
      </div>
      <p className="font-mono text-[11px] tabular-nums text-fg-dim">{pct}%</p>
    </div>
  );
}
