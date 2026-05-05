'use client';

import React from 'react';
import { OperationsSuggestionCard } from '../operations.ui';

export type LiveOrdersScreenProps = { hubHref: string; };

const LIVE_ORDERS = [
  {
    id: '#ORD-9821', store: 'متجر الرياض', customer: 'أحمد م.', status: 'متأخر', time: '12 دقيقة', captain: 'غير مسند', threat: 'مرتفع',
    suggestion: { label: 'صعّد للمشرف فوراً', reason: 'تأخير 12 دقيقة وبلا كابتن', confidence: 'high' as const, action: 'تصعيد للمشرف', secondary: 'فتح الإسناد', auditRequired: true },
  },
  {
    id: '#ORD-9822', store: 'مقهى الشرق', customer: 'سارة ي.', status: 'قيد التجهيز', time: '5 دقائق', captain: 'خالد (مسند)', threat: 'طبيعي',
    suggestion: { label: 'تابع حالة التجهيز', reason: 'وقت تجهيز ضمن المعدل', confidence: 'medium' as const, action: 'تواصل مع المتجر', secondary: null, auditRequired: false },
  },
  {
    id: '#ORD-9823', store: 'مطعم الساحل', customer: 'فهد ع.', status: 'جاهز للاستلام', time: '8 دقائق', captain: 'في الطريق', threat: 'متوسط',
    suggestion: { label: 'افتح الإسناد إذا تأخر الكابتن', reason: 'جاهز للاستلام ووقت الانتظار يتصاعد', confidence: 'medium' as const, action: 'فتح الإسناد', secondary: 'تواصل مع الكابتن', auditRequired: false },
  },
  {
    id: '#ORD-9824', store: 'مخبز الورد', customer: 'خالد ص.', status: 'في الطريق', time: '22 دقيقة', captain: 'أحمد', threat: 'طبيعي',
    suggestion: { label: 'الكابتن في الطريق — لا تدخل الآن', reason: 'المسار طبيعي والوقت ضمن المعدل', confidence: 'high' as const, action: 'عرض تفاصيل', secondary: null, auditRequired: false },
  },
] as const;

export function LiveOrdersScreen({ hubHref }: LiveOrdersScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>الطلبات الحية</h2>
        <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>فلاتر مختصرة</button>
      </div>

      {/* Status pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {['جديد', 'مقبول', 'قيد التجهيز', 'جاهز للاستلام', 'مسند', 'مستلم', 'في الطريق', 'تم التسليم', 'متأخر', 'فشل/ملغي'].map((s, i) => (
          <span key={i} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', backgroundColor: i === 8 ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: i === 8 ? '#DC2626' : '#64748B', border: i === 8 ? '1px solid #FECACA' : '1px solid transparent', cursor: 'pointer' }}>{s}</span>
        ))}
      </div>

      {/* Order cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {LIVE_ORDERS.map((order, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.4fr 1fr', gap: '16px', alignItems: 'start', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: order.status === 'متأخر' ? '4px solid #DC2626' : '4px solid transparent' }}>

            {/* Col 1: Order meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{order.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, backgroundColor: order.status === 'متأخر' ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: order.status === 'متأخر' ? '#DC2626' : '#64748B' }}>{order.status}</span>
                {order.threat === 'مرتفع' && <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700 }}>خطر مرتفع</span>}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2F5C' }}>{order.store} | {order.customer}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>انتظار: {order.time} | الكابتن: {order.captain}</div>
            </div>

            {/* Col 2: System suggestion */}
            <OperationsSuggestionCard
              label={order.suggestion.label}
              reason={order.suggestion.reason}
              confidence={order.suggestion.confidence}
              actions={(
                <>
                  <button style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>{order.suggestion.action}</button>
                  {order.suggestion.secondary && <button style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{order.suggestion.secondary}</button>}
                </>
              )}
            >
              {order.suggestion.auditRequired && <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '1px 6px', borderRadius: '99px' }}>يتطلب تدقيق</span>}
            </OperationsSuggestionCard>

            {/* Col 3: Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', alignSelf: 'center' }}>
              <button style={{ padding: '8px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>إعادة إسناد</button>
              <button style={{ padding: '8px', backgroundColor: 'transparent', color: '#0A2F5C', border: '1px solid rgba(10,47,92,0.1)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>تواصل</button>
              <button style={{ padding: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>تصعيد</button>
              <button style={{ padding: '8px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid rgba(10,47,92,0.1)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>ملاحظة</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default LiveOrdersScreen;
