import React from 'react';
import { random } from 'remotion';
import { colors, fonts, shadows, type } from '../../../campaign/theme';
import { useStory } from '../../../campaign/StoryContext';

/**
 * The paper "Device Handover Form": a physical sheet with handwritten field entries and a
 * signature line. `fill` (0…1) writes the field entries, `sign` (0…1) draws the signature.
 */

// Abstract handwriting (deliberately illegible — no invented data). Each field entry is a
// few "words" of cursive-like loops with uneven x-height, slant and baseline, and a pen lift
// between words. Seeded, so every render is identical.
type Word = { d: string; len: number };

const handwriting = (seed: string, width: number): Word[] => {
  const words: Word[] = [];
  let x = 2;
  const wordCount = 2 + Math.floor(random(`${seed}-n`) * 2);
  for (let w = 0; w < wordCount && x < width - 20; w++) {
    const letters = 3 + Math.floor(random(`${seed}-w${w}`) * 5);
    const baseline = 11 + (random(`${seed}-b${w}`) - 0.5) * 2.4;
    let d = `M${x.toFixed(1)} ${baseline.toFixed(1)}`;
    let len = 0;
    for (let l = 0; l < letters; l++) {
      const r = (k: string) => random(`${seed}-${w}-${l}-${k}`);
      const h = 4.5 + r('h') * 5 + (r('tall') > 0.82 ? 5 : 0); // x-height, the odd ascender
      const step = 4 + r('s') * 3.5;
      const slant = 1.6 + r('sl') * 1.4;
      const drift = (r('d') - 0.5) * 1.2;
      const top = baseline - h;
      d += ` C${(x + slant).toFixed(1)} ${top.toFixed(1)} ${(x + step * 0.55 + slant).toFixed(1)} ${top.toFixed(1)} ${(x + step * 0.6).toFixed(1)} ${(baseline - h * 0.35).toFixed(1)}`;
      d += ` S${(x + step * 0.8).toFixed(1)} ${(baseline + 1.2 + drift).toFixed(1)} ${(x + step).toFixed(1)} ${(baseline + drift).toFixed(1)}`;
      x += step;
      len += step * 2.2 + h;
    }
    words.push({ d, len });
    x += 5 + random(`${seed}-gap${w}`) * 5; // pen lift
  }
  return words;
};

export const SIGNATURE_PATH =
  'M8 44 C14 20 22 9 28 17 C33 24 27 45 20 50 C15 54 18 40 27 33 C37 25 45 29 42 40 C41 46 47 44 53 35 ' +
  'C57 29 61 30 60 38 C59 45 64 45 70 36 L77 27 C78 39 80 47 87 40 C93 33 96 23 103 26 C109 29 104 43 97 45 ' +
  'C92 47 98 36 109 32 C121 28 128 35 137 30 C151 23 167 22 194 25';

/** A signature with a little pen pressure: a main stroke plus a thinner offset pass. */
export const Signature: React.FC<{ draw: number; width?: number; height?: number; color?: string; strokeWidth?: number }> = ({
  draw,
  width = 200,
  height = 64,
  color = '#1F2A44',
  strokeWidth = 2.2,
}) => (
  <svg width={width} height={height} viewBox="0 0 200 64" style={{ overflow: 'visible', display: 'block', opacity: draw > 0 ? 1 : 0 }}>
    {[
      { w: strokeWidth, o: 1, dx: 0, dy: 0 },
      { w: strokeWidth * 0.55, o: 0.55, dx: 0.9, dy: 0.7 },
    ].map((pass, i) => (
      <path
        key={i}
        d={SIGNATURE_PATH}
        transform={`translate(${pass.dx} ${pass.dy})`}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={pass.w}
        strokeOpacity={pass.o}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
    ))}
  </svg>
);

export const PaperForm: React.FC<{
  title: string;
  fields: string[];
  signatureLabel: string;
  fill?: number;
  sign?: number;
  width?: number;
  /** Small label above the title; defaults to the story config's form kicker. */
  kicker?: string;
  /** Changes the handwriting (e.g. a different person's form at another site). */
  variant?: number;
  style?: React.CSSProperties;
}> = ({ title, fields, signatureLabel, fill = 1, sign = 0, width = 360, kicker, variant = 0, style }) => {
  const ink = '#24304A';
  const { story } = useStory();
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
        <span style={{ ...type.label, fontSize: 10, color: colors.mutedOnLight }}>{kicker ?? story.before.artifacts.form.kicker}</span>
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
                {(() => {
                  const words = handwriting(`${title}-${field}-${variant}`, 150);
                  return words.map((word, k) => {
                    const p = Math.max(0, Math.min(1, local * words.length - k));
                    return (
                      <path
                        key={k}
                        d={word.d}
                        pathLength={1}
                        fill="none"
                        stroke={ink}
                        strokeWidth={1.3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={1}
                        strokeDashoffset={1 - p}
                        opacity={p > 0 ? 0.85 : 0}
                      />
                    );
                  });
                })()}
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
