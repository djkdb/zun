"use client";

import { motion, useReducedMotion } from "framer-motion";
import { loopSteps } from "@/data";
import type { LoopStep } from "@/data/types";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/interactions/Reveal";

/* ─────────────────────────────────────────────
   Layout constants (desktop row)
   4 step columns (1fr) separated by 3 fixed arrow gutters.
   The return line below the row uses the same maths so its
   verticals land exactly under the centre of step 1 / step 4.
   ───────────────────────────────────────────── */
const GUTTER_REM = 3;
const GUTTERS = loopSteps.length - 1;
/** distance from the row edge to the centre of the first / last column */
const EDGE_TO_CENTRE = `calc((100% - ${GUTTER_REM * GUTTERS}rem) / ${loopSteps.length * 2})`;
const ROW_COLS = `lg:grid-cols-[1fr_3rem_1fr_3rem_1fr_3rem_1fr]`;

/** Reveal cadence: step → arrow → step → arrow … then the return line. */
const BEAT = 0.16;
const stepDelay = (i: number) => i * BEAT * 2;
const arrowDelay = (i: number) => i * BEAT * 2 + BEAT;
const RETURN_DELAY = stepDelay(loopSteps.length - 1) + BEAT * 2;

/* ─────────────────────────────────────────────
   Pixel arrow — a 7×7 chevron-with-shaft drawn from unit squares.
   ───────────────────────────────────────────── */
const ARROW_CELLS: Array<[number, number]> = [
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
  [3, 0], [4, 1], [5, 2], [5, 4], [4, 5], [3, 6],
];

function PixelArrow({
  dir = "right",
  size = 22,
  className,
}: {
  dir?: "right" | "down" | "up";
  size?: number;
  className?: string;
}) {
  const rotate = dir === "down" ? 90 : dir === "up" ? -90 : 0;
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 7 7"
      shapeRendering="crispEdges"
      className={cn("block", className)}
    >
      <g transform={`rotate(${rotate} 3.5 3.5)`} fill="currentColor">
        {ARROW_CELLS.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
        ))}
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Step card
   ───────────────────────────────────────────── */
function StepCard({ step, index, isLast }: { step: LoopStep; index: number; isLast: boolean }) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <article
      aria-labelledby={`loop-step-${step.key}`}
      className={cn(
        "relative flex h-full flex-col bg-bg-1 p-5 md:p-6",
        isLast ? "pixel-border-accent" : "pixel-border",
      )}
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
        <span>
          <span className="text-accent-strong">{n}</span>
          <span className="mx-1.5 text-fg-dim">/</span>
          <span>0{loopSteps.length}</span>
        </span>
        <span aria-hidden>{step.key}</span>
      </div>

      <div className="mt-5 mb-4 flex items-end justify-center self-stretch">
        
      </div>

      <h3 id={`loop-step-${step.key}`} className="font-pixel text-base leading-snug text-fg md:text-lg">
        {step.title}
      </h3>
      <p className="prose-ko mt-2.5 text-sm leading-relaxed text-fg-muted">{step.body}</p>

      {isLast && (
        <p className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-strong">
          <span aria-hidden className="inline-block h-1.5 w-1.5 bg-accent anim-pulse-dot" />
          back to 01
        </p>
      )}
    </article>
  );
}

/* ─────────────────────────────────────────────
   Return line (desktop) — dashed path from step 4 back to step 1.
   Draws itself once when in view: down → left → up → arrowhead.
   ───────────────────────────────────────────── */
function ReturnLine({ reduce }: { reduce: boolean }) {
  const viewport = { once: true, margin: "-10% 0px -10% 0px" } as const;
  const ease = [0.22, 1, 0.36, 1] as const;
  const seg = (from: string, delay: number, duration: number) =>
    reduce
      ? {}
      : {
          initial: { clipPath: from },
          whileInView: { clipPath: "inset(0 0 0 0)" },
          viewport,
          transition: { duration, delay, ease },
        };

  const label = (
    <span className="inline-flex items-center gap-2 bg-bg px-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-dim">
      <span aria-hidden className="text-accent-strong">↺</span>
      repeat
    </span>
  );

  return (
    <div aria-hidden className="relative hidden h-12 lg:block">
      {/* down from step 4 */}
      <motion.div
        className="absolute top-0 bottom-0 border-l border-dashed border-line-strong"
        style={{ right: EDGE_TO_CENTRE }}
        {...seg("inset(0 0 100% 0)", RETURN_DELAY, 0.35)}
      />
      {/* across, right → left */}
      <motion.div
        className="absolute bottom-0 border-t border-dashed border-line-strong"
        style={{ left: EDGE_TO_CENTRE, right: EDGE_TO_CENTRE }}
        {...seg("inset(0 0 0 100%)", RETURN_DELAY + 0.3, 0.9)}
      />
      {/* up into step 1 */}
      <motion.div
        className="absolute top-0 bottom-0 border-l border-dashed border-line-strong"
        style={{ left: EDGE_TO_CENTRE }}
        {...seg("inset(100% 0 0 0)", RETURN_DELAY + 1.15, 0.35)}
      />
      {/* arrowhead pointing back into step 1 */}
      <motion.div
        className="absolute top-0 -translate-x-1/2 -translate-y-1/2 bg-bg text-accent-strong"
        style={{ left: EDGE_TO_CENTRE }}
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0 },
              whileInView: { opacity: 1 },
              viewport,
              transition: { duration: 0.3, delay: RETURN_DELAY + 1.45 },
            })}
      >
        <PixelArrow dir="up" size={16} />
      </motion.div>
      {/* label sits on the horizontal line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0 },
              whileInView: { opacity: 1 },
              viewport,
              transition: { duration: 0.4, delay: RETURN_DELAY + 0.7 },
            })}
      >
        {label}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section
   ───────────────────────────────────────────── */
export function BuildLoop() {
  const reduce = useReducedMotion() ?? false;

  return (
    <Section id="loop">
      <SectionHeader
        eyebrow="04 / PROCESS"
        title="BUILD → FAIL → LEARN → BUILD AGAIN"
        description="프로젝트를 많이 했다는 것보다, 만들면서 무엇을 배웠는지가 중요합니다."
      />

      <div className="mx-auto max-w-md lg:max-w-none">
        {/* Steps: vertical stack (<lg) / single row with arrow gutters (lg+) */}
        <ol className={cn("grid grid-cols-1 items-stretch", ROW_COLS)} aria-label="Build loop">
          {loopSteps.map((step, i) => {
            const isLast = i === loopSteps.length - 1;
            return (
              <li key={step.key} className="contents">
                <Reveal delay={stepDelay(i)} className="h-full">
                  <StepCard step={step} index={i} isLast={isLast} />
                </Reveal>
                {!isLast && (
                  <Reveal
                    delay={arrowDelay(i)}
                    y={0}
                    className="flex h-12 items-center justify-center text-fg-dim lg:h-auto lg:w-12"
                  >
                    <PixelArrow dir="down" className="lg:hidden" />
                    <PixelArrow dir="right" className="hidden lg:block" />
                  </Reveal>
                )}
              </li>
            );
          })}
        </ol>

        {/* desktop: dashed return path 04 → 01 */}
        <ReturnLine reduce={reduce} />

        {/* mobile / tablet: short return marker */}
        <Reveal delay={RETURN_DELAY} y={0} className="flex flex-col items-center lg:hidden">
          <div aria-hidden className="h-8 border-l border-dashed border-line-strong" />
          <p className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-dim">
            <span aria-hidden className="text-accent-strong">↺</span>
            repeat · back to 01
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
