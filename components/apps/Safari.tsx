"use client";

import { links, profile, projects } from "@/data";
import { useOS } from "@/components/os/OSProvider";

export function Safari() {
  const os = useOS();
  const live = projects.filter((p) => p.demo);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none items-center gap-2 border-b border-line px-3 py-2">
        <span aria-hidden className="font-mono text-xs text-fg-dim">‹ ›</span>
        <p className="flex-1 truncate rounded-lg bg-bg-3/50 px-3 py-1 text-center font-mono text-[11.5px] text-fg-muted">
          🔒 zun.dev / links
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-6 py-5 max-[560px]:px-4">
        <h2 className="text-lg font-semibold tracking-tight text-fg">ZUN WEB</h2>
        <p className="mt-1 text-[13px] text-fg-muted">{profile.description}</p>

        <p className="mt-6 font-mono text-[10.5px] tracking-wider text-fg-dim">프로필</p>
        <div className="mt-2 grid gap-1.5">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-[13px] ${
                l.todo
                  ? "pointer-events-none border-warn/35 text-warn"
                  : "border-line text-fg hover:border-line-strong hover:bg-bg-3/40"
              }`}
            >
              <span aria-hidden>🔗</span>
              <span className="flex-1">{l.label}</span>
              <span className="font-mono text-[11px] text-fg-dim">{l.todo ? "TODO" : "열기 ↗"}</span>
            </a>
          ))}
        </div>

        <p className="mt-6 font-mono text-[10.5px] tracking-wider text-fg-dim">
          라이브 배포 ({live.length})
        </p>
        <div className="mt-2 grid gap-1.5">
          {live.map((p) => (
            <a
              key={p.id}
              href={p.demo!.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 text-[13px] text-fg hover:border-line-strong hover:bg-bg-3/40"
            >
              <span aria-hidden>{p.draft ? "📦" : "🧰"}</span>
              <span className="flex-1 truncate">
                {p.title}
                <span className="ml-2 font-mono text-[11px] text-fg-dim">{p.demo!.label}</span>
              </span>
              <span className="font-mono text-[11px] text-fg-dim">↗</span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => os.openApp("photos")}
          className="mt-6 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-bg hover:bg-accent-strong"
        >
          콘텐츠 보기 →
        </button>
      </div>
    </div>
  );
}
