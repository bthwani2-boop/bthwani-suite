// ML-002: Field document verification section skeleton — used within DshFieldStoreOnboardingScreen
// BLOCKED_BY_CONTRACT: implement document capture and upload when upload API contract is proven
import React from 'react';
import {
  Box,
  Button,
  StateView,
  Text,
} from '@bthwani/ui-kit';
import type { FieldDocumentPreviewStatus } from '../../data/field-stores.preview-data';

type DocumentKind = 'commercial_registration' | 'id_card' | 'trade_license' | 'other';

type DocumentItem = {
  id: DocumentKind;
  label: string;
  required: boolean;
  status: FieldDocumentPreviewStatus;
  referenceLabel?: string;
};

const defaultDocuments: readonly DocumentItem[] = [
  { id: 'commercial_registration', label: 'السجل التجاري', required: true, status: 'missing' },
  { id: 'id_card', label: 'الهوية الوطنية', required: true, status: 'missing' },
  { id: 'trade_license', label: 'رخصة التجارة', required: false, status: 'missing' },
];

export type DocumentVerificationSectionProps = {
  state?: 'ready' | 'loading' | 'complete' | 'error';
  documents?: readonly DocumentItem[];
  onUploadDocument?: (kind: DocumentKind) => void;
  onConfirm?: () => void;
};

export function DocumentVerificationSection({
  state = 'ready',
  documents = defaultDocuments,
  onUploadDocument,
  onConfirm,
}: DocumentVerificationSectionProps) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جاري التحقق من المستندات..." description="" />;
  }

  if (state === 'complete') {
    return (
      <StateView
        stateId="success"
        title="تم التحقق من جميع المستندات"
        description="يمكن المتابعة لإكمال تسجيل المتجر."
        actionLabel="التالي"
        onActionPress={onConfirm}
      />
    );
  }

  const allRequired = documents
    .filter((d) => d.required)
    .every((d) => d.status === 'uploaded' || d.status === 'approved');

  const resolveStatusTone = (status: FieldDocumentPreviewStatus) => {
    if (status === 'approved') return 'success' as const;
    if (status === 'uploaded') return 'brand' as const;
    if (status === 'needs_reupload') return 'warning' as const;
    if (status === 'rejected') return 'danger' as const;
    return 'muted' as const;
  };

  const resolveStatusLabel = (status: FieldDocumentPreviewStatus) => {
    if (status === 'approved') return 'معتمد';
    if (status === 'uploaded') return 'مرفوع';
    if (status === 'needs_reupload') return 'يحتاج إعادة رفع';
    if (status === 'rejected') return 'مرفوض';
    return 'مفقود';
  };

  return (
    <Box gap={4}>
      <Text role="titleSm">التحقق من المستندات</Text>
      <Text role="caption" tone="muted">المراجع والحالات هنا preview-only؛ قرار الاعتماد النهائي يبقى لدى control-panel/partners.</Text>
      <Box gap={2}>
        {documents.map((doc) => (
          <Box key={doc.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} padding={3} background="surfaceRaised" radiusToken="md">
            <Box gap={0}>
              <Text role="bodyMd">{doc.label}</Text>
              {doc.required && <Text role="bodySm" tone="danger">مطلوب</Text>}
              {doc.referenceLabel ? <Text role="caption" tone="muted">{doc.referenceLabel}</Text> : null}
            </Box>
            <Box gap={1} style={{ alignItems: 'flex-end' }}>
              <Text role="bodySm" tone={resolveStatusTone(doc.status)}>{resolveStatusLabel(doc.status)}</Text>
              <Button
                label={doc.status === 'missing' ? 'رفع' : 'تحديث'}
                size="sm"
                fullWidth={false}
                disabled={!onUploadDocument}
                onPress={() => onUploadDocument?.(doc.id)}
              />
            </Box>
          </Box>
        ))}
      </Box>
      <Button
        label="تأكيد المستندات"
        disabled={!allRequired}
        onPress={onConfirm}
      />
    </Box>
  );
}

export default DocumentVerificationSection;
