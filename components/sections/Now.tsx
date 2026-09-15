import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/interactions/Reveal";
import { ProgressDashboard } from "./ProgressDashboard";

/** WHAT I'M BUILDING NOW — live status, no fake numbers. */
export function Now() {
  return (
    <Section id="now">
      <SectionHeader eyebrow="07 / NOW" title="WHAT I'M BUILDING NOW" description="현재진행형. 숫자로 꾸미지 않고 상태만 적습니다." />
      <Reveal>
        <ProgressDashboard />
      </Reveal>
    </Section>
  );
}
