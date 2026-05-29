'use client';

import React from 'react';
import { Button, Text, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import { WatermarkedImage } from '../catalogs.parts';
import { dshCatalogCategories } from '../catalogs.data';
import type { CatalogProductMaster, CatalogMainCategory } from '../catalogs.data';
import type { CatalogWorkspaceId } from '../catalogs.model';

export type MappingWorkspaceViewProps = {
  activeSubTab: string;
  filteredProducts: CatalogProductMaster[];
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  openWorkspace: (ws: CatalogWorkspaceId, productId?: string) => void;
  previewCategories: CatalogMainCategory[];
};

export function MappingWorkspaceView({
  activeSubTab,
  filteredProducts,
  selectedProductId,
  setSelectedProductId,
  openWorkspace,
  previewCategories,
}: MappingWorkspaceViewProps) {
  const { theme } = useTheme();

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
          <span style={{ fontSize: '9px', color: theme.success, fontWeight: '700', backgroundColor: theme.brandSurface, padding: '2px 8px', borderRadius: '4px' }}>
            معاينة محلية فقط
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${theme.line}`, paddingTop: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: theme.brandHeaderBackground }}>💡 الأهمية والهدف:</span>
          <Text role="caption" style={{ fontSize: 10, color: theme.textMuted }}>{whyItMatters}</Text>
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
          {activeSubTab === 'duplicates' && (
            <Button
              label="▸ فتح workspace حل التكرارات"
              tone="brand"
              size="sm"
              onPress={() => openWorkspace('duplicate-resolution')}
            />
          )}
          {activeSubTab === 'gtin' && (
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
                if (firstProduct) openWorkspace('visibility-policy', firstProduct.id);
              }}
              disabled={filteredProducts.length === 0}
              accessibilityHint="اختر منتجاً لفتح workspace الظهور"
            />
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Text role="bodyStrong" style={{ fontSize: 13, color: theme.brandHeaderBackground }}>العناصر والنتائج الحالية في هذا المسار ({filteredProducts.length})</Text>
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
                      <Text role="bodyStrong" style={{ fontSize: 12, color: theme.brandHeaderBackground }}>{p.name}</Text>
                      <span style={{ fontSize: '10px', color: theme.textMuted }}>{detailText}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <WebControlPanelStatusTag label={statusLabel} tone={statusTone} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
