// ML-038: CP partner deactivation workspace skeleton
// TODO: implement when partner management API is proven
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';

type DeactivationReason =
  | 'sla_breach'
  | 'fraud_suspected'
  | 'partner_request'
  | 'contract_expired'
  | 'other';

const deactivationReasons: ReadonlyArray<{ id: DeactivationReason; label: string }> = [
  { id: 'sla_breach', label: 'انتهاك متكرر لمستويات الخدمة' },
  { id: 'fraud_suspected', label: 'اشتباه بعمليات احتيال' },
  { id: 'partner_request', label: 'طلب الشريك نفسه' },
  { id: 'contract_expired', label: 'انتهاء العقد' },
  { id: 'other', label: 'سبب آخر' },
];

export type PartnerDeactivationWorkspaceProps = {
  partnerId?: string;
  partnerName?: string;
  onConfirmDeactivate?: (partnerId: string, reason: DeactivationReason) => void;
  onClose?: () => void;
};

export function PartnerDeactivationWorkspace({
  partnerId = '—',
  partnerName = 'الشريك',
  onConfirmDeactivate,
  onClose,
}: PartnerDeactivationWorkspaceProps) {
  const [selectedReason, setSelectedReason] = React.useState<DeactivationReason | null>(null);

  return (
    <WebControlPanelInspectorShell
      title={`إيقاف الشريك — ${partnerName}`}
      subtitle={`معرف الشريك: ${partnerId}`}
      onClose={onClose}
    >
      <Box gap={4} padding={4}>
        <Text role="bodyMd" tone="muted">اختر سبب الإيقاف:</Text>
        <Box gap={2}>
          {deactivationReasons.map((reason) => (
            <Box
              key={reason.id}
              padding={3}
              background={selectedReason === reason.id ? 'brandSurface' : 'surfaceRaised'}
              radiusToken="md"
              style={{ cursor: 'pointer' }}
              onPress={() => setSelectedReason(reason.id)}
            >
              <Text role="bodySm" tone={selectedReason === reason.id ? 'brand' : 'default'}>{reason.label}</Text>
            </Box>
          ))}
        </Box>
        <WebControlPanelActionCluster
          primary={{
            id: 'deactivate',
            label: 'تأكيد الإيقاف',
            onAction: selectedReason ? () => onConfirmDeactivate?.(partnerId, selectedReason) : undefined,
          }}
          secondary={{ id: 'cancel', label: 'إلغاء', onAction: onClose }}
        />
      </Box>
    </WebControlPanelInspectorShell>
  );
}

export default PartnerDeactivationWorkspace;
