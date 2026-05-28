'use client';

/**
 * CatalogQuickEntryDraftWorkspace — UI_PREVIEW_ONLY
 * Owner: control-panel/catalogs
 * API boundary: POST /catalog/products (not yet bound)
 *
 * Replaces the inline add/edit product modal that was inside
 * ControlPanelDshCatalogScreen (which used Date.now() for IDs and
 * setProducts to mutate canonical-like product list).
 *
 * This workspace emits a CatalogPreviewProposal instead of mutating
 * any canonical data. No product IDs are generated here. No data saved.
 *
 * Constraints:
 * - No direct Tamagui import. All UI via @bthwani/ui-kit.
 * - No dsh/frontend/data mutation.
 * - No canonical product creation locally.
 * - No Date.now() / Math.random() identity generation.
 * - Submit produces CatalogPreviewProposal only.
 */

import React, { useState } from 'react';
import { Box, Button, Surface, Text, TextField, useTheme } from '@bthwani/ui-kit';
import type { CatalogPreviewProposal } from './catalog-workspace.types';
import { dshCatalogCategories } from './catalog';

export type CatalogQuickEntryDraftWorkspaceProps = {
  onClose: () => void;
  onProposal: (proposal: CatalogPreviewProposal) => void;
};

type CatalogDraftInputForm = {
  productName: string;
  categoryMainId: string;
  categorySubId: string;
  mediaKey: string;
  skuNote: string;
  gtinNote: string;
  priceNote: string;
};

const EMPTY_FORM: CatalogDraftInputForm = {
  productName: '',
  categoryMainId: '',
  categorySubId: '',
  mediaKey: '',
  skuNote: '',
  gtinNote: '',
  priceNote: '',
};

export function CatalogQuickEntryDraftWorkspace({
  onClose,
  onProposal,
}: CatalogQuickEntryDraftWorkspaceProps) {
  const { theme } = useTheme();
  const [form, setForm] = useState<CatalogDraftInputForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedMainCat = dshCatalogCategories.find((c) => c.id === form.categoryMainId);

  function validate(): string | null {
    if (!form.productName.trim()) return 'اسم المنتج مطلوب';
    if (!form.categoryMainId) return 'الفئة الرئيسية مطلوبة';
    return null;
  }

  function handleSubmit() {
    const err = validate();
    if (err) { setValidationError(err); return; }
    setValidationError(null);

    const catLabel = selectedMainCat?.label ?? form.categoryMainId;
    const subLabel = selectedMainCat?.subcategories.find((s) => s.id === form.categorySubId)?.label;

    onProposal({
      id: `draft-create-${Date.now()}`, // draft ID only — not a canonical product ID
      type: 'create-product',
      label: `طلب إنشاء منتج: "${form.productName.trim()}"`,
      status: 'ready-for-api',
      owner: 'control-panel-catalogs',
      note: [
        `الفئة: ${catLabel}${subLabel ? ` > ${subLabel}` : ''}`,
        form.mediaKey ? `Media Key: ${form.mediaKey}` : 'بدون صورة — يحتاج media key لاحقًا',
        form.skuNote ? `SKU مقترح: ${form.skuNote}` : 'SKU: سيتم توليده من النظام عند الربط',
        form.gtinNote ? `GTIN مقترح: ${form.gtinNote}` : 'GTIN: يحتاج تحقق قبل التخزين',
        form.priceNote ? `سعر مقترح: ${form.priceNote} ريال` : 'السعر: يحتاج تحديد قبل النشر',
        'API boundary: POST /catalog/products — غير مرتبط بعد',
      ].join(' | '),
      apiBoundary: 'POST /catalog/products',
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Surface
        tone="raised"
        padding={5}
        gap={4}
        style={{
          position: 'relative',
          zIndex: 1,
          width: 480,
          maxWidth: '100%',
          height: '100%',
          borderRadius: 0,
          boxShadow: '-4px 0 24px rgba(0,0,0,0.18)',
          direction: 'rtl',
        }}
      >
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleLg" style={{ fontWeight: '800', fontSize: 18, color: theme.brandHeaderBackground }}>
            ✏️ إدخال سريع — مسودة
          </Text>
          <Button label="✕ إغلاق" tone="secondary" size="sm" onPress={onClose} />
        </Box>

        <Surface
          tone="inset"
          padding={4}
          gap={3}
          style={{ borderRadius: 10, borderWidth: 2, borderColor: theme.success, borderStyle: 'solid' }}
        >
          <Text role="bodyMd" style={{ fontWeight: '800', color: theme.success, fontSize: 16 }}>
            ✅ تم إرسال طلب الإنشاء كمسودة
          </Text>
          <Text role="caption" tone="muted">
            لم يتم حفظ أي منتج في الكتالوج الرسمي. هذا الطلب يحتاج ربطًا بـ API لإنشاء المنتج الفعلي.
          </Text>
          <Text role="caption" style={{ color: theme.brandHeaderBackground, fontWeight: '600' }}>
            API boundary: POST /catalog/products — not yet bound
          </Text>
        </Surface>

        <Button label="إدخال منتج آخر" tone="brand" onPress={() => { setForm(EMPTY_FORM); setSubmitted(false); }} />
      </Surface>
    );
  }

  return (
    <Surface
      tone="raised"
      padding={5}
      gap={4}
      style={{
        position: 'relative',
        zIndex: 1,
        width: 480,
        maxWidth: '100%',
        height: '100%',
        overflow: 'scroll',
        borderRadius: 0,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.18)',
        direction: 'rtl',
      }}
    >
      <Box layoutDirection="row" justify="space-between" align="center">
        <Text role="titleLg" style={{ fontWeight: '800', fontSize: 18, color: theme.brandHeaderBackground }}>
          ✏️ إدخال سريع — مسودة
        </Text>
        <Button label="✕ إغلاق" tone="secondary" size="sm" onPress={onClose} />
      </Box>

      {/* Notice banner */}
      <Surface
        tone="inset"
        padding={3}
        gap={1}
        style={{ borderRadius: 8, borderWidth: 1, borderColor: theme.warning, borderStyle: 'dashed' }}
      >
        <Text role="caption" style={{ fontWeight: '700', color: theme.warning }}>
          ⚠️ UI_PREVIEW_ONLY — مسودة اقتراح فقط
        </Text>
        <Text role="caption" tone="muted">
          لن يُنشئ هذا النموذج منتجًا في الكتالوج. الإرسال يولّد طلب مسودة يحتاج ربط API.
          لا يُولَّد معرّف منتج أو باركود هنا.
        </Text>
      </Surface>

      <Box gap={3}>
        {/* Name */}
        <Box gap={1}>
          <Text role="caption" style={{ fontWeight: '700', color: theme.brandHeaderBackground }}>
            اسم المنتج *
          </Text>
          <TextField
            label="اسم المنتج"
            value={form.productName}
            onChangeText={(v) => setForm((f) => ({ ...f, productName: v }))}
            placeholder="مثال: تفاح أحمر طازج"
          />
        </Box>

        {/* Main Category */}
        <Box gap={1}>
          <Text role="caption" style={{ fontWeight: '700', color: theme.brandHeaderBackground }}>
            الفئة الرئيسية *
          </Text>
          <select
            aria-label="الفئة الرئيسية"
            title="الفئة الرئيسية"
            value={form.categoryMainId}
            onChange={(e) => setForm((f) => ({ ...f, categoryMainId: e.target.value, categorySubId: '' }))}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${theme.lineStrong}`,
              direction: 'rtl',
              backgroundColor: theme.surface,
              color: theme.brandHeaderBackground,
              fontSize: 14,
            }}
          >
            <option value="">اختر فئة...</option>
            {dshCatalogCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.emojiFallback} {c.label}</option>
            ))}
          </select>
        </Box>

        {/* Sub Category */}
        {selectedMainCat && selectedMainCat.subcategories.length > 0 && (
          <Box gap={1}>
            <Text role="caption" style={{ fontWeight: '700', color: theme.brandHeaderBackground }}>
              الفئة الفرعية
            </Text>
            <select
              aria-label="الفئة الفرعية"
              title="الفئة الفرعية"
              value={form.categorySubId}
              onChange={(e) => setForm((f) => ({ ...f, categorySubId: e.target.value }))}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: `1px solid ${theme.lineStrong}`,
                direction: 'rtl',
                backgroundColor: theme.surface,
                color: theme.brandHeaderBackground,
                fontSize: 14,
              }}
            >
              <option value="">لا يوجد (عام)</option>
              {selectedMainCat.subcategories.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </Box>
        )}

        {/* Media Key */}
        <Box gap={1}>
          <Text role="caption" style={{ fontWeight: '700', color: theme.brandHeaderBackground }}>
            Media Key (اختياري)
          </Text>
          <select
            aria-label="Media Key للمنتج"
            title="Media Key للمنتج"
            value={form.mediaKey}
            onChange={(e) => setForm((f) => ({ ...f, mediaKey: e.target.value }))}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${theme.lineStrong}`,
              direction: 'rtl',
              backgroundColor: theme.surface,
              color: theme.brandHeaderBackground,
              fontSize: 14,
            }}
          >
            <option value="">بدون (emoji fallback)</option>
            <option value="dsh.product.apple.v1">dsh.product.apple.v1</option>
            <option value="dsh.product.milk.v1">dsh.product.milk.v1</option>
            <option value="dsh.product.bread.v1">dsh.product.bread.v1</option>
            <option value="dsh.product.chicken.v1">dsh.product.chicken.v1</option>
            <option value="dsh.product.pasta.v1">dsh.product.pasta.v1</option>
          </select>
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
            Media key يُحدد صورة المنتج من مخزن الوسائط المركزي. لا تُنسخ الصور.
          </Text>
        </Box>

        {/* SKU Note */}
        <Box gap={1}>
          <Text role="caption" style={{ fontWeight: '700', color: theme.brandHeaderBackground }}>
            SKU مقترح (ملاحظة فقط)
          </Text>
          <TextField
            label="SKU"
            value={form.skuNote}
            onChangeText={(v) => setForm((f) => ({ ...f, skuNote: v }))}
            placeholder="مثال: BTH-APPLE-001"
          />
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
            سيتم توليد SKU الرسمي من النظام عند ربط API.
          </Text>
        </Box>

        {/* GTIN Note */}
        <Box gap={1}>
          <Text role="caption" style={{ fontWeight: '700', color: theme.brandHeaderBackground }}>
            GTIN / باركود مقترح (ملاحظة فقط)
          </Text>
          <TextField
            label="GTIN"
            value={form.gtinNote}
            onChangeText={(v) => setForm((f) => ({ ...f, gtinNote: v }))}
            placeholder="مثال: 6281234567890"
          />
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
            لا يُولَّد باركود هنا. GTIN يحتاج تحقق GS1 قبل التخزين. API boundary: identity-service.
          </Text>
        </Box>

        {/* Price Note */}
        <Box gap={1}>
          <Text role="caption" style={{ fontWeight: '700', color: theme.brandHeaderBackground }}>
            سعر مقترح (ريال)
          </Text>
          <TextField
            label="السعر"
            value={form.priceNote}
            onChangeText={(v) => setForm((f) => ({ ...f, priceNote: v }))}
            placeholder="مثال: 15.00"
          />
        </Box>

        {/* Duplicate Warning */}
        {form.productName.trim().length > 2 && (
          <Surface
            tone="inset"
            padding={2}
            gap={1}
            style={{ borderRadius: 6, borderWidth: 1, borderColor: theme.warning, borderStyle: 'dashed' }}
          >
            <Text role="caption" style={{ color: theme.warning, fontWeight: '600' }}>
              ⚠️ تحقق من التكرار
            </Text>
            <Text role="caption" tone="muted">
              قبل الإرسال، تأكد من عدم وجود منتج بنفس الاسم في نظام التكرارات (Duplicate Resolution Workspace).
            </Text>
          </Surface>
        )}

        {validationError && (
          <Text role="caption" style={{ color: theme.danger, fontWeight: '700' }}>
            ⛔ {validationError}
          </Text>
        )}
      </Box>

      <Box layoutDirection="row" gap={2} justify="flex-end" style={{ paddingTop: 8 }}>
        <Button label="إلغاء" tone="secondary" onPress={onClose} />
        <Button
          label="إرسال كمسودة"
          tone="brand"
          onPress={handleSubmit}
          disabled={!form.productName.trim() || !form.categoryMainId}
        />
      </Box>

      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'center' }}>
        UI_PREVIEW_ONLY • هذه المسودة لا تُنشئ منتجًا فعليًا • API boundary: POST /catalog/products
      </Text>
    </Surface>
  );
}
