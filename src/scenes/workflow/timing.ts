/**
 * Beat sheet for Scenes 05 and 06 (local frames, 30 fps). See docs/STORYBOARD.md.
 * Kept in one place so the Scene 06 opening can continue Scene 05's last frame exactly.
 *
 * Reading rule (docs/DESIGN_SYSTEM.md §7): from the start of its reveal a line stays on
 * screen ≥ words / 3.5 s + 0.4 s; nothing is mid-reveal within 10 f of a cut.
 */
export const S05 = {
  /** Close hero shot fades up from black and racks from soft to sharp; rim light only. */
  heroIn: 6,
  heroInDur: 14,
  rackEnd: 32,
  /** Documentary lower-third (only with an approved name; the draft shows the placeholder). Settles before line 1. */
  lowerThird: 10,
  /** Line 1 after ≈ 14 f of silence on the settled picture. 7 words → ≥ 72 f. */
  line1: 34,
  /** Picture and line 1 fade to near-black (line 1 on screen 34 → 106 = 72 f). */
  fadeOut: 96,
  fadeOutEnd: 106,
  /** Line 2 alone, one size larger (key moment: 108 → cut 190 = 82 f). */
  line2: 108,
  /** The warm key starts to rise behind line 2. */
  keyRise: 120,
  /** Hard cut to the screen insert. */
  cut: 190,
  /** Supporting line (11 words → ≥ 106 f): 191 → Scene 06 f10 (119 f). */
  support: 191,
  /**
   * LEARN · EXPERIMENT · BUILD · IMPROVE — each replaces the last (exit lead 3 f, so each
   * holds ≥ 21 f). EXPERIMENT persists over the hero intercut. IMPROVE holds into Scene 06.
   */
  words: [195, 219, 265, 289],
  wordLead: 3,
  wordRise: 14,
  /** The outgoing word is gone 1 f after the next starts to rise (no stacked moment). */
  wordExit: 4,
  /** His cursor reads a line of his notes; focus pulls to the canvas as he turns to it. */
  read: [191, 201] as const,
  /** First draft (dashed; his hand starts it as LEARN gives way) — then two quick strokes cross it out. */
  draft1: [215, 229] as const,
  cross1: [231, 236] as const,
  /** The second stroke lands on the cut to him (cut on action). */
  cross2: [239, 244] as const,
  /**
   * Reverse shot: cut to him (close, warm key, screen light on his face) — he has seen the
   * draft fail. EXPERIMENT stays on screen across both cuts. Cut back: he is trying again.
   */
  intercut: [244, 262] as const,
  /** The crossed-out draft is pushed back while we are on him. */
  draft1Fade: [245, 259] as const,
  /** Second draft (dashed) — the dashes close: committed. */
  draft2: [262, 273] as const,
  solidify: [273, 279] as const,
  /** He takes hold of the middle of the line and straightens it. */
  grab: [277, 284] as const,
  straighten: [285, 297] as const,
} as const;

/** Scene 05's last frame — Scene 06 opens on it. */
export const S05_LAST = 299;
/** Scene 05's length: Scene 06 continues Scene 05's type at S05_END + its own frame. */
export const S05_END = 300;

export const S06 = {
  /** Scene 05's notes, artefacts and drafts leave; the line turns orange and swings vertical. */
  clear: [0, 14] as const,
  /**
   * IMPROVE (from Scene 05 f289, ≥ 21 f) and the supporting line hold, then leave before
   * the swinging line reaches them.
   */
  titlesOut: [10, 18] as const,
  orange: [3, 17] as const,
  swing: [8, 30] as const,
  daylight: [0, 40] as const,
  /**
   * Site hairlines converge into the top of the line (start sites[0] + 3·i, 18 f each) as
   * the swing settles; the small label rises as the first one lands and leaves before the
   * push-in carries it off the top edge. Then, one at a time: the paper form is found
   * beside the top of the line as the camera pushes in → SUBMIT → the form folds into it.
   */
  sites: [14, 41] as const,
  sitesLabel: 31,
  sitesLabelOut: 52,
  paperIn: [35, 45] as const,
  pushIn: [29, 52] as const,
  /** Step arrival (the camera's attention reaches the node). REVIEW dwells for the decision. */
  steps: [43, 58, 73, 108, 123, 138] as const,
  /**
   * Rise of a big step word, then its exit (it lifts out of its mask). Its small label starts
   * to settle `labelDelay` f into that exit — once the big word is mostly gone, so the two
   * never double-expose — and stays to the end.
   */
  wordRise: 12,
  wordExit: 6,
  labelDelay: 3,
  labelSettle: 10,
  /** REVIEW: his hand enters from the frame edge, the options rise, his click resolves it; only then does the line move on. */
  reviewPointer: 69,
  reviewCaption: 77,
  approveClick: 90,
  reviewResume: 95,
  /** Old artefacts fold into the line as it passes. */
  paperFold: [50, 60] as const,
  filesIn: [96, 108] as const,
  filesMerge: [123, 133] as const,
  filesFold: [132, 140] as const,
  emailIn: [110, 120] as const,
  emailFold: [137, 145] as const,
  /** NOTIFY branches out to its targets. */
  branches: [140, 154] as const,
  targets: 148,
  /**
   * One pull-back from NOTIFY's arrival to the whole line. The last step word leaves during
   * it and its label settles in its place. Impact pop-ups: sites as the top of the line comes
   * back into frame (its anchor crosses the top edge at ≈ 158), then records at CENTRALIZE.
   */
  lastWordOut: 158,
  pullBack: [138, 172] as const,
  sitesMetric: 156,
  recordsMetric: 166,
} as const;
