import React from 'react';
import { useCurrentFrame } from 'remotion';
import { colors, fonts, toneColors, type, type Tone } from '../../campaign/theme';
import { ease, progress } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';

/**
 * Documentary lower-third: name and role. Used once, when the film reveals who he is
 * (Scene 05). It only appears once a name is approved — the line beside it already says
 * his role — while the draft composition shows the name placeholder so reviewers see the slot.
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
  if (frame < start || !name) return null;
  const onPhoto = Boolean(story.employee.photo);

  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: 1 - out }}>
      {onPhoto ? (
        // a soft scrim so the type holds up over a real photograph
        <div style={{ position: 'absolute', left: -60, top: -40, width: 620, height: 170, background: 'radial-gradient(ellipse 60% 55% at 35% 50%, rgba(0,0,0,0.45), rgba(0,0,0,0))', pointerEvents: 'none' }} />
      ) : null}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 22 }}>
        <div style={{ width: 2, background: colors.accent, transform: `scaleY(${rule})`, transformOrigin: 'top' }} />
        <div style={{ opacity: text, transform: `translateY(${(1 - text) * 8}px)` }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 36, letterSpacing: '-0.015em', color: c.text }}>{name}</div>
          <div style={{ ...type.label, fontSize: 22, color: c.text, opacity: 0.72, marginTop: 10 }}>{role}</div>
        </div>
      </div>
    </div>
  );
};
