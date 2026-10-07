import React from 'react';
import { random } from 'remotion';
import { colors } from '../../campaign/theme';
import { useStory } from '../../campaign/StoryContext';
import { Pen, Phone } from '../../components/set/Inserts';
import { EmailCard } from '../../components/ui/artifacts/Messages';
import { Sheet } from './props';

/**
 * Scene 03's desk, in desk-world frame coordinates (camera 1 = the pulled-back shot):
 *  - the neat STACK of identical handover forms; the form we first see sits on top;
 *  - the loose PAPER PILE of handled, signed forms (manual handling);
 *  - his phone, emails stacked on it, behind the stack.
 */
export const STACK = { x: 1040, y: 392, rot: -2 } as const;
export const PILE = { x: 1590, y: 470 } as const;
export const PHONE = { x: 380, y: 96, rot: -9 } as const;

const STACK_DEPTH = 9;

/** Top-right corner of the stack's top sheet (for the TIME pin). */
export const stackPin = { x: STACK.x + 176, y: STACK.y - 196 };
/** A point on the loose pile's lower edge (for the EFFORT pin). */
export const pilePin = { x: PILE.x - 40, y: PILE.y + 238 };

/** The neat stack. `spread` 0 = every sheet hidden exactly under the top one; 1 = a real stack. */
export const PaperStack: React.FC<{ spread: number }> = ({ spread }) => {
  const { story } = useStory();
  const form = story.before.artifacts.form;
  return (
    <>
      {/* the stack's thickness: a soft contact shadow that grows with it */}
      <div
        style={{
          position: 'absolute',
          left: STACK.x - 200,
          top: STACK.y - 200,
          width: 400,
          height: 440,
          borderRadius: 6,
          boxShadow: `0 ${14 + spread * 14}px ${36 + spread * 26}px -22px rgba(0,0,0,${0.45 + spread * 0.2})`,
          transform: `rotate(${STACK.rot}deg)`,
        }}
      />
      {Array.from({ length: STACK_DEPTH }).map((_, k) => {
        const i = STACK_DEPTH - 1 - k; // draw bottom → top
        const dx = (random(`stack-x-${i}`) - 0.5) * 22 * spread + i * 1.2 * spread;
        const dy = (random(`stack-y-${i}`) - 0.5) * 16 * spread + i * 2.2 * spread;
        const rot = STACK.rot + (random(`stack-r-${i}`) - 0.5) * 5 * spread;
        const top = i === 0;
        return <Sheet key={i} form={form} x={STACK.x + (top ? 0 : dx)} y={STACK.y + (top ? 0 : dy)} rotate={top ? STACK.rot : rot} fill={top ? 1 : 0} sign={top ? 1 : 0} shadow={top} />;
      })}
    </>
  );
};

/** The loose pile of handled forms, the pen on top. */
export const PaperPile: React.FC = () => {
  const { story } = useStory();
  const form = story.before.artifacts.form;
  const sheets = [
    { dx: -40, dy: 40, rot: -14 },
    { dx: 50, dy: -30, rot: 9 },
    { dx: -10, dy: 10, rot: -4 },
    { dx: 70, dy: 60, rot: 15 },
    { dx: 0, dy: -10, rot: 3 },
  ];
  return (
    <>
      {sheets.map((s, i) => (
        <Sheet key={i} form={form} x={PILE.x + s.dx} y={PILE.y + s.dy} rotate={s.rot} fill={1} sign={1} />
      ))}
      <Pen x={PILE.x - 150} y={PILE.y + 120} rotate={-32} length={290} />
    </>
  );
};

/** His phone with the same email stacked on it, again and again. */
export const PhoneEmails: React.FC = () => {
  const { story } = useStory();
  const a = story.before.artifacts;
  return (
    <Phone x={PHONE.x} y={PHONE.y} rotate={PHONE.rot}>
      <div style={{ position: 'absolute', left: 8, right: 8, top: 36 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * 80, filter: i ? `brightness(${1 - i * 0.13})` : undefined }}>
            <EmailCard
              to={a.email.to}
              subject={i % 2 ? a.anotherEmail.subject : a.email.subject}
              preview={i % 2 ? a.anotherEmail.preview : a.email.preview}
              tone="dark"
              width={204}
              style={{ padding: '12px 14px', background: colors.graphiteRaised, height: 72, overflow: 'hidden' }}
            />
          </div>
        ))}
      </div>
    </Phone>
  );
};
