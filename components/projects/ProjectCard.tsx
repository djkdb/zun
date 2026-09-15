"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { forwardRef, useCallback, useRef } from "react";
import type { Project } from "@/data/types";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/hooks";
import { Tag, TodoTag } from "@/components/ui/Tag";

export const isTodo = (s: string | undefined) => !!s && s.trim().toUpperCase().startsWith("TODO");

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  onHover: (id: string | null) => void;
}

const MAX_TILT = 5; // degrees
const SPRING = { stiffness: 260, damping: 20, mass: 0.6 };

/* 2px stepped border in accent + a soft outer glow — the hover/focus state of `.pixel-border`
   (must be literal strings so Tailwind can pick them up) */
const GLOW =
  "hover:[box-shadow:0_-2px_0_0_var(--accent),0_2px_0_0_var(--accent),-2px_0_0_0_var(--accent),2px_0_0_0_var(--accent),0_0_0_6px_var(--accent-soft),0_18px_40px_-16px_var(--accent-glow)] focus-visible:[box-shadow:0_-2px_0_0_var(--accent),0_2px_0_0_var(--accent),-2px_0_0_0_var(--accent),2px_0_0_0_var(--accent),0_0_0_6px_var(--accent-soft),0_18px_40px_-16px_var(--accent-glow)]";

/**
 * One project on the lab grid. The whole card is a button that opens the modal.
 * Fine pointers get a restrained 3D tilt driven by pointer position; touch and
 * reduced-motion users get a plain, still card.
 */
export const ProjectCard = forwardRef<HTMLButtonElement, ProjectCardProps>(function ProjectCard(
  { project, index, onOpen, onHover },
  ref,
) {
  const reduce = useReducedMotion() ?? false;
  const fine = useFinePointer();
  const tilt = fine && !reduce;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, SPRING);
  const sry = useSpring(ry, SPRING);
  const glowRef = useRef<HTMLDivElement>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!tilt) return;
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      ry.set((px - 0.5) * 2 * MAX_TILT);
      rx.set(-(py - 0.5) * 2 * MAX_TILT);
      if (glowRef.current) {
        glowRef.current.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        glowRef.current.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      }
    },
    [tilt, rx, ry],
  );

  const reset = useCallback(() => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  const todoTagline = isTodo(project.tagline);
  const n = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      ref={ref}
      type="button"
      data-cursor="project"
      aria-haspopup="dialog"
      aria-label={`${project.title} — 자세히 보기`}
      onClick={() => onOpen(project)}
      onPointerMove={onPointerMove}
      onPointerEnter={() => onHover(project.id)}
      onPointerLeave={() => {
        reset();
        onHover(null);
      }}
      onFocus={() => onHover(project.id)}
      onBlur={() => onHover(null)}
      style={tilt ? { rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" } : undefined}
      whileHover={tilt ? { scale: 1.01 } : undefined}
      whileTap={reduce ? undefined : { scale: 0.995 }}
      transition={{ type: "spring", ...SPRING }}
      className={cn(
        "group relative flex h-full min-h-[212px] md:min-h-[228px] w-full flex-col text-left will-change-transform",
        "bg-bg-1 pixel-border p-5 md:p-6",
        "transition-[background-color,box-shadow] duration-200 ease-out",
        "hover:bg-bg-2 focus-visible:bg-bg-2",
        GLOW,
      )}
    >
      {/* pointer-following glow (fine pointers only) */}
      <div
        ref={glowRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
          tilt && "group-hover:opacity-100",
        )}
        style={{
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), var(--accent-soft), transparent 70%)",
        }}
      />

      {/* top meta row */}
      <div className="relative flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.18em] text-fg-dim">
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-1.5 w-1.5 bg-accent opacity-70 transition-opacity group-hover:opacity-100" />
          {n}
        </span>
        <span className="flex items-center gap-2">
          {project.year && <span>{project.year}</span>}
          {project.draft && <TodoTag />}
        </span>
      </div>

      {/* title + tagline */}
      <div className="relative mt-5 flex-1">
        <h3 className="font-pixel text-lg leading-tight text-fg transition-colors group-hover:text-accent-strong group-focus-visible:text-accent-strong sm:text-xl">
          {project.title}
        </h3>
        {todoTagline ? (
          <p className="prose-ko mt-3 flex flex-wrap items-center gap-2 text-sm leading-relaxed text-fg-dim">
            한 줄 소개 준비 중
            <TodoTag />
          </p>
        ) : (
          <p className="prose-ko mt-3 text-sm leading-relaxed text-fg-muted">{project.tagline}</p>
        )}
      </div>

      {/* footer: themes + open hint */}
      <div className="relative mt-6 flex items-end justify-between gap-3">
        <ul className="flex flex-wrap gap-1.5" aria-label="Themes">
          {project.themes.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
        <span
          aria-hidden
          className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-fg-dim transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-accent-strong group-focus-visible:text-accent-strong"
        >
          OPEN →
        </span>
      </div>
    </motion.button>
  );
});
