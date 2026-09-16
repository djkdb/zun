"use client";

import { useState } from "react";
import { journey } from "@/data";
import { ZunCharacter } from "@/components/character";
import { useOS } from "@/components/os/OSProvider";
import { Chip } from "./shell";

/** Journey as a scrubbable time axis rather than a stack of cards. */
export function JourneyApp() {
  const os = useOS();
  const [i, setI] = useState(Math.max(0, journey.findIndex((j) => j.current)));
  const item = journey[i] ?? journey[0];

  if (!item) return <p className="p-8 text-sm text-fg-dim">여정 데이터가 없습니다.</p>;

  return (
    <div className="flex h-full flex-col">
      {/* axis */}
      <div className="flex-none border-b border-line px-5 pb-4 pt-5">
        <div className="relative h-8">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line-strong" />
          <div className="relative flex justify-between">
            {journey.map((j, n) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setI(n)}
                aria-current={n === i}
                className="group relative flex flex-col items-center"
              >
                <span
                  className={`mt-2.5 h-3 w-3 rounded-full border-2 transition-colors ${
                    n === i ? "border-accent bg-accent" : j.current ? "border-ok bg-bg" : "border-line-strong bg-bg"
                  }`}
                />
                <span className={`mt-1.5 font-mono text-[10.5px] ${n === i ? "text-accent-strong" : "text-fg-dim"}`}>
                  {j.year}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* detail */}
      <div className="min-h-0 flex-1 overflow-auto px-6 py-5 max-[560px]:px-4">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] tracking-wider text-fg-dim">
              {item.year}
              {item.current ? " · 현재" : ""}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-fg">{item.title}</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-fg-muted">{item.description}</p>
            <div className="mt-3">{item.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
          </div>
          <div className="flex-none max-[560px]:hidden">
            <ZunCharacter pose={item.pose} size={88} idle={!os.reduce} shadow />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={i === 0}
            onClick={() => setI((n) => Math.max(0, n - 1))}
            className="rounded-lg border border-line-strong px-3 py-1.5 text-xs text-fg disabled:opacity-35 enabled:hover:bg-bg-3/60"
          >
            ← 이전
          </button>
          <p className="font-mono text-[11px] text-fg-dim">
            {i + 1} / {journey.length}
          </p>
          <button
            type="button"
            disabled={i === journey.length - 1}
            onClick={() => setI((n) => Math.min(journey.length - 1, n + 1))}
            className="rounded-lg border border-line-strong px-3 py-1.5 text-xs text-fg disabled:opacity-35 enabled:hover:bg-bg-3/60"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
}
