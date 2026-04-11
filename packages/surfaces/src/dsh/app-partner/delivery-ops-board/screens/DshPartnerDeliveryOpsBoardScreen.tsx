import React from 'react';
import {
  BthBox,
  BthButton,
  BthListItem,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthStatCard,
  BthSurface,
  BthText,
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
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
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
      <BthStateView
        stateId="offline"
        title="Delivery board is offline"
        description="Retry the board and keep handoff risk visible once connectivity returns."
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
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
    <BthMobileScrollView padding={4} gap={4}>
      <BthBox gap={2}>
        <BthText role="titleLg">Partner delivery ops board</BthText>
        <BthText role="bodyMd" tone="muted">
          One compact board for branch handoff pressure, active deliveries, and issue risk.
        </BthText>
      </BthBox>

      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title="Branch delivery health"
          subtitle="Handoff and delivery pressure stay visible before operators drill into a single order."
        />
        <BthStatCard label="Out for delivery" value={String(summary.outForDelivery)} deltaLabel="Active trips" tone="info" />
        <BthStatCard label="Ready for handoff" value={String(summary.handoffReady)} deltaLabel="Branch release queue" tone="success" />
        <BthStatCard label="Delivered today" value={String(summary.deliveredToday)} deltaLabel="Closed successfully" tone="default" />
        <BthStatCard label="Delay risk" value={String(summary.delayedRisk)} deltaLabel="Needs attention" tone="warning" />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Orders needing attention"
          subtitle="Every row exposes the next operational decision without forcing route-hopping."
        />
        <BthBox gap={2}>
          {orders.map((order) => (
            <BthListItem
              key={order.id}
              title={order.title}
              subtitle={order.subtitle}
              meta={`${order.etaLabel} | Next: ${order.nextActionLabel}`}
              badgeLabel={order.statusLabel}
              onPress={() => onOpenOrder?.(order.id)}
            />
          ))}
        </BthBox>
      </BthSurface>

      <BthButton label="Open issue queue" tone="secondary" onPress={onOpenIssueQueue} />
    </BthMobileScrollView>
  );
}

export default DshPartnerDeliveryOpsBoardScreen;