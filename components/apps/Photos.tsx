"use client";

import { useState } from "react";
import { contentBrand, contentItems } from "@/data";
import { profile } from "@/data/profile";
import { Todo } from "./shell";

const HUE = [212, 190, 326, 258, 168, 204, 288, 236, 182, 148, 310, 222];

export function Photos() {
  const [open, setOpen] = useState<string | null>(null);
  const sel = contentItems.find((c) => c.id === open);

  return (
    <div className="relative h-full overflow-auto p-3.5">
      <header className="flex items-center gap-3.5 px-1.5 pb-4 pt-1.5">
        <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-[conic-gradient(from_210deg,#3b82f6,#22d3ee,#f472b6,#3b82f6)] p-[2.5px]">
          <span className="grid h-full w-full place-items-center rounded-full bg-bg-2 text-xl">🧑‍💻</span>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fg">{profile.handle}</p>
          <p className="mt-0.5 text-xs text-fg-dim">
            게시물 {contentItems.length} · 팔로워 <Todo /> · 팔로잉 <Todo />
          </p>
          <p className="mt-1 text-[11.5px] text-fg-muted">{contentBrand.insightTitle}</p>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-1">
        {contentItems.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setOpen(c.id)}
            style={{
              background: `linear-gradient(150deg, hsl(${HUE[i % HUE.length]} 62% 38%), hsl(${(HUE[i % HUE.length] + 34) % 360} 56% 22%))`,
            }}
            className="group relative aspect-square overflow-hidden rounded"
          >
            <span
              aria-hidden
              className="absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.06)_0_9px,transparent_9px_18px)]"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 py-1.5 text-left">
              <span className="block truncate font-mono text-[10px] text-white/90">{c.category}</span>
              <span className="block truncate text-[11px] text-white">{c.title}</span>
            </span>
          </button>
        ))}
      </div>

      {sel && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 p-5 backdrop-blur-sm"
          onPointerDown={(e) => { if (e.target === e.currentTarget) setOpen(null); }}
        >
          <div className="max-h-full w-full max-w-sm overflow-auto rounded-2xl border border-line-strong bg-bg-2/95 p-5">
            <p className="font-mono text-[10.5px] tracking-wider text-accent-strong">{sel.category}</p>
            <h3 className="mt-1 text-base font-semibold text-fg">{sel.title}</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-fg-muted">{sel.takeaway}</p>
            <p className="mt-4 font-mono text-[11px] text-fg-dim">
              조회수 {sel.views ?? <Todo />}
            </p>
            <div className="mt-5 flex gap-2">
              {sel.href && (
                <a
                  href={sel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-bg hover:bg-accent-strong"
                >
                  게시물 열기 ↗
                </a>
              )}
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="rounded-lg border border-line-strong px-3 py-1.5 text-xs text-fg hover:bg-bg-3/60"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
