"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { profile } from "@/data/profile";
import { scrollToId } from "@/lib/scroll";
import { ZunCharacter } from "@/components/character";
import { PixelButton } from "@/components/ui/PixelButton";
import { TerminalIntro } from "./TerminalIntro";

/**
 * HERO — intro sequence (~2s):
 * grid → terminal → typing → character → title → subtitle → CTA.
 * Afterwards the hero keeps breathing (idle bob, blink, eyes follow pointer,
 * slow parallax on scroll).
 */
export function Hero() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState(reduce);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const charY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  // Timeline (seconds)
  const T = reduce
    ? { grid: 0, term: 0, char: 0, title: 0, sub: 0, cta: 0 }
    : { grid: 0, term: 0.15, char: 0.75, title: 1.05, sub: 1.3, cta: 1.5 };
  const ease = [0.22, 1, 0.36, 1] as const;
  const up = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease },
  });

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Intro"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-bg bg-noise"
    >
      {/* background grid */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-grid mask-fade-y"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: T.grid }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 px-5 pb-16 pt-20 sm:px-8 md:grid-cols-[1.15fr_0.85fr] md:gap-8 md:pb-16 md:pt-16">
        {/* LEFT — terminal + title */}
        <motion.div style={{ y: textY, opacity: fade }} className="order-2 flex flex-col items-start md:order-1">
          <motion.div {...up(T.term)} className="w-full">
            <TerminalIntro
              command="whoami"
              lines={[profile.brand, ...profile.roles.slice(0, 3)]}
              startDelay={reduce ? 0 : 350}
              reduce={reduce}
              onDone={() => setTyped(true)}
            />
          </motion.div>

          <motion.h1 {...up(T.title)} className="section-title mt-6 text-3xl text-fg sm:text-5xl md:mt-10 md:text-6xl lg:text-7xl">
            {profile.tagline}
          </motion.h1>

          <motion.p {...up(T.sub)} className="mt-4 font-mono text-sm tracking-[0.2em] text-accent-strong sm:text-base">
            {profile.formula}
          </motion.p>

          <motion.div {...up(T.cta)} className="mt-8 flex flex-wrap items-center gap-3">
            <PixelButton onClick={() => scrollToId("about")} aria-label="Explore ZUN — scroll to About">
              [ EXPLORE ZUN ]
            </PixelButton>
            <span className="font-mono text-xs tracking-[0.14em] text-fg-dim">{profile.taglineAlt}</span>
          </motion.div>
        </motion.div>

        {/* RIGHT — character */}
        <motion.div
          style={{ y: charY, opacity: fade }}
          className="order-1 flex items-end justify-center md:order-2 md:justify-end"
          initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: T.char, ease }}
        >
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-x-[-12%] bottom-0 top-[20%] -z-10 bg-bg-1/60 pixel-border"
            />
            <div className="px-8 pb-4 pt-6 sm:px-12 md:pb-6 md:pt-8">
              <ZunCharacter
                pose="idle"
                sizeClass="w-24 sm:w-32 md:w-44"
                followPointer
                label={typed ? "ZUN pixel character, idle and looking around" : "ZUN pixel character"}
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-bg px-2 font-mono text-[10px] tracking-[0.2em] text-fg-dim">
              ZUN · v2026
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        {...up(T.cta + 0.3)}
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-fg-dim md:flex"
      >
        SCROLL
        <span className="anim-float block h-6 w-px bg-fg-dim" />
      </motion.div>
    </section>
  );
}
