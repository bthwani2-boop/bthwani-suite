'use client';

import React from 'react';

export type CommandCenterScreenProps = { hubHref: string; };

export function CommandCenterScreen({ hubHref }: CommandCenterScreenProps) {
  return (
    <div style={{ display: 'grid', gap: '20px', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>نبض العمليات</h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>متابعة الأداء العام والتدخلات السريعة</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'الطلبات المفتوحة', value: '1,240', status: 'normal' },
          { label: 'خطر الإسناد', value: '32', status: 'danger' },
          { label: 'تغطية الكباتن', value: '88%', status: 'warning' },
          { label: 'الاستثناءات', value: '12', status: 'danger' },
          { label: 'ضغط المناطق', value: 'مرتفع', status: 'warning' },
          { label: 'خطر SLA', value: '4%', status: 'normal' },
        ].map((item, idx) => (
          <div key={idx} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fff', border: '1px solid rgba(10, 47, 92, 0.08)', borderTop: `4px solid ${item.status === 'danger' ? '#FF500D' : item.status === 'warning' ? '#F59E0B' : '#0A2F5C'}` }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid rgba(10, 47, 92, 0.08)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2F5C', margin: '0 0 16px 0' }}>أعلى خطر الآن</h3>
          <div style={{ padding: '12px', backgroundColor: 'rgba(255, 80, 13, 0.06)', borderLeft: '4px solid #FF500D', borderRadius: '4px' }}>
            <strong style={{ color: '#FF500D', fontSize: '13px' }}>تكدس طلبات في منطقة الشمال</strong>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>نقص في عدد الكباتن المتاحين مقابل 45 طلب قيد الانتظار.</p>
          </div>
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0A2F5C', margin: '0 0 8px 0' }}>الإجراء التالي:</h4>
            <button style={{ padding: '8px 16px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>تفعيل وضع الذروة (Peak Mode)</button>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid rgba(10, 47, 92, 0.08)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2F5C', margin: '0 0 16px 0' }}>تدخل سريع</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'إعادة إسناد 12 طلب متأخر', time: 'منذ 5 دقائق' },
              { label: 'تواصل مع المتجر رقم 402', time: 'منذ 12 دقيقة' },
              { label: 'تصعيد شكوى عميل (تأخير)', time: 'منذ 18 دقيقة' }
            ].map((action, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid rgba(10, 47, 92, 0.05)', borderRadius: '6px', backgroundColor: '#F8FAFC' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A2F5C' }}>{action.label}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>{action.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandCenterScreen;
