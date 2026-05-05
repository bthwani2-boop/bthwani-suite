import React from 'react';
import { Box, Chip, KeyValueList, ListItem, MobileScrollView, SectionHeader, StatCard, Surface, Text, TextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../patterns/screens/DshOperationScreen';

const clientOperationScreenIds = [
  'awnak-order-create',
  'booking-create',
  'chat-read-ack',
  'chat-send',
  'checkout-gate',
  'delivery-attempt-create',
  'delivery-attempts-list',
  'delivery-close',
  'delivery-eta-get',
  'delivery-get',
  'delivery-reassign',
  'delivery-track-get',
  'entitlements-get',
  'estimate-create',
  'estimate-get',
  'external-order-create',
  'gas-refill-order-create',
  'listing-status-update',
  'loyalty-points-redeem',
  'loyalty-points-client-balance',
  'loyalty-points-client-history',
  'order-accept',
  'order-cancel',
  'order-complete',
  'order-create',
  'order-escrow-hold',
  'order-escrow-release',
  'order-get',
  'order-issue-flag',
  'order-proof-code-generate',
  'order-proof-verify',
  'order-rate',
  'order-receipt-get',
  'order-status-get',
  'order-status-update',
  'pricing-preview',
  'pricing-snapshot-get',
  'promo-apply',
  'proxy-request-create',
  'proxy-request-approve',
  'proxy-request-review',
  'proxy-request-reject',
  'proxy-request-tracking',
  'review-create',
  'reviews-list',
  'service-modes-resolve',
  'subscription-family-get',
  'subscription-family-members-get',
  'subscription-family-members-post',
  'subscription-pro-catalog',
  'subscription-sync',
  'subscription-tier-get',
  'subscription-upgrade-post',
  'zone-set',
] as const;

export type ClientOperationScreenId = (typeof clientOperationScreenIds)[number];

type ClientGeneratedOperationScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

type ClientOperationKind = 'create' | 'order' | 'delivery' | 'loyalty' | 'subscription' | 'proxy' | 'chat' | 'settings' | 'review';

type ClientOperationCanonicalDestination =
  | 'cart-get'
  | 'tracking'
  | 'benefits'
  | 'conversation-workspace'
  | 'proxy-workspace'
  | 'service-settings'
  | 'operations-screen';

type ClientOperationGroupId =
  | 'create-checkout'
  | 'order-delivery'
  | 'messaging-reviews'
  | 'subscription-loyalty'
  | 'proxy-controls';

type ClientOperationDefinition = {
  title: string;
  subtitle: string;
  badgeLabel: string;
  kind: ClientOperationKind;
  group: ClientOperationGroupId;
  audience: 'client' | 'internal';
  stageLabel: string;
  primaryOutcome: string;
  canonicalDestination: ClientOperationCanonicalDestination;
  standaloneVisible: boolean;
  consolidationNote?: string;
};

type ClientOperationDirectoryGroup = {
  id: ClientOperationGroupId;
  title: string;
  subtitle: string;
  itemIds: ClientOperationScreenId[];
};

const internalDiagnosticOperationIds: ClientOperationScreenId[] = [
  'delivery-reassign',
  'order-accept',
  'order-complete',
  'order-escrow-hold',
  'order-escrow-release',
  'proxy-request-approve',
  'proxy-request-reject',
];

const createCheckoutIds: ClientOperationScreenId[] = [
  'awnak-order-create',
  'booking-create',
  'estimate-create',
  'external-order-create',
  'gas-refill-order-create',
  'order-create',
  'estimate-get',
  'checkout-gate',
  'pricing-preview',
  'pricing-snapshot-get',
  'promo-apply',
];

const orderDeliveryIds: ClientOperationScreenId[] = [
  'order-cancel',
  'order-get',
  'order-issue-flag',
  'order-proof-code-generate',
  'order-proof-verify',
  'order-receipt-get',
  'order-status-get',
  'order-status-update',
  'delivery-attempt-create',
  'delivery-attempts-list',
  'delivery-close',
  'delivery-eta-get',
  'delivery-get',
  'delivery-track-get',
];

const messagingReviewIds: ClientOperationScreenId[] = ['chat-read-ack', 'chat-send', 'order-rate', 'review-create', 'reviews-list'];

const subscriptionLoyaltyIds: ClientOperationScreenId[] = [
  'entitlements-get',
  'loyalty-points-redeem',
  'loyalty-points-client-balance',
  'loyalty-points-client-history',
  'subscription-family-get',
  'subscription-family-members-get',
  'subscription-family-members-post',
  'subscription-pro-catalog',
  'subscription-sync',
  'subscription-tier-get',
  'subscription-upgrade-post',
];

const proxyControlIds: ClientOperationScreenId[] = [
  'proxy-request-create',
  'proxy-request-review',
  'proxy-request-tracking',
  'service-modes-resolve',
  'listing-status-update',
  'zone-set',
];

const consolidatedCheckoutScreenIds: ClientOperationScreenId[] = [
  'booking-create',
  'checkout-gate',
  'estimate-create',
  'estimate-get',
  'external-order-create',
  'gas-refill-order-create',
  'order-create',
  'pricing-preview',
  'pricing-snapshot-get',
  'promo-apply',
];

const consolidatedTrackingScreenIds: ClientOperationScreenId[] = [
  'order-get',
  'order-status-get',
  'order-status-update',
  'order-receipt-get',
  'delivery-get',
  'delivery-track-get',
  'delivery-eta-get',
  'delivery-attempt-create',
  'delivery-attempts-list',
  'delivery-close',
  'order-proof-code-generate',
  'order-proof-verify',
];

const clientOperationDirectoryGroups: ClientOperationDirectoryGroup[] = [
  {
    id: 'create-checkout',
    title: 'الإنشاء والدفع',
    subtitle: 'الإنشاء والتسعير وضوابط ما قبل الإرسال تبقى في مسار واحد.',
    itemIds: createCheckoutIds,
  },
  {
    id: 'order-delivery',
    title: 'الطلب والتحكم بالتوصيل',
    subtitle: 'التنفيذ والإثبات والحالة والتتبع تبقى معًا.',
    itemIds: orderDeliveryIds,
  },
  {
    id: 'messaging-reviews',
    title: 'الرسائل والمراجعة',
    subtitle: 'المحادثة والتقييم والتغذية الراجعة تبقى قريبة من الطلب النشط.',
    itemIds: messagingReviewIds,
  },
  {
    id: 'subscription-loyalty',
    title: 'الاشتراك والولاء',
    subtitle: 'المزايا والخطط العائلية والترقيات والنقاط والاستحقاقات تبقى ظاهرة.',
    itemIds: subscriptionLoyaltyIds,
  },
  {
    id: 'proxy-controls',
    title: 'الوكالة وضوابط الخدمة',
    subtitle: 'طلبات الوكالة وضوابط الخدمة تبقى خارج مسار التسوق.',
    itemIds: proxyControlIds,
  },
];

const badgeLabelByKind: Record<ClientOperationKind, string> = {
  create: 'إنشاء',
  order: 'طلب',
  delivery: 'توصيل',
  loyalty: 'ولاء',
  subscription: 'اشتراك',
  proxy: 'ضبط',
  chat: 'محادثة',
  settings: 'إعدادات',
  review: 'مراجعة',
};

const stageLabelByKind: Record<ClientOperationKind, string> = {
  create: 'ضبط ما قبل الإرسال',
  order: 'لقطة الطلب',
  delivery: 'حركة مباشرة',
  loyalty: 'وضوح المزايا',
  subscription: 'وضوح المزايا',
  proxy: 'مسار الضبط',
  chat: 'حالة المحادثة',
  settings: 'ضبط الخدمة',
  review: 'التقاط التقييم',
};

const primaryOutcomeByKind: Record<ClientOperationKind, string> = {
  create: 'يبقى الطلب في مسار إنشاء واضح دون تحويلات إضافية.',
  order: 'تبقى نقطة حالة الطلب واضحة وسهلة المتابعة.',
  delivery: 'تبقى حالة التوصيل مقروءة أثناء استمرار العميل في المسار.',
  loyalty: 'تبقى النقاط والمزايا ظاهرة قبل الخطوة التالية.',
  subscription: 'تبقى قيمة الاشتراك ظاهرة قبل الخطوة التالية.',
  proxy: 'تبقى واجهة الضبط واضحة دون تسرب إلى مسار التسوق.',
  chat: 'تبقى المحادثة مرتبطة بالطلب النشط.',
  settings: 'يبقى ضبط الخدمة واضحًا قبل متابعة التصفح.',
  review: 'يتم التقاط التقييم بينما تجربة الطلب ما تزال حديثة.',
};

const subtitleByKind: Record<ClientOperationKind, string> = {
  create: 'مسار الإنشاء وضبط ما قبل الإرسال يبقى مختصرًا وواضحًا.',
  order: 'سياق الطلب يبقى صريحًا وسهل الاستمرار.',
  delivery: 'ضبط التوصيل يبقى مقروءًا داخل مسار التتبع.',
  loyalty: 'النقاط والمزايا تبقى ظاهرة دون مغادرة المسار.',
  subscription: 'الاشتراك وإدارة العائلة تبقى قريبة من مسار المزايا.',
  proxy: 'قرارات الوكالة وضبط الخدمة تبقى واضحة.',
  chat: 'المحادثة تبقى مرتبطة بالطلب الحالي.',
  settings: 'إعدادات الخدمة تبقى واضحة قبل متابعة العميل.',
  review: 'التقييم يبقى قريبًا من الطلب ليكتمل بسرعة.',
};

function humanizeScreenId(screenId: ClientOperationScreenId) {
  return screenId
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function getOperationKind(screenId: ClientOperationScreenId): ClientOperationKind {
  if (screenId === 'chat-read-ack' || screenId === 'chat-send') {
    return 'chat';
  }

  if (screenId.startsWith('proxy-request-')) {
    return 'proxy';
  }

  if (screenId.startsWith('subscription-')) {
    return 'subscription';
  }

  if (screenId.startsWith('loyalty-') || screenId === 'entitlements-get') {
    return 'loyalty';
  }

  if (screenId.startsWith('delivery-')) {
    return 'delivery';
  }

  if (screenId === 'order-rate' || screenId === 'review-create' || screenId === 'reviews-list') {
    return 'review';
  }

  if (screenId === 'listing-status-update' || screenId === 'service-modes-resolve' || screenId === 'zone-set') {
    return 'settings';
  }

  if (screenId === 'awnak-order-create' || screenId === 'booking-create' || screenId === 'estimate-create' || screenId === 'external-order-create' || screenId === 'gas-refill-order-create' || screenId === 'checkout-gate' || screenId === 'estimate-get' || screenId === 'pricing-preview' || screenId === 'pricing-snapshot-get' || screenId === 'promo-apply') {
    return 'create';
  }

  return 'order';
}

function getOperationGroup(screenId: ClientOperationScreenId): ClientOperationGroupId {
  if (createCheckoutIds.includes(screenId)) {
    return 'create-checkout';
  }

  if (orderDeliveryIds.includes(screenId)) {
    return 'order-delivery';
  }

  if (messagingReviewIds.includes(screenId)) {
    return 'messaging-reviews';
  }

  if (subscriptionLoyaltyIds.includes(screenId)) {
    return 'subscription-loyalty';
  }

  return 'proxy-controls';
}

function getOperationDefinition(screenId: ClientOperationScreenId): ClientOperationDefinition {
  const kind = getOperationKind(screenId);
  const group = getOperationGroup(screenId);
  const audience = internalDiagnosticOperationIds.includes(screenId) ? 'internal' : 'client';
  const canonicalDestination = getCanonicalDestination(screenId);
  const standaloneVisible = !consolidatedCheckoutScreenIds.includes(screenId) && !consolidatedTrackingScreenIds.includes(screenId);
  const consolidationNote = !standaloneVisible
    ? canonicalDestination === 'cart-get'
      ? 'هذه القدرة مدمجة داخل شاشة تأكيد الطلب وليست صفحة عميل مستقلة.'
      : 'هذه القدرة مدمجة داخل شاشة تتبع الطلب وليست صفحة عميل مستقلة.'
    : undefined;

  return {
    title: humanizeScreenId(screenId),
    subtitle: audience === 'internal' ? 'مسار تشخيصي / داخلي غير مخصص كفعل عميل نهائي.' : subtitleByKind[kind],
    badgeLabel: audience === 'internal' ? 'داخلي' : badgeLabelByKind[kind],
    kind,
    group,
    audience,
    stageLabel: audience === 'internal' ? 'تشخيص داخلي' : stageLabelByKind[kind],
    primaryOutcome: audience === 'internal' ? 'هذا المسار تشغيلي/تشخيصي ويجب ألا يظهر كإجراء عميل نهائي داخل الواجهة العميلية.' : primaryOutcomeByKind[kind],
    canonicalDestination,
    standaloneVisible,
    consolidationNote,
  };
}

export function getCanonicalDestination(screenId: ClientOperationScreenId): ClientOperationCanonicalDestination {
  if (consolidatedCheckoutScreenIds.includes(screenId)) {
    return 'cart-get';
  }

  if (consolidatedTrackingScreenIds.includes(screenId)) {
    return 'tracking';
  }

  if (screenId === 'chat-read-ack' || screenId === 'chat-send') {
    return 'conversation-workspace';
  }

  if (
    screenId === 'subscription-family-get'
    || screenId === 'subscription-family-members-get'
    || screenId === 'subscription-family-members-post'
    || screenId === 'subscription-pro-catalog'
    || screenId === 'subscription-sync'
    || screenId === 'subscription-tier-get'
    || screenId === 'subscription-upgrade-post'
    || screenId === 'loyalty-points-redeem'
    || screenId === 'loyalty-points-client-balance'
    || screenId === 'loyalty-points-client-history'
    || screenId === 'entitlements-get'
  ) {
    return 'benefits';
  }

  if (screenId.startsWith('proxy-request-')) {
    return 'proxy-workspace';
  }

  if (screenId === 'service-modes-resolve' || screenId === 'listing-status-update' || screenId === 'zone-set') {
    return 'service-settings';
  }

  if (
    screenId === 'order-create'
    || screenId === 'booking-create'
    || screenId === 'external-order-create'
    || screenId === 'gas-refill-order-create'
    || screenId === 'estimate-create'
  ) {
    return 'cart-get';
  }

  return 'operations-screen';
}

function primaryLabelByKind(kind: ClientOperationKind) {
  if (kind === 'create') return 'فتح مسار الإنشاء';
  if (kind === 'delivery') return 'فتح التتبع';
  if (kind === 'loyalty') return 'فتح سياق الولاء';
  if (kind === 'subscription') return 'فتح سياق الاشتراك';
  if (kind === 'proxy') return 'فتح سياق الضبط';
  if (kind === 'review') return 'فتح مسار التقييم';
  if (kind === 'settings') return 'الرجوع إلى سياق الخدمة';
  if (kind === 'chat') return 'فتح المحادثة';
  return 'فتح مسار الطلب';
}

function primaryLabelByCanonicalDestination(destination: ClientOperationCanonicalDestination) {
  if (destination === 'cart-get') return 'فتح تأكيد الطلب';
  if (destination === 'tracking') return 'فتح تتبع الطلب';
  if (destination === 'benefits') return 'فتح المزايا';
  if (destination === 'conversation-workspace') return 'فتح المحادثة';
  if (destination === 'proxy-workspace') return 'فتح سياق الوكالة';
  if (destination === 'service-settings') return 'فتح إعدادات الخدمة';
  return 'فتح دليل العمليات';
}

const clientOperationDefinitions: Record<ClientOperationScreenId, ClientOperationDefinition> = Object.fromEntries(
  clientOperationScreenIds.map((screenId) => [screenId, getOperationDefinition(screenId)]),
) as Record<ClientOperationScreenId, ClientOperationDefinition>;

function buildOperationContent(definition: ClientOperationDefinition, draftValue: string, setDraftValue: (nextValue: string) => void) {
  const guidanceItems = [
    {
      title: definition.stageLabel,
      subtitle: definition.primaryOutcome,
      meta: 'تركيز أساسي',
      badgeLabel: definition.badgeLabel,
    },
    {
      title: 'التسليم التالي',
      subtitle: 'أبقِ العميل في مسار واضح بعد اكتمال هذه الخطوة.',
      meta: 'ضبط المسار',
      badgeLabel: 'التالي',
    },
  ];

  if (definition.kind === 'chat') {
    return (
      <Box gap={3}>
        <Surface tone="brand" gap={3}>
          <StatCard label="مسار المحادثة" value="مباشر" deltaLabel={definition.stageLabel} tone="info" />
          <StatCard label="السلوك المتوقع" value="مختصر" deltaLabel="واضح وقابل للتنفيذ" tone="success" />
        </Surface>
        <Surface tone="raised" gap={3}>
          <TextField
            label="مسودة الرسالة"
            value={draftValue}
            onChangeText={setDraftValue}
            hint="اجعل الرسالة قصيرة وواضحة ومرتبطة بالطلب أو التوصيل النشط."
          />
        </Surface>
      </Box>
    );
  }

  if (definition.kind === 'proxy') {
    return (
      <Box gap={3}>
        <Surface tone="brand" gap={3}>
          <StatCard label="حالة الضبط" value="مركزة" deltaLabel={definition.stageLabel} tone="info" />
          <StatCard label="نمط القرار" value="محكوم" deltaLabel="راجع قبل الاعتماد" tone="success" />
        </Surface>
        <Surface tone="raised" gap={3}>
          <KeyValueList
            items={[
              { label: 'الواجهة', value: definition.title },
              { label: 'الغرض', value: definition.primaryOutcome, tone: 'brand' },
              { label: 'النطاق', value: 'معالجة الوكالة وضبط الخدمة' },
            ]}
          />
        </Surface>
        <Surface tone="raised" gap={2}>
          {guidanceItems.map((item) => (
            <ListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </Surface>
      </Box>
    );
  }

  if (definition.kind === 'subscription' || definition.kind === 'loyalty') {
    return (
      <Box gap={3}>
        <Surface tone="brand" gap={3}>
          <StatCard label="حالة المزايا" value="ظاهرة" deltaLabel={definition.stageLabel} tone="info" />
          <StatCard label="ثقة العميل" value="عالية" deltaLabel="القيمة واضحة قبل الإجراء" tone="success" />
        </Surface>
        <Surface tone="raised" gap={3}>
          <KeyValueList
            items={[
              { label: 'الواجهة', value: definition.title },
              { label: 'فائدة العميل', value: definition.primaryOutcome, tone: 'brand' },
              { label: 'الفئة', value: definition.kind === 'subscription' ? 'إدارة الاشتراك' : 'قيمة الولاء' },
            ]}
          />
        </Surface>
      </Box>
    );
  }

  if (definition.kind === 'delivery') {
    return (
      <Box gap={3}>
        <Surface tone="brand" gap={3}>
          <StatCard label="مسار التوصيل" value="نشط" deltaLabel={definition.stageLabel} tone="info" />
          <StatCard label="أولوية التعافي" value="سريع" deltaLabel="تقليل الخطوات أثناء التوصيل النشط" tone="success" />
        </Surface>
        <Surface tone="raised" gap={2}>
          {guidanceItems.map((item) => (
            <ListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </Surface>
      </Box>
    );
  }

  if (definition.kind === 'review') {
    return (
      <Box gap={3}>
        <Surface tone="brand" gap={3}>
          <StatCard label="مسار التقييم" value="جاهز" deltaLabel={definition.stageLabel} tone="info" />
          <StatCard label="مستوى الاحتكاك" value="منخفض" deltaLabel="التقاط الانطباع أثناء حداثة تجربة الطلب" tone="success" />
        </Surface>
        <Surface tone="raised" gap={2}>
          {guidanceItems.map((item) => (
            <ListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </Surface>
      </Box>
    );
  }

  if (definition.kind === 'settings') {
    return (
      <Box gap={3}>
        <Surface tone="brand" gap={3}>
          <StatCard label="حالة الضبط" value="ظاهرة" deltaLabel={definition.stageLabel} tone="info" />
          <StatCard label="وضوح المسار" value="عالٍ" deltaLabel="تجنب تحويلات الإعدادات المخفية" tone="success" />
        </Surface>
        <Surface tone="raised" gap={3}>
          <KeyValueList
            items={[
              { label: 'الواجهة', value: definition.title },
              { label: 'الغرض', value: definition.primaryOutcome, tone: 'brand' },
              { label: 'المجموعة', value: definition.group },
            ]}
          />
        </Surface>
      </Box>
    );
  }

  return (
    <Box gap={3}>
      <Surface tone="brand" gap={3}>
        <StatCard label="المسار الحالي" value="جاهز" deltaLabel={definition.stageLabel} tone="info" />
        <StatCard label="المحصلة الأساسية" value="ظاهرة" deltaLabel="خطوة تالية واضحة ومسيطرة" tone="success" />
      </Surface>
      <Surface tone="raised" gap={3}>
        <KeyValueList
          items={[
            { label: 'الواجهة', value: definition.title },
            { label: 'الغرض', value: definition.primaryOutcome, tone: 'brand' },
            { label: 'المجموعة', value: definition.group },
          ]}
        />
      </Surface>
    </Box>
  );
}

type OperationScreenViewProps = ClientGeneratedOperationScreenProps & {
  screenId: ClientOperationScreenId;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
};

function OperationScreenView({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
  primaryActionLabel,
  secondaryActionLabel,
}: OperationScreenViewProps) {
  const [draftValue, setDraftValue] = React.useState('');
  const definition = clientOperationDefinitions[screenId];

  if (!definition.standaloneVisible) {
    return (
      <DshOperationScreen
        state={state}
        title="هذه القدرة مدمجة"
        subtitle="تظهر ضمن شاشة تأكيد الطلب أو التتبع وليست صفحة مستقلة."
        content={(
          <Surface tone="inset" gap={2}>
            <Text role="bodyStrong">{definition.title}</Text>
            <Text role="bodySm" tone="muted">
              {definition.consolidationNote}
            </Text>
            <KeyValueList
              items={[
                { label: 'الوجهة القانونية', value: definition.canonicalDestination, tone: 'brand' },
                { label: 'المجموعة', value: definition.group },
                { label: 'المخرج المقصود', value: definition.primaryOutcome },
              ]}
            />
          </Surface>
        )}
        primaryActionLabel={primaryLabelByCanonicalDestination(definition.canonicalDestination)}
        secondaryActionLabel={secondaryActionLabel ?? 'العودة إلى دليل العمليات'}
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
        onRetry={onRetry}
      />
    );
  }

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      content={(
        <Box gap={3}>
          {definition.audience === 'internal' ? (
            <Surface tone="inset" gap={2}>
              <Text role="bodyStrong">تنبيه تشغيلي</Text>
              <Text role="bodySm" tone="muted">
                هذا المسار داخلي/تشخيصي فقط. لا يُمثّل إجراء عميل نهائي ولا يجب اعتباره جزءًا من المسار الظاهر للعميل.
              </Text>
            </Surface>
          ) : null}
          {buildOperationContent(definition, draftValue, setDraftValue)}
        </Box>
      )}
      primaryActionLabel={primaryActionLabel ?? primaryLabelByKind(definition.kind)}
      secondaryActionLabel={secondaryActionLabel ?? 'العودة إلى دليل العمليات'}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
    />
  );
}

function createOperationScreen(screenId: ClientOperationScreenId) {
  return function GeneratedClientOperationScreen(props: ClientGeneratedOperationScreenProps) {
    return <OperationScreenView screenId={screenId} {...props} />;
  };
}

export function DshClientOperationDirectoryScreen({ onOpenScreen }: { onOpenScreen?: (screenId: ClientOperationScreenId) => void }) {
  const operationScreenCount = clientOperationDirectoryGroups.reduce((sum, group) => (
    sum + group.itemIds.filter((itemId) => clientOperationDefinitions[itemId].audience === 'client').length
  ), 0);

  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">مكتبة عمليات عميل DSH</Text>
        <Text role="bodyMd" tone="muted">
          مكتبة قدرات داخلية لمسارات عميل DSH المتبقية، ومجمّعة حسب رحلة العميل بدل قائمة fallback مسطحة.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <StatCard label="القدرات المغطاة" value={String(operationScreenCount)} deltaLabel="مصفوفة عميل داخلية موثقة" tone="info" />
        <StatCard label="نمط التنقل" value="مجمّع" deltaLabel="الإنشاء، التوصيل، المزايا، الوكالة، الإعدادات" tone="success" />
      </Surface>

      <Surface tone="inset" gap={2}>
        <Text role="bodyStrong">ضبط التسربات التشغيلية</Text>
        <Text role="bodySm" tone="muted">
          المسارات الداخلية/التشخيصية مثل قبول الطلب، إكماله، الحجز المالي، وإعادة الإسناد لم تعد معروضة داخل هذا الدليل الظاهر للعميل.
        </Text>
      </Surface>

      {clientOperationDirectoryGroups.map((group) => (
        <Surface key={group.title} tone="raised" gap={3}>
          <SectionHeader title={group.title} subtitle={group.subtitle} />
          {(() => {
            const visibleItems = group.itemIds.filter((itemId) => {
              const definition = clientOperationDefinitions[itemId];
              return definition.audience === 'client' && definition.standaloneVisible;
            });
            const consolidatedItems = group.itemIds.filter((itemId) => {
              const definition = clientOperationDefinitions[itemId];
              return definition.audience === 'client' && !definition.standaloneVisible;
            });
            const consolidatedByDestination = consolidatedItems.reduce<Record<string, ClientOperationScreenId[]>>((acc, itemId) => {
              const destination = clientOperationDefinitions[itemId].canonicalDestination;
              acc[destination] = [...(acc[destination] ?? []), itemId];
              return acc;
            }, {});

            return (
              <Box gap={2}>
                {Object.entries(consolidatedByDestination).map(([destination, itemIds]) => (
                  <Surface key={`${group.id}-${destination}`} tone="inset" gap={2}>
                    <Text role="bodyStrong" style={{ textAlign: 'right' }}>
                      {destination === 'cart-get'
                        ? 'هذه القدرات مدمجة داخل شاشة تأكيد الطلب'
                        : destination === 'tracking'
                          ? 'هذه القدرات مدمجة داخل شاشة التتبع'
                          : 'هذه القدرات مدمجة داخل رحلة عميل أخرى'}
                    </Text>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                      لا تظهر هذه العناصر كصفحات عميل مستقلة حتى لا تتكرر نفس رحلة checkout أو tracking.
                    </Text>
                    <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
                      {itemIds.map((itemId) => (
                        <Chip key={itemId} label={clientOperationDefinitions[itemId].title} tone="brand" />
                      ))}
                    </Box>
                  </Surface>
                ))}

                {visibleItems.map((itemId) => {
                  const item = clientOperationDefinitions[itemId];

                  return <ListItem key={itemId} title={item.title} subtitle={item.subtitle} meta={item.stageLabel} badgeLabel={item.badgeLabel} onPress={() => onOpenScreen?.(itemId)} />;
                })}
              </Box>
            );
          })()}
        </Surface>
      ))}
    </MobileScrollView>
  );
}

export const clientOperationScreenRegistry: Record<ClientOperationScreenId, React.ComponentType<ClientGeneratedOperationScreenProps>> = Object.fromEntries(
  clientOperationScreenIds.map((screenId) => [screenId, createOperationScreen(screenId)]),
) as Record<ClientOperationScreenId, React.ComponentType<ClientGeneratedOperationScreenProps>>;

type ConversationScreenId = 'chat-read-ack' | 'chat-send';

type DshConversationHubScreenProps = {
  screenId: ConversationScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshConversationHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshConversationHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel={screenId === 'chat-send' ? 'إرسال رسالة' : 'تأكيد المحادثة'}
      secondaryActionLabel="العودة إلى دليل العمليات"
    />
  );
}

type DshOrderIssueHubScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshOrderIssueHubScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshOrderIssueHubScreenProps) {
  return (
    <OperationScreenView
      screenId="order-issue-flag"
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="تثبيت المشكلة"
      secondaryActionLabel="العودة إلى دليل العمليات"
    />
  );
}

type DshProxyHubScreenProps = {
  screenId: 'proxy-request-create' | 'proxy-request-approve' | 'proxy-request-review' | 'proxy-request-reject' | 'proxy-request-tracking';
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshProxyHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshProxyHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel={screenId === 'proxy-request-tracking' ? 'فتح التتبع' : screenId === 'proxy-request-reject' ? 'رفض الطلب' : screenId === 'proxy-request-approve' ? 'اعتماد الطلب' : screenId === 'proxy-request-review' ? 'مراجعة الطلب' : 'إنشاء طلب'}
      secondaryActionLabel="العودة إلى دليل العمليات"
    />
  );
}

type DshTrustHubScreenProps = {
  screenId: 'order-proof-code-generate' | 'order-proof-verify' | 'order-escrow-hold' | 'order-escrow-release';
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshTrustHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshTrustHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel={screenId === 'order-proof-code-generate' ? 'توليد الرمز' : screenId === 'order-proof-verify' ? 'تحقق التسليم' : screenId === 'order-escrow-hold' ? 'تجميد المبلغ' : 'إطلاق المبلغ'}
      secondaryActionLabel="العودة إلى دليل العمليات"
    />
  );
}

type DshServiceSettingsHubScreenProps = {
  screenId: 'listing-status-update' | 'service-modes-resolve' | 'zone-set';
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshServiceSettingsHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshServiceSettingsHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="تأكيد الإعدادات"
      secondaryActionLabel="العودة إلى دليل العمليات"
    />
  );
}

type DshZoneSetScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshZoneSetScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshZoneSetScreenProps) {
  return (
    <OperationScreenView
      screenId="zone-set"
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="تأكيد النطاق"
      secondaryActionLabel="العودة إلى دليل العمليات"
    />
  );
}

type DshListingStatusUpdateScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshListingStatusUpdateScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshListingStatusUpdateScreenProps) {
  return (
    <OperationScreenView
      screenId="listing-status-update"
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="تأكيد حالة الإدراج"
      secondaryActionLabel="العودة إلى دليل العمليات"
    />
  );
}

