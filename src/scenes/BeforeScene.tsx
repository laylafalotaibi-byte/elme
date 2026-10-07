import React from 'react';
import { AbsoluteFill } from 'remotion';
import { World } from '../components/fx/World';
import { Text } from '../components/typography/Text';
import type { SceneProps } from './types';

/** Scene 02 — Before Automation — placeholder (to be implemented). */
export const BeforeScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <World kind="before" />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="kicker" tone="dark">02 — Before Automation</Text>
    </AbsoluteFill>
  </AbsoluteFill>
);
