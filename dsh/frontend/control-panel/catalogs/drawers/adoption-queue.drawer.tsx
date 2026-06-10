'use client';

/**
 * CatalogAdoptionQueueWorkspace — UI_PREVIEW_ONLY
 * Owner: control-panel/catalogs
 * API boundary: GET /catalog/adoption-queue (not yet bound) · PATCH /catalog/products/:id/stage (not yet bound)
 *
 * Final catalog adoption step: items that completed marketing-review are
 * adopted (catalog-adopted) and activated (client-visible) here.
 * control-panel/catalogs is the ONLY surface that can adopt or activate.
 *
 * Constraints:
 * - No direct Tamagui import. All UI via @bthwani/ui-kit.
 * - No canonical data mutation — all actions emit CatalogPreviewProposal via onProposal.
 * - Uses shared workflow store for preview-state simulation only.
 * - onClose + onProposal are required (router-ready contract).
 */

import React from 'react';
import { Box, Button, Surface, Text, useTheme,
  radius,
} from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader, WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  getCatalogAdoptionItems,
  adoptCatalogCentral,
  adoptCatalogException,
  activateClientVisible,
  returnToMarketing,
  rejectFromCatalog,
} from '../../../data/marketing.preview-data';
import { type ApprovalRecord, type ApprovalStage, translateStage, translateEntityType, translateOwner } from '../../../shared/workflow';
import type { CatalogPreviewProposal } from '../catalogs.model';

// ── Types ─────────────────────────────────────────────────────────────────────

export type CatalogAdoptionQueueWorkspaceProps = {
  onClose: () => void;
  onProposal: (proposal: CatalogPreviewProposal) => void;
};

type CatalogQueueAction = 'adopt-central' | 'adopt-exception' | 'visible' | 'reject' | 'fix';

type CatalogQueueActionResult = {
  itemId: string;
  displayCaption: string;
  action: CatalogQueueAction;
  label: string;
  nextStage: ApprovalStage;
  ownerLabel: string;
  apiBoundary: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveActionLabel(action: CatalogQueueAction): string {
  switch (action) {
    case 'adopt-central':   return 'اعتماد مركزي (catalog-adopted)';
    case 'adopt-exception': return 'استثناء شريك (catalog-adopted)';
    case 'visible':         return 'تفعيل للعميل (client-visible)';
    case 'reject':          return 'رفض نهائي (rejected)';
    case 'fix':             return 'إعادة للتسويق (needs-fix)';
  }
}

function resolveNextStage(action: CatalogQueueAction): ApprovalStage {
  switch (action) {
    case 'adopt-central':
    case 'adopt-exception': return 'catalog-adopted';
    case 'visible':         return 'client-visible';
    case 'reject':          return 'rejected';
    case 'fix':             return 'needs-fix';
  }
}

function resolveApiBoundary(action: CatalogQueueAction): string {
  switch (action) {
    case 'adopt-central':   return 'PATCH /catalog/products/:id/stage → catalog-adopted (central)';
    case 'adopt-exception': return 'PATCH /catalog/products/:id/stage → catalog-adopted (exception)';
    case 'visible':         return 'PATCH /catalog/products/:id/stage → client-visible';
    case 'reject':          return 'PATCH /catalog/products/:id/stage → rejected';
    case 'fix':             return 'PATCH /catalog/products/:id/stage → needs-fix (→ marketing)';
  }
}

function resolveOwnerLabel(action: CatalogQueueAction): string {
  if (action === 'fix') return 'control-panel/marketing';
  return 'control-panel/catalogs';
}

function getStageConfig(stage: ApprovalStage, theme: any): { label: string; color: string; bg: string } {
  switch (stage) {
    case 'marketing-approved': return { label: translateStage(stage), color: theme.brand, bg: `${theme.brand}14` };
    case 'catalog-adopted':    return { label: translateStage(stage), color: theme.success, bg: `${theme.success}14` };
    case 'client-visible':     return { label: translateStage(stage), color: theme.success, bg: `${theme.success}14` };
    case 'needs-fix':          return { label: translateStage(stage), color: theme.warning, bg: `${theme.warning}14` };
    case 'rejected':           return { label: translateStage(stage), color: theme.danger, bg: `${theme.danger}10` };
    default:                   return { label: translateStage(stage), color: theme.textMuted, bg: `${theme.textMuted}10` };
  }
}

const PAGE_SIZE = 6;

// ── Component ─────────────────────────────────────────────────────────────────

export function CatalogAdoptionQueueWorkspace({ onClose, onProposal }: CatalogAdoptionQueueWorkspaceProps) {
  const { theme } = useTheme();
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);
  const [page, setPage] = React.useState(1);
  const [lastResult, setLastResult] = React.useState<CatalogQueueActionResult | null>(null);

  const refresh = React.useCallback(() => setItems(getCatalogAdoptionItems()), []);

  React.useEffect(() => { refresh(); }, [refresh]);

  // Eligible items: those that arrived from marketing or need final adoption decision
  const eligibleItems = React.useMemo(
    () => items.filter((item) =>
      ['marketing-approved', 'catalog-adopted', 'client-visible', 'needs-fix', 'rejected'].includes(item.stage)
    ),
    [items],
  );

  const totalPages = Math.max(1, Math.ceil(eligibleItems.length / PAGE_SIZE));
  const visibleItems = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return eligibleItems.slice(start, start + PAGE_SIZE);
  }, [eligibleItems, page]);

  React.useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  // Stats
  const pendingCount    = items.filter((i) => i.stage === 'marketing-approved').length;
  const adoptedCount    = items.filter((i) => i.stage === 'catalog-adopted').length;
  const visibleCount    = items.filter((i) => i.stage === 'client-visible').length;
  const needsFixCount   = items.filter((i) => i.stage === 'needs-fix').length;

  const handleAction = React.useCallback((id: string, action: CatalogQueueAction) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    // Preview-state simulation (local only — no canonical mutation)
    switch (action) {
      case 'adopt-central':   adoptCatalogCentral(id); break;
      case 'adopt-exception': adoptCatalogException(id); break;
      case 'visible':         activateClientVisible(id); break;
      case 'fix':             returnToMarketing(id); break;
      case 'reject':          rejectFromCatalog(id); break;
    }

    const result: CatalogQueueActionResult = {
      itemId: id,
      displayCaption: item.title,
      action,
      label: resolveActionLabel(action),
      nextStage: resolveNextStage(action),
      ownerLabel: resolveOwnerLabel(action),
      apiBoundary: resolveApiBoundary(action),
    };
    setLastResult(result);

    // Emit proposal — proposal pattern (router-ready, matches all other workspaces)
    onProposal({
      id: `adoption-${action}-${id}-${Date.now()}`,
      type: action === 'visible' ? 'visibility-change' : 'bulk-approve',
      productId: id,
      label: result.label,
      status: 'ready-for-api',
      owner: action === 'fix' ? 'control-panel-marketing' : 'control-panel-catalogs',
      note: `UI_PREVIEW_ONLY | ${result.label} — "${item.title}"`,
      apiBoundary: result.apiBoundary,
    });

    refresh();
  }, [items, onProposal, refresh]);

  return (
    <Surface
      tone="raised"
      padding={0}
      gap={0}
      style={{
        position: 'relative', zIndex: 1,
        width: 580, maxWidth: '100%', height: '100%',
        overflow: 'hidden', borderRadius: 0,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.14)',
        direction: 'rtl',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── Sticky header ──────────────────────────────────────── */}
      <div style={{
        padding: '14px 18px 10px',
        borderBottom: `1px solid ${theme.line}`,
        flexShrink: 0,
        background: `linear-gradient(135deg, ${theme.brandHeaderBackground}08 0%, transparent 100%)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              backgroundColor: theme.brandHeaderBackground,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>✅</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: theme.brandHeaderBackground, lineHeight: 1.2 }}>
                اعتماد الكتالوج الموحد
              </div>
              <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>
                المرحلة النهائية — تسويق معتمد → مُدمَج في الكتالوج → ظاهر للعميل
              </div>
            </div>
          </div>
          <button
            type="button" onClick={onClose}
            style={{
              appearance: 'none', border: `1px solid ${theme.line}`, borderRadius: radius.xs,
              backgroundColor: theme.surface, color: theme.textMuted,
              cursor: 'pointer', fontSize: 12, padding: '4px 10px', fontWeight: 700,
            }}
          >
            × إغلاق
          </button>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[
            { label: 'بانتظار الاعتماد', value: pendingCount,  color: theme.brand as string },
            { label: 'مُعتمَد (catalog-adopted)', value: adoptedCount,   color: theme.success as string },
            { label: 'ظاهر للعميل', value: visibleCount,   color: theme.success as string },
            { label: 'يحتاج تعديل', value: needsFixCount,  color: theme.warning as string },
          ].map((k) => (
            <div key={k.label} style={{
              borderRadius: radius.xs, padding: '7px 6px', textAlign: 'center',
              backgroundColor: `${k.color}12`,
              border: `1px solid ${k.color}30`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 8, color: theme.textMuted, marginTop: 2, fontWeight: 600 }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Last action result ──────────────────────────────────── */}
      {lastResult && (
        <div
          role="status" aria-live="polite"
          style={{
            margin: '8px 16px 0', padding: '8px 12px', borderRadius: 7,
            backgroundColor: theme.surfaceInset,
            border: `1px solid ${theme.line}`,
            borderRight: `3px solid ${theme.brand}`,
            display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.brandHeaderBackground }}>
            ✓ آخر إجراء: {lastResult.label}
          </div>
          <div style={{ fontSize: 10, color: theme.textMuted }}>
            {lastResult.displayCaption} · المالك: {lastResult.ownerLabel}
          </div>
          <div style={{ fontSize: 9, color: theme.textMuted, direction: 'ltr', textAlign: 'right' }}>
            {lastResult.apiBoundary} — not yet bound
          </div>
        </div>
      )}

      {/* ── Scrollable body ─────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>

        {/* UI_PREVIEW notice */}
        <div style={{
          padding: '6px 10px', borderRadius: 5, marginBottom: 4,
          backgroundColor: `${theme.warning as string}10`,
          border: `1px solid ${theme.warning as string}28`,
          fontSize: 9, color: theme.textMuted,
        }}>
          <span style={{ fontWeight: 700, color: theme.warning as string }}>UI_PREVIEW_ONLY</span>
          {' · API: GET /catalog/adoption-queue · PATCH /catalog/products/:id/stage — not yet bound'}
        </div>

        {/* Empty state */}
        {eligibleItems.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flex: 1, gap: 8, padding: 32, textAlign: 'center',
          }}>
            <div style={{ fontSize: 32 }}>📭</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.textMuted }}>لا توجد عناصر مؤهلة</div>
            <div style={{ fontSize: 11, color: theme.textMuted, maxWidth: 260 }}>
              كل العناصر إمّا لم تصل بعد من التسويق، أو أصبحت جاهزة للعميل بالفعل
            </div>
          </div>
        )}

        {/* Queue items */}
        {visibleItems.map((item) => {
          const stageConfig = getStageConfig(item.stage, theme);
          const isMarketingApproved = item.stage === 'marketing-approved';
          const isCatalogAdopted    = item.stage === 'catalog-adopted';
          const isTerminal          = ['client-visible', 'needs-fix', 'rejected'].includes(item.stage);

          return (
            <div
              key={item.id}
              style={{
                borderRadius: 8, border: `1px solid ${theme.line}`,
                backgroundColor: theme.surface, overflow: 'hidden',
              }}
            >
              {/* Item header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                borderBottom: (!isTerminal) ? `1px solid ${theme.line}` : 'none',
              }}>
                {/* Stage badge */}
                <div style={{
                  fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: 4,
                  backgroundColor: stageConfig.bg, color: stageConfig.color, flexShrink: 0,
                }}>
                  {stageConfig.label}
                </div>

                {/* Title + meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: theme.brandHeaderBackground,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 1 }}>
                    {translateEntityType(item.entityType)} · المصدر: {translateOwner(item.source)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {isMarketingApproved && (
                <div style={{ padding: '8px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', backgroundColor: `${stageConfig.bg}` }}>
                  <div style={{ fontSize: 9, color: theme.textMuted, width: '100%', marginBottom: 2 }}>
                    وصل من التسويق — اختر قرار الاعتماد:
                  </div>
                  <Button label="اعتماد مركزي" tone="primary"  size="sm" onPress={() => handleAction(item.id, 'adopt-central')} />
                  <Button label="استثناء شريك" tone="secondary" size="sm" onPress={() => handleAction(item.id, 'adopt-exception')} />
                  <Button label="إعادة للتسويق" tone="danger"  size="sm" onPress={() => handleAction(item.id, 'fix')} />
                </div>
              )}

              {isCatalogAdopted && (
                <div style={{ padding: '8px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', backgroundColor: `${stageConfig.bg}` }}>
                  <div style={{ fontSize: 9, color: theme.textMuted, width: '100%', marginBottom: 2 }}>
                    مُعتمَد في الكتالوج — جاهز للتفعيل النهائي:
                  </div>
                  <Button label="🚀 تفعيل للعميل (client-visible)" tone="brand" size="sm" onPress={() => handleAction(item.id, 'visible')} />
                  <Button label="إعادة مراجعة" tone="danger" size="sm" onPress={() => handleAction(item.id, 'fix')} />
                </div>
              )}

              {item.stage === 'client-visible' && (
                <div style={{ padding: '6px 12px', fontSize: 10, color: theme.success as string, fontWeight: 700, backgroundColor: `${theme.success}10` }}>
                  ✓ ظاهر للعميل — لا إجراء مطلوب
                </div>
              )}

              {item.stage === 'needs-fix' && (
                <div style={{ padding: '6px 12px', fontSize: 10, color: theme.warning as string, fontWeight: 700, backgroundColor: `${theme.warning}10` }}>
                  ⟳ أُعيد للتسويق — بانتظار التعديل
                </div>
              )}

              {item.stage === 'rejected' && (
                <div style={{ padding: '6px 12px', fontSize: 10, color: theme.danger as string, fontWeight: 700, backgroundColor: `${theme.danger}10` }}>
                  ✗ مرفوض نهائياً
                </div>
              )}
            </div>
          );
        })}

        {/* Pager */}
        {eligibleItems.length > PAGE_SIZE && (
          <WebControlPanelCompactPager
            page={page}
            totalPages={totalPages}
            summaryLabel={`عرض ${visibleItems.length} من ${eligibleItems.length} عنصر`}
            onPrevious={page > 1 ? () => setPage((p) => p - 1) : undefined}
            onNext={page < totalPages ? () => setPage((p) => p + 1) : undefined}
          />
        )}

        {/* Footer */}
        <div style={{ fontSize: 9, color: theme.textMuted, textAlign: 'center', paddingTop: 8 }}>
          UI_PREVIEW_ONLY · control-panel/catalogs هو السطح الوحيد المخوّل بالاعتماد النهائي
        </div>
      </div>
    </Surface>
  );
}
