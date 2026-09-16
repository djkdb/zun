"use client";

import { ZunCharacter } from "@/components/character";
import { links, profile } from "@/data/profile";
import { nowItems, nowUpdated } from "@/data/now";
import { useOS } from "@/components/os/OSProvider";
import { Chip } from "./shell";

/** "About This Mac", reinterpreted as "About ZUN". */
export function About() {
  const os = useOS();
  return (
    <div className="grid h-full grid-cols-[210px_1fr] max-[560px]:grid-cols-1">
      <div className="flex flex-col items-center justify-center gap-3 border-r border-line bg-bg-1/50 px-4 py-6 max-[560px]:border-b max-[560px]:border-r-0 max-[560px]:py-5">
        <ZunCharacter pose="wave" sizeClass="w-24" idle={!os.reduce} followPointer shadow label="ZUN 캐릭터" />
        <p className="font-pixel text-base tracking-widest text-fg">{profile.brand}</p>
        <p className="text-center font-mono text-[10.5px] leading-relaxed text-fg-dim">
          ZUN OS 1.0
          <br />
          Next.js · React · Three.js
        </p>
      </div>

      <div className="overflow-auto px-6 py-5">
        <Row label="이름" value={`${profile.name} (${profile.brand})`} />
        <Row label="역할" value={profile.formula} />
        <Row label="학교" value={profile.school} />
        <Row label="핸들" value={profile.handle} />

        <p className="mt-5 text-[13.5px] leading-relaxed text-fg-muted">{profile.intro}</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-fg-muted">{profile.intro2}</p>

        <p className="mt-5 font-mono text-[10.5px] tracking-wider text-fg-dim">관심사</p>
        <div className="mt-1">{profile.interests.map((i) => <Chip key={i}>{i}</Chip>)}</div>

        <p className="mt-5 font-mono text-[10.5px] tracking-wider text-fg-dim">
          지금 {nowUpdated ? `· ${nowUpdated}` : ""}
        </p>
        <ul className="mt-1.5 grid gap-1.5">
          {nowItems.slice(0, 4).map((n) => (
            <li key={n.id} className="flex gap-2 text-[13px] text-fg-muted">
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              <span>
                <span className="text-fg">{n.label}</span> — {n.note}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={`rounded-lg border px-3 py-1.5 text-xs ${
                l.todo
                  ? "pointer-events-none border-warn/40 text-warn"
                  : "border-line-strong text-fg hover:bg-bg-3/60"
              }`}
            >
              {l.label}
              {l.todo ? " · TODO" : ""}
            </a>
          ))}
          <button
            type="button"
            onClick={() => os.openApp("monitor")}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-bg hover:bg-accent-strong"
          >
            지금 뭐 하는지 보기
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 border-b border-line py-2 text-[13.5px]">
      <span className="w-16 flex-none text-fg-dim">{label}</span>
      <span className="text-fg">{value}</span>
    </div>
  );
}
