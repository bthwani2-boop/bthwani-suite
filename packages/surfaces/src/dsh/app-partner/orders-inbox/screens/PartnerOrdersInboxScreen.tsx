import React from 'react';
import { ScrollView } from 'react-native';
import {
  BthBox,
  BthButton,
  BthListItem,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type PartnerOrdersInboxScreenState = 'ready' | 'loading' | 'empty' | 'error';

export type PartnerOrdersInboxListItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  serviceWindowLabel: string;
  nextActionLabel: string;
};

export type PartnerOrdersInboxScreenProps = {
  state?: PartnerOrdersInboxScreenState;
  items?: PartnerOrdersInboxListItem[];
  onOpenOrder?: (orderId: string) => void;
  onOpenNextOrder?: (orderId: string) => void;
  onRetry?: () => void;
};

const demoPartnerOrdersInboxItems: PartnerOrdersInboxListItem[] = [
  {
    id: 'partner-order-1042',
    title: 'Order #1042 - Burger Lab',
    subtitle: 'Pickup window is active and the branch is ready for dispatch review.',
    statusLabel: 'Next up',
    serviceWindowLabel: '12 min to SLA',
    nextActionLabel: 'review order and release captain',
  },
  {
    id: 'partner-order-1048',
    title: 'Order #1048 - Green Bowl',
    subtitle: 'Packaging check is pending before the order moves to handoff.',
    statusLabel: 'Needs check',
    serviceWindowLabel: '18 min to SLA',
    nextActionLabel: 'confirm packaging',
  },
  {
    id: 'partner-order-1051',
    title: 'Order #1051 - Bean House',
    subtitle: 'Dispatch slot is booked and customer wait time is increasing.',
    statusLabel: 'Ready soon',
    serviceWindowLabel: '24 min to SLA',
    nextActionLabel: 'open order workspace',
  },
];

function renderLoadingState() {
  return (
    <BthStateView
      stateId="loading"
      title="Loading partner inbox"
      description="Bring in only what the operator needs to decide the next order."
    />
  );
}

function renderEmptyState(onRetry?: () => void) {
  return (
    <BthStateView
      stateId="empty"
      title="No partner orders waiting"
      description="New work lands here. Filters are deferred until operators have a real queue to triage."
      actionLabel={onRetry ? 'Refresh inbox' : undefined}
      onActionPress={onRetry}
    />
  );
}

function renderErrorState(onRetry?: () => void) {
  return (
    <BthStateView
      stateId="recoverableError"
      title="Inbox is unavailable"
      description="Retry the queue and keep the next-order workflow visible once data returns."
      actionLabel="Retry inbox"
      onActionPress={onRetry}
    />
  );
}

export function PartnerOrdersInboxScreen({
  state = 'ready',
  items = demoPartnerOrdersInboxItems,
  onOpenOrder,
  onOpenNextOrder,
  onRetry,
}: PartnerOrdersInboxScreenProps) {
  if (state === 'loading') {
    return renderLoadingState();
  }

  if (state === 'error') {
    return renderErrorState(onRetry);
  }

  if (state === 'empty' || items.length === 0) {
    return renderEmptyState(onRetry);
  }

  const nextOrder = items[0];

  const handleOpenNextOrder = () => {
    if (onOpenNextOrder) {
      onOpenNextOrder(nextOrder.id);
      return;
    }

    onOpenOrder?.(nextOrder.id);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <BthBox gap={2}>
        <BthText role="titleLg">Partner orders inbox</BthText>
        <BthText role="bodySm" tone="muted">
          Task-first queue for the next operational decision. Filters are deferred in this wave to keep the next order obvious.
        </BthText>
      </BthBox>

      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title="Next order"
          subtitle="Keep one primary action above the list so staff do not scan before acting."
        />
        <BthBox gap={1}>
          <BthText role="bodyStrong">{nextOrder.title}</BthText>
          <BthText role="bodySm" tone="muted">
            {nextOrder.subtitle}
          </BthText>
          <BthText role="caption" tone="soft">
            {nextOrder.serviceWindowLabel} | Next: {nextOrder.nextActionLabel}
          </BthText>
        </BthBox>
        <BthButton label="Open next order" onPress={handleOpenNextOrder} />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Queued orders"
          subtitle="List item baseline: order summary, service window, and next action. No dashboard clutter."
        />
        <BthBox gap={2}>
          {items.map((item) => (
            <BthListItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              meta={`${item.serviceWindowLabel} | Next: ${item.nextActionLabel}`}
              badgeLabel={item.statusLabel}
              onPress={() => onOpenOrder?.(item.id)}
            />
          ))}
        </BthBox>
      </BthSurface>
    </ScrollView>
  );
}

export default PartnerOrdersInboxScreen;