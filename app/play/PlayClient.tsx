"use client";

import dynamic from "next/dynamic";

const Playground = dynamic(() => import("@/components/play/Playground").then((m) => m.Playground), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#f2dd8a] font-mono text-sm tracking-[0.2em] text-[#0b1226]">
      LOADING PLAYGROUND…
    </div>
  ),
});

export function PlayClient() {
  return <Playground />;
}
