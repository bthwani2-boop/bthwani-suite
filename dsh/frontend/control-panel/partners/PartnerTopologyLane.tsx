'use client';

import { useRouter } from 'next/navigation';
import { Box, Surface, Text } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

// UI_PREVIEW_ONLY: load values are static structural reference — not live runtime metrics
const TOPOLOGY_LANES = [
  { id: 'onboarding', title: 'الاستقبال', sub: 'مدخل الشريك والوثائق', flow: 'الشريك → الاستقبال → العمليات', load: 'طبيعي', tone: 'success' as const },
  { id: 'topology_orders', title: 'الطلبات', sub: 'الطلبات والتسليم', flow: 'الشريك → الطلبات → العمليات', load: 'مرتفع', tone: 'danger' as const },
  { id: 'catalog', title: 'الكتالوج', sub: 'المخزون والكتالوج', flow: 'الشريك → المخزون → الكتالوجات', load: 'طبيعي', tone: 'success' as const },
  { id: 'finance', title: 'المالية', sub: 'المحفظة والتسويات', flow: 'الشريك → المحفظة → المالية', load: 'طبيعي', tone: 'success' as const },
  { id: 'marketing', title: 'التسويق', sub: 'النمو والتسويق', flow: 'الشريك → النمو → التسويق', load: 'خامل', tone: 'neutral' as const },
  { id: 'support', title: 'الدعم', sub: 'الإشارات والاعتراضات', flow: 'الشريك → المشكلات → الدعم', load: 'طبيعي', tone: 'success' as const },
];

export type PartnerTopologyLaneProps = {
  partnersHref?: string;
  marketingHref?: string;
};

export function PartnerTopologyLane({
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: PartnerTopologyLaneProps) {
  const router = useRouter();

  return (
    <Box gap={4} dir="rtl">
      <div className={styles.topologyHeader}>
        <Box gap={1}>
          <Text role="caption" tone="brand">خارطة نظام الشركاء</Text>
          <Text role="titleLg">خارطة مسارات الشركاء</Text>
        </Box>
        <Text role="caption" tone="muted">تكامل السطح التشغيلي الموحد · UI_PREVIEW_ONLY</Text>
      </div>

      <div className={styles.topologyCardGrid}>
        {TOPOLOGY_LANES.map((lane) => {
          return (
            <Surface key={lane.id} tone="raised" gap={3} radiusToken="lg" padding={4}>
              <div className={styles.topologyHeader}>
                <Box gap={0}>
                  <Text role="titleSm" tone="brand">{lane.title}</Text>
                  <Text role="caption" tone="muted">{lane.sub}</Text>
                </Box>
                <Box paddingX={2} paddingY={1} background={lane.tone === 'success' ? 'successSurface' : lane.tone === 'danger' ? 'dangerSurface' : 'surfaceInset'} radiusToken="round">
                  <Text role="caption" tone={lane.tone === 'success' ? 'success' : lane.tone === 'danger' ? 'danger' : 'muted'}>{lane.load}</Text>
                </Box>
              </div>

              <Box padding={2} background="surfaceInset" radiusToken="sm" border borderTone="line" className={styles.topologyFlowBox}>
                <Text role="caption" tone="muted" dir="ltr">
                  {lane.flow}
                </Text>
              </Box>

              <div className={styles.topologyCardActions}>
                <button
                  type="button"
                  onClick={() => router.push(partnersHref)}
                  className={styles.topologyActionBtn}
                >
                  فتح طابور الشركاء
                </button>
                <button
                  type="button"
                  onClick={() => router.push(marketingHref)}
                  className={styles.topologyActionBtn}
                >
                  فتح مسار التسويق
                </button>
              </div>
            </Surface>
          );
        })}
      </div>
    </Box>
  );
}

export default PartnerTopologyLane;
