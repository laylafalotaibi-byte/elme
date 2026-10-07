import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { StoryProvider } from '../campaign/StoryContext';
import { LIGHT } from '../campaign/light';
import { FilmFinish } from '../components/fx/Finish';
import { World } from '../components/fx/World';
import { Workspace } from '../components/set/Workspace';
import { HeroShot } from '../components/set/HeroShot';
import { DeskInsert, Pen, Phone, ScreenInsert } from '../components/set/Inserts';
import { Cursor } from '../components/ui/Cursor';
import { LowerThird } from '../components/portrait/LowerThird';
import { Annotation } from '../components/ui/Annotation';
import { RequestCard } from '../components/ui/RequestCard';
import { MetricPopup, IndicatorPopup } from '../components/ui/MetricPopup';
import { PaperForm } from '../components/ui/artifacts/PaperForm';
import { EmailCard, FollowUpPing } from '../components/ui/artifacts/Messages';
import { SystemWindow } from '../components/ui/artifacts/SystemWindow';
import { FileChip } from '../components/ui/artifacts/FileChip';
import { EndCard } from '../components/endcard/EndCard';
import { stories } from '../stories';

/**
 * Visual test bench for the shared set pieces and components (Studio: Lab › Lab-Components).
 * Pages (30 frames each): 0 workspace·day · 1 workspace·dimmed+clutter · 2 hero·dim · 3 hero·warm key + lower third ·
 * 4 screen insert · 5 desk insert · 6 metrics (draft) · 7 end card · 8 workspace·after
 */
const PAGE = 30;

export const ComponentLab: React.FC = () => {
  const { story, metrics } = stories.story01;
  const a = story.before.artifacts;
  const screenUi = (tone: 'light' | 'dark') => (
    <>
      <RequestCard data={story.person.request} x={700} y={40} start={-40} tone={tone} width={540} />
      <EmailCard to={a.email.to} subject={a.email.subject} preview={a.email.preview} attachment={a.records.fileName} tone={tone} style={{ position: 'absolute', left: 60, top: 60 }} />
      <SystemWindow {...a.system} typing={0.5} tone={tone} style={{ position: 'absolute', left: 120, top: 330 }} />
      <Cursor keys={[{ frame: 0, x: 900, y: 600 }]} />
    </>
  );
  return (
    <StoryProvider story={story} metrics={metrics} mode="draft">
      <Sequence durationInFrames={PAGE}>
        <Workspace light={LIGHT.normalDay} screen={screenUi('light')} />
      </Sequence>
      <Sequence from={PAGE} durationInFrames={PAGE}>
        <Workspace
          light={LIGHT.dimmed}
          screen={
            <>
              {screenUi('light')}
              <FollowUpPing {...a.followUp} tone="light" style={{ position: 'absolute', left: 820, top: 560 }} />
            </>
          }
          desk={<PaperForm {...a.form} fill={1} sign={1} width={300} style={{ position: 'absolute', left: 1300, top: 900, transform: 'rotate(-6deg)' }} />}
        />
        <Annotation text="Risk of Human Error" x={300} y={200} start={-40} />
        <Annotation text="Multiple Follow-ups" x={300} y={290} start={-40} />
      </Sequence>
      <Sequence from={PAGE * 2} durationInFrames={PAGE}>
        <HeroShot light={LIGHT.dimmed} framing="close" />
        <IndicatorPopup label="Time" value="Lost to repetitive work" direction="down" x={1100} y={300} start={-40} />
      </Sequence>
      <Sequence from={PAGE * 3} durationInFrames={PAGE}>
        <HeroShot light={LIGHT.warmKey} framing="medium" keyLight={1} />
        <LowerThird start={-40} />
      </Sequence>
      <Sequence from={PAGE * 4} durationInFrames={PAGE}>
        <ScreenInsert light={LIGHT.normalDay}>{screenUi('light')}</ScreenInsert>
      </Sequence>
      <Sequence from={PAGE * 5} durationInFrames={PAGE}>
        <DeskInsert light={LIGHT.normalDay}>
          <PaperForm {...a.form} fill={1} sign={0.7} style={{ position: 'absolute', left: 700, top: 200, transform: 'rotate(-3deg)' }} />
          <Pen x={1160} y={640} />
          <Phone x={300} y={420} rotate={-10}>
            <FileChip location={a.records.buckets[1]} fileName={a.records.fileName} width={200} style={{ margin: 10 }} />
          </Phone>
        </DeskInsert>
      </Sequence>
      <Sequence from={PAGE * 6} durationInFrames={PAGE}>
        <World kind="after" />
        <MetricPopup metricId="timeSaved" x={200} y={160} start={-40} />
        <MetricPopup metricId="manualSteps" x={200} y={400} start={-40} />
        <MetricPopup metricId="paper" x={200} y={660} start={-40} />
        <MetricPopup metricId="records" x={1000} y={160} start={-40} />
        <MetricPopup metricId="sites" x={1000} y={400} start={-40} />
        <MetricPopup metricId="errorRisk" x={1000} y={660} start={-40} />
        <MetricPopup metricId="processingTime" x={1180} y={860} start={-40} align="right" width={520} leader={{ x: 60, y: 40 }} />
      </Sequence>
      <Sequence from={PAGE * 7} durationInFrames={PAGE}>
        <World kind="void" />
        <EndCard start={-200} />
      </Sequence>
      <Sequence from={PAGE * 8} durationInFrames={PAGE}>
        <Workspace light={LIGHT.afterDay} screen={<RequestCard data={story.person.request} x={700} y={40} start={-40} tone="light" width={540} resolvedAt={-20} />} />
      </Sequence>
      <AbsoluteFill>
        <FilmFinish />
      </AbsoluteFill>
    </StoryProvider>
  );
};
