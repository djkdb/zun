"use client";

import { activities, nowItems, nowUpdated, projects } from "@/data";
import { useOS } from "@/components/os/OSProvider";

const STATUS: Record<string, { label: string; cls: string }> = {
  active: { label: "ACTIVE", cls: "text-ok" },
  shipping: { label: "SHIPPING", cls: "text-accent-strong" },
  exploring: { label: "EXPLORING", cls: "text-warn" },
  paused: { label: "IDLE", cls: "text-fg-dim" },
};

/**
 * Activity Monitor — every figure here is portfolio-world data pulled from
 * /data. Nothing reads the visitor's machine.
 */
export function ActivityMonitor() {
  const os = useOS();
  const shipped = projects.filter((p) => !p.draft).length;
  const drafts = projects.length - shipped;

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-3 gap-px border-b border-line bg-line max-[560px]:grid-cols-1">
        <Stat label="배포된 프로젝트" value={String(shipped)} note="Cloudflare" />
        <Stat label="정리 중인 초안" value={String(drafts)} note="설명 미작성" />
        <Stat label="진행 중인 트랙" value={String(nowItems.length)} note={nowUpdated ?? "—"} />
      </div>

      <section className="px-5 pb-6 pt-4 max-[560px]:px-4">
        <h3 className="font-mono text-[10.5px] tracking-wider text-fg-dim">프로세스</h3>
        <table className="mt-2 w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[10.5px] text-fg-dim">
              <th className="py-2 pr-3 font-bold">PROCESS</th>
              <th className="py-2 pr-3 font-bold max-[560px]:hidden">NOTE</th>
              <th className="py-2 font-bold">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {nowItems.map((n) => {
              const s = STATUS[n.status] ?? STATUS.paused;
              return (
                <tr key={n.id} className="border-b border-line/60">
                  <td className="py-2 pr-3 text-fg">{n.label}</td>
                  <td className="py-2 pr-3 text-[12px] text-fg-dim max-[560px]:hidden">{n.note}</td>
                  <td className={`py-2 font-mono text-[11px] ${s.cls}`}>{s.label}</td>
                </tr>
              );
            })}
            {activities.map((a) => (
              <tr key={a.id} className="border-b border-line/60">
                <td className="py-2 pr-3 text-fg">{a.title}</td>
                <td className="py-2 pr-3 text-[12px] text-fg-dim max-[560px]:hidden">{a.category}</td>
                <td className="py-2 font-mono text-[11px] text-fg-dim">
                  {a.draft ? "DRAFT" : "LOGGED"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-5 text-[11.5px] leading-relaxed text-fg-dim">
          여기 숫자는 전부 <span className="font-mono text-fg-muted">/data</span>에서 옵니다. 방문자의 컴퓨터는
          읽지 않습니다.
        </p>

        <button
          type="button"
          onClick={() => os.openApp("finder", { arg: "drafts", title: "ZUN — 초안" })}
          className="mt-4 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-bg hover:bg-accent-strong"
        >
          초안 {drafts}개 보기 →
        </button>
      </section>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bg-bg-2 px-4 py-3.5">
      <p className="font-mono text-[10.5px] tracking-wider text-fg-dim">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-fg">{value}</p>
      <p className="mt-0.5 font-mono text-[10.5px] text-fg-dim">{note}</p>
    </div>
  );
}
