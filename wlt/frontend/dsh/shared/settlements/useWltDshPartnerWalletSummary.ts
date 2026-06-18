import React from 'react';
import {
  EMPTY_PARTNER_FINANCE_SNAPSHOT,
  getPartnerSnapshot,
} from './partner-finance-runtime.adapter';
import {
  mapWltDshPartnerTransactions,
} from './partner-finance.adapter';

export function useWltDshPartnerWalletSummary(partnerId?: string, dshAuthBearerToken?: string | null) {
  const [partnerPreview, setPartnerPreview] = React.useState(EMPTY_PARTNER_FINANCE_SNAPSHOT);
  const [lastError, setLastError] = React.useState<string | null>(null);

  const activePartnerId = partnerId || 'partner-demo';

  React.useEffect(() => {
    let cancelled = false;

    void getPartnerSnapshot(activePartnerId, dshAuthBearerToken)
      .then((snapshot) => {
        if (cancelled) return;
        setPartnerPreview(snapshot);
        setLastError(null);
      })
      .catch((error) => {
        if (cancelled) return;
        setLastError(error instanceof Error ? error.message : 'wlt_partner_runtime_unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, [activePartnerId, dshAuthBearerToken]);

  const previewTransactions = React.useMemo(
    () => mapWltDshPartnerTransactions(partnerPreview.settlementRecords),
    [partnerPreview],
  );

  return {
    partnerPreview,
    partnerSummary: partnerPreview,
    previewTransactions,
    summaryTransactions: previewTransactions,
    warnings: lastError ? ['WLT runtime blocked: ' + lastError] : partnerPreview.warnings,
  };
}