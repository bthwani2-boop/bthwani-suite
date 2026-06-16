import React from 'react';
import { Pressable, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Divider,
  Icon,
  KeyValueList,
  MobileScrollView,
  SectionHeader,
  StateView,
  Text,
  TextField,
  TopBar,
  useTheme,
  useDirection,
} from '@bthwani/ui-kit';


import {
  dshFieldVisitContractMeta,
  type DshFieldVisitEvidenceItem,
  type DshFieldStoreVisitValues,
  type DshFieldStoreVisitErrors,
  type DshFieldStoreVisitState,
} from '../dsh-field.routes';
import { getDshFlowPolicySummary } from '../../shared/runtime/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../control-panel/shared/dsh-control-panel-governance.map';

export type {
  DshFieldStoreVisitErrors,
  DshFieldStoreVisitState,
  DshFieldStoreVisitValues,
  DshFieldVisitEvidenceItem,
};

export type DshFieldStoreVisitScreenProps = {
  state?: DshFieldStoreVisitState;
  values: DshFieldStoreVisitValues;
  errors?: DshFieldStoreVisitErrors;
  evidenceItems?: readonly DshFieldVisitEvidenceItem[];
  onChange: (field: keyof DshFieldStoreVisitValues, value: string) => void;
  onSubmit?: () => void;
  onOpenEvidence?: (evidenceId: string) => void;
  onRetry?: () => void;
};

function renderState(state: Exclude<DshFieldStoreVisitState, 'ready' | 'disabled'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="لا توجد زيارة مسجلة بعد"
        description="سجّل أول ملاحظة أو دليل حتى تُغلق الزيارة بشكل قابل للمراجعة."
        actionLabel={onRetry ? 'بدء الزيارة' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <StateView
        stateId="offline"
        title="مزامنة الزيارة متوقفة مؤقتًا"
        description="أبقِ الأدلة ظاهرة وأعد المحاولة عند عودة الاتصال."
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <StateView
        stateId="success"
        title="تم إرسال الزيارة"
        description="الزيارة الآن تحتوي على دليل واضح وخطوة متابعة محددة."
        actionLabel={onRetry ? 'العودة إلى الميدان' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  return (
    <StateView
      stateId="recoverableError"
      title="تعذر إرسال الزيارة"
      description="أعد المحاولة أو صحّح الملخص بدون فقدان قائمة الأدلة."
      onActionPress={onRetry}
    />
  );
}

export function DshFieldStoreVisitScreen({
  state = 'ready',
  values,
  errors,
  evidenceItems = [],
  onChange,
  onSubmit,
  onOpenEvidence,
  onRetry,
}: DshFieldStoreVisitScreenProps) {
  const { theme } = useTheme();
  const visitFlowSummary = getDshFlowPolicySummary('field-store-visit');
  const [selectedEvidenceId, setSelectedEvidenceId] = React.useState<string | null>(null);

  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry);
  }

  const isDisabled = state === 'disabled';
  const selectedEvidenceItem = selectedEvidenceId
    ? evidenceItems.find((item) => item.id === selectedEvidenceId) ?? null
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="متابعة المتجر"
        subtitle="سجّل ملخص المتابعة للمتجر"
        trailingAction={
          onRetry
            ? {
                id: 'back',
                icon: <Icon name="arrow-back" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'رجوع',
                onPress: onRetry,
              }
            : undefined
        }
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 120 }}>
        <Box padding={4} gap={4}>
          {/* Section: ملخص المتابعة */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title="ملاحظات المتابعة"
              subtitle="اكتب ملخصًا لما تم خلال هذه المتابعة."
            />
            <TextField
              label="ملخص المتابعة"
              value={values.visitSummary}
              onChangeText={(value) => onChange('visitSummary', value)}
              editable={!isDisabled}
              error={errors?.visitSummary}
              hint="مثال: تم التنسيق مع الشريك وبانتظار الموافقة النهائية."
            />
          </Box>

          <Divider />

          {/* Section: حفظ المتابعة */}
          <Box gap={3} paddingY={2}>
            <Button label="حفظ المتابعة" onPress={onSubmit} disabled={isDisabled} />
          </Box>
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default DshFieldStoreVisitScreen;

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
        stateId="recoverableError"
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
            paddingY={3}
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
