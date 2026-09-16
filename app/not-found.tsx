import { PixelButton } from "@/components/ui/PixelButton";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100svh] flex-col items-center justify-center bg-bg bg-grid mask-fade-y px-6 text-center">
      
      <p className="eyebrow mt-8">404 / NOT FOUND</p>
      <h1 className="section-title mt-3 text-3xl text-fg sm:text-4xl">PAGE NOT BUILT (YET).</h1>
      <p className="prose-ko mt-4 max-w-sm text-fg-muted">이 주소에는 아직 아무것도 없습니다. 홈으로 돌아가서 다시 탐험해 주세요.</p>
      <PixelButton href="/" className="mt-8">
        [ BACK TO ZUN ]
      </PixelButton>
    </main>
  );
}
