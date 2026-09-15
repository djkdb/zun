"use client";

import { useCallback, useRef, useState } from "react";
import { profile, projects } from "@/data";
import type { PoseName, Project } from "@/data/types";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/interactions/Reveal";
import { ZunCharacter } from "@/components/character";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectModal } from "@/components/projects/ProjectModal";

const DEFAULT_POSE: PoseName = "experiment";

/**
 * 03 / PROJECTS — the lab grid. Hover/focus a card and ZUN reacts with that
 * project's pose; click to open the detail dialog. Focus returns to the card
 * on close.
 */
export function Projects() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const hoveredProject = hovered ? projects.find((p) => p.id === hovered) ?? null : null;
  const openIndex = openId ? projects.findIndex((p) => p.id === openId) : -1;
  const openProject = openIndex >= 0 ? projects[openIndex] : null;
  const pose = hoveredProject?.pose ?? openProject?.pose ?? DEFAULT_POSE;
  const drafts = projects.filter((p) => p.draft).length;

  const setCardRef = useCallback((id: string) => (el: HTMLButtonElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  const open = useCallback((p: Project) => setOpenId(p.id), []);
  const close = useCallback(() => {
    const id = openId;
    setOpenId(null);
    if (id) cardRefs.current.get(id)?.focus({ preventScroll: true });
  }, [openId]);

  return (
    <Section id="projects" aria-label="Projects">
      {/* header row: text left, reacting character right */}
      <div className="grid grid-cols-1 items-start md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
        <SectionHeader eyebrow="03 / PROJECTS" title="WHAT I BUILD" description={profile.intro} />

        <Reveal delay={0.12} className="-mt-4 md:mt-0 md:mb-10">
          <CharacterMonitor pose={pose} title={hoveredProject?.title ?? openProject?.title ?? null} />
        </Reveal>
      </div>

      {/* PROJECT LAB label row */}
      <Reveal delay={0.05} className="mt-8 md:mt-0">
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4 font-mono text-[10px] tracking-[0.2em] text-fg-dim">
          <span className="flex items-center gap-3">
            <span className="text-accent-strong">PROJECT LAB</span>
            <span aria-hidden className="hidden h-px w-8 bg-line-strong sm:block" />
            <span className="hidden sm:inline">HOVER TO PREVIEW · CLICK TO OPEN</span>
          </span>
          <span className="flex items-center gap-3">
            <span>
              {String(projects.length).padStart(2, "0")} PROJECTS
              {drafts > 0 && <span className="text-fg-dim"> · {String(drafts).padStart(2, "0")} DRAFTS</span>}
            </span>
          </span>
        </div>
      </Reveal>

      {/* grid */}
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5" aria-label="Projects">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.id} delay={0.05 + (i % 3) * 0.07} className="min-w-0 [perspective:1000px]">
            <ProjectCard ref={setCardRef(p.id)} project={p} index={i} onOpen={open} onHover={setHovered} />
          </Reveal>
        ))}
      </ul>

      <ProjectModal project={openProject} index={openIndex} total={projects.length} onClose={close} />
    </Section>
  );
}

/**
 * Small "lab monitor" panel: ZUN reacts to the hovered card.
 * Compact horizontal strip on mobile, vertical box on desktop.
 */
function CharacterMonitor({ pose, title }: { pose: PoseName; title: string | null }) {
  return (
    <div
      className="relative flex items-center gap-4 bg-bg-1 px-4 py-3 pixel-border md:block md:w-[196px] md:p-0"
      aria-hidden
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots mask-fade-y opacity-60" />

      <div className="relative shrink-0 md:flex md:justify-center md:px-4 md:pb-2 md:pt-9">
        <ZunCharacter pose={pose} sizeClass="w-12 md:w-24" />
      </div>

      <div className="relative min-w-0 flex-1 md:contents">
        <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em] text-fg-dim md:absolute md:inset-x-0 md:top-0 md:px-3.5 md:pt-3">
          <span>ZUN</span>
          <span className={cn("flex items-center gap-1.5", title && "text-accent-strong")}>
            <span className={cn("inline-block h-1.5 w-1.5", title ? "bg-accent-strong" : "bg-fg-dim")} />
            {title ? "REACTING" : "IDLE"}
          </span>
        </div>
        <p className="mt-1.5 truncate font-mono text-[10px] tracking-[0.16em] text-fg-muted md:mt-0 md:border-t md:border-line md:px-3.5 md:py-2.5">
          {title ? (
            <span className="text-fg">&gt; {title}</span>
          ) : (
            <span className="text-fg-dim">
              &gt; <span className="md:hidden">TAP</span>
              <span className="hidden md:inline">PICK</span> A PROJECT
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
