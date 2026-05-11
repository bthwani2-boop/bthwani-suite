import React from 'react';
import { getWltPartnerSettlementPreview } from '../../shared/finance/dshFinancePreview';
import { mapWltDshPartnerPreviewTransactions } from './wlt-dsh-partner.adapter';

export function useWltDshPartnerWalletPreview() {
  const partnerPreview = React.useMemo(() => getWltPartnerSettlementPreview(), []);
  const previewTransactions = React.useMemo(
    () => mapWltDshPartnerPreviewTransactions(partnerPreview.records),
    [partnerPreview],
  );

  return {
    partnerPreview,
    previewTransactions,
  };
}
