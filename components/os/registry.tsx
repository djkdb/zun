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
    id: "finder", name: "보관함", deskName: "보관함", icon: "🗂️", title: "보관함 — 전체",
    width: 780, height: 500, component: Finder, dock: true, desktop: true,
    },
  about: {
    id: "about", name: "ZUN에 대하여", deskName: "ZUN", icon: "🪪", title: "ZUN에 대하여",
    width: 620, height: 460, component: About, dock: true, desktop: true,
  },
  projects: {
    id: "projects", name: "만든 것", deskName: "만든 것", icon: "🧰", title: "만든 것",
    width: 720, height: 520, component: ProjectsApp, dock: true, desktop: true,
  },
  terminal: {
    id: "terminal", name: "터미널", deskName: "터미널", icon: "▶️", title: "zun@zun-os — 80×24",
    width: 640, height: 400, component: Terminal, dock: true, desktop: true,
  },
  safari: {
    id: "safari", name: "링크", icon: "🔗", title: "링크",
    width: 600, height: 480, component: Safari, dock: true,
  },
  photos: {
    id: "photos", name: "콘텐츠", deskName: "콘텐츠", icon: "📸", title: "콘텐츠 — @zun_it_",
    width: 640, height: 500, component: Photos, dock: true, desktop: true,
  },
  journey: {
    id: "journey", name: "여정", deskName: "여정", icon: "🧭", title: "여정",
    width: 680, height: 500, component: JourneyApp, dock: true, desktop: true,
  },
  monitor: {
    id: "monitor", name: "활동 감시기", icon: "📊", title: "활동 감시기",
    width: 620, height: 460, component: ActivityMonitor, dock: true,
  },
  notes: {
    id: "notes", name: "기록", icon: "📝", title: "기록 — BUILD / FAIL / LEARN",
    width: 560, height: 470, component: NotesApp, dock: true,
  },
  music: {
    id: "music", name: "라디오", icon: "🎵", title: "ZUN 라디오",
    width: 380, height: 430, component: MusicApp, dock: true,
  },
  playground: {
    id: "playground", name: "놀이터", deskName: "놀이터", icon: "🎮", title: "놀이터 — TERMINAL CITY",
    width: 900, height: 560, minWidth: 420, minHeight: 320,
    component: PlaygroundApp, dock: true, desktop: true,
  },
  settings: {
    id: "settings", name: "설정", deskName: "설정", icon: "⚙️", title: "설정",
    width: 600, height: 470, component: SettingsApp, dock: true, desktop: true,
  },
  trash: {
    id: "trash", name: "무덤", icon: "🪦", title: "무덤 — 배포되지 않은 것들",
    width: 560, height: 420, component: TrashApp,
  },
};

export const DOCK_ORDER: AppId[] = [
  "finder", "about", "projects", "terminal", "safari",
  "photos", "journey", "monitor", "notes", "music", "playground", "settings",
];

export const DESKTOP_ORDER: AppId[] = ["finder", "about", "projects", "journey", "photos", "terminal", "playground", "settings"];

export const appList = Object.values(APPS);
