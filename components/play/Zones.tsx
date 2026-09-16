"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { car } from "./store";
import { zoneAt } from "./zones";

/**
 * Detects which highlighted line the car is parked on and reports it upward.
 * The lines themselves are painted into the floor texture, so this renders
 * nothing — it is a frame loop, not geometry.
 */
export function Zones({ onEnter }: { onEnter: (id: string | null) => void }) {
  const current = useRef<string | null>(null);

  useFrame(() => {
    const hit = zoneAt(car.position.x, car.position.z)?.id ?? null;
    if (hit !== current.current) {
      current.current = hit;
      onEnter(hit);
    }
  });

  // zone lines are painted into the floor texture; this component only watches
  // which one the car is standing on.
  return null;
}
