import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { StoryProvider } from '../campaign/StoryContext';
import { World } from '../components/fx/World';
import { FilmFinish } from '../components/fx/Finish';
import { EmployeePortrait } from '../components/portrait/EmployeePortrait';
import { NamePlate } from '../components/portrait/NamePlate';
import { Annotation } from '../components/ui/Annotation';
import { RequestCard } from '../components/ui/RequestCard';
import { MetricPopup, IndicatorPopup } from '../components/ui/MetricPopup';
import { PaperForm } from '../components/ui/artifacts/PaperForm';
import { EmailCard, FollowUpPing } from '../components/ui/artifacts/Messages';
import { SystemWindow } from '../components/ui/artifacts/SystemWindow';
import { FileChip } from '../components/ui/artifacts/FileChip';
import { EndCard } from '../components/endcard/EndCard';
import { Kicker } from '../components/typography/Text';
import { stories } from '../stories';

/** Visual test bench for the shared components (Studio: Lab › Lab-Components). */
export const ComponentLab: React.FC = () => {
  const { story, metrics } = stories.story01;
  const a = story.before.artifacts;
  return (
    <StoryProvider story={story} metrics={metrics} mode="draft">
      <Sequence durationInFrames={50}>
        <World kind="before" />
        <div style={{ position: 'absolute', left: 80, top: 80 }}>
          <EmployeePortrait width={360} height={450} light="before" />
          <NamePlate style={{ width: 360, marginTop: 20 }} />
        </div>
        <div style={{ position: 'absolute', left: 80, top: 690, display: 'flex', gap: 16 }}>
          <EmployeePortrait width={170} height={212} light="void" />
          <EmployeePortrait width={170} height={212} light="warm" />
        </div>
        <PaperForm {...a.form} fill={1} sign={1} style={{ position: 'absolute', left: 500, top: 80 }} />
        <EmailCard {...a.email} attachment={a.files.fileName} style={{ position: 'absolute', left: 900, top: 80 }} />
        <FollowUpPing {...a.followUp} style={{ position: 'absolute', left: 900, top: 290 }} />
        <SystemWindow {...a.system} typing={0.6} style={{ position: 'absolute', left: 900, top: 420 }} />
        <FileChip location={a.files.locations[0]} fileName={a.files.fileName} style={{ position: 'absolute', left: 1460, top: 80 }} />
        <RequestCard data={story.person.request} x={1300} y={620} start={-40} width={540} />
        <Annotation text="Risk of Human Error" x={520} y={900} start={-40} leader={{ x: -40, y: -60 }} />
        <IndicatorPopup label="Time" value="Lost to repetitive work" direction="down" x={1300} y={860} start={-40} />
        <Kicker text="Story 01 — Corporate Technology" start={-40} rule={160} style={{ position: 'absolute', left: 900, top: 820 }} />
      </Sequence>
      <Sequence from={50} durationInFrames={50}>
        <World kind="after" />
        <div style={{ position: 'absolute', left: 120, top: 120 }}>
          <EmployeePortrait width={400} height={500} light="after" />
          <NamePlate tone="light" style={{ width: 400, marginTop: 20 }} />
        </div>
        <MetricPopup metricId="timeSaved" x={640} y={140} start={-40} />
        <MetricPopup metricId="manualSteps" x={640} y={330} start={-40} />
        <MetricPopup metricId="processingTime" x={640} y={520} start={-40} />
        <MetricPopup metricId="paper" x={640} y={720} start={-40} />
        <MetricPopup metricId="records" x={1200} y={140} start={-40} leader={{ x: -80, y: 60 }} />
        <MetricPopup metricId="sites" x={1200} y={330} start={-40} />
        <RequestCard data={story.person.request} x={1200} y={620} start={-40} tone="light" resolvedAt={-20} />
      </Sequence>
      <Sequence from={100} durationInFrames={50}>
        <World kind="void" />
        <EndCard start={-200} />
      </Sequence>
      <AbsoluteFill>
        <FilmFinish />
      </AbsoluteFill>
    </StoryProvider>
  );
};
