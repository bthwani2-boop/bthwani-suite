'use client';

import React from 'react';

export type AreaCapacityScreenProps = { hubHref: string; };

const AREAS = [
  {
    id: 'AREA-1', name: 'شمال الرياض', status: 'متأزمة',
    orders: 124, caps: 30, eta: '45 دقيقة',
    suggestion: { label: 'فعّل Bonus فوراً', reason: 'عجز 40 كابتن مقابل 124 طلب — خطر إغلاق', confidence: 'high' as const, action: 'تفعيل Bonus Area', secondary: 'إيقاف مؤقت', auditRequired: false, risk: 'critical' as const },
  },
  {
    id: 'AREA-2', name: 'شرق الرياض', status: 'مزدحمة',
    orders: 85, caps: 25, eta: '30 دقيقة',
    suggestion: { label: 'قلّل النطاق مؤقتاً', reason: 'ETA مرتفع 30 دقيقة مع انخفاض تغطية الكباتن', confidence: 'medium' as const, action: 'تقليل النطاق', secondary: 'انقل الضغط', auditRequired: false, risk: 'medium' as const },
  },
  {
    id: 'AREA-3', name: 'وسط الرياض', status: 'مستقرة',
    orders: 42, caps: 50, eta: '15 دقيقة',
    suggestion: { label: 'لا تدخل مطلوب', reason: 'التغطية ممتازة — الكباتن أكثر من الطلبات', confidence: 'high' as const, action: 'عرض التفاصيل', secondary: null, auditRequired: false, risk: 'low' as const },
  },
  {
    id: 'AREA-4', name: 'جنوب الرياض', status: 'مستقرة',
    orders: 20, caps: 35, eta: '12 دقيقة',
    suggestion: { label: 'يمكن نقل كباتن للشمال', reason: 'الجنوب مستقر ويملك فائضاً يساعد الشمال', confidence: 'medium' as const, action: 'نقل الكباتن', secondary: null, auditRequired: false, risk: 'low' as const },
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

export function AreaCapacityScreen({ hubHref }: AreaCapacityScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>المناطق والسعة</h2>
        <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تحديث وتصفية</button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
        {[
          { label: 'إجمالي الطلبات', val: '842', color: '#0A2F5C' },
          { label: 'إجمالي الكباتن', val: '320', color: '#0A2F5C' },
          { label: 'مناطق مزدحمة', val: '2', color: '#F59E0B', accent: '#F59E0B' },
          { label: 'مناطق متأزمة', val: '1', color: '#DC2626', accent: '#DC2626' },
        ].map(({ label, val, color, accent }, i) => (
          <div key={i} style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderTop: accent ? `4px solid ${accent}` : undefined }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '24px', color, fontWeight: 800, marginTop: '8px' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Area cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        {AREAS.map((area, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: '16px', alignItems: 'start', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: area.status === 'متأزمة' ? '4px solid #DC2626' : area.status === 'مزدحمة' ? '4px solid #F59E0B' : '4px solid transparent' }}>

            {/* Col 1: Area meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{area.name}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>({area.id})</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: area.status === 'متأزمة' ? '#FEF2F2' : area.status === 'مزدحمة' ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: area.status === 'متأزمة' ? '#DC2626' : area.status === 'مزدحمة' ? '#D97706' : '#64748B' }}>{area.status}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>طلبات: <span style={{ fontWeight: 600, color: '#0A2F5C' }}>{area.orders}</span> | كباتن: <span style={{ fontWeight: 600, color: '#0A2F5C' }}>{area.caps}</span></div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>متوسط ETA: <span style={{ fontWeight: 600, color: '#0A2F5C' }}>{area.eta}</span></div>
            </div>

            {/* Col 2: System suggestion */}
            <div style={{ padding: '8px 10px', backgroundColor: 'rgba(10,47,92,0.03)', border: '1px solid rgba(10,47,92,0.07)', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0A2F5C', marginBottom: '2px' }}>توصية النظام: {area.suggestion.label}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>السبب: {area.suggestion.reason}</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <ConfidenceBadge level={area.suggestion.confidence} />
                {area.suggestion.risk === 'critical' && <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '1px 6px', borderRadius: '99px' }}>خطر حرج</span>}
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <button style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>{area.suggestion.action}</button>
                {area.suggestion.secondary && <button style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{area.suggestion.secondary}</button>}
              </div>
            </div>

            {/* Col 3: Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap', alignSelf: 'center' }}>
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
