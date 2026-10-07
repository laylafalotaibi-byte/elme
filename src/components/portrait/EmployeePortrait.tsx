import React from 'react';
import { Img, staticFile } from 'remotion';
import { colors, fonts } from '../../campaign/theme';
import { useStory } from '../../campaign/StoryContext';
import { PROFILE_HEAD, PROFILE_TORSO } from './silhouettes';

/**
 * The hero's portrait. One component, used every time the film returns to the person.
 *
 * - With `employee.photo` set in the story config: the photo, in a documentary
 *   monochrome treatment that runs cooler in BEFORE and warmer in AFTER.
 * - Without a photo: a back-lit studio silhouette in three-quarter profile, looking
 *   towards the process. Anonymous, respectful, never a cartoon or an avatar icon.
 */

export type PortraitLight = 'before' | 'after' | 'void' | 'warm';
export type PortraitCrop = 'portrait' | 'close';

const palettes: Record<PortraitLight, { bgCenter: string; bgEdge: string; figTop: string; figBottom: string; rim: string; rimOpacity: number; fill: string; fillOpacity: number; ambient: string }> = {
  before: { bgCenter: '#3B4048', bgEdge: '#141619', figTop: '#121417', figBottom: '#0A0B0D', rim: '#DCE6F2', rimOpacity: 0.75, fill: '#9FB2C8', fillOpacity: 0.16, ambient: 'rgba(160,185,215,0.10)' },
  after: { bgCenter: '#FFFDF8', bgEdge: '#D6CDBF', figTop: '#4B443C', figBottom: '#2B2621', rim: '#FFF7EA', rimOpacity: 0.32, fill: '#FFE6C8', fillOpacity: 0.22, ambient: 'rgba(255,236,210,0.35)' },
  void: { bgCenter: '#1D1F23', bgEdge: '#0B0C0E', figTop: '#08090A', figBottom: '#050506', rim: '#E9E4DA', rimOpacity: 0.55, fill: '#C9C3B8', fillOpacity: 0.08, ambient: 'rgba(255,255,255,0.03)' },
  warm: { bgCenter: '#5A4636', bgEdge: '#1C1814', figTop: '#15110E', figBottom: '#0D0B09', rim: '#FFD8B0', rimOpacity: 0.8, fill: '#FFC896', fillOpacity: 0.16, ambient: 'rgba(255,200,150,0.08)' },
};

const HEAD = PROFILE_HEAD;
const TORSO = PROFILE_TORSO;

const Silhouette: React.FC<{ light: PortraitLight; id: string }> = ({ light, id }) => {
  const p = palettes[light];
  return (
    <svg viewBox="0 0 400 500" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.66" cy="0.34" r="0.85">
          <stop offset="0" stopColor={p.bgCenter} />
          <stop offset="1" stopColor={p.bgEdge} />
        </radialGradient>
        <linearGradient id={`${id}-fig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.figTop} />
          <stop offset="1" stopColor={p.figBottom} />
        </linearGradient>
        <radialGradient id={`${id}-fill`} cx="0.78" cy="0.38" r="0.42">
          <stop offset="0" stopColor={p.fill} stopOpacity={p.fillOpacity} />
          <stop offset="1" stopColor={p.fill} stopOpacity={0} />
        </radialGradient>
        <filter id={`${id}-soft`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation={light === 'after' ? 1.4 : 0.9} />
        </filter>
        {/* Rim light: the figure's right edge (towards the light), softened. */}
        <filter id={`${id}-rim`} x="-10%" y="-10%" width="120%" height="120%">
          <feOffset in="SourceAlpha" dx="-5" dy="2" result="shifted" />
          <feComposite in="SourceAlpha" in2="shifted" operator="out" result="edge" />
          <feGaussianBlur in="edge" stdDeviation="1.6" result="edgeBlur" />
          <feFlood floodColor={p.rim} floodOpacity={p.rimOpacity} />
          <feComposite in2="edgeBlur" operator="in" />
        </filter>
        <filter id={`${id}-bokeh`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={HEAD} />
          <path d={TORSO} />
        </clipPath>
      </defs>

      <rect width="400" height="500" fill={`url(#${id}-bg)`} />
      {/* Out-of-focus environment: window mullions and a soft practical light. */}
      <g filter={`url(#${id}-bokeh)`} opacity={0.9}>
        <rect x="300" y="-20" width="26" height="560" fill={p.ambient} />
        <rect x="360" y="-20" width="14" height="560" fill={p.ambient} />
        <ellipse cx="60" cy="120" rx="34" ry="22" fill={p.ambient} />
      </g>

      <g filter={`url(#${id}-soft)`}>
        <path d={TORSO} fill={`url(#${id}-fig)`} />
        <path d={HEAD} fill={`url(#${id}-fig)`} />
      </g>
      {/* Light falling on the face/shoulder side. */}
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="400" height="500" fill={`url(#${id}-fill)`} />
        {/* Collar hint */}
        <path d="M152 314 C170 340 194 350 210 354 M206 306 L220 334" stroke={p.rim} strokeOpacity={0.12} strokeWidth="2" fill="none" />
      </g>
      <g filter={`url(#${id}-rim)`}>
        <path d={TORSO} fill="#000" />
        <path d={HEAD} fill="#000" />
      </g>
    </svg>
  );
};

const photoFilter: Record<PortraitLight, string> = {
  before: 'grayscale(1) contrast(1.1) brightness(0.86)',
  after: 'grayscale(0.88) sepia(0.14) contrast(1.04) brightness(1.04)',
  void: 'grayscale(1) contrast(1.15) brightness(0.7)',
  warm: 'grayscale(0.9) sepia(0.22) contrast(1.08) brightness(0.9)',
};

export const EmployeePortrait: React.FC<{
  width: number;
  height: number;
  light?: PortraitLight;
  crop?: PortraitCrop;
  /** Extra scale for slow camera pushes (keep ≤ 1.06). */
  zoom?: number;
  /** Show the hairline frame. */
  framed?: boolean;
  style?: React.CSSProperties;
}> = ({ width, height, light = 'before', crop = 'portrait', zoom = 1, framed = true, style }) => {
  const { story, mode } = useStory();
  const { photo, focalPoint } = story.employee;
  const cropScale = crop === 'close' ? 1.55 : 1;
  const scale = cropScale * zoom;
  const origin = `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;
  const border = light === 'after' ? colors.stoneLine : 'rgba(255,255,255,0.08)';
  const id = `portrait-${light}-${crop}-${width}x${height}`;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        borderRadius: 4,
        boxShadow: framed ? `0 0 0 1px ${border}` : undefined,
        background: palettes[light].bgEdge,
        ...style,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: crop === 'close' ? '55% 32%' : origin }}>
        {photo ? (
          <Img
            src={staticFile(photo)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: origin, filter: photoFilter[light] }}
          />
        ) : (
          <Silhouette light={light} id={id} />
        )}
      </div>
      {/* Lens falloff */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            light === 'after'
              ? 'radial-gradient(ellipse 80% 75% at 55% 40%, rgba(0,0,0,0) 60%, rgba(70,55,40,0.14) 100%)'
              : 'radial-gradient(ellipse 80% 75% at 55% 40%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)',
        }}
      />
      {mode === 'draft' && !photo ? (
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 14,
            fontFamily: fonts.mono,
            fontSize: 11,
            letterSpacing: '0.14em',
            color: light === 'after' ? colors.mutedOnLight : colors.mutedOnDark,
            border: `1px dashed ${light === 'after' ? colors.faintOnLight : colors.faintOnDark}`,
            padding: '4px 8px',
          }}
        >
          PHOTO PLACEHOLDER
        </div>
      ) : null}
    </div>
  );
};
