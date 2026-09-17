"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useOS } from "@/components/os/OSProvider";

/**
 * TERMINAL CITY runs inside a window. Three.js only loads once someone starts
 * it, so opening the desktop never pays for the 3D bundle.
 */
const Playground = dynamic(
  () => import("@/components/play/Playground").then((m) => m.Playground),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center font-mono text-xs text-fg-dim">
        TERMINAL CITY 불러오는 중…
      </div>
    ),
  },
);

export function PlaygroundApp() {
  const os = useOS();
  const [running, setRunning] = useState(false);

  if (running) {
    return (
      <div className="relative h-full w-full">
        <Playground embedded onExit={() => setRunning(false)} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 py-8 text-center">
      <span aria-hidden className="text-5xl">🎮</span>
      <h2 className="font-pixel text-base tracking-widest text-fg">TERMINAL CITY</h2>
      <p className="max-w-[40ch] text-[13px] leading-relaxed text-fg-muted">
        바닥이 통째로 코드 에디터입니다. 강조된 줄 위로 차를 몰면 그 줄이 실행되고 해당 카드가 열립니다.
        떠 있는 토큰 8개를 모으면 ALL TESTS PASSED, 빨간 물결선은 속도를 절반으로 떨어뜨립니다.
      </p>
      <p className="font-mono text-[11px] text-fg-dim">
        3D는 지금 불러옵니다 — 데스크톱은 이 비용을 내지 않습니다.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() => { setRunning(true); os.notify("🎮", "TERMINAL CITY", "WASD로 주행, 강조된 줄 위로 올라가 보세요."); }}
          className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-bg hover:bg-accent-strong"
        >
          실행
        </button>
        <a
          href="/play"
          className="rounded-full border border-line-strong px-5 py-2 text-sm text-fg hover:bg-bg-3/60"
        >
          전체 화면으로 열기 ↗
        </a>
      </div>
    </div>
  );
}
