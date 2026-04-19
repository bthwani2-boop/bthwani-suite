import React from 'react';
import { DshOperationScreen, type DshOperationScreenProps } from '../../patterns/screens/DshOperationScreen';
import { LoyaltyRewardsPage } from '../../loyalty/screens/LoyaltyRewardsPage';
import { SubscriptionsPage } from './SubscriptionsPage';

export type DshBenefitsHubScreenProps = DshOperationScreenProps & {
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
    return <LoyaltyRewardsPage />;
  }

  return <SubscriptionsPage />;
}

export default DshBenefitsHubScreen;