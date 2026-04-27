'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CompactStatusStepper,
  KeyValueList,
  StatCard,
  StateView,
  StickyActionBar,
  Tabs,
  Text,
  TextField,
} from '@bthwani/ui-kit';
import {
  WebPageFrame,
  WebSectionCard,
} from '@bthwani/ui-kit/web';
import { useDshControlPanelText } from '../shared/dshControlPanelText';

type AssignmentFamily = 'shein' | 'awnak' | 'generic';
type AssignmentMode = 'now' | 'scheduled';
type AssignmentStage = 'detail' | 'estimate' | 'offer' | 'schedule';
type ManualAssignmentScreenState = 'ready' | 'loading' | 'empty' | 'offline' | 'disabled' | 'error';

export type ControlPanelDshSheinProxyRequestScreenProps = {
  requestId: string;
  stage: AssignmentStage;
  state?: ManualAssignmentScreenState;
  listHref?: string;
  hubHref?: string;
  operationsHref?: string;
  supportHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

const familyOptions: Array<{ value: AssignmentFamily; label: string; description: string }> = [
  { value: 'shein', label: 'SHEIN', description: 'منصة شراء وتجميع تابعة للمنصة نفسها.' },
  { value: 'awnak', label: 'عونك', description: 'توصيل يدوي عام من العمليات.' },
  { value: 'generic', label: 'أخرى', description: 'قالب عام لأي فئة جديدة لاحقًا.' },
];

const modeOptions: Array<{ value: AssignmentMode; label: string }> = [
  { value: 'now', label: 'الآن' },
  { value: 'scheduled', label: 'لاحقًا' },
];

const stageSteps: Array<{ id: string; label: string; state: 'complete' | 'current' | 'pending' }> = [
  { id: 'detail', label: 'التفاصيل', state: 'current' },
  { id: 'estimate', label: 'التقدير', state: 'pending' },
  { id: 'offer', label: 'العرض', state: 'pending' },
  { id: 'schedule', label: 'الجدولة', state: 'pending' },
];

function resolveStepperState(currentStage: AssignmentStage) {
  const stages: AssignmentStage[] = ['detail', 'estimate', 'offer', 'schedule'];
  const currentIndex = stages.indexOf(currentStage);
  return stages.map((stage, index) => {
    if (index < currentIndex) return { id: stage, label: stageSteps[index].label, state: 'complete' as const };
    if (index === currentIndex) return { id: stage, label: stageSteps[index].label, state: 'current' as const };
    return { id: stage, label: stageSteps[index].label, state: 'pending' as const };
  });
}

function resolveStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<ManualAssignmentScreenState, 'ready'>,
) {
  if (state === 'loading')
    return { stateId: 'loading' as const, title: text.sheinProxy.stateLoadingTitle, description: text.sheinProxy.stateLoadingDescription, actionLabel: text.sheinProxy.retryLabel };
  if (state === 'empty')
    return { stateId: 'empty' as const, title: text.sheinProxy.stateEmptyTitle, description: text.sheinProxy.stateEmptyDescription, actionLabel: text.sheinProxy.backToHub };
  if (state === 'offline')
    return { stateId: 'offline' as const, title: text.sheinProxy.stateOfflineTitle, description: text.sheinProxy.stateOfflineDescription, actionLabel: text.sheinProxy.retryLabel };
  if (state === 'disabled')
    return { kind: 'warning' as const, title: text.sheinProxy.stateDisabledTitle, description: text.sheinProxy.stateDisabledDescription, actionLabel: text.sheinProxy.backToHub };
  return { stateId: 'recoverableError' as const, title: text.sheinProxy.stateErrorTitle, description: text.sheinProxy.stateErrorDescription, actionLabel: text.sheinProxy.retryLabel };
}

function resolveStageMeta(stage: AssignmentStage) {
  if (stage === 'estimate') return { label: 'التقدير', description: 'راجع افتراضات التكلفة قبل الإسناد.' };
  if (stage === 'offer') return { label: 'العرض', description: 'الدفعة جاهزة للتأكيد أو المراجعة.' };
  if (stage === 'schedule') return { label: 'الجدولة', description: 'ثبّت نافذة الاستلام أو التسليم.' };
  return { label: 'التفاصيل', description: 'راجع حمولة الإسناد ونطاق المسار.' };
}

export function ControlPanelDshSheinProxyRequestScreen({
  requestId,
  stage,
  state = 'ready',
  listHref = '/operations/dsh/sheinproxy',
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
  supportHref = '/support',
  embedded = false,
  showHeader = true,
}: ControlPanelDshSheinProxyRequestScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const [family, setFamily] = React.useState<AssignmentFamily>('shein');
  const [assignmentReference, setAssignmentReference] = React.useState(requestId);
  const [pickupNode, setPickupNode] = React.useState('Operations intake');
  const [dropoffNode, setDropoffNode] = React.useState('Customer delivery route');
  const [customerCount, setCustomerCount] = React.useState('1');
  const [captainCount, setCaptainCount] = React.useState('1');
  const [mode, setMode] = React.useState<AssignmentMode>(stage === 'schedule' ? 'scheduled' : 'now');
  const [scheduleDate, setScheduleDate] = React.useState('');
  const [scheduleTime, setScheduleTime] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [draftSaved, setDraftSaved] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const stageMeta = resolveStageMeta(stage);
  const resolvedState = state;
  const stepperItems = resolveStepperState(stage);

  const isFormValid = React.useMemo(() => {
    const normalizedReference = assignmentReference.trim();
    const normalizedPickup = pickupNode.trim();
    const normalizedDropoff = dropoffNode.trim();
    const parsedCustomers = Number(customerCount.trim());
    const parsedCaptains = Number(captainCount.trim());
    if (!normalizedReference || !normalizedPickup || !normalizedDropoff) return false;
    if (Number.isNaN(parsedCustomers) || parsedCustomers < 1) return false;
    if (Number.isNaN(parsedCaptains) || parsedCaptains < 1) return false;
    if (mode === 'scheduled' && (!scheduleDate.trim() || !scheduleTime.trim())) return false;
    return true;
  }, [assignmentReference, pickupNode, dropoffNode, customerCount, captainCount, mode, scheduleDate, scheduleTime]);

  const validate = () => {
    const normalizedReference = assignmentReference.trim();
    const normalizedPickup = pickupNode.trim();
    const normalizedDropoff = dropoffNode.trim();
    const parsedCustomers = Number(customerCount.trim());
    const parsedCaptains = Number(captainCount.trim());
    if (!normalizedReference || !normalizedPickup || !normalizedDropoff) {
      setValidationError('املأ المرجع ونقطة الاستلام ونقطة التسليم أولًا.');
      return false;
    }
    if (Number.isNaN(parsedCustomers) || parsedCustomers < 1) {
      setValidationError('عدد العملاء يجب أن يكون رقمًا يبدأ من 1.');
      return false;
    }
    if (Number.isNaN(parsedCaptains) || parsedCaptains < 1) {
      setValidationError('عدد الكباتن يجب أن يكون رقمًا يبدأ من 1.');
      return false;
    }
    if (mode === 'scheduled' && (!scheduleDate.trim() || !scheduleTime.trim())) {
      setValidationError('اختر التاريخ والوقت عند التنفيذ لاحقًا.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSaveDraft = () => {
    if (!assignmentReference.trim()) {
      setValidationError('أضف مرجعًا للاستمارة قبل الحفظ.');
      return;
    }
    setValidationError(null);
    setDraftSaved(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
  };

  const summaryItems = [
    { label: 'الفئة', value: family.toUpperCase() },
    { label: 'المرجع', value: assignmentReference || 'قيد الانتظار' },
    { label: 'العملاء', value: customerCount },
    { label: 'الكباتن', value: captainCount },
    { label: 'النمط', value: mode === 'now' ? 'الآن' : 'مجدول' },
    { label: 'الخطوة', value: stageMeta.label },
  ];

  const primaryAction = {
    label: 'إسناد الآن',
    tone: 'primary' as const,
    onPress: handleSubmit,
    disabled: !isFormValid,
  };
  const secondaryAction = {
    label: 'حفظ مسودة',
    tone: 'ghost' as const,
    onPress: handleSaveDraft,
    disabled: !assignmentReference.trim(),
  };

  if (resolvedState !== 'ready') {
    return (
      <WebPageFrame
        eyebrow={dshText.sheinProxy.pageEyebrow}
        title={dshText.sheinProxy.pageTitle}
        description={dshText.sheinProxy.pageDescription}
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <StateView
          {...resolveStateCopy(dshText, resolvedState)}
          onActionPress={() => {
            if (resolvedState === 'loading' || resolvedState === 'offline' || resolvedState === 'error') { router.refresh(); return; }
            router.push(listHref);
          }}
        />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame
      eyebrow={dshText.sheinProxy.pageEyebrow}
      title={dshText.sheinProxy.pageTitle}
      description={dshText.sheinProxy.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div style={{ display: 'grid', gap: '20px', direction: 'rtl', textAlign: 'right' }}>
        {/* ===== Context Summary Bar ===== */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: '16px', padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(10,47,92,0.04) 0%, rgba(255,80,13,0.03) 100%)',
          border: '1px solid rgba(10,47,92,0.08)', borderRadius: '16px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0, flex: 1 }}>
            <Text role="caption" tone="brand">{dshText.sheinProxy.heroEyebrow}</Text>
            <Text role="titleSm">{dshText.sheinProxy.heroTitle}</Text>
            <Text role="bodySm" tone="muted">{stageMeta.description}</Text>
            <Text role="caption" tone="soft">{family.toUpperCase()} · {stageMeta.label} · {requestId}</Text>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Button label={dshText.sheinProxy.backToList} tone="ghost" size="sm" fullWidth={false} onPress={() => router.push(listHref)} />
            <Button label={dshText.common.openGeneralOperations} tone="secondary" size="sm" fullWidth={false} onPress={() => router.push(operationsHref)} />
          </div>
        </div>

        {/* ===== Operational Metrics ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <StatCard label="الفئات" value="3" deltaLabel="SHEIN، عونك، وأخرى" tone="brand" />
          <StatCard label="العملاء" value={customerCount || '1'} deltaLabel="عدد العملاء في الدفعة" tone="success" />
          <StatCard label="الكباتن" value={captainCount || '1'} deltaLabel="عدد الكباتن المخصصين" tone="info" />
          <StatCard label="الخطوة" value={stageMeta.label} deltaLabel={stageMeta.description} tone="warning" />
        </div>

        {/* ===== Assignment Progress ===== */}
        <WebSectionCard title="تقدم الإسناد" description={`الخطوة الحالية: ${stageMeta.label}`}>
          <CompactStatusStepper steps={stepperItems} activeStepId={stage} />
        </WebSectionCard>

        {/* ===== Assignment Identity ===== */}
        <WebSectionCard title="هوية الإسناد" description="اختر الفئة وأعطِ الدفعة مرجعًا ثابتًا.">
          <Box gap={3}>
            <Tabs<AssignmentFamily> items={familyOptions} value={family} onValueChange={(value) => setFamily(value)} variant="pill" />
            <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
              <Box style={{ flex: 1, minWidth: 240 }}>
                <TextField label="مرجع الإسناد" value={assignmentReference} onChangeText={setAssignmentReference} placeholder="DSH-ASSIGN-0001" />
              </Box>
              <Box style={{ flex: 1, minWidth: 240 }}>
                <TextField label="نقطة الاستلام" value={pickupNode} onChangeText={setPickupNode} placeholder="مدخل العمليات / المركز" />
              </Box>
              <Box style={{ flex: 1, minWidth: 240 }}>
                <TextField label="نقطة التسليم" value={dropoffNode} onChangeText={setDropoffNode} placeholder="مسار توصيل العملاء" />
              </Box>
            </Box>
          </Box>
        </WebSectionCard>

        {/* ===== Batch Planning ===== */}
        <WebSectionCard title="تخطيط الدفعة" description="خطط لتجميع العملاء وتخصيص الكباتن قبل إرسال الإسناد.">
          <Box gap={3}>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <Box style={{ flex: 1, minWidth: 180 }}>
                <TextField label="عدد العملاء" value={customerCount} onChangeText={setCustomerCount} keyboardType="number-pad" placeholder="1" />
              </Box>
              <Box style={{ flex: 1, minWidth: 180 }}>
                <TextField label="عدد الكباتن" value={captainCount} onChangeText={setCaptainCount} keyboardType="number-pad" placeholder="1" />
              </Box>
            </Box>
            <Tabs<AssignmentMode> items={modeOptions} value={mode} onValueChange={(value) => setMode(value)} variant="pill" />
            {mode === 'scheduled' ? (
              <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <Box style={{ flex: 1, minWidth: 180 }}>
                  <TextField label="التاريخ" value={scheduleDate} onChangeText={setScheduleDate} placeholder="YYYY-MM-DD" />
                </Box>
                <Box style={{ flex: 1, minWidth: 180 }}>
                  <TextField label="الوقت" value={scheduleTime} onChangeText={setScheduleTime} placeholder="HH:MM" />
                </Box>
              </Box>
            ) : null}
          </Box>
        </WebSectionCard>

        {/* ===== Operational Notes ===== */}
        <WebSectionCard title="ملاحظات تشغيلية" description="استخدم هذا الحقل لتعليمات الترتيب، التعبئة، المسار، أو المعالجة الخاصة.">
          <Box gap={2}>
            <TextField label="الملاحظات" value={notes} onChangeText={setNotes} placeholder="تعليمات الترتيب، التعبئة، المسار، أو التسليم" />
            {validationError ? <Text role="bodySm" tone="danger">{validationError}</Text> : null}
            {draftSaved ? <Text role="bodySm" tone="success">تم حفظ المسودة محليًا لهذا الإسناد اليدوي.</Text> : null}
            {submitted ? <Text role="bodySm" tone="success">الإسناد جاهز للخطوة التشغيلية التالية.</Text> : null}
          </Box>
        </WebSectionCard>

        {/* ===== Assignment Preview ===== */}
        <WebSectionCard title="معاينة الإسناد" description="المعاينة تحافظ على أهم الحقائق التشغيلية مرئية بدون تكرار الاستمارة.">
          <Box gap={2}>
            <Card><KeyValueList items={summaryItems} /></Card>
            <Card>
              <Box gap={2}>
                <Text role="bodyStrong">لا يوجد مسار شريك</Text>
                <Text role="bodySm" tone="muted">الفئات المملوكة للمنصة تُشترى وتُرتب وتُسلم من قبل المنصة نفسها.</Text>
                <Text role="bodySm" tone="muted">الكابتن سيرى لاحقًا مسار دفعة، لا هوية شريك.</Text>
              </Box>
            </Card>
          </Box>
        </WebSectionCard>

        {/* ===== Sticky Action Bar ===== */}
        <StickyActionBar
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          note={
            validationError ?? (draftSaved ? 'تم حفظ المسودة محليًا لهذا الإسناد اليدوي.' : submitted ? 'الإسناد جاهز للخطوة التشغيلية التالية.' : undefined)
          }
        />
      </div>
    </WebPageFrame>
  );
}

export default ControlPanelDshSheinProxyRequestScreen;