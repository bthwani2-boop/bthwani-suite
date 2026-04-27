import React from 'react';
import { Badge, Box, Button, KeyValueList, MobileScrollView, SectionHeader, Surface, Text } from '@bthwani/ui-kit';

export type CaptainOrderDetailSummary = {
  orderId: string;
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
  onOpenNextOrder?: () => void;
  onBackToInbox?: () => void;
  onRetry?: () => void;
};

export function CaptainOrderDetailScreen({
  summary,
  onConfirmPickup,
  onConfirmDelivery,
  onOpenNextOrder,
  onBackToInbox,
  onRetry,
}: CaptainOrderDetailScreenProps) {
  return (
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label="Captain order" tone="warning" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>{summary.orderId}</Text>
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
          {onOpenNextOrder ? <Button label="Open next order" tone="secondary" onPress={onOpenNextOrder} /> : null}
          {onBackToInbox ? <Button label="Back to inbox" tone="ghost" onPress={onBackToInbox} /> : null}
          {onRetry ? <Button label="Retry" tone="ghost" onPress={onRetry} /> : null}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

export type CaptainPickupConfirmSheetProps = {
  visible: boolean;
  orderTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CaptainPickupConfirmSheet({ visible, orderTitle, onConfirm, onCancel }: CaptainPickupConfirmSheetProps) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
      <SectionHeader title="Confirm pickup" subtitle="Acknowledge the order pickup before moving it to the next stage." />
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{orderTitle}</Text>
      <Box gap={2}>
        <Button label="Confirm pickup" onPress={onConfirm} />
        <Button label="Cancel" tone="ghost" onPress={onCancel} />
      </Box>
    </Surface>
  );
}

export type CaptainDeliveryConfirmSheetProps = {
  visible: boolean;
  orderTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CaptainDeliveryConfirmSheet({ visible, orderTitle, onConfirm, onCancel }: CaptainDeliveryConfirmSheetProps) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
      <SectionHeader title="Confirm delivery" subtitle="Close the order once the customer receives it." />
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{orderTitle}</Text>
      <Box gap={2}>
        <Button label="Confirm delivery" onPress={onConfirm} />
        <Button label="Cancel" tone="ghost" onPress={onCancel} />
      </Box>
    </Surface>
  );
}

export default CaptainOrderDetailScreen;