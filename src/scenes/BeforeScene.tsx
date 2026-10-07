import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useStory } from '../campaign/StoryContext';
import { envelope, mapClamp, progress, springAt, springs } from '../campaign/motion';
import type { Light } from '../campaign/light';
import { DeskInsert, Pen } from '../components/set/Inserts';
import { screenToFrame } from '../components/set/Workspace';
import { Cursor } from '../components/ui/Cursor';
import { BeforeWorkspace, IDLE_CURSOR } from './before/BeforeSet';
import { AnnotationLayer, StepCaption } from './before/Captions';
import { CLUTTER, ClutterScreen, clutterItem, recordPositions } from './before/ClutterScreen';
import { DeskLight, Sheet } from './before/props';
import { DeskPlane, ScreenShot, type Tilt } from './before/ScreenShot';
import { beforeLight, canvasToFrame, pushCam, stepLabel, type Cam } from './before/shared';
import type { SceneProps } from './types';

/**
 * Scene 02 — Before Automation (PROBLEM) · 225 f · light normalDay → dimmed.
 *
 * The old process felt as rhythm. Cuts between desk, screen and workspace; each step's name
 * is a small caption on its own artefact (no rail). One full slow pass (≈ 22 f per step),
 * then a match cut back to the same request arriving — the loop replays at ≈ 8 f, then
 * ≈ 4 f per step, and the layers stack instead of clearing. Annotation pop-ups accumulate
 * around the frame until he is surrounded; the room dims until the screen is the only light.
 *
 *   0–22    Desk        Paper Form            · Paper-Based (12)
 *   22–44   Desk close  Signature
 *   44–66   Screen      Email                 · Manual (54)
 *   66–88   Screen      Follow-up             · Multiple Follow-ups (80)
 *   88–118  Screen      Manual System Update  · High Manual Effort (108)
 *   118–136 Screen      File / Record         · Risk of Human Error (128)
 *   136–150 Screen      Another Email
 *   150–172 Workspace   Repeat — the same request lands again (match cut) · Repeated Daily (166)
 *   172–196 Fast inserts: signature · email · follow-up (8 f each)
 *   196–215 Workspace   the last loop at ≈ 4 f per step, layers stacking
 *   215–225 Workspace   held: surrounded, dim, the screen the only light (= BeforeClutter)
 */

/* -------------------------------------------------------------- desk world */

/** The paper form's resting place on the desk (frame coords at camera 1). */
const FORM = { x: 960, y: 500, scale: 1.45, rot: -3 } as const;
/** Form-local point (360×410 sheet) → desk world point. */
const formPoint = (lx: number, ly: number, f: { x: number; y: number; scale: number } = FORM) => ({
  x: f.x + (lx - 180) * f.scale,
  y: f.y + (ly - 205) * f.scale,
});
const SIGNATURE_AT = formPoint(120, 352);

/** A camera over the desk: world point `focus` is placed at frame centre, scaled. */
const DeskCam: React.FC<{ scale: number; focus: { x: number; y: number }; children: React.ReactNode }> = ({ scale, focus, children }) => (
  <AbsoluteFill style={{ transform: `translate(${960 - focus.x * scale}px, ${540 - focus.y * scale}px) scale(${scale})`, transformOrigin: '0 0' }}>
    {children}
  </AbsoluteFill>
);
const deskToFrame = (p: { x: number; y: number }, scale: number, focus: { x: number; y: number }) => ({
  x: 960 + (p.x - focus.x) * scale,
  y: 540 + (p.y - focus.y) * scale,
});

/* -------------------------------------------------------------- shots */

const DeskForm: React.FC<{ frame: number; light: Light }> = ({ frame, light }) => {
  const { fps } = useVideoConfig();
  const { story } = useStory();
  const form = story.before.artifacts.form;
  // The form is already sliding in on the cut (cut on action) and settles with a small bounce.
  const s = springAt(frame, fps, -4, springs.busy);
  const fill = progress(frame, 7, 13);
  const cam = 1 + 0.025 * mapClamp(frame, [0, 22], [0, 1]);
  const focus = { x: 960, y: 520 };
  const corner = deskToFrame(formPoint(0, 410), cam, focus);
  return (
    <AbsoluteFill>
      <DeskInsert light={light}>
        <DeskPlane tilt={12}>
          <DeskCam scale={cam} focus={focus}>
            <div style={{ filter: 'blur(1.6px)' }}>
              <Pen x={1290} y={700} rotate={-34} length={300} />
            </div>
            <Sheet
              form={form}
              x={FORM.x - 150 * (1 - s)}
              y={FORM.y - 260 * (1 - s)}
              scale={FORM.scale}
              rotate={FORM.rot - 7 * (1 - s)}
              fill={fill}
              sign={0}
              style={{ opacity: Math.min(1, s * 3) }}
            />
          </DeskCam>
          <StepCaption text={stepLabel(story, 'paperForm')} x={corner.x + 6} y={corner.y + 26} start={5} tone="light" />
        </DeskPlane>
        <DeskLight light={light} pool={{ x: 55, y: 40 }} />
      </DeskInsert>
    </AbsoluteFill>
  );
};

const DeskSignature: React.FC<{ frame: number; light: Light; start: number; fast?: boolean }> = ({ frame, light, start, fast = false }) => {
  const { story } = useStory();
  const form = story.before.artifacts.form;
  const sign = progress(frame, start + 2, fast ? 7 : 16);
  const focus = { x: SIGNATURE_AT.x + 40, y: SIGNATURE_AT.y - 40 };
  const scale = (fast ? 1.9 : 2.25) + (fast ? 0.03 : 0.05) * mapClamp(frame, [start, start + (fast ? 8 : 22)], [0, 1]);
  const labelAt = deskToFrame(formPoint(30, 410), scale, focus);
  // In the repeat, the new form lies on top of the last one.
  const top = { x: FORM.x + 34, y: FORM.y - 30 };
  return (
    <AbsoluteFill>
      <DeskInsert light={light}>
        <DeskPlane tilt={fast ? 18 : 15}>
          <DeskCam scale={scale} focus={fast ? { x: focus.x + 30, y: focus.y - 20 } : focus}>
            {fast ? <Sheet form={form} x={FORM.x - 26} y={FORM.y + 22} scale={FORM.scale} rotate={FORM.rot - 3} fill={1} sign={1} /> : null}
            <Sheet form={form} x={fast ? top.x : FORM.x} y={fast ? top.y : FORM.y} scale={FORM.scale} rotate={fast ? FORM.rot + 2.5 : FORM.rot} fill={1} sign={sign} />
            <div style={{ filter: 'blur(1.2px)' }}>
              <Pen x={SIGNATURE_AT.x + 250} y={SIGNATURE_AT.y + 40} rotate={-24} length={300} />
            </div>
          </DeskCam>
          {!fast ? <StepCaption text={stepLabel(story, 'signature')} x={labelAt.x} y={labelAt.y + 34} start={start + 4} tone={light.exposure > 0.5 ? 'light' : 'dark'} /> : null}
        </DeskPlane>
        <DeskLight light={light} pool={{ x: 50, y: 45 }} spread={70} />
      </DeskInsert>
    </AbsoluteFill>
  );
};

/** A screen insert on one step: the newest artefact sharp, the pile behind it soft. */
const ScreenStep: React.FC<{
  frame: number;
  light: Light;
  from: number;
  to: number;
  cam: Cam;
  tilt?: Tilt;
  focusIds: string[];
  caption?: { text: string | null; at: { x: number; y: number }; start: number };
  cursor?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ frame, light, from, to, cam, tilt, focusIds, caption, cursor, children }) => {
  const c = pushCam(frame, from, to + 6, cam, 0.03);
  const cap = caption ? canvasToFrame(caption.at, c) : null;
  // The next step's artefact starts entering a few frames before its own insert (cut on
  // action); keep anything that arrives during this shot out of the soft back layer.
  const incoming = CLUTTER.filter((i) => i.enter !== undefined && i.enter >= from && !focusIds.includes(i.id)).map((i) => i.id);
  return (
    <ScreenShot
      light={light}
      cam={c}
      tilt={tilt}
      backBlur={3.2}
      back={<ClutterScreen frame={frame} except={[...focusIds, ...incoming]} />}
      front={
        <>
          <ClutterScreen frame={frame} only={focusIds} />
          {cursor}
        </>
      }
    >
      {caption && cap ? <StepCaption text={caption.text} x={cap.x} y={cap.y} start={caption.start} tone="light" /> : null}
      {children}
    </ScreenShot>
  );
};

/* -------------------------------------------------------------- scene */

export const BeforeScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const light = beforeLight(frame);
  const last = durationInFrames - 1;

  const email1 = clutterItem('email1');
  const follow1 = clutterItem('follow1');
  const sys1 = clutterItem('sys1');
  const fwd1 = clutterItem('fwd1');
  const req2 = clutterItem('req2');

  let shot: React.ReactNode = null;

  if (frame < 22) {
    shot = <DeskForm frame={frame} light={light} />;
  } else if (frame < 44) {
    shot = <DeskSignature frame={frame} light={light} start={22} />;
  } else if (frame < 66) {
    shot = (
      <ScreenStep
        frame={frame}
        light={light}
        from={44}
        to={66}
        cam={{ zoom: 1.35, focus: { x: 340, y: 222 } }}
        tilt={{ x: 3, y: -9 }}
        focusIds={['email1']}
        caption={{ text: stepLabel(story, 'email'), at: { x: email1.x, y: email1.y + 176 }, start: 48 }}
        cursor={<Cursor keys={[{ frame: 44, x: 690, y: 430 }, { frame: 52, x: 492, y: 232 }]} clicks={[57]} />}
      />
    );
  } else if (frame < 88) {
    shot = (
      <ScreenStep
        frame={frame}
        light={light}
        from={66}
        to={88}
        cam={{ zoom: 1.66, focus: { x: 990, y: 352 } }}
        tilt={{ x: 2, y: 9 }}
        focusIds={['follow1']}
        caption={{ text: stepLabel(story, 'followUp'), at: { x: follow1.x, y: follow1.y + 108 }, start: 71 }}
        cursor={<Cursor keys={[{ frame: 66, x: 500, y: 236 }, { frame: 80, x: 560, y: 300 }]} />}
      />
    );
  } else if (frame < 118) {
    shot = (
      <ScreenStep
        frame={frame}
        light={light}
        from={88}
        to={118}
        cam={{ zoom: 1.35, focus: { x: 488, y: 402 } }}
        tilt={{ x: 5, y: -6 }}
        focusIds={['sys1']}
        caption={{ text: stepLabel(story, 'systemUpdate'), at: { x: sys1.x, y: sys1.y + 226 }, start: 93 }}
        cursor={<Cursor keys={[{ frame: 88, x: 640, y: 560 }, { frame: 100, x: 905, y: 545 }]} />}
      />
    );
  } else if (frame < 136) {
    const rec = recordPositions(frame);
    shot = (
      <ScreenStep
        frame={frame}
        light={light}
        from={118}
        to={136}
        cam={{ zoom: 1.1, focus: { x: 660, y: 560 } }}
        tilt={{ x: 9, y: 0 }}
        focusIds={['rec1']}
        caption={{ text: stepLabel(story, 'files'), at: { x: rec.a.x, y: rec.a.y + 130 }, start: 120 }}
        cursor={
          <Cursor
            keys={[
              { frame: 118, x: 600, y: 700 },
              { frame: 120, x: 560, y: 668 },
              { frame: 123, x: 560, y: 668 },
              { frame: 134, x: 860, y: 650 },
            ]}
            clicks={[121]}
          />
        }
      />
    );
  } else if (frame < 150) {
    shot = (
      <ScreenStep
        frame={frame}
        light={light}
        from={136}
        to={150}
        cam={{ zoom: 1.4, focus: { x: 760, y: 560 } }}
        tilt={{ x: 2, y: -10 }}
        focusIds={['fwd1']}
        caption={{ text: stepLabel(story, 'anotherEmail'), at: { x: fwd1.x, y: fwd1.y + 176 }, start: 136 }}
        cursor={<Cursor keys={[{ frame: 136, x: 860, y: 650 }, { frame: 146, x: 960, y: 700 }]} />}
      />
    );
  } else if (frame < 172) {
    // Repeat — match cut: the same request lands again, in the same place, over the last one.
    const capAt = screenToFrame({ x: req2.x + 2, y: req2.y + 150 });
    shot = (
      <AbsoluteFill>
        <BeforeWorkspace
          frame={frame}
          light={light}
          flash={envelope(frame, 151, 172, 4, 14) * 0.8}
          overlay={<Cursor keys={[{ frame: 150, x: 700, y: 640 }, { frame: 158, x: 760, y: 470 }, { frame: 168, x: 980, y: 150 }]} />}
        />
        <StepCaption text={stepLabel(story, 'repeat')} x={capAt.x} y={capAt.y} start={157} tone="light" />
      </AbsoluteFill>
    );
  } else if (frame < 180) {
    shot = <DeskSignature frame={frame} light={light} start={172} fast />;
  } else if (frame < 188) {
    shot = (
      <ScreenStep frame={frame} light={light} from={180} to={188} cam={{ zoom: 1.25, focus: { x: 300, y: 262 } }} tilt={{ x: 3, y: 10 }} focusIds={['email2']} />
    );
  } else if (frame < 196) {
    shot = <ScreenStep frame={frame} light={light} from={188} to={196} cam={{ zoom: 1.25, focus: { x: 180, y: 470 } }} tilt={{ x: -3, y: -8 }} focusIds={['follow2']} />;
  } else {
    // The last loop races (≈ 4 f per step) and then everything holds: BeforeClutter's picture.
    // a breath of screen light with each arrival; the last one has decayed by the 215 hold
    const flashes = [199, 202, 205].reduce((m, t) => Math.max(m, envelope(frame, t, t + 10, 2, 8)), 0);
    shot = (
      <BeforeWorkspace
        frame={frame}
        light={light}
        drift={mapClamp(frame, [206, last], [0, 1])}
        flash={flashes * 0.45}
        overlay={<Cursor keys={[{ frame: 196, x: 1000, y: 160 }, { ...IDLE_CURSOR, frame: 210 }]} />}
      />
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {shot}
      <AnnotationLayer />
    </AbsoluteFill>
  );
};
