import { MONITOR, SCREEN_SCALE } from '../../components/set/Workspace';
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

/** AFTER only: his line runs from the card straight down into one record. */
export const AFTER_LAYOUT = {
  line: { x: R.x + CARD.dot.x, y1: R.y + CARD_H + 2, y2: 448 },
  record: { x: R.x + CARD.dot.x - 58, y: 456, w: 116, h: 142 },
} as const;

/** Points on the request card, canvas coordinates. */
export const cardPoint = {
  dot: { x: R.x + CARD.dot.x, y: R.y + CARD.dot.y },
  status: { x: R.x + CARD.textX + 6, y: R.y + CARD.statusY },
  top: { x: R.x + 150, y: R.y },
  right: { x: R.x + R.w, y: R.y + 70 },
  bottom: { x: R.x + 260, y: R.y + CARD_H },
} as const;

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

const PERSPECTIVE = 2600;
const ROTATE_Y = (-5 * Math.PI) / 180;
const ORIGIN: Pt = { x: MONITOR.x, y: MONITOR.y + MONITOR.h / 2 };

/**
 * Screen canvas point → frame point, the way <Workspace> actually draws its monitor
 * (`perspective(2600px) rotateY(-5deg)` about its left-centre). The right side of the
 * screen is nearer the lens, so pins on the request card need this, not screenToFrame.
 */
export const screenPoint = (p: Pt): Pt => {
  const mx = MONITOR.bezel + p.x * SCREEN_SCALE;
  const my = MONITOR.bezel + p.y * SCREEN_SCALE - MONITOR.h / 2;
  const x1 = mx * Math.cos(ROTATE_Y);
  const z1 = -mx * Math.sin(ROTATE_Y);
  const w = 1 - z1 / PERSPECTIVE;
  return { x: ORIGIN.x + x1 / w, y: ORIGIN.y + my / w };
};

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
