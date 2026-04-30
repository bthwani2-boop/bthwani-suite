import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  Badge,
  Box,
  Card,
  Chip,
  KeyValueList,
  ListItem,
  MobileScrollView,
  SheetFrame,
  StateView,
  StickyActionBar,
  Text,
  TextField,
  useTheme,
} from '@bthwani/ui-kit';

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
type LeadFilter = 'all' | 'today' | 'ready' | 'follow-up' | 'pending' | 'submitted';
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
  'new-lead': 'فرصة جديدة',
  'visit-planned': 'زيارة مخططة',
  'offer-pending-approval': 'بانتظار اعتماد العرض',
  'offer-approved': 'العرض معتمد',
  'appointment-scheduled': 'جاهز للزيارة',
  visited: 'بانتظار تسجيل النتيجة',
  'follow-up-required': 'تحتاج متابعة',
  'ready-for-onboarding': 'جاهز للإضافة',
  submitted: 'قيد مراجعة الشركاء',
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
  { id: 'today', label: 'اليوم', tone: 'brand' },
  { id: 'ready', label: 'جاهز للإضافة', tone: 'success' },
  { id: 'follow-up', label: 'تحتاج متابعة', tone: 'info' },
  { id: 'pending', label: 'بانتظار اعتماد', tone: 'warning' },
  { id: 'submitted', label: 'مرسل', tone: 'brand' },
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
    visitPurpose: 'إرسال العرض المختصر إلى قسم الشركاء',
    proposedOffer: 'خصم أول 3 أشهر + عمولة معيارية',
    approvalNote: 'سيظهر في لوحة الشركاء كـ Offer Pending Approval حتى يصدر القرار.',
    resultNote: 'المتجر مهتم، والقرار الآن عند قسم الشركاء.',
    followUpLabel: 'الأربعاء 12:00 م',
    onboardingNote: 'الخطوة التالية: اعتماد أو رفض أو تعديل العرض من قسم الشركاء.',
    visitResult: null,
  },
  {
    id: 'lead-2',
    source: 'manual',
    name: 'مخبز الزاوية',
    category: 'مخابز',
    location: 'النرجس',
    status: 'offer-approved',
    nextVisitLabel: 'غدًا 10:30 ص',
    visitPurpose: 'بدء الزيارة بعد اعتماد العرض',
    proposedOffer: 'بداية تجريبية بعمولة خفيفة',
    approvalNote: 'قسم الشركاء اعتمد العرض، ويمكن للمندوب بدء الزيارة.',
    resultNote: 'الزيارة التالية ستثبت القرار الميداني.',
    followUpLabel: '',
    onboardingNote: 'بعد الزيارة يسجل المندوب النتيجة داخل نفس المسار.',
    visitResult: 'interested',
  },
  {
    id: 'lead-3',
    source: 'candidate',
    name: 'متجر المدى',
    category: 'بقالات',
    location: 'العقيق',
    status: 'visited',
    nextVisitLabel: 'اليوم 7:00 م',
    visitPurpose: 'تسجيل نتيجة الزيارة الأخيرة',
    proposedOffer: 'نطاق افتتاح محدود + مراجعة تشغيلية',
    approvalNote: 'العرض معتمد مسبقًا.',
    resultNote: 'الزيارة تمت، ويتبقى فقط تثبيت النتيجة التالية.',
    followUpLabel: '',
    onboardingNote: 'إما متابعة لاحقة أو جاهزية للإضافة حسب النتيجة.',
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
    visitPurpose: 'جدولة متابعة قصيرة بدل فتح مسار طويل',
    proposedOffer: 'عرض مبدئي تحت المراجعة',
    approvalNote: 'يحتاج تعديلًا بسيطًا قبل الحسم.',
    resultNote: 'العميل طلب مراجعة الأسعار.',
    followUpLabel: 'الأربعاء 1:00 م',
    onboardingNote: 'بعد المتابعة إما اعتماد العرض أو انتقال مباشر للإضافة.',
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
    approvalNote: 'الحالة أصبحت Ready for Onboarding بعد اعتماد الشركاء.',
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
    nextVisitLabel: 'اليوم 11:20 ص',
    visitPurpose: 'تمت الإحالة إلى Partner Review',
    proposedOffer: 'الملف المرسل ينتظر مراجعة الشركاء',
    approvalNote: 'الطلب في لوحة التحكم داخل Partner Review. توليد كود الشريك [TBD] بعد الموافقة.',
    resultNote: 'تم الإرسال من الميدان ولا يحتاج إجراء ميداني جديد الآن.',
    followUpLabel: '',
    onboardingNote: 'بعد قرار الشركاء ينتقل إلى التسويق للمراجعة النهائية [TBD].',
    visitResult: null,
  },
];

function isTodayLead(lead: LeadRecord) {
  return lead.nextVisitLabel.includes('اليوم');
}

function resolvePrimaryActionLabel(status: LeadStatus) {
  if (status === 'offer-pending-approval' || status === 'new-lead') return 'طلب اعتماد العرض';
  if (status === 'visit-planned' || status === 'offer-approved' || status === 'appointment-scheduled') return 'بدء الزيارة';
  if (status === 'visited') return 'تسجيل النتيجة';
  if (status === 'follow-up-required') return 'جدولة متابعة';
  if (status === 'ready-for-onboarding') return 'فتح إضافة المتجر';
  return 'بانتظار مراجعة الشركاء';
}

function resolvePrimaryActionTone(status: LeadStatus): 'primary' | 'secondary' | 'success' {
  if (status === 'ready-for-onboarding') return 'success';
  if (status === 'submitted') return 'secondary';
  return 'primary';
}

function resolvePrimaryActionDisabled(status: LeadStatus) {
  return status === 'submitted';
}

function resolveStatusLabel(status: LeadStatus) {
  return leadStatusLabels[status];
}

function resolveSourceLabel(source: LeadSource) {
  return source === 'manual' ? 'يدوي' : 'مرشحة';
}

function resolveControlPanelStatus(status: LeadStatus) {
  if (status === 'offer-pending-approval') {
    return 'يظهر لقسم الشركاء كـ Offer Pending Approval.';
  }

  if (status === 'offer-approved') {
    return 'اعتمد قسم الشركاء العرض، ويظهر للمندوب Offer Approved.';
  }

  if (status === 'ready-for-onboarding') {
    return 'عند الجاهزية يفتح نموذج إضافة المتجر الحالي مباشرة.';
  }

  if (status === 'submitted') {
    return 'بعد الإرسال ينتقل إلى Partner Review، ثم كود الشريك [TBD] فالتسويق [TBD].';
  }

  return 'التفاصيل تبقى داخل المتجر، ولا تُفتح إلا عند الحاجة.';
}

export function DshFieldAcquisitionBasicsScreen({
  state = 'ready',
  title = 'تشغيل الميدان اليوم',
  subtitle = 'قائمة سريعة للمتاجر والإجراء التالي.',
  onOpenActivationPress,
  onOpenGeoPinPress,
  onOpenVisitLogPress,
  onRetry,
}: DshEntryScreenProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [leadFilter, setLeadFilter] = React.useState<LeadFilter>('today');
  const [selectedLeadId, setSelectedLeadId] = React.useState(defaultLeads[0]?.id ?? '');
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [leads, setLeads] = React.useState<LeadRecord[]>(defaultLeads);

  const selectedLead = React.useMemo(() => leads.find((lead) => lead.id === selectedLeadId) ?? null, [leads, selectedLeadId]);

  const filteredLeads = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return leads.filter((lead) => {
      const filterMatches =
        leadFilter === 'all'
          || (leadFilter === 'today' && isTodayLead(lead))
          || (leadFilter === 'follow-up' && lead.status === 'follow-up-required')
          || (leadFilter === 'ready' && lead.status === 'ready-for-onboarding')
          || (leadFilter === 'pending' && (lead.status === 'new-lead' || lead.status === 'offer-pending-approval'))
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

  React.useEffect(() => {
    if (!filteredLeads.length) {
      setSelectedLeadId('');
      setDetailsVisible(false);
      return;
    }

    const selectionIsVisible = filteredLeads.some((lead) => lead.id === selectedLeadId);
    if (!selectionIsVisible) {
      setSelectedLeadId(filteredLeads[0].id);
    }
  }, [filteredLeads, selectedLeadId]);

  const summaryCounts = React.useMemo(() => ({
    all: leads.length,
    today: leads.filter(isTodayLead).length,
    ready: leads.filter((lead) => lead.status === 'ready-for-onboarding').length,
    followUp: leads.filter((lead) => lead.status === 'follow-up-required').length,
    pending: leads.filter((lead) => lead.status === 'new-lead' || lead.status === 'offer-pending-approval').length,
    submitted: leads.filter((lead) => lead.status === 'submitted').length,
  }), [leads]);

  const leadFilterCounts = React.useMemo<Record<LeadFilter, number>>(() => ({
    all: summaryCounts.all,
    today: summaryCounts.today,
    ready: summaryCounts.ready,
    'follow-up': summaryCounts.followUp,
    pending: summaryCounts.pending,
    submitted: summaryCounts.submitted,
  }), [summaryCounts]);

  const updateSelectedLead = React.useCallback((updater: (current: LeadRecord) => LeadRecord) => {
    setLeads((current) => current.map((lead) => (lead.id === selectedLeadId ? updater(lead) : lead)));
  }, [selectedLeadId]);

  const handleAddManualLead = React.useCallback(() => {
    const id = `manual-${Date.now()}`;
    const nextLead: LeadRecord = {
      id,
      source: 'manual',
      name: 'فرصة ميدانية جديدة',
      category: 'قيد التحديد',
      location: 'لم يُحدد بعد',
      status: 'new-lead',
      nextVisitLabel: 'اليوم',
      visitPurpose: 'تجهيز عرض مختصر قبل الإرسال',
      proposedOffer: 'بانتظار إعداد العرض المختصر',
      approvalNote: 'لم يُرسل إلى قسم الشركاء بعد.',
      resultNote: '',
      followUpLabel: '',
      onboardingNote: 'سيتحول إلى الإضافة فقط بعد الجاهزية.',
      visitResult: null,
    };

    setLeads((current) => [nextLead, ...current]);
    setSelectedLeadId(id);
    setLeadFilter('today');
    setSearchQuery('');
    setDetailsVisible(true);
  }, []);

  const handleScheduleVisit = React.useCallback(() => {
    if (!selectedLead) {
      return;
    }

    updateSelectedLead((lead) => ({
      ...lead,
      status: 'appointment-scheduled',
      nextVisitLabel: lead.nextVisitLabel || 'غدًا 10:30 ص',
      visitPurpose: 'الزيارة جاهزة الآن داخل المسار اليومي المختصر',
      approvalNote: 'العرض معتمد والزيارة أصبحت جاهزة للتنفيذ.',
      resultNote: 'ابدأ الزيارة ثم سجّل نتيجتها من البطاقة المختصرة.',
    }));
  }, [selectedLead, updateSelectedLead]);

  const handleRequestApproval = React.useCallback(() => {
    if (!selectedLead) {
      return;
    }

    updateSelectedLead((lead) => ({
      ...lead,
      status: 'submitted',
      approvalNote: 'أُرسل الآن إلى Partner Review داخل لوحة الشركاء كـ Offer Pending Approval.',
      onboardingNote: 'بانتظار قرار اعتماد أو رفض أو تعديل العرض من قسم الشركاء.',
      resultNote: 'لا يحتاج المندوب أي خطوة أخرى حتى يعود القرار من لوحة التحكم.',
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
          ? 'العميل طلب متابعة قصيرة قبل الإغلاق.'
          : result === 'ready-for-onboarding'
            ? 'جاهز للإضافة مباشرة.'
            : 'تم تثبيت النتيجة الميدانية، ويمكن الرجوع لها من البطاقة المختصرة.',
      onboardingNote:
        result === 'ready-for-onboarding'
          ? 'يفتح نموذج إضافة المتجر الآن.'
          : result === 'follow-up'
            ? 'الخطوة التالية هي جدولة متابعة واحدة واضحة.'
            : lead.onboardingNote,
    }));
  }, [selectedLead, updateSelectedLead]);

  const handlePrimaryAction = React.useCallback(() => {
    if (!selectedLead) {
      return;
    }

    if (selectedLead.status === 'offer-pending-approval' || selectedLead.status === 'new-lead') {
      handleRequestApproval();
      setDetailsVisible(true);
      return;
    }

    if (selectedLead.status === 'visit-planned') {
      handleScheduleVisit();
      setDetailsVisible(true);
      return;
    }

    if (selectedLead.status === 'offer-approved' || selectedLead.status === 'appointment-scheduled') {
      updateSelectedLead((lead) => ({
        ...lead,
        status: 'visited',
        resultNote: 'بدأت الزيارة. سجّل النتيجة عند الانتهاء.',
      }));
      setDetailsVisible(true);
      onOpenVisitLogPress?.();
      return;
    }

    if (selectedLead.status === 'visited') {
      setDetailsVisible(true);
      onOpenVisitLogPress?.();
      return;
    }

    if (selectedLead.status === 'follow-up-required') {
      updateSelectedLead((lead) => ({
        ...lead,
        nextVisitLabel: lead.followUpLabel || 'غدًا 11:00 ص',
        approvalNote: 'تم تثبيت متابعة مختصرة لهذا المتجر.',
      }));
      setDetailsVisible(true);
      return;
    }

    if (selectedLead.status === 'ready-for-onboarding') {
      onOpenActivationPress?.();
      return;
    }

    setDetailsVisible(true);
  }, [handleRequestApproval, handleScheduleVisit, onOpenActivationPress, onOpenVisitLogPress, selectedLead, updateSelectedLead]);

  const primaryActionLabel = selectedLead ? resolvePrimaryActionLabel(selectedLead.status) : 'اختر متجرًا';
  const primaryActionTone = selectedLead ? resolvePrimaryActionTone(selectedLead.status) : 'secondary';

  const selectedDetailItems = React.useMemo(() => {
    if (!selectedLead) {
      return [];
    }

    return [
      { label: 'الحالة', value: resolveStatusLabel(selectedLead.status), tone: leadStatusTones[selectedLead.status] },
      { label: 'الموقع والوقت', value: `${selectedLead.location} · ${selectedLead.nextVisitLabel}` },
      { label: 'الإجراء التالي', value: resolvePrimaryActionLabel(selectedLead.status), tone: 'brand' as const },
      { label: 'لوحة الشركاء', value: resolveControlPanelStatus(selectedLead.status) },
      { label: 'ملاحظة العمل', value: selectedLead.resultNote || selectedLead.approvalNote },
      { label: 'ما بعد هذه الخطوة', value: selectedLead.onboardingNote },
    ];
  }, [selectedLead]);

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
      <MobileScrollView fill padding={4} gap={2} contentContainerStyle={{ paddingBottom: 148 }}>
        <Card title={title} subtitle={subtitle}>
          <Box gap={2}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Badge label={`اليوم ${summaryCounts.today}`} tone="brand" />
              <Badge label={`جاهز للإضافة ${summaryCounts.ready}`} tone="success" />
              <Badge label={`تحتاج متابعة ${summaryCounts.followUp}`} tone="warning" />
              <Badge label={`مرسل ${summaryCounts.submitted}`} tone="info" />
            </View>
          </Box>
        </Card>

        <Card title="قائمة المتاجر">
          <Box gap={2}>
            <TextField label="ابحث في المتاجر" value={searchQuery} onChangeText={setSearchQuery} placeholder="الاسم، التصنيف، الموقع، أو الحالة" />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              decelerationRate="fast"
              style={{ transform: [{ scaleX: -1 }] }}
              contentContainerStyle={{
                flexDirection: 'row',
                gap: 8,
                paddingHorizontal: 2,
              }}
            >
              {leadFilterOptions.map((option) => {
                const isSelected = leadFilter === option.id;

                return (
                  <View key={option.id} style={{ transform: [{ scaleX: -1 }] }}>
                    <Chip
                      label={`${option.label} ${leadFilterCounts[option.id]}`}
                      selected={isSelected}
                      tone={isSelected ? option.tone : 'default'}
                      onPress={() => setLeadFilter(option.id)}
                    />
                  </View>
                );
              })}
            </ScrollView>

            <View style={{ gap: 8 }}>
              {filteredLeads.length ? filteredLeads.map((lead) => (
                <ListItem
                  key={lead.id}
                  title={lead.name}
                  subtitle={`${lead.location} · ${lead.nextVisitLabel}`}
                  meta={`التالي: ${resolvePrimaryActionLabel(lead.status)} · ${resolveSourceLabel(lead.source)}`}
                  badgeLabel={resolveStatusLabel(lead.status)}
                  onPress={() => {
                    setSelectedLeadId(lead.id);
                    setDetailsVisible(true);
                  }}
                  style={({ pressed }) => selectedLeadId === lead.id ? [{ borderColor: theme.brand, backgroundColor: pressed ? theme.brandSurface : theme.surfaceInset }] : undefined}
                />
              )) : (
                <StateView stateId="noResults" title="لا توجد متاجر مطابقة" description="جرّب اسم متجر آخر أو امسح البحث والفلترة للعودة إلى القائمة الكاملة." actionLabel="امسح البحث" onActionPress={() => { setSearchQuery(''); setLeadFilter('all'); }} />
              )}
            </View>
          </Box>
        </Card>
      </MobileScrollView>

      <SheetFrame visible={detailsVisible && Boolean(selectedLead)} onClose={() => setDetailsVisible(false)} title={selectedLead ? selectedLead.name : 'تفاصيل المتجر'}>
        {selectedLead ? (
          <Box gap={3}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Badge label={resolveStatusLabel(selectedLead.status)} tone={leadStatusTones[selectedLead.status]} />
              <Badge label={resolveSourceLabel(selectedLead.source)} tone="default" />
              <Badge label={resolvePrimaryActionLabel(selectedLead.status)} tone="brand" />
            </View>

            <Text role="bodySm" tone="muted">{selectedLead.category} · {selectedLead.visitPurpose}</Text>

            <KeyValueList items={selectedDetailItems} dense />

            {(selectedLead.status === 'visited' || selectedLead.status === 'follow-up-required' || selectedLead.status === 'ready-for-onboarding') ? (
              <Box gap={2}>
                <Text role="bodySm" tone="muted">نتيجة الزيارة</Text>
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
              </Box>
            ) : null}

            {selectedLead.status === 'submitted' ? (
              <Text role="bodySm" tone="muted">قسم الشركاء يعتمد أو يرفض أو يعدل العرض، ثم ينتقل الطلب إلى التسويق بعد الموافقة [TBD].</Text>
            ) : null}

            {selectedLead.status === 'ready-for-onboarding' ? (
              <Text role="bodySm" tone="muted">عند Ready for Onboarding يفتح نموذج إضافة المتجر الحالي مباشرة بدون Wizard إضافي.</Text>
            ) : null}

            {onOpenGeoPinPress ? <Chip label="فتح الموقع" tone="default" onPress={onOpenGeoPinPress} /> : null}
          </Box>
        ) : null}
      </SheetFrame>

      <StickyActionBar
        note={selectedLead ? `${selectedLead.location} · ${selectedLead.nextVisitLabel} · ${resolvePrimaryActionLabel(selectedLead.status)}` : 'اختر متجرًا من القائمة ثم نفّذ الإجراء التالي فقط.'}
        primaryAction={{
          label: primaryActionLabel,
          tone: primaryActionTone,
          disabled: selectedLead ? resolvePrimaryActionDisabled(selectedLead.status) : true,
          onPress: handlePrimaryAction,
        }}
      />
    </Box>
  );
}

export default DshFieldAcquisitionBasicsScreen;
