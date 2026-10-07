/**
 * What each scene template can show. A story whose config goes beyond these limits fails
 * at load time (see validateStory) instead of silently dropping copy.
 */
export const TEMPLATE_LIMITS = {
  /** Scene 02 — annotation pop-ups. */
  annotations: { min: 1, max: 6 },
  /** Scene 02 — steps of the old process (each a captioned artefact). */
  beforeSteps: { min: 3, max: 8 },
  /** Scene 03 — the three pain lines and four pinned indicators. */
  painLines: { min: 3, max: 3 },
  painIndicators: { min: 1, max: 4 },
  /** Scene 05 — learning words, shown one at a time. */
  revealWords: { min: 1, max: 4 },
  /** Scene 06 — workflow steps on his line, branch targets at the end, metrics pinned in the reveal. */
  workflowSteps: { min: 3, max: 6 },
  notifyTargets: { min: 1, max: 2 },
  impactInWorkflow: { min: 0, max: 2 },
  /** Scene 07 — chips per side of the split screen. */
  comparisonPerSide: { min: 1, max: 5 },
  /** Scene 08 — impact pop-ups. */
  impactSequence: { min: 1, max: 6 },
} as const;
