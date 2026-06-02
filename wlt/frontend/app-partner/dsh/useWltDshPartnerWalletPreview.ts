import React from 'react';
import { getWltPartnerFinanceSnapshot } from '../../control-panel/dsh/financeContracts';
import { mapWltDshPartnerPreviewTransactions } from './wlt-dsh-partner.adapter';

export function useWltDshPartnerWalletPreview() {
  const partnerPreview = React.useMemo(() => getWltPartnerFinanceSnapshot(), []);
  const previewTransactions = React.useMemo(
    () => mapWltDshPartnerPreviewTransactions(partnerPreview.settlementRecords),
    [partnerPreview],
  );

  return {
    partnerPreview,
    previewTransactions,
    warnings: partnerPreview.warnings,
  };
}
