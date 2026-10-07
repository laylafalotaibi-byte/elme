import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { StoryProvider } from '../campaign/StoryContext';
import { LIGHT } from '../campaign/light';
import { HeroShot } from '../components/set/HeroShot';
import { LowerThird } from '../components/portrait/LowerThird';
import { FilmFinish } from '../components/fx/Finish';
import { stories } from '../stories';

/**
 * Checks the photo slot end-to-end without touching the story config: the same story with
 * `employee.photo` and `employee.name` overridden. Drop any landscape test image at
 * public/employee/__lab_test_photo.jpg to preview the treatment across the light arc.
 */
export const PhotoLab: React.FC = () => {
  const { story, metrics } = stories.story01;
  const withPhoto = { ...story, employee: { ...story.employee, photo: 'employee/__lab_test_photo.jpg', name: 'Name Surname' } };
  const pages = [LIGHT.normalDay, LIGHT.dimmed, LIGHT.warmKey, LIGHT.warmDay];
  return (
    <StoryProvider story={withPhoto} metrics={metrics} mode="final">
      {pages.map((light, i) => (
        <Sequence key={i} from={i * 10} durationInFrames={10}>
          <HeroShot light={light} framing={i % 2 ? 'close' : 'medium'} keyLight={i === 2 ? 1 : 0} />
          {i === 2 ? <LowerThird start={-40} /> : null}
        </Sequence>
      ))}
      <AbsoluteFill>
        <FilmFinish />
      </AbsoluteFill>
    </StoryProvider>
  );
};
