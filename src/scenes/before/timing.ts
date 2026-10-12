/**
 * Every beat of the BEFORE stretch — Scenes 02 · 03 · 04 — in scene-local frames.
 *
 * Scene files, sets and props read their timing from here; no frame numbers live inline.
 * Change a shot's bounds and its caption, annotation, artefact entrances and cursor move
 * with it (they are expressed relative to the shot wherever that is what they mean).
 *
 * Reading rule (docs/DESIGN_SYSTEM.md §7): from the start of its reveal a line stays on
 * screen ≥ words ÷ 3.5 s + 0.4 s; nothing is mid-reveal within ≈ 10 f of a cut; one new
 * element at a time. Scene durations are fixed by the story timeline (225 · 240 · 195).
 */
import type { BeforeArtifactKind } from '../../campaign/types';

export type Span = readonly [number, number];
type Pt = { x: number; y: number };

/* ========================================================================================
 * Scene 02 — Before Automation · 225 f
 * ===================================================================================== */

/** Shot bounds [in, out): hard cuts. The slow pass ≈ 22 f per step, then the Repeat loop. */
export const S02_SHOT = {
  paperForm: [0, 22],
  signature: [22, 44],
  email: [44, 66],
  followUp: [66, 88],
  systemUpdate: [88, 113],
  files: [113, 133],
  anotherEmail: [133, 153],
  /** Match cut: the same request lands again, in the same place. */
  repeat: [153, 175],
  /** The loop replays at ≈ 7 f per step… */
  fastSignature: [175, 182],
  fastEmail: [182, 189],
  fastFollowUp: [189, 196],
  /** …then ≈ 2–4 f per step, layers stacking; held from ≈ 215 (he is surrounded). */
  lastLoop: [196, 225],
} as const satisfies Record<string, Span>;

export type S02ShotId = keyof typeof S02_SHOT;

/** The room dims as the work piles up (normalDay → dimmed), settled before the hold. */
export const S02_LIGHT_RAMP: Span = [4, 212];

/**
 * Step captions: starts 1 f after its cut (cut on action) and is fully built 8 f later,
 * so every caption is complete ≥ 11 f before its cut and on screen ≥ 19 f.
 */
export const CAPTION = { lead: 1, rule: 6, wordDelay: 1, word: 7 } as const;

/** Which shot carries which step's caption (the fast inserts carry none). */
export const S02_CAPTIONS: ReadonlyArray<{ step: BeforeArtifactKind; shot: S02ShotId }> = [
  { step: 'paperForm', shot: 'paperForm' },
  { step: 'signature', shot: 'signature' },
  { step: 'email', shot: 'email' },
  { step: 'followUp', shot: 'followUp' },
  { step: 'systemUpdate', shot: 'systemUpdate' },
  { step: 'files', shot: 'files' },
  { step: 'anotherEmail', shot: 'anotherEmail' },
  { step: 'repeat', shot: 'repeat' },
];

export const captionStart = (shot: S02ShotId) => S02_SHOT[shot][0] + CAPTION.lead;

/* ---------------------------------------------------------------- annotations */

/** The artefact an annotation is pinned to. */
export type AnnotationRole = 'paper' | 'email' | 'followUp' | 'system' | 'typedField' | 'repeat';

/** Annotation pill + leader build (the pill is the shared <Annotation>, springy). */
export const ANNOTATION = {
  /** Default: lands this many frames after its shot's caption (one new thing at a time). */
  afterCaption: 3,
  /** The leader draws from the pill to its object. */
  leadDelay: 1,
  lead: 6,
} as const;

/**
 * Scene 02 annotation pop-ups. `index` points into story.before.annotations (brief order:
 * Manual, Repeated Daily, Paper-Based, Multiple Follow-ups, High Manual Effort, Risk of
 * Human Error); `role` is the artefact it is pinned to.
 *
 * Each is born INSIDE one shot (`shot`), pinned to its artefact there, and dropped on that
 * shot's cut. In the last workspace shot all of them land again (`pile`) on their objects
 * around his screen — that pile-up is the multiplication. `repeat` is born in the Repeat
 * workspace shot and is still there when we cut back to the same framing (`pile: 'held'`).
 *
 * Risk of Human Error (the longest) sits on the field being typed by hand in the longest
 * shot; High Manual Effort is pinned to the System 800 window as the records are filed by
 * hand under it.
 */
export const S02_ANNOTATIONS: ReadonlyArray<{
  role: AnnotationRole;
  index: number;
  shot: S02ShotId;
  /** Frames after the shot's caption start (default ANNOTATION.afterCaption). */
  afterCaption?: number;
  pile: number | 'held';
}> = [
  // pile-up order: the longest reads land first, spreading out from the centre of his screen
  { role: 'paper', index: 2, shot: 'paperForm', pile: 204 },
  { role: 'email', index: 0, shot: 'email', pile: 206 },
  { role: 'followUp', index: 3, shot: 'followUp', pile: 202 },
  { role: 'typedField', index: 5, shot: 'systemUpdate', afterCaption: 4, pile: 198 },
  { role: 'system', index: 4, shot: 'files', afterCaption: 2, pile: 200 },
  { role: 'repeat', index: 1, shot: 'repeat', afterCaption: 4, pile: 'held' },
];

export const annotationStart = (a: { shot: S02ShotId; afterCaption?: number }) => captionStart(a.shot) + (a.afterCaption ?? ANNOTATION.afterCaption);

/* ---------------------------------------------------------------- artefacts */

/**
 * Clutter beats (see ClutterScreen): the frame each artefact starts to land. Each step's
 * artefact starts 3 f BEFORE its insert cuts in, so every insert opens on movement with the
 * card already opaque (never a half-transparent card over the pile).
 */
export const CLUTTER_BEATS = {
  email1: { enter: 41 },
  follow1: { enter: 63 },
  sys1: { enter: 85, typeStart: 94 },
  rec1: { enter: 110, split: [115, 130] as Span },
  fwd1: { enter: 130 },
  req2: { enter: 153 },
  email2: { enter: 179 },
  follow2: { enter: 186 },
  sys2: { enter: 193, typeStart: 197 },
  req3: { enter: 199 },
  fwd2: { enter: 201 },
  email3: { enter: 203 },
  follow3: { enter: 205 },
  sys3: { enter: 206, typeStart: 207 },
  // the last arrival lands by ≈ 215 so the hold is still
  follow4: { enter: 207 },
} as const;

/** The uncounted Site tag on a new cluster fades in just after its card lands. */
export const SITE_TAG = { delay: 4, fade: 8 } as const;

/** Pinned pain indicators: leaders draw as the popup's value lands (MetricPopup anatomy), one per target. */
export const PIN = { leadDelay: 10, stagger: 3, exit: 14 } as const;

/** Desk-edge paper (Workspace shot): another site's form lands with each loop. */
export const DESK_PILE_BEATS = { p2: 164, p3: 205 } as const;

/** Paper form insert: it is already sliding in on the cut (−4) and is written 6 → 18. */
export const DESK_FORM = { slideIn: -4, fill: [6, 18] as Span } as const;

/** Signature: drawn from 2 f into its shot (1 f in the repeat) — slowly in the first pass, fast in the repeat. */
export const SIGNATURE = { delay: 2, fastDelay: 1, slow: 16, fast: 5 } as const;

/** Screen inserts push in by 3 % across the shot (+ a few frames, so the cut is mid-move). */
export const SCREEN_PUSH = { amount: 0.03, overrun: 6 } as const;

/** Breaths of screen light on his shoulder as requests land in the workspace shots. */
export const S02_FLASH = {
  repeat: { span: [154, 175] as Span, in: 4, out: 14, amount: 0.8 },
  lastLoop: { at: [199, 202, 205], length: 10, in: 2, out: 8, amount: 0.45 },
} as const;

/** The settled clutter starts its restless drift as the last loop lands. */
export const S02_DRIFT_FROM = 206;

/* ---------------------------------------------------------------- his cursor */

/** A cursor waypoint: canvas position at a frame (moves glide between waypoints). */
export type Waypoint = { f: number; x: number; y: number };

/**
 * His cursor per shot (1280×800 canvas). Moves start before their shot where the cut is
 * on action; every move is long enough to stay under ≈ 50 px/f on screen.
 */
export const S02_CURSOR = {
  email: { path: [{ f: 40, x: 640, y: 392 }, { f: 56, x: 492, y: 232 }] as Waypoint[], click: 58 },
  systemUpdate: { path: [{ f: 81, x: 900, y: 610 }, { f: 93, x: 800, y: 470 }] as Waypoint[], click: 93 },
  /** Grabs the record at `grab`, then drags the second copy to its place during the split. */
  files: { approach: [{ f: 106, x: 640, y: 724 }, { f: 115, x: 560, y: 668 }] as Waypoint[], click: 115 },
  anotherEmail: { path: [{ f: 133, x: 868, y: 652 }, { f: 149, x: 960, y: 700 }] as Waypoint[] },
  repeat: { path: [{ f: 153, x: 700, y: 640 }, { f: 170, x: 980, y: 170 }] as Waypoint[], click: 171 },
  lastLoop: { path: [{ f: 196, x: 980, y: 170 }, { f: 214, x: 930, y: 250 }] as Waypoint[] },
} as const;

/** Where his cursor rests at the end of Scene 02 (screen canvas). */
export const IDLE_CURSOR_AT: Pt = { x: 930, y: 250 };

/* ========================================================================================
 * Scene 03 — The Pain · 240 f
 * ===================================================================================== */

export const S03_SHOT = {
  /** Desk: one form, then the camera pulls back to the stack. */
  desk: [0, 140],
  /** Hero close: he looks at it. Silence — nothing new enters. */
  hero: [140, 150],
  /** Screen in the dark room: the field typed by hand; the two record places. */
  screen: [150, 240],
} as const satisfies Record<string, Span>;

/** Line reveal duration (MaskedReveal). */
export const S03_LINE = { duration: 20 } as const;

export const S03_DESK = {
  /** "The task wasn't difficult." (4 words → 46 f; full until it steps back at 48). */
  line1: 2,
  /** Line 1 steps back to 40 % as line 2 arrives. */
  line1Back: [48, 62] as Span,
  /** "But repeating it every day was costing time." (8 words → 81 f; on 88 f). */
  line2: [52, 56] as const,
  /** A breath of movement while it holds close, then the pull-back to the stack. */
  hold: [0, 48] as Span,
  pullBack: [48, 84] as Span,
  /** The identical forms fan out from under the first one. */
  spread: [52, 84] as Span,
  /** TIME (5 words → 55 f; on 55 f, after the camera settles at 84) then EFFORT (3 words → 38 f; on 42 f). */
  time: 85,
  effort: 98,
  /** Indicator leader draw (frames). */
  lead: 12,
} as const;

export const S03_SCREEN = {
  /** "And every manual step created another opportunity for error." (9 words → 89.1 f; on 90 f). */
  line3: [150, 154] as const,
  /** The last field typed by hand: half, a hesitation, the rest. */
  typing: { first: [156, 168] as Span, second: [180, 196] as Span },
  /** RISK on the typed field as it is typed; RECORDS on the two places. Never more than two. */
  risk: 188,
  records: 198,
  recordsLead: 12,
  /** A slow, even push across the shot (display type stays outside it). */
  push: 0.02,
} as const;

/** Which pain indicator is pinned to which object (`index` into story.pain.indicators). */
export type PainRole = 'stack' | 'pile' | 'typedField' | 'records';
export const PAIN_INDICATORS: Readonly<Record<PainRole, number>> = {
  /** TIME ↓ Lost to repetitive work → the stack of identical forms. */
  stack: 0,
  /** EFFORT ↑ Manual handling → the loose pile of handled forms. */
  pile: 1,
  /** RISK ↑ Human error → the field typed by hand. */
  typedField: 2,
  /** RECORDS Fragmented → both record places. */
  records: 3,
};

/* ========================================================================================
 * Scene 04 — The Question · 195 f
 * ===================================================================================== */

export const S04 = {
  /** The pile quietly realigns into a grid of identical cycles (glide 0 → 0, no jolt). */
  realign: { start: 0, duration: 27, maxDelay: 3 },
  /** The viewpoint tips back over the same stretch. */
  view: [0, 31] as Span,
  /** Hard cut → hero close, held still: he stops. */
  hero: [32, 72] as Span,
  /** Fade to near-black. */
  fade: [72, 86] as Span,
  /** The question rises line by line and lands by ≈ 108, then holds to the end. */
  question: { start: 86, lineStagger: 4, duration: 18 },
} as const;
