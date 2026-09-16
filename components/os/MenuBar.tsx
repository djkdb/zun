"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { APPS } from "./registry";
import { useOS } from "./OSProvider";

interface Item { label: string; shortcut?: string; run?: () => void; disabled?: boolean }
type Menu = { id: string; label: string; items: (Item | "sep")[] };

export function MenuBar() {
  const os = useOS();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [clock, setClock] = useState("");
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const h = d.getHours();
      const ap = h < 12 ? "오전" : "오후";
      setClock(
        `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]}) ${ap} ${(h % 12) || 12}:${String(d.getMinutes()).padStart(2, "0")}`,
      );
    };
    tick();
    const t = window.setInterval(tick, 20_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [open]);

  const app = os.focusedApp ? APPS[os.focusedApp] : null;
  const focused = os.focused;

  const menus: Menu[] = [
    {
      id: "zun",
      label: "ZUN OS",
      items: [
        { label: "ZUN에 대하여", run: () => os.openApp("about") },
        "sep",
        { label: "설정…", run: () => os.openApp("settings") },
        { label: "찾기", shortcut: "⌘K", run: () => os.setSpotlight(true) },
        "sep",
        { label: "일반 보기 (스크롤 사이트)", run: () => router.push("/classic") },
        "sep",
        { label: "다시 시작", run: () => os.setPower("restarting") },
        { label: "시스템 종료", run: () => os.setPower("off") },
      ],
    },
    {
      id: "open",
      label: "열기",
      items: [
        { label: "새 보관함 창", shortcut: "⌘N", run: () => os.openApp("finder") },
        { label: "터미널 열기", run: () => os.openApp("terminal") },
        "sep",
        { label: "창 닫기", shortcut: "⌘W", disabled: !focused, run: () => focused && os.closeWindow(focused) },
      ],
    },
    {
      id: "look",
      label: "보기",
      items: [
        { label: os.settings.appearance === "dark" ? "밝은 모드로" : "어두운 모드로",
          run: () => os.setAppearance(os.settings.appearance === "dark" ? "light" : "dark") },
        { label: os.settings.motion ? "동작 줄이기 켜기" : "동작 줄이기 끄기",
          run: () => os.setMotion(!os.settings.motion) },
        "sep",
        { label: "배경화면 바꾸기…", run: () => os.openApp("settings") },
      ],
    },
    {
      id: "win",
      label: "창",
      items: [
        { label: "최소화", shortcut: "⌘M", disabled: !focused, run: () => focused && os.minimizeWindow(focused) },
        { label: "확대/축소", disabled: !focused || os.narrow, run: () => focused && os.zoomWindow(focused) },
        "sep",
        { label: "모든 창 닫기", disabled: !os.windows.length, run: () => os.closeAll() },
      ],
    },
    {
      id: "help",
      label: "도움말",
      items: [
        { label: "ZUN OS 사용법", run: () => os.openApp("notes", { arg: "help", title: "기록 — ZUN OS 사용법" }) },
        { label: "링크 열기", run: () => os.openApp("safari") },
      ],
    },
  ];

  return (
    <header
      ref={barRef}
      className="absolute inset-x-0 top-0 z-[9000] flex h-[30px] items-center gap-px border-b border-white/5 bg-bg/45 px-2 text-[12.5px] text-fg backdrop-blur-xl backdrop-saturate-150"
    >
      <span
        aria-hidden
        className="mr-2 flex-none rounded-[3px] bg-accent px-1.5 py-[3px] font-pixel text-[9px] leading-none tracking-[0.12em] text-bg"
      >
        ZUN
      </span>
      {menus.map((m, i) => (
        <div key={m.id} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open === m.id}
            onPointerDown={(e) => { e.stopPropagation(); setOpen(open === m.id ? null : m.id); }}
            onPointerEnter={() => open && setOpen(m.id)}
            className={`rounded px-2.5 py-0.5 leading-5 ${i === 0 ? "font-bold" : ""} ${
              open === m.id ? "bg-select text-white" : "hover:bg-white/10"
            } ${i > 0 ? "max-[760px]:hidden" : ""}`}
          >
            {i === 0 ? (app?.name ?? "보관함") : m.label}
          </button>
          {open === m.id && (
            <div
              role="menu"
              className="absolute left-0 top-full mt-1 min-w-[230px] rounded-[4px] border border-line-strong bg-bg-2/95 p-1.5 shadow-2xl backdrop-blur-2xl"
            >
              {m.items.map((it, n) =>
                it === "sep" ? (
                  <hr key={n} className="mx-2 my-1 border-line" />
                ) : (
                  <button
                    key={n}
                    type="button"
                    role="menuitem"
                    disabled={it.disabled}
                    onClick={() => { setOpen(null); it.run?.(); }}
                    className="flex w-full items-center gap-4 rounded-md px-2.5 py-1.5 text-left text-[13px] enabled:hover:bg-select enabled:hover:text-white disabled:text-fg-dim"
                  >
                    <span className="flex-1">{it.label}</span>
                    {it.shortcut && <span className="font-mono text-[11px] opacity-70">{it.shortcut}</span>}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}

      <div className="ml-auto flex items-center gap-0.5">
        <button
          type="button"
          aria-label="찾기"
          onClick={() => os.setSpotlight(true)}
          className="rounded px-2 py-0.5 hover:bg-white/10"
        >
          🔍
        </button>
        <span className="hidden px-2 text-[11px] opacity-80 sm:inline" aria-hidden>
          {os.settings.appearance === "dark" ? "🌙" : "☀️"}
        </span>
        <span className="px-1 font-mono text-[11.5px] tabular-nums">{clock}</span>
      </div>
    </header>
  );
}
