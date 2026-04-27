import React from 'react';
import { Box, Button, ListItem, MobileScrollView, SectionHeader, StateView, Surface, Text } from '@bthwani/ui-kit';

export type CaptainOrdersInboxScreenState =
  | 'active'
  | 'noOrders'
  | 'delivered'
  | 'loading'
  | 'error';

export type CaptainOrderInboxItem = {
  id: string;
  title: string;
  pickupLabel: string;
  dropoffLabel: string;
  timingLabel: string;
  nextActionLabel: string;
  statusLabel: string;
};

export type CaptainOrdersInboxScreenProps = {
  state?: CaptainOrdersInboxScreenState;
  items?: CaptainOrderInboxItem[];
  onOpenOrder?: (orderId: string) => void;
  onOpenNextOrder?: (orderId: string) => void;
  onRetry?: () => void;
};

const demoActiveOrders: CaptainOrderInboxItem[] = [
  {
    id: 'captain-order-9021',
    title: 'Order #9021',
    pickupLabel: 'Pickup: Burger Lab',
    dropoffLabel: 'Dropoff: Olaya District',
    timingLabel: 'Pickup in 8 min',
    nextActionLabel: 'arrive at pickup and confirm collection',
    statusLabel: 'Next up',
  },
  {
    id: 'captain-order-9024',
    title: 'Order #9024',
    pickupLabel: 'Pickup: Green Bowl',
    dropoffLabel: 'Dropoff: King Fahad Rd',
    timingLabel: 'Pickup in 15 min',
    nextActionLabel: 'start route to pickup',
    statusLabel: 'Queued',
  },
];

function renderLoadingState() {
  return (
    <StateView
      stateId="loading"
      title="Loading captain inbox"
      description="Keep the next order visible as soon as queue data is available."
    />
  );
}

function renderNoOrdersState(onRetry?: () => void) {
  return (
    <StateView
      stateId="empty"
      title="No orders right now"
      description="Stay ready. New orders will land here first."
      actionLabel={onRetry ? 'Refresh orders' : undefined}
      onActionPress={onRetry}
    />
  );
}

function renderDeliveredState(onRetry?: () => void) {
  return (
    <StateView
      kind="success"
      title="All orders delivered"
      description="Great run. Refresh to catch the next assignment."
      actionLabel={onRetry ? 'Check for new orders' : undefined}
      onActionPress={onRetry}
    />
  );
}

function renderErrorState(onRetry?: () => void) {
  return (
    <StateView
      stateId="recoverableError"
      title="Orders inbox is unavailable"
      description="Retry and continue from the next order without switching flow."
      actionLabel="Retry inbox"
      onActionPress={onRetry}
    />
  );
}

export function CaptainOrdersInboxScreen({
  state = 'active',
  items = demoActiveOrders,
  onOpenOrder,
  onOpenNextOrder,
  onRetry,
}: CaptainOrdersInboxScreenProps) {
  if (state === 'loading') {
    return renderLoadingState();
  }

  if (state === 'error') {
    return renderErrorState(onRetry);
  }

  if (state === 'noOrders') {
    return renderNoOrdersState(onRetry);
  }

  if (state === 'delivered') {
    return renderDeliveredState(onRetry);
  }

  if (items.length === 0) {
    return renderNoOrdersState(onRetry);
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
        <Text role="titleLg">Captain orders inbox</Text>
        <Text role="bodySm" tone="muted">
          Inbox-first flow keeps the immediate order obvious and removes dashboard clutter.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader
          title="Next order"
          subtitle="One clear action before scanning the rest of the queue."
        />
        <Box gap={1}>
          <Text role="bodyStrong">{nextOrder.title}</Text>
          <Text role="bodySm" tone="muted">
            {nextOrder.pickupLabel} | {nextOrder.dropoffLabel}
          </Text>
          <Text role="caption" tone="soft">
            {nextOrder.timingLabel} | Next: {nextOrder.nextActionLabel}
          </Text>
        </Box>
        <Button label="Open next order" onPress={handleOpenNextOrder} />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="Queued orders"
          subtitle="List baseline: pickup, dropoff, timing, and next action."
        />
        <Box gap={2}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={`${item.pickupLabel} | ${item.dropoffLabel}`}
              meta={`${item.timingLabel} | Next: ${item.nextActionLabel}`}
              badgeLabel={item.statusLabel}
              onPress={() => onOpenOrder?.(item.id)}
            />
          ))}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

export default CaptainOrdersInboxScreen;