# ZUN character assets

1. Put the official 8×4 sprite sheet here as `zun-sheet.png` (poses 01–32, ideally with a transparent background).
2. Run `npm run character:split`.
   → writes `poses/01.png` … `poses/32.png` (labels erased, background cleared, trimmed)
   → regenerates `data/character-manifest.ts` with `available: true`
3. Pose → cell mapping lives in `data/character.ts`.

Until then the site renders the code-drawn SVG fallback (`components/character/poses.ts`).
