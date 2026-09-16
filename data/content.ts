import type { ContentItem } from "./types";

/**
 * CONTENT — Instagram @zun_it_.
 *
 * 조회수는 전부 실제 인사이트 값입니다. 추정하거나 반올림해 올리지 않습니다.
 */
export const contentBrand = {
  handle: "@zun_it_",
  url: "https://www.instagram.com/zun_it_/",
  topics: ["AI", "DEV", "VIBE CODING", "PROJECT", "EXPERIMENT"] as const,
  insightTitle: "만든 걸 올리는 것보다, 필요한 걸 만들어 올리는 쪽이 훨씬 잘 됐다",
  insight:
    "가장 많이 본 게시물 셋은 전부 '컴활 마스터 웹앱', '한능검 마스터 웹앱', 'SQLD 자료'처럼 시험을 앞둔 사람이 지금 필요한 것이었습니다. 알고리즘 시각화(1,685)나 AI 로드맵(1,285) 같은 제가 보여주고 싶은 것보다, 상대가 찾던 것을 만들어 준 게시물이 100배 가까이 차이가 났습니다. 도구를 만들고 그 도구를 댓글로 나눠 주는 형태가 저에게는 가장 잘 맞았습니다.",
} as const;

/** 실제 게시물. views는 인스타그램 인사이트 기준 조회수. */
export const contentItems: ContentItem[] = [
  {
    id: "comhwal",
    title: "컴활 마스터 웹앱 — 댓글에 링크, 바로 전송",
    category: "PROJECT",
    views: "12.5만",
    takeaway:
      "컴퓨터활용능력 준비용 웹앱을 만들어 댓글로 링크를 보내 줬습니다. 계정에서 가장 많이 본 게시물이고, 다음 게시물들의 기준선이 됐습니다.",
    href: "https://www.instagram.com/zun_it_/",
  },
  {
    id: "sqld",
    title: "댓글에 'SQLD' 라고 남기면 바로 링크",
    category: "PROJECT",
    views: "2.2만",
    takeaway:
      "SQLD 자료를 댓글 키워드로 나눠 줬습니다. 화면에 정보를 다 넣는 대신 한 문장만 두고 나머지를 댓글로 옮긴 형태입니다.",
    href: "https://www.instagram.com/zun_it_/",
  },
  {
    id: "hanneungeom",
    title: "한능검 마스터 웹앱 — 댓글 남기면 바로 드려요",
    category: "PROJECT",
    views: "1.8만",
    takeaway:
      "한국사능력검정 준비용 웹앱. 같은 형식을 다른 시험으로 옮겨도 통한다는 걸 확인한 게시물입니다.",
    href: "https://www.instagram.com/zun_it_/",
  },
  {
    id: "asteron",
    title: "Asteron EP.01 — 영화 리뷰로 '나만의 우주'를 만들 수 있다면?",
    category: "EXPERIMENT",
    views: "3,502",
    takeaway:
      "본 영화를 별로 띄워 자기 우주를 만드는 실험. 시험 자료가 아닌 순수 실험 중에서는 가장 반응이 좋았습니다.",
    href: "https://www.instagram.com/zun_it_/",
  },
  {
    id: "bubble-sort",
    title: "BUBBLE SORT — 옆자리와 비교해서 큰 값을 뒤로 밀어냅니다",
    category: "DEV",
    views: "1,685",
    takeaway:
      "정렬 과정을 막대로 시각화하고 코드를 나란히 붙였습니다. 개념 설명은 도구보다 반응이 약했습니다.",
    href: "https://www.instagram.com/zun_it_/",
  },
  {
    id: "ai-roadmap",
    title: "ZUN AI ROADMAP",
    category: "AI",
    views: "1,285",
    takeaway:
      "AI 레벨 진단·로드맵·프롬프트 도서관을 한 화면에 정리했습니다. 범위가 넓은 것이 오히려 걸림돌이 됐다고 봅니다.",
    href: "https://www.instagram.com/zun_it_/",
  },
];
