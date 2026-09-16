"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useOS } from "./OSProvider";

export function PowerScreen() {
  const os = useOS();
  const restarting = os.power === "restarting";

  useEffect(() => {
    if (!restarting) return;
    const t = window.setTimeout(() => { os.closeAll(); os.setPower("on"); }, os.reduce ? 200 : 1400);
    return () => window.clearTimeout(t);
  }, [restarting, os]);

  if (os.power === "on") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: os.reduce ? 0.001 : 0.5 }}
      className="absolute inset-0 z-[10001] flex flex-col items-center justify-center gap-5 bg-black px-6 text-center"
    >
      {restarting ? (
        <>
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-fg font-pixel text-2xl leading-none text-bg">Z</span>
          <p className="font-mono text-xs text-fg-dim">다시 시작하는 중…</p>
        </>
      ) : (
        <>
          <p className="font-pixel text-lg tracking-[0.25em] text-fg">SEE YOU SOON.</p>
          <p className="max-w-xs font-mono text-[11.5px] leading-relaxed text-fg-dim">
            ZUN OS를 종료했습니다. 브라우저는 그대로입니다 — 다시 켜거나 일반 보기로 갈 수 있습니다.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => os.setPower("on")}
              className="rounded-full border border-accent bg-accent px-5 py-2 text-sm font-bold text-bg hover:bg-accent-strong"
            >
              다시 켜기
            </button>
            <a
              href="/classic"
              className="rounded-full border border-line-strong px-5 py-2 text-sm text-fg hover:bg-bg-2"
            >
              일반 보기로 가기
            </a>
          </div>
        </>
      )}
    </motion.div>
  );
}
