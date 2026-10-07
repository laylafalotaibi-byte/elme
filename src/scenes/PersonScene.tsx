import React from 'react';
import { AbsoluteFill } from 'remotion';
import { World } from '../components/fx/World';
import { Text } from '../components/typography/Text';
import type { SceneProps } from './types';

/** Scene 01 — The Person — placeholder (to be implemented). */
export const PersonScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <World kind="before" />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="kicker" tone="dark">01 — The Person</Text>
    </AbsoluteFill>
  </AbsoluteFill>
);
