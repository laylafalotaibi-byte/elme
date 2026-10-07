import React from 'react';
import { AbsoluteFill } from 'remotion';
import { World } from '../components/fx/World';
import { Text } from '../components/typography/Text';
import type { SceneProps } from './types';

/** Scene 08 — Impact — placeholder (to be implemented). */
export const ImpactScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <World kind="after" />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="kicker" tone="light">08 — Impact</Text>
    </AbsoluteFill>
  </AbsoluteFill>
);
