'use client';

import React from 'react';

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

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const map = {
    high:   { label: 'ثقة عالية',   bg: '#DCFCE7', color: '#16A34A' },
    medium: { label: 'ثقة متوسطة', bg: '#FEF3C7', color: '#D97706' },
    low:    { label: 'ثقة منخفضة', bg: '#FEF2F2', color: '#DC2626' },
  };
  const { label, bg, color } = map[level];
  return <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '99px', backgroundColor: bg, color }}>{label}</span>;
}

export function CommandCenterScreen({ hubHref }: CommandCenterScreenProps) {
  return (
    <div style={{ display: 'grid', gap: '20px', direction: 'rtl' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>نبض العمليات</h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>متابعة الأداء العام والتدخلات السريعة</p>
        </div>
      </div>

      {/* KPI signals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        {SIGNALS.map((item, idx) => (
          <div key={idx} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fff', border: '1px solid rgba(10,47,92,0.08)', borderTop: `4px solid ${item.status === 'danger' ? '#DC2626' : item.status === 'warning' ? '#F59E0B' : '#0A2F5C'}` }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '24px', color: '#0A2F5C', fontWeight: 800, marginTop: '8px' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Two column: suggestions + quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Top system suggestions */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2F5C', margin: '0 0 12px 0' }}>أعلى توصيات النظام الآن</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TOP_SUGGESTIONS.map((s, idx) => (
              <div key={idx} style={{ padding: '10px 12px', backgroundColor: s.risk === 'critical' ? 'rgba(220,38,38,0.03)' : 'rgba(10,47,92,0.03)', border: `1px solid ${s.risk === 'critical' ? '#FECACA' : 'rgba(10,47,92,0.07)'}`, borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0A2F5C', marginBottom: '2px' }}>توصية النظام: {s.label}</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px' }}>السبب: {s.reason}</div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <ConfidenceBadge level={s.confidence} />
                  {s.risk === 'critical' && <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '1px 6px', borderRadius: '99px' }}>خطر حرج</span>}
                  <a href={`${hubHref}${s.href}`} style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>{s.action}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick interventions */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2F5C', margin: '0 0 12px 0' }}>تدخل سريع مطلوب</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {QUICK_ACTIONS.map((action, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid rgba(10,47,92,0.05)', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
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
