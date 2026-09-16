"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { activities, contentItems, journey, projects } from "@/data";
import { appList } from "./registry";
import { useOS } from "./OSProvider";

interface Hit { icon: string; title: string; kind: string; run: () => void }

export function Spotlight() {
  const os = useOS();
  return (
    <AnimatePresence>
      {os.spotlight && <SpotlightPanel key="spotlight" />}
    </AnimatePresence>
  );
}

/** Mounted only while open, so query and selection start fresh every time. */
function SpotlightPanel() {
  const os = useOS();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => input.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, []);

  const index = useMemo<Hit[]>(() => {
    const out: Hit[] = appList.map((a) => ({
      icon: a.icon, title: a.name, kind: "앱", run: () => os.openApp(a.id),
    }));
    for (const p of projects) {
      out.push({
        icon: p.draft ? "📦" : "🧰",
        title: p.title,
        kind: p.draft ? "프로젝트 (초안)" : "프로젝트",
        run: () => os.openApp("projects", { arg: p.id, title: `Projects — ${p.title}` }),
      });
    }
    for (const j of journey) out.push({ icon: "📅", title: `${j.year} · ${j.title}`, kind: "Journey", run: () => os.openApp("journey") });
    for (const a of activities) out.push({ icon: "🎒", title: a.title, kind: "활동", run: () => os.openApp("monitor") });
    for (const c of contentItems) out.push({ icon: "📸", title: c.title, kind: "콘텐츠", run: () => os.openApp("photos") });
    out.push(
      { icon: "📄", title: "일반 보기 (스크롤 사이트)", kind: "ZUN OS", run: () => router.push("/classic") },
      { icon: "🌓", title: "다크 / 라이트 전환", kind: "설정", run: () => os.setAppearance(os.settings.appearance === "dark" ? "light" : "dark") },
      { icon: "🎮", title: "TERMINAL CITY 실행", kind: "Playground", run: () => os.openApp("playground") },
    );
    return out;
  }, [os, router]);

  const hits = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return index.slice(0, 8);
    return index.filter((h) => (h.title + h.kind).toLowerCase().includes(term)).slice(0, 8);
  }, [index, q]);

  const choose = (h?: Hit) => {
    if (!h) return;
    os.setSpotlight(false);
    h.run();
  };

  return (
    <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: os.reduce ? 0.001 : 0.14 }}
          className="absolute inset-0 z-[9500] flex items-start justify-center bg-black/30 pt-[14vh] backdrop-blur-sm"
          onPointerDown={(e) => { if (e.target === e.currentTarget) os.setSpotlight(false); }}
        >
          <motion.div
            initial={{ scale: os.reduce ? 1 : 0.96, y: os.reduce ? 0 : -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: os.reduce ? 1 : 0.97 }}
            transition={{ duration: os.reduce ? 0.001 : 0.16 }}
            className="w-[min(560px,92%)] overflow-hidden rounded-[4px] border border-line-strong bg-bg-2/92 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 px-5 py-3.5">
              <span aria-hidden className="text-xl text-fg-dim">🔍</span>
              <input
                ref={input}
                id="spotlight-input"
                value={q}
                onChange={(e) => { setQ(e.target.value); setSel(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => (s + 1) % Math.max(hits.length, 1)); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (s - 1 + hits.length) % Math.max(hits.length, 1)); }
                  else if (e.key === "Enter") { e.preventDefault(); choose(hits[sel]); }
                  else if (e.key === "Escape") os.setSpotlight(false);
                }}
                placeholder="ZUN OS 안에서 찾기"
                aria-label="ZUN OS 안에서 찾기"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-lg text-fg outline-none placeholder:text-fg-dim"
              />
            </div>
            <div className="max-h-[320px] overflow-auto border-t border-line">
              {hits.length === 0 && (
                <p className="px-5 py-4 text-sm text-fg-dim">결과 없음</p>
              )}
              {hits.map((h, i) => (
                <button
                  key={`${h.kind}-${h.title}-${i}`}
                  type="button"
                  onPointerEnter={() => setSel(i)}
                  onClick={() => choose(h)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left text-[13.5px] ${
                    i === sel ? "bg-select text-white" : "text-fg"
                  }`}
                >
                  <span aria-hidden className="w-6 flex-none text-center text-lg">{h.icon}</span>
                  <span className="flex-1 truncate">{h.title}</span>
                  <span className={`font-mono text-[10.5px] ${i === sel ? "text-white" : "text-fg-dim"}`}>
                    {h.kind}
                  </span>
                </button>
              ))}
            </div>
      </motion.div>
    </motion.div>
  );
}
