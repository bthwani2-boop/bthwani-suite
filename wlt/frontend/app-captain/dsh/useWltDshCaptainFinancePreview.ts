import React from 'react';
import type { WltCaptainFinanceSection } from '../../control-panel/dsh/financeContracts';
import { wltDshCaptainBridgeDataContract } from './wlt-dsh-captain.contract';
import * as WltCaptainAdapter from './wlt-dsh-captain.adapter';

export function useWltDshCaptainFinancePreview(initialSection: WltCaptainFinanceSection = 'eligibility') {
  const [activeSection, setActiveSection] = React.useState<WltCaptainFinanceSection>(initialSection);
  const [trigger, setTrigger] = React.useState(0);

  React.useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const refresh = React.useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  const snapshot = React.useMemo(() => WltCaptainAdapter.getSnapshot(), [trigger]);
  const allRecords = React.useMemo(() => WltCaptainAdapter.getRecords(), [trigger]);
  const availableSections = React.useMemo(() => WltCaptainAdapter.getSections(), []);
  const records = React.useMemo(
    () => WltCaptainAdapter.getRecordsForSection(activeSection),
    [activeSection, trigger],
  );

  const topUp = React.useCallback(async (amountMinorUnits: number) => {
    const res = WltCaptainAdapter.topUp(amountMinorUnits);
    refresh();
    return res;
  }, [refresh]);

  const requestSettlement = React.useCallback(async () => {
    const res = WltCaptainAdapter.requestSettlement();
    refresh();
    return res;
  }, [refresh]);

  const resetFinance = React.useCallback(async () => {
    const res = WltCaptainAdapter.resetFinance();
    refresh();
    return res;
  }, [refresh]);

  return {
    contract: wltDshCaptainBridgeDataContract,
    snapshot,
    allRecords,
    records,
    activeSection,
    setActiveSection,
    availableSections,
    topUp,
    requestSettlement,
    resetFinance,
    refresh,
  } as const;
}

export default useWltDshCaptainFinancePreview;
