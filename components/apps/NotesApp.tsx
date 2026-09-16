"use client";

import { useState } from "react";
import { future, loopSteps, profile } from "@/data";
import { useOS } from "@/components/os/OSProvider";
import type { AppWindowProps } from "@/components/os/types";
import { AppSplit, SideGroup, SideItem } from "./shell";

type NoteId = "loop" | "future" | "help" | "principles";

export function NotesApp({ win }: AppWindowProps) {
  const os = useOS();
  const [id, setId] = useState<NoteId>((win?.arg as NoteId) ?? "loop");

  const NOTES: { id: NoteId; icon: string; label: string }[] = [
    { id: "loop", icon: "🔁", label: "BUILD / FAIL / LEARN" },
    { id: "future", icon: "🌱", label: "다음에 할 것" },
    { id: "principles", icon: "📐", label: "원칙" },
    { id: "help", icon: "💡", label: "ZUN OS 사용법" },
  ];

  return (
    <AppSplit
      sidebar={
        <>
          <SideGroup label="메모" />
          {NOTES.map((n) => (
            <SideItem key={n.id} icon={n.icon} label={n.label} active={id === n.id} onClick={() => setId(n.id)} />
          ))}
        </>
      }
    >
      <div className="min-h-0 flex-1 overflow-auto px-7 py-6 max-[560px]:px-4">
        {id === "loop" && (
          <>
            <h2 className="text-lg font-semibold tracking-tight text-fg">BUILD → FAIL → LEARN → BUILD AGAIN</h2>
            <div className="mt-5 grid gap-4">
              {loopSteps.map((s) => (
                <div key={s.key} className="border-t border-line pt-4">
                  <div className="min-w-0">
                    <p className="font-pixel text-xs tracking-widest text-accent-strong">{s.title}</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-muted">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {id === "future" && (
          <>
            <h2 className="text-lg font-semibold tracking-tight text-fg">{future.title}</h2>
            <p className="mt-2 font-mono text-[11px] tracking-wider text-accent-strong">
              {future.formula.join(" × ")}
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-fg-muted">{future.statement}</p>
            <ul className="mt-5 grid gap-2.5">
              {future.lines.map((f) => (
                <li key={f} className="flex gap-2.5 text-[13.5px] text-fg-muted">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              {future.principles.map((pr) => (
                <div key={pr.key} className="border-t border-line pt-3">
                  <p className="font-pixel text-[11px] tracking-widest text-fg">{pr.key}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{pr.body}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {id === "principles" && (
          <>
            <h2 className="text-lg font-semibold tracking-tight text-fg">원칙</h2>
            <p className="mt-4 text-[13.5px] leading-relaxed text-fg-muted">{profile.intro}</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-fg-muted">{profile.intro2}</p>
            <hr className="my-5 border-line" />
            <p className="text-[13.5px] leading-relaxed text-fg-muted">
              없는 경력·수상·성과는 쓰지 않습니다. 확인되지 않은 값은 전부{" "}
              <span className="font-mono text-warn">TODO</span>로 두고, 화면에도 그대로 TODO로 보입니다. 완성된
              척하는 것보다 비어 있는 게 낫다고 생각합니다.
            </p>
          </>
        )}

        {id === "help" && (
          <>
            <h2 className="text-lg font-semibold tracking-tight text-fg">ZUN OS 사용법</h2>
            <ul className="mt-4 grid gap-2 text-[13.5px] text-fg-muted">
              <li><Key>⌘K</Key> 찾기 — 프로젝트·앱·콘텐츠 전부</li>
              <li><Key>⌘W</Key> 창 닫기 · <Key>⌘M</Key> 최소화 · <Key>⌘N</Key> 새 보관함 창</li>
              <li><Key>Esc</Key> 열린 창 닫기 / 검색 취소</li>
              <li>바탕화면 <b className="text-fg">우클릭</b> — 배경화면·터미널·정리</li>
              <li>창 <b className="text-fg">모서리를 끌어</b> 크기 조절, 제목표시줄 <b className="text-fg">더블클릭</b>으로 확대</li>
              <li>터미널에서 <span className="font-mono text-accent-strong">help</span>, <span className="font-mono text-accent-strong">neofetch</span></li>
            </ul>
            <button
              type="button"
              onClick={() => os.openApp("terminal")}
              className="mt-5 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-bg hover:bg-accent-strong"
            >
              터미널 열기
            </button>
          </>
        )}
      </div>
    </AppSplit>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mr-1.5 rounded border border-line-strong border-b-2 bg-bg-3/60 px-1.5 py-0.5 font-mono text-[11px] text-fg">
      {children}
    </kbd>
  );
}
