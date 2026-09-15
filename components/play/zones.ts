import type { PoseName } from "@/data/types";

export interface Zone {
  id: string;
  label: string;
  /** world position of the zone plate (x, z) */
  x: number;
  z: number;
  radius: number;
  pose: PoseName;
  /** section id on the main page */
  href: string;
  color: string;
}

/**
 * Drive-in zones. Each has a floor plate, a floating label and a ZUN sprite waiting
 * beside it; entering the radius opens the matching info card.
 */
export const ZONES: Zone[] = [
  { id: "about", label: "ABOUT", x: -22, z: -6, radius: 5, pose: "think", href: "/#about", color: "#60a5fa" },
  { id: "projects", label: "PROJECTS", x: 22, z: -8, radius: 5, pose: "build", href: "/#projects", color: "#fbbf24" },
  { id: "content", label: "CONTENT", x: -18, z: 22, radius: 5, pose: "phone", href: "/#content", color: "#f472b6" },
  { id: "contact", label: "CONTACT", x: 20, z: 24, radius: 5, pose: "cheers", href: "/#contact", color: "#34d399" },
];

/** Path of white slabs that guides the driver between zones. */
export function pathTiles(): { x: number; z: number; rot: number }[] {
  const tiles: { x: number; z: number; rot: number }[] = [];
  // stop each run short of any zone plate so the plate label stays readable
  const clear = (x: number, z: number) => ZONES.every((zn) => Math.hypot(zn.x - x, zn.z - z) > zn.radius + 0.8);
  const seg = (ax: number, az: number, bx: number, bz: number, n: number) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = ax + (bx - ax) * t, z = az + (bz - az) * t;
      if (!clear(x, z)) continue;
      tiles.push({ x, z, rot: ((i * 37) % 11) * 0.03 - 0.15 });
    }
  };
  seg(0, 6, -22, -6, 9);
  seg(0, 6, 22, -8, 9);
  seg(0, 6, -18, 22, 7);
  seg(0, 6, 20, 24, 8);
  seg(-22, -6, 0, -30, 10);
  seg(22, -8, 0, -30, 10);
  return tiles;
}

/** Cube-canopy trees scattered around the arena, away from the plates. */
export function treePositions(): { x: number; z: number; s: number; seed: number }[] {
  const out: { x: number; z: number; s: number; seed: number }[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2;
    const r = 14 + rnd() * 40;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (ZONES.some((zn) => Math.hypot(zn.x - x, zn.z - z) < zn.radius + 4)) continue;
    if (Math.abs(x) < 12 && z < -18 && z > -40) continue; // keep the billboard clear
    if (Math.abs(x) < 18 && z > 8 && z < 24) continue; // keep "HOW TO PLAY" readable
    if (Math.abs(x) < 8 && z > -16 && z < 10) continue; // spawn lane
    out.push({ x, z, s: 0.8 + rnd() * 0.7, seed: Math.floor(rnd() * 1000) });
  }
  return out;
}
