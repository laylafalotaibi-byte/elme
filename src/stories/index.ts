import type { MetricConfig, StoryConfig, Timeline } from '../campaign/types';
import { validateMetrics } from '../campaign/metrics';
import { validateStory } from './validate';
import { story01 } from './story01/story.config';
import { story01Metrics } from './story01/metrics.config';
import { story01Timeline } from './story01/timeline';

export type StoryBundle = {
  story: StoryConfig;
  metrics: MetricConfig[];
  timeline: Timeline;
};

/** All stories in the campaign. Add Story 02 here when it is ready. */
export const stories = {
  story01: { story: validateStory(story01, story01Metrics), metrics: validateMetrics(story01Metrics), timeline: story01Timeline },
} satisfies Record<string, StoryBundle>;

export type StoryKey = keyof typeof stories;
