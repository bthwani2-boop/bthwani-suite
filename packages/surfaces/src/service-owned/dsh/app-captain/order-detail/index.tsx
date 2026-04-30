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
          <Badge label="طلب الكابتن" tone="warning" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>{summary.orderId}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {summary.currentStageLabel}
          </Text>
        </Box>

        <KeyValueList
          items={[
            { label: 'الاستلام', value: summary.pickupLabel, tone: 'brand' },
            { label: 'التسليم', value: summary.dropoffLabel },
            { label: 'الوقت المتوقع', value: summary.etaLabel, tone: 'warning' },
            { label: 'الخطوة التالية', value: summary.nextActionLabel, tone: 'success' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="إجراءات الطلب" subtitle="أكد الخطوة التالية من دون مغادرة سطح تفاصيل الطلب." />
        <Box gap={2}>
          {onConfirmPickup ? <Button label="تأكيد الاستلام" onPress={onConfirmPickup} /> : null}
          {onConfirmDelivery ? <Button label="تأكيد التسليم" tone="secondary" onPress={onConfirmDelivery} /> : null}
          {onOpenNextOrder ? <Button label="فتح الطلب التالي" tone="secondary" onPress={onOpenNextOrder} /> : null}
          {onBackToInbox ? <Button label="العودة إلى الصندوق" tone="ghost" onPress={onBackToInbox} /> : null}
          {onRetry ? <Button label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
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
      <SectionHeader title="تأكيد الاستلام" subtitle="أقر باستلام الطلب قبل نقله إلى المرحلة التالية." />
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{orderTitle}</Text>
      <Box gap={2}>
        <Button label="تأكيد الاستلام" onPress={onConfirm} />
        <Button label="إلغاء" tone="ghost" onPress={onCancel} />
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
      <SectionHeader title="تأكيد التسليم" subtitle="أغلق الطلب بعد استلام العميل له." />
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{orderTitle}</Text>
      <Box gap={2}>
        <Button label="تأكيد التسليم" onPress={onConfirm} />
        <Button label="إلغاء" tone="ghost" onPress={onCancel} />
      </Box>
    </Surface>
  );
}

export default CaptainOrderDetailScreen;
