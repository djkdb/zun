import { future } from "@/data";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/interactions/Reveal";
import { ZunCharacter } from "@/components/character";

/** WHERE I'M GOING — direction, not a job pitch. */
export function Future() {
  return (
    <Section id="future" className="overflow-hidden">
      {/* restrained star field behind the character */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-dots opacity-60 mask-fade-y" />

      <div className="relative grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:items-center">
        <div>
          <SectionHeader eyebrow="08 / FUTURE" title={future.title} className="mb-8" />

          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {future.formula.map((w, i) => (
              <Reveal as="span" key={w} delay={i * 0.12} y={10} className="inline-flex items-baseline gap-x-4">
                {i > 0 && (
                  <span aria-hidden className="font-pixel text-2xl text-accent sm:text-3xl">
                    ×
                  </span>
                )}
                <span className="font-pixel text-3xl text-fg sm:text-4xl md:text-5xl">{w}</span>
              </Reveal>
            ))}
          </p>

          <Reveal delay={0.5} className="mt-8">
            <p className="max-w-lg font-sans text-xl leading-snug text-fg sm:text-2xl">{future.statement}</p>
            <div className="prose-ko mt-5 max-w-lg space-y-3 text-fg-muted">
              {future.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </Reveal>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3" role="list">
            {future.principles.map((p, i) => (
              <Reveal as="li" key={p.key} delay={0.6 + i * 0.08} y={10} className="border-l-2 border-accent bg-bg-1 px-4 py-3">
                <p className="font-pixel text-sm text-fg">{p.key}</p>
                <p className="prose-ko mt-1 text-sm text-fg-muted">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.2} className="flex justify-center md:justify-end">
          <div className="relative">
            <ZunCharacter pose="telescope" sizeClass="w-40 md:w-56" label="ZUN looking through a telescope toward what comes next" />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.24em] text-fg-dim">
              LOOKING AHEAD
            </span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
