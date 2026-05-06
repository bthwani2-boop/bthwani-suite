'use client';

import React from 'react';
import styles from '../operations/dsh-surface.module.css';

const TOPOLOGY_LANES = [
  { id: 'onboarding', title: 'Onboarding', sub: 'مدخل الشريك والوثائق', flow: 'app-partner → intake → operations', load: 'Normal', color: '#16A34A' },
  { id: 'orders', title: 'Orders', sub: 'الطلبات والتسليم', flow: 'app-partner → orders → operations', load: 'High', color: '#DC2626' },
  { id: 'catalog', title: 'Catalog', sub: 'المخزون والكتالوج', flow: 'app-partner → inventory → catalogs', load: 'Normal', color: '#16A34A' },
  { id: 'finance', title: 'Finance', sub: 'المحفظة والتسويات', flow: 'app-partner → wallet → finance', load: 'Normal', color: '#16A34A' },
  { id: 'marketing', title: 'Marketing', sub: 'النمو والتسويق', flow: 'app-partner → growth → marketing', load: 'Idle', color: '#64748B' },
  { id: 'support', title: 'Support', sub: 'الإشارات والاعتراضات', flow: 'app-partner → issues → support', load: 'Normal', color: '#16A34A' },
];

export function PartnerTopologyLane() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>خارطة مسارات الشركاء</h2>
        <span style={{ fontSize: '12px', color: '#64748B' }}>تكامل السطح التشغيلي</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
        {TOPOLOGY_LANES.map((lane) => (
          <div key={lane.id} className={styles.operationsCompactCard} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A2F5C' }}>{lane.title}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{lane.sub}</div>
              </div>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '10px', 
                fontWeight: 700, 
                backgroundColor: lane.color + '15', 
                color: lane.color 
              }}>
                {lane.load}
              </span>
            </div>
            
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '6px', fontSize: '11px', color: '#475569', fontFamily: 'monospace', direction: 'ltr', textAlign: 'right' }}>
              {lane.flow}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button style={{ flex: 1, padding: '6px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تتبع المسار</button>
              <button style={{ flex: 1, padding: '6px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>الإعدادات</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnerTopologyLane;
