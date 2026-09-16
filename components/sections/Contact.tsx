"use client";

import { links, profile } from "@/data";
import { scrollToId } from "@/lib/scroll";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/interactions/Reveal";
import { PixelButton } from "@/components/ui/PixelButton";
import { TodoTag } from "@/components/ui/Tag";

/** LET'S BUILD. — closing scene with lots of air. */
export function Contact() {
  const year = 2026;
  return (
    <Section id="contact" as="footer" className="min-h-[80svh] flex flex-col justify-center">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div>
          <SectionHeader eyebrow="09 / CONTACT" title="LET'S BUILD." description="Let's build something." />

          <ul className="divide-y divide-line border-y border-line" role="list">
            {links.map((l, i) => {
              const external = /^https?:/.test(l.href);
              const row = "flex min-h-16 w-full items-center justify-between gap-4 py-4";
              if (l.todo) {
                return (
                  <Reveal as="li" key={l.label} delay={i * 0.05} y={8}>
                    <div className={`${row} text-fg-dim`} aria-label={`${l.label} — 추가 예정`}>
                      <span className="font-pixel text-xl sm:text-2xl">{l.label}</span>
                      <span className="flex items-center gap-2 font-mono text-xs">
                        추가 예정 <TodoTag />
                      </span>
                    </div>
                  </Reveal>
                );
              }
              if (l.href === "/") {
                return (
                  <Reveal as="li" key={l.label} delay={i * 0.05} y={8}>
                    <button type="button" onClick={() => scrollToId("hero")} className={`${row} group text-left text-fg hover:text-accent-strong`}>
                      <span className="font-pixel text-xl sm:text-2xl">{l.label}</span>
                      <span className="font-mono text-xs text-fg-dim group-hover:text-accent-strong">you are here ↑</span>
                    </button>
                  </Reveal>
                );
              }
              return (
                <Reveal as="li" key={l.label} delay={i * 0.05} y={8}>
                  <a
                    href={l.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    data-cursor="link"
                    className={`${row} group text-fg hover:text-accent-strong`}
                  >
                    <span className="font-pixel text-xl sm:text-2xl">{l.label}</span>
                    <span className="truncate font-mono text-xs text-fg-dim group-hover:text-accent-strong">
                      {l.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} {external && "↗"}
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </ul>
        </div>

      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[11px] tracking-[0.16em] text-fg-dim sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {profile.brand} · Built with Next.js
        </span>
        <span className="flex items-center gap-4">
          <span>{profile.taglineAlt}</span>
          <PixelButton variant="ghost" onClick={() => scrollToId("hero")} className="min-h-9 px-3 py-1 text-[11px]">
            BACK TO TOP ↑
          </PixelButton>
        </span>
      </div>
    </Section>
  );
}
