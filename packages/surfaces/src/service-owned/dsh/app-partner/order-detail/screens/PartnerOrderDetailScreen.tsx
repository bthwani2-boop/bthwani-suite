import React from 'react';
import {
  Box,
  Button,
  MobileScrollView,
  SectionHeader,
  StateView,
  Surface,
  Text,
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
    <StateView
      stateId="loading"
      title="Loading order detail"
      description="Bring only the context needed for the next operational decision."
    />
  );
}

function renderEmptyState(onBackToInbox?: () => void) {
  return (
    <StateView
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
    <MobileScrollView padding={4} gap={3}>
      <StateView
        stateId="recoverableError"
        title="Order detail is unavailable"
        description="Retry this order or return to inbox to keep the queue moving."
        actionLabel="Retry detail"
        onActionPress={onRetry}
      />
      {onBackToInbox ? (
        <Button label="Back to inbox" tone="secondary" onPress={onBackToInbox} />
      ) : null}
    </MobileScrollView>
  );
}

function renderDisabledState(reason: string, onBackToInbox?: () => void) {
  return (
    <MobileScrollView padding={4} gap={3}>
      <StateView
        kind="warning"
        title="This order is temporarily locked"
        description={reason}
      />
      {onBackToInbox ? (
        <Button label="Back to inbox" tone="secondary" onPress={onBackToInbox} />
      ) : null}
    </MobileScrollView>
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
    <MobileScrollView padding={4} gap={3}>
      <Box gap={2}>
        <Text role="titleLg">Order detail</Text>
        <Text role="bodySm" tone="muted">
          Detail supports one decision: execute the current order action, then move to the next inbox order.
        </Text>
      </Box>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="Order summary"
          subtitle="Only the fields needed to validate this decision."
        />
        <Box gap={1}>
          <Text role="bodyStrong">Order #{summary.orderId.replace('partner-order-', '')}</Text>
          <Text role="bodySm" tone="muted">
            {summary.merchantName} | Customer: {summary.customerName}
          </Text>
          <Text role="caption" tone="soft">
            {summary.serviceWindowLabel}
          </Text>
        </Box>
      </Surface>

      <Surface tone="brand" gap={3}>
        <SectionHeader
          title="Next action"
          subtitle="Primary CTA stays operational and explicit."
        />
        <Box gap={1}>
          <Text role="bodyStrong">{summary.nextActionLabel}</Text>
          <Text role="bodySm" tone="muted">
            {summary.readinessNote}
          </Text>
        </Box>
        <Button
          label="Confirm ready for pickup"
          onPress={() => onConfirmReady?.(summary.orderId)}
        />
      </Surface>

      <Button label="Open next order" tone="secondary" onPress={onOpenNextOrder} />
      <Button label="Back to inbox" tone="ghost" onPress={onBackToInbox} />
    </MobileScrollView>
  );
}

export default PartnerOrderDetailScreen;

