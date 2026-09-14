import { cn } from "@/lib/utils";
import { Reveal } from "@/components/interactions/Reveal";

interface SectionHeaderProps {
  /** small mono label above the title, e.g. "02 / ABOUT" */
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, align = "left", className }: SectionHeaderProps) {
  return (
    <Reveal className={cn("mb-12 md:mb-16", align === "center" && "text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-3 text-3xl text-fg sm:text-4xl md:text-5xl">{title}</h2>
      {description && (
        <p className={cn("prose-ko mt-5 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
