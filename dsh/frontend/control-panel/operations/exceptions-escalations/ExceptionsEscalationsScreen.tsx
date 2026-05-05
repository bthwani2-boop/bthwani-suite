'use client';

import React from 'react';
import { OperationsSuggestionCard } from '../operations.ui';

export type ExceptionsEscalationsScreenProps = { hubHref: string; };

const EXCEPTIONS = [
  {
    id: 'EXC-8812', type: 'تأخير غير مبرر للطلب', severity: 'عالي',
    owner: 'نظام الإسناد', start: 'منذ 15 دقيقة', lastAction: 'توجيه تنبيه للكابتن',
    resolution: 'إعادة إسناد الطلب',
    suggestion: { label: 'أعد الإسناد لكابتن آخر', reason: '15 دقيقة تأخير — الكابتن الحالي لا يتحرك', confidence: 'high' as const, action: 'إعادة إسناد', secondary: 'تصعيد للمشرف', auditRequired: false, severity: 'high' as const },
  },
  {
    id: 'EXC-8813', type: 'تعطل مركبة كابتن', severity: 'عالي جداً',
    owner: 'الدعم الفني', start: 'منذ 8 دقائق', lastAction: 'قيد التواصل',
    resolution: 'إلغاء الإسناد لكابتن بديل',
    suggestion: { label: 'حوّل للدعم وأسند كابتن بديل فوراً', reason: 'تعطل فعلي — العميل ينتظر وSLA مهدد', confidence: 'high' as const, action: 'تطبيق الإجراء', secondary: 'تصعيد للإدارة', auditRequired: true, severity: 'critical' as const },
  },
  {
    id: 'EXC-8814', type: 'إغلاق متجر مفاجئ', severity: 'متوسط',
    owner: 'إدارة الشركاء', start: 'منذ 25 دقيقة', lastAction: 'إيقاف مؤقت للاستقبال',
    resolution: '',
    suggestion: { label: 'أغلق الاستثناء بعد تأكيد إيقاف الاستقبال', reason: 'الاستقبال موقوف مؤقتاً — لا طلبات جديدة ستصل', confidence: 'medium' as const, action: 'إغلاق الاستثناء', secondary: 'تواصل مع الشريك', auditRequired: false, severity: 'medium' as const },
  },
] as const;

export function ExceptionsEscalationsScreen({ hubHref }: ExceptionsEscalationsScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl', height: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>الاستثناءات والتصعيد</h2>
        <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }}>فلاتر مختصرة</button>
      </div>

      {/* Status pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {['الكل', 'مفتوح', 'قيد المراجعة', 'يحتاج تصعيد', 'مغلق'].map((s, i) => (
          <span key={i} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', backgroundColor: i === 3 ? '#FEF2F2' : i === 1 ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: i === 3 ? '#DC2626' : i === 1 ? '#D97706' : '#64748B', border: i === 3 ? '1px solid #FECACA' : i === 1 ? '1px solid #FDE68A' : '1px solid transparent', cursor: 'pointer' }}>{s}</span>
        ))}
      </div>

      {/* Exception cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {EXCEPTIONS.map((exc, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: '16px', alignItems: 'start', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)', borderRight: exc.severity === 'عالي جداً' ? '4px solid #DC2626' : exc.severity === 'عالي' ? '4px solid #F59E0B' : '4px solid transparent' }}>

            {/* Col 1: Exception meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{exc.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: exc.severity === 'عالي جداً' ? '#FEF2F2' : exc.severity === 'عالي' ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: exc.severity === 'عالي جداً' ? '#DC2626' : exc.severity === 'عالي' ? '#D97706' : '#64748B' }}>{exc.severity}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A2F5C' }}>{exc.type}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>البداية: <span style={{ fontWeight: 600 }}>{exc.start}</span> | المالك: <span style={{ fontWeight: 600 }}>{exc.owner}</span></div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>آخر إجراء: <span style={{ fontWeight: 600, color: '#0A2F5C' }}>{exc.lastAction}</span></div>
              {exc.resolution && <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>مقترح: <span style={{ color: '#0A2F5C', fontWeight: 600 }}>{exc.resolution}</span></div>}
            </div>

            {/* Col 2: System suggestion */}
            <OperationsSuggestionCard
              label={exc.suggestion.label}
              reason={exc.suggestion.reason}
              confidence={exc.suggestion.confidence}
              actions={(
                <>
                  <button style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>{exc.suggestion.action}</button>
                  {exc.suggestion.secondary && <button style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{exc.suggestion.secondary}</button>}
                </>
              )}
            >
              {exc.suggestion.severity === 'critical' && <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '1px 6px', borderRadius: '99px' }}>خطر حرج</span>}
              {exc.suggestion.auditRequired && <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '1px 6px', borderRadius: '99px' }}>يتطلب تدقيق</span>}
            </OperationsSuggestionCard>

            {/* Col 3: Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap', alignSelf: 'center' }}>
              <button style={{ padding: '8px 12px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تطبيق الإجراء</button>
              <button style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>تصعيد للإدارة</button>
              <button style={{ padding: '8px 12px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>إغلاق الاستثناء</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ExceptionsEscalationsScreen;
