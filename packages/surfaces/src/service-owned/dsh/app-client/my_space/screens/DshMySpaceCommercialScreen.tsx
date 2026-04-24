import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  KeyValueList,
  SectionHeader,
  Surface,
  Text,
  spacing,
  useTheme,
} from '@bthwani/ui-kit';
import { loyaltyRewardsFixture } from '../../loyalty/loyaltyCommercialDeck';
import { subscriptionHeroCopy, subscriptionPlanCards, type SubscriptionPlanCard } from '../../subscriptions/subscriptionsCommercialDeck';

export type DshMySpaceCommercialProgram = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type DshMySpaceCommercialScreenProps = {
  compact?: boolean;
  marketingPrograms?: DshMySpaceCommercialProgram[];
};

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
          shadowColor: selected ? theme.brand : '#0f172a',
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

export function DshMySpaceCommercialScreen({
  compact = false,
  marketingPrograms = [],
}: DshMySpaceCommercialScreenProps) {
  const { theme } = useTheme();
  const rewardSection = loyaltyRewardsFixture.sections.find((section) => section.title === 'المكافآت') ?? loyaltyRewardsFixture.sections[1];
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

export default DshMySpaceCommercialScreen;
