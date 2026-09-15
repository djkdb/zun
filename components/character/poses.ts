import type { PoseName } from "@/data/types";

export type CorePose =
  | "idle" | "think" | "walk" | "build" | "phone" | "book" | "point" | "telescope" | "wave" | "surprise" | "experiment";

/**
 * ZUN sprite = HEAD (shared) + EYES (separate, so they can look around/blink)
 * + POSE (full-height overlay: body, arms, legs, props).
 *
 * Grid: 24 columns × 36 rows. "." = transparent. Chars map to PALETTE.
 * Head occupies rows 0–19, body rows 20–35. A pose may also paint onto head
 * rows (e.g. a hand at the chin) — overlays win over the head layer.
 */
export const SPRITE_W = 24;
export const SPRITE_H = 36;
/** Body grids start at this row. */
export const BODY_ROW_OFFSET = 20;

// prettier-ignore
export const HEAD: string[] = [
  "........KKKKKKKK........", // 0  cap top
  "......KKCCCCCCCCKK......", // 1
  ".....KCCCCCCCCCCCCK.....", // 2
  "....KCCZZZZCCCCCCCCK....", // 3  Z logo
  "....KCCCCCZCCCCCCCCK....", // 4
  "....KCCCCZCCCCCCCCCK....", // 5
  "....KCCZZZZCCCCCCCCK....", // 6
  "..KKKKKKKKKKKKKKKKKKKK..", // 7  brim
  "..KccccccccccccccccccK..", // 8
  "...KKKKKKKKKKKKKKKKKK...", // 9
  "....KHHHHHHHHHHHHHHK....", // 10 hair
  "...KHHHSHHHSSHHHSHHHK...", // 11 fringe
  "...KHSSSSSSSSSSSSSSHK...", // 12 side hair
  "...KHSSSSSSSSSSSSSSHK...", // 13 eyes (drawn by EYES layer)
  "...KSSSSSSSSSSSSSSSSK...", // 14
  "...KSSSSSSSSSSSSSSSSK...", // 15
  "...KSsSSSSSSSSSSSSsSK...", // 16 cheeks
  "....KSSSSSSMMSSSSSSK....", // 17 mouth
  ".....KKSSSSSSSSSSKK.....", // 18 chin
  ".......KKKKKKKKKK.......", // 19
];

/** Eye layer variants (rows 13–16 only; other rows empty). */
// prettier-ignore
export const EYES: Record<"open" | "closed" | "happy" | "wide", string[]> = {
  open: [
    "......WEE.......WEE.....", // 13
    "......EEE.......EEE.....", // 14
    "......EEE.......EEE.....", // 15
    ".......E.........E......", // 16
  ],
  closed: [
    "........................",
    "........................",
    "......EEE.......EEE.....",
    "........................",
  ],
  happy: [
    "........................",
    "......E.E.......E.E.....",
    ".......E.........E......",
    "........................",
  ],
  wide: [
    "......WEE.......WEE.....",
    "......EEE.......EEE.....",
    "......EEE.......EEE.....",
    "......EEE.......EEE.....",
  ],
};
export const EYES_ROW_OFFSET = 13;

/** Optional mouth overrides (row 17). */
// prettier-ignore
export const MOUTHS: Record<"smile" | "open" | "flat", string> = {
  smile: "....KSSSSSSMMSSSSSSK....",
  open:  "....KSSSSSMMMMSSSSSK....",
  flat:  "....KSSSSSSSSSSSSSSK....",
};

const EMPTY = "........................";
const headPad = (rows: string[]) =>
  Array.from({ length: 20 - rows.length }, () => EMPTY).concat(rows);

/**
 * Body layouts. Each array is 16 rows (20–35). Torso cols 7–16, sleeves 5–6 / 17–18.
 * Helper `withHead()` lets a pose paint into head rows (hands near the face).
 */
// prettier-ignore
const BODY_IDLE: string[] = [
  ".......KKKKKKKKKK.......", // 20 hood collar
  "......KNNNNNNNNNNK......", // 21
  ".....KNNNNNNNNNNNNK.....", // 22
  ".....KNNNNZNNZNNNNK.....", // 23 hoodie strings
  ".....KNNNNZNNZNNNNK.....", // 24
  ".....KNNNNNNNNNNNNK.....", // 25
  ".....KNKNNNNNNNNKNK.....", // 26 sleeve seams
  ".....KNKnnnnnnnnKNK.....", // 27 kangaroo pocket
  ".....KSKnnnnnnnnKSK.....", // 28 hands
  ".....KKKNNNNNNNNKKK.....", // 29
  ".......KPPPPPPPPK.......", // 30 pants
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33 sneakers
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];

// prettier-ignore
const BODY_THINK: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNK......", // 21
  ".....KNNNNNNNNNNNNKKK...", // 22 right arm bends up (drawn in head rows too)
  ".....KNNNNZNNZNNNNNNK...", // 23
  ".....KNNNNZNNZNNNKKK....", // 24
  ".....KNNNNNNNNNNNNK.....", // 25
  ".....KNKNNNNNNNNNNK.....", // 26
  ".....KNKnnnnnnnnnnK.....", // 27
  ".....KSKnnnnnnnnnnK.....", // 28
  ".....KKKNNNNNNNNKKK.....", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];
// hand at the chin (rows 17–19, right side of face)
// prettier-ignore
const THINK_HEAD_OVERLAY: string[] = headPad([
  "..................KK....", // 17
  "..................KSK...", // 18
  "..................KSK...", // 19
]);

// prettier-ignore
const BODY_WALK_A: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNK......", // 21
  ".....KNNNNNNNNNNNNK.....", // 22
  "....KNNNNNZNNZNNNNNK....", // 23 arms swing out
  "....KNKNNNZNNZNNNKNK....", // 24
  "....KNKNNNNNNNNNNKNK....", // 25
  "....KSKNNNNNNNNNNKNK....", // 26 left hand forward
  ".....KKnnnnnnnnnnKSK....", // 27
  ".......KnnnnnnnnKKK.....", // 28
  ".......KNNNNNNNNK.......", // 29
  ".......KPPPPPPPPK.......", // 30
  "......KPPPPKKPPPPK......", // 31 legs apart
  ".....KPPPK....KPPPK.....", // 32
  "....KFFFFK....KFFFFK....", // 33
  "....KffffK....KffffK....", // 34
  "....KKKKKK....KKKKKK....", // 35
];
// prettier-ignore
const BODY_WALK_B: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNK......", // 21
  ".....KNNNNNNNNNNNNK.....", // 22
  "....KNNNNNZNNZNNNNNK....", // 23
  "....KNKNNNZNNZNNNKNK....", // 24
  "....KNKNNNNNNNNNNKNK....", // 25
  "....KNKNNNNNNNNNNKSK....", // 26 right hand forward
  "....KSKnnnnnnnnnnKK.....", // 27
  ".....KKKnnnnnnnnK.......", // 28
  ".......KNNNNNNNNK.......", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31 legs together
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];

// prettier-ignore
const BODY_BUILD: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNK......", // 21
  ".....KNNNNNNNNNNNNK.....", // 22
  ".....KNNNNZNNZNNNNK.....", // 23
  ".....KNKNNZNNZNNKNK.....", // 24 arms forward
  ".....KNKKKKKKKKKKNK.....", // 25 laptop lid top
  ".....KSKLzzzzzzLKSK.....", // 26 screen
  ".....KKKLzzzzzzLKKK.....", // 27
  "......KKLLLLLLLLKK......", // 28 keyboard deck
  "......KLLLLLLLLLLK......", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];

// prettier-ignore
const BODY_PHONE: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNK......", // 21
  ".....KNNNNNNNNNNNNKKK...", // 22 right arm up holding phone
  ".....KNNNNZNNZNNNNNNK...", // 23
  ".....KNNNNZNNZNNNKKK....", // 24
  ".....KNNNNNNNNNNNNK.....", // 25
  ".....KNKNNNNNNNNNNK.....", // 26
  ".....KNKnnnnnnnnnnK.....", // 27
  ".....KSKnnnnnnnnnnK.....", // 28
  ".....KKKNNNNNNNNKKK.....", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];
// prettier-ignore
const PHONE_HEAD_OVERLAY: string[] = headPad([
  ".................KKKK...", // 14 phone top
  ".................KzzK...", // 15
  ".................KzzK...", // 16
  ".................KzzK...", // 17
  ".................KKKK...", // 18
  "..................KSK...", // 19 hand
]);

// prettier-ignore
const BODY_BOOK: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNK......", // 21
  ".....KNNNNNNNNNNNNK.....", // 22
  ".....KNNNNZNNZNNNNK.....", // 23
  ".....KNKKKKKKKKKKNK.....", // 24 book top edge
  ".....KNKRWWWKWWWRNK.....", // 25 open book: cover R, pages W, spine K
  ".....KSKRWWWKWWWRSK.....", // 26
  ".....KKKRWWWKWWWRKK.....", // 27
  "......KKKKKKKKKKKK......", // 28
  ".......KNNNNNNNNK.......", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];

// prettier-ignore
const BODY_POINT: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNK......", // 21
  ".....KNNNNNNNNNNNNKKKKKK", // 22 right arm straight out
  ".....KNNNNZNNZNNNNNNNNSK", // 23 pointing hand
  ".....KNNNNZNNZNNNNKKKKKK", // 24
  ".....KNNNNNNNNNNNNK.....", // 25
  ".....KNKNNNNNNNNNNK.....", // 26
  ".....KNKnnnnnnnnnnK.....", // 27
  ".....KSKnnnnnnnnnnK.....", // 28
  ".....KKKNNNNNNNNKKK.....", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];

// prettier-ignore
const BODY_TELESCOPE: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNK......", // 21
  ".....KNNNNNNNNNNNNKK....", // 22 both arms up to the scope
  ".....KNNNNZNNZNNNNNK....", // 23
  ".....KNNNNZNNZNNNKKK....", // 24
  ".....KNNNNNNNNNNNNK.....", // 25
  ".....KNKNNNNNNNNNNK.....", // 26
  ".....KNKnnnnnnnnnnK.....", // 27
  ".....KSKnnnnnnnnnnK.....", // 28
  ".....KKKNNNNNNNNKKK.....", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];
// telescope at the right eye, extending right/up
// prettier-ignore
const TELESCOPE_HEAD_OVERLAY: string[] = headPad([
  "....................KKKK", // 11
  "...................KGGzK", // 12 lens
  "..................KGGKK.", // 13
  ".................KGGK...", // 14
  "................KGGK....", // 15 eyepiece near eye
  "...............KKKK.....", // 16
  "................KSK.....", // 17 hand
  "................KSK.....", // 18
  ".................K......", // 19
]);

// prettier-ignore
const BODY_WAVE: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNKNK....", // 21 right arm raised
  ".....KNNNNNNNNNNNNKNK...", // 22
  ".....KNNNNZNNZNNNKNK....", // 23
  ".....KNNNNZNNZNNNNK.....", // 24
  ".....KNNNNNNNNNNNNK.....", // 25
  ".....KNKNNNNNNNNNNK.....", // 26
  ".....KNKnnnnnnnnnnK.....", // 27
  ".....KSKnnnnnnnnnnK.....", // 28
  ".....KKKNNNNNNNNKKK.....", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];
// prettier-ignore
const WAVE_HEAD_OVERLAY: string[] = headPad([
  "....................KKK.", // 13 open hand
  "...................KSSSK", // 14
  "...................KSSSK", // 15
  "....................KSK.", // 16
  "....................KNK.", // 17 sleeve
  "....................KNK.", // 18
  "....................KNK.", // 19
]);

// prettier-ignore
const BODY_SURPRISE: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNK......", // 21
  "...KKKNNNNNNNNNNNNKKK...", // 22 arms out wide
  "..KSNNNNNNZNNZNNNNNNSK..", // 23
  "..KKKNNNNNZNNZNNNNNKKK..", // 24
  ".....KNNNNNNNNNNNNK.....", // 25
  ".....KNKNNNNNNNNNNK.....", // 26 hmm keep torso seams
  ".....KNKnnnnnnnnnnK.....", // 27
  ".....KKKnnnnnnnnnnK.....", // 28
  ".......KNNNNNNNNK.......", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];

// prettier-ignore
const BODY_EXPERIMENT: string[] = [
  ".......KKKKKKKKKK.......", // 20
  "......KNNNNNNNNNNKKK....", // 21 right arm up with flask
  ".....KNNNNNNNNNNNNNNK...", // 22
  ".....KNNNNZNNZNNNKKK....", // 23
  ".....KNNNNZNNZNNNNK.....", // 24
  ".....KNNNNNNNNNNNNK.....", // 25
  ".....KNKNNNNNNNNNNK.....", // 26
  ".....KNKnnnnnnnnnnK.....", // 27
  ".....KSKnnnnnnnnnnK.....", // 28
  ".....KKKNNNNNNNNKKK.....", // 29
  ".......KPPPPPPPPK.......", // 30
  ".......KPPPKKPPPK.......", // 31
  ".......KPPPKKPPPK.......", // 32
  "......KFFFFKKFFFFK......", // 33
  "......KffffKKffffK......", // 34
  "......KKKKKKKKKKKK......", // 35
];
// flask held up beside the head
// prettier-ignore
const EXPERIMENT_HEAD_OVERLAY: string[] = headPad([
  "....................K...", // 11 bubble
  "...................KzK..", // 12
  "....................K...", // 13
  "...................KKK..", // 14 flask neck
  "...................KWK..", // 15
  "..................KWWWK.", // 16
  ".................KWZZZWK", // 17 liquid (blue)
  ".................KZZZZZK", // 18
  "..................KKSKK.", // 19 hand under flask
]);

export interface PoseFrame {
  body: string[];
  headOverlay?: string[];
  eyes?: keyof typeof EYES;
  mouth?: keyof typeof MOUTHS;
}

export interface PoseDef {
  frames: PoseFrame[];
  /** ms per frame when animated (undefined = static) */
  frameMs?: number;
}

/** Poses the code-drawn SVG can render. Others resolve through SVG_FALLBACK. */
export const POSES: Partial<Record<PoseName, PoseDef>> & Record<CorePose, PoseDef> = {
  idle: { frames: [{ body: BODY_IDLE }] },
  think: { frames: [{ body: BODY_THINK, headOverlay: THINK_HEAD_OVERLAY, mouth: "flat" }] },
  walk: {
    frames: [{ body: BODY_WALK_A }, { body: BODY_WALK_B }],
    frameMs: 260,
  },
  build: { frames: [{ body: BODY_BUILD }] },
  phone: { frames: [{ body: BODY_PHONE, headOverlay: PHONE_HEAD_OVERLAY, eyes: "happy" }] },
  book: { frames: [{ body: BODY_BOOK, headOverlay: undefined }] },
  point: { frames: [{ body: BODY_POINT }] },
  telescope: { frames: [{ body: BODY_TELESCOPE, headOverlay: TELESCOPE_HEAD_OVERLAY, eyes: "closed" }] },
  wave: { frames: [{ body: BODY_WAVE, headOverlay: WAVE_HEAD_OVERLAY, eyes: "happy" }] },
  surprise: { frames: [{ body: BODY_SURPRISE, eyes: "wide", mouth: "open" }] },
  experiment: { frames: [{ body: BODY_EXPERIMENT, headOverlay: EXPERIMENT_HEAD_OVERLAY }] },
};

export const POSE_NAMES = Object.keys(POSES) as CorePose[];
