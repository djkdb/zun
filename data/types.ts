/**
 * ZUN portfolio content model.
 * All site copy lives in /data. Components never hard-code content.
 *
 * RULE: never invent facts. Unknown values stay as TODO placeholders and
 * are rendered as visible "TODO" states so nothing fake ships silently.
 */

/**
 * Pose names map to cells of the official 32-pose sheet (see data/character.ts).
 * The SVG fallback only draws a subset; others fall back to the nearest one.
 */
export type PoseName =
  // core (drawn by the SVG fallback too)
  | "idle"
  | "think"
  | "walk"
  | "build"
  | "phone"
  | "book"
  | "point"
  | "telescope"
  | "wave"
  | "surprise"
  | "experiment"
  // sheet-only
  | "laptop-desk"
  | "mug"
  | "laptop-lap"
  | "idea"
  | "headphones"
  | "beanbag"
  | "ok"
  | "coffee"
  | "celebrate"
  | "tired"
  | "run"
  | "desk-plant"
  | "sunglasses"
  | "cat"
  | "backpack"
  | "code"
  | "tea"
  | "night"
  | "books"
  | "sleep"
  | "write"
  | "present"
  | "search"
  | "tablet"
  | "cheers"
  | "laptop-floor";

export type TechTag = string;

export interface Link {
  label: string;
  href: string;
  /** true when the URL is a placeholder still to be filled in */
  todo?: boolean;
}

export interface Project {
  id: string;
  title: string;
  /** one line, shown on the card */
  tagline: string;
  role: string;
  stack: TechTag[];
  /** PROJECT / PROBLEM / BUILD / RESULT — shown in the detail panel */
  problem: string;
  build: string;
  result: string;
  demo?: Link;
  github?: Link;
  year?: string;
  /** which keyword(s) in ABOUT this project connects to */
  themes: Theme[];
  /** marks entries whose details are not yet confirmed by ZUN */
  draft?: boolean;
  /** character pose shown when the card is hovered */
  pose: PoseName;
  accent?: string;
}

export type Theme =
  | "software"
  | "ai"
  | "web"
  | "product"
  | "content"
  | "experiment";

export interface JourneyItem {
  id: string;
  year: string;
  title: string;
  description: string;
  keywords: string[];
  pose: PoseName;
  current?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  description: string;
  takeaway: string;
  image?: string;
  period?: string;
  pose: PoseName;
  draft?: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  category: "AI" | "DEV" | "VIBE CODING" | "PROJECT" | "EXPERIMENT";
  /** only set when confirmed — never estimate */
  views?: string;
  takeaway: string;
  href?: string;
  image?: string;
  draft?: boolean;
}

export interface NowItem {
  id: string;
  label: string;
  /** free-text status instead of fake percentages */
  status: "active" | "exploring" | "paused" | "shipping";
  note: string;
}

export interface LoopStep {
  key: "build" | "fail" | "learn" | "again";
  title: string;
  body: string;
  pose: PoseName;
}
