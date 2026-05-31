'use client';

import React from 'react';
import { Box, Surface, Text, TextField } from '@bthwani/ui-kit';
import { Pressable } from 'react-native';
import {
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import { getDshRolePermission } from '../../shared/dsh-role-permission.model';
import styles from '../shared/control-panel-surface.module.css';

const DEACTIVATION_POLICY = getDshRolePermission('partner-deactivation');

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
  auditRequired?: boolean;
  onConfirmDeactivate?: (partnerId: string, reason: DeactivationReason, evidenceNote: string) => void;
  onClose?: () => void;
};

export function PartnerDeactivationWorkspace({
  partnerId = '—',
  partnerName = 'الشريك',
  auditRequired = false,
  onConfirmDeactivate,
  onClose,
}: PartnerDeactivationWorkspaceProps) {
  const [selectedReason, setSelectedReason] = React.useState<DeactivationReason | null>(null);
  const [evidenceNote, setEvidenceNote] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const canConfirm = selectedReason !== null && evidenceNote.trim().length > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmDeactivate?.(partnerId, selectedReason!, evidenceNote.trim());
      setIsSubmitting(false);
      onClose?.();
    }, 600);
  };

  return (
    <WebControlPanelInspectorShell
      title={`إيقاف الشريك — ${partnerName}`}
      onClose={onClose}
    >
      <Box gap={4} padding={4}>
        {DEACTIVATION_POLICY ? (
          <Surface tone="inset" padding={3} gap={2} radiusToken="md">
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <Surface tone="warning" padding={1} radiusToken="pill" border={false}>
                <Text role="caption" tone="muted">تدقيق إلزامي</Text>
              </Surface>
              <Surface tone="raised" padding={1} radiusToken="pill" border>
                <Text role="caption" tone="muted">سبب مطلوب</Text>
              </Surface>
              <Surface tone="raised" padding={1} radiusToken="pill" border>
                <Text role="caption" tone="muted">إثبات مطلوب</Text>
              </Surface>
            </Box>
            <Text role="caption" tone="muted">
              {DEACTIVATION_POLICY.arabicDescription}
            </Text>
          </Surface>
        ) : null}

        <Text role="bodyMd" tone="muted">اختر سبب الإيقاف:</Text>
        <Box gap={2}>
          {deactivationReasons.map((reason) => {
            const isSelected = selectedReason === reason.id;
            return (
              <Pressable
                key={reason.id}
                onPress={() => setSelectedReason(reason.id)}
                style={{ cursor: 'pointer' }}
              >
                <Surface
                  padding={3}
                  radiusToken="sm"
                  border
                  borderTone={isSelected ? 'brand' : 'line'}
                  tone={isSelected ? 'brand' : 'default'}
                  layoutDirection="row"
                  align="center"
                >
                  <Text role="bodySm" tone={isSelected ? 'brand' : 'default'}>{reason.label}</Text>
                </Surface>
              </Pressable>
            );
          })}
        </Box>

        <Box gap={1}>
          <TextField
            label="ملاحظة الإثبات (إلزامية)"
            value={evidenceNote}
            onChangeText={setEvidenceNote}
            placeholder="وصف مختصر للسبب الفعلي، الحادثة، أو الدليل المرجعي..."
            multiline
            editable={!isSubmitting}
          />
          <Text role="caption" tone="muted">
            تُحفظ هذه الملاحظة في سجل الأحداث وتُعدّ جزءًا من قرار الإيقاف الرسمي.
          </Text>
        </Box>

        {auditRequired ? (
          <Box gap={1}>
            <Text role="bodySm" tone="warning">⚠ هذا الإيقاف يستلزم مراجعة من فريق التدقيق بعد التنفيذ.</Text>
            <Text role="caption" tone="muted">
              معرّف الشريك ({partnerId}) سيُضاف تلقائيًا إلى قائمة المراجعات المعلّقة.
            </Text>
          </Box>
        ) : null}

        <WebControlPanelActionCluster
          primary={(!canConfirm || isSubmitting) ? undefined : {
            id: 'deactivate',
            label: isSubmitting ? 'جارٍ الإيقاف...' : 'تأكيد الإيقاف',
            onAction: handleConfirm,
          }}
          secondary={isSubmitting ? undefined : { id: 'cancel', label: 'إلغاء', onAction: onClose }}
        />
      </Box>
    </WebControlPanelInspectorShell>
  );
}

export default PartnerDeactivationWorkspace;
