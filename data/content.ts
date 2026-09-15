import type { ContentItem } from "./types";

export const contentBrand = {
  handle: "@zun_it_",
  url: "https://www.instagram.com/zun_it_/",
  topics: ["AI", "DEV", "VIBE CODING", "PROJECT", "EXPERIMENT"] as const,
  insightTitle: "What worked?",
  /** TODO(ZUN): replace with a real observation from your best-performing posts */
  insight: "TODO: 어떤 콘텐츠가 왜 잘 됐는지 한 줄로 적어주세요.",
};

/**
 * WHAT I SHARE — gallery.
 * View counts are shown ONLY when `views` is set with a confirmed number.
 * TODO(ZUN): add real posts (title, category, permalink, thumbnail in /public/content).
 */
export const contentItems: ContentItem[] = [
  {
    id: "c1",
    title: "TODO: 콘텐츠 제목",
    category: "AI",
    takeaway: "TODO: 짧은 takeaway",
    draft: true,
  },
  {
    id: "c2",
    title: "TODO: 콘텐츠 제목",
    category: "VIBE CODING",
    takeaway: "TODO: 짧은 takeaway",
    draft: true,
  },
  {
    id: "c3",
    title: "TODO: 콘텐츠 제목",
    category: "DEV",
    takeaway: "TODO: 짧은 takeaway",
    draft: true,
  },
  {
    id: "c4",
    title: "TODO: 콘텐츠 제목",
    category: "PROJECT",
    takeaway: "TODO: 짧은 takeaway",
    draft: true,
  },
  {
    id: "c5",
    title: "TODO: 콘텐츠 제목",
    category: "EXPERIMENT",
    takeaway: "TODO: 짧은 takeaway",
    draft: true,
  },
];
