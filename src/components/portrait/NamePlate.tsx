import React from 'react';
import { useCurrentFrame } from 'remotion';
import { toneColors, type, type Tone } from '../../campaign/theme';
import { progress } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';

/** Name + role line under the portrait. Reads name/title/team from the story config. */
export const NamePlate: React.FC<{ start?: number; tone?: Tone; style?: React.CSSProperties }> = ({ start = 0, tone = 'dark', style }) => {
  const frame = useCurrentFrame();
  const { story, mode } = useStory();
  const name = story.employee.name ?? (mode === 'draft' ? story.ui.namePlaceholder : null);
  const role = [story.employee.title, story.employee.team].filter(Boolean).join(' · ');
  const c = toneColors(tone);
  const p = progress(frame, start, 24);
  const rule = progress(frame, start + 4, 30);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)`, ...style }}>
      <div style={{ height: 1, background: c.line, width: `${rule * 100}%`, marginBottom: 16 }} />
      {name ? <div style={{ ...type.title, color: c.text }}>{name}</div> : null}
      <div style={{ ...type.label, color: c.muted, marginTop: name ? 8 : 0 }}>{role}</div>
    </div>
  );
};
