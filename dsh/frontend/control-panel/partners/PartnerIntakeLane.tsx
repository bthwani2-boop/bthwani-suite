'use client';

import React from 'react';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { OperationsSuggestionCard } from '../operations/operations.ui';
import { dshPartnerIntakeItems, dshPartnerIntakeMetrics } from './workflow';
import styles from '../operations/dsh-surface.module.css';

export type PartnerIntakeLaneProps = {
  state?: 'ready' | 'loading' | 'error';
  hubHref: string;
  onRetry?: () => void;
};

export function PartnerIntakeLane({ state = 'ready', hubHref, onRetry }: PartnerIntakeLaneProps) {
  if (state === 'loading') {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#0A2F5C' }}>
        <h3>جارٍ تحميل طلبات الميدان...</h3>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#DC2626', background: '#FEF2F2', borderRadius: '12px' }}>
        <h3>تعذر تحميل طلبات الشركاء</h3>
        <button onClick={onRetry} style={{ marginTop: '12px', padding: '6px 16px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>إعادة المحاولة</button>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', direction: 'rtl', height: '100%', minWidth: 0 }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>طلبات الميدان والشركاء</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تصفية الحالات</button>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>تاريخ الطلبات</button>
        </div>
      </div>

      {/* KPI row */}
      <div className={styles.operationsSingleRowBlocks}>
        {dshPartnerIntakeMetrics.map((metric, i) => (
          <div key={metric.id} className={styles.operationsSingleRowItem} style={{ borderTop: i === 0 ? `4px solid #FF500D` : undefined }}>
            <div className={styles.operationsCompactCardTitle}>{metric.label}</div>
            <div style={{ fontSize: '18px', color: i === 0 ? '#FF500D' : '#0A2F5C', fontWeight: 800, lineHeight: 1.1 }}>{metric.value}</div>
          </div>
        ))}
        <div className={styles.operationsSingleRowItem}>
          <div className={styles.operationsCompactCardTitle}>متوسط وقت القرار</div>
          <div style={{ fontSize: '18px', color: '#16A34A', fontWeight: 800, lineHeight: 1.1 }}>14m</div>
        </div>
      </div>

      {/* Intake Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
        {dshPartnerIntakeItems.map((item) => {
          const isWarning = item.queue === 'offer-approval';
          const isSuccess = item.queue === 'marketing-review';
          
          return (
            <div 
              key={item.id} 
              className={`${styles.operationsCompactCard} ${isWarning ? styles.operationsCompactCardWarning : ''}`}
              style={{ gridTemplateColumns: 'minmax(240px, 1.2fr) minmax(300px, 1.5fr) auto' }}
            >
              {/* Col 1: Partner Meta */}
              <div className={styles.operationsCompactCardMeta}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{item.storeName}</span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>({item.id})</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '6px', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    backgroundColor: isWarning ? '#FEF3C7' : isSuccess ? '#F0FDF4' : 'rgba(10,47,92,0.04)', 
                    color: isWarning ? '#D97706' : isSuccess ? '#16A34A' : '#64748B' 
                  }}>
                    {item.fieldStatusLabel}
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2F5C', lineHeight: 1.35 }}>
                  {item.categoryLabel} · {item.ownerLabel}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.35 }}>
                  المصدر: {item.source} | أُرسل: {item.submittedAt}
                </div>
              </div>

              {/* Col 2: System Suggestion */}
              <OperationsSuggestionCard
                label={item.nextStep}
                reason={item.note}
                confidence={isWarning ? 'high' : 'medium'}
                actions={(
                  <>
                    <button style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                      {item.queue === 'offer-approval' ? 'اعتماد العرض' : item.queue === 'partner-review' ? 'إنشاء الكود' : 'إطلاق نهائي'}
                    </button>
                    <button style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                      تعديل
                    </button>
                  </>
                )}
              />

              {/* Col 3: Quick Actions */}
              <div className={styles.operationsCompactCardActions}>
                <div className={styles.operationsCompactActionRow} style={{ justifyContent: 'flex-end' }}>
                  <button className={styles.operationsCompactActionPrimary}>تفاصيل</button>
                  <button className={styles.operationsCompactActionSecondary}>تواصل</button>
                  <button className={styles.operationsCompactActionSecondary} style={{ color: '#DC2626', borderColor: 'rgba(220,38,38,0.14)' }}>رفض</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default PartnerIntakeLane;
