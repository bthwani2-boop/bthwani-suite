import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import {
  BthBadge,
  BthBox,
  BthButton,
  BthCard,
  BthCheckbox,
  BthChip,
  BthKeyValueList,
  BthSectionHeader,
  BthSurface,
  BthText,
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
    <BthCard
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
      <BthText role="hero" style={{ color: accent }}>
        {value}
      </BthText>
    </BthCard>
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
      <BthSurface
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
        <BthBox gap={0} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <BthText role="bodyStrong">{plan.title}</BthText>
          <BthText role="titleLg" style={{ color: selected ? theme.brand : undefined }}>
            {plan.price}
          </BthText>
          <BthText role="bodySm" tone="muted">
            {plan.cadence}
          </BthText>
        </BthBox>
      </BthSurface>
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
    <BthBox gap={compact ? 2 : 3}>
      <BthSurface
        tone="raised"
        gap={2}
        padding={compact ? 2 : 3}
        style={{ borderWidth: 1, borderColor: theme.line, borderRadius: 22 }}
      >
        <BthSectionHeader
          title="العروض والاشتراكات"
          subtitle="الولاء والمكافآت والاشتراكات والعروض في صفحة واحدة قابلة للتحكم."
          trailing={<BthBadge tone="brand" label={subscriptionHeroCopy.eyebrow} />}
        />
      </BthSurface>

      <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        {metricCards.map((metric) => (
          <CommercialMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            helperText={metric.helperText}
            tone={metric.tone}
          />
        ))}
      </BthBox>

      <BthSurface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="الولاء والمكافآت" subtitle="الرصيد والمزايا والاستبدال من نفس الصفحة." />
        <BthKeyValueList
          items={[
            { label: 'الرصيد الحالي', value: loyaltyBalanceMetric?.value ?? '—', tone: 'brand' },
            { label: 'المكافآت المتاحة', value: rewardsAvailableMetric?.value ?? '—' },
            { label: 'الاستحقاقات النشطة', value: activeEntitlementsMetric?.value ?? '—', tone: 'success' },
          ]}
        />

        <BthBox layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {rewardOptions.map((reward) => (
            <BthChip
              key={reward.label}
              label={reward.label}
              tone={selectedRewardId === reward.label ? 'brand' : 'default'}
              onPress={() => setSelectedRewardId(reward.label)}
            />
          ))}
        </BthBox>

        <BthSurface tone="inset" gap={1} padding={2} style={{ borderWidth: 1, borderColor: theme.line }}>
          <BthText role="bodyStrong">{selectedReward?.label ?? 'اختر مكافأة'}</BthText>
          <BthText role="bodySm" tone="muted">
            {selectedReward?.helperText ?? 'حدد مكافأة ثم اعتمد التغييرات.'}
          </BthText>
          <BthText role="caption" tone="muted">
            {selectedReward?.value ?? '—'}
          </BthText>
        </BthSurface>
      </BthSurface>

      <BthSurface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="الاشتراكات" subtitle={subscriptionHeroCopy.subtitle} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[1] }}>
          <BthBox layoutDirection="row" gap={2}>
            {subscriptionPlanCards.map((plan) => (
              <SubscriptionPlanTile
                key={plan.id}
                plan={plan}
                selected={selectedPlanId === plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
              />
            ))}
          </BthBox>
        </ScrollView>

        <BthKeyValueList
          items={[
            { label: 'الخطة الحالية', value: currentPlan.title, tone: 'brand' },
            { label: 'الخطة المختارة', value: selectedPlan.title },
            { label: 'السعر', value: `${selectedPlan.price} ريال`, tone: 'warning' },
          ]}
        />

        <BthBox layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <BthBox gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
            <BthText role="bodyStrong">{selectedPaymentProfile.label}</BthText>
            <BthText role="bodySm" tone="muted">
              {selectedPaymentProfile.detail}
            </BthText>
          </BthBox>
          <BthChip label="تغيير" tone="brand" onPress={() => setPaymentProfileIndex((value) => (value + 1) % paymentProfiles.length)} />
        </BthBox>

        <BthSurface tone="inset" gap={2} padding={2} style={{ borderWidth: 1, borderColor: theme.line }}>
          <BthBox layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <BthText role="bodyStrong">قسيمة اشتراك</BthText>
            <BthChip label={couponOpen ? 'مفتوحة' : 'إضافة'} tone="brand" onPress={() => setCouponOpen((value) => !value)} />
          </BthBox>
          {couponOpen ? <BthText role="caption" tone="muted">القسيمة جاهزة للإضافة.</BthText> : null}
        </BthSurface>

        <BthCheckbox
          label="التجديد التلقائي للاشتراك"
          checked={autoRenew}
          onCheckedChange={setAutoRenew}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader title="العروض" subtitle="العروض والحملات والخصومات من نفس الصفحة." />
        <BthKeyValueList
          items={[
            { label: 'العروض المتاحة', value: String(marketingPrograms.length || 0), tone: 'brand' },
            { label: 'الخصومات النشطة', value: marketingPrograms.length ? 'متاحة' : 'غير متاحة' },
          ]}
        />

        {marketingPrograms.length ? (
          <>
            <BthBox layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {marketingPrograms.map((program) => (
                <BthChip
                  key={program.id}
                  label={program.title}
                  tone={selectedOfferId === program.id ? 'brand' : 'default'}
                  onPress={() => setSelectedOfferId(program.id)}
                />
              ))}
            </BthBox>

            <BthSurface tone="inset" gap={1} padding={2} style={{ borderWidth: 1, borderColor: theme.line }}>
              <BthText role="bodyStrong">{selectedOffer?.title ?? 'اختر عرضًا'}</BthText>
              <BthText role="bodySm" tone="muted">
                {selectedOffer?.subtitle ?? 'حدد عرضًا واضحًا ثم اعتمده.'}
              </BthText>
              <BthText role="caption" tone="muted">
                {selectedOffer?.meta ?? '—'}
              </BthText>
            </BthSurface>
          </>
        ) : (
          <BthText role="bodySm" tone="muted">
            لا توجد عروض مباشرة الآن.
          </BthText>
        )}
      </BthSurface>

      <BthSurface tone="brand" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.brand, borderRadius: 22 }}>
        <BthButton label="اعتماد التغييرات" onPress={applyChanges} />
        <BthText role="caption" tone="muted" align="center">
          يتم اعتماد الرصيد والخطة والعرض المختار من نفس الصفحة.
        </BthText>
      </BthSurface>
    </BthBox>
  );
}

export default DshMySpaceCommercialScreen;