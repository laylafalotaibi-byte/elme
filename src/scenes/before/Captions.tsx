import React from 'react';
import { useCurrentFrame } from 'remotion';
import { toneColors, type, type Tone } from '../../campaign/theme';
import { ease, progress } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { Annotation } from '../../components/ui/Annotation';

/**
 * Step caption — the step's name, set small on its own artefact (no rail, no numbers):
 * a hairline that draws, then the word rising from a mask.
 */
export const StepCaption: React.FC<{
  text: string | null;
  x: number;
  y: number;
  start: number;
  tone?: Tone;
  /** Right-align to x instead of left. */
  alignRight?: boolean;
}> = ({ text, x, y, start, tone = 'light', alignRight = false }) => {
  const frame = useCurrentFrame();
  if (!text || frame < start) return null;
  const c = toneColors(tone);
  // Fast (lands in 12 f): BEFORE shots are short and a caption must be readable before the cut.
  const rule = progress(frame, start, 8, ease.out);
  const word = progress(frame, start + 1, 11, ease.out);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transform: alignRight ? 'translateX(-100%)' : undefined,
        flexDirection: alignRight ? 'row-reverse' : 'row',
      }}
    >
      <span style={{ width: 26 * rule, height: 1.5, background: c.text, opacity: 0.55 }} />
      <span style={{ display: 'inline-block', overflow: 'hidden', padding: '0.06em 0.1em 0.16em 0', margin: '-0.06em -0.1em -0.16em 0' }}>
        <span
          style={{
            display: 'inline-block',
            ...type.caption,
            color: c.text,
            whiteSpace: 'nowrap',
            transform: `translateY(${(1 - word) * 1.05}em)`,
            opacity: Math.min(1, word * 1.5),
          }}
        >
          {text}
        </span>
      </span>
    </div>
  );
};

/**
 * Scene 02 annotation pop-ups (verbatim from story.before.annotations). They persist across
 * cuts and accumulate around the frame's edge — by the end they surround him. Positions are
 * chosen so none ever covers the step on screen when it lands.
 *
 * `index` points into story.before.annotations (brief order: Manual, Repeated Daily,
 * Paper-Based, Multiple Follow-ups, High Manual Effort, Risk of Human Error).
 */
export const ANNOTATION_SCHEDULE: Array<{ index: number; at: number; x: number; y: number }> = [
  { index: 2, at: 12, x: 1352, y: 1012 }, // Paper-Based — by the paper, low right
  { index: 0, at: 54, x: 150, y: 136 }, // Manual — upper left
  { index: 3, at: 80, x: 1418, y: 94 }, // Multiple Follow-ups — top right
  { index: 4, at: 108, x: 118, y: 286 }, // High Manual Effort — left
  { index: 5, at: 128, x: 812, y: 1014 }, // Risk of Human Error — low centre
  { index: 1, at: 166, x: 742, y: 92 }, // Repeated Daily — top centre
];

export const AnnotationLayer: React.FC = () => {
  const { story } = useStory();
  return (
    <>
      {ANNOTATION_SCHEDULE.map(({ index, at, x, y }) => {
        const text = story.before.annotations[index];
        if (!text) return null;
        return <Annotation key={index} text={text} x={x} y={y} start={at} tone="dark" busy />;
      })}
    </>
  );
};
