"use client";

import { useMemo } from "react";
import type { PoseName } from "@/data/types";
import {
  BODY_ROW_OFFSET,
  EYES,
  EYES_ROW_OFFSET,
  HEAD,
  MOUTHS,
  POSES,
  SPRITE_H,
  SPRITE_W,
  type CorePose,
  type PoseFrame,
} from "./poses";
import { SVG_FALLBACK } from "@/data/character";
import { composite, gridToPaths } from "./renderPixels";

export interface PixelSpriteProps {
  pose?: PoseName;
  frame?: number;
  /** override eye state (blink) */
  eyes?: keyof typeof EYES;
  /** pupil offset in pixel units, each in [-1, 1] */
  look?: { x: number; y: number };
  /** rendered width in px (height follows the 24:36 ratio) */
  size?: number;
  className?: string;
  /** decorative by default; pass a label to expose it */
  label?: string;
  flip?: boolean;
  style?: React.CSSProperties;
}

export function resolveSvgPose(pose: PoseName): CorePose {
  if (POSES[pose]) return pose as CorePose;
  return (SVG_FALLBACK[pose] ?? "idle") as CorePose;
}

function frameOf(pose: PoseName, frame: number): PoseFrame {
  const def = POSES[resolveSvgPose(pose)];
  return def.frames[frame % def.frames.length];
}

export function PixelSprite({
  pose = "idle",
  frame = 0,
  eyes,
  look = { x: 0, y: 0 },
  size = 96,
  className,
  label,
  flip = false,
  style,
}: PixelSpriteProps) {
  const f = frameOf(pose, frame);

  const bodyPaths = useMemo(() => {
    const head = HEAD.slice();
    if (f.mouth) head[17] = MOUTHS[f.mouth];
    const grid = composite(SPRITE_W, SPRITE_H, [head, { rows: f.body, y: BODY_ROW_OFFSET }, f.headOverlay]);
    return gridToPaths(grid);
  }, [f]);

  const eyeState = eyes ?? f.eyes ?? "open";
  const eyePaths = useMemo(
    () => gridToPaths(EYES[eyeState], { rowOffset: EYES_ROW_OFFSET }),
    [eyeState],
  );

  // Head overlays (hands, props) must sit above the eyes, so re-draw them on top.
  const overlayPaths = useMemo(
    () => (f.headOverlay ? gridToPaths(f.headOverlay) : []),
    [f.headOverlay],
  );

  const lx = Math.max(-1, Math.min(1, look.x));
  const ly = Math.max(-1, Math.min(1, look.y));

  return (
    <svg
      viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}
      width={size}
      height={(size * SPRITE_H) / SPRITE_W}
      shapeRendering="crispEdges"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {bodyPaths.map((p) => (
        <path key={p.color} d={p.d} fill={p.color} />
      ))}
      <g
        style={{
          transform: `translate(${lx}px, ${ly}px)`,
          transition: "transform 120ms steps(2, end)",
        }}
      >
        {eyePaths.map((p) => (
          <path key={`e-${p.color}`} d={p.d} fill={p.color} />
        ))}
      </g>
      {overlayPaths.map((p) => (
        <path key={`o-${p.color}`} d={p.d} fill={p.color} />
      ))}
    </svg>
  );
}
