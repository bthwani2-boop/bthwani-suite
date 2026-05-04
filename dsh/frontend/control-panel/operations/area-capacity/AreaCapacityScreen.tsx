'use client';

import React from 'react';

export type AreaCapacityScreenProps = { hubHref: string; };

export function AreaCapacityScreen({ hubHref }: AreaCapacityScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>
      
      {/* Header and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>المناطق والسعة</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تحديث وتصفية</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>إجمالي الطلبات</div>
          <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>842</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>إجمالي الكباتن</div>
          <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>320</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderTop: '4px solid #F59E0B' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>مناطق مزدحمة</div>
          <div style={{ fontSize: '24px', color: '#F59E0B', fontWeight: 800, marginTop: '8px' }}>2</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderTop: '4px solid #DC2626' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>مناطق متأزمة</div>
          <div style={{ fontSize: '24px', color: '#DC2626', fontWeight: 800, marginTop: '8px' }}>1</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        {[
          { id: 'AREA-1', name: 'شمال الرياض', status: 'متأزمة', orders: 124, caps: 30, eta: '45 دقيقة', recommendation: 'عجز 40 كابتن. فعّل Bonus فوراً.' },
          { id: 'AREA-2', name: 'شرق الرياض', status: 'مزدحمة', orders: 85, caps: 25, eta: '30 دقيقة', recommendation: 'راقب الطلبات المفتوحة.' },
          { id: 'AREA-3', name: 'وسط الرياض', status: 'مستقرة', orders: 42, caps: 50, eta: '15 دقيقة', recommendation: '' },
          { id: 'AREA-4', name: 'جنوب الرياض', status: 'مستقرة', orders: 20, caps: 35, eta: '12 دقيقة', recommendation: '' },
        ].map((area, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '16px', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: area.status === 'متأزمة' ? '4px solid #DC2626' : area.status === 'مزدحمة' ? '4px solid #F59E0B' : '4px solid transparent' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{area.name}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>({area.id})</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: area.status === 'متأزمة' ? '#FEF2F2' : area.status === 'مزدحمة' ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: area.status === 'متأزمة' ? '#DC2626' : area.status === 'مزدحمة' ? '#D97706' : '#64748B' }}>{area.status}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>طلبات نشطة: <span style={{ fontWeight: 600, color: '#0A2F5C' }}>{area.orders}</span> | كباتن: <span style={{ fontWeight: 600, color: '#0A2F5C' }}>{area.caps}</span></div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>متوسط التوصيل (ETA): <span style={{ fontWeight: 600, color: '#0A2F5C' }}>{area.eta}</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {area.recommendation && (
                <div style={{ fontSize: '11px', color: area.status === 'متأزمة' ? '#DC2626' : '#D97706', backgroundColor: area.status === 'متأزمة' ? '#FEF2F2' : '#FEF3C7', padding: '6px 10px', borderRadius: '6px', textAlign: 'center' }}>
                  {area.recommendation}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button style={{ padding: '8px 12px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تفعيل Bonus Area</button>
              <button style={{ padding: '8px 12px', backgroundColor: '#F59E0B', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تقليل النطاق</button>
              <button style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>إيقاف مؤقت</button>
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}

export default AreaCapacityScreen;
