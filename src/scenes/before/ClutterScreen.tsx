import React from 'react';
import { useVideoConfig } from 'remotion';
import { useStory } from '../../campaign/StoryContext';
import { ease, progress, springAt, springs } from '../../campaign/motion';
import { RequestCard } from '../../components/ui/RequestCard';
import { EmailCard, FollowUpPing } from '../../components/ui/artifacts/Messages';
import { SystemWindow } from '../../components/ui/artifacts/SystemWindow';
import { RecordChip, SiteTag } from './props';
import { REQUEST_SLOT, drift as driftAt, mixPoint } from './shared';

/**
 * His screen during the old process (1280×800 canvas, shared by <Workspace screen>, the
 * screen inserts and BeforeClutter). Layers STACK instead of clearing: every loop of the
 * process leaves its artefacts behind, cascaded over the last one.
 *
 * `enter` frames are Scene 02 local frames. With `settled`, everything is in its final
 * resting place — no dependency on any Sequence timing.
 */

type Pt = { x: number; y: number };
type Base = {
  id: string;
  x: number;
  y: number;
  w: number;
  /** Scene 02 frame the item lands at (undefined = already there). */
  enter?: number;
  /** Offset it travels in from (canvas px). */
  from?: Pt;
  /** Faster settle for the accelerating last loop. */
  snap?: boolean;
  /** Uncounted "Site" tag on this item (marks a new cluster). */
  tag?: boolean;
};

export type ClutterItem =
  | (Base & { kind: 'request' })
  | (Base & { kind: 'email' })
  | (Base & { kind: 'forward' })
  | (Base & { kind: 'followUp' })
  | (Base & { kind: 'system'; typeStart?: number; perChar?: number; settledLeft?: number })
  | (Base & { kind: 'records'; a: Pt; b: Pt; splitAt: number; dragged?: boolean });

const R = REQUEST_SLOT;

/** Cascade offset between loops (identical windows, stacked). */
const CASCADE = { x: 24, y: 26 } as const;

export const CLUTTER: ClutterItem[] = [
  /* loop 1 — the slow, full pass */
  { id: 'req1', kind: 'request', x: R.x, y: R.y, w: R.w },
  // Each step's artefact starts entering 2–5 f BEFORE its insert cuts in, so every insert
  // opens on movement (cut on action), never on an empty screen.
  { id: 'email1', kind: 'email', x: 70, y: 104, w: 470, enter: 42, from: { x: -30, y: 90 } },
  { id: 'follow1', kind: 'followUp', x: 925, y: 300, w: 330, enter: 63, from: { x: 420, y: 0 } },
  { id: 'sys1', kind: 'system', x: 240, y: 300, w: 620, enter: 85, from: { x: 0, y: 70 }, typeStart: 97, perChar: 2 },
  { id: 'rec1', kind: 'records', x: 500, y: 604, w: 320, enter: 116, from: { x: 0, y: 40 }, a: { x: 200, y: 612 }, b: { x: 800, y: 590 }, splitAt: 122, dragged: true },
  { id: 'fwd1', kind: 'forward', x: 560, y: 520, w: 460, enter: 134, from: { x: 60, y: 90 } },

  /* loop 2 — ≈ 8 f per step */
  { id: 'req2', kind: 'request', x: R.x + CASCADE.x, y: R.y + CASCADE.y, w: R.w, enter: 151, tag: true },
  { id: 'email2', kind: 'email', x: 70 + CASCADE.x, y: 104 + CASCADE.y, w: 470, enter: 178, from: { x: -20, y: 70 }, tag: true },
  { id: 'follow2', kind: 'followUp', x: 26, y: 432, w: 330, enter: 186, from: { x: -400, y: 0 } },
  { id: 'sys2', kind: 'system', x: 240 + CASCADE.x, y: 300 + CASCADE.y, w: 620, enter: 196, from: { x: 0, y: 60 }, typeStart: 198, perChar: 1, snap: true },

  /* loop 3 — ≈ 4 f per step (interleaved with the last of loop 2) */
  { id: 'req3', kind: 'request', x: R.x + CASCADE.x * 2, y: R.y + CASCADE.y * 2, w: R.w, enter: 199, tag: true, snap: true },
  { id: 'fwd2', kind: 'forward', x: 760, y: 560, w: 460, enter: 201, from: { x: 80, y: 60 }, snap: true },
  { id: 'email3', kind: 'email', x: 70 + CASCADE.x * 2, y: 104 + CASCADE.y * 2, w: 470, enter: 203, from: { x: -20, y: 60 }, tag: true, snap: true },
  { id: 'follow3', kind: 'followUp', x: 470, y: 30, w: 330, enter: 205, from: { x: 0, y: -170 }, snap: true },
  { id: 'sys3', kind: 'system', x: 240 + CASCADE.x * 2, y: 300 + CASCADE.y * 2, w: 620, enter: 206, from: { x: 0, y: 50 }, snap: true, typeStart: 207, perChar: 1, settledLeft: 4 },
  // the last arrival lands by ≈ 216 so the storyboard's 215–225 hold is still
  { id: 'follow4', kind: 'followUp', x: 930, y: 676, w: 330, enter: 207, from: { x: 380, y: 0 }, snap: true },
];

const SNAP = { damping: 22, stiffness: 300, mass: 0.7 } as const;

/** The ping that "interrupts" periodically when the settled clutter drifts. */
const NUDGED = 'follow2';

/** Lands-by frame of an item (for scheduling cuts/captions). */
export const clutterItem = (id: string) => {
  const item = CLUTTER.find((i) => i.id === id);
  if (!item) throw new Error(`Unknown clutter item ${id}`);
  return item;
};

/** Top-left of the System 800 field that is typed by hand (last field), canvas coords. */
export const typedFieldRect = (sys: { x: number; y: number; w: number }) => {
  const colW = (sys.w - 36 - 16) / 2;
  return { x: sys.x + 18 + colW + 16, y: sys.y + 48 + 18 + 53 + 14 + 17, w: colW, h: 36 };
};

export const ClutterScreen: React.FC<{
  frame: number;
  settled?: boolean;
  /** Only render these ids. */
  only?: string[];
  /** Skip these ids. */
  except?: string[];
  /** Restless drift amount (0…1 → ≤ 3 px). */
  drift?: number;
  /** Periodic interruption 0…1: the newest edge ping nudges in by ≤ 4 px. */
  nudge?: number;
}> = ({ frame, settled = false, only, except, drift = 0, nudge = 0 }) => {
  const { fps } = useVideoConfig();
  const { story } = useStory();
  const a = story.before.artifacts;
  const fieldsTotal = a.system.fields.reduce((n, f) => n + f.value.length, 0);
  const lastLen = a.system.fields[a.system.fields.length - 1]?.value.length ?? 0;

  const items = CLUTTER.filter((i) => (!only || only.includes(i.id)) && (!except || !except.includes(i.id)));

  return (
    <>
      {items.map((item) => {
        const pending = !settled && item.enter !== undefined && frame < item.enter;
        if (pending) return null;
        const live = !settled && item.enter !== undefined;
        const s = live ? springAt(frame, fps, item.enter as number, item.snap ? SNAP : springs.busy) : 1;
        const from = item.from ?? { x: 0, y: 0 };
        const d = drift > 0 ? driftAt(frame, item.id, 3 * drift) : { x: 0, y: 0 };
        const nudgeX = item.id === NUDGED ? 4 * nudge : 0;
        const tx = from.x * (1 - s) + d.x + nudgeX;
        const ty = from.y * (1 - s) + d.y;
        const opacity = Math.min(1, Math.max(0, s * 1.8));

        const wrap = (node: React.ReactNode, extra?: React.ReactNode) => (
          <div key={item.id} style={{ position: 'absolute', left: item.x, top: item.y, width: item.w, transform: `translate(${tx}px, ${ty}px)`, opacity }}>
            {node}
            {item.tag ? <SiteTag text={a.siteTag} style={{ right: -14, top: -16 }} /> : null}
            {extra}
          </div>
        );

        switch (item.kind) {
          case 'request':
            return (
              <div key={item.id} style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${d.x}px, ${d.y}px)` }}>
                <RequestCard data={story.person.request} x={item.x} y={item.y} start={live ? (item.enter as number) : -1000} tone="light" width={item.w} busy />
                {item.tag && (settled || frame >= (item.enter ?? 0) + 4) ? (
                  <div style={{ position: 'absolute', left: item.x, top: item.y, width: item.w, opacity: settled ? 1 : progress(frame, (item.enter ?? 0) + 4, 8) }}>
                    <SiteTag text={a.siteTag} style={{ right: -12, top: -16 }} />
                  </div>
                ) : null}
              </div>
            );
          case 'email':
            return wrap(<EmailCard to={a.email.to} subject={a.email.subject} preview={a.email.preview} attachment={a.records.fileName} tone="light" width={item.w} />);
          case 'forward':
            return wrap(<EmailCard to={a.email.to} subject={a.anotherEmail.subject} preview={a.anotherEmail.preview} attachment={a.records.fileName} tone="light" width={item.w} />);
          case 'followUp':
            return wrap(<FollowUpPing subject={a.followUp.subject} message={a.followUp.message} tone="light" width={item.w} />);
          case 'system': {
            const pre = fieldsTotal - lastLen;
            // `settledLeft`: the last window is never finished — the scene's last frame and the
            // settled BeforeClutter both stop with the same characters still to type.
            const cap = fieldsTotal - (item.settledLeft ?? 0);
            let typed = cap;
            if (!settled && item.typeStart !== undefined) typed = Math.min(cap, pre + Math.max(0, Math.floor((frame - item.typeStart) / (item.perChar ?? 2))));
            return wrap(<SystemWindow name={a.system.name} title={a.system.title} fields={a.system.fields} tag={a.system.tag} typing={fieldsTotal ? typed / fieldsTotal : 1} tone="light" width={item.w} />);
          }
          case 'records': {
            const split = settled ? 1 : progress(frame, item.splitAt, 11, ease.inOut);
            const pa = mixPoint({ x: item.x, y: item.y }, item.a, split);
            const pb = mixPoint({ x: item.x, y: item.y }, item.b, split);
            const [placeA, placeB] = [a.records.buckets[0] ?? '', a.records.buckets[1] ?? a.records.buckets[0] ?? ''];
            return (
              <div key={item.id} style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${tx}px, ${ty}px)`, opacity }}>
                <RecordChip place={placeB} fileName={a.records.fileName} width={item.w} style={{ position: 'absolute', left: pb.x, top: pb.y }} />
                <RecordChip place={placeA} fileName={a.records.fileName} width={item.w} style={{ position: 'absolute', left: pa.x, top: pa.y }} />
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
};

/** Canvas centre of a record copy at a given split (for captions / pins). */
export const recordPositions = (frame: number, settled = false) => {
  const rec = clutterItem('rec1');
  if (rec.kind !== 'records') throw new Error('rec1 must be a records item');
  const split = settled ? 1 : progress(frame, rec.splitAt, 11, ease.inOut);
  return { a: mixPoint({ x: rec.x, y: rec.y }, rec.a, split), b: mixPoint({ x: rec.x, y: rec.y }, rec.b, split), w: rec.w };
};
