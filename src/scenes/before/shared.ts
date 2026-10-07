import { Easing, interpolate, random } from 'remotion';
import { LIGHT, mixLight, type Light } from '../../campaign/light';
import { ease, mapClamp } from '../../campaign/motion';
import type { BeforeArtifactKind, StoryConfig } from '../../campaign/types';
import { SCREEN_CANVAS } from '../../components/set/Workspace';

/**
 * Shared helpers for the BEFORE stretch of the film (Scenes 02 · 03 · 04).
 * Everything here is deterministic (seeded random, slow sines) — no per-frame jitter.
 */

/** Where the device-handover request lands on his screen (1280×800 canvas) — Scene 01's spot. */
export const REQUEST_SLOT = { x: 700, y: 40, w: 540 } as const;

/** Scene 02: the room darkens as the work piles up (normalDay → dimmed, settled before the hold). */
export const beforeLight = (frame: number): Light =>
  mixLight(LIGHT.normalDay, LIGHT.dimmed, mapClamp(frame, [4, 212], [0, 1], Easing.bezier(0.42, 0, 0.5, 1)));

/** Step caption for an artefact kind (verbatim from the config). */
export const stepLabel = (story: StoryConfig, kind: BeforeArtifactKind): string | null =>
  story.before.steps.find((s) => s.artifact === kind)?.label ?? null;

/* ----------------------------------------------------------------- screen camera */

/** Camera on his screen: zoom 1 = the 1280×800 canvas fills the frame width (1.5×). */
export type Cam = { zoom: number; focus: { x: number; y: number } };

const BASE = 1920 / SCREEN_CANVAS.w;

export const camScale = (cam: Cam) => BASE * cam.zoom;

/** Canvas point → frame point under a screen camera (same maths as <ScreenInsert>). */
export const canvasToFrame = (p: { x: number; y: number }, cam: Cam) => {
  const s = camScale(cam);
  return { x: 960 + (p.x - cam.focus.x) * s, y: 540 + (p.y - cam.focus.y) * s };
};

/** A slow push between two camera keys across a shot. */
export const camBetween = (frame: number, from: number, to: number, a: Cam, b: Cam): Cam => {
  const t = mapClamp(frame, [from, to], [0, 1], ease.inOut);
  return {
    zoom: a.zoom + (b.zoom - a.zoom) * t,
    focus: { x: a.focus.x + (b.focus.x - a.focus.x) * t, y: a.focus.y + (b.focus.y - a.focus.y) * t },
  };
};

/** Same camera, pushed in by `amount` over the shot (≈ 2–3 % keeps it a breath, not a zoom). */
export const pushCam = (frame: number, from: number, to: number, cam: Cam, amount = 0.03): Cam =>
  camBetween(frame, from, to, cam, { ...cam, zoom: cam.zoom * (1 + amount) });

/* ----------------------------------------------------------------- drift */

/**
 * Restless slow drift: a seeded sine per element (≤ amp px, period 48–110 f). Two
 * incommensurate sines per axis so the motion never visibly loops.
 */
export const drift = (frame: number, seed: string, amp = 3) => {
  const p1 = 48 + random(`${seed}-p1`) * 62;
  const p2 = 70 + random(`${seed}-p2`) * 40;
  const ph = random(`${seed}-ph`) * Math.PI * 2;
  const ph2 = random(`${seed}-ph2`) * Math.PI * 2;
  return {
    x: amp * (0.65 * Math.sin((frame / p1) * Math.PI * 2 + ph) + 0.35 * Math.sin((frame / p2) * Math.PI * 2 + ph2)),
    y: amp * 0.7 * (0.6 * Math.sin((frame / p2) * Math.PI * 2 + ph) + 0.4 * Math.sin((frame / p1) * Math.PI * 2 + ph2 * 1.3)),
  };
};

/* ----------------------------------------------------------------- copy */

/**
 * Splits a line of copy into two lines with a calm, top-heavy rag: the second line about
 * two-thirds of the first. Deterministic, so the break never depends on font metrics.
 */
export const splitTwo = (text: string): [string, string] => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 3) return [text, ''];
  let best = 1;
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ').length;
    const b = words.slice(i).join(' ').length;
    const ratio = b / a;
    // ideal ≈ 0.68; a longer second line or a lone last word reads badly
    const score = Math.abs(ratio - 0.68) + (ratio > 1 ? 1 : 0) + (words.length - i === 1 ? 0.6 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
};

/** Linear interpolation of a 2-D point. */
export const mixPoint = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
  x: interpolate(t, [0, 1], [a.x, b.x]),
  y: interpolate(t, [0, 1], [a.y, b.y]),
});
