'use client';

import { SkeletonScreen } from '../../../components/SkeletonScreen';
import { Wrench } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export function LoyaltyProgramBuilder() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.marketing.loyalty.components.LoyaltyProgramBuilder.buildLoyaltyProgram')}
      subtitle={t('web.control panel.marketing.loyalty.components.LoyaltyProgramBuilder.programBuilderConfig')}
      icon={Wrench}
      showComingSoon={true}
      sections={[{ title: t('web.control panel.marketing.loyalty.components.LoyaltyProgramBuilder.comingSoon'), items: [] }]}
    />
  );
}

