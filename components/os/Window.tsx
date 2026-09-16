"use client";

import { motion } from "framer-motion";
import { useCallback, useRef } from "react";
import { APPS } from "./registry";
import { desktopBounds, useOS } from "./OSProvider";
import type { WindowState } from "./types";

const EDGES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;
type Edge = (typeof EDGES)[number];

const CURSOR: Record<Edge, string> = {
  n: "cursor-ns-resize", s: "cursor-ns-resize", e: "cursor-ew-resize", w: "cursor-ew-resize",
  ne: "cursor-nesw-resize", sw: "cursor-nesw-resize", nw: "cursor-nwse-resize", se: "cursor-nwse-resize",
};
const EDGE_BOX: Record<Edge, string> = {
  n: "left-2 right-2 -top-1 h-2", s: "left-2 right-2 -bottom-1 h-2",
  e: "top-2 bottom-2 -right-1 w-2", w: "top-2 bottom-2 -left-1 w-2",
  ne: "-top-1 -right-1 h-4 w-4", nw: "-top-1 -left-1 h-4 w-4",
  se: "-bottom-1 -right-1 h-4 w-4", sw: "-bottom-1 -left-1 h-4 w-4",
};

const MENU_H = 30;

export function Window({ win }: { win: WindowState }) {
  const {
    focused, focusWindow, closeWindow, minimizeWindow, zoomWindow,
    moveWindow, sizeWindow, narrow, reduce,
  } = useOS();
  const app = APPS[win.appId];
  const Content = app.component;
  const isFocused = focused === win.id;
  const titleRef = useRef<HTMLDivElement>(null);

  /* ---- drag ---- */
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const onTitleDown = useCallback(
    (e: React.PointerEvent) => {
      if (narrow || win.isMaximized) return;
      if ((e.target as HTMLElement).closest("button")) return;
      drag.current = { sx: e.clientX, sy: e.clientY, ox: win.x, oy: win.y };
      titleRef.current?.setPointerCapture(e.pointerId);
    },
    [narrow, win.isMaximized, win.x, win.y],
  );
  const onTitleMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const b = desktopBounds();
      const vw = b?.width ?? window.innerWidth;
      const vh = b?.height ?? window.innerHeight;
      const x = Math.min(vw - 90, Math.max(90 - win.width, d.ox + e.clientX - d.sx));
      const y = Math.min(vh - 44, Math.max(MENU_H, d.oy + e.clientY - d.sy));
      moveWindow(win.id, x, y);
    },
    [moveWindow, win.id, win.width],
  );
  const endDrag = useCallback((e: React.PointerEvent) => {
    drag.current = null;
    try { titleRef.current?.releasePointerCapture(e.pointerId); } catch { /* pointer already released */ }
  }, []);

  /* ---- resize ---- */
  const rz = useRef<{ edge: Edge; sx: number; sy: number; x: number; y: number; w: number; h: number } | null>(null);
  const minW = app.minWidth ?? 340;
  const minH = app.minHeight ?? 220;

  const onEdgeDown = (edge: Edge) => (e: React.PointerEvent) => {
    e.stopPropagation();
    focusWindow(win.id);
    rz.current = { edge, sx: e.clientX, sy: e.clientY, x: win.x, y: win.y, w: win.width, h: win.height };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onEdgeMove = (e: React.PointerEvent) => {
    const r = rz.current;
    if (!r) return;
    const dx = e.clientX - r.sx;
    const dy = e.clientY - r.sy;
    let { x, y, w, h } = { x: r.x, y: r.y, w: r.w, h: r.h };
    if (r.edge.includes("e")) w = Math.max(minW, r.w + dx);
    if (r.edge.includes("s")) h = Math.max(minH, r.h + dy);
    if (r.edge.includes("w")) { w = Math.max(minW, r.w - dx); x = r.x + r.w - w; }
    if (r.edge.includes("n")) { h = Math.max(minH, r.h - dy); y = Math.max(MENU_H, r.y + r.h - h); }
    sizeWindow(win.id, x, y, w, h);
  };
  const onEdgeUp = (e: React.PointerEvent) => {
    rz.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* already released */ }
  };

  const spring = reduce
    ? { duration: 0.001 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };

  return (
    <motion.section
      role="dialog"
      aria-label={win.title}
      aria-modal={false}
      initial={reduce ? false : { opacity: 0, scale: 0.94, y: 12 }}
      animate={
        win.isMinimized
          ? { opacity: 0, scale: 0.22, y: 420, pointerEvents: "none" as const }
          : { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" as const }
      }
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
      transition={spring}
      style={{ left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }}
      className={`absolute flex flex-col overflow-hidden border shadow-[0_28px_70px_-18px_rgba(0,0,0,.75)] backdrop-blur-2xl ${
        narrow ? "rounded-none border-x-0" : "rounded-xl"
      } ${isFocused ? "border-line-strong bg-bg-2/85" : "border-line bg-bg-1/80"}`}
      onPointerDown={() => focusWindow(win.id)}
    >
      {/* title bar */}
      <div
        ref={titleRef}
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => !narrow && zoomWindow(win.id)}
        className={`group flex h-9 flex-none select-none items-center gap-2 border-b border-line px-3 ${
          isFocused ? "bg-bg-3/70" : "bg-bg-2/60"
        } ${narrow || win.isMaximized ? "" : "cursor-grab active:cursor-grabbing"}`}
      >
        <div className="flex flex-none items-center gap-2">
          <TrafficLight kind="close" active={isFocused} onClick={() => closeWindow(win.id)} />
          <TrafficLight kind="min" active={isFocused} onClick={() => minimizeWindow(win.id)} />
          <TrafficLight kind="zoom" active={isFocused} onClick={() => zoomWindow(win.id)} disabled={narrow} />
        </div>
        <p className="pointer-events-none flex-1 truncate text-center font-mono text-[11.5px] tracking-tight text-fg-muted">
          {win.title}
        </p>
        <div className="w-14 flex-none" aria-hidden />
      </div>

      {/* content */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Content win={win} />
      </div>

      {/* resize handles */}
      {!narrow && !win.isMaximized &&
        EDGES.map((edge) => (
          <div
            key={edge}
            role="presentation"
            onPointerDown={onEdgeDown(edge)}
            onPointerMove={onEdgeMove}
            onPointerUp={onEdgeUp}
            onPointerCancel={onEdgeUp}
            className={`absolute z-10 ${EDGE_BOX[edge]} ${CURSOR[edge]}`}
          />
        ))}
    </motion.section>
  );
}

const LIGHT = {
  close: { color: "bg-[#ff5f57]", glyph: "×", label: "닫기" },
  min: { color: "bg-[#febc2e]", glyph: "−", label: "최소화" },
  zoom: { color: "bg-[#28c840]", glyph: "+", label: "확대/축소" },
} as const;

function TrafficLight({
  kind, active, onClick, disabled,
}: {
  kind: keyof typeof LIGHT; active: boolean; onClick: () => void; disabled?: boolean;
}) {
  const l = LIGHT[kind];
  return (
    <button
      type="button"
      aria-label={l.label}
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`grid h-3 w-3 place-items-center rounded-full text-[8px] font-bold leading-none text-black/55 transition-colors disabled:opacity-40 ${
        active ? l.color : "bg-[#5b6478]"
      }`}
    >
      <span className="opacity-0 transition-opacity group-hover:opacity-100">{l.glyph}</span>
    </button>
  );
}
