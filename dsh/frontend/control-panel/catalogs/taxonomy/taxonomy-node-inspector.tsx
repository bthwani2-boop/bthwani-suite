'use client';

import React from 'react';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import type { CatalogMainCategory, CatalogProductMaster } from '../catalogs.data';
import type { CatalogTaxonomyNodeRef } from '../catalogs.model';
import { WatermarkedImage } from '../catalogs.parts';
import { getActualPublicMediaPath } from '../../../shared/resolve-dsh-public-media-path';

type TaxonomyNodeInspectorProps = {
  previewCategories: CatalogMainCategory[];
  setPreviewCategories: React.Dispatch<React.SetStateAction<CatalogMainCategory[]>>;
  selectedTaxonomyNode: CatalogTaxonomyNodeRef | null;
  setSelectedTaxonomyNode: (node: CatalogTaxonomyNodeRef | null) => void;
  products: readonly CatalogProductMaster[];
};

export function TaxonomyNodeInspector({
  previewCategories, setPreviewCategories,
  selectedTaxonomyNode, setSelectedTaxonomyNode,
  products,
}: TaxonomyNodeInspectorProps) {
  const { theme } = useTheme();

  if (!selectedTaxonomyNode) {
    return (
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', backgroundColor: theme.surfaceInset, borderRight: `1px solid ${theme.line}`, overflowY: 'auto', padding: '20px' }}>
        <Box align="center" justify="center" style={{ flex: 1, opacity: 0.6 }} gap={2}>
          <span style={{ fontSize: '56px' }}>📂</span>
          <Text role="bodyStrong" style={{ textAlign: 'center', fontSize: 14, color: theme.brandHeaderBackground }}>يرجى تحديد عنصر لبدء المراجعة</Text>
          <Text role="caption" tone="muted" style={{ textAlign: 'center', fontSize: 11, maxWidth: 280, lineHeight: 1.4 }}>اضغط على أي فئة رئيسية، فئة فرعية، تصنيف رئيسي أو تصنيف فرعي لمعاينة تفاصيله، تعديل بياناته، أو تغيير صورته وأيقونته فوراً.</Text>
        </Box>
      </div>
    );
  }

  const mainCat = previewCategories.find(c => c.id === selectedTaxonomyNode.mainId);
  const subCat = mainCat?.subcategories.find(s => s.id === selectedTaxonomyNode.subId);
  const mainClassif = subCat?.mainClassifications?.find(mc => mc.id === selectedTaxonomyNode.mainClassifId);
  const subClassif = mainClassif?.subClassifications?.find(sc => sc.id === selectedTaxonomyNode.subClassifId);

  const updateNodeField = (fields: Partial<{ label: string; emojiFallback: string; imageUri: string; mediaKey: string; subtitle: string }>) => {
    setPreviewCategories(prev =>
      prev.map(c => {
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
                        }),
                      };
                    }
                    return mc;
                  }),
                };
              }
              return s;
            }),
          };
        }
        return c;
      })
    );
  };

  let nodeLabel = '';
  let nodeSubtitle = '';
  let nodeEmoji = '';
  let nodeImageUri = '';
  let nodeMediaKey = '';
  let nodeTypeLabel = '';

  if (selectedTaxonomyNode.type === 'main' && mainCat) {
    nodeLabel = mainCat.label; nodeSubtitle = mainCat.subtitle;
    nodeEmoji = mainCat.emojiFallback || ''; nodeImageUri = mainCat.imageUri || ''; nodeMediaKey = mainCat.mediaKey || '';
    nodeTypeLabel = 'فئة رئيسية';
  } else if (selectedTaxonomyNode.type === 'sub' && subCat) {
    nodeLabel = subCat.label; nodeSubtitle = subCat.subtitle;
    nodeEmoji = subCat.emojiFallback || ''; nodeImageUri = subCat.imageUri || ''; nodeMediaKey = subCat.mediaKey || '';
    nodeTypeLabel = 'فئة فرعية';
  } else if (selectedTaxonomyNode.type === 'mainClassif' && mainClassif) {
    nodeLabel = mainClassif.label; nodeEmoji = mainClassif.emojiFallback || '';
    nodeImageUri = mainClassif.imageUri || ''; nodeMediaKey = mainClassif.mediaKey || '';
    nodeTypeLabel = 'تصنيف رئيسي';
  } else if (selectedTaxonomyNode.type === 'subClassif' && subClassif) {
    nodeLabel = subClassif.label; nodeEmoji = subClassif.emojiFallback || '';
    nodeImageUri = subClassif.imageUri || ''; nodeMediaKey = subClassif.mediaKey || '';
    nodeTypeLabel = 'تصنيف فرعي';
  } else {
    return (
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', backgroundColor: theme.surfaceInset, borderRight: `1px solid ${theme.line}`, overflowY: 'auto', padding: '20px' }}>
        <Box align="center" justify="center" style={{ flex: 1 }}>
          <Text role="caption" tone="muted">العنصر المختار لم يعد موجوداً في الشجرة.</Text>
        </Box>
      </div>
    );
  }

  const bindedProducts = (products as CatalogProductMaster[]).filter(p => {
    if (selectedTaxonomyNode.type === 'main') return p.categoryPath.main === selectedTaxonomyNode.mainId;
    if (selectedTaxonomyNode.type === 'sub') return p.categoryPath.main === selectedTaxonomyNode.mainId && p.categoryPath.sub === selectedTaxonomyNode.subId;
    if (selectedTaxonomyNode.type === 'mainClassif') return p.categoryPath.mainClassification === selectedTaxonomyNode.mainClassifId;
    return p.categoryPath.subClassification === selectedTaxonomyNode.subClassifId;
  });

  return (
    <div style={{ width: 300, display: 'flex', flexDirection: 'column', backgroundColor: theme.surfaceInset, borderRight: `1px solid ${theme.line}`, overflowY: 'auto', padding: '20px' }}>
      <Box gap={4} style={{ flex: 1 }}>
        <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 10 }}>
          <Box gap={1}>
            <Text role="bodyStrong" style={{ fontSize: 14, color: theme.brandHeaderBackground }}>مراجعة وتعديل: {nodeTypeLabel}</Text>
            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>معرف النظام: {selectedTaxonomyNode.subClassifId || selectedTaxonomyNode.mainClassifId || selectedTaxonomyNode.subId || selectedTaxonomyNode.mainId}</Text>
          </Box>
          <Button label="✕ إغلاق" tone="secondary" size="sm" onPress={() => setSelectedTaxonomyNode(null)} />
        </Box>

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

        <Box gap={3}>
          <Box gap={1}>
            <Text role="caption" tone="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'right' }}>اسم العنصر *</Text>
            <input
              type="text"
              value={nodeLabel}
              onChange={e => updateNodeField({ label: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
            />
          </Box>

          {(selectedTaxonomyNode.type === 'main' || selectedTaxonomyNode.type === 'sub') && (
            <Box gap={1}>
              <Text role="caption" tone="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'right' }}>الوصف أو الترجمة الفرعية</Text>
              <input
                type="text"
                value={nodeSubtitle}
                onChange={e => updateNodeField({ subtitle: e.target.value })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
              />
            </Box>
          )}

          <Box gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 12, marginTop: 4 }}>
            <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground, textAlign: 'right', fontSize: 11 }}>إدارة وصورة الفئة (Category Image & Icon)</Text>

            <Box layoutDirection="row" gap={2}>
              <Box style={{ flex: 1 }} gap={1}>
                <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>أيقونة تعبيرية (Emoji)</Text>
                <input
                  type="text"
                  value={nodeEmoji}
                  placeholder="أدخل الرمز التعبيري هنا..."
                  onChange={e => updateNodeField({ emojiFallback: e.target.value })}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                />
              </Box>
              <Box style={{ flex: 1 }} gap={1}>
                <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>مفتاح الصورة</Text>
                <select
                  value={nodeMediaKey}
                  onChange={e => {
                    const key = e.target.value;
                    const uri = getActualPublicMediaPath(key);
                    updateNodeField({ mediaKey: key, imageUri: uri });
                  }}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                >
                  <option value="">بدون صورة</option>
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

            <Box gap={1}>
              <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>رابط صورة مباشر (URL)</Text>
              <input
                type="text"
                value={nodeImageUri}
                placeholder="أدخل رابط الصورة"
                onChange={e => updateNodeField({ mediaKey: '', imageUri: e.target.value })}
                style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
              />
            </Box>

            {(nodeImageUri || nodeMediaKey) && (
              <button
                onClick={() => updateNodeField({ mediaKey: '', imageUri: '' })}
                style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, fontSize: '10px', cursor: 'pointer', textAlign: 'right', padding: 0 }}
              >
                ✕ إزالة الصورة
              </button>
            )}
          </Box>

          {bindedProducts.length > 0 && (
            <Box gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 12 }}>
              <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground, fontSize: 11 }}>المنتجات المرتبطة ({bindedProducts.length})</Text>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: theme.surfaceInset }}>
                    <th style={{ padding: '4px 6px', textAlign: 'right', color: theme.textMuted }}>المنتج</th>
                    <th style={{ padding: '4px 6px', textAlign: 'right', color: theme.textMuted }}>المعرف</th>
                  </tr>
                </thead>
                <tbody>
                  {bindedProducts.slice(0, 10).map(p => (
                    <tr key={p.id} style={{ borderTop: `1px solid ${theme.line}` }}>
                      <td style={{ padding: '4px 6px', color: theme.brandHeaderBackground }}>{p.name}</td>
                      <td style={{ padding: '4px 6px', color: theme.textMuted, fontFamily: 'monospace' }}>
                        <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{p.sku}</Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}
