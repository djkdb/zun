import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { BuildLoop } from "@/components/sections/BuildLoop";
import { Activities } from "@/components/sections/Activities";
import { Content } from "@/components/sections/Content";
import { Now } from "@/components/sections/Now";
import { Future } from "@/components/sections/Future";
import { Contact } from "@/components/sections/Contact";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/navigation/Navbar";

export const metadata: Metadata = {
  title: "일반 보기",
  description: "ZUN OS와 같은 데이터로 렌더되는 평범한 스크롤 포트폴리오.",
};

/**
 * ESCAPE HATCH — the same /data, rendered as an ordinary scrolling page for
 * anyone who does not want the desktop. One data source, two renderers.
 */
export default function Classic() {
  return (
    <SmoothScroll>
      <Navbar />
      <main id="main" className="relative">
        <Hero />
        <About />
        <Journey />
        <Projects />
        <BuildLoop />
        <Activities />
        <Content />
        <Now />
        <Future />
        <Contact />
        <div className="flex justify-center px-6 pb-16">
          <Link
            href="/"
            className="rounded-full border border-line-strong px-5 py-2 font-mono text-xs text-fg-muted transition-colors hover:border-accent hover:text-fg"
          >
            ← ZUN OS 데스크톱으로 돌아가기
          </Link>
        </div>
      </main>
    </SmoothScroll>
  );
}
