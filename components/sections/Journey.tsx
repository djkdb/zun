import { journey } from "@/data";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { JourneyTimeline } from "@/components/timeline/JourneyTimeline";

/** 02 / JOURNEY — how ZUN got here, as a scroll-filled timeline. */
export function Journey() {
  return (
    <Section id="journey">
      <SectionHeader
        eyebrow="02 / JOURNEY"
        title="MY JOURNEY"
        description="만들면서 배워온 과정. 정확한 항목은 계속 업데이트됩니다."
      />
      <JourneyTimeline items={journey} />
    </Section>
  );
}
