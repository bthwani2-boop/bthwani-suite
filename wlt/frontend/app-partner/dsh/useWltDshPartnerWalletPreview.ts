import React from 'react';
import { createWltDshTypedClient, type WltSettlement } from '../../contracts';
import {
  formatWltYer,
  getWltPartnerFinanceSnapshot,
  type WltDshFinancePreviewRecord,
  type WltPartnerFinanceSnapshot,
} from '../../control-panel/dsh/financeContracts';
import { mapWltDshPartnerPreviewTransactions } from './wlt-dsh-partner.adapter';

function settlementRecord(s: WltSettlement): WltDshFinancePreviewRecord {
  const amount = Math.round(s.partner_payout * 100);
  const isDone = s.status === 'COMPLETED';
  return {
    id: s.id,
    actor: 'partner',
    kind: 'partner-settlement',
    currencyCode: s.currency,
    amountMinorUnits: amount,
    amountLabel: formatWltYer(amount),
    tone: amount >= 0 ? 'positive' : 'negative',
    title: `تسوية شريك · ${s.partner_id}`,
    subtitle: `WLT runtime · ${s.status}`,
    statusLabel: s.status,
    statusTone: isDone ? 'success' : 'warning',
    timeLabel: s.created_at,
    sourceStoreId: s.partner_id,
    sourceOrderId: s.order_id,
    settlementCycleId: s.id,
    isPreview: false,
  };
}

export function useWltDshPartnerWalletPreview(partnerId?: string, dshAuthBearerToken?: string | null) {
  const [partnerPreview, setPartnerPreview] = React.useState<WltPartnerFinanceSnapshot>(() => getWltPartnerFinanceSnapshot());
  const [lastError, setLastError] = React.useState<string | null>(null);

  const activePartnerId = partnerId || 'partner-demo';
  const client = React.useMemo(() => {
    return createWltDshTypedClient({
      bearerToken: dshAuthBearerToken || undefined,
      devClientId: activePartnerId,
    });
  }, [dshAuthBearerToken, activePartnerId]);

  React.useEffect(() => {
    let cancelled = false;
    void client.listPartnerSettlements(activePartnerId)
      .then(({ settlements }) => {
        if (cancelled) return;
        const fallback = getWltPartnerFinanceSnapshot();
        const settlementRecords = settlements.map(settlementRecord);
        const netSettlementMinorUnits = settlements.reduce((sum, s) => sum + Math.round(s.partner_payout * 100), 0);
        setPartnerPreview({
          ...fallback,
          settlementRecords,
          grossSalesMinorUnits: netSettlementMinorUnits,
          grossSalesLabel: formatWltYer(netSettlementMinorUnits),
          netSettlementMinorUnits,
          netSettlementLabel: formatWltYer(netSettlementMinorUnits),
          nextSettlementMinorUnits: netSettlementMinorUnits,
          nextSettlementLabel: formatWltYer(netSettlementMinorUnits),
          totalLabel: formatWltYer(netSettlementMinorUnits),
          cycleStatus: settlements[0]?.status ?? 'empty',
          cycleStartDate: settlements[0]?.created_at ?? fallback.cycleStartDate,
          cycleEndDate: settlements[0]?.created_at ?? fallback.cycleEndDate,
          sourceLabel: 'WLT runtime',
          warnings: [],
          isPreview: false,
        });
        setLastError(null);
      })
      .catch((error) => {
        if (cancelled) return;
        setLastError(error instanceof Error ? error.message : 'wlt_partner_runtime_unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, [client, activePartnerId]);

  const previewTransactions = React.useMemo(
    () => mapWltDshPartnerPreviewTransactions(partnerPreview.settlementRecords),
    [partnerPreview],
  );

  return {
    partnerPreview,
    previewTransactions,
    warnings: lastError ? [`WLT runtime blocked: ${lastError}`] : partnerPreview.warnings,
  };
}
