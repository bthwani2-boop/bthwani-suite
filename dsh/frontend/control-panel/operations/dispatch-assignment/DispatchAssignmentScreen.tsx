'use client';

import React from 'react';
import { OperationsSuggestionCard } from '../operations.ui';

export type DispatchAssignmentScreenProps = { hubHref: string; };

const DISPATCH_ITEMS = [
  {
    id: '#ORD-9844', store: 'مخبز الورد', eta: '5 د', cap: 'سعد م.', capId: '884',
    distance: '1.2 كم', reason: 'الأقرب ومتاح', alert: '',
    suggestion: { label: 'أسند إلى سعد م. الآن', reason: 'الأقرب للمتجر 1.2 كم ومتاح الآن', confidence: 'high' as const, auditRequired: false },
  },
  {
    id: '#ORD-9845', store: 'متجر الرياض', eta: '2 د', cap: 'محمد ع.', capId: '772',
    distance: '0.8 كم', reason: 'الأفضل تقييماً', alert: '',
    suggestion: { label: 'تأكيد الإسناد لمحمد ع.', reason: 'الأفضل تقييماً ووقت استجابة أقل', confidence: 'high' as const, auditRequired: false },
  },
  {
    id: '#ORD-9846', store: 'صيدلية النور', eta: '10 د', cap: 'لا يوجد', capId: '-',
    distance: '-', reason: '-', alert: 'خطر: نقص كباتن',
    suggestion: { label: 'لا يوجد كابتن — تصعيد فوري', reason: 'المنطقة تعاني من نقص في التغطية', confidence: 'low' as const, auditRequired: true },
  },
] as const;

export function DispatchAssignmentScreen({ hubHref }: DispatchAssignmentScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>الإسناد والتوزيع</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تحديث النظام</button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>طلبات غير مسندة</div>
          <div style={{ fontSize: '24px', color: '#DC2626', fontWeight: 800, marginTop: '8px' }}>14</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>كباتن متاحون</div>
          <div style={{ fontSize: '24px', color: '#16A34A', fontWeight: 800, marginTop: '8px' }}>8</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>كباتن مشغولون</div>
          <div style={{ fontSize: '24px', color: '#F59E0B', fontWeight: 800, marginTop: '8px' }}>42</div>
        </div>
      </div>

      {/* Order cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        {DISPATCH_ITEMS.map((item, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '16px', alignItems: 'start', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: item.cap === 'لا يوجد' ? '4px solid #DC2626' : '4px solid transparent' }}>

            {/* Col 1: Order info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{item.id}</span>
                {item.alert && <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '11px', fontWeight: 700 }}>{item.alert}</span>}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2F5C' }}>المتجر: {item.store}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>وقت التجهيز المتبقي: {item.eta}</div>
            </div>

            {/* Col 2: Captain + system suggestion inline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '16px', borderRight: '1px solid rgba(10,47,92,0.05)' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>الكابتن المقترح</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: item.cap === 'لا يوجد' ? '#DC2626' : '#0A2F5C' }}>
                {item.cap} <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.capId !== '-' && `(${item.capId})`}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                المسافة: <span style={{ color: '#0A2F5C', fontWeight: 600 }}>{item.distance}</span>
                {item.reason !== '-' && <> | السبب: <span style={{ color: '#16A34A', fontWeight: 600 }}>{item.reason}</span></>}
              </div>

              <OperationsSuggestionCard
                label={item.suggestion.label}
                reason={item.suggestion.reason}
                confidence={item.suggestion.confidence}
              />
            </div>

            {/* Col 3: Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap', alignSelf: 'center' }}>
              <button style={{ padding: '8px 16px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', opacity: item.cap === 'لا يوجد' ? 0.5 : 1 }}>تأكيد الإسناد</button>
              <button style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>إعادة تعيين</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default DispatchAssignmentScreen;
