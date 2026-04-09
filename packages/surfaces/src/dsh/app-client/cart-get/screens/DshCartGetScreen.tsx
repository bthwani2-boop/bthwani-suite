import React from 'react';
import {
  BthBox,
  BthButton,
  BthCard,
  BthListItem,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type DshCartGetScreenState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'offline'
  | 'disabled';

export type DshCartStoreSummary = {
  id: string;
  name: string;
  subtitle: string;
  ratingLabel?: string;
  statusLabel?: string;
};

export type DshCartOrderSummary = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  statusLabel: string;
};

export type DshCartGetScreenProps = {
  state?: DshCartGetScreenState;
  store?: DshCartStoreSummary;
  activeOrder?: DshCartOrderSummary;
  statusTitle?: string;
  statusDescription?: string;
  onOpenStore?: (storeId: string) => void;
  onOpenOrder?: (orderId: string) => void;
  onRetry?: () => void;
  onContinue?: () => void;
};

function renderNonReadyState(
  state: DshCartGetScreenState,
  onRetry?: () => void,
  onContinue?: () => void
) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="Your cart is empty"
        description="Start from one store and keep the first order flow focused."
        actionLabel="Browse stores"
        onActionPress={onContinue}
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
        title="Cart is temporarily unavailable"
        description="This step is currently paused. Keep fallback and retry visible."
        actionLabel="Retry"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Cart could not be loaded"
      description="Retry first. If the issue continues, use a safe fallback path."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

function renderStoreSection(store: DshCartStoreSummary, onOpenStore?: (storeId: string) => void) {
  return (
    <BthSurface tone="raised" gap={3}>
      <BthSectionHeader
        title="Store"
        subtitle="Keep store context visible before order confirmation."
      />
      <BthCard
        title={store.name}
        subtitle={store.subtitle}
        footer={
          <BthBox layoutDirection="row" gap={2}>
            <BthButton
              label="Open store"
              tone="secondary"
              onPress={onOpenStore ? () => onOpenStore(store.id) : undefined}
            />
          </BthBox>
        }
      />
      <BthBox layoutDirection="row" gap={2}>
        {store.statusLabel ? <BthText role="caption">{store.statusLabel}</BthText> : null}
        {store.ratingLabel ? <BthText role="caption" tone="muted">{store.ratingLabel}</BthText> : null}
      </BthBox>
    </BthSurface>
  );
}

function renderOrderSection(order: DshCartOrderSummary, onOpenOrder?: (orderId: string) => void) {
  return (
    <BthSurface tone="raised" gap={3}>
      <BthSectionHeader
        title="Active order"
        subtitle="One dominant action: open the order and continue the journey."
      />
      <BthListItem
        title={order.title}
        subtitle={order.subtitle}
        meta={order.meta}
        badgeLabel={order.statusLabel}
        onPress={onOpenOrder ? () => onOpenOrder(order.id) : undefined}
      />
    </BthSurface>
  );
}

function renderStatusSection(
  statusTitle: string,
  statusDescription: string,
  onContinue?: () => void
) {
  return (
    <BthSurface tone="inset" gap={3}>
      <BthSectionHeader
        title="Current status"
        subtitle="Keep closure and next action explicit at all times."
      />
      <BthCard
        title={statusTitle}
        subtitle={statusDescription}
        footer={<BthButton label="Continue" onPress={onContinue} />}
      />
    </BthSurface>
  );
}

export function DshCartGetScreen({
  state = 'ready',
  store,
  activeOrder,
  statusTitle = 'Ready for checkout',
  statusDescription = 'Review your order and continue to the next step.',
  onOpenStore,
  onOpenOrder,
  onRetry,
  onContinue,
}: DshCartGetScreenProps) {
  if (state !== 'ready') {
    return renderNonReadyState(state, onRetry, onContinue);
  }

  if (!store || !activeOrder) {
    return (
      <BthStateView
        stateId="blockingError"
        title="Cart data contract is missing"
        description="Store and active order summaries are required for ready state."
      />
    );
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      {renderStoreSection(store, onOpenStore)}
      {renderOrderSection(activeOrder, onOpenOrder)}
      {renderStatusSection(statusTitle, statusDescription, onContinue)}
    </BthMobileScrollView>
  );
}
