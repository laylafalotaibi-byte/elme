import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { LIGHT, type Light } from '../../campaign/light';
import { springAt } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { Workspace } from '../../components/set/Workspace';
import { Pen } from '../../components/set/Inserts';
import { PaperForm } from '../../components/ui/artifacts/PaperForm';
import { Cursor } from '../../components/ui/Cursor';
import { ClutterScreen } from './ClutterScreen';
import { ScreenDesktop } from './props';
import { drift as driftAt } from './shared';

/**
 * BEFORE set — the "surrounded" workspace.
 *
 *   <BeforeClutter light? drift? />
 *
 * The final frame of Scene 02: his screen full of overlapping requests, emails, follow-ups
 * and System 800 windows (each loop cascaded over the last), a paper pile at the desk edge,
 * his shoulder in the foreground, the room dim. It renders the settled state at ANY frame
 * (no entrance animation, no Sequence timing). `drift` adds a restless slow drift (≤ 3 px,
 * 48–110 f periods) and a periodic interruption (a follow-up nudging in at the screen edge,
 * ≤ 4 px, every 75 f). Used by Scene 02 (hold), Scene 07 (split-screen BEFORE side).
 */

/* ----------------------------------------------------------------- desk pile */

type PileSheet = { id: string; x: number; y: number; rot: number; enter?: number; fill?: number; sign?: number };

/** Paper at the desk edge (frame coordinates of the Workspace shot). */
export const DESK_PILE: PileSheet[] = [
  { id: 'p0', x: 1430, y: 884, rot: -7 },
  { id: 'p1', x: 1520, y: 892, rot: 4 },
  { id: 'p2', x: 1380, y: 904, rot: 2, enter: 161 },
  { id: 'p3', x: 1560, y: 914, rot: -3, enter: 205 },
];

export const DeskPile: React.FC<{ frame: number; light: Light; settled?: boolean; drift?: number }> = ({ frame, light, settled = false, drift = 0 }) => {
  const { fps } = useVideoConfig();
  const { story } = useStory();
  const form = story.before.artifacts.form;
  // Paper only catches the light that is left in the room (+ a little screen spill).
  const lit = 0.26 + light.exposure * 0.62;
  return (
    <AbsoluteFill style={{ filter: `brightness(${lit.toFixed(3)})` }}>
      {DESK_PILE.map((sheet) => {
        if (!settled && sheet.enter !== undefined && frame < sheet.enter) return null;
        const s = settled || sheet.enter === undefined ? 1 : springAt(frame, fps, sheet.enter, { damping: 18, stiffness: 220, mass: 0.7 });
        const d = drift > 0 ? driftAt(frame, sheet.id, 1.2 * drift) : { x: 0, y: 0 };
        return (
          <div
            key={sheet.id}
            style={{
              position: 'absolute',
              left: sheet.x - 180 + d.x,
              top: sheet.y - 40 * (1 - s),
              width: 360,
              opacity: Math.min(1, s * 2),
              transform: `perspective(1100px) rotateX(66deg) rotateZ(${sheet.rot + (1 - s) * 6}deg) scale(0.66)`,
              transformOrigin: '50% 0%',
            }}
          >
            <PaperForm title={form.title} fields={form.fields} signatureLabel={form.signatureLabel} fill={sheet.fill ?? 1} sign={sheet.sign ?? 1} width={360} />
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: 'perspective(1100px) rotateX(60deg)', transformOrigin: '1700px 960px' }}>
        <Pen x={1640} y={1000} rotate={-18} length={230} />
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- workspace */

/**
 * The BEFORE workspace at a given Scene 02 frame (entrances live), or settled.
 * Scene 02's Repeat shots and BeforeClutter both render through this, so the last frame
 * of Scene 02 and BeforeClutter are the same picture.
 */
export const BeforeWorkspace: React.FC<{
  frame: number;
  light: Light;
  settled?: boolean;
  drift?: number;
  flash?: number;
  /** Periodic interruption 0…1 (see ClutterScreen). */
  nudge?: number;
  /** Extra canvas content above the clutter (e.g. his cursor). */
  overlay?: React.ReactNode;
}> = ({ frame, light, settled = false, drift = 0, flash = 0, nudge = 0, overlay }) => (
  <Workspace
    light={light}
    flash={flash}
    screen={
      <>
        <ScreenDesktop />
        <ClutterScreen frame={frame} settled={settled} drift={drift} nudge={nudge} />
        {overlay}
      </>
    }
    desk={<DeskPile frame={frame} light={light} settled={settled} drift={drift} />}
  />
);

/** Where his cursor rests at the end of Scene 02 (screen canvas). */
export const IDLE_CURSOR = { frame: 0, x: 930, y: 250 } as const;

/** Periodic interruption for the drifting clutter: a ping nudging in at the screen edge. */
const INTERRUPT_PERIOD = 75;

export const BeforeClutter: React.FC<{ light?: Light; drift?: boolean }> = ({ light = LIGHT.dimmed, drift = false }) => {
  const frame = useCurrentFrame();
  // Interruption: every 75 f a short (≤ 4 px) nudge + a breath of screen light on his shoulder.
  const phase = ((frame % INTERRUPT_PERIOD) + INTERRUPT_PERIOD) % INTERRUPT_PERIOD;
  const nudge = drift ? Math.max(0, 1 - phase / 14) * Math.sin((Math.min(phase, 14) / 14) * Math.PI) : 0;
  return (
    <AbsoluteFill>
      <BeforeWorkspace
        frame={frame}
        light={light}
        settled
        drift={drift ? 1 : 0}
        flash={nudge * 0.3}
        nudge={nudge}
        overlay={<Cursor keys={[IDLE_CURSOR]} />}
      />
    </AbsoluteFill>
  );
};
