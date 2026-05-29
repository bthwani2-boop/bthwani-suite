'use client';

import React from 'react';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import { getActualPublicMediaPath } from '../../../shared/resolve-dsh-public-media-path';
import type { CatalogProductMaster, CatalogMainCategory } from '../catalogs.data';
import type { CatalogProductPreviewPatch } from '../catalogs.adapters';
import {
  createCatalogPreviewProposal,
  toCatalogApprovalStage,
  toCatalogMediaPolicy,
  type CatalogPreviewProposal,
} from '../catalogs.model';
import type { useCatalogScreen } from '../catalogs.hooks';

type CatalogModalForm = ReturnType<typeof useCatalogScreen>['modalForm'];

export type ProductEditModalProps = {
  setShowProductModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalMode: 'add' | 'edit';
  modalForm: CatalogModalForm;
  setModalForm: React.Dispatch<React.SetStateAction<CatalogModalForm>>;
  previewCategories: CatalogMainCategory[];
  products: CatalogProductMaster[];
  pushPreviewProposal: (p: CatalogPreviewProposal) => void;
  queueProductPreviewPatch: (
    product: CatalogProductMaster,
    patch: CatalogProductPreviewPatch,
    label: string,
    note: string,
    apiBoundary?: string,
  ) => void;
  setActionMessage: React.Dispatch<React.SetStateAction<string | null>>;
};

export function ProductEditModal({
  setShowProductModal,
  modalMode,
  modalForm,
  setModalForm,
  previewCategories,
  products,
  pushPreviewProposal,
  queueProductPreviewPatch,
  setActionMessage,
}: ProductEditModalProps) {
  const { theme } = useTheme();

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <Surface tone="raised" padding={4} gap={3} style={{ width: 420, maxWidth: '90%', maxHeight: '90%', overflow: 'scroll' }}>
        <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 8 }}>
          <Text role="bodyStrong" style={{ fontSize: 16 }}>{modalMode === 'add' ? 'إضافة منتج جديد' : 'تعديل منتج الكتالوج'}</Text>
          <Button label="✕" accessibilityLabel="إغلاق" tone="secondary" size="sm" onPress={() => setShowProductModal(false)} />
        </Box>

        <Box gap={2}>
          <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>اسم المنتج *</Text>
          <input
            aria-label="اسم المنتج"
            type="text"
            value={modalForm.name}
            onChange={e => setModalForm(prev => ({ ...prev, name: e.target.value }))}
            style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
          />

          <Box layoutDirection="row" gap={2}>
            <Box style={{ flex: 1 }} gap={1}>
              <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>المعرف (SKU) *</Text>
              <input
                aria-label="المعرف SKU"
                type="text"
                value={modalForm.sku}
                onChange={e => setModalForm(prev => ({ ...prev, sku: e.target.value }))}
                style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
              />
            </Box>
            <Box style={{ flex: 1 }} gap={1}>
              <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>الباركود (GTIN)</Text>
              <input
                aria-label="الباركود GTIN"
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
                aria-label="السعر"
                type="number"
                value={modalForm.price}
                onChange={e => setModalForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${theme.lineStrong}`, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
              />
            </Box>
            <Box style={{ flex: 1 }} gap={1}>
              <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>مفتاح الصورة (Media Key)</Text>
              <select
                aria-label="مفتاح الصورة"
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
                aria-label="الفئة الرئيسية"
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
                aria-label="الفئة الفرعية"
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
                aria-label="التصنيف الرئيسي"
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
                aria-label="التصنيف الفرعي"
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
                aria-label="سياسة الوسائط"
                value={modalForm.mediaPolicy}
                onChange={e => setModalForm(prev => ({ ...prev, mediaPolicy: toCatalogMediaPolicy(e.target.value, prev.mediaPolicy) }))}
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
                aria-label="حالة الاعتماد"
                value={modalForm.approvalStage}
                onChange={e => setModalForm(prev => ({ ...prev, approvalStage: toCatalogApprovalStage(e.target.value, prev.approvalStage) }))}
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
  );
}
