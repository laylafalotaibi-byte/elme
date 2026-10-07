import React from 'react';
import { useCurrentFrame } from 'remotion';
import { colors, fonts, toneColors, type, type Tone } from '../../campaign/theme';
import { ease, progress } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';

/**
 * Documentary lower-third: name and role. Used once, when the film reveals who he is
 * (Scene 05). With no approved name, the final film shows only the role; the draft shows
 * the name placeholder so reviewers see the slot.
 */
export const LowerThird: React.FC<{
  start: number;
  exitAt?: number;
  tone?: Tone;
  x?: number;
  y?: number;
}> = ({ start, exitAt, tone = 'dark', x = 160, y = 860 }) => {
  const frame = useCurrentFrame();
  const { story, mode } = useStory();
  const c = toneColors(tone);
  const name = story.employee.name ?? (mode === 'draft' ? story.ui.namePlaceholder : null);
  const role = [story.employee.title, story.employee.team].filter(Boolean).join(' · ');
  const rule = progress(frame, start, 26, ease.inOut);
  const text = progress(frame, start + 8, 22);
  const out = exitAt === undefined ? 0 : progress(frame, exitAt, 14, ease.in);
  if (frame < start) return null;

  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: 1 - out }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 22 }}>
        <div style={{ width: 2, background: colors.accent, transform: `scaleY(${rule})`, transformOrigin: 'top' }} />
        <div style={{ opacity: text, transform: `translateY(${(1 - text) * 8}px)` }}>
          {name ? <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 36, letterSpacing: '-0.015em', color: c.text }}>{name}</div> : null}
          <div style={{ ...type.label, color: c.muted, marginTop: name ? 10 : 0 }}>{role}</div>
        </div>
      </div>
    </div>
  );
};
