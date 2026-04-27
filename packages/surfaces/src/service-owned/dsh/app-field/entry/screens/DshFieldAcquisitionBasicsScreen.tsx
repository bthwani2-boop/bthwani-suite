import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Card,
  Chip,
  CompactStatusStepper,
  KeyValueList,
  ListItem,
  MobileScrollView,
  StateView,
  StickyActionBar,
  Text,
  TextField,
  useTheme,
} from '@bthwani/ui-kit';
import type { CompactStatusStep } from '@bthwani/ui-kit';

export type DshEntryScreenState = 'ready' | 'loading' | 'empty' | 'offline' | 'error' | 'disabled' | 'submitted';

export type DshEntryScreenProps = {
  state?: DshEntryScreenState;
  title?: string;
  subtitle?: string;
  onOpenActivationPress?: () => void;
  onOpenGeoPinPress?: () => void;
  onOpenVisitLogPress?: () => void;
  onOpenInventoryPress?: () => void;
  onRetry?: () => void;
};

type LeadSource = 'candidate' | 'manual';
type LeadStatus =
  | 'new-lead'
  | 'visit-planned'
  | 'offer-pending-approval'
  | 'offer-approved'
  | 'appointment-scheduled'
  | 'visited'
  | 'follow-up-required'
  | 'ready-for-onboarding'
  | 'submitted';
type LeadFilter = 'all' | 'approval-pending' | 'follow-up' | 'ready' | 'submitted';
type WorkspaceMode = 'quick' | 'full';
type LeadResult = 'interested' | 'follow-up' | 'not-interested' | 'not-suitable' | 'ready-for-onboarding';

type LeadRecord = {
  id: string;
  source: LeadSource;
  name: string;
  category: string;
  location: string;
  status: LeadStatus;
  nextVisitLabel: string;
  visitPurpose: string;
  proposedOffer: string;
  approvalNote: string;
  resultNote: string;
  followUpLabel: string;
  onboardingNote: string;
  visitResult: LeadResult | null;
};

const leadStatusLabels: Record<LeadStatus, string> = {
  'new-lead': 'New Lead',
  'visit-planned': 'Visit Planned',
  'offer-pending-approval': 'Offer Pending Approval',
  'offer-approved': 'Offer Approved',
  'appointment-scheduled': 'Appointment Scheduled',
  visited: 'Visited',
  'follow-up-required': 'Follow-up Required',
  'ready-for-onboarding': 'Ready for Onboarding',
  submitted: 'Submitted',
};

const leadStatusTones: Record<LeadStatus, 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info'> = {
  'new-lead': 'default',
  'visit-planned': 'info',
  'offer-pending-approval': 'warning',
  'offer-approved': 'success',
  'appointment-scheduled': 'brand',
  visited: 'info',
  'follow-up-required': 'warning',
  'ready-for-onboarding': 'success',
  submitted: 'brand',
};

const leadFilterOptions: readonly { id: LeadFilter; label: string; tone: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }[] = [
  { id: 'all', label: 'الكل', tone: 'default' },
  { id: 'approval-pending', label: 'بانتظار الموافقة', tone: 'warning' },
  { id: 'follow-up', label: 'متابعة', tone: 'info' },
  { id: 'ready', label: 'جاهز للإضافة', tone: 'success' },
  { id: 'submitted', label: 'مُرسل', tone: 'brand' },
];

const visitResultOptions: readonly { id: LeadResult; label: string; tone: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }[] = [
  { id: 'interested', label: 'مهتم', tone: 'success' },
  { id: 'follow-up', label: 'يحتاج متابعة', tone: 'warning' },
  { id: 'not-interested', label: 'غير مهتم', tone: 'danger' },
  { id: 'not-suitable', label: 'غير مناسب', tone: 'danger' },
  { id: 'ready-for-onboarding', label: 'جاهز للإضافة', tone: 'brand' },
];

const defaultLeads: LeadRecord[] = [
  {
    id: 'lead-1',
    source: 'candidate',
    name: 'محمصة الساحة',
    category: 'مقاهٍ ومحمصات',
    location: 'حي الياسمين',
    status: 'offer-pending-approval',
    nextVisitLabel: 'اليوم 5:30 م',
    visitPurpose: 'مراجعة العرض وتثبيت الموعد',
    proposedOffer: 'خصم أول 3 أشهر + عمولة معيارية',
    approvalNote: 'بانتظار اعتماد قسم الشركاء.',
    resultNote: 'العميل مهتم لكن يحتاج تأكيد الشروط.',
    followUpLabel: 'الأربعاء 12:00 م',
    onboardingNote: 'يتحول إلى الإضافة بعد الجاهزية فقط.',
    visitResult: null,
  },
  {
    id: 'lead-2',
    source: 'manual',
    name: 'مخبز الزاوية',
    category: 'مخابز',
    location: 'النرجس',
    status: 'appointment-scheduled',
    nextVisitLabel: 'غدًا 10:30 ص',
    visitPurpose: 'تأكيد الموعد وتفقد الجاهزية',
    proposedOffer: 'بداية تجريبية بعمولة خفيفة',
    approvalNote: 'العرض معتمد ويمكن استخدامه أثناء الزيارة.',
    resultNote: 'تم الاتفاق على العودة غدًا.',
    followUpLabel: '',
    onboardingNote: 'بانتظار نتيجة الزيارة النهائية.',
    visitResult: 'interested',
  },
  {
    id: 'lead-3',
    source: 'candidate',
    name: 'متجر المدى',
    category: 'بقالات',
    location: 'العقيق',
    status: 'offer-approved',
    nextVisitLabel: 'اليوم 7:00 م',
    visitPurpose: 'بدء الزيارة بعد اعتماد العرض',
    proposedOffer: 'نطاق افتتاح محدود + مراجعة تشغيلية',
    approvalNote: 'اعتمد قسم الشركاء العرض المختصر.',
    resultNote: 'يمكن بدء الزيارة مباشرة.',
    followUpLabel: '',
    onboardingNote: 'جاهز فقط بعد نتيجة الزيارة.',
    visitResult: 'interested',
  },
  {
    id: 'lead-4',
    source: 'manual',
    name: 'بوفيه الشروق',
    category: 'بوفيهات',
    location: 'الملقا',
    status: 'follow-up-required',
    nextVisitLabel: 'الأربعاء 1:00 م',
    visitPurpose: 'متابعة بعد العرض الأول',
    proposedOffer: 'عرض مبدئي تحت المراجعة',
    approvalNote: 'أحتاج متابعة مع الشريك قبل الإقفال.',
    resultNote: 'العميل طلب مراجعة الأسعار.',
    followUpLabel: 'الأربعاء 1:00 م',
    onboardingNote: 'لا يفتح مسار الإضافة قبل الجاهزية.',
    visitResult: 'follow-up',
  },
  {
    id: 'lead-5',
    source: 'candidate',
    name: 'تمور النخبة',
    category: 'مواد غذائية',
    location: 'اليرموك',
    status: 'ready-for-onboarding',
    nextVisitLabel: 'اليوم 9:00 م',
    visitPurpose: 'التحويل إلى إضافة المتجر',
    proposedOffer: 'الانتقال إلى نموذج الإضافة الحالي',
    approvalNote: 'مؤهل للانتقال الآن إلى store-activation.',
    resultNote: 'كل الشروط الأساسية مكتملة.',
    followUpLabel: '',
    onboardingNote: 'يفتح نموذج إضافة المتجر مباشرة.',
    visitResult: 'ready-for-onboarding',
  },
  {
    id: 'lead-6',
    source: 'manual',
    name: 'مقهى الوادي',
    category: 'مقاهٍ',
    location: 'الصحافة',
    status: 'submitted',
    nextVisitLabel: 'مُرسل اليوم',
    visitPurpose: 'تمت الإحالة للمراجعة',
    proposedOffer: 'مرفوع للمراجعة الداخلية',
    approvalNote: 'تمت الإحالة إلى المراجعة النهائية.',
    resultNote: 'تم الإرسال بعد اكتمال المراجعة.',
    followUpLabel: '',
    onboardingNote: 'بانتظار نتيجة الإرسال فقط.',
    visitResult: 'not-interested',
  },
];

function statusRank(status: LeadStatus) {
  if (status === 'new-lead') return 0;
  if (status === 'visit-planned') return 1;
  if (status === 'offer-pending-approval' || status === 'offer-approved' || status === 'appointment-scheduled') return 2;
  if (status === 'visited' || status === 'follow-up-required') return 3;
  if (status === 'ready-for-onboarding') return 4;
  return 5;
}

function buildSteps(status: LeadStatus): readonly CompactStatusStep[] {
  const currentStage = statusRank(status);

  return [
    { id: 'lead', title: 'الفرصة', state: currentStage > 0 ? 'done' : currentStage === 0 ? 'current' : 'next' },
    { id: 'visit-plan', title: 'الزيارة', state: currentStage > 1 ? 'done' : currentStage === 1 ? 'current' : 'next' },
    { id: 'offer', title: 'العرض', state: currentStage > 2 ? 'done' : currentStage === 2 ? 'current' : 'next' },
    { id: 'result', title: 'النتيجة', state: currentStage > 3 ? 'done' : currentStage === 3 ? 'current' : 'next' },
    { id: 'onboarding', title: 'الإضافة', state: currentStage > 4 ? 'done' : currentStage === 4 ? 'current' : 'next' },
    { id: 'submitted', title: 'الإرسال', state: currentStage >= 5 ? 'current' : 'next' },
  ];
}

function resolvePrimaryActionLabel(status: LeadStatus) {
  if (status === 'offer-pending-approval') return 'طلب اعتماد العرض';
  if (status === 'new-lead' || status === 'visit-planned') return 'تحديد موعد';
  if (status === 'offer-approved' || status === 'appointment-scheduled') return 'بدء الزيارة';
  if (status === 'visited' || status === 'follow-up-required') return 'تسجيل نتيجة الزيارة';
  if (status === 'ready-for-onboarding') return 'فتح إضافة المتجر';
  return 'العودة إلى القائمة';
}

function resolvePrimaryActionTone(status: LeadStatus): 'primary' | 'secondary' | 'success' {
  if (status === 'ready-for-onboarding') return 'success';
  if (status === 'submitted') return 'secondary';
  return 'primary';
}

function resolveStatusLabel(status: LeadStatus) {
  return leadStatusLabels[status];
}

export function DshFieldAcquisitionBasicsScreen({
  state = 'ready',
  title = 'DSH Field Acquisition Basics',
  subtitle = 'قائمة المتاجر هي المدخل الرئيسي. التفاصيل الإضافية تظهر فقط عند الحاجة أو من تبويبات الحساب.',
  onOpenActivationPress,
  onOpenGeoPinPress,
  onOpenVisitLogPress,
  onOpenInventoryPress,
  onRetry,
}: DshEntryScreenProps) {
  const { theme } = useTheme();
  const [mode, setMode] = React.useState<WorkspaceMode>('quick');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [leadFilter, setLeadFilter] = React.useState<LeadFilter>('all');
  const [selectedLeadId, setSelectedLeadId] = React.useState(defaultLeads[0]?.id ?? '');
  const [leads, setLeads] = React.useState<LeadRecord[]>(defaultLeads);

  const selectedLead = React.useMemo(() => leads.find((lead) => lead.id === selectedLeadId) ?? leads[0] ?? null, [leads, selectedLeadId]);

  const filteredLeads = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return leads.filter((lead) => {
      const filterMatches =
        leadFilter === 'all'
          || (leadFilter === 'approval-pending' && (lead.status === 'new-lead' || lead.status === 'visit-planned' || lead.status === 'offer-pending-approval' || lead.status === 'appointment-scheduled'))
          || (leadFilter === 'follow-up' && lead.status === 'follow-up-required')
          || (leadFilter === 'ready' && lead.status === 'ready-for-onboarding')
          || (leadFilter === 'submitted' && lead.status === 'submitted');

      if (!filterMatches) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = `${lead.name} ${lead.category} ${lead.location} ${lead.nextVisitLabel} ${resolveStatusLabel(lead.status)} ${lead.proposedOffer}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [leads, leadFilter, searchQuery]);

  const summaryCounts = React.useMemo(() => ({
    total: leads.length,
    ready: leads.filter((lead) => lead.status === 'ready-for-onboarding').length,
    followUp: leads.filter((lead) => lead.status === 'follow-up-required').length,
    submitted: leads.filter((lead) => lead.status === 'submitted').length,
  }), [leads]);

  const updateSelectedLead = React.useCallback((updater: (current: LeadRecord) => LeadRecord) => {
    setLeads((current) => current.map((lead) => (lead.id === selectedLeadId ? updater(lead) : lead)));
  }, [selectedLeadId]);

  const handleAddManualLead = React.useCallback(() => {
    const id = `manual-${Date.now()}`;
    const nextLead: LeadRecord = {
      id,
      source: 'manual',
      name: 'فرصة يدوية جديدة',
      category: 'قيد التحديد',
      location: 'لم يُحدد بعد',
      status: 'new-lead',
      nextVisitLabel: 'لم يُحدد الموعد بعد',
      visitPurpose: 'تخطيط أول زيارة',
      proposedOffer: 'بانتظار إعداد العرض المختصر',
      approvalNote: 'لم يُرسل إلى قسم الشركاء بعد.',
      resultNote: '',
      followUpLabel: '',
      onboardingNote: 'سيتحول إلى الإضافة فقط بعد الجاهزية.',
      visitResult: null,
    };

    setLeads((current) => [nextLead, ...current]);
    setSelectedLeadId(id);
    setLeadFilter('all');
    setSearchQuery('');
  }, []);

  const handleScheduleVisit = React.useCallback(() => {
    if (!selectedLead) {
      return;
    }

    updateSelectedLead((lead) => ({
      ...lead,
      status: 'appointment-scheduled',
      nextVisitLabel: lead.nextVisitLabel || 'غدًا 10:30 ص',
      visitPurpose: lead.visitPurpose || 'تثبيت الموعد وتفقد الجاهزية',
      approvalNote: 'تم تثبيت الموعد المختصر.',
    }));
  }, [selectedLead, updateSelectedLead]);

  const handleRequestApproval = React.useCallback(() => {
    if (!selectedLead) {
      return;
    }

    updateSelectedLead((lead) => ({
      ...lead,
      status: 'offer-approved',
      approvalNote: 'العرض معتمد ويمكن إظهاره أثناء الزيارة.',
    }));
  }, [selectedLead, updateSelectedLead]);

  const handleVisitResultChange = React.useCallback((result: LeadResult) => {
    if (!selectedLead) {
      return;
    }

    updateSelectedLead((lead) => ({
      ...lead,
      visitResult: result,
      status:
        result === 'follow-up'
          ? 'follow-up-required'
          : result === 'ready-for-onboarding'
            ? 'ready-for-onboarding'
            : 'visited',
      resultNote:
        result === 'follow-up'
          ? 'العميل طلب متابعة.'
          : result === 'ready-for-onboarding'
            ? 'جاهز للإضافة مباشرة.'
            : lead.resultNote,
      onboardingNote: result === 'ready-for-onboarding' ? 'يفتح نموذج إضافة المتجر الآن.' : lead.onboardingNote,
    }));
  }, [selectedLead, updateSelectedLead]);

  const handlePrimaryAction = React.useCallback(() => {
    if (!selectedLead) {
      return;
    }

    if (selectedLead.status === 'offer-pending-approval') {
      handleRequestApproval();
      return;
    }

    if (selectedLead.status === 'new-lead' || selectedLead.status === 'visit-planned') {
      handleScheduleVisit();
      return;
    }

    if (selectedLead.status === 'offer-approved' || selectedLead.status === 'appointment-scheduled' || selectedLead.status === 'visited' || selectedLead.status === 'follow-up-required') {
      onOpenVisitLogPress?.();
      return;
    }

    if (selectedLead.status === 'ready-for-onboarding') {
      onOpenActivationPress?.();
      return;
    }

    setSelectedLeadId(leads[0]?.id ?? '');
  }, [handleRequestApproval, handleScheduleVisit, leads, onOpenActivationPress, onOpenVisitLogPress, selectedLead]);

  const primaryActionLabel = selectedLead ? resolvePrimaryActionLabel(selectedLead.status) : 'العودة إلى القائمة';
  const primaryActionTone = selectedLead ? resolvePrimaryActionTone(selectedLead.status) : 'secondary';

  const secondaryActionLabel = selectedLead?.status === 'ready-for-onboarding' ? 'إدارة المنتجات' : 'إضافة فرصة يدوية';
  const secondaryActionHandler = selectedLead?.status === 'ready-for-onboarding' ? onOpenInventoryPress : handleAddManualLead;

  const selectedDetailItems = React.useMemo(() => {
    if (!selectedLead) {
      return [];
    }

    const items = [
      { label: 'الحالة', value: resolveStatusLabel(selectedLead.status), tone: leadStatusTones[selectedLead.status] },
      { label: 'الموقع', value: selectedLead.location },
      { label: 'موعد الزيارة القادمة', value: selectedLead.nextVisitLabel, tone: 'brand' as const },
      { label: 'العرض المختصر', value: selectedLead.proposedOffer, tone: 'warning' as const },
      { label: 'ملاحظة الشريك', value: selectedLead.approvalNote },
      { label: 'ما تبقى', value: selectedLead.onboardingNote },
    ];

    return mode === 'quick' ? items.slice(0, 4) : items;
  }, [mode, selectedLead]);

  const selectedSteps = React.useMemo(() => selectedLead ? buildSteps(selectedLead.status) : [], [selectedLead]);

  if (state === 'loading') {
    return <StateView stateId="loading" title="جار تجهيز قائمة المتاجر" description="تبقى الواجهة خفيفة حتى يكتمل تحميل بيانات الميدان." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد متاجر بعد" description="أضف فرصة يدوية أو ابدأ من أول متجر حتى تظهر القائمة المختصرة." actionLabel="إضافة فرصة يدوية" onActionPress={handleAddManualLead} />;
  }

  if (state === 'offline') {
    return <StateView stateId="offline" title="الاتصال غير متاح" description="يمكنك مراجعة القائمة ثم إعادة المحاولة عند عودة الشبكة." actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
  }

  if (state === 'error') {
    return <StateView stateId="recoverableError" title="تعذر تحميل الواجهة" description="أعد المحاولة أولًا. أبقِ المسار مختصرًا حتى يعود بوضوح." actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <StateView stateId="warning" title="المسار المختصر معطل مؤقتًا" description="أبقِ العودة السريعة والوضوح ظاهرين حتى يعود المسار المعتمد." actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
  }

  if (state === 'submitted') {
    return <StateView kind="success" title="تم إرسال فرصة واحدة على الأقل" description="الآن يمكنك الرجوع إلى المتاجر أو متابعة مرحلة الإضافة فقط عند الجاهزية." actionLabel="العودة إلى القائمة" onActionPress={onRetry} />;
  }

  return (
    <Box style={{ flex: 1 }} background="background">
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 96 }}>
        <Card title={title} subtitle={subtitle}>
          <Box gap={3}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Badge label={`${summaryCounts.total} متجر`} tone="brand" />
              <Badge label={`${summaryCounts.ready} جاهز للإضافة`} tone="success" />
              <Badge label={`${summaryCounts.followUp} متابعة`} tone="warning" />
              <Badge label={`${summaryCounts.submitted} مرسلة`} tone="info" />
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Chip label="خلاصة سريعة" selected={mode === 'quick'} tone="brand" onPress={() => setMode('quick')} />
              <Chip label="تفاصيل كاملة" selected={mode === 'full'} tone="info" onPress={() => setMode('full')} />
            </View>
          </Box>
        </Card>

        <Card title="قائمة المتاجر" subtitle="الصفحة الرئيسية الآن هي قائمة متاجر مختصرة. انقر على أي متجر لتظهر باقي التفاصيل فقط له.">
          <Box gap={3}>
            <TextField label="ابحث في المتاجر" value={searchQuery} onChangeText={setSearchQuery} placeholder="الاسم، التصنيف، الموقع، أو الحالة" />

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {leadFilterOptions.map((option) => (
                <Chip key={option.id} label={option.label} selected={leadFilter === option.id} tone={option.tone} onPress={() => setLeadFilter(option.id)} />
              ))}
            </View>

            <View style={{ gap: 12 }}>
              {filteredLeads.length ? filteredLeads.map((lead) => (
                <ListItem
                  key={lead.id}
                  title={lead.name}
                  subtitle={`${lead.category} · ${lead.source === 'manual' ? 'مضافة يدويًا' : 'مرشحة'}`}
                  meta={`${lead.location} · ${lead.nextVisitLabel}`}
                  badgeLabel={resolveStatusLabel(lead.status)}
                  onPress={() => setSelectedLeadId(lead.id)}
                  style={({ pressed }) => selectedLeadId === lead.id ? [{ borderColor: theme.brand, backgroundColor: pressed ? theme.brandSurface : theme.surfaceInset }] : undefined}
                />
              )) : (
                <StateView stateId="noResults" title="لا توجد متاجر مطابقة" description="جرّب اسم متجر آخر أو امسح البحث والفلترة للعودة إلى القائمة الكاملة." actionLabel="امسح البحث" onActionPress={() => { setSearchQuery(''); setLeadFilter('all'); }} />
              )}
            </View>
          </Box>
        </Card>

        <Card title="ما تبقى للمتجر المختار" subtitle="قائمة بروجرس مختصرة تكشف فقط ما يتبقى لهذا المتجر عند الضغط عليه.">
          {selectedLead ? (
            <Box gap={3}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <Badge label={resolveStatusLabel(selectedLead.status)} tone={leadStatusTones[selectedLead.status]} />
                <Badge label={selectedLead.source === 'manual' ? 'مضافة يدويًا' : 'مرشحة'} tone="default" />
              </View>

              <KeyValueList items={selectedDetailItems} dense={mode === 'quick'} />

              <CompactStatusStepper title="التقدم المختصر" subtitle="مراحل قصيرة داخل نفس المتجر بدلاً من Wizard طويل." steps={selectedSteps} />

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button label={primaryActionLabel} tone={primaryActionTone} onPress={handlePrimaryAction} />
                <Button label="مراجعة الموقع" tone="secondary" onPress={onOpenGeoPinPress} disabled={!onOpenGeoPinPress} />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {visitResultOptions.map((option) => (
                  <Chip
                    key={option.id}
                    label={option.label}
                    selected={selectedLead.visitResult === option.id}
                    tone={option.tone}
                    onPress={() => handleVisitResultChange(option.id)}
                  />
                ))}
              </View>

              {selectedLead.status === 'ready-for-onboarding' ? (
                <Text role="bodySm" tone="muted">هذا المتجر جاهز للإضافة، لذلك يصبح مدخل onboarding هو الخطوة التالية فقط.</Text>
              ) : null}
            </Box>
          ) : (
            <StateView stateId="empty" title="اختر متجرًا من القائمة" description="سيظهر باقي ما يحتاجه المتجر داخل بطاقة التقدم المختصر فور الاختيار." />
          )}
        </Card>
      </MobileScrollView>

      <StickyActionBar
        note={selectedLead ? `${selectedLead.name} · ${selectedLead.followUpLabel || selectedLead.nextVisitLabel} · ${selectedLead.onboardingNote}` : 'اختر متجرًا من القائمة ثم افتح ما تبقى له فقط عند الحاجة.'}
        primaryAction={{ label: primaryActionLabel, tone: primaryActionTone, onPress: handlePrimaryAction }}
        secondaryAction={{ label: secondaryActionLabel, tone: 'secondary', onPress: secondaryActionHandler }}
      />
    </Box>
  );
}

export default DshFieldAcquisitionBasicsScreen;
