'use client';

import React from 'react';

export type PartnerStoresScreenProps = { hubHref: string; };

const STORES = [
  {
    id: 'STR-402', name: 'متجر الرياض', branch: 'العليا', status: 'مضغوط',
    prepTime: '18 دقيقة', readyOrders: 3, issue: 'تأخير مستمر: تجاوز المعدل بـ 8 دقائق',
    suggestion: { label: 'تواصل مع المتجر فوراً', reason: 'وقت التجهيز تجاوز المعدل بـ 8 دقائق', confidence: 'high' as const, action: 'تواصل', secondary: 'إيقاف مؤقت', auditRequired: false },
  },
  {
    id: 'STR-405', name: 'مقهى الشرق', branch: 'الملز', status: 'تأخير',
    prepTime: '24 دقيقة', readyOrders: 5, issue: '5 طلبات جاهزة لم يستلمها كابتن',
    suggestion: { label: 'وجّه كابتن للاستلام فوراً', reason: '5 طلبات جاهزة بلا كابتن ووقت انتظار مرتفع', confidence: 'high' as const, action: 'توجيه كباتن', secondary: 'إيقاف استقبال', auditRequired: false },
  },
  {
    id: 'STR-412', name: 'مخبز الورد', branch: 'اليرموك', status: 'مفتوح',
    prepTime: '8 دقائق', readyOrders: 0, issue: '',
    suggestion: { label: 'لا تدخل مطلوب', reason: 'وضع المتجر طبيعي ولا طلبات معلقة', confidence: 'high' as const, action: 'عرض تفاصيل', secondary: null, auditRequired: false },
  },
  {
    id: 'STR-415', name: 'مطعم الساحل', branch: 'النفل', status: 'مفتوح',
    prepTime: '12 دقيقة', readyOrders: 1, issue: '',
    suggestion: { label: 'تابع الطلب الواحد الجاهز', reason: 'طلب جاهز — تأكد من وجود كابتن مسند', confidence: 'medium' as const, action: 'تواصل مع الكابتن', secondary: null, auditRequired: false },
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

export function PartnerStoresScreen({ hubHref }: PartnerStoresScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>المتاجر والشركاء</h2>
        <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>فلاتر مختصرة</button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
        {[
          { label: 'مفتوحة', val: '142', color: '#16A34A' },
          { label: 'مغلقة', val: '38', color: '#64748B' },
          { label: 'متاجر مضغوطة', val: '12', color: '#F59E0B', accent: '#F59E0B' },
          { label: 'تأخير التجهيز', val: '5', color: '#DC2626', accent: '#DC2626' },
        ].map(({ label, val, color, accent }, i) => (
          <div key={i} style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderTop: accent ? `4px solid ${accent}` : undefined }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '24px', color, fontWeight: 800, marginTop: '8px' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Store cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        {STORES.map((store, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '16px', alignItems: 'start', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: store.status === 'تأخير' ? '4px solid #DC2626' : store.status === 'مضغوط' ? '4px solid #F59E0B' : '4px solid transparent' }}>

            {/* Col 1: Store meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{store.name}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>({store.id})</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: store.status === 'تأخير' ? '#FEF2F2' : store.status === 'مضغوط' ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: store.status === 'تأخير' ? '#DC2626' : store.status === 'مضغوط' ? '#D97706' : '#64748B' }}>{store.status}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2F5C' }}>فرع: {store.branch}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>متوسط التجهيز: {store.prepTime} | طلبات جاهزة: <span style={{ color: store.readyOrders > 2 ? '#DC2626' : '#0A2F5C', fontWeight: 700 }}>{store.readyOrders}</span></div>
            </div>

            {/* Col 2: System suggestion */}
            <div style={{ padding: '8px 10px', backgroundColor: 'rgba(10,47,92,0.03)', border: '1px solid rgba(10,47,92,0.07)', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0A2F5C', marginBottom: '2px' }}>توصية النظام: {store.suggestion.label}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>السبب: {store.suggestion.reason}</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <ConfidenceBadge level={store.suggestion.confidence} />
                {store.suggestion.auditRequired && <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '1px 6px', borderRadius: '99px' }}>يتطلب تدقيق</span>}
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <button style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>{store.suggestion.action}</button>
                {store.suggestion.secondary && <button style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{store.suggestion.secondary}</button>}
              </div>
            </div>

            {/* Col 3: Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap', alignSelf: 'center' }}>
              <button style={{ padding: '8px 12px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تواصل</button>
              <button style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>إيقاف مؤقت</button>
              <button style={{ padding: '8px 12px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>توجيه كباتن</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default PartnerStoresScreen;
