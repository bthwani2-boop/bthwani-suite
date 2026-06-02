'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  getWltDshAccountStatementsPreview,
  getWltDshCaptainSettlementStatementsPreview,
  getWltFieldCommissionStatementsPreview,
  getWltDshPartnerSettlementStatementsPreview,
  formatWltYer,
} from '../financeContracts';
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

function buildClientWalletRows(): WalletSummaryRow[] {
  const statements = getWltDshAccountStatementsPreview();
  return statements
    .filter((s) => s.actor === 'customer_wallet')
    .map((s) => ({
      actorLabel: s.actorLabel,
      actorId: s.actorId,
      actorType: 'عميل',
      availableLabel: s.closingBalanceLabel,
      pendingLabel: s.holdsLabel,
      heldLabel: s.holdsLabel,
      status: 'ready' as const,
      statusLabel: 'نشط',
    }));
}

function buildPartnerWalletRows(): WalletSummaryRow[] {
  const statements = getWltDshPartnerSettlementStatementsPreview();
  return statements.map((s) => ({
    actorLabel: s.partnerName,
    actorId: s.partnerId,
    actorType: 'شريك',
    availableLabel: s.netSettlementLabel,
    pendingLabel: s.remainingPayableLabel,
    heldLabel: s.status === 'held' ? s.remainingPayableLabel : formatWltYer(0),
    status: (s.status === 'held' ? 'blocked' : s.status === 'ready_for_payout' ? 'needs_action' : 'ready') as WalletSummaryRow['status'],
    statusLabel: s.status === 'held' ? 'محجوز' : s.status === 'ready_for_payout' ? 'جاهز للصرف' : 'نشط',
    nextAction: s.status === 'ready_for_payout' ? 'صرف مستحقات' : s.status === 'held' ? 'مراجعة سبب الحجز' : undefined,
  }));
}

function buildCaptainWalletRows(): WalletSummaryRow[] {
  const statements = getWltDshCaptainSettlementStatementsPreview();
  return statements.map((s) => ({
    actorLabel: s.captainName,
    actorId: s.captainId,
    actorType: 'كابتن',
    availableLabel: s.grossEarningsLabel,
    pendingLabel: s.outstandingCodLiabilityLabel,
    heldLabel: s.hasEligibilityBlock ? s.eligibilityShortfallLabel : formatWltYer(0),
    status: (s.status === 'blocked' ? 'blocked' : s.hasEligibilityBlock || s.outstandingCodLiabilityLabel !== formatWltYer(0) ? 'needs_action' : 'ready') as WalletSummaryRow['status'],
    statusLabel: s.status === 'blocked' ? 'موقوف' : s.hasEligibilityBlock ? 'رصيد ضامن غير كافٍ' : 'نشط',
    nextAction: s.hasEligibilityBlock ? 'شحن رصيد ضامن' : s.status === 'pending_clearance' ? 'إيداع COD' : undefined,
  }));
}

function buildFieldWalletRows(): WalletSummaryRow[] {
  const statements = getWltFieldCommissionStatementsPreview();
  return statements.map((s) => ({
    actorLabel: s.fieldAgentName,
    actorId: s.fieldAgentId,
    actorType: 'ميداني',
    availableLabel: formatWltYer(s.totalCommissionMinorUnits),
    pendingLabel: formatWltYer(s.remainingMinorUnits),
    heldLabel: formatWltYer(s.heldMinorUnits),
    status: (s.heldMinorUnits > 0 ? 'needs_action' : s.status === 'paid_preview' ? 'ready' : 'needs_action') as WalletSummaryRow['status'],
    statusLabel: s.heldMinorUnits > 0 ? 'محجوز جزئي' : s.status === 'paid_preview' ? 'مدفوع' : 'قيد المراجعة',
    nextAction: s.heldMinorUnits > 0 ? 'مراجعة سبب الحجز' : undefined,
  }));
}

function WalletRowCard({ row, onSelect }: { row: WalletSummaryRow; onSelect: (row: WalletSummaryRow) => void }) {
  const statusColor =
    row.status === 'blocked' ? 'var(--bth-danger-text)' :
    row.status === 'needs_action' ? 'var(--bth-warning-text)' :
    'var(--bth-success-text)';

  const borderColor =
    row.status === 'blocked' ? 'var(--bth-danger-text)' :
    row.status === 'needs_action' ? 'var(--bth-warning-text)' :
    'var(--bth-control-panel-border)';

  return (
    <div
      onClick={() => onSelect(row)}
      className={wltStyles.accordionCard}
      style={{ borderRight: `4px solid ${borderColor}`, cursor: 'pointer' }}
    >
      <div className={wltStyles.accordionCardHeader} style={{ padding: '12px 16px' }}>
        <div className={wltStyles.infoGroupRight}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--bth-control-panel-text)' }}>
              {row.actorLabel}
            </span>
            <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>
              {row.actorType} · {row.actorId}
            </span>
          </div>
        </div>
        <div className={wltStyles.infoGroupLeft}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--bth-control-panel-text)', fontVariantNumeric: 'tabular-nums' }}>
              {row.availableLabel}
            </span>
            <span style={{ fontSize: 10, color: statusColor, fontWeight: 700 }}>
              {row.statusLabel}
            </span>
            {row.nextAction && (
              <span style={{ fontSize: 10, color: 'var(--bth-brand-primary)', fontWeight: 600 }}>
                {row.nextAction} ←
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, padding: '6px 16px 10px', direction: 'rtl' }}>
        <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>
          معلق: <strong style={{ color: 'var(--bth-warning-text)' }}>{row.pendingLabel}</strong>
        </span>
        <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>
          محجوز: <strong style={{ color: 'var(--bth-danger-text)' }}>{row.heldLabel}</strong>
        </span>
      </div>
    </div>
  );
}

export function WltDshWalletControlCenter() {
  const [selectedRow, setSelectedRow] = React.useState<WalletSummaryRow | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'client' | 'partner' | 'captain' | 'field'>('all');

  const allRows = React.useMemo<WalletSummaryRow[]>(() => [
    ...buildClientWalletRows(),
    ...buildPartnerWalletRows(),
    ...buildCaptainWalletRows(),
    ...buildFieldWalletRows(),
  ], []);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Text role="titleMd" style={{ fontWeight: 800 }}>مركز تحكم المحافظ</Text>
            <Text role="bodySm" tone="soft" style={{ marginTop: 4 }}>
              نظرة موحدة على جميع محافظ العملاء والشركاء والكباتن والميدانيين
            </Text>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {blockedCount > 0 && (
              <span style={{ fontSize: 11, background: 'var(--bth-danger-surface)', color: 'var(--bth-danger-text)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
                {blockedCount} محجوب
              </span>
            )}
            {needsActionCount > 0 && (
              <span style={{ fontSize: 11, background: 'var(--bth-warning-surface)', color: 'var(--bth-warning-text)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
                {needsActionCount} يحتاج إجراء
              </span>
            )}
          </div>
        </div>
      </Box>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {filterLabels.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid var(--bth-control-panel-border)',
              background: activeFilter === f.id ? 'var(--bth-brand-primary)' : 'var(--bth-control-panel-surface)',
              color: activeFilter === f.id ? 'var(--bth-text-inverse)' : 'var(--bth-control-panel-text)',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedRow ? '1fr 300px' : '1fr', gap: 16, alignItems: 'start' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--bth-control-panel-text)' }}>
                تفاصيل المحفظة
              </span>
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--bth-control-panel-text-muted)' }}
              >
                ✕
              </button>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--bth-control-panel-border)', margin: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'الطرف', value: `${selectedRow.actorLabel} (${selectedRow.actorType})` },
                { label: 'المعرّف', value: selectedRow.actorId },
                { label: 'الرصيد المتاح', value: selectedRow.availableLabel },
                { label: 'المعلق', value: selectedRow.pendingLabel },
                { label: 'المحجوز', value: selectedRow.heldLabel },
                { label: 'الحالة', value: selectedRow.statusLabel },
                ...(selectedRow.nextAction ? [{ label: 'الإجراء التالي', value: selectedRow.nextAction }] : []),
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--bth-control-panel-text-muted)', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--bth-control-panel-text)', textAlign: 'left' }}>{value}</span>
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
