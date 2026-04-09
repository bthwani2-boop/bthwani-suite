import React from 'react';
import {
  BthBox,
  BthButton,
  BthCard,
  BthDashboardShell,
  BthStateView,
  BthText,
} from '@bthwani/ui-kit';

export type DshEntryScreenState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'offline'
  | 'error'
  | 'disabled';

export type DshEntryScreenProps = {
  state?: DshEntryScreenState;
  title?: string;
  subtitle?: string;
  onStartDelivery?: () => void;
  onBrowseStores?: () => void;
  onOpenOrders?: () => void;
  onRetry?: () => void;
};

function renderNonReadyState(
  state: DshEntryScreenState,
  onStartDelivery?: () => void,
  onRetry?: () => void
) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        actionLabel="Start delivery"
        onActionPress={onStartDelivery}
      />
    );
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return (
      <BthStateView
        stateId="warning"
        title="Delivery entry is temporarily paused"
        description="This route is currently restricted. Keep retry and fallback visible."
        actionLabel="Retry"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Entry is unavailable"
      description="Retry first. If the issue persists, use the orders path as fallback."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

function renderHero(onStartDelivery?: () => void) {
  return (
    <BthCard
      title="Deliver with confidence"
      subtitle="One clean starting point for discovery, cart review, and next action."
      footer={<BthButton label="Start delivery" onPress={onStartDelivery} />}
    />
  );
}

function renderDiscoverySection(onBrowseStores?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Discover nearby stores"
        subtitle="Keep discovery lightweight and focused before cart expansion."
        footer={<BthButton label="Browse stores" tone="secondary" onPress={onBrowseStores} />}
      />
      <BthCard
        title="Continue from cart"
        subtitle="Return to the first executable flow without extra navigation branches."
      />
    </BthBox>
  );
}

function renderReviewSection(onOpenOrders?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Review before confirmation"
        subtitle="Keep one dominant CTA and one clear fallback path."
      />
      <BthCard
        title="Open active orders"
        subtitle="Tracking remains available as a confidence and recovery destination."
        footer={<BthButton label="Open orders" tone="ghost" onPress={onOpenOrders} />}
      />
    </BthBox>
  );
}

export function DshEntryScreen({
  state = 'ready',
  title = 'Delivery entry',
  subtitle = 'First visual service entry slice for app-client delivery journeys.',
  onStartDelivery,
  onBrowseStores,
  onOpenOrders,
  onRetry,
}: DshEntryScreenProps) {
  if (state !== 'ready') {
    return renderNonReadyState(state, onStartDelivery, onRetry);
  }

  return (
    <BthDashboardShell
      title={title}
      subtitle={subtitle}
      hero={renderHero(onStartDelivery)}
      sections={[
        {
          title: 'Discovery',
          subtitle: 'Keep options compact and avoid decision noise.',
          content: renderDiscoverySection(onBrowseStores),
        },
        {
          title: 'Review and tracking',
          subtitle: 'Preserve closure confidence and fallback continuity.',
          content: renderReviewSection(onOpenOrders),
        },
        {
          title: 'Flow guardrails',
          subtitle: 'This slice is UI/UX/Flow only in the current phase.',
          content: (
            <BthBox>
              <BthText role="bodySm" tone="muted">
                No API, binding, integration, runtime, or contract work is executed in this screen.
              </BthText>
            </BthBox>
          ),
        },
      ]}
    />
  );
}
