"use client";

import { projects } from "@/data";
import { useOS } from "@/components/os/OSProvider";

/**
 * Trash — the projects that did not ship, and why. The research on Korean
 * hiring feedback kept naming this as the thing almost nobody shows.
 */
const DISCARDED = [
  {
    name: "3D 자동차 포트폴리오",
    reason: "중단 · 클리셰",
    body: "만들고 나서 원본 저장소 포크가 1,000개인 걸 알았다. 참신함 예산을 클리셰에 썼다.",
  },
  {
    name: "가짜 Windows 데스크톱",
    reason: "기각 · 모바일",
    body: "데스크톱 모양이라 모바일 재현이 불가능하다. win11React가 같은 이유로 아카이브됐다 — 그래서 ZUN OS는 모바일부터 설계했다.",
  },
];

export function TrashApp() {
  const os = useOS();
  const drafts = projects.filter((p) => p.draft);

  return (
    <div className="h-full overflow-auto px-6 py-5 max-[560px]:px-4">
      <p className="font-mono text-[10.5px] tracking-wider text-fg-dim">무덤 — 배포되지 않은 것들</p>

      <div className="mt-3">
        {DISCARDED.map((d) => (
          <div key={d.name} className="border-t border-line py-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[14px] text-fg-dim line-through decoration-[#f87171] decoration-2">{d.name}</p>
              <span className="rounded border border-[#f87171]/35 bg-[#f87171]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#f87171]">
                {d.reason}
              </span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-fg-dim">{d.body}</p>
          </div>
        ))}

        {drafts.map((p) => (
          <div key={p.id} className="border-t border-line py-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[14px] text-fg-muted">{p.title}</p>
              <span className="rounded border border-warn/35 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] text-warn">
                배포됨 · 설명 없음
              </span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-fg-dim">
              살아 있는 주소는 있는데 왜 만들었는지 정리가 안 됐다.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-xl border border-line bg-bg-1/50 p-4 text-center">
        <p className="text-[13.5px] text-fg">전부 배포되지는 않는다.</p>
        <p className="mt-1 text-[13.5px] text-fg-muted">어떤 것은 경험이 된다.</p>
      </div>

      <button
        type="button"
        onClick={() => os.openApp("finder", { arg: "drafts", title: "ZUN — 초안" })}
        className="mt-5 rounded-lg border border-line-strong px-3.5 py-1.5 text-xs text-fg hover:bg-bg-3/60"
      >
        초안 목록 열기
      </button>
    </div>
  );
}
