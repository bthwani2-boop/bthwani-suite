'use client';

/**
 * CatalogBulkOperationsWorkspace — SCAFFOLD: ربط API قيد التنفيذ
 * Owner: control-panel/catalogs
 * API boundary: POST /catalog/bulk (not yet bound)
 *
 * Extracted from ControlPanelDshCatalogScreen monolith.
 * Implements Carbon Data Table batch action principle:
 * - Bulk actions disabled with clear reason when selectedProductIds is empty.
 * - Each action produces a CatalogPreviewProposal with count, ids, owner,
 *   rollback note, and API boundary.
 * - No local product state mutation.
 *
 * Constraints:
 * - No direct Tamagui import. All UI via @bthwani/ui-kit.
 * - No canonical data mutation.
 * - Requires controlled selectedProductIds from parent.
 */

import React, { useState } from 'react';
import { generateLocalTempId } from '../../../shared/platform/local-temp-id';
import { Box, Button, Surface, Text, useTheme,
  radius,
} from '@bthwani/ui-kit';
import type { CatalogPreviewProposal } from '../catalogs.model';
import { WorkspacePreviewNotice } from '../catalogs.parts';
import type { CatalogProductMaster } from '../catalogs.data';

export type CatalogBulkOperationsWorkspaceProps = {
  /** IDs of products currently selected in the table. Required for batch operations. */
  selectedProductIds: readonly string[];
  /** Full product list for display purposes (summary only). */
  products: readonly CatalogProductMaster[];
  onClose: () => void;
  onProposal: (proposal: CatalogPreviewProposal) => void;
};

type BulkAction =
  | 'bulk-approve'
  | 'bulk-send-marketing'
  | 'bulk-request-fix'
  | 'bulk-export-evidence';

type BulkActionResult = {
  action: BulkAction;
  count: number;
  ids: readonly string[];
  label: string;
  owner: string;
  rollbackNote: string;
  apiBoundary: string;
};

const BULK_ACTION_LABELS: Record<BulkAction, string> = {
  'bulk-approve': '✅ اعتماد المنتجات المختارة',
  'bulk-send-marketing': '📢 إحالة للتسويق',
  'bulk-request-fix': '🔧 طلب تصحيح',
  'bulk-export-evidence': '📤 تصدير الأدلة',
};

const BULK_ACTIONS: readonly BulkAction[] = [
  'bulk-approve',
  'bulk-send-marketing',
  'bulk-request-fix',
  'bulk-export-evidence',
];

const BULK_ACTION_NOTES: Record<BulkAction, (ids: readonly string[]) => string> = {
  'bulk-approve': (ids) =>
    `اعتماد ${ids.length} منتج للكتالوج. Rollback: يمكن إعادة للمسودة عبر API. API boundary: POST /catalog/products/bulk-approve`,
  'bulk-send-marketing': (ids) =>
    `إحالة ${ids.length} منتج لمراجعة التسويق. Owner: control-panel/marketing. API boundary: POST /catalog/marketing-review/bulk`,
  'bulk-request-fix': (ids) =>
    `طلب تصحيح لـ ${ids.length} منتج. Owner: control-panel/catalogs. API boundary: POST /catalog/products/bulk-fix-request`,
  'bulk-export-evidence': (ids) =>
    `تصدير أدلة ${ids.length} منتج. الملف: catalog-evidence-export.csv. API boundary: GET /catalog/products/export`,
};

export function CatalogBulkOperationsWorkspace({
  selectedProductIds,
  products,
  onClose,
  onProposal,
}: CatalogBulkOperationsWorkspaceProps) {
  const { theme } = useTheme();
  const [actionResult, setActionResult] = useState<BulkActionResult | null>(null);

  const isEmpty = selectedProductIds.length === 0;

  const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id));

  function handleBulkAction(action: BulkAction) {
    if (isEmpty) return;

    const result: BulkActionResult = {
      action,
      count: selectedProductIds.length,
      ids: selectedProductIds,
      label: BULK_ACTION_LABELS[action],
      owner: action === 'bulk-send-marketing' ? 'control-panel-marketing' : 'control-panel-catalogs',
      rollbackNote: action === 'bulk-approve'
        ? 'Rollback: إعادة المنتجات للمسودة عبر PATCH /catalog/products/bulk-revert'
        : action === 'bulk-send-marketing'
          ? 'Rollback: إلغاء الإحالة عبر DELETE /catalog/marketing-review/bulk'
          : 'Rollback: لا يوجد تأثير مباشر — قابل للإلغاء',
      apiBoundary: action === 'bulk-approve'
        ? 'POST /catalog/products/bulk-approve'
        : action === 'bulk-send-marketing'
          ? 'POST /catalog/marketing-review/bulk'
          : action === 'bulk-request-fix'
            ? 'POST /catalog/products/bulk-fix-request'
            : 'GET /catalog/products/export',
    };

    setActionResult(result);

    onProposal({
      id: generateLocalTempId(`bulk-${action}`),
      type: action === 'bulk-send-marketing' ? 'bulk-send-marketing'
        : action === 'bulk-request-fix' ? 'bulk-request-fix'
          : 'bulk-approve',
      productIds: selectedProductIds,
      label: BULK_ACTION_LABELS[action],
      status: 'ready-for-api',
      owner: action === 'bulk-send-marketing' ? 'control-panel-marketing' : 'control-panel-catalogs',
      note: BULK_ACTION_NOTES[action](selectedProductIds),
      apiBoundary: result.apiBoundary,
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
        width: 500,
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
          📋 عمليات مجمعة
        </Text>
        <Button label="✕ إغلاق" tone="secondary" size="sm" onPress={onClose} />
      </Box>

      {/* Notice */}
      <WorkspacePreviewNotice
        bannerTitle="لا تعديل فعلي على الكتالوج"
        subtitle="كل الإجراءات المجمعة تُنتج مقترحًا يحتاج ربط API. لا تعديل local على البيانات."
      />

      {/* Selection status */}
      <Surface
        tone={isEmpty ? 'inset' : 'raised'}
        padding={3}
        gap={2}
        style={{
          borderRadius: 8,
          borderWidth: 2,
          borderColor: isEmpty ? theme.danger : theme.success,
          borderStyle: 'solid',
        }}
      >
        {isEmpty ? (
          <>
            <Text role="caption" weight="black" style={{ color: theme.danger }}>
              ⛔ لم يتم تحديد أي منتجات
            </Text>
            <Text role="caption" tone="muted">
              يجب تحديد منتج واحد على الأقل من الجدول لتفعيل الإجراءات المجمعة.
              أغلق هذا الـ workspace واختر المنتجات من الجدول أولًا.
            </Text>
            <Text role="caption" weight="semibold" style={{ color: theme.danger, fontSize: 11 }}>
              كل الإجراءات المجمعة معطّلة حتى يتم التحديد.
            </Text>
          </>
        ) : (
          <>
            <Text role="caption" weight="black" style={{ color: theme.success }}>
              ✅ {selectedProductIds.length} منتج محدد
            </Text>
            <Box gap={1} style={{ maxHeight: 120, overflow: 'scroll' }}>
              {selectedProducts.map((p) => (
                <Box key={p.id} layoutDirection="row" align="center" gap={2}>
                  <Text role="caption" weight="bold" style={{ fontSize: 10, color: theme.brand, direction: 'ltr' }}>
                    {p.sku}
                  </Text>
                  <Text role="caption" style={{ flex: 1,}}>{p.name}</Text>
                  <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{p.approvalStage}</Text>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Surface>

      {/* Bulk actions */}
      <Box gap={3}>
        <Text role="caption" weight="black" style={{ color: theme.brandHeaderBackground }}>
          الإجراءات المجمعة
        </Text>

        {BULK_ACTIONS.map((action) => (
          <Box key={action} gap={1}>
            <Button
              label={BULK_ACTION_LABELS[action]}
              tone={isEmpty ? 'secondary' : 'brand'}
              size="sm"
              disabled={isEmpty}
              onPress={() => handleBulkAction(action)}
            />
            {isEmpty && (
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                معطّل — يحتاج تحديد منتجات من الجدول
              </Text>
            )}
            {!isEmpty && (
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                سيطبّق على {selectedProductIds.length} منتج محدد • {
                  action === 'bulk-approve' ? 'POST /catalog/products/bulk-approve'
                    : action === 'bulk-send-marketing' ? 'POST /catalog/marketing-review/bulk'
                      : action === 'bulk-request-fix' ? 'POST /catalog/products/bulk-fix-request'
                        : 'GET /catalog/products/export'
                }
              </Text>
            )}
          </Box>
        ))}
      </Box>

      {/* Action result */}
      {actionResult && (
        <Surface
          tone="inset"
          padding={4}
          gap={3}
          style={{ borderRadius: radius.sm, borderWidth: 2, borderColor: theme.success, borderStyle: 'solid' }}
        >
          <Text role="caption" weight="black" style={{ color: theme.success }}>
            ✅ تم إرسال الاقتراح المجمع
          </Text>
          <Box gap={1}>
            <Box layoutDirection="row" gap={2}>
              <Text role="caption" tone="muted">الإجراء:</Text>
              <Text role="caption" weight="bold" style={{ }}>{BULK_ACTION_LABELS[actionResult.action]}</Text>
            </Box>
            <Box layoutDirection="row" gap={2}>
              <Text role="caption" tone="muted">العدد:</Text>
              <Text role="caption" weight="bold" style={{ }}>{actionResult.count} منتج</Text>
            </Box>
            <Box layoutDirection="row" gap={2}>
              <Text role="caption" tone="muted">المالك:</Text>
              <Text role="caption" weight="bold" style={{ }}>{actionResult.owner}</Text>
            </Box>
            <Text role="caption" weight="semibold" style={{ color: theme.warning, fontSize: 11 }}>
              {actionResult.rollbackNote}
            </Text>
            <Text role="caption" weight="semibold" style={{ color: theme.brand, fontSize: 11, direction: 'ltr' }}>
              API: {actionResult.apiBoundary} — not yet bound
            </Text>
          </Box>
        </Surface>
      )}

      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'center' }}>
        محاكاة محلية • Carbon batch action principle • API boundary: POST /catalog/bulk
      </Text>
    </Surface>
  );
}
