'use client';

// P0-04/P0-09: Partner deactivation workspace — CP-owned authority surface.
// control-panel/partners is the ONLY surface authorised to deactivate a partner.
// Evidence note is mandatory alongside reason — both required before confirm is enabled.
// Audit trail is displayed when auditRequired = true for the current activation status.
// P0-09: Role policy context displayed from DSH role/permission model (UI preview only).
import React from 'react';
import { Box, Surface, Text, TextField } from '@bthwani/ui-kit';
import {
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import { getDshRolePermission } from '../../shared/dsh-role-permission.model';
import styles from '../shared/control-panel-surface.module.css';

// Policy for partner deactivation section (loaded once at module level — no churn)
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
  /** Whether an audit trail entry is required for this deactivation (from activation state metadata) */
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

  // Both reason and evidence note are required before the confirm action is enabled.
  const canConfirm = selectedReason !== null && evidenceNote.trim().length > 0;

  return (
    <WebControlPanelInspectorShell
      title={`إيقاف الشريك — ${partnerName}`}
      onClose={onClose}
    >
      <Box gap={4} padding={4}>
        {/* Role policy context — P0-09: UI preview only, no runtime auth */}
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
          {deactivationReasons.map((reason) => (
            <button
              key={reason.id}
              type="button"
              onClick={() => setSelectedReason(reason.id)}
              className={`${styles.selectableReasonItem} ${selectedReason === reason.id ? styles.selectableReasonItemActive : ''}`}
            >
              <Text role="bodySm" tone={selectedReason === reason.id ? 'brand' : 'default'}>{reason.label}</Text>
            </button>
          ))}
        </Box>

        {/* Evidence note — mandatory for all deactivations; feeds audit trail */}
        <Box gap={1}>
          <TextField
            label="ملاحظة الإثبات (إلزامية)"
            value={evidenceNote}
            onChangeText={setEvidenceNote}
            placeholder="وصف مختصر للسبب الفعلي، الحادثة، أو الدليل المرجعي..."
            multiline
          />
          <Text role="caption" tone="muted">
            تُحفظ هذه الملاحظة في سجل الأحداث وتُعدّ جزءًا من قرار الإيقاف الرسمي.
          </Text>
        </Box>

        {/* Audit notice — shown when the partner's current activation state flags auditRequired */}
        {auditRequired ? (
          <Box gap={1}>
            <Text role="bodySm" tone="warning">⚠ هذا الإيقاف يستلزم مراجعة من فريق التدقيق بعد التنفيذ.</Text>
            <Text role="caption" tone="muted">
              معرّف الشريك ({partnerId}) سيُضاف تلقائيًا إلى قائمة المراجعات المعلّقة.
            </Text>
          </Box>
        ) : null}

        <WebControlPanelActionCluster
          primary={{
            id: 'deactivate',
            label: 'تأكيد الإيقاف',
            onAction: canConfirm
              ? () => onConfirmDeactivate?.(partnerId, selectedReason!, evidenceNote.trim())
              : undefined,
          }}
          secondary={{ id: 'cancel', label: 'إلغاء', onAction: onClose }}
        />
      </Box>
    </WebControlPanelInspectorShell>
  );
}

export default PartnerDeactivationWorkspace;
