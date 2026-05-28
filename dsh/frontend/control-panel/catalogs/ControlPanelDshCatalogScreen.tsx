'use client';

import React from 'react';
import { Box, Button, Surface, Text, SearchField, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager, WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import type { CatalogProductMaster, CatalogMediaPolicy, CatalogApprovalStage } from './catalogs.data';
import { getActualPublicMediaPath } from '../../shared/resolve-dsh-public-media-path';
import styles from '../shared/control-panel-surface.module.css';
import { CatalogWorkspaceRouter } from './CatalogWorkspaceRouter';
import type { CatalogPreviewProposal } from './catalog-workspace.types';
import { mergeCatalogProductPreviewPatch } from './catalogs.adapters';
import {
  createCatalogPreviewProposal,
  toCatalogApprovalStage,
  toCatalogMediaPolicy,
  type CatalogFilterColumnId,
} from './catalogs.model';
import { FilterToken, PolicyBadge, InspectorTile, MiniInfoBox, WatermarkedImage, FilterDropdown } from './catalog.parts';
import { useCatalogScreen, PRIMARY_TABS, SECONDARY_TABS } from './catalogs.hooks';

// --- Types ---
export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

type WorkspaceMode =
  | 'catalog'
  | 'quick-entry'
  | 'partner-entry'
  | 'field-intake'
  | 'duplicate-resolution'
  | 'category-mapping'
  | 'media-governance'
  | 'marketing-approvals';

const catalogPageSize = 5;

// --- Shared Components ---

// Removed duplicate sub-page imports for unified main table rendering

// --- Main Screen Component ---

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const { theme } = useTheme();
  const {
    activeTab, setActiveTab,
    activeSubTab, setActiveSubTab,
    showBulkOps, setShowBulkOps,
    selectedProductIds, setSelectedProductIds,
    workspaceState, setWorkspaceState, openWorkspace,
    pendingProposals, pushPreviewProposal,
    activeMainCategory, setActiveMainCategory,
    activeSubCategory, setActiveSubCategory,
    activeFilter, setActiveFilter,
    searchQuery, setSearchQuery,
    selectedProductId, setSelectedProductId,
    catalogPage, setCatalogPage,
    catalogTotalPages,
    productPreviewPatches, setProductPreviewPatches,
    queueProductPreviewPatch,
    products, filteredProducts, visibleProducts,
    counts, filterOptions,
    selectedProduct,
    totalCount,
    showProductModal, setShowProductModal,
    modalMode, setModalMode,
    modalForm, setModalForm,
    previewCategories, setPreviewCategories,
    effectiveCategories,
    hiddenCategoryIds, setHiddenCategoryIds,
    hiddenSubCategoryIds, setHiddenSubCategoryIds,
    categoryControlOpen, setCategoryControlOpen,
    addingMainCat, setAddingMainCat,
    addingSubUnder, setAddingSubUnder,
    addingMainClassifUnder, setAddingMainClassifUnder,
    addingSubClassifUnder, setAddingSubClassifUnder,
    formLabel, setFormLabel,
    formSubtitle, setFormSubtitle,
    catError, setCatError,
    editingEntry, setEditingEntry,
    editLabel, setEditLabel,
    editSubtitle, setEditSubtitle,
    activeMainClassifId, setActiveMainClassifId,
    activeSubClassifId, setActiveSubClassifId,
    selectedTaxonomyNode, setSelectedTaxonomyNode,
    expandedMainCategoryIds, setExpandedMainCategoryIds,
    expandedSubCategoryIds, setExpandedSubCategoryIds,
    expandedMainClassifIds, setExpandedMainClassifIds,
    treeSearchQuery, setTreeSearchQuery,
    hoveredNodeId, setHoveredNodeId,
    filteredCategories,
    toggleMainCategoryExpand,
    toggleSubCategoryExpand,
    toggleMainClassifExpand,
    handleMainCategorySelect,
    handleSubCategorySelect,
    handleAddMainCategory,
    handleAddSubCategory,
    handleAddMainClassification,
    handleAddSubClassification,
    handleToggleCategoryHide,
    handleToggleSubCategoryHide,
    handleDeleteNode,
    handleResetCategoryPreview,
    handleStartCatEdit,
    handleApplyCatEdit,
    getProductCountForCategory,
    colFilters, setColFilters,
    openFilterCol, setOpenFilterCol,
    activeColFiltersCount,
    actionMessage, setActionMessage,
    isCategoryMapped, isDuplicatesClean, isMediaSatisfied, approvedCount,
    isManualOrderCategory,
    microActions,
  } = useCatalogScreen();

  const workspaceMode = activeTab;


  const renderColHeader = (colId: CatalogFilterColumnId, title: string, width?: string) => (
    <th style={{ padding: '6px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width, position: 'relative' }}>
       <button
          type="button"
          style={{ appearance: 'none', border: 'none', background: 'transparent', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); setOpenFilterCol(openFilterCol === colId ? null : colId); }}
       >
          <span style={{ color: theme.textMuted }}>{title}</span>
          <span style={{ color: colFilters[colId]?.length > 0 ? theme.brand : theme.lineStrong, fontSize: 10 }}>▼</span>
       </button>
       {openFilterCol === colId && (
         <FilterDropdown
            titleText={title}
            options={filterOptions[colId] || []}
            selected={colFilters[colId]}
          onChange={(val) => setColFilters(prev => ({ ...prev, [colId]: val }))}
            onClose={() => setOpenFilterCol(null)}
         />
       )}
    </th>
  );

  const renderIntakeWorkspace = () => {
    let title = '';
    let description = '';
    let ownerSurface = '';
    let nextOwner = '';
    let impactInfo = '';

    if (activeSubTab === 'quick') {
      title = 'بوابة الإدخال السريع (Direct Intake)';
      description = 'إدخال المنتجات والبيانات يدوياً بشكل مباشر في لوحة التحكم المركزية لتحديث الكتالوج فوراً.';
      ownerSurface = 'control-panel-catalog (لوحة التحكم)';
      nextOwner = 'marketing-review (مراجعة التسويق)';
      impactInfo = 'التحديث المباشر يؤثر على ظهور المنتج للعميل في app-client بعد النشر والاعتماد.';
    } else if (activeSubTab === 'partner') {
      title = 'بوابة الشركاء والمتاجر (Partner Portal Intake)';
      description = 'استيراد ومراجعة قوائم المنتجات المقترحة والمرفوعة من قبل الشركاء عبر تطبيق app-partner.';
      ownerSurface = 'app-partner / control-panel-partners';
      nextOwner = 'partner-review (مراجعة الجودة والشركاء)';
      impactInfo = 'المنتجات المعتمدة تنعكس في مخازن الشركاء وتتحكم في مبيعاتهم المباشرة.';
    } else if (activeSubTab === 'field') {
      title = 'بوابة المسح والجمع الميداني (Field Agent Intake)';
      description = 'استلام وتدقيق بيانات المنتجات التي يتم جمعها بواسطة المناديب والفرق الميدانية عبر تطبيق app-field.';
      ownerSurface = 'app-field (تطبيق المندوب الميداني)';
      nextOwner = 'catalog-review (تدقيق الكتالوج والأسعار)';
      impactInfo = 'البيانات المدخلة من الميدان تُراجع هنا لمنع تكرار الباركود وتطابق المنتجات المحلية.';
    }

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
        {/* Header Premium Card */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.surfaceInset} 0%, ${theme.surface} 100%)`,
          border: `1px solid ${theme.lineStrong}`,
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <Text role="bodyStrong" style={{ fontSize: 16, color: theme.brandHeaderBackground, fontWeight: '800' }}>{title}</Text>
              <Text role="caption" tone="muted" style={{ fontSize: 11, marginTop: 4 }}>{description}</Text>
            </div>
            <span style={{ fontSize: '9px', color: theme.warning, fontWeight: '700', backgroundColor: theme.brandSurface, padding: '2px 8px', borderRadius: '4px' }}>
              معاينة محلية فقط
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: `1px solid ${theme.line}`, paddingTop: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '10px', color: theme.textMuted }}>الجهة المالكة / المصدر:</span>
              <span style={{ fontSize: '11px', color: theme.brand, fontWeight: '700' }}>{ownerSurface}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '10px', color: theme.textMuted }}>المراجع التالي للمسار:</span>
              <span style={{ fontSize: '11px', color: theme.brand, fontWeight: '700' }}>{nextOwner}</span>
            </div>
          </div>

          <div style={{ backgroundColor: theme.surfaceInset, padding: '8px 12px', borderRadius: '6px', borderRight: `3px solid ${theme.brand}` }}>
            <Text role="caption" style={{ fontSize: '10px', color: theme.brandHeaderBackground }}>
              ℹ️ <strong>أثر السطح:</strong> {impactInfo}
            </Text>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <Button
              label="تحديث بيانات المسار"
              tone="brand"
              size="sm"
              disabled
              accessibilityLabel="تحديث المسار (معاينة محلية فقط)"
              onPress={() => {}}
            />
            <span style={{ fontSize: '10px', color: theme.textMuted, alignSelf: 'center' }}>
              (الإجراء معطل: معاينة محلية فقط)
            </span>
            {activeSubTab === 'partner' && (
              <Button
                label="▸ فتح workspace استلام الشريك"
                tone="secondary"
                size="sm"
                onPress={() => openWorkspace('partner-handoff')}
              />
            )}
          </div>
        </div>

        {/* Derived Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Text role="bodyStrong" style={{ fontSize: '13px', color: theme.brandHeaderBackground }}>العناصر المستلمة في هذا المسار ({filteredProducts.length})</Text>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', backgroundColor: theme.surfaceInset, borderRadius: '8px', border: `1px dashed ${theme.line}` }}>
              <Text role="caption" tone="muted">لا توجد منتجات معلقة في هذا المسار حالياً.</Text>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredProducts.map(p => {
                const resolvedStage = p.approvalStage;

                // Map status to: pending / review / blocked / ready
                let statusLabel = 'معلق';
                let statusTone: 'neutral' | 'warning' | 'danger' | 'success' = 'neutral';

                if (p.conflictReason) {
                  statusLabel = 'تعارض / blocked';
                  statusTone = 'danger';
                } else if (resolvedStage === 'client-visible' || resolvedStage === 'catalog-adopted') {
                  statusLabel = 'جاهز / ready';
                  statusTone = 'success';
                } else if (resolvedStage === 'marketing-review' || resolvedStage === 'partner-review') {
                  statusLabel = 'مراجعة / review';
                  statusTone = 'warning';
                } else {
                  statusLabel = 'مسودة معلقة / pending';
                  statusTone = 'neutral';
                }

                const isSelected = selectedProductId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${isSelected ? theme.brand : theme.line}`,
                      backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <WatermarkedImage src={p.imageUri} mediaKey={p.mediaKey} fallback={p.emojiFallback} size={36} productName={p.name} />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text role="bodyStrong" style={{ fontSize: '12px', color: theme.brandHeaderBackground }}>{p.name}</Text>
                        <span style={{ fontFamily: 'monospace', fontSize: '10px', color: theme.textMuted, direction: 'ltr' }}>{p.sku}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: theme.brandHeaderBackground }}>{p.price} ر.س</span>
                        <span style={{ fontSize: '9px', color: theme.textMuted }}>المصدر: {p.sourceSurface || 'الكتالوج'}</span>
                      </div>
                      <WebControlPanelStatusTag
                        label={statusLabel}
                        tone={statusTone === 'neutral' ? 'info' : statusTone}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMappingWorkspace = () => {
    let title = '';
    let description = '';
    let whyItMatters = '';
    let affectedSurfaces: string[] = [];
    let nextActionLabel = '';

    if (activeSubTab === 'categories') {
      title = 'ربط الفئات والتصنيفات (Category Mapping)';
      description = 'ربط وتصنيف المنتجات ضمن هيكل الفئات والتصنيفات المركزية.';
      whyItMatters = 'يتحكم مباشرة في طريقة تصفح وبحث وتصفية المنتجات للمستهلك في التطبيق.';
      affectedSurfaces = [
        'app-client: يحدد مكان ظهور المنتج للمستهلك النهائي.',
        'app-partner: يربط المنتجات بمخزون الشريك وتصنيفاته المحلية.',
        'app-field: يؤثر على فئات الجمع والمسح الميداني عند الإدخال.'
      ];
      nextActionLabel = 'تحديث شجرة الفئات (معاينة محلية فقط)';
    } else if (activeSubTab === 'duplicates') {
      title = 'معالجة وتطهير التكرارات والتعارضات (Conflict Resolution)';
      description = 'الكشف عن التكرارات المتعارضة بناءً على الاسم أو الباركود لحل التعارض.';
      whyItMatters = 'تفادي الازدواجية في قواعد البيانات وضمان جرد دقيق وشفاف.';
      affectedSurfaces = [
        'app-client: منع ظهور نفس المنتج مكرراً بأسعار مختلفة للعميل.',
        'app-partner: منع تداخل المخزون والمبيعات لنفس المنتج للشركاء.'
      ];
      nextActionLabel = 'دمج التكرارات تلقائياً (معاينة محلية فقط)';
    } else if (activeSubTab === 'media') {
      title = 'حوكمة الميديا والسياسات (Media Ownership Policy)';
      description = 'التحقق من ملكية الصور وتطبيق سياسات المظهر الموحد (مركزي مقابل استثناء شريك).';
      whyItMatters = 'الحفاظ على جودة الهوية البصرية وتناسق صور المنتجات عبر المنصة.';
      affectedSurfaces = [
        'control-panel-marketing: عند الحاجة لمراجعة أو تحسين صور تسويقية.',
        'app-client: يضمن ظهور صور عالية الدقة للمنتجات للمستهلك.'
      ];
      nextActionLabel = 'تطبيق الشعار المائي للصور (معاينة محلية فقط)';
    } else if (activeSubTab === 'gtin') {
      title = 'مطابقة الباركود الدولي GTIN (GTIN Validation)';
      description = 'التحقق من إدخال ومطابقة الباركود العالمي (GTIN) للمنتجات لمنع التداخل.';
      whyItMatters = 'يسهل القراءة السريعة ويضمن عدم حدوث تعارض باركود في نقاط البيع.';
      affectedSurfaces = [
        'app-partner: ربط المخزون بالباركود الدولي بشكل فوري.',
        'app-client: التحقق من كود المنتج عند الإرجاع أو الطلب.'
      ];
      nextActionLabel = 'توليد باركود GTIN تلقائي (معاينة محلية فقط)';
    } else if (activeSubTab === 'substitutions') {
      title = 'سياسة البدائل عند نفاد الكمية (Substitution Policies)';
      description = 'تحديد المنتجات البديلة المسموح بها في حال نفاد المنتج الأصلي من مخزون الشريك.';
      whyItMatters = 'تفادي إلغاء طلبات العملاء وزيادة معدل إكمال السلات.';
      affectedSurfaces = [
        'app-client: اقتراح بديل مناسب للعميل عند الطلب.',
        'app-partner: توجيه الشريك لتعبئة البديل المصرح به.'
      ];
      nextActionLabel = 'تعديل سياسة البدائل (معاينة محلية فقط)';
    } else if (activeSubTab === 'visibility-policy') {
      title = 'سياسة قنوات الظهور (Visibility & Channels Policy)';
      description = 'توزيع ونشر المنتجات عبر منافذ الظهور المختلفة (المستهلك، الشريك، المندوب).';
      whyItMatters = 'ضمان عدم نشر المسودات أو المنتجات غير المكتملة للمستهلك النهائي.';
      affectedSurfaces = [
        'app-client: التحكم في قنوات ومناطق التغطية المحددة للظهور.'
      ];
      nextActionLabel = 'تعديل منافذ الظهور (معاينة محلية فقط)';
    }

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
        {/* Header Premium Card */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.surfaceInset} 0%, ${theme.surface} 100%)`,
          border: `1px solid ${theme.lineStrong}`,
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <Text role="bodyStrong" style={{ fontSize: '16px', color: theme.brandHeaderBackground, fontWeight: '800' }}>{title}</Text>
              <Text role="caption" tone="muted" style={{ fontSize: '11px', marginTop: '4px', display: 'block' }}>{description}</Text>
            </div>
            <span style={{ fontSize: '9px', color: theme.success, fontWeight: '700', backgroundColor: theme.brandSurface, padding: '2px 8px', borderRadius: '4px' }}>
              معاينة محلية فقط
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${theme.line}`, paddingTop: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: theme.brandHeaderBackground }}>💡 الأهمية والهدف:</span>
            <Text role="caption" style={{ fontSize: '10.5px', color: theme.textMuted }}>{whyItMatters}</Text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: theme.surfaceInset, padding: '10px 12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: theme.brand, marginBottom: '2px' }}>🔄 الأسطح المتأثرة (Affected Surfaces):</span>
            {affectedSurfaces.map((surface, idx) => (
              <span key={idx} style={{ fontSize: '10px', color: theme.brandHeaderBackground, display: 'block' }}>
                • {surface}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              label={nextActionLabel}
              tone="secondary"
              size="sm"
              disabled
              accessibilityLabel={`${nextActionLabel} (معاينة محلية فقط)`}
              onPress={() => {}}
            />
            <span style={{ fontSize: '10px', color: theme.textMuted, alignSelf: 'center' }}>
              (الإجراء معطل: معاينة محلية فقط)
            </span>
            {/* Workspace overlay openers — detail-on-open pattern */}
            {activeSubTab === 'duplicates' && (
              <Button
                label="▸ فتح workspace حل التكرارات"
                tone="brand"
                size="sm"
                onPress={() => openWorkspace('duplicate-resolution')}
              />
            )}
            {(activeSubTab === 'gtin') && (
              <Button
                label="▸ فتح workspace حوكمة الهوية"
                tone="brand"
                size="sm"
                onPress={() => openWorkspace('identity-governance')}
              />
            )}
            {activeSubTab === 'media' && (
              <Button
                label="▸ فتح workspace حوكمة الوسائط"
                tone="brand"
                size="sm"
                onPress={() => openWorkspace('media-governance')}
              />
            )}
            {activeSubTab === 'visibility-policy' && (
              <Button
                label="▸ فتح workspace سياسة الظهور"
                tone="brand"
                size="sm"
                onPress={() => {
                  const firstProduct = filteredProducts[0];
                  if (firstProduct) {
                    openWorkspace('visibility-policy', firstProduct.id);
                  }
                }}
                disabled={filteredProducts.length === 0}
                accessibilityHint="اختر منتجاً لفتح workspace الظهور"
              />
            )}
          </div>
        </div>

        {/* Derived Items List / Status View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Text role="bodyStrong" style={{ fontSize: '13px', color: theme.brandHeaderBackground }}>العناصر والنتائج الحالية في هذا المسار ({filteredProducts.length})</Text>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', backgroundColor: theme.surfaceInset, borderRadius: '8px', border: `1px dashed ${theme.line}` }}>
              <Text role="caption" tone="muted">✓ كل شيء سليم! لا توجد منتجات متعارضة أو مفقودة حالياً.</Text>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredProducts.map(p => {
                let detailText = '';
                let statusLabel = 'مكتمل';
                let statusTone: 'success' | 'warning' | 'danger' | 'info' = 'success';

                if (activeSubTab === 'categories') {
                  const mainCat = previewCategories.find(c => c.id === p.categoryPath.main) ?? dshCatalogCategories.find(c => c.id === p.categoryPath.main);
                  const subCat = mainCat?.subcategories.find(s => s.id === p.categoryPath.sub);
                  detailText = `الفئة: ${mainCat?.label || 'غير محدد'} › ${subCat?.label || 'عام'}`;
                  statusLabel = p.categoryPath.main ? 'مرتبط' : 'غير مرتبط';
                  statusTone = p.categoryPath.main ? 'success' : 'danger';
                } else if (activeSubTab === 'duplicates') {
                  detailText = p.conflictReason || 'تكرار محتمل في الاسم أو SKU';
                  statusLabel = 'تعارض نشط';
                  statusTone = 'danger';
                } else if (activeSubTab === 'media') {
                  detailText = `سياسة الصور: ${p.mediaPolicy === 'catalog-owned-media' ? 'مركزي' : 'استثناء شريك'}`;
                  statusLabel = p.mediaKey ? 'صورة معتمدة' : 'بدون صورة';
                  statusTone = p.mediaKey ? 'success' : 'warning';
                } else if (activeSubTab === 'gtin') {
                  detailText = `المعرف: ${p.sku}`;
                  statusLabel = p.gtin ? `GTIN: ${p.gtin}` : 'باركود مفقود';
                  statusTone = p.gtin ? 'success' : 'danger';
                } else if (activeSubTab === 'substitutions') {
                  detailText = `فئة المطاعم/البدائل النشطة للمنتج`;
                  statusLabel = p.categoryPath.main === 'restaurants' ? 'بدائل مرنة' : 'افتراضي';
                  statusTone = p.categoryPath.main === 'restaurants' ? 'success' : 'info';
                } else if (activeSubTab === 'visibility-policy') {
                  detailText = `القنوات: ${p.surfaces.join(', ')}`;
                  statusLabel = p.surfaces.includes('client') ? 'مرئي للعميل' : 'داخلي فقط';
                  statusTone = p.surfaces.includes('client') ? 'success' : 'warning';
                }

                const isSelected = selectedProductId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${isSelected ? theme.brand : theme.line}`,
                      backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <WatermarkedImage src={p.imageUri} mediaKey={p.mediaKey} fallback={p.emojiFallback} size={36} productName={p.name} />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text role="bodyStrong" style={{ fontSize: '12px', color: theme.brandHeaderBackground }}>{p.name}</Text>
                        <span style={{ fontSize: '10px', color: theme.textMuted }}>{detailText}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <WebControlPanelStatusTag
                        label={statusLabel}
                        tone={statusTone}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.surfaceCockpit}>
      {/* 1. Header Area - Catalog Command Deck */}
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box
            radiusToken="sm"
            elevationToken="raised"
            align="center"
            justify="center"
            style={{ width: 32, height: 32, backgroundColor: theme.brandHeaderBackground }}
          >
            <Text style={{ color: theme.textInverse, fontSize: 16 }}>⌗</Text>
          </Box>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle} style={{ letterSpacing: -0.18 }}>كتالوج DSH</h1>
              <Box paddingX={1} paddingY={1} background="brandSurface" radiusToken="xs">
                 <span className={styles.surfaceHeaderBadgeText}>حوكمة الماستر</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>إدارة المنتجات والفئات ومخاطر التبني عبر الأسطح</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            {[
              { label: 'إجمالي المنتجات', value: '١٤,٥٨٢' },
              { label: 'بانتظار اعتماد', value: '١٢٤' },
              { label: 'تعارضات النشاط', value: '٨', tone: 'danger' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={m.tone === 'danger' ? `${styles.commandKpiValue} ${styles.commandKpiValueAlert}` : styles.commandKpiValue}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Three-Layer Unified Compact Control Strip */}
      <Surface
        tone="inset"
        padding={2}
        gap={2}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.line,
          backgroundColor: theme.surface,
          flexShrink: 0,
        }}
      >
        {/* Layer 1: Primary Compact Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {PRIMARY_TABS.map((tab) => {
            const isSelected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedProductId(null);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? theme.brandHeaderBackground : theme.surfaceInset,
                  color: isSelected ? theme.textInverse : theme.textMuted,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Layer 2: Context Sub-tabs */}
        {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', msOverflowStyle: 'none', borderTop: `1px solid ${theme.line}`, paddingTop: '6px' }}>
            {SECONDARY_TABS[activeTab].map((sub) => {
              const isSelected = sub.id === activeSubTab;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    border: `1px solid ${isSelected ? theme.brand : 'transparent'}`,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? theme.brandSurface : 'transparent',
                    color: isSelected ? theme.brand : theme.textMuted,
                    transition: 'all 0.12s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Layer 3: Smart Filters, Search, Category Selector & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${theme.line}`, paddingTop: '6px' }}>
          {/* Sub-row 1: Search & Category selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '220px' }}>
                <SearchField placeholder="بحث شامل بالمنتج أو الباركود..." value={searchQuery} onChangeText={setSearchQuery} />
              </div>
              {(activeTab === 'all' || activeTab === 'catalog') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center' }}>
                    <Text role="caption" numberOfLines={1} style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted }}>الفئة:</Text>
                    <button
                      onClick={() => handleMainCategorySelect(null)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: 600,
                        border: `1px solid ${!activeMainCategory ? theme.brand : theme.lineStrong}`,
                        cursor: 'pointer',
                        backgroundColor: !activeMainCategory ? theme.brandSurface : theme.surface,
                        color: !activeMainCategory ? theme.brand : theme.textMuted,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      الكل
                    </button>
                    {effectiveCategories.map(cat => {
                      const isSelected = activeMainCategory?.id === cat.id;
                      const isHidden = hiddenCategoryIds.has(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleMainCategorySelect(cat)}
                          title={isHidden ? 'مخفي (معاينة)' : undefined}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: 600,
                            border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                            cursor: 'pointer',
                            backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                            color: isSelected ? theme.brand : theme.textMuted,
                            whiteSpace: 'nowrap',
                            opacity: isHidden ? 0.5 : 1,
                          }}
                        >
                          {cat.emojiFallback} {cat.label}
                        </button>
                      );
                    })}
                  </div>
                  {activeMainCategory && activeMainCategory.subcategories.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '12px' }}>
                      <Text role="caption" numberOfLines={1} style={{ fontSize: 9, fontWeight: 800, color: theme.textMuted }}>└ الفرعية:</Text>
                      <button
                        onClick={() => handleSubCategorySelect(null)}
                        style={{
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontSize: '9px',
                          fontWeight: 600,
                          border: `1px solid ${!activeSubCategory ? theme.brand : theme.lineStrong}`,
                          cursor: 'pointer',
                          backgroundColor: !activeSubCategory ? theme.brandSurface : theme.surface,
                          color: !activeSubCategory ? theme.brand : theme.textMuted,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        الكل
                      </button>
                      {activeMainCategory.subcategories.map(sub => {
                        const isSubSelected = activeSubCategory?.id === sub.id;
                        const isSubHidden = hiddenSubCategoryIds.has(sub.id);
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubCategorySelect(sub)}
                            title={isSubHidden ? 'مخفي (معاينة)' : undefined}
                            style={{
                              padding: '1px 6px',
                              borderRadius: '8px',
                              fontSize: '9px',
                              fontWeight: 600,
                              border: `1px solid ${isSubSelected ? theme.brand : theme.lineStrong}`,
                              cursor: 'pointer',
                              backgroundColor: isSubSelected ? theme.brandSurface : theme.surface,
                              color: isSubSelected ? theme.brand : theme.textMuted,
                              whiteSpace: 'nowrap',
                              opacity: isSubHidden ? 0.5 : 1,
                            }}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {/* Classification chips */}
                  {activeMainCategory && activeSubCategory && activeSubCategory.mainClassifications && activeSubCategory.mainClassifications.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '24px' }}>
                      <Text role="caption" numberOfLines={1} style={{ fontSize: 8, fontWeight: 800, color: theme.textMuted }}>└─ الرئيسي:</Text>
                      <button
                        onClick={() => { setActiveMainClassifId(null); setActiveSubClassifId(null); }}
                        style={{
                          padding: '1px 5px',
                          borderRadius: '6px',
                          fontSize: '8px',
                          fontWeight: 600,
                          border: `1px solid ${!activeMainClassifId ? theme.brand : theme.lineStrong}`,
                          cursor: 'pointer',
                          backgroundColor: !activeMainClassifId ? theme.brandSurface : theme.surface,
                          color: !activeMainClassifId ? theme.brand : theme.textMuted,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        الكل
                      </button>
                      {activeSubCategory.mainClassifications.map(mc => {
                        const isSelected = activeMainClassifId === mc.id;
                        return (
                          <button
                            key={mc.id}
                            onClick={() => { setActiveMainClassifId(isSelected ? null : mc.id); setActiveSubClassifId(null); }}
                            style={{
                              padding: '1px 5px',
                              borderRadius: '6px',
                              fontSize: '8px',
                              fontWeight: 600,
                              border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                              cursor: 'pointer',
                              backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                              color: isSelected ? theme.brand : theme.textMuted,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            🔹 {mc.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Sub-Classification chips */}
                  {activeMainCategory && activeSubCategory && activeMainClassifId && (() => {
                    const currentMC = activeSubCategory.mainClassifications?.find(c => c.id === activeMainClassifId);
                    if (!currentMC || !currentMC.subClassifications || currentMC.subClassifications.length === 0) return null;
                    return (
                      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '36px' }}>
                        <Text role="caption" numberOfLines={1} style={{ fontSize: 8, fontWeight: 800, color: theme.textMuted }}>└─ الفرعي:</Text>
                        <button
                          onClick={() => setActiveSubClassifId(null)}
                          style={{
                            padding: '1px 4px',
                            borderRadius: '5px',
                            fontSize: '8px',
                            fontWeight: 600,
                            border: `1px solid ${!activeSubClassifId ? theme.brand : theme.lineStrong}`,
                            cursor: 'pointer',
                            backgroundColor: !activeSubClassifId ? theme.brandSurface : theme.surface,
                            color: !activeSubClassifId ? theme.brand : theme.textMuted,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          الكل
                        </button>
                        {currentMC.subClassifications.map(sc => {
                          const isSelected = activeSubClassifId === sc.id;
                          return (
                            <button
                              key={sc.id}
                              onClick={() => setActiveSubClassifId(isSelected ? null : sc.id)}
                              style={{
                                padding: '1px 4px',
                                borderRadius: '5px',
                                fontSize: '8px',
                                fontWeight: 600,
                                border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                                cursor: 'pointer',
                                backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                                color: isSelected ? theme.brand : theme.textMuted,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              🔸 {sc.label}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Button
                label={showBulkOps ? "إغلاق الإجراءات" : "إجراءات جماعية"}
                tone={showBulkOps ? "brand" : "secondary"}
                size="sm"
                onPress={() => setShowBulkOps(!showBulkOps)}
                style={{ paddingVertical: 2, paddingHorizontal: 8 }}
              />
              {/* Open bulk workspace — disabled if no selection */}
              <Button
                label={`📋 تنفيذ مجمع${selectedProductIds.length > 0 ? ` (${selectedProductIds.length})` : ''}`}
                tone={selectedProductIds.length > 0 ? 'brand' : 'secondary'}
                size="sm"
                onPress={() => setWorkspaceState({ workspace: 'bulk-operations', sourceSurface: 'catalogs' })}
                style={{ paddingVertical: 2, paddingHorizontal: 8 }}
              />
            </div>
          </div>

          {/* Sub-row 2: Smart Filters chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <Text role="caption" numberOfLines={1} style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted }}>تصفية ذكية:</Text>
            {([
              { id: 'all', label: 'الكل' },
              { id: 'active', label: 'نشط' },
              { id: 'review', label: 'مراجعة' },
              { id: 'conflict', label: 'تعارض' },
              { id: 'master', label: 'مركزي' },
              { id: 'partner', label: 'شريك' },
              { id: 'needs-link', label: 'يحتاج ربط' },
              { id: 'needs-image', label: 'يحتاج صورة' },
            ] satisfies { id: FilterType; label: string }[]).map(f => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 600,
                    border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                    color: isSelected ? theme.brand : theme.textMuted,
                    transition: 'all 0.12s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Sub-row 3: Contextual Micro Action Strip — no tab label repetition */}
          {microActions.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', borderTop: `1px solid ${theme.line}`, paddingTop: '6px' }}>
              <Text role="caption" numberOfLines={1} style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted }}>إجراء:</Text>
              {microActions.map((action) => {
                const isActive = action.isActive;
                return (
                  <button
                    key={action.id}
                    onClick={action.onAction}
                    aria-label={action.label}
                    style={{
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      border: `1px solid ${isActive ? theme.brand : theme.line}`,
                      cursor: 'pointer',
                      backgroundColor: isActive ? theme.brandSurface : theme.surfaceInset,
                      color: isActive ? theme.brand : theme.brandHeaderBackground,
                      transition: 'all 0.12s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Surface>

      {/* Current Context Crumb Box */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>الكتالوج</Text>
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>›</Text>
          <Text role="caption" style={{ fontSize: 10, color: theme.brand, fontWeight: 700 }}>{PRIMARY_TABS.find(t => t.id === activeTab)?.label}</Text>
          {SECONDARY_TABS[activeTab]?.find(s => s.id === activeSubTab)?.label && (
            <>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>›</Text>
              <Text role="caption" style={{ fontSize: 10, color: theme.brand, fontWeight: 700 }}>{SECONDARY_TABS[activeTab].find(s => s.id === activeSubTab)?.label}</Text>
            </>
          )}
          {activeFilter !== 'all' && (
            <>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>›</Text>
              <Text role="caption" style={{ fontSize: 10, color: theme.brand, fontWeight: 700 }}>
                {
                  ([
                    { id: 'all', label: 'الكل' },
                    { id: 'active', label: 'نشط' },
                    { id: 'review', label: 'مراجعة' },
                    { id: 'conflict', label: 'تعارض' },
                    { id: 'master', label: 'مركزي' },
                    { id: 'partner', label: 'شريك' },
                    { id: 'needs-link', label: 'يحتاج ربط' },
                    { id: 'needs-image', label: 'يحتاج صورة' },
                  ].find(f => f.id === activeFilter)?.label)
                }
              </Text>
            </>
          )}
          <Text role="caption" tone="muted" style={{ fontSize: 10, marginRight: 8 }}>
            ({filteredProducts.length} منتج)
          </Text>
        </div>

        {/* Clear Filters indicator & trigger */}
        {(activeFilter !== 'all' || searchQuery !== '' || activeColFiltersCount > 0 || activeMainCategory !== null || activeSubCategory !== null || activeMainClassifId !== null || activeSubClassifId !== null) && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Text role="caption" style={{ fontSize: 10, color: theme.brand }}>
              {`نشط: ${activeColFiltersCount + (activeFilter !== 'all' ? 1 : 0) + (searchQuery !== '' ? 1 : 0) + (activeMainCategory ? 1 : 0) + (activeMainClassifId ? 1 : 0) + (activeSubClassifId ? 1 : 0)} فلتر`}
            </Text>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
                setColFilters(initialColumnFilters);
                setActiveMainCategory(null);
                setActiveSubCategory(null);
                setActiveMainClassifId(null);
                setActiveSubClassifId(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: theme.danger,
                fontSize: '10px',
                fontWeight: 800,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ✕ مسح الفلاتر
            </button>
          </div>
        )}
      </div>


      {/* Action message banner -- replaces alert() calls; UI_PREVIEW_ONLY, no backend */}
      {actionMessage ? (
        <div role="status" aria-live="polite" style={{ padding: '8px 14px', backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', color: theme.brandHeaderBackground, fontWeight: 600 }}>{actionMessage}</span>
          <span style={{ fontSize: '10px', color: theme.textMuted }}>UI_PREVIEW_ONLY</span>
          <button type="button" onClick={() => setActionMessage(null)} style={{ background: 'none', border: 'none', color: theme.textMuted, fontSize: '12px', cursor: 'pointer', padding: '0 4px' }}>x</button>
        </div>
      ) : null}
      {/* Category Control Room — preview-only, shows when mapping/categories */}
      {activeTab === 'mapping' && activeSubTab === 'categories' && (
        <div style={{
          backgroundColor: theme.surface,
          borderBottom: `1px solid ${theme.line}`,
          flexShrink: 0,
        }}>
          {/* Toggle header */}
          <button
            onClick={() => setCategoryControlOpen((v) => !v)}
            aria-label="تبديل وضع إدارة الفئات"
            style={{
              width: '100%', appearance: 'none', border: 'none',
              backgroundColor: categoryControlOpen ? theme.brandSurface : theme.surfaceInset,
              borderBottom: categoryControlOpen ? `1px solid ${theme.brand}` : 'none',
              padding: '5px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: categoryControlOpen ? theme.brand : theme.textMuted }}>
                🏷️ إدارة الفئات
              </span>
              <span style={{ fontSize: '9px', color: theme.warning, fontWeight: 700 }}>
                • معاينة فقط — لا حفظ دائم
              </span>
              <span style={{ fontSize: '9px', color: theme.textMuted }}>
                ({previewCategories.length} فئة • {hiddenCategoryIds.size > 0 ? `${hiddenCategoryIds.size} مخفي` : 'لا مخفي'})
              </span>
            </div>
            <span style={{ fontSize: '9px', color: theme.textMuted }}>{categoryControlOpen ? '▲' : '▼'}</span>
          </button>

          {/* Expanded panel */}
          {categoryControlOpen && (
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>

              {/* Error banner */}
              {catError && (
                <div style={{
                  padding: '4px 10px', borderRadius: '4px', backgroundColor: theme.dangerSurface ?? theme.surfaceInset,
                  border: `1px solid ${theme.danger}`, fontSize: '10px', color: theme.danger, fontWeight: 700,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{catError}</span>
                  <button onClick={() => setCatError(null)} style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, cursor: 'pointer', fontSize: '10px', fontWeight: 900 }}>×</button>
                </div>
              )}

              {/* Action header row */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setAddingMainCat(true); setAddingSubUnder(null); setEditingEntry(null); setFormLabel(''); setFormSubtitle(''); setCatError(null); }}
                  aria-label="إضافة فئة رئيسية"
                  style={{
                    padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                    border: `1px solid ${theme.brand}`, cursor: 'pointer',
                    backgroundColor: theme.brandSurface, color: theme.brand,
                  }}
                >
                  + فئة رئيسية
                </button>
                <button
                  onClick={handleResetCategoryPreview}
                  aria-label="إعادة ضبط المعاينة"
                  style={{
                    padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                    border: `1px solid ${theme.danger}`, cursor: 'pointer',
                    backgroundColor: 'transparent', color: theme.danger,
                  }}
                >
                  ↺ إعادة ضبط المعاينة
                </button>
              </div>

              {/* Add main category form */}
              {addingMainCat && (
                <div style={{
                  padding: '8px 10px', borderRadius: '6px', backgroundColor: theme.surfaceInset,
                  border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '6px',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: theme.brand }}>إضافة فئة رئيسية جديدة</span>
                  <input
                    type="text" placeholder="اسم الفئة *" value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainCategory(); if (e.key === 'Escape') { setAddingMainCat(false); setCatError(null); } }}
                    autoFocus
                    style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right',
                      border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none',
                    }}
                  />
                  <input
                    type="text" placeholder="وصف مختصر (اختياري)" value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right',
                      border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleAddMainCategory} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.brand}`, backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                    <button onClick={() => { setAddingMainCat(false); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                  </div>
                </div>
              )}

              {/* Categories list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {previewCategories.map((cat) => {
                  const isHidden = hiddenCategoryIds.has(cat.id);
                  const isSelectedMain = activeMainCategory?.id === cat.id;
                  const productCount = getProductCountForCategory(cat.id);
                  const isEditingThis = editingEntry?.type === 'main' && editingEntry.mainId === cat.id;

                  return (
                    <div key={cat.id} style={{
                      borderRadius: '6px', border: `1px solid ${isSelectedMain ? theme.brand : theme.line}`,
                      backgroundColor: isHidden ? theme.surfaceInset : (isSelectedMain ? theme.brandSurface : theme.surface),
                      opacity: isHidden ? 0.6 : 1, overflow: 'hidden',
                    }}>
                      {/* Main category row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', gap: '6px' }}>
                        {isEditingThis ? (
                          <div style={{ display: 'flex', flex: 1, gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                              type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                              autoFocus
                              style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '11px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '80px' }}
                            />
                            <input
                              type="text" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="وصف"
                              style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '11px', direction: 'rtl', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '80px' }}
                            />
                            <button onClick={handleApplyCatEdit} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                            <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleMainCategorySelect(isSelectedMain ? null : cat)}
                              style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}
                            >
                              <span style={{ fontSize: '13px' }}>{cat.emojiFallback}</span>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: isSelectedMain ? theme.brand : theme.brandHeaderBackground }}>{cat.label}</span>
                                {cat.subtitle && <span style={{ fontSize: '9px', color: theme.textMuted }}>{cat.subtitle}</span>}
                              </div>
                              <span style={{ fontSize: '9px', color: theme.textMuted, marginRight: 'auto', paddingRight: '4px' }}>{productCount} منتج</span>
                            </button>
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
                              <button
                                onClick={() => { setAddingSubUnder(addingSubUnder === cat.id ? null : cat.id); setFormLabel(''); setFormSubtitle(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); setAddingMainClassifUnder(null); setAddingSubClassifUnder(null); }}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: addingSubUnder === cat.id ? theme.brandSurface : 'transparent', color: addingSubUnder === cat.id ? theme.brand : theme.textMuted }}
                              >+ فرعية</button>
                              <button
                                onClick={() => handleStartCatEdit('main', cat.id)}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}
                              >تعديل</button>
                              <button
                                onClick={() => handleToggleCategoryHide(cat.id)}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${isHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isHidden ? theme.success : theme.textMuted }}
                              >{isHidden ? 'استعادة' : 'إخفاء'}</button>
                              <button
                                onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة وجميع فئاتها وتصنيفاتها الفرعية؟')) handleDeleteNode('main', cat.id); }}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}
                              >حذف</button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Add subcategory form */}
                      {addingSubUnder === cat.id && (
                        <div style={{ margin: '0 8px 6px 8px', padding: '6px 8px', borderRadius: '4px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, color: theme.brand }}>إضافة فئة فرعية تحت: {cat.label}</span>
                          <input type="text" placeholder="اسم الفئة الفرعية *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubCategory(cat.id); if (e.key === 'Escape') { setAddingSubUnder(null); setCatError(null); } }}
                            autoFocus
                            style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                          />
                          <input type="text" placeholder="وصف (اختياري)" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)}
                            style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                          />
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleAddSubCategory(cat.id)} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                            <button onClick={() => { setAddingSubUnder(null); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                          </div>
                        </div>
                      )}

                      {/* Subcategories list */}
                      {cat.subcategories.length > 0 && (
                        <div style={{ margin: '0 8px 6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {cat.subcategories.map((sub) => {
                            const subCount = getProductCountForCategory(cat.id, sub.id);
                            const isSelectedSub = activeSubCategory?.id === sub.id;
                            const isSubHidden = hiddenSubCategoryIds.has(sub.id);
                            const isEditingThisSub = editingEntry?.type === 'sub' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id;
                            const isAddingClassifThisSub = addingMainClassifUnder?.mainId === cat.id && addingMainClassifUnder?.subId === sub.id;

                            return (
                              <div key={sub.id} style={{
                                borderRadius: '4px', border: `1px solid ${isSelectedSub ? theme.brand : 'transparent'}`,
                                backgroundColor: isSubHidden ? theme.surfaceInset : (isSelectedSub ? theme.brandSurface : theme.surfaceInset),
                                opacity: isSubHidden ? 0.6 : 1, overflow: 'hidden', padding: '4px'
                              }}>
                                {/* Subcategory row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                  {isEditingThisSub ? (
                                    <div style={{ display: 'flex', flex: 1, gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                                      <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                        autoFocus
                                        style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '60px' }}
                                      />
                                      <input type="text" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="وصف"
                                        style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '60px' }}
                                      />
                                      <button onClick={handleApplyCatEdit} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                      <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => { handleSubCategorySelect(isSelectedSub ? null : sub); if (!isSelectedSub) handleMainCategorySelect(cat); }}
                                        style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}
                                      >
                                        <span style={{ fontSize: '10px', color: theme.textMuted }}>└── 📂</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                          <span style={{ fontSize: '10px', fontWeight: isSelectedSub ? 700 : 600, color: isSelectedSub ? theme.brand : theme.brandHeaderBackground }}>{sub.label}</span>
                                          {sub.subtitle && <span style={{ fontSize: '8px', color: theme.textMuted }}>{sub.subtitle}</span>}
                                        </div>
                                        <span style={{ fontSize: '9px', color: theme.textMuted, marginRight: 'auto' }}>{subCount}</span>
                                      </button>
                                      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                        <button
                                          onClick={() => { setAddingMainClassifUnder(isAddingClassifThisSub ? null : { mainId: cat.id, subId: sub.id }); setFormLabel(''); setFormSubtitle(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); setAddingSubUnder(null); setAddingSubClassifUnder(null); }}
                                          style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: isAddingClassifThisSub ? theme.brandSurface : 'transparent', color: isAddingClassifThisSub ? theme.brand : theme.textMuted }}
                                        >+ تصنيف رئيسي</button>
                                        <button onClick={() => handleStartCatEdit('sub', cat.id, sub.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                        <button onClick={() => handleToggleSubCategoryHide(sub.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${isSubHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isSubHidden ? theme.success : theme.textMuted }}>{isSubHidden ? 'استعادة' : 'إخفاء'}</button>
                                        <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة الفرعية وتصنيفاتها؟')) handleDeleteNode('sub', cat.id, sub.id); }} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {/* Add main classification form */}
                                {isAddingClassifThisSub && (
                                  <div style={{ margin: '4px 12px 4px 4px', padding: '5px', borderRadius: '3px', backgroundColor: theme.surface, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '8px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف رئيسي جديد تحت: {sub.label}</span>
                                    <input type="text" placeholder="اسم التصنيف الرئيسي *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainClassification(cat.id, sub.id); if (e.key === 'Escape') { setAddingMainClassifUnder(null); setCatError(null); } }}
                                      autoFocus
                                      style={{ padding: '2px 5px', borderRadius: '2px', fontSize: '9px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                                    />
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button onClick={() => handleAddMainClassification(cat.id, sub.id)} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                                      <button onClick={() => { setAddingMainClassifUnder(null); setFormLabel(''); setCatError(null); }} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                    </div>
                                  </div>
                                )}

                                {/* Main Classifications */}
                                {sub.mainClassifications && sub.mainClassifications.length > 0 && (
                                  <div style={{ margin: '4px 4px 2px 16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    {sub.mainClassifications.map((classif) => {
                                      const isEditingThisClassif = editingEntry?.type === 'mainClassif' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id && editingEntry.mainClassifId === classif.id;
                                      const isAddingSubClassif = addingSubClassifUnder?.mainId === cat.id && addingSubClassifUnder?.subId === sub.id && addingSubClassifUnder?.mainClassifId === classif.id;

                                      return (
                                        <div key={classif.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: theme.surface, borderRadius: '3px', padding: '3px' }}>
                                          {/* Main Classification Row */}
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                            {isEditingThisClassif ? (
                                              <div style={{ display: 'flex', flex: 1, gap: '4px', alignItems: 'center' }}>
                                                <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                                  onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                                  autoFocus
                                                  style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '9px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1 }}
                                                />
                                                <button onClick={handleApplyCatEdit} style={{ padding: '1px 5px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                                <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '1px 5px', borderRadius: '2px', fontSize: '8px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                              </div>
                                            ) : (
                                              <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}>
                                                  <span style={{ fontSize: '9px', color: theme.textMuted }}>├── 🔹</span>
                                                  <span style={{ fontSize: '9.5px', fontWeight: 600, color: theme.brandHeaderBackground }}>{classif.label}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                                  <button
                                                    onClick={() => { setAddingSubClassifUnder(isAddingSubClassif ? null : { mainId: cat.id, subId: sub.id, mainClassifId: classif.id }); setFormLabel(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); setAddingSubUnder(null); setAddingMainClassifUnder(null); }}
                                                    style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: isAddingSubClassif ? theme.brandSurface : 'transparent', color: isAddingSubClassif ? theme.brand : theme.textMuted }}
                                                  >+ تصنيف فرعي</button>
                                                  <button onClick={() => handleStartCatEdit('mainClassif', cat.id, sub.id, classif.id)} style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                                  <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الرئيسي وتصنيفاته الفرعية؟')) handleDeleteNode('mainClassif', cat.id, sub.id, classif.id); }} style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
                                                </div>
                                              </>
                                            )}
                                          </div>

                                          {/* Add sub classification form */}
                                          {isAddingSubClassif && (
                                            <div style={{ margin: '3px 16px 3px 3px', padding: '4px', borderRadius: '2px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                              <span style={{ fontSize: '7.5px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف فرعي جديد تحت: {classif.label}</span>
                                              <input type="text" placeholder="اسم التصنيف الفرعي *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubClassification(cat.id, sub.id, classif.id); if (e.key === 'Escape') { setAddingSubClassifUnder(null); setCatError(null); } }}
                                                autoFocus
                                                style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '8.5px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                                              />
                                              <div style={{ display: 'flex', gap: '3px' }}>
                                                <button onClick={() => handleAddSubClassification(cat.id, sub.id, classif.id)} style={{ padding: '1px 6px', borderRadius: '2px', fontSize: '7.5px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                                                <button onClick={() => { setAddingSubClassifUnder(null); setFormLabel(''); setCatError(null); }} style={{ padding: '1px 6px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                              </div>
                                            </div>
                                          )}

                                          {/* Sub-Classifications */}
                                          {classif.subClassifications && classif.subClassifications.length > 0 && (
                              <div style={{ margin: '2px 2px 2px 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                              {classif.subClassifications.map((subc) => {
                                                const isEditingThisSubClassif = editingEntry?.type === 'subClassif' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id && editingEntry.mainClassifId === classif.id && editingEntry.subClassifId === subc.id;

                                                return (
                                                  <div key={subc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', backgroundColor: theme.surfaceInset, borderRadius: '2px', padding: '2px' }}>
                                                    {isEditingThisSubClassif ? (
                                                      <div style={{ display: 'flex', flex: 1, gap: '3px', alignItems: 'center' }}>
                                                        <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                                          onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                                          autoFocus
                                                          style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '8px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1 }}
                                                        />
                                                        <button onClick={handleApplyCatEdit} style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '7.5px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                                        <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                                      </div>
                                                    ) : (
                                                      <>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}>
                                                          <span style={{ fontSize: '8px', color: theme.textMuted }}>└── 🔸</span>
                                                          <span style={{ fontSize: '8.5px', color: theme.brandHeaderBackground }}>{subc.label}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                                          <button onClick={() => handleStartCatEdit('subClassif', cat.id, sub.id, classif.id, subc.id)} style={{ padding: '0 2px', borderRadius: '2px', fontSize: '7px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                                          <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الفرعي؟')) handleDeleteNode('subClassif', cat.id, sub.id, classif.id, subc.id); }} style={{ padding: '0 2px', borderRadius: '2px', fontSize: '7px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. MAIN CONTENT AREA */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '100%' }}>
            {activeTab !== 'taxonomy' ? (
              <>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: theme.surface, minWidth: 0 }}>
                  <div style={{ flex: 1, minHeight: 0, backgroundColor: theme.surface }}>
                     {isManualOrderCategory ? (
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', opacity: 0.7 }}>
                         <Text role="titleMd" style={{ color: theme.brandHeaderBackground }}>فئة الطلب اليدوي</Text>
                         <Text role="bodySm" tone="muted" style={{ textAlign: 'center', maxWidth: 400, marginTop: 8 }}>
                           المنتجات في هذه الفئة (مثل شي إن، عونك) تُعامل كطلبات مرنة ولا تحتوي على منتجات كتالوج قياسية محددة مسبقاً.
                         </Text>
                       </div>
                      ) : (
                        <div style={{ overflow: 'auto', height: '100%' }}>
                          {activeTab === 'intake' ? (
                            renderIntakeWorkspace()
                          ) : activeTab === 'mapping' ? (
                            renderMappingWorkspace()
                          ) : (
                            <>
                              {activeTab === 'publishing' && (
                                <Box
                                  padding={3}
                                  gap={2}
                                  style={{
                                    backgroundColor: theme.surfaceInset,
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.line,
                                    margin: 12,
                                    borderRadius: 8,
                                  }}
                                >
                                  <Text role="bodyStrong" style={{ color: theme.brandHeaderBackground, fontWeight: '700', textAlign: 'right' }}>بوابة النشر النهائية (Publishing Gate Checklist)</Text>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', margin: '8px 0' }}>
                                    <Box layoutDirection="row" align="center" gap={2} style={{ justifyContent: 'flex-end' }}>
                                      <Text role="caption" tone={isCategoryMapped ? 'default' : 'danger'} style={{ fontSize: 11, textAlign: 'right' }}>ربط الفئات (Category Mapping)</Text>
                                      <Text style={{ color: isCategoryMapped ? theme.success : theme.danger, fontWeight: 'bold', fontSize: 14 }}>
                                        {isCategoryMapped ? '✓' : '✗'}
                                      </Text>
                                    </Box>
                                    <Box layoutDirection="row" align="center" gap={2} style={{ justifyContent: 'flex-end' }}>
                                      <Text role="caption" tone={isDuplicatesClean ? 'default' : 'danger'} style={{ fontSize: 11, textAlign: 'right' }}>خلو الكتالوج من التكرارات (No Duplicates)</Text>
                                      <Text style={{ color: isDuplicatesClean ? theme.success : theme.danger, fontWeight: 'bold', fontSize: 14 }}>
                                        {isDuplicatesClean ? '✓' : '✗'}
                                      </Text>
                                    </Box>
                                    <Box layoutDirection="row" align="center" gap={2} style={{ justifyContent: 'flex-end' }}>
                                      <Text role="caption" tone={isMediaSatisfied ? 'default' : 'danger'} style={{ fontSize: 11, textAlign: 'right' }}>اعتماد الصور والسياسة (Media Satisfied)</Text>
                                      <Text style={{ color: isMediaSatisfied ? theme.success : theme.danger, fontWeight: 'bold', fontSize: 14 }}>
                                        {isMediaSatisfied ? '✓' : '✗'}
                                      </Text>
                                    </Box>
                                  </div>
                                  <Box layoutDirection="row" justify="space-between" align="center" style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 8, marginTop: 4 }}>
                                    <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
                                      {approvedCount} من {totalCount} منتجات معتمدة وجاهزة للنشر.
                                    </Text>
                                    <Button
                                      label="🚀 نشر الكتالوج بالكامل للعميل"
                                      tone="brand"
                                      size="sm"
                                      disabled={!(isCategoryMapped && isDuplicatesClean && isMediaSatisfied && approvedCount > 0)}
                                      onPress={() => {
                                        const readyProducts = products.filter((p) => p.approvalStage === 'catalog-adopted');
                                        setProductPreviewPatches((prev) => readyProducts.reduce(
                                          (next, product) => mergeCatalogProductPreviewPatch(next, product.id, { approvalStage: 'client-visible' }),
                                          prev
                                        ));
                                        pushPreviewProposal(createCatalogPreviewProposal({
                                          type: 'visibility-change',
                                          productIds: readyProducts.map((product) => product.id),
                                          label: 'نشر الكتالوج بالكامل للعميل',
                                          note: 'UI_PREVIEW_ONLY: تحويل المنتجات المعتمدة إلى client-visible كمعاينة فقط.',
                                          apiBoundary: 'POST /catalog/products/publish',
                                        }));
                                        setActionMessage('تم تسجيل مقترح نشر المنتجات الجاهزة للعميل');
                                      }}
                                    />
                                  </Box>
                                </Box>
                              )}
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}` }}>
                                    {showBulkOps && <th style={{ width: '36px' }}></th>}
                                    <th style={{ width: '48px' }}>صورة</th>
                                    {renderColHeader('name', 'المنتج', '20%')}
                                    {renderColHeader('category', 'الفئة', '12%')}
                                    {renderColHeader('classification', 'التصنيف', '10%')}
                                    {renderColHeader('sku', 'المعرف / الباركود', '15%')}
                                    {renderColHeader('price', 'السعر', '8%')}
                                    {renderColHeader('policy', 'السياسة', '10%')}
                                    {renderColHeader('status', 'الحالة', '10%')}
                                  </tr>
                                </thead>
                                <tbody>
                                  {visibleProducts.map(p => {
                                    const cat = previewCategories.find(c => c.id === p.categoryPath.main) ?? dshCatalogCategories.find(c => c.id === p.categoryPath.main);
                                    const sub = cat?.subcategories.find(s => s.id === p.categoryPath.sub);
                                    const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
                                    const resolvedStage = p.approvalStage;
                                    return (
                                      <tr
                                        key={p.id}
                                        onClick={() => setSelectedProductId(p.id)}
                                        style={{ borderBottom: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: selectedProductId === p.id ? theme.overlaySoft : 'transparent' }}
                                      >
                                        {showBulkOps && (
                                          <td onClick={e => e.stopPropagation()} style={{ padding: '8px' }}>
                                            {/* Controlled selection — required for CatalogBulkOperationsWorkspace */}
                                            <input
                                              type="checkbox"
                                              checked={selectedProductIds.includes(p.id)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedProductIds((prev) => [...prev, p.id]);
                                                } else {
                                                  setSelectedProductIds((prev) => prev.filter((id) => id !== p.id));
                                                }
                                              }}
                                              style={{ accentColor: theme.brandHeaderBackground }}
                                            />
                                          </td>
                                        )}
                                        <td style={{ padding: '8px' }}>
                                           <WatermarkedImage src={p.imageUri} mediaKey={p.mediaKey} fallback={p.emojiFallback} size={32} productName={p.name} />
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                           <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground }}>{p.name}</Text>
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{cat?.label}</Text>
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{classif?.label || 'عام'}</Text>
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                          <Text role="caption" tone="muted" style={{ fontFamily: 'monospace', fontSize: 10 }}>{p.sku}</Text>
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                          <Text role="caption" style={{ color: theme.brandHeaderBackground, fontWeight: 700 }}>{p.price}</Text>
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                          <PolicyBadge mediaPolicy={p.mediaPolicy} />
                                        </td>
                                        <td style={{ padding: '8px' }}>
                                           <WebControlPanelStatusTag
                                             label={p.conflictReason ? 'تعارض' : resolvedStage === 'client-visible' ? 'نشط' : resolvedStage === 'catalog-approved' ? 'معتمد' : resolvedStage === 'marketing-review' ? 'تسويق' : 'مراجعة'}
                                             tone={p.conflictReason ? 'danger' : resolvedStage === 'client-visible' ? 'success' : resolvedStage === 'catalog-approved' ? 'success' : 'warning'}
                                           />
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                             </table>
                            </>
                          )}
                        </div>
                     )}
                  </div>

                  {!isManualOrderCategory && activeTab !== 'intake' && activeTab !== 'mapping' ? (
                    <div style={{ padding: '10px 16px 12px', borderTop: `1px solid ${theme.line}`, backgroundColor: theme.surface }}>
                      <WebControlPanelCompactPager
                        page={catalogPage}
                        totalPages={catalogTotalPages}
                        onPrevious={() => setCatalogPage(p => Math.max(1, p - 1))}
                        onNext={() => setCatalogPage(p => Math.min(catalogTotalPages, p + 1))}
                      />
                    </div>
                  ) : null}
                </div>

              {/* Inspector Panel */}
              {selectedProductId && selectedProduct && (
                <div style={{ width: 320, borderRight: `1px solid ${theme.line}`, backgroundColor: theme.surfaceInset, display: 'flex', flexDirection: 'column' }}>
                   <Box padding={3} background="surfaceRaised" style={{ borderBottomWidth: 1, borderBottomColor: theme.line }} layoutDirection="row" justify="space-between" align="center">
                      <Text role="bodyStrong" style={{ fontSize: 14 }}>تفاصيل المنتج</Text>
                      <Box layoutDirection="row" gap={2} align="center">
                        <Button
                          label="▸ Workspace"
                          tone="brand"
                          size="sm"
                          onPress={() => openWorkspace('item-detail', selectedProductId ?? undefined)}
                          accessibilityLabel="فتح workspace تفاصيل العنصر"
                        />
                        <Button label="✕" accessibilityLabel="إغلاق" tone="secondary" size="sm" onPress={() => setSelectedProductId(null)} />
                      </Box>
                   </Box>
                   <Box gap={3} padding={3} style={{ flex: 1 }}>
                      {/* Image + name header */}
                      <Box layoutDirection="row" gap={3} align="center">
                         <WatermarkedImage src={selectedProduct.imageUri} mediaKey={selectedProduct.mediaKey} productName={selectedProduct.name} size={48} />
                         <Box style={{ flex: 1 }} gap={0}>
                            <Text role="bodyStrong" style={{ fontSize: 13 }}>{selectedProduct.name}</Text>
                            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>المعرف: {selectedProduct.sku}</Text>
                         </Box>
                      </Box>

                       <InspectorTile tileTitle="ربط الفئة (Category Mapping)">
                          <Box gap={1}>
                            <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>الفئة الرئيسية:</Text>
                            <select
                              value={selectedProduct.categoryPath.main}
                              onChange={(e) => {
                                const newMain = e.target.value;
                                queueProductPreviewPatch(
                                  selectedProduct,
                                  { categoryPath: { ...selectedProduct.categoryPath, main: newMain, sub: undefined, mainClassification: undefined, subClassification: undefined } },
                                  'تم تسجيل مقترح تغيير الفئة الرئيسية',
                                  'تغيير categoryPath.main كمعاينة فقط؛ لا تعديل على المصدر المركزي.',
                                );
                              }}
                              style={{
                                padding: '4px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                backgroundColor: theme.surface,
                                color: theme.brandHeaderBackground,
                                border: `1px solid ${theme.lineStrong}`,
                                direction: 'rtl',
                                width: '100%'
                              }}
                            >
                              {previewCategories.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                              ))}
                            </select>

                            <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right', marginTop: 4 }}>الفئة الفرعية:</Text>
                            <select
                              value={selectedProduct.categoryPath.sub || ''}
                              onChange={(e) => {
                                const newSub = e.target.value || undefined;
                                queueProductPreviewPatch(
                                  selectedProduct,
                                  { categoryPath: { ...selectedProduct.categoryPath, sub: newSub, mainClassification: undefined, subClassification: undefined } },
                                  'تم تسجيل مقترح تغيير الفئة الفرعية',
                                  'تغيير categoryPath.sub كمعاينة فقط؛ لا تعديل على المصدر المركزي.',
                                );
                              }}
                              style={{
                                padding: '4px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                backgroundColor: theme.surface,
                                color: theme.brandHeaderBackground,
                                border: `1px solid ${theme.lineStrong}`,
                                direction: 'rtl',
                                width: '100%'
                              }}
                            >
                              <option value="">لا يوجد (عام)</option>
                              {(previewCategories.find(c => c.id === selectedProduct.categoryPath.main)?.subcategories || []).map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>

                            {(() => {
                              const mainCat = previewCategories.find(c => c.id === selectedProduct.categoryPath.main);
                              const subCat = mainCat?.subcategories.find(s => s.id === selectedProduct.categoryPath.sub);
                              const mainClassifs = subCat?.mainClassifications || [];
                              if (!subCat || mainClassifs.length === 0) return null;
                              return (
                                <>
                                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right', marginTop: 4 }}>التصنيف الرئيسي:</Text>
                                  <select
                                    value={selectedProduct.categoryPath.mainClassification || ''}
                                    onChange={(e) => {
                                      const newMainClassif = e.target.value || undefined;
                                      queueProductPreviewPatch(
                                        selectedProduct,
                                        { categoryPath: { ...selectedProduct.categoryPath, mainClassification: newMainClassif, subClassification: undefined } },
                                        'تم تسجيل مقترح تغيير التصنيف الرئيسي',
                                        'تغيير categoryPath.mainClassification كمعاينة فقط؛ لا تعديل على المصدر المركزي.',
                                      );
                                    }}
                                    style={{
                                      padding: '4px 6px',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      backgroundColor: theme.surface,
                                      color: theme.brandHeaderBackground,
                                      border: `1px solid ${theme.lineStrong}`,
                                      direction: 'rtl',
                                      width: '100%'
                                    }}
                                  >
                                    <option value="">لا يوجد (عام)</option>
                                    {mainClassifs.map(mc => (
                                      <option key={mc.id} value={mc.id}>{mc.label}</option>
                                    ))}
                                  </select>

                                  {(() => {
                                    const selMainClassif = mainClassifs.find(mc => mc.id === selectedProduct.categoryPath.mainClassification);
                                    const subClassifs = selMainClassif?.subClassifications || [];
                                    if (!selMainClassif || subClassifs.length === 0) return null;
                                    return (
                                      <>
                                        <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right', marginTop: 4 }}>التصنيف الفرعي:</Text>
                                        <select
                                          value={selectedProduct.categoryPath.subClassification || ''}
                                          onChange={(e) => {
                                            const newSubClassif = e.target.value || undefined;
                                            queueProductPreviewPatch(
                                              selectedProduct,
                                              { categoryPath: { ...selectedProduct.categoryPath, subClassification: newSubClassif } },
                                              'تم تسجيل مقترح تغيير التصنيف الفرعي',
                                              'تغيير categoryPath.subClassification كمعاينة فقط؛ لا تعديل على المصدر المركزي.',
                                            );
                                          }}
                                          style={{
                                            padding: '4px 6px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            backgroundColor: theme.surface,
                                            color: theme.brandHeaderBackground,
                                            border: `1px solid ${theme.lineStrong}`,
                                            direction: 'rtl',
                                            width: '100%'
                                          }}
                                        >
                                          <option value="">لا يوجد (عام)</option>
                                          {subClassifs.map(sc => (
                                            <option key={sc.id} value={sc.id}>{sc.label}</option>
                                          ))}
                                        </select>
                                      </>
                                    );
                                  })()}
                                </>
                              );
                            })()}
                          </Box>
                       </InspectorTile>

                      <InspectorTile tileTitle="الحالة">
                         <div style={{  gridTemplateColumns: '1fr', gap: '4px' }}>
                            <MiniInfoBox label="العميل" value={selectedProduct.approvalStage === 'client-visible' ? 'مرئي' : 'مخفي'} valueColor={selectedProduct.approvalStage === 'client-visible' ? theme.success : theme.textMuted} isBoldValue />
                            <MiniInfoBox label="الشريك" value="متاح" />
                         </div>
                      </InspectorTile>

                      {selectedProduct.conflictReason && (
                         <InspectorTile tileTitle="تعارض" warning>
                            <Text role="caption" style={{ color: theme.danger, fontSize: 10 }}>{selectedProduct.conflictReason}</Text>
                         </InspectorTile>
                      )}

                       {/* Governance & Approvals Action Section */}
                       <InspectorTile tileTitle="حوكمة واعتماد المنتج">
                          <Box gap={2}>
                            {selectedProduct.approvalStage === 'marketing-review' && (
                              <Box gap={1}>
                                <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>مراجعة التسويق معلقة:</Text>
                                <Box layoutDirection="row" gap={1}>
                                  <Button
                                    label="اعتماد مركزي"
                                    tone="primary"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      queueProductPreviewPatch(
                                        selectedProduct,
                                        { approvalStage: 'catalog-adopted', mediaPolicy: 'catalog-owned-media' },
                                        'تم تسجيل مقترح الاعتماد كمنتج مركزي',
                                        'اعتماد المنتج كمنتج مركزي كمعاينة فقط.',
                                      );
                                    }}
                                  />
                                  <Button
                                    label="استثناء شريك"
                                    tone="secondary"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      queueProductPreviewPatch(
                                        selectedProduct,
                                        { approvalStage: 'catalog-adopted', mediaPolicy: 'partner-owned-exception' },
                                        'تم تسجيل مقترح الاعتماد كاستثناء شريك',
                                        'اعتماد المنتج كاستثناء شريك كمعاينة فقط.',
                                      );
                                    }}
                                  />
                                </Box>
                                <Box layoutDirection="row" gap={1}>
                                  <Button
                                    label="طلب تعديل"
                                    tone="danger"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      queueProductPreviewPatch(
                                        selectedProduct,
                                        { approvalStage: 'catalog-draft' },
                                        'تم تسجيل مقترح إعادة المنتج للمسودة',
                                        'إعادة المنتج لمسودة الكتالوج كمعاينة فقط.',
                                      );
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}

                            {selectedProduct.approvalStage === 'partner-review' && (
                              <Box gap={1}>
                                <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>مراجعة الجودة معلقة:</Text>
                                <Box layoutDirection="row" gap={1}>
                                  <Button
                                    label="تمرير الجودة"
                                    tone="primary"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      queueProductPreviewPatch(
                                        selectedProduct,
                                        { approvalStage: 'catalog-adopted' },
                                        'تم تسجيل مقترح تمرير فحص الجودة',
                                        'تمرير فحص الجودة كمعاينة فقط.',
                                      );
                                    }}
                                  />
                                  <Button
                                    label="طلب تعديل"
                                    tone="secondary"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      queueProductPreviewPatch(
                                        selectedProduct,
                                        { approvalStage: 'catalog-draft' },
                                        'تم تسجيل مقترح إرجاع المنتج للمسودة',
                                        'إرجاع المنتج للمسودة كمعاينة فقط.',
                                      );
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}

                            {selectedProduct.approvalStage === 'catalog-adopted' && (
                              <Box gap={1}>
                                <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>العنصر جاهز ومعتمد:</Text>
                                <Button
                                  label="نشر مباشر للعميل"
                                  tone="brand"
                                  size="sm"
                                  onPress={() => {
                                    queueProductPreviewPatch(
                                      selectedProduct,
                                      { approvalStage: 'client-visible' },
                                      'تم تسجيل مقترح النشر للعميل',
                                      'تغيير الظهور إلى client-visible كمعاينة فقط.',
                                    );
                                  }}
                                />
                              </Box>
                            )}

                            {selectedProduct.conflictReason && (
                              <Box gap={1}>
                                <Text role="caption" tone="danger" style={{ fontSize: 10, textAlign: 'right' }}>حل التعارض:</Text>
                                <Button
                                  label="دمج وحل التعارض"
                                  tone="primary"
                                  size="sm"
                                  onPress={() => {
                                    queueProductPreviewPatch(
                                      selectedProduct,
                                      { conflictReason: undefined },
                                      'تم تسجيل مقترح حل التعارض',
                                      'إزالة conflictReason كمعاينة فقط؛ الدمج الفعلي يحتاج API.',
                                    );
                                  }}
                                />
                              </Box>
                            )}
                            {!selectedProduct.gtin && (
                              <Box gap={1}>
                                <Text role="caption" tone="warning" style={{ fontSize: 10, textAlign: 'right' }}>باركود مفقود:</Text>
                                <Button
                                  label="توليد باركود GTIN"
                                  tone="secondary"
                                  size="sm"
                                  onPress={() => {
                                    const barcode = `628${Math.floor(1000000000 + Math.random() * 9000000000)}`;
                                    queueProductPreviewPatch(
                                      selectedProduct,
                                      { gtin: barcode, barcode },
                                      `تم تسجيل مقترح حجز باركود: ${barcode}`,
                                      'حجز GTIN كمعاينة فقط؛ لا يوجد binding مع سجل الباركود.',
                                      'POST /catalog/products/{id}/barcode-reservations',
                                    );
                                  }}
                                />
                              </Box>
                            )}

                            {selectedProduct.price > 100 && (
                              <Box gap={1}>
                                <Text role="caption" tone="warning" style={{ fontSize: 10, textAlign: 'right' }}>شذوذ في السعر (&gt; 100):</Text>
                                <Button
                                  label="تسوية السعر إلى 45.00"
                                  tone="secondary"
                                  size="sm"
                                  onPress={() => {
                                    queueProductPreviewPatch(
                                      selectedProduct,
                                      { price: 45.00 },
                                      'تم تسجيل مقترح تسوية سعر المنتج',
                                      'تسوية السعر إلى 45.00 كمعاينة فقط.',
                                      'PATCH /catalog/products/{id}/price',
                                    );
                                  }}
                                />
                              </Box>
                            )}

                            <Box style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 4, marginTop: 4 }}>
                              <MiniInfoBox
                                label="حالة الاعتماد في الكتالوج"
                                value={selectedProduct.approvalStage}
                                valueColor={theme.brand}
                              />
                            </Box>
                          </Box>
                       </InspectorTile>

                      <Box gap={2} style={{ marginTop: 'auto' }}>
                          <Button
                            label="تعديل بيانات المنتج"
                            tone="primary"
                            size="sm"
                            fullWidth
                            onPress={() => {
                              setModalMode('edit');
                              setModalForm({
                                id: selectedProduct.id,
                                name: selectedProduct.name,
                                sku: selectedProduct.sku,
                                gtin: selectedProduct.gtin || '',
                                price: selectedProduct.price,
                                mainCat: selectedProduct.categoryPath.main,
                                subCat: selectedProduct.categoryPath.sub || '',
                                mainClassif: selectedProduct.categoryPath.mainClassification || '',
                                subClassif: selectedProduct.categoryPath.subClassification || '',
                                mediaPolicy: selectedProduct.mediaPolicy,
                                approvalStage: selectedProduct.approvalStage,
                                imageUri: selectedProduct.imageUri || '',
                                mediaKey: selectedProduct.mediaKey || '',
                              });
                              setShowProductModal(true);
                            }}
                          />
                         <Button label="معاينة إحالة للتسويق" tone="secondary" size="sm" fullWidth />
                      </Box>
                   </Box>
                </div>
              )}
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '100%' }}>
                 {/* Right Panel: Modern Tree View (RTL) */}
                 <div style={{ flex: 1.3, borderLeft: '1px solid ' + theme.line, display: 'flex', flexDirection: 'column', backgroundColor: theme.surface, overflowY: 'auto', padding: '20px' }}>
                    <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 12, marginBottom: 16 }}>
                       <Box gap={1}>
                          <Text role="bodyStrong" style={{ fontSize: 16, color: theme.brandHeaderBackground }}>هيكل الفئات والتصنيفات المركزية</Text>
                          <Text role="caption" tone="muted" style={{ fontSize: 11 }}>تصفح شجرة الفئات والتصنيفات، واضغط على أي عنصر لمراجعته وتعديل صورته</Text>
                       </Box>
                       <div style={{ flexShrink: 0, minWidth: 'fit-content', marginLeft: '8px' }}>
                          <Button
                            label="➕ فئة رئيسية جديدة"
                            tone="brand"
                            size="sm"
                            onPress={() => {
                              setAddingMainCat(true);
                              setAddingSubUnder(null);
                              setAddingMainClassifUnder(null);
                              setAddingSubClassifUnder(null);
                              setEditingEntry(null);
                              setFormLabel('');
                              setFormSubtitle('');
                              setCatError(null);
                            }}
                          />
                       </div>
                    </Box>

                    {catError && (
                      <div style={{
                        padding: '8px 12px', borderRadius: '6px', backgroundColor: theme.dangerSurface ?? theme.surfaceInset,
                        border: '1px solid ' + theme.danger, fontSize: '11px', color: theme.danger, fontWeight: 700,
                        marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <span>{catError}</span>
                        <button onClick={() => setCatError(null)} style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, cursor: 'pointer', fontSize: '12px', fontWeight: 950 }}>×</button>
                      </div>
                    )}

                    {/* Add main category inline form */}
                    {addingMainCat && (
                      <div style={{
                        padding: '12px', borderRadius: '8px', backgroundColor: theme.surfaceInset,
                        border: '1px solid ' + theme.brand, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 16
                      }}>
                        <Text role="caption" style={{ fontWeight: 800, color: theme.brand }}>إضافة فئة رئيسية جديدة</Text>
                        <input
                          type="text" placeholder="اسم الفئة *" value={formLabel}
                          onChange={(e) => setFormLabel(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainCategory(); if (e.key === 'Escape') setAddingMainCat(false); }}
                          autoFocus
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                        />
                        <input
                          type="text" placeholder="وصف الفئة" value={formSubtitle}
                          onChange={(e) => setFormSubtitle(e.target.value)}
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={handleAddMainCategory} style={{ padding: '4px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                           <button onClick={() => { setAddingMainCat(false); setFormLabel(''); setFormSubtitle(''); }} style={{ padding: '4px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                        </div>
                      </div>
                    )}

                    {/* Search filter for taxonomy tree */}
                    <div style={{ marginBottom: 16 }}>
                       <SearchField
                          placeholder="ابحث عن فئة أو تصنيف..."
                          value={treeSearchQuery}
                          onChangeText={setTreeSearchQuery}
                       />
                    </div>

                    {/* Taxonomy Tree List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                       {filteredCategories.map(cat => {
                         const isCatExpanded = treeSearchQuery.trim() !== '' || expandedMainCategoryIds.has(cat.id);
                         const isSelected = selectedTaxonomyNode?.type === 'main' && selectedTaxonomyNode.mainId === cat.id;
                         const isHidden = hiddenCategoryIds.has(cat.id);
                         const pCount = getProductCountForCategory(cat.id);
                         const showActions = hoveredNodeId === cat.id || isSelected;

                         return (
                           <div
                             key={cat.id}
                             onMouseEnter={() => setHoveredNodeId(cat.id)}
                             onMouseLeave={() => setHoveredNodeId(null)}
                             style={{ borderRadius: '8px', border: '1px solid ' + (isSelected ? theme.brand : theme.line), backgroundColor: isHidden ? theme.surfaceInset : (isSelected ? theme.brandSurface : theme.surface), overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                           >
                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                                <button
                                  onClick={() => setSelectedTaxonomyNode({ type: 'main', mainId: cat.id })}
                                  style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, textAlign: 'right' }}
                                >
                                   {cat.subcategories.length > 0 ? (
                                     <span
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         toggleMainCategoryExpand(cat.id);
                                       }}
                                       style={{
                                         fontSize: '11px',
                                         color: theme.textMuted,
                                         padding: '4px',
                                         cursor: 'pointer',
                                         display: 'inline-flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         width: '18px',
                                         height: '18px'
                                       }}
                                     >
                                       {isCatExpanded ? '▼' : '◀'}
                                     </span>
                                   ) : (
                                     <span style={{ width: '18px', display: 'inline-block' }} />
                                   )}
                                   <WatermarkedImage src={cat.imageUri} mediaKey={cat.mediaKey} fallback={cat.emojiFallback} size={36} productName={cat.label} />
                                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '13px', fontWeight: 700, color: theme.brandHeaderBackground }}>{cat.label}</span>
                                      {cat.subtitle && <span style={{ fontSize: '10.5px', color: theme.textMuted }}>{cat.subtitle}</span>}
                                   </div>
                                   <span style={{ fontSize: '10.5px', color: theme.textMuted, marginRight: 'auto', paddingLeft: '8px' }}>{pCount} منتج</span>
                                </button>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', opacity: showActions ? 1 : 0, pointerEvents: showActions ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
                                   <button
                                     onClick={() => {
                                       setAddingSubUnder(cat.id);
                                       setSelectedTaxonomyNode({ type: 'main', mainId: cat.id });
                                       setFormLabel('');
                                     }}
                                     style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                                   >
                                     + فرعية
                                   </button>
                                   <button
                                     onClick={() => handleToggleCategoryHide(cat.id)}
                                     style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                                   >
                                     {isHidden ? 'إظهار' : 'إخفاء'}
                                   </button>
                                   <button
                                     onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة بالكامل؟')) { handleDeleteNode('main', cat.id); setSelectedTaxonomyNode(null); } }}
                                     style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}
                                   >
                                     حذف
                                   </button>
                                </div>
                             </div>

                             {/* Add subcategory inline form */}
                             {addingSubUnder === cat.id && (
                               <div style={{ margin: '0 14px 12px 14px', padding: '10px', borderRadius: '6px', backgroundColor: theme.surfaceInset, border: '1px solid ' + theme.brand, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                 <span style={{ fontSize: '10px', fontWeight: 800, color: theme.brand }}>إضافة فئة فرعية تحت: {cat.label}</span>
                                 <input type="text" placeholder="اسم الفئة الفرعية *" value={formLabel} onChange={e => setFormLabel(e.target.value)}
                                   onKeyDown={e => { if (e.key === 'Enter') handleAddSubCategory(cat.id); }}
                                   autoFocus
                                   style={{ padding: '6px 10px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, outline: 'none' }}
                                 />
                                 <input type="text" placeholder="وصف الفئة الفرعية" value={formSubtitle} onChange={e => setFormSubtitle(e.target.value)}
                                   style={{ padding: '6px 10px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, outline: 'none' }}
                                 />
                                 <div style={{ display: 'flex', gap: '4px' }}>
                                   <button onClick={() => handleAddSubCategory(cat.id)} style={{ padding: '3px 12px', borderRadius: '3px', fontSize: '10.5px', fontWeight: 700, backgroundColor: theme.brand, color: theme.textInverse, border: 'none', cursor: 'pointer' }}>تأكيد</button>
                                   <button onClick={() => setAddingSubUnder(null)} style={{ padding: '3px 12px', borderRadius: '3px', fontSize: '10.5px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                 </div>
                               </div>
                             )}

                             {/* Subcategories list */}
                             {isCatExpanded && cat.subcategories.length > 0 && (
                               <div style={{ margin: '0 14px 12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {cat.subcategories.map(sub => {
                                    const isSubExpanded = treeSearchQuery.trim() !== '' || expandedSubCategoryIds.has(sub.id);
                                    const isSubSelected = selectedTaxonomyNode?.type === 'sub' && selectedTaxonomyNode.mainId === cat.id && selectedTaxonomyNode.subId === sub.id;
                                    const isSubHidden = hiddenSubCategoryIds.has(sub.id);
                                    const subCount = getProductCountForCategory(cat.id, sub.id);
                                    const showSubActions = hoveredNodeId === sub.id || isSubSelected;

                                    return (
                                      <div
                                        key={sub.id}
                                        onMouseEnter={() => setHoveredNodeId(sub.id)}
                                        onMouseLeave={() => setHoveredNodeId(null)}
                                        style={{
                                          borderRadius: '6px',
                                          border: '1px solid ' + (isSubSelected ? theme.brand : 'transparent'),
                                          backgroundColor: isSubHidden ? theme.surfaceInset : (isSubSelected ? theme.brandSurface : theme.surfaceInset),
                                          padding: '8px',
                                          overflow: 'hidden',
                                          marginRight: '20px' // Indentation replacing connect symbols
                                        }}
                                      >
                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <button
                                              onClick={() => setSelectedTaxonomyNode({ type: 'sub', mainId: cat.id, subId: sub.id })}
                                              style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'right' }}
                                            >
                                               {(sub.mainClassifications && sub.mainClassifications.length > 0) ? (
                                                 <span
                                                   onClick={(e) => {
                                                     e.stopPropagation();
                                                     toggleSubCategoryExpand(sub.id);
                                                   }}
                                                   style={{
                                                     fontSize: '10px',
                                                     color: theme.textMuted,
                                                     padding: '3px',
                                                     cursor: 'pointer',
                                                     display: 'inline-flex',
                                                     alignItems: 'center',
                                                     justifyContent: 'center',
                                                     width: '16px',
                                                     height: '16px'
                                                   }}
                                                 >
                                                   {isSubExpanded ? '▼' : '◀'}
                                                 </span>
                                               ) : (
                                                 <span style={{ width: '16px', display: 'inline-block' }} />
                                               )}
                                               <WatermarkedImage src={sub.imageUri} mediaKey={sub.mediaKey} fallback={sub.emojiFallback || '📂'} size={28} productName={sub.label} />
                                               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                  <span style={{ fontSize: '12px', fontWeight: 700, color: theme.brandHeaderBackground }}>{sub.label}</span>
                                                  {sub.subtitle && <span style={{ fontSize: '9.5px', color: theme.textMuted }}>{sub.subtitle}</span>}
                                               </div>
                                               <span style={{ fontSize: '9.5px', color: theme.textMuted, marginRight: 'auto', paddingLeft: '8px' }}>{subCount}</span>
                                            </button>
                                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', opacity: showSubActions ? 1 : 0, pointerEvents: showSubActions ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
                                               <button
                                                 onClick={() => {
                                                   setAddingMainClassifUnder({ mainId: cat.id, subId: sub.id });
                                                   setSelectedTaxonomyNode({ type: 'sub', mainId: cat.id, subId: sub.id });
                                                   setFormLabel('');
                                                 }}
                                                 style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9.5px', border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                                               >
                                                 + تصنيف
                                               </button>
                                               <button onClick={() => handleToggleSubCategoryHide(sub.id)} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9.5px', border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}>
                                                 {isSubHidden ? 'إظهار' : 'إخفاء'}
                                               </button>
                                               <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة الفرعية بالكامل؟')) { handleDeleteNode('sub', cat.id, sub.id); setSelectedTaxonomyNode(null); } }} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9.5px', border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}>
                                                 حذف
                                               </button>
                                            </div>
                                         </div>

                                         {/* Add main classification inline form */}
                                         {addingMainClassifUnder?.mainId === cat.id && addingMainClassifUnder?.subId === sub.id && (
                                           <div style={{ margin: '6px 12px 6px 4px', padding: '8px', borderRadius: '4px', backgroundColor: theme.surface, border: '1px solid ' + theme.brand, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                             <span style={{ fontSize: '9.5px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف رئيسي جديد تحت: {sub.label}</span>
                                             <input type="text" placeholder="اسم التصنيف *" value={formLabel} onChange={e => setFormLabel(e.target.value)}
                                               onKeyDown={e => { if (e.key === 'Enter') handleAddMainClassification(cat.id, sub.id); }}
                                               autoFocus
                                               style={{ padding: '4px 8px', borderRadius: '3px', fontSize: '10.5px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, outline: 'none' }}
                                             />
                                             <div style={{ display: 'flex', gap: '4px' }}>
                                               <button onClick={() => handleAddMainClassification(cat.id, sub.id)} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9.5px', fontWeight: 700, backgroundColor: theme.brand, color: theme.textInverse, border: 'none', cursor: 'pointer' }}>تأكيد</button>
                                               <button onClick={() => setAddingMainClassifUnder(null)} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9.5px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                             </div>
                                           </div>
                                         )}

                                         {/* Main Classifications */}
                                         {isSubExpanded && sub.mainClassifications && sub.mainClassifications.length > 0 && (
                                           <div style={{ margin: '6px 4px 2px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                              {sub.mainClassifications.map(classif => {
                                                const isClassifExpanded = treeSearchQuery.trim() !== '' || expandedMainClassifIds.has(classif.id);
                                                const isClassifSelected = selectedTaxonomyNode?.type === 'mainClassif' && selectedTaxonomyNode.mainId === cat.id && selectedTaxonomyNode.subId === sub.id && selectedTaxonomyNode.mainClassifId === classif.id;
                                                const showClassifActions = hoveredNodeId === classif.id || isClassifSelected;

                                                return (
                                                  <div
                                                    key={classif.id}
                                                    onMouseEnter={() => setHoveredNodeId(classif.id)}
                                                    onMouseLeave={() => setHoveredNodeId(null)}
                                                    style={{
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      gap: '4px',
                                                      backgroundColor: theme.surface,
                                                      borderRadius: '4px',
                                                      border: '1px solid ' + (isClassifSelected ? theme.brand : theme.line),
                                                      padding: '6px',
                                                      marginRight: '20px' // Indentation replacing connect symbols
                                                    }}
                                                  >
                                                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <button
                                                          onClick={() => setSelectedTaxonomyNode({ type: 'mainClassif', mainId: cat.id, subId: sub.id, mainClassifId: classif.id })}
                                                          style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flex: 1, textAlign: 'right' }}
                                                        >
                                                           {(classif.subClassifications && classif.subClassifications.length > 0) ? (
                                                             <span
                                                               onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 toggleMainClassifExpand(classif.id);
                                                               }}
                                                               style={{
                                                                 fontSize: '9px',
                                                                 color: theme.textMuted,
                                                                 padding: '2px',
                                                                 cursor: 'pointer',
                                                                 display: 'inline-flex',
                                                                 alignItems: 'center',
                                                                 justifyContent: 'center',
                                                                 width: '14px',
                                                                 height: '14px'
                                                               }}
                                                             >
                                                               {isClassifExpanded ? '▼' : '◀'}
                                                             </span>
                                                           ) : (
                                                             <span style={{ width: '14px', display: 'inline-block' }} />
                                                           )}
                                                           <WatermarkedImage src={classif.imageUri} mediaKey={classif.mediaKey} fallback={classif.emojiFallback || '🔹'} size={24} productName={classif.label} />
                                                           <span style={{ fontSize: '11px', fontWeight: 600, color: theme.brandHeaderBackground }}>{classif.label}</span>
                                                        </button>
                                                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center', opacity: showClassifActions ? 1 : 0, pointerEvents: showClassifActions ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
                                                           <button
                                                             onClick={() => {
                                                               setAddingSubClassifUnder({ mainId: cat.id, subId: sub.id, mainClassifId: classif.id });
                                                               setSelectedTaxonomyNode({ type: 'mainClassif', mainId: cat.id, subId: sub.id, mainClassifId: classif.id });
                                                               setFormLabel('');
                                                             }}
                                                             style={{ padding: '1px 5px', borderRadius: '3px', fontSize: '8.5px', border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                                                           >
                                                             + فرعي
                                                           </button>
                                                           <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الرئيسي بالكامل؟')) { handleDeleteNode('mainClassif', cat.id, sub.id, classif.id); setSelectedTaxonomyNode(null); } }} style={{ padding: '1px 5px', borderRadius: '3px', fontSize: '8.5px', border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}>
                                                             حذف
                                                           </button>
                                                        </div>
                                                     </div>

                                                      {/* Add sub classification inline form */}
                                                      {addingSubClassifUnder?.mainId === cat.id && addingSubClassifUnder?.subId === sub.id && addingSubClassifUnder?.mainClassifId === classif.id && (
                                                        <div style={{ margin: '4px 12px 4px 4px', padding: '6px', borderRadius: '3px', backgroundColor: theme.surfaceInset, border: '1px solid ' + theme.brand, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                          <span style={{ fontSize: '8.5px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف فرعي جديد تحت: {classif.label}</span>
                                                          <input type="text" placeholder="اسم التصنيف الفرعي *" value={formLabel} onChange={e => setFormLabel(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') handleAddSubClassification(cat.id, sub.id, classif.id); }}
                                                            autoFocus
                                                            style={{ padding: '3px 6px', borderRadius: '2px', fontSize: '9.5px', direction: 'rtl', border: '1px solid ' + theme.lineStrong, backgroundColor: theme.surface, outline: 'none' }}
                                                          />
                                                          <div style={{ display: 'flex', gap: '3px' }}>
                                                            <button onClick={() => handleAddSubClassification(cat.id, sub.id, classif.id)} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8.5px', fontWeight: 700, backgroundColor: theme.brand, color: theme.textInverse, border: 'none', cursor: 'pointer' }}>تأكيد</button>
                                                            <button onClick={() => setAddingSubClassifUnder(null)} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8.5px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                                          </div>
                                                        </div>
                                                      )}

                                                      {/* Sub classifications list */}
                                                      {isClassifExpanded && classif.subClassifications && classif.subClassifications.length > 0 && (
                                                        <div style={{ margin: '3px 2px 2px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                           {classif.subClassifications.map(subc => {
                                                             const isSubcSelected = selectedTaxonomyNode?.type === 'subClassif' && selectedTaxonomyNode.mainId === cat.id && selectedTaxonomyNode.subId === sub.id && selectedTaxonomyNode.mainClassifId === classif.id && selectedTaxonomyNode.subClassifId === subc.id;
                                                             const showSubcActions = hoveredNodeId === subc.id || isSubcSelected;

                                                             return (
                                                               <div
                                                                 key={subc.id}
                                                                 onMouseEnter={() => setHoveredNodeId(subc.id)}
                                                                 onMouseLeave={() => setHoveredNodeId(null)}
                                                                 style={{
                                                                   display: 'flex',
                                                                   alignItems: 'center',
                                                                   justifyContent: 'space-between',
                                                                   backgroundColor: theme.surfaceInset,
                                                                   borderRadius: '4px',
                                                                   border: '1px solid ' + (isSubcSelected ? theme.brand : 'transparent'),
                                                                   padding: '3px 8px',
                                                                   marginRight: '20px'
                                                                 }}
                                                               >
                                                                  <button
                                                                    onClick={() => setSelectedTaxonomyNode({ type: 'subClassif', mainId: cat.id, subId: sub.id, mainClassifId: classif.id, subClassifId: subc.id })}
                                                                    style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flex: 1, textAlign: 'right' }}
                                                                  >
                                                                     <WatermarkedImage src={subc.imageUri} mediaKey={subc.mediaKey} fallback={subc.emojiFallback || '🔸'} size={20} productName={subc.label} />
                                                                     <span style={{ fontSize: '10px', color: theme.brandHeaderBackground }}>{subc.label}</span>
                                                                  </button>
                                                                  <button
                                                                    onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الفرعي؟')) { handleDeleteNode('subClassif', cat.id, sub.id, classif.id, subc.id); setSelectedTaxonomyNode(null); } }}
                                                                    style={{
                                                                      padding: '1px 5px',
                                                                      borderRadius: '2px',
                                                                      fontSize: '8px',
                                                                      border: '1px solid ' + theme.danger,
                                                                      cursor: 'pointer',
                                                                      backgroundColor: 'transparent',
                                                                      color: theme.danger,
                                                                      opacity: showSubcActions ? 1 : 0,
                                                                      pointerEvents: showSubcActions ? 'auto' : 'none',
                                                                      transition: 'opacity 0.2s ease'
                                                                    }}
                                                                  >
                                                                    حذف
                                                                  </button>
                                                               </div>
                                                             );
                                                           })}
                                                        </div>
                                                      )}
                                                   </div>
                                                 );
                                               })}
                                            </div>
                                          )}
                                       </div>
                                     );
                                   })}
                                </div>
                              )}
                           </div>
                         );
                       })}
                    </div>
                 </div>

                 {/* Left Panel: Selected Node Inspector & Details Editor */}
                 <div style={{ width: '380px', display: 'flex', flexDirection: 'column', backgroundColor: theme.surfaceInset, padding: '20px', overflowY: 'auto', borderRight: '1px solid ' + theme.line }}>
                    {selectedTaxonomyNode ? (() => {
                       const mainCat = previewCategories.find(c => c.id === selectedTaxonomyNode.mainId);
                       const subCat = mainCat?.subcategories.find(s => s.id === selectedTaxonomyNode.subId);
                       const mainClassif = subCat?.mainClassifications?.find(mc => mc.id === selectedTaxonomyNode.mainClassifId);
                       const subClassif = mainClassif?.subClassifications?.find(sc => sc.id === selectedTaxonomyNode.subClassifId);

                       const updateNodeField = (fields: Partial<{ label: string; emojiFallback: string; imageUri: string; mediaKey: string } & Record<'subtitle', string>>) => {
                         setPreviewCategories(prev => {
                           return prev.map(c => {
                             if (selectedTaxonomyNode.type === 'main' && c.id === selectedTaxonomyNode.mainId) {
                               return { ...c, ...fields };
                             }
                             if (c.id === selectedTaxonomyNode.mainId) {
                               return {
                                 ...c,
                                 subcategories: c.subcategories.map(s => {
                                   if (selectedTaxonomyNode.type === 'sub' && s.id === selectedTaxonomyNode.subId) {
                                     return { ...s, ...fields };
                                   }
                                   if (s.id === selectedTaxonomyNode.subId) {
                                     return {
                                       ...s,
                                       mainClassifications: (s.mainClassifications || []).map(mc => {
                                         if (selectedTaxonomyNode.type === 'mainClassif' && mc.id === selectedTaxonomyNode.mainClassifId) {
                                           return { ...mc, ...fields };
                                         }
                                         if (mc.id === selectedTaxonomyNode.mainClassifId) {
                                           return {
                                             ...mc,
                                             subClassifications: (mc.subClassifications || []).map(sc => {
                                               if (selectedTaxonomyNode.type === 'subClassif' && sc.id === selectedTaxonomyNode.subClassifId) {
                                                 return { ...sc, ...fields };
                                               }
                                               return sc;
                                             })
                                           };
                                         }
                                         return mc;
                                       })
                                     };
                                   }
                                   return s;
                                 })
                               };
                             }
                             return c;
                           });
                         });
                       };

                       let nodeLabel = '';
                       let nodeSubtitle = '';
                       let nodeEmoji = '';
                       let nodeImageUri = '';
                       let nodeMediaKey = '';
                       let nodeTypeLabel = '';

                       if (selectedTaxonomyNode.type === 'main' && mainCat) {
                         nodeLabel = mainCat.label;
                         nodeSubtitle = mainCat.subtitle;
                         nodeEmoji = mainCat.emojiFallback || '';
                         nodeImageUri = mainCat.imageUri || '';
                         nodeMediaKey = mainCat.mediaKey || '';
                         nodeTypeLabel = 'فئة رئيسية';
                       } else if (selectedTaxonomyNode.type === 'sub' && subCat) {
                         nodeLabel = subCat.label;
                         nodeSubtitle = subCat.subtitle;
                         nodeEmoji = subCat.emojiFallback || '';
                         nodeImageUri = subCat.imageUri || '';
                         nodeMediaKey = subCat.mediaKey || '';
                         nodeTypeLabel = 'فئة فرعية';
                       } else if (selectedTaxonomyNode.type === 'mainClassif' && mainClassif) {
                         nodeLabel = mainClassif.label;
                         nodeEmoji = mainClassif.emojiFallback || '';
                         nodeImageUri = mainClassif.imageUri || '';
                         nodeMediaKey = mainClassif.mediaKey || '';
                         nodeTypeLabel = 'تصنيف رئيسي';
                       } else if (selectedTaxonomyNode.type === 'subClassif' && subClassif) {
                         nodeLabel = subClassif.label;
                         nodeEmoji = subClassif.emojiFallback || '';
                         nodeImageUri = subClassif.imageUri || '';
                         nodeMediaKey = subClassif.mediaKey || '';
                         nodeTypeLabel = 'تصنيف فرعي';
                       } else {
                         return (
                           <Box align="center" justify="center" style={{ flex: 1 }}>
                              <Text role="caption" tone="muted">العنصر المختار لم يعد موجوداً في الشجرة.</Text>
                           </Box>
                         );
                       }

                        const bindedProducts = products.filter(p => {
                          if (selectedTaxonomyNode.type === 'main') return p.categoryPath.main === selectedTaxonomyNode.mainId;
                          if (selectedTaxonomyNode.type === 'sub') return p.categoryPath.main === selectedTaxonomyNode.mainId && p.categoryPath.sub === selectedTaxonomyNode.subId;
                          if (selectedTaxonomyNode.type === 'mainClassif') return p.categoryPath.mainClassification === selectedTaxonomyNode.mainClassifId;
                          return p.categoryPath.subClassification === selectedTaxonomyNode.subClassifId;
                        });

                        return (
                          <Box gap={4} style={{ flex: 1 }}>
                             <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 10 }}>
                                <Box gap={1}>
                                   <Text role="bodyStrong" style={{ fontSize: 14, color: theme.brandHeaderBackground }}>مراجعة وتعديل: {nodeTypeLabel}</Text>
                                   <Text role="caption" tone="muted" style={{ fontSize: 10 }}>معرف النظام: {selectedTaxonomyNode.subClassifId || selectedTaxonomyNode.mainClassifId || selectedTaxonomyNode.subId || selectedTaxonomyNode.mainId}</Text>
                                </Box>
                                <Button label="✕ إغلاق" tone="secondary" size="sm" onPress={() => setSelectedTaxonomyNode(null)} />
                             </Box>

                             {/* Visual Preview Card */}
                             <Surface tone="raised" padding={4} style={{ borderRadius: '12px', borderWidth: 1, borderStyle: 'solid', borderColor: theme.lineStrong, backgroundColor: theme.surface, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} align="center" gap={2}>
                                {nodeMediaKey || nodeImageUri ? (
                                  <WatermarkedImage src={nodeImageUri} mediaKey={nodeMediaKey} fallback={nodeEmoji || '📦'} size={64} productName={nodeLabel} />
                                ) : (
                                  <div style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: theme.brandSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                     <span style={{ fontSize: '36px' }}>{nodeEmoji || '📦'}</span>
                                  </div>
                                )}
                                <Text role="bodyStrong" style={{ fontSize: 14, marginTop: 6, color: theme.brandHeaderBackground }}>{nodeLabel}</Text>
                                {nodeSubtitle ? <Text role="caption" tone="muted" style={{ fontSize: 11, textAlign: 'center', marginTop: 2 }}>{nodeSubtitle}</Text> : null}
                             </Surface>

                             {/* Editing Fields */}
                             <Box gap={3}>
                                <Box gap={1}>
                                   <Text role="caption" tone="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'right' }}>اسم العنصر *</Text>
                                   <input
                                     type="text"
                                     value={nodeLabel}
                                     onChange={e => {
                                       updateNodeField({ label: e.target.value });
                                     }}
                                     style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
                                   />
                                </Box>

                                {(selectedTaxonomyNode.type === 'main' || selectedTaxonomyNode.type === 'sub') && (
                                  <Box gap={1}>
                                     <Text role="caption" tone="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'right' }}>الوصف أو الترجمة الفرعية</Text>
                                     <input
                                       type="text"
                                       value={nodeSubtitle}
                                       onChange={e => {
                                         updateNodeField({ subtitle: e.target.value });
                                       }}
                                       style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
                                     />
                                  </Box>
                                )}

                               {/* Image & Icon Section */}
                               <Box gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 12, marginTop: 4 }}>
                                  <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground, textAlign: 'right', fontSize: 11 }}>إدارة وصورة الفئة (Category Image & Icon)</Text>

                                  <Box layoutDirection="row" gap={2}>
                                     <Box style={{ flex: 1 }} gap={1}>
                                        <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>أيقونة تعبيرية (Emoji)</Text>
                                        <input
                                          type="text"
                                          value={nodeEmoji}
                                          placeholder="أدخل الرمز التعبيري هنا..."
                                          onChange={e => {
                                            updateNodeField({ emojiFallback: e.target.value });
                                          }}
                                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                                        />
                                     </Box>

                                     <Box style={{ flex: 1 }} gap={1}>
                                        <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>قالب جاهز (Template)</Text>
                                        <select
                                          value={nodeMediaKey}
                                          onChange={e => {
                                            const key = e.target.value;
                                            const uri = getActualPublicMediaPath(key);
                                            updateNodeField({ mediaKey: key, imageUri: uri });
                                          }}
                                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                                        >
                                           <option value="">اختر قالب جاهز...</option>
                                           <option value="dsh.product.apple.v1">🍎 تفاح</option>
                                           <option value="dsh.product.milk.v1">🥛 حليب</option>
                                           <option value="dsh.product.bread.v1">🍞 خبز</option>
                                           <option value="dsh.product.chicken.v1">🍗 دجاج</option>
                                           <option value="dsh.product.pasta.v1">🍝 باستا</option>
                                           <option value="dsh.product.choco.v1">🍰 كيكة</option>
                                           <option value="dsh.product.lead-5.dates-box.v1">🌴 تمر فاخر</option>
                                        </select>
                                     </Box>
                                  </Box>

                                  <Box gap={1}>
                                     <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>أو رابط صورة مخصص (URL / Local Path)</Text>
                                     <input
                                       type="text"
                                       value={nodeImageUri && !nodeImageUri.startsWith('data:') ? nodeImageUri : ''}
                                       placeholder="أدخل مسار الصورة أو الرابط المباشر..."
                                       onChange={e => {
                                         updateNodeField({ mediaKey: '', imageUri: e.target.value });
                                       }}
                                       style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'ltr', textAlign: 'left', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                                     />
                                  </Box>

                                  <Box gap={1}>
                                     <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>أو تحميل ملف صورة مباشرة (Upload Image)</Text>
                                     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                       <label style={{
                                         flex: 1,
                                         display: 'flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         gap: '6px',
                                         padding: '8px 12px',
                                         borderRadius: '6px',
                                         border: '1px dashed ' + theme.brand,
                                         backgroundColor: theme.brandSurface,
                                         color: theme.brand,
                                         cursor: 'pointer',
                                         fontSize: '11px',
                                         fontWeight: 'bold',
                                         transition: 'all 0.15s ease',
                                       }}>
                                         📁 اختر صورة من جهازك
                                         <input
                                           type="file"
                                           accept="image/*"
                                           style={{ display: 'none' }}
                                           onChange={e => {
                                             const file = e.target.files?.[0];
                                             if (file) {
                                               const reader = new FileReader();
                                               reader.onload = (event) => {
                                                 const result = event.target?.result;
                                                 if (typeof result === 'string') {
                                                   updateNodeField({ mediaKey: '', imageUri: result });
                                                 }
                                               };
                                               reader.readAsDataURL(file);
                                             }
                                           }}
                                         />
                                       </label>

                                       {(nodeImageUri || nodeMediaKey) && (
                                         <button
                                           onClick={() => updateNodeField({ mediaKey: '', imageUri: '' })}
                                           style={{
                                             padding: '8px 12px',
                                             borderRadius: '6px',
                                             border: '1px solid ' + theme.danger,
                                             backgroundColor: 'transparent',
                                             color: theme.danger,
                                             fontSize: '11px',
                                             fontWeight: 'bold',
                                             cursor: 'pointer',
                                           }}
                                         >
                                           🗑️ إزالة الصورة
                                         </button>
                                       )}
                                     </div>
                                  </Box>
                               </Box>
                           </Box>

                           {/* Products Linked Table Preview */}
                           <Box gap={1} style={{ flex: 1, minHeight: 0, marginTop: 12 }}>
                              <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground, textAlign: 'right', fontSize: 11 }}>المنتجات المرتبطة ({bindedProducts.length} )</Text>
                              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid ' + theme.line, borderRadius: '6px', backgroundColor: theme.surface }}>
                                 {bindedProducts.length === 0 ? (
                                   <Box align="center" justify="center" style={{ padding: 24 }}>
                                      <Text role="caption" tone="muted" style={{ fontSize: 11 }}>لا توجد منتجات مرتبطة بهذا المستوى.</Text>
                                   </Box>
                                 ) : (
                                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <tbody>
                                         {bindedProducts.map(p => (
                                           <tr key={p.id} style={{ borderBottom: '1px solid ' + theme.line }}>
                                              <td style={{ padding: '8px' }}>
                                                 <WatermarkedImage src={p.imageUri} mediaKey={p.mediaKey} fallback={p.emojiFallback} size={28} productName={p.name} />
                                              </td>
                                              <td style={{ padding: '8px', textAlign: 'right' }}>
                                                 <Text role="caption" style={{ fontWeight: 700, fontSize: 11, color: theme.brandHeaderBackground }}>{p.name}</Text>
                                              </td>
                                              <td style={{ padding: '8px', textAlign: 'left' }}>
                                                 <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{p.sku}</Text>
                                              </td>
                                           </tr>
                                         ))}
                                      </tbody>
                                   </table>
                                 )}
                              </div>
                           </Box>
                        </Box>
                      );
                    })() : (
                      <Box align="center" justify="center" style={{ flex: 1, opacity: 0.6 }} gap={2}>
                         <span style={{ fontSize: '56px' }}>📂</span>
                         <Text role="bodyStrong" style={{ textAlign: 'center', fontSize: 14, color: theme.brandHeaderBackground }}>يرجى تحديد عنصر لبدء المراجعة</Text>
                         <Text role="caption" tone="muted" style={{ textAlign: 'center', fontSize: 11, maxWidth: 280, lineHeight: 1.4 }}>اضغط على أي فئة رئيسية، فئة فرعية، تصنيف رئيسي أو تصنيف فرعي لمعاينة تفاصيله، تعديل بياناته، أو تغيير صورته وأيقونته فوراً.</Text>
                      </Box>
                    )}
                 </div>
              </div>
            )}

          </div>
        </div>
      </main>
      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <Surface tone="raised" padding={4} gap={3} style={{ width: 420, maxWidth: '90%', maxHeight: '90%', overflowY: 'auto' }}>
            <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 8 }}>
              <Text role="bodyStrong" style={{ fontSize: 16 }}>{modalMode === 'add' ? 'إضافة منتج جديد' : 'تعديل منتج الكتالوج'}</Text>
              <Button label="✕" accessibilityLabel="إغلاق" tone="secondary" size="sm" onPress={() => setShowProductModal(false)} />
            </Box>

            <Box gap={2}>
              <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>اسم المنتج *</Text>
              <input
                type="text"
                value={modalForm.name}
                onChange={e => setModalForm(prev => ({ ...prev, name: e.target.value }))}
                style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
              />

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>المعرف (SKU) *</Text>
                  <input
                    type="text"
                    value={modalForm.sku}
                    onChange={e => setModalForm(prev => ({ ...prev, sku: e.target.value }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  />
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>الباركود (GTIN)</Text>
                  <input
                    type="text"
                    value={modalForm.gtin}
                    onChange={e => setModalForm(prev => ({ ...prev, gtin: e.target.value }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  />
                </Box>
              </Box>

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>السعر *</Text>
                  <input
                    type="number"
                    value={modalForm.price}
                    onChange={e => setModalForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  />
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>مفتاح الصورة (Media Key)</Text>
                  <select
                    value={modalForm.mediaKey}
                    onChange={e => {
                      const key = e.target.value;
                      const uri = getActualPublicMediaPath(key);
                      setModalForm(prev => ({ ...prev, mediaKey: key, imageUri: uri }));
                    }}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="">بدون (أيقونة تعبيرية)</option>
                    <option value="dsh.product.apple.v1">🍎 تفاح</option>
                    <option value="dsh.product.milk.v1">🥛 حليب</option>
                    <option value="dsh.product.bread.v1">🍞 خبز</option>
                    <option value="dsh.product.chicken.v1">🍗 دجاج</option>
                    <option value="dsh.product.pasta.v1">🍝 باستا</option>
                    <option value="dsh.product.choco.v1">🍰 كيكة</option>
                    <option value="dsh.product.roll.v1">🌴 تمر (مؤقت)</option>
                    <option value="dsh.product.lead-5.dates-box.v1">🌴 علبة التمر الفاخرة</option>
                  </select>
                </Box>
              </Box>

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>الفئة الرئيسية *</Text>
                  <select
                    value={modalForm.mainCat}
                    onChange={e => setModalForm(prev => ({ ...prev, mainCat: e.target.value, subCat: '', mainClassif: '', subClassif: '' }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    {previewCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>الفئة الفرعية</Text>
                  <select
                    value={modalForm.subCat}
                    onChange={e => setModalForm(prev => ({ ...prev, subCat: e.target.value, mainClassif: '', subClassif: '' }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="">لا يوجد (عام)</option>
                    {(previewCategories.find(c => c.id === modalForm.mainCat)?.subcategories || []).map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </Box>
              </Box>

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>التصنيف الرئيسي</Text>
                  <select
                    value={modalForm.mainClassif}
                    onChange={e => setModalForm(prev => ({ ...prev, mainClassif: e.target.value, subClassif: '' }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="">لا يوجد (عام)</option>
                    {(() => {
                      const mCat = previewCategories.find(c => c.id === modalForm.mainCat);
                      const sCat = mCat?.subcategories.find(s => s.id === modalForm.subCat);
                      return (sCat?.mainClassifications || []).map(mc => (
                        <option key={mc.id} value={mc.id}>{mc.label}</option>
                      ));
                    })()}
                  </select>
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>التصنيف الفرعي</Text>
                  <select
                    value={modalForm.subClassif}
                    onChange={e => setModalForm(prev => ({ ...prev, subClassif: e.target.value }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="">لا يوجد (عام)</option>
                    {(() => {
                      const mCat = previewCategories.find(c => c.id === modalForm.mainCat);
                      const sCat = mCat?.subcategories.find(s => s.id === modalForm.subCat);
                      const mClassif = sCat?.mainClassifications?.find(mc => mc.id === modalForm.mainClassif);
                      return (mClassif?.subClassifications || []).map(sc => (
                        <option key={sc.id} value={sc.id}>{sc.label}</option>
                      ));
                    })()}
                  </select>
                </Box>
              </Box>

              <Box layoutDirection="row" gap={2}>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>السياسة *</Text>
                  <select
                    value={modalForm.mediaPolicy}
                    onChange={e => setModalForm(prev => ({
                      ...prev,
                      mediaPolicy: toCatalogMediaPolicy(e.target.value, prev.mediaPolicy),
                    }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="catalog-owned-media">مركزي</option>
                    <option value="partner-owned-exception">استثناء شريك</option>
                    <option value="partner-proposed-review">مقترح مراجعة</option>
                    <option value="marketing-enhancement-required">تسويق مطلوب</option>
                  </select>
                </Box>
                <Box style={{ flex: 1 }} gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>حالة الاعتماد *</Text>
                  <select
                    value={modalForm.approvalStage}
                    onChange={e => setModalForm(prev => ({
                      ...prev,
                      approvalStage: toCatalogApprovalStage(e.target.value, prev.approvalStage),
                    }))}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                  >
                    <option value="catalog-draft">مسودة</option>
                    <option value="marketing-review">مراجعة تسويق</option>
                    <option value="partner-review">مراجعة جودة</option>
                    <option value="catalog-adopted">معتمد وجاهز</option>
                    <option value="client-visible">نشط ومرئي</option>
                  </select>
                </Box>
              </Box>
            </Box>

            <Box layoutDirection="row" justify="space-between" style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 12, marginTop: 12 }}>
              <Button
                label={modalMode === 'add' ? 'إضافة المنتج' : 'حفظ التعديلات'}
                tone="brand"
                onPress={() => {
                  if (!modalForm.name || !modalForm.sku) {
                    setActionMessage('الاسم والمعرف مطلوبان');
                    return;
                  }
                  if (modalMode === 'add') {
                    pushPreviewProposal(createCatalogPreviewProposal({
                      type: 'create-product',
                      label: 'تم تسجيل مقترح إضافة منتج',
                      note: `اسم المنتج: ${modalForm.name} | sku: ${modalForm.sku} | categoryPath: ${modalForm.mainCat}/${modalForm.subCat || 'عام'} | mediaKey: ${modalForm.mediaKey || 'غير محدد'}`,
                      apiBoundary: 'POST /catalog/products',
                    }));
                    setActionMessage('تم تسجيل مقترح إضافة المنتج كمعاينة');
                  } else {
                    const product = products.find((p) => p.id === modalForm.id);
                    if (product) {
                      queueProductPreviewPatch(product, {
                      name: modalForm.name,
                      sku: modalForm.sku,
                      gtin: modalForm.gtin || undefined,
                      price: modalForm.price,
                      categoryPath: {
                        main: modalForm.mainCat,
                        sub: modalForm.subCat || undefined,
                        mainClassification: modalForm.mainClassif || undefined,
                        subClassification: modalForm.subClassif || undefined,
                      },
                      mediaPolicy: modalForm.mediaPolicy,
                      approvalStage: modalForm.approvalStage,
                      imageUri: modalForm.imageUri || undefined,
                      mediaKey: modalForm.mediaKey || undefined,
                      }, 'تم تسجيل مقترح تعديل بيانات المنتج', 'تعديل بيانات المنتج كمعاينة فقط.');
                    }
                  }
                  setShowProductModal(false);
                }}
              />
              <Button label="إلغاء" tone="secondary" onPress={() => setShowProductModal(false)} />
            </Box>
          </Surface>
        </div>
      )}

      {/* ─── Workspace Overlay Layer — CatalogWorkspaceRouter (UI_PREVIEW_ONLY) ─────
          Extracted from monolith. All workspace rendering delegated to router.
          router-ready: CatalogWorkspaceState maps to future URL query params.
          Owner: control-panel/catalogs. No backend/API. ─────────────────────── */}
      <CatalogWorkspaceRouter
        workspaceState={workspaceState}
        products={products}
        selectedProductIds={selectedProductIds}
        onClose={() => setWorkspaceState(null)}
        onProposal={(proposal) => {
          pushPreviewProposal(proposal);
          setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
        }}
      />

      {/* ─── Pending Proposals Banner ────────────────────────────────────────────
          Displays the last submitted preview proposal. No canonical data change.
          All proposals require API binding before taking effect. ────────────── */}
      {pendingProposals.length > 0 && pendingProposals[0] && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 300,
            maxWidth: 560,
            width: '90%',
          }}
        >
          <Surface
            tone="raised"
            padding={3}
            gap={2}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              borderWidth: 2,
              borderColor: pendingProposals[0].status === 'ready-for-api' ? theme.success : theme.warning,
              borderStyle: 'solid',
            }}
          >
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="caption" style={{ fontWeight: '800', fontSize: 13 }}>
                📋 {pendingProposals[0].label}
              </Text>
              <Button
                label="✕"
                tone="secondary"
                size="sm"
                onPress={() => setPendingProposals((p) => p.slice(1))}
                style={{ minWidth: 0, padding: 0, backgroundColor: 'transparent', borderWidth: 0 }}
              />
            </Box>
            <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
              {pendingProposals[0].note}
            </Text>
            <Text role="caption" style={{ fontSize: 10, fontWeight: '600', direction: 'ltr', unicodeBidi: 'embed' }}>
              status: {pendingProposals[0].status} | owner: {pendingProposals[0].owner}
              {pendingProposals[0].apiBoundary ? ` | API: ${pendingProposals[0].apiBoundary}` : ''}
            </Text>
          </Surface>
        </div>
      )}
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
