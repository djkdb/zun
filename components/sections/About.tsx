"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState, useSyncExternalStore } from "react";
import { profile, projects } from "@/data";
import type { Project, Theme } from "@/data/types";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { scrollToId } from "@/lib/scroll";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/interactions/Reveal";
import { PixelDissolve } from "@/components/interactions/PixelTransition";
import { Tag, TodoTag } from "@/components/ui/Tag";
import { ZunCharacter } from "@/components/character";

/* ─────────────────────────────────────────────
   Keyword field — six themes in a loose orbit around a hub.
   Positions are % of the field box (desktop only; mobile wraps).
   ───────────────────────────────────────────── */
interface KeywordNode {
  id: Theme;
  label: string;
  x: number;
  y: number;
}

const NODES: KeywordNode[] = [
  { id: "software", label: "SOFTWARE", x: 24, y: 22 },
  { id: "ai", label: "AI", x: 60, y: 14 },
  { id: "web", label: "WEB", x: 85, y: 38 },
  { id: "product", label: "PRODUCT", x: 76, y: 72 },
  { id: "content", label: "CONTENT", x: 40, y: 84 },
  { id: "experiment", label: "EXPERIMENT", x: 31, y: 54 },
];

const HUB = { x: 53, y: 47 };

const byTheme = (theme: Theme): Project[] => projects.filter((p) => p.themes.includes(theme));

const isTodo = (s: string) => s.trim().toUpperCase().startsWith("TODO");

/**
 * PixelDissolve is scroll-driven and returns null under reduced motion, which
 * differs between the server render and the client's first pass. Mounting it
 * only on the client (and only when motion is allowed) avoids the mismatch
 * without touching the shared component.
 */
const subscribeNoop = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

export function About() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState<Theme | null>(null);
  const panelId = useId();
  const isClient = useIsClient();
  const prefersReduced = usePrefersReducedMotion();

  const activeNode = NODES.find((n) => n.id === active) ?? null;
  const connected = active ? byTheme(active) : [];

  return (
    <>
      {isClient && !prefersReduced ? <PixelDissolve /> : <div aria-hidden className="h-24 w-full md:h-32" />}
      <Section id="about" divider={false} className="bg-bg">
        <SectionHeader eyebrow="01 / ABOUT" title="WHO IS ZUN?" />

        <div className="grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-start md:gap-10 lg:gap-16">
          {/* ── LEFT: identity ─────────────────────────────── */}
          <div>
            <ul className="space-y-2 md:space-y-2.5" aria-label="Roles">
              {profile.roles.map((role, i) => (
                <Reveal as="li" key={role} delay={0.06 * i} className="flex items-baseline gap-3">
                  <span className="w-5 shrink-0 font-mono text-[11px] tracking-[0.18em] text-fg-dim">0{i + 1}</span>
                  <span className="font-pixel text-2xl leading-[1.15] text-fg sm:text-3xl md:text-[2.35rem] lg:text-[2.6rem]">{role}</span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.25}>
              <p className="mt-8 flex items-center gap-2.5 font-mono text-sm tracking-[0.04em] text-fg-muted">
                <span aria-hidden className="inline-block h-2 w-2 shrink-0 bg-accent" />
                {profile.school}
              </p>

              <div className="prose-ko mt-6 max-w-md space-y-3 text-base leading-relaxed text-fg-muted md:text-lg">
                <p>{profile.intro}</p>
                <p>{profile.intro2}</p>
              </div>

              <p className="mt-9 font-mono text-[10px] tracking-[0.2em] text-fg-dim">INTERESTS</p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Interests">
                {profile.interests.map((it) => (
                  <li key={it}>
                    <Tag>{it}</Tag>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ── RIGHT: interactive keyword field ──────────── */}
          <Reveal delay={0.12} className="min-w-0">
            <div className="relative bg-bg-1 pixel-border md:h-[420px] lg:h-[460px]">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots mask-fade-y opacity-70" />

              {/* field label */}
              <div className="relative flex items-center justify-between px-4 pt-3 font-mono text-[10px] tracking-[0.2em] text-fg-dim md:absolute md:inset-x-0 md:top-0 md:z-10">
                <span>KEYWORD FIELD</span>
                <span>
                  {NODES.length} NODES · {projects.length} PROJECTS
                </span>
              </div>

              {/* connector lines (desktop) */}
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {NODES.map((n) => {
                  const on = n.id === active;
                  return (
                    <line
                      key={n.id}
                      x1={n.x}
                      y1={n.y}
                      x2={HUB.x}
                      y2={HUB.y}
                      stroke="var(--line-strong)"
                      strokeOpacity={on ? 0 : 0.55}
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
                {/* trunk: hub → panel (lights up with the active spoke) */}
                <line
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={HUB.x}
                  y2={100}
                  stroke="var(--line-strong)"
                  strokeOpacity={0.55}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
                {activeNode && (
                  <g key={activeNode.id} stroke="var(--accent)" strokeWidth={1.5}>
                    <motion.line
                      x1={activeNode.x}
                      y1={activeNode.y}
                      x2={HUB.x}
                      y2={HUB.y}
                      vectorEffect="non-scaling-stroke"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                    />
                    <motion.line
                      x1={HUB.x}
                      y1={HUB.y}
                      x2={HUB.x}
                      y2={100}
                      vectorEffect="non-scaling-stroke"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.16, delay: reduce ? 0 : 0.14, ease: "easeOut" }}
                    />
                  </g>
                )}
              </svg>

              {/* hub (desktop) */}
              <div
                aria-hidden
                className="pointer-events-none absolute hidden -translate-y-1/2 items-center gap-2 md:flex"
                style={{ left: `calc(${HUB.x}% - 4px)`, top: `${HUB.y}%` }}
              >
                <span className="block h-2 w-2 bg-accent-strong anim-pulse-dot" />
                <span className="font-mono text-[9px] tracking-[0.24em] text-fg-dim">ZUN</span>
              </div>

              {/* nodes */}
              <div className="relative flex flex-wrap gap-2 px-4 pb-2 pt-4 md:static md:p-0" role="group" aria-label="Keywords">
                {NODES.map((n) => {
                  const on = n.id === active;
                  const count = byTheme(n.id).length;
                  return (
                    <button
                      key={n.id}
                      type="button"
                      aria-pressed={on}
                      aria-controls={panelId}
                      onMouseEnter={() => setActive(n.id)}
                      onFocus={() => setActive(n.id)}
                      onClick={() => setActive(n.id)}
                      style={{ left: `${n.x}%`, top: `${n.y}%` }}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-2 px-3.5 py-2 font-pixel text-xs transition-[background-color,color,box-shadow,transform] duration-150 ease-out sm:text-sm",
                        "md:absolute md:-translate-x-1/2 md:-translate-y-1/2",
                        on
                          ? "bg-bg-3 text-accent-strong pixel-border-accent md:scale-[1.04]"
                          : "bg-bg-2 text-fg pixel-border hover:bg-bg-3",
                      )}
                    >
                      {n.label}
                      <span className={cn("font-mono text-[10px] tracking-normal", on ? "text-accent-strong/80" : "text-fg-dim")}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* character — thinking at the bottom-left of the field */}
              <div className="relative flex items-end gap-3 px-4 pb-4 pt-1 md:absolute md:bottom-3 md:left-4 md:p-0">
                <ZunCharacter pose="think" sizeClass="w-14 md:w-22" />
                <p className="mb-1 font-mono text-[10px] tracking-[0.16em] text-fg-dim md:hidden">TAP A KEYWORD</p>
              </div>

              {/* stub joining the drop line to the panel */}
              {activeNode && (
                <span
                  aria-hidden
                  className="absolute -bottom-3 hidden h-3 w-[2px] -translate-x-1/2 bg-accent md:block"
                  style={{ left: `${HUB.x}%` }}
                />
              )}
            </div>

            {/* connected projects panel */}
            <div id={panelId} aria-live="polite" className="relative mt-3 bg-bg-1 p-5 pixel-border md:min-h-[172px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active ?? "none"}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut" }}
                >
                  {activeNode ? (
                    <>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <p className="font-mono text-[10px] tracking-[0.2em] text-fg-dim">CONNECTED PROJECTS</p>
                        <p className="font-pixel text-sm text-accent-strong">
                          {activeNode.label}
                          <span className="ml-2 font-mono text-[11px] text-fg-dim">× {connected.length}</span>
                        </p>
                      </div>

                      {connected.length > 0 ? (
                        <ul className="mt-3 divide-y divide-line">
                          {connected.map((p) => {
                            const idx = projects.indexOf(p) + 1;
                            const todo = p.draft || isTodo(p.tagline);
                            return (
                              <li key={p.id} className="flex gap-3 py-2.5">
                                <span className="w-6 shrink-0 pt-0.5 font-mono text-[11px] text-fg-dim">{String(idx).padStart(2, "0")}</span>
                                <div className="min-w-0">
                                  <p className="flex flex-wrap items-center gap-2 font-pixel text-sm text-fg">
                                    {p.title}
                                    {todo && <TodoTag />}
                                  </p>
                                  <p className={cn("prose-ko mt-0.5 text-sm leading-relaxed", todo ? "text-fg-dim" : "text-fg-muted")}>
                                    {isTodo(p.tagline) ? "한 줄 소개 준비 중" : p.tagline}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="prose-ko mt-3 text-sm text-fg-muted">아직 연결된 프로젝트가 없습니다.</p>
                      )}

                      <button
                        type="button"
                        onClick={() => scrollToId("projects")}
                        className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-mono text-[11px] tracking-[0.16em] text-accent-strong hover:underline"
                      >
                        PROJECT LAB <span aria-hidden>→</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="font-mono text-sm text-fg-muted">
                        <span className="text-accent">$</span> select a keyword
                        <span aria-hidden className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[2px] bg-accent-strong anim-caret" />
                      </p>
                      <p className="prose-ko mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
                        키워드를 고르면 연결된 프로젝트가 여기에 나타납니다. 하나의 프로젝트는 보통 여러 키워드에 걸쳐 있습니다.
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
