#!/usr/bin/env node
/**
 * Split the official ZUN character sheet into 32 pose PNGs.
 *
 *   node scripts/split-character-sheet.mjs [sheet.png] [--if-present]
 *
 * Expects 8 columns × 4 rows (poses 01–32, row-major). Steps:
 *   1. remove a baked-in checkerboard background (flood fill from the sheet edges),
 *   2. find the real row/column boundaries (the emptiest line near each grid line —
 *      the sheet is not a perfectly uniform grid),
 *   3. per cell: drop fragments bleeding in from neighbours (small blobs touching the
 *      cell edge), erase the "01".."32" caption blob, trim transparent margins,
 *   4. write public/character/poses/NN.png and regenerate data/character-manifest.ts.
 *
 * `--if-present` exits quietly when the sheet is missing (used by `prebuild`).
 */
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const COLS = 8, ROWS = 4;
const args = process.argv.slice(2);
const quiet = args.includes("--if-present");
const src = resolve(args.find((a) => !a.startsWith("--")) ?? "public/character/zun-sheet.png");
const outDir = resolve("public/character/poses");

if (!existsSync(src)) {
  if (quiet) {
    console.log("character: no sheet at public/character/zun-sheet.png — keeping the SVG fallback");
    process.exit(0);
  }
  console.error(`Sheet not found: ${src}\nPut the sheet at public/character/zun-sheet.png and re-run.`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const A = (x, y) => data[(y * W + x) * 4 + 3];
const RGB = (x, y) => { const i = (y * W + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
console.log(`sheet ${W}×${H}`);

// ── 1. background ───────────────────────────────────────────────────────────
const isChecker = (r, g, b) => r > 185 && g > 185 && b > 185 && Math.abs(r - g) < 14 && Math.abs(g - b) < 14 && Math.abs(r - b) < 14;
const corners = [[2, 2], [W - 3, 2], [2, H - 3], [W - 3, H - 3]];
const baked = corners.every(([x, y]) => A(x, y) > 250 && isChecker(...RGB(x, y)));
if (baked) {
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, 0, x, H - 1);
  for (let y = 0; y < H; y++) stack.push(0, y, W - 1, y);
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const k = y * W + x;
    if (seen[k]) continue;
    seen[k] = 1;
    const i = k * 4;
    if (!(data[i + 3] === 0 || isChecker(data[i], data[i + 1], data[i + 2]))) continue;
    data[i + 3] = 0;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
  console.log("baked checkerboard removed");
} else {
  console.log("transparent background detected");
}

// ── 2. grid boundaries ──────────────────────────────────────────────────────
const colCount = new Uint32Array(W), rowCount = new Uint32Array(H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (A(x, y) > 0) { colCount[x]++; rowCount[y]++; }
const emptiest = (counts, around, win) => {
  let best = around, bestV = Infinity;
  for (let i = Math.max(1, around - win); i < Math.min(counts.length - 1, around + win); i++) {
    if (counts[i] < bestV) { bestV = counts[i]; best = i; }
  }
  return best;
};
const xs = [0, ...Array.from({ length: COLS - 1 }, (_, k) => emptiest(colCount, Math.round(((k + 1) * W) / COLS), 40)), W];
const ys = [0, ...Array.from({ length: ROWS - 1 }, (_, k) => emptiest(rowCount, Math.round(((k + 1) * H) / ROWS), 70)), H];
console.log("columns:", xs.join(" "), "\nrows:   ", ys.join(" "));

// ── 3. components → cells ───────────────────────────────────────────────────
// Every connected blob of opaque pixels belongs to the cell that contains its
// centroid. Props that straddle a grid line (a "?" next to the head, a whiteboard)
// therefore stay whole instead of being sliced at the cell edge.
const seen = new Uint8Array(W * H);
const comps = [];
for (let sy = 0; sy < H; sy++) for (let sx = 0; sx < W; sx++) {
  const k0 = sy * W + sx;
  if (seen[k0] || data[k0 * 4 + 3] === 0) continue;
  const px = []; const stack = [sx, sy];
  let minX = sx, maxX = sx, minY = sy, maxY = sy, sumX = 0, sumY = 0;
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const k = y * W + x;
    if (seen[k] || data[k * 4 + 3] === 0) continue;
    seen[k] = 1; px.push(k); sumX += x; sumY += y;
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1, x + 1, y + 1, x - 1, y - 1, x + 1, y - 1, x - 1, y + 1);
  }
  if (px.length < 4) continue; // isolated specks
  comps.push({ px, minX, maxX, minY, maxY, area: px.length, cx: sumX / px.length, cy: sumY / px.length });
}
const cellOf = (v, bounds) => { let i = 0; while (i < bounds.length - 2 && v >= bounds[i + 1]) i++; return i; };
const cells = Array.from({ length: COLS * ROWS }, () => []);
for (const c of comps) {
  const col = cellOf(c.cx, xs), row = cellOf(c.cy, ys);
  const x0 = xs[col], y0 = ys[row], cw = xs[col + 1] - x0;
  // caption "01".."32": digit-sized blobs (measured: 8–15px wide, 19–20px tall, or ~30px
  // wide when the two digits touch) sitting 23–30px below the cell top in its left half.
  const bw = c.maxX - c.minX + 1, bh = c.maxY - c.minY + 1, relX = c.minX - x0, relY = c.minY - y0;
  const caption = c.area >= 60 && c.area <= 450 && bh >= 14 && bh <= 24 && bw <= 34 && relX >= 0 && relX < cw * 0.5 && relY >= 15 && relY <= 40;
  if (!caption) cells[row * COLS + col].push(c);
}

const manifest = {};
for (let n = 1; n <= COLS * ROWS; n++) {
  const id = String(n).padStart(2, "0");
  const list = cells[n - 1];
  const minX = Math.min(...list.map((c) => c.minX)), maxX = Math.max(...list.map((c) => c.maxX));
  const minY = Math.min(...list.map((c) => c.minY)), maxY = Math.max(...list.map((c) => c.maxY));
  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  const cell = Buffer.alloc(cw * ch * 4);
  for (const c of list) for (const k of c.px) {
    const x = (k % W) - minX, y = Math.floor(k / W) - minY;
    const si = k * 4, di = (y * cw + x) * 4;
    cell[di] = data[si]; cell[di + 1] = data[si + 1]; cell[di + 2] = data[si + 2]; cell[di + 3] = data[si + 3];
  }
  const out = await sharp(cell, { raw: { width: cw, height: ch, channels: 4 } }).png().toBuffer();
  writeFileSync(resolve(outDir, `${id}.png`), out);
  manifest[id] = { w: cw, h: ch };
  process.stdout.write(`${id} ${cw}×${ch}  `);
  if (n % COLS === 0) process.stdout.write("\n");
}

// ── 4. manifest ─────────────────────────────────────────────────────────────
const ts = `/**
 * GENERATED by scripts/split-character-sheet.mjs — do not edit by hand.
 * available=true switches ZunCharacter from the SVG fallback to /character/poses/NN.png
 */
export const characterManifest = {
  available: true,
  cells: ${JSON.stringify(manifest, null, 2)} as Record<string, { w: number; h: number }>,
} as const;
`;
writeFileSync(resolve("data/character-manifest.ts"), ts);
console.log("\nwrote data/character-manifest.ts (available: true)");
