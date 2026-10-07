import React from 'react';
import { AbsoluteFill } from 'remotion';
import { World } from '../components/fx/World';
import { Text } from '../components/typography/Text';
import type { SceneProps } from './types';

/** Scene 07 — After Automation — placeholder (to be implemented). */
export const AfterScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <World kind="after" />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="kicker" tone="light">07 — After Automation</Text>
    </AbsoluteFill>
  </AbsoluteFill>
);
