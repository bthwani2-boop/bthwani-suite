// Removed Ionicons import
import React from 'react';
import {
  Pressable,
  ScrollView,
  View,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  Badge,
  BThwaniAppearanceProvider,
  type BThwaniAppearanceMode,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  GlassActionButton,
  GlassCard,
  GlassChip,
  GlassHeroOverlay,
  Icon,
  KeyValueList,
  MobileScrollView,
  OptionRow,
  SectionHeader,
  Surface,
  Text,
  TopBar,
  colorPalette,
  safeArea,
  spacing,
  useTheme,
} from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import { DshLoyaltyRewardsScreen } from '../parts/LoyaltyRewardsScreen';
import { DshSubscriptionsScreen } from '../parts/SubscriptionsScreen';
import { WltDshBalancePreview, WltDshConnectorPanel } from '../../../../wlt/frontend/app-client/dsh/wlt-dsh-client.parts';
import useWltDshWalletPreview from '../../../../wlt/frontend/app-client/dsh/useWltDshWalletPreview';
import { loyaltyRewardsFixture } from '../data/loyalty-commercial.preview-data';
import {
  subscriptionHeroCopy,
  subscriptionPlanCards,
  type SubscriptionPlanCard,
} from '../data/subscriptions-commercial.preview-data';

export type DshMySpaceOrderFilterId = 'all' | 'active' | 'delivery' | 'pickup';

export type DshMySpaceOrderStatusTone = 'brand' | 'success' | 'warning' | 'danger';

export type DshMySpaceOrderMetric = {
  label: string;
  value: string;
  helperText: string;
  tone: 'brand' | 'info' | 'warning' | 'success';
};

export type DshMySpaceOrderFilter = {
  id: DshMySpaceOrderFilterId;
  label: string;
  summary: string;
};

export type DshMySpaceQuickActionKind = 'orders' | 'tracking' | 'repeat';

export type DshMySpaceQuickAction = {
  id: string;
  label: string;
  summary: string;
  actionLabel: string;
  kind: DshMySpaceQuickActionKind;
};

export type DshMySpaceOrder = {
  id: string;
  title: string;
  summary: string;
  fulfillmentId: 'delivery' | 'pickup';
  fulfillmentLabel: string;
  statusId: 'active' | 'completed' | 'ready' | 'cancelled';
  statusLabel: string;
  statusLabelAr?: string;
  statusTone: DshMySpaceOrderStatusTone;
  orderNumber: string;
  placedAt: string;
  totalLabel: string;
  statusTrailLabel: string;
  needsReview?: boolean;
};

export type DshPreferenceCard = {
  id: string;
  title: string;
  description: string;
  value: string;
};

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */
export const dshMySpaceOrdersFixtureDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

export const dshMySpaceOrderMetrics: DshMySpaceOrderMetric[] = [
  {
    label: 'الطلبات هذا الشهر',
    value: '12',
    helperText: 'ثلاثة منها جاهزة للتكرار',
    tone: 'brand',
  },
  {
    label: 'الطلب النشط',
    value: '1',
    helperText: 'يظهر الآن في التتبع',
    tone: 'warning',
  },
  {
    label: 'جاهز للتكرار',
    value: '6',
    helperText: 'طلبات مكتملة يمكن إعادة فتحها',
    tone: 'success',
  },
  {
    label: 'قيد المراجعة',
    value: '2',
    helperText: 'حالتان تحتاجان متابعة سريعة',
    tone: 'info',
  },
];

export const dshMySpaceOrderFilters: DshMySpaceOrderFilter[] = [
  {
    id: 'all',
    label: 'الكل',
    summary: 'جميع الطلبات في عرض واحد',
  },
  {
    id: 'active',
    label: 'النشط',
    summary: 'آخر طلب يحتاج متابعة الآن',
  },
  {
    id: 'delivery',
    label: 'توصيل',
    summary: 'الطلبات التي تتحرك إلى العنوان',
  },
  {
    id: 'pickup',
    label: 'استلام بنفسي',
    summary: 'الطلبات الجاهزة أو المحجوزة للاستلام',
  },
];

export const dshMySpaceQuickActions: DshMySpaceQuickAction[] = [
  {
    id: 'recent',
    label: 'الطلبات الحديثة',
    summary: 'افتح أحدث الطلبات المسجلة فورًا',
    actionLabel: 'فتح',
    kind: 'orders',
  },
  {
    id: 'active',
    label: 'الطلب النشط',
    summary: 'انتقل مباشرة إلى التتبع الحالي',
    actionLabel: 'تتبع',
    kind: 'tracking',
  },
  {
    id: 'history',
    label: 'سجل الطلبات',
    summary: 'استعرض الطلبات السابقة بسرعة',
    actionLabel: 'فتح',
    kind: 'orders',
  },
  {
    id: 'tracking',
    label: 'التتبع',
    summary: 'عرض المسار الحالي للطلب الجاري',
    actionLabel: 'تتبع',
    kind: 'tracking',
  },
];

export const dshMySpaceOrdersFixture: DshMySpaceOrder[] = [
  {
    id: 'active-order',
    title: 'مطعم القلعة',
    summary: 'الطلب النشط يظهر الآن في التتبع مع تكرار جاهز بعد الإغلاق.',
    fulfillmentId: 'delivery',
    fulfillmentLabel: 'توصيل',
    statusId: 'active',
    statusLabel: 'جاري التوصيل',
    statusTone: 'brand',
    orderNumber: '#3770204',
    placedAt: '26 مارس 2026 · 17:35',
    totalLabel: '13,450 ر.ي',
    statusTrailLabel: 'في الطريق',
  },
  {
    id: 'completed-order',
    title: 'مقهى الدانة',
    summary: 'طلب مكتمل ويمكن إعادة الطلب مباشرة من نفس البطاقة.',
    fulfillmentId: 'delivery',
    fulfillmentLabel: 'توصيل',
    statusId: 'completed',
    statusLabel: 'تم التسليم',
    statusTone: 'success',
    orderNumber: '#3770118',
    placedAt: '25 مارس 2026 · 19:05',
    totalLabel: '28,900 ر.ي',
    statusTrailLabel: 'بانتظار التقييم',
    needsReview: true,
  },
  {
    id: 'pickup-order',
    title: 'أفران السهول',
    summary: 'استلام بنفسي مع حالة جاهزة للاسترجاع دون ضياع المسار.',
    fulfillmentId: 'pickup',
    fulfillmentLabel: 'استلام بنفسي',
    statusId: 'ready',
    statusLabel: 'جاهز للاستلام',
    statusTone: 'warning',
    orderNumber: '#3769982',
    placedAt: '24 مارس 2026 · 12:20',
    totalLabel: '56,100 ر.ي',
    statusTrailLabel: 'جاهز الآن',
  },
];

export const dshPreferenceCards: readonly DshPreferenceCard[] = [
  {
    id: 'delivery-instructions',
    title: 'تعليمات التسليم',
    description: 'ملاحظات مختصرة تساعد الكابتن عند الوصول إلى العنوان.',
    value: 'اتصل قبل الوصول بدقيقتين واترك الطلب عند الباب عند عدم الرد.',
  },
  {
    id: 'substitution-preference',
    title: 'تفضيلات الاستبدال',
    description: 'كيف يتصرف المتجر أو الكابتن عند غياب عنصر من السلة.',
    value: 'اسمح بالاستبدال ضمن نفس الفئة والسعر بعد تأكيد سريع في المحادثة.',
  },
  {
    id: 'order-notifications',
    title: 'إشعارات الطلب داخل DSH',
    description: 'التنبيهات الخاصة بتقدم الطلب والتأخير وحالة التتبع.',
    value: 'تنبيه عند قبول الطلب، وعند خروج الكابتن، وعند الوصول للعنوان.',
  },
  {
    id: 'captain-contact',
    title: 'طريقة التواصل مع الكابتن',
    description: 'قناة التواصل المفضلة خلال التنفيذ أو عند الحاجة للتوضيح.',
    value: 'ابدأ بالمحادثة داخل التطبيق ثم انتقل للمكالمة عند الحاجة.',
  },
  {
    id: 'location-handoff',
    title: 'تفضيلات تسليم العنوان والموقع',
    description: 'كيف يتم تمرير الموقع والتفاصيل الميدانية داخل DSH فقط.',
    value: 'استخدم الموقع الحالي تلقائيًا مع وصف يدوي مختصر للمدخل.',
  },
];

export type DshMySpaceItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type DshMySpaceScreenProps = {
  appearanceHydrated?: boolean;
  appearanceMode?: BThwaniAppearanceMode;
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  marketingPrograms?: DshMySpaceItem[];
  onAppearanceModeChange?: (mode: BThwaniAppearanceMode) => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

type MySpacePrimaryTab = 'orders' | 'wallet' | 'loyalty' | 'subscriptions' | 'addresses' | 'location' | 'identity' | 'commercial' | 'appearance' | 'preferences';

type SectionIconName = any; // Avoid strict Ionicons name match for compatibility

type PrimaryTabConfig = {
  id: MySpacePrimaryTab;
  label: string;
  summary: string;
  iconName: SectionIconName;
};

const primaryTabs: PrimaryTabConfig[] = [
  { id: 'orders', label: 'طلباتي', summary: 'الطلب والتاريخ والتتبع', iconName: 'bag-outline' },
  { id: 'wallet', label: 'المحفظة', summary: 'الرصيد، الاسترداد، وطرق الدفع', iconName: 'wallet-outline' },
  { id: 'loyalty', label: 'الولاء والمكافآت', summary: 'رصيد النقاط والمزايا المتاحة', iconName: 'star-outline' },
  { id: 'subscriptions', label: 'الاشتراكات', summary: 'إدارة الباقات والخصومات الدورية', iconName: 'flash-outline' },
  { id: 'addresses', label: 'العناوين المحفوظة', summary: 'إدارة مواقع التوصيل والاستلام', iconName: 'location-outline' },
  { id: 'location', label: 'الموقع الحالي', summary: 'تحديد وتحديث موقعك الميداني', iconName: 'map-outline' },
  { id: 'identity', label: 'الملف الشخصي', summary: 'البيانات الشخصية والأمان', iconName: 'person-outline' },
  { id: 'commercial', label: 'العروض الترويجية', summary: 'الحملات والخصومات المباشرة', iconName: 'megaphone-outline' },
  { id: 'appearance', label: 'المظهر', summary: 'فاتح أبيض أو داكن زجاجي', iconName: 'color-palette-outline' },
  { id: 'preferences', label: 'تفضيلات التوصيل', summary: 'إعدادات خاصة بالتسليم والاستبدال', iconName: 'options-outline' },
];

const mySpaceAppearanceOptions: Array<{
  description: string;
  helper: string;
  mode: BThwaniAppearanceMode;
  title: string;
}> = [
  {
    mode: 'lightPremium',
    title: 'فاتح أبيض',
    description: 'واجهة واضحة مع لمسات زجاجية في العروض والمتاجر',
    helper: 'الخلفية تبقى فاتحة، مع استخدام الزجاج بشكل انتقائي داخل التجربة المميزة.',
  },
  {
    mode: 'darkGlass',
    title: 'داكن زجاجي',
    description: 'تجربة داكنة زجاجية فاخرة للتصفح والتسوق',
    helper: 'مظهر داكن فاخر يطبّق على التطبيق كاملًا، مع حواف زجاجية وطبقات واضحة بدون إزعاج بصري.',
  },
];

interface MySpacePrimaryRowProps {
  key?: string;
  title: string;
  subtitle: string;
  iconName: SectionIconName;
  selected: boolean;
  onPress: () => void;
  details?: React.ReactNode;
}

function MySpacePrimaryRow({
  title,
  subtitle,
  iconName,
  selected,
  onPress,
  details,
}: MySpacePrimaryRowProps) {
  const { theme } = useTheme();
  const isExpanded = selected && Boolean(details);

  return (
    <Surface
      tone={isExpanded ? 'inset' : 'raised'}
      padding={2}
      gap={isExpanded ? 2 : 0}
      style={{
        width: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isExpanded ? theme.brand : theme.line,
        backgroundColor: isExpanded ? theme.brandSurface : theme.surfaceRaised,
        shadowColor: isExpanded ? theme.brand : colorPalette.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isExpanded ? 0.1 : 0.05,
        shadowRadius: isExpanded ? 14 : 10,
        elevation: isExpanded ? 3 : 2,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        style={({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => ({
          width: '100%',
          borderRadius: 16,
          paddingHorizontal: spacing[2],
          paddingVertical: spacing[1],
          opacity: pressed ? 0.96 : 1,
        })}
      >
        <Box layoutDirection="row" align="center" gap={3}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: selected ? theme.brand : theme.line,
              backgroundColor: selected ? theme.brand : theme.brandSurface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={iconName as any} size={21} color={selected ? theme.brandContrast : theme.brand} />
          </View>

          <Box gap={0} style={{ flex: 1 }}>
            <Text role="bodyStrong">{title}</Text>
            <Text role="bodySm" tone="muted" numberOfLines={2}>
              {subtitle}
            </Text>
          </Box>

          <View style={{ width: 28, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-back'} size={20} color={isExpanded ? theme.brand : theme.textSoft} />
          </View>
        </Box>
      </Pressable>

      {selected && details ? (
        <Box gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: spacing[2] }}>
          {details}
        </Box>
      ) : null}
    </Surface>
  );
}
function CommercialMetricCard({
  label,
  value,
  helperText,
  tone,
}: {
  label: string;
  value: string;
  helperText: string;
  tone: 'brand' | 'info' | 'warning' | 'success';
}) {
  const { theme } = useTheme();
  const accent = {
    brand: theme.brand,
    info: theme.info,
    warning: theme.warning,
    success: theme.success,
  }[tone];

  return (
    <Card
      title={label}
      subtitle={helperText}
      style={{
        flexBasis: '48%',
        flexGrow: 1,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.line,
      }}
    >
      <Text role="hero" style={{ color: accent }}>
        {value}
      </Text>
    </Card>
  );
}

function SubscriptionPlanTile({
  plan,
  selected,
  onPress,
}: {
  plan: SubscriptionPlanCard;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={{ width: 124 }}>
      <Surface
        tone="raised"
        gap={1}
        padding={2}
        style={{
          minHeight: 144,
          borderWidth: 2,
          borderColor: selected ? theme.brand : theme.line,
          backgroundColor: theme.surface,
          shadowColor: selected ? theme.brand : colorPalette.black,
          shadowOpacity: selected ? 0.14 : 0.06,
          shadowRadius: selected ? 12 : 8,
          shadowOffset: { width: 0, height: 6 },
          elevation: selected ? 4 : 1,
          transform: [{ translateY: selected ? 6 : 0 }],
        }}
      >
        <Box gap={0} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text role="bodyStrong">{plan.title}</Text>
          <Text role="titleLg" style={{ color: selected ? theme.brand : undefined }}>
            {plan.price}
          </Text>
          <Text role="bodySm" tone="muted">
            {plan.cadence}
          </Text>
        </Box>
      </Surface>
    </Pressable>
  );
}

function MySpaceCommercialSection({
  compact = false,
  marketingPrograms = [],
}: {
  compact?: boolean;
  marketingPrograms?: DshMySpaceItem[];
}) {
  const { theme } = useTheme();
  const rewardSection =
    loyaltyRewardsFixture.sections.find((section) => section.title === 'المكافآت') ??
    loyaltyRewardsFixture.sections[1];
  const rewardOptions = rewardSection.items;
  const initialPlanId = subscriptionPlanCards.find((plan) => plan.current)?.id ?? 'weekly';
  const [currentPlanId, setCurrentPlanId] = React.useState(initialPlanId);
  const [selectedPlanId, setSelectedPlanId] = React.useState(initialPlanId);
  const [paymentProfileIndex, setPaymentProfileIndex] = React.useState(0);
  const [autoRenew, setAutoRenew] = React.useState(true);
  const [couponOpen, setCouponOpen] = React.useState(false);
  const [selectedRewardId, setSelectedRewardId] = React.useState(rewardOptions[0]?.label ?? '');
  const [appliedRewardId, setAppliedRewardId] = React.useState(rewardOptions[0]?.label ?? '');
  const [selectedOfferId, setSelectedOfferId] = React.useState(marketingPrograms[0]?.id ?? '');
  const [appliedOfferId, setAppliedOfferId] = React.useState(marketingPrograms[0]?.id ?? '');

  const paymentProfiles = React.useMemo(
    () => [
      { label: 'بطاقة مدى **** 4821', id: 'mada' },
      { label: 'رصيد المحفظة', id: 'wallet' },
      { label: 'Apple Pay', id: 'apple-pay' },
    ],
    [],
  );

  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="العروض النشطة" subtitle="حملات مخصصة لك بناءً على تفضيلاتك." />
        <Box gap={1}>
          {marketingPrograms.map((program) => (
            <OptionRow
              key={program.id}
              title={program.title}
              subtitle={program.subtitle}
              meta={program.badgeLabel}
              onPress={() => setSelectedOfferId(program.id)}
            />
          ))}
        </Box>
        <Button
          label="تطبيق العرض المحدد"
          onPress={() => setAppliedOfferId(selectedOfferId)}
          disabled={!selectedOfferId}
        />
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="مكافآت الولاء" subtitle="استبدل نقاطك بخصومات أو عروض فورية." />
        <Box gap={1}>
          {rewardOptions.map((reward) => (
            <OptionRow
              key={reward.label}
              title={reward.label}
              subtitle={reward.helperText ?? ''}
              meta={reward.value}
              onPress={() => setSelectedRewardId(reward.label)}
            />
          ))}
        </Box>
        <Button
          label="استبدال النقاط"
          onPress={() => setAppliedRewardId(selectedRewardId)}
          disabled={!selectedRewardId}
        />
      </Surface>
    </Box>
  );
}

function resolveOrderIconName(order: DshMySpaceOrder): any {
  if (order.statusId === 'active') return 'flash';
  if (order.statusId === 'ready') return 'checkmark-circle';
  if (order.statusId === 'cancelled') return 'close-circle';
  return 'bag-check';
}

function resolvePrimaryActionLabel(order: DshMySpaceOrder): string {
  if (order.statusId === 'active') return 'تتبع الطلب';
  if (order.statusId === 'ready') return 'استلام الآن';
  if (order.statusId === 'completed' && order.needsReview) return 'تقييم الطلب';
  return 'تكرار الطلب';
}

function resolveSecondaryActionLabel(order: DshMySpaceOrder): string {
  if (order.statusId === 'active') return 'تكرار الطلب';
  return 'فتح التفاصيل';
}

function resolveStatusTone(order: DshMySpaceOrder): 'brand' | 'success' | 'warning' | 'danger' {
  return order.statusTone;
}

function resolvePrimaryOrder(orders: DshMySpaceOrder[]) {
  return orders.find((order) => order.statusId === 'active') ?? orders[0];
}

function resolveRepeatReadyOrders(orders: DshMySpaceOrder[]) {
  return orders.filter((order) => order.statusId === 'completed' || order.statusId === 'ready');
}

function resolvePendingReviewOrders(orders: DshMySpaceOrder[]) {
  return orders.filter((order) => order.needsReview);
}

type MySpaceCallbacks = {
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
};

interface OrderCardProps extends MySpaceCallbacks {
  key?: string;
  order: DshMySpaceOrder;
  featured?: boolean;
}

function OrderCard({
  order,
  featured,
  onOpenTracking,
  onRepeatOrder,
  onOpenOrders,
}: OrderCardProps) {
  const { theme } = useTheme();
  const iconName = resolveOrderIconName(order);
  const primaryLabel = resolvePrimaryActionLabel(order);
  const secondaryLabel = resolveSecondaryActionLabel(order);
  const trackingAction = onOpenTracking ?? onOpenOrders ?? onRepeatOrder;
  const repeatAction = onRepeatOrder ?? onOpenOrders ?? onOpenTracking;
  const primaryAction = order.statusId === 'active' ? trackingAction : repeatAction;
  const secondaryAction = order.statusId === 'active' ? repeatAction : trackingAction;

  return (
    <Surface
      tone={featured ? 'inset' : 'raised'}
      padding={2}
      gap={2}
      style={{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: featured ? theme.brand : theme.line,
        backgroundColor: featured ? theme.brandSurface : theme.surfaceRaised,
        shadowColor: featured ? theme.brand : colorPalette.black,
        shadowOpacity: featured ? 0.1 : 0.05,
        shadowRadius: featured ? 14 : 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: featured ? 3 : 1,
      }}
    >
      <Box layoutDirection="row" align="center" gap={2}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: featured ? theme.brand : theme.line,
            backgroundColor: featured ? theme.brand : theme.brandSurface,
          }}
        >
          <Icon name={iconName as any} size={20} color={featured ? theme.brandContrast : theme.brand} />
        </View>

        <Box gap={0} style={{ flex: 1 }}>
          <Text role="bodyStrong">{order.title}</Text>
          <Text role="bodySm" tone="muted" numberOfLines={2}>
            {order.summary}
          </Text>
        </Box>

        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label={order.statusLabel} tone={resolveStatusTone(order)} />
          <Chip label={order.fulfillmentLabel} selected />
        </Box>
      </Box>

      <KeyValueList
        dense
        items={[
          { label: 'رقم الطلب', value: order.orderNumber },
          { label: 'الوقت', value: order.placedAt },
          { label: 'الإجمالي', value: order.totalLabel, tone: 'brand' },
          { label: 'آخر حالة', value: order.statusTrailLabel },
        ]}
      />

      <Box layoutDirection="row" gap={2}>
        {primaryAction ? <Button label={primaryLabel} onPress={primaryAction} fullWidth={false} style={{ flex: 1 }} /> : null}
        {secondaryAction ? (
          <Button label={secondaryLabel} tone="secondary" onPress={secondaryAction} fullWidth={false} style={{ flex: 1 }} />
        ) : null}
      </Box>
    </Surface>
  );
}

function resolveQuickActionHandler(kind: DshMySpaceQuickActionKind, callbacks: MySpaceCallbacks) {
  if (kind === 'tracking') {
    return callbacks.onOpenTracking ?? callbacks.onOpenOrders ?? callbacks.onRepeatOrder;
  }

  if (kind === 'repeat') {
    return callbacks.onRepeatOrder ?? callbacks.onOpenOrders ?? callbacks.onOpenTracking;
  }

  return callbacks.onOpenOrders ?? callbacks.onRepeatOrder ?? callbacks.onOpenTracking;
}

function QuickActionPanel({
  quickActions,
  onOpenOrders,
  onOpenTracking,
  onRepeatOrder,
}: {
  quickActions: DshMySpaceQuickAction[];
} & MySpaceCallbacks) {
  return (
    <Surface tone="raised" padding={2} gap={2}>
      <SectionHeader title="مسارات سريعة" subtitle="فتح الطلبات الحديثة أو الانتقال إلى التتبع دون ضياع المسار." />

      <Box gap={2}>
        {quickActions.map((action) => (
          <OptionRow
            key={action.id}
            title={action.label}
            subtitle={action.summary}
            actionLabel={action.actionLabel}
            onAction={resolveQuickActionHandler(action.kind, { onOpenOrders, onOpenTracking, onRepeatOrder })}
          />
        ))}
      </Box>
    </Surface>
  );
}

function MySpaceOrdersSection({ onOpenOrders, onOpenTracking, onRepeatOrder }: MySpaceCallbacks) {
  const [selectedFilterId, setSelectedFilterId] = React.useState<DshMySpaceOrderFilterId>('all');

  const primaryOrder = resolvePrimaryOrder(dshMySpaceOrdersFixture);
  const repeatReadyOrders = resolveRepeatReadyOrders(dshMySpaceOrdersFixture).filter((order) => order.id !== primaryOrder?.id);
  const pendingReviewOrders = resolvePendingReviewOrders(dshMySpaceOrdersFixture).filter((order) => order.id !== primaryOrder?.id);

  const filteredOrders = React.useMemo(() => {
    if (selectedFilterId === 'all') return dshMySpaceOrdersFixture;
    if (selectedFilterId === 'active') return dshMySpaceOrdersFixture.filter(o => o.statusId === 'active');
    if (selectedFilterId === 'delivery') return dshMySpaceOrdersFixture.filter(o => o.fulfillmentId === 'delivery');
    if (selectedFilterId === 'pickup') return dshMySpaceOrdersFixture.filter(o => o.fulfillmentId === 'pickup');
    return dshMySpaceOrdersFixture;
  }, [selectedFilterId]);

  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader
          title="لوحة مساحتي"
          subtitle="الأولوية دائمًا: الطلب النشط ثم الجاهز للتكرار ثم المراجعات المعلقة ثم المسارات السريعة."
        />

        <KeyValueList
          dense
          items={[
            { label: 'الطلب النشط الآن', value: primaryOrder ? 'متاح' : 'لا يوجد', tone: primaryOrder ? 'brand' : 'warning' },
            { label: 'جاهز للتكرار', value: String(repeatReadyOrders.length), tone: repeatReadyOrders.length > 0 ? 'success' : 'warning' },
            { label: 'مراجعات معلقة', value: String(pendingReviewOrders.length), tone: pendingReviewOrders.length > 0 ? 'warning' : 'success' },
          ]}
        />
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="فرز الطلبات" subtitle="اختر التصنيف المناسب لعرض المسارات المتطابقة." />
        <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {dshMySpaceOrderFilters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              tone={selectedFilterId === filter.id ? 'brand' : 'default'}
              onPress={() => setSelectedFilterId(filter.id)}
            />
          ))}
        </Box>
        {selectedFilterId !== 'all' && (
          <Surface tone="inset" padding={2}>
            <Text role="caption" tone="muted">
              {dshMySpaceOrderFilters.find(f => f.id === selectedFilterId)?.summary}
            </Text>
          </Surface>
        )}
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="الطلب النشط" subtitle="هذا هو المسار الأعلى أولوية ويظهر أولًا مع إجراء واضح." />

        {primaryOrder ? (
          <OrderCard
            order={primaryOrder}
            featured
            onOpenTracking={onOpenTracking}
            onRepeatOrder={onRepeatOrder}
            onOpenOrders={onOpenOrders}
          />
        ) : (
          <Surface tone="inset" padding={2} gap={1}>
            <Text role="bodyStrong">لا يوجد طلب نشط الآن.</Text>
            <Text role="bodySm" tone="muted">
              يمكنك فتح سجل الطلبات أو بدء طلب جديد مباشرة.
            </Text>
            <Box layoutDirection="row" gap={2}>
              {onOpenOrders ? <Button label="فتح الطلبات" onPress={onOpenOrders} fullWidth={false} /> : null}
              {onRepeatOrder ? <Button label="تكرار سريع" tone="secondary" onPress={onRepeatOrder} fullWidth={false} /> : null}
            </Box>
          </Surface>
        )}
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="جاهز للتكرار" subtitle="طلبات مكتملة أو جاهزة للاستلام مع إعادة طلب مباشرة." />

        <Box gap={2}>
          {repeatReadyOrders.length > 0 ? (
            repeatReadyOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onOpenTracking={onOpenTracking}
                onRepeatOrder={onRepeatOrder}
                onOpenOrders={onOpenOrders}
              />
            ))
          ) : (
            <Surface tone="inset" padding={2} gap={1}>
              <Text role="bodyStrong">لا توجد طلبات مطابقة لهذا الفلتر.</Text>
              <Text role="bodySm" tone="muted">
                ستظهر هنا الطلبات الجاهزة لإعادة التنفيذ عند توفرها.
              </Text>
              <Box layoutDirection="row" gap={2}>
                {onOpenOrders ? <Button label="فتح الطلبات" onPress={onOpenOrders} fullWidth={false} /> : null}
                {onRepeatOrder ? <Button label="تكرار سريع" tone="secondary" onPress={onRepeatOrder} fullWidth={false} /> : null}
              </Box>
            </Surface>
          )}
        </Box>
      </Surface>

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="مراجعات معلقة" subtitle="طلبات تحتاج تقييمًا أو مراجعة قبل إغلاق التجربة بالكامل." />

        <Box gap={2}>
          {pendingReviewOrders.length > 0 ? (
            pendingReviewOrders.map((order) => (
              <Surface key={order.id} tone="inset" padding={2} gap={2} style={{ borderRadius: 18 }}>
                <Box layoutDirection="row" align="center" gap={2}>
                  <Box gap={0} style={{ flex: 1 }}>
                    <Text role="bodyStrong">{order.title}</Text>
                    <Text role="bodySm" tone="muted">
                      {order.statusTrailLabel}
                    </Text>
                  </Box>
                  <Badge label="مراجعة مطلوبة" tone="warning" />
                </Box>

                <Text role="bodySm" tone="muted">
                  افتح الطلب ثم أكمل التقييم حتى ينتقل المسار من المراجعة إلى الإغلاق.
                </Text>

                <Box layoutDirection="row" gap={2}>
                  {onOpenOrders ? <Button label="فتح الطلب" onPress={onOpenOrders} fullWidth={false} /> : null}
                  {onOpenTracking ? <Button label="متابعة الحالة" tone="secondary" onPress={onOpenTracking} fullWidth={false} /> : null}
                </Box>
              </Surface>
            ))
          ) : (
            <Surface tone="inset" padding={2} gap={1}>
              <Text role="bodyStrong">لا توجد مراجعات معلقة.</Text>
              <Text role="bodySm" tone="muted">
                جميع الطلبات الحالية إما نشطة أو جاهزة للتكرار مباشرة.
              </Text>
            </Surface>
          )}
        </Box>
      </Surface>

      <QuickActionPanel
        quickActions={dshMySpaceQuickActions}
        onOpenOrders={onOpenOrders}
        onOpenTracking={onOpenTracking}
        onRepeatOrder={onRepeatOrder}
      />

      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="كل الطلبات الحديثة" subtitle={`${filteredOrders.length} بطاقات متاحة مع CTA حسب الحالة.`} />
        <Box gap={2}>
          {filteredOrders.map((order: DshMySpaceOrder) => (
            <OrderCard
              key={order.id}
              order={order}
              onOpenTracking={onOpenTracking}
              onRepeatOrder={onRepeatOrder}
              onOpenOrders={onOpenOrders}
            />
          ))}
        </Box>
      </Surface>
    </Box>
  );
}


function MySpaceWalletSection() {
  const { theme } = useTheme();
  const { balance, linked, refreshing, refresh } = useWltDshWalletPreview();

  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader
          title="رصيد المحفظة"
          subtitle="تحكم في رصيدك واسترداداتك المالية من مكان واحد."
          trailing={<WltDshBalancePreview balance={balance} />}
        />
        <KeyValueList
          dense
          items={[
            { label: 'حالة الربط', value: linked ? 'متصل' : 'غير متصل', tone: linked ? 'success' : 'warning' },
            { label: 'الرصيد المتاح', value: balance != null ? `${(balance / 100).toFixed(2)} ريال` : '—', tone: 'brand' },
          ]}
        />
        <Box layoutDirection="row" gap={2}>
          <WltDshConnectorPanel onLinked={refresh} />
          <Button label="تحديث" tone="ghost" onPress={refresh} loading={refreshing} />
        </Box>
      </Surface>

      <Surface tone="raised" padding={2} gap={1}>
        <Text role="bodyStrong">طرق الدفع المفضلة</Text>
        <OptionRow title="مدى **** 4821" subtitle="تنتهي 03/27" actionLabel="تغيير" />
        <OptionRow title="Visa **** 9055" subtitle="تنتهي 11/28" actionLabel="تغيير" />
      </Surface>
    </Box>
  );
}

function MySpaceAddressesSection() {
  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="العناوين المحفوظة" subtitle="أضف أو عدل مواقع التوصيل المتكررة." />
        <Box gap={1}>
          <OptionRow title="المنزل" subtitle="حي النزهة، شارع الأمير نايف" icon={<Icon name="home-outline" size={20} />} />
          <OptionRow title="العمل" subtitle="برج الفيصلية، الطابق 12" icon={<Icon name="business-outline" size={20} />} />
        </Box>
        <Button label="إضافة عنوان جديد" tone="secondary" />
      </Surface>
    </Box>
  );
}

function MySpaceLocationSection() {
  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="الموقع الميداني" subtitle="تحديث موقعك الحالي لضمان دقة التوصيل." />
        <Surface tone="inset" padding={3} style={{ alignItems: 'center', justifyContent: 'center', height: 120, borderRadius: 20 }}>
          <Icon name="map" size={40} color={colorPalette.brand} />
          <Text role="bodySm" tone="muted" style={{ marginTop: 8 }}>خارطة الموقع قيد التحميل...</Text>
        </Surface>
        <Button label="تحديث الموقع الحالي" tone="brand" />
      </Surface>
    </Box>
  );
}

function MySpaceIdentitySection() {
  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <SectionHeader title="البيانات الشخصية" subtitle="إدارة اسمك، بريدك، ورقم هاتفك." />
        <Box gap={1}>
          <OptionRow title="باسم الثواني" subtitle="الاسم الظاهر في التطبيق" />
          <OptionRow title="b.thwani@example.com" subtitle="البريد الإلكتروني الموثق" />
          <OptionRow title="+966 50 **** 123" subtitle="رقم الجوال" />
        </Box>
        <Button label="تحديث البيانات" tone="brand" />
      </Surface>
      <Surface tone="raised" padding={2} gap={1}>
        <OptionRow title="تغيير كلمة المرور" subtitle="آخر تحديث قبل 3 أشهر" actionLabel="تعديل" />
        <OptionRow title="حذف الحساب" subtitle="إجراء لا يمكن التراجع عنه" tone="danger" actionLabel="حذف" />
      </Surface>
    </Box>
  );
}

function MySpacePreferencesSection() {
  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Text role="titleSm">إعدادات DSH الخاصة بالتوصيل</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            هذه التفضيلات تخص تعليمات التسليم والاستبدال والتنبيهات داخل DSH فقط، ولا تشمل الحساب أو المحفظة أو الأمان.
          </Text>
        </Box>
      </Surface>

      {dshPreferenceCards.map((card) => (
        <Surface key={card.id} tone="raised" padding={2} gap={1}>
          <Box gap={1} style={{ alignItems: 'flex-end' }}>
            <Text role="bodyStrong">{card.title}</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              {card.description}
            </Text>
            <Text role="label" style={{ textAlign: 'right' }}>
              {card.value}
            </Text>
          </Box>
        </Surface>
      ))}
    </Box>
  );
}

function MySpaceAppearanceSection({
  appearanceHydrated = false,
  appearanceMode = 'lightPremium',
  onAppearanceModeChange,
}: {
  appearanceHydrated?: boolean;
  appearanceMode?: BThwaniAppearanceMode;
  onAppearanceModeChange?: (mode: BThwaniAppearanceMode) => void;
}) {
  return (
    <Box gap={2}>
      <Surface tone="raised" padding={2} gap={2}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Text role="titleSm">المظهر</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            اختر بين الوضع الفاتح الأبيض والوضع الداكن الزجاجي. يتم تطبيق الاختيار الآن على سطح العميل الحالي بالكامل.
          </Text>
          <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
            {appearanceHydrated ? 'يتم حفظ اختيارك محليًا واستعادته عند فتح التطبيق.' : 'جارٍ استعادة اختيارك المحفوظ...'}
          </Text>
        </Box>
      </Surface>

      {mySpaceAppearanceOptions.map((option) => {
        const selected = appearanceMode === option.mode;

        return (
          <BThwaniAppearanceProvider key={option.mode} mode={option.mode}>
            <GlassCard
              emphasis={selected ? 'strong' : 'subtle'}
              onPress={() => onAppearanceModeChange?.(option.mode)}
              padding={3}
              gap={3}
              title={option.title}
              subtitle={option.description}
              footer={(
                <Box gap={2}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: spacing[2] }}>
                    <GlassChip
                      label={selected ? 'مفعّل الآن' : 'جاهز للتفعيل'}
                      selected={selected}
                      emphasis={selected ? 'strong' : 'subtle'}
                    />
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                      {option.helper}
                    </Text>
                  </View>

                  <GlassHeroOverlay strength={selected ? 'strong' : 'default'} style={{ padding: spacing[3], gap: spacing[1] }}>
                    <Text role="bodyStrong" style={{ textAlign: 'right' }}>
                      {option.mode === 'lightPremium'
                        ? 'فاتح أبيض = قاعدة فاتحة مع لمسات زجاجية مختارة.'
                        : 'مظهر داكن فاخر يطبّق على التطبيق كاملًا، مع حواف زجاجية وطبقات واضحة بدون إزعاج بصري.'}
                    </Text>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                      {selected ? 'هذا هو الوضع النشط حاليًا.' : 'اضغط للتفعيل الفوري وحفظ الاختيار.'}
                    </Text>
                  </GlassHeroOverlay>

                  <GlassActionButton
                    disabled={selected || !onAppearanceModeChange}
                    emphasis={selected ? 'strong' : 'subtle'}
                    label={selected ? 'المظهر الحالي' : 'اختيار هذا المظهر'}
                    onPress={() => onAppearanceModeChange?.(option.mode)}
                  />
                </Box>
              )}
            />
          </BThwaniAppearanceProvider>
        );
      })}
    </Box>
  );
}

function renderPrimarySectionContent(
  section: MySpacePrimaryTab,
  appearanceHydrated: boolean,
  appearanceMode: BThwaniAppearanceMode,
  marketingPrograms: DshMySpaceItem[],
  onAppearanceModeChange?: (mode: BThwaniAppearanceMode) => void,
  onOpenOrders?: () => void,
  onOpenTracking?: () => void,
  onRepeatOrder?: () => void,
) {
  if (section === 'commercial') {
    return <MySpaceCommercialSection compact marketingPrograms={marketingPrograms} />;
  }

  if (section === 'orders') {
    return (
      <MySpaceOrdersSection
        onOpenOrders={onOpenOrders}
        onOpenTracking={onOpenTracking}
        onRepeatOrder={onRepeatOrder}
      />
    );
  }

  if (section === 'wallet') {
    return <MySpaceWalletSection />;
  }

  if (section === 'loyalty') {
    return <DshLoyaltyRewardsScreen />;
  }

  if (section === 'subscriptions') {
    return <DshSubscriptionsScreen />;
  }

  if (section === 'addresses') {
    return <MySpaceAddressesSection />;
  }

  if (section === 'location') {
    return <MySpaceLocationSection />;
  }

  if (section === 'identity') {
    return <MySpaceIdentitySection />;
  }

  if (section === 'appearance') {
    return (
      <MySpaceAppearanceSection
        appearanceHydrated={appearanceHydrated}
        appearanceMode={appearanceMode}
        onAppearanceModeChange={onAppearanceModeChange}
      />
    );
  }

  if (section === 'preferences') {
    return <MySpacePreferencesSection />;
  }

  return null;
}

export function DshMySpaceScreen({
  appearanceHydrated = false,
  appearanceMode = 'lightPremium',
  state = 'ready',
  marketingPrograms = [],
  onAppearanceModeChange,
  onOpenOrders,
  onOpenTracking,
  onRepeatOrder,
  onBack,
  onRetry,
}: DshMySpaceScreenProps) {
  const [activePrimaryTab, setActivePrimaryTab] = React.useState<MySpacePrimaryTab>('orders');
  const { theme } = useTheme();

  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="مساحتي" subtitle="الهوية الشخصية داخل DSH" onRetry={onRetry} />;
  }

  const handlePrimaryChange = (nextTab: MySpacePrimaryTab) => {
    setActivePrimaryTab(nextTab);
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        variant="surface"
        title="مساحتي"
        trailingAction={
          onBack
            ? {
                id: 'back',
                icon: <Icon name="arrow-forward" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'رجوع',
                onPress: onBack,
              }
            : undefined
        }
      />

      <MobileScrollView
        fill
        padding={2}
        gap={2}
        contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}
      >
        <Surface tone="raised" padding={2} gap={2}>
          <Box gap={0} style={{ alignItems: 'flex-end' }}>
            <Text role="titleSm">المسارات الرئيسية</Text>
          </Box>

          <Box gap={2}>
            {primaryTabs.map((section) => (
              <MySpacePrimaryRow
                key={section.id}
                title={section.label}
                subtitle={section.summary}
                iconName={section.iconName}
                selected={section.id === activePrimaryTab}
                onPress={() => handlePrimaryChange(section.id)}
                details={
                  section.id === activePrimaryTab ? (
                    renderPrimarySectionContent(
                      activePrimaryTab,
                      appearanceHydrated,
                      appearanceMode,
                      marketingPrograms,
                      onAppearanceModeChange,
                      onOpenOrders,
                      onOpenTracking,
                      onRepeatOrder
                    )
                  ) : undefined
                }
              />
            ))}
          </Box>
        </Surface>
      </MobileScrollView>
    </View>
  );
}

/**
 * Compatibility alias for deprecated split component.
 * @deprecated Integrated into MySpaceScreen as MySpaceOrdersSection.
 */
export const DshMySpaceOrdersScreen = DshMySpaceScreen;

export default DshMySpaceScreen;
