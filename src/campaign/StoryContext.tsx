import React, { createContext, useContext } from 'react';
import type { MetricConfig, RenderMode, StoryConfig } from './types';

type StoryContextValue = {
  story: StoryConfig;
  metrics: MetricConfig[];
  mode: RenderMode;
};

const StoryContext = createContext<StoryContextValue | null>(null);

export const StoryProvider: React.FC<StoryContextValue & { children: React.ReactNode }> = ({ children, ...value }) => (
  <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
);

/** Access the current story's copy, metrics and render mode from any scene or component. */
export const useStory = (): StoryContextValue => {
  const value = useContext(StoryContext);
  if (!value) throw new Error('useStory() must be used inside <StoryProvider>');
  return value;
};
