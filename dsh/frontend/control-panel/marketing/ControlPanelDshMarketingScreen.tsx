'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  ControlPanelDshMarketingScreen as SmartSignalLayerScreen,
  type ControlPanelDshMarketingScreenProps as SmartSignalLayerScreenProps,
} from './SmartSignalLayerScreen';
import { BannersCommandDeckScreen } from './BannersCommandDeckScreen';
import { GrowthCommandDeckScreen } from './GrowthCommandDeckScreen';
import { LoyaltyCommandDeckScreen, type LoyaltyCommandDeckScreenProps } from './LoyaltyCommandDeckScreen';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshMarketingScreenProps = SmartSignalLayerScreenProps & LoyaltyCommandDeckScreenProps;

type MarketingControlView = 'growth' | 'banners' | 'loyalty' | 'signals';

export function ControlPanelDshMarketingScreen(props: ControlPanelDshMarketingScreenProps) {
  const [activeTab, setActiveTab] = React.useState<MarketingControlView>('growth');

  const TABS = [
    { id: 'growth', label: 'النمو والفيديو', count: '8', icon: '⚡' },
    { id: 'banners', label: 'إدارة البنرات', count: '5', icon: '🖼️' },
    { id: 'loyalty', label: 'الولاء والمزايا', count: '12', icon: '💎' },
    { id: 'signals', label: 'الإشارات الذكية', count: '4', icon: '📡' },
  ] as const;

  const PULSE_METRICS = [
    { label: 'الوصول النشط', value: '1.2M', trend: '+12%', trendTone: 'success' },
    { label: 'فيديو المراجعة', value: '8', trend: 'عالي', trendTone: 'warning' },
    { label: 'مواقع البنرات', value: '3/5', trend: 'متاح', trendTone: 'info' },
    { label: 'معدل التحويل', value: '4.8%', trend: '+0.4%', trendTone: 'success' },
  ];

  const renderActiveLane = () => {
    switch (activeTab) {
      case 'growth':
        return <GrowthCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'banners':
        return <BannersCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'signals':
        return <SmartSignalLayerScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'loyalty':
        return <LoyaltyCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      default:
        return <GrowthCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
    }
  };

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area - Luxury Glassmorphism */}
      <header className={`${styles.operationsTopBar} ${styles.premiumGlass}`}>
        <div className={styles.operationsTitleBlock}>
          <div className={styles.intelligenceGlow} style={{ 
            width: '42px', 
            height: '42px', 
            backgroundColor: '#0A2F5C', 
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 8px 24px rgba(10, 47, 92, 0.3)'
          }}>
            🎯
          </div>
          <Box gap={0}>
            <h1 style={{ letterSpacing: '-0.03em', fontSize: '24px', fontWeight: '900' }}>Marketing Cockpit</h1>
            <p style={{ fontWeight: 700, color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Decision-Ready Intelligence Platform</p>
          </Box>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {PULSE_METRICS.map((metric) => (
              <div key={metric.label} className={styles.operationsPulseItem}>
                <span>{metric.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={styles.operationsPulseValue}>{metric.value}</span>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    backgroundColor: metric.trendTone === 'success' ? '#DCFCE7' : metric.trendTone === 'warning' ? '#FEF3C7' : '#E0F2FE',
                    color: metric.trendTone === 'success' ? '#16A34A' : metric.trendTone === 'warning' ? '#D97706' : '#0369A1',
                    fontWeight: 800
                  }}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Operations Tabs - Refined Pills */}
      <nav className={styles.operationsTabs} style={{ padding: '12px 14px', borderBottom: '1px solid rgba(10, 47, 92, 0.05)' }}>
        {TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`${styles.operationsTab} ${isSelected ? styles.operationsTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 20px',
                fontSize: '14px',
                boxShadow: isSelected ? '0 4px 12px rgba(10, 47, 92, 0.2)' : 'none'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              <span style={{ 
                marginRight: '8px', 
                fontSize: '11px', 
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(10,47,92,0.08)', 
                color: isSelected ? '#fff' : '#0A2F5C',
                padding: '2px 8px',
                borderRadius: '8px',
                fontWeight: 800
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 3. Main Active Area - No Scroll Viewport */}
      <main className={styles.operationsMainPanel} style={{ backgroundColor: '#F1F5F9' }}>
        <div className={styles.operationsInnerScroll}>
          <Box gap={4}>
            {renderActiveLane()}
          </Box>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshMarketingScreen;

