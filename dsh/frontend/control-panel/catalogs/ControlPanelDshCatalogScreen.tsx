'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { dshCatalogMetrics, dshCatalogNodes, dshCatalogPipeline } from './catalog';
import { ControlPanelDshCatalogCategoriesScreen } from './categories';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

type CatalogView = 'hierarchy' | 'governance' | 'pipeline';

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<CatalogView>('hierarchy');

  const PULSE_METRICS = [
    { label: 'طلبات الشركاء', value: dshCatalogMetrics.pendingPartnerReviews, tone: '#F97316' },
    { label: 'قائمة التسويق', value: dshCatalogMetrics.pendingMarketingReviews, tone: '#0ea5e9' },
    { label: 'الفئات السيادية', value: dshCatalogMetrics.mainCategories, tone: '#8b5cf6' },
    { label: 'المنتجات النشطة', value: dshCatalogMetrics.approvedProducts, tone: '#16A34A' },
  ];

  const TABS = [
    { id: 'hierarchy', label: 'الهيكل المعماري', icon: '🌳' },
    { id: 'governance', label: 'ذكاء البيانات', icon: '🧠' },
    { id: 'pipeline', label: 'سلسلة التوريد', icon: '🛤️' },
  ] as const;

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* Premium 2026 Top Deck */}
      <header className={`${styles.operationsTopBar} ${styles.premiumGlass}`} style={{ height: '100px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', width: '100%', height: '100%', padding: '0 24px', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
          {/* Title on the Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h1 style={{ margin: 0, letterSpacing: '-0.02em', fontSize: '24px', fontWeight: '950', color: '#0A2F5C', textAlign: 'right' }}>غرفة قيادة الكتالوج</h1>
              <Text role="caption" style={{ fontWeight: '800', color: '#64748B', letterSpacing: '0.02em', textAlign: 'right' }}>التحكم السيادي في الأنظمة v2.6</Text>
            </div>
            <div className={styles.intelligenceGlow} style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#0A2F5C', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 12px 32px rgba(10, 47, 92, 0.4)'
            }}>
              📦
            </div>
          </div>

          {/* Metrics on the Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {PULSE_METRICS.map((metric) => (
              <div key={metric.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <Text role="caption" style={{ fontWeight: '900', color: '#94A3B8', fontSize: '11px', textAlign: 'center' }}>{metric.label}</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: metric.tone }} />
                  <Text role="titleSm" style={{ fontWeight: '900', fontSize: '22px' }}>{metric.value}</Text>
                </div>
              </div>
            ))}
            <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(0,0,0,0.05)', margin: '0 10px' }} />
            <Button label="التدقيق اللحظي" style={{ borderRadius: '14px', backgroundColor: '#0A2F5C', fontWeight: '900' }} />
          </div>
        </div>
      </header>

      {/* Navigation & Controls */}
      <nav style={{ padding: '20px 24px', display: 'flex', gap: '12px', background: 'rgba(241, 245, 249, 0.5)' }}>
        {TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '10px 24px',
                borderRadius: '16px',
                backgroundColor: isSelected ? '#0A2F5C' : 'transparent',
                color: isSelected ? '#fff' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 8px 24px rgba(10, 47, 92, 0.25)' : 'none'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      <main className={styles.operationsMainPanel} style={{ backgroundColor: '#F8FAFC' }}>
        <div className={styles.operationsInnerScroll} style={{ padding: '24px' }}>
          <Box gap={5}>
            {activeTab === 'hierarchy' && (
              <Box gap={5}>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {dshCatalogNodes.filter(n => n.kind !== 'approved-product').map(node => (
                    <Surface key={node.id} tone="raised" padding={5} gap={3} style={{ 
                      flexGrow: 1, 
                      minWidth: 320, 
                      borderRadius: '32px',
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Title Info Right */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Text role="caption" style={{ fontWeight: '900', color: '#F97316', textAlign: 'right' }}>فئة سيادية</Text>
                          <Text role="titleSm" style={{ fontWeight: '950', fontSize: '22px', textAlign: 'right' }}>{node.label}</Text>
                        </div>
                        {/* Badge Left */}
                        <div style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', borderRadius: '12px' }}>
                          <Text role="caption" style={{ fontWeight: '900', color: '#0F172A' }}>{node.countLabel}</Text>
                        </div>
                      </div>
                      
                      <Text role="bodySm" tone="muted" style={{ fontWeight: '500', lineHeight: '1.6', textAlign: 'right' }}>{node.summary}</Text>
                      <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Status Right */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                          <Text role="caption" style={{ fontWeight: '800', color: '#16A34A', textAlign: 'right' }}>النظام محمي</Text>
                        </div>
                        {/* Button Left */}
                        <Button label="تدقيق العقد" tone="ghost" style={{ fontWeight: '800' }} />
                      </div>
                    </Surface>
                  ))}
                </div>
                <ControlPanelDshCatalogCategoriesScreen />
              </Box>
            )}

            {activeTab === 'governance' && (
              <Box gap={5}>
                <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
                  <Surface tone="brand" padding={6} gap={4} style={{ 
                    flexGrow: 2, 
                    minWidth: 400, 
                    borderRadius: '40px',
                    background: 'linear-gradient(145deg, #0A2F5C 0%, #172554 100%)',
                    boxShadow: '0 32px 64px rgba(10, 47, 92, 0.3)'
                  }}>
                    <Text role="caption" tone="inverse" style={{ fontWeight: '900', letterSpacing: '0.1em' }}>مؤشر صحة النظام</Text>
                    <Box layoutDirection="row" align="baseline" gap={2}>
                      <Text role="bodyLg" tone="inverse" style={{ fontWeight: '950', fontSize: '84px', letterSpacing: '-0.06em' }}>94</Text>
                      <Text role="titleSm" tone="inverse" style={{ fontWeight: '900', opacity: 0.5, marginRight: '10px' }}>/ 100</Text>
                    </Box>
                    <Box layoutDirection="row" gap={3} style={{ marginTop: 10 }}>
                      <Surface tone="inverse" padding={3} style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.1)' }}>
                        <Text role="caption" tone="inverse" style={{ fontWeight: '800' }}>✓ تم التحقق من 1,240 عقدة</Text>
                      </Surface>
                      <Surface tone="inverse" padding={3} style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.1)' }}>
                        <Text role="caption" tone="inverse" style={{ fontWeight: '800' }}>⚠ تم اكتشاف 4 حالات شاذة</Text>
                      </Surface>
                    </Box>
                  </Surface>

                  <Surface tone="raised" padding={6} gap={5} style={{ flexGrow: 1, minWidth: 320, borderRadius: '40px' }}>
                    <Text role="titleSm" style={{ fontWeight: '900' }}>تغذية الذكاء الاصطناعي</Text>
                    <Box gap={4}>
                      {[
                        { icon: '⚠️', title: 'تضارب الفئات', desc: 'تم العثور على إدخالات مكررة في المطاعم' },
                        { icon: '🛑', title: 'شذوذ في الأسعار', desc: 'تباين غير طبيعي في قائمة المقاضي' },
                        { icon: '⚡', title: 'تصنيف تلقائي', desc: 'تم نقل 12 صنفاً إلى المخبوزات' }
                      ].map((item, i) => (
                        <Box key={i} layoutDirection="row" gap={3} align="center">
                          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>{item.icon}</div>
                          <Box gap={0}>
                            <Text role="bodyStrong" style={{ fontWeight: '900' }}>{item.title}</Text>
                            <Text role="caption" tone="muted" style={{ fontWeight: '600' }}>{item.desc}</Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Surface>
                </Box>
              </Box>
            )}

            {activeTab === 'pipeline' && (
              <WebSectionCard title="منطق التوريد الرقمي">
                <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
                  {dshCatalogPipeline.map((step, idx) => (
                    <Surface key={step.id} tone="raised" padding={5} gap={3} style={{ 
                      flexGrow: 1, 
                      minWidth: 260, 
                      borderRadius: '32px',
                      borderTop: `6px solid ${idx === 3 ? '#16A34A' : '#E2E8F0'}`
                    }}>
                      <Text role="caption" style={{ fontWeight: '900', color: '#94A3B8' }}>المرحلة 0{idx + 1}</Text>
                      <Text role="titleSm" style={{ fontWeight: '900' }}>{step.title}</Text>
                      <div style={{ padding: '6px 12px', backgroundColor: idx === 3 ? '#DCFCE7' : '#F1F5F9', borderRadius: '10px', alignSelf: 'flex-start' }}>
                        <Text role="caption" style={{ fontWeight: '900', color: idx === 3 ? '#16A34A' : '#64748B' }}>{step.statusLabel.toUpperCase()}</Text>
                      </div>
                    </Surface>
                  ))}
                </Box>
              </WebSectionCard>
            )}
          </Box>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
