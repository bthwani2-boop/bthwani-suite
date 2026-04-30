'use client';

/** CONTROL PANEL Fleet — حالة توفر الكباتن (DSH). الخارطة 3.5: إدارة الكباتن. */
import { SkeletonScreen } from '../components/SkeletonScreen';
import { Activity } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export default function McpwFleetAvailabilityScreen() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.fleet.McpwFleetAvailabilityScreen.availabilityStatus')}
      subtitle={t('web.control panel.fleet.McpwFleetAvailabilityScreen.dshCaptainsAvailability')}
      icon={Activity}
      showComingSoon={true}
      sections={[]}
    />
  );
}

