'use client';

import React from 'react';
import { Button, Text, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import { WatermarkedImage, WorkspaceIntroBanner, PolicyBadge } from '../catalogs.parts';
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
      <div style={{ width: '100%' }}>
        <WorkspaceIntroBanner
          bannerTitle={title}
          description={description}
          whyItMatters={whyItMatters}
          affectedSurfaces={affectedSurfaces}
          nextActionLabel={nextActionLabel}
          extraActions={
            <>
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
            </>
          }
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <Text role="bodyStrong" style={{ fontSize: 13, color: theme.brandHeaderBackground }}>العناصر والنتائج الحالية في هذا المسار ({filteredProducts.length})</Text>
        {filteredProducts.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', backgroundColor: theme.surfaceInset, borderRadius: '8px', border: `1px dashed ${theme.line}` }}>
            <Text role="caption" tone="muted">✓ كل شيء سليم! لا توجد منتجات متعارضة أو مفقودة حالياً.</Text>
          </div>
        ) : (
          <div style={{ backgroundColor: theme.surface, borderRadius: '12px', borderWidth: 1, borderColor: theme.lineStrong, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}` }}>
                  <th style={{ width: '48px', padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right' }}>صورة</th>
                  <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '25%' }}>المنتج</th>
                  <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '15%' }}>الفئة</th>
                  <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '15%' }}>التصنيف</th>
                  <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '15%' }}>المعرف / الباركود</th>
                  <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '10%' }}>السعر</th>
                  <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '10%' }}>السياسة</th>
                  <th style={{ padding: '10px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width: '10%' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const cat = previewCategories.find(c => c.id === p.categoryPath.main) ?? dshCatalogCategories.find(c => c.id === p.categoryPath.main);
                  const sub = cat?.subcategories.find(s => s.id === p.categoryPath.sub);
                  const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);

                  let statusLabel = 'مكتمل';
                  let statusTone: 'success' | 'warning' | 'danger' | 'info' = 'success';

                  if (activeSubTab === 'categories') {
                    statusLabel = p.categoryPath.main ? 'مرتبط' : 'غير مرتبط';
                    statusTone = p.categoryPath.main ? 'success' : 'danger';
                  } else if (activeSubTab === 'duplicates') {
                    statusLabel = 'تعارض نشط';
                    statusTone = 'danger';
                  } else if (activeSubTab === 'media') {
                    statusLabel = p.mediaKey ? 'معتمد' : 'بدون صورة';
                    statusTone = p.mediaKey ? 'success' : 'warning';
                  } else if (activeSubTab === 'gtin') {
                    statusLabel = p.gtin ? `GTIN` : 'مفقود';
                    statusTone = p.gtin ? 'success' : 'danger';
                  } else if (activeSubTab === 'substitutions') {
                    statusLabel = p.categoryPath.main === 'restaurants' ? 'بدائل' : 'افتراضي';
                    statusTone = p.categoryPath.main === 'restaurants' ? 'success' : 'info';
                  } else if (activeSubTab === 'visibility-policy') {
                    statusLabel = p.surfaces.includes('client') ? 'مرئي للعميل' : 'داخلي';
                    statusTone = p.surfaces.includes('client') ? 'success' : 'warning';
                  }

                  const isSelected = selectedProductId === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProductId(p.id)}
                      style={{
                        borderBottom: `1px solid ${theme.line}`,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? theme.brandSurface : 'transparent',
                        transition: 'background-color 0.12s ease'
                      }}
                    >
                      <td style={{ padding: '10px 12px' }}>
                        <WatermarkedImage src={p.imageUri} mediaKey={p.mediaKey} fallback={p.emojiFallback} size={32} productName={p.name} />
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Text role="caption" weight="black" style={{ color: theme.brandHeaderBackground }}>{p.name}</Text>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{cat?.label || 'غير محدد'}</Text>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{classif?.label || 'عام'}</Text>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Text role="caption" tone="muted" family="mono" style={{ fontSize: 10 }}>{p.sku}</Text>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Text role="caption" weight="bold" style={{ color: theme.brandHeaderBackground }}>{p.price}</Text>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <PolicyBadge mediaPolicy={p.mediaPolicy} />
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <WebControlPanelStatusTag label={statusLabel} tone={statusTone} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
