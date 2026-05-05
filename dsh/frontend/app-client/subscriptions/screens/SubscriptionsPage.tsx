import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  colorPalette,
  SectionHeader,
  spacing,
  Surface,
  Text,
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
      <Surface
        tone="raised"
        gap={1}
        padding={2}
        style={{
          minHeight: 142,
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
          <Text role="bodyStrong">باقة</Text>
          <Text role="titleLg" style={{ color: selected ? theme.brand : undefined }}>
            {plan.price}
          </Text>
          <Text role="bodySm" tone="muted">
            {plan.cadence}
          </Text>
        </Box>
        <Text role="caption" style={{ textAlign: 'center', color: selected ? theme.brand : undefined }}>
          {plan.title}
        </Text>
      </Surface>
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
    <Box gap={compact ? 2 : 3}>
      <Surface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <SectionHeader
          title={subscriptionHeroCopy.title}
          subtitle={subscriptionHeroCopy.subtitle}
          trailing={<Badge tone="brand" label={subscriptionHeroCopy.eyebrow} />}
        />
      </Surface>

      <Surface
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
          <Box layoutDirection="row" gap={2}>
            {visiblePlans.map((plan) => (
              <SubscriptionPlanTile
                key={plan.id}
                plan={plan}
                selected={selectedPlanId === plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
              />
            ))}
          </Box>
        </ScrollView>
      </Surface>

      <Surface tone="default" gap={0} padding={2} style={{ borderRadius: 18, backgroundColor: theme.brandSurface, borderWidth: 0 }}>
        <Box layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Text role="bodyStrong">استعراض الباقات المميزة</Text>
          <Text role="titleSm">‹</Text>
        </Box>
      </Surface>

      <Surface tone="raised" gap={2} padding={compact ? 2 : 3} style={{ borderWidth: 1, borderColor: theme.line }}>
        <Box gap={0} style={{ alignItems: 'flex-end' }}>
          <Text role="titleSm">طريقة الدفع</Text>
          <Text role="bodySm" tone="muted">الدفع عند أول طلب.</Text>
        </Box>

        <Box layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text role="bodyStrong">{selectedPaymentProfile.label}</Text>
            <Text role="bodySm" tone="muted">{selectedPaymentProfile.detail}</Text>
          </Box>
          <Chip label="تغيير" tone="brand" onPress={togglePaymentProfile} />
        </Box>

        <Surface tone="inset" gap={2} padding={2} style={{ borderWidth: 1, borderColor: theme.line }}>
          <Box layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Text role="bodyStrong">هل لديك قسيمة اشتراك؟</Text>
            <Chip label="إضافة" tone="brand" onPress={() => setCouponOpen((value) => !value)} />
          </Box>
          {couponOpen ? <Text role="caption" tone="muted">يمكن إضافة القسيمة من هنا.</Text> : null}
        </Surface>

        <Checkbox label="التجديد التلقائي للاشتراك عند الانتهاء" checked={autoRenew} onCheckedChange={setAutoRenew} />

        <Box layoutDirection="row" style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text role="bodySm" tone="muted">إجمالي الاشتراك</Text>
          <Text role="titleSm">{totalAmount} ريال</Text>
        </Box>

        <Button label="اشترك الآن" onPress={applySelectedPlan} />
      </Surface>
    </Box>
  );
}

export default SubscriptionsPage;
