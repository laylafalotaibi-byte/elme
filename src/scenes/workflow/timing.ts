/**
 * Beat sheet for Scenes 05 and 06 (local frames, 30 fps). See docs/STORYBOARD.md.
 * Kept in one place so the Scene 06 opening can freeze Scene 05's last frame exactly.
 */
export const S05 = {
  /** Hero shot fades up from black and racks from soft to sharp. */
  heroIn: 10,
  rackEnd: 40,
  lowerThird: 14,
  line1: 22,
  /** Picture and line 1 fade to near-black. */
  fadeOut: 94,
  fadeOutEnd: 108,
  line2: 110,
  /** The warm key starts to rise behind line 2. */
  keyRise: 124,
  /** Hard cut to the screen insert. */
  cut: 198,
  support: 201,
  /** LEARN · EXPERIMENT · BUILD · IMPROVE — each replaces the last. */
  words: [207, 230, 256, 278],
  /** His cursor reads a line of his notes, then traces the little figure he is learning from; then focus pulls to the canvas. */
  read: [200, 218] as const,
  /** First draft (dashed) — then two quick strokes cross it out. */
  draft1: [229, 242] as const,
  cross1: [244, 248] as const,
  cross2: [251, 255] as const,
  draft1Fade: [258, 272] as const,
  /** Second draft (dashed) — the dashes close: committed. */
  draft2: [260, 270] as const,
  solidify: [270, 277] as const,
  /** He takes hold of the middle of the line and straightens it. */
  grab: [270, 279] as const,
  straighten: [280, 295] as const,
} as const;

/** Scene 05's last frame — Scene 06 opens on it. */
export const S05_LAST = 299;

export const S06 = {
  /** Scene 05's type and notes leave; the line turns orange and swings vertical. */
  clear: [0, 14] as const,
  /** Scene 05's words (IMPROVE + the supporting line) stay a moment longer, then leave as the line swings. */
  titlesOut: [6, 20] as const,
  orange: [2, 16] as const,
  swing: [4, 26] as const,
  daylight: [0, 40] as const,
  /**
   * Site hairlines converge into the top of the line (start sites[0] + 3·i, 18 f each) as
   * the swing settles; the small label rises as the first one lands. Then, one at a time:
   * the paper form is found beside the top of the line as the camera pushes in → SUBMIT →
   * the form folds into it.
   */
  sites: [12, 39] as const,
  sitesLabel: 29,
  sitesLabelOut: 148,
  paperIn: [35, 45] as const,
  pushIn: [26, 50] as const,
  /** Step arrival (the camera's attention reaches the node). REVIEW dwells for the decision. */
  steps: [43, 58, 73, 108, 123, 138] as const,
  /** REVIEW's caption rises; his click resolves it; only then does the camera move on. */
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
  /** The last step word leaves as the camera pulls back; all six step labels settle together. */
  lastWordOut: 158,
  pullBack: [144, 176] as const,
  labels: [156, 168] as const,
  /** The last step's label settles only once its big word has gone. */
  lastLabel: [166, 176] as const,
  sitesMetric: 162,
  recordsMetric: 172,
} as const;
