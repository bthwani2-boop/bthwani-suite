import React from 'react';
import type { WltCaptainFinanceSection } from '../../control-panel/dsh/financeContracts';
import { wltDshCaptainBridgeDataContract } from './wlt-dsh-captain.contract';
import * as WltCaptainAdapter from './wlt-dsh-captain.adapter';

export function useWltDshCaptainFinancePreview(initialSection: WltCaptainFinanceSection = 'eligibility') {
  const [activeSection, setActiveSection] = React.useState<WltCaptainFinanceSection>(initialSection);

  React.useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const snapshot = React.useMemo(() => WltCaptainAdapter.getSnapshot(), []);
  const allRecords = React.useMemo(() => WltCaptainAdapter.getRecords(), []);
  const availableSections = React.useMemo(() => WltCaptainAdapter.getSections(), []);
  const records = React.useMemo(
    () => WltCaptainAdapter.getRecordsForSection(activeSection),
    [activeSection],
  );

  return {
    contract: wltDshCaptainBridgeDataContract,
    snapshot,
    allRecords,
    records,
    activeSection,
    setActiveSection,
    availableSections,
  } as const;
}

export default useWltDshCaptainFinancePreview;
