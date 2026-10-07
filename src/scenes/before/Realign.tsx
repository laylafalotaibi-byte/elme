import React from 'react';
import { AbsoluteFill, Easing, interpolate, random } from 'remotion';
import { colors } from '../../campaign/theme';
import { ease, mapClamp, progress } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { EmailCard, FollowUpPing } from '../../components/ui/artifacts/Messages';
import { SystemWindow } from '../../components/ui/artifacts/SystemWindow';
import { PaperForm } from '../../components/ui/artifacts/PaperForm';
import { NO_SIGNATURE_CSS, RecordChip } from './props';

/**
 * Scene 04, shot 1 — "the pile becomes a pattern".
 *
 * The frozen clutter (paper and screens, rotated, overlapping, seen almost from above)
 * quietly re-aligns into a grid of identical, repeating cycles while the viewpoint tips
 * back: every row is the same process — form, signature, email, follow-up, system update,
 * record, another email — and the rows recede into the dark. No labels, no numbers: he
 * simply sees it differently.
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

const Artefact: React.FC<{ col: number }> = ({ col }) => {
  const { story } = useStory();
  const a = story.before.artifacts;
  switch (col) {
    case 0:
      return (
        <div className="before-unsigned">
          <PaperForm title={a.form.title} fields={a.form.fields} signatureLabel={a.form.signatureLabel} fill={1} sign={0} width={360} />
        </div>
      );
    case 1:
      return <PaperForm title={a.form.title} fields={a.form.fields} signatureLabel={a.form.signatureLabel} fill={1} sign={1} width={360} />;
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

const CELLS: Cell[] = (() => {
  const cells: Cell[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const key = `${row}-${col}`;
      const gx = X0 + col * (SLOT_W + GAP_X) + SLOT_W / 2;
      const gy = PLANE_H / 2 + (row - (ROWS - 1) / 2) * ROW_H;
      // The pile: the grid pulled in towards the centre, scattered, rotated, overlapping.
      const sx = PLANE_W / 2 + (gx - PLANE_W / 2) * 0.46 + (random(`rx-${key}`) - 0.5) * 560;
      const sy = PLANE_H / 2 + (gy - PLANE_H / 2) * 0.3 + (random(`ry-${key}`) - 0.5) * 360;
      const srot = (random(`rr-${key}`) - 0.5) * 34;
      const sscale = 1.25 + random(`rs-${key}`) * 0.45;
      const dist = Math.hypot(gx - PLANE_W / 2, (gy - PLANE_H / 2) * 1.4) / 1100;
      cells.push({ col, row, key, gx, gy, sx, sy, srot, sscale, z: Math.floor(random(`rz-${key}`) * 1000), delay: Math.min(1, dist) * 3 + random(`rd-${key}`) * 1.5 });
    }
  }
  return cells.sort((p, q) => p.z - q.z);
})();

/** Quiet: it starts without a jolt and spends most of its time settling. */
const QUIET = Easing.bezier(0.38, 0, 0.18, 1);

export const Realign: React.FC<{ frame: number; start?: number; duration?: number }> = ({ frame, start = 1, duration = 27 }) => {
  // The viewpoint tips back as the pattern forms (from almost overhead to a receding plane).
  const view = mapClamp(frame, [start, start + duration + 4], [0, 1], ease.inOut);
  const tilt = 12 + 20 * view;
  const zoom = 1.06 - 0.08 * view;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: 'hidden' }}>
      <style>{NO_SIGNATURE_CSS}</style>
      <div
        style={{
          position: 'absolute',
          left: (1920 - PLANE_W) / 2,
          top: 540 - PLANE_H / 2,
          width: PLANE_W,
          height: PLANE_H,
          transform: `perspective(1500px) rotateX(${tilt}deg) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        {CELLS.map((cell) => {
          const t = progress(frame, start + cell.delay, duration, QUIET);
          const x = interpolate(t, [0, 1], [cell.sx, cell.gx]);
          const y = interpolate(t, [0, 1], [cell.sy, cell.gy]);
          const rot = interpolate(t, [0, 1], [cell.srot, 0]);
          const scale = fit(cell.col) * interpolate(t, [0, 1], [cell.sscale, 1]);
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
              <Artefact col={cell.col} />
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
