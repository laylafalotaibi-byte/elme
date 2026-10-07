import React from 'react';
import { AbsoluteFill } from 'remotion';
import { World } from '../components/fx/World';
import { Text } from '../components/typography/Text';
import type { SceneProps } from './types';

/** Scene 10 — Final Message — placeholder (to be implemented). */
export const FinalScene: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <World kind="void" />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="kicker" tone="dark">10 — Final Message</Text>
    </AbsoluteFill>
  </AbsoluteFill>
);
