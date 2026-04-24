import React from 'react';
import {
  Box,
  Button,
  ListItem,
  MobileScrollView,
  SectionHeader,
  StateView,
  StatCard,
  Surface,
  Text,
} from '@bthwani/ui-kit';

export type DshPartnerDeliveryOpsBoardState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'offline'
  | 'disabled';

export type DshPartnerDeliveryOpsSummary = {
  outForDelivery: number;
  handoffReady: number;
  deliveredToday: number;
  delayedRisk: number;
};

export type DshPartnerDeliveryOpsOrder = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  etaLabel: string;
  nextActionLabel: string;
};

export type DshPartnerDeliveryOpsBoardScreenProps = {
  state?: DshPartnerDeliveryOpsBoardState;
  summary?: DshPartnerDeliveryOpsSummary;
  orders?: DshPartnerDeliveryOpsOrder[];
  onOpenOrder?: (orderId: string) => void;
  onOpenIssueQueue?: () => void;
  onRetry?: () => void;
};

const demoSummary: DshPartnerDeliveryOpsSummary = {
  outForDelivery: 8,
  handoffReady: 5,
  deliveredToday: 24,
  delayedRisk: 2,
};

const demoOrders: DshPartnerDeliveryOpsOrder[] = [
  {
    id: 'partner-order-1042',
    title: 'Order #1042 - Burger Lab',
    subtitle: 'Captain is approaching the branch and packaging is complete.',
    statusLabel: 'Handoff ready',
    etaLabel: 'Captain arrives in 4 min',
    nextActionLabel: 'handoff to captain',
  },
  {
    id: 'partner-order-1048',
    title: 'Order #1048 - Green Bowl',
    subtitle: 'The order is out for delivery and customer wait time is increasing.',
    statusLabel: 'Out for delivery',
    etaLabel: '12 min to customer',
    nextActionLabel: 'watch delay risk',
  },
  {
    id: 'partner-order-1051',
    title: 'Order #1051 - Bean House',
    subtitle: 'A customer issue needs staff review before the delivery closes.',
    statusLabel: 'Issue flagged',
    etaLabel: 'Needs review now',
    nextActionLabel: 'open issue queue',
  },
];

function renderState(state: Exclude<DshPartnerDeliveryOpsBoardState, 'ready' | 'disabled'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="No delivery work is active"
        description="Keep the board available so the branch can resume handoff monitoring as soon as new work appears."
        actionLabel={onRetry ? 'Refresh board' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <StateView
        stateId="offline"
        title="Delivery board is offline"
        description="Retry the board and keep handoff risk visible once connectivity returns."
        onActionPress={onRetry}
      />
    );
  }

  return (
    <StateView
      stateId="recoverableError"
      title="Delivery board is unavailable"
      description="Retry the board without losing visibility over the active branch workload."
      onActionPress={onRetry}
    />
  );
}

export function DshPartnerDeliveryOpsBoardScreen({
  state = 'ready',
  summary = demoSummary,
  orders = demoOrders,
  onOpenOrder,
  onOpenIssueQueue,
  onRetry,
}: DshPartnerDeliveryOpsBoardScreenProps) {
  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry);
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">Partner delivery ops board</Text>
        <Text role="bodyMd" tone="muted">
          One compact board for branch handoff pressure, active deliveries, and issue risk.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader
          title="Branch delivery health"
          subtitle="Handoff and delivery pressure stay visible before operators drill into a single order."
        />
        <StatCard label="Out for delivery" value={String(summary.outForDelivery)} deltaLabel="Active trips" tone="info" />
        <StatCard label="Ready for handoff" value={String(summary.handoffReady)} deltaLabel="Branch release queue" tone="success" />
        <StatCard label="Delivered today" value={String(summary.deliveredToday)} deltaLabel="Closed successfully" tone="default" />
        <StatCard label="Delay risk" value={String(summary.delayedRisk)} deltaLabel="Needs attention" tone="warning" />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="Orders needing attention"
          subtitle="Every row exposes the next operational decision without forcing route-hopping."
        />
        <Box gap={2}>
          {orders.map((order) => (
            <ListItem
              key={order.id}
              title={order.title}
              subtitle={order.subtitle}
              meta={`${order.etaLabel} | Next: ${order.nextActionLabel}`}
              badgeLabel={order.statusLabel}
              onPress={() => onOpenOrder?.(order.id)}
            />
          ))}
        </Box>
      </Surface>

      <Button label="Open issue queue" tone="secondary" onPress={onOpenIssueQueue} />
    </MobileScrollView>
  );
}

export default DshPartnerDeliveryOpsBoardScreen;