import React from 'react';
import { colors, type } from '../../campaign/theme';
import { useStory } from '../../campaign/StoryContext';
import { LineReveal } from './LineReveal';
import { WordSwap } from './WordSwap';
import { S05 } from './timing';

/** Title positions over Scene 05's screen insert (frame coordinates). */
export const INSERT_TITLES = {
  word: { x: 160, y: 150 },
  support: { x: 160, y: 866, w: 1000 },
} as const;

/**
 * LEARN · EXPERIMENT · BUILD · IMPROVE (one at a time, each replacing the last, 76 px) and
 * the supporting line settled at the bottom. Rendered by Scene 05, and frozen on its last
 * frame by Scene 06 while it clears.
 */
export const InsertTitles: React.FC<{ frame?: number }> = ({ frame }) => {
  const { story } = useStory();
  return (
    <>
      <WordSwap
        words={story.reveal.words}
        starts={[...S05.words]}
        frame={frame}
        style={{
          position: 'absolute',
          left: INSERT_TITLES.word.x,
          top: INSERT_TITLES.word.y,
          ...type.displayM,
          letterSpacing: '-0.012em',
          color: colors.textOnLight,
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
          color: '#2A2825',
        }}
      />
    </>
  );
};
