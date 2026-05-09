'use client';

import React from 'react';
import { OperationsSuggestionCard } from './operations.ui';
import styles from './dsh-surface.module.css';

export type PartnerStoresScreenProps = { hubHref: string; subGroup?: string; };

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

export function PartnerStoresScreen({ hubHref, subGroup }: PartnerStoresScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', direction: 'rtl', height: '100%', minWidth: 0 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>المتاجر والشركاء</h2>
        <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>فلاتر مختصرة</button>
      </div>

      {/* KPI row */}
      <div className={styles.operationsSingleRowBlocks}>
        {[
          { label: 'مفتوحة', val: '142', color: '#16A34A' },
          { label: 'مغلقة', val: '38', color: '#64748B' },
          { label: 'متاجر مضغوطة', val: '12', color: '#F59E0B', accent: '#F59E0B' },
          { label: 'تأخير التجهيز', val: '5', color: '#DC2626', accent: '#DC2626' },
        ].map(({ label, val, color, accent }, i) => (
          <div key={i} className={styles.operationsSingleRowItem} style={{ borderTop: accent ? `4px solid ${accent}` : undefined }}>
            <div className={styles.operationsCompactCardTitle}>{label}</div>
            <div style={{ fontSize: '18px', color, fontWeight: 800, lineHeight: 1.1 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Store cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
        {STORES.map((store, idx) => (
          <div key={idx} className={`${styles.operationsCompactCard} ${store.status === 'تأخير' ? styles.operationsCompactCardDanger : store.status === 'مضغوط' ? styles.operationsCompactCardWarning : ''}`} style={{ gridTemplateColumns: 'minmax(220px, 1.2fr) minmax(240px, 1fr) auto' }}>

            {/* Col 1: Store meta */}
            <div className={styles.operationsCompactCardMeta}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{store.name}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>({store.id})</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: store.status === 'تأخير' ? '#FEF2F2' : store.status === 'مضغوط' ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: store.status === 'تأخير' ? '#DC2626' : store.status === 'مضغوط' ? '#D97706' : '#64748B' }}>{store.status}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2F5C', lineHeight: 1.35 }}>فرع: {store.branch}</div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.35 }}>متوسط التجهيز: {store.prepTime} | طلبات جاهزة: <span style={{ color: store.readyOrders > 2 ? '#DC2626' : '#0A2F5C', fontWeight: 700 }}>{store.readyOrders}</span></div>
            </div>

            {/* Col 2: System suggestion */}
            <OperationsSuggestionCard
              label={store.suggestion.label}
              reason={store.suggestion.reason}
              confidence={store.suggestion.confidence}
              actions={(
                <>
                  <button style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>{store.suggestion.action}</button>
                  {store.suggestion.secondary && <button style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{store.suggestion.secondary}</button>}
                </>
              )}
            />

            {/* Col 3: Actions */}
            <div className={styles.operationsCompactCardActions}>
              <div className={styles.operationsCompactActionRow} style={{ justifyContent: 'flex-end' }}>
                <button className={styles.operationsCompactActionPrimary}>تواصل</button>
                <button className={styles.operationsCompactActionSecondary} style={{ color: '#DC2626', borderColor: 'rgba(220,38,38,0.14)' }}>إيقاف مؤقت</button>
                <button className={styles.operationsCompactActionSecondary}>توجيه كباتن</button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default PartnerStoresScreen;
