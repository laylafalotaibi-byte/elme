/**
 * Beats for Scene 01 (The Person, 180 f) and Scene 07 (After Automation, 210 f), local
 * frames at 30 fps. Source: docs/STORYBOARD.md (v2); deviations of a few frames are noted.
 */

/** Scene 01 — The Person. */
export const S01 = {
  /** 0 → request: Workspace, he is working (pointer moves a little). */
  /** The request lands on his screen (storyboard 36; −2 f so it reads before the cut). */
  request: 34,
  /** Cut → Hero shot (storyboard 56; −4 f: buys line 2 a longer hold before Scene 02). */
  cut: 52,
  /** "Another device handover." rises (storyboard 60–84). */
  line1: { at: 56, dur: 22 },
  /**
   * "Another manual process." rises beneath it and line 1 dims to 40 % (storyboard
   * 130–152). The two holds are balanced: line 1 holds alone for 40 f (the pause), line 2
   * holds 40 f to the cut (the storyboard gave it 28 f; the cut into Scene 02 is hard).
   */
  line2: { at: 118, dur: 22 },
  line1Dim: 0.4,
  /** Hero shot: one slow push on the picture only (type never scales). */
  heroZoom: { from: 1.0, to: 1.03 },
} as const;

/** Scene 07 — After Automation (match cut of Scene 01's opening). */
export const S07 = {
  /** The same request lands in the same place; readable from ≈ 8, settled by ≈ 18. */
  request: 2,
  /** One click on the request's action (submit). */
  click: 18,
  /** "Submitted digitally" resolves on the card. */
  resolve: 19,
  /**
   * His line runs down to the review node: the options appear, a person decides (a click on
   * the chosen option), and only then does the line continue and the record get generated.
   * Calm, elapsed-time-neutral pacing — no clock, no "seconds later".
   */
  line1: { at: 24, dur: 10 },
  node: { at: 32, dur: 6 },
  options: { at: 34, dur: 12 },
  decideClick: 58,
  decided: { at: 58, dur: 10 },
  line2: { at: 64, dur: 10 },
  record: { at: 72, dur: 10 },
  /** 82–92: stillness — nothing happens. */
  /** One orange line wipes across the same shot → split screen. */
  wipe: { at: 92, dur: 18 },
  /** Small Before / After labels, as the line settles. */
  labels: 104,
  /** Chips arrive in pairs (one per side, never aligned or linked), 17 f apart. */
  chips: { first: 108, spacing: 17, build: 12 },
  /** The split folds away: chips fade and the line slides off left, so the calm frame fills the screen into Scene 08. */
  outro: { at: 192, dur: 16 },
} as const;
