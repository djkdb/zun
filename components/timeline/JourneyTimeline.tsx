"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useCallback, useRef, useState } from "react";
import type { JourneyItem } from "@/data/types";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/interactions/Reveal";
import { Tag, TodoTag } from "@/components/ui/Tag";

interface JourneyTimelineProps {
  items: JourneyItem[];
}

const isTodo = (s: string) => s.trim().toUpperCase().startsWith("TODO");
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * JOURNEY — one responsive list, two geometries.
 * Desktop: horizontal track across the top, 4 nodes, fill = scroll progress (scaleX).
 * Mobile:  vertical line on the left, same nodes, fill = scroll progress (scaleY).
 * Active item = hovered / focused / most recently reached by the fill.
 */
export function JourneyTimeline({ items }: JourneyTimelineProps) {
  // effect-based (false on SSR + first client render) so hydration markup matches
  const reduce = usePrefersReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [scrollIdx, setScrollIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.82", "end 0.55"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const walkerLeft = useTransform(progress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);
  const walkerOpacity = useTransform(progress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  const count = items.length;
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // node i sits at i/count of the track; it becomes "reached" once the fill passes it
    const idx = Math.min(count - 1, Math.max(0, Math.floor(v * count + 0.02)));
    setScrollIdx(idx);
  });

  const activeIdx = hoverIdx ?? scrollIdx;
  const active = items[activeIdx] ?? items[0];
  const clearHover = useCallback(() => setHoverIdx(null), []);

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_240px] md:gap-12 lg:grid-cols-[minmax(0,1fr)_272px] lg:gap-16">
      {/* ── timeline ─────────────────────────────────────── */}
      <div className="relative min-w-0">
        {/* track (mobile: vertical left, desktop: horizontal top) */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[5px] top-0 w-[2px] [mask-image:linear-gradient(to_bottom,black_88%,transparent)] md:bottom-auto md:left-0 md:right-0 md:top-[5px] md:h-[2px] md:w-auto md:[mask-image:linear-gradient(to_right,black_82%,transparent)]"
        >
          <div className="absolute inset-0 bg-line-strong" />
          {/* fill — mobile scaleY */}
          <motion.div
            className="absolute inset-0 origin-top bg-accent md:hidden"
            style={{ scaleY: reduce ? 1 : progress }}
          />
          {/* fill — desktop scaleX */}
          <motion.div
            className="absolute inset-0 hidden origin-left bg-accent md:block"
            style={{ scaleX: reduce ? 1 : progress }}
          />
        </div>

        {/* guide sprite riding the fill's leading edge (desktop only) */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[6px] z-10 hidden -translate-x-1/2 -translate-y-full md:block"
            style={{ left: walkerLeft, opacity: walkerOpacity }}
          >
            
          </motion.div>
        )}

        <ol ref={listRef} className="relative flex flex-col gap-10 md:grid md:grid-cols-4 md:gap-6 lg:gap-8">
          {items.map((item, i) => {
            const isActive = i === activeIdx;
            const reached = i <= scrollIdx || reduce;
            const todo = isTodo(item.title) || isTodo(item.description);
            return (
              <Reveal key={item.id} as="li" delay={reduce ? 0 : i * 0.08} className="relative pl-9 md:pl-0 md:pt-10">
                {/* node marker */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-[6px] h-3 w-3 transition-[background-color,box-shadow] duration-300 md:top-0",
                    item.current
                      ? "bg-accent anim-pulse-dot shadow-[0_0_0_4px_var(--accent-soft)]"
                      : reached
                        ? "bg-accent"
                        : "bg-bg-2 ring-2 ring-inset ring-line-strong",
                    isActive && !item.current && "shadow-[0_0_0_4px_var(--accent-soft)]",
                  )}
                />

                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`${item.year} — ${item.title}`}
                  onPointerEnter={() => setHoverIdx(i)}
                  onPointerLeave={clearHover}
                  onFocus={() => setHoverIdx(i)}
                  onBlur={clearHover}
                  onClick={() => setHoverIdx(i)}
                  className={cn(
                    "group block w-full text-left transition-opacity duration-300",
                    // dim items the fill has not reached yet — but never the active one
                    !reached && !isActive && "opacity-60",
                  )}
                >
                  <div className="flex items-start gap-4 md:block">
                    {/* per-item sprite (mobile only) */}
                    <div className="shrink-0 md:hidden">
                      
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span
                          className={cn(
                            "font-pixel text-2xl leading-none transition-colors duration-300 md:text-[26px]",
                            isActive ? "text-accent-strong" : "text-fg",
                          )}
                        >
                          {item.year}
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.18em] text-fg-dim">{pad(i + 1)}</span>
                        {todo && <TodoTag />}
                      </div>

                      <h3
                        className={cn(
                          "prose-ko mt-3 text-[15px] font-medium leading-snug md:text-base",
                          item.current ? "font-mono uppercase tracking-[0.12em] text-accent-strong" : "text-fg",
                        )}
                      >
                        {item.current && (
                          <span aria-hidden className="mr-2 inline-block h-2 w-2 translate-y-[-1px] bg-accent anim-pulse-dot" />
                        )}
                        {item.title}
                      </h3>

                      <p className="prose-ko mt-2 text-sm leading-relaxed text-fg-muted md:mt-3">{item.description}</p>

                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="keywords">
                        {item.keywords.map((k) => (
                          <li key={k}>
                            <Tag accent={isActive}>{k}</Tag>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </ol>
      </div>

      {/* ── side panel (desktop) ─────────────────────────── */}
      <Reveal delay={0.15} className="hidden md:block">
        <aside
          aria-label="Selected journey stage"
          className="pixel-border sticky top-24 flex flex-col bg-bg-1"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="font-mono text-[11px] tracking-[0.18em] text-fg-dim">zun@journey</span>
            <span className="font-mono text-[11px] tracking-[0.18em] text-fg-dim">
              {pad(activeIdx + 1)} / {pad(count)}
            </span>
          </div>

          <div className="relative flex h-52 items-end justify-center overflow-hidden bg-dots [mask-image:linear-gradient(to_bottom,transparent,black_25%)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pb-5"
              >
                
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-line px-4 py-4">
            <div className="flex items-center gap-2">
              {active.current && <span aria-hidden className="h-2 w-2 bg-accent anim-pulse-dot" />}
              <span className="font-pixel text-xl leading-none text-accent-strong">{active.year}</span>
            </div>
            <p className="prose-ko mt-2 text-sm leading-snug text-fg">{active.title}</p>
            {/* dots showing position */}
            <div className="mt-4 flex gap-1.5" aria-hidden>
              {items.map((it, i) => (
                <span
                  key={it.id}
                  className={cn(
                    "h-1.5 w-5 transition-colors duration-300",
                    i === activeIdx ? "bg-accent" : i <= scrollIdx || reduce ? "bg-accent/40" : "bg-bg-3",
                  )}
                />
              ))}
            </div>
          </div>
        </aside>
      </Reveal>
    </div>
  );
}
