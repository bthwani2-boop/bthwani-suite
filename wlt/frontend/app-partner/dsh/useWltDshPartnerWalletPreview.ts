import React from 'react';
import { createWltDshTypedClient, type WltDshSettlementCycle } from '../../contracts';
import {
  formatWltYer,
  getWltPartnerFinanceSnapshot,
  type WltDshFinancePreviewRecord,
  type WltPartnerFinanceSnapshot,
} from '../../control-panel/dsh/financeContracts';
import { mapWltDshPartnerPreviewTransactions } from './wlt-dsh-partner.adapter';

function settlementRecord(cycle: WltDshSettlementCycle): WltDshFinancePreviewRecord {
  return {
    id: cycle.id,
    actor: 'partner',
    kind: 'partner-settlement',
    currencyCode: cycle.currency,
    amountMinorUnits: cycle.netPayableMinorUnits,
    amountLabel: formatWltYer(cycle.netPayableMinorUnits),
    tone: cycle.netPayableMinorUnits >= 0 ? 'positive' : 'negative',
    title: `تسوية شريك · ${cycle.ownerId}`,
    subtitle: `WLT runtime · ${cycle.status}`,
    statusLabel: cycle.status,
    statusTone: cycle.status === 'ready_for_payout' || cycle.status === 'paid' ? 'success' : 'warning',
    timeLabel: cycle.createdAt,
    sourceStoreId: cycle.ownerId,
    settlementCycleId: cycle.id,
    isPreview: false,
  };
}

export function useWltDshPartnerWalletPreview() {
  const [partnerPreview, setPartnerPreview] = React.useState<WltPartnerFinanceSnapshot>(() => getWltPartnerFinanceSnapshot());
  const [lastError, setLastError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void createWltDshTypedClient({}).listPartnerSettlementCycles('partner-demo')
      .then((cycles) => {
        if (cancelled) return;
        const fallback = getWltPartnerFinanceSnapshot();
        const settlementRecords = cycles.map(settlementRecord);
        const netSettlementMinorUnits = cycles.reduce((sum, cycle) => sum + cycle.netPayableMinorUnits, 0);
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
          cycleStatus: cycles[0]?.status ?? 'empty',
          cycleStartDate: cycles[0]?.createdAt ?? fallback.cycleStartDate,
          cycleEndDate: cycles[0]?.createdAt ?? fallback.cycleEndDate,
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
  }, []);

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
