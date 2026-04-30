'use client';

/** CONTROL PANEL Finance — عمولات ومدفوعات DSH. الخارطة 3.5: مالية DSH. */
import { SkeletonScreen } from '../components/SkeletonScreen';
import { DollarSign } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export default function McpwDshFinanceScreen() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.finance.McpwDshFinanceScreen.Dsh')}
      subtitle={t('web.control panel.finance.McpwDshFinanceScreen.captainsPartnersPayouts')}
      icon={DollarSign}
      showComingSoon={true}
      sections={[]}
    />
  );
}

