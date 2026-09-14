import { cn } from "@/lib/utils";

export function Tag({ children, className, accent }: { children: React.ReactNode; className?: string; accent?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]",
        accent ? "bg-accent-soft text-accent-strong" : "bg-bg-2 text-fg-muted ring-1 ring-inset ring-line",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Visible marker for content that is still a placeholder. */
export function TodoTag({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-warn ring-1 ring-inset ring-warn/40", className)}
      title="이 내용은 아직 확인 전입니다. /data 에서 채워주세요."
    >
      TODO
    </span>
  );
}
