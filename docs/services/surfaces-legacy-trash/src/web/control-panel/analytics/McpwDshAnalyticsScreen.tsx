'use client';

/** CONTROL PANEL Analytics — تقارير طلبات وتوصيل DSH. الخارطة 3.5: تقارير DSH. */
import { SkeletonScreen } from '../components/SkeletonScreen';
import { TrendingUp } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export default function McpwDshAnalyticsScreen() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.analytics.McpwDshAnalyticsScreen.Dsh')}
      subtitle={t('web.control panel.analytics.McpwDshAnalyticsScreen.ordersCaptainsPartnersReports')}
      icon={TrendingUp}
      showComingSoon={true}
      sections={[]}
    />
  );
}

