"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { activities } from "@/data";
import type { Activity } from "@/data/types";
import { cn, isTodo } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/interactions/Reveal";
import { Tag, TodoTag } from "@/components/ui/Tag";
import { ZunCharacter } from "@/components/character";
import { ActivityDetail } from "./ActivityCard";

/**
 * BEYOND CODE — accordion of activities outside pure development.
 * Desktop: list on the left, sticky detail panel on the right.
 * Mobile: the detail expands inline under the tapped row.
 */
export function Activities() {
  const [openId, setOpenId] = useState<string>(activities[0]?.id ?? "");
  const reduce = useReducedMotion();
  const open = activities.find((a) => a.id === openId) ?? activities[0];

  return (
    <Section id="activity">
      <SectionHeader eyebrow="05 / BEYOND CODE" title="BEYOND CODE" description="코드 밖에서 무엇을 경험하고 있는지." />

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-12">
        <ul className="divide-y divide-line border-y border-line" role="list">
          {activities.map((a, i) => {
            const expanded = a.id === openId;
            const draft = a.draft || isTodo(a.description);
            return (
              <Reveal as="li" key={a.id} delay={i * 0.04} y={10}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`activity-${a.id}`}
                  onClick={() => setOpenId(a.id)}
                  className={cn(
                    "group flex min-h-14 w-full items-center gap-4 py-3 text-left transition-colors",
                    expanded ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  <span className="w-7 shrink-0 font-mono text-[11px] text-fg-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-sans text-base font-medium sm:text-lg">{a.title}</span>
                    <Tag accent={expanded}>{a.category}</Tag>
                    {draft && <TodoTag />}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "shrink-0 font-mono text-sm text-fg-dim transition-transform duration-200",
                      expanded ? "rotate-90 text-accent-strong" : "group-hover:translate-x-0.5",
                    )}
                  >
                    →
                  </span>
                </button>

                {/* mobile: inline detail */}
                <div id={`activity-${a.id}`} className="md:hidden">
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        key="detail"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 pl-11">
                          <ActivityDetail activity={a} compact />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </ul>

        {/* desktop: sticky detail panel */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={open.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                aria-live="polite"
              >
                <ActivityDetail activity={open} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ActivityPose({ activity, size }: { activity: Activity; size: number }) {
  return <ZunCharacter pose={activity.pose} size={size} shadow={false} />;
}
