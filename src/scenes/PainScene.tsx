import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { useStory } from '../campaign/StoryContext';
import { LIGHT } from '../campaign/light';
import { colors, layout, type } from '../campaign/theme';
import { ease, mapClamp } from '../campaign/motion';
import { DeskInsert } from '../components/set/Inserts';
import { HeroShot } from '../components/set/HeroShot';
import { SystemWindow } from '../components/ui/artifacts/SystemWindow';
import { MaskedReveal } from '../components/typography/Reveal';
import { ClutterScreen, typedFieldRect } from './before/ClutterScreen';
import { PaperPile, PaperStack, PhoneEmails, STACK, pilePin, stackPin } from './before/PainSet';
import { PinnedIndicator } from './before/Pinned';
import { DeskLight, RecordChip } from './before/props';
import { DeskPlane, ScreenShot } from './before/ScreenShot';
import { canvasToFrame, pushCam, splitTwo, type Cam } from './before/shared';
import type { SceneProps } from './types';

/**
 * Scene 03 — The Pain (PROBLEM, felt) · 240 f · light dimmed.
 *
 * Slower. One line at a time, each on its own shot; indicators pinned to real objects
 * (never in a row), at most two on screen.
 *
 *   0–62    Desk: one single paper form, in focus.            "The task wasn't difficult." (in 8)
 *   54–90   The camera pulls back: the same form is one of a stack of identical forms,
 *           emails stacked behind; line 1 steps back to 40 %.  "But repeating it every day…" (in 58)
 *   90–140  Settled. TIME ↓ pinned to the stack (92) · EFFORT ↑ pinned to the paper pile (104).
 *           (8–10 f earlier than the storyboard's 100 / 114: an indicator takes 26 f to build,
 *           and EFFORT must land ≥ 10 f before the cut at 140. Both start after the camera has
 *           settled, so their pins — laid out at camera 1 — sit exactly on the objects.)
 *   140–156 Cut → Hero shot (close): he looks at it. Silence.
 *   156–240 Screen: the System 800 field being typed; the two record places.
 *           "And every manual step created another opportunity for error." (in 158)
 *           RISK ↑ pinned to the typed field (194) · RECORDS pinned to both record places (206)
 */

const TEXT_X = layout.marginX;
const LINE = { ...type.displayM, color: colors.textOnDark, whiteSpace: 'nowrap' as const };

/* -------------------------------------------------------------- desk shot */

/** Camera over the (tilted) desk: world point `focus` lands on frame point `at`. */
const deskCamera = (frame: number) => {
  const t = mapClamp(frame, [54, 90], [0, 1], ease.inOut);
  const scale = 1.62 + (1 - 1.62) * t;
  const focus = { x: STACK.x, y: STACK.y };
  // Close framing sits far enough right that the loose pile is fully out of frame: the first
  // shot is one form, simple — nothing else bright in the picture.
  const at = { x: 1420 + (STACK.x - 1420) * t, y: 430 + (STACK.y - 430) * t };
  // a breath of movement while it holds close
  const drift = mapClamp(frame, [0, 54], [0, 1]) * 0.015 * (1 - t);
  return { scale: scale * (1 + drift), focus, at };
};

const DeskShot: React.FC<{ frame: number }> = ({ frame }) => {
  const { story } = useStory();
  const light = LIGHT.dimmed;
  const cam = deskCamera(frame);
  const spread = mapClamp(frame, [58, 90], [0, 1], ease.inOut);
  const dof = 6 * (1 - mapClamp(frame, [54, 90], [0, 1], ease.inOut));
  const [l2a, l2b] = splitTwo(story.pain.lines[1]);
  const step = mapClamp(frame, [54, 68], [1, 0.4], ease.inOut);
  const [time, effort] = story.pain.indicators;
  return (
    <AbsoluteFill>
      <DeskInsert light={light}>
        <DeskPlane tilt={11}>
          <AbsoluteFill
            style={{
              transform: `translate(${cam.at.x - cam.focus.x * cam.scale}px, ${cam.at.y - cam.focus.y * cam.scale}px) scale(${cam.scale})`,
              transformOrigin: '0 0',
            }}
          >
            {/* depth of field: at first only the one form is sharp */}
            <div style={{ filter: dof > 0.05 ? `blur(${dof.toFixed(2)}px)` : undefined }}>
              <PhoneEmails />
              <PaperPile />
            </div>
            <PaperStack spread={spread} />
          </AbsoluteFill>
          <DeskLight light={light} pool={{ x: 58, y: 36 }} spread={58} />
          <PinnedIndicator indicator={time} x={stackPin.x + 78} y={stackPin.y - 70} start={92} leadDuration={12} targets={[{ x: stackPin.x - 6, y: stackPin.y + 8 }]} />
          <PinnedIndicator indicator={effort} x={pilePin.x - 220} y={pilePin.y + 84} start={104} leadDuration={12} targets={[{ x: pilePin.x, y: pilePin.y }]} />
        </DeskPlane>
      </DeskInsert>
      {/* copy: flat, never inside the camera */}
      <div style={{ position: 'absolute', left: TEXT_X, top: 664, opacity: step }}>
        <MaskedReveal start={6} duration={20} block>
          <span style={LINE}>{story.pain.lines[0]}</span>
        </MaskedReveal>
      </div>
      <div style={{ position: 'absolute', left: TEXT_X, top: 772 }}>
        <MaskedReveal start={58} duration={20} block>
          <span style={LINE}>{l2a}</span>
        </MaskedReveal>
        {l2b ? (
          <MaskedReveal start={62} duration={20} block>
            <span style={LINE}>{l2b}</span>
          </MaskedReveal>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- screen shot */

const SYS = { x: 140, y: 170, w: 560 } as const;
const REC_A = { x: 720, y: 158, w: 280 } as const;
const REC_B = { x: 790, y: 340, w: 280 } as const;
const SCREEN_CAM: Cam = { zoom: 1.04, focus: { x: 668, y: 380 } };

const ScreenShotPain: React.FC<{ frame: number; end: number }> = ({ frame, end }) => {
  const { story } = useStory();
  const a = story.before.artifacts;
  const cam = pushCam(frame, 156, end + 6, SCREEN_CAM, 0.025);
  const [l3a, l3b] = splitTwo(story.pain.lines[2]);
  const [, , risk, records] = story.pain.indicators;

  // Typing the last field by hand — slow, with a hesitation.
  const total = a.system.fields.reduce((n, f) => n + f.value.length, 0);
  const lastLen = a.system.fields[a.system.fields.length - 1]?.value.length ?? 0;
  const typedLast = Math.floor(mapClamp(frame, [162, 176], [0, Math.ceil(lastLen / 2)])) + Math.floor(mapClamp(frame, [186, 204], [0, lastLen - Math.ceil(lastLen / 2)]));
  const typing = total ? (total - lastLen + typedLast) / total : 1;

  const field = typedFieldRect(SYS);
  const fieldPin = canvasToFrame({ x: field.x + field.w * 0.42, y: field.y + field.h }, cam);
  // RECORDS sits above-right of both places; one leader drops down-left to Emails, the other
  // straight down to Files, clear of the Emails chip and of the copy.
  const recCorner = { x: REC_A.x + REC_A.w + 44, y: REC_A.y - 40 };
  const aPin = canvasToFrame({ x: REC_A.x + REC_A.w - 2, y: REC_A.y + 64 }, cam);
  const bPin = canvasToFrame({ x: recCorner.x, y: REC_B.y + 27 }, cam);
  const riskAt = canvasToFrame({ x: field.x - 20, y: field.y + field.h + 52 }, cam);
  const recAt = canvasToFrame(recCorner, cam);

  return (
    <ScreenShot
      light={LIGHT.dimmed}
      cam={cam}
      tilt={{ x: 2, y: -2 }}
      backBlur={5}
      back={<ClutterScreen frame={0} settled only={['email1', 'email2', 'email3', 'follow1', 'follow3']} />}
      front={
        <>
          <SystemWindow name={a.system.name} title={a.system.title} fields={a.system.fields} tag={a.system.tag} typing={typing} tone="light" width={SYS.w} style={{ position: 'absolute', left: SYS.x, top: SYS.y }} />
          <RecordChip place={a.records.buckets[0] ?? ''} fileName={a.records.fileName} width={REC_A.w} style={{ position: 'absolute', left: REC_A.x, top: REC_A.y }} />
          <RecordChip place={a.records.buckets[1] ?? ''} fileName={a.records.fileName} width={REC_B.w} style={{ position: 'absolute', left: REC_B.x, top: REC_B.y }} />
        </>
      }
      overlay={
        <div style={{ position: 'absolute', left: TEXT_X, top: 786 }}>
          <MaskedReveal start={157} duration={20} block>
            <span style={{ ...LINE, color: colors.textOnLight }}>{l3a}</span>
          </MaskedReveal>
          {l3b ? (
            <MaskedReveal start={161} duration={20} block>
              <span style={{ ...LINE, color: colors.textOnLight }}>{l3b}</span>
            </MaskedReveal>
          ) : null}
        </div>
      }
    >
      <PinnedIndicator indicator={risk} x={riskAt.x} y={riskAt.y} start={194} tone="light" targets={[fieldPin]} />
      <PinnedIndicator indicator={records} x={recAt.x} y={recAt.y} start={204} tone="light" targets={[aPin, bPin]} leadDuration={12} />
    </ScreenShot>
  );
};

/* -------------------------------------------------------------- scene */

export const PainScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  let shot: React.ReactNode;
  if (frame < 140) {
    shot = <DeskShot frame={frame} />;
  } else if (frame < 156) {
    // He looks at it. Silence — nothing new enters.
    shot = <HeroShot light={LIGHT.dimmed} framing="close" zoom={1 + 0.006 * mapClamp(frame, [140, 156], [0, 1])} />;
  } else {
    shot = <ScreenShotPain frame={frame} end={durationInFrames} />;
  }
  return <AbsoluteFill style={{ backgroundColor: '#000' }}>{shot}</AbsoluteFill>;
};
