"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOS } from "./OSProvider";

export function Notifications() {
  const os = useOS();
  return (
    <div className="pointer-events-none absolute right-2.5 top-9 z-[9800] grid w-[300px] max-w-[calc(100%-1.25rem)] gap-2">
      <AnimatePresence>
        {os.notifications.map((n) => (
          <motion.button
            key={n.id}
            type="button"
            layout
            initial={os.reduce ? { opacity: 0 } : { opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={os.reduce ? { opacity: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: os.reduce ? 0.001 : 0.28 }}
            onClick={() => os.dismiss(n.id)}
            className="pointer-events-auto flex gap-3 rounded-xl border border-line-strong bg-bg-2/92 p-3 text-left shadow-2xl backdrop-blur-2xl"
          >
            <span aria-hidden className="flex-none text-xl">{n.icon}</span>
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-fg">{n.title}</span>
              <span className="mt-0.5 block text-[11.5px] leading-relaxed text-fg-dim">{n.body}</span>
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
