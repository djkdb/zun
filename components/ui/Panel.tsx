import { cn } from "@/lib/utils";

/** Raised surface with a pixel border. */
export function Panel({ children, className, accent, ...rest }: React.HTMLAttributes<HTMLDivElement> & { accent?: boolean }) {
  return (
    <div className={cn("relative bg-bg-1 p-5 md:p-6", accent ? "pixel-border-accent" : "pixel-border", className)} {...rest}>
      {children}
    </div>
  );
}
