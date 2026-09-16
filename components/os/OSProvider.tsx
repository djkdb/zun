"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState,
} from "react";
import { APPS } from "./registry";
import type { AppId, Appearance, OSNotification, OSSettings, WindowState } from "./types";

/* ───────────────────────── desktop element ─────────────────────────
   There is exactly one desktop shell. Holding its element in a module
   binding (rather than a ref inside the context value) keeps `useOS()`
   free of ref-typed members, so reading os.windows during render is not
   mistaken for a ref access. */

let desktopEl: HTMLDivElement | null = null;
export const setDesktopEl = (el: HTMLDivElement | null) => { desktopEl = el; };
export const desktopBounds = () => desktopEl?.getBoundingClientRect() ?? null;

/* ───────────────────────── persistence ───────────────────────── */

const KEY = "zunos.v1";

function load<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${KEY}.${k}`);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}
function save(k: string, v: unknown) {
  try {
    localStorage.setItem(`${KEY}.${k}`, JSON.stringify(v));
  } catch {
    /* private mode / blocked storage — the OS still works, it just forgets */
  }
}

/* ───────────────────────── window reducer ───────────────────────── */

interface WState {
  windows: WindowState[];
  focused: string | null;
  top: number;
  seq: number;
}

type WAction =
  | { type: "open"; appId: AppId; arg?: string; title?: string; bounds: DOMRect | null; narrow: boolean }
  | { type: "close"; id: string }
  | { type: "minimize"; id: string }
  | { type: "zoom"; id: string; bounds: DOMRect | null }
  | { type: "focus"; id: string }
  | { type: "move"; id: string; x: number; y: number }
  | { type: "size"; id: string; x: number; y: number; width: number; height: number }
  | { type: "closeAll" }
  | { type: "hydrate"; windows: WindowState[]; top: number; seq: number };

const MENU_H = 30;
const DOCK_H = 86;

function placement(appId: AppId, n: number, bounds: DOMRect | null, narrow: boolean) {
  const app = APPS[appId];
  const vw = bounds?.width ?? 1280;
  const vh = bounds?.height ?? 800;
  if (narrow) {
    return { x: 0, y: MENU_H, width: vw, height: Math.max(240, vh - MENU_H - 62) };
  }
  const width = Math.min(app.width, vw - 64);
  const height = Math.min(app.height, vh - MENU_H - DOCK_H - 24);
  const step = (n % 7) * 30;
  return {
    x: Math.max(16, Math.round((vw - width) / 2 - 110 + step)),
    y: Math.max(MENU_H + 8, Math.round((vh - height) / 2 - 40 + step)),
    width,
    height,
  };
}

function reducer(s: WState, a: WAction): WState {
  switch (a.type) {
    case "hydrate":
      return { ...s, windows: a.windows, top: a.top, seq: a.seq };

    case "open": {
      const existing = s.windows.find((w) => w.appId === a.appId && w.arg === a.arg);
      if (existing) {
        const top = s.top + 1;
        return {
          ...s,
          focused: existing.id,
          top,
          windows: s.windows.map((w) =>
            w.id === existing.id ? { ...w, isMinimized: false, zIndex: top } : w,
          ),
        };
      }
      const top = s.top + 1;
      const id = `${a.appId}-${s.seq}`;
      const frame = placement(a.appId, s.windows.length, a.bounds, a.narrow);
      const win: WindowState = {
        id,
        appId: a.appId,
        title: a.title ?? APPS[a.appId].title,
        arg: a.arg,
        ...frame,
        zIndex: top,
        isMinimized: false,
        isMaximized: a.narrow,
      };
      return { ...s, windows: [...s.windows, win], focused: id, top, seq: s.seq + 1 };
    }

    case "close": {
      const windows = s.windows.filter((w) => w.id !== a.id);
      const focused =
        s.focused === a.id
          ? [...windows].filter((w) => !w.isMinimized).sort((x, y) => y.zIndex - x.zIndex)[0]?.id ?? null
          : s.focused;
      return { ...s, windows, focused };
    }

    case "closeAll":
      return { ...s, windows: [], focused: null };

    case "minimize":
      return {
        ...s,
        focused: s.focused === a.id ? null : s.focused,
        windows: s.windows.map((w) => (w.id === a.id ? { ...w, isMinimized: true } : w)),
      };

    case "zoom": {
      const vw = a.bounds?.width ?? 1280;
      const vh = a.bounds?.height ?? 800;
      return {
        ...s,
        windows: s.windows.map((w) => {
          if (w.id !== a.id) return w;
          if (w.isMaximized && w.restore) {
            return { ...w, ...w.restore, isMaximized: false, restore: undefined };
          }
          return {
            ...w,
            restore: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 8,
            y: MENU_H + 4,
            width: vw - 16,
            height: vh - MENU_H - DOCK_H - 4,
            isMaximized: true,
          };
        }),
      };
    }

    case "focus": {
      if (s.focused === a.id && !s.windows.find((w) => w.id === a.id)?.isMinimized) return s;
      const top = s.top + 1;
      return {
        ...s,
        focused: a.id,
        top,
        windows: s.windows.map((w) =>
          w.id === a.id ? { ...w, zIndex: top, isMinimized: false } : w,
        ),
      };
    }

    case "move":
      return {
        ...s,
        windows: s.windows.map((w) => (w.id === a.id ? { ...w, x: a.x, y: a.y } : w)),
      };

    case "size":
      return {
        ...s,
        windows: s.windows.map((w) =>
          w.id === a.id ? { ...w, x: a.x, y: a.y, width: a.width, height: a.height } : w,
        ),
      };
  }
}

/* ───────────────────────── context ───────────────────────── */

interface OSContext {
  windows: WindowState[];
  focused: string | null;
  focusedApp: AppId | null;
  narrow: boolean;
  reduce: boolean;

  openApp: (appId: AppId, opts?: { arg?: string; title?: string }) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  zoomWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  sizeWindow: (id: string, x: number, y: number, w: number, h: number) => void;
  closeAll: () => void;

  settings: OSSettings;
  setAppearance: (a: Appearance) => void;
  setWallpaper: (n: number) => void;
  setMotion: (on: boolean) => void;
  setSound: (on: boolean) => void;

  notifications: OSNotification[];
  notify: (icon: string, title: string, body: string) => void;
  dismiss: (id: number) => void;

  spotlight: boolean;
  setSpotlight: (on: boolean) => void;

  power: "on" | "restarting" | "off";
  setPower: (p: "on" | "restarting" | "off") => void;

  beep: (kind?: "open" | "close" | "error") => void;
}

const Ctx = createContext<OSContext | null>(null);

export function useOS() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useOS must be used inside <OSProvider>");
  return v;
}

const DEFAULT_SETTINGS: OSSettings = { appearance: "dark", wallpaper: 1, motion: true, sound: false };

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], focused: null, top: 100, seq: 1 });
  const [settings, setSettings] = useState<OSSettings>(DEFAULT_SETTINGS);
  const [notifications, setNotifications] = useState<OSNotification[]>([]);
  const [spotlight, setSpotlight] = useState(false);
  const [power, setPower] = useState<"on" | "restarting" | "off">("on");
  const [narrow, setNarrow] = useState(false);
  const [systemReduce, setSystemReduce] = useState(false);
  const notifId = useRef(1);

  /* environment */
  useEffect(() => {
    const mqNarrow = window.matchMedia("(max-width: 760px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setNarrow(mqNarrow.matches);
      setSystemReduce(mqMotion.matches);
    };
    sync();
    mqNarrow.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mqNarrow.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  /* settings: load once on the client so SSR markup never differs.
     The DOM is updated immediately (external system); React state follows on a
     microtask so the effect body never sets state synchronously. */
  useEffect(() => {
    const stored = { ...DEFAULT_SETTINGS, ...load<Partial<OSSettings>>("settings", {}) };
    document.documentElement.dataset.appearance = stored.appearance;
    document.documentElement.dataset.wallpaper = String(stored.wallpaper);
    queueMicrotask(() => setSettings(stored));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.appearance = settings.appearance;
    document.documentElement.dataset.wallpaper = String(settings.wallpaper);
  }, [settings.appearance, settings.wallpaper]);

  const reduce = systemReduce || !settings.motion;

  const patchSettings = useCallback((patch: Partial<OSSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      save("settings", next);
      return next;
    });
  }, []);

  /* sound — tiny synthesised blips, off by default, never autoplayed */
  const audio = useRef<AudioContext | null>(null);
  const beep = useCallback(
    (kind: "open" | "close" | "error" = "open") => {
      if (!settings.sound) return;
      try {
        audio.current ??= new AudioContext();
        const ctx = audio.current;
        if (ctx.state === "suspended") void ctx.resume();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = kind === "error" ? "sawtooth" : "sine";
        o.frequency.value = kind === "open" ? 660 : kind === "close" ? 420 : 180;
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.15);
      } catch {
        /* audio unavailable — silent is fine */
      }
    },
    [settings.sound],
  );

  /* notifications */
  const notify = useCallback((icon: string, title: string, body: string) => {
    const id = notifId.current++;
    setNotifications((n) => [...n.slice(-3), { id, icon, title, body }]);
    window.setTimeout(() => setNotifications((n) => n.filter((x) => x.id !== id)), 5200);
  }, []);
  const dismiss = useCallback((id: number) => {
    setNotifications((n) => n.filter((x) => x.id !== id));
  }, []);

  /* window actions */

  const openApp = useCallback(
    (appId: AppId, opts?: { arg?: string; title?: string }) => {
      dispatch({ type: "open", appId, arg: opts?.arg, title: opts?.title, bounds: desktopBounds(), narrow });
      beep("open");
    },
    [narrow, beep],
  );

  const closeWindow = useCallback((id: string) => { dispatch({ type: "close", id }); beep("close"); }, [beep]);
  const minimizeWindow = useCallback((id: string) => dispatch({ type: "minimize", id }), []);
  const zoomWindow = useCallback((id: string) => dispatch({ type: "zoom", id, bounds: desktopBounds() }), []);
  const focusWindow = useCallback((id: string) => dispatch({ type: "focus", id }), []);
  const moveWindow = useCallback((id: string, x: number, y: number) => dispatch({ type: "move", id, x, y }), []);
  const sizeWindow = useCallback(
    (id: string, x: number, y: number, width: number, height: number) =>
      dispatch({ type: "size", id, x, y, width, height }),
    [],
  );
  const closeAll = useCallback(() => dispatch({ type: "closeAll" }), []);

  /* persist window frames (not which windows are open — a fresh visit boots clean) */
  useEffect(() => {
    if (!state.windows.length) return;
    const frames: Record<string, { x: number; y: number; width: number; height: number }> = {};
    for (const w of state.windows) frames[w.appId] = { x: w.x, y: w.y, width: w.width, height: w.height };
    save("frames", frames);
  }, [state.windows]);

  const focusedApp = useMemo(
    () => state.windows.find((w) => w.id === state.focused)?.appId ?? null,
    [state.windows, state.focused],
  );

  const value: OSContext = {
    windows: state.windows,
    focused: state.focused,
    focusedApp,
    narrow,
    reduce,
    openApp,
    closeWindow,
    minimizeWindow,
    zoomWindow,
    focusWindow,
    moveWindow,
    sizeWindow,
    closeAll,
    settings,
    setAppearance: (a) => patchSettings({ appearance: a }),
    setWallpaper: (n) => patchSettings({ wallpaper: n }),
    setMotion: (on) => patchSettings({ motion: on }),
    setSound: (on) => patchSettings({ sound: on }),
    notifications,
    notify,
    dismiss,
    spotlight,
    setSpotlight,
    power,
    setPower,
    beep,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
