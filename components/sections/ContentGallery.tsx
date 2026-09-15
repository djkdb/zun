"use client";

import Image from "next/image";
import { contentItems } from "@/data";
import type { ContentItem } from "@/data/types";
import { cn, isTodo, seeded } from "@/lib/utils";
import { Reveal } from "@/components/interactions/Reveal";
import { Tag, TodoTag } from "@/components/ui/Tag";

/** Deterministic blocky placeholder so empty tiles still look designed. */
function PixelPattern({ seed }: { seed: number }) {
  const cells = Array.from({ length: 36 }, (_, i) => seeded(seed * 97 + i * 13));
  return (
    <div aria-hidden className="absolute inset-0 grid grid-cols-6 grid-rows-6 bg-bg-2">
      {cells.map((r, i) => (
        <div
          key={i}
          className={cn(r > 0.82 ? "bg-accent/40" : r > 0.6 ? "bg-bg-3" : "bg-transparent")}
        />
      ))}
    </div>
  );
}

function Tile({ item, index }: { item: ContentItem; index: number }) {
  const draft = item.draft || isTodo(item.title);
  const title = isTodo(item.title) ? "콘텐츠 준비 중" : item.title;
  const inner = (
    <>
      <div className="relative aspect-square overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={title} fill sizes="(min-width: 768px) 30vw, 45vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <PixelPattern seed={index + 1} />
        )}
        {/* desktop hover / focus overlay */}
        <div className="absolute inset-0 hidden flex-col justify-end bg-bg/85 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 md:flex">
          <div className="flex items-center gap-2">
            <Tag accent>{item.category}</Tag>
            {item.views && <span className="font-mono text-[11px] text-fg">{item.views} views</span>}
          </div>
          <p className="mt-2 font-sans text-sm font-medium text-fg">{title}</p>
          <p className="prose-ko mt-1 text-xs text-fg-muted">{isTodo(item.takeaway) ? "takeaway 준비 중" : item.takeaway}</p>
        </div>
        {draft && <TodoTag className="absolute right-2 top-2 bg-bg" />}
      </div>
      {/* always-visible caption (touch + readability) */}
      <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
        <span className="truncate font-sans text-xs text-fg-muted">{title}</span>
        <span className="shrink-0 font-mono text-[10px] tracking-[0.14em] text-fg-dim">{item.category}</span>
      </div>
    </>
  );
  const cls = "group relative block w-full overflow-hidden bg-bg-1 pixel-border text-left";
  return item.href ? (
    <a href={item.href} target="_blank" rel="noreferrer noopener" data-cursor="link" className={cls} aria-label={`${title} — ${item.category}`}>
      {inner}
    </a>
  ) : (
    <div className={cls} tabIndex={0} role="group" aria-label={`${title} — ${item.category}`}>
      {inner}
    </div>
  );
}

export function ContentGallery() {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4" role="list">
      {contentItems.map((item, i) => (
        <Reveal as="li" key={item.id} delay={i * 0.05} y={12}>
          <Tile item={item} index={i} />
        </Reveal>
      ))}
    </ul>
  );
}
