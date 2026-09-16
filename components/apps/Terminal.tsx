"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { activities, contentItems, journey, links, loopSteps, profile, projects } from "@/data";
import { useOS } from "@/components/os/OSProvider";
import { APPS } from "@/components/os/registry";
import type { AppId } from "@/components/os/types";

interface Line { html: string }

const NEOFETCH = `      ████████████        ZUN@zun-os
   ██              ██     ─────────────
  ██   ██      ██   ██    OS        ZUN OS 1.0
  ██                ██    Host      ${profile.school}
  ██   ██      ██   ██    Kernel    Next.js · React 19
   ██    ██████    ██     Shell     zsh (진짜로 동작합니다)
      ████████████        Focus     ${profile.formula}
                          Handle    ${profile.handle}`;

export function Terminal() {
  const os = useOS();
  const router = useRouter();
  const inputId = useId();
  const [lines, setLines] = useState<Line[]>([
    { html: `<span class="text-fg-dim">ZUN OS 1.0 — 도움말은 </span><span class="text-accent-strong">help</span><span class="text-fg-dim">를 입력하세요.</span>` },
  ]);
  const [buf, setBuf] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusedHere = os.focusedApp === "terminal";

  const write = useCallback((html: string) => setLines((l) => [...l, { html }]), []);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [lines]);

  /* a terminal that does not take the caret is a picture of a terminal */
  useEffect(() => {
    if (os.focusedApp !== "terminal") return;
    const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 40);
    return () => window.clearTimeout(t);
  }, [os.focusedApp]);

  const run = useCallback(
    (raw: string) => {
      const [cmd, ...rest] = raw.trim().split(/\s+/);
      const arg = rest.join(" ");
      const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
      if (!cmd) return;

      switch (cmd) {
        case "help":
          write(
            [
              ["help", "명령 목록"],
              ["whoami", "나는 누구인가"],
              ["projects", "배포된 프로젝트"],
              ["cat <이름>", "프로젝트 상세"],
              ["journey", "연도별 여정"],
              ["skills", "기술 / 관심사"],
              ["activities", "대외활동"],
              ["content", "콘텐츠"],
              ["loop", "BUILD / FAIL / LEARN"],
              ["contact", "연락처"],
              ["open <앱>", "앱 실행 (finder/notes/photos…)"],
              ["apps", "앱 목록"],
              ["play", "TERMINAL CITY 실행"],
              ["neofetch", "시스템 정보"],
              ["theme", "다크 / 라이트 전환"],
              ["classic", "일반 보기(스크롤 사이트)"],
              ["clear", "화면 지우기"],
            ]
              .map(([c, d]) => `  <span class="text-accent-strong">${c.padEnd(14)}</span><span class="text-fg-dim">${d}</span>`)
              .join("\n"),
          );
          break;
        case "whoami":
          write(`  ${profile.name} (${profile.brand})\n  ${profile.school}\n  ${profile.formula}\n  ${profile.intro}`);
          break;
        case "projects":
          write(
            projects
              .map((p) => `  ${p.draft ? "📦" : "🧰"} <span class="text-accent-strong">${esc(p.title)}</span>  <span class="text-fg-dim">${p.draft ? "초안" : p.stack[0] ?? "웹"}</span>`)
              .join("\n"),
          );
          break;
        case "cat": {
          if (!arg) { write(`  <span class="text-[#ff7a70]">사용법: cat ZUNRAN</span>`); break; }
          const p = projects.find((x) => x.title.toLowerCase().includes(arg.toLowerCase()));
          if (!p) { write(`  <span class="text-[#ff7a70]">cat: ${esc(arg)}: 그런 파일이 없습니다</span>`); break; }
          write(
            `  <span class="text-accent-strong">${esc(p.title)}</span>\n  문제:  ${esc(p.problem)}\n  구현:  ${esc(p.build)}\n  결과:  ${esc(p.result)}`,
          );
          break;
        }
        case "journey":
          write(journey.map((j) => `  <span class="text-accent-strong">${j.year}</span>  ${esc(j.title)}`).join("\n"));
          break;
        case "skills":
          write(`  ${profile.interests.join("  ·  ")}`);
          break;
        case "activities":
          write(activities.map((a) => `  🎒 ${esc(a.title)} <span class="text-fg-dim">${esc(a.category)}</span>`).join("\n"));
          break;
        case "content":
          write(contentItems.map((c) => `  🎞️ ${esc(c.title)} <span class="text-fg-dim">${esc(c.category)}</span>`).join("\n"));
          break;
        case "loop":
          write(loopSteps.map((s) => `  <span class="text-accent-strong">${s.title}</span>  ${esc(s.body)}`).join("\n"));
          break;
        case "contact":
          write(links.map((l) => `  ${esc(l.label).padEnd(12)} <span class="${l.todo ? "text-warn" : "text-accent-strong"}">${l.todo ? "TODO" : esc(l.href)}</span>`).join("\n"));
          break;
        case "apps":
          write("  " + Object.keys(APPS).join("  "));
          break;
        case "open":
          if (arg in APPS) { os.openApp(arg as AppId); write(`  ${esc(arg)} 여는 중…`); }
          else write(`  <span class="text-[#ff7a70]">open: ${esc(arg || "?")}: 없는 앱</span>`);
          break;
        case "play":
          os.openApp("playground");
          write("  TERMINAL CITY 실행 중…");
          break;
        case "neofetch":
          write(`<span class="text-accent-strong">${NEOFETCH}</span>`);
          break;
        case "theme":
          os.setAppearance(os.settings.appearance === "dark" ? "light" : "dark");
          write(`  외관: ${os.settings.appearance === "dark" ? "라이트" : "다크"}`);
          break;
        case "classic":
          router.push("/classic");
          break;
        case "clear":
          setLines([]);
          break;
        case "sudo":
          write(`  <span class="text-fg-dim">zun은(는) sudoers 파일에 없습니다. 이 사건은 보고됩니다.</span>`);
          break;
        default:
          os.beep("error");
          write(`  <span class="text-[#ff7a70]">zsh: command not found: ${esc(cmd)}</span>`);
      }
    },
    [os, write, router],
  );

  return (
    <div
      ref={boxRef}
      onPointerDown={() => inputRef.current?.focus()}
      className="h-full cursor-text overflow-auto bg-[#0a0e1a]/95 px-4 py-3.5 font-mono text-[12.5px] leading-[1.75] text-[#c9d3ea]"
    >
      {lines.map((l, i) => (
        <pre key={i} className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: l.html }} />
      ))}
      <div className="relative flex items-baseline gap-1">
        <span className="flex-none">
          <span className="text-ok">zun@zun-os</span>
          <span className="text-fg-dim">:~$</span>
        </span>
        {/* the blinking block is this input's focus indicator — a terminal
            shows a caret, not a rounded outline */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 -z-10 select-none whitespace-pre font-mono text-transparent"
        >
          {`zun@zun-os:~$ ${buf}`}
          <span className={`inline-block h-[15px] w-[7px] translate-y-[3px] bg-[#c9d3ea] ${focusedHere ? "animate-caret" : "opacity-0"}`} />
        </span>
        <input
          ref={inputRef}
          id={inputId}
          data-terminal-input
          value={buf}
          autoComplete="off"
          spellCheck={false}
          aria-label="터미널 입력"
          onChange={(e) => setBuf(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const line = buf;
              setLines((l) => [...l, { html: `<span class="text-ok">zun@zun-os</span><span class="text-fg-dim">:~$</span> ${line.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string))}` }]);
              if (line.trim()) setHist((h) => [...h, line]);
              setHi(hist.length + 1);
              setBuf("");
              run(line);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              const n = Math.max(0, hi - 1);
              setHi(n);
              setBuf(hist[n] ?? "");
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const n = Math.min(hist.length, hi + 1);
              setHi(n);
              setBuf(hist[n] ?? "");
            }
          }}
          className="min-w-0 flex-1 bg-transparent font-mono text-[12.5px] text-[#c9d3ea] caret-transparent outline-none focus:outline-none focus-visible:outline-none"
        />
      </div>
    </div>
  );
}
