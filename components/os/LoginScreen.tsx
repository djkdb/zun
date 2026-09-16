"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";

export function LoginScreen({ reduce, onEnter }: { reduce: boolean; onEnter: () => void }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
      transition={{ duration: reduce ? 0.001 : 0.45 }}
      className="absolute inset-0 z-[9950] flex flex-col items-center justify-center gap-4 bg-bg-1/70 px-6 backdrop-blur-2xl"
    >
      <motion.span
        aria-hidden
        animate={reduce ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        className="grid h-24 w-24 place-items-center rounded-3xl border border-line-strong bg-bg-2/70 font-pixel text-4xl leading-none text-fg shadow-2xl backdrop-blur-xl"
      >
        Z
      </motion.span>

      <h1 className="font-pixel text-2xl tracking-widest text-fg">{profile.brand}</h1>
      <p className="font-mono text-xs tracking-[0.2em] text-fg-muted">{profile.formula}</p>

      <button
        type="button"
        onClick={onEnter}
        autoFocus
        className="mt-3 rounded-full border border-accent bg-accent px-7 py-2.5 text-sm font-bold text-bg transition-colors hover:bg-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
      >
        ENTER
      </button>
      <p className="font-mono text-[11px] text-fg-dim">잠겨 있지 않습니다 — 눌러서 들어오세요</p>
    </motion.div>
  );
}
