import { PALETTE } from "./palette";

/**
 * Convert a character grid to SVG path data grouped by colour.
 * Horizontal runs are merged so the output stays tiny.
 */
export function gridToPaths(
  rows: string[],
  opts: { rowOffset?: number } = {},
): { color: string; d: string }[] {
  const off = opts.rowOffset ?? 0;
  const byColor = new Map<string, string[]>();
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === "." || ch === " " || !PALETTE[ch]) {
        x++;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w++;
      const list = byColor.get(ch) ?? [];
      list.push(`M${x} ${y + off}h${w}v1h-${w}z`);
      byColor.set(ch, list);
      x += w;
    }
  });
  return Array.from(byColor.entries()).map(([ch, parts]) => ({
    color: PALETTE[ch],
    d: parts.join(""),
  }));
}

/** Composite layers: later layers overwrite earlier ones (non-transparent cells only). */
export type Layer = string[] | { rows: string[]; y: number } | undefined;

export function composite(width: number, height: number, layers: Layer[]): string[] {
  const out = Array.from({ length: height }, () => Array.from({ length: width }, () => "."));
  for (const layer of layers) {
    if (!layer) continue;
    const rows = Array.isArray(layer) ? layer : layer.rows;
    const dy = Array.isArray(layer) ? 0 : layer.y;
    rows.forEach((row, ry) => {
      const y = ry + dy;
      if (y >= height || y < 0) return;
      for (let x = 0; x < Math.min(row.length, width); x++) {
        const ch = row[x];
        if (ch !== "." && ch !== " ") out[y][x] = ch;
      }
    });
  }
  return out.map((r) => r.join(""));
}
