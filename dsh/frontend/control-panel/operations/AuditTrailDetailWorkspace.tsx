// ML-035: CP audit trail detail workspace skeleton — drill-down from AuditSupportSlaScreen
// TODO: implement when audit detail API is proven
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelInspectorShell,
} from '@bthwani/ui-kit/web';

export type AuditTrailDetailWorkspaceProps = {
  orderId?: string;
  onClose?: () => void;
};

export function AuditTrailDetailWorkspace({
  orderId = '—',
  onClose,
}: AuditTrailDetailWorkspaceProps) {
  return (
    <WebControlPanelInspectorShell
      title={`سجل التدقيق — ${orderId}`}
      subtitle="مسار الطلب الكامل من البداية إلى النهاية"
      onClose={onClose}
    >
      <Box gap={4} padding={4}>
        <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={2}>
          <Text role="titleSm" tone="brand" style={{ fontWeight: '800' }}>سجل التدقيق معلق</Text>
          <Text tone="muted">سيظهر هنا الجدول الزمني الكامل لأحداث الطلب بعد ربط نقطة نهاية التدقيق.</Text>
        </Box>
        <Box gap={2}>
          {(['بدء الطلب', 'قبول الشريك', 'بدء التحضير', 'تعيين الكابتن', 'الاستلام', 'التسليم'] as const).map((step) => (
            <Box key={step} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text role="bodySm" tone="muted">{step}</Text>
              <Text role="bodySm">— معلق</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </WebControlPanelInspectorShell>
  );
}

export default AuditTrailDetailWorkspace;
