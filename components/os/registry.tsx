"use client";

import dynamic from "next/dynamic";
import type { AppDef, AppId } from "./types";

/**
 * APP REGISTRY — the single place an app is declared.
 * Adding an app means adding one entry here; nothing else switches on appId.
 * Heavy apps (Playground → three.js) are dynamically imported so the desktop
 * shell stays light on first paint.
 */

const loading = () => (
  <div className="flex h-full items-center justify-center font-mono text-xs text-fg-dim">
    loading…
  </div>
);

const Finder = dynamic(() => import("@/components/apps/Finder").then((m) => m.Finder), { loading });
const About = dynamic(() => import("@/components/apps/About").then((m) => m.About), { loading });
const ProjectsApp = dynamic(() => import("@/components/apps/ProjectsApp").then((m) => m.ProjectsApp), { loading });
const Terminal = dynamic(() => import("@/components/apps/Terminal").then((m) => m.Terminal), { loading });
const Safari = dynamic(() => import("@/components/apps/Safari").then((m) => m.Safari), { loading });
const Photos = dynamic(() => import("@/components/apps/Photos").then((m) => m.Photos), { loading });
const JourneyApp = dynamic(() => import("@/components/apps/JourneyApp").then((m) => m.JourneyApp), { loading });
const ActivityMonitor = dynamic(() => import("@/components/apps/ActivityMonitor").then((m) => m.ActivityMonitor), { loading });
const NotesApp = dynamic(() => import("@/components/apps/NotesApp").then((m) => m.NotesApp), { loading });
const SettingsApp = dynamic(() => import("@/components/apps/SettingsApp").then((m) => m.SettingsApp), { loading });
const MusicApp = dynamic(() => import("@/components/apps/MusicApp").then((m) => m.MusicApp), { loading });
const TrashApp = dynamic(() => import("@/components/apps/TrashApp").then((m) => m.TrashApp), { loading });
const PlaygroundApp = dynamic(() => import("@/components/apps/PlaygroundApp").then((m) => m.PlaygroundApp), {
  loading,
  ssr: false,
});

export const APPS: Record<AppId, AppDef> = {
  finder: {
    id: "finder", name: "ZUN Finder", deskName: "프로젝트", icon: "🗂️", title: "ZUN — 전체",
    width: 780, height: 500, component: Finder, pose: "search", dock: true, desktop: true,
    menu: [{ label: "새 창", shortcut: "⌘N", action: "new" }, { label: "창 닫기", shortcut: "⌘W", action: "close" }],
  },
  about: {
    id: "about", name: "About ZUN", deskName: "ZUN", icon: "🧑‍💻", title: "About ZUN",
    width: 620, height: 460, component: About, pose: "wave", dock: true, desktop: true,
  },
  projects: {
    id: "projects", name: "Projects", deskName: "만든 것", icon: "🧰", title: "Projects",
    width: 720, height: 520, component: ProjectsApp, pose: "build", dock: true, desktop: true,
  },
  terminal: {
    id: "terminal", name: "ZUN Terminal", deskName: "터미널", icon: "▶️", title: "zun — bash — 80×24",
    width: 640, height: 400, component: Terminal, pose: "code", dock: true, desktop: true,
  },
  safari: {
    id: "safari", name: "ZUN Web", icon: "🌐", title: "ZUN Web",
    width: 600, height: 480, component: Safari, pose: "point", dock: true,
  },
  photos: {
    id: "photos", name: "Photos", deskName: "콘텐츠", icon: "📸", title: "Photos — @zun_it_",
    width: 640, height: 500, component: Photos, pose: "phone", dock: true, desktop: true,
  },
  journey: {
    id: "journey", name: "Journey", deskName: "여정", icon: "📅", title: "Journey",
    width: 680, height: 500, component: JourneyApp, pose: "book", dock: true, desktop: true,
  },
  monitor: {
    id: "monitor", name: "Activity Monitor", icon: "📊", title: "ZUN Activity Monitor",
    width: 620, height: 460, component: ActivityMonitor, pose: "think", dock: true,
  },
  notes: {
    id: "notes", name: "Notes", icon: "📝", title: "Notes — BUILD / FAIL / LEARN",
    width: 560, height: 470, component: NotesApp, pose: "write", dock: true,
  },
  music: {
    id: "music", name: "ZUN Radio", icon: "🎵", title: "ZUN Radio",
    width: 380, height: 430, component: MusicApp, pose: "headphones", dock: true,
  },
  playground: {
    id: "playground", name: "ZUN Playground", deskName: "플레이그라운드", icon: "🎮", title: "ZUN Playground — TERMINAL CITY",
    width: 900, height: 560, minWidth: 420, minHeight: 320,
    component: PlaygroundApp, pose: "experiment", dock: true, desktop: true,
  },
  settings: {
    id: "settings", name: "System Settings", deskName: "설정", icon: "⚙️", title: "System Settings",
    width: 600, height: 470, component: SettingsApp, pose: "ok", dock: true, desktop: true,
  },
  trash: {
    id: "trash", name: "Trash", icon: "🗑️", title: "Trash — 배포되지 않은 것들",
    width: 560, height: 420, component: TrashApp, pose: "surprise",
  },
};

export const DOCK_ORDER: AppId[] = [
  "finder", "about", "projects", "terminal", "safari",
  "photos", "journey", "monitor", "notes", "music", "playground", "settings",
];

export const DESKTOP_ORDER: AppId[] = ["finder", "about", "projects", "journey", "photos", "terminal", "playground", "settings"];

export const appList = Object.values(APPS);
