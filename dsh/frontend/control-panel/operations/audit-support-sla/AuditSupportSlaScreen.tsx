'use client';

import React from 'react';

export type AuditSupportSlaScreenProps = { hubHref: string; };

export function AuditSupportSlaScreen({ hubHref }: AuditSupportSlaScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>
      
      {/* Header and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>التدقيق والدعم وSLA</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>فلاتر مختصرة</button>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>عرض التقرير التفصيلي</button>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تصدير CSV</button>
        </div>
      </div>

      {/* SLA Analytics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1.5fr', gap: '12px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>متوسط قبول الطلب</div>
          <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>1.2 <span style={{fontSize: '14px', fontWeight: 600}}>دقيقة</span></div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>متوسط التجهيز</div>
          <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>14.5 <span style={{fontSize: '14px', fontWeight: 600}}>دقيقة</span></div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>متوسط الوصول</div>
          <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>18.2 <span style={{fontSize: '14px', fontWeight: 600}}>دقيقة</span></div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderTop: '4px solid #DC2626' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>نسبة التأخير</div>
          <div style={{ fontSize: '24px', color: '#DC2626', fontWeight: 800, marginTop: '8px' }}>4.2%</div>
        </div>
        
        {/* SLA Breaches Insight Inline */}
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2F5C' }}>أسباب التأخير الرئيسية (SLA)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700 }}>45%</span> <span style={{ fontSize: '12px', color: '#64748B' }}>نقص الكباتن</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 700 }}>30%</span> <span style={{ fontSize: '12px', color: '#64748B' }}>تأخير المتاجر</span>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2F5C', margin: '8px 0 0' }}>سجل التدخلات اليدوية وشكاوى الدعم (Support Bridge)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { id: 'SLA-101', type: 'تدخل يدوي (إسناد)', reason: 'تأخر كابتن عن الاستلام', orderId: '#ORD-9811', time: 'منذ 10 دقائق', status: 'مكتمل' },
          { id: 'SLA-102', type: 'شكوى عميل (حي)', reason: 'طلب ناقص', orderId: '#ORD-9805', time: 'منذ 22 دقيقة', status: 'يحتاج تدخل' },
          { id: 'SLA-103', type: 'تعويض مباشر', reason: 'تأخير متجر', orderId: '#ORD-9750', time: 'منذ 1 ساعة', status: 'مكتمل' },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: item.status === 'يحتاج تدخل' ? '4px solid #DC2626' : '4px solid transparent' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{item.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: item.status === 'يحتاج تدخل' ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: item.status === 'يحتاج تدخل' ? '#DC2626' : '#64748B' }}>{item.status}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A2F5C' }}>{item.type}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '12px', color: '#64748B' }}>السبب: <span style={{ fontWeight: 600, color: '#0A2F5C' }}>{item.reason}</span></div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>المرتبط: <span style={{ fontWeight: 600, color: '#0A2F5C', textDecoration: 'underline', cursor: 'pointer' }}>{item.orderId}</span></div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>الزمن: {item.time}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {item.status === 'يحتاج تدخل' ? (
                <>
                  <button style={{ padding: '8px 16px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>مراجعة وحل</button>
                  <button style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>توجيه</button>
                </>
              ) : (
                <button style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid rgba(10,47,92,0.1)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>عرض التفاصيل</button>
              )}
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}

export default AuditSupportSlaScreen;
