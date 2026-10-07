import React from 'react';
import { Composition, Folder } from 'remotion';
import { VIDEO } from './campaign/theme';
import { loadCampaignFonts } from './campaign/fonts';
import { totalDuration } from './campaign/timeline';
import { ScenePreview, StoryFilm } from './StoryFilm';
import { ComponentLab } from './lab/ComponentLab';
import { stories } from './stories';

loadCampaignFonts();

const story01 = stories.story01;

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Story01">
      {/* Final film: unverified metrics show qualitative wording. */}
      <Composition
        id="Story01"
        component={StoryFilm}
        durationInFrames={totalDuration(story01.timeline)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ storyKey: 'story01' as const, mode: 'final' as const }}
      />
      {/* Review cut: shows [X] metric placeholders with a TO VERIFY tag. */}
      <Composition
        id="Story01-MetricsDraft"
        component={StoryFilm}
        durationInFrames={totalDuration(story01.timeline)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ storyKey: 'story01' as const, mode: 'draft' as const }}
      />
    </Folder>
    <Folder name="Story01-Scenes">
      {story01.timeline.scenes.map((scene) => (
        <Composition
          key={scene.previewId}
          id={scene.previewId}
          component={ScenePreview}
          durationInFrames={scene.durationInFrames}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
          defaultProps={{ storyKey: 'story01' as const, mode: 'final' as const, sceneId: scene.id }}
        />
      ))}
    </Folder>
    <Folder name="Lab">
      <Composition id="Lab-Components" component={ComponentLab} durationInFrames={270} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    </Folder>
  </>
);
