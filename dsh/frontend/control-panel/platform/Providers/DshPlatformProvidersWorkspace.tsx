'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { PREVIEW_PROVIDER_RECORDS } from './providers.preview';
import { ProviderRecord, ProviderStatus, ProviderEnvironment } from './providers.types';

const STATUS_TONE: Record<ProviderStatus, 'success' | 'warning' | 'default' | 'danger'> = {
  active: 'success',
  'test-only': 'warning',
  'pending-approval': 'default',
  inactive: 'danger',
};

const STATUS_LABEL: Record<ProviderStatus, string> = {
  active: 'مفعّل',
  'test-only': 'اختبار فقط',
  'pending-approval': 'بانتظار الاعتماد',
  inactive: 'غير نشط',
};

const ENV_LABEL: Record<ProviderEnvironment, string> = {
  production: 'إنتاج',
  sandbox: 'بيئة اختبار',
  test: 'اختبار',
};

const TEST_TONE = {
  pass: 'success' as const,
  fail: 'danger' as const,
  'not-run': 'muted' as const,
};

function ProviderCard({ record }: { record: ProviderRecord }) {
  return (
    <Surface
      tone="raised"
      border
      padding={3}
      radiusToken="xl"
      style={{ flexGrow: 1, flexBasis: 300, minWidth: 0 }}
    >
      <Box gap={3}>
        {/* Header */}
        <Box
          layoutDirection="row"
          justify="space-between"
          align="flex-start"
          style={{ flexWrap: 'wrap', rowGap: 8 }}
        >
          <Box gap={0} style={{ flex: 1, minWidth: 0 }}>
            <Text role="titleMd">{record.label}</Text>
            <Text role="caption" tone="muted">
              {record.category}
            </Text>
          </Box>
          <Surface tone={STATUS_TONE[record.status]} padding={1} radiusToken="pill" border>
            <Text role="caption" tone="inverse">
              {STATUS_LABEL[record.status]}
            </Text>
          </Surface>
        </Box>

        {/* Provider and masked key */}
        <Surface tone="default" border padding={2} radiusToken="md">
          <Box gap={2}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="caption" tone="muted">
                المزود المحدد
              </Text>
              <Text role="bodySm" weight="medium">
                {record.selectedProvider}
              </Text>
            </Box>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="caption" tone="muted">
                بيانات الاعتماد
              </Text>
              <Text role="bodySm" tone="muted">
                {record.maskedCredential}
              </Text>
            </Box>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="caption" tone="muted">
                البيئة
              </Text>
              <Text role="bodySm">{ENV_LABEL[record.environment]}</Text>
            </Box>
            {record.lastTestResult ? (
              <Box layoutDirection="row" justify="space-between" align="center">
                <Text role="caption" tone="muted">
                  نتيجة الاختبار
                </Text>
                <Text role="bodySm" tone={TEST_TONE[record.lastTestResult]}>
                  {record.lastTestResult === 'pass'
                    ? 'ناجح'
                    : record.lastTestResult === 'fail'
                      ? 'فاشل'
                      : 'لم يُجرَ'}
                </Text>
              </Box>
            ) : null}
            {record.fallbackProvider ? (
              <Box layoutDirection="row" justify="space-between" align="center">
                <Text role="caption" tone="muted">
                  البديل عند الفشل
                </Text>
                <Text role="bodySm">{record.fallbackProvider}</Text>
              </Box>
            ) : null}
          </Box>
        </Surface>

        {/* Activation note */}
        <Box gap={1}>
          <Text role="caption" tone="muted">
            ملاحظة التفعيل
          </Text>
          <Text role="bodySm">{record.activationNote}</Text>
          {record.evidence ? (
            <Text role="caption" tone="muted">
              الدليل: {record.evidence}
            </Text>
          ) : null}
        </Box>

        {/* Actions — all disabled in UI/UX phase */}
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button variant="primary" disabled style={{ flexGrow: 1 }}>
            إدخال بيانات الاعتماد
          </Button>
          <Button variant="secondary" disabled style={{ flexGrow: 1 }}>
            Rollback
          </Button>
        </Box>
      </Box>
    </Surface>
  );
}

export function DshPlatformProvidersWorkspace() {
  return (
    <Box gap={4}>
      {/* Signal strip */}
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="المزودون النشطون"
            value={String(
              PREVIEW_PROVIDER_RECORDS.filter((p) => p.status === 'active').length,
            )}
            description="عدد المزودين المفعّلين حاليًا على مستوى المنصة."
            tone="best"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="بيانات الاعتماد"
            value="مُخفاة دائمًا"
            description="لا تُعرض مفاتيح API الحقيقية في الواجهة. يتم الإدخال عبر control plane آمن."
            tone="warning"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="أزرار التنفيذ"
            value="معطّلة"
            description="جميع أزرار إدخال بيانات الاعتماد والتفعيل معطّلة في مرحلة UI/UX."
            tone="brand"
          />
        </Box>
      </Box>

      {/* Security note */}
      <Surface tone="danger" border padding={2} radiusToken="lg">
        <Box gap={1}>
          <Text role="bodySm" weight="medium">
            قاعدة أمان المنصة
          </Text>
          <Text role="bodySm">
            لا تُدخل مفاتيح API أو secrets حقيقية في هذه الواجهة. بيانات الاعتماد تُدار عبر
            control plane آمن ومعزول لاحقًا. ما يظهر هنا هو preview لهيكل إدارة المزودين فقط.
          </Text>
        </Box>
      </Surface>

      {/* Provider cards */}
      <WebSectionCard
        title="مزودو المنصة المركزيون"
        description="المزودون الافتراضيون على مستوى المنصة بالكامل. أي override على مستوى الخدمة يكون استثنائيًا ومحكومًا."
      >
        <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
          {PREVIEW_PROVIDER_RECORDS.map((record) => (
            <ProviderCard key={record.id} record={record} />
          ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}
