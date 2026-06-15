'use client';

/**
 * CatalogPublicationReadinessMatrix — SCAFFOLD: ربط API قيد التنفيذ
 * Owner: control-panel/catalogs
 * API boundary: GET /catalog/readiness/:storeId (not yet bound)
 */

import React, { useMemo } from 'react';
import { Box, Button, Surface, Text, useTheme,
  radius,
} from '@bthwani/ui-kit';
import type { CatalogProductMaster } from '../catalogs.data';
import { mapApprovalStageToPartnerActivationStatus } from '../../../shared/stores/dsh-client-visibility.model';

export type CatalogPublicationReadinessMatrixProps = {
  products: readonly CatalogProductMaster[];
  onClose: () => void;
};

type ReadinessRow = {
  id: string;
  label: string;
  icon: string;
  owner: string;
  ownerSection: 'catalogs' | 'partners' | 'marketing';
  apiNote: string;
  check: (product: CatalogProductMaster) => boolean;
  blockedReason: (product: CatalogProductMaster) => string | null;
  nextAction: string;
};

const READINESS_ROWS: ReadinessRow[] = [
  {
    id: 'partner-active',
    label: 'الشريك نشط',
    icon: '🤝',
    owner: 'الشركاء',
    ownerSection: 'partners',
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
    nextAction: 'إكمال partner onboarding في الشركاء',
  },
  {
    id: 'catalog-approved',
    label: 'المنتج معتمد في الكتالوج',
    icon: '✅',
    owner: 'الكتالوج',
    ownerSection: 'catalogs',
    apiNote: 'GET /catalog/products/:id/approval',
    check: (p) => p.approvalStage === 'catalog-adopted' || p.approvalStage === 'client-visible',
    blockedReason: (p) =>
      p.approvalStage === 'catalog-adopted' || p.approvalStage === 'client-visible'
        ? null
        : `مرحلة الاعتماد: ${p.approvalStage}`,
    nextAction: 'اعتماد المنتج عبر Item Approval Workflow',
  },
  {
    id: 'category-mapped',
    label: 'الفئة مربوطة بالتصنيف',
    icon: '🗂',
    owner: 'الكتالوج',
    ownerSection: 'catalogs',
    apiNote: 'GET /catalog/products/:id/category-mapping',
    check: (p) => !!p.categoryPath.main,
    blockedReason: (p) => p.categoryPath.main ? null : 'الفئة الرئيسية غير مربوطة',
    nextAction: 'ربط الفئة في Taxonomy Governance',
  },
  {
    id: 'duplicate-clean',
    label: 'لا تكرار مكتشف',
    icon: '🔍',
    owner: 'الكتالوج',
    ownerSection: 'catalogs',
    apiNote: 'GET /catalog/products/:id/duplicates',
    check: (p) => !p.conflictReason,
    blockedReason: (p) => p.conflictReason ? `تعارض: ${p.conflictReason}` : null,
    nextAction: 'حل التكرار في Duplicate Resolution',
  },
  {
    id: 'media-satisfied',
    label: 'سياسة الوسائط مُرضاة',
    icon: '🖼',
    owner: 'التسويق',
    ownerSection: 'marketing',
    apiNote: 'GET /catalog/products/:id/media-policy',
    check: (p) => !!p.mediaKey || !!p.imageUri,
    blockedReason: (p) =>
      p.mediaKey || p.imageUri ? null : 'لا يوجد media key أو صورة',
    nextAction: 'إضافة media key في Media Governance',
  },
  {
    id: 'identity-complete',
    label: 'هوية المنتج مكتملة (SKU/GTIN)',
    icon: '🏷',
    owner: 'الكتالوج',
    ownerSection: 'catalogs',
    apiNote: 'GET /catalog/products/:id/identity',
    check: (p) => !!p.sku,
    blockedReason: (p) => p.sku ? null : 'SKU ناقص — يحتاج تحقق هوية',
    nextAction: 'مراجعة الهوية في Identity Governance',
  },
  {
    id: 'client-visible-gate',
    label: 'بوابة الظهور للعميل',
    icon: '👁',
    owner: 'الكتالوج',
    ownerSection: 'catalogs',
    apiNote: 'GET /catalog/products/:id/client-visibility',
    check: (p) => p.approvalStage === 'client-visible',
    blockedReason: (p) =>
      p.approvalStage === 'client-visible' ? null : `المرحلة الحالية: ${p.approvalStage}`,
    nextAction: 'نشر المنتج عبر Publishing Gate',
  },
];

export function CatalogPublicationReadinessMatrix({
  products,
  onClose,
}: CatalogPublicationReadinessMatrixProps) {
  const { theme } = useTheme();

  const ownerColors: Record<ReadinessRow['ownerSection'], { bg: string; text: string; label: string }> = {
    catalogs: { bg: `${theme.brand}14`, text: theme.brand as string, label: 'الكتالوج' },
    partners: { bg: `${theme.success}14`, text: theme.success as string, label: 'الشركاء' },
    marketing: { bg: `${theme.warning}14`, text: theme.warning as string, label: 'التسويق' },
  };

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

  const rowStats = useMemo(() =>
    READINESS_ROWS.map((row) => {
      const satisfiedCount = products.filter(row.check).length;
      const blockedCount = products.length - satisfiedCount;
      const pct = products.length > 0 ? Math.round((satisfiedCount / products.length) * 100) : 0;
      return { ...row, satisfiedCount, blockedCount, pct };
    }),
    [products]
  );

  const allReady = stats.fullyReady === stats.total && stats.total > 0;
  const readinessPct = stats.total > 0 ? Math.round((stats.fullyReady / stats.total) * 100) : 0;

  return (
    <Surface
      tone="raised"
      padding={0}
      gap={0}
      style={{
        position: 'relative',
        zIndex: 1,
        width: 600,
        maxWidth: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 0,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.14)',
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Sticky Header ───────────────────────────────────── */}
      <div style={{
        padding: '14px 20px 12px',
        borderBottom: `1px solid ${theme.line}`,
        flexShrink: 0,
        background: `linear-gradient(135deg, ${theme.brandHeaderBackground}08 0%, transparent 100%)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16,
              backgroundColor: theme.brandHeaderBackground,
            }}>
              🚦
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: theme.brandHeaderBackground, lineHeight: 1.2 }}>
                مصفوفة جاهزية النشر
              </div>
              <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 1 }}>
                {READINESS_ROWS.length} متطلب · {stats.total} منتج
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            style={{
              appearance: 'none', border: `1px solid ${theme.line}`, borderRadius: radius.xs,
              backgroundColor: theme.surface, color: theme.textMuted, cursor: 'pointer',
              fontSize: 12, padding: '4px 10px', fontWeight: 700,
            }}
          >
            × إغلاق
          </button>
        </div>

        {/* Overall readiness bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: theme.surfaceInset, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${readinessPct}%`,
              backgroundColor: readinessPct === 100 ? theme.success : readinessPct > 50 ? theme.warning : theme.danger,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{
            fontSize: 11, fontWeight: 800, minWidth: 32, textAlign: 'left',
            color: readinessPct === 100 ? theme.success : readinessPct > 50 ? theme.warning : theme.danger,
          }}>
            {readinessPct}%
          </span>
        </div>
      </div>

      {/* ── Scrollable body ──────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { label: 'جاهز للنشر', value: stats.fullyReady, color: theme.success, bg: theme.successSurface ?? theme.surfaceInset },
            { label: 'جاهز جزئياً', value: stats.partiallyReady, color: theme.warning, bg: theme.warningSurface ?? theme.surfaceInset },
            { label: 'محجوب', value: stats.blocked, color: theme.danger, bg: theme.dangerSurface ?? theme.surfaceInset },
            { label: 'الإجمالي', value: stats.total, color: theme.brandHeaderBackground, bg: theme.surfaceInset },
          ].map((kpi) => (
            <div
              key={kpi.label}
              style={{
                borderRadius: 8, padding: '10px 8px', textAlign: 'center',
                backgroundColor: kpi.bg,
                border: `1px solid ${kpi.color}30`,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, color: kpi.color, lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 9, color: theme.textMuted, marginTop: 3, fontWeight: 600 }}>
                {kpi.label}
              </div>
            </div>
          ))}
        </div>

        {/* UI_PREVIEW notice — compact */}
        <div style={{
          padding: '7px 12px', borderRadius: radius.xs,
          backgroundColor: `${theme.warning}12`,
          border: `1px solid ${theme.warning}30`,
          fontSize: 10, color: theme.textMuted, lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 700, color: theme.warning }}>ربط API قيد التنفيذ</span>
          {' '}· visibility mapping: shared resolver ·{' '}
          <span style={{ direction: 'ltr', display: 'inline-block' }}>GET /catalog/readiness — not yet bound</span>
        </div>

        {/* Requirements matrix */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, marginBottom: 8, letterSpacing: 0.3 }}>
            متطلبات بوابة النشر ({READINESS_ROWS.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {rowStats.map((row) => {
              const allSatisfied = row.satisfiedCount === products.length;
              const allBlocked = row.satisfiedCount === 0;
              const ownerStyle = ownerColors[row.ownerSection];
              const borderColor = allSatisfied ? theme.success : allBlocked ? theme.danger : theme.warning;

              return (
                <div
                  key={row.id}
                  style={{
                    borderRadius: 8,
                    border: `1px solid ${borderColor}50`,
                    backgroundColor: theme.surface,
                    overflow: 'hidden',
                  }}
                >
                  {/* Row header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px',
                    borderBottom: !allSatisfied ? `1px solid ${theme.line}` : 'none',
                  }}>
                    {/* Status dot */}
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 900,
                      backgroundColor: allSatisfied ? `${theme.success}18` : allBlocked ? `${theme.danger}18` : `${theme.warning}18`,
                      color: allSatisfied ? theme.success : allBlocked ? theme.danger : theme.warning,
                    }}>
                      {allSatisfied ? '✓' : allBlocked ? '✗' : '~'}
                    </div>

                    {/* Label + owner */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700,
                        color: theme.brandHeaderBackground,
                        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                      }}>
                        <span>{row.icon} {row.label}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 700,
                          backgroundColor: ownerStyle.bg, color: ownerStyle.text,
                          padding: '1px 5px', borderRadius: 4,
                        }}>
                          {ownerStyle.label}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 900, lineHeight: 1,
                        color: allSatisfied ? theme.success : allBlocked ? theme.danger : theme.warning,
                      }}>
                        {row.satisfiedCount}<span style={{ fontSize: 10, fontWeight: 500, color: theme.textMuted }}>/{products.length}</span>
                      </span>
                      <div style={{ width: 48, height: 3, borderRadius: 2, backgroundColor: theme.surfaceInset, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          width: `${row.pct}%`,
                          backgroundColor: allSatisfied ? theme.success : allBlocked ? theme.danger : theme.warning,
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* Blocked details */}
                  {!allSatisfied && (
                    <div style={{ padding: '7px 12px 9px', backgroundColor: `${theme.danger}06` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: theme.warning, marginBottom: 3 }}>
                        ← {row.nextAction}
                      </div>
                      {products.slice(0, 2).map((p) => {
                        const reason = row.blockedReason(p);
                        if (!reason) return null;
                        return (
                          <div key={p.id} style={{ fontSize: 10, color: theme.textMuted, marginBottom: 1 }}>
                            • {p.name}: <span style={{ color: theme.danger }}>{reason}</span>
                          </div>
                        );
                      })}
                      {row.blockedCount > 2 && (
                        <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>
                          + {row.blockedCount - 2} منتج آخر
                        </div>
                      )}
                      <div style={{ fontSize: 9, color: theme.textMuted, marginTop: 4, direction: 'ltr', textAlign: 'right' }}>
                        {row.apiNote}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Final gate CTA */}
        <div style={{
          borderRadius: radius.sm,
          padding: '14px 16px',
          background: allReady
            ? `linear-gradient(135deg, ${theme.success}18, ${theme.success}08)`
            : `linear-gradient(135deg, ${theme.danger}12, ${theme.danger}06)`,
          border: `2px solid ${allReady ? theme.success : theme.danger}40`,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{
            fontSize: 14, fontWeight: 800, textAlign: 'center',
            color: allReady ? theme.success : theme.danger,
          }}>
            {allReady
              ? '✅ جميع المنتجات جاهزة — يمكن النشر'
              : `❌ ${stats.total - stats.fullyReady} منتج يحتاج إغلاق قبل النشر`}
          </div>
          <div style={{ fontSize: 10, color: theme.textMuted, textAlign: 'center' }}>
            لا يمكن النشر للعميل إلا بعد إغلاق جميع متطلبات المصفوفة
          </div>
          <button
            type="button"
            disabled={!allReady}
            style={{
              appearance: 'none', border: 'none', borderRadius: 8,
              padding: '9px 20px', fontSize: 13, fontWeight: 800,
              cursor: allReady ? 'pointer' : 'not-allowed',
              backgroundColor: allReady ? theme.success : theme.surfaceInset,
              color: allReady ? theme.textInverse : theme.textMuted,
              transition: 'all 0.15s',
            }}
          >
            🚀 نشر للعميل — POST /catalog/publish
          </button>
        </div>

        {/* Footer note */}
        <div style={{ fontSize: 9, color: theme.textMuted, textAlign: 'center', paddingBottom: 4 }}>
          visibility via shared resolver · POST /catalog/publish — not yet bound
        </div>
      </div>
    </Surface>
  );
}
