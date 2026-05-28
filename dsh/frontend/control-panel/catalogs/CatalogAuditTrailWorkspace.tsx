'use client';

/**
 * CatalogAuditTrailWorkspace — UI_PREVIEW_ONLY
 * Owner: control-panel/catalogs
 * API boundary: GET /catalog/audit/:productId (not yet bound)
 *
 * Provides audit evidence summary for catalog decisions.
 * Each approval/rejection/handoff/visibility decision should have an audit record.
 *
 * Constraints:
 * - No direct Tamagui import. All UI via @bthwani/ui-kit.
 * - No full evidence payload always loaded — summary + detail-on-open principle.
 * - No claim of API audit truth — UI_PREVIEW_ONLY.
 * - No canonical data mutation.
 */

import React, { useState } from 'react';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import type { CatalogProductMaster } from './catalogs.data';

export type CatalogAuditTrailWorkspaceProps = {
  productId?: string;
  products: readonly CatalogProductMaster[];
  onClose: () => void;
};

type AuditEventType =
  | 'approval'
  | 'rejection'
  | 'stage-change'
  | 'identity-decision'
  | 'visibility-decision'
  | 'media-decision'
  | 'partner-handoff'
  | 'marketing-handoff'
  | 'owner-change';

type AuditEvent = {
  id: string;
  eventType: AuditEventType;
  timestamp: string;
  actor: string;
  surface: string;
  summary: string;
  detailAvailable: boolean;
  apiNote: string;
};

// UI_PREVIEW_ONLY: preview audit events derived from product state
function derivePreviewAuditEvents(product: CatalogProductMaster): AuditEvent[] {
  const events: AuditEvent[] = [];

  events.push({
    id: 'ev-source',
    eventType: 'stage-change',
    timestamp: '2026-05-01',
    actor: `source: ${product.sourceSurface}`,
    surface: product.sourceSurface,
    summary: `المنتج دخل الكتالوج من سطح: ${product.sourceSurface}`,
    detailAvailable: false,
    apiNote: 'GET /catalog/audit/:id/origin — not yet bound',
  });

  if (product.approvalStage !== 'catalog-draft') {
    events.push({
      id: 'ev-stage',
      eventType: 'approval',
      timestamp: '2026-05-10',
      actor: 'control-panel/catalogs',
      surface: 'catalogs',
      summary: `مرحلة الاعتماد: ${product.approvalStage}`,
      detailAvailable: false,
      apiNote: 'GET /catalog/audit/:id/approvals — not yet bound',
    });
  }

  if (product.mediaKey) {
    events.push({
      id: 'ev-media',
      eventType: 'media-decision',
      timestamp: '2026-05-12',
      actor: 'control-panel/catalogs',
      surface: 'catalogs',
      summary: `سياسة الوسائط: ${product.mediaPolicy} | Media Key: ${product.mediaKey}`,
      detailAvailable: false,
      apiNote: 'GET /catalog/audit/:id/media — not yet bound',
    });
  }

  if (product.sourceSurface === 'partner') {
    events.push({
      id: 'ev-partner',
      eventType: 'partner-handoff',
      timestamp: '2026-05-08',
      actor: 'control-panel/partners',
      surface: 'partners',
      summary: 'المنتج قدم من شريك — تم استلام الطلب في الكتالوج',
      detailAvailable: false,
      apiNote: 'GET /catalog/audit/:id/partner-handoff — not yet bound',
    });
  }

  if (product.approvalStage === 'marketing-review') {
    events.push({
      id: 'ev-marketing',
      eventType: 'marketing-handoff',
      timestamp: '2026-05-14',
      actor: 'control-panel/marketing',
      surface: 'marketing',
      summary: 'المنتج في مرحلة مراجعة التسويق',
      detailAvailable: false,
      apiNote: 'GET /catalog/audit/:id/marketing-review — not yet bound',
    });
  }

  if (product.approvalStage === 'client-visible') {
    events.push({
      id: 'ev-visibility',
      eventType: 'visibility-decision',
      timestamp: '2026-05-16',
      actor: 'control-panel/catalogs',
      surface: 'catalogs',
      summary: 'المنتج مُصرَّح بظهوره للعميل (client-visible)',
      detailAvailable: false,
      apiNote: 'GET /catalog/audit/:id/visibility — not yet bound',
    });
  }

  if (product.conflictReason) {
    events.push({
      id: 'ev-conflict',
      eventType: 'rejection',
      timestamp: '2026-05-09',
      actor: 'control-panel/catalogs',
      surface: 'catalogs',
      summary: `تعارض مكتشف: ${product.conflictReason}`,
      detailAvailable: false,
      apiNote: 'GET /catalog/audit/:id/conflicts — not yet bound',
    });
  }

  return events;
}

const EVENT_TYPE_ICONS: Record<AuditEventType, string> = {
  'approval': '✅',
  'rejection': '❌',
  'stage-change': '🔄',
  'identity-decision': '🏷',
  'visibility-decision': '👁',
  'media-decision': '🖼',
  'partner-handoff': '🤝',
  'marketing-handoff': '📢',
  'owner-change': '👤',
};

export function CatalogAuditTrailWorkspace({
  productId,
  products,
  onClose,
}: CatalogAuditTrailWorkspaceProps) {
  const { theme } = useTheme();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(productId ?? null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? (productId ? undefined : products[0]);
  const auditEvents = selectedProduct ? derivePreviewAuditEvents(selectedProduct) : [];

  return (
    <Surface
      tone="raised"
      padding={5}
      gap={4}
      style={{
        position: 'relative',
        zIndex: 1,
        width: 560,
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
        <Text role="titleLg" style={{ fontWeight: '800', fontSize: 18, color: theme.brandHeaderBackground }}>
          📋 سجل التدقيق
        </Text>
        <Button label="✕ إغلاق" tone="secondary" size="sm" onPress={onClose} />
      </Box>

      {/* Notice */}
      <Surface
        tone="inset"
        padding={3}
        style={{ borderRadius: 8, borderWidth: 1, borderColor: theme.warning, borderStyle: 'dashed' }}
      >
        <Text role="caption" style={{ color: theme.warning, fontWeight: '700' }}>
          UI_PREVIEW_ONLY — سجل أحداث اشتقاقي
        </Text>
        <Text role="caption" tone="muted">
          الأحداث مشتقة من حالة المنتج الحالية للعرض فقط.
          السجل الحقيقي يأتي من: GET /catalog/audit/:productId — not yet bound.
        </Text>
      </Surface>

      {/* Product selector */}
      <Box gap={2}>
        <Text role="caption" style={{ fontWeight: '800', color: theme.brandHeaderBackground }}>
          اختر منتج
        </Text>
        <select
          value={selectedProductId ?? ''}
          onChange={(e) => setSelectedProductId(e.target.value || null)}
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
          <option value="">اختر منتجًا...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>
      </Box>

      {/* Selected product summary */}
      {selectedProduct && (
        <Surface
          tone="inset"
          padding={3}
          gap={2}
          style={{ borderRadius: 8, borderWidth: 1, borderColor: theme.brand, borderStyle: 'solid' }}
        >
          <Text role="caption" style={{ fontWeight: '800', color: theme.brandHeaderBackground }}>
            📌 {selectedProduct.name}
          </Text>
          <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
            <Box gap={0}>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>SKU</Text>
              <Text role="caption" style={{ fontWeight: '700', direction: 'ltr', fontSize: 12 }}>
                {selectedProduct.sku}
              </Text>
            </Box>
            <Box gap={0}>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>المرحلة</Text>
              <Text role="caption" style={{ fontWeight: '700', fontSize: 12 }}>
                {selectedProduct.approvalStage}
              </Text>
            </Box>
            <Box gap={0}>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>المصدر</Text>
              <Text role="caption" style={{ fontWeight: '700', fontSize: 12 }}>
                {selectedProduct.sourceSurface}
              </Text>
            </Box>
            <Box gap={0}>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>تعارض</Text>
              <Text role="caption" style={{ fontWeight: '700', fontSize: 12, color: selectedProduct.conflictReason ? theme.danger : theme.success }}>
                {selectedProduct.conflictReason ? '⚠️ نعم' : '✅ لا'}
              </Text>
            </Box>
          </Box>
        </Surface>
      )}

      {/* Audit timeline */}
      {auditEvents.length > 0 && (
        <Box gap={3}>
          <Text role="caption" style={{ fontWeight: '800', color: theme.brandHeaderBackground }}>
            سجل الأحداث ({auditEvents.length})
          </Text>

          <Box gap={2}>
            {auditEvents.map((event, idx) => (
              <Box
                key={event.id}
                gap={2}
                style={{
                  padding: 12,
                  backgroundColor: theme.surfaceInset,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.line,
                  borderStyle: 'solid',
                  position: 'relative',
                }}
              >
                <Box layoutDirection="row" align="center" gap={2}>
                  <Text role="caption" style={{ fontSize: 18 }}>
                    {EVENT_TYPE_ICONS[event.eventType]}
                  </Text>
                  <Box gap={0} style={{ flex: 1 }}>
                    <Text role="caption" style={{ fontWeight: '700', color: theme.brandHeaderBackground, fontSize: 13 }}>
                      {event.summary}
                    </Text>
                    <Box layoutDirection="row" gap={3}>
                      <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                        {event.timestamp}
                      </Text>
                      <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                        {event.actor}
                      </Text>
                      <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                        سطح: {event.surface}
                      </Text>
                    </Box>
                  </Box>
                </Box>

                {event.detailAvailable ? (
                  <Button
                    label="عرض التفاصيل"
                    tone="secondary"
                    size="sm"
                    onPress={() => {}}
                    accessibilityLabel="عرض تفاصيل الحدث"
                  />
                ) : (
                  <Text role="caption" tone="muted" style={{ fontSize: 10, direction: 'ltr' }}>
                    {event.apiNote}
                  </Text>
                )}

                {idx < auditEvents.length - 1 && (
                  <div style={{ position: 'absolute', right: 20, bottom: -12, width: 2, height: 12, backgroundColor: theme.line }} />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {!selectedProduct && (
        <Surface tone="inset" padding={4} style={{ borderRadius: 8 }}>
          <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>
            اختر منتجًا من القائمة أعلاه لعرض سجل التدقيق
          </Text>
        </Surface>
      )}

      {selectedProduct && auditEvents.length === 0 && (
        <Surface tone="inset" padding={4} style={{ borderRadius: 8 }}>
          <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>
            لا توجد أحداث تدقيق لهذا المنتج في العرض الحالي
          </Text>
        </Surface>
      )}

      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'center' }}>
        UI_PREVIEW_ONLY • الأحداث اشتقاقية • GET /catalog/audit/:productId — not yet bound
      </Text>
    </Surface>
  );
}
