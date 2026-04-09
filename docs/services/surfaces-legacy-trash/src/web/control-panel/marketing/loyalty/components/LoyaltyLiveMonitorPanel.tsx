'use client';

import { SkeletonScreen } from '../../../components/SkeletonScreen';
import { Activity } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export function LoyaltyLiveMonitorPanel() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.marketing.loyalty.components.LoyaltyLiveMonitorPanel.liveIndicators')}
      subtitle={t('web.control panel.marketing.loyalty.components.LoyaltyLiveMonitorPanel.liveKpis')}
      icon={Activity}
      showComingSoon={true}
      sections={[{ title: t('web.control panel.marketing.loyalty.components.LoyaltyLiveMonitorPanel.comingSoon'), items: [] }]}
    />
  );
}

