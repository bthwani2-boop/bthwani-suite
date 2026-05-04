'use client';

import React from 'react';

export type CaptainOperationsScreenProps = { hubHref: string; };

export function CaptainOperationsScreen({ hubHref }: CaptainOperationsScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>
      
      {/* Header and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>تشغيل الكباتن</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تحديث وتصفية</button>
        </div>
      </div>

      {/* Status Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {['متصل', 'غير متصل', 'مشغول', 'خامل', 'موقوف', 'إجازة'].map((status, idx) => (
          <span key={idx} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', backgroundColor: idx === 0 ? '#DCFCE7' : idx === 4 ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: idx === 0 ? '#16A34A' : idx === 4 ? '#DC2626' : '#64748B', border: idx === 0 ? '1px solid #BBF7D0' : idx === 4 ? '1px solid #FECACA' : '1px solid transparent', cursor: 'pointer' }}>
            {status}
          </span>
        ))}
      </div>

      {/* Wide Rich Captain Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { id: 'CAP-102', name: 'سعد م.', status: 'مشغول', current: '#ORD-9844', today: 12, performance: '85%', location: 'الرياض - العليا (منذ دقيقتين)', pickup: '8.2 د', dropoff: '14 د', accept: '95%', rejects: '5%', complaints: 0 },
          { id: 'CAP-105', name: 'خالد ص.', status: 'متصل', current: 'لا يوجد', today: 8, performance: '92%', location: 'الرياض - السليمانية (الآن)', pickup: '5.1 د', dropoff: '10 د', accept: '98%', rejects: '2%', complaints: 0 },
          { id: 'CAP-110', name: 'أحمد ي.', status: 'خامل', current: 'لا يوجد', today: 3, performance: '60%', location: 'الرياض - النرجس (منذ 15 دقيقة)', pickup: '12 د', dropoff: '22 د', accept: '70%', rejects: '30%', complaints: 1 },
          { id: 'CAP-112', name: 'وليد ع.', status: 'موقوف', current: '-', today: 0, performance: '-', location: 'غير معروف', pickup: '-', dropoff: '-', accept: '-', rejects: '-', complaints: '-' },
        ].map((cap, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr', gap: '16px', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: cap.status === 'موقوف' ? '4px solid #DC2626' : cap.status === 'مشغول' ? '4px solid #F59E0B' : cap.status === 'متصل' ? '4px solid #16A34A' : '4px solid transparent' }}>
            
            {/* Identity and Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{cap.name}</span>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{cap.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, backgroundColor: cap.status === 'متصل' ? '#DCFCE7' : cap.status === 'موقوف' ? '#FEF2F2' : cap.status === 'مشغول' ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: cap.status === 'متصل' ? '#16A34A' : cap.status === 'موقوف' ? '#DC2626' : cap.status === 'مشغول' ? '#D97706' : '#64748B' }}>{cap.status}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#0A2F5C', fontWeight: 600 }}>الطلب الحالي: {cap.current}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>آخر موقع: {cap.location}</div>
            </div>

            {/* Performance Metrics */}
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px' }}>التقييم</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A2F5C' }}>{cap.performance}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px' }}>طلبات اليوم</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A2F5C' }}>{cap.today}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px' }}>الالتقاط / التسليم</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A2F5C' }}>{cap.pickup} / {cap.dropoff}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px' }}>قبول / رفض</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A2F5C' }}>{cap.accept} / {cap.rejects}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px' }}>شكاوى</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: typeof cap.complaints === 'number' && cap.complaints > 0 ? '#DC2626' : '#0A2F5C' }}>{cap.complaints}</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button style={{ padding: '8px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تواصل</button>
              <button style={{ padding: '8px', backgroundColor: 'transparent', color: '#0A2F5C', border: '1px solid rgba(10,47,92,0.1)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تحديث الحالة</button>
              <button style={{ padding: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تعطيل مؤقت</button>
              <button style={{ padding: '8px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid rgba(10,47,92,0.1)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تصعيد</button>
            </div>
            
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default CaptainOperationsScreen;
