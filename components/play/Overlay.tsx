"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/lib/hooks";
import { profile, projects, links, contentBrand } from "@/data";
import { isTodo } from "@/lib/utils";
import { inputs } from "./store";
import { ZONES } from "./zones";

function ZoneCard({ id }: { id: string }) {
  const zone = ZONES.find((z) => z.id === id)!;
  return (
    <div className="pointer-events-auto w-[min(92vw,26rem)] bg-bg-1/95 p-5 text-fg backdrop-blur-md pixel-border">
      <p className="font-mono text-[11px] tracking-[0.2em]" style={{ color: zone.color }}>
        ZONE / {zone.label}
      </p>
      {id === "about" && (
        <>
          <h2 className="mt-2 font-pixel text-xl">WHO IS ZUN?</h2>
          <p className="prose-ko mt-2 text-sm text-fg-muted">{profile.school} · {profile.roles.join(" · ")}</p>
          <p className="prose-ko mt-2 text-sm">{profile.intro}</p>
        </>
      )}
      {id === "projects" && (
        <>
          <h2 className="mt-2 font-pixel text-xl">PROJECT LAB</h2>
          <ul className="mt-3 space-y-1.5 font-mono text-sm">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <span>{p.title}</span>
                <span className="text-[10px] tracking-[0.14em] text-fg-dim">{p.draft || isTodo(p.tagline) ? "DRAFT" : p.year ?? "LIVE"}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {id === "content" && (
        <>
          <h2 className="mt-2 font-pixel text-xl">WHAT I SHARE</h2>
          <p className="prose-ko mt-2 text-sm text-fg-muted">만드는 과정을 그대로 공개합니다.</p>
          <a href={contentBrand.url} target="_blank" rel="noreferrer noopener" className="mt-3 inline-block font-mono text-sm text-accent-strong hover:text-fg">
            {contentBrand.handle} ↗
          </a>
        </>
      )}
      {id === "contact" && (
        <>
          <h2 className="mt-2 font-pixel text-xl">LET&apos;S BUILD.</h2>
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
      <Link href={zone.href} className="mt-4 inline-flex min-h-10 items-center bg-accent px-4 font-mono text-xs uppercase tracking-[0.14em] text-bg pixel-corners hover:bg-accent-strong">
        OPEN {zone.label} →
      </Link>
    </div>
  );
}

function PadButton({ k, label, className }: { k: keyof typeof inputs; label: string; className?: string }) {
  const on = () => (inputs[k] = true);
  const off = () => (inputs[k] = false);
  return (
    <button
      type="button"
      aria-label={label}
      className={`pointer-events-auto flex h-14 w-14 select-none items-center justify-center bg-bg-1/80 font-pixel text-lg text-fg backdrop-blur-sm pixel-border active:bg-accent active:text-bg ${className ?? ""}`}
      onPointerDown={(e) => { e.preventDefault(); on(); }}
      onPointerUp={off}
      onPointerLeave={off}
      onPointerCancel={off}
      onContextMenu={(e) => e.preventDefault()}
    >
      {label}
    </button>
  );
}

export function Overlay({ zone, onReset }: { zone: string | null; onReset: () => void }) {
  const coarse = useMediaQuery("(pointer: coarse)");

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="pointer-events-auto bg-bg-1/85 px-3 py-2 backdrop-blur-sm pixel-border">
          <Link href="/" className="font-pixel text-sm text-fg hover:text-accent-strong">
            ← ZUN
          </Link>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.2em] text-fg-dim">PLAYGROUND · v0.1</p>
          {coarse && <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-fg-muted">패드로 운전 · 존에 들어가면 열려요</p>}
        </div>
        <div className="hidden bg-bg-1/85 px-3 py-2 font-mono text-[11px] tracking-[0.14em] text-fg-muted backdrop-blur-sm pixel-border sm:block">
          ↑↓←→ / WASD · SHIFT BOOST
        </div>
      </div>

      <AnimatePresence>
        {zone && (
          <motion.div
            key={zone}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-16 -translate-x-1/2 sm:top-20"
          >
            <ZoneCard id={zone} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end justify-between">
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
          <div />
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
