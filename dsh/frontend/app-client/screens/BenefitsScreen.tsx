import React from 'react';
import { DshOperationScreen, type DshOperationScreenProps } from '../parts/OperationScreen';
import { DshLoyaltyRewardsScreen } from '../parts/LoyaltyRewardsScreen';
import { DshSubscriptionsScreen } from '../parts/SubscriptionsScreen';

export type DshBenefitsHubScreenProps = Omit<DshOperationScreenProps, 'title' | 'subtitle'> & {
  screenId?: string;
};

export function DshBenefitsHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshBenefitsHubScreenProps) {
  const isLoyaltyScreen = screenId === 'entitlements-get' || screenId?.startsWith('loyalty-') === true;
  const isSubscriptionScreen =
    screenId === 'subscription' ||
    screenId === 'subscriptions' ||
    screenId === 'subscription-family-get' ||
    screenId?.startsWith('subscription') === true;

  if (state !== 'ready') {
    return (
      <DshOperationScreen
        state={state}
        title={isLoyaltyScreen ? 'الولاء والمكافآت' : isSubscriptionScreen ? 'الاشتراكات' : 'مركز الخدمات'}
        subtitle={isLoyaltyScreen ? 'صفحة الولاء والمكافآت الخاصة برصيد النقاط والعروض.' : isSubscriptionScreen ? 'صفحة تحكم واحدة لإدارة الباقة والدفع والعائلة من نفس المسار.' : 'يرجى الانتظار بينما نقوم بتجهيز المسار المطلوب.'}
        onRetry={onRetry}
      />
    );
  }

  if (isLoyaltyScreen) {
    return <DshLoyaltyRewardsScreen />;
  }

  if (isSubscriptionScreen) {
    return <DshSubscriptionsScreen />;
  }

  return (
    <DshOperationScreen
      state="empty"
      title="المسار غير معروف"
      subtitle="المسار المطلوب غير متوفر حالياً أو لم يتم تحديده بشكل صحيح."
      onRetry={onRetry}
      onPrimaryAction={onPrimaryAction}
    />
  );
}

export default DshBenefitsHubScreen;
