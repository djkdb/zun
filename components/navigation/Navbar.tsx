"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/lib/scroll";
import { links } from "@/data/profile";
import { ALL_SECTIONS, NAV_ITEMS } from "./nav";

/**
 * Compact floating navigation.
 * - hidden while the hero is on screen, slides in after
 * - hides on scroll-down, returns on scroll-up
 * - highlights the active section
 * - [ MENU ] opens a full overlay (also the mobile nav)
 */
export function Navbar() {
  const pathname = usePathname();
  const hidden = pathname?.startsWith("/play");
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>("hero");
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  // show/hide on scroll direction, never while hero is on screen
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const pastHero = y > window.innerHeight * 0.6;
        const goingUp = y < lastY - 4;
        const goingDown = y > lastY + 4;
        if (!pastHero) setVisible(false);
        else if (goingUp) setVisible(true);
        else if (goingDown) setVisible(false);
        lastY = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active section — deterministic: the last section whose top passed 45% of the viewport
  useEffect(() => {
    const ids = ALL_SECTIONS.map((s) => s.id);
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.scrollY + window.innerHeight * 0.45;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // lock scroll + esc for menu
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  const shown = visible || open;

  if (hidden) return null;

  return (
    <>
      {/* reading progress — the one always-visible wayfinding element */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-accent"
        style={{ scaleX: reduce ? scrollYProgress : progress }}
      />
      <motion.header
        initial={false}
        animate={{ y: shown ? 0 : -80, opacity: shown ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3"
        aria-hidden={!shown}
      >
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex h-11 w-full max-w-3xl items-center justify-between gap-2 bg-bg-1/85 px-2 pl-3 backdrop-blur-md pixel-border"
        >
          <button
            type="button"
            onClick={() => go("hero")}
            className="font-pixel text-sm tracking-widest text-fg hover:text-accent-strong"
            tabIndex={shown ? 0 : -1}
          >
            ZUN
          </button>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    tabIndex={shown ? 0 : -1}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] transition-colors",
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    {isActive && <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-[2px] bg-accent" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            tabIndex={shown ? 0 : -1}
            className="h-8 px-3 font-mono text-[11px] tracking-[0.16em] text-fg ring-1 ring-inset ring-line-strong hover:bg-bg-3"
          >
            {open ? "[ CLOSE ]" : "[ MENU ]"}
          </button>
        </nav>
      </motion.header>

      {/* Always-available menu toggle in the hero (nav is hidden there) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-menu"
        className={cn(
          "fixed right-4 top-4 z-40 h-9 px-3 font-mono text-[11px] tracking-[0.16em] text-fg-muted ring-1 ring-inset ring-line-strong transition-opacity hover:bg-bg-2 hover:text-fg",
          shown && "pointer-events-none opacity-0",
        )}
        tabIndex={shown ? -1 : 0}
      >
        [ MENU ]
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col bg-bg/95 backdrop-blur-md bg-dots"
          >
            <div className="flex h-14 items-center justify-between px-5">
              <span className="font-pixel text-sm tracking-widest">ZUN</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 px-3 font-mono text-[11px] tracking-[0.16em] ring-1 ring-inset ring-line-strong hover:bg-bg-2"
                autoFocus
              >
                [ CLOSE ]
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-1 px-6 sm:px-12">
              {ALL_SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className={cn(
                      "group flex w-full items-baseline gap-4 py-2 text-left font-pixel text-2xl tracking-wide transition-colors sm:text-3xl",
                      active === s.id ? "text-accent-strong" : "text-fg hover:text-accent-strong",
                    )}
                  >
                    <span className="font-mono text-xs text-fg-dim">{String(i).padStart(2, "0")}</span>
                    {s.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 px-6 pb-8 font-mono text-xs tracking-[0.14em] text-fg-muted sm:px-12">
              <li>
                <a href="/play" className="text-accent-strong hover:text-fg" data-cursor="link">
                  3D PLAYGROUND →
                </a>
              </li>
              {links
                .filter((l) => !l.todo && l.href !== "/")
                .map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noreferrer noopener" className="hover:text-fg" data-cursor="link">
                      {l.label.toUpperCase()} ↗
                    </a>
                  </li>
                ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
