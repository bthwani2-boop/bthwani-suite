'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OperationsSuggestionCard } from '../operations.ui';

export type ControlPanelDshSheinProxyScreenProps = {
  hubHref?: string;
};

type SheinProxyItem = {
  id: string;
  customer: string;
  product: string;
  status: string;
  updated: string;
  amount: string;
  shipping: string;
  fee: string;
  total: string;
  confidence: 'high' | 'medium' | 'low';
  suggestion: string;
  reason: string;
  action: string;
  secondaryAction?: string;
  tags?: string[];
};

const SHEIN_PROXY_ITEMS: readonly SheinProxyItem[] = [
  {
    id: 'SPX-2048',
    customer: 'نورة الفهد',
    product: 'معطف خفيف',
    status: 'قيد المراجعة',
    updated: 'قبل 10 دقائق',
    amount: '1,280 ريال',
    shipping: '96 ريال',
    fee: '110 ريال',
    total: '1,486 ريال',
    confidence: 'high',
    suggestion: 'افتح التقدير أولاً',
    reason: 'المراجعة الأولى جاهزة والمرجع واضح.',
    action: 'افحص الطلب',
    secondaryAction: 'افتح التقدير',
    tags: ['SHEIN', 'NOW'],
  },
  {
    id: 'SPX-2051',
    customer: 'مريم خالد',
    product: 'حقيبة منظمة',
    status: 'مقدّرة',
    updated: 'قبل 18 دقيقة',
    amount: '840 ريال',
    shipping: '62 ريال',
    fee: '88 ريال',
    total: '990 ريال',
    confidence: 'medium',
    suggestion: 'انقلها إلى العرض',
    reason: 'التقدير جاهز والخطوة التالية واضحة.',
    action: 'افتح العرض',
    secondaryAction: 'راجع السعر',
    tags: ['SHEIN'],
  },
  {
    id: 'SPX-2064',
    customer: 'سعيد حسن',
    product: 'حذاء تدريب',
    status: 'تم إرسال العرض',
    updated: 'قبل 32 دقيقة',
    amount: '1,620 ريال',
    shipping: '74 ريال',
    fee: '125 ريال',
    total: '1,819 ريال',
    confidence: 'high',
    suggestion: 'تابع رد العميل',
    reason: 'العرض خرج للعميل وينتظر ردًا.',
    action: 'تابع الطلب',
    secondaryAction: 'أعد الإرسال',
    tags: ['AWNAK'],
  },
  {
    id: 'SPX-2072',
    customer: 'دانا صالح',
    product: 'طقم محبوك',
    status: 'مجدولة',
    updated: 'قبل ساعة',
    amount: '1,010 ريال',
    shipping: '55 ريال',
    fee: '94 ريال',
    total: '1,159 ريال',
    confidence: 'medium',
    suggestion: 'ثبّت نافذة الاستلام',
    reason: 'الجدولة جاهزة ويجب إبقاء الموعد واضحًا.',
    action: 'افتح الجدولة',
    secondaryAction: 'غيّر الموعد',
    tags: ['SCHEDULE'],
  },
] as const;

const STATUS_FILTERS = [
  'كل الطلبات',
  'قيد المراجعة',
  'مقدّرة',
  'تم إرسال العرض',
  'مجدولة',
  'معتمدة',
  'ملغاة',
] as const;

export function ControlPanelDshSheinProxyScreen({ hubHref = '/operations' }: ControlPanelDshSheinProxyScreenProps) {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2F5C', margin: 0 }}>شي إن</h2>
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
          { label: 'قيد المراجعة', value: '12', color: '#F59E0B' },
          { label: 'مقدّرة', value: '8', color: '#0A2F5C' },
          { label: 'العرض المرسل', value: '6', color: '#16A34A' },
          { label: 'مجدولة', value: '5', color: '#DC2626' },
        ].map((item) => (
          <div key={item.label} style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '24px', color: item.color, fontWeight: 800, marginTop: '8px' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {STATUS_FILTERS.map((status, index) => (
          <span key={status} style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', backgroundColor: index === 0 ? '#FEF3C7' : 'rgba(10,47,92,0.04)', color: index === 0 ? '#D97706' : '#64748B', border: index === 0 ? '1px solid #FDE68A' : '1px solid transparent' }}>
            {status}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {SHEIN_PROXY_ITEMS.map((request) => (
          <div key={request.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: '16px', alignItems: 'start', padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid rgba(10,47,92,0.08)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '14px' }}>{request.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: request.status === 'قيد المراجعة' ? '#FEF3C7' : request.status === 'مجدولة' ? '#FEF2F2' : 'rgba(10,47,92,0.04)', color: request.status === 'قيد المراجعة' ? '#D97706' : request.status === 'مجدولة' ? '#DC2626' : '#64748B' }}>{request.status}</span>
                {request.tags?.map((tag) => (
                  <span key={tag} style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '99px', backgroundColor: '#EEF2FF', color: '#4F46E5' }}>{tag}</span>
                ))}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A2F5C' }}>{request.customer}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>{request.product}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>آخر تحديث: {request.updated}</div>
            </div>

            <OperationsSuggestionCard
              title="توصية"
              label={request.suggestion}
              reason={request.reason}
              confidence={request.confidence}
              actions={(
                <>
                  <button style={{ padding: '4px 10px', backgroundColor: '#FF500D', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>{request.action}</button>
                  {request.secondaryAction && <button style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{request.secondaryAction}</button>}
                </>
              )}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignSelf: 'center' }}>
              <button style={{ padding: '8px 12px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push(`${hubHref}?workspace=sheinproxy&requestId=${request.id}`)}>
                افحص الطلب
              </button>
              <button style={{ padding: '8px 12px', backgroundColor: '#F1F5F9', color: '#0A2F5C', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push(`${hubHref}?workspace=dispatch-assignment`)}>
                الإسناد اليدوي
              </button>
              <button style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push('/support')}>
                تصعيد للدعم
              </button>
              <button style={{ padding: '8px 12px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid rgba(10,47,92,0.1)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push(`${hubHref}?workspace=proxy-shein-awnak`)}>
                عرض عونك
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ControlPanelDshSheinProxyScreen;
