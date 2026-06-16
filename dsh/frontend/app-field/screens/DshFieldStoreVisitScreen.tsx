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
import { resolveDshControlPanelSectionLabel } from '../../shared/control-panel/dsh-governance.map';

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
        title="زيارة المتجر"
        subtitle="سجّل ملخص الزيارة وخطوة المتابعة للمتجر"
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
          {/* Section 1: سياسة الزيارة من السجل */}
          <Box gap={2} paddingY={2}>
            <SectionHeader
              title="سياسة الزيارة من السجل"
              subtitle="الأدلة والوثائق تبقى on-demand، ولا تتحول الشاشة إلى معرض دائم."
            />
            <KeyValueList
              dense
              items={[
                { label: 'المالك', value: visitFlowSummary?.ownerSurface ?? 'app-field', tone: 'brand' },
                { label: 'سياسة الفتح', value: visitFlowSummary?.onDemandPolicy ?? 'evidence-on-open' },
                { label: 'مالك التصعيد', value: resolveDshControlPanelSectionLabel('support') },
              ]}
            />
            <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
              {visitFlowSummary?.nextPolicyActionPreview ?? 'كل دليل يفتح فقط عند اختياره من القائمة.'}
            </Text>
          </Box>

          <Divider />

          {/* Section 2: سياق الزيارة الميدانية */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title="سياق الزيارة الميدانية"
              subtitle="Checklist الجاهزية ودرجة الأدلة ومسودة offline وثقة الموقع تبقى داخل الزيارة نفسها."
            />
            <KeyValueList
              dense
              items={[
                { label: 'visit checklist', value: 'الواجهة · المالك · ساعات العمل · نقطة الاستلام' },
                { label: 'evidence score', value: `${evidenceItems.length}/4`, tone: evidenceItems.length >= 2 ? 'success' : 'warning' },
                { label: 'offline draft', value: 'غير نشط', tone: 'default' as const },
                { label: 'location confidence', value: 'manual confirmation required', tone: 'brand' },
              ]}
            />
          </Box>

          <Divider />

          {/* Section 3: ملخص الزيارة */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title="ملخص الزيارة"
              subtitle="الملخص يجب أن يوضح ما تم التحقق منه وما الذي بقي مفتوحًا."
            />
            <TextField
              label="ملخص الزيارة"
              value={values.visitSummary}
              onChangeText={(value) => onChange('visitSummary', value)}
              editable={!isDisabled}
              error={errors?.visitSummary}
              hint="مثال: تم تأكيد الواجهة والملاك، والمتابعة تنتظر خطوة الاعتماد."
            />
            <TextField
              label="خطوة المتابعة"
              value={values.followUpAction}
              onChangeText={(value) => onChange('followUpAction', value)}
              editable={!isDisabled}
              error={errors?.followUpAction}
              hint="مثال: انتظار اعتماد العرض، أو العودة للتثبيت النهائي، أو تفعيل الاستلام."
            />
          </Box>

          <Divider />

          {/* Section 4: أدلة الزيارة */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title="أدلة الزيارة"
              subtitle="كل دليل يبقى قابلًا للفتح دون تحويل الصفحة إلى معرض."
            />
            <Box gap={0}>
              {evidenceItems.map((item, index) => (
                <View key={item.id}>
                  {index > 0 && <Divider style={{ marginVertical: 8 }} />}
                  <Pressable
                    onPress={() => {
                      setSelectedEvidenceId((current) => (current === item.id ? null : item.id));
                      onOpenEvidence?.(item.id);
                    }}
                  >
                    <Box gap={1} paddingY={2}>
                      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
                          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{item.title}</Text>
                          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{item.subtitle}</Text>
                          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{`تم الالتقاط ${item.capturedAtLabel}`}</Text>
                        </View>
                        {item.statusLabel ? (
                          <Badge label={item.statusLabel} tone="brand" />
                        ) : null}
                      </View>
                    </Box>
                  </Pressable>
                </View>
              ))}
            </Box>
          </Box>

          {selectedEvidenceItem ? (
            <>
              <Divider />
              <Box gap={2} paddingY={2}>
                <SectionHeader
                  title="تفاصيل الدليل المفتوح"
                  subtitle="هذا الجزء يظهر فقط بعد اختيار دليل محدد من القائمة."
                />
                <KeyValueList
                  dense
                  items={[
                    { label: 'العنصر', value: selectedEvidenceItem.title, tone: 'brand' },
                    { label: 'الحالة', value: selectedEvidenceItem.statusLabel },
                    { label: 'وقت الالتقاط', value: selectedEvidenceItem.capturedAtLabel },
                  ]}
                />
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  {selectedEvidenceItem.subtitle}
                </Text>
                <Button label="إغلاق الدليل" tone="secondary" onPress={() => setSelectedEvidenceId(null)} />
              </Box>
            </>
          ) : null}

          <Divider />

          {/* Section 5: التقاط أدلة الزيارة */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title="التقاط أدلة الزيارة"
              subtitle="رفع الصور معلق حتى تُثبَت واجهة برمجة رفع الملفات. الأزرار ستصبح نشطة عند توفر العقد."
            />
            <VisitEvidenceSection sectionState="ready" />
          </Box>

          <Divider />

          {/* Section 6: إغلاق الزيارة */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title="إغلاق الزيارة"
              subtitle="يجب أن تبقى الخطوة التالية واضحة وقابلة للمساءلة."
            />
            <KeyValueList
              items={[
                { label: 'CTA الأساسي', value: 'إرسال الزيارة' },
                { label: 'عدد الأدلة', value: String(evidenceItems.length) },
                { label: 'الخطوة التالية', value: values.followUpAction || 'قيد التحديد', tone: 'brand' },
              ]}
            />
            <Button label="إرسال الزيارة" onPress={onSubmit} disabled={isDisabled} />
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
