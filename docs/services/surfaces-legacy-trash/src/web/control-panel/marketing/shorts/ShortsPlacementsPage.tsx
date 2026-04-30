'use client';

import { useI18n } from '@bthwani/ui-kit';
import { SkeletonScreen } from '../../components/SkeletonScreen';
import { MapPin } from 'lucide-react';

export function ShortsPlacementsPage() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('marketing.sec_shorts_placements')}
      subtitle={t('marketing.shorts_page_subtitle')}
      icon={MapPin}
      showComingSoon={true}
      sections={[]}
    />
  );
}
