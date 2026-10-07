import React from 'react';
import { colors, fonts, shadows, type } from '../../../campaign/theme';

/**
 * The paper "Device Handover Form": a physical sheet with handwritten field entries and a
 * signature line. `fill` (0…1) writes the field entries, `sign` (0…1) draws the signature.
 */

// Abstract handwriting strokes (not legible on purpose — no invented data).
const SCRIBBLES = [
  'M0 10 C6 2 10 2 13 9 S20 15 25 7 S33 1 37 9 S45 14 50 8 S58 3 62 10 S70 13 76 7 S86 4 92 10',
  'M0 9 C5 3 9 4 12 10 S19 14 23 6 S30 2 35 10 S44 13 48 6 S56 2 60 9',
  'M0 8 C4 3 8 3 11 9 S16 14 22 8 S28 3 33 9 S40 14 46 8 S52 3 58 9 S66 13 72 7 S80 4 86 9 S94 12 100 8 S108 4 114 9',
  'M0 10 C7 3 11 3 15 10 S22 14 28 7 S36 2 42 10 S50 13 56 7',
  'M0 9 C5 2 9 3 12 9 L18 9 M24 4 L22 14 M30 9 C34 3 38 3 41 9 S47 14 52 8',
];

export const SIGNATURE_PATH =
  'M6 46 C18 12 30 6 34 30 C37 48 30 58 26 44 C22 30 44 10 52 26 C58 38 50 50 56 40 C62 30 68 22 74 34 C78 42 82 40 88 30 C94 20 100 22 102 34 C104 44 110 42 118 32 C126 22 134 26 140 36 C146 44 156 40 168 34 L196 28';

export const Signature: React.FC<{ draw: number; width?: number; height?: number; color?: string; strokeWidth?: number }> = ({
  draw,
  width = 200,
  height = 64,
  color = '#1F2A44',
  strokeWidth = 2.2,
}) => (
  <svg width={width} height={height} viewBox="0 0 200 64" style={{ overflow: 'visible', display: 'block' }}>
    <path
      d={SIGNATURE_PATH}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  </svg>
);

export const PaperForm: React.FC<{
  title: string;
  fields: string[];
  signatureLabel: string;
  fill?: number;
  sign?: number;
  width?: number;
  style?: React.CSSProperties;
}> = ({ title, fields, signatureLabel, fill = 1, sign = 0, width = 360, style }) => {
  const ink = '#24304A';
  return (
    <div
      style={{
        width,
        padding: '30px 30px 26px',
        background: colors.paperRaised,
        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(0,0,0,0.02))',
        borderRadius: 2,
        boxShadow: shadows.paper,
        color: colors.textOnLight,
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...type.label, fontSize: 10, color: colors.mutedOnLight }}>Form</span>
        <span style={{ width: 34, height: 34, borderRadius: 2, boxShadow: `inset 0 0 0 1px ${colors.stoneLine}` }} />
      </div>
      <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, letterSpacing: '-0.01em', marginTop: 10 }}>{title}</div>
      <div style={{ height: 1, background: colors.textOnLight, opacity: 0.8, margin: '16px 0 18px' }} />
      {fields.map((field, i) => {
        const local = Math.max(0, Math.min(1, fill * fields.length - i));
        return (
          <div key={field} style={{ marginBottom: 16 }}>
            <div style={{ ...type.label, fontSize: 10, letterSpacing: '0.12em', color: colors.mutedOnLight }}>{field}</div>
            <div style={{ position: 'relative', height: 22, borderBottom: `1px solid ${colors.stoneLine}` }}>
              <svg width="100%" height={20} viewBox="0 0 160 16" preserveAspectRatio="xMinYMid meet" style={{ position: 'absolute', left: 4, bottom: 2, overflow: 'visible' }}>
                <path
                  d={SCRIBBLES[i % SCRIBBLES.length]}
                  pathLength={1}
                  fill="none"
                  stroke={ink}
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeDasharray={1}
                  strokeDashoffset={1 - local}
                  opacity={0.85}
                />
              </svg>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 22 }}>
        <div style={{ position: 'relative', height: 58, borderBottom: `1px solid ${colors.textOnLight}` }}>
          <div style={{ position: 'absolute', left: 6, bottom: 2 }}>
            <Signature draw={sign} width={190} height={60} color={ink} />
          </div>
        </div>
        <div style={{ ...type.label, fontSize: 10, color: colors.mutedOnLight, marginTop: 8 }}>{signatureLabel}</div>
      </div>
    </div>
  );
};
