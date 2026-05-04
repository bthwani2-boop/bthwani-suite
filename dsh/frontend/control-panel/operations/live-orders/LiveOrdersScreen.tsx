'use client';

import React from 'react';

export type LiveOrdersScreenProps = { hubHref: string; };

export function LiveOrdersScreen({ hubHref }: LiveOrdersScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>
      
      {/* Header and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>الطلبات الحية</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>فلاتر مختصرة</button>
        </div>
      </div>

      {/* Status Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {['جديد', 'مقبول', 'قيد التجهيز', 'جاهز للاستلام', 'مسند', 'مستلم', 'في الطريق', 'تم التسليم', 'متأخر', 'فشل/ملغي'].map((status, idx) => (
          <span key={idx} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', backgroundColor: idx === 8 ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: idx === 8 ? '#DC2626' : '#64748B', border: idx === 8 ? '1px solid #FECACA' : '1px solid transparent', cursor: 'pointer' }}>
            {status}
          </span>
        ))}
      </div>

      {/* Wide Rich Live Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { id: '#ORD-9821', store: 'متجر الرياض', customer: 'أحمد م.', status: 'متأخر', time: '12 دقيقة', captain: 'غير مسند', threat: 'مرتفع' },
          { id: '#ORD-9822', store: 'مقهى الشرق', customer: 'سارة ي.', status: 'قيد التجهيز', time: '5 دقائق', captain: 'خالد (مسند)', threat: 'طبيعي' },
          { id: '#ORD-9823', store: 'مطعم الساحل', customer: 'فهد ع.', status: 'جاهز للاستلام', time: '8 دقائق', captain: 'في الطريق', threat: 'متوسط' },
          { id: '#ORD-9824', store: 'مخبز الورد', customer: 'خالد ص.', status: 'في الطريق', time: '22 دقيقة', captain: 'أحمد', threat: 'طبيعي' },
        ].map((order, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '16px', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: order.status === 'متأخر' ? '4px solid #DC2626' : '4px solid transparent' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{order.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, backgroundColor: order.status === 'متأخر' ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: order.status === 'متأخر' ? '#DC2626' : '#64748B' }}>{order.status}</span>
                {order.threat === 'مرتفع' && <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700 }}>خطر مرتفع</span>}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2F5C' }}>{order.store} | العميل: {order.customer}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>وقت التجهيز/الانتظار: {order.time} | الكابتن: {order.captain}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* Optional metrics or extra info here if needed */}
              {order.status === 'متأخر' && (
                 <div style={{ fontSize: '11px', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '6px 10px', borderRadius: '6px', textAlign: 'center' }}>
                   تجاوز وقت التجهيز المتوقع. يحتاج تدخل سريع.
                 </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button style={{ padding: '8px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>إعادة إسناد</button>
              <button style={{ padding: '8px', backgroundColor: 'transparent', color: '#0A2F5C', border: '1px solid rgba(10,47,92,0.1)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تواصل</button>
              <button style={{ padding: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تصعيد</button>
              <button style={{ padding: '8px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid rgba(10,47,92,0.1)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>ملاحظة تشغيلية</button>
            </div>
            
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default LiveOrdersScreen;
