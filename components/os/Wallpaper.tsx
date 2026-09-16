"use client";

import { useEffect, useRef } from "react";
import { useOS } from "./OSProvider";

/**
 * Lo-fi pixel wallpaper, painted on a small canvas and scaled up with
 * `image-rendering: pixelated` so it stays crisp at any size and ships as code
 * rather than a megabyte of PNG. Deterministic (fixed seed) so it never
 * flickers between renders.
 */
export const WALLPAPERS = [
  { id: 1, name: "서울의 밤", swatch: "linear-gradient(180deg,#0a1028,#22265a 55%,#0d1234)" },
  { id: 2, name: "새벽", swatch: "linear-gradient(165deg,#3b1c4a,#8f3b5e 45%,#e2794a)" },
  { id: 3, name: "심해", swatch: "radial-gradient(120% 100% at 50% 110%,#0b7a8c,#052033 60%,#020a14)" },
  { id: 4, name: "단색", swatch: "linear-gradient(160deg,#101a36,#070b18)" },
] as const;

export function Wallpaper() {
  const { settings } = useOS();
  const cv = useRef<HTMLCanvasElement>(null);
  const pixel = settings.wallpaper === 1;

  useEffect(() => {
    if (!pixel) return;
    const c = cv.current;
    const x = c?.getContext("2d");
    if (!c || !x) return;
    draw(x, c.width, c.height, settings.appearance === "dark");
  }, [pixel, settings.appearance]);

  if (!pixel) {
    const w = WALLPAPERS.find((w) => w.id === settings.wallpaper) ?? WALLPAPERS[3];
    return <div aria-hidden className="absolute inset-0 z-0" style={{ background: w.swatch }} />;
  }
  return (
    <canvas
      ref={cv}
      aria-hidden
      width={480}
      height={300}
      className="absolute inset-0 z-0 h-full w-full object-cover [image-rendering:pixelated]"
    />
  );
}

function draw(x: CanvasRenderingContext2D, W: number, H: number, dark: boolean) {
  x.imageSmoothingEnabled = false;
  let seed = 20260916 >>> 0;
  const rnd = () => {
    seed ^= seed << 13; seed >>>= 0;
    seed ^= seed >> 17;
    seed ^= seed << 5; seed >>>= 0;
    return seed / 4294967296;
  };
  const px = (a: number, b: number, w: number, h: number, c: string) => {
    x.fillStyle = c;
    x.fillRect(a | 0, b | 0, w | 0, h | 0);
  };
  const HZ = 176;
  const RV = 196;

  const sky = x.createLinearGradient(0, 0, 0, HZ);
  if (dark) { sky.addColorStop(0, "#0a1028"); sky.addColorStop(0.5, "#16224a"); sky.addColorStop(1, "#263a6b"); }
  else { sky.addColorStop(0, "#16224a"); sky.addColorStop(0.5, "#25376b"); sky.addColorStop(1, "#3d5691"); }
  x.fillStyle = sky;
  x.fillRect(0, 0, W, HZ + 4);

  for (let i = 0; i < 210; i++) {
    px(Math.floor(rnd() * W), Math.floor(rnd() * 118), 1, 1, `rgba(224,234,255,${(0.2 + rnd() * 0.75).toFixed(2)})`);
  }
  for (let i = 0; i < 22; i++) {
    const t = i / 22;
    px(300 + i * 2.1, 50 + i * 1.15, 2, 1, `rgba(235,243,255,${(0.9 - t * 0.85).toFixed(2)})`);
  }
  px(344, 74, 2, 2, "#ffffff");

  const cloud = (cx: number, cy: number, sc: number, al: number) => {
    const c = `rgba(${dark ? "104,124,186" : "146,166,226"},${al})`;
    ([[-22, 2, 16, 4], [-10, -2, 22, 5], [4, -5, 26, 6], [22, -2, 20, 5], [38, 1, 14, 4], [12, 2, 30, 5]] as const)
      .forEach(([a, b, w, h]) => px(cx + a * sc, cy + b * sc, w * sc, h * sc, c));
  };
  cloud(70, 44, 1.6, 0.42); cloud(210, 30, 1.3, 0.32); cloud(392, 58, 1.5, 0.36);
  cloud(140, 86, 1.9, 0.26); cloud(330, 100, 1.6, 0.22);

  x.fillStyle = dark ? "#0d1533" : "#17224a";
  x.beginPath();
  x.moveTo(300, HZ);
  for (let i = 300; i <= W; i += 3) x.lineTo(i, HZ - Math.sin(((i - 300) / (W - 300)) * Math.PI * 0.92) * 44 - 6);
  x.lineTo(W, HZ);
  x.closePath();
  x.fill();

  const tx = 392, ty = HZ - 46;
  px(tx, ty + 6, 3, 28, "#0a1028"); px(tx - 5, ty, 13, 7, "#0a1028"); px(tx - 3, ty - 11, 9, 11, "#0a1028");
  px(tx + 1, ty - 22, 1, 11, "#0a1028"); px(tx, ty - 24, 1, 2, "#ff6b6b");
  px(tx - 4, ty + 1, 3, 2, "rgba(140,200,255,.95)"); px(tx + 3, ty + 1, 3, 2, "rgba(140,200,255,.95)");

  const lit = dark
    ? ["#ffd894", "#ffc774", "#ffe6bb", "#9fd0ff"]
    : ["#ffe4a8", "#ffd894", "#fff2d4", "#c2e2ff"];
  const cols: [number, number][] = [];
  let bx = -6;
  while (bx < W + 8) {
    const bw = 7 + Math.floor(rnd() * 15);
    const near = bx > 90 && bx < 300;
    const bh = (20 + Math.floor(rnd() * 58)) * (near ? 1.18 : 0.92);
    const by = Math.floor(HZ - bh);
    px(bx, by, bw, HZ - by, dark ? "#0c1533" : "#182248");
    px(bx, by, bw, 1, dark ? "#1c2a58" : "#28356b");
    let warm = 0;
    for (let wy = by + 3; wy < HZ - 2; wy += 4) {
      for (let wx = bx + 2; wx < bx + bw - 1; wx += 3) {
        if (rnd() < 0.46) { px(wx, wy, 1, 2, lit[(rnd() * lit.length) | 0]); warm++; }
      }
    }
    if (warm > 4) cols.push([bx + bw / 2, warm]);
    bx += bw + 1 + Math.floor(rnd() * 3);
  }

  px(0, HZ, W, RV - HZ, dark ? "#0a1130" : "#141d44");
  const riv = x.createLinearGradient(0, RV, 0, H);
  riv.addColorStop(0, dark ? "#13204f" : "#1e2c63");
  riv.addColorStop(1, dark ? "#070c22" : "#0e1436");
  x.fillStyle = riv;
  x.fillRect(0, RV, W, H - RV);
  px(0, RV - 1, W, 1, dark ? "#1e2c60" : "#2c3a78");

  for (const [cx, warm] of cols) {
    const len = Math.min(60, 10 + warm * 2.4);
    for (let i = 0; i < len; i++) {
      const al = (0.22 * (1 - i / len)).toFixed(2);
      const w = 1 + ((i >> 3) % 2);
      px(cx - w / 2, RV + i, w, 1, `rgba(255,214,150,${al})`);
    }
  }
  for (let i = 0; i < 120; i++) {
    const ry = RV + 2 + Math.floor(rnd() * (H - RV - 4));
    const fade = 1 - (ry - RV) / (H - RV);
    px(Math.floor(rnd() * W), ry, 2 + Math.floor(rnd() * 9), 1,
      `rgba(190,215,255,${(0.03 + rnd() * 0.13 * fade).toFixed(2)})`);
  }

  const vg = x.createRadialGradient(W / 2, H * 0.44, 50, W / 2, H * 0.5, W * 0.7);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, dark ? "rgba(2,4,16,.5)" : "rgba(6,10,32,.4)");
  x.fillStyle = vg;
  x.fillRect(0, 0, W, H);
}
