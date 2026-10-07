/**
 * His line — geometry shared by Scene 05 (the learner's sketch on his screen) and
 * Scene 06 (the same line, swung vertical, becoming the workflow).
 *
 * Scene 05's screen insert has one slow push (INSERT_CAMERA); the sketch is laid out in
 * FRAME coordinates before that push. Scene 06 starts on exactly Scene 05's last frame —
 * the straight sketch line as the push leaves it (`sketchLineAtCut`) — then swings it into
 * the vertical SPINE (Scene 06 WORLD coordinates; at camera scale 1 they equal frame
 * coordinates).
 */

export type Pt = { x: number; y: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });

/* ------------------------------------------------------------ Scene 05 sketch */

// Drafts are designed on a small grid and placed into the frame with one transform, so
// the whole sketch can be resized without redrawing it.
const DESIGN_CENTER = { x: 920, y: 600 };
const PLACE = { x: 880, y: 588, k: 1.28 };
const P = (x: number, y: number): Pt => ({ x: PLACE.x + (x - DESIGN_CENTER.x) * PLACE.k, y: PLACE.y + (y - DESIGN_CENTER.y) * PLACE.k });
const pathOf = (pts: Pt[]) => `M ${pts[0].x} ${pts[0].y} C ${pts[1].x} ${pts[1].y}, ${pts[2].x} ${pts[2].y}, ${pts[3].x} ${pts[3].y}`;

/** Where the learner's line runs on the Scene 05 insert (frame coordinates, before the push). */
export const SKETCH = {
  start: P(640, 600),
  end: P(1200, 600),
  /** Dashed placeholder boxes at either end (start = the form, end = the record). */
  boxA: { ...P(590, 600), size: 96 },
  boxB: { ...P(1250, 600), size: 96 },
  strokeWidth: 3.4,
} as const;

/** A cubic path with a fixed structure, so drafts can morph into the straight line. */
export type Curve = { start: Pt; segs: Array<[Pt, Pt, Pt]> };

export const curveToPath = (c: Curve) =>
  `M ${c.start.x} ${c.start.y} ` + c.segs.map(([a, b, p]) => `C ${a.x} ${a.y}, ${b.x} ${b.y}, ${p.x} ${p.y}`).join(' ');

export const lerpCurve = (a: Curve, b: Curve, t: number): Curve => ({
  start: lerpPt(a.start, b.start, t),
  segs: a.segs.map((seg, i) => [lerpPt(seg[0], b.segs[i][0], t), lerpPt(seg[1], b.segs[i][1], t), lerpPt(seg[2], b.segs[i][2], t)] as [Pt, Pt, Pt]),
});

/** First draft: a learner's wandering route — a loop back, a detour. Crossed out. */
export const DRAFT_1: Curve = {
  start: P(640, 600),
  segs: [
    [P(690, 600), P(700, 498), P(762, 500)],
    [P(832, 502), P(846, 640), P(786, 662)],
    [P(724, 684), P(744, 556), P(862, 540)],
    [P(962, 526), P(990, 700), P(1080, 690)],
    [P(1150, 682), P(1150, 600), P(1200, 600)],
  ],
};

/** Second draft: closer — one bend too many. Dashed, then committed (solid). */
export const DRAFT_2: Curve = {
  start: P(640, 600),
  segs: [
    [P(720, 600), P(752, 546), P(836, 550)],
    [P(924, 554), P(960, 648), P(1060, 640)],
    [P(1130, 634), P(1150, 600), P(1200, 600)],
  ],
};

/** The same structure as DRAFT_2, straightened: the line he ends up with. */
export const STRAIGHT: Curve = {
  start: P(640, 600),
  segs: [
    [P(720, 600), P(752, 600), P(836, 600)],
    [P(924, 600), P(960, 600), P(1060, 600)],
    [P(1130, 600), P(1150, 600), P(1200, 600)],
  ],
};

/** Two loose hand strokes crossing out the first draft (the first drawn from where his hand already is). */
export const CROSS_OUT: [string, string] = [
  pathOf([P(1118, 478), P(960, 560), P(830, 640), P(716, 700)]),
  pathOf([P(728, 486), P(850, 548), P(980, 628), P(1106, 712)]),
];
export const CROSS_POINTS = {
  first: { from: P(1118, 478), to: P(716, 700) },
  second: { from: P(728, 486), to: P(1106, 712) },
} as const;

/** Scene 05 insert: one slow push on the picture (never on the type). */
export const INSERT_CAMERA = { origin: { x: 900, y: 600 }, zoomEnd: 1.04 } as const;
export const insertToFrame = (p: Pt, zoom: number): Pt => ({
  x: INSERT_CAMERA.origin.x + (p.x - INSERT_CAMERA.origin.x) * zoom,
  y: INSERT_CAMERA.origin.y + (p.y - INSERT_CAMERA.origin.y) * zoom,
});

/** The straight line exactly as Scene 05's last frame shows it (after the push). */
export const sketchLineAtCut = () => ({
  a: insertToFrame(SKETCH.start, INSERT_CAMERA.zoomEnd),
  b: insertToFrame(SKETCH.end, INSERT_CAMERA.zoomEnd),
  strokeWidth: SKETCH.strokeWidth * INSERT_CAMERA.zoomEnd,
});

/* ------------------------------------------------------------ Scene 06 world */

/** The workflow spine: his line, vertical. Steps sit on it from top to bottom. */
export const SPINE = { x: 1000, top: 150, bottom: 790, strokeWidth: 3 } as const;

/** World y of each workflow step (SUBMIT … NOTIFY). NOTIFY sits at the spine's foot. */
export const NODE_Y = [240, 350, 460, 570, 680, 790] as const;

/** Off-frame origins of the site hairlines that converge into the top of the spine. */
export const SITE_ORIGINS_X = [380, 740, 1280, 1660] as const;
export const SITE_ORIGIN_Y = -220;

/** Hairline from a site (off-frame) into the top of the spine, arriving vertically. */
export const sitePath = (x0: number) =>
  `M ${x0} ${SITE_ORIGIN_Y} C ${x0} ${SITE_ORIGIN_Y + 230}, ${SPINE.x} ${SPINE.top - 120}, ${SPINE.x} ${SPINE.top}`;

/** NOTIFY branches: left → first target, right → second target. */
export const BRANCH = { dx: 112, drop: 100 } as const;
export const branchPath = (side: -1 | 1) => {
  const y0 = SPINE.bottom;
  const x1 = SPINE.x + side * BRANCH.dx;
  const y1 = y0 + BRANCH.drop;
  return `M ${SPINE.x} ${y0} C ${SPINE.x} ${y0 + 52}, ${x1} ${y0 + 44}, ${x1} ${y1}`;
};
export const branchEnd = (side: -1 | 1): Pt => ({ x: SPINE.x + side * BRANCH.dx, y: SPINE.bottom + BRANCH.drop });

/**
 * The swing (Scene 06, 0…1): the straight sketch line rotates a quarter turn clockwise
 * about its moving centre — its start rises to the top — while it settles onto the spine.
 * t = 0 is exactly Scene 05's last frame.
 */
export const swingLine = (t: number): { a: Pt; b: Pt } => {
  const cut = sketchLineAtCut();
  const c0 = lerpPt(cut.a, cut.b, 0.5);
  const c1 = { x: SPINE.x, y: (SPINE.top + SPINE.bottom) / 2 };
  const h0 = (cut.b.x - cut.a.x) / 2;
  const h1 = (SPINE.bottom - SPINE.top) / 2;
  const c = lerpPt(c0, c1, t);
  const h = lerp(h0, h1, t);
  const th = (Math.PI / 2) * t;
  const d = { x: Math.cos(th), y: Math.sin(th) };
  return { a: { x: c.x - d.x * h, y: c.y - d.y * h }, b: { x: c.x + d.x * h, y: c.y + d.y * h } };
};
