import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  /** adds top divider line */
  divider?: boolean;
  /** wide container for galleries */
  wide?: boolean;
  as?: "section" | "footer";
}

/** Consistent vertical rhythm + container for every page section. */
export function Section({ id, className, children, divider = true, wide, as = "section", ...rest }: SectionProps) {
  const Tag = as;
  return (
    <Tag
      id={id}
      className={cn("relative scroll-mt-14 py-24 md:py-36", divider && "border-t border-line", className)}
      {...rest}
    >
      <div className={cn("mx-auto w-full px-5 sm:px-8", wide ? "max-w-7xl" : "max-w-6xl")}>{children}</div>
    </Tag>
  );
}
