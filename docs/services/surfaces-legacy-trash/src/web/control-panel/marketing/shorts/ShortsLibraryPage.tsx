'use client';

import { useI18n } from '@bthwani/ui-kit';
import { SkeletonScreen } from '../../components/SkeletonScreen';
import { Library } from 'lucide-react';

export function ShortsLibraryPage() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('marketing.sec_shorts_library')}
      subtitle={t('marketing.shorts_page_subtitle')}
      icon={Library}
      showComingSoon={true}
      sections={[]}
    />
  );
}
