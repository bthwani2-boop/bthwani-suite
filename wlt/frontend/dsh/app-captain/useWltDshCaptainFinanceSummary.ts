import React from 'react';
import {
  type WltCaptainFinanceSection,
  type WltCaptainFinanceSnapshot,
  type WltDshFinanceSummaryRecord,
} from '../shared';
import { wltDshCaptainBridgeDataContract } from './wlt-dsh-captain.contract';
import * as WltCaptainAdapter from './wlt-dsh-captain.adapter';

export function useWltDshCaptainFinanceSummary(
  initialSection: WltCaptainFinanceSection = 'eligibility',
  captainId?: string | null,
  dshAuthBearerToken?: string | null
) {
  const [activeSection, setActiveSection] = React.useState<WltCaptainFinanceSection>(initialSection);
  const [trigger, setTrigger] = React.useState(0);
  const [snapshot, setSnapshot] = React.useState<WltCaptainFinanceSnapshot>({
    codLiabilityMinorUnits: 0, codLiabilityLabel: '—',
    earningsMinorUnits: 0, earningsLabel: '—',
    settlementMinorUnits: 0, settlementLabel: '—',
    pendingPayoutMinorUnits: 0, pendingPayoutLabel: '—',
    cycleLabel: '—',
    eligibilityBalanceMinorUnits: 0, eligibilityBalanceLabel: '—',
    minimumEligibilityMinorUnits: 0, minimumEligibilityLabel: '—',
    isEligible: false,
    eligibilityShortfallMinorUnits: 0, eligibilityShortfallLabel: '—',
    hasEligibilityBlock: false, eligibilityBlockReason: '',
    contractState: 'CONTRACT_TBD', isPreview: false,
  });
  const [allRecords, setAllRecords] = React.useState<readonly WltDshFinanceSummaryRecord[]>([]);
  const [lastError, setLastError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const refresh = React.useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    void Promise.all([
      WltCaptainAdapter.getSnapshot(captainId, dshAuthBearerToken),
      WltCaptainAdapter.getRecords(captainId, dshAuthBearerToken)
    ])
      .then(([nextSnapshot, nextRecords]) => {
        if (cancelled) return;
        setSnapshot(nextSnapshot);
        setAllRecords(nextRecords);
        setLastError(null);
      })
      .catch((error) => {
        if (cancelled) return;
        setLastError(error instanceof Error ? error.message : 'wlt_captain_runtime_unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, [trigger, captainId, dshAuthBearerToken]);

  const availableSections = React.useMemo(() => WltCaptainAdapter.getSections(), []);
  const records = React.useMemo(
    () => allRecords.filter((record) => {
      if (activeSection === 'cod-liability') return record.kind === 'captain-cod-liability';
      if (activeSection === 'earnings') return record.kind === 'captain-earning';
      if (activeSection === 'eligibility') return record.kind === 'captain-eligibility-topup';
      return false;
    }),
    [activeSection, allRecords],
  );

  const topUp = React.useCallback(async (amountMinorUnits: number) => {
    const res = await WltCaptainAdapter.topUp(amountMinorUnits, captainId || undefined, dshAuthBearerToken);
    refresh();
    return res;
  }, [refresh, captainId, dshAuthBearerToken]);

  const requestSettlement = React.useCallback(async () => {
    const res = await WltCaptainAdapter.requestSettlement(captainId || undefined, dshAuthBearerToken);
    refresh();
    return res;
  }, [refresh, captainId, dshAuthBearerToken]);

  const resetFinance = React.useCallback(async () => {
    const res = await WltCaptainAdapter.resetFinance(captainId || undefined, dshAuthBearerToken);
    refresh();
    return res;
  }, [refresh, captainId, dshAuthBearerToken]);

  return {
    contract: wltDshCaptainBridgeDataContract,
    snapshot,
    allRecords,
    records,
    activeSection,
    setActiveSection,
    availableSections,
    lastError,
    topUp,
    requestSettlement,
    resetFinance,
    refresh,
  } as const;
}

export default useWltDshCaptainFinanceSummary;
