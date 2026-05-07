'use client';

import React from 'react';
import { Box, Button, Surface, Text, SearchField, Chip, Icon } from '@bthwani/ui-kit';
import {
  dshCatalogMetrics,
  dshCatalogCategories,
  dshCatalogProducts,
  CatalogProductMaster,
  CatalogMainCategory,
  CatalogSubCategory,
  CatalogQuickEntryMode,
  CatalogApprovalStage,
  CatalogMediaPolicy
} from './catalog';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

type CatalogFilter = 'all' | 'master' | 'partner-exception' | 'partner-review' | 'marketing-review' | 'price-conflict' | 'non-matching' | 'category-proposals';

function SidebarBlock({ title, description, children, highlight }: { title: string, description: string, children: React.ReactNode, highlight?: boolean }) {
  return (
    <Surface tone={highlight ? 'brand' : 'inset'} padding={4} gap={3} style={{ borderRadius: 12, borderWidth: 1, borderColor: highlight ? 'rgba(255, 80, 13, 0.2)' : 'rgba(10, 47, 92, 0.05)', backgroundColor: highlight ? 'rgba(255, 80, 13, 0.02)' : undefined }}>
      <Box gap={1}>
        <Text role="bodyStrong" style={{ color: highlight ? '#FF500D' : '#0A2F5C' }}>{title}</Text>
        <Text role="caption" tone="muted">{description}</Text>
      </Box>
      <Box gap={2}>
        {children}
      </Box>
    </Surface>
  );
}

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const [activeMainCategory, setActiveMainCategory] = React.useState<CatalogMainCategory>(dshCatalogCategories[0]);
  const [activeSubCategory, setActiveSubCategory] = React.useState<CatalogSubCategory | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<CatalogFilter>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);
  const [quickEntryMode, setQuickEntryMode] = React.useState<CatalogQuickEntryMode | null>(null);

  // Handle Main Category Selection
  const handleMainCategorySelect = (cat: CatalogMainCategory) => {
    setActiveMainCategory(cat);
    setActiveSubCategory(null);
    setSelectedProductId(null);
    setQuickEntryMode(null);
  };

  const selectedProduct = dshCatalogProducts.find(p => p.id === selectedProductId) ?? null;

  const filteredProducts = dshCatalogProducts.filter(p => {
    // Category Filter
    if (p.categoryPath.main !== activeMainCategory.id) return false;
    if (activeSubCategory && p.categoryPath.sub !== activeSubCategory.id) return false;

    // Search Filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchLower) ||
      p.sku.toLowerCase().includes(searchLower) ||
      (p.gtin && p.gtin.includes(searchLower)) ||
      (p.barcode && p.barcode.includes(searchLower));

    if (!matchesSearch) return false;

    // Status Filter
    if (activeFilter === 'master') return p.mediaPolicy === 'catalog-owned-media';
    if (activeFilter === 'partner-exception') return p.mediaPolicy === 'partner-owned-exception';
    if (activeFilter === 'partner-review') return p.approvalStage === 'partner-review';
    if (activeFilter === 'marketing-review') return p.approvalStage === 'marketing-review';
    if (activeFilter === 'price-conflict') return !!p.conflictReason;

    // 'non-matching' and 'category-proposals' are logical states mapped for UI completeness
    if (activeFilter === 'non-matching') return false;
    if (activeFilter === 'category-proposals') return false;

    return true;
  });

  const KPIs = [
    { label: 'المنتجات المركزية', value: dshCatalogMetrics.approvedProducts, status: 'normal' },
    { label: 'الفئات الرئيسية', value: dshCatalogMetrics.mainCategories, status: 'normal' },
    { label: 'الفئات الفرعية', value: dshCatalogMetrics.subCategories, status: 'normal' },
    { label: 'مراجعة الشركاء', value: dshCatalogMetrics.pendingPartnerReviews, status: 'danger' },
    { label: 'مراجعة التسويق', value: dshCatalogMetrics.pendingMarketingReviews, status: 'warning' },
    { label: 'تعارضات الأسعار', value: dshCatalogMetrics.priceConflicts, status: 'warning' },
    { label: 'استثناءات الصور', value: dshCatalogMetrics.imageExceptions, status: 'normal' },
  ];

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header */}
      <header className={styles.operationsTopBar}>
        <div className={styles.operationsTitleBlock}>
          <div style={{
            width: '40px', height: '40px', backgroundColor: '#0A2F5C', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
          }}>🗂️</div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>مركز الكتالوج المركزي</h1>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>قاعدة الفئات والمنتجات والصور والسياسات</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions} style={{ gap: '16px', overflowX: 'auto' }}>
          <div className={styles.operationsPulseCompact} style={{ flexShrink: 0 }}>
            {KPIs.map((kpi, idx) => (
              <div key={idx} className={styles.operationsPulseItem} style={{ padding: '4px 8px' }}>
                <span style={{ color: kpi.status === 'danger' ? '#DC2626' : kpi.status === 'warning' ? '#D97706' : '#64748B' }}>{kpi.label}</span>
                <span className={styles.operationsPulseValue} style={{ color: kpi.status === 'danger' ? '#DC2626' : kpi.status === 'warning' ? '#D97706' : '#0A2F5C' }}>{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Main Tabs */}
      <nav className={styles.operationsTabs} style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        {dshCatalogCategories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.operationsTab} ${activeMainCategory.id === cat.id ? styles.operationsTabActive : ''}`}
            onClick={() => handleMainCategorySelect(cat)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {cat.emojiFallback} {cat.label}
          </button>
        ))}
      </nav>

      {/* 3. Main Panel (3-Column Layout) */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <div className={styles.operationsCompactSurface} style={{ padding: '16px' }}>

            {/* Breadcrumb & Quick Actions */}
            <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Box style={{ flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                <Text role="bodySm" style={{ fontWeight: 700, color: '#64748B' }}>الكتالوج</Text>
                <Text role="bodySm" style={{ color: '#94A3B8' }}>/</Text>
                <Text role="bodySm" style={{ fontWeight: 700, color: '#0A2F5C' }}>{activeMainCategory.label}</Text>
                {activeSubCategory && (
                  <>
                    <Text role="bodySm" style={{ color: '#94A3B8' }}>/</Text>
                    <Text role="bodySm" style={{ fontWeight: 700, color: '#0A2F5C' }}>{activeSubCategory.label}</Text>
                  </>
                )}
                {selectedProduct && (
                  <>
                    <Text role="bodySm" style={{ color: '#94A3B8' }}>/</Text>
                    <Text role="bodySm" style={{ fontWeight: 800, color: '#FF500D' }}>{selectedProduct.name}</Text>
                  </>
                )}
              </Box>
              <Box style={{ flexDirection: 'row', gap: '8px' }}>
                <Button
                  label="إدخال سريع ⚡"
                  tone="secondary"
                  size="sm"
                  onClick={() => setQuickEntryMode('search-name')}
                />
                <Button
                  label="منتج مركزي جديد +"
                  tone="primary"
                  size="sm"
                />
              </Box>
            </Box>

            {/* Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 340px', gap: '16px', height: 'calc(100vh - 280px)' }}>

              {/* Left Column: Categories / Quick Entry Panel */}
              <div className={styles.operationsCompactPanel} style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {quickEntryMode ? (
                  <Box gap={4}>
                    <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>لوحة الإدخال السريع</Text>
                      <button onClick={() => setQuickEntryMode(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>✖</button>
                    </Box>

                    <Box gap={2}>
                      <Button label="📷 مسح الباركود (Barcode/GTIN)" tone="secondary" style={{ justifyContent: 'flex-start' }} />
                      <Button label="📄 استيراد جماعي (CSV/Excel)" tone="secondary" style={{ justifyContent: 'flex-start' }} />
                      <Button label="🤝 استيراد من قائمة شريك" tone="secondary" style={{ justifyContent: 'flex-start' }} />
                      <Button label="📋 اقتراحات الميدان" tone="secondary" style={{ justifyContent: 'flex-start' }} />
                    </Box>

                    <SidebarBlock
                      title="مسار اقتراح الفئات"
                      description="الشريك/الميداني يقترح فئة. الكتالوج يراجع. لا يعتمد الشريك فئة رئيسية أو فرعية بنفسه."
                      highlight
                    >
                      <Button label="مراجعة المقترحات (3)" tone="primary" size="sm" />
                    </SidebarBlock>
                  </Box>
                ) : (
                  <>
                    <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>الفئات الفرعية</Text>
                    {activeMainCategory.subcategories.length > 0 ? (
                      <Box gap={1}>
                        <div
                          onClick={() => setActiveSubCategory(null)}
                          style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: !activeSubCategory ? '#E2E8F0' : 'transparent', cursor: 'pointer' }}>
                          <Text role="bodySm" style={{ fontWeight: !activeSubCategory ? 800 : 600, color: !activeSubCategory ? '#0A2F5C' : '#64748B' }}>الكل</Text>
                        </div>
                        {activeMainCategory.subcategories.map(sub => (
                          <div
                            key={sub.id}
                            onClick={() => setActiveSubCategory(sub)}
                            style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: activeSubCategory?.id === sub.id ? '#E2E8F0' : 'transparent', cursor: 'pointer' }}>
                            <Text role="bodySm" style={{ fontWeight: activeSubCategory?.id === sub.id ? 800 : 600, color: activeSubCategory?.id === sub.id ? '#0A2F5C' : '#64748B' }}>{sub.label}</Text>
                          </div>
                        ))}
                      </Box>
                    ) : (
                      <Text role="caption" tone="muted" style={{ textAlign: 'center', marginTop: '24px' }}>لا توجد فئات فرعية</Text>
                    )}

                    <Box style={{ marginTop: 'auto', gap: '16px' }}>
                      <SidebarBlock
                        title="الإدخال الذكي للشريك"
                        description="يبحث في الكتالوج، يختار المنتج، ويغير السعر/المخزون فقط دون المساس بالمنتج المركزي."
                      >
                        <Button label="محاكاة واجهة الشريك" tone="secondary" size="sm" />
                      </SidebarBlock>
                    </Box>
                  </>
                )}
              </div>

              {/* Center Column: Products Table */}
              <div className={styles.operationsCompactPanel} style={{ overflowY: 'auto', padding: 0 }}>
                <Box style={{ padding: '12px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10, gap: '12px' }}>

                  {/* Bulk Action Bar & Search */}
                  <Box style={{ flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                    <SearchField
                      placeholder="بحث (اسم، SKU، GTIN، باركود)..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    <Button label="⚖️ مطابقة ذكية" tone="secondary" size="sm" />
                    <Button label="💰 تحديث أسعار جماعي" tone="secondary" size="sm" />
                  </Box>

                  {/* Filters */}
                  <Box style={{ flexDirection: 'row', gap: '6px', flexWrap: 'wrap' }}>
                    {(['all', 'master', 'partner-exception', 'partner-review', 'marketing-review', 'price-conflict', 'non-matching', 'category-proposals'] as CatalogFilter[]).map(f => {
                      const labels: Record<CatalogFilter, string> = {
                        all: 'الكل', 'master': 'منتجات مركزية', 'partner-exception': 'استثناء صورة', 'partner-review': 'مراجعة شريك', 'marketing-review': 'مراجعة تسويق', 'price-conflict': 'تعارض سعر', 'non-matching': 'غير مطابق', 'category-proposals': 'مقترحات فئات'
                      };
                      return (
                        <div
                          key={f} onClick={() => setActiveFilter(f)}
                          style={{
                            padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                            backgroundColor: activeFilter === f ? '#0A2F5C' : '#F8FAFC',
                            color: activeFilter === f ? '#fff' : '#64748B',
                            border: '1px solid #E2E8F0', cursor: 'pointer'
                          }}
                        >{labels[f]}</div>
                      );
                    })}
                  </Box>
                </Box>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                  <thead style={{ position: 'sticky', top: 96, backgroundColor: '#F8FAFC', zIndex: 10 }}>
                    <tr>
                      <th style={{ padding: '8px 12px', fontSize: '11px', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>المنتج</th>
                      <th style={{ padding: '8px 12px', fontSize: '11px', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>SKU/GTIN</th>
                      <th style={{ padding: '8px 12px', fontSize: '11px', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>السياسة</th>
                      <th style={{ padding: '8px 12px', fontSize: '11px', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProductId(p.id)}
                        style={{ cursor: 'pointer', backgroundColor: selectedProductId === p.id ? 'rgba(10,47,92,0.04)' : 'transparent', borderBottom: '1px solid #F1F5F9' }}
                      >
                        <td style={{ padding: '10px 12px' }}>
                          <Box style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                              {p.emojiFallback}
                            </div>
                            <Box>
                              <Text role="bodySm" style={{ fontWeight: 800, color: '#0A2F5C' }}>{p.name}</Text>
                              <Text role="caption" style={{ color: '#FF500D' }}>{p.price} ر.س</Text>
                            </Box>
                          </Box>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <Text role="caption" tone="muted" style={{ fontFamily: 'monospace' }}>{p.sku}</Text>
                          {p.gtin && <Text role="caption" tone="muted" style={{ fontFamily: 'monospace', fontSize: '9px' }}>{p.gtin}</Text>}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <Text role="caption" style={{ fontWeight: 700, color: p.mediaPolicy === 'catalog-owned-media' ? '#16A34A' : '#D97706' }}>
                            {p.mediaPolicy === 'catalog-owned-media' ? 'مركزي' : 'استثناء شريك'}
                          </Text>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                           <span style={{
                            padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800,
                            backgroundColor: p.conflictReason ? '#FEE2E2' : p.approvalStage === 'client-visible' ? '#DCFCE7' : '#FEF3C7',
                            color: p.conflictReason ? '#DC2626' : p.approvalStage === 'client-visible' ? '#16A34A' : '#D97706'
                          }}>
                            {p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '12px' }}>لا توجد منتجات مطابقة</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Right Column (Visual Left in RTL): Inspector */}
              <div className={styles.operationsCompactPanel} style={{ borderLeft: 'none', borderRight: '1px solid #E2E8F0', overflowY: 'auto' }}>
                {selectedProduct ? (
                  <Box gap={4}>
                    <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Text role="titleSm" style={{ color: '#0A2F5C' }}>مفتش المنتج</Text>
                      <Text role="caption" tone="muted" style={{ fontFamily: 'monospace' }}>{selectedProduct.id}</Text>
                    </Box>

                    <Box style={{ flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                       <div style={{ width: '80px', height: '80px', backgroundColor: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', border: '1px solid #E2E8F0' }}>
                         {selectedProduct.emojiFallback}
                       </div>
                       <Box style={{ flex: 1, gap: '4px' }}>
                         <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>{selectedProduct.name}</Text>
                         {selectedProduct.measurementUnit && <Text role="caption" tone="muted">الوحدة: {selectedProduct.measurementUnit}</Text>}
                         <Button label="تغيير الصورة المركزية 📷" tone="secondary" size="sm" />
                       </Box>
                    </Box>

                    <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                       <Surface tone="inset" padding={3} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
                         <Text role="caption" tone="muted">السعر المرجعي</Text>
                         <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>{selectedProduct.price} ر.س</Text>
                       </Surface>
                       <Surface tone="default" padding={3} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed' }}>
                         <Text role="caption" tone="muted">تعديل الشريك (Override)</Text>
                         <Text role="bodyStrong" style={{ color: selectedProduct.partnerOverrides?.length ? '#FF500D' : '#94A3B8' }}>
                           {selectedProduct.partnerOverrides?.length ? `${selectedProduct.partnerOverrides[0].price} ر.س` : 'لا يوجد'}
                         </Text>
                       </Surface>
                    </Box>

                    {selectedProduct.conflictReason && (
                      <Surface tone="danger" padding={3} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#FECACA' }}>
                        <Text role="caption" style={{ fontWeight: 800, color: '#DC2626' }}>⚠️ تعارض مسجل</Text>
                        <Text role="caption" style={{ color: '#991B1B' }}>{selectedProduct.conflictReason}</Text>
                      </Surface>
                    )}

                    <Surface tone="inset" padding={4} gap={3} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text role="bodySm" style={{ fontWeight: 800, color: '#0A2F5C' }}>مسار ملكية الصورة (Media Ownership)</Text>
                      <Text role="caption" style={{ fontWeight: 700, color: selectedProduct.mediaPolicy === 'catalog-owned-media' ? '#16A34A' : '#D97706' }}>
                        {selectedProduct.mediaPolicy === 'catalog-owned-media' ? 'صورة تابعة للكتالوج المركزي' : 'استثناء: صورة خاصة بالشريك'}
                      </Text>

                      <Box gap={1}>
                        <Text role="caption" tone="muted">الأسطح المرتبطة (Surfaces):</Text>
                        <Box style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '4px' }}>
                          {selectedProduct.surfaces.map(s => (
                            <Chip key={s} label={s === 'client' ? 'العميل' : s === 'partner' ? 'الشريك' : s === 'marketing' ? 'التسويق' : 'الميداني'} />
                          ))}
                        </Box>
                      </Box>
                    </Surface>

                    <Surface tone="default" padding={4} gap={3} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text role="bodySm" style={{ fontWeight: 800, color: '#0A2F5C' }}>الصلاحيات ومسار المراجعة</Text>
                      <Box gap={2}>
                        <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text role="caption" tone="muted">تغيير الاسم/الصورة:</Text>
                          <Text role="caption" style={{ fontWeight: 700, color: '#0A2F5C' }}>الكتالوج فقط</Text>
                        </Box>
                        <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text role="caption" tone="muted">تغيير السعر/المخزون:</Text>
                          <Text role="caption" style={{ fontWeight: 700, color: '#16A34A' }}>متاح للشريك</Text>
                        </Box>
                        <Box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text role="caption" tone="muted">مرحلة الاعتماد:</Text>
                          <Text role="caption" style={{ fontWeight: 700, color: '#D97706' }}>{selectedProduct.approvalStage}</Text>
                        </Box>
                      </Box>
                    </Surface>

                    {selectedProduct.categoryPath.main === 'restaurants' && (
                      <SidebarBlock
                        title="مسار استثناء المطاعم"
                        description="الشريك يرفع صورة ➔ مراجعة الشركاء ➔ التسويق يحسّن/يعتمد ➔ الكتالوج يعتمد ➔ ظهور للعميل."
                        highlight
                      >
                        <Button label="محاكاة مسار الاستثناء" tone="secondary" size="small" />
                      </SidebarBlock>
                    )}

                    <Box style={{ flexDirection: 'row', gap: '8px', marginTop: 'auto' }}>
                      <Button label="حفظ التعديلات" tone="primary" style={{ flex: 1 }} />
                      <Button label="سجل التدقيق (Audit Trail)" tone="secondary" />
                    </Box>
                  </Box>
                ) : (
                  <Box style={{ height: '100%', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'center' }}>
                      حدد منتجاً من القائمة لعرض التفاصيل وإدارة السياسات (محاكاة واجهة)
                    </Text>
                  </Box>
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
