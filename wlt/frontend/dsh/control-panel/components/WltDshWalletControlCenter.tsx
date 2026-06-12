'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { formatWltYer } from '../financeContracts';
import type { WltDshFinanceRuntimeResult } from '../adapters/wltDshFinanceRuntime.adapter';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

type WalletSummaryRow = {
  actorLabel: string;
  actorId: string;
  actorType: string;
  availableLabel: string;
  pendingLabel: string;
  heldLabel: string;
  status: 'ready' | 'needs_action' | 'blocked';
  statusLabel: string;
  nextAction?: string;
};

function buildRuntimeWalletRows(runtimeFinance: WltDshFinanceRuntimeResult | null): WalletSummaryRow[] {
  if (runtimeFinance?.state !== 'runtime') {
    return [];
  }

  const grouped = new Map<string, Array<(typeof runtimeFinance.data.ledgerEntries)[number]>>();
  for (const entry of runtimeFinance.data.ledgerEntries) {
    const key = entry.subject || 'platform';
    const current = grouped.get(key);
    if (current) {
      current.push(entry);
    } else {
      grouped.set(key, [entry]);
    }
  }

  return Array.from(grouped.entries())
    .map(([subject, entries]) => {
      let availableMinorUnits = 0;
      let pendingMinorUnits = 0;
      let heldMinorUnits = 0;

      for (const entry of entries) {
        const amountMinorUnits = Math.round(entry.amount * 100);
        availableMinorUnits += amountMinorUnits;
        if (entry.status !== 'COMPLETED') {
          pendingMinorUnits += Math.abs(amountMinorUnits);
        }
        if (entry.status === 'FAILED' || entry.status === 'REVERSED') {
          heldMinorUnits += Math.abs(amountMinorUnits);
        }
      }

      const actorType =
        subject.startsWith('client') || subject.startsWith('customer')
          ? 'عميل'
          : subject.startsWith('partner') || subject.startsWith('store')
            ? 'شريك'
            : subject.startsWith('captain')
              ? 'كابتن'
              : subject.startsWith('field')
                ? 'ميداني'
                : 'منصة';

      const status: WalletSummaryRow['status'] =
        heldMinorUnits > 0
          ? 'blocked'
          : pendingMinorUnits > 0
            ? 'needs_action'
            : 'ready';

      const statusLabel =
        status === 'blocked'
          ? 'محجوز'
          : status === 'needs_action'
            ? 'قيد المراجعة'
            : 'نشط';

      return {
        actorLabel: `${actorType} runtime`,
        actorId: subject,
        actorType,
        availableLabel: formatWltYer(availableMinorUnits),
        pendingLabel: formatWltYer(pendingMinorUnits),
        heldLabel: formatWltYer(heldMinorUnits),
        status,
        statusLabel,
        nextAction:
          status === 'blocked'
            ? 'مراجعة الحركات الفاشلة أو المعكوسة'
            : status === 'needs_action'
              ? 'اعتماد ومطابقة مع WLT'
              : undefined,
      } satisfies WalletSummaryRow;
    })
    .sort((left, right) => left.actorLabel.localeCompare(right.actorLabel, 'ar'));
}


function resolveStatusClass(status: WalletSummaryRow['status']): string {
  if (status === 'blocked') return wltStyles.walletRowStatusBlocked;
  if (status === 'needs_action') return wltStyles.walletRowStatusAction;
  return wltStyles.walletRowStatusReady;
}

function resolveCardClass(status: WalletSummaryRow['status']): string {
  if (status === 'blocked') return wltStyles.walletCardBlocked;
  if (status === 'needs_action') return wltStyles.walletCardAction;
  return wltStyles.walletCardReady;
}

function WalletRowCard({ row, onSelect }: { row: WalletSummaryRow; onSelect: (row: WalletSummaryRow) => void }) {
  return (
    <div
      onClick={() => onSelect(row)}
      className={`${wltStyles.accordionCard} ${resolveCardClass(row.status)}`}
    >
      <div className={wltStyles.accordionCardHeader}>
        <div className={wltStyles.infoGroupRight}>
          <div className={wltStyles.walletRowCardInfo}>
            <span className={wltStyles.walletRowCardTitle}>
              {row.actorLabel}
            </span>
            <span className={wltStyles.walletRowCardSubtitle}>
              {row.actorType} · {row.actorId}
            </span>
          </div>
        </div>
        <div className={wltStyles.infoGroupLeft}>
          <div className={wltStyles.walletRowAmountGroup}>
            <span className={wltStyles.walletRowAmount}>
              {row.availableLabel}
            </span>
            <span className={`${wltStyles.walletRowStatus} ${resolveStatusClass(row.status)}`}>
              {row.statusLabel}
            </span>
            {row.nextAction && (
              <span className={wltStyles.walletRowNextAction}>
                {row.nextAction} ←
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={wltStyles.walletRowMeta}>
        <span className={wltStyles.walletRowMetaLabel}>
          معلق: <strong className={wltStyles.walletRowMetaPending}>{row.pendingLabel}</strong>
        </span>
        <span className={wltStyles.walletRowMetaLabel}>
          محجوز: <strong className={wltStyles.walletRowMetaHeld}>{row.heldLabel}</strong>
        </span>
      </div>
    </div>
  );
}

export function WltDshWalletControlCenter({
  runtimeFinance = null,
}: {
  runtimeFinance?: WltDshFinanceRuntimeResult | null;
} = {}) {
  const [selectedRow, setSelectedRow] = React.useState<WalletSummaryRow | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'client' | 'partner' | 'captain' | 'field'>('all');
  const runtimeRows = React.useMemo(() => buildRuntimeWalletRows(runtimeFinance), [runtimeFinance]);

  const allRows = React.useMemo<WalletSummaryRow[]>(() => runtimeRows, [runtimeRows]);

  const filteredRows = React.useMemo(() => {
    if (activeFilter === 'all') return allRows;
    const map: Record<string, string> = { client: 'عميل', partner: 'شريك', captain: 'كابتن', field: 'ميداني' };
    return allRows.filter((r) => r.actorType === map[activeFilter]);
  }, [allRows, activeFilter]);

  const blockedCount = allRows.filter((r) => r.status === 'blocked').length;
  const needsActionCount = allRows.filter((r) => r.status === 'needs_action').length;

  const filterLabels: Array<{ id: typeof activeFilter; label: string }> = [
    { id: 'all', label: `الكل (${allRows.length})` },
    { id: 'client', label: 'عملاء' },
    { id: 'partner', label: 'شركاء' },
    { id: 'captain', label: 'كباتن' },
    { id: 'field', label: 'ميدانيون' },
  ];

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <div className={wltStyles.walletCenterHeader}>
          <div>
            <Text role="titleMd" weight="black">مركز تحكم المحافظ</Text>
            <Text role="bodySm" tone="soft" style={{ marginTop: 4 }}>
              نظرة موحدة على جميع محافظ العملاء والشركاء والكباتن والميدانيين
            </Text>
          </div>
          <div className={wltStyles.walletCenterBadges}>
            {blockedCount > 0 && (
              <span className={wltStyles.walletBadgeBlocked}>
                {blockedCount} محجوب
              </span>
            )}
            {needsActionCount > 0 && (
              <span className={wltStyles.walletBadgeNeedsAction}>
                {needsActionCount} يحتاج إجراء
              </span>
            )}
          </div>
        </div>
      </Box>

      <div className={wltStyles.walletFilterBar}>
        {filterLabels.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={`${wltStyles.walletFilterBtn} ${activeFilter === f.id ? wltStyles.walletFilterBtnActive : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={selectedRow ? `${wltStyles.walletGrid} ${wltStyles.walletGridWithDetail}` : wltStyles.walletGrid}>
        <Box gap={2}>
          {filteredRows.length === 0 ? (
            <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line">
              <Text role="bodySm" tone="muted" style={{ textAlign: 'center' }}>
                لا توجد محافظ لهذا التصفية
              </Text>
            </Box>
          ) : (
            filteredRows.map((row) => (
              <WalletRowCard
                key={`${row.actorType}-${row.actorId}`}
                row={row}
                onSelect={setSelectedRow}
              />
            ))
          )}
        </Box>

        {selectedRow && (
          <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" gap={3}>
            <div className={wltStyles.walletDetailHeader}>
              <span className={wltStyles.walletDetailTitle}>
                تفاصيل المحفظة
              </span>
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                className={wltStyles.walletDetailCloseBtn}
              >
                ✕
              </button>
            </div>
            <hr className={wltStyles.walletDetailSeparator} />
            <div className={wltStyles.walletDetailPanel}>
              {[
                { label: 'الطرف', value: `${selectedRow.actorLabel} (${selectedRow.actorType})` },
                { label: 'المعرّف', value: selectedRow.actorId },
                { label: 'الرصيد المتاح', value: selectedRow.availableLabel },
                { label: 'المعلق', value: selectedRow.pendingLabel },
                { label: 'المحجوز', value: selectedRow.heldLabel },
                { label: 'الحالة', value: selectedRow.statusLabel },
                ...(selectedRow.nextAction ? [{ label: 'الإجراء التالي', value: selectedRow.nextAction }] : []),
              ].map(({ label, value }) => (
                <div key={label} className={wltStyles.walletDetailRow}>
                  <span className={wltStyles.walletDetailKey}>{label}</span>
                  <span className={wltStyles.walletDetailVal}>{value}</span>
                </div>
              ))}
            </div>
          </Box>
        )}
      </div>
    </Box>
  );
}

export default WltDshWalletControlCenter;
