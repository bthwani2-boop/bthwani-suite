'use client';

/** CONTROL PANEL Fleet — تقييم الكباتن tier (DSH). الخارطة 3.5: إدارة الكباتن. */
import { SkeletonScreen } from '../components/SkeletonScreen';
import { Award } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export default function McpwFleetCaptainTierScreen() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.fleet.McpwFleetCaptainTierScreen.Tier')}
      subtitle={t('web.control panel.fleet.McpwFleetCaptainTierScreen.dshCaptainTierAndRating')}
      icon={Award}
      showComingSoon={true}
      sections={[]}
    />
  );
}

