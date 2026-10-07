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
  /**
   * The same request lands in the same place (storyboard 0–18). It is readable from ≈ 8
   * and has settled by ≈ 18, so the viewer recognises Scene 01's request before it changes.
   */
  request: 2,
  /** One click — on the request's action, once the card has settled (storyboard 18). */
  click: 18,
  /** A single calm status resolves (storyboard 18–40): chip clears 19–25, status 23–37. */
  resolve: 19,
  /** His line runs from the request down into one record (the flow takes it from here). */
  line: { at: 25, dur: 12 },
  record: { at: 34, dur: 8 },
  /** 42–56: stillness — nothing happens (his hand is back on his own work by 42). */
  /** One orange line wipes across the same shot → split screen (storyboard 56–74). */
  wipe: { at: 56, dur: 18 },
  /** Small Before / After labels, as the line settles. */
  labels: 70,
  /**
   * Comparison chips, alternating sides, one at a time (storyboard ≈ 12 f apart from 74;
   * 11 f here so the last one has landed by ≈ 187 and holds before the cut).
   */
  chips: { first: 78, spacing: 11, build: 12 },
} as const;
