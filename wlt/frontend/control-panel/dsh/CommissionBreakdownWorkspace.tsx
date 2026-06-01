// P0-07: CP commission breakdown workspace — per-mode breakdown (WLT bridge — view-only).
// DSH displays WLT-owned commission structure. No rate computation or mutation inside DSH.
'use client';

import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';
import styles from '../../../../dsh/frontend/control-panel/shared/control-panel-surface.module.css';
import {
  getWltDshOrderCommissionBreakdown,
  WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW,
} from './dshFinancePreview';
import type { WltDshFulfillmentMode } from './dshFinancePreview';

export type CommissionBreakdownWorkspaceProps = {
  orderId?: string;
};

const FULFILLMENT_MODE_TABS: { id: WltDshFulfillmentMode; label: string }[] = [
  { id: 'bthwani_delivery', label: 'توصيل بثواني' },
  { id: 'partner_delivery', label: 'توصيل المتجر' },
  { id: 'pickup', label: 'استلام بنفسي' },
];

const LINE_ITEM_LABELS: Record<string, string> = {
  deliveryFee: 'رسوم التوصيل',
  platformCommission: 'عمولة المنصة',
  captainPayout: 'مستحقات الكابتن',
  partnerCourierCost: 'تكلفة موصل المتجر',
  partnerNet: 'صافي الشريك',
};

type LineItemKey = 'deliveryFee' | 'platformCommission' | 'captainPayout' | 'partnerCourierCost' | 'partnerNet';

export function CommissionBreakdownWorkspace({ orderId = '—' }: CommissionBreakdownWorkspaceProps) {
  const { theme } = useTheme();
  const [activeMode, setActiveMode] = React.useState<WltDshFulfillmentMode>('bthwani_delivery');
  const breakdown = getWltDshOrderCommissionBreakdown(activeMode);

  const lineItems: LineItemKey[] = ['deliveryFee', 'platformCommission', 'captainPayout', 'partnerCourierCost', 'partnerNet'];

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>تفاصيل العمولة</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>WLT — عرض فقط</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>طلب {orderId}</p>
          </Box>
        </div>
      </header>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>

            {/* WLT boundary notice */}
            <Box padding={3} background="warningSurface" radiusToken="md" gap={1}>
              <Text role="label" style={{ fontWeight: '800', textAlign: 'right' }}>معاينة — WLT عرض فقط</Text>
              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                العمولة الحقيقية هي per-partner + per-mode وتُدار بالكامل عبر WLT. لا تُستخدم هذه الشاشة كمصدر مالي أو محاسبي.
              </Text>
            </Box>

            {/* Mode tabs */}
            <Box gap={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>اختر وضع التنفيذ:</Text>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', direction: 'rtl' }}>
                {FULFILLMENT_MODE_TABS.map((tab) => {
                  const isActive = activeMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveMode(tab.id)}
                      style={{
                        padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                        fontWeight: 700, fontSize: '12px',
                        background: isActive ? theme.brand : theme.surfaceInset,
                        color: isActive ? theme.textInverse : theme.text,
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </Box>

            {/* Per-mode line items */}
            <Box gap={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                بنود {breakdown.fulfillmentModeLabel}:
              </Text>
              {lineItems.map((key) => {
                const item = breakdown[key];
                const label = LINE_ITEM_LABELS[key];
                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px', borderRadius: '8px',
                      background: item.applies ? theme.surfaceRaised : theme.surfaceInset,
                      opacity: item.applies ? 1 : 0.55,
                      border: `1px solid ${theme.line}`,
                      direction: 'rtl',
                    }}
                  >
                    <Text role="bodySm" tone={item.applies ? 'default' : 'muted'}>{label}</Text>
                    <Text
                      role="bodySm"
                      style={{
                        fontWeight: item.applies ? 700 : 400,
                        color: item.applies ? theme.brand : theme.textMuted,
                        fontFamily: 'monospace',
                        direction: 'ltr',
                        textAlign: 'right',
                      }}
                    >
                      {item.applies ? item.label : `— ${item.reason}`}
                    </Text>
                  </div>
                );
              })}
            </Box>

            {/* Per-partner rate table */}
            <Box gap={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                جدول العمولة — لكل شريك ولكل وضع (UI_PREVIEW_ONLY):
              </Text>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', direction: 'rtl' }}>
                  <thead>
                    <tr style={{ background: theme.surfaceInset }}>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: theme.text }}>الشريك</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: theme.text }}>توصيل بثواني</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: theme.text }}>توصيل المتجر</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: theme.text }}>استلام بنفسي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW.map((row) => (
                      <tr key={row.partnerId} style={{ borderTop: `1px solid ${theme.line}` }}>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: theme.text }}>{row.storeLabel}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', color: theme.brand, fontFamily: 'monospace' }}>{row.rates.bthwani_delivery}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', color: theme.brand, fontFamily: 'monospace' }}>{row.rates.partner_delivery}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', color: theme.brand, fontFamily: 'monospace' }}>{row.rates.pickup}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                الأرقام الحقيقية per-partner + per-mode تُدار في محرك WLT. هذا العرض هيكلي فقط.
              </Text>
            </Box>

          </Box>
        </div>
      </main>
    </div>
  );
}

export default CommissionBreakdownWorkspace;
