import React from 'react';
import { ScrollView } from 'react-native';
import {
  BthBox,
  BthButton,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type CaptainTaskDetailScreenState = 'ready' | 'loading' | 'empty' | 'error';

export type CaptainTaskDetailSummary = {
  taskId: string;
  pickupLabel: string;
  dropoffLabel: string;
  etaLabel: string;
  currentStageLabel: string;
  nextActionLabel: string;
};

export type CaptainTaskDetailScreenProps = {
  state?: CaptainTaskDetailScreenState;
  summary?: CaptainTaskDetailSummary;
  onConfirmPickup?: (taskId: string) => void;
  onConfirmDelivery?: (taskId: string) => void;
  onOpenNextTask?: () => void;
  onBackToInbox?: () => void;
  onRetry?: () => void;
};

const demoSummary: CaptainTaskDetailSummary = {
  taskId: 'captain-task-9021',
  pickupLabel: 'Burger Lab - Hittin branch',
  dropoffLabel: 'Olaya District, King Fahad Road',
  etaLabel: 'ETA to pickup: 8 min',
  currentStageLabel: 'Heading to pickup',
  nextActionLabel: 'Confirm pickup once package is collected',
};

function renderLoadingState() {
  return (
    <BthStateView
      stateId="loading"
      title="Loading task detail"
      description="Keep only the context needed for the next captain action."
    />
  );
}

function renderEmptyState(onBackToInbox?: () => void) {
  return (
    <BthStateView
      stateId="empty"
      title="No active task selected"
      description="Return to inbox and open the next task."
      actionLabel={onBackToInbox ? 'Back to inbox' : undefined}
      onActionPress={onBackToInbox}
    />
  );
}

function renderErrorState(onRetry?: () => void, onBackToInbox?: () => void) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <BthStateView
        stateId="recoverableError"
        title="Task detail is unavailable"
        description="Retry detail or move back to inbox without breaking the flow."
        actionLabel="Retry detail"
        onActionPress={onRetry}
      />
      {onBackToInbox ? <BthButton label="Back to inbox" tone="secondary" onPress={onBackToInbox} /> : null}
    </ScrollView>
  );
}

export function CaptainTaskDetailScreen({
  state = 'ready',
  summary = demoSummary,
  onConfirmPickup,
  onConfirmDelivery,
  onOpenNextTask,
  onBackToInbox,
  onRetry,
}: CaptainTaskDetailScreenProps) {
  if (state === 'loading') {
    return renderLoadingState();
  }

  if (state === 'error') {
    return renderErrorState(onRetry, onBackToInbox);
  }

  if (state === 'empty') {
    return renderEmptyState(onBackToInbox);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <BthBox gap={2}>
        <BthText role="titleLg">Task detail</BthText>
        <BthText role="bodySm" tone="muted">
          Detail keeps one operational question at a time so the captain always sees the next step.
        </BthText>
      </BthBox>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Task summary"
          subtitle="Only route and stage data needed for immediate execution."
        />
        <BthBox gap={1}>
          <BthText role="bodyStrong">Task #{summary.taskId.replace('captain-task-', '')}</BthText>
          <BthText role="bodySm" tone="muted">
            Pickup: {summary.pickupLabel}
          </BthText>
          <BthText role="bodySm" tone="muted">
            Dropoff: {summary.dropoffLabel}
          </BthText>
          <BthText role="caption" tone="soft">
            {summary.etaLabel} | Stage: {summary.currentStageLabel}
          </BthText>
        </BthBox>
      </BthSurface>

      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title="Next action"
          subtitle="Primary action is always explicit for the captain."
        />
        <BthText role="bodyStrong">{summary.nextActionLabel}</BthText>
        <BthButton label="Confirm pickup" onPress={() => onConfirmPickup?.(summary.taskId)} />
        <BthButton label="Confirm delivery" tone="secondary" onPress={() => onConfirmDelivery?.(summary.taskId)} />
      </BthSurface>

      <BthButton label="Open next task" tone="secondary" onPress={onOpenNextTask} />
      <BthButton label="Back to inbox" tone="ghost" onPress={onBackToInbox} />
    </ScrollView>
  );
}

export default CaptainTaskDetailScreen;
