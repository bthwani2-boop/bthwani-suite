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

  if (state !== 'ready') {
    return (
      <DshOperationScreen
        state={state}
        title={isLoyaltyScreen ? 'الولاء والمكافآت' : 'الاشتراكات'}
        subtitle={isLoyaltyScreen ? 'صفحة الولاء والمكافآت الخاصة برصيد النقاط والعروض.' : 'صفحة تحكم واحدة لإدارة الباقة والدفع والعائلة من نفس المسار.'}
        onRetry={onRetry}
      />
    );
  }

  if (isLoyaltyScreen) {
    return <DshLoyaltyRewardsScreen />;
  }

  return <DshSubscriptionsScreen />;
}

export default DshBenefitsHubScreen;
