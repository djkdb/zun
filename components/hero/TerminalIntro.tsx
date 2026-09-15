"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TerminalIntroProps {
  command: string;
  lines: string[];
  /** ms before typing begins */
  startDelay?: number;
  /** ms per character */
  charMs?: number;
  reduce?: boolean;
  onDone?: () => void;
  className?: string;
}

/**
 * `$ whoami` terminal. Types the command, then prints the answer lines.
 * Under reduced motion everything renders immediately.
 */
export function TerminalIntro({ command, lines, startDelay = 250, charMs = 55, reduce, onDone, className }: TerminalIntroProps) {
  const [typedState, setTyped] = useState(0);
  const [shownState, setShown] = useState(0);
  // under reduced motion everything is shown at once (derived, not state, so SSR markup matches)
  const typed = reduce ? command.length : typedState;
  const shown = reduce ? lines.length : shownState;

  useEffect(() => {
    if (reduce) {
      onDone?.();
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const t0 = window.setTimeout(() => {
      for (let i = 1; i <= command.length; i++) {
        timers.push(window.setTimeout(() => !cancelled && setTyped(i), i * charMs));
      }
      const afterType = command.length * charMs + 140;
      lines.forEach((_, i) => {
        timers.push(window.setTimeout(() => !cancelled && setShown(i + 1), afterType + i * 90));
      });
      timers.push(window.setTimeout(() => !cancelled && onDone?.(), afterType + lines.length * 90));
    }, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(t0);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command, lines.length, reduce]);

  const typing = typed < command.length;

  return (
    <div
      className={cn("w-full max-w-md bg-bg-1/80 font-mono text-sm leading-relaxed backdrop-blur-sm pixel-border", className)}
      role="group"
      aria-label="terminal"
    >
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span aria-hidden className="h-2 w-2 bg-fg-dim" />
        <span aria-hidden className="h-2 w-2 bg-fg-dim" />
        <span aria-hidden className="h-2 w-2 bg-accent" />
        <span className="ml-2 text-[11px] tracking-[0.14em] text-fg-dim">zun@portfolio</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-fg-muted">
          <span className="text-accent-strong">$ </span>
          <span className="text-fg">{command.slice(0, typed)}</span>
          {typing && <span aria-hidden className="anim-caret inline-block h-[1em] w-[0.6em] translate-y-[2px] bg-accent-strong" />}
        </p>
        <ul className="mt-2 space-y-0.5" aria-live="polite">
          {lines.map((l, i) => (
            <li
              key={l}
              className={cn(
                "transition-opacity duration-150",
                i < shown ? "opacity-100" : "opacity-0",
                i === 0 ? "font-pixel text-base text-fg" : "text-fg-muted",
              )}
            >
              {i === 0 ? "" : "  "}
              {l}
            </li>
          ))}
        </ul>
        {!typing && shown >= lines.length && (
          <p className="mt-2 text-fg-muted">
            <span className="text-accent-strong">$ </span>
            <span aria-hidden className="anim-caret inline-block h-[1em] w-[0.6em] translate-y-[2px] bg-accent-strong" />
          </p>
        )}
      </div>
    </div>
  );
}
