import React from 'react';
import {
  Box,
  Button,
  KeyValueList,
  ListItem,
  MobileScrollView,
  MobileWorkspaceHeader,
  SectionHeader,
  StateView,
  StatCard,
  Surface,
  Tabs,
  Text,
  TextField,
} from '@bthwani/ui-kit';
import {
  getMarketingGrowthItems,
  upsertMarketingGrowthItem,
  type MarketingGrowthRouteTarget,
} from '../../../shared/marketing/growth-store';

export type PartnerSupportScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'success' | 'disabled';

export type PartnerSupportScreenId =
  | 'auction-status-update'
  | 'chat-read-ack'
  | 'chat-send'
  | 'doc-upload'
  | 'intake-start'
  | 'inventory-adjust'
  | 'inventory-update'
  | 'items-upsert'
  | 'order-accept'
  | 'order-get'
  | 'order-handoff'
  | 'order-issue-queue'
  | 'order-out-for-delivery'
  | 'order-prepare'
  | 'order-ready'
  | 'order-reject'
  | 'order-store-delivered'
  | 'quick-reply-config'
  | 'quick-reply-settings'
  | 'quick-reply-setup'
  | 'store-nomination'
  | 'video-upload';

type SupportMetric = {
  label: string;
  value: string;
  deltaLabel?: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
};

type SupportListItem = {
  title: string;
  subtitle?: string;
  meta?: string;
  badgeLabel?: string;
  keyValues?: Array<{ label: string; value: string }>;
  listItems?: SupportListItem[];
};

type SupportConfig = {
  id: PartnerSupportScreenId;
  title: string;
  subtitle: string;
  heroTitle: string;
  heroDescription: string;
  primaryLabel: string;
  secondaryLabel?: string;
  primaryHint?: string;
  keyValues?: Array<{ label: string; value: string; tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }>;
  metrics?: SupportMetric[];
  listItems?: SupportListItem[];
  inputLabel?: string;
  inputHint?: string;
};

export type PartnerGeneratedSupportScreenProps = {
  state?: PartnerSupportScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

const partnerSupportConfigs: Record<PartnerSupportScreenId, SupportConfig> = {
  'auction-status-update': {
    id: 'auction-status-update',
    title: 'Auction status update',
    subtitle: 'Control whether the branch should compete for auction-style demand.',
    heroTitle: 'Auction participation',
    heroDescription: 'Keep the branch auction decision explicit so demand strategy does not leak into unrelated store controls.',
    primaryLabel: 'Apply auction status',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Current mode', value: 'Manual acceptance' },
      { label: 'Peak override', value: 'Enabled', tone: 'warning' },
      { label: 'Next sync', value: 'In 3 min' },
    ],
  },
  'chat-read-ack': {
    id: 'chat-read-ack',
    title: 'Chat read acknowledgement',
    subtitle: 'Acknowledge the newest conversation without leaving the order context.',
    heroTitle: 'Unread branch conversation',
    heroDescription: 'Marking the message read keeps the branch queue and captain communication aligned.',
    primaryLabel: 'Mark as read',
    secondaryLabel: 'Open full chat compose',
    listItems: [
      { title: 'Captain', subtitle: 'I am at the branch gate.', meta: '2 min ago', badgeLabel: 'Unread' },
      { title: 'Customer', subtitle: 'Please ring once you arrive.', meta: '5 min ago', badgeLabel: 'Unread' },
    ],
  },
  'chat-send': {
    id: 'chat-send',
    title: 'Chat send',
    subtitle: 'Send a direct branch reply without leaving the current order workspace.',
    heroTitle: 'Operational response',
    heroDescription: 'Keep the reply short and decisive so the next action stays obvious to the captain or customer.',
    primaryLabel: 'Send message',
    secondaryLabel: 'Insert quick reply',
    inputLabel: 'Message',
    inputHint: 'Example: order is packed and ready at handoff counter 2.',
  },
  'doc-upload': {
    id: 'doc-upload',
    title: 'Document upload',
    subtitle: 'Submit branch documents without leaving the partner support workspace.',
    heroTitle: 'Compliance handoff',
    heroDescription: 'Keep the required branch documents traceable and ready for review.',
    primaryLabel: 'Upload selected document',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Required now', value: 'Commercial register' },
      { label: 'Next renewal', value: 'In 18 days', tone: 'warning' },
      { label: 'Reviewer', value: 'Partner ops' },
    ],
  },
  'video-upload': {
    id: 'video-upload',
    title: 'Video upload',
    subtitle: 'Submit short videos from the partner app for marketing approval before client publishing.',
    heroTitle: 'Partner video submission lane',
    heroDescription: 'Video uploads move into the marketing review queue first so nothing reaches the client without approval.',
    primaryLabel: 'Queue video for marketing review',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Source', value: 'Partner app' },
      { label: 'Approval owner', value: 'Marketing team', tone: 'warning' },
      { label: 'Client visibility', value: 'Only after publish', tone: 'success' },
    ],
  },
  'intake-start': {
    id: 'intake-start',
    title: 'Intake start',
    subtitle: 'Start the onboarding intake for a new branch or replacement profile.',
    heroTitle: 'Branch intake kickoff',
    heroDescription: 'The intake workspace opens the minimum sequence before a branch can receive DSH demand.',
    primaryLabel: 'Start intake',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Branch type', value: 'Existing store refresh' },
      { label: 'Assigned reviewer', value: 'Partner onboarding' },
      { label: 'Current step', value: 'Identity and compliance', tone: 'brand' },
    ],
  },
  'inventory-adjust': {
    id: 'inventory-adjust',
    title: 'تعديل مخزون سريع',
    subtitle: 'عدّل الكمية أو الإتاحة فقط من دون فتح مسار الكتالوج الكامل.',
    heroTitle: 'تصحيح لحظي للمخزون',
    heroDescription: 'هذا المسار مناسب عندما تحتاج إلى تعديل الكمية أو إتاحة عنصر واحد بسرعة.',
    primaryLabel: 'تطبيق التعديل',
    secondaryLabel: 'فتح التحديث الجماعي',
    listItems: [
      { title: 'برغر كلاسيك', subtitle: 'المخزون الحالي: 8', meta: 'الإجراء المقترح: خفّضه إلى 5', badgeLabel: 'منخفض' },
      { title: 'باول دجاج', subtitle: 'المخزون الحالي: 0', meta: 'الإجراء المقترح: عطّله مؤقتًا', badgeLabel: 'منتهٍ' },
    ],
  },
  'inventory-update': {
    id: 'inventory-update',
    title: 'تحديث المخزون الجماعي',
    subtitle: 'راجع التحديثات الكبيرة للمخزون والأسعار قبل النشر النهائي.',
    heroTitle: 'مسار المخزون والكتالوج',
    heroDescription: 'هذا المسار يدعم الاستيراد بالجملة وتعديلات الأسعار المرحلية قبل الحفظ.',
    primaryLabel: 'نشر التحديث الجماعي',
    secondaryLabel: 'العودة إلى الدليل',
    metrics: [
      { label: 'العناصر المتاحة', value: '84', deltaLabel: 'مباشر الآن', tone: 'success' },
      { label: 'عناصر منخفضة', value: '12', deltaLabel: 'تحتاج مراجعة', tone: 'warning' },
      { label: 'تغييرات الأسعار', value: '7', deltaLabel: 'على دفعات', tone: 'info' },
    ],
    keyValues: [
      { label: 'البحث المركزي', value: 'مفعّل', tone: 'brand' },
      { label: 'الاستيراد', value: 'Excel / CSV' },
      { label: 'المراجعة', value: 'مرحلية', tone: 'warning' },
      { label: 'التكرار', value: 'محجوب', tone: 'success' },
    ],
    listItems: [
      { title: 'خريطة الاستيراد', subtitle: 'طابق الأعمدة قبل إدخال الدفعة.', meta: 'Excel / CSV', badgeLabel: 'Import' },
      { title: 'تعديل الأسعار', subtitle: 'غيّر الأسعار على دفعات من صفحة واحدة.', meta: 'Mass pricing', badgeLabel: 'Price' },
      { title: 'فحص التكرار', subtitle: 'لا تنشر إن كان المنتج موجودًا بالفعل.', meta: 'Dedupe-aware', badgeLabel: 'Check' },
    ],
  },
  'items-upsert': {
    id: 'items-upsert',
    title: 'إدخال منتج بالبحث أولًا',
    subtitle: 'ابحث في الكتالوج المركزي ثم اربط القالب قبل أي حفظ.',
    heroTitle: 'البحث ثم القالب ثم الحفظ',
    heroDescription: 'ابدأ بالبحث عن المنتج المعياري، ثم طابق Excel / CSV، ثم راجع النسخة قبل اعتمادها.',
    primaryLabel: 'حفظ المسودة',
    secondaryLabel: 'العودة إلى الدليل',
    inputLabel: 'ابحث عن المنتج',
    inputHint: 'ابدأ بـ SKU أو GTIN أو الاسم قبل إنشاء أي عنصر جديد.',
    keyValues: [
      { label: 'البحث الأول', value: 'مفعل', tone: 'brand' },
      { label: 'التكرار', value: 'ممنوع', tone: 'success' },
      { label: 'الاستيراد', value: 'Excel / CSV' },
      { label: 'المراجعة', value: 'مرحلية', tone: 'warning' },
    ],
    listItems: [
      { title: 'بحث الكتالوج المركزي', subtitle: 'اختر المنتج المعياري قبل أي إضافة جديدة.', meta: 'Lookup first', badgeLabel: 'Central' },
      { title: 'خريطة الأعمدة', subtitle: 'طابق الأعمدة قبل استيراد الدفعة.', meta: 'CSV mapping', badgeLabel: 'CSV' },
      { title: 'تعديل الأسعار', subtitle: 'غيّر السعر على أكثر من عنصر من نفس المسار.', meta: 'Mass edit', badgeLabel: 'Bulk' },
    ],
  },
  'order-accept': {
    id: 'order-accept',
    title: 'Order accept',
    subtitle: 'Accept the branch order and immediately move to preparation.',
    heroTitle: 'Branch acceptance checkpoint',
    heroDescription: 'Acceptance should happen once packaging capacity and item readiness are confirmed.',
    primaryLabel: 'Accept order',
    secondaryLabel: 'Open order details',
    keyValues: [
      { label: 'Order', value: '#1042' },
      { label: 'SLA risk', value: 'Low', tone: 'success' },
      { label: 'Next step', value: 'Preparation', tone: 'brand' },
    ],
  },
  'order-get': {
    id: 'order-get',
    title: 'Order get',
    subtitle: 'Open a focused branch read view for the active order.',
    heroTitle: 'Operational order snapshot',
    heroDescription: 'This view is intentionally compact and exposes only what the branch needs to decide next.',
    primaryLabel: 'Refresh order snapshot',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Customer', value: 'Omar A.' },
      { label: 'Basket value', value: '89 SAR' },
      { label: 'Current stage', value: 'Packed and ready', tone: 'brand' },
    ],
  },
  'order-handoff': {
    id: 'order-handoff',
    title: 'Order handoff',
    subtitle: 'Confirm branch-to-captain handoff once the package is ready.',
    heroTitle: 'Handoff confirmation',
    heroDescription: 'This step should happen only after packaging integrity and captain assignment are confirmed.',
    primaryLabel: 'Confirm handoff',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Assigned captain', value: 'Captain #9021' },
      { label: 'Handoff lane', value: 'Counter 2' },
      { label: 'Packaging', value: 'Sealed', tone: 'success' },
    ],
  },
  'order-issue-queue': {
    id: 'order-issue-queue',
    title: 'Order issue queue',
    subtitle: 'Keep escalated branch orders visible in one contained queue.',
    heroTitle: 'Issues needing branch action',
    heroDescription: 'Problems stay out of the happy-path queue but remain one tap away from the branch team.',
    primaryLabel: 'Open top issue',
    secondaryLabel: 'Back to support directory',
    listItems: [
      { title: 'Order #1051', subtitle: 'Customer requested address confirmation.', meta: 'Risk: late delivery', badgeLabel: 'Open' },
      { title: 'Order #1038', subtitle: 'One item unavailable after acceptance.', meta: 'Risk: substitution needed', badgeLabel: 'Escalated' },
    ],
  },
  'order-out-for-delivery': {
    id: 'order-out-for-delivery',
    title: 'Order out for delivery',
    subtitle: 'Monitor the order once it has left the branch with the captain.',
    heroTitle: 'Delivery handoff is active',
    heroDescription: 'The branch can observe ETA drift without switching to an external dispatch board.',
    primaryLabel: 'Refresh delivery state',
    secondaryLabel: 'Back to support directory',
    metrics: [
      { label: 'Captain ETA', value: '12 min', deltaLabel: 'To customer', tone: 'info' },
      { label: 'Delay risk', value: 'Low', deltaLabel: 'No action yet', tone: 'success' },
    ],
  },
  'order-prepare': {
    id: 'order-prepare',
    title: 'Order prepare',
    subtitle: 'Drive the branch preparation step before the order becomes ready.',
    heroTitle: 'Preparation workspace',
    heroDescription: 'This screen keeps prep ownership visible so branch staff do not jump prematurely to handoff.',
    primaryLabel: 'Mark preparation complete',
    secondaryLabel: 'Back to support directory',
    listItems: [
      { title: 'Packaging', subtitle: 'Seal hot items and add beverages separately.', meta: 'Status: in progress', badgeLabel: 'Current' },
      { title: 'Cutlery', subtitle: 'Customer requested disposable cutlery.', meta: 'Status: pending', badgeLabel: 'Check' },
    ],
  },
  'order-ready': {
    id: 'order-ready',
    title: 'Order ready',
    subtitle: 'Close branch preparation and expose the order as handoff-ready.',
    heroTitle: 'Ready-to-release checkpoint',
    heroDescription: 'Once confirmed, the branch should immediately move into the handoff lane.',
    primaryLabel: 'Confirm ready status',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Package status', value: 'Closed and labeled', tone: 'success' },
      { label: 'Captain assigned', value: 'Yes' },
      { label: 'Handoff lane', value: 'Counter 2' },
    ],
  },
  'order-reject': {
    id: 'order-reject',
    title: 'Order reject',
    subtitle: 'Reject the branch order with a visible operational reason.',
    heroTitle: 'Rejection is exceptional',
    heroDescription: 'When rejection is necessary, the reason should remain explicit for downstream support and customer handling.',
    primaryLabel: 'Reject order',
    secondaryLabel: 'Back to support directory',
    inputLabel: 'Rejection reason',
    inputHint: 'Example: branch unavailable due to equipment outage.',
  },
  'order-store-delivered': {
    id: 'order-store-delivered',
    title: 'Order store delivered',
    subtitle: 'Confirm store-side completion when the branch is the delivery endpoint.',
    heroTitle: 'Store delivery closure',
    heroDescription: 'This view is used for branch-side receipt confirmation before the order can fully close.',
    primaryLabel: 'Confirm store delivery',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Receiver', value: 'Branch supervisor' },
      { label: 'Receipt proof', value: 'Pending code verification', tone: 'warning' },
      { label: 'Next step', value: 'Close order', tone: 'brand' },
    ],
  },
  'quick-reply-config': {
    id: 'quick-reply-config',
    title: 'Quick reply config',
    subtitle: 'Review the currently published quick-reply presets.',
    heroTitle: 'Branch communication presets',
    heroDescription: 'Quick replies keep customer and captain messaging short, repeatable, and auditable.',
    primaryLabel: 'Refresh quick replies',
    secondaryLabel: 'Back to support directory',
    listItems: [
      { title: 'Order ready', subtitle: 'Your order is packed and ready for pickup.', meta: 'Enabled for customer and captain', badgeLabel: 'Live' },
      { title: 'Delay note', subtitle: 'We need 5 more minutes to finish the order.', meta: 'Enabled for customer only', badgeLabel: 'Live' },
    ],
  },
  'quick-reply-settings': {
    id: 'quick-reply-settings',
    title: 'Quick reply settings',
    subtitle: 'Adjust branch quick-reply usage and channel scope.',
    heroTitle: 'Communication policy',
    heroDescription: 'Keep quick replies aligned with the branch voice and escalation rules.',
    primaryLabel: 'Save quick-reply settings',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Customer channel', value: 'Enabled' },
      { label: 'Captain channel', value: 'Enabled' },
      { label: 'Escalation fallback', value: 'Manual reply required', tone: 'brand' },
    ],
  },
  'quick-reply-setup': {
    id: 'quick-reply-setup',
    title: 'Quick reply setup',
    subtitle: 'Create a new quick-reply preset for operational messaging.',
    heroTitle: 'New preset creation',
    heroDescription: 'The preset should express one action clearly and avoid conversational drift.',
    primaryLabel: 'Create preset',
    secondaryLabel: 'Back to support directory',
    inputLabel: 'Quick reply text',
    inputHint: 'Example: captain is 3 minutes away from the branch.',
  },
  'store-nomination': {
    id: 'store-nomination',
    title: 'Store nomination',
    subtitle: 'Nominate a new store or branch for DSH activation.',
    heroTitle: 'New branch candidate',
    heroDescription: 'Nomination stays operationally lightweight until the intake process starts formally.',
    primaryLabel: 'Submit nomination',
    secondaryLabel: 'Back to support directory',
    inputLabel: 'Nomination summary',
    inputHint: 'Example: northern branch with strong delivery demand and verified kitchen readiness.',
  },
};

function renderSupportState(state: Exclude<PartnerSupportScreenState, 'ready' | 'disabled'>, onRetry?: () => void, onBack?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="لا يوجد محتوى دعم محمّل"
        description="أعد تحميل شاشة الدعم وابقِ السياق التشغيلي واضحًا."
        actionLabel={onRetry ? 'إعادة التحميل' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <StateView
        stateId="offline"
        title="شاشة الدعم غير متصلة"
        description="أعد المحاولة عند عودة الاتصال. يجب أن يبقى السياق التشغيلي ثابتًا."
        actionLabel={onRetry ? 'إعادة المحاولة' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <StateView
        stateId="success"
        title="اكتمل الإجراء بنجاح"
        description="انتهت العملية ويمكن للفرع متابعة الخطوة التالية من نفس المسار."
        actionLabel={onBack ? 'العودة إلى الدليل' : undefined}
        onActionPress={onBack}
      />
    );
  }

  return (
    <StateView
      stateId="recoverableError"
      title="تعذّر عرض شاشة الدعم"
      description="أعد المحاولة في الخطوة نفسها دون فقدان سياق الفرع."
      actionLabel={onRetry ? 'إعادة المحاولة' : undefined}
      onActionPress={onRetry}
    />
  );
}

function createPartnerSupportScreen(config: SupportConfig) {
  return function GeneratedPartnerSupportScreen({
    state = 'ready',
    onPrimaryAction,
    onSecondaryAction,
    onRetry,
    onBack,
  }: PartnerGeneratedSupportScreenProps) {
    const [draftValue, setDraftValue] = React.useState('');

    const isDisabled = state === 'disabled';

    return (
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
        <MobileWorkspaceHeader
          title={config.title}
          description={config.subtitle}
          icon="sparkles-outline"
          onBack={onBack}
        />

        {state !== 'ready' && state !== 'disabled' ? (
          renderSupportState(state, onRetry, onBack)
        ) : (
          <>
            <Surface tone="brand" gap={3}>
              <SectionHeader title={config.heroTitle} subtitle={config.heroDescription} />
              {config.primaryHint ? (
                <Text role="bodySm" tone="inverse">
                  {config.primaryHint}
                </Text>
              ) : null}
              {config.metrics?.map((metric) => (
                <StatCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  deltaLabel={metric.deltaLabel}
                  tone={metric.tone ?? 'default'}
                />
              ))}
            </Surface>

            {config.keyValues?.length ? (
              <Surface tone="raised" gap={3}>
                <SectionHeader title="تفاصيل تشغيلية" subtitle="احتفظ فقط بالبيانات اللازمة للقرار الحالي." />
                <KeyValueList items={config.keyValues} />
              </Surface>
            ) : null}

            {config.listItems?.length ? (
              <Surface tone="default" gap={3}>
                <SectionHeader title="العناصر الحالية" subtitle="تظل القائمة مختصرة حتى يتحرك المشغّل دون ضجيج." />
                <Box gap={2}>
                  {config.listItems.map((item) => (
                    <ListItem
                      key={`${config.id}-${item.title}`}
                      title={item.title}
                      subtitle={item.subtitle}
                      meta={item.meta}
                      badgeLabel={item.badgeLabel}
                    />
                  ))}
                </Box>
              </Surface>
            ) : null}

            {config.inputLabel ? (
              <Surface tone="raised" gap={3}>
                <SectionHeader title="مدخل مختصر" subtitle="لا نجمع إلا إدخالًا واحدًا واضحًا في كل مرة." />
                <TextField
                  label={config.inputLabel}
                  value={draftValue}
                  onChangeText={setDraftValue}
                  hint={config.inputHint}
                  editable={!isDisabled}
                />
              </Surface>
            ) : null}

            <Button label={config.primaryLabel} onPress={onPrimaryAction} disabled={isDisabled} />
            {config.secondaryLabel ? (
              <Button label={config.secondaryLabel} tone="secondary" onPress={onSecondaryAction ?? onBack} />
            ) : null}
          </>
        )}
      </MobileScrollView>
    );
  };
}

type PartnerVideoDraft = {
  title: string;
  subtitle: string;
  videoUrl: string;
  posterUrl: string;
  routeTarget: MarketingGrowthRouteTarget;
  routeTargetId: string;
  routeTargetExtra: string;
  ctaLabel: string;
  highlight: string;
  accentColor: string;
};

function createPartnerVideoDraft(): PartnerVideoDraft {
  return {
    title: 'فيديو شريك جديد',
    subtitle: 'تم رفع الفيديو من تطبيق الشريك ويحتاج موافقة التسويق قبل الظهور للعميل.',
    videoUrl: '',
    posterUrl: '',
    routeTarget: 'home',
    routeTargetId: '',
    routeTargetExtra: '',
    ctaLabel: 'راجع الفيديو',
    highlight: 'بانتظار التسويق',
    accentColor: '#0f766e',
  };
}

function routeTargetLabel(target: MarketingGrowthRouteTarget) {
  if (target === 'home') return 'الرئيسية';
  if (target === 'main_category') return 'فئة رئيسية';
  if (target === 'sub_category') return 'فئة فرعية';
  if (target === 'store') return 'متجر';
  if (target === 'store_category') return 'متجر + فئة';
  if (target === 'product') return 'منتج';
  if (target === 'subscription') return 'اشتراك';
  if (target === 'search') return 'بحث';
  if (target === 'promo-apply') return 'العروض';
  return 'الرئيسية';
}

function routeTargetPrimaryLabel(target: MarketingGrowthRouteTarget) {
  if (target === 'store') return 'معرّف المتجر';
  if (target === 'product') return 'معرّف المنتج';
  return 'معرّف الفئة';
}

function routeTargetPrimaryHint(target: MarketingGrowthRouteTarget) {
  if (target === 'store') return 'مثال: store-1001';
  if (target === 'product') return 'مثال: item-apple-1';
  return 'مثال: grocery أو restaurants';
}

function routeTargetNeedsPrimaryInput(target: MarketingGrowthRouteTarget) {
  return target === 'main_category' || target === 'sub_category' || target === 'store' || target === 'store_category' || target === 'product';
}

function routeTargetNeedsSecondaryInput(target: MarketingGrowthRouteTarget) {
  return target === 'store_category' || target === 'product';
}

function routeTargetSecondaryLabel(target: MarketingGrowthRouteTarget) {
  if (target === 'store_category') return 'معرّف الفئة';
  if (target === 'product') return 'معرّف المتجر';
  return 'معرّف إضافي';
}

function routeTargetSecondaryHint(target: MarketingGrowthRouteTarget) {
  if (target === 'store_category') return 'مثال: grocery_vegetables_fruits';
  if (target === 'product') return 'مثال: store-1001';
  return 'معرّف إضافي';
}

export function DshPartnerVideoUploadScreen({
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
  onBack,
}: PartnerGeneratedSupportScreenProps) {
  const [draft, setDraft] = React.useState<PartnerVideoDraft>(() => createPartnerVideoDraft());
  const [queueVersion, setQueueVersion] = React.useState(0);
  const screenTitle = 'رفع الفيديو';
  const screenSubtitle = 'يرفع الشريك الفيديو القصير هنا ثم يذهب للتسويق للموافقة قبل ظهور العميل.';
  const heroTitle = 'مسار رفع فيديو الشريك';
  const heroDescription = 'أي فيديو يرفعه الشريك يدخل طابور المراجعة أولًا، ثم يُنشر بعد الاعتماد فقط.';

  const queuedVideos = React.useMemo(
    () => getMarketingGrowthItems().filter((item) => item.family === 'shorts'),
    [queueVersion]
  );

  const queueMetrics = React.useMemo(() => {
    const pendingMarketing = queuedVideos.filter((item) => item.status === 'pending-marketing').length;
    const published = queuedVideos.filter((item) => item.status === 'published').length;

    return [
      { label: 'في المراجعة', value: String(pendingMarketing), tone: 'warning' as const },
      { label: 'منشور', value: String(published), tone: 'success' as const },
      { label: 'إجمالي الفيديوهات', value: String(queuedVideos.length), tone: 'info' as const },
    ];
  }, [queuedVideos]);

  if (state !== 'ready' && state !== 'disabled') {
    return renderSupportState(state, onRetry, onBack);
  }

  const isDisabled = state === 'disabled';

  function refreshQueue() {
    setQueueVersion((current) => current + 1);
  }

  function handleSubmit() {
    const saved = upsertMarketingGrowthItem({
      title: draft.title.trim() || 'فيديو شريك جديد',
      subtitle: draft.subtitle.trim() || 'تم رفع الفيديو من تطبيق الشريك.',
      family: 'shorts',
      status: 'pending-marketing',
      audience: 'client',
      source: 'partner',
      routeTarget: draft.routeTarget,
      routeTargetId: draft.routeTargetId.trim() || undefined,
      routeTargetExtra: draft.routeTargetExtra.trim() || undefined,
      ctaLabel: draft.ctaLabel.trim() || 'راجع الفيديو',
      highlight: draft.highlight.trim() || 'بانتظار التسويق',
      metricValue: 'مرفق جديد',
      accentColor: draft.accentColor.trim() || '#0f766e',
      videoUrl: draft.videoUrl.trim() || undefined,
      posterUrl: draft.posterUrl.trim() || undefined,
      impressions: 0,
      clicks: 0,
    });

    setDraft(createPartnerVideoDraft());
    refreshQueue();
    onPrimaryAction?.();
    return saved;
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">{screenTitle}</Text>
        <Text role="bodyMd" tone="muted">
          {screenSubtitle}
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader title={heroTitle} subtitle={heroDescription} />
        <Text role="bodySm" tone="inverse">
          أي فيديو يرفعه الشريك يدخل في طابور التسويق أولًا، ثم يُنشر فقط بعد الموافقة.
        </Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {queueMetrics.map((metric) => (
            <StatCard key={metric.label} label={metric.label} value={metric.value} tone={metric.tone} />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="بيانات الفيديو" subtitle="رفع واحد واضح ثم مراجعة واحدة واضحة من التسويق." />
        <TextField label="عنوان الفيديو" value={draft.title} onChangeText={(value) => setDraft((current) => ({ ...current, title: value }))} />
        <TextField label="وصف الفيديو" value={draft.subtitle} onChangeText={(value) => setDraft((current) => ({ ...current, subtitle: value }))} multiline numberOfLines={3} />
        <TextField label="رابط الفيديو" value={draft.videoUrl} onChangeText={(value) => setDraft((current) => ({ ...current, videoUrl: value }))} hint="مثال: /media/shorts/partner-launch.mp4" />
        <TextField label="صورة الغلاف" value={draft.posterUrl} onChangeText={(value) => setDraft((current) => ({ ...current, posterUrl: value }))} hint="مثال: /media/shorts/partner-launch.jpg" />

        <Tabs<MarketingGrowthRouteTarget>
          items={[
            { value: 'home', label: 'الرئيسية' },
            { value: 'main_category', label: 'فئة رئيسية' },
            { value: 'sub_category', label: 'فئة فرعية' },
            { value: 'store', label: 'متجر' },
            { value: 'store_category', label: 'متجر + فئة' },
            { value: 'product', label: 'منتج' },
            { value: 'subscription', label: 'اشتراك' },
            { value: 'search', label: 'بحث' },
          ]}
          value={draft.routeTarget}
          onValueChange={(value: MarketingGrowthRouteTarget) => setDraft((current) => ({ ...current, routeTarget: value }))}
          variant="pill"
        />

        <Surface tone="inset" gap={2}>
          <Text role="bodyStrong">الوجهة المباشرة</Text>
          <Text role="bodySm" tone="muted">{routeTargetLabel(draft.routeTarget)} · هذا هو المسار الذي يفتحه CTA داخل الريلز.</Text>
        </Surface>

        {routeTargetNeedsPrimaryInput(draft.routeTarget) ? (
          <TextField label={routeTargetPrimaryLabel(draft.routeTarget)} value={draft.routeTargetId} onChangeText={(value) => setDraft((current) => ({ ...current, routeTargetId: value }))} hint={routeTargetPrimaryHint(draft.routeTarget)} />
        ) : null}

        {routeTargetNeedsSecondaryInput(draft.routeTarget) ? (
          <TextField label={routeTargetSecondaryLabel(draft.routeTarget)} value={draft.routeTargetExtra} onChangeText={(value) => setDraft((current) => ({ ...current, routeTargetExtra: value }))} hint={routeTargetSecondaryHint(draft.routeTarget)} />
        ) : null}

        <TextField label="نص الزر" value={draft.ctaLabel} onChangeText={(value) => setDraft((current) => ({ ...current, ctaLabel: value }))} />
        <TextField label="الجملة البارزة" value={draft.highlight} onChangeText={(value) => setDraft((current) => ({ ...current, highlight: value }))} />
        <TextField label="لون التمييز" value={draft.accentColor} onChangeText={(value) => setDraft((current) => ({ ...current, accentColor: value }))} hint="مثال: #0f766e" />
      </Surface>

      <Surface tone="inset" gap={3}>
        <SectionHeader title="المدخل الحالي" subtitle="لا يظهر هذا الفيديو للعميل حتى يوافق عليه التسويق." />
        <Box gap={1}>
          <Text role="bodyStrong">{draft.title}</Text>
          <Text role="bodySm" tone="muted">{draft.subtitle}</Text>
        </Box>
      </Surface>

      <Button label="إرسال الفيديو للمراجعة" onPress={handleSubmit} disabled={isDisabled} />
      <Button label="العودة إلى دليل الدعم" tone="secondary" onPress={onSecondaryAction ?? onBack} />

      <Surface tone="raised" gap={3}>
        <SectionHeader title="الفيديوهات الحالية" subtitle="هنا ترى ما هو في المراجعة أو ما تم نشره بالفعل." />
        <Box gap={2}>
          {queuedVideos.length > 0 ? queuedVideos.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={`${item.subtitle} · ${item.source === 'partner' ? 'من الشريك' : 'من التسويق'}`}
              meta={`${item.status === 'pending-marketing' ? 'في المراجعة' : item.status === 'published' ? 'منشور' : item.status === 'paused' ? 'موقوف' : 'مسودة'} · ${item.ctaLabel}`}
              badgeLabel="شورتات"
            />
          )) : (
            <Text role="bodySm" tone="muted">لا توجد فيديوهات محفوظة بعد.</Text>
          )}
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

export const DshPartnerAuctionStatusUpdateScreen = createPartnerSupportScreen(partnerSupportConfigs['auction-status-update']);
export const DshPartnerChatReadAckScreen = createPartnerSupportScreen(partnerSupportConfigs['chat-read-ack']);
export const DshPartnerChatSendScreen = createPartnerSupportScreen(partnerSupportConfigs['chat-send']);
export const DshPartnerDocUploadScreen = createPartnerSupportScreen(partnerSupportConfigs['doc-upload']);
export const DshPartnerIntakeStartScreen = createPartnerSupportScreen(partnerSupportConfigs['intake-start']);
export const DshPartnerInventoryAdjustScreen = createPartnerSupportScreen(partnerSupportConfigs['inventory-adjust']);
export const DshPartnerInventoryUpdateScreen = createPartnerSupportScreen(partnerSupportConfigs['inventory-update']);
export const DshPartnerItemsUpsertScreen = createPartnerSupportScreen(partnerSupportConfigs['items-upsert']);
export const DshPartnerOrderAcceptScreen = createPartnerSupportScreen(partnerSupportConfigs['order-accept']);
export const DshPartnerOrderGetScreen = createPartnerSupportScreen(partnerSupportConfigs['order-get']);
export const DshPartnerOrderHandoffScreen = createPartnerSupportScreen(partnerSupportConfigs['order-handoff']);
export const DshPartnerOrderIssueQueueScreen = createPartnerSupportScreen(partnerSupportConfigs['order-issue-queue']);
export const DshPartnerOrderOutForDeliveryScreen = createPartnerSupportScreen(partnerSupportConfigs['order-out-for-delivery']);
export const DshPartnerOrderPrepareScreen = createPartnerSupportScreen(partnerSupportConfigs['order-prepare']);
export const DshPartnerOrderReadyScreen = createPartnerSupportScreen(partnerSupportConfigs['order-ready']);
export const DshPartnerOrderRejectScreen = createPartnerSupportScreen(partnerSupportConfigs['order-reject']);
export const DshPartnerOrderStoreDeliveredScreen = createPartnerSupportScreen(partnerSupportConfigs['order-store-delivered']);
export const DshPartnerQuickReplyConfigGetScreen = createPartnerSupportScreen(partnerSupportConfigs['quick-reply-config']);
export const DshPartnerQuickReplySettingsScreen = createPartnerSupportScreen(partnerSupportConfigs['quick-reply-settings']);
export const DshPartnerQuickReplySetupScreen = createPartnerSupportScreen(partnerSupportConfigs['quick-reply-setup']);
export const DshPartnerStoreNominationScreen = createPartnerSupportScreen(partnerSupportConfigs['store-nomination']);