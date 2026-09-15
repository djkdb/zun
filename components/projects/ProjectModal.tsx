"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef } from "react";
import type { Link, Project } from "@/data/types";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/scroll";
import { PixelReveal } from "@/components/interactions/PixelTransition";
import { PixelButton } from "@/components/ui/PixelButton";
import { Tag, TodoTag } from "@/components/ui/Tag";
import { ZunCharacter } from "@/components/character";
import { isTodo } from "./ProjectCard";

interface ProjectModalProps {
  project: Project | null;
  /** position of the project in the grid, for the "0N / 06" counter */
  index: number;
  total: number;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Project detail dialog. Full-height sheet on mobile, centred panel on desktop.
 * Locks page scroll (native + Lenis), traps focus, closes on Esc / backdrop.
 * Focus return to the card is handled by the caller after `onClose`.
 */
export function ProjectModal({ project, index, total, onClose }: ProjectModalProps) {
  const reduce = useReducedMotion() ?? false;
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const open = !!project;

  /* scroll lock — native body overflow + Lenis */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    return () => {
      document.body.style.overflow = prevOverflow;
      getLenis()?.start();
    };
  }, [open]);

  /* move focus into the dialog on open */
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => dialogRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [open]);

  /* Esc + focus trap */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || current === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-modal"
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.18 } }}
          transition={{ duration: 0.2 }}
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="닫기"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-bg/80 backdrop-blur-[2px]"
          />

          {/* panel */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            data-lenis-prevent
            initial={reduce ? false : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 16, scale: 0.99, transition: { duration: 0.16, ease } }}
            transition={{ duration: 0.32, ease }}
            className={cn(
              "relative flex w-full flex-col bg-bg-1 pixel-border-accent outline-none",
              "h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-h-[min(88vh,860px)] sm:max-w-2xl",
            )}
          >
            <PixelReveal className="flex min-h-0 flex-1 flex-col" color="var(--bg-1)">
              {/* sticky top bar */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-fg-dim sm:px-7">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 bg-accent" />
                  PROJECT {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="닫기 (Esc)"
                  className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 text-fg-muted transition-colors hover:bg-bg-2 hover:text-fg"
                >
                  <span className="hidden sm:inline">ESC</span>
                  <span aria-hidden className="font-pixel text-base leading-none">×</span>
                </button>
              </div>

              {/* scrollable body */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-6 sm:px-7 sm:pt-7">
                {/* header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 id={titleId} className="font-pixel text-2xl leading-tight text-fg sm:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs tracking-[0.08em] text-fg-muted">
                      {isTodo(project.role) ? (
                        <span className="inline-flex items-center gap-2 font-sans text-sm tracking-normal text-fg-dim">
                          역할 미정 <TodoTag />
                        </span>
                      ) : (
                        <span>{project.role}</span>
                      )}
                      {project.year && (
                        <>
                          <span aria-hidden className="text-fg-dim">·</span>
                          <span>{project.year}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="hidden shrink-0 sm:block" aria-hidden>
                    <ZunCharacter pose={project.pose} size={72} shadow={false} />
                  </div>
                </div>

                {project.draft && (
                  <p className="prose-ko mt-6 flex items-center gap-2.5 bg-bg-2 px-3.5 py-2.5 font-sans text-sm text-fg-muted">
                    <TodoTag />
                    상세 내용은 준비 중입니다
                  </p>
                )}

                {/* blocks */}
                <dl id={descId} className="mt-7 divide-y divide-line border-y border-line">
                  <Block label="PROJECT" text={project.tagline} placeholder="한 줄 소개 준비 중" />
                  <Block label="PROBLEM" text={project.problem} placeholder="문제 정의 준비 중" />
                  <Block label="BUILD" text={project.build} placeholder="구현 내용 준비 중" />
                  <Block label="RESULT" text={project.result} placeholder="결과 / 배운 점 준비 중" />
                  <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[96px_1fr] sm:gap-6">
                    <dt className="font-mono text-[10px] tracking-[0.2em] text-fg-dim sm:pt-1">STACK</dt>
                    <dd>
                      {project.stack.length > 0 ? (
                        <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
                          {project.stack.map((s) => (
                            <li key={s}>
                              <Tag>{s}</Tag>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm text-fg-dim">
                          스택 미정 <TodoTag />
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>

                {/* links */}
                {(project.demo || project.github) && (
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {project.demo && <LinkButton link={project.demo} variant="primary" fallback="Live Demo" />}
                    {project.github && <LinkButton link={project.github} variant="ghost" fallback="GitHub" />}
                  </div>
                )}

                {/* themes */}
                <ul className="mt-7 flex flex-wrap gap-1.5" aria-label="Themes">
                  {project.themes.map((t) => (
                    <li key={t}>
                      <Tag accent>{t}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </PixelReveal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ label, text, placeholder }: { label: string; text: string; placeholder: string }) {
  const todo = isTodo(text);
  return (
    <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[96px_1fr] sm:gap-6">
      <dt className="font-mono text-[10px] tracking-[0.2em] text-fg-dim sm:pt-1">{label}</dt>
      <dd className={cn("prose-ko text-[15px] leading-relaxed", todo ? "text-fg-dim" : "text-fg")}>
        {todo ? (
          <span className="inline-flex flex-wrap items-center gap-2">
            {placeholder} <TodoTag />
          </span>
        ) : (
          text
        )}
      </dd>
    </div>
  );
}

function LinkButton({ link, variant, fallback }: { link: Link; variant: "primary" | "ghost"; fallback: string }) {
  const label = link.label || fallback;
  if (link.todo) {
    return (
      <span className="inline-flex items-center gap-2">
        <PixelButton variant="ghost" disabled aria-disabled="true" className="cursor-not-allowed opacity-60">
          {label}
        </PixelButton>
        <TodoTag />
      </span>
    );
  }
  return (
    <PixelButton href={link.href} variant={variant} cursor="link">
      {label} <span aria-hidden>↗</span>
    </PixelButton>
  );
}
