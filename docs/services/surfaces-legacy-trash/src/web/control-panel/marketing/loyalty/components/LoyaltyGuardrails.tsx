'use client';

import { SkeletonScreen } from '../../../components/SkeletonScreen';
import { ShieldCheck } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export function LoyaltyGuardrails() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.marketing.loyalty.components.LoyaltyGuardrails.protectionLimits')}
      subtitle={t('web.control panel.marketing.loyalty.components.LoyaltyGuardrails.UsageCaps')}
      icon={ShieldCheck}
      showComingSoon={true}
      sections={[{ title: t('web.control panel.marketing.loyalty.components.LoyaltyGuardrails.comingSoon'), items: [] }]}
    />
  );
}

