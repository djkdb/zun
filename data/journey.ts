import type { JourneyItem } from "./types";

/**
 * MY JOURNEY — timeline.
 * Years and headlines come from ZUN's brief. Details marked TODO are
 * intentionally short until confirmed.
 */
export const journey: JourneyItem[] = [
  {
    id: "2024",
    year: "2024",
    title: "Software / University",
    description:
      "충북대학교 소프트웨어학부에서 컴퓨터 과학의 기초를 쌓기 시작했습니다.",
    keywords: ["University", "Software", "Fundamentals"],
    pose: "book",
  },
  {
    id: "2025",
    year: "2025",
    title: "Projects / Experiments",
    description:
      "배운 것을 프로젝트로 옮기기 시작했습니다. 작게 만들고, 부수고, 다시 만들었습니다.",
    keywords: ["Projects", "Experiments", "Web"],
    pose: "laptop-desk",
  },
  {
    id: "2026",
    year: "2026",
    title: "AI / Web / Content / Startup / Global Experience",
    description:
      "AI를 도구로 삼아 더 빠르게 실험하고, 만든 것을 콘텐츠로 공유하기 시작했습니다.",
    keywords: ["AI", "Web", "Content", "Startup", "Global"],
    pose: "phone",
  },
  {
    id: "now",
    year: "NOW",
    title: "BUILDING NEXT",
    description: "다음에 만들 것을 찾고 있습니다.",
    keywords: ["Next"],
    pose: "search",
    current: true,
  },
];
