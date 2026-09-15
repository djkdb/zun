"use client";

import { useRef } from "react";
import type { PoseName } from "@/data/types";
import { SHEET_CELLS } from "@/data/character";
import { characterManifest } from "@/data/character-manifest";
import { cn } from "@/lib/utils";
import { useFinePointer, useLookAt, usePrefersReducedMotion } from "@/lib/hooks";

export interface SheetCharacterProps {
  pose: PoseName;
  size?: number;
  sizeClass?: string;
  followPointer?: boolean;
  idle?: boolean;
  shadow?: boolean;
  label?: string;
  flip?: boolean;
  className?: string;
}

/**
 * Renders one cell of the official ZUN sheet (public/character/poses/NN.png).
 * Pointer-following is a tiny lean toward the cursor (the art has no separate eye layer).
 */
export function SheetCharacter({ pose, size = 120, sizeClass, followPointer, idle = true, shadow = true, label, flip, className }: SheetCharacterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const fine = useFinePointer();
  const look = useLookAt(ref, !!followPointer && fine && !reduce);
  const cell = SHEET_CELLS[pose]?.cell ?? "01";
  const dims = characterManifest.cells[cell] ?? { w: 192, h: 256 };
  const ratio = dims.h / dims.w;
  const w = size;
  const h = Math.round(size * ratio);

  return (
    <div ref={ref} className={cn("relative inline-flex flex-col items-center", sizeClass, className)} data-pose={pose} data-cell={cell}>
      <div
        className={cn(!reduce && idle && "anim-idle-bob", "will-change-transform", sizeClass && "w-full")}
        style={{
          transform: followPointer && !reduce ? `translate(${look.x * 2}px, ${look.y}px)` : undefined,
          transition: "transform 160ms steps(2, end)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- pixel art must not be resampled; sizes are known */}
        <img
          src={`/character/poses/${cell}.png`}
          alt={label ?? ""}
          aria-hidden={label ? undefined : true}
          width={dims.w}
          height={dims.h}
          decoding="async"
          loading="lazy"
          className="block pixelated select-none"
          draggable={false}
          style={sizeClass ? { width: "100%", height: "auto", transform: flip ? "scaleX(-1)" : undefined } : { width: w, height: h, transform: flip ? "scaleX(-1)" : undefined }}
        />
      </div>
      {shadow && (
        <div
          aria-hidden
          className={cn("mt-1 rounded-full bg-black/50 blur-[2px]", !reduce && idle && "anim-shadow")}
          style={sizeClass ? { width: "55%", height: 6 } : { width: size * 0.55, height: Math.max(4, size * 0.05) }}
        />
      )}
    </div>
  );
}
