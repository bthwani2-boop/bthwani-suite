'use client';

import { Box, Button, Surface, Text } from '@bthwani/ui-kit';
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
      <Surface tone="inset" style={{ padding: 40, alignItems: 'center' }}>
        <Text role="titleSm">جارٍ تحميل طلبات الميدان...</Text>
      </Surface>
    );
  }

  if (state === 'error') {
    return (
      <Surface tone="inset" style={{ padding: 40, alignItems: 'center', backgroundColor: '#FEF2F2' }}>
        <Text role="titleSm" style={{ color: '#DC2626' }}>تعذر تحميل طلبات الشركاء</Text>
        <Button label="إعادة المحاولة" tone="secondary" onPress={onRetry} style={{ marginTop: 12 }} />
      </Surface>
    );
  }

  return (
    <Box gap={4} style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box gap={1}>
          <Text role="caption" style={{ color: '#f97316', fontWeight: '800' }}>PARTNER INTAKE WORKFLOW</Text>
          <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900' }}>طلبات الميدان والشركاء</Text>
        </Box>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button label="تصفية الحالات" tone="secondary" fullWidth={false} style={{ borderRadius: 8 }} />
          <Button label="تاريخ الطلبات" tone="ghost" fullWidth={false} style={{ borderRadius: 8 }} />
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {dshPartnerIntakeMetrics.map((metric, i) => (
          <Surface key={metric.id} tone="raised" padding={4} style={{ borderRadius: 16, borderTopWidth: i === 0 ? 4 : 1, borderTopColor: i === 0 ? '#FF500D' : '#E2E8F0' }}>
            <Text role="caption" tone="muted" style={{ fontWeight: 700 }}>{metric.label}</Text>
            <Text role="titleLg" style={{ color: i === 0 ? '#FF500D' : '#0A2F5C', fontWeight: 900, fontSize: 20 }}>{metric.value}</Text>
          </Surface>
        ))}
        <Surface tone="raised" padding={4} style={{ borderRadius: 16 }}>
          <Text role="caption" tone="muted" style={{ fontWeight: 700 }}>متوسط وقت القرار</Text>
          <Text role="titleLg" style={{ color: '#16A34A', fontWeight: 900, fontSize: 20 }}>14m</Text>
        </Surface>
      </div>

      {/* Intake Cards */}
      <Box gap={3}>
        {dshPartnerIntakeItems.map((item) => {
          const isWarning = item.queue === 'offer-approval';
          const isSuccess = item.queue === 'marketing-review';

          return (
            <Surface
              key={item.id}
              tone="raised"
              padding={4}
              style={{
                borderRadius: 18,
                borderWidth: 1,
                borderColor: isWarning ? '#F59E0B' : 'rgba(10,47,92,0.06)',
                backgroundColor: isWarning ? '#FFFBEB' : '#fff',
                flexDirection: 'row',
                gap: 20,
                alignItems: 'center'
              }}
            >
              {/* Col 1: Partner Meta */}
              <Box gap={1}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Text role="titleSm" style={{ fontWeight: 800, color: '#0A2F5C' }}>{item.storeName}</Text>
                  <Text role="caption" tone="muted">({item.id})</Text>
                  <div style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    backgroundColor: isWarning ? '#FEF3C7' : isSuccess ? '#F0FDF4' : 'rgba(10,47,92,0.04)',
                  }}>
                    <Text role="caption" style={{ fontWeight: 900, color: isWarning ? '#D97706' : isSuccess ? '#16A34A' : '#64748B', fontSize: 10 }}>
                      {item.fieldStatusLabel.toUpperCase()}
                    </Text>
                  </div>
                </div>
                <Text role="bodyStrong" style={{ color: '#0A2F5C', fontSize: 13 }}>
                  {item.categoryLabel} · {item.ownerLabel}
                </Text>
                <Text role="caption" tone="muted">
                  المصدر: {item.source} | أُرسل: {item.submittedAt}
                </Text>
              </Box>

              {/* Col 2: System Suggestion */}
              <OperationsSuggestionCard
                label={item.nextStep}
                reason={item.note}
                confidence={isWarning ? 'high' : 'medium'}
                actions={(
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      label={item.queue === 'offer-approval' ? 'اعتماد العرض' : item.queue === 'partner-review' ? 'إنشاء الكود' : 'إطلاق نهائي'}
                      fullWidth={false}
                      style={{ height: 32, paddingHorizontal: 12, borderRadius: 6 }}
                    />
                    <Button
                      label="تعديل"
                      tone="secondary"
                      fullWidth={false}
                      style={{ height: 32, paddingHorizontal: 12, borderRadius: 6 }}
                    />
                  </div>
                )}
              />

              {/* Col 3: Quick Actions */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button label="تفاصيل" tone="ghost" fullWidth={false} />
                <Button label="رفض" tone="ghost" fullWidth={false} />
              </div>
            </Surface>
          );
        })}
      </Box>
    </Box>
  );
}

export default PartnerIntakeLane;
