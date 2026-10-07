import React from 'react';
import { AbsoluteFill } from 'remotion';
import { World } from '../components/fx/World';
import { Text } from '../components/typography/Text';
import type { SceneProps } from './types';

/** Scene 05 — The Unexpected Part — placeholder (to be implemented). */
export const RevealScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <World kind="warm" />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="kicker" tone="dark">05 — The Unexpected Part</Text>
    </AbsoluteFill>
  </AbsoluteFill>
);
