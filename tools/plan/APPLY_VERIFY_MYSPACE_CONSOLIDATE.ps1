Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$IssueCode = "MYSPACE_CONSOLIDATE"
$SessionId = "$IssueCode-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path "tools\registry\runs" $SessionId
$ZipPath = Join-Path $RunRoot "$SessionId.zip"
$Target = "dsh\frontend\app-client\screens\MySpaceScreen.tsx"
$CommercialPart = "dsh\frontend\app-client\parts\MySpaceCommercialScreen.tsx"
$OrdersPart = "dsh\frontend\app-client\parts\MySpaceOrdersScreen.tsx"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

function Write-RunFile {
  param([string]$Name, [string]$Content)
  $Path = Join-Path $RunRoot $Name
  $Parent = Split-Path -Parent $Path
  if ($Parent -and -not (Test-Path -LiteralPath $Parent)) { New-Item -ItemType Directory -Force -Path $Parent | Out-Null }
  [IO.File]::WriteAllText((Resolve-Path -LiteralPath $Parent).Path + "\" + (Split-Path -Leaf $Path), $Content, [Text.UTF8Encoding]::new($false))
}

function Capture {
  param([string]$Name, [scriptblock]$Command)
  $Path = Join-Path $RunRoot $Name
  try {
    & $Command *>&1 | Out-String | Set-Content -LiteralPath $Path -Encoding utf8
  } catch {
    $_ | Out-String | Set-Content -LiteralPath $Path -Encoding utf8
    throw
  }
}

Capture "00-branch.txt" { git branch --show-current }
Capture "01-head.txt" { git rev-parse HEAD }
Capture "02-status-before.txt" { git --no-pager status --short }
Capture "03-diff-check-before.txt" { git --no-pager diff --check }

$Required = @($Target, $CommercialPart, $OrdersPart)
$Missing = @($Required | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($Missing.Count -gt 0) {
  Write-RunFile "BLOCKED.txt" ("Missing required files:`n" + ($Missing -join "`n"))
  Compress-Archive -Force -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath
  throw "BLOCKED: missing required files. Evidence: $ZipPath"
}

$BackupRoot = Join-Path $RunRoot "backup"
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null
foreach ($File in $Required) {
  $BackupPath = Join-Path $BackupRoot ($File -replace '[\\/:*?"<>|]', "__")
  Copy-Item -LiteralPath $File -Destination $BackupPath -Force
}

$ExistingTarget = Get-Content -LiteralPath $Target -Raw
if ($ExistingTarget -notmatch "DshMySpaceCommercialScreen" -or $ExistingTarget -notmatch "DshMySpaceOrdersScreen") {
  Write-RunFile "BLOCKED.txt" "Target file no longer imports the expected part screens. Refusing deterministic overwrite."
  Compress-Archive -Force -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath
  throw "BLOCKED: target shape changed. Evidence: $ZipPath"
}

$NewContent = @'
import { Ionicons } from '@expo/vector-icons';
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
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
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
import { loyaltyRewardsFixture } from '../data/loyalty-commercial.preview-data';
import {
  subscriptionHeroCopy,
  subscriptionPlanCards,
  type SubscriptionPlanCard,
} from '../data/subscriptions-commercial.preview-data';
import {
  dshMySpaceOrdersFixture,
  dshMySpaceQuickActions,
  type DshMySpaceOrder,
  type DshMySpaceQuickAction,
  type DshMySpaceQuickActionKind,
} from '../data/my-space-orders.preview-data';

export type DshMySpaceItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type DshMySpaceScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  marketingPrograms?: DshMySpaceItem[];
  onOpenOrders?: () => void;
  onOpenPreferences?: () => void;
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

type MySpacePrimaryTab = 'commercial' | 'orders';

type SectionIconName = React.ComponentProps<typeof Ionicons>['name'];

type PrimaryTabConfig = {
  id: MySpacePrimaryTab;
  label: string;
  summary: string;
  iconName: SectionIconName;
};

type MySpaceCallbacks = Pick<
  DshMySpaceScreenProps,
  'onOpenOrders' | 'onOpenTracking' | 'onRepeatOrder'
>;

const primaryTabs: PrimaryTabConfig[] = [
  {
    id: 'commercial',
    label: 'العروض والاشتراكات',
    summary: 'الولاء والمكافآت والاشتراكات والعروض في مساحة واحدة',
    iconName: 'grid-outline',
  },
  {
    id: 'orders',
    label: 'طلباتي',
    summary: 'الطلب والتاريخ والتتبع',
    iconName: 'bag-outline',
  },
];

function MySpacePrimaryRow({
  title,
  subtitle,
  iconName,
  selected,
  onPress,
  details,
}: {
  title: string;
  subtitle: string;
  iconName: SectionIconName;
  selected: boolean;
  onPress: () => void;
  details?: React.ReactNode;
}) {
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
            <Ionicons name={iconName} size={21} color={selected ? theme.brandContrast : theme.brand} />
          </View>

          <Box gap={0} style={{ flex: 1 }}>
            <Text role="bodyStrong">{title}</Text>
            <Text role="bodySm" tone="muted" numberOfLines={2}>
              {subtitle}
            </Text>
          </Box>

          <View style={{ width: 28, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-back'}
              size={20}
              color={isExpanded ? theme.brand : theme.textSoft}
            />
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
      { label: 'مدى **** 4821', detail: 'تنتهي 03/27' },
      { label: 'Visa **** 9055', detail: 'تنتهي 11/28' },
    ],
    [],
  );

  const selectedPlan = subscriptionPlanCards.find((plan) => plan.id === selectedPlanId) ?? subscriptionPlanCards[0];
  const currentPlan = subscriptionPlanCards.find((plan) => plan.id === currentPlanId) ?? selectedPlan;
  const selectedReward = rewardOptions.find((item) => item.label === selectedRewardId) ?? rewardOptions[0];
  const appliedReward = rewardOptions.find((item) => item.label === appliedRewardId) ?? selectedReward;
  const selectedOffer = marketingPrograms.find((item) => item.id === selectedOfferId) ?? marketingPrograms[0];
  const appliedOffer = marketingPrograms.find((item) => item.id === appliedOfferId) ?? selectedOffer;
  const selectedPaymentProfile = paymentProfiles[paymentProfileIndex % paymentProfiles.length];
  const loyaltyBalanceMetric = loyaltyRewardsFixture.metrics[0];
  const rewardsAvailableMetric = loyaltyRewardsFixture.metrics[1];
  const activeEntitlementsMetric = loyaltyRewardsFixture.metrics[3];

  const metricCards = [
    {
      label: 'رصيد الولاء',
      value: loyaltyBalanceMetric?.value ?? '—',
      helperText: loyaltyBalanceMetric?.helperText ?? '—',
      tone: 'brand' as const,
    },
    {
      label: 'الخطة الحالية',
      value: currentPlan.title,
      helperText: currentPlan.cadence,
      tone: 'info' as const,
    },
    {
      label: 'المكافأة المفعلة',
      value: appliedReward?.label ?? 'غير محددة',
      helperText: appliedReward?.value ?? rewardsAvailableMetric?.helperText ?? '—',
      tone: 'warning' as const,
    },
    {
      label: 'العرض المفعّل',
      value: appliedOffer?.title ?? 'غير محدد',
      helperText: appliedOffer?.subtitle ?? 'لا يوجد عرض مباشر',
      tone: 'success' as const,
    },
  ];

  const applyChanges = () => {
    setCurrentPlanId(selectedPlanId);
    setAppliedRewardId(selectedRewardId);
    if (selectedOfferId) {
      setAppliedOfferId(selectedOfferId);
    }
  };

  return (
    <Box gap={compact ? 2 : 3}>
      <Surface
        tone="raised"
        gap={2}
        padding={compact ? 2 : 3}
        style={{ borderWidth: 1, borderColor: theme.line, borderRadius: 22 }}
      >
        <SectionHeader
          title="العروض والاشتراكات"
          subtitle="الولاء والمكافآت والاشتراكات والعروض في صفحة واحدة قابلة للتحكم."
          trailing={<Badge tone="brand" label={subscriptionHeroCopy.eyebrow} />}
        />
      </Surface>

      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        {metricCards.map((metric) => (
          <CommercialMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            helperText={metric.helperText}
            tone={metric.tone}
          />
        ))}
      </Box>

      <Surface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <SectionHeader title="الولاء والمكافآت" subtitle="الرصيد والمزايا والاستبدال من نفس الصفحة." />
        <KeyValueList
          items={[
            { label: 'الرصيد الحالي', value: loyaltyBalanceMetric?.value ?? '—', tone: 'brand' },
            { label: 'المكافآت المتاحة', value: rewardsAvailableMetric?.value ?? '—' },
            { label: 'الاستحقاقات النشطة', value: activeEntitlementsMetric?.value ?? '—', tone: 'success' },
          ]}
          dense
        />

        <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {rewardOptions.map((reward) => (
            <Chip
              key={reward.label}
              label={reward.label}
              tone={selectedRewardId === reward.label ? 'brand' : 'default'}
              onPress={() => setSelectedRewardId(reward.label)}
            />
          ))}
        </Box>

        <Surface tone="inset" gap={1} padding={2} style={{ borderWidth: 1, borderColor: theme.line }}>
          <Text role="bodyStrong">{selectedReward?.label ?? 'اختر مكافأة'}</Text>
          <Text role="bodySm" tone="muted">
            {selectedReward?.helperText ?? 'حدد مكافأة ثم اعتمد التغييرات.'}
          </Text>
          <Text role="caption" tone="muted">
            {selectedReward?.value ?? '—'}
          </Text>
        </Surface>
      </Surface>

      <Surface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <SectionHeader title="الاشتراكات" subtitle={subscriptionHeroCopy.subtitle} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[1] }}>
          <Box layoutDirection="row" gap={2}>
            {subscriptionPlanCards.map((plan) => (
              <SubscriptionPlanTile
                key={plan.id}
                plan={plan}
                selected={selectedPlanId === plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
              />
            ))}
          </Box>
        </ScrollView>

        <KeyValueList
          items={[
            { label: 'الخطة الحالية', value: currentPlan.title, tone: 'brand' },
            { label: 'الخطة المختارة', value: selectedPlan.title },
            { label: 'السعر', value: `${selectedPlan.price} ريال`, tone: 'warning' },
          ]}
        />

        <Box layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text role="bodyStrong">{selectedPaymentProfile.label}</Text>
            <Text role="bodySm" tone="muted">
              {selectedPaymentProfile.detail}
            </Text>
          </Box>
          <Chip label="تغيير" tone="brand" onPress={() => setPaymentProfileIndex((value) => (value + 1) % paymentProfiles.length)} />
        </Box>

        <Surface tone="inset" gap={2} padding={2} style={{ borderWidth: 1, borderColor: theme.line }}>
          <Box layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Text role="bodyStrong">قسيمة اشتراك</Text>
            <Chip label={couponOpen ? 'مفتوحة' : 'إضافة'} tone="brand" onPress={() => setCouponOpen((value) => !value)} />
          </Box>
          {couponOpen ? <Text role="caption" tone="muted">القسيمة جاهزة للإضافة.</Text> : null}
        </Surface>

        <Checkbox
          label="التجديد التلقائي للاشتراك"
          checked={autoRenew}
          onCheckedChange={setAutoRenew}
        />
      </Surface>

      <Surface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <SectionHeader title="العروض" subtitle="العروض والحملات والخصومات من نفس الصفحة." />
        <KeyValueList
          items={[
            { label: 'العروض المتاحة', value: String(marketingPrograms.length || 0), tone: 'brand' },
            { label: 'الخصومات النشطة', value: marketingPrograms.length ? 'متاحة' : 'غير متاحة' },
          ]}
        />

        {marketingPrograms.length ? (
          <>
            <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {marketingPrograms.map((program) => (
                <Chip
                  key={program.id}
                  label={program.title}
                  tone={selectedOfferId === program.id ? 'brand' : 'default'}
                  onPress={() => setSelectedOfferId(program.id)}
                />
              ))}
            </Box>

            <Surface tone="inset" gap={1} padding={2} style={{ borderWidth: 1, borderColor: theme.line }}>
              <Text role="bodyStrong">{selectedOffer?.title ?? 'اختر عرضًا'}</Text>
              <Text role="bodySm" tone="muted">
                {selectedOffer?.subtitle ?? 'حدد عرضًا واضحًا ثم اعتمده.'}
              </Text>
              <Text role="caption" tone="muted">
                {selectedOffer?.meta ?? '—'}
              </Text>
            </Surface>
          </>
        ) : (
          <Text role="bodySm" tone="muted">
            لا توجد عروض مباشرة الآن.
          </Text>
        )}
      </Surface>

      <Surface tone="brand" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.brand, borderRadius: 22 }}>
        <Button label="اعتماد التغييرات" onPress={applyChanges} />
        <Text role="caption" tone="muted" align="center">
          يتم اعتماد الرصيد والخطة والعرض المختار من نفس الصفحة.
        </Text>
      </Surface>
    </Box>
  );
}

function resolveOrderIconName(order: DshMySpaceOrder): React.ComponentProps<typeof Ionicons>['name'] {
  if (order.statusId === 'active') {
    return 'bicycle-outline';
  }

  if (order.fulfillmentId === 'pickup') {
    return 'storefront-outline';
  }

  return order.statusId === 'completed' ? 'checkmark-circle-outline' : 'time-outline';
}

function resolvePrimaryActionLabel(order: DshMySpaceOrder) {
  return order.statusId === 'active' ? 'تتبع الطلب' : 'تكرار الطلب';
}

function resolveSecondaryActionLabel(order: DshMySpaceOrder) {
  return order.statusId === 'active' ? 'تكرار الطلب' : 'التتبع';
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

function OrderCard({
  order,
  featured,
  onOpenTracking,
  onRepeatOrder,
  onOpenOrders,
}: {
  order: DshMySpaceOrder;
  featured?: boolean;
} & MySpaceCallbacks) {
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
          <Ionicons name={iconName} size={20} color={featured ? theme.brandContrast : theme.brand} />
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
  const primaryOrder = resolvePrimaryOrder(dshMySpaceOrdersFixture);
  const repeatReadyOrders = resolveRepeatReadyOrders(dshMySpaceOrdersFixture).filter((order) => order.id !== primaryOrder?.id);
  const pendingReviewOrders = resolvePendingReviewOrders(dshMySpaceOrdersFixture).filter((order) => order.id !== primaryOrder?.id);

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
        <SectionHeader title="كل الطلبات الحديثة" subtitle={`${dshMySpaceOrdersFixture.length} بطاقات متاحة مع CTA حسب الحالة.`} />
        <Box gap={2}>
          {dshMySpaceOrdersFixture.map((order) => (
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

function renderPrimarySectionContent(
  section: MySpacePrimaryTab,
  marketingPrograms: DshMySpaceItem[],
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

  return null;
}

export function DshMySpaceScreen({
  state = 'ready',
  marketingPrograms = [],
  onOpenOrders,
  onOpenPreferences,
  onOpenTracking,
  onRepeatOrder,
  onBack,
  onRetry,
}: DshMySpaceScreenProps) {
  const [activePrimaryTab, setActivePrimaryTab] = React.useState<MySpacePrimaryTab>('orders');

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
                icon: <Icon name="arrow-back" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'رجوع',
                onPress: onBack,
              }
            : undefined
        }
      />

      <MobileScrollView fill padding={2} gap={2} contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}>
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
                  section.id === activePrimaryTab
                    ? renderPrimarySectionContent(
                        activePrimaryTab,
                        marketingPrograms,
                        onOpenOrders,
                        onOpenTracking,
                        onRepeatOrder,
                      )
                    : undefined
                }
              />
            ))}
            {onOpenPreferences ? (
              <MySpacePrimaryRow
                title="تفضيلات التوصيل"
                subtitle="تعليمات التسليم والاستبدال والتنبيهات الخاصة بخدمة DSH"
                iconName="options-outline"
                selected={false}
                onPress={onOpenPreferences}
              />
            ) : null}
          </Box>
        </Surface>
      </MobileScrollView>
    </View>
  );
}

export default DshMySpaceScreen;

'@

[IO.File]::WriteAllText((Resolve-Path -LiteralPath $Target).Path, $NewContent, [Text.UTF8Encoding]::new($false))

$SearchPattern = "DshMySpaceCommercialScreen|DshMySpaceOrdersScreen|MySpaceCommercialScreen|MySpaceOrdersScreen"
$ReferenceReport = Join-Path $RunRoot "04-reference-scan-after-inline.txt"
$rg = Get-Command rg -ErrorAction SilentlyContinue
if ($rg) {
  rg -n $SearchPattern --glob "!tools/registry/runs/**" --glob "!$CommercialPart" --glob "!$OrdersPart" . *>&1 |
    Out-String |
    Set-Content -LiteralPath $ReferenceReport -Encoding utf8
} else {
  Get-ChildItem -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx |
    Where-Object {
      $_.FullName -notlike "*\tools\registry\runs\*" -and
      $_.FullName -notlike "*MySpaceCommercialScreen.tsx" -and
      $_.FullName -notlike "*MySpaceOrdersScreen.tsx"
    } |
    Select-String -Pattern $SearchPattern |
    ForEach-Object { "$($_.Path):$($_.LineNumber):$($_.Line)" } |
    Out-String |
    Set-Content -LiteralPath $ReferenceReport -Encoding utf8
}

$Refs = Get-Content -LiteralPath $ReferenceReport -Raw
$UnexpectedRefs = $Refs -split "`r?`n" | Where-Object {
  $_.Trim().Length -gt 0 -and
  $_ -notmatch [regex]::Escape($Target) -and
  $_ -notmatch "^\s*$"
}

if ($UnexpectedRefs.Count -gt 0) {
  Write-RunFile "BLOCKED-delete.txt" ("Unexpected references exist outside target. Parts were NOT deleted.`n`n" + ($UnexpectedRefs -join "`n"))
} else {
  Remove-Item -LiteralPath $CommercialPart, $OrdersPart -Force
  Write-RunFile "DELETE-RESULT.txt" "Deleted obsolete part files after reference scan found no external consumers."
}

Capture "05-status-after-apply.txt" { git --no-pager status --short }
Capture "06-diff-stat.txt" { git --no-pager diff --stat }
Capture "07-diff-name-status.txt" { git --no-pager diff --name-status }
Capture "08-diff-check-after.txt" { git --no-pager diff --check }

$TscStatus = "SKIPPED"
try {
  Capture "09-tsc-noemit.txt" { pnpm -w exec tsc --noEmit }
  $TscStatus = "PASS"
} catch {
  $TscStatus = "FAIL"
}

Capture "10-final-diff.patch" { git --no-pager diff --binary -- $Target $CommercialPart $OrdersPart }
Capture "11-untracked.txt" { git ls-files --others --exclude-standard }

$DeletionBlocked = Test-Path -LiteralPath (Join-Path $RunRoot "BLOCKED-delete.txt")
$Status = if ($TscStatus -eq "PASS" -and -not $DeletionBlocked) { "PASS_LOCAL_GATES" } elseif ($TscStatus -eq "PASS") { "PASS_WITH_DELETE_BLOCKED" } else { "FIX_REQUIRED" }

$Summary = @"
status: $Status
session_id: $SessionId
repo: C:\bthwani-suite
target: $Target
merged_from:
- $CommercialPart
- $OrdersPart
deleted_parts: $(-not $DeletionBlocked)
tsc: $TscStatus
evidence_root: $RunRoot
handoff_zip: $ZipPath

Required visual verification:
- افتح شاشة مساحتي.
- تحقق من تبويب العروض والاشتراكات.
- تحقق من تبويب طلباتي.
- تحقق من RTL: الأيقونة والنص في كتلة يمين صحيحة، والسهم/الإجراء في الطرف المقابل.
- تحقق من عدم وجود clipping أسفل الشاشة مع bottom navigation / Android nav.
"@

Write-RunFile "SUMMARY.txt" $Summary

$EvidenceJson = [ordered]@{
  status = $Status
  session_id = $SessionId
  repo = "C:\bthwani-suite"
  target = $Target
  merged_from = @($CommercialPart, $OrdersPart)
  deleted_parts = (-not $DeletionBlocked)
  tsc = $TscStatus
  evidence_root = $RunRoot
  handoff_zip = $ZipPath
} | ConvertTo-Json -Depth 5
Write-RunFile "evidence.json" $EvidenceJson

Compress-Archive -Force -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath

Write-Host ""
Write-Host "RESULT: $Status"
Write-Host "Evidence: $RunRoot"
Write-Host "Zip: $ZipPath"
Write-Host ""
Write-Host "Next: upload the ZIP or paste SUMMARY.txt + 08-diff-check-after.txt + 09-tsc-noemit.txt + after screenshot."
