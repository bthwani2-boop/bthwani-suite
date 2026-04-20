import React from 'react';
import {
  BthBox,
  BthButton,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type PartnerOrderDetailScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'disabled';

export type PartnerOrderDetailSummary = {
  orderId: string;
  merchantName: string;
  customerName: string;
  serviceWindowLabel: string;
  nextActionLabel: string;
  readinessNote: string;
};

export type PartnerOrderDetailScreenProps = {
  state?: PartnerOrderDetailScreenState;
  summary?: PartnerOrderDetailSummary;
  disableReason?: string;
  onConfirmReady?: (orderId: string) => void;
  onOpenNextOrder?: () => void;
  onBackToInbox?: () => void;
  onRetry?: () => void;
};

const demoSummary: PartnerOrderDetailSummary = {
  orderId: 'partner-order-1042',
  merchantName: 'Burger Lab',
  customerName: 'Omar A.',
  serviceWindowLabel: '12 min to SLA',
  nextActionLabel: 'confirm ready and release to captain',
  readinessNote: 'Packaging is complete and handoff lane is available.',
};

function renderLoadingState() {
  return (
    <BthStateView
      stateId="loading"
      title="Loading order detail"
      description="Bring only the context needed for the next operational decision."
    />
  );
}

function renderEmptyState(onBackToInbox?: () => void) {
  return (
    <BthStateView
      stateId="empty"
      title="No order selected"
      description="Open the inbox and pick the next queued order."
      actionLabel={onBackToInbox ? 'Back to inbox' : undefined}
      onActionPress={onBackToInbox}
    />
  );
}

function renderErrorState(onRetry?: () => void, onBackToInbox?: () => void) {
  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthStateView
        stateId="recoverableError"
        title="Order detail is unavailable"
        description="Retry this order or return to inbox to keep the queue moving."
        actionLabel="Retry detail"
        onActionPress={onRetry}
      />
      {onBackToInbox ? (
        <BthButton label="Back to inbox" tone="secondary" onPress={onBackToInbox} />
      ) : null}
    </BthMobileScrollView>
  );
}

function renderDisabledState(reason: string, onBackToInbox?: () => void) {
  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthStateView
        kind="warning"
        title="This order is temporarily locked"
        description={reason}
      />
      {onBackToInbox ? (
        <BthButton label="Back to inbox" tone="secondary" onPress={onBackToInbox} />
      ) : null}
    </BthMobileScrollView>
  );
}

export function PartnerOrderDetailScreen({
  state = 'ready',
  summary = demoSummary,
  disableReason = 'The branch profile is not ready to confirm handoff yet.',
  onConfirmReady,
  onOpenNextOrder,
  onBackToInbox,
  onRetry,
}: PartnerOrderDetailScreenProps) {
  if (state === 'loading') {
    return renderLoadingState();
  }

  if (state === 'error') {
    return renderErrorState(onRetry, onBackToInbox);
  }

  if (state === 'disabled') {
    return renderDisabledState(disableReason, onBackToInbox);
  }

  if (state === 'empty') {
    return renderEmptyState(onBackToInbox);
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthBox gap={2}>
        <BthText role="titleLg">Order detail</BthText>
        <BthText role="bodySm" tone="muted">
          Detail supports one decision: execute the current order action, then move to the next inbox order.
        </BthText>
      </BthBox>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Order summary"
          subtitle="Only the fields needed to validate this decision."
        />
        <BthBox gap={1}>
          <BthText role="bodyStrong">Order #{summary.orderId.replace('partner-order-', '')}</BthText>
          <BthText role="bodySm" tone="muted">
            {summary.merchantName} | Customer: {summary.customerName}
          </BthText>
          <BthText role="caption" tone="soft">
            {summary.serviceWindowLabel}
          </BthText>
        </BthBox>
      </BthSurface>

      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title="Next action"
          subtitle="Primary CTA stays operational and explicit."
        />
        <BthBox gap={1}>
          <BthText role="bodyStrong">{summary.nextActionLabel}</BthText>
          <BthText role="bodySm" tone="muted">
            {summary.readinessNote}
          </BthText>
        </BthBox>
        <BthButton
          label="Confirm ready for pickup"
          onPress={() => onConfirmReady?.(summary.orderId)}
        />
      </BthSurface>

      <BthButton label="Open next order" tone="secondary" onPress={onOpenNextOrder} />
      <BthButton label="Back to inbox" tone="ghost" onPress={onBackToInbox} />
    </BthMobileScrollView>
  );
}

export default PartnerOrderDetailScreen;

