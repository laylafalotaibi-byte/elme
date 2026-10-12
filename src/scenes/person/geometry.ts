import { screenToFrame } from '../../components/set/Workspace';
import { REQUEST_SLOT } from '../before/shared';

/**
 * Scene 01 ↔ Scene 07 — the shared opening shot.
 *
 * Both scenes open on EXACTLY this Workspace framing and screen layout (a match cut):
 * his work window on the left of the screen, the request landing top-right in the same
 * slot Scene 02's repeat uses (REQUEST_SLOT), his cursor resting in his work.
 *
 * Canvas coordinates are the 1280×800 screen canvas; frame coordinates are 1920×1080.
 */

export type Pt = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };

/* ------------------------------------------------------------ screen layout */

/** Card height is fixed so the AFTER line can start exactly at its bottom edge. */
export const CARD_H = 150;

export const SCREEN_LAYOUT = {
  /** His own work (calm, abstract — nobody needs to read it). */
  window: { x: 52, y: 64, w: 560, h: 676 },
  /** The device handover request — same slot as Scene 02's repeat. */
  request: { x: REQUEST_SLOT.x, y: REQUEST_SLOT.y, w: REQUEST_SLOT.w, h: CARD_H },
  /** Where his pointer rests while he works (frame 0 of both scenes). */
  cursorRest: { x: 446, y: 452 },
} as const;

const R = SCREEN_LAYOUT.request;

/** Card-local geometry (shared by the card and by pins that point at it). */
export const CARD = {
  padX: 22,
  padTop: 22,
  /** Centre of the signal dot / resolved check (card-local): on the title's cap-height centre. */
  dot: { x: 22 + 5, y: 22 + 16 },
  /** Left edge of the text column (card-local). */
  textX: 22 + 10 + 18,
  /** Middle of the status row (card-local). */
  statusY: 116,
} as const;

/**
 * AFTER only: his line runs from the card straight down, through one small review node (a
 * human decision: the options sit to its right and his click resolves them), into one
 * record. Vertical, as in Scene 06.
 */
const LINE_X = R.x + CARD.dot.x;
const REVIEW_Y = 300;
const REVIEW_R = 6.5;
const RECORD = { w: 116, h: 142, y: 404 } as const;

export const AFTER_LAYOUT = {
  /** Card → review node. */
  line1: { x: LINE_X, y1: R.y + CARD_H + 2, y2: REVIEW_Y - REVIEW_R - 2 },
  /** The review node: a small ring on his line. Options text starts `textDx` to its right. */
  review: { x: LINE_X, y: REVIEW_Y, r: REVIEW_R, textDx: 22, fontSize: 26 },
  /** Review node → record. */
  line2: { x: LINE_X, y1: REVIEW_Y + REVIEW_R + 2, y2: RECORD.y - 8 },
  record: { x: LINE_X - RECORD.w / 2, y: RECORD.y, w: RECORD.w, h: RECORD.h },
} as const;

/** Points on the request card, canvas coordinates. */
export const cardPoint = {
  dot: { x: R.x + CARD.dot.x, y: R.y + CARD.dot.y },
  status: { x: R.x + CARD.textX + 6, y: R.y + CARD.statusY },
  top: { x: R.x + 150, y: R.y },
  right: { x: R.x + R.w, y: R.y + 70 },
  bottom: { x: R.x + 260, y: R.y + CARD_H },
} as const;

/** The request's action chip — where his one click submits it (canvas). */
export const CARD_ACTION: Pt = { x: R.x + CARD.textX + 44, y: R.y + CARD.statusY + 2 };

/** Where his pointer rests once the request is dealt with (end of Scene 07, all of Scene 08). */
export const AFTER_POINTER_HOME: Pt = { x: 482, y: 440 };

/** Review options: Inter Tight 500 averages ≈ 0.52 em per character; options sit `REVIEW_GAP` apart around a slash. */
const OPTION_EM = 0.52;
export const REVIEW_GAP = 12;
const optionWidth = (text: string) => Math.round(text.length * AFTER_LAYOUT.review.fontSize * OPTION_EM);

/** Centre of review option `k` (canvas), estimated from the option lengths. */
export const reviewOptionCenter = (options: string[], k: number): Pt => {
  const { x, y, textDx, fontSize } = AFTER_LAYOUT.review;
  const slash = Math.round(fontSize * 0.3) + REVIEW_GAP * 2;
  let left = x + textDx;
  for (let i = 0; i < k; i++) left += optionWidth(options[i]) + slash;
  return { x: left + optionWidth(options[k] ?? '') / 2, y: y + 1 };
};

/** Right end of the resolved review word (canvas) — where a pin can attach. */
export const reviewChosenEnd = (chosen: string): Pt => {
  const { x, y, textDx } = AFTER_LAYOUT.review;
  return { x: x + textDx + optionWidth(chosen) + 8, y: y + 1 };
};

/** Size of the resolved status line on the card (Inter Tight 500). */
export const STATUS_FONT_SIZE = 25;

/**
 * Just after the end of the resolved status text (canvas). Estimated from its length
 * (Inter Tight 500 averages ≈ 0.43 em per character), so a pin lands at the end of
 * whatever status the config holds.
 */
export const statusEndPoint = (text: string): Pt => ({
  x: R.x + CARD.textX + Math.round(text.length * STATUS_FONT_SIZE * 0.43) + 12,
  y: R.y + CARD.statusY + 1,
});

/* ------------------------------------------------------------ projection */

/** Screen canvas point → frame point (perspective-correct; shared with <Workspace>). */
export const screenPoint = (p: Pt): Pt => screenToFrame(p);

/* ------------------------------------------------------------ camera */

/** A camera on a full-frame picture layer: scale about `origin`, then translate. */
export type Cam = { scale: number; x: number; y: number };

export const CAM_ORIGIN: Pt = { x: 1320, y: 300 };

export const camTransform = (cam: Cam) => ({
  transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
  transformOrigin: `${CAM_ORIGIN.x}px ${CAM_ORIGIN.y}px`,
});

export const camPoint = (cam: Cam, p: Pt): Pt => ({
  x: CAM_ORIGIN.x + (p.x - CAM_ORIGIN.x) * cam.scale + cam.x,
  y: CAM_ORIGIN.y + (p.y - CAM_ORIGIN.y) * cam.scale + cam.y,
});

/** Frame 0 of Scene 01 and Scene 07 — identical, so the cut between them matches. */
export const OPENING_CAM: Cam = { scale: 1, x: 0, y: 0 };
