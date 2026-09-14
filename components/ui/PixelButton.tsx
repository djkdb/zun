"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  cursor?: string;
}
type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const base =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 font-mono text-sm uppercase tracking-[0.14em] transition-[transform,background-color,color] duration-150 ease-out active:translate-y-px pixel-corners";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  ghost: "bg-bg-2 text-fg hover:bg-bg-3 ring-1 ring-inset ring-line-strong",
};

/** Pixel-corner button. Renders <a> when href is given. */
function omitOwn<T extends BaseProps>(props: T) {
  const rest = { ...props } as Partial<BaseProps> & Record<string, unknown>;
  delete rest.variant;
  delete rest.className;
  delete rest.cursor;
  delete rest.children;
  return rest;
}

export function PixelButton(props: ButtonProps | AnchorProps) {
  const { variant = "primary", className, children, cursor = "pointer" } = props;
  const cls = cn(base, variants[variant], className);
  if ("href" in props && props.href) {
    const { href, ...rest } = omitOwn(props as AnchorProps) as Omit<AnchorProps, keyof BaseProps>;
    const external = /^https?:/.test(href);
    if (external) {
      return (
        <a href={href} className={cls} data-cursor={cursor} target="_blank" rel="noreferrer noopener" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} data-cursor={cursor} {...rest}>
        {children}
      </Link>
    );
  }
  const rest = omitOwn(props as ButtonProps) as Omit<ButtonProps, keyof BaseProps | "href">;
  return (
    <button type="button" className={cls} data-cursor={cursor} {...rest}>
      {children}
    </button>
  );
}
