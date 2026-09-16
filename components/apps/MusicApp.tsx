"use client";

import { profile } from "@/data/profile";
import { Todo } from "./shell";

/** ZUN Radio — a mood card, not a player. No third-party audio is used. */
export function MusicApp() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-6 text-center">
      <div className="grid h-40 w-40 place-items-center rounded-2xl bg-[conic-gradient(from_140deg,#3b82f6,#22d3ee,#a78bfa,#f472b6,#3b82f6)] text-5xl shadow-2xl">
        🎧
      </div>

      <div>
        <p className="text-[15px] font-semibold text-fg">ZUN RADIO</p>
        <p className="mt-1 text-xs text-fg-dim">
          지금 듣는 곡 <Todo />
        </p>
      </div>

      <div className="h-1 w-full max-w-[260px] overflow-hidden rounded-full bg-bg-3">
        <div className="h-full w-[62%] rounded-full bg-accent" />
      </div>

      <div className="flex gap-6 text-xl text-fg-dim" aria-hidden>
        <span>⏮</span>
        <span className="text-fg">⏸</span>
        <span>⏭</span>
      </div>

      <p className="max-w-[32ch] text-[11.5px] leading-relaxed text-fg-dim">
        Last.fm 같은 재생 기록 API를 붙이면 &ldquo;이 사이트는 지금 살아 있다&rdquo;가 증명됩니다. 음원은
        올리지 않고 제목만 가져옵니다. 작업 1시간.
      </p>

      <p className="font-mono text-[10.5px] tracking-wider text-fg-dim">{profile.handle}</p>
    </div>
  );
}
