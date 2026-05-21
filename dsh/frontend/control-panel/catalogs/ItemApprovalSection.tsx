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

type ItemApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-revision';

type CatalogItemApprovalRecord = {
  id: string;
  title: string;
  partnerName: string;
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

const statusTone: Record<ItemApprovalStatus, 'default' | 'success' | 'danger' | 'warning'> = {
  pending: 'default',
  approved: 'success',
  rejected: 'danger',
  'needs-revision': 'warning',
};

const demoItems: CatalogItemApprovalRecord[] = [
  {
    id: 'item-001',
    title: 'برجر دجاج مقرمش',
    partnerName: 'مطعم النجوم',
    category: 'وجبات رئيسية',
    submittedAt: '2026-05-15',
    status: 'pending',
    approvalStatus: 'partner_review',
    auditRequired: false,
  },
  {
    id: 'item-002',
    title: 'بيتزا مارجريتا',
    partnerName: 'مطبخ البيت',
    category: 'بيتزا',
    submittedAt: '2026-05-14',
    status: 'needs-revision',
    approvalStatus: 'needs_fix',
    approvalNote: 'يرجى تحديث صورة المنتج بدقة أعلى وإرفاق وصف موحد.',
    auditRequired: false,
  },
  {
    id: 'item-003',
    title: 'سلطة سيزر',
    partnerName: 'كافيه الصحة',
    category: 'سلطات',
    submittedAt: '2026-05-13',
    status: 'approved',
    approvalStatus: 'partner_approved',
    auditRequired: false,
  },
];

export type ItemApprovalSectionProps = {
  items?: CatalogItemApprovalRecord[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, evidenceNote: string) => void;
  onRequestRevision?: (id: string, evidenceNote: string) => void;
};

export function ItemApprovalSection({
  items = demoItems,
  onApprove,
  onReject,
  onRequestRevision,
}: ItemApprovalSectionProps) {
  const { theme } = useTheme();
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
                title={item.title}
                subtitle={`${item.partnerName} · ${item.category} · ${item.submittedAt}`}
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

export default ItemApprovalSection;
