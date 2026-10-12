
/**
 * Beats for Scenes 08–10 (local frames, 30 fps). Source: docs/STORYBOARD.md (v2).
 * Adjusted by a few frames where the reading rule or an incoming / outgoing dissolve
 * needs it (noted inline).
 */

/** Scene 08 — Impact (170 f, hard cut in; the last 10 f are inside the dissolve to 09). */
export const S08 = {
  /** First pop-up — 10 f clear of the cut from Scene 07. */
  first: 10,
  /** One pop-up every 22 f; at most two on screen. */
  spacing: 22,
  /** The oldest pop-up finishes its 14 f exit before the third one arrives. */
  exitLead: 14,
  /** Everything has left by this frame — Scene 09 dips in over the last 10 f. */
  clearBy: 158,
} as const;

export const s08Start = (i: number) => S08.first + i * S08.spacing;

/** When pop-up i starts to leave: before pop-up i + 2 arrives, and always before the dip. */
export const s08Exit = (i: number, count: number) => {
  const beforeThird = i + 2 < count ? s08Start(i + 2) - S08.exitLead : Infinity;
  const lastExit = S08.clearBy - 14 - (count - 1 - i) * 6;
  return Math.min(beforeThird, lastExit);
};

/**
 * Scene 09 — The Human Outcome (210 f). Enters on a 10 f dip to warm paper (in the dark
 * for its first 5 f, fading up over the next 5) and leaves on a 10 f dip to ink from 200:
 * type only from 14, and fully on by 190.
 */
export const S09 = {
  /** Line i rises at `at` over `dur`; earlier lines dim when the next one rises. */
  lines: [
    { at: 14, dur: 24 }, // storyboard 14–40: 2 f clear of the dip
    { at: 90, dur: 22 }, // storyboard 96–114: line 1 holds alone 52 f (the pause); this one 20 f before the answer
    { at: 132, dur: 22 }, // storyboard 140–165 → lands 154: 46 f still before the outgoing dip (200)
  ],
  /** When copy wraps, each further line of the same sentence follows this many frames later. */
  wrapStagger: 5,
  /** Opacity an earlier line settles to once the next one arrives. */
  dimTo: [0.36, 0.42],
  /** Slow push from medium towards close (picture layer only). */
  push: { from: 1.0, to: 1.2 },
  /** Warm key light on his face rises a little as "a better way" lands (HeroShot's key is stronger per unit now). */
  key: { from: 0.14, to: 0.46, at: 132, dur: 60 },
} as const;

/**
 * Scene 10 — Final Message & End Card (330 f). Enters on a 10 f dip to ink (dark for its
 * first 5 f, fading up over the next 5): no type before 12.
 */
export const S10 = {
  /** Slow push on the pile / line picture (text never scales). */
  push: { from: 1.0, to: 1.03, until: 66 },
  /** "MANUAL" rises over the dim pile — after the incoming dip. Readable 12 → ≈ 34 (22 f). */
  fromIn: 12,
  fromDur: 16,
  /**
   * The orange hairline sweeps left → right; behind it the pile folds into one line and the
   * word wipes from MANUAL to AUTOMATED. 24 f on glide(v, v) (enters and leaves frame already
   * moving): ≈ 84 px/f on average, ≤ 96 px/f at its fastest, with a shutter trail — it glides,
   * never strobes. It reaches MANUAL's light front at ≈ 34 and has passed AUTOMATED by ≈ 43,
   * so AUTOMATED holds whole ≥ 21 f before it leaves. The light leads from the line, so once
   * it is just past 1920 the dim desk is gone — no pop.
   */
  sweep: { at: 24, dur: 24, x0: -40, x1: 1970, v: 0.7 },
  /** Each artefact folds flat over this many frames once the sweep reaches it. */
  collapse: 10,
  /** The one sheet that stays squares up over this many frames. */
  settle: 16,
  /** AUTOMATED, his line and the sheet leave together; the same warm light stays for the final lines. */
  callbackOut: 64,
  callbackOutDur: 8,
  /** "No previous automation experience." — storyboard 58–80 → 103. Lands 94. */
  line1: { at: 74, dur: 20 },
  /** (10 f pause) then "Just curiosity, ownership, and the drive to improve." — 86 f to the cut. */
  line2: { at: 104, dur: 22, stagger: 6 },
  /** Line 1 steps back as line 2 arrives. */
  line1Dim: 0.42,
  /** Hard cut to ink after the last line has held (lands 132 → 58 f still). */
  cutToInk: 190,
  /**
   * End card — builds in ≈ 32 f from the cut (design system §10: ≤ 35 f), then holds still
   * 108 f (3.6 s) to the last frame.
   */
  endCard: 190,
} as const;
