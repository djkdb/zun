import Link from "next/link";
import { ZunCharacter } from "@/components/character";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100svh] flex-col items-center justify-center bg-bg bg-grid mask-fade-y px-6 text-center">
      <ZunCharacter pose="surprise" size={120} label="ZUN looking surprised" />
      <p className="eyebrow mt-8">404 / NOT FOUND</p>
      <h1 className="section-title mt-3 text-3xl text-fg sm:text-4xl">PAGE NOT BUILT (YET).</h1>
      <p className="prose-ko mt-4 max-w-sm text-fg-muted">이 주소에는 아직 아무것도 없습니다. 홈으로 돌아가서 다시 탐험해 주세요.</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center bg-accent px-5 py-2.5 font-mono text-sm uppercase tracking-[0.14em] text-white hover:bg-accent-strong pixel-corners"
      >
        [ BACK TO ZUN ]
      </Link>
    </main>
  );
}
