'use client';

/**
 * CatalogPublicationReadinessMatrix — UI_PREVIEW_ONLY
 * Owner: control-panel/catalogs
 * API boundary: GET /catalog/readiness/:storeId (not yet bound)
 *
 * Displays a matrix of all readiness requirements for client-facing publication.
 * Uses shared resolvers from:
 *   dsh/frontend/shared/dsh-client-visibility.model.ts
 *   dsh/frontend/shared/dsh-partner-activation.model.ts
 *
 * Eliminates local visibility mapping inside ControlPanelDshCatalogScreen.
 * No duplicate approvalStage → partnerActivationStatus mapping here.
 *
 * Constraints:
 * - No direct Tamagui import. All UI via @bthwani/ui-kit.
 * - No canonical data mutation.
 * - Visibility decisions come from shared resolver only.
 */

import React, { useMemo } from 'react';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import type { CatalogProductMaster } from '../catalogs.data';
import { mapApprovalStageToPartnerActivationStatus } from '../../../shared/dsh-client-visibility.model';

export type CatalogPublicationReadinessMatrixProps = {
  products: readonly CatalogProductMaster[];
  onClose: () => void;
};

type ReadinessRow = {
  id: string;
  label: string;
  owner: string;
  linkedSurface: string;
  apiNote: string;
  check: (product: CatalogProductMaster) => boolean;
  blockedReason: (product: CatalogProductMaster) => string | null;
  nextAction: string;
};

const READINESS_ROWS: ReadinessRow[] = [
  {
    id: 'partner-active',
    label: '🤝 الشريك نشط',
    owner: 'control-panel/partners',
    linkedSurface: 'app-partner',
    apiNote: 'GET /partners/:id/activation-status',
    check: (p) => {
      const status = mapApprovalStageToPartnerActivationStatus(p.approvalStage);
      return status === 'partner_active' || status === 'client_visible';
    },
    blockedReason: (p) => {
      const status = mapApprovalStageToPartnerActivationStatus(p.approvalStage);
      if (status === 'partner_active' || status === 'client_visible') return null;
      return `حالة الشريك: ${status} — يحتاج إكمال دورة onboarding`;
    },
    nextAction: 'إكمال partner onboarding في control-panel/partners',
  },
  {
    id: 'catalog-approved',
    label: '✅ المنتج معتمد في الكتالوج',
    owner: 'control-panel/catalogs',
    linkedSurface: 'catalogs',
    apiNote: 'GET /catalog/products/:id/approval',
    check: (p) => p.approvalStage === 'catalog-adopted' || p.approvalStage === 'client-visible',
    blockedReason: (p) =>
      p.approvalStage === 'catalog-adopted' || p.approvalStage === 'client-visible'
        ? null
        : `مرحلة الاعتماد الحالية: ${p.approvalStage}`,
    nextAction: 'اعتماد المنتج عبر Item Approval Workflow',
  },
  {
    id: 'category-mapped',
    label: '🗂 الفئة مربوطة',
    owner: 'control-panel/catalogs',
    linkedSurface: 'catalogs',
    apiNote: 'GET /catalog/products/:id/category-mapping',
    check: (p) => !!p.categoryPath.main,
    blockedReason: (p) =>
      p.categoryPath.main ? null : 'الفئة الرئيسية غير مربوطة',
    nextAction: 'ربط الفئة في Taxonomy Governance Workspace',
  },
  {
    id: 'duplicate-clean',
    label: '🔍 لا تكرار مكتشف',
    owner: 'control-panel/catalogs',
    linkedSurface: 'catalogs',
    apiNote: 'GET /catalog/products/:id/duplicates',
    check: (p) => !p.conflictReason,
    blockedReason: (p) =>
      p.conflictReason ? `تعارض: ${p.conflictReason}` : null,
    nextAction: 'حل التكرار في Duplicate Resolution Workspace',
  },
  {
    id: 'media-satisfied',
    label: '🖼 سياسة الوسائط مُرضاة',
    owner: 'control-panel/catalogs',
    linkedSurface: 'catalogs',
    apiNote: 'GET /catalog/products/:id/media-policy',
    check: (p) => !!p.mediaKey || !!p.imageUri,
    blockedReason: (p) =>
      p.mediaKey || p.imageUri ? null : 'لا يوجد media key أو صورة — يحتاج governance الوسائط',
    nextAction: 'إضافة media key في Media Governance Workspace',
  },
  {
    id: 'identity-complete',
    label: '🏷 هوية المنتج مكتملة (SKU/GTIN)',
    owner: 'control-panel/catalogs',
    linkedSurface: 'catalogs',
    apiNote: 'GET /catalog/products/:id/identity',
    check: (p) => !!p.sku,
    blockedReason: (p) =>
      p.sku ? null : 'SKU ناقص — يحتاج تحقق هوية',
    nextAction: 'مراجعة الهوية في Identity Governance Workspace',
  },
  {
    id: 'client-visible-gate',
    label: '👁 بوابة الظهور للعميل',
    owner: 'control-panel/catalogs',
    linkedSurface: 'app-client',
    apiNote: 'GET /catalog/products/:id/client-visibility',
    check: (p) => p.approvalStage === 'client-visible',
    blockedReason: (p) =>
      p.approvalStage === 'client-visible' ? null : `المنتج غير مُصرَّح بظهوره للعميل — المرحلة الحالية: ${p.approvalStage}`,
    nextAction: 'نشر المنتج عبر Publishing Gate',
  },
];

export function CatalogPublicationReadinessMatrix({
  products,
  onClose,
}: CatalogPublicationReadinessMatrixProps) {
  const { theme } = useTheme();

  // Summary stats
  const stats = useMemo(() => {
    const total = products.length;
    const fullyReady = products.filter((p) =>
      READINESS_ROWS.every((row) => row.check(p))
    ).length;
    const partiallyReady = products.filter((p) =>
      READINESS_ROWS.some((row) => row.check(p)) && !READINESS_ROWS.every((row) => row.check(p))
    ).length;
    const blocked = total - fullyReady - partiallyReady;
    return { total, fullyReady, partiallyReady, blocked };
  }, [products]);

  // Per-row stats
  const rowStats = useMemo(() =>
    READINESS_ROWS.map((row) => {
      const satisfiedCount = products.filter(row.check).length;
      const blockedCount = products.length - satisfiedCount;
      return { ...row, satisfiedCount, blockedCount };
    }),
    [products]
  );

  return (
    <Surface
      tone="raised"
      padding={5}
      gap={4}
      style={{
        position: 'relative',
        zIndex: 1,
        width: 640,
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
          🚦 مصفوفة جاهزية النشر
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
          UI_PREVIEW_ONLY — جاهزية مشتقة من حالة البيانات الحالية
        </Text>
        <Text role="caption" tone="muted">
          النتائج الحقيقية تأتي من: GET /catalog/readiness — not yet bound.
          visibility mapping يستخدم shared resolver: mapApprovalStageToPartnerActivationStatus
        </Text>
      </Surface>

      {/* Summary KPIs */}
      <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'جاهز للنشر', value: stats.fullyReady, color: theme.success },
          { label: 'جاهز جزئيًا', value: stats.partiallyReady, color: theme.warning },
          { label: 'محجوب', value: stats.blocked, color: theme.danger },
          { label: 'إجمالي', value: stats.total, color: theme.brandHeaderBackground },
        ].map((kpi) => (
          <Surface
            key={kpi.label}
            tone="inset"
            padding={3}
            style={{ borderRadius: 8, flex: 1, minWidth: 100, borderWidth: 2, borderColor: kpi.color, borderStyle: 'solid' }}
          >
            <Text role="caption" style={{ fontWeight: '800', fontSize: 20, color: kpi.color, textAlign: 'center' }}>
              {kpi.value}
            </Text>
            <Text role="caption" tone="muted" style={{ textAlign: 'center', fontSize: 11 }}>
              {kpi.label}
            </Text>
          </Surface>
        ))}
      </Box>

      {/* Readiness matrix rows */}
      <Box gap={2}>
        <Text role="caption" style={{ fontWeight: '800', color: theme.brandHeaderBackground }}>
          مصفوفة المتطلبات ({READINESS_ROWS.length} متطلب)
        </Text>

        {rowStats.map((row) => {
          const allSatisfied = row.satisfiedCount === products.length;
          const allBlocked = row.satisfiedCount === 0;

          return (
            <Surface
              key={row.id}
              tone="inset"
              padding={3}
              gap={2}
              style={{
                borderRadius: 8,
                borderWidth: 2,
                borderColor: allSatisfied ? theme.success : allBlocked ? theme.danger : theme.warning,
                borderStyle: 'solid',
              }}
            >
              <Box layoutDirection="row" align="center" gap={2} justify="space-between">
                <Box gap={0} style={{ flex: 1 }}>
                  <Text role="caption" style={{ fontWeight: '700', fontSize: 13, color: theme.brandHeaderBackground }}>
                    {row.label}
                  </Text>
                  <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                    مالك: {row.owner} | سطح: {row.linkedSurface}
                  </Text>
                </Box>
                <Box gap={0} style={{ alignItems: 'flex-end' }}>
                  <Text
                    role="caption"
                    style={{
                      fontWeight: '800',
                      fontSize: 13,
                      color: allSatisfied ? theme.success : allBlocked ? theme.danger : theme.warning,
                    }}
                  >
                    {row.satisfiedCount} / {products.length}
                  </Text>
                  <Text role="caption" style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: allSatisfied ? theme.success : allBlocked ? theme.danger : theme.warning,
                  }}>
                    {allSatisfied ? '✅ مُرضى' : allBlocked ? '❌ محجوب' : '⚠️ جزئي'}
                  </Text>
                </Box>
              </Box>

              {!allSatisfied && (
                <Box gap={1}>
                  <Text role="caption" style={{ fontWeight: '700', color: theme.warning, fontSize: 11 }}>
                    الإجراء التالي: {row.nextAction}
                  </Text>
                  {products.slice(0, 2).map((p) => {
                    const reason = row.blockedReason(p);
                    if (!reason) return null;
                    return (
                      <Text key={p.id} role="caption" tone="muted" style={{ fontSize: 10 }}>
                        • {p.name}: {reason}
                      </Text>
                    );
                  })}
                  {products.filter((p) => !!row.blockedReason(p)).length > 2 && (
                    <Text role="caption" tone="muted" style={{ fontSize: 10 }}>
                      + {products.filter((p) => !!row.blockedReason(p)).length - 2} منتج آخر
                    </Text>
                  )}
                </Box>
              )}

              <Text role="caption" tone="muted" style={{ fontSize: 10, direction: 'ltr' }}>
                {row.apiNote}
              </Text>
            </Surface>
          );
        })}
      </Box>

      {/* Final gate */}
      <Surface
        tone="inset"
        padding={4}
        gap={2}
        style={{
          borderRadius: 10,
          borderWidth: 2,
          borderColor: stats.fullyReady === stats.total ? theme.success : theme.danger,
          borderStyle: 'solid',
        }}
      >
        <Text
          role="titleLg"
          style={{
            fontWeight: '800',
            fontSize: 16,
            color: stats.fullyReady === stats.total ? theme.success : theme.danger,
            textAlign: 'center',
          }}
        >
          {stats.fullyReady === stats.total
            ? '✅ جميع المنتجات جاهزة للنشر'
            : `❌ ${stats.total - stats.fullyReady} منتج يحتاج إغلاق قبل النشر`}
        </Text>
        <Text role="caption" tone="muted" style={{ textAlign: 'center', fontSize: 11 }}>
          لا يمكن النشر للعميل إلا بعد إغلاق جميع متطلبات المصفوفة.
          API boundary: POST /catalog/publish — not yet bound
        </Text>
      </Surface>

      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'center' }}>
        UI_PREVIEW_ONLY • Visibility via shared resolver • POST /catalog/publish — not yet bound
      </Text>
    </Surface>
  );
}
