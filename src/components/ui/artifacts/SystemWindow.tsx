import React from 'react';
import { useCurrentFrame } from 'remotion';
import { colors, fonts, radii, shadows, toneColors, type, type Tone } from '../../../campaign/theme';

/**
 * Generic "System 800" update window — manual data entry. `typing` (0…1) types the field
 * values one after another with a caret. Deliberately abstract: not a screenshot.
 */
export const SystemWindow: React.FC<{
  name: string;
  title: string;
  fields: Array<{ label: string; value: string }>;
  typing?: number;
  tone?: Tone;
  width?: number;
  tag?: string;
  style?: React.CSSProperties;
}> = ({ name, title, fields, typing = 1, tone = 'dark', width = 520, tag = 'Manual entry', style }) => {
  const frame = useCurrentFrame();
  const c = toneColors(tone);
  const dark = tone === 'dark';
  const total = fields.reduce((n, f) => n + f.value.length, 0);
  let budget = Math.round(typing * total);
  let caretPlaced = false;

  return (
    <div
      style={{
        width,
        borderRadius: radii.window,
        overflow: 'hidden',
        background: dark ? 'rgba(26,28,32,0.96)' : colors.paperRaised,
        boxShadow: `0 0 0 1px ${dark ? 'rgba(255,255,255,0.09)' : colors.stoneLine}, ${dark ? shadows.dark : shadows.light}`,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: `1px solid ${c.line}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ ...type.label, fontSize: 12, color: c.text }}>{name}</span>
          <span style={{ ...type.small, fontSize: 14, color: c.muted }}>{title}</span>
        </div>
        <span style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.accent }}>{tag}</span>
      </div>
      <div style={{ padding: '18px 18px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
        {fields.map((field) => {
          const shown = Math.max(0, Math.min(field.value.length, budget));
          budget -= field.value.length;
          const typingHere = !caretPlaced && shown < field.value.length;
          if (typingHere) caretPlaced = true;
          const caretOn = typingHere && Math.floor(frame / 8) % 2 === 0;
          return (
            <div key={field.label}>
              <div style={{ ...type.label, fontSize: 10, color: c.muted }}>{field.label}</div>
              <div
                style={{
                  marginTop: 7,
                  height: 36,
                  borderRadius: 6,
                  boxShadow: `inset 0 0 0 1px ${typingHere ? colors.accent : c.line}`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontFamily: fonts.mono,
                  fontSize: 14,
                  color: c.text,
                }}
              >
                {field.value.slice(0, shown)}
                {typingHere ? <span style={{ width: 1.5, height: 16, background: c.text, marginLeft: 2, opacity: caretOn ? 1 : 0 }} /> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
