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

import type {
  DshFieldStoreVisitErrors,
  DshFieldStoreVisitState,
  DshFieldStoreVisitValues,
  DshFieldVisitEvidenceItem,
} from '../types/DshFieldStoreVisitTypes';
import { VisitEvidenceSection } from '../sections/VisitEvidenceSection';
import { getDshFlowPolicySummary } from '../../shared/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared';

export type {
  DshFieldStoreVisitErrors,
  DshFieldStoreVisitState,
  DshFieldStoreVisitValues,
  DshFieldVisitEvidenceItem,
} from '../types/DshFieldStoreVisitTypes';

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
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">زيارة المتجر</Text>
        <Text role="bodyMd" tone="muted">
          سجّل ملخص الزيارة وخطوة المتابعة بدل أي log عام غير مرتبط بالسياق.
        </Text>
      </Box>

      <Surface tone="inset" gap={2}>
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
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="سياق الزيارة الميدانية"
          subtitle="Checklist الجاهزية ودرجة الأدلة ومسودة offline وثقة الموقع تبقى داخل الزيارة نفسها."
        />
        <KeyValueList
          dense
          items={[
            { label: 'visit checklist', value: 'الواجهة · المالك · ساعات العمل · نقطة الاستلام' },
            { label: 'evidence score', value: `${evidenceItems.length}/4`, tone: evidenceItems.length >= 2 ? 'success' : 'warning' },
            { label: 'offline draft', value: state === 'offline' ? 'مسودة محلية' : 'غير نشط', tone: state === 'offline' ? 'warning' : 'default' },
            { label: 'location confidence', value: 'manual confirmation required', tone: 'brand' },
          ]}
        />
      </Surface>

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
              onPress={() => {
                setSelectedEvidenceId((current) => (current === item.id ? null : item.id));
                onOpenEvidence?.(item.id);
              }}
            />
          ))}
        </Box>
      </Surface>

      {selectedEvidenceItem ? (
        <Surface tone="inset" gap={2}>
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
        </Surface>
      ) : null}

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="التقاط أدلة الزيارة"
          subtitle="رفع الصور معلق حتى تُثبَت واجهة برمجة رفع الملفات. الأزرار ستصبح نشطة عند توفر العقد."
        />
        <VisitEvidenceSection sectionState="ready" />
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
