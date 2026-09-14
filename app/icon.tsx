import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Pixel "Z" favicon on midnight navy. */
export default function Icon() {
  const px = 8; // 8×8 grid
  const grid = [
    "........",
    ".ZZZZZZ.",
    ".....ZZ.",
    "....ZZ..",
    "...ZZ...",
    "..ZZ....",
    ".ZZZZZZ.",
    "........",
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          background: "#0b1226",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {grid.flatMap((row, y) =>
          row.split("").map((c, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: px,
                height: px,
                background: c === "Z" ? "#3b82f6" : "transparent",
              }}
            />
          )),
        )}
      </div>
    ),
    size,
  );
}
