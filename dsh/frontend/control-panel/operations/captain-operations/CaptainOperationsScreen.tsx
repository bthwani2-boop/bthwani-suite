'use client';

import React from 'react';
import { OperationsSuggestionCard } from '../operations.ui';
import styles from '../dsh-surface.module.css';

export type CaptainOperationsScreenProps = { hubHref: string; };

const CAPTAINS = [
  {
    id: 'CAP-102', name: 'سعد م.', status: 'مشغول', current: '#ORD-9844',
    today: 12, performance: '85%', location: 'الرياض - العليا (منذ دقيقتين)',
    pickup: '8.2 د', dropoff: '14 د', accept: '95%', rejects: '5%', complaints: 0,
    suggestion: { label: 'أعطه أولوية للإسناد القادم', reason: 'متصل وأداؤه مقبول وبدون شكاوى', confidence: 'high' as const, action: 'تواصل', secondary: 'تحديث الحالة', auditRequired: false },
  },
  {
    id: 'CAP-105', name: 'خالد ص.', status: 'متصل', current: 'لا يوجد',
    today: 8, performance: '92%', location: 'الرياض - السليمانية (الآن)',
    pickup: '5.1 د', dropoff: '10 د', accept: '98%', rejects: '2%', complaints: 0,
    suggestion: { label: 'أسند إليه الطلب التالي', reason: 'متاح الآن وتقييمه 92% — الأفضل في المنطقة', confidence: 'high' as const, action: 'إسناد طلب', secondary: null, auditRequired: false },
  },
  {
    id: 'CAP-110', name: 'أحمد ي.', status: 'خامل', current: 'لا يوجد',
    today: 3, performance: '60%', location: 'الرياض - النرجس (منذ 15 دقيقة)',
    pickup: '12 د', dropoff: '22 د', accept: '70%', rejects: '30%', complaints: 1,
    suggestion: { label: 'راقب — معدل رفض مرتفع', reason: 'رفض 30% وشكوى واحدة — قيّد الإسناد مؤقتاً', confidence: 'medium' as const, action: 'تواصل', secondary: 'تعطيل مؤقت', auditRequired: true },
  },
  {
    id: 'CAP-112', name: 'وليد ع.', status: 'موقوف', current: '-',
    today: 0, performance: '-', location: 'غير معروف',
    pickup: '-', dropoff: '-', accept: '-', rejects: '-', complaints: '-' as const,
    suggestion: { label: 'أخفه من قائمة الإسناد', reason: 'موقوف حالياً — لا يُعرض كخيار توزيع', confidence: 'low' as const, action: 'تصعيد', secondary: 'تحديث الحالة', auditRequired: true },
  },
] as const;

export function CaptainOperationsScreen({ hubHref }: CaptainOperationsScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>تشغيل الكباتن</h2>
        <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تحديث وتصفية</button>
      </div>

      {/* Status pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {['متصل', 'غير متصل', 'مشغول', 'خامل', 'موقوف', 'إجازة'].map((s, i) => (
          <span key={i} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', backgroundColor: i === 0 ? '#DCFCE7' : i === 4 ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: i === 0 ? '#16A34A' : i === 4 ? '#DC2626' : '#64748B', border: i === 0 ? '1px solid #BBF7D0' : i === 4 ? '1px solid #FECACA' : '1px solid transparent', cursor: 'pointer' }}>{s}</span>
        ))}
      </div>

      {/* Captain cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {CAPTAINS.map((cap, idx) => (
          <div key={idx} className={`${styles.operationsCompactCard} ${cap.status === 'موقوف' ? styles.operationsCompactCardDanger : cap.status === 'مشغول' ? styles.operationsCompactCardWarning : ''}`} style={{ gridTemplateColumns: 'minmax(220px, 1.15fr) minmax(240px, 1fr) auto', padding: '10px 12px' }}>

            {/* Col 1: Identity + suggestion */}
            <div className={styles.operationsCompactCardMeta}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{cap.name}</span>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{cap.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, backgroundColor: cap.status === 'متصل' ? '#DCFCE7' : cap.status === 'موقوف' ? '#FEF2F2' : cap.status === 'مشغول' ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: cap.status === 'متصل' ? '#16A34A' : cap.status === 'موقوف' ? '#DC2626' : cap.status === 'مشغول' ? '#D97706' : '#64748B' }}>{cap.status}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#0A2F5C', fontWeight: 600, lineHeight: 1.35 }}>الطلب الحالي: {cap.current}</div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.35 }}>آخر موقع: {cap.location}</div>
              <div className={styles.operationsCompactInlineTags}>
                <span className={styles.operationsCompactTag}>اليوم {cap.today}</span>
                <span className={styles.operationsCompactTag}>تقييم {cap.performance}</span>
                <span className={styles.operationsCompactTag}>قبول {cap.accept}</span>
                <span className={styles.operationsCompactTag}>رفض {cap.rejects}</span>
                <span className={styles.operationsCompactTag}>شكاوى {cap.complaints}</span>
              </div>
            </div>

            {/* Col 2: System suggestion */}
            <OperationsSuggestionCard
              title="توصية النظام"
              label={cap.suggestion.label}
              reason={cap.suggestion.reason}
              confidence={cap.suggestion.confidence}
              actions={(
                <>
                  <button className={styles.operationsCompactActionPrimary}>{cap.suggestion.action}</button>
                  {cap.suggestion.secondary && <button className={styles.operationsCompactActionSecondary}>{cap.suggestion.secondary}</button>}
                </>
              )}
            >
              {cap.suggestion.auditRequired && <span className={styles.operationsCompactTag} style={{ color: '#DC2626', backgroundColor: '#FEF2F2' }}>audit</span>}
            </OperationsSuggestionCard>

            {/* Col 3: Actions */}
            <div className={styles.operationsCompactCardActions}>
              <div className={styles.operationsCompactActionRow} style={{ justifyContent: 'flex-end' }}>
                <button className={styles.operationsCompactActionPrimary}>{cap.suggestion.action}</button>
                {cap.suggestion.secondary && <button className={styles.operationsCompactActionSecondary}>{cap.suggestion.secondary}</button>}
                <button className={styles.operationsCompactActionSecondary} style={{ color: '#DC2626', borderColor: 'rgba(220,38,38,0.14)' }}>تعطيل مؤقت</button>
                <button className={styles.operationsCompactActionSecondary}>تصعيد</button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default CaptainOperationsScreen;
