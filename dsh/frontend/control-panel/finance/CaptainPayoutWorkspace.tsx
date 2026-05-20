// ML-041: CP captain payout workspace skeleton (WLT bridge — view-only)
// BLOCKED_BY_WLT: implement when WLT exposes captain payout read bridge + CG-029 contract proven
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

export type CaptainPayoutWorkspaceProps = {
  captainId?: string;
  captainName?: string;
};

export function CaptainPayoutWorkspace({
  captainId = '—',
  captainName = 'الكابتن',
}: CaptainPayoutWorkspaceProps) {
  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>مدفوعات الكابتن</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>WLT — عرض فقط</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>{captainName} — {captainId}</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={2}>
              <Text role="titleSm" tone="brand" style={{ fontWeight: '800' }}>ربط WLT معلق</Text>
              <Text tone="muted">بيانات مدفوعات الكابتن مملوكة من WLT. سيظهر هنا ملخص المدفوعات بعد ربط CG-029.</Text>
            </Box>
            <Box padding={3} background="surfaceRaised" radiusToken="md" gap={1}>
              <Text role="bodySm" tone="muted" style={{ fontWeight: '700' }}>تنبيه الفصل المالي</Text>
              <Text role="bodySm" tone="muted">
                هذه البيانات لكباتن بثواني (bthwani_captain_mode) فقط — موصلو المتاجر (store_courier_mode) لا يظهرون هنا. تعويض موصل المتجر يُدار بين المتجر وموصله مباشرةً ولا يمر عبر تسوية WLT للكابتن.
              </Text>
            </Box>
            <Box gap={2}>
              {([
                ['رقم الكابتن', captainId],
                ['إجمالي المكتسب', '— WLT'],
                ['المسحوب', '— WLT'],
                ['الرصيد المتاح', '— WLT'],
              ] as const).map(([label, value]) => (
                <Box key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text role="bodySm" tone="muted">{label}</Text>
                  <Text role="bodySm">{value}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </div>
      </main>
    </div>
  );
}

export default CaptainPayoutWorkspace;
