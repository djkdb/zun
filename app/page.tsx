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

/**
 * ZUN — one scroll-based story:
 * DISCOVER (hero, about) → BUILD (journey, projects, loop) → SHARE (activity, content)
 * → LEARN (now) → BUILD AGAIN (future, contact)
 */
export default function Home() {
  return (
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
    </main>
  );
}
