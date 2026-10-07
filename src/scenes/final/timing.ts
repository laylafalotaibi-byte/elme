import type { Cam } from './geometry';

/**
 * Beats for Scenes 08–10 (local frames, 30 fps). Source: docs/STORYBOARD.md (v2).
 * Adjusted by a few frames where the reading rule or an incoming / outgoing dissolve
 * needs it (noted inline).
 */

/** Scene 08 — Impact (170 f, hard cut in; the last 10 f are inside the dissolve to 09). */
export const S08 = {
  /** First pop-up — 10 f clear of the incoming cut. */
  first: 10,
  /**
   * Pop-up spacing. Storyboard: 26 f; 22 f here so the sixth (10 + 5 × 22 = 120) is fully
   * built — value and leader — by 148, ≥ 12 f before the outgoing dissolve starts (160).
   */
  spacing: 22,
  /**
   * The oldest pop-up starts to leave this many frames before the third one arrives (its
   * 14 f ease-in exit is still mostly visible then, so this keeps two on screen, not three).
   */
  exitLead: 6,
  /** One slow, even drift on the picture only (linear: it is already moving at the cut). */
  cam: {
    from: { scale: 1.035, x: 40, y: 8 } satisfies Cam,
    to: { scale: 1.075, x: -60, y: -10 } satisfies Cam,
  },
} as const;

export const s08Start = (i: number) => S08.first + i * S08.spacing;

/** Scene 09 — The Human Outcome (210 f, 10 f dissolve in, 10 f dissolve out). */
export const S09 = {
  /** Line i rises at `at` over `dur`; earlier lines dim when the next one rises. */
  lines: [
    { at: 14, dur: 24 }, // storyboard 14–40
    { at: 90, dur: 22 }, // storyboard 96–114: line 1 holds alone 52 f (the pause); this one 20 f before the answer
    { at: 132, dur: 22 }, // storyboard 140–165 → lands 154: ≥ 45 f still before the outgoing dissolve (200)
  ],
  /** Opacity an earlier line settles to once the next one arrives. */
  dimTo: [0.36, 0.42],
  /** Slow push from medium towards close (picture layer only). */
  push: { from: 1.0, to: 1.2 },
  /** Warm key light on his face rises a little as "a better way" lands. */
  key: { from: 0.18, to: 0.55, at: 132, dur: 60 },
} as const;

/** Scene 10 — Final Message & End Card (330 f, 10 f dissolve in). */
export const S10 = {
  /** Slow push on the pile / line picture (text never scales). */
  push: { from: 1.0, to: 1.03, until: 66 },
  /** "MANUAL" rises over the dim pile — after the incoming dissolve. */
  fromIn: 12,
  fromDur: 16,
  /**
   * The orange hairline sweeps left → right; behind it the pile folds into one line.
   * 26 f on a near-linear curve: ≈ 77 px/f on average, ≤ 105 px/f at its fastest, so the
   * line glides rather than strobes (an ease-in-out over 22 f peaked near 290 px/f).
   * The light leads from the line, so once it is just past 1920 the dim desk is gone — no pop.
   */
  sweep: { at: 28, dur: 26, x0: -40, x1: 1970, curve: [0.33, 0.12, 0.67, 0.88] as const },
  /** Each artefact folds flat over this many frames once the sweep reaches it. */
  collapse: 10,
  /** AUTOMATED and his line leave; the same warm light stays for the final lines. */
  callbackOut: 60,
  callbackOutDur: 10,
  /** "No previous automation experience." — storyboard 58–80 → 103. */
  line1: { at: 72, dur: 22 },
  /** (pause) then "Just curiosity, ownership, and the drive to improve." — storyboard 117–150 → 190. */
  line2: { at: 110, dur: 22, stagger: 6 },
  /** Line 1 steps back as line 2 arrives. */
  line1Dim: 0.42,
  /** Hard cut to ink after the last line has held (lands 138 → 52 f). */
  cutToInk: 190,
  /**
   * End card — builds in ≤ 35 f from the cut (design system §10), then holds still
   * ≥ 3.5 s to the last frame.
   */
  endCard: 190,
} as const;
