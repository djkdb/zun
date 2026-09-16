import type { Link } from "./types";

export const profile = {
  brand: "ZUN",
  /** Korean given name, used sparingly (e.g. contact footer). */
  name: "이성준",
  handle: "@zun_it_",
  tagline: "I BUILD THINGS.",
  taglineAlt: "ZERO → UP → NEXT.",
  formula: "Software × AI × Product",
  roles: ["Software Student", "AI Builder", "Creator", "Explorer"],
  school: "충북대학교 소프트웨어학부 · 인공지능 전공",
  intro:
    "03년생, 충북대 소프트웨어학부에서 인공지능을 전공합니다. 아이디어를 빠르게 프로토타입으로 만들고 실제로 배포해서 쓰이는 형태까지 가져가는 것을 좋아합니다.",
  intro2:
    "AI를 도구로 삼아 직접 만들고, 써 보고, 기록합니다. 만든 것은 @zun_it_에 올리고 피드백으로 다시 만듭니다.",
  interests: [
    "Software",
    "AI",
    "Web Development",
    "Generative AI",
    "Vibe Coding",
    "Product / Startup",
    "Content Creation",
  ],
  keywords: [
    "Software",
    "AI",
    "Vibe Coding",
    "Web",
    "Product",
    "Creator",
    "Experiment",
    "Build in Public",
  ],
  narrative: ["DISCOVER", "BUILD", "SHARE", "LEARN", "BUILD AGAIN"],
  siteUrl: "https://zun-1vu.pages.dev",
  description: "Software student building with AI, code, and curiosity.",

  /**
   * TRACTION — 확인된 수치만. 인스타그램 인사이트와 Cloudflare 배포 목록에서
   * 직접 읽은 값이고, 추정치는 넣지 않습니다.
   * `since`는 @zun_it_ 프로필의 "26.8.1~" 표기 기준입니다.
   */
  traction: {
    since: "2026.08.01",
    stats: [
      { label: "팔로워", value: "1,543", note: "@zun_it_ · 한 달 반" },
      { label: "최고 조회수", value: "12.5만", note: "컴활 마스터 웹앱" },
      { label: "배포한 것", value: "13", note: "Cloudflare · 살아 있는 주소" },
      { label: "게시물", value: "33", note: "만드는 과정 기록" },
    ],
    line: "0에서 시작해 한 달 반. 만든 걸 올린 게 아니라, 필요한 걸 만들어 올렸습니다.",
  },
};

/**
 * Contact links. `todo: true` entries render as visibly-unfinished so nothing
 * fake ships. Replace hrefs and remove `todo` once confirmed.
 */
export const links: Link[] = [
  { label: "GitHub", href: "https://github.com/djkdb" },
  { label: "Instagram", href: "https://www.instagram.com/zun_it_/" },
  { label: "Links", href: "https://litt.ly/zun_it_" },
  { label: "Email", href: "mailto:tjdwns2121@naver.com" },
  { label: "Portfolio", href: "/" },
];
