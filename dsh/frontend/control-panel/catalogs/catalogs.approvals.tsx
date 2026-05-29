// P0-05: Catalog item approval section — control-panel/catalogs owns all approval decisions.
// Evidence note is required for rejection and revision requests (feeds audit trail).
// app-partner and app-field cannot approve catalog items; only this surface can.
import React from 'react';
import { Box, Button, ListItem, Text, TextField, useTheme } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
import {
  type DshProductIdentityApprovalStatus,
  getDshProductApprovalStatusTone,
} from '../../shared/dsh-product-identity.model';
import {
  getAllApprovalRecords,
  moveApprovalRecordToStage,
  upsertApprovalRecord,
  type ApprovalRecord,
  type ApprovalStage,
} from '../../shared/workflow';

type ItemApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-revision';

type CatalogItemApprovalRecord = {
  id: string;
  displayCaption: string;
  partnerLabel: string;
  category: string;
  submittedAt: string;
  status: ItemApprovalStatus;
  /** Approval stage in the canonical pipeline — used for tone and label resolution */
  approvalStatus?: DshProductIdentityApprovalStatus;
  /** Note from the reviewer — required when status is 'rejected' or 'needs-revision' */
  approvalNote?: string;
  /** Whether this item requires an audit trail entry on transition */
  auditRequired?: boolean;
};

const statusLabel: Record<ItemApprovalStatus, string> = {
  pending: 'بانتظار المراجعة',
  approved: 'معتمد',
  rejected: 'مرفوض',
  'needs-revision': 'يحتاج تعديل',
};

const statusTone: Record<ItemApprovalStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'default',
  approved: 'success',
  rejected: 'danger',
  'needs-revision': 'warning',
};

function mapWorkflowStageToIdentityStatus(stage: ApprovalStage): DshProductIdentityApprovalStatus {
  switch (stage) {
    case 'partner-submitted':
      return 'partner_submitted';
    case 'partner-review':
      return 'partner_review';
    case 'partner-approved':
      return 'partner_approved';
    case 'marketing-review':
      return 'marketing_review';
    case 'marketing-approved':
      return 'marketing_approved';
    case 'catalog-adopted':
      return 'catalog_adopted';
    case 'client-visible':
      return 'client_visible';
    case 'needs-fix':
      return 'needs_fix';
    case 'rejected':
      return 'rejected';
    case 'field-submitted':
    default:
      return 'field_draft';
  }
}

export type ItemApprovalScreenProps = {
  items?: CatalogItemApprovalRecord[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, evidenceNote: string) => void;
  onRequestRevision?: (id: string, evidenceNote: string) => void;
};

export function ItemApprovalScreen({
  items: propsItems,
  onApprove: propsOnApprove,
  onReject: propsOnReject,
  onRequestRevision: propsOnRequestRevision,
}: ItemApprovalScreenProps) {
  const { theme } = useTheme();

  // Connect to the shared global store if no props are provided
  const [records, setRecords] = React.useState<ApprovalRecord[]>([]);
  const refresh = React.useCallback(() => {
    setRecords(getAllApprovalRecords());
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const items = React.useMemo(() => {
    if (propsItems) return propsItems;

    // Map records from the shared workflow SSoT
    return records
      .filter((r) => r.entityType === 'product' || r.entityType === 'product-media' || r.entityType === 'category-suggestion')
      .map((r) => {
        let status: ItemApprovalStatus = 'pending';
        if (r.stage === 'needs-fix') status = 'needs-revision';
        else if (r.stage === 'rejected') status = 'rejected';
        else if (['partner-approved', 'marketing-approved', 'catalog-adopted', 'client-visible'].includes(r.stage)) {
          status = 'approved';
        }

        return {
          id: r.id,
          displayCaption: r.title,
          partnerLabel: r.source === 'app-partner' ? 'تطبيق الشريك' : 'تطبيق الميداني',
          category: r.entityType === 'product' ? 'منتج كتالوج' : r.entityType === 'product-media' ? 'صورة منتج' : 'اقتراح فئة',
          submittedAt: r.submittedAt ? r.submittedAt.split('T')[0] : '2026-05-25',
          status,
          approvalStatus: mapWorkflowStageToIdentityStatus(r.stage),
          approvalNote: r.metadata?.requiredFix || r.metadata?.rejectionReason,
          auditRequired: false,
        } satisfies CatalogItemApprovalRecord;
      });
  }, [records, propsItems]);

  const onApprove = React.useCallback((id: string) => {
    if (propsOnApprove) {
      propsOnApprove(id);
      return;
    }
    // control-panel/catalogs owns catalog adoption — correct owner and stage
    moveApprovalRecordToStage(id, 'catalog-adopted', 'control-panel-catalog', 'اعتماد الكتالوج');
    refresh();
  }, [propsOnApprove, refresh]);

  const onReject = React.useCallback((id: string, evidenceNote: string) => {
    if (propsOnReject) {
      propsOnReject(id, evidenceNote);
      return;
    }
    // control-panel/catalogs owns rejection decisions — correct owner
    moveApprovalRecordToStage(id, 'rejected', 'control-panel-catalog', 'رفض الكتالوج');
    upsertApprovalRecord({ id, metadata: { rejectionReason: evidenceNote } });
    refresh();
  }, [propsOnReject, refresh]);

  const onRequestRevision = React.useCallback((id: string, evidenceNote: string) => {
    if (propsOnRequestRevision) {
      propsOnRequestRevision(id, evidenceNote);
      return;
    }
    // control-panel/catalogs owns revision requests — correct owner
    moveApprovalRecordToStage(id, 'needs-fix', 'control-panel-catalog', 'طلب تعديل الكتالوج');
    upsertApprovalRecord({ id, metadata: { requiredFix: evidenceNote } });
    refresh();
  }, [propsOnRequestRevision, refresh]);

  const pendingCount = items.filter((i) => i.status === 'pending').length;
  // Evidence notes keyed by item id — required for reject/revision actions
  const [evidenceNotes, setEvidenceNotes] = React.useState<Record<string, string>>({});

  function getNote(id: string) {
    return evidenceNotes[id] ?? '';
  }

  function setNote(id: string, value: string) {
    setEvidenceNotes((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <>
      <WebCompactSurfaceHeader
        title="اعتماد عناصر الكتالوج"
        description="مراجعة واعتماد العناصر المقدَّمة من الشركاء قبل نشرها. الرفض والتعديل يتطلبان ملاحظة إثبات."
        metrics={[{ id: 'pending', title: 'بانتظار الاعتماد', value: String(pendingCount) }]}
      />
      <Box gap={2} padding={3} style={{ backgroundColor: theme.surfaceInset }}>
        {items.map((item) => {
          const note = getNote(item.id);
          const canRejectOrRevise = note.trim().length > 0;
          const approvalTone = item.approvalStatus
            ? getDshProductApprovalStatusTone(item.approvalStatus)
            : statusTone[item.status];

          return (
            <Box key={item.id} gap={1}>
              <ListItem
                title={item.displayCaption}
                subtitle={`${item.partnerLabel} · ${item.category} · ${item.submittedAt}`}
                badgeLabel={statusLabel[item.status]}
                badgeTone={approvalTone === 'muted' ? 'default' : approvalTone}
                meta={
                  item.status === 'pending' ? (
                    <Box style={{ flexDirection: 'row', gap: '4px' }}>
                      <Button
                        label="اعتماد"
                        tone="primary"
                        size="sm"
                        onPress={() => onApprove?.(item.id)}
                      />
                    </Box>
                  ) : undefined
                }
              />

              {/* Existing approval note (from previous review) */}
              {item.approvalNote ? (
                <Box style={{ paddingHorizontal: 8 }}>
                  <Text role="caption" tone="warning">{`ملاحظة المراجع: ${item.approvalNote}`}</Text>
                </Box>
              ) : null}

              {/* Audit flag notice */}
              {item.auditRequired ? (
                <Box style={{ paddingHorizontal: 8 }}>
                  <Text role="caption" tone="warning">⚠ هذا الإجراء يستلزم مراجعة من فريق التدقيق.</Text>
                </Box>
              ) : null}

              {/* Evidence note + reject/revision actions for pending items */}
              {item.status === 'pending' ? (
                <Box gap={1} style={{ paddingHorizontal: 8 }}>
                  <TextField
                    label="ملاحظة الإثبات (مطلوبة للرفض أو التعديل)"
                    value={note}
                    onChangeText={(v: string) => setNote(item.id, v)}
                    placeholder="وصف سبب الرفض أو التعديل المطلوب..."
                    multiline
                  />
                  <Box style={{ flexDirection: 'row', gap: '4px' }}>
                    <Button
                      label="طلب تعديل"
                      tone="secondary"
                      size="sm"
                      disabled={!canRejectOrRevise}
                      onPress={canRejectOrRevise ? () => onRequestRevision?.(item.id, note.trim()) : undefined}
                    />
                    <Button
                      label="رفض"
                      tone="danger"
                      size="sm"
                      disabled={!canRejectOrRevise}
                      onPress={canRejectOrRevise ? () => onReject?.(item.id, note.trim()) : undefined}
                    />
                  </Box>
                  {!canRejectOrRevise ? (
                    <Text role="caption" tone="muted">أدخل ملاحظة الإثبات لتفعيل الرفض أو طلب التعديل.</Text>
                  ) : null}
                </Box>
              ) : null}
            </Box>
          );
        })}
        {items.length === 0 ? (
          <Box padding={6} align="center">
            <Text tone="muted">لا توجد عناصر بانتظار الاعتماد.</Text>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

export default ItemApprovalScreen;
