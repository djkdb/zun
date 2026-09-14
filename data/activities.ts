import type { Activity } from "./types";

/**
 * BEYOND CODE — activities outside pure development.
 * Categories come from ZUN's brief. Specific organizations, dates and outcomes
 * are NOT invented: entries stay `draft` until ZUN confirms them.
 *
 * TODO(ZUN): replace drafts with real activities (name, period, takeaway, image).
 */
export const activities: Activity[] = [
  {
    id: "university",
    title: "대학 활동",
    category: "UNIVERSITY",
    description: "TODO: 학과/동아리/학회 활동을 적어주세요.",
    takeaway: "TODO: 이 활동에서 얻은 한 가지",
    pose: "book",
    draft: true,
  },
  {
    id: "startup",
    title: "창업 활동",
    category: "STARTUP",
    description: "TODO: 창업 관련 활동 (프로그램, 팀, 아이디어 검증 등)",
    takeaway: "TODO: 이 활동에서 얻은 한 가지",
    pose: "point",
    draft: true,
  },
  {
    id: "global",
    title: "글로벌 기업 탐방",
    category: "GLOBAL",
    description: "TODO: 탐방한 기업/도시/기간",
    takeaway: "TODO: 이 활동에서 얻은 한 가지",
    pose: "telescope",
    draft: true,
  },
  {
    id: "ai",
    title: "AI 관련 활동",
    category: "AI",
    description: "TODO: AI 관련 스터디/해커톤/커뮤니티",
    takeaway: "TODO: 이 활동에서 얻은 한 가지",
    pose: "experiment",
    draft: true,
  },
  {
    id: "content",
    title: "콘텐츠 활동",
    category: "CONTENT",
    description: "Instagram @zun_it_ 에서 AI · 개발 · 바이브 코딩 실험을 공유합니다.",
    takeaway: "만든 것을 공개하면, 다음에 만들 것이 더 선명해집니다.",
    pose: "phone",
  },
  {
    id: "supporters",
    title: "서포터즈 / 커뮤니티",
    category: "COMMUNITY",
    description: "TODO: 서포터즈, 커뮤니티 활동",
    takeaway: "TODO: 이 활동에서 얻은 한 가지",
    pose: "wave",
    draft: true,
  },
  {
    id: "football",
    title: "축구 / 동아리",
    category: "PLAY",
    description: "TODO: 축구/동아리 활동",
    takeaway: "TODO: 이 활동에서 얻은 한 가지",
    pose: "walk",
    draft: true,
  },
];
