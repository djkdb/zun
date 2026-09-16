"use client";

import { useMemo, useState } from "react";
import { activities, contentItems, journey, projects } from "@/data";
import { useOS } from "@/components/os/OSProvider";
import type { AppWindowProps } from "@/components/os/types";
import { AppSplit, Chip, Field, ScrollPane, SearchBox, Seg, SideGroup, SideItem, Todo, Toolbar } from "./shell";

type ViewId = "projects" | "drafts" | "journey" | "activities" | "content";

interface Row {
  id: string;
  icon: string;
  name: string;
  kind: string;
  meta: string;
  date: string;
  detail: { why?: string; what?: string; result?: string; stack?: string[]; open?: () => void };
}

export function Finder({ win }: AppWindowProps) {
  const os = useOS();
  const [view, setView] = useState<ViewId>((win?.arg as ViewId) ?? "projects");
  const [mode, setMode] = useState<"list" | "grid">("list");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  const VIEWS: { id: ViewId; icon: string; label: string }[] = [
    { id: "projects", icon: "📁", label: "프로젝트" },
    { id: "drafts", icon: "📦", label: "초안" },
    { id: "journey", icon: "📅", label: "여정" },
    { id: "activities", icon: "🎒", label: "활동" },
    { id: "content", icon: "🎞️", label: "콘텐츠" },
  ];

  const rows = useMemo<Row[]>(() => {
    switch (view) {
      case "projects":
      case "drafts": {
        const list = projects.filter((p) => (view === "drafts" ? p.draft : !p.draft));
        return list.map((p) => ({
          id: p.id,
          icon: p.draft ? "📦" : "🧰",
          name: p.title,
          kind: p.stack[0] ?? (p.draft ? "TODO" : "웹"),
          meta: p.role,
          date: p.year ?? "—",
          detail: {
            why: p.problem,
            what: p.build,
            result: p.result,
            stack: p.stack,
            open: () => os.openApp("projects", { arg: p.id, title: `Projects — ${p.title}` }),
          },
        }));
      }
      case "journey":
        return journey.map((j) => ({
          id: j.id, icon: "📅", name: j.title, kind: j.year, meta: j.keywords.join(" · "), date: j.year,
          detail: { why: j.description, open: () => os.openApp("journey") },
        }));
      case "activities":
        return activities.map((a) => ({
          id: a.id, icon: "🎒", name: a.title, kind: a.category, meta: a.period ?? "—", date: a.period ?? "—",
          detail: { why: a.description, result: a.takeaway, open: () => os.openApp("monitor") },
        }));
      case "content":
        return contentItems.map((c) => ({
          id: c.id, icon: "🎞️", name: c.title, kind: c.category, meta: "@zun_it_", date: "—",
          detail: { why: c.takeaway, result: c.views ? `조회수 ${c.views}` : undefined, open: () => os.openApp("photos") },
        }));
    }
  }, [view, os]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((r) => `${r.name}${r.kind}${r.meta}${r.detail.why ?? ""}`.toLowerCase().includes(t));
  }, [rows, q]);

  const current = filtered[Math.min(sel, filtered.length - 1)];

  return (
    <AppSplit
      sidebar={
        <>
          <SideGroup label="즐겨찾기" />
          {VIEWS.map((v) => (
            <SideItem
              key={v.id} icon={v.icon} label={v.label} active={view === v.id}
              onClick={() => { setView(v.id); setSel(0); }}
            />
          ))}
          <SideGroup label="위치" />
          <SideItem icon="🪪" label="ZUN에 대하여" onClick={() => os.openApp("about")} />
          <SideItem icon="📝" label="기록" onClick={() => os.openApp("notes")} />
          <SideItem icon="🪦" label="무덤" onClick={() => os.openApp("trash")} />
        </>
      }
    >
      <Toolbar>
        <p className="truncate text-[12.5px] text-fg-muted max-[760px]:hidden">
          {VIEWS.find((v) => v.id === view)?.icon} {VIEWS.find((v) => v.id === view)?.label} — 항목 {filtered.length}개
        </p>
        <div className="ml-auto flex items-center gap-2 max-[760px]:ml-0 max-[760px]:w-full">
          <Seg value={mode} options={[{ id: "list", label: "목록" }, { id: "grid", label: "아이콘" }]} onChange={setMode} />
          <SearchBox value={q} onChange={(v) => { setQ(v); setSel(0); }} />
        </div>
      </Toolbar>

      <ScrollPane label="항목 목록">
        {filtered.length === 0 && <p className="p-10 text-center text-sm text-fg-dim">결과 없음</p>}

        {mode === "list" && filtered.length > 0 && (
          <table className="w-full border-collapse text-[13px]">
            <thead className="sticky top-0 z-10 bg-bg-2/95 backdrop-blur">
              <tr className="border-b border-line text-left font-mono text-[10.5px] text-fg-dim">
                <th className="px-3.5 py-2 font-bold">이름</th>
                <th className="px-3.5 py-2 font-bold">종류</th>
                <th className="px-3.5 py-2 font-bold max-[760px]:hidden">역할 / 메모</th>
                <th className="px-3.5 py-2 font-bold max-[760px]:hidden">연도</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={r.id}
                  onPointerDown={() => setSel(i)}
                  onDoubleClick={() => r.detail.open?.()}
                  className={`cursor-default border-b border-line/60 ${
                    i === sel ? "bg-select text-white" : "hover:bg-bg-3/40"
                  }`}
                >
                  <td className="px-3.5 py-2">
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden>{r.icon}</span>
                      <span className="truncate">{r.name}</span>
                    </span>
                  </td>
                  <td className={`px-3.5 py-2 font-mono text-[11.5px] ${i === sel ? "text-white" : "text-fg-dim"}`}>
                    {r.kind === "TODO" ? <Todo /> : r.kind}
                  </td>
                  <td className={`px-3.5 py-2 text-[12px] max-[760px]:hidden ${i === sel ? "text-white" : "text-fg-dim"}`}>
                    <span className="line-clamp-1">{r.meta}</span>
                  </td>
                  <td className={`px-3.5 py-2 font-mono text-[11.5px] max-[760px]:hidden ${i === sel ? "text-white" : "text-fg-dim"}`}>
                    {r.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {mode === "grid" && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-1.5 p-3.5">
            {filtered.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onPointerDown={() => setSel(i)}
                onDoubleClick={() => r.detail.open?.()}
                className={`rounded-lg px-1.5 py-3 text-center ${i === sel ? "bg-select text-white" : "hover:bg-bg-3/40"}`}
              >
                <span aria-hidden className="block text-[36px] leading-none">{r.icon}</span>
                <span className="mt-1.5 block text-[12px] leading-tight">{r.name}</span>
              </button>
            ))}
          </div>
        )}
      </ScrollPane>

      {current && (
        <div className="max-h-[42%] flex-none overflow-auto border-t border-line bg-bg-1/50 px-4 pb-5 pt-3.5">
          <h3 className="text-[15px] font-semibold text-fg">
            <span aria-hidden>{current.icon}</span> {current.name}
          </h3>
          {current.detail.stack && current.detail.stack.length > 0 && (
            <div>{current.detail.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
          )}
          {current.detail.why && <Field label="왜 / 문제">{current.detail.why}</Field>}
          {current.detail.what && <Field label="무엇을 만들었나">{current.detail.what}</Field>}
          {current.detail.result && <Field label="결과 / 배운 것">{current.detail.result}</Field>}
          {current.detail.open && (
            <button
              type="button"
              onClick={current.detail.open}
              className="mt-4 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-bg hover:bg-accent-strong"
            >
              앱에서 열기
            </button>
          )}
        </div>
      )}
    </AppSplit>
  );
}
