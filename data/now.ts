import type { NowItem } from "./types";

/**
 * WHAT I'M BUILDING NOW
 * No fake percentages — each line carries a status word + a short note.
 * Update this file whenever focus shifts.
 */
export const nowItems: NowItem[] = [
  {
    id: "portfolio",
    label: "ZUN PORTFOLIO",
    status: "shipping",
    note: "이 사이트. 캐릭터와 인터랙션을 다듬는 중.",
  },
  {
    id: "ai-experiments",
    label: "AI EXPERIMENTS",
    status: "active",
    note: "생성형 AI를 개발 워크플로우에 넣어보는 실험.",
  },
  {
    id: "content",
    label: "CONTENT",
    status: "active",
    note: "@zun_it_ 에 만드는 과정을 기록.",
  },
  {
    id: "startup",
    label: "STARTUP",
    status: "exploring",
    note: "사람들이 실제로 쓰는 제품이 무엇인지 탐색.",
  },
];

export const nowUpdated = "2026-09"; // TODO(ZUN): bump when you edit this file
