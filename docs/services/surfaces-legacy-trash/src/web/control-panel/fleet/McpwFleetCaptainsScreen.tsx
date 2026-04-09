'use client';

/** CONTROL PANEL Fleet — قائمة الكباتن (DSH). الخارطة 3.5: إدارة الكباتن. */
import { SkeletonScreen } from '../components/SkeletonScreen';
import { Users } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export default function McpwFleetCaptainsScreen() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.fleet.McpwFleetCaptainsScreen.captainsList')}
      subtitle={t('web.control panel.fleet.McpwFleetCaptainsScreen.manageDshCaptains')}
      icon={Users}
      showComingSoon={true}
      sections={[]}
    />
  );
}

