import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { colors } from './campaign/theme';
import { ease } from './campaign/motion';
import { StoryProvider } from './campaign/StoryContext';
import { sceneStarts } from './campaign/timeline';
import type { RenderMode, SceneId } from './campaign/types';
import { FilmFinish } from './components/fx/Finish';
import { sceneTemplates } from './scenes';
import { stories, type StoryKey } from './stories';

export type StoryFilmProps = {
  storyKey: StoryKey;
  mode: RenderMode;
};

/** Optional music bed + cue sounds. Renders nothing until files are set in the story config. */
const StoryAudio: React.FC<{ storyKey: StoryKey }> = ({ storyKey }) => {
  const { story, timeline } = stories[storyKey];
  const starts = sceneStarts(timeline);
  return (
    <>
      {story.audio.music ? <Audio src={staticFile(story.audio.music)} volume={story.audio.musicVolume} /> : null}
      {story.audio.cues
        .filter((cue) => cue.file)
        .map((cue, i) => {
          const start = (starts.find((s) => s.id === cue.scene)?.start ?? 0) + cue.frame;
          return (
            <Sequence key={i} from={start} layout="none">
              <Audio src={staticFile(cue.file as string)} volume={cue.volume ?? 1} />
            </Sequence>
          );
        })}
    </>
  );
};

/** A full story: every scene of the timeline (hard cuts or short dissolves) + the film finish. */
export const StoryFilm: React.FC<StoryFilmProps> = ({ storyKey, mode }) => {
  const { story, metrics, timeline } = stories[storyKey];
  return (
    <StoryProvider story={story} metrics={metrics} mode={mode}>
      <AbsoluteFill style={{ backgroundColor: colors.ink }}>
        <TransitionSeries>
          {timeline.scenes.flatMap((scene, i) => {
            const Scene = sceneTemplates[scene.id];
            const items = [];
            if (i > 0 && scene.transitionIn.type === 'fade') {
              items.push(
                <TransitionSeries.Transition
                  key={`transition-${scene.id}`}
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: scene.transitionIn.frames, easing: ease.inOut })}
                />,
              );
            }
            items.push(
              <TransitionSeries.Sequence key={scene.id} durationInFrames={scene.durationInFrames} name={scene.previewId}>
                <Scene durationInFrames={scene.durationInFrames} />
              </TransitionSeries.Sequence>,
            );
            return items;
          })}
        </TransitionSeries>
        <FilmFinish />
        <StoryAudio storyKey={storyKey} />
      </AbsoluteFill>
    </StoryProvider>
  );
};

export type ScenePreviewProps = StoryFilmProps & { sceneId: SceneId };

/** One scene on its own (for the Studio and for stills), with the same finish as the film. */
export const ScenePreview: React.FC<ScenePreviewProps> = ({ storyKey, mode, sceneId }) => {
  const { story, metrics, timeline } = stories[storyKey];
  const scene = timeline.scenes.find((s) => s.id === sceneId);
  if (!scene) throw new Error(`Scene ${sceneId} is not in the ${storyKey} timeline`);
  const Scene = sceneTemplates[sceneId];
  return (
    <StoryProvider story={story} metrics={metrics} mode={mode}>
      <AbsoluteFill style={{ backgroundColor: colors.ink }}>
        <Scene durationInFrames={scene.durationInFrames} />
        <FilmFinish />
      </AbsoluteFill>
    </StoryProvider>
  );
};
