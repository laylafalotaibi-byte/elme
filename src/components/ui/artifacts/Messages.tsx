import React from 'react';
import { colors, fonts, radii, shadows, toneColors, type, type Tone } from '../../../campaign/theme';
import { Dot } from '../../glyphs/Glyphs';

/**
 * Email and follow-up artefacts. Generic, unbranded mail UI — no product chrome or logos.
 */

const surface = (tone: Tone): React.CSSProperties => ({
  background: tone === 'dark' ? 'rgba(30,33,37,0.94)' : colors.paperRaised,
  boxShadow: `0 0 0 1px ${tone === 'dark' ? 'rgba(255,255,255,0.08)' : colors.stoneLine}, ${tone === 'dark' ? shadows.dark : shadows.light}`,
  borderRadius: radii.card,
});

export const EmailCard: React.FC<{
  to: string;
  subject: string;
  preview: string;
  from?: string;
  attachment?: string;
  unread?: boolean;
  tone?: Tone;
  width?: number;
  style?: React.CSSProperties;
}> = ({ to, subject, preview, from, attachment, unread = true, tone = 'dark', width = 440, style }) => {
  const c = toneColors(tone);
  return (
    <div style={{ ...surface(tone), width, padding: '20px 22px', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {unread ? <Dot size={6} /> : null}
        <span style={{ ...type.label, fontSize: 12, color: c.muted }}>{from ? `${from} · ${to}` : `To  ${to}`}</span>
      </div>
      <div style={{ ...type.body, fontWeight: 500, fontSize: 19, color: c.text, marginTop: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {subject}
      </div>
      <div style={{ ...type.small, fontSize: 15, color: c.muted, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{preview}</div>
      {attachment ? (
        <div
          style={{
            display: 'inline-block',
            marginTop: 14,
            fontFamily: fonts.mono,
            fontSize: 11,
            letterSpacing: '0.04em',
            color: c.muted,
            padding: '5px 9px',
            borderRadius: 4,
            boxShadow: `0 0 0 1px ${c.line}`,
          }}
        >
          {attachment}
        </div>
      ) : null}
    </div>
  );
};

export const FollowUpPing: React.FC<{
  subject: string;
  message: string;
  tone?: Tone;
  width?: number;
  style?: React.CSSProperties;
}> = ({ subject, message, tone = 'dark', width = 330, style }) => {
  const c = toneColors(tone);
  return (
    <div style={{ ...surface(tone), width, padding: '16px 18px', borderRadius: 14, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Dot size={6} />
        <span style={{ ...type.label, fontSize: 11, color: c.muted }}>{subject}</span>
      </div>
      <div style={{ ...type.body, fontSize: 19, color: c.text, marginTop: 10 }}>{message}</div>
    </div>
  );
};
