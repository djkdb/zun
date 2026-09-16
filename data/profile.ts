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
};

/**
 * Contact links. `todo: true` entries render as visibly-unfinished so nothing
 * fake ships. Replace hrefs and remove `todo` once confirmed.
 */
export const links: Link[] = [
  { label: "GitHub", href: "https://github.com/djkdb" },
  { label: "Instagram", href: "https://www.instagram.com/zun_it_/" },
  { label: "Links", href: "https://litt.ly/zun_it_" },
  { label: "Email", href: "mailto:", todo: true }, // TODO: contact email
  { label: "Portfolio", href: "/" },
];
