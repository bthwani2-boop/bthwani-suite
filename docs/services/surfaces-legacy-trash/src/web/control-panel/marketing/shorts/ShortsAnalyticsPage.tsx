'use client';

import { useI18n } from '@bthwani/ui-kit';
import { SkeletonScreen } from '../../components/SkeletonScreen';
import { BarChart3 } from 'lucide-react';

export function ShortsAnalyticsPage() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('marketing.sec_shorts_analytics')}
      subtitle={t('marketing.shorts_page_subtitle')}
      icon={BarChart3}
      showComingSoon={true}
      sections={[]}
    />
  );
}
