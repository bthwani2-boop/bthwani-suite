'use client';

import { useRouter } from 'next/navigation';
import { Box, Surface, Text, useTheme } from '@bthwani/ui-kit';

const TOPOLOGY_LANES = [
  { id: 'onboarding', title: 'الاستقبال', sub: 'مدخل الشريك والوثائق', flow: 'الشريك → الاستقبال → العمليات', load: 'طبيعي', tone: 'success' as const },
  { id: 'orders', title: 'الطلبات', sub: 'الطلبات والتسليم', flow: 'الشريك → الطلبات → العمليات', load: 'مرتفع', tone: 'danger' as const },
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
  const { theme } = useTheme();
  const toneStyles = {
    success: { color: theme.success, bg: theme.successSurface },
    danger: { color: theme.danger, bg: theme.dangerSurface },
    neutral: { color: theme.textMuted, bg: theme.surfaceInset },
  } as const;

  return (
    <Box gap={4} style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box gap={1}>
          <Text role="caption" style={{ color: theme.brand, fontWeight: '800' }}>خارطة نظام الشركاء</Text>
          <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900' }}>خارطة مسارات الشركاء</Text>
        </Box>
        <Text role="caption" tone="muted">تكامل السطح التشغيلي الموحد</Text>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {TOPOLOGY_LANES.map((lane) => (
          <Surface key={lane.id} tone="raised" gap={3} style={{ borderRadius: 20, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box gap={0}>
                <Text role="titleSm" style={{ color: theme.brandHeaderBackground, fontWeight: '800' }}>{lane.title}</Text>
                <Text role="caption" tone="muted">{lane.sub}</Text>
              </Box>
              {(() => {
                const laneTone = toneStyles[lane.tone];
                return (
              <div style={{
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: laneTone.bg,
                color: laneTone.color
              }}>
                <Text role="caption" style={{ fontWeight: '900', fontSize: 10 }}>{lane.load.toUpperCase()}</Text>
              </div>
                );
              })()}
            </div>

            <div style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: theme.surfaceInset,
              borderRadius: '12px',
              border: `1px solid ${theme.line}`
            }}>
              <Text role="caption" style={{ color: theme.textMuted, fontFamily: 'monospace', direction: 'ltr', textAlign: 'left' }}>
                {lane.flow}
              </Text>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button type="button" onClick={() => router.push(partnersHref)} style={{ flex: 1, padding: '8px', backgroundColor: theme.surface, border: `1px solid ${theme.line}`, borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: theme.brandHeaderBackground, cursor: 'pointer' }}>فتح طابور الشركاء</button>
              <button type="button" onClick={() => router.push(marketingHref)} style={{ flex: 1, padding: '8px', backgroundColor: theme.surface, border: `1px solid ${theme.line}`, borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: theme.brandHeaderBackground, cursor: 'pointer' }}>فتح مسار التسويق</button>
            </div>
          </Surface>
        ))}
      </div>
    </Box>
  );
}

export default PartnerTopologyLane;
