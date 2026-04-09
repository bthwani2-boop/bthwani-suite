'use client';

import { SkeletonScreen } from '../../../components/SkeletonScreen';
import { Calculator } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export function LoyaltySimulationPanel() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.marketing.loyalty.components.LoyaltySimulationPanel.programSimulation')}
      subtitle={t('web.control panel.marketing.loyalty.components.LoyaltySimulationPanel.simulationInputsAndResults')}
      icon={Calculator}
      showComingSoon={true}
      sections={[{ title: t('web.control panel.marketing.loyalty.components.LoyaltySimulationPanel.comingSoon'), items: [] }]}
    />
  );
}

