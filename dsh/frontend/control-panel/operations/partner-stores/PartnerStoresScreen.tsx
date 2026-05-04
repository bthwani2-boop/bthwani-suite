'use client';

import React from 'react';

export type PartnerStoresScreenProps = { hubHref: string; };

export function PartnerStoresScreen({ hubHref }: PartnerStoresScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>
      
      {/* Header and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>المتاجر والشركاء</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>فلاتر مختصرة</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>مفتوحة</div>
          <div style={{ fontSize: '24px', color: '#16A34A', fontWeight: 800, marginTop: '8px' }}>142</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>مغلقة</div>
          <div style={{ fontSize: '24px', color: '#64748B', fontWeight: 800, marginTop: '8px' }}>38</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderTop: '4px solid #F59E0B' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>متاجر مضغوطة</div>
          <div style={{ fontSize: '24px', color: '#F59E0B', fontWeight: 800, marginTop: '8px' }}>12</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderTop: '4px solid #DC2626' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>تأخير التجهيز</div>
          <div style={{ fontSize: '24px', color: '#DC2626', fontWeight: 800, marginTop: '8px' }}>5</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        {[
          { id: 'STR-402', name: 'متجر الرياض', branch: 'العليا', status: 'مضغوط', prepTime: '18 دقيقة', readyOrders: 3, issue: 'تأخير مستمر: تجاوز المعدل بـ 8 دقائق' },
          { id: 'STR-405', name: 'مقهى الشرق', branch: 'الملز', status: 'تأخير', prepTime: '24 دقيقة', readyOrders: 5, issue: '5 طلبات جاهزة لم يستلمها كابتن' },
          { id: 'STR-412', name: 'مخبز الورد', branch: 'اليرموك', status: 'مفتوح', prepTime: '8 دقائق', readyOrders: 0, issue: '' },
          { id: 'STR-415', name: 'مطعم الساحل', branch: 'النفل', status: 'مفتوح', prepTime: '12 دقيقة', readyOrders: 1, issue: '' },
        ].map((store, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr', gap: '16px', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: store.status === 'تأخير' ? '4px solid #DC2626' : store.status === 'مضغوط' ? '4px solid #F59E0B' : '4px solid transparent' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{store.name}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>({store.id})</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: store.status === 'تأخير' ? '#FEF2F2' : store.status === 'مضغوط' ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: store.status === 'تأخير' ? '#DC2626' : store.status === 'مضغوط' ? '#D97706' : '#64748B' }}>{store.status}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2F5C' }}>فرع: {store.branch}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>متوسط التجهيز: {store.prepTime} | طلبات جاهزة: <span style={{ color: store.readyOrders > 2 ? '#DC2626' : '#0A2F5C', fontWeight: 700 }}>{store.readyOrders}</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {store.issue && (
                <div style={{ fontSize: '11px', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '6px 10px', borderRadius: '6px', textAlign: 'center' }}>
                  {store.issue}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
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
