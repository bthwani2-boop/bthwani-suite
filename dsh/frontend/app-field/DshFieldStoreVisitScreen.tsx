import React from 'react';
import {
  Box,
  Button,
  KeyValueList,
  ListItem,
  MobileScrollView,
  SectionHeader,
  StateView,
  Surface,
  Text,
  TextField,
} from '@bthwani/ui-kit';

export type DshFieldStoreVisitState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled';

export type DshFieldVisitEvidenceItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  capturedAtLabel: string;
};

export type DshFieldStoreVisitValues = {
  visitSummary: string;
  followUpAction: string;
};

export type DshFieldStoreVisitErrors = Partial<Record<keyof DshFieldStoreVisitValues, string>>;

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

const demoEvidenceItems: DshFieldVisitEvidenceItem[] = [
  {
    id: 'front-signage-photo',
    title: 'صورة الواجهة',
    subtitle: 'إثبات الزيارة من مدخل المتجر الرئيسي.',
    statusLabel: 'محتفظ به',
    capturedAtLabel: '10:14 ص',
  },
  {
    id: 'owner-availability-note',
    title: 'ملاحظة توافر المالك',
    subtitle: 'تأكيد ساعات العمل والجاهزية للخطوة التالية.',
    statusLabel: 'مسجل',
    capturedAtLabel: '10:19 ص',
  },
];

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
  evidenceItems = demoEvidenceItems,
  onChange,
  onSubmit,
  onOpenEvidence,
  onRetry,
}: DshFieldStoreVisitScreenProps) {
  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry);
  }

  const isDisabled = state === 'disabled';

  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">زيارة المتجر</Text>
        <Text role="bodyMd" tone="muted">
          سجّل ملخص الزيارة وخطوة المتابعة بدل أي log عام غير مرتبط بالسياق.
        </Text>
      </Box>

      <Surface tone="raised" gap={3}>
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
      </Surface>

      <Surface tone="default" gap={3}>
        <SectionHeader
          title="أدلة الزيارة"
          subtitle="كل دليل يبقى قابلًا للفتح دون تحويل الصفحة إلى معرض."
        />
        <Box gap={2}>
          {evidenceItems.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              meta={`تم الالتقاط ${item.capturedAtLabel}`}
              badgeLabel={item.statusLabel}
              onPress={() => onOpenEvidence?.(item.id)}
            />
          ))}
        </Box>
      </Surface>

      <Surface tone="inset" gap={3}>
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
      </Surface>
    </MobileScrollView>
  );
}

export default DshFieldStoreVisitScreen;
