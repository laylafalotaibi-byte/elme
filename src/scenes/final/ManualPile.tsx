import React from 'react';
import { Easing } from 'remotion';
import { ease, lerp, progress } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { PaperForm } from '../../components/ui/artifacts/PaperForm';
import { EmailCard, FollowUpPing } from '../../components/ui/artifacts/Messages';
import { FileChip } from '../../components/ui/artifacts/FileChip';

/**
 * Scene 10's image callback: a small pile of the old process — two paper forms, the email,
 * the follow-up, the forward, a file in one of the places the record was split across —
 * built here from the shared artefacts (no dependency on other scenes' files).
 *
 * As the orange hairline passes each artefact, it folds flat into his single line —
 * except one unsigned form, which squares up and stays, resting below the line: paper is
 * reduced, not eliminated (the single desk sheet of Scenes 07–08).
 *
 * Geometry is relative to the centre of his line, which FinalScene places so that line +
 * word sit centred in frame (see `callbackLayout`). Frame coordinates (1920×1080).
 */

export const CALLBACK = {
  /** Height of his line in frame. */
  lineY: 436,
  /** Half the length of his line. */
  lineHalf: 250,
  lineWidth: 3,
  /** From the end of his line to the word. */
  gap: 72,
  /** The pile is drawn a little smaller than life, as from a step further back. */
  pileScale: 0.84,
} as const;

export type CallbackLayout = {
  /** Centre of his line. */
  cx: number;
  cy: number;
  x1: number;
  x2: number;
  /** Left edge of the word. */
  wordX: number;
};

/** Line + gap + word, centred in frame as one group. */
export const callbackLayout = (wordWidth: number): CallbackLayout => {
  const total = CALLBACK.lineHalf * 2 + CALLBACK.gap + wordWidth;
  const x1 = 960 - total / 2;
  const x2 = x1 + CALLBACK.lineHalf * 2;
  return { cx: x1 + CALLBACK.lineHalf, cy: CALLBACK.lineY, x1, x2, wordX: x2 + CALLBACK.gap };
};

export type PileItem = {
  kind: 'form' | 'formSigned' | 'email' | 'followUp' | 'forward' | 'file';
  /** Centre, relative to the centre of his line (px, after pileScale). */
  dx: number;
  dy: number;
  /** Natural width (the artefact is drawn at this width, then scaled by pileScale). */
  w: number;
  /** Approximate natural height (for the fold target). */
  h: number;
  rot: number;
  /** The one that stays: where it comes to rest, squared, below the line. */
  rest?: { dx: number; dy: number };
};

const FORM_H = 411;

/** Bottom of the stack first. Paper is lit paper; messages are dark UI cards (as in Scenes 02–03). */
export const PILE: PileItem[] = [
  {
    kind: 'form',
    dx: -44,
    dy: 206,
    w: 320,
    h: FORM_H,
    rot: -5,
    // top edge a short breath below the line, centred under it
    rest: { dx: 0, dy: 46 + (FORM_H * CALLBACK.pileScale) / 2 },
  },
  { kind: 'formSigned', dx: 46, dy: -40, w: 320, h: FORM_H, rot: 3.5 },
  { kind: 'forward', dx: 92, dy: -214, w: 380, h: 112, rot: 2 },
  { kind: 'email', dx: -178, dy: 116, w: 420, h: 150, rot: -2.5 },
  { kind: 'followUp', dx: 124, dy: 62, w: 330, h: 92, rot: 3 },
  { kind: 'file', dx: 92, dy: 292, w: 290, h: 66, rot: -1.5 },
];

/** The pile's pool of dim light, relative to the centre of his line. */
export const PILE_POOL = { dx: -24, dy: 70 } as const;

/** Left edge of an item in frame coordinates (where the sweep first touches it). */
export const itemLeft = (item: PileItem, origin: { x: number }) => origin.x + item.dx - (item.w * CALLBACK.pileScale) / 2;

export const PileArtefact: React.FC<{ item: PileItem }> = ({ item }) => {
  const { story } = useStory();
  const a = story.before.artifacts;
  switch (item.kind) {
    case 'form':
      return <PaperForm {...a.form} fill={1} sign={0} width={item.w} style={{ boxShadow: 'none' }} />;
    case 'formSigned':
      return <PaperForm {...a.form} fill={1} sign={1} width={item.w} variant={1} />;
    case 'email':
      return <EmailCard to={a.email.to} subject={a.email.subject} preview={a.email.preview} attachment={a.records.fileName} tone="dark" width={item.w} />;
    case 'forward':
      return <EmailCard to={a.email.to} subject={a.anotherEmail.subject} preview={a.anotherEmail.preview} tone="dark" width={item.w} />;
    case 'followUp':
      return <FollowUpPing subject={a.followUp.subject} message={a.followUp.message} tone="dark" width={item.w} />;
    case 'file':
      return <FileChip location={a.records.buckets[a.records.buckets.length - 1] ?? ''} fileName={a.records.fileName} tone="dark" width={item.w} />;
  }
};

/** Front-loaded: the artefact answers the moment the line touches it, then settles flat. */
const foldEase = Easing.bezier(0.33, 0, 0.2, 1);
/** Extra fold frames per px of distance to the line. */
const FOLD_FRAMES_PER_PX = 1 / 30;

/**
 * The sheet's shadow, from the hard desk-lamp shadow of the pile (dim) to the soft contact
 * shadow of a sheet lying in daylight. `t` 0 → 1.
 */
const sheetShadow = (t: number) =>
  `0 ${lerp(24, 14, t)}px ${lerp(48, 30, t)}px -${lerp(24, 16, t)}px rgba(${Math.round(lerp(0, 82, t))},${Math.round(lerp(0, 60, t))},${Math.round(lerp(0, 38, t))},${lerp(0.6, 0.26, t).toFixed(3)}), ` +
  `0 ${lerp(2, 1, t)}px ${lerp(6, 3, t)}px rgba(${Math.round(lerp(0, 82, t))},${Math.round(lerp(0, 60, t))},${Math.round(lerp(0, 38, t))},${lerp(0.25, 0.14, t).toFixed(3)})`;

/**
 * The pile. `hitAt(x)` gives the frame at which the sweep reaches frame-x; each artefact
 * starts to move the moment the hairline touches its leading edge.
 *
 * The fold is physical, not a 2-D squash: the artefact straightens, drops onto the line and
 * tips back flat (rotateX in perspective, so its type foreshortens like a real sheet lying
 * down instead of being squeezed). It is gone before it is edge-on, so what is left is only
 * his orange line — never a black sliver. The sheet that stays squares up instead (`settle`
 * frames, calm ease) and its shadow softens to daylight.
 */
export const ManualPile: React.FC<{
  frame: number;
  origin: { x: number; y: number };
  hitAt: (x: number) => number;
  collapse: number;
  settle: number;
}> = ({ frame, origin, hitAt, collapse, settle }) => {
  const s = CALLBACK.pileScale;
  return (
    <>
      {PILE.map((item, i) => {
        const at = hitAt(itemLeft(item, origin));
        const box: React.CSSProperties = {
          position: 'absolute',
          left: origin.x + item.dx - item.w / 2,
          top: origin.y + item.dy - item.h / 2,
          width: item.w,
          height: item.h,
          transformOrigin: '50% 50%',
        };

        if (item.rest) {
          const t = progress(frame, at, settle, ease.inOut);
          const x = lerp(item.dx, item.rest.dx, t) - item.dx;
          const y = lerp(item.dy, item.rest.dy, t) - item.dy;
          return (
            <div key={i} style={{ ...box, transform: `translate(${x}px, ${y}px) rotate(${item.rot * (1 - t)}deg) scale(${s})` }}>
              <div style={{ boxShadow: sheetShadow(t), borderRadius: 2 }}>
                <PileArtefact item={item} />
              </div>
            </div>
          );
        }

        // artefacts further from the line take a little longer to reach it (≤ ≈ 40 px/f)
        const t = progress(frame, at, collapse + Math.abs(item.dy) * FOLD_FRAMES_PER_PX, (x) => x);
        if (t >= 1) return null;
        const c = foldEase(t);
        // light reaches it first, then it lies down and fades into the line
        const fade = progress(t, 0.2, 0.5, ease.inOut);
        return (
          <div
            key={i}
            style={{
              ...box,
              transform: `translateY(${-item.dy * c}px) rotate(${item.rot * (1 - c)}deg) scale(${s}) perspective(900px) rotateX(${80 * c}deg)`,
              opacity: 1 - fade,
            }}
          >
            <PileArtefact item={item} />
          </div>
        );
      })}
    </>
  );
};
