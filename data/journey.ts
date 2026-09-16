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
  },
  {
    id: "2025",
    year: "2025",
    title: "Projects / Experiments",
    description:
      "배운 것을 프로젝트로 옮기기 시작했습니다. 작게 만들고, 부수고, 다시 만들었습니다.",
    keywords: ["Projects", "Experiments", "Web"],
  },
  {
    id: "2026",
    year: "2026",
    title: "만들고, 올리고, 다시 만들기",
    description:
      "8월에 STUDY CORP와 STUDYUP을 만들고, 8월 1일부터 @zun_it_에 만드는 과정을 올리기 시작했습니다. 9월에는 Cavero와 MEALGAME을 붙잡았고, 그 사이 컴활 웹앱 게시물이 12.5만 조회를 기록하면서 '보여주고 싶은 것'보다 '필요한 것'을 만들어야 한다는 걸 배웠습니다. 한 달 반 만에 팔로워 1,543명.",
    keywords: ["AI", "Web", "Content", "Startup"],
  },
  {
    id: "now",
    year: "NOW",
    title: "BUILDING NEXT",
    description:
      "만든 것을 흩어진 배포 목록이 아니라 하나로 설명하는 중입니다. 지금 보고 계신 이 사이트가 그 작업입니다.",
    keywords: ["Next"],
    current: true,
  },
];
