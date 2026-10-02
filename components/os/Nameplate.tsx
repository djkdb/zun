"use client";

import { profile } from "@/data/profile";

/*
  Both numbers come from `traction.stats`, not from counting `projects` here —
  a local count drifted from the About app's figure the moment the two used
  different rules about what counts as a deployment.
*/
const stat = (label: string) => profile.traction.stats.find((s) => s.label === label)?.value ?? "";

/**
 * Who this is, before a single click.
 *
 * Walking the desktop as a recruiter showed the gap: with no window open the
 * screen is emoji icons and a clock, and nothing on it says whose desktop this
 * is. Someone scanning for thirty seconds has to guess which icon answers that,
 * and the cost of guessing wrong is the whole visit.
 *
 * So the desktop states it outright, the way a workstation carries a label.
 * It is text only and `pointer-events-none` — the window layer sitting over the
 * icons and swallowing their clicks was exactly this kind of bug, and a plate
 * laid across the wallpaper is the easiest place to repeat it.
 */
export function Nameplate() {
  return (
    <div
      className="pointer-events-none absolute left-3 top-11 z-[5] max-w-[min(22rem,60vw)] select-none max-[760px]:top-12 max-[760px]:max-w-[82vw]"
      /* decorative restatement of the About app — keep it out of the a11y tree */
      aria-hidden
    >
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-dim drop-shadow-[0_1px_4px_rgba(0,0,0,.85)]">
        {profile.formula}
      </p>
      <p className="mt-1.5 text-[26px] font-bold leading-none text-fg drop-shadow-[0_2px_8px_rgba(0,0,0,.9)] max-[760px]:text-[22px]">
        {profile.name}
        <span className="ml-2 font-mono text-[13px] font-normal tracking-widest text-fg-muted">
          {profile.brand}
        </span>
      </p>
      <p className="mt-1.5 text-[12.5px] leading-snug text-fg-muted drop-shadow-[0_1px_5px_rgba(0,0,0,.9)]">
        {profile.school}
      </p>
      <p className="mt-2 font-mono text-[11px] tabular-nums text-fg-dim drop-shadow-[0_1px_5px_rgba(0,0,0,.9)]">
        배포한 것 {stat("배포한 것")} · {profile.handle} 팔로워 {stat("팔로워")}
      </p>
    </div>
  );
}
