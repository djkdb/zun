"use client";

import { useOS } from "@/components/os/OSProvider";
import { WALLPAPERS } from "@/components/os/Wallpaper";

export function SettingsApp() {
  const os = useOS();
  return (
    <div className="h-full overflow-auto px-6 py-5 max-[560px]:px-4">
      <h2 className="text-base font-semibold tracking-tight text-fg">System Settings</h2>

      <Row title="외관" note="시스템 설정을 따라 시작하고, 여기서 바꾼 값은 이 브라우저에 기억됩니다.">
        <Switch
          on={os.settings.appearance === "dark"}
          label="다크 모드"
          onChange={(v) => os.setAppearance(v ? "dark" : "light")}
        />
      </Row>

      <Row title="배경화면" note="1번은 코드로 그린 픽셀 배경입니다 — 이미지 파일이 없어 용량이 0입니다.">
        <div />
      </Row>
      <div className="-mt-2 mb-1 flex flex-wrap gap-2.5">
        {WALLPAPERS.map((w) => (
          <button
            key={w.id}
            type="button"
            aria-label={w.name}
            aria-pressed={os.settings.wallpaper === w.id}
            onClick={() => { os.setWallpaper(w.id); os.notify("🖼️", "배경화면 변경", w.name); }}
            style={{ background: w.swatch }}
            className={`h-11 w-[68px] rounded-lg border-2 transition-colors ${
              os.settings.wallpaper === w.id ? "border-accent" : "border-transparent hover:border-line-strong"
            }`}
          />
        ))}
      </div>

      <Row
        title="동작 줄이기"
        note={`시스템의 prefers-reduced-motion을 따릅니다. 현재 적용: ${os.reduce ? "켜짐 — 애니메이션 최소" : "꺼짐"}`}
      >
        <Switch on={os.settings.motion} label="애니메이션" onChange={os.setMotion} />
      </Row>

      <Row title="사운드" note="창을 열고 닫을 때 아주 짧은 신호음. 기본값은 꺼짐이고, 자동 재생하지 않습니다.">
        <Switch on={os.settings.sound} label="효과음" onChange={(v) => { os.setSound(v); if (v) os.beep("open"); }} />
      </Row>

      <Row
        title="일반 보기"
        note="컨셉이 맞지 않는 방문자를 위해 같은 데이터를 평범한 스크롤 사이트로 보여줍니다. 내용은 /data 한 곳에서 나오므로 갈라지지 않습니다."
      >
        <a
          href="/classic"
          className="flex-none rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-bg hover:bg-accent-strong"
        >
          전환
        </a>
      </Row>

      <Row title="About ZUN OS" note="ZUN OS 1.0 · Next.js 16 · React 19 · Three.js — 정적 배포, 서버 없음.">
        <button
          type="button"
          onClick={() => os.openApp("about")}
          className="flex-none rounded-lg border border-line-strong px-3.5 py-1.5 text-xs text-fg hover:bg-bg-3/60"
        >
          열기
        </button>
      </Row>
    </div>
  );
}

function Row({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 border-t border-line py-3.5 first-of-type:border-t-0">
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-fg">{title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-fg-dim">{note}</p>
      </div>
      {children}
    </div>
  );
}

function Switch({ on, label, onChange }: { on: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 flex-none rounded-full transition-colors ${on ? "bg-ok" : "bg-line-strong"}`}
    >
      <span
        aria-hidden
        className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
