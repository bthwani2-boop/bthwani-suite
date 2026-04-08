import React from 'react';
import { ScrollView } from 'react-native';
import {
  BthBox,
  BthButton,
  BthChip,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type DshTrackingTimelineStep = {
  id: string;
  title: string;
  detail?: string;
  done?: boolean;
};

export type DshTrackingState = 'ready' | 'loading' | 'delayed' | 'no-captain' | 'error';

export type DshTrackingScreenProps = {
  state?: DshTrackingState;
  currentStatusLabel: string;
  timeline: DshTrackingTimelineStep[];
  onRetry?: () => void;
  onSupport?: () => void;
  onNextAction?: () => void;
};

function renderNonReadyState(state: DshTrackingState, onRetry?: () => void, onSupport?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'delayed') {
    return (
      <BthStateView
        stateId="warning"
        title="Order is delayed"
        description="Current timeline is delayed. Keep support and retry paths visible."
        actionLabel="Contact support"
        onActionPress={onSupport}
      />
    );
  }

  if (state === 'no-captain') {
    return (
      <BthStateView
        stateId="warning"
        title="No captain assigned yet"
        description="Assignment is pending. You can retry or request support."
        actionLabel="Retry assignment"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Tracking is unavailable"
      description="Use retry first, then support if the issue continues."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

export function DshTrackingScreen({
  state = 'ready',
  currentStatusLabel,
  timeline,
  onRetry,
  onSupport,
  onNextAction,
}: DshTrackingScreenProps) {
  if (state !== 'ready') {
    return renderNonReadyState(state, onRetry, onSupport);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title="Current status"
          subtitle="Status should be clear within seconds."
          trailing={<BthChip label={currentStatusLabel} selected />}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="Timeline" subtitle="Show only steps required for the next decision." />
        <BthBox gap={3}>
          {timeline.map((step) => (
            <BthBox key={step.id} gap={1}>
              <BthText role="bodyStrong">{step.title}</BthText>
              {step.detail ? <BthText role="bodySm" tone="muted">{step.detail}</BthText> : null}
              <BthChip label={step.done ? 'Done' : 'Pending'} selected={Boolean(step.done)} />
            </BthBox>
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader title="Next action" subtitle="Keep one primary action and one support fallback." />
        <BthBox layoutDirection="row" gap={2}>
          <BthButton label="Need support" tone="secondary" onPress={onSupport} />
          <BthButton label="Continue" onPress={onNextAction} />
        </BthBox>
      </BthSurface>
    </ScrollView>
  );
}
