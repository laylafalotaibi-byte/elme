import React from 'react';
import { AbsoluteFill, interpolate, random } from 'remotion';
import { colors } from '../../campaign/theme';
import { glide, progress, span } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { EmailCard, FollowUpPing } from '../../components/ui/artifacts/Messages';
import { SystemWindow } from '../../components/ui/artifacts/SystemWindow';
import { PaperForm } from '../../components/ui/artifacts/PaperForm';
import { RecordChip } from './props';
import { S04 } from './timing';

/**
 * Scene 04, shot 1 — "the pile becomes a pattern".
 *
 * The frozen clutter (paper and screens, rotated, overlapping, seen almost from above)
 * quietly re-aligns into a grid of identical, repeating cycles while the viewpoint tips
 * back: every row is the same process — form, signature, email, follow-up, system update,
 * record, another email — and the rows recede into the dark (each row another site: a
 * different hand on its forms). No labels, no numbers: he simply sees it differently.
 *
 * White cards on black strobe easily, so the move is a glide (0 → 0, peak 1.5× its average
 * speed) over ≈ 30 f from a modest scatter: every card stays under ≈ 50 px/frame.
 */

const COLS = 7;
const ROWS = 9;
const SLOT_W = 190;
const SLOT_H = 158;
const GAP_X = 44;
const ROW_H = 214;
const PLANE_W = 1920;
const PLANE_H = ROWS * ROW_H;
const X0 = (PLANE_W - (COLS * SLOT_W + (COLS - 1) * GAP_X)) / 2;

/** Natural size of each step's artefact (width × approx. height at that width). */
const STEP_SIZE: Array<[number, number]> = [
  [360, 410],
  [360, 410],
  [470, 150],
  [330, 92],
  [620, 206],
  [320, 92],
  [470, 150],
];
const fit = (col: number) => Math.min(0.6, SLOT_W / STEP_SIZE[col][0], SLOT_H / STEP_SIZE[col][1]);

const Artefact: React.FC<{ col: number; row: number }> = ({ col, row }) => {
  const { story } = useStory();
  const a = story.before.artifacts;
  switch (col) {
    case 0:
      return <PaperForm title={a.form.title} fields={a.form.fields} signatureLabel={a.form.signatureLabel} fill={1} sign={0} variant={row} width={360} />;
    case 1:
      return <PaperForm title={a.form.title} fields={a.form.fields} signatureLabel={a.form.signatureLabel} fill={1} sign={1} variant={row} width={360} />;
    case 2:
      return <EmailCard to={a.email.to} subject={a.email.subject} preview={a.email.preview} attachment={a.records.fileName} tone="light" width={470} />;
    case 3:
      return <FollowUpPing subject={a.followUp.subject} message={a.followUp.message} tone="light" width={330} />;
    case 4:
      return <SystemWindow name={a.system.name} title={a.system.title} fields={a.system.fields} tag={a.system.tag} typing={1} tone="light" width={620} />;
    case 5:
      return <RecordChip place={a.records.buckets[1] ?? ''} fileName={a.records.fileName} width={320} />;
    default:
      return <EmailCard to={a.email.to} subject={a.anotherEmail.subject} preview={a.anotherEmail.preview} attachment={a.records.fileName} tone="light" width={470} />;
  }
};

type Cell = { col: number; row: number; key: string; gx: number; gy: number; sx: number; sy: number; srot: number; sscale: number; z: number; delay: number };

/** The pile: the grid pulled in towards the centre, scattered (± range / 2), rotated, overlapping. */
const PILE = { pullX: 0.5, pullY: 0.34, rangeX: 300, rangeY: 200, rot: 30, scale: [1.2, 0.35] as const } as const;

const CELLS: Cell[] = (() => {
  const cells: Cell[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const key = `${row}-${col}`;
      const gx = X0 + col * (SLOT_W + GAP_X) + SLOT_W / 2;
      const gy = PLANE_H / 2 + (row - (ROWS - 1) / 2) * ROW_H;
      const sx = PLANE_W / 2 + (gx - PLANE_W / 2) * PILE.pullX + (random(`rx-${key}`) - 0.5) * PILE.rangeX;
      const sy = PLANE_H / 2 + (gy - PLANE_H / 2) * PILE.pullY + (random(`ry-${key}`) - 0.5) * PILE.rangeY;
      const srot = (random(`rr-${key}`) - 0.5) * PILE.rot;
      const sscale = PILE.scale[0] + random(`rs-${key}`) * PILE.scale[1];
      // the centre settles first, the edges a beat later (≤ maxDelay)
      const dist = Math.min(1, Math.hypot(gx - PLANE_W / 2, (gy - PLANE_H / 2) * 1.4) / 1100);
      const delay = S04.realign.maxDelay * (0.7 * dist + 0.3 * random(`rd-${key}`));
      cells.push({ col, row, key, gx, gy, sx, sy, srot, sscale, z: Math.floor(random(`rz-${key}`) * 1000), delay });
    }
  }
  return cells.sort((p, q) => p.z - q.z);
})();

const QUIET = glide(0, 0);

/** The camera: the viewpoint tips back as the pattern forms (overhead → a receding plane). */
export const realignView = (frame: number) => {
  const v = span(frame, S04.view, QUIET);
  return { v, tilt: 12 + 20 * v, zoom: 1.06 - 0.08 * v };
};

/** Each card's pose on the plane at `frame` (plane px). Exported for motion checks. */
export const realignPoses = (frame: number) => {
  const { start, duration } = S04.realign;
  return CELLS.map((cell) => {
    const t = progress(frame, start + cell.delay, duration, QUIET);
    return {
      cell,
      x: interpolate(t, [0, 1], [cell.sx, cell.gx]),
      y: interpolate(t, [0, 1], [cell.sy, cell.gy]),
      rot: interpolate(t, [0, 1], [cell.srot, 0]),
      scale: fit(cell.col) * interpolate(t, [0, 1], [cell.sscale, 1]),
    };
  });
};

/** Plane geometry, for motion checks. */
export const REALIGN_PLANE = { w: PLANE_W, h: PLANE_H, perspective: 1500 } as const;

export const Realign: React.FC<{ frame: number }> = ({ frame }) => {
  const { v: view, tilt, zoom } = realignView(frame);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: (1920 - PLANE_W) / 2,
          top: 540 - PLANE_H / 2,
          width: PLANE_W,
          height: PLANE_H,
          transform: `perspective(${REALIGN_PLANE.perspective}px) rotateX(${tilt}deg) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        {realignPoses(frame).map(({ cell, x, y, rot, scale }) => {
          const w = STEP_SIZE[cell.col][0];
          return (
            <div
              key={cell.key}
              style={{
                position: 'absolute',
                left: x - w / 2,
                top: y,
                width: w,
                transform: `translateY(-50%) rotate(${rot}deg) scale(${scale})`,
                transformOrigin: '50% 50%',
              }}
            >
              <Artefact col={cell.col} row={cell.row} />
            </div>
          );
        })}
      </div>
      {/* the room is dark: the work is lit by his screen, the far rows fall into the dark */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: [
            `linear-gradient(180deg, rgba(11,12,14,${(0.55 + 0.4 * view).toFixed(3)}) 0%, rgba(11,12,14,0.25) 42%, rgba(11,12,14,0.1) 70%, rgba(11,12,14,0.45) 100%)`,
            'radial-gradient(ellipse 70% 75% at 50% 58%, rgba(11,12,14,0) 40%, rgba(11,12,14,0.85) 100%)',
          ].join(','),
        }}
      />
      <AbsoluteFill style={{ pointerEvents: 'none', backgroundColor: 'rgba(20,24,30,0.28)', mixBlendMode: 'multiply' }} />
    </AbsoluteFill>
  );
};
