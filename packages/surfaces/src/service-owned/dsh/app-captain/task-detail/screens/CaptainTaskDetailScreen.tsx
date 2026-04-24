import React from 'react';
import { Badge, Box, Button, KeyValueList, MobileScrollView, SectionHeader, Surface, Text } from '@bthwani/ui-kit';

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
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label="Captain order" tone="warning" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>{summary.taskId}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {summary.currentStageLabel}
          </Text>
        </Box>

        <KeyValueList
          items={[
            { label: 'Pickup', value: summary.pickupLabel, tone: 'brand' },
            { label: 'Dropoff', value: summary.dropoffLabel },
            { label: 'ETA', value: summary.etaLabel, tone: 'warning' },
            { label: 'Next step', value: summary.nextActionLabel, tone: 'success' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="Order actions" subtitle="Confirm the next step without leaving the order detail surface." />
        <Box gap={2}>
          {onConfirmPickup ? <Button label="Confirm pickup" onPress={onConfirmPickup} /> : null}
          {onConfirmDelivery ? <Button label="Confirm delivery" tone="secondary" onPress={onConfirmDelivery} /> : null}
          {onOpenNextTask ? <Button label="Open next order" tone="secondary" onPress={onOpenNextTask} /> : null}
          {onBackToInbox ? <Button label="Back to inbox" tone="ghost" onPress={onBackToInbox} /> : null}
          {onRetry ? <Button label="Retry" tone="ghost" onPress={onRetry} /> : null}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

export default CaptainOrderDetailScreen;
