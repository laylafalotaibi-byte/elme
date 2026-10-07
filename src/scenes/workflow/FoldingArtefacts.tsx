import React from 'react';
import { useCurrentFrame } from 'remotion';
import { shadows } from '../../campaign/theme';
import { ease, progress } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { PaperForm } from '../../components/ui/artifacts/PaperForm';
import { EmailCard } from '../../components/ui/artifacts/Messages';
import { FileChip } from '../../components/ui/artifacts/FileChip';
import { SPINE, type Pt } from './sketch';
import { S06 } from './timing';

/**
 * The old process, folding into his line as the camera passes (Scene 06 world layer):
 *  - SUBMIT:     the paper form flattens into a point
 *  - CENTRALIZE: scattered files merge into one, which joins the line
 *  - NOTIFY:     the email collapses into the line
 * BEFORE geometry (small rotations) straightens as each one folds. System 800 is not here:
 * it never becomes a step.
 */

const span = (frame: number, s: readonly [number, number], easing = ease.inOut) => progress(frame, s[0], s[1] - s[0], easing);

const Placed: React.FC<{ at: Pt; rotate: number; sx: number; sy: number; opacity: number; children: React.ReactNode }> = ({ at, rotate, sx, sy, opacity, children }) =>
  opacity <= 0.001 || sx <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: at.x,
        top: at.y,
        opacity,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${sx}, ${sy})`,
        transformOrigin: '50% 50%',
      }}
    >
      {children}
    </div>
  );

/** Flatten (0…1) then slide into the node, shrinking to a point (0…1). */
const fold = (base: Pt, rotate: number, k: number, node: Pt, flatten: number, slide: number) => ({
  at: { x: base.x + (node.x - base.x) * slide, y: base.y + (node.y - base.y) * slide },
  rotate: rotate * (1 - flatten),
  sx: k * (1 - slide),
  sy: k * (1 - 0.97 * flatten),
});

export const FoldingArtefacts: React.FC<{ nodes: Pt[] }> = ({ nodes }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const a = story.before.artifacts;
  const submit = nodes[0];
  const centralize = nodes[Math.min(4, nodes.length - 1)];
  const notify = nodes[nodes.length - 1];

  // SUBMIT — the paper form.
  const paperIn = span(frame, S06.paperIn, ease.out);
  const pf = span(frame, [S06.paperFold[0], S06.paperFold[0] + 7]);
  const ps = span(frame, [S06.paperFold[0] + 5, S06.paperFold[1]], ease.in);
  const paper = fold({ x: SPINE.x - 128, y: submit.y + 24 }, -4, 0.5, submit, pf, ps);

  // CENTRALIZE — scattered files merge into one, which then joins the line.
  const filesIn = span(frame, S06.filesIn, ease.out);
  const merge = span(frame, S06.filesMerge);
  const ff = span(frame, [S06.filesFold[0], S06.filesFold[0] + 5]);
  const fs = span(frame, [S06.filesFold[0] + 3, S06.filesFold[1]], ease.in);
  const meet = { x: SPINE.x - 120, y: centralize.y };
  const chips = [
    { x: SPINE.x - 150, y: centralize.y - 66, r: -5 },
    { x: SPINE.x - 232, y: centralize.y - 6, r: 4 },
    { x: SPINE.x - 128, y: centralize.y + 46, r: -2 },
  ];

  // NOTIFY — the email.
  const emailIn = span(frame, S06.emailIn, ease.out);
  const ef = span(frame, [S06.emailFold[0], S06.emailFold[0] + 5]);
  const es = span(frame, [S06.emailFold[0] + 3, S06.emailFold[1]], ease.in);
  const email = fold({ x: SPINE.x - 162, y: notify.y + 22 }, 3, 0.52, notify, ef, es);

  return (
    <>
      <Placed {...paper} opacity={paperIn}>
        <PaperForm {...a.form} fill={1} sign={1} width={360} style={{ boxShadow: shadows.light }} />
      </Placed>

      {chips.map((c, i) => {
        const pos = { x: c.x + (meet.x - c.x) * merge, y: c.y + (meet.y - c.y) * merge };
        const merged = fold(pos, c.r * (1 - merge), 0.56, centralize, ff, fs);
        // the copies disappear into the first as they meet: one record remains
        const dup = i === 0 ? 1 : 1 - span(frame, [S06.filesMerge[1] - 4, S06.filesMerge[1]]);
        return (
          <Placed key={i} {...merged} opacity={filesIn * dup}>
            <FileChip location={a.records.buckets[i % a.records.buckets.length]} fileName={a.records.fileName} tone="light" width={260} />
          </Placed>
        );
      })}

      <Placed {...email} opacity={emailIn}>
        <EmailCard to={a.email.to} subject={a.email.subject} preview={a.email.preview} unread={false} tone="light" width={440} />
      </Placed>
    </>
  );
};
