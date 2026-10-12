import { Easing } from 'remotion';
import { glide, progress } from '../../campaign/motion';
import { NODE_Y, SPINE, type Pt } from './sketch';
import { S06 } from './timing';

/**
 * Scene 06 camera. The picture (world) layer is transformed; type and pop-ups are NOT —
 * they are placed at projected world positions, so they track the picture without ever
 * scaling (no shimmer).
 *
 *   establishing (scale 1)  → push in onto the top of the line (scale TRACK.scale)
 *   → track down the line, settling briefly on each step, holding on REVIEW for the decision
 *   → one pull-back to the whole line (scale 1).
 */

export const TRACK = {
  scale: 1.8,
  /** Where the attention point (the step being reached) sits in frame while tracking. */
  anchor: { x: 760, y: 560 },
} as const;

/** Final framing after the pull-back (world point at frame centre, scale): the whole line, a little closer. */
export const END_FRAMING = { c: { x: 905, y: 515 }, s: 1.06 };
const END = END_FRAMING;
const START = { c: { x: 960, y: 540 }, s: 1 };

/** Push-in: an unhurried start and a long settle (calmer than ease.inOut). */
const MOVE = Easing.bezier(0.42, 0, 0.18, 1);
/**
 * Pull-back: starts with NOTIFY's arrival and is front-loaded, so the top of the line (where
 * the sites pop-up is pinned) is back in frame by ≈ f158; the step names ride the move in
 * from the top edge at ≤ ≈ 43 px/f (a peaky curve would strobe them).
 */
const PULL = Easing.bezier(0.3, 0.2, 0.35, 1);

/** Step arrival frames (one per node). */
export const stepTimes = (count: number): number[] => {
  if (count === S06.steps.length) return [...S06.steps];
  const first = S06.steps[0];
  const last = S06.steps[S06.steps.length - 1];
  return Array.from({ length: count }, (_, i) => first + ((last - first) * i) / Math.max(1, count - 1));
};

/** World y of each node for `count` steps (Story 01: NODE_Y). */
export const nodeYs = (count: number): number[] => {
  if (count === NODE_Y.length) return [...NODE_Y];
  return Array.from({ length: count }, (_, i) => NODE_Y[0] + ((SPINE.bottom - NODE_Y[0]) * i) / Math.max(1, count - 1));
};

type FocusKey = { f: number; y: number; v: number };

/** Keys for the attention point: one per step, plus a hold after the step that asks for a decision. */
const focusKeys = (ys: number[], times: number[], holdAfter: number | null): FocusKey[] => {
  const keys: FocusKey[] = [];
  ys.forEach((y, i) => {
    const isEnd = i === 0 || i === ys.length - 1;
    const v = holdAfter === i ? 0 : isEnd ? 0.3 : 0.6;
    keys.push({ f: times[i], y, v });
    if (holdAfter === i) keys.push({ f: S06.reviewResume, y, v: 0 });
  });
  keys.push({ f: times[times.length - 1] + 30, y: ys[ys.length - 1] + 50, v: 0 });
  return keys;
};

const focusAt = (frame: number, keys: FocusKey[]) => {
  if (frame <= keys[0].f) return keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (frame <= b.f) {
      if (a.y === b.y) return a.y;
      const t = progress(frame, a.f, b.f - a.f, glide(a.v, b.v));
      return a.y + (b.y - a.y) * t;
    }
  }
  return keys[keys.length - 1].y;
};

export type Cam = { s: number; c: Pt };

export const workflowCamera = (frame: number, ys: number[], times: number[], holdAfter: number | null): Cam => {
  const wIn = progress(frame, S06.pushIn[0], S06.pushIn[1] - S06.pushIn[0], MOVE);
  const wOut = progress(frame, S06.pullBack[0], S06.pullBack[1] - S06.pullBack[0], PULL);
  const w = wIn * (1 - wOut);
  const base = frame < S06.pullBack[0] ? START : END;
  const fy = focusAt(frame, focusKeys(ys, times, holdAfter));
  const track = {
    s: TRACK.scale,
    c: { x: SPINE.x + (960 - TRACK.anchor.x) / TRACK.scale, y: fy + (540 - TRACK.anchor.y) / TRACK.scale },
  };
  const s = Math.exp(Math.log(base.s) * (1 - w) + Math.log(track.s) * w);
  return { s, c: { x: base.c.x + (track.c.x - base.c.x) * w, y: base.c.y + (track.c.y - base.c.y) * w } };
};

/** World → frame. */
export const project = (cam: Cam, p: Pt): Pt => ({ x: 960 + (p.x - cam.c.x) * cam.s, y: 540 + (p.y - cam.c.y) * cam.s });

/** CSS transform for the world layer (transform-origin 0 0). */
export const worldTransform = (cam: Cam) => `translate(${960 - cam.c.x * cam.s}px, ${540 - cam.c.y * cam.s}px) scale(${cam.s})`;
