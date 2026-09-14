/**
 * ZUN character palette — one char per colour in the pose grids.
 * "." is transparent. Keep this tiny: pixel art reads best with few colours.
 */
export const PALETTE: Record<string, string> = {
  K: "#0a0d1a", // outline
  H: "#1e2340", // hair (black, lifted so it reads on navy)
  C: "#1b2b5c", // cap navy
  c: "#12204a", // cap brim (darker navy)
  Z: "#3b82f6", // electric blue (logo, hoodie strings, props)
  z: "#93c5fd", // light blue (screen glow, highlights)
  S: "#f6d3b5", // skin
  s: "#e5b596", // skin shade
  W: "#ffffff", // white
  E: "#12162a", // eye
  M: "#b4555f", // mouth
  N: "#23335f", // hoodie navy
  n: "#182648", // hoodie dark (pocket, folds)
  P: "#0f1630", // pants
  F: "#e9edf7", // sneaker
  f: "#9aa5c4", // sneaker sole
  L: "#8b93a7", // laptop / metal
  l: "#4b5470", // laptop dark
  G: "#6b7590", // gray prop
  Y: "#fbbf24", // yellow (idea / bulb) — sparingly
  O: "#f472b6", // pink (flask) — sparingly
  R: "#c2410c", // book cover
};
