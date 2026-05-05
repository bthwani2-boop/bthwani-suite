'use client';

import React from 'react';

export type AuditSupportSlaScreenProps = { hubHref: string; };

const AUDIT_ITEMS = [
  {
    id: 'SLA-101', type: 'تدخل يدوي (إسناد)', reason: 'تأخر كابتن عن الاستلام',
    orderId: '#ORD-9811', time: 'منذ 10 دقائق', status: 'مكتمل',
    suggestion: { label: 'راجع التدخل اليدوي وأغلق السجل', reason: 'الإسناد مكتمل — أضف ملاحظة وأغلق', confidence: 'high' as const, action: 'إغلاق السجل', secondary: null, auditRequired: false, needsEvidence: false },
  },
  {
    id: 'SLA-102', type: 'شكوى عميل (حي)', reason: 'طلب ناقص',
    orderId: '#ORD-9805', time: 'منذ 22 دقيقة', status: 'يحتاج تدخل',
    suggestion: { label: 'اطلب سبب النقص من المتجر', reason: '22 دقيقة والشكوى مفتوحة — خطر خرق SLA', confidence: 'high' as const, action: 'مراجعة وحل', secondary: 'ربط التذكرة بالطلب', auditRequired: true, needsEvidence: true },
  },
  {
    id: 'SLA-103', type: 'تعويض مباشر', reason: 'تأخير متجر',
    orderId: '#ORD-9750', time: 'منذ 1 ساعة', status: 'مكتمل',
    suggestion: { label: 'التعويض تم — لا تدخل إضافي', reason: 'القضية مغلقة بإثبات كامل', confidence: 'high' as const, action: 'عرض التفاصيل', secondary: null, auditRequired: false, needsEvidence: false },
  },
] as const;

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const map = {
    high:   { label: 'ثقة عالية',   bg: '#DCFCE7', color: '#16A34A' },
    medium: { label: 'ثقة متوسطة', bg: '#FEF3C7', color: '#D97706' },
    low:    { label: 'ثقة منخفضة', bg: '#FEF2F2', color: '#DC2626' },
  };
  const { label, bg, color } = map[level];
  return <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '99px', backgroundColor: bg, color }}>{label}</span>;
}

export function AuditSupportSlaScreen({ hubHref }: AuditSupportSlaScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>التدقيق والدعم وSLA</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>فلاتر مختصرة</button>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>عرض التقرير التفصيلي</button>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تصدير CSV</button>
        </div>
      </div>

      {/* SLA Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1.5fr', gap: '12px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>متوسط قبول الطلب</div>
          <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>1.2 <span style={{ fontSize: '14px', fontWeight: 600 }}>دقيقة</span></div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>متوسط التجهيز</div>
          <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>14.5 <span style={{ fontSize: '14px', fontWeight: 600 }}>دقيقة</span></div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>متوسط الوصول</div>
          <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>18.2 <span style={{ fontSize: '14px', fontWeight: 600 }}>دقيقة</span></div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderTop: '4px solid #DC2626' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>نسبة التأخير</div>
          <div style={{ fontSize: '24px', color: '#DC2626', fontWeight: 800, marginTop: '8px' }}>4.2%</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2F5C' }}>أسباب التأخير الرئيسية (SLA)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700 }}>45%</span><span style={{ fontSize: '12px', color: '#64748B' }}>نقص الكباتن</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 700 }}>30%</span><span style={{ fontSize: '12px', color: '#64748B' }}>تأخير المتاجر</span></div>
        </div>
      </div>

      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2F5C', margin: '8px 0 0' }}>سجل التدخلات اليدوية وشكاوى الدعم</h3>

      {/* Audit cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {AUDIT_ITEMS.map((item, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: '16px', alignItems: 'start', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: item.status === 'يحتاج تدخل' ? '4px solid #DC2626' : '4px solid transparent' }}>

            {/* Col 1: Audit meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{item.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: item.status === 'يحتاج تدخل' ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: item.status === 'يحتاج تدخل' ? '#DC2626' : '#64748B' }}>{item.status}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A2F5C' }}>{item.type}</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>السبب: <span style={{ fontWeight: 600, color: '#0A2F5C' }}>{item.reason}</span></div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>المرتبط: <span style={{ fontWeight: 600, color: '#0A2F5C', textDecoration: 'underline', cursor: 'pointer' }}>{item.orderId}</span></div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>الزمن: {item.time}</div>
            </div>

            {/* Col 2: System suggestion */}
            <div style={{ padding: '8px 10px', backgroundColor: 'rgba(10,47,92,0.03)', border: '1px solid rgba(10,47,92,0.07)', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0A2F5C', marginBottom: '2px' }}>توصية النظام: {item.suggestion.label}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>السبب: {item.suggestion.reason}</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <ConfidenceBadge level={item.suggestion.confidence} />
                {item.suggestion.auditRequired && <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '1px 6px', borderRadius: '99px' }}>يتطلب تدقيق</span>}
                {item.suggestion.needsEvidence && <span style={{ fontSize: '10px', fontWeight: 700, color: '#D97706', backgroundColor: '#FEF3C7', padding: '1px 6px', borderRadius: '99px' }}>يحتاج إثبات</span>}
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <button style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>{item.suggestion.action}</button>
                {item.suggestion.secondary && <button style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{item.suggestion.secondary}</button>}
              </div>
            </div>

            {/* Col 3: Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap', alignSelf: 'center' }}>
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
