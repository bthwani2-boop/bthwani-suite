'use client';

import React from 'react';
import { Box, Button, Text, useTheme } from '@bthwani/ui-kit';
import { WatermarkedImage, InspectorTile, MiniInfoBox, WorkspaceCategoryPicker } from '../catalogs.parts';
import type { CatalogProductMaster, CatalogMainCategory } from '../catalogs.data';
import type { CatalogProductPreviewPatch } from '../catalogs.adapters';
import type { CatalogWorkspaceId } from '../catalogs.model';
import type { useCatalogScreen } from '../catalogs.hooks';

type CatalogModalForm = ReturnType<typeof useCatalogScreen>['modalForm'];

export type ProductInspectorPanelProps = {
  selectedProduct: CatalogProductMaster;
  setSelectedProductId: (id: string | null) => void;
  openWorkspace: (ws: CatalogWorkspaceId, productId?: string) => void;
  queueProductPreviewPatch: (
    product: CatalogProductMaster,
    patch: CatalogProductPreviewPatch,
    label: string,
    note: string,
    apiBoundary?: string,
  ) => void;
  previewCategories: CatalogMainCategory[];
  setModalForm: React.Dispatch<React.SetStateAction<CatalogModalForm>>;
  setShowProductModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ProductInspectorPanel({
  selectedProduct,
  setSelectedProductId,
  openWorkspace,
  queueProductPreviewPatch,
  previewCategories,
  setModalForm,
  setShowProductModal,
}: ProductInspectorPanelProps) {
  const { theme } = useTheme();

  return (
    <div style={{ width: 320, borderRight: `1px solid ${theme.line}`, backgroundColor: theme.surfaceInset, display: 'flex', flexDirection: 'column' }}>
      <Box padding={3} background="surfaceRaised" style={{ borderBottomWidth: 1, borderBottomColor: theme.line }} layoutDirection="row" justify="space-between" align="center">
        <Text role="bodyStrong" style={{ fontSize: 14 }}>تفاصيل المنتج</Text>
        <Box layoutDirection="row" gap={2} align="center">
          <Button
            label="▸ Workspace"
            tone="brand"
            size="sm"
            onPress={() => openWorkspace('item-detail', selectedProduct.id)}
            accessibilityLabel="فتح workspace تفاصيل العنصر"
          />
          <Button label="✕" accessibilityLabel="إغلاق" tone="secondary" size="sm" onPress={() => setSelectedProductId(null)} />
        </Box>
      </Box>
      <Box gap={3} padding={3} style={{ flex: 1 }}>
        <Box layoutDirection="row" gap={3} align="center">
          <WatermarkedImage src={selectedProduct.imageUri} mediaKey={selectedProduct.mediaKey} productName={selectedProduct.name} size={48} />
          <Box style={{ flex: 1 }} gap={0}>
            <Text role="bodyStrong" style={{ fontSize: 13 }}>{selectedProduct.name}</Text>
            <Text role="caption" tone="muted" style={{ fontSize: 10 }}>المعرف: {selectedProduct.sku}</Text>
          </Box>
        </Box>

        <InspectorTile tileTitle="ربط الفئة (Category Mapping)">
          <WorkspaceCategoryPicker
            categories={previewCategories}
            value={{
              mainCat: selectedProduct.categoryPath.main,
              subCat: selectedProduct.categoryPath.sub || '',
              mainClassif: selectedProduct.categoryPath.mainClassification || '',
              subClassif: selectedProduct.categoryPath.subClassification || ''
            }}
            onChange={(val) => {
              const changedField = val.mainCat !== selectedProduct.categoryPath.main ? 'الفئة الرئيسية' :
                val.subCat !== (selectedProduct.categoryPath.sub || '') ? 'الفئة الفرعية' :
                val.mainClassif !== (selectedProduct.categoryPath.mainClassification || '') ? 'التصنيف الرئيسي' :
                'التصنيف الفرعي';
              queueProductPreviewPatch(
                selectedProduct,
                {
                  categoryPath: {
                    main: val.mainCat,
                    sub: val.subCat || undefined,
                    mainClassification: val.mainClassif || undefined,
                    subClassification: val.subClassif || undefined
                  }
                },
                `تم تسجيل مقترح تغيير ${changedField}`,
                `تغيير تصنيف المنتج كمعاينة فقط؛ لا تعديل على المصدر المركزي.`
              );
            }}
            layout="vertical"
          />
        </InspectorTile>

        <InspectorTile tileTitle="الحالة">
          <div style={{ gridTemplateColumns: '1fr', gap: '4px' }}>
            <MiniInfoBox label="العميل" value={selectedProduct.approvalStage === 'client-visible' ? 'مرئي' : 'مخفي'} valueColor={selectedProduct.approvalStage === 'client-visible' ? theme.success : theme.textMuted} isBoldValue />
            <MiniInfoBox label="الشريك" value="متاح" />
          </div>
        </InspectorTile>

        {selectedProduct.conflictReason && (
          <InspectorTile tileTitle="تعارض" warning>
            <Text role="caption" style={{ color: theme.danger, fontSize: 10 }}>{selectedProduct.conflictReason}</Text>
          </InspectorTile>
        )}

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
                    onPress={() => queueProductPreviewPatch(selectedProduct, { approvalStage: 'catalog-adopted', mediaPolicy: 'catalog-owned-media' }, 'تم تسجيل مقترح الاعتماد كمنتج مركزي', 'اعتماد المنتج كمنتج مركزي كمعاينة فقط.')}
                  />
                  <Button
                    label="استثناء شريك"
                    tone="secondary"
                    size="sm"
                    style={{ flex: 1 }}
                    onPress={() => queueProductPreviewPatch(selectedProduct, { approvalStage: 'catalog-adopted', mediaPolicy: 'partner-owned-exception' }, 'تم تسجيل مقترح الاعتماد كاستثناء شريك', 'اعتماد المنتج كاستثناء شريك كمعاينة فقط.')}
                  />
                </Box>
                <Box layoutDirection="row" gap={1}>
                  <Button
                    label="طلب تعديل"
                    tone="danger"
                    size="sm"
                    style={{ flex: 1 }}
                    onPress={() => queueProductPreviewPatch(selectedProduct, { approvalStage: 'catalog-draft' }, 'تم تسجيل مقترح إعادة المنتج للمسودة', 'إعادة المنتج لمسودة الكتالوج كمعاينة فقط.')}
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
                    onPress={() => queueProductPreviewPatch(selectedProduct, { approvalStage: 'catalog-adopted' }, 'تم تسجيل مقترح تمرير فحص الجودة', 'تمرير فحص الجودة كمعاينة فقط.')}
                  />
                  <Button
                    label="طلب تعديل"
                    tone="secondary"
                    size="sm"
                    style={{ flex: 1 }}
                    onPress={() => queueProductPreviewPatch(selectedProduct, { approvalStage: 'catalog-draft' }, 'تم تسجيل مقترح إرجاع المنتج للمسودة', 'إرجاع المنتج للمسودة كمعاينة فقط.')}
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
                  onPress={() => queueProductPreviewPatch(selectedProduct, { approvalStage: 'client-visible' }, 'تم تسجيل مقترح النشر للعميل', 'تغيير الظهور إلى client-visible كمعاينة فقط.')}
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
                  onPress={() => queueProductPreviewPatch(selectedProduct, { conflictReason: undefined }, 'تم تسجيل مقترح حل التعارض', 'إزالة conflictReason كمعاينة فقط؛ الدمج الفعلي يحتاج API.')}
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
                    queueProductPreviewPatch(selectedProduct, { gtin: barcode, barcode }, `تم تسجيل مقترح حجز باركود: ${barcode}`, 'حجز GTIN كمعاينة فقط؛ لا يوجد binding مع سجل الباركود.', 'POST /catalog/products/{id}/barcode-reservations');
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
                  onPress={() => queueProductPreviewPatch(selectedProduct, { price: 45.00 }, 'تم تسجيل مقترح تسوية سعر المنتج', 'تسوية السعر إلى 45.00 كمعاينة فقط.', 'PATCH /catalog/products/{id}/price')}
                />
              </Box>
            )}

            <Box style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 4, marginTop: 4 }}>
              <MiniInfoBox label="حالة الاعتماد في الكتالوج" value={selectedProduct.approvalStage} valueColor={theme.brand} />
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
          <Button
            label="📋 سجل التدقيق"
            tone="secondary"
            size="sm"
            fullWidth
            onPress={() => openWorkspace('audit-trail', selectedProduct.id)}
          />
        </Box>
      </Box>
    </div>
  );
}
