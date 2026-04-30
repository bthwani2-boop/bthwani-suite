'use client';

import { SkeletonScreen } from '../../../components/SkeletonScreen';
import { semanticRoles } from '@bthwani/ui-kit';
import { LayoutList, Plus } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit';

export function LoyaltyProgramsPage() {
  const { t } = useI18n();
  return (
    <SkeletonScreen
      title={t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.loyaltyPrograms')}
      subtitle={t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.programsSimulationInsights')}
      icon={LayoutList}
      showComingSoon={true}
      primaryAction={
        <Link
          href="/marketing/loyalty/programs"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: semanticRoles.primaryCTA,
            color: semanticRoles.primaryCTAText,
          }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          برنامج ولاء جديد
        </Link>
      }
      sections={[
        {
          title: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.paths'),
          description: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.singleViewPerPath'),
          items: [
            { label: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.programsList'), href: '/marketing/loyalty/programs', description: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.managePrograms') },
            { label: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.runSimulationBeforePublish'), href: '/marketing/loyalty/simulate', description: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.runSimulationBeforePublish') },
            { label: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.insightsAndLearning'), href: '/marketing/loyalty/insights', description: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.insightsAndLearning') },
            { label: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.budgetsUtilization'), href: '/marketing/loyalty/guardrails', description: t('web.control panel.marketing.loyalty.components.LoyaltyProgramsPage.budgetsUtilization') },
          ],
        },
      ]}
    />
  );
}

