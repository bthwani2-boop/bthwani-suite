// ML-043: CP commission breakdown workspace skeleton (WLT bridge — view-only)
// BLOCKED_BY_WLT: implement when WLT exposes commission breakdown read endpoint
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

export type CommissionBreakdownWorkspaceProps = {
  orderId?: string;
};

export function CommissionBreakdownWorkspace({ orderId = '—' }: CommissionBreakdownWorkspaceProps) {
  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>تفاصيل العمولة</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>WLT — عرض فقط</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>طلب {orderId}</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={2}>
              <Text role="titleSm" tone="brand" style={{ fontWeight: '800' }}>ربط WLT معلق</Text>
              <Text tone="muted">تفاصيل العمولة مملوكة من WLT. ستظهر هنا بعد ربط نقطة النهاية.</Text>
            </Box>
            <Box gap={2}>
              {(['عمولة المنصة', 'عمولة الكابتن', 'عمولة الميداني', 'الصافي للشريك'] as const).map((label) => (
                <Box key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text role="bodySm" tone="muted">{label}</Text>
                  <Text role="bodySm">— WLT</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </div>
      </main>
    </div>
  );
}

export default CommissionBreakdownWorkspace;
