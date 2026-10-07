import React from 'react';
import { AbsoluteFill } from 'remotion';
import { World } from '../components/fx/World';
import { Text } from '../components/typography/Text';
import type { SceneProps } from './types';

/** Scene 04 — The Question — placeholder (to be implemented). */
export const QuestionScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <World kind="void" />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="kicker" tone="dark">04 — The Question</Text>
    </AbsoluteFill>
  </AbsoluteFill>
);
