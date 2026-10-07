/**
 * Shared layout anchors (px, 1920×1080) so scenes that "return to the same moment" line
 * up exactly — e.g. Scene 07 (AFTER) reuses Scene 01's composition, and Scene 02 starts
 * from Scene 01's final layout before the camera moves.
 */
export const anchors = {
  /** Scene 01 and Scene 07: the moment the request arrives. */
  person: {
    kicker: { x: 160, y: 112 },
    portrait: { x: 160, y: 190, w: 500, h: 625 },
    nameplate: { x: 160, y: 842, w: 500 },
    request: { x: 780, y: 236, w: 560 },
    text: { x: 780, y: 560, w: 980 },
  },
  /** Scene 02/03: the employee at the centre of the workspace. */
  workspace: {
    portrait: { x: 780, y: 250, w: 360, h: 450 },
    rail: { y: 968, x: 160, w: 1600 },
  },
} as const;
