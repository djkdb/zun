"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOS } from "./OSProvider";
import { WALLPAPERS } from "./Wallpaper";

interface Pos { x: number; y: number }

export function ContextMenu() {
  const os = useOS();
  const router = useRouter();
  const [pos, setPos] = useState<Pos | null>(null);

  useEffect(() => {
    const onMenu = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-window],[data-dock],[data-menubar]")) return;
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
    };
    const close = () => setPos(null);
    window.addEventListener("contextmenu", onMenu);
    window.addEventListener("pointerdown", close);
    return () => {
      window.removeEventListener("contextmenu", onMenu);
      window.removeEventListener("pointerdown", close);
    };
  }, []);

  if (!pos) return null;

  const items: ({ label: string; run: () => void } | "sep")[] = [
    { label: "새 보관함 창", run: () => os.openApp("finder") },
    { label: "터미널 열기", run: () => os.openApp("terminal") },
    "sep",
    { label: "배경화면 바꾸기", run: () => {
        const at = WALLPAPERS.findIndex((w) => w.id === os.settings.wallpaper);
        const next = WALLPAPERS[(at + 1) % WALLPAPERS.length];
        os.setWallpaper(next.id);
        os.notify("🖼️", "배경화면 변경", next.name);
      } },
    { label: os.settings.appearance === "dark" ? "밝은 모드" : "어두운 모드",
      run: () => os.setAppearance(os.settings.appearance === "dark" ? "light" : "dark") },
    "sep",
    { label: "모든 창 닫기 (Refresh)", run: () => { os.closeAll(); os.notify("🧹", "데스크톱 정리", "열려 있던 창을 모두 닫았습니다."); } },
    { label: "일반 보기로 전환", run: () => router.push("/classic") },
  ];

  return (
    <div
      role="menu"
      style={{ left: Math.min(pos.x, window.innerWidth - 220), top: Math.min(pos.y, window.innerHeight - 260) }}
      className="absolute z-[9650] min-w-[210px] rounded-[4px] border border-line-strong bg-bg-2/95 p-1.5 shadow-2xl backdrop-blur-2xl"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {items.map((it, i) =>
        it === "sep" ? (
          <hr key={i} className="mx-2 my-1 border-line" />
        ) : (
          <button
            key={i}
            type="button"
            role="menuitem"
            onClick={() => { setPos(null); it.run(); }}
            className="block w-full rounded-md px-2.5 py-1.5 text-left text-[13px] text-fg hover:bg-select hover:text-white"
          >
            {it.label}
          </button>
        ),
      )}
    </div>
  );
}
