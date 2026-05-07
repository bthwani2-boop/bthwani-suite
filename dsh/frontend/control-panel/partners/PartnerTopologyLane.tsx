'use client';

import { Box, Surface, Text } from '@bthwani/ui-kit';
import styles from '../operations/dsh-surface.module.css';

const TOPOLOGY_LANES = [
  { id: 'onboarding', title: 'Onboarding', sub: 'مدخل الشريك والوثائق', flow: 'app-partner → intake → operations', load: 'Normal', color: '#16A34A', bg: '#F0FDF4' },
  { id: 'orders', title: 'Orders', sub: 'الطلبات والتسليم', flow: 'app-partner → orders → operations', load: 'High', color: '#DC2626', bg: '#FEF2F2' },
  { id: 'catalog', title: 'Catalog', sub: 'المخزون والكتالوج', flow: 'app-partner → inventory → catalogs', load: 'Normal', color: '#16A34A', bg: '#F0FDF4' },
  { id: 'finance', title: 'Finance', sub: 'المحفظة والتسويات', flow: 'app-partner → wallet → finance', load: 'Normal', color: '#16A34A', bg: '#F0FDF4' },
  { id: 'marketing', title: 'Marketing', sub: 'النمو والتسويق', flow: 'app-partner → growth → marketing', load: 'Idle', color: '#64748B', bg: '#F1F5F9' },
  { id: 'support', title: 'Support', sub: 'الإشارات والاعتراضات', flow: 'app-partner → issues → support', load: 'Normal', color: '#16A34A', bg: '#F0FDF4' },
];

export function PartnerTopologyLane() {
  return (
    <Box gap={4} style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box gap={1}>
          <Text role="caption" style={{ color: '#f97316', fontWeight: '800' }}>PARTNER ECOSYSTEM TOPOLOGY</Text>
          <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900' }}>خارطة مسارات الشركاء</Text>
        </Box>
        <Text role="caption" tone="muted">تكامل السطح التشغيلي الموحد</Text>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {TOPOLOGY_LANES.map((lane) => (
          <Surface key={lane.id} tone="raised" gap={3} style={{ borderRadius: 20, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box gap={0}>
                <Text role="titleSm" style={{ color: '#0A2F5C', fontWeight: '800' }}>{lane.title}</Text>
                <Text role="caption" tone="muted">{lane.sub}</Text>
              </Box>
              <div style={{
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: lane.bg,
                color: lane.color
              }}>
                <Text role="caption" style={{ fontWeight: '900', fontSize: 10 }}>{lane.load.toUpperCase()}</Text>
              </div>
            </div>

            <div style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.03)'
            }}>
              <Text role="caption" style={{ color: '#475569', fontFamily: 'monospace', direction: 'ltr', textAlign: 'left', display: 'block' }}>
                {lane.flow}
              </Text>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button style={{ flex: 1, padding: '8px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#0A2F5C', cursor: 'pointer' }}>تتبع المسار</button>
              <button style={{ flex: 1, padding: '8px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#0A2F5C', cursor: 'pointer' }}>الإعدادات</button>
            </div>
          </Surface>
        ))}
      </div>
    </Box>
  );
}

export default PartnerTopologyLane;
