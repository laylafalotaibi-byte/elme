import React from 'react';
import { AbsoluteFill } from 'remotion';
import { colors, fonts, radii, shadows, type } from '../../campaign/theme';
import type { Light } from '../../campaign/light';
import { PaperForm } from '../../components/ui/artifacts/PaperForm';
import type { BeforeArtifacts } from '../../campaign/types';

/**
 * Local props for the BEFORE scenes. Generic, unbranded, no numbers/dates/badges.
 */

/**
 * A record sitting in one place (local variant of FileChip with a legible place label, so
 * "Emails" · "Files" read in an insert).
 */
export const RecordChip: React.FC<{ place: string; fileName: string; width?: number; style?: React.CSSProperties }> = ({
  place,
  fileName,
  width = 320,
  style,
}) => {
  const edge = colors.stoneLine;
  return (
    <div style={{ width, position: 'relative', paddingTop: 26, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: 30,
          padding: '0 14px',
          borderRadius: '7px 7px 0 0',
          background: colors.paperRaised,
          boxShadow: `0 0 0 1px ${edge}`,
          clipPath: 'inset(-2px -2px 0 -2px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ ...type.label, fontSize: 14, letterSpacing: '0.14em', color: colors.mutedOnLight }}>{place}</span>
      </div>
      <div
        style={{
          borderRadius: '0 9px 9px 9px',
          background: colors.paperRaised,
          boxShadow: `0 0 0 1px ${edge}, ${shadows.light}`,
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <svg width={20} height={25} viewBox="0 0 18 22">
          <path d="M1 1 H12 L17 6 V21 H1 Z" fill="none" stroke={colors.mutedOnLight} strokeWidth={1.2} />
          <path d="M12 1 V6 H17" fill="none" stroke={colors.mutedOnLight} strokeWidth={1.2} />
        </svg>
        <span style={{ fontFamily: fonts.mono, fontSize: 16, color: colors.textOnLight, whiteSpace: 'nowrap' }}>{fileName}</span>
      </div>
    </div>
  );
};

/** Uncounted site tag: the same process, restarting somewhere else. */
export const SiteTag: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div
    style={{
      position: 'absolute',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '5px 10px 5px 8px',
      borderRadius: 5,
      background: colors.paperRaised,
      boxShadow: `0 0 0 1px rgba(20,21,22,0.32), 0 6px 12px -8px rgba(0,0,0,0.4)`,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {/* a plain location mark: a hairline ring */}
    <span style={{ width: 9, height: 9, borderRadius: 9, boxShadow: `inset 0 0 0 1.5px ${colors.textOnLight}` }} />
    <span style={{ ...type.label, fontSize: 14, letterSpacing: '0.14em', color: colors.textOnLight }}>{text}</span>
  </div>
);

/** His desktop: a quiet screen with a faint top bar so it reads as a screen, not a slide. */
export const ScreenDesktop: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 800 }}>
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 26, background: 'rgba(20,21,22,0.035)', borderBottom: '1px solid rgba(20,21,22,0.06)' }} />
    <div style={{ position: 'absolute', left: 18, top: 9, width: 54, height: 8, borderRadius: 4, background: 'rgba(20,21,22,0.08)' }} />
    <div style={{ position: 'absolute', right: 18, top: 9, width: 30, height: 8, borderRadius: 4, background: 'rgba(20,21,22,0.08)' }} />
  </div>
);

/**
 * Light on the desk (top-down). In daylight it does almost nothing; as the room dims, only
 * a cool pool of screen light remains on the work — the rest of the desk falls away.
 * `pool` is the lit spot in % of the frame.
 */
export const DeskLight: React.FC<{ light: Light; pool?: { x: number; y: number }; spread?: number }> = ({ light, pool = { x: 62, y: 30 }, spread = 62 }) => {
  const k = Math.max(0, Math.min(1, (0.78 - light.exposure) / 0.62));
  const day = 1 - k;
  return (
    <>
      {/* daylight: a soft window falloff from the left, the far side of the desk a touch darker */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: day,
          background: 'linear-gradient(104deg, rgba(255,253,248,0.12) 0%, rgba(255,253,248,0.03) 34%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.14) 100%)',
        }}
      />
      {/* dim: only a cool pool of screen light remains on the work */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(ellipse ${spread}% ${spread + 14}% at ${pool.x}% ${pool.y}%, rgba(170,190,215,${0.05 * k}) 0%, rgba(6,8,11,${0.28 * k}) 45%, rgba(3,4,6,${0.7 * k}) 82%, rgba(2,3,4,${0.82 * k}) 100%)`,
        }}
      />
    </>
  );
};

/**
 * Work-around: the shared PaperForm strokes (signature + handwriting) leave a round-cap dot
 * at the end of their path when draw = 0 (dasharray 1 / offset 1). An unsigned / unfilled
 * sheet hides those strokes instead.
 */
export const NO_SIGNATURE_CSS =
  '.before-unsigned svg[viewBox="0 0 200 64"]{visibility:hidden}.before-unfilled svg[viewBox="0 0 160 16"]{visibility:hidden}';

/** A paper handover form lying on the desk (frame coordinates, centre-anchored). */
export const Sheet: React.FC<{
  form: BeforeArtifacts['form'];
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  fill?: number;
  sign?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({ form, x, y, scale = 1, rotate = 0, fill = 1, sign = 1, shadow = true, style }) => (
  <div
    className={[sign <= 0 ? 'before-unsigned' : '', fill <= 0 ? 'before-unfilled' : ''].join(' ').trim() || undefined}
    style={{
      position: 'absolute',
      left: x - 180,
      top: y - 205,
      width: 360,
      transform: `rotate(${rotate}deg) scale(${scale})`,
      transformOrigin: '50% 50%',
      ...style,
    }}
  >
    {sign <= 0 || fill <= 0 ? <style>{NO_SIGNATURE_CSS}</style> : null}
    <PaperForm
      title={form.title}
      fields={form.fields}
      signatureLabel={form.signatureLabel}
      fill={fill}
      sign={sign}
      width={360}
      style={shadow ? undefined : { boxShadow: '0 1px 2px rgba(0,0,0,0.25)' }}
    />
  </div>
);

/** Approximate rendered height of PaperForm at width 360 (used for centring). */
export const SHEET_H = 410;

export const windowSurface: React.CSSProperties = {
  borderRadius: radii.window,
  background: colors.paperRaised,
  boxShadow: `0 0 0 1px ${colors.stoneLine}, ${shadows.light}`,
};
