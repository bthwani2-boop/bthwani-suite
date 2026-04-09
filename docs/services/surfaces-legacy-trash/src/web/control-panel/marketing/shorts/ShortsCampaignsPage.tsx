'use client';

import { useI18n } from '@bthwani/ui-kit';
import { SkeletonScreen } from '../../components/SkeletonScreen';
import { Megaphone } from 'lucide-react';

export function ShortsCampaignsPage() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('marketing.sec_shorts_campaigns')}
      subtitle={t('marketing.shorts_page_subtitle')}
      icon={Megaphone}
      showComingSoon={true}
      sections={[]}
    />
  );
}
