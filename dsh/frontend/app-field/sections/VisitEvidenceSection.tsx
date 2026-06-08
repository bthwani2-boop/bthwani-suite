// ML-003: Field visit evidence capture section — used within DshFieldStoreVisitScreen
import React from 'react';
import {
  Box,
  Button,
  SectionHeader,
  StateView,
  Text,
  useTheme,
  useDirection,
} from '@bthwani/ui-kit';

type EvidenceItemState = 'pending' | 'captured' | 'uploading' | 'confirmed';

type VisitEvidenceItem = {
  id: string;
  label: string;
  required: boolean;
  state: EvidenceItemState;
};

const defaultItems: readonly VisitEvidenceItem[] = [
  { id: 'store-front-photo', label: 'صورة واجهة المتجر', required: true, state: 'pending' },
  { id: 'interior-photo', label: 'صورة داخل المتجر', required: true, state: 'pending' },
  { id: 'signage-photo', label: 'صورة اللافتة', required: false, state: 'pending' },
];

const stateLabel: Record<EvidenceItemState, string> = {
  pending: 'في الانتظار',
  captured: 'تم الالتقاط',
  uploading: 'جاري الرفع',
  confirmed: 'مؤكد',
};

export type VisitEvidenceSectionProps = {
  sectionState?: 'ready' | 'uploading' | 'complete' | 'error';
  items?: readonly VisitEvidenceItem[];
  onCapturePhoto?: (itemId: string) => void;
  onConfirmEvidence?: () => void;
  onRetry?: () => void;
};

export function VisitEvidenceSection({
  sectionState = 'ready',
  items = defaultItems,
  onCapturePhoto,
  onConfirmEvidence,
  onRetry,
}: VisitEvidenceSectionProps) {
  const { theme } = useTheme();
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  if (sectionState === 'uploading') {
    return <StateView stateId="loading" title="جاري رفع الأدلة..." description="يُرجى الانتظار حتى اكتمال رفع صور الزيارة." />;
  }

  if (sectionState === 'complete') {
    return (
      <StateView
        stateId="success"
        title="تم تأكيد أدلة الزيارة"
        description="تم رفع جميع الصور المطلوبة بنجاح."
      />
    );
  }

  if (sectionState === 'error') {
    return (
      <StateView
        stateId="error"
        title="فشل رفع الأدلة"
        description="تعذّر رفع بعض الصور. يُرجى المحاولة مجدداً."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  const allRequiredCaptured = items.filter((i) => i.required).every((i) => i.state === 'captured' || i.state === 'confirmed');
  const canCapturePhoto = typeof onCapturePhoto === 'function';
  const canConfirmEvidence = typeof onConfirmEvidence === 'function';

  return (
    <Box gap={4}>
      <SectionHeader title="أدلة الزيارة الميدانية" />
      <Box gap={0}>
        {items.map((item) => (
          <Box
            key={item.id}
            paddingVertical={3}
            style={{
              flexDirection: isRtl ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: theme.line,
            }}
          >
            <Box gap={0} style={{ alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
              <Text role="bodyMd" style={{ textAlign: isRtl ? 'right' : 'left' }}>{item.label}</Text>
              <Text role="bodySm" tone={item.required ? 'danger' : 'muted'} style={{ textAlign: isRtl ? 'right' : 'left' }}>
                {item.required ? 'مطلوب' : 'اختياري'} · {stateLabel[item.state]}
              </Text>
            </Box>
            {(item.state === 'pending' || item.state === 'captured') && (
              <Button
                label={item.state === 'captured' ? 'إعادة الالتقاط' : 'التقاط صورة'}
                size="sm"
                tone={item.state === 'captured' ? 'secondary' : 'primary'}
                fullWidth={false}
                disabled={!canCapturePhoto}
                onPress={() => onCapturePhoto?.(item.id)}
              />
            )}
          </Box>
        ))}
      </Box>
      <Button
        label="تأكيد الأدلة"
        disabled={!allRequiredCaptured || !canConfirmEvidence}
        onPress={onConfirmEvidence}
      />
    </Box>
  );
}

export default VisitEvidenceSection;
