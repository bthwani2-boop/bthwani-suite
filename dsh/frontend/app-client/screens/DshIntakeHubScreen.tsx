import React from 'react';
import { Surface, Text } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshIntakeHubScreenProps } from './parts/OrdersTrackingHelpers';

export function DshIntakeHubScreen({
  state = 'ready',
  screenId = 'intake-workspace',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshIntakeHubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="قدرة مدمجة داخل تأكيد الطلب"
      subtitle="التجهيز والتقدير ومراجعة الجاهزية تظهر داخل شاشة تأكيد الطلب أو إنشاء الطلب، وليست صفحة عميل مستقلة."
      content={
        <Surface tone="inset" gap={2}>
          <Text role="bodyStrong">{screenId}</Text>
          <Text role="bodySm" tone="muted">أي تفاصيل تخص التقدير أو بوابة الإكمال أو العروض الترويجية يجب أن تظهر داخل رحلة تأكيد الطلب القانونية فقط.</Text>
        </Surface>
      }
      primaryActionLabel="فتح تأكيد الطلب"
      secondaryActionLabel="العودة"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction ?? onRetry}
      onRetry={onRetry}
    />
  );
}

export default DshIntakeHubScreen;
