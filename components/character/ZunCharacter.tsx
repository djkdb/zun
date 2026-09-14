"use client";

import { useEffect, useRef, useState } from "react";
import type { PoseName } from "@/data/types";
import { cn } from "@/lib/utils";
import { useFinePointer, useLookAt, usePrefersReducedMotion } from "@/lib/hooks";
import { PixelSprite } from "./PixelSprite";
import { POSES } from "./poses";

export interface ZunCharacterProps {
  pose?: PoseName;
  size?: number;
  /** eyes follow the pointer (desktop only) */
  followPointer?: boolean;
  /** subtle idle bob + blinking */
  idle?: boolean;
  /** show a soft ground shadow */
  shadow?: boolean;
  /** accessible label; omit for decorative */
  label?: string;
  flip?: boolean;
  className?: string;
  /**
   * Responsive sizing: Tailwind width classes for the wrapper (e.g. "w-28 md:w-44").
   * When set, `size` is ignored and the sprite fills the wrapper width.
   */
  sizeClass?: string;
}

/**
 * ZUN — the guide character. Wraps PixelSprite with life: blinking, an idle bob,
 * pointer-following eyes and frame animation for animated poses (walk).
 * Everything decorative is disabled under prefers-reduced-motion.
 */
export function ZunCharacter({
  pose = "idle",
  size = 120,
  followPointer = false,
  idle = true,
  shadow = true,
  label,
  flip,
  className,
  sizeClass,
}: ZunCharacterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const fine = useFinePointer();
  const look = useLookAt(ref, followPointer && fine && !reduce);

  // blink
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (reduce || !idle) return;
    let t1: number, t2: number;
    const schedule = () => {
      t1 = window.setTimeout(() => {
        setBlink(true);
        t2 = window.setTimeout(() => {
          setBlink(false);
          schedule();
        }, 130);
      }, 2600 + Math.random() * 3200);
    };
    schedule();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce, idle]);

  // frame animation (e.g. walk)
  const def = POSES[pose];
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (reduce || !def.frameMs || def.frames.length < 2) return;
    const id = window.setInterval(() => setFrame((f) => f + 1), def.frameMs);
    return () => clearInterval(id);
  }, [pose, reduce, def]);

  const frameEyes = def.frames[frame % def.frames.length].eyes;
  const eyes = blink && (frameEyes === undefined || frameEyes === "open") ? "closed" : undefined;

  return (
    <div
      ref={ref}
      className={cn("relative inline-flex flex-col items-center", sizeClass, className)}
      data-pose={pose}
    >
      <div className={cn(!reduce && idle && "anim-idle-bob", "will-change-transform", sizeClass && "w-full")}>
        <PixelSprite
          pose={pose}
          frame={frame}
          eyes={eyes}
          look={look}
          size={size}
          label={label}
          flip={flip}
          className="block pixelated"
          style={sizeClass ? { width: "100%", height: "auto" } : undefined}
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
