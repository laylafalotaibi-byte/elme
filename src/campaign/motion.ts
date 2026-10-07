import { Easing, interpolate, spring } from 'remotion';

/**
 * Campaign motion tokens. BEFORE scenes move faster and busier, AFTER scenes slower and
 * calmer — see docs/DESIGN_SYSTEM.md §6.
 */

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
} as const;

export const dur = {
  before: 12,
  after: 28,
  line: 22,
  word: 18,
  exit: 14,
} as const;

export const stagger = {
  before: 5,
  after: 10,
  word: 4,
} as const;

export const springs = {
  calm: { damping: 200, stiffness: 100, mass: 1 },
  busy: { damping: 16, stiffness: 160, mass: 0.8 },
} as const;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 0→1 progress between `start` and `start + duration`, eased. */
export const progress = (frame: number, start: number, duration: number, easing: (t: number) => number = ease.out) =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], { ...clamp, easing });

/** Linear map with clamping. */
export const mapClamp = (value: number, input: [number, number], output: [number, number], easing?: (t: number) => number) =>
  interpolate(value, input, output, { ...clamp, easing });

/**
 * Visibility envelope: fades in at `start` over `inDur`, holds, and fades out so it is
 * fully gone at `end`. Returns 0…1.
 */
export const envelope = (frame: number, start: number, end: number, inDur = 14, outDur = 14) => {
  if (end <= start) return 0;
  const fadeIn = progress(frame, start, inDur);
  const fadeOut = 1 - progress(frame, end - outDur, outDur, ease.in);
  return Math.min(fadeIn, fadeOut);
};

/** Spring that starts at `start` (frames). */
export const springAt = (frame: number, fps: number, start: number, config: { damping: number; stiffness?: number; mass?: number } = springs.calm, durationInFrames?: number) =>
  spring({ frame: frame - start, fps, config, durationInFrames });

/** Linear interpolation helper. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
