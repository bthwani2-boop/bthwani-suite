'use client';

import React from 'react';
import { Box, Button, Surface, Text, Icon } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { dshCatalogMetrics, dshCatalogNodes, dshCatalogPipeline } from './catalog';
import { OperationsSuggestionCard } from '../operations/operations.ui';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

type CatalogView = 'master' | 'pipeline';

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const [activeTab, setActiveTab] = React.useState<CatalogView>('master');
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(dshCatalogNodes[0]?.id ?? null);

  const selectedNode = dshCatalogNodes.find(n => n.id === selectedNodeId) ?? dshCatalogNodes[0];

  const KPIs = [
    { label: 'طلبات معلقة', value: dshCatalogMetrics.pendingPartnerReviews, trend: '+2', status: 'danger' },
    { label: 'مراجعة تسويقية', value: dshCatalogMetrics.pendingMarketingReviews, trend: '-1', status: 'warning' },
    { label: 'الفئات السيادية', value: dshCatalogMetrics.mainCategories, trend: '0', status: 'normal' },
    { label: 'منتجات نشطة', value: dshCatalogMetrics.approvedProducts, trend: '+12', status: 'normal' },
  ];

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Slim Professional Header */}
      <header className={styles.operationsTopBar}>
        <div className={styles.operationsTitleBlock}>
          <div style={{
            width: '40px', height: '40px', backgroundColor: '#0A2F5C', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
          }}>📦</div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>حوكمة الكتالوجات</h1>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>النظام السيادي الموحد v2.6</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {KPIs.slice(0, 3).map((kpi, idx) => (
              <div key={idx} className={styles.operationsPulseItem}>
                <span>{kpi.label}</span>
                <span className={styles.operationsPulseValue}>{kpi.value}</span>
              </div>
            ))}
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(10,47,92,0.1)' }} />
          <button style={{
            padding: '6px 16px', backgroundColor: '#0A2F5C', color: '#fff',
            borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
          }}>نشر الكتالوج</button>
        </div>
      </header>

      {/* 2. Operations-Style Tabs */}
      <nav className={styles.operationsTabs}>
        <button
          className={`${styles.operationsTab} ${activeTab === 'master' ? styles.operationsTabActive : ''}`}
          onClick={() => setActiveTab('master')}
        >التحكم الرئيسي</button>
        <button
          className={`${styles.operationsTab} ${activeTab === 'pipeline' ? styles.operationsTabActive : ''}`}
          onClick={() => setActiveTab('pipeline')}
        >مسار التوريد</button>
      </nav>

      {/* 3. Main Operational Content */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <div className={styles.operationsCompactSurface}>

            {/* Row 1: Catalog Signals */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>نبض الكتالوج</h2>
            </div>

            <div className={styles.operationsSingleRowBlocks}>
              {KPIs.map((kpi, idx) => (
                <div
                  key={idx}
                  className={styles.operationsSingleRowItem}
                  style={{ borderTop: `4px solid ${kpi.status === 'danger' ? '#DC2626' : kpi.status === 'warning' ? '#F59E0B' : '#0A2F5C'}` }}
                >
                  <div className={styles.operationsCompactCardTitle}>{kpi.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: kpi.status === 'danger' ? '#DC2626' : '#0A2F5C' }}>{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* Row 2: Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr 350px', gap: '12px' }}>

              {/* Left Panel: Classification Navigator */}
              <div className={styles.operationsCompactPanel}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>هيكل التصنيفات</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {dshCatalogNodes.map(node => {
                    const isActive = node.id === selectedNodeId;
                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        style={{
                          padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                          backgroundColor: isActive ? 'rgba(10,47,92,0.06)' : 'transparent',
                          border: isActive ? '1px solid rgba(10,47,92,0.1)' : '1px solid transparent',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: isActive ? '#0A2F5C' : '#64748B' }}>{node.label}</span>
                          <span style={{ fontSize: '10px', color: '#94A3B8' }}>{node.owner.toUpperCase()}</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0A2F5C' }}>{node.countLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center Panel: Workspace */}
              <div className={styles.operationsCompactPanel}>
                {selectedNode && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                           <span style={{ fontSize: '10px', fontWeight: 800, color: '#FF500D', backgroundColor: 'rgba(255,80,13,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{selectedNode.kind === 'main-category' ? 'فئة سيادية' : 'فئة فرعية'}</span>
                           <span style={{ fontSize: '11px', color: '#94A3B8' }}>ID: {selectedNode.id}</span>
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>{selectedNode.label}</h2>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                         <button className={styles.operationsCompactActionSecondary}>سجل التغييرات</button>
                         <button className={styles.operationsCompactActionPrimary}>إدارة القواعد</button>
                      </div>
                    </div>

                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{selectedNode.summary}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '8px' }}>
                      {[
                        { label: 'سلطة التحكم', value: selectedNode.owner === 'catalog' ? 'الكتالوج المركزي' : 'إدخال خارجي', icon: '🛡️' },
                        { label: 'مرحلة الاعتماد', value: selectedNode.stage, icon: '🚥' },
                        { label: 'النزاهة الهيكلية', value: 'تم التحقق', icon: '✓' },
                        { label: 'المزامنة', value: 'لحظية', icon: '⚡' },
                      ].map(item => (
                        <div key={item.label} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.05)', backgroundColor: '#F8FAFC' }}>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>{item.icon} {item.label}</div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2F5C' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0A2F5C', marginBottom: '8px' }}>الأصول المرتبطة ({selectedNode.countLabel})</h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                         {[1, 2, 3].map(i => (
                           <div key={i} className={styles.operationsCompactCard}>
                             <div className={styles.operationsCompactCardMeta}>
                               <span className={styles.operationsCompactCardTitle}>منتج نموذجي {i}</span>
                               <span className={styles.operationsCompactCardText}>SKU: PRD-00{i} • 24.00 ر.س</span>
                             </div>
                             <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span className={styles.operationsCompactCardStatus} style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>نشط</span>
                             </div>
                             <div className={styles.operationsCompactCardActions}>
                                <button className={styles.operationsCompactActionSecondary}>تحرير</button>
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel: Intelligence & Pipeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className={styles.operationsCompactPanel}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>ذكاء الكتالوج (Live)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { title: 'تضارب في الأسعار', reason: 'تم اكتشاف 3 حالات شاذة في فئة المقاضي.', confidence: 'high' as const, icon: '⚖️' },
                      { title: 'تحسين الفئات', reason: 'نقترح دمج فئات المخبوزات والحلويات.', confidence: 'medium' as const, icon: '🧠' },
                      { title: 'الانتشار التشغيلي', reason: 'زيادة 15% في الطلبات على فئة المطاعم.', confidence: 'high' as const, icon: '📈' },
                    ].map((insight, i) => (
                      <OperationsSuggestionCard
                        key={i}
                        title={insight.title}
                        label={insight.icon}
                        reason={insight.reason}
                        confidence={insight.confidence}
                        actions={<button className={styles.operationsCompactActionPrimary} style={{ padding: '2px 8px', fontSize: '10px' }}>اتخاذ إجراء</button>}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.operationsCompactPanel}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>سجل التدفق السيادي</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    {dshCatalogPipeline.slice(0, 3).map((step, idx) => (
                      <div key={idx} style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.05)', backgroundColor: '#F8FAFC' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0A2F5C' }}>{step.title}</div>
                        <div style={{ fontSize: '11px', color: idx === 0 ? '#16A34A' : '#64748B' }}>● {step.statusLabel}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}


export default ControlPanelDshCatalogScreen;
