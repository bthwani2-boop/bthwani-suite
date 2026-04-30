'use client';

import { SkeletonScreen } from '../../../components/SkeletonScreen';
import { Lightbulb } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export function LoyaltyLearningInsightsPanel() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.marketing.loyalty.components.LoyaltyLearningInsightsPanel.learningInsights')}
      subtitle={t('web.control panel.marketing.loyalty.components.LoyaltyLearningInsightsPanel.bestWorstOffers')}
      icon={Lightbulb}
      showComingSoon={true}
      sections={[{ title: t('web.control panel.marketing.loyalty.components.LoyaltyLearningInsightsPanel.comingSoon'), items: [] }]}
    />
  );
}

