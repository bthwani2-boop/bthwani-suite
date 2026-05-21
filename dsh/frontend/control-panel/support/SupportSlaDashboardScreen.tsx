// P0-06: CP support SLA dashboard — preview KPI tiles with audit trail integration.
// SLA data shown is representative preview; real-time metrics arrive via API binding.
// AuditTrailDetailPanel wired here as the audit surface for SLA events.
import React from 'react';
import { Box, Chip, KeyValueList, Text } from '@bthwani/ui-kit';
import { WebControlPanelKpiStrip } from '@bthwani/ui-kit/web';
import { AuditTrailDetailPanel } from './AuditTrailDetailPanel';
import styles from '../shared/control-panel-surface.module.css';

// KPI strip tones and Chip tones use different type unions — kept separate to avoid TS mismatch.
type SlaKpiTone = 'success' | 'warning' | 'danger' | 'neutral';
type SlaChipTone = 'success' | 'warning' | 'danger' | 'default';

type SlaRiskBand = {
  id: string;
  label: string;
  countPreview: string;
  kpiTone: SlaKpiTone;
  chipTone: SlaChipTone;
  description: string;
};

const SLA_RISK_BANDS: ReadonlyArray<SlaRiskBand> = [
  {
    id: 'within-sla',
    label: 'ضمن SLA',
    countPreview: '12',
    kpiTone: 'success',
    chipTone: 'success',
    description: 'تذاكر مغلقة أو نشطة ضمن نافذة الالتزام المحددة.',
  },
  {
    id: 'breach-risk',
    label: 'خطر انتهاك',
    countPreview: '4',
    kpiTone: 'warning',
    chipTone: 'warning',
    description: 'تذاكر تقترب من نهاية نافذة SLA وتحتاج تدخلًا سريعًا.',
  },
  {
    id: 'breached',
    label: 'منتهك',
    countPreview: '3',
    kpiTone: 'danger',
    chipTone: 'danger',
    description: 'تذاكر تجاوزت حد SLA — تستلزم تصعيدًا فوريًا ومراجعة.',
  },
  {
    id: 'avg-resolve',
    label: 'متوسط الحل',
    countPreview: '18 د',
    kpiTone: 'neutral',
    chipTone: 'default',
    description: 'متوسط زمن إغلاق التذكرة عبر جميع الصفوف.',
  },
];

type SlaQueueRow = {
  id: string;
  queueLabel: string;
  withinSla: string;
  atRisk: string;
  breached: string;
  avgResolveLabel: string;
};

const SLA_QUEUE_ROWS: ReadonlyArray<SlaQueueRow> = [
  { id: 'orders', queueLabel: 'الطلبات', withinSla: '6', atRisk: '2', breached: '1', avgResolveLabel: '14 د' },
  { id: 'partners', queueLabel: 'الشركاء', withinSla: '3', atRisk: '1', breached: '1', avgResolveLabel: '22 د' },
  { id: 'captains', queueLabel: 'الكباتن', withinSla: '2', atRisk: '1', breached: '0', avgResolveLabel: '11 د' },
  { id: 'field', queueLabel: 'الميدان', withinSla: '1', atRisk: '0', breached: '1', avgResolveLabel: '35 د' },
];

export function SupportSlaDashboardScreen() {
  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>لوحة SLA للدعم</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeTextInverse}>معاينة</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>مراقبة مستويات الخدمة عبر جميع التذاكر والصفوف</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            {/* KPI strip — kpiTone used here (neutral allowed) */}
            <WebControlPanelKpiStrip
              items={SLA_RISK_BANDS.map((band) => ({
                id: band.id,
                label: band.label,
                value: band.countPreview,
                tone: band.kpiTone,
              }))}
            />

            {/* SLA band detail cards — chipTone used here (default allowed) */}
            <Box gap={2}>
              <Text role="titleSm">تفصيل فئات SLA</Text>
              <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {SLA_RISK_BANDS.map((band) => (
                  <Box
                    key={band.id}
                    padding={3}
                    gap={1}
                    background="surfaceRaised"
                    radiusToken="md"
                    style={{ flex: 1, minWidth: 160 }}
                  >
                    <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Chip label={band.countPreview} tone={band.chipTone} selected />
                      <Text role="bodyStrong">{band.label}</Text>
                    </Box>
                    <Text role="caption" tone="muted">{band.description}</Text>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Per-queue breakdown */}
            <Box gap={2}>
              <Text role="titleSm">مؤشرات SLA حسب الصف</Text>
              <KeyValueList
                items={SLA_QUEUE_ROWS.map((row) => ({
                  label: row.queueLabel,
                  value: `ضمن: ${row.withinSla} · خطر: ${row.atRisk} · منتهك: ${row.breached} · متوسط: ${row.avgResolveLabel}`,
                  tone: Number(row.breached) > 0 ? 'danger' as const : 'default' as const,
                }))}
              />
            </Box>

            {/* Audit trail for SLA events */}
            <AuditTrailDetailPanel auditTag="support-sla" />
          </Box>
        </div>
      </main>
    </div>
  );
}

export default SupportSlaDashboardScreen;
