import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = "ZUN — Software × AI × Product";
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const cell = 12;
  const z = [
    "ZZZZZZ",
    "....ZZ",
    "...ZZ.",
    "..ZZ..",
    ".ZZ...",
    "ZZZZZZ",
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(180deg,#0b1226 0%,#070b18 100%)",
          color: "#f2f4fa",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,205,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,205,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {z.map((row, y) => (
              <div key={y} style={{ display: "flex" }}>
                {row.split("").map((c, x) => (
                  <div
                    key={x}
                    style={{
                      width: cell,
                      height: cell,
                      background: c === "Z" ? "#3b82f6" : "transparent",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 28, color: "#9aa5c4", letterSpacing: 6 }}>
            $ whoami
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4 }}>
            ZUN
          </div>
          <div style={{ fontSize: 44, color: "#f2f4fa" }}>{profile.tagline}</div>
          <div style={{ fontSize: 30, color: "#60a5fa", letterSpacing: 4 }}>
            {profile.formula}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#66718f",
          }}
        >
          <span>{profile.description}</span>
          <span>{profile.handle}</span>
        </div>
      </div>
    ),
    size,
  );
}
