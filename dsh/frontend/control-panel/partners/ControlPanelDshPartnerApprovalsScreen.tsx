'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text } from '@bthwani/ui-kit';
import { PartnerIntakeLane } from './PartnerIntakeLane';
import { PartnerTopologyLane } from './PartnerTopologyLane';
import { DshPartnerPromotionEligibilityScreen } from './DshPartnerPromotionEligibilityScreen';
import { dshPartnerIntakeMetrics } from './workflow';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshPartnerApprovalsScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  catalogHref?: string;
  marketingHref?: string;
  initialTab?: 'intake' | 'promotion' | 'topology';
};

const METRIC_ARABIC: Record<string, string> = {
  'Offer Pending Approval': 'بانتظار العرض',
  'Partner Review': 'مراجعة الشريك',
  'جاهز للتسويق': 'جاهز للتسويق',
};

export function ControlPanelDshPartnerApprovalsScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  catalogHref = '/catalogs',
  marketingHref = '/marketing',
  initialTab = 'intake',
}: ControlPanelDshPartnerApprovalsScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(initialTab);

  const TABS = [
    { id: 'intake', label: 'طلبات الميدان', count: '4' },
    { id: 'promotion', label: 'أهلية الترويج', count: '3' },
    { id: 'topology', label: 'مسارات الخدمة', count: '6' },
  ] as const;

  const renderActiveLane = () => {
    switch (activeTab) {
      case 'intake':
        return <PartnerIntakeLane hubHref={hubHref} />;
      case 'promotion':
        return <DshPartnerPromotionEligibilityScreen marketingHref={marketingHref} catalogHref={catalogHref} />;
      case 'topology':
        return <PartnerTopologyLane />;
      default:
        return <PartnerIntakeLane hubHref={hubHref} />;
    }
  };

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area */}
      <header className={styles.operationsTopBar}>
        <div className={styles.operationsTitleBlock}>
          <h1>شركاء DSH</h1>
          <p>حوكمة واعتماد متاجر الميدان</p>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {dshPartnerIntakeMetrics.map((metric) => (
              <div key={metric.id} className={styles.operationsPulseItem}>
                <span>{METRIC_ARABIC[metric.label] || metric.label}</span>
                <span>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Operations Tabs */}
      <nav className={styles.operationsTabs}>
        {TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`${styles.operationsTab} ${isSelected ? styles.operationsTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span style={{ 
                marginRight: '8px', 
                fontSize: '10px', 
                backgroundColor: isSelected ? '#FF500D' : 'rgba(10,47,92,0.1)', 
                color: isSelected ? '#fff' : '#0A2F5C',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 3. Main Active Area */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          {renderActiveLane()}
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshPartnerApprovalsScreen;

