'use client';

import React from 'react';
import { Box, Button, Text, useTheme } from '@bthwani/ui-kit';
import type { CatalogProductMaster } from '../catalogs.data';
import type { CatalogProductPreviewPatch } from '../catalogs.adapters';
import { mergeCatalogProductPreviewPatch } from '../catalogs.adapters';
import { createCatalogPreviewProposal, type CatalogPreviewProposal, type CatalogWorkspaceId } from '../catalogs.model';

type PublishingGateChecklistProps = {
  isCategoryMapped: boolean;
  isDuplicatesClean: boolean;
  isMediaSatisfied: boolean;
  approvedCount: number;
  totalCount: number;
  products: CatalogProductMaster[];
  setProductPreviewPatches: React.Dispatch<React.SetStateAction<Record<string, CatalogProductPreviewPatch>>>;
  pushPreviewProposal: (p: CatalogPreviewProposal) => void;
  setActionMessage: (msg: string | null) => void;
  openWorkspace: (ws: CatalogWorkspaceId, productId?: string) => void;
};

export function PublishingGateChecklist({
  isCategoryMapped, isDuplicatesClean, isMediaSatisfied,
  approvedCount, totalCount, products,
  setProductPreviewPatches, pushPreviewProposal, setActionMessage,
  openWorkspace,
}: PublishingGateChecklistProps) {
  const { theme } = useTheme();

  return (
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
      <Text role="bodyStrong" style={{ color: theme.brandHeaderBackground, fontWeight: '700', textAlign: 'right' }}>
        بوابة النشر النهائية (Publishing Gate Checklist)
      </Text>
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
        <Box layoutDirection="row" gap={2} align="center">
          <Button
            label="📊 مصفوفة جاهزية النشر"
            tone="secondary"
            size="sm"
            onPress={() => openWorkspace('publication-readiness')}
          />
          <Button
            label="🚀 نشر الكتالوج بالكامل للعميل"
            tone="brand"
            size="sm"
            disabled={!(isCategoryMapped && isDuplicatesClean && isMediaSatisfied && approvedCount > 0)}
            onPress={() => {
              const readyProducts = products.filter((p) => p.approvalStage === 'catalog-adopted');
              setProductPreviewPatches((prev) =>
                readyProducts.reduce(
                  (next, product) => mergeCatalogProductPreviewPatch(next, product.id, { approvalStage: 'client-visible' }),
                  prev
                )
              );
              pushPreviewProposal(createCatalogPreviewProposal({
                type: 'visibility-change',
                productIds: readyProducts.map((p) => p.id),
                label: 'نشر الكتالوج بالكامل للعميل',
                note: 'UI_PREVIEW_ONLY: تحويل المنتجات المعتمدة إلى client-visible كمعاينة فقط.',
                apiBoundary: 'POST /catalog/products/publish',
              }));
              setActionMessage('تم تسجيل مقترح نشر المنتجات الجاهزة للعميل');
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
