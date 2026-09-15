import type { Project } from "./types";

/**
 * PROJECT LAB
 * Titles come from ZUN's project list. Entries marked `draft: true` still need
 * problem / build / result / links confirmed by ZUN — the UI shows them as
 * drafts rather than pretending they are complete.
 *
 * TODO(ZUN): fill in problem/build/result/stack/links for each project.
 */
export const projects: Project[] = [
  {
    id: "class-fc",
    title: "CLASS FC",
    tagline: "TODO: 한 줄 소개 (예: 축구 팀/클래스를 위한 서비스)",
    role: "TODO: 역할",
    stack: [],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "TODO: 무엇을 어떻게 만들었는지",
    result: "TODO: 결과 / 배운 점",
    themes: ["software", "web", "product"],
    draft: true,
    pose: "build",
  },
  {
    id: "travel-companion",
    title: "Travel Companion",
    tagline: "TODO: 한 줄 소개 (예: 여행 동행 / 여행 계획 서비스)",
    role: "TODO: 역할",
    stack: [],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "TODO: 무엇을 어떻게 만들었는지",
    result: "TODO: 결과 / 배운 점",
    themes: ["web", "product", "ai"],
    draft: true,
    pose: "backpack",
  },
  {
    id: "zun-food",
    title: "ZUN Food",
    tagline: "TODO: 한 줄 소개 (예: 음식 추천 / 기록 실험)",
    role: "TODO: 역할",
    stack: [],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "TODO: 무엇을 어떻게 만들었는지",
    result: "TODO: 결과 / 배운 점",
    themes: ["experiment", "web"],
    draft: true,
    pose: "tea",
  },
  {
    id: "asteron",
    title: "Asteron",
    tagline: "TODO: 한 줄 소개",
    role: "TODO: 역할",
    stack: [],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "TODO: 무엇을 어떻게 만들었는지",
    result: "TODO: 결과 / 배운 점",
    themes: ["software", "ai"],
    draft: true,
    pose: "search",
  },
  {
    id: "ev-safepark",
    title: "EV-SafePark",
    tagline: "TODO: 한 줄 소개 (예: 전기차 주차 안전 관련 프로젝트)",
    role: "TODO: 역할",
    stack: [],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "TODO: 무엇을 어떻게 만들었는지",
    result: "TODO: 결과 / 배운 점",
    themes: ["software", "product"],
    draft: true,
    pose: "present",
  },
  {
    id: "zun-portfolio",
    title: "ZUN Portfolio",
    tagline: "ZUN이라는 사람을 하나의 인터랙티브한 디지털 공간으로 표현한 이 사이트.",
    role: "Design · Frontend",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Lenis"],
    problem:
      "이력서형 포트폴리오는 '무엇을 했는지'는 보여주지만 '어떤 사람인지'는 보여주지 못했습니다.",
    build:
      "픽셀아트 ZUN 캐릭터를 가이드로 두고, 스크롤을 따라 DISCOVER → BUILD → SHARE → LEARN 서사를 읽어가는 구조로 만들었습니다. 모든 콘텐츠는 /data 에서 관리합니다.",
    result:
      "URL 하나로 제출할 수 있는 개인 브랜딩 사이트. 계속 업데이트 중입니다.",
    github: { label: "GitHub", href: "https://github.com/djkdb/zun" },
    year: "2026",
    themes: ["web", "product", "content"],
    pose: "night",
  },
];
