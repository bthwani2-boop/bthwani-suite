import React from 'react';
import {
  Box,
  Button,
  ListItem,
  MobileScrollView,
  SectionHeader,
  StateView,
  Surface,
  Text,
} from '@bthwani/ui-kit';

export type PartnerOrdersInboxScreenState = 'ready' | 'loading' | 'empty' | 'error';

export const PARTNER_ORDERS_INBOX_FILTERS_DECISION = 'not needed';

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
    <StateView
      stateId="loading"
      title="Loading partner inbox"
      description="Bring in only what the operator needs to decide the next order."
    />
  );
}

function renderEmptyState(onRetry?: () => void) {
  return (
    <StateView
      stateId="empty"
      title="No partner orders waiting"
      description="New work lands here. Keep the queue compact and move straight to the next order when it appears."
      actionLabel={onRetry ? 'Refresh inbox' : undefined}
      onActionPress={onRetry}
    />
  );
}

function renderErrorState(onRetry?: () => void) {
  return (
    <StateView
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
    <MobileScrollView padding={4} gap={3}>
      <Box gap={2}>
        <Text role="titleLg">Partner orders inbox</Text>
        <Text role="bodySm" tone="muted">
          Order-first queue for the next operational decision. The next order stays obvious without extra filters in this wave.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader
          title="Next order"
          subtitle="Keep one primary action above the list so staff do not scan before acting."
        />
        <Box gap={1}>
          <Text role="bodyStrong">{nextOrder.title}</Text>
          <Text role="bodySm" tone="muted">
            {nextOrder.subtitle}
          </Text>
          <Text role="caption" tone="soft">
            {nextOrder.serviceWindowLabel} | Next: {nextOrder.nextActionLabel}
          </Text>
        </Box>
        <Button label="Open next order" onPress={handleOpenNextOrder} />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="Queued orders"
          subtitle="List item baseline: order summary, service window, and next action. No dashboard clutter."
        />
        <Box gap={2}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              meta={`${item.serviceWindowLabel} | Next: ${item.nextActionLabel}`}
              badgeLabel={item.statusLabel}
              onPress={() => onOpenOrder?.(item.id)}
            />
          ))}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

export default PartnerOrdersInboxScreen;
