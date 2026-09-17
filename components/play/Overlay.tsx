"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { profile, projects, links, contentBrand } from "@/data";
import { isTodo } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks";
import { inputs } from "./store";
import { ZONES } from "./zones";
import type { GameState } from "./Playground";

function ZoneCard({ id }: { id: string }) {
  const zone = ZONES.find((z) => z.id === id)!;
  return (
    <div className="pointer-events-auto w-[min(92vw,26rem)] bg-bg-1/95 font-mono backdrop-blur-md pixel-border">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 text-[11px] tracking-[0.18em] text-fg-dim">
        <span>
          <span style={{ color: zone.color }}>▶ RUN</span> line {zone.line}
        </span>
        <span>{zone.label.toLowerCase()}.ts</span>
      </div>
      <div className="p-5 font-sans text-fg">
        {id === "about" && (
          <>
            <h2 className="font-pixel text-xl">WHO IS ZUN?</h2>
            <p className="prose-ko mt-2 text-sm text-fg-muted">
              {profile.school} · {profile.roles.join(" · ")}
            </p>
            <p className="prose-ko mt-2 text-sm">{profile.intro}</p>
          </>
        )}
        {id === "projects" && (
          <>
            <h2 className="font-pixel text-xl">PROJECT LAB</h2>
            <ul className="mt-3 space-y-1.5 font-mono text-sm">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <span>{p.title}</span>
                  <span className="text-[10px] tracking-[0.14em] text-fg-dim">
                    {p.draft || isTodo(p.tagline) ? "DRAFT" : p.year ?? "LIVE"}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        {id === "content" && (
          <>
            <h2 className="font-pixel text-xl">WHAT I SHARE</h2>
            <p className="prose-ko mt-2 text-sm text-fg-muted">만드는 과정을 그대로 공개합니다.</p>
            <a
              href={contentBrand.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-block font-mono text-sm text-accent-strong hover:text-fg"
            >
              {contentBrand.handle} ↗
            </a>
          </>
        )}
        {id === "contact" && (
          <>
            <h2 className="font-pixel text-xl">LET&apos;S BUILD.</h2>
            <ul className="mt-3 space-y-1.5 font-mono text-sm">
              {links
                .filter((l) => l.href !== "/")
                .map((l) => (
                  <li key={l.label}>
                    {l.todo ? (
                      <span className="text-fg-dim">{l.label} · 추가 예정</span>
                    ) : (
                      <a href={l.href} target="_blank" rel="noreferrer noopener" className="text-accent-strong hover:text-fg">
                        {l.label} ↗
                      </a>
                    )}
                  </li>
                ))}
            </ul>
          </>
        )}
        <Link
          href={zone.href}
          className="mt-4 inline-flex min-h-10 items-center bg-accent px-4 font-mono text-xs uppercase tracking-[0.14em] text-bg pixel-corners hover:bg-accent-strong"
        >
          OPEN {zone.label} →
        </Link>
      </div>
    </div>
  );
}

function PadButton({ k, label }: { k: keyof typeof inputs; label: string }) {
  const on = () => (inputs[k] = true);
  const off = () => (inputs[k] = false);
  return (
    <button
      type="button"
      aria-label={label}
      className="pointer-events-auto flex h-14 w-14 select-none items-center justify-center bg-bg-1/80 font-pixel text-lg text-fg backdrop-blur-sm pixel-border active:bg-accent active:text-bg"
      onPointerDown={(e) => {
        e.preventDefault();
        on();
      }}
      onPointerUp={off}
      onPointerLeave={off}
      onPointerCancel={off}
      onContextMenu={(e) => e.preventDefault()}
    >
      {label}
    </button>
  );
}

/** Editor-chrome HUD: a status bar, the problems line, and the zone card. */
export function Overlay({
  zone,
  game,
  flash,
  onReset,
  embedded,
  onExit,
}: {
  zone: string | null;
  game: GameState;
  flash: string | null;
  onReset: () => void;
  /** running inside a ZUN OS window rather than filling the viewport */
  embedded?: boolean;
  /** leave the playground — only wired when embedded */
  onExit?: () => void;
}) {
  const coarse = useMediaQuery("(pointer: coarse)");
  const isError = !!flash && !game.passed;

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
      {/* title bar */}
      <div className="flex items-start justify-between gap-2 p-3 sm:p-4">
        <div className="pointer-events-auto bg-bg-1/90 px-3 py-2 font-mono backdrop-blur-sm pixel-border">
          {embedded ? (
            <button
              type="button"
              onClick={onExit}
              className="font-pixel text-sm text-fg hover:text-accent-strong"
            >
              ← 닫기
            </button>
          ) : (
            <Link href="/" className="font-pixel text-sm text-fg hover:text-accent-strong">
              ← ZUN
            </Link>
          )}
          <p className="mt-0.5 text-[10px] tracking-[0.2em] text-fg-dim">TERMINAL CITY · zun.ts</p>
          {coarse && <p className="mt-1 text-[10px] leading-snug tracking-[0.1em] text-fg-muted">패드로 운전 · 강조된 줄에서 실행</p>}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="whitespace-nowrap bg-bg-1/90 px-3 py-2 font-mono text-[10px] tracking-[0.12em] backdrop-blur-sm pixel-border sm:text-[11px] sm:tracking-[0.14em]">
            <span className="text-fg-muted">tokens </span>
            <span className={game.passed ? "text-ok" : "text-accent-strong"}>
              {game.collected}/{game.total}
            </span>
            <span className="mx-2 text-line-strong">|</span>
            <span className="text-fg-muted">bugs </span>
            <span className={game.bugs ? "text-warn" : "text-fg-dim"}>{game.bugs}</span>
          </div>
          <div className="hidden bg-bg-1/90 px-3 py-2 font-mono text-[11px] tracking-[0.14em] text-fg-muted backdrop-blur-sm pixel-border sm:block">
            ↑↓←→ / WASD · SHIFT BOOST
          </div>
        </div>
      </div>

      {/* zone card */}
      <AnimatePresence>
        {zone && (
          <motion.div
            key={zone}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-20 -translate-x-1/2 sm:top-24"
          >
            <ZoneCard id={zone} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* problems / test output, like an editor's status line */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key={flash}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 sm:bottom-28"
          >
            <div
              className={`bg-bg-1/95 px-4 py-2 font-mono text-xs tracking-[0.1em] backdrop-blur-sm pixel-border ${
                isError ? "text-[#ff8a8a]" : "text-ok"
              }`}
            >
              {isError ? "✕ " : "✓ "}
              {flash}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* bottom bar */}
      <div className="flex items-end justify-between p-3 sm:p-4">
        {coarse ? (
          <div className="grid grid-cols-3 gap-1">
            <div />
            <PadButton k="forward" label="↑" />
            <div />
            <PadButton k="left" label="←" />
            <PadButton k="back" label="↓" />
            <PadButton k="right" label="→" />
          </div>
        ) : (
          <div className="hidden bg-bg-1/80 px-3 py-2 font-mono text-[11px] tracking-[0.14em] text-fg-dim backdrop-blur-sm pixel-border sm:block">
            {game.passed ? "✓ all tests passed — nice" : "problems: collect every token to pass"}
          </div>
        )}
        <button
          type="button"
          onClick={onReset}
          className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-fg/70 bg-bg-1/60 font-mono text-xs tracking-[0.1em] text-fg backdrop-blur-sm hover:border-accent-strong hover:text-accent-strong"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
