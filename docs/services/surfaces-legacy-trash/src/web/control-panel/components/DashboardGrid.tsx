import React, { useMemo } from 'react';
import Link from 'next/link';
import { DashboardCard } from './DashboardCard';
import { useI18n } from '@bthwani/ui-kit';


export function DashboardGrid() {
  const { t } = useI18n();

  const hubs = useMemo(
    () => [
      {
      id: 'admin',
      title: t('web.control panel.components.DashboardGrid.cardAdminTitle'),
      description: t('web.control panel.components.DashboardGrid.cardAdminDescription'),
      icon: '⚙️',
      color: 'bg-blue-500',
      path: '/(surfaces)/admin',
      },
      {
      id: 'ops',
      title: t('web.control panel.components.DashboardGrid.cardOperationsTitle'),
      description: t('web.control panel.components.DashboardGrid.cardOperationsDescription'),
      icon: '🔄',
      color: 'bg-green-500',
      path: '/(surfaces)/ops',
      },
      {
      id: 'finance',
      title: t('web.control panel.components.DashboardGrid.cardFinanceTitle'),
      description: t('web.control panel.components.DashboardGrid.cardFinanceDescription'),
      icon: '💰',
      color: 'bg-yellow-500',
      path: '/(surfaces)/finance',
      },
      {
      id: 'support',
      title: t('web.control panel.components.DashboardGrid.cardSupportTitle'),
      description: t('web.control panel.components.DashboardGrid.cardSupportDescription'),
      icon: '🎧',
      color: 'bg-purple-500',
      path: '/(surfaces)/support',
      },
      {
      id: 'marketing',
      title: t('web.control panel.components.DashboardGrid.cardMarketingTitle'),
      description: t('web.control panel.components.DashboardGrid.cardMarketingDescription'),
      icon: '📈',
      color: 'bg-pink-500',
      path: '/(surfaces)/marketing',
      },
      {
      id: 'fleet',
      title: t('web.control panel.components.DashboardGrid.cardFleetTitle'),
      description: t('web.control panel.components.DashboardGrid.cardFleetDescription'),
      icon: '🚗',
      color: 'bg-indigo-500',
      path: '/(surfaces)/fleet',
      },
      {
      id: 'partner',
      title: t('web.control panel.components.DashboardGrid.cardPartnersTitle'),
      description: t('web.control panel.components.DashboardGrid.cardPartnersDescription'),
      icon: '🤝',
      color: 'bg-teal-500',
      path: '/(surfaces)/partner',
      },
      {
      id: 'data',
      title: t('web.control panel.components.DashboardGrid.cardDataTitle'),
      description: t('web.control panel.components.DashboardGrid.cardDataDescription'),
      icon: '📊',
      color: 'bg-orange-500',
      path: '/(surfaces)/data',
      },
      {
      id: 'ssot',
      title: t('web.control panel.components.DashboardGrid.cardAdminTitle1'),
      description: t('web.control panel.components.DashboardGrid.cardAdminTitle2'),
      icon: '🎯',
      color: 'bg-red-500',
      path: '/(surfaces)/ssot',
      },
      {
      id: 'security',
      title: t('web.control panel.components.DashboardGrid.cardAdminTitle9'),
      description: t('web.control panel.components.DashboardGrid.cardAdminDescription0'),
      icon: '🔒',
      color: 'bg-gray-700',
      path: '/(surfaces)/security',
      },
      {
      id: 'hr',
      title: t('web.control panel.components.DashboardGrid.cardAdminDescription7'),
      description: t('web.control panel.components.DashboardGrid.cardAdminDescription8'),
      icon: '👥',
      color: 'bg-cyan-500',
      path: '/(surfaces)/hr',
      },
      {
      id: 'observability',
      title: t('web.control panel.components.DashboardGrid.cardMonitoringTitle'),
      description: t('web.control panel.components.DashboardGrid.cardMonitoringDescription'),
      icon: '📡',
      color: 'bg-lime-500',
      path: '/(surfaces)/observability',
      },
      {
      id: 'services',
      title: t('web.control panel.components.DashboardGrid.cardServicesTitle'),
      description: t('web.control panel.components.DashboardGrid.cardServicesDescription'),
      icon: '🔧',
      color: 'bg-emerald-500',
      path: '/(surfaces)/services',
      },
      {
      id: 'products',
      title: t('web.control panel.components.DashboardGrid.cardProductsTitle'),
      description: t('web.control panel.components.DashboardGrid.cardProductsDescription'),
      icon: '📦',
      color: 'bg-violet-500',
      path: '/(surfaces)/products',
      },
      {
      id: 'tech-xp',
      title: t('web.control panel.components.DashboardGrid.cardTechExperienceTitle'),
      description: t('web.control panel.components.DashboardGrid.cardTechExperienceDescription'),
      icon: '🚀',
      color: 'bg-rose-500',
      path: '/(surfaces)/tech-xp',
      },
      {
      id: 'platform-gov',
      title: t('web.control panel.components.DashboardGrid.cardGovernanceTitle'),
      description: t('web.control panel.components.DashboardGrid.cardGovernanceDescription'),
      icon: '⚖️',
      color: 'bg-slate-600',
      path: '/(surfaces)/platform-gov',
      },
    ],
    [t]
  );
  return (
    <div className="dashboard-grid">
      {hubs.map((hub) => (
        <DashboardCard key={hub.id} hub={hub} />
      ))}
    </div>
  );
}

