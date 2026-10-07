import type { MetricConfig, StoryConfig } from '../campaign/types';
import { TEMPLATE_LIMITS } from '../scenes/limits';

const check = (label: keyof typeof TEMPLATE_LIMITS, count: number, story: string) => {
  const { min, max } = TEMPLATE_LIMITS[label];
  if (count < min || count > max) {
    throw new Error(`${story}: ${label} has ${count} item(s); the scene template supports ${min}–${max}. Edit the config or extend the template.`);
  }
};

/** Load-time guard: the story's config fits the scene templates and references real metrics. */
export const validateStory = (story: StoryConfig, metrics: MetricConfig[]): StoryConfig => {
  const id = story.id;
  check('annotations', story.before.annotations.length, id);
  check('beforeSteps', story.before.steps.length, id);
  check('painLines', story.pain.lines.length, id);
  check('painIndicators', story.pain.indicators.length, id);
  check('revealWords', story.reveal.words.length, id);
  check('workflowSteps', story.workflow.steps.length, id);
  check('notifyTargets', story.workflow.notifyTargets.length, id);
  check('impactInWorkflow', story.impact.inWorkflow.length, id);
  check('comparisonPerSide', story.after.comparison.before.length, id);
  check('comparisonPerSide', story.after.comparison.after.length, id);
  check('impactSequence', story.impact.sequence.length, id);

  const known = new Set(metrics.map((m) => m.id));
  for (const metricId of [...story.impact.inWorkflow, ...story.impact.sequence]) {
    if (!known.has(metricId)) throw new Error(`${id}: impact references unknown metric "${metricId}" (metrics.config.ts).`);
  }
  if (story.after.comparison.before.length !== story.after.comparison.after.length) {
    throw new Error(`${id}: after.comparison needs the same number of BEFORE and AFTER items.`);
  }
  return story;
};
