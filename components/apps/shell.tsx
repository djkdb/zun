"use client";

import type { ReactNode } from "react";

/** Shared chrome pieces so every app reads as the same OS, not twelve designs. */

export function AppSplit({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="grid h-full grid-cols-[186px_1fr] max-[760px]:grid-cols-1">
      <aside className="overflow-auto border-r border-line bg-bg-1/50 p-2 max-[760px]:hidden">{sidebar}</aside>
      <div className="flex min-w-0 flex-col">{children}</div>
    </div>
  );
}

export function SideGroup({ label }: { label: string }) {
  return <p className="px-2 pb-1.5 pt-2.5 text-[11px] font-bold text-fg-dim">{label}</p>;
}

export function SideItem({
  icon, label, active, onClick,
}: { icon: string; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] ${
        active ? "bg-accent text-white" : "text-fg-muted hover:bg-bg-3/60"
      }`}
    >
      <span aria-hidden>{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-none items-center gap-2.5 border-b border-line px-3 py-2">{children}</div>
  );
}

export function Seg<T extends string>({
  value, options, onChange,
}: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-0.5 rounded-lg bg-bg-3/60 p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-md px-2.5 py-1 text-xs ${
            value === o.id ? "bg-bg-2 text-fg shadow" : "text-fg-dim hover:text-fg-muted"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SearchBox({
  value, onChange, placeholder = "검색",
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="w-36 rounded-lg border border-line bg-bg-3/50 px-2.5 py-1 text-xs text-fg outline-none placeholder:text-fg-dim focus:border-accent max-[760px]:w-full max-[760px]:flex-1"
    />
  );
}

export function Doc({ children }: { children: ReactNode }) {
  return <div className="max-w-[66ch] px-7 py-6 leading-relaxed max-[760px]:px-5">{children}</div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-3.5">
      <p className="font-mono text-[10.5px] tracking-wider text-fg-dim">{label}</p>
      <div className="mt-1 text-[13px] leading-relaxed text-fg-muted">{children}</div>
    </div>
  );
}

export function Todo({ children = "TODO" }: { children?: ReactNode }) {
  return <span className="font-mono text-[11px] text-warn">{children}</span>;
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="mr-1.5 mt-1.5 inline-block rounded border border-accent/35 bg-accent-soft px-2 py-0.5 font-mono text-[10.5px] text-accent-strong">
      {children}
    </span>
  );
}
