import React from 'react';
import { useCurrentFrame } from 'remotion';
import { toneColors, type, type Tone } from '../../campaign/theme';
import { progress } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';

/** Name + role line under the portrait. Reads name/title/team from the story config. */
export const NamePlate: React.FC<{ start?: number; tone?: Tone; style?: React.CSSProperties }> = ({ start = 0, tone = 'dark', style }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const c = toneColors(tone);
  const p = progress(frame, start, 24);
  const rule = progress(frame, start + 4, 30);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)`, ...style }}>
      <div style={{ height: 1, background: c.line, width: `${rule * 100}%`, marginBottom: 16 }} />
      <div style={{ ...type.title, color: c.text }}>{story.employee.name}</div>
      <div style={{ ...type.label, color: c.muted, marginTop: 8 }}>
        {story.employee.title} · {story.employee.team}
      </div>
    </div>
  );
};
