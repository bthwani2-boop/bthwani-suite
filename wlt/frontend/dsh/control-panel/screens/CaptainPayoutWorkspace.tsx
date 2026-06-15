// P0-07: CP captain payout workspace — WLT bridge, view-only.
// DSH displays WLT-owned captain payout data. No payout initiation or mutation inside DSH.
// bthwani_captain_mode only — store_courier_mode compensation is outside WLT captain settlement.
import React from 'react';
import { Box, KeyValueList, Text } from '@bthwani/ui-kit';
import styles from '../../../../../dsh/frontend/control-panel/shared/control-panel-surface.module.css';
import { WltBoundaryBanner } from '../components/WltBoundaryBanner';
import { buildDshWltFinanceBoundaryRecord } from '../../../../../dsh/frontend/shared/finance-boundary';

export type CaptainPayoutWorkspaceProps = {
  captainId?: string;
  captainName?: string;
};

export function CaptainPayoutWorkspace({
  captainId = '—',
  captainName = 'الكابتن',
}: CaptainPayoutWorkspaceProps) {
  const boundaryRecord = buildDshWltFinanceBoundaryRecord({
    domain: 'payout',
    contractStatus: 'pending_contract',
    affectedActor: captainName,
    affectedEntityId: captainId !== '—' ? captainId : undefined,
    auditVisibilityRequired: false,
  });

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>مدفوعات الكابتن</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>عرض فقط</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>{captainName} — {captainId}</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            <WltBoundaryBanner record={boundaryRecord} />
            <Box padding={3} background="surfaceRaised" radiusToken="md" gap={1}>
              <Text role="bodySm" tone="muted" weight="bold">تنبيه الفصل المالي</Text>
              <Text role="bodySm" tone="muted">
                هذه البيانات لكباتن بثواني (bthwani_captain_mode) فقط — موصلو المتاجر (store_courier_mode) لا يظهرون هنا. تعويض موصل المتجر يُدار بين المتجر وموصله مباشرةً ولا يمر عبر تسوية WLT للكابتن.
              </Text>
            </Box>
            <KeyValueList
              items={[
                { label: 'رقم الكابتن', value: captainId },
                { label: 'إجمالي المكتسب', value: 'يتطلب ربط مالي' },
                { label: 'المسحوب', value: 'يتطلب ربط مالي' },
                { label: 'الرصيد المتاح', value: 'يتطلب ربط مالي' },
              ]}
            />
          </Box>
        </div>
      </main>
    </div>
  );
}

export default CaptainPayoutWorkspace;
