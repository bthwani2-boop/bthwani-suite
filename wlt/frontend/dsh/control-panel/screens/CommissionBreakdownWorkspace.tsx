// P0-07: CP commission breakdown workspace — per-mode breakdown (WLT bridge — view-only).
// DSH displays WLT-owned commission structure. No rate computation or mutation inside DSH.
'use client';

import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';
import styles from '../shared/wlt-surface.module.css';
import type { WltDshFulfillmentMode } from '../../shared';

type LineItemShape = { applies: true; label: string } | { applies: false; reason: string };
type ModeBreakdown = {
  fulfillmentModeLabel: string;
  deliveryFee: LineItemShape;
  platformCommission: LineItemShape;
  captainPayout: LineItemShape;
  partnerCourierCost: LineItemShape;
  partnerNet: LineItemShape;
};

const BREAKDOWN_BY_MODE: Record<WltDshFulfillmentMode, ModeBreakdown> = {
  bthwani_delivery: {
    fulfillmentModeLabel: 'توصيل بثواني',
    deliveryFee: { applies: true, label: 'WLT' },
    platformCommission: { applies: true, label: 'WLT' },
    captainPayout: { applies: true, label: 'WLT' },
    partnerCourierCost: { applies: false, reason: 'لا ينطبق — كابتن بثواني هو المسؤول' },
    partnerNet: { applies: true, label: 'WLT' },
  },
  partner_delivery: {
    fulfillmentModeLabel: 'توصيل المتجر',
    deliveryFee: { applies: true, label: 'حسب سياسة المتجر' },
    platformCommission: { applies: true, label: 'WLT' },
    captainPayout: { applies: false, reason: 'لا ينطبق — لا كابتن في توصيل المتجر' },
    partnerCourierCost: { applies: true, label: 'حسب اتفاق المتجر' },
    partnerNet: { applies: true, label: 'WLT' },
  },
  pickup: {
    fulfillmentModeLabel: 'استلام بنفسي',
    deliveryFee: { applies: false, reason: 'لا رسوم توصيل — العميل يستلم بنفسه' },
    platformCommission: { applies: true, label: 'WLT' },
    captainPayout: { applies: false, reason: 'لا ينطبق — لا كابتن في الاستلام الذاتي' },
    partnerCourierCost: { applies: false, reason: 'لا ينطبق — لا موصل في الاستلام الذاتي' },
    partnerNet: { applies: true, label: 'WLT' },
  },
};

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
  const breakdown = BREAKDOWN_BY_MODE[activeMode];

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
            <Box padding={3} background="warningSurface" radiusToken="md" gap={1}>
              <Text role="label" weight="black" style={{ textAlign: 'right' }}>نظرة عامة على العمولات</Text>
              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                العمولة الحقيقية هي per-partner + per-mode وتُدار بالكامل عبر WLT. لا تُستخدم هذه الشاشة كمصدر مالي أو محاسبي.
              </Text>
            </Box>

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

            <Box gap={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>بنود {breakdown.fulfillmentModeLabel}:</Text>
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
                    <Text role="bodySm" family="mono" weight={item.applies ? 'bold' : 'regular'} style={{ color: item.applies ? theme.brand : theme.textMuted, direction: 'ltr', textAlign: 'right' }}>
                      {item.applies ? item.label : `— ${item.reason}`}
                    </Text>
                  </div>
                );
              })}
            </Box>

            <Box padding={3} background="surfaceInset" radiusToken="md" border borderTone="line" gap={1}>
              <Text role="label" weight="bold" style={{ textAlign: 'right' }}>جدول العمولة لكل شريك ولكل وضع</Text>
              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                في انتظار WLT runtime — معدلات العمولة الفعلية per-partner + per-mode تُدار في محرك WLT ولم تُوصل بعد لهذه الشاشة.
              </Text>
            </Box>
          </Box>
        </div>
      </main>
    </div>
  );
}

export default CommissionBreakdownWorkspace;
