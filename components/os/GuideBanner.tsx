"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, type ReactNode } from "react";
import { markGuideSeen } from "./guide";
import { useOS } from "./OSProvider";
import { ZunMark } from "./ZunMark";

/*
  Each row leads with the action in bold, then says what it does, so a reader
  can scan the bold words alone and still get the whole vocabulary of the OS.
  The chip on the left names the verb. Mouse and touch get different rows
  because the gestures genuinely differ — telling a phone user to right-click
  or press ⌘K is instruction they cannot follow.
*/
type Row = { tag: string; lead: ReactNode; rest: string };

/** A key or on-screen control, drawn the way it looks where you press it. */
function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-grid min-w-[1.6em] place-items-center rounded-[4px] border border-line-strong border-b-2 bg-bg-3 px-1.5 py-px font-mono text-[11.5px] font-semibold leading-[1.45] text-fg">
      {children}
    </kbd>
  );
}

const MOUSE: Row[] = [
  { tag: "열기", lead: "아이콘이나 Dock 클릭", rest: "앱이 창으로 열립니다" },
  { tag: "이동", lead: "제목줄 끌기", rest: "창을 옮기고, 가장자리를 끌면 크기가 바뀝니다" },
  { tag: "검색", lead: <><Key>⌘K</Key> · <Key>Ctrl K</Key></>, rest: "프로젝트와 앱을 바로 찾습니다" },
  { tag: "메뉴", lead: "바탕화면 우클릭", rest: "배경 바꾸기 같은 메뉴가 나옵니다" },
];

const TOUCH: Row[] = [
  { tag: "열기", lead: "아이콘 누르기", rest: "앱이 열립니다" },
  { tag: "전환", lead: "아래 Dock", rest: "다른 앱으로 바로 옮겨 갑니다" },
  { tag: "닫기", lead: <>창 왼쪽 위 <Key>×</Key></>, rest: "바탕화면으로 돌아옵니다" },
  { tag: "검색", lead: <>오른쪽 위 <Key>🔍</Key></>, rest: "프로젝트와 앱을 찾습니다" },
];

function Rows({ rows, className }: { rows: Row[]; className: string }) {
  return (
    <ul className={`grid gap-2.5 ${className}`}>
      {rows.map((r) => (
        <li key={r.tag} className="grid grid-cols-[2.75rem_1fr] items-start gap-3">
          <span className="mt-px inline-flex h-[22px] items-center justify-center rounded-full bg-accent-soft text-[11.5px] font-semibold text-accent-strong">
            {r.tag}
          </span>
          <p className="text-[13.5px] leading-[1.6] text-fg-muted">
            <strong className="mr-1.5 font-semibold text-fg">{r.lead}</strong>
            {r.rest}
          </p>
        </li>
      ))}
    </ul>
  );
}

/**
 * How to use ZUN OS, shown on the first visit.
 *
 * A desktop OS in a browser is the one kind of website a visitor cannot use
 * on instinct: nothing says icons open apps or that windows move. This says it
 * once, then remembers it was closed. The 도움말 menu, or 🔍 search on a
 * phone (which has no 도움말 menu), brings it back.
 *
 * It sits in empty wallpaper on purpose — above the Dock on wide screens,
 * right under the menu bar on phones — because the welcome toast it replaces
 * landed on top of the icons it was describing. On a phone the gap above the
 * icon grid runs from about 500px down to about 230px (iPhone SE, 1st gen),
 * so there it is capped at that gap and scrolls inside itself instead of
 * spilling over the icons. It covers the nameplate while open; that is the
 * cheaper thing to hide, since it comes straight back on close.
 */
export function GuideBanner() {
  const os = useOS();
  const { setGuide, openApp } = os;

  const close = useCallback(() => {
    setGuide(false);
    markGuideSeen();
  }, [setGuide]);

  const startWithProjects = useCallback(() => {
    close();
    openApp("projects");
  }, [close, openApp]);

  return (
    <AnimatePresence>
      {os.guide && (
        <motion.section
          key="guide"
          role="region"
          aria-label="ZUN OS 사용법 안내"
          initial={os.reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={os.reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: os.reduce ? 0.001 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-[5.75rem] left-1/2 z-[9400] break-keep w-[480px] max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-[6px] border border-line-strong bg-bg-1/[.97] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,.85),0_0_0_1px_rgba(0,0,0,.4)] backdrop-blur-xl max-[760px]:bottom-auto max-[760px]:left-3 max-[760px]:right-3 max-[760px]:top-9 max-[760px]:max-h-[calc(100dvh-21.5rem)] max-[760px]:w-auto max-[760px]:max-w-none max-[760px]:translate-x-0 max-[760px]:overflow-y-auto max-[760px]:p-4"
        >
          <header className="flex items-center gap-3">
            <ZunMark size={36} className="flex-none rounded-[6px] border border-line-strong" />
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] text-fg-dim max-[760px]:hidden">처음 오셨다면 30초만</p>
              <h2 className="text-[16px] font-bold leading-snug tracking-[-0.01em] text-fg [text-wrap:balance] max-[760px]:text-[15px]">
                이 포트폴리오는 작은 운영체제처럼 움직여요
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="사용법 안내 닫기"
              className="grid h-8 w-8 flex-none place-items-center self-start rounded-[4px] text-[18px] leading-none text-fg-dim transition-colors hover:bg-bg-3 hover:text-fg"
            >
              <span aria-hidden>{"\u00d7"}</span>
            </button>
          </header>

          <div className="my-4 h-px bg-line max-[760px]:my-3" aria-hidden />

          <Rows rows={MOUSE} className="pointer-coarse:hidden" />
          <Rows rows={TOUCH} className="hidden pointer-coarse:grid" />

          <div className="mt-5 flex flex-wrap items-center gap-2 max-[760px]:mt-4">
            <button
              type="button"
              onClick={startWithProjects}
              className="min-h-9 rounded-[4px] bg-select px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#0954ab]"
            >
              만든 것부터 보기
            </button>
            <button
              type="button"
              onClick={close}
              className="min-h-9 rounded-[4px] border border-line-strong px-4 text-[13px] font-medium text-fg transition-colors hover:bg-bg-3"
            >
              직접 둘러볼게요
            </button>
            <Link
              href="/classic"
              className="ml-auto inline-flex min-h-9 items-center text-[12px] text-fg-dim underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg max-[420px]:ml-0"
            >
              일반 페이지로 보기
            </Link>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
