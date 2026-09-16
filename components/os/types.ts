import type { ComponentType } from "react";
import type { PoseName } from "@/data/types";

/** One open window. Position/size are in CSS px relative to the desktop. */
export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  /** free-form payload an app uses to open on a specific item */
  arg?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  /** saved frame while maximised, restored by zoom() */
  restore?: { x: number; y: number; width: number; height: number };
}

export type AppId =
  | "finder"
  | "about"
  | "projects"
  | "terminal"
  | "safari"
  | "photos"
  | "journey"
  | "monitor"
  | "notes"
  | "settings"
  | "music"
  | "trash"
  | "playground";

export interface AppWindowProps {
  /** the window this app instance lives in (apps that ignore it may omit it) */
  win?: WindowState;
}

export interface AppDef {
  id: AppId;
  name: string;
  /** short label under desktop icons; defaults to name */
  deskName?: string;
  icon: string;
  /** default window title; apps may override per-window */
  title: string;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  component: ComponentType<AppWindowProps>;
  /** character pose shown by the guide when this app is focused */
  pose: PoseName;
  /** shown in the Dock, in this order */
  dock?: boolean;
  /** shown on the desktop */
  desktop?: boolean;
  /** menu items for the app menu in the menu bar */
  menu?: { label: string; shortcut?: string; action?: string }[];
}

export interface OSNotification {
  id: number;
  icon: string;
  title: string;
  body: string;
}

export type Appearance = "dark" | "light";

export interface OSSettings {
  appearance: Appearance;
  wallpaper: number;
  motion: boolean;
  sound: boolean;
}
