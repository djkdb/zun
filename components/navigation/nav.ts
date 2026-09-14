export interface NavItem {
  id: string;
  label: string;
}

/** Sections shown in the floating nav (order = page order). */
export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "ABOUT" },
  { id: "journey", label: "JOURNEY" },
  { id: "projects", label: "PROJECTS" },
  { id: "activity", label: "ACTIVITY" },
  { id: "now", label: "NOW" },
];

/** Every section, for the full menu overlay. */
export const ALL_SECTIONS: NavItem[] = [
  { id: "hero", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "journey", label: "JOURNEY" },
  { id: "projects", label: "PROJECTS" },
  { id: "loop", label: "BUILD → FAIL → LEARN" },
  { id: "activity", label: "ACTIVITY" },
  { id: "content", label: "CONTENT" },
  { id: "now", label: "NOW" },
  { id: "future", label: "FUTURE" },
  { id: "contact", label: "CONTACT" },
];
