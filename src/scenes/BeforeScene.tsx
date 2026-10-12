import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { useStory } from '../campaign/StoryContext';
import { envelope, mapClamp, progress, span, springAt, springs } from '../campaign/motion';
import type { Light } from '../campaign/light';
import { DeskInsert, Pen } from '../components/set/Inserts';
import { screenToFrame } from '../components/set/Workspace';
import { Cursor } from '../components/ui/Cursor';
import { BeforeWorkspace, DESK_PILE } from './before/BeforeSet';
import { PinnedAnnotation, StepCaption } from './before/Captions';
import { CLUTTER_HEIGHT, CLUTTER, ClutterScreen, clutterItem, clutterMotion, recordPositions, typedFieldRect } from './before/ClutterScreen';
import { DeskLight, Sheet } from './before/props';
import { DeskPlane, ScreenShot, type Tilt } from './before/ScreenShot';
import { beforeLight, canvasToFrame, glidePath, pushCam, stepLabel, type Cam } from './before/shared';
import {
  DESK_FORM,
  S02_ANNOTATIONS,
  S02_CURSOR,
  S02_DRIFT_FROM,
  S02_FLASH,
  S02_SHOT,
  SCREEN_PUSH,
  SIGNATURE,
  annotationStart,
  captionStart,
  type AnnotationRole,
  type S02ShotId,
} from './before/timing';
import type { SceneProps } from './types';

/**
 * Scene 02 — Before Automation (PROBLEM) · 225 f · light normalDay → dimmed.
 *
 * The old process felt as rhythm. Cuts between desk, screen and workspace; each step's name
 * is a small caption on its own artefact (no rail), 1 f after its cut. Each annotation pop-up
 * is born INSIDE the shot of the artefact it describes, pinned to it by a hairline, and
 * leaves with that shot; in the last workspace shot they all land again on their objects
 * around his screen — the pile-up is the multiplication. Every beat: before/timing.ts.
 *
 *   0–22    Desk        Paper Form (1)            · Paper-Based (4) → the form
 *   22–44   Desk close  Signature (23)
 *   44–66   Screen      Email (45)                · Manual (48) → the email
 *   66–88   Screen      Follow-up (67)            · Multiple Follow-ups (70) → the follow-up
 *   88–113  Screen      Manual System Update (89) · Risk of Human Error (93) → the field typed by hand
 *   113–133 Screen      File / Record (114)       · High Manual Effort (116) → the System 800 window
 *   133–153 Screen      Another Email (134)
 *   153–175 Workspace   Repeat (154) — match cut: the same request lands again
 *                                                 · Repeated Daily (158) → the request cascade
 *   175–196 Fast inserts: signature · email · follow-up (7 f each)
 *   196–225 Workspace   the last loop (≈ 2–4 f per step); the annotations land again on their
 *                       objects (198–206) — the pile-up; held from ≈ 215: surrounded, dim
 */

type Pt = { x: number; y: number };
const LINEAR = Easing.linear;

/* -------------------------------------------------------------- desk world */

/** The paper form's resting place on the desk (frame coords at camera 1). */
const FORM = { x: 960, y: 500, scale: 1.45, rot: -3 } as const;
/** How far the form slides in from (frame px at camera 1). */
const FORM_SLIDE = { x: -100, y: -170, rot: -7 } as const;

/** Form-local point (360×410 sheet) → desk world point, with the sheet's rotation. */
const formPoint = (lx: number, ly: number, f: { x: number; y: number; scale: number; rot: number } = FORM) => {
  const dx = (lx - 180) * f.scale;
  const dy = (ly - 205) * f.scale;
  const r = (f.rot * Math.PI) / 180;
  return { x: f.x + dx * Math.cos(r) - dy * Math.sin(r), y: f.y + dx * Math.sin(r) + dy * Math.cos(r) };
};
const SIGNATURE_AT = formPoint(120, 352);

/** A camera over the desk: world point `focus` is placed at frame centre, scaled. */
const DeskCam: React.FC<{ scale: number; focus: Pt; children: React.ReactNode }> = ({ scale, focus, children }) => (
  <AbsoluteFill style={{ transform: `translate(${960 - focus.x * scale}px, ${540 - focus.y * scale}px) scale(${scale})`, transformOrigin: '0 0' }}>{children}</AbsoluteFill>
);
const deskToFrame = (p: Pt, scale: number, focus: Pt) => ({ x: 960 + (p.x - focus.x) * scale, y: 540 + (p.y - focus.y) * scale });

/* -------------------------------------------------------------- annotations */

/** The annotation pinned to an artefact (by role), with its copy and birth frame. */
const useAnnotation = (role: AnnotationRole) => {
  const { story } = useStory();
  const a = S02_ANNOTATIONS.find((r) => r.role === role);
  return { text: a ? story.before.annotations[a.index] : undefined, start: a ? annotationStart(a) : 0, pile: a?.pile ?? 'held' };
};

/* -------------------------------------------------------------- shots */

const DeskForm: React.FC<{ frame: number; light: Light }> = ({ frame, light }) => {
  const { fps } = useVideoConfig();
  const { story } = useStory();
  const form = story.before.artifacts.form;
  const paper = useAnnotation('paper');
  // The form is already sliding in on the cut (cut on action) and settles with a small bounce.
  const s = springAt(frame, fps, DESK_FORM.slideIn, springs.busy);
  const fill = span(frame, DESK_FORM.fill, LINEAR);
  const cam = 1 + 0.025 * span(frame, S02_SHOT.paperForm, LINEAR);
  const focus = { x: 960, y: 520 };
  const now = { x: FORM.x + FORM_SLIDE.x * (1 - s), y: FORM.y + FORM_SLIDE.y * (1 - s), scale: FORM.scale, rot: FORM.rot + FORM_SLIDE.rot * (1 - s) };
  const corner = deskToFrame(formPoint(0, 410, now), cam, focus);
  // Paper-Based: pinned to the form's right edge, the pill in the open desk beside it.
  const pin = deskToFrame(formPoint(356, 118, now), cam, focus);
  return (
    <AbsoluteFill>
      <DeskInsert light={light}>
        <DeskPlane tilt={12}>
          <DeskCam scale={cam} focus={focus}>
            <div style={{ filter: 'blur(1.6px)' }}>
              <Pen x={1290} y={700} rotate={-34} length={300} />
            </div>
            <Sheet form={form} x={now.x} y={now.y} scale={FORM.scale} rotate={now.rot} fill={fill} sign={0} style={{ opacity: Math.min(1, s * 3) }} />
          </DeskCam>
          <StepCaption text={stepLabel(story, 'paperForm')} x={corner.x + 6} y={corner.y + 26} start={captionStart('paperForm')} tone="light" />
          <PinnedAnnotation text={paper.text} at={{ x: pin.x + 92, y: pin.y - 64 }} target={pin} start={paper.start} />
        </DeskPlane>
        <DeskLight light={light} pool={{ x: 55, y: 40 }} />
      </DeskInsert>
    </AbsoluteFill>
  );
};

const DeskSignature: React.FC<{ frame: number; light: Light; shot: S02ShotId; fast?: boolean }> = ({ frame, light, shot, fast = false }) => {
  const { story } = useStory();
  const form = story.before.artifacts.form;
  const [start] = S02_SHOT[shot];
  const sign = progress(frame, start + (fast ? SIGNATURE.fastDelay : SIGNATURE.delay), fast ? SIGNATURE.fast : SIGNATURE.slow);
  const focus = { x: SIGNATURE_AT.x + 40, y: SIGNATURE_AT.y - 40 };
  const scale = (fast ? 1.9 : 2.25) + (fast ? 0.03 : 0.05) * span(frame, S02_SHOT[shot], LINEAR);
  const labelAt = deskToFrame(formPoint(30, 410), scale, focus);
  // In the repeat, the new form — another site's, another hand — lies on top of the last one.
  const top = { x: FORM.x + 34, y: FORM.y - 30 };
  return (
    <AbsoluteFill>
      <DeskInsert light={light}>
        <DeskPlane tilt={fast ? 18 : 15}>
          <DeskCam scale={scale} focus={fast ? { x: focus.x + 30, y: focus.y - 20 } : focus}>
            {fast ? <Sheet form={form} x={FORM.x - 26} y={FORM.y + 22} scale={FORM.scale} rotate={FORM.rot - 3} fill={1} sign={1} /> : null}
            <Sheet form={form} x={fast ? top.x : FORM.x} y={fast ? top.y : FORM.y} scale={FORM.scale} rotate={fast ? FORM.rot + 2.5 : FORM.rot} fill={1} sign={sign} variant={fast ? 1 : 0} />
            <div style={{ filter: 'blur(1.2px)' }}>
              <Pen x={SIGNATURE_AT.x + 250} y={SIGNATURE_AT.y + 40} rotate={-24} length={300} />
            </div>
          </DeskCam>
          {!fast ? <StepCaption text={stepLabel(story, 'signature')} x={labelAt.x} y={labelAt.y + 34} start={captionStart(shot)} tone={light.exposure > 0.5 ? 'light' : 'dark'} /> : null}
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
  shot: S02ShotId;
  cam: Cam;
  tilt?: Tilt;
  focusIds: string[];
  caption?: { text: string | null; at: Pt };
  cursor?: React.ReactNode;
  /** Frame-space content on the plane, laid out with this shot's camera. */
  pins?: (toFrame: (p: Pt) => Pt) => React.ReactNode;
}> = ({ frame, light, shot, cam, tilt, focusIds, caption, cursor, pins }) => {
  const [from, to] = S02_SHOT[shot];
  const c = pushCam(frame, from, to + SCREEN_PUSH.overrun, cam, SCREEN_PUSH.amount);
  const toFrame = (p: Pt) => canvasToFrame(p, c);
  const cap = caption ? toFrame(caption.at) : null;
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
      {caption && cap ? <StepCaption text={caption.text} x={cap.x} y={cap.y} start={captionStart(shot)} tone="light" /> : null}
      {pins ? pins(toFrame) : null}
    </ScreenShot>
  );
};

/** Where an item is now (canvas), including its entrance offset and drift. */
const useItemAt = (id: string, frame: number, opts?: { settled?: boolean; drift?: number }) => {
  const { fps } = useVideoConfig();
  const item = clutterItem(id);
  const m = clutterMotion(item, frame, fps, opts);
  return (lx: number, ly: number): Pt => ({ x: item.x + lx + m.tx, y: item.y + ly + m.ty });
};

const EmailShot: React.FC<{ frame: number; light: Light }> = ({ frame, light }) => {
  const { story } = useStory();
  const email1 = clutterItem('email1');
  const on = useItemAt('email1', frame);
  const manual = useAnnotation('email');
  return (
    <ScreenStep
      frame={frame}
      light={light}
      shot="email"
      cam={{ zoom: 1.35, focus: { x: 340, y: 222 } }}
      tilt={{ x: 3, y: -9 }}
      focusIds={['email1']}
      caption={{ text: stepLabel(story, 'email'), at: { x: email1.x, y: email1.y + 176 } }}
      cursor={<Cursor path={glidePath(S02_CURSOR.email.path)} clicks={[S02_CURSOR.email.click]} />}
      pins={(toFrame) => {
        const pin = toFrame(on(email1.w, 46));
        return <PinnedAnnotation text={manual.text} at={{ x: pin.x + 64, y: pin.y - 58 }} target={pin} start={manual.start} />;
      }}
    />
  );
};

const FollowUpShot: React.FC<{ frame: number; light: Light }> = ({ frame, light }) => {
  const { story } = useStory();
  const follow1 = clutterItem('follow1');
  const on = useItemAt('follow1', frame);
  const follow = useAnnotation('followUp');
  return (
    <ScreenStep
      frame={frame}
      light={light}
      shot="followUp"
      cam={{ zoom: 1.66, focus: { x: 990, y: 352 } }}
      tilt={{ x: 2, y: 9 }}
      focusIds={['follow1']}
      caption={{ text: stepLabel(story, 'followUp'), at: { x: follow1.x, y: follow1.y + 108 } }}
      pins={(toFrame) => {
        const pin = toFrame(on(34, 0));
        return <PinnedAnnotation text={follow.text} at={{ x: pin.x - 19, y: pin.y - 84 }} target={pin} start={follow.start} from="bottom" />;
      }}
    />
  );
};

const SystemShot: React.FC<{ frame: number; light: Light }> = ({ frame, light }) => {
  const { story } = useStory();
  const sys1 = clutterItem('sys1');
  const on = useItemAt('sys1', frame);
  const field = typedFieldRect(sys1);
  const risk = useAnnotation('typedField');
  return (
    <ScreenStep
      frame={frame}
      light={light}
      shot="systemUpdate"
      cam={{ zoom: 1.35, focus: { x: 488, y: 402 } }}
      tilt={{ x: 5, y: -6 }}
      focusIds={['sys1']}
      caption={{ text: stepLabel(story, 'systemUpdate'), at: { x: sys1.x, y: sys1.y + 226 } }}
      cursor={<Cursor path={glidePath(S02_CURSOR.systemUpdate.path)} clicks={[S02_CURSOR.systemUpdate.click]} />}
      pins={(toFrame) => {
        // Risk of Human Error: on the field being typed by hand, the pill just under the window.
        const pin = toFrame(on(field.x - sys1.x + 70, field.y - sys1.y + field.h));
        return <PinnedAnnotation text={risk.text} at={{ x: pin.x - 19, y: pin.y + 98 }} target={pin} start={risk.start} from="top" />;
      }}
    />
  );
};

const FilesShot: React.FC<{ frame: number; light: Light }> = ({ frame, light }) => {
  const { story } = useStory();
  const rec = recordPositions(frame);
  const rec1 = clutterItem('rec1');
  const sys1 = clutterItem('sys1');
  const effort = useAnnotation('system');
  const { fps } = useVideoConfig();
  const m = clutterMotion(rec1, frame, fps);
  // His hand: grabs the record, then drags the second copy to its place as it splits.
  const grab = S02_CURSOR.files.approach[S02_CURSOR.files.approach.length - 1];
  const approach = glidePath(S02_CURSOR.files.approach);
  const path = (f: number): Pt => {
    if (f <= grab.f) return approach(f);
    const b = recordPositions(f).b;
    const m0 = clutterMotion(rec1, f, fps);
    return { x: grab.x + (b.x - rec1.x) + m0.tx, y: grab.y + (b.y - rec1.y) + m0.ty };
  };
  return (
    <ScreenStep
      frame={frame}
      light={light}
      shot="files"
      cam={{ zoom: 1.1, focus: { x: 660, y: 560 } }}
      tilt={{ x: 9, y: 0 }}
      focusIds={['rec1']}
      caption={{ text: stepLabel(story, 'files'), at: { x: rec.a.x + m.tx, y: rec.a.y + 130 + m.ty } }}
      cursor={<Cursor path={path} clicks={[S02_CURSOR.files.click]} />}
      pins={(toFrame) => {
        // High Manual Effort: pinned to the System 800 window above the records (soft, behind).
        const pin = toFrame({ x: sys1.x + 150, y: sys1.y + CLUTTER_HEIGHT.system });
        return <PinnedAnnotation text={effort.text} at={{ x: pin.x - 19, y: pin.y + 70 }} target={pin} start={effort.start} from="top" />;
      }}
    />
  );
};

/* -------------------------------------------------------------- the pile-up */

/**
 * Where each annotation sits in the workspace shots: pinned to (a point on) its clutter
 * item — or the paper at the desk edge — with the pill placed beside it (frame px).
 */
const PILE_LAYOUT: Record<
  AnnotationRole,
  { item: string | 'desk'; local: Pt; offset: Pt; align?: 'left' | 'right'; from?: 'side' | 'top' | 'bottom'; ground?: 'light' | 'dark' }
> = {
  // the request cascade, from its left
  repeat: { item: 'req2', local: { x: 0, y: 52 }, offset: { x: -64, y: -44 }, align: 'right' },
  // on top of the email stack
  email: { item: 'email1', local: { x: 64, y: 0 }, offset: { x: -19, y: -50 }, from: 'bottom' },
  // under the follow-up at the right
  followUp: { item: 'follow1', local: { x: 300, y: 92 }, offset: { x: 24, y: 58 }, align: 'right', from: 'top' },
  // the System 800 windows' title bar
  system: { item: 'sys3', local: { x: 40, y: 0 }, offset: { x: -19, y: -60 }, from: 'bottom' },
  // the field being typed by hand (local is resolved from the field's rect)
  typedField: { item: 'sys3', local: { x: 0, y: 0 }, offset: { x: -19, y: 84 }, from: 'top' },
  // the forms at the desk edge (the dark room)
  paper: { item: 'desk', local: { x: 0, y: 0 }, offset: { x: 110, y: -40 }, ground: 'dark' },
};

/**
 * A pinned annotation in the over-the-shoulder workspace frame: `born` in the shot of its
 * own artefact (the Repeat shot), or landing again in the last loop's `pile`.
 */
const WorkspaceAnnotation: React.FC<{ role: AnnotationRole; frame: number; phase: 'born' | 'pile'; drift?: number }> = ({ role, frame, phase, drift = 0 }) => {
  const { fps } = useVideoConfig();
  const a = useAnnotation(role);
  const held = phase === 'pile' && a.pile === 'held';
  const start = phase === 'born' ? a.start : a.pile === 'held' ? 0 : a.pile;
  const L = PILE_LAYOUT[role];
  let target: Pt;
  if (L.item === 'desk') {
    const sheet = DESK_PILE[DESK_PILE.length - 1];
    target = { x: sheet.x - 30, y: sheet.y + 18 };
  } else {
    const item = clutterItem(L.item);
    const m = clutterMotion(item, frame, fps, { drift });
    const local = role === 'typedField' ? (() => {
      const f = typedFieldRect(item);
      return { x: f.x - item.x + 90, y: f.y - item.y + f.h };
    })() : L.local;
    // pinned to where the item rests (the newest copies are still landing around it)
    target = screenToFrame({ x: item.x + local.x + m.drift.x, y: item.y + local.y + m.drift.y });
  }
  return (
    <PinnedAnnotation
      text={a.text}
      at={{ x: target.x + L.offset.x, y: target.y + L.offset.y }}
      target={target}
      start={start}
      held={held}
      align={L.align}
      from={L.from}
      ground={L.ground}
    />
  );
};

/* -------------------------------------------------------------- scene */

export const BeforeScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const light = beforeLight(frame);
  const last = durationInFrames - 1;
  const req2 = clutterItem('req2');
  const shotAt = (id: S02ShotId) => frame >= S02_SHOT[id][0] && frame < S02_SHOT[id][1];

  let shot: React.ReactNode = null;

  if (shotAt('paperForm')) {
    shot = <DeskForm frame={frame} light={light} />;
  } else if (shotAt('signature')) {
    shot = <DeskSignature frame={frame} light={light} shot="signature" />;
  } else if (shotAt('email')) {
    shot = <EmailShot frame={frame} light={light} />;
  } else if (shotAt('followUp')) {
    shot = <FollowUpShot frame={frame} light={light} />;
  } else if (shotAt('systemUpdate')) {
    shot = <SystemShot frame={frame} light={light} />;
  } else if (shotAt('files')) {
    shot = <FilesShot frame={frame} light={light} />;
  } else if (shotAt('anotherEmail')) {
    const fwd1 = clutterItem('fwd1');
    shot = (
      <ScreenStep
        frame={frame}
        light={light}
        shot="anotherEmail"
        cam={{ zoom: 1.4, focus: { x: 760, y: 560 } }}
        tilt={{ x: 2, y: -10 }}
        focusIds={['fwd1']}
        caption={{ text: stepLabel(story, 'anotherEmail'), at: { x: fwd1.x, y: fwd1.y + 176 } }}
        cursor={<Cursor path={glidePath(S02_CURSOR.anotherEmail.path)} />}
      />
    );
  } else if (shotAt('repeat')) {
    // Repeat — match cut: the same request lands again, in the same place, over the last one.
    const capAt = screenToFrame({ x: req2.x + 2, y: req2.y + 150 });
    const f = S02_FLASH.repeat;
    shot = (
      <AbsoluteFill>
        <BeforeWorkspace
          frame={frame}
          light={light}
          flash={envelope(frame, f.span[0], f.span[1], f.in, f.out) * f.amount}
          overlay={<Cursor path={glidePath(S02_CURSOR.repeat.path)} clicks={[S02_CURSOR.repeat.click]} />}
        />
        <StepCaption text={stepLabel(story, 'repeat')} x={capAt.x} y={capAt.y} start={captionStart('repeat')} tone="light" />
        <WorkspaceAnnotation role="repeat" frame={frame} phase="born" />
      </AbsoluteFill>
    );
  } else if (shotAt('fastSignature')) {
    shot = <DeskSignature frame={frame} light={light} shot="fastSignature" fast />;
  } else if (shotAt('fastEmail')) {
    shot = <ScreenStep frame={frame} light={light} shot="fastEmail" cam={{ zoom: 1.25, focus: { x: 300, y: 262 } }} tilt={{ x: 3, y: 10 }} focusIds={['email2']} />;
  } else if (shotAt('fastFollowUp')) {
    shot = <ScreenStep frame={frame} light={light} shot="fastFollowUp" cam={{ zoom: 1.25, focus: { x: 180, y: 470 } }} tilt={{ x: -3, y: -8 }} focusIds={['follow2']} />;
  } else {
    // The last loop races, the annotations pile up on their objects, and everything holds.
    const fl = S02_FLASH.lastLoop;
    const flashes = fl.at.reduce((m, t) => Math.max(m, envelope(frame, t, t + fl.length, fl.in, fl.out)), 0);
    const drift = mapClamp(frame, [S02_DRIFT_FROM, last], [0, 1]);
    shot = (
      <AbsoluteFill>
        <BeforeWorkspace
          frame={frame}
          light={light}
          drift={drift}
          flash={flashes * fl.amount}
          overlay={<Cursor path={glidePath(S02_CURSOR.lastLoop.path)} />}
        />
        {S02_ANNOTATIONS.map((a) => (
          <WorkspaceAnnotation key={a.role} role={a.role} frame={frame} phase="pile" drift={drift} />
        ))}
      </AbsoluteFill>
    );
  }

  return <AbsoluteFill style={{ backgroundColor: '#000' }}>{shot}</AbsoluteFill>;
};
