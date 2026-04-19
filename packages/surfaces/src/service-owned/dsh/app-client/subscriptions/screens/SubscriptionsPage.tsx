import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import {
  BthBox,
  BthBadge,
  BthButton,
  BthCheckbox,
  BthChip,
  BthSurface,
  BthSectionHeader,
  BthText,
  spacing,
  useTheme,
} from '@bthwani/ui-kit';
import { subscriptionHeroCopy, subscriptionPlanCards, type SubscriptionPlanCard } from '../subscriptionsCommercialDeck';

export type SubscriptionsPageProps = {
  compact?: boolean;
};

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
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={{ width: 120 }}>
      <BthSurface
        tone="raised"
        gap={1}
        padding={2}
        style={{
          minHeight: 142,
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
          <BthText role="bodyStrong">باقة</BthText>
          <BthText role="titleLg" style={{ color: selected ? theme.brand : undefined }}>
            {plan.price}
          </BthText>
          <BthText role="bodySm" tone="muted">
            {plan.cadence}
          </BthText>
        </BthBox>
        <BthText role="caption" style={{ color: selected ? theme.brand : undefined }} align="center">
          {plan.title}
        </BthText>
      </BthSurface>
    </Pressable>
  );
}

export function SubscriptionsPage({ compact = false }: SubscriptionsPageProps) {
  const { theme } = useTheme();
  const initialCurrentPlanId = subscriptionPlanCards.find((plan) => plan.current)?.id ?? 'weekly';
  const [currentPlanId, setCurrentPlanId] = React.useState(initialCurrentPlanId);
  const [selectedPlanId, setSelectedPlanId] = React.useState(initialCurrentPlanId);
  const [paymentProfileIndex, setPaymentProfileIndex] = React.useState(0);
  const [autoRenew, setAutoRenew] = React.useState(true);
  const [couponOpen, setCouponOpen] = React.useState(false);

  const paymentProfiles = React.useMemo(
    () => [
      { label: 'مدى **** 4821', detail: 'تنتهي 03/27' },
      { label: 'Visa **** 9055', detail: 'تنتهي 11/28' },
    ],
    [],
  );

  const selectedPlan = subscriptionPlanCards.find((plan) => plan.id === selectedPlanId) ?? subscriptionPlanCards[0];
  const selectedPaymentProfile = paymentProfiles[paymentProfileIndex % paymentProfiles.length];
  const totalAmount = selectedPlan.price;
  const visiblePlans = React.useMemo(
    () => [
      subscriptionPlanCards.find((plan) => plan.id === 'family'),
      subscriptionPlanCards.find((plan) => plan.id === 'weekly'),
      subscriptionPlanCards.find((plan) => plan.id === 'monthly'),
    ].filter((plan): plan is SubscriptionPlanCard => Boolean(plan)),
    [],
  );

  const applySelectedPlan = () => {
    setCurrentPlanId(selectedPlan.id);
    setSelectedPlanId(selectedPlan.id);
  };

  const togglePaymentProfile = () => {
    setPaymentProfileIndex((value) => (value + 1) % paymentProfiles.length);
  };

  return (
    <BthBox gap={compact ? 2 : 3}>
      <BthSurface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <BthSectionHeader
          title={subscriptionHeroCopy.title}
          subtitle={subscriptionHeroCopy.subtitle}
          trailing={<BthBadge tone="brand" label={subscriptionHeroCopy.eyebrow} />}
        />
      </BthSurface>

      <BthSurface
        gap={3}
        padding={compact ? 2 : 3}
        style={{
          borderWidth: 0,
          borderRadius: 28,
          backgroundColor: theme.brand,
          overflow: 'hidden',
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[1] }}>
          <BthBox layoutDirection="row" gap={2}>
            {visiblePlans.map((plan) => (
              <SubscriptionPlanTile
                key={plan.id}
                plan={plan}
                selected={selectedPlanId === plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
              />
            ))}
          </BthBox>
        </ScrollView>
      </BthSurface>

      <BthSurface
        tone="default"
        gap={0}
        padding={2}
        style={{
          borderRadius: 18,
          backgroundColor: theme.brandSurface,
          borderWidth: 0,
        }}
      >
        <BthBox layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <BthText role="bodyStrong">استعراض الباقات المميزة</BthText>
          <BthText role="titleSm">‹</BthText>
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <BthBox gap={0} style={{ alignItems: 'flex-end' }}>
          <BthText role="titleSm">طريقة الدفع</BthText>
          <BthText role="bodySm" tone="muted">
            الدفع عند أول طلب.
          </BthText>
        </BthBox>

        <BthBox layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <BthBox gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
            <BthText role="bodyStrong">{selectedPaymentProfile.label}</BthText>
            <BthText role="bodySm" tone="muted">
              {selectedPaymentProfile.detail}
            </BthText>
          </BthBox>
          <BthChip label="تغيير" tone="brand" onPress={togglePaymentProfile} />
        </BthBox>

        <BthSurface tone="inset" gap={2} padding={2} style={{ borderWidth: 1, borderColor: theme.line }}>
          <BthBox layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <BthText role="bodyStrong">هل لديك قسيمة اشتراك؟</BthText>
            <BthChip label="إضافة" tone="brand" onPress={() => setCouponOpen((value) => !value)} />
          </BthBox>
          {couponOpen ? <BthText role="caption" tone="muted">يمكن إضافة القسيمة من هنا.</BthText> : null}
        </BthSurface>

        <BthCheckbox
          label="التجديد التلقائي للاشتراك عند الانتهاء"
          checked={autoRenew}
          onCheckedChange={setAutoRenew}
        />

        <BthBox layoutDirection="row" style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
          <BthText role="bodySm" tone="muted">إجمالي الاشتراك</BthText>
          <BthText role="titleSm">{totalAmount} ريال</BthText>
        </BthBox>

        <BthButton label="اشترك الآن" onPress={applySelectedPlan} />
      </BthSurface>
    </BthBox>
  );
}

export default SubscriptionsPage;
