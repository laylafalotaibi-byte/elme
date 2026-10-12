import React from 'react';
import { colors, type } from '../../campaign/theme';
import { useStory } from '../../campaign/StoryContext';
import { LineReveal } from './LineReveal';
import { WordSwap } from './WordSwap';
import { WORD_ANCHOR } from './sketch';
import { S05 } from './timing';

/** Supporting line position over Scene 05's screen insert (frame coordinates). */
export const INSERT_TITLES = {
  support: { x: 160, y: 866, w: 1000 },
} as const;

/**
 * LEARN · EXPERIMENT · BUILD · IMPROVE (one at a time, each replacing the last, 76 px),
 * set just above the middle of his line, where his hand is working — and the supporting
 * line settled at the bottom. Rendered by Scene 05 (over the insert and the hero intercut,
 * `tone` follows the picture underneath) and continued by Scene 06 while it clears.
 */
export const InsertTitles: React.FC<{ frame?: number; tone?: 'light' | 'dark' }> = ({ frame, tone = 'light' }) => {
  const { story } = useStory();
  const onDark = tone === 'dark';
  return (
    <>
      <WordSwap
        words={story.reveal.words}
        starts={[...S05.words]}
        lead={S05.wordLead}
        duration={S05.wordRise}
        exitDuration={S05.wordExit}
        align="center"
        frame={frame}
        style={{
          position: 'absolute',
          left: WORD_ANCHOR.x,
          top: WORD_ANCHOR.top,
          ...type.displayM,
          letterSpacing: '-0.012em',
          color: onDark ? colors.textOnDark : colors.textOnLight,
        }}
      />
      <LineReveal
        text={story.reveal.support}
        start={S05.support}
        stagger={1}
        duration={20}
        frame={frame}
        style={{
          position: 'absolute',
          left: INSERT_TITLES.support.x,
          top: INSERT_TITLES.support.y,
          width: INSERT_TITLES.support.w,
          ...type.bodyL,
          color: onDark ? colors.textOnDark : '#2A2825',
        }}
      />
    </>
  );
};
