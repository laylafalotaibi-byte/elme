import React from 'react';
import { AbsoluteFill } from 'remotion';
import { World } from '../components/fx/World';
import { Text } from '../components/typography/Text';
import type { SceneProps } from './types';

/** Scene 03 — The Pain — placeholder (to be implemented). */
export const PainScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <World kind="before" />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="kicker" tone="dark">03 — The Pain</Text>
    </AbsoluteFill>
  </AbsoluteFill>
);
