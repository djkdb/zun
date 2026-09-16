"use client";

import { useState } from "react";
import { projects } from "@/data";
import type { AppWindowProps } from "@/components/os/types";
import { AppSplit, Chip, Field, ScrollPane, SideGroup, SideItem, Todo } from "./shell";

export function ProjectsApp({ win }: AppWindowProps) {
  const [id, setId] = useState(win?.arg ?? projects[0]?.id);
  const p = projects.find((x) => x.id === id) ?? projects[0];

  if (!p) return <p className="p-8 text-sm text-fg-dim">프로젝트가 없습니다.</p>;

  return (
    <AppSplit
      sidebar={
        <>
          <SideGroup label={`배포됨 (${projects.filter((x) => !x.draft).length})`} />
          {projects.filter((x) => !x.draft).map((x) => (
            <SideItem key={x.id} icon="🧰" label={x.title} active={x.id === p.id} onClick={() => setId(x.id)} />
          ))}
          <SideGroup label={`초안 (${projects.filter((x) => x.draft).length})`} />
          {projects.filter((x) => x.draft).map((x) => (
            <SideItem key={x.id} icon="📦" label={x.title} active={x.id === p.id} onClick={() => setId(x.id)} />
          ))}
        </>
      }
    >
      <ScrollPane label={`${p.title} 상세`}>
        <header className="flex items-start gap-4 border-b border-line px-6 pb-5 pt-5 max-[560px]:px-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-fg">{p.title}</h2>
              {p.draft && (
                <span className="rounded border border-warn/40 px-1.5 py-0.5 font-mono text-[10px] text-warn">
                  DRAFT
                </span>
              )}
            </div>
            <p className="mt-1 text-[13.5px] text-fg-muted">{p.tagline}</p>
            <p className="mt-2 font-mono text-[11px] text-fg-dim">
              {p.role} · {p.year ?? "—"}
            </p>
            <div className="mt-2">{p.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
          </div>
        </header>

        <div className="px-6 pb-8 max-[560px]:px-4">
          <Field label="PROBLEM">{p.problem.startsWith("TODO") ? <Todo>{p.problem}</Todo> : p.problem}</Field>
          <Field label="BUILD">{p.build.startsWith("TODO") ? <Todo>{p.build}</Todo> : p.build}</Field>
          <Field label="RESULT">{p.result.startsWith("TODO") ? <Todo>{p.result}</Todo> : p.result}</Field>

          <div className="mt-6 flex flex-wrap gap-2">
            {p.demo && (
              <a
                href={p.demo.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-bg hover:bg-accent-strong"
              >
                ↗ {p.demo.label}
              </a>
            )}
            {p.github && (
              <a
                href={p.github.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line-strong px-3.5 py-1.5 text-xs text-fg hover:bg-bg-3/60"
              >
                GitHub · {p.github.label}
              </a>
            )}
          </div>
        </div>
      </ScrollPane>
    </AppSplit>
  );
}
