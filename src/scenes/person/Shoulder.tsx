import React, { useId } from 'react';
import { Img, interpolateColors, staticFile } from 'remotion';
import { colors, fonts } from '../../campaign/theme';
import { useStory } from '../../campaign/StoryContext';
import { roomPalette, type Light } from '../../campaign/light';
import { OTS_COLLAR, OTS_FIGURE } from '../../components/portrait/silhouettes';

/**
 * His shoulder and the back of his head in the foreground of the Workspace shot — drawn
 * exactly as <Workspace> draws it (same silhouette, palette, rim light, blur and photo
 * slot), but on its own layer so it can move independently of the room.
 *
 * Why: in Scene 07's split screen the AFTER half is reframed with foreground parallax —
 * the near shoulder slides into the half while the monitor (far) stays put, so the
 * request card never leaves the frame. <Workspace> has no figure offset, so the scenes
 * that need one render <Workspace figure={false}> and this layer on top (see
 * sharedChangeRequests: a `figureOffset` prop on Workspace would retire this copy).
 *
 * Geometry mirrors Workspace: an over-the-shoulder viewBox 920×700 placed at (−190, 452).
 */
const FIG = { left: -190, top: 452, w: 920, h: 700 } as const;

export const ForegroundFigure: React.FC<{ light: Light; flash?: number; offsetX?: number }> = ({ light, flash = 0, offsetX = 0 }) => {
  const { story, mode } = useStory();
  const pal = roomPalette(light);
  const uid = `fg-${useId().replace(/:/g, '')}`;
  const backPhoto = story.employee.backPhoto;
  const figureLit = interpolateColors(0.1 + light.exposure * 0.06, [0, 1], [pal.figure, pal.screen]);
  const figureBlur = 11;
  const dimness = 1 - light.exposure;

  return (
    <>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${offsetX}px)`, pointerEvents: 'none' }}>
      {backPhoto ? (
        <Img
          src={staticFile(backPhoto)}
          style={{
            position: 'absolute',
            left: FIG.left,
            top: FIG.top,
            width: FIG.w,
            height: FIG.h,
            objectFit: 'cover',
            filter: `blur(${figureBlur}px) grayscale(0.9) brightness(${0.35 + light.exposure * 0.45})`,
          }}
        />
      ) : (
        <svg
          viewBox={`0 0 ${FIG.w} ${FIG.h}`}
          style={{ position: 'absolute', left: FIG.left, top: FIG.top, width: FIG.w, height: FIG.h, overflow: 'visible', filter: `blur(${figureBlur}px)` }}
        >
          <defs>
            <linearGradient id={`${uid}-fig`} x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0" stopColor={pal.figure} />
              <stop offset="0.7" stopColor={pal.figure} />
              <stop offset="1" stopColor={figureLit} />
            </linearGradient>
            <filter id={`${uid}-rim`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feOffset in="SourceAlpha" dx="-12" dy="2" result="shifted" />
              <feComposite in="SourceAlpha" in2="shifted" operator="out" result="edge" />
              <feGaussianBlur in="edge" stdDeviation="3.5" result="edgeBlur" />
              <feFlood floodColor={pal.screen} floodOpacity={0.3 + dimness * 0.45 + flash * 0.3} />
              <feComposite in2="edgeBlur" operator="in" />
            </filter>
          </defs>
          <path d={OTS_FIGURE} fill={`url(#${uid}-fig)`} />
          <path d={OTS_COLLAR} stroke={figureLit} strokeWidth={6} fill="none" opacity={0.5} />
          <path d={OTS_FIGURE} fill="#000" filter={`url(#${uid}-rim)`} />
        </svg>
      )}
    </div>
      {/* the draft label stays where Workspace puts it (it labels the shot, not the figure) */}
      {!backPhoto && mode === 'draft' ? (
        <div
          style={{
            position: 'absolute',
            left: 40,
            bottom: 40,
            fontFamily: fonts.mono,
            fontSize: 18,
            letterSpacing: '0.12em',
            color: pal.tone === 'light' ? colors.mutedOnLight : colors.mutedOnDark,
            border: `1px dashed ${pal.tone === 'light' ? colors.faintOnLight : colors.faintOnDark}`,
            padding: '5px 9px',
          }}
        >
          {story.ui.photoPlaceholder}
        </div>
      ) : null}
    </>
  );
};
