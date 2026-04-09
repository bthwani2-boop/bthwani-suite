'use client';

import { SkeletonScreen } from '../../../components/SkeletonScreen';
import { Wallet } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export function LoyaltyFundingPanel() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.marketing.loyalty.components.LoyaltyFundingPanel.discountFunding')}
      subtitle={t('web.control panel.marketing.loyalty.components.LoyaltyFundingPanel.discountFundingConfig')}
      icon={Wallet}
      showComingSoon={true}
      sections={[{ title: t('web.control panel.marketing.loyalty.components.LoyaltyFundingPanel.comingSoon'), items: [] }]}
    />
  );
}

