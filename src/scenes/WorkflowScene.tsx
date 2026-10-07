import React from 'react';
import { AbsoluteFill } from 'remotion';
import { World } from '../components/fx/World';
import { Text } from '../components/typography/Text';
import type { SceneProps } from './types';

/** Scene 06 — Building the Solution — placeholder (to be implemented). */
export const WorkflowScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <World kind="after" />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="kicker" tone="light">06 — Building the Solution</Text>
    </AbsoluteFill>
  </AbsoluteFill>
);
