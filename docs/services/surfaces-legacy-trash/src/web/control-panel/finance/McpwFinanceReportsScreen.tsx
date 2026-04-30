'use client';

import { SkeletonScreen } from '../components/SkeletonScreen';
import { BarChart3 } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

/** CONTROL PANEL التقارير المالية — واجهة عرض فقط؛ الربط بعمليات التصدير والتقارير لاحقاً. */
export default function McpwFinanceReportsScreen() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.finance.McpwFinanceReportsScreen.financialReports')}
      subtitle={t('web.control panel.finance.McpwFinanceReportsScreen.wltSettlementsAndPayoutsReports')}
      icon={BarChart3}
      showComingSoon={true}
    />
  );
}

