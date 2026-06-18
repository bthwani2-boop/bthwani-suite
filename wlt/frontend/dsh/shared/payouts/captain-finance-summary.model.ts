import React from 'react';
import {
  type WltCaptainFinanceSection,
  type WltCaptainFinanceSnapshot,
  type WltDshFinanceSummaryRecord,
} from '../boundary/dsh-finance-read-model.types';
import {
  getRecords,
  getSections,
  getSnapshot,
  submitCaptainEligibilityFunding,
  submitCaptainSettlementRequest,
} from '../payouts/captain-finance-runtime.adapter';

export function useWltDshCaptainFinanceSummary(
  initialSection: WltCaptainFinanceSection = 'eligibility',
  captainId?: string | null,
  dshAuthBearerToken?: string | null,
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
    if (!captainId) return;
    let cancelled = false;
    void Promise.all([
      getSnapshot(captainId, dshAuthBearerToken),
      getRecords(captainId, dshAuthBearerToken),
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
    return () => { cancelled = true; };
  }, [trigger, captainId, dshAuthBearerToken]);

  const availableSections = React.useMemo(() => getSections(), []);
  const records = React.useMemo(
    () => allRecords.filter((record) => {
      if (activeSection === 'cod-liability') return record.kind === 'captain-cod-liability';
      if (activeSection === 'earnings') return record.kind === 'captain-earning';
      if (activeSection === 'eligibility') return record.kind === 'captain-eligibility-topup';
      return false;
    }),
    [activeSection, allRecords],
  );

  const submitEligibilityFunding = React.useCallback(async (amountMinorUnits: number) => {
    const res = await submitCaptainEligibilityFunding(amountMinorUnits, captainId || undefined, dshAuthBearerToken);
    refresh();
    return res;
  }, [refresh, captainId, dshAuthBearerToken]);

  const submitSettlementRequest = React.useCallback(async () => {
    const res = await submitCaptainSettlementRequest(captainId || undefined, dshAuthBearerToken);
    refresh();
    return res;
  }, [refresh, captainId, dshAuthBearerToken]);

  return {
    snapshot,
    allRecords,
    records,
    activeSection,
    setActiveSection,
    availableSections,
    lastError,
    submitEligibilityFunding,
    submitSettlementRequest,
    refresh,
  } as const;
}
