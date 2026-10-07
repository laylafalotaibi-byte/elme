import type React from 'react';
import type { SceneId } from '../campaign/types';
import type { SceneProps } from './types';
import { PersonScene } from './PersonScene';
import { BeforeScene } from './BeforeScene';
import { PainScene } from './PainScene';
import { QuestionScene } from './QuestionScene';
import { RevealScene } from './RevealScene';
import { WorkflowScene } from './WorkflowScene';
import { AfterScene } from './AfterScene';
import { ImpactScene } from './ImpactScene';
import { HumanScene } from './HumanScene';
import { FinalScene } from './FinalScene';

/**
 * Scene templates, keyed by storytelling beat. Every story in the campaign reuses these;
 * a story only supplies config (copy, metrics, timeline).
 */
export const sceneTemplates: Record<SceneId, React.FC<SceneProps>> = {
  person: PersonScene,
  before: BeforeScene,
  pain: PainScene,
  question: QuestionScene,
  reveal: RevealScene,
  workflow: WorkflowScene,
  after: AfterScene,
  impact: ImpactScene,
  human: HumanScene,
  final: FinalScene,
};
