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
    note: "흩어진 배포 20여 개를 하나의 OS로 묶는 중.",
  },
  {
    id: "ai-experiments",
    label: "AI EXPERIMENTS",
    status: "active",
    note: "기획부터 배포까지 AI와 같이 만들고, 프롬프트와 실패까지 남기는 중.",
  },
  {
    id: "content",
    label: "CONTENT",
    status: "active",
    note: "@zun_it_ · 8월 1일 시작, 게시물 33개 / 팔로워 1,543명.",
  },
  {
    id: "startup",
    label: "STARTUP",
    status: "exploring",
    note: "교내 창업동아리 · 모두의창업 신속심사 통과. 실제로 쓰이는 제품이 무엇인지 탐색 중.",
  },
];

export const nowUpdated = "2026-09"; // 이 파일을 고칠 때마다 함께 올려주세요
