import React from 'react';
import { Easing } from 'remotion';
import { ease, progress } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { PaperForm } from '../../components/ui/artifacts/PaperForm';
import { EmailCard, FollowUpPing } from '../../components/ui/artifacts/Messages';
import { FileChip } from '../../components/ui/artifacts/FileChip';

/**
 * Scene 10's image callback: a small pile of the old process — two paper forms, the email,
 * the follow-up, the forward, a file in one of the places the record was split across —
 * built here from the shared artefacts (no dependency on other scenes' files).
 *
 * As the orange hairline passes each artefact, it folds flat into his single line:
 * rotation straightens, height collapses onto the line, and it is gone.
 * Frame coordinates (1920×1080), inside the scene's picture layer.
 */

export type PileItem = {
  kind: 'form' | 'formSigned' | 'email' | 'followUp' | 'forward' | 'file';
  x: number;
  y: number;
  w: number;
  /** Approximate rendered height (for the collapse target). */
  h: number;
  rot: number;
};

/** Bottom of the stack first. Paper is lit paper; messages are dark UI cards (as in Scenes 02–03). */
export const PILE: PileItem[] = [
  { kind: 'form', x: 372, y: 262, w: 320, h: 420, rot: -5 },
  { kind: 'formSigned', x: 468, y: 300, w: 320, h: 420, rot: 3.5 },
  { kind: 'forward', x: 640, y: 236, w: 380, h: 112, rot: 2 },
  { kind: 'email', x: 316, y: 628, w: 420, h: 150, rot: -2.5 },
  { kind: 'followUp', x: 700, y: 486, w: 330, h: 92, rot: 3 },
  { kind: 'file', x: 676, y: 690, w: 290, h: 66, rot: -1.5 },
];

/** The pile's pool of dim light (centre, frame coordinates). */
export const PILE_POOL = { x: 660, y: 500 } as const;

/** The single orange line the pile becomes. */
export const PILE_LINE = { y: 532, x1: 350, x2: 990, width: 3 } as const;

export const PileArtefact: React.FC<{ item: PileItem }> = ({ item }) => {
  const { story } = useStory();
  const a = story.before.artifacts;
  switch (item.kind) {
    case 'form':
      return <PaperForm {...a.form} fill={1} sign={0} width={item.w} />;
    case 'formSigned':
      return <PaperForm {...a.form} fill={1} sign={1} width={item.w} />;
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

/**
 * The pile. `hitAt(x)` gives the frame at which the sweep reaches x; each artefact starts to
 * fold the moment the hairline touches its leading edge and takes `collapse` frames.
 *
 * The fold is physical, not a 2-D squash: the artefact straightens, drops onto the line and
 * tips back flat (rotateX in perspective, so its type foreshortens like a real sheet lying
 * down instead of being squeezed). It is gone before it is edge-on, so what is left is only
 * his orange line — never a black sliver.
 */
/** Front-loaded: the artefact answers the moment the line touches it, then settles flat. */
const foldEase = Easing.bezier(0.33, 0, 0.2, 1);

export const ManualPile: React.FC<{ frame: number; hitAt: (x: number) => number; collapse: number }> = ({ frame, hitAt, collapse }) => (
  <>
    {PILE.map((item, i) => {
      const cy = item.y + item.h / 2;
      const t = progress(frame, hitAt(item.x), collapse, (x) => x);
      if (t >= 1) return null;
      const c = foldEase(t);
      // light reaches it first, then it lies down and fades into the line
      const fade = progress(t, 0.2, 0.5, ease.inOut);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            width: item.w,
            height: item.h,
            transformOrigin: '50% 50%',
            transform: `translateY(${(PILE_LINE.y - cy) * c}px) rotate(${item.rot * (1 - c)}deg) perspective(900px) rotateX(${80 * c}deg)`,
            opacity: 1 - fade,
          }}
        >
          <PileArtefact item={item} />
        </div>
      );
    })}
  </>
);
