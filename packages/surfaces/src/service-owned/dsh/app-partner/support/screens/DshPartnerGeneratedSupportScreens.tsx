import React from 'react';
import {
  BthBox,
  BthButton,
  BthKeyValueList,
  BthListItem,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthStatCard,
  BthSurface,
  BthText,
  BthTextField,
} from '@bthwani/ui-kit';

export type PartnerSupportScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'success' | 'disabled';

export type PartnerSupportScreenId =
  | 'auction-status-update'
  | 'audience-insights'
  | 'chat-read-ack'
  | 'chat-send'
  | 'commission-by-mode'
  | 'doc-upload'
  | 'identity-submit'
  | 'intake-start'
  | 'inventory-adjust'
  | 'inventory-update'
  | 'items-upsert'
  | 'listing-status-update'
  | 'manager-invite'
  | 'order-accept'
  | 'order-get'
  | 'order-handoff'
  | 'order-issue-queue'
  | 'order-out-for-delivery'
  | 'order-prepare'
  | 'order-ready'
  | 'order-reject'
  | 'order-store-delivered'
  | 'profile-get'
  | 'quick-reply-config'
  | 'quick-reply-settings'
  | 'quick-reply-setup'
  | 'staff-analytics'
  | 'store-nomination'
  | 'store-service-modes-update'
  | 'store-status-update'
  | 'store-update'
  | 'subscription';

type SupportMetric = {
  label: string;
  value: string;
  deltaLabel?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
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
  'audience-insights': {
    id: 'audience-insights',
    title: 'Audience insights',
    subtitle: 'Review branch reach, return rate, and high-value segments before adjusting offers.',
    heroTitle: 'Branch demand mix',
    heroDescription: 'Partner staff can review who orders most often and where demand is concentrating.',
    primaryLabel: 'Refresh insights',
    secondaryLabel: 'Back to support directory',
    metrics: [
      { label: 'Repeat customers', value: '61%', deltaLabel: '7-day share', tone: 'success' },
      { label: 'High-value orders', value: '18', deltaLabel: 'Above 120 SAR', tone: 'info' },
      { label: 'Dormant segment', value: '9%', deltaLabel: 'Needs reactivation', tone: 'warning' },
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
  'commission-by-mode': {
    id: 'commission-by-mode',
    title: 'Commission by mode',
    subtitle: 'Compare commission impact across delivery, pickup, and scheduled modes.',
    heroTitle: 'Commercial operating mix',
    heroDescription: 'This view helps the branch evaluate margin impact before enabling or disabling service modes.',
    primaryLabel: 'Refresh commission snapshot',
    secondaryLabel: 'Back to support directory',
    metrics: [
      { label: 'Delivery', value: '18%', deltaLabel: 'Net commission', tone: 'default' },
      { label: 'Pickup', value: '11%', deltaLabel: 'Net commission', tone: 'success' },
      { label: 'Scheduled', value: '15%', deltaLabel: 'Net commission', tone: 'info' },
    ],
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
  'identity-submit': {
    id: 'identity-submit',
    title: 'Identity submit',
    subtitle: 'Capture the branch owner or manager identity pack for verification.',
    heroTitle: 'Identity verification',
    heroDescription: 'Identity capture stays separate from store profile editing so compliance remains audit-friendly.',
    primaryLabel: 'Submit identity pack',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Owner name', value: 'Khaled A.' },
      { label: 'Document status', value: 'Pending submission', tone: 'warning' },
      { label: 'Verification SLA', value: '24 hours' },
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
    title: 'Inventory adjust',
    subtitle: 'Apply fast stock corrections without reopening the full catalog workflow.',
    heroTitle: 'Real-time stock correction',
    heroDescription: 'Use this screen when only quantities or urgent availability must be adjusted.',
    primaryLabel: 'Apply stock adjustment',
    secondaryLabel: 'Open full inventory update',
    listItems: [
      { title: 'Classic burger', subtitle: 'Current stock: 8', meta: 'Suggested action: set to 5', badgeLabel: 'Low stock' },
      { title: 'Chicken bowl', subtitle: 'Current stock: 0', meta: 'Suggested action: disable temporarily', badgeLabel: 'Out' },
    ],
  },
  'inventory-update': {
    id: 'inventory-update',
    title: 'Inventory update',
    subtitle: 'Review the broader catalog inventory posture for the branch.',
    heroTitle: 'Inventory workspace',
    heroDescription: 'This view supports bulk refresh decisions, not just emergency item corrections.',
    primaryLabel: 'Publish inventory update',
    secondaryLabel: 'Back to support directory',
    metrics: [
      { label: 'Available items', value: '84', deltaLabel: 'Live now', tone: 'success' },
      { label: 'Low stock items', value: '12', deltaLabel: 'Need review', tone: 'warning' },
      { label: 'Disabled items', value: '7', deltaLabel: 'Hidden from menu', tone: 'danger' },
    ],
  },
  'items-upsert': {
    id: 'items-upsert',
    title: 'Items upsert',
    subtitle: 'Create or update branch items from one focused product workspace.',
    heroTitle: 'Catalog maintenance',
    heroDescription: 'Keep name, price, and availability aligned without scattering controls across multiple views.',
    primaryLabel: 'Save item update',
    secondaryLabel: 'Back to support directory',
    inputLabel: 'Item summary',
    inputHint: 'Example: double cheeseburger, 29 SAR, spicy sauce optional.',
  },
  'listing-status-update': {
    id: 'listing-status-update',
    title: 'Listing status update',
    subtitle: 'Change storefront visibility while keeping branch operations intact.',
    heroTitle: 'Customer-facing listing state',
    heroDescription: 'Listing visibility is separated from branch-open status so teams can pause discovery without closing the store.',
    primaryLabel: 'Update listing status',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Current visibility', value: 'Visible' },
      { label: 'Reason preset', value: 'Menu refresh' },
      { label: 'Expected restore', value: '20 min' },
    ],
  },
  'manager-invite': {
    id: 'manager-invite',
    title: 'Manager invite',
    subtitle: 'Invite a new branch manager with constrained operational access.',
    heroTitle: 'Role-controlled branch access',
    heroDescription: 'Manager access can be expanded later, but invitation stays one explicit operational step.',
    primaryLabel: 'Send invite',
    secondaryLabel: 'Back to support directory',
    inputLabel: 'Manager email or phone',
    inputHint: 'Example: branch.manager@bthwani.sa',
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
  'profile-get': {
    id: 'profile-get',
    title: 'Partner profile',
    subtitle: 'Read the current branch profile and ownership summary.',
    heroTitle: 'Branch identity snapshot',
    heroDescription: 'Use this view to validate the currently active branch profile before applying updates.',
    primaryLabel: 'Refresh profile',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Store', value: 'Burger Lab' },
      { label: 'Branch manager', value: 'Khaled A.' },
      { label: 'Verification', value: 'Approved', tone: 'success' },
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
  'staff-analytics': {
    id: 'staff-analytics',
    title: 'Staff analytics',
    subtitle: 'Review branch staffing rhythm and execution load.',
    heroTitle: 'Branch team visibility',
    heroDescription: 'This screen helps the branch understand staffing pressure before service quality degrades.',
    primaryLabel: 'Refresh staff analytics',
    secondaryLabel: 'Back to support directory',
    metrics: [
      { label: 'Avg prep time', value: '11 min', deltaLabel: 'Today', tone: 'default' },
      { label: 'Active packers', value: '3', deltaLabel: 'Current shift', tone: 'info' },
      { label: 'Load spikes', value: '2', deltaLabel: 'Last 4 hours', tone: 'warning' },
    ],
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
  'store-service-modes-update': {
    id: 'store-service-modes-update',
    title: 'Store service modes update',
    subtitle: 'Publish service mode availability from a focused branch control surface.',
    heroTitle: 'Mode publication',
    heroDescription: 'This view separates mode publication from the broader maintenance workspace when a precise audit trail is needed.',
    primaryLabel: 'Publish service mode changes',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Delivery', value: 'Enabled', tone: 'success' },
      { label: 'Pickup', value: 'Enabled', tone: 'success' },
      { label: 'Scheduled', value: 'Disabled', tone: 'warning' },
    ],
  },
  'store-status-update': {
    id: 'store-status-update',
    title: 'Store status update',
    subtitle: 'Change whether the branch is open for DSH operations.',
    heroTitle: 'Branch live state',
    heroDescription: 'Closing the branch should remain a deliberate decision with a visible operational reason.',
    primaryLabel: 'Update store status',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Current state', value: 'Open' },
      { label: 'Reason preset', value: 'Temporary pause' },
      { label: 'Restore target', value: '15 min' },
    ],
  },
  'store-update': {
    id: 'store-update',
    title: 'Store update',
    subtitle: 'Apply store profile changes from a dedicated branch-edit screen.',
    heroTitle: 'Branch profile editing',
    heroDescription: 'Use this workspace for structural branch edits that should not be mixed with order flow decisions.',
    primaryLabel: 'Save store updates',
    secondaryLabel: 'Back to support directory',
    inputLabel: 'Store update summary',
    inputHint: 'Example: branch phone, contact email, and branch note changes.',
  },
  subscription: {
    id: 'subscription',
    title: 'بثواني برو',
    subtitle: 'مراجعة حالة الاشتراك، العائلة، ومسار الترقية من صفحة واحدة.',
    heroTitle: 'الاشتراك التجاري',
    heroDescription: 'تظهر الخطة الحالية والمزامنة والعائلة بوضوح حتى تبقى قرارات الفرع سريعة ومفهومة.',
    primaryLabel: 'إدارة الاشتراك',
    secondaryLabel: 'العودة إلى الدليل',
    primaryHint: 'العائلة حزمة داخل بثواني برو وليست منتجًا منفصلًا.',
    keyValues: [
      { label: 'الخطة الحالية', value: 'بثواني برو', tone: 'brand' },
      { label: 'العائلة', value: 'مفعلة' },
      { label: 'الترقية', value: 'متاحة الآن', tone: 'warning' },
      { label: 'المزامنة', value: 'مباشر', tone: 'success' },
    ],
    metrics: [
      { label: 'الخطة الحالية', value: 'فردي / عائلي', deltaLabel: 'قابلة للترقية', tone: 'info' },
      { label: 'التجديد', value: 'قريب', deltaLabel: 'واضح وسريع', tone: 'default' },
      { label: 'المزامنة', value: 'مباشر', deltaLabel: 'بدون ضوضاء', tone: 'success' },
    ],
    listItems: [
      { title: 'الخطة الحالية', subtitle: 'اعرض الباقة النشطة قبل أي تعديل.', meta: 'بثواني برو', badgeLabel: 'رئيسي' },
      { title: 'أفراد العائلة', subtitle: 'أضف أو راجع الأفراد المرتبطين بالخطة.', meta: 'إدارة', badgeLabel: 'عائلة' },
      { title: 'المزامنة', subtitle: 'حدّث الحالة الحالية من نفس السطح.', meta: 'تحديث', badgeLabel: 'مباشر' },
      { title: 'الترقية', subtitle: 'انتقل إلى باقة أعلى عند الحاجة.', meta: 'CTA', badgeLabel: 'ترقية' },
    ],
  },
};

function renderSupportState(state: Exclude<PartnerSupportScreenState, 'ready' | 'disabled'>, onRetry?: () => void, onBack?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
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
      <BthStateView
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
      <BthStateView
        stateId="success"
        title="اكتمل الإجراء بنجاح"
        description="انتهت العملية ويمكن للفرع متابعة الخطوة التالية من نفس المسار."
        actionLabel={onBack ? 'العودة إلى الدليل' : undefined}
        onActionPress={onBack}
      />
    );
  }

  return (
    <BthStateView
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

    if (state !== 'ready' && state !== 'disabled') {
      return renderSupportState(state, onRetry, onBack);
    }

    const isDisabled = state === 'disabled';

    return (
      <BthMobileScrollView padding={4} gap={4}>
        <BthBox gap={2}>
          <BthText role="titleLg">{config.title}</BthText>
          <BthText role="bodyMd" tone="muted">
            {config.subtitle}
          </BthText>
        </BthBox>

        <BthSurface tone="brand" gap={3}>
          <BthSectionHeader title={config.heroTitle} subtitle={config.heroDescription} />
          {config.primaryHint ? (
            <BthText role="bodySm" tone="inverse">
              {config.primaryHint}
            </BthText>
          ) : null}
          {config.metrics?.map((metric) => (
            <BthStatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              deltaLabel={metric.deltaLabel}
              tone={metric.tone ?? 'default'}
            />
          ))}
        </BthSurface>

        {config.keyValues?.length ? (
          <BthSurface tone="raised" gap={3}>
            <BthSectionHeader title="تفاصيل تشغيلية" subtitle="احتفظ فقط بالبيانات اللازمة للقرار الحالي." />
            <BthKeyValueList items={config.keyValues} />
          </BthSurface>
        ) : null}

        {config.listItems?.length ? (
          <BthSurface tone="default" gap={3}>
            <BthSectionHeader title="العناصر الحالية" subtitle="تظل القائمة مختصرة حتى يتحرك المشغّل دون ضجيج." />
            <BthBox gap={2}>
              {config.listItems.map((item) => (
                <BthListItem
                  key={`${config.id}-${item.title}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  badgeLabel={item.badgeLabel}
                />
              ))}
            </BthBox>
          </BthSurface>
        ) : null}

        {config.inputLabel ? (
          <BthSurface tone="raised" gap={3}>
            <BthSectionHeader title="مدخل مختصر" subtitle="لا نجمع إلا إدخالًا واحدًا واضحًا في كل مرة." />
            <BthTextField
              label={config.inputLabel}
              value={draftValue}
              onChangeText={setDraftValue}
              hint={config.inputHint}
              editable={!isDisabled}
            />
          </BthSurface>
        ) : null}

        <BthButton label={config.primaryLabel} onPress={onPrimaryAction} disabled={isDisabled} />
        {config.secondaryLabel ? (
          <BthButton label={config.secondaryLabel} tone="secondary" onPress={onSecondaryAction ?? onBack} />
        ) : null}
      </BthMobileScrollView>
    );
  };
}

export const DshPartnerAuctionStatusUpdateScreen = createPartnerSupportScreen(partnerSupportConfigs['auction-status-update']);
export const DshPartnerAudienceInsightsGetScreen = createPartnerSupportScreen(partnerSupportConfigs['audience-insights']);
export const DshPartnerChatReadAckScreen = createPartnerSupportScreen(partnerSupportConfigs['chat-read-ack']);
export const DshPartnerChatSendScreen = createPartnerSupportScreen(partnerSupportConfigs['chat-send']);
export const DshPartnerCommissionByModeGetScreen = createPartnerSupportScreen(partnerSupportConfigs['commission-by-mode']);
export const DshPartnerDocUploadScreen = createPartnerSupportScreen(partnerSupportConfigs['doc-upload']);
export const DshPartnerIdentitySubmitScreen = createPartnerSupportScreen(partnerSupportConfigs['identity-submit']);
export const DshPartnerIntakeStartScreen = createPartnerSupportScreen(partnerSupportConfigs['intake-start']);
export const DshPartnerInventoryAdjustScreen = createPartnerSupportScreen(partnerSupportConfigs['inventory-adjust']);
export const DshPartnerInventoryUpdateScreen = createPartnerSupportScreen(partnerSupportConfigs['inventory-update']);
export const DshPartnerItemsUpsertScreen = createPartnerSupportScreen(partnerSupportConfigs['items-upsert']);
export const DshPartnerListingStatusUpdateScreen = createPartnerSupportScreen(partnerSupportConfigs['listing-status-update']);
export const DshPartnerManagerInviteScreen = createPartnerSupportScreen(partnerSupportConfigs['manager-invite']);
export const DshPartnerOrderAcceptScreen = createPartnerSupportScreen(partnerSupportConfigs['order-accept']);
export const DshPartnerOrderGetScreen = createPartnerSupportScreen(partnerSupportConfigs['order-get']);
export const DshPartnerOrderHandoffScreen = createPartnerSupportScreen(partnerSupportConfigs['order-handoff']);
export const DshPartnerOrderIssueQueueScreen = createPartnerSupportScreen(partnerSupportConfigs['order-issue-queue']);
export const DshPartnerOrderOutForDeliveryScreen = createPartnerSupportScreen(partnerSupportConfigs['order-out-for-delivery']);
export const DshPartnerOrderPrepareScreen = createPartnerSupportScreen(partnerSupportConfigs['order-prepare']);
export const DshPartnerOrderReadyScreen = createPartnerSupportScreen(partnerSupportConfigs['order-ready']);
export const DshPartnerOrderRejectScreen = createPartnerSupportScreen(partnerSupportConfigs['order-reject']);
export const DshPartnerOrderStoreDeliveredScreen = createPartnerSupportScreen(partnerSupportConfigs['order-store-delivered']);
export const DshPartnerProfileGetScreen = createPartnerSupportScreen(partnerSupportConfigs['profile-get']);
export const DshPartnerQuickReplyConfigGetScreen = createPartnerSupportScreen(partnerSupportConfigs['quick-reply-config']);
export const DshPartnerQuickReplySettingsScreen = createPartnerSupportScreen(partnerSupportConfigs['quick-reply-settings']);
export const DshPartnerQuickReplySetupScreen = createPartnerSupportScreen(partnerSupportConfigs['quick-reply-setup']);
export const DshPartnerStaffAnalyticsGetScreen = createPartnerSupportScreen(partnerSupportConfigs['staff-analytics']);
export const DshPartnerStoreNominationScreen = createPartnerSupportScreen(partnerSupportConfigs['store-nomination']);
export const DshPartnerStoreServiceModesUpdateScreen = createPartnerSupportScreen(partnerSupportConfigs['store-service-modes-update']);
export const DshPartnerStoreStatusUpdateScreen = createPartnerSupportScreen(partnerSupportConfigs['store-status-update']);
export const DshPartnerStoreUpdateScreen = createPartnerSupportScreen(partnerSupportConfigs['store-update']);
export const DshPartnerSubscriptionScreen = createPartnerSupportScreen(partnerSupportConfigs.subscription);
