import { contentBrand } from "@/data";
import { isTodo } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/interactions/Reveal";
import { Panel } from "@/components/ui/Panel";
import { Tag, TodoTag } from "@/components/ui/Tag";
import { ContentGallery } from "./ContentGallery";

/** WHAT I SHARE — creator side of ZUN (@zun_it_). */
export function Content() {
  return (
    <Section id="content">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <SectionHeader eyebrow="06 / CONTENT" title="WHAT I SHARE" className="mb-6 md:mb-8" />
          <Reveal delay={0.05}>
            <a
              href={contentBrand.url}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="link"
              className="inline-flex items-center gap-2 font-mono text-base text-accent-strong hover:text-fg sm:text-lg"
            >
              {contentBrand.handle}
              <span aria-hidden>↗</span>
            </a>
            <p className="prose-ko mt-3 max-w-xl text-fg-muted">만드는 과정을 그대로 공개합니다. 잘 된 것도, 안 된 것도.</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
              {contentBrand.topics.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="mt-10 md:mt-14">
        <ContentGallery />
      </div>

      <Reveal className="mt-10 md:mt-14">
        <Panel className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
          <h3 className="section-title text-xl text-fg md:text-2xl">{contentBrand.insightTitle}</h3>
          <div className="flex flex-wrap items-center gap-2 md:border-l md:border-line md:pl-6">
            <p className="prose-ko text-fg-muted">
              {isTodo(contentBrand.insight) ? "어떤 콘텐츠가 왜 반응이 좋았는지, 확인된 데이터가 생기면 여기에 적습니다." : contentBrand.insight}
            </p>
            {isTodo(contentBrand.insight) && <TodoTag />}
          </div>
        </Panel>
      </Reveal>
    </Section>
  );
}
