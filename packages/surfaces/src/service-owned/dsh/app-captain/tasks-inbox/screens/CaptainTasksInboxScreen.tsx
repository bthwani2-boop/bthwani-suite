import React from 'react';
import {
  BthBox,
  BthButton,
  BthListItem,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type CaptainTasksInboxScreenState =
  | 'active'
  | 'noTasks'
  | 'delivered'
  | 'loading'
  | 'error';

export type CaptainTaskInboxItem = {
  id: string;
  title: string;
  pickupLabel: string;
  dropoffLabel: string;
  timingLabel: string;
  nextActionLabel: string;
  statusLabel: string;
};

export type CaptainTasksInboxScreenProps = {
  state?: CaptainTasksInboxScreenState;
  items?: CaptainTaskInboxItem[];
  onOpenTask?: (taskId: string) => void;
  onOpenNextTask?: (taskId: string) => void;
  onRetry?: () => void;
};

const demoActiveItems: CaptainTaskInboxItem[] = [
  {
    id: 'captain-task-9021',
    title: 'Task #9021',
    pickupLabel: 'Pickup: Burger Lab',
    dropoffLabel: 'Dropoff: Olaya District',
    timingLabel: 'Pickup in 8 min',
    nextActionLabel: 'arrive at pickup and confirm collection',
    statusLabel: 'Next up',
  },
  {
    id: 'captain-task-9024',
    title: 'Task #9024',
    pickupLabel: 'Pickup: Green Bowl',
    dropoffLabel: 'Dropoff: King Fahad Rd',
    timingLabel: 'Pickup in 15 min',
    nextActionLabel: 'start route to pickup',
    statusLabel: 'Queued',
  },
];

function renderLoadingState() {
  return (
    <BthStateView
      stateId="loading"
      title="Loading captain inbox"
      description="Keep the next task visible as soon as queue data is available."
    />
  );
}

function renderNoTasksState(onRetry?: () => void) {
  return (
    <BthStateView
      stateId="empty"
      title="No tasks right now"
      description="Stay ready. New tasks will land here first."
      actionLabel={onRetry ? 'Refresh tasks' : undefined}
      onActionPress={onRetry}
    />
  );
}

function renderDeliveredState(onRetry?: () => void) {
  return (
    <BthStateView
      kind="success"
      title="All tasks delivered"
      description="Great run. Refresh to catch the next assignment."
      actionLabel={onRetry ? 'Check for new tasks' : undefined}
      onActionPress={onRetry}
    />
  );
}

function renderErrorState(onRetry?: () => void) {
  return (
    <BthStateView
      stateId="recoverableError"
      title="Tasks inbox is unavailable"
      description="Retry and continue from the next task without switching flow."
      actionLabel="Retry inbox"
      onActionPress={onRetry}
    />
  );
}

export function CaptainTasksInboxScreen({
  state = 'active',
  items = demoActiveItems,
  onOpenTask,
  onOpenNextTask,
  onRetry,
}: CaptainTasksInboxScreenProps) {
  if (state === 'loading') {
    return renderLoadingState();
  }

  if (state === 'error') {
    return renderErrorState(onRetry);
  }

  if (state === 'noTasks') {
    return renderNoTasksState(onRetry);
  }

  if (state === 'delivered') {
    return renderDeliveredState(onRetry);
  }

  if (items.length === 0) {
    return renderNoTasksState(onRetry);
  }

  const nextTask = items[0];

  const handleOpenNextTask = () => {
    if (onOpenNextTask) {
      onOpenNextTask(nextTask.id);
      return;
    }

    onOpenTask?.(nextTask.id);
  };

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthBox gap={2}>
        <BthText role="titleLg">Captain tasks inbox</BthText>
        <BthText role="bodySm" tone="muted">
          Inbox-first flow keeps the immediate task obvious and removes dashboard clutter.
        </BthText>
      </BthBox>

      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title="Next task"
          subtitle="One clear action before scanning the rest of the queue."
        />
        <BthBox gap={1}>
          <BthText role="bodyStrong">{nextTask.title}</BthText>
          <BthText role="bodySm" tone="muted">
            {nextTask.pickupLabel} | {nextTask.dropoffLabel}
          </BthText>
          <BthText role="caption" tone="soft">
            {nextTask.timingLabel} | Next: {nextTask.nextActionLabel}
          </BthText>
        </BthBox>
        <BthButton label="Open next task" onPress={handleOpenNextTask} />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Queued tasks"
          subtitle="List baseline: pickup, dropoff, timing, and next action."
        />
        <BthBox gap={2}>
          {items.map((item) => (
            <BthListItem
              key={item.id}
              title={item.title}
              subtitle={`${item.pickupLabel} | ${item.dropoffLabel}`}
              meta={`${item.timingLabel} | Next: ${item.nextActionLabel}`}
              badgeLabel={item.statusLabel}
              onPress={() => onOpenTask?.(item.id)}
            />
          ))}
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}

export default CaptainTasksInboxScreen;
