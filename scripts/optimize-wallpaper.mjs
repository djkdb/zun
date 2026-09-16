#!/usr/bin/env node
/**
 * public/wallpaper.png → public/wallpaper.webp
 *
 * The source is a 1.5 MB PNG. A desktop wallpaper is the very first thing
 * painted, so it ships as WebP instead: same picture, a fraction of the bytes.
 * Runs from `prebuild` and skips when the webp is already newer than the png.
 */
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("public/wallpaper.png");
const OUT = path.resolve("public/wallpaper.webp");
const MAX_WIDTH = 1920;

if (!existsSync(SRC)) {
  console.log("[wallpaper] public/wallpaper.png 없음 — 건너뜀");
  process.exit(0);
}
if (existsSync(OUT) && statSync(OUT).mtimeMs >= statSync(SRC).mtimeMs) {
  console.log("[wallpaper] 최신 상태 — 건너뜀");
  process.exit(0);
}

const img = sharp(SRC);
const { width = 0, height = 0 } = await img.metadata();
await img
  .resize({ width: Math.min(width, MAX_WIDTH), withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile(OUT);

const kb = (p) => (statSync(p).size / 1024).toFixed(0);
console.log(`[wallpaper] ${width}×${height} png ${kb(SRC)}kB → webp ${kb(OUT)}kB`);
