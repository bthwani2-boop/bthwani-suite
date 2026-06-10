'use client';

/**
 * CatalogTaxonomyGovernanceWorkspace — UI_PREVIEW_ONLY
 * Owner: control-panel/catalogs
 * API boundary: PATCH /catalog/categories (not yet bound)
 *
 * Extracted from ControlPanelDshCatalogScreen monolith.
 * Handles category/classification governance independently.
 *
 * Constraints:
 * - No direct Tamagui import. All UI via @bthwani/ui-kit.
 * - No dsh/frontend/data mutation.
 * - No canonical category create/edit — proposals only.
 * - No Date.now() / Math.random() category ID generation.
 * - All actions produce CatalogPreviewProposal.
 */

import React, { useState } from 'react';
import { Box, Button, Surface, Text, useTheme,
  radius,
} from '@bthwani/ui-kit';
import type { CatalogPreviewProposal } from '../catalogs.model';
import { type ActionResult, WorkspacePreviewNotice, WorkspaceSuccessBanner } from '../catalogs.parts';
import { dshCatalogCategories } from '../catalogs.data';

export type CatalogTaxonomyGovernanceWorkspaceProps = {
  onClose: () => void;
  onProposal: (proposal: CatalogPreviewProposal) => void;
};

type TaxonomyAction =
  | 'approve-mapping'
  | 'request-edit'
  | 'mark-duplicate'
  | 'send-marketing';

type TaxonomyActionResult = {
  action: TaxonomyAction;
  categoryId: string;
  categoryLabel: string;
  note: string;
};

export function CatalogTaxonomyGovernanceWorkspace({
  onClose,
  onProposal,
}: CatalogTaxonomyGovernanceWorkspaceProps) {
  const { theme } = useTheme();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<TaxonomyActionResult | null>(null);

  const selectedCat = dshCatalogCategories.find((c) => c.id === selectedCatId);
  const selectedSub = selectedCat?.subcategories.find((s) => s.id === selectedSubId);

  function handleAction(action: TaxonomyAction) {
    const catLabel = selectedSub ? `${selectedCat?.label} > ${selectedSub.label}` : selectedCat?.label ?? '—';
    const id = selectedSubId ?? selectedCatId ?? 'unknown';

    let label = '';
    let note = '';
    let status: CatalogPreviewProposal['status'] = 'ready-for-api';

    if (action === 'approve-mapping') {
      label = `اعتماد تصنيف: ${catLabel}`;
      note = 'تم اعتماد الربط التصنيفي. API boundary: PATCH /catalog/categories/:id/approve';
    } else if (action === 'request-edit') {
      label = `طلب تعديل: ${catLabel}`;
      note = 'تم إرسال طلب تعديل الفئة. يحتاج مراجعة من فريق الكتالوج.';
      status = 'draft';
    } else if (action === 'mark-duplicate') {
      label = `تصنيف كتكرار: ${catLabel}`;
      note = 'تم تصنيف هذه الفئة كتكرار محتمل. API boundary: POST /catalog/categories/duplicates';
    } else if (action === 'send-marketing') {
      label = `إحالة للتسويق: ${catLabel}`;
      note = 'محتوى الفئة يحتاج مراجعة صورة/نص. يُحال إلى control-panel/marketing. API boundary: POST /catalog/marketing-review';
      status = 'ready-for-api';
    }

    const result: TaxonomyActionResult = { action, categoryId: id, categoryLabel: catLabel, note };
    setActionResult(result);

    onProposal({
      id: `taxonomy-${action}-${id}-${Date.now()}`, // draft proposal ID only
      type: 'taxonomy-mapping',
      label,
      status,
      owner: 'control-panel-catalogs',
      note,
      apiBoundary: action === 'send-marketing' ? 'POST /catalog/marketing-review' : 'PATCH /catalog/categories',
    });
  }

  return (
    <Surface
      tone="raised"
      padding={5}
      gap={4}
      style={{
        position: 'relative',
        zIndex: 1,
        width: 520,
        maxWidth: '100%',
        height: '100%',
        overflow: 'scroll',
        borderRadius: 0,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.18)',
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <Box layoutDirection="row" justify="space-between" align="center">
        <Text role="titleSm" weight="black" style={{ color: theme.brandHeaderBackground }}>
          🗂 حوكمة التصنيف والفئات
        </Text>
        <Button label="✕ إغلاق" tone="secondary" size="sm" onPress={onClose} />
      </Box>

      {/* Notice */}
      <WorkspacePreviewNotice
        bannerTitle="UI_PREVIEW_ONLY — لا إضافة أو تعديل فعلي للفئات"
        subtitle="كل الإجراءات هنا تُنتج طلب مقترح فقط. API boundary: PATCH /catalog/categories"
      />

      {/* Category tree selector */}
      <Box gap={2}>
        <Text role="caption" weight="black" style={{ color: theme.brandHeaderBackground }}>
          اختر الفئة للمراجعة
        </Text>

        <Box gap={1} style={{ maxHeight: 200, overflow: 'scroll' }}>
          {dshCatalogCategories.map((cat) => (
            <Surface
              key={cat.id}
              tone={selectedCatId === cat.id ? 'brand' : 'raised'}
              padding={2}
              style={{
                borderRadius: 8,
                cursor: 'pointer',
                borderWidth: 1,
                borderColor: selectedCatId === cat.id ? theme.brand : theme.line,
                borderStyle: 'solid',
              }}
            >
              <Box
                layoutDirection="row"
                align="center"
                gap={2}
                style={{ cursor: 'pointer' }}
              >
                <button
                  onClick={() => {
                    setSelectedCatId(cat.id === selectedCatId ? null : cat.id);
                    setSelectedSubId(null);
                    setActionResult(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    flex: 1,
                    textAlign: 'right',
                    padding: 0,
                  }}
                >
                  <Text
                    role="caption"
                    weight={selectedCatId === cat.id ? 'black' : 'semibold'}
                    style={{
                      color: selectedCatId === cat.id ? theme.brandHeaderBackground : theme.text,
                    }}
                  >
                    {cat.emojiFallback} {cat.label}
                  </Text>
                  <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                    {cat.subcategories.length} فئة فرعية
                  </Text>
                </button>
              </Box>

              {selectedCatId === cat.id && cat.subcategories.length > 0 && (
                <Box gap={1} style={{ paddingTop: 8, paddingRight: 16 }}>
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubId(sub.id === selectedSubId ? null : sub.id);
                        setActionResult(null);
                      }}
                      style={{
                        background: selectedSubId === sub.id ? theme.surfaceInset : 'transparent',
                        border: `1px solid ${selectedSubId === sub.id ? theme.brand : 'transparent'}`,
                        borderRadius: radius.xs,
                        cursor: 'pointer',
                        padding: '4px 8px',
                        textAlign: 'right',
                        width: '100%',
                      }}
                    >
                      <Text role="caption" style={{ color: theme.text,}}>
                        └ {sub.label}
                      </Text>
                      {sub.mainClassifications && sub.mainClassifications.length > 0 && (
                        <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                          {sub.mainClassifications.length} تصنيف رئيسي
                        </Text>
                      )}
                    </button>
                  ))}
                </Box>
              )}
            </Surface>
          ))}
        </Box>
      </Box>

      {/* Selected category actions */}
      {selectedCatId && (
        <Box gap={3}>
          <Box
            style={{
              padding: 12,
              backgroundColor: theme.surfaceInset,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.brand,
              borderStyle: 'solid',
            }}
          >
            <Text role="caption" weight="black" style={{ color: theme.brandHeaderBackground }}>
              📌 الفئة المختارة
            </Text>
            <Text role="bodyMd" weight="bold" style={{ color: theme.text }}>
              {selectedCat?.emojiFallback} {selectedCat?.label}
              {selectedSub ? ` > ${selectedSub.label}` : ''}
            </Text>
            <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
              {selectedSub?.mainClassifications?.length ?? 0} تصنيف رئيسي •
              حالة الربط: {selectedSub ? 'مربوط' : 'فئة رئيسية — تحتاج ربط فرعي'}
            </Text>
          </Box>

          {/* Missing classification warning */}
          {selectedCat && !selectedSubId && selectedCat.subcategories.length > 0 && (
            <Surface
              tone="inset"
              padding={2}
              style={{ borderRadius: radius.xs, borderWidth: 1, borderColor: theme.warning, borderStyle: 'dashed' }}
            >
              <Text role="caption" weight="semibold" style={{ color: theme.warning, fontSize: 11 }}>
                ⚠️ لم تختر فئة فرعية — يُفضَّل اختيار فئة فرعية لاتخاذ إجراء دقيق
              </Text>
            </Surface>
          )}

          {/* Actions */}
          <Box gap={2}>
            <Text role="caption" weight="black" style={{ color: theme.brandHeaderBackground }}>
              الإجراءات المتاحة
            </Text>

            <Box gap={2}>
              <Button
                label="✅ اعتماد الربط التصنيفي"
                tone="brand"
                size="sm"
                onPress={() => handleAction('approve-mapping')}
              />
              <Button
                label="✏️ طلب تعديل الفئة"
                tone="secondary"
                size="sm"
                onPress={() => handleAction('request-edit')}
              />
              <Button
                label="⚠️ تصنيف كتكرار محتمل"
                tone="secondary"
                size="sm"
                onPress={() => handleAction('mark-duplicate')}
              />
              <Button
                label="📢 إحالة لمراجعة التسويق (صورة/محتوى)"
                tone="secondary"
                size="sm"
                onPress={() => handleAction('send-marketing')}
              />
            </Box>
          </Box>

          {/* Action result */}
          {actionResult && (
            <WorkspaceSuccessBanner
              bannerTitle="✅ تم إرسال الاقتراح"
              subtitle={actionResult.categoryLabel}
              note={actionResult.note}
            />
          )}
        </Box>
      )}

      {!selectedCatId && (
        <Surface tone="inset" padding={4} style={{ borderRadius: 8 }}>
          <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>
            اختر فئة من الشجرة أعلاه لعرض إجراءات الحوكمة
          </Text>
        </Surface>
      )}

      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'center' }}>
        UI_PREVIEW_ONLY • لا تعديل فعلي للفئات • API boundary: PATCH /catalog/categories
      </Text>
    </Surface>
  );
}
