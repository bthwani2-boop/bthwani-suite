'use client';

import React from 'react';
import { OperationsSuggestionCard } from '../operations.ui';
import styles from '../dsh-surface.module.css';

export type CommandCenterScreenProps = { hubHref: string; };

const SIGNALS = [
  { label: 'الطلبات المفتوحة', value: '1,240', status: 'normal' },
  { label: 'خطر الإسناد', value: '32', status: 'danger' },
  { label: 'تغطية الكباتن', value: '88%', status: 'warning' },
  { label: 'الاستثناءات', value: '12', status: 'danger' },
  { label: 'ضغط المناطق', value: 'مرتفع', status: 'warning' },
  { label: 'خطر SLA', value: '4%', status: 'normal' },
] as const;

const TOP_SUGGESTIONS = [
  {
    label: 'تكدس شمال الرياض — فعّل Bonus فوراً',
    reason: '45 طلب بدون كابتن في منطقة الشمال',
    confidence: 'high' as const,
    action: 'تفعيل وضع الذروة',
    href: `?workspace=area-capacity`,
    risk: 'critical' as const,
  },
  {
    label: '32 طلب بدون إسناد — تدخّل الآن',
    reason: 'قائمة الإسناد تتراكم وكباتن متاحون غير مستغلين',
    confidence: 'high' as const,
    action: 'فتح الإسناد',
    href: `?workspace=dispatch-assignment`,
    risk: 'high' as const,
  },
  {
    label: '12 استثناء مفتوح — راجع قائمة الإسناد',
    reason: 'استثناءات بدون مالك تزيد من خطر خرق SLA',
    confidence: 'medium' as const,
    action: 'فتح الاستثناءات',
    href: `?workspace=exceptions-escalations`,
    risk: 'medium' as const,
  },
] as const;

const QUICK_ACTIONS = [
  { label: 'إعادة إسناد 12 طلب متأخر', time: 'منذ 5 دقائق', workspace: 'dispatch-assignment' },
  { label: 'تواصل مع المتجر رقم 402', time: 'منذ 12 دقيقة', workspace: 'partner-stores' },
  { label: 'تصعيد شكوى عميل (تأخير)', time: 'منذ 18 دقيقة', workspace: 'audit-support-sla' },
] as const;

export function CommandCenterScreen({ hubHref }: CommandCenterScreenProps) {
  return (
    <div className={styles.operationsCompactSurface} style={{ direction: 'rtl' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>نبض العمليات</h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>متابعة الأداء العام والتدخلات السريعة</p>
        </div>
      </div>

      <div className={styles.operationsSingleRowBlocks}>
        {SIGNALS.map((item, idx) => (
          <div
            key={idx}
            className={styles.operationsSingleRowItem}
            style={{ borderTop: `4px solid ${item.status === 'danger' ? '#DC2626' : item.status === 'warning' ? '#F59E0B' : '#0A2F5C'}` }}
          >
            <div className={styles.operationsCompactCardTitle}>{item.label}</div>
            <div style={{ fontSize: '18px', color: item.status === 'danger' ? '#DC2626' : item.status === 'warning' ? '#D97706' : '#0A2F5C', fontWeight: 800, lineHeight: 1.1 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
        <div className={styles.operationsCompactPanel}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>أعلى توصيات النظام الآن</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
            {TOP_SUGGESTIONS.map((s, idx) => (
              <OperationsSuggestionCard
                key={idx}
                label={s.label}
                reason={s.reason}
                confidence={s.confidence}
                actions={(
                  <a
                    href={`${hubHref}${s.href}`}
                    style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
                  >
                    {s.action}
                  </a>
                )}
              >
                {s.risk === 'critical' ? <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '1px 6px', borderRadius: '99px' }}>خطر حرج</span> : null}
              </OperationsSuggestionCard>
            ))}
          </div>
        </div>

        <div className={styles.operationsCompactPanel}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>تدخل سريع مطلوب</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
            {QUICK_ACTIONS.map((action, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', border: '1px solid rgba(10,47,92,0.05)', borderRadius: '8px', backgroundColor: '#F8FAFC', gap: '10px', minWidth: 0 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A2F5C' }}>{action.label}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{action.time}</span>
                  <a href={`${hubHref}?workspace=${action.workspace}`} style={{ padding: '4px 8px', backgroundColor: '#0A2F5C', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}>انتقل</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default CommandCenterScreen;
