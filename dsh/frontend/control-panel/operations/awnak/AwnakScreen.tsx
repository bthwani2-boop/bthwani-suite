'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OperationsSuggestionCard } from '../operations.ui';

export type AwnakScreenProps = {
  hubHref?: string;
};

type AwnakItem = {
  id: string;
  title: string;
  status: string;
  updated: string;
  route: string;
  confidence: 'high' | 'medium' | 'low';
  suggestion: string;
  reason: string;
  action: string;
  secondaryAction?: string;
};

const AWNAK_ITEMS: readonly AwnakItem[] = [
  {
    id: 'AWN-3101',
    title: 'دفعة الاستلام المعلق',
    status: 'جاهز للمراجعة',
    updated: 'قبل 8 دقائق',
    route: 'نقطة التشغيل العامة',
    confidence: 'high',
    suggestion: 'افتح التقدير اليدوي',
    reason: 'الدفعة تحتاج قرارًا سريعًا قبل الإرسال.',
    action: 'راجع الآن',
    secondaryAction: 'إرسال للدعم',
  },
  {
    id: 'AWN-3104',
    title: 'طلب متابعة التوصيل',
    status: 'قيد التأكيد',
    updated: 'قبل 22 دقيقة',
    route: 'فريق عونك',
    confidence: 'medium',
    suggestion: 'ثبّت الخطوة التالية',
    reason: 'القرار جاهز لكن التوقيت يحتاج تثبيت.',
    action: 'ثبّت الخطوة',
    secondaryAction: 'أجّل',
  },
  {
    id: 'AWN-3108',
    title: 'تسليم يقترب من الإغلاق',
    status: 'في المتابعة',
    updated: 'قبل ساعة',
    route: 'المشرف المباشر',
    confidence: 'high',
    suggestion: 'أغلق بعد التحقق',
    reason: 'كل الإشارات مكتملة ويمكن الإغلاق بعد التأكيد.',
    action: 'إغلاق',
    secondaryAction: 'فتح تفاصيل',
  },
] as const;

export function AwnakScreen({ hubHref = '/operations' }: AwnakScreenProps) {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>عونك</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }} onClick={() => router.refresh()}>
            تحديث
          </button>
          <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(10,47,92,0.1)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0A2F5C', cursor: 'pointer' }} onClick={() => router.push(hubHref)}>
            العودة إلى القيادة
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
        {[
          { label: 'جاهز للمراجعة', value: '9', color: '#0A2F5C' },
          { label: 'قيد التأكيد', value: '4', color: '#F59E0B' },
          { label: 'في المتابعة', value: '6', color: '#16A34A' },
          { label: 'يحتاج تصعيدًا', value: '2', color: '#DC2626' },
        ].map((item) => (
          <div key={item.label} style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '24px', color: item.color, fontWeight: 800, marginTop: '8px' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {['الكل', 'جاهز', 'قيد التأكيد', 'في المتابعة', 'تصعيد'].map((status, index) => (
          <span key={status} style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', backgroundColor: index === 0 ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: index === 0 ? '#D97706' : '#64748B', border: index === 0 ? '1px solid #FDE68A' : '1px solid transparent' }}>
            {status}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {AWNAK_ITEMS.map((item) => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: '16px', alignItems: 'start', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{item.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: item.status === 'جاهز للمراجعة' ? '#DCFCE7' : item.status === 'يحتاج تصعيدًا' ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: item.status === 'جاهز للمراجعة' ? '#16A34A' : item.status === 'يحتاج تصعيدًا' ? '#DC2626' : '#64748B' }}>{item.status}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2F5C' }}>{item.title}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>المسار: {item.route}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>آخر تحديث: {item.updated}</div>
            </div>

            <OperationsSuggestionCard
              title="توصية"
              label={item.suggestion}
              reason={item.reason}
              confidence={item.confidence}
              actions={(
                <>
                  <button style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>{item.action}</button>
                  {item.secondaryAction && <button style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{item.secondaryAction}</button>}
                </>
              )}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignSelf: 'center' }}>
              <button style={{ padding: '8px 12px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push(`${hubHref}?workspace=proxy-shein-awnak`)}>
                عرض عونك
              </button>
              <button style={{ padding: '8px 12px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push(`${hubHref}?workspace=sheinproxy`)}>
                عرض شي إن
              </button>
              <button style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push('/support')}>
                تصعيد للدعم
              </button>
              <button style={{ padding: '8px 12px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid rgba(10,47,92,0.1)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push(`${hubHref}?workspace=dispatch-assignment`)}>
                الإسناد اليدوي
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AwnakScreen;