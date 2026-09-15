"use client";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { nowItems, nowUpdated, profile } from "@/data";
import type { NowItem } from "@/data/types";
import { cn } from "@/lib/utils";
import { ZunCharacter } from "@/components/character";

const STATUS: Record<NowItem["status"], { label: string; dot: string; text: string }> = {
  active: { label: "ACTIVE", dot: "bg-ok", text: "text-ok" },
  shipping: { label: "SHIPPING", dot: "bg-accent-strong", text: "text-accent-strong" },
  exploring: { label: "EXPLORING", dot: "bg-accent", text: "text-accent" },
  paused: { label: "PAUSED", dot: "bg-fg-dim", text: "text-fg-dim" },
};

/** Qualitative signal strip — no numbers, just "how alive" a track is. */
function Signal({ status, reduce }: { status: NowItem["status"]; reduce: boolean }) {
  const blocks = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div aria-hidden className="flex gap-[3px]">
      {blocks.map((i) => {
        const lit =
          status === "shipping" ? true : status === "active" ? i % 2 === 0 : status === "exploring" ? i % 3 === 0 : false;
        return (
          <span
            key={i}
            className={cn(
              "h-2 w-2",
              lit ? (status === "paused" ? "bg-fg-dim" : "bg-accent") : "bg-bg-3",
              lit && !reduce && status !== "paused" && "anim-signal",
            )}
            style={lit && !reduce ? { animationDelay: `${i * 90}ms` } : undefined}
          />
        );
      })}
    </div>
  );
}

export function ProgressDashboard() {
  const reduce = usePrefersReducedMotion();
  const ticker = profile.narrative.join("   →   ");

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div className="bg-bg-1 font-mono pixel-border">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5 text-[11px] tracking-[0.16em] text-fg-dim">
          <span>
            zun@now <span className="text-fg-muted">— LAST UPDATE {nowUpdated}</span>
          </span>
          <span className="flex items-center gap-3">
            {(["active", "shipping", "exploring", "paused"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5", STATUS[s].dot)} />
                {STATUS[s].label}
              </span>
            ))}
          </span>
        </div>

        <ul className="divide-y divide-line" role="list">
          {nowItems.map((item) => {
            const s = STATUS[item.status];
            return (
              <li key={item.id} className="grid gap-2 px-4 py-4 sm:grid-cols-[minmax(0,11rem)_auto_minmax(0,1fr)] sm:items-center sm:gap-5">
                <span className="font-pixel text-sm tracking-wide text-fg">{item.label}</span>
                <span className={cn("inline-flex items-center gap-2 text-[11px] tracking-[0.16em]", s.text)}>
                  <span className={cn("h-2 w-2", s.dot, item.status === "active" && !reduce && "anim-pulse-dot")} />
                  {s.label}
                </span>
                <div className="flex flex-col gap-2 sm:items-end">
                  <p className="prose-ko font-sans text-sm text-fg-muted sm:text-right">{item.note}</p>
                  <Signal status={item.status} reduce={reduce} />
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 border-t border-line px-4 py-2.5 text-[11px] text-fg-dim">
          <span className="text-accent-strong">$</span>
          <span>tail -f zun.log</span>
          <span aria-hidden className={cn("inline-block h-[1em] w-[0.55em] bg-accent-strong", !reduce && "anim-caret")} />
        </div>
      </div>

      <div className="hidden md:block">
        <ZunCharacter pose="build" size={132} />
      </div>

      {/* ticker */}
      <div className="overflow-hidden border-y border-line py-2 md:col-span-2">
        <p className="sr-only">{profile.narrative.join(" → ")}</p>
        {reduce ? (
          <p className="text-center font-mono text-[11px] tracking-[0.3em] text-fg-dim">{ticker}</p>
        ) : (
          <div className="flex w-max whitespace-nowrap font-mono text-[11px] tracking-[0.3em] text-fg-dim anim-ticker" aria-hidden>
            <span className="px-6">{ticker}   →   </span>
            <span className="px-6">{ticker}   →   </span>
          </div>
        )}
      </div>
    </div>
  );
}
