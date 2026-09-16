import { colX, lineZ, ZONE_LINES } from "./code";

/** where the waiting ZUN stands: past the end of every zone comment */
export const SPRITE_COL = 44;

export interface Zone {
  id: string;
  label: string;
  /** centre of the highlighted code line */
  x: number;
  z: number;
  /** half-extents of the lane patch the car has to be inside */
  halfW: number;
  halfZ: number;
  href: string;
  color: string;
  /** the editor line it lives on, for the HUD */
  line: number;
}

const zone = (
  id: string,
  label: string,
  key: keyof typeof ZONE_LINES,
  centreCol: number,
  halfCols: number,
  color: string,
): Zone => ({
  id,
  label,
  x: colX(centreCol),
  z: lineZ(ZONE_LINES[key]),
  halfW: halfCols * 1.02,
  halfZ: 1.7,
  href: `/#${id}`,
  color,
  line: ZONE_LINES[key] + 1,
});

/** Four highlighted lines in the editor floor. Drive onto one to run it. */
export const ZONES: Zone[] = [
  zone("about", "ABOUT", "about", 18, 19, "#60a5fa"),
  zone("projects", "PROJECTS", "projects", 21, 22, "#fbbf24"),
  zone("content", "CONTENT", "content", 23, 24, "#f472b6"),
  zone("contact", "CONTACT", "contact", 22, 23, "#34d399"),
];

export function zoneAt(x: number, z: number): Zone | null {
  for (const zn of ZONES) {
    if (Math.abs(x - zn.x) < zn.halfW && Math.abs(z - zn.z) < zn.halfZ) return zn;
  }
  return null;
}
