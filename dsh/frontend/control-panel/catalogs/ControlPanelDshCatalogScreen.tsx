'use client';

import React from 'react';
import { Box, Button, Surface, Text, Icon } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { dshCatalogMetrics, dshCatalogNodes, dshCatalogPipeline, dshCatalogProducts, DshCatalogProduct } from './catalog';
import { OperationsSuggestionCard } from '../operations/operations.ui';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

type CatalogView = 'master' | 'pipeline';
type CatalogFilter = 'all' | 'categories' | 'master' | 'partner' | 'review' | 'exception' | 'conflict';

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const [activeTab, setActiveTab] = React.useState<CatalogView>('master');
  const [activeFilter, setActiveFilter] = React.useState<CatalogFilter>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(dshCatalogProducts[0]?.id ?? null);

  const selectedProduct = dshCatalogProducts.find(p => p.id === selectedProductId) ?? dshCatalogProducts[0];

  const filteredProducts = dshCatalogProducts.filter(p => {
    const matchesSearch = p.name.includes(searchQuery) || p.sku.includes(searchQuery);
    if (!matchesSearch) return false;

    if (activeFilter === 'master') return p.isMaster;
    if (activeFilter === 'partner') return !p.isMaster;
    if (activeFilter === 'review') return p.status === 'review';
    if (activeFilter === 'conflict') return p.status === 'conflict';
    if (activeFilter === 'exception') return p.mediaPolicy === 'partner-owned-exception';
    return true;
  });

  const KPIs = [
    { label: 'المنتجات المركزية', value: dshCatalogMetrics.approvedProducts, trend: '+12', status: 'normal' },
    { label: 'مراجعة الشركاء', value: dshCatalogMetrics.pendingPartnerReviews, trend: '+2', status: 'danger' },
    { label: 'تعارضات الأسعار', value: dshCatalogMetrics.priceConflicts, trend: '3', status: 'warning' },
    { label: 'استثناءات الصور', value: dshCatalogMetrics.imageExceptions, trend: '5', status: 'warning' },
    { label: 'الفئات النشطة', value: dshCatalogMetrics.mainCategories, trend: '0', status: 'normal' },
  ];

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header */}
      <header className={styles.operationsTopBar}>
        <div className={styles.operationsTitleBlock}>
          <div style={{
            width: '40px', height: '40px', backgroundColor: '#0A2F5C', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
          }}>📦</div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>Catalog Command Center</h1>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>حوكمة المنتجات المركزية v3.0 (Simulation)</p>
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
          }}>نشر التحديثات</button>
        </div>
      </header>

      {/* 2. Operations Tabs */}
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

      {/* 3. Main Panel */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <div className={styles.operationsCompactSurface}>

            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
               <div style={{ flex: 1, position: 'relative' }}>
                 <input
                   type="text"
                   placeholder="بحث في آلاف المنتجات (SKU, اسم، فئة)..."
                   style={{ width: '100%', padding: '10px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px' }}
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               <div style={{ display: 'flex', gap: '6px' }}>
                 {(['all', 'master', 'partner', 'review', 'conflict', 'exception'] as CatalogFilter[]).map(f => (
                   <button
                     key={f}
                     onClick={() => setActiveFilter(f)}
                     style={{
                       padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                       backgroundColor: activeFilter === f ? '#0A2F5C' : '#F8FAFC',
                       color: activeFilter === f ? '#fff' : '#64748B',
                       border: '1px solid #E2E8F0'
                     }}
                   >
                     {f === 'all' && 'الكل'}
                     {f === 'master' && 'مركزي'}
                     {f === 'partner' && 'شريك'}
                     {f === 'review' && 'مراجعة'}
                     {f === 'conflict' && 'تعارض سعر'}
                     {f === 'exception' && 'استثناء صور'}
                   </button>
                 ))}
               </div>
            </div>

            {/* 3-Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 380px', gap: '12px', height: 'calc(100vh - 280px)' }}>

              {/* Column 1: Right (Categories & Policies) */}
              <div className={styles.operationsCompactPanel} style={{ overflowY: 'auto' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0A2F5C', marginBottom: '12px' }}>هيكل التصنيفات</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {dshCatalogNodes.map(node => (
                    <div key={node.id} style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{node.emojiFallback}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>{node.label}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{node.countLabel}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,80,13,0.05)', border: '1px dashed #FF500D' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#FF500D', margin: '0 0 8px 0' }}>سياسة الوسائط (Media Policy)</h4>
                  <p style={{ fontSize: '11px', color: '#0A2F5C', margin: 0, lineHeight: 1.4 }}>
                    الافتراضي: <strong>صورة مركزية</strong> من الكتالوج.<br/>
                    الاستثناء: المطاعم تسمح بصور الشريك بعد مراجعة التسويق.
                  </p>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0A2F5C', marginBottom: '12px' }}>علاقة الأسطح (Surfaces)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { l: 'العميل', v: 'المنتج المنشور', i: '📱' },
                      { l: 'الشريك', v: 'السعر/المخزون', i: '🏪' },
                      { l: 'التسويق', v: 'حملات ترويجية', i: '📣' },
                      { l: 'الميداني', v: 'بيانات أولية', i: '📋' },
                    ].map(s => (
                      <div key={s.l} style={{ padding: '8px', backgroundColor: '#fff', border: '1px solid #F1F5F9', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#64748B' }}>{s.i} {s.l}</div>
                        <div style={{ fontSize: '11px', fontWeight: 800 }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Center (Product List Dense) */}
              <div className={styles.operationsCompactPanel} style={{ overflowY: 'auto', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#F8FAFC', zIndex: 10 }}>
                    <tr>
                      <th style={{ padding: '12px', fontSize: '12px', borderBottom: '1px solid #E2E8F0' }}>المنتج</th>
                      <th style={{ padding: '12px', fontSize: '12px', borderBottom: '1px solid #E2E8F0' }}>SKU</th>
                      <th style={{ padding: '12px', fontSize: '12px', borderBottom: '1px solid #E2E8F0' }}>السعر الأساسي</th>
                      <th style={{ padding: '12px', fontSize: '12px', borderBottom: '1px solid #E2E8F0' }}>الحالة</th>
                      <th style={{ padding: '12px', fontSize: '12px', borderBottom: '1px solid #E2E8F0' }}>السياسة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProductId(p.id)}
                        style={{ cursor: 'pointer', backgroundColor: selectedProductId === p.id ? 'rgba(10,47,92,0.03)' : 'transparent', borderBottom: '1px solid #F1F5F9' }}
                      >
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{p.name}</div>
                          <div style={{ fontSize: '10px', color: '#94A3B8' }}>{p.categoryLabel}</div>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '11px', color: '#64748B' }}>{p.sku}</td>
                        <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 800 }}>{p.price} ر.س</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800,
                            backgroundColor: p.status === 'active' ? '#DCFCE7' : p.status === 'conflict' ? '#FEE2E2' : '#FEF3C7',
                            color: p.status === 'active' ? '#16A34A' : p.status === 'conflict' ? '#DC2626' : '#D97706'
                          }}>
                            {p.status === 'active' ? 'نشط' : p.status === 'conflict' ? 'تعارض' : 'مراجعة'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '10px', color: '#0A2F5C' }}>
                          {p.mediaPolicy === 'catalog-owned-media' ? 'مركزي 🛡️' : 'استثناء 🔓'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Column 3: Left (Inspector) */}
              <div className={styles.operationsCompactPanel} style={{ borderLeft: 'none', borderRight: '1px solid #E2E8F0', overflowY: 'auto' }}>
                {selectedProduct ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>Product Inspector</h2>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>ID: {selectedProduct.id}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}>
                       <div style={{ width: '60px', height: '60px', backgroundColor: '#E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                         {selectedProduct.mediaPolicy === 'catalog-owned-media' ? '📦' : '🥘'}
                       </div>
                       <div>
                         <div style={{ fontSize: '14px', fontWeight: 800 }}>{selectedProduct.name}</div>
                         <div style={{ fontSize: '12px', color: '#64748B' }}>GTIN: {selectedProduct.gtin || 'N/A'}</div>
                       </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                       <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                         <div style={{ fontSize: '10px', color: '#64748B' }}>Product Master</div>
                         <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2F5C' }}>{selectedProduct.price} ر.س</div>
                       </div>
                       <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #F1F5F9', backgroundColor: selectedProduct.partnerOverride ? 'rgba(255,80,13,0.03)' : '#fff' }}>
                         <div style={{ fontSize: '10px', color: '#64748B' }}>Partner Override</div>
                         <div style={{ fontSize: '14px', fontWeight: 800, color: '#FF500D' }}>
                           {selectedProduct.partnerOverride?.price ? `${selectedProduct.partnerOverride.price} ر.س` : 'N/A'}
                         </div>
                       </div>
                    </div>

                    <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: 800, margin: '0 0 8px 0' }}>Media Ownership Flow</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                          <span>المصدر:</span>
                          <span style={{ fontWeight: 700 }}>{selectedProduct.isMaster ? 'الكتالوج المركزي' : 'إدخال شريك'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                          <span>سياسة العرض:</span>
                          <span style={{ fontWeight: 700, color: '#0A2F5C' }}>{selectedProduct.mediaPolicy}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                          <span>حالة الصورة:</span>
                          <span style={{ fontWeight: 700, color: '#16A34A' }}>تم التحقق ✓</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button className={styles.operationsCompactActionPrimary} style={{ flex: 1 }}>تعديل البيانات</button>
                      <button className={styles.operationsCompactActionSecondary}>سجل التغييرات</button>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0A2F5C', marginBottom: '8px' }}>تدفق الاعتماد</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {dshCatalogPipeline.map((step, idx) => {
                          const isDone = idx < 3; // mock
                          return (
                            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isDone ? 1 : 0.4 }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: isDone ? '#16A34A' : '#CBD5E1' }} />
                              <span style={{ fontSize: '11px', fontWeight: 600 }}>{step.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '13px' }}>
                    حدد منتجاً لعرض التفاصيل
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
