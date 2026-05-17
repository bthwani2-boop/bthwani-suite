// ML-002: Field document verification section skeleton — used within DshFieldStoreOnboardingScreen
// BLOCKED_BY_CONTRACT: implement document capture and upload when upload API contract is proven
import React from 'react';
import {
  Box,
  Button,
  StateView,
  Text,
} from '@bthwani/ui-kit';

type DocumentKind = 'commercial_registration' | 'id_card' | 'trade_license' | 'other';

type DocumentItem = {
  id: DocumentKind;
  label: string;
  required: boolean;
  uploaded: boolean;
};

const defaultDocuments: readonly DocumentItem[] = [
  { id: 'commercial_registration', label: 'السجل التجاري', required: true, uploaded: false },
  { id: 'id_card', label: 'الهوية الوطنية', required: true, uploaded: false },
  { id: 'trade_license', label: 'رخصة التجارة', required: false, uploaded: false },
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

  const allRequired = documents.filter((d) => d.required).every((d) => d.uploaded);

  return (
    <Box gap={4}>
      <Text role="titleSm">التحقق من المستندات</Text>
      <Box gap={2}>
        {documents.map((doc) => (
          <Box key={doc.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} padding={3} background="surfaceRaised" radiusToken="md">
            <Box gap={0}>
              <Text role="bodyMd">{doc.label}</Text>
              {doc.required && <Text role="bodySm" tone="danger">مطلوب</Text>}
            </Box>
            {doc.uploaded ? (
              <Text role="bodySm" tone="success">تم الرفع</Text>
            ) : (
              <Button label="رفع" size="sm" fullWidth={false} onPress={() => onUploadDocument?.(doc.id)} />
            )}
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
