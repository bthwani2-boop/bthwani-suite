'use client';

import { SkeletonScreen } from '../../../components/SkeletonScreen';
import { FileBarChart } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export function LoyaltyOutcomeReportPanel() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.marketing.loyalty.components.LoyaltyOutcomeReportPanel.outcomesReport')}
      subtitle={t('web.control panel.marketing.loyalty.components.LoyaltyOutcomeReportPanel.successMessage')}
      icon={FileBarChart}
      showComingSoon={true}
      sections={[{ title: t('web.control panel.marketing.loyalty.components.LoyaltyOutcomeReportPanel.comingSoon'), items: [] }]}
    />
  );
}

