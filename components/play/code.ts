/**
 * TERMINAL CITY — the floor is one giant code editor.
 *
 * The ground plane is a single 2048² canvas texture mapped onto a 160×160 world
 * square, so a code line is a lane the car drives along. Everything (zones,
 * collectible tokens, bug squiggles) is positioned by line/column, then converted
 * to world coordinates with lineZ()/colX().
 */

export const TEX = 2048;
export const WORLD = 104;
/** texture px → world units */
export const PX = WORLD / TEX;

export const LINE_H = 70; // px
export const TOP = 60; // px before the first line
export const GUTTER = 150; // px, line-number column
export const CODE_X = 210; // px, where code starts
export const LINES = 27;

export type TokenKind = "kw" | "fn" | "str" | "num" | "cmt" | "punct" | "plain" | "zone" | "bug";

export interface Span {
  t: string;
  k: TokenKind;
}

/** Each entry is one editor line, as coloured spans. */
export const CODE: Span[][] = [
  [{ t: "// zun.ts — the world you are driving on", k: "cmt" }],
  [],
  [{ t: "import", k: "kw" }, { t: " { curiosity, coffee } ", k: "plain" }, { t: "from", k: "kw" }, { t: " './fuel'", k: "str" }],
  [],
  [{ t: "export function", k: "kw" }, { t: " ", k: "plain" }, { t: "whoami", k: "fn" }, { t: "() {", k: "punct" }],
  [{ t: "  return", k: "kw" }, { t: " { name: ", k: "punct" }, { t: "'ZUN'", k: "str" }, { t: ", role: ", k: "punct" }, { t: "'software student'", k: "str" }, { t: " }", k: "punct" }],
  [{ t: "}", k: "punct" }],
  [],
  [{ t: "// ZONE: about — drive onto this line", k: "zone" }],
  [],
  [{ t: "const", k: "kw" }, { t: " projects = [", k: "punct" }],
  [{ t: "  'ZUNRAN'", k: "str" }, { t: ", ", k: "punct" }, { t: "'자격증 학습 플랫폼'", k: "str" }, { t: ", ", k: "punct" }, { t: "'ZUNTO'", k: "str" }, { t: ",", k: "punct" }],
  [{ t: "  'AI LAB'", k: "str" }, { t: ", ", k: "punct" }, { t: "'STAR MOVIE'", k: "str" }, { t: ", ", k: "punct" }, { t: "'ZUNME'", k: "str" }],
  [{ t: "]", k: "punct" }],
  [],
  [{ t: "// ZONE: projects — the lab is parked here", k: "zone" }],
  [],
  [{ t: "while", k: "kw" }, { t: " (", k: "punct" }, { t: "alive", k: "fn" }, { t: "()) {", k: "punct" }],
  [{ t: "  const", k: "kw" }, { t: " idea = ", k: "punct" }, { t: "discover", k: "fn" }, { t: "()", k: "punct" }],
  [{ t: "  try", k: "kw" }, { t: " { ", k: "punct" }, { t: "ship", k: "fn" }, { t: "(idea) } ", k: "punct" }, { t: "catch", k: "kw" }, { t: " (e) { ", k: "punct" }, { t: "learn", k: "fn" }, { t: "(e) }", k: "punct" }],
  [{ t: "  share", k: "fn" }, { t: "(idea) ", k: "punct" }, { t: "// @zun_it_", k: "cmt" }],
  [{ t: "}", k: "punct" }],
  [],
  [{ t: "// ZONE: content — what I post while building", k: "zone" }],
  [],
  [{ t: "// ZONE: contact — let's build something", k: "zone" }],
  [{ t: "export default", k: "kw" }, { t: " ", k: "plain" }, { t: "whoami", k: "fn" }],
];

export const COLORS: Record<TokenKind, string> = {
  kw: "#c084fc",
  fn: "#60a5fa",
  str: "#34d399",
  num: "#fbbf24",
  cmt: "#5a6588",
  punct: "#9aa5c4",
  plain: "#c7cfe4",
  zone: "#f2f4fa",
  bug: "#ff5a5a",
};

export const BG = "#0b1226";
export const BG_ALT = "#0d1530";
export const GUTTER_FG = "#3d466a";
export const CURRENT_LINE = "rgba(96,165,250,0.10)";

/** world z of a line's centre (line 0 is the top of the texture = -z) */
export function lineZ(line: number) {
  return -WORLD / 2 + (TOP + line * LINE_H + LINE_H / 2) * PX;
}
/** world x of a character column (monospace, ~26px advance at 48px) */
export const CHAR_W = 24;
export function colX(col: number) {
  return -WORLD / 2 + (CODE_X + col * CHAR_W) * PX;
}

/** Lines that act as drive-in zones, in CODE order. */
export const ZONE_LINES = { about: 8, projects: 15, content: 23, contact: 25 } as const;

/** Collectible syntax tokens: [line, column, glyph]. */
export const TOKENS: { line: number; col: number; glyph: string }[] = [
  { line: 2, col: 30, glyph: "{" },
  { line: 5, col: 46, glyph: "}" },
  { line: 11, col: 12, glyph: "(" },
  { line: 12, col: 34, glyph: ")" },
  { line: 17, col: 8, glyph: ";" },
  { line: 19, col: 40, glyph: "=>" },
  { line: 20, col: 20, glyph: "<>" },
  { line: 26, col: 30, glyph: "$" },
];

/** Red-squiggle bug patches: [line, from column, to column]. */
export const BUGS: { line: number; from: number; to: number }[] = [
  { line: 13, from: 2, to: 22 },
  { line: 19, from: 4, to: 24 },
  { line: 21, from: 10, to: 30 },
];

/** Draw the whole editor into a 2048² canvas. */
export function drawEditor(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, TEX, TEX);

  // gutter column
  ctx.fillStyle = BG_ALT;
  ctx.fillRect(0, 0, GUTTER, TEX);
  ctx.fillStyle = "rgba(148,163,205,0.16)";
  ctx.fillRect(GUTTER - 2, 0, 2, TEX);

  ctx.textBaseline = "middle";
  const mono = "600 40px ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, monospace";
  /** draw on an exact CHAR_W grid so colX() lines up with what you see */
  const drawMono = (text: string, x: number, y: number) => {
    for (let i = 0; i < text.length; i++) ctx.fillText(text[i], x + i * CHAR_W, y);
  };

  for (let i = 0; i < LINES; i++) {
    const y = TOP + i * LINE_H + LINE_H / 2;
    const spans = CODE[i] ?? [];
    const isZone = spans[0]?.k === "zone";

    if (isZone) {
      ctx.fillStyle = CURRENT_LINE;
      ctx.fillRect(GUTTER, y - LINE_H / 2, TEX - GUTTER, LINE_H);
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(GUTTER, y - LINE_H / 2, 6, LINE_H);
    }

    // line number
    ctx.font = "500 34px ui-monospace, 'JetBrains Mono', monospace";
    ctx.fillStyle = GUTTER_FG;
    ctx.textAlign = "right";
    ctx.fillText(String(i + 1).padStart(2, "0"), GUTTER - 34, y);

    // code spans
    ctx.font = mono;
    ctx.textAlign = "left";
    let x = CODE_X;
    for (const s of spans) {
      ctx.fillStyle = COLORS[s.k];
      drawMono(s.t, x, y);
      x += s.t.length * CHAR_W;
    }
  }

  // bug squiggles
  ctx.strokeStyle = COLORS.bug;
  ctx.lineWidth = 5;
  for (const b of BUGS) {
    const y = TOP + b.line * LINE_H + LINE_H / 2 + 26;
    const x0 = CODE_X + b.from * CHAR_W;
    const x1 = CODE_X + b.to * CHAR_W;
    ctx.beginPath();
    for (let x = x0; x <= x1; x += 6) {
      const yy = y + (Math.floor((x - x0) / 6) % 2 === 0 ? -4 : 4);
      if (x === x0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
}
