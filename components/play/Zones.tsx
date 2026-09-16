"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { car } from "./store";
import { SPRITE_COL, ZONES, zoneAt } from "./zones";
import { ZunSprite } from "./Sprite";
import { colX } from "./code";

/**
 * Detects which highlighted line the car is parked on and reports it upward.
 * Also parks a ZUN sprite at the end of each zone line, waiting to be run.
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

  return (
    <group>
      {ZONES.map((z) => (
        <ZunSprite key={z.id} pose={z.pose} position={[colX(SPRITE_COL), 0, z.z]} height={3.2} />
      ))}
    </group>
  );
}
