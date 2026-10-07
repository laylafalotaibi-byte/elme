import React from 'react';
import { colors, fonts, shadows, toneColors, type, type Tone } from '../../../campaign/theme';

/**
 * A record sitting in one location (email attachments, a shared folder, local files…).
 * Several FileChips scattered apart = fragmented records.
 */
export const FileChip: React.FC<{
  location: string;
  fileName: string;
  tone?: Tone;
  width?: number;
  style?: React.CSSProperties;
}> = ({ location, fileName, tone = 'dark', width = 300, style }) => {
  const c = toneColors(tone);
  const dark = tone === 'dark';
  const surface = dark ? 'rgba(30,33,37,0.94)' : colors.paperRaised;
  const edge = dark ? 'rgba(255,255,255,0.09)' : colors.stoneLine;
  return (
    <div style={{ width, position: 'relative', paddingTop: 14, ...style }}>
      {/* folder tab */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: 18,
          padding: '0 12px',
          borderRadius: '6px 6px 0 0',
          background: surface,
          boxShadow: `0 0 0 1px ${edge}`,
          clipPath: 'inset(-2px -2px 0 -2px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ ...type.label, fontSize: 9, color: c.muted }}>{location}</span>
      </div>
      <div
        style={{
          borderRadius: '0 8px 8px 8px',
          background: surface,
          boxShadow: `0 0 0 1px ${edge}, ${dark ? shadows.dark : shadows.light}`,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <svg width={18} height={22} viewBox="0 0 18 22">
          <path d="M1 1 H12 L17 6 V21 H1 Z" fill="none" stroke={c.muted} strokeWidth={1.2} />
          <path d="M12 1 V6 H17" fill="none" stroke={c.muted} strokeWidth={1.2} />
        </svg>
        <span style={{ fontFamily: fonts.mono, fontSize: 13, color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</span>
      </div>
    </div>
  );
};
