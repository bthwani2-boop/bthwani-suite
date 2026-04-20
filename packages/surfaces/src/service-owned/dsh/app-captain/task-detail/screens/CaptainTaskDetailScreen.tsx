import React from 'react';
import { BthBadge, BthBox, BthButton, BthKeyValueList, BthMobileScrollView, BthSectionHeader, BthSurface, BthText } from '@bthwani/ui-kit';

export type CaptainOrderDetailSummary = {
  taskId: string;
  pickupLabel: string;
  dropoffLabel: string;
  etaLabel: string;
  currentStageLabel: string;
  nextActionLabel: string;
};

export type CaptainOrderDetailScreenProps = {
  summary: CaptainOrderDetailSummary;
  onConfirmPickup?: () => void;
  onConfirmDelivery?: () => void;
  onOpenNextTask?: () => void;
  onBackToInbox?: () => void;
  onRetry?: () => void;
};

export function CaptainOrderDetailScreen({
  summary,
  onConfirmPickup,
  onConfirmDelivery,
  onOpenNextTask,
  onBackToInbox,
  onRetry,
}: CaptainOrderDetailScreenProps) {
  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthSurface tone="brand" gap={3}>
        <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
          <BthBadge label="Captain order" tone="warning" />
          <BthText role="titleLg" style={{ textAlign: 'right' }}>{summary.taskId}</BthText>
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {summary.currentStageLabel}
          </BthText>
        </BthBox>

        <BthKeyValueList
          items={[
            { label: 'Pickup', value: summary.pickupLabel, tone: 'brand' },
            { label: 'Dropoff', value: summary.dropoffLabel },
            { label: 'ETA', value: summary.etaLabel, tone: 'warning' },
            { label: 'Next step', value: summary.nextActionLabel, tone: 'success' },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="Order actions" subtitle="Confirm the next step without leaving the order detail surface." />
        <BthBox gap={2}>
          {onConfirmPickup ? <BthButton label="Confirm pickup" onPress={onConfirmPickup} /> : null}
          {onConfirmDelivery ? <BthButton label="Confirm delivery" tone="secondary" onPress={onConfirmDelivery} /> : null}
          {onOpenNextTask ? <BthButton label="Open next order" tone="secondary" onPress={onOpenNextTask} /> : null}
          {onBackToInbox ? <BthButton label="Back to inbox" tone="ghost" onPress={onBackToInbox} /> : null}
          {onRetry ? <BthButton label="Retry" tone="ghost" onPress={onRetry} /> : null}
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}

export default CaptainOrderDetailScreen;
