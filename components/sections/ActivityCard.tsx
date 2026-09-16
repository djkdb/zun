"use client";

import Image from "next/image";
import type { Activity } from "@/data/types";
import { cn, isTodo } from "@/lib/utils";
import { TodoTag } from "@/components/ui/Tag";

/** Detail block for one activity: image (or pixel placeholder), description, takeaway. */
export function ActivityDetail({ activity, compact }: { activity: Activity; compact?: boolean }) {
  const draft = activity.draft || isTodo(activity.description);
  return (
    <div className={cn("bg-bg-1 pixel-border", compact ? "p-4" : "p-5 md:p-6")}>
      <div className={cn("relative overflow-hidden bg-bg-2 bg-dots", compact ? "aspect-[16/9]" : "aspect-[16/10]")}>
        {activity.image ? (
          <Image src={activity.image} alt={activity.title} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-fg-dim">NO IMAGE YET</span>
          </div>
        )}
        <div className="absolute bottom-2 right-3">
          
        </div>
        <span className="absolute left-3 top-2 font-mono text-[10px] tracking-[0.18em] text-fg-dim">{activity.category}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h3 className="font-sans text-lg font-medium text-fg">{activity.title}</h3>
        {activity.period && <span className="font-mono text-[11px] text-fg-dim">{activity.period}</span>}
        {draft && <TodoTag />}
      </div>
      <p className="prose-ko mt-2 text-sm leading-relaxed text-fg-muted">
        {isTodo(activity.description) ? "내용 준비 중입니다." : activity.description}
      </p>
      {activity.takeaway && !isTodo(activity.takeaway) && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="eyebrow text-[10px]">Takeaway</p>
          <p className="prose-ko mt-1 text-sm text-fg">{activity.takeaway}</p>
        </div>
      )}
    </div>
  );
}
