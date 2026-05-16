'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { PREVIEW_SERVICE_RECORDS } from './services.preview';
import { ServiceRecord, ServiceStatus } from './services.types';

const STATUS_TONE: Record<ServiceStatus, 'success' | 'warning' | 'neutral' | 'danger' | 'brand'> = {
  live: 'success',
  pilot: 'brand',
  'internal-only': 'neutral',
  paused: 'warning',
  maintenance: 'danger',
};

const STATUS_LABEL: Record<ServiceStatus, string> = {
  live: 'مفعّل',
  pilot: 'تجريبي',
  'internal-only': 'داخلي فقط',
  paused: 'موقوف',
  maintenance: 'صيانة',
};

function ServiceCard({ record }: { record: ServiceRecord }) {
  const statusTone = STATUS_TONE[record.status];
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
              {record.id}
            </Text>
          </Box>
          <Surface tone={statusTone} padding={1} radiusToken="pill" border={false}>
            <Text role="caption" tone="inverse">
              {STATUS_LABEL[record.status]}
            </Text>
          </Surface>
        </Box>

        <Text role="bodySm" tone="muted">
          {record.description}
        </Text>

        {/* Metadata row */}
        <Box gap={1}>
          <Box layoutDirection="row" justify="space-between" align="center">
            <Text role="caption" tone="muted">
              المالك
            </Text>
            <Text role="bodySm" weight="medium">
              {record.owner}
            </Text>
          </Box>
          <Box layoutDirection="row" justify="space-between" align="center">
            <Text role="caption" tone="muted">
              ظهور العملاء
            </Text>
            <Text role="bodySm">{record.clientVisibility === 'visible' ? 'ظاهر' : 'مخفي'}</Text>
          </Box>
          <Box layoutDirection="row" justify="space-between" align="center">
            <Text role="caption" tone="muted">
              النطاق
            </Text>
            <Text role="bodySm">{record.scope}</Text>
          </Box>
          <Box layoutDirection="row" justify="space-between" align="center">
            <Text role="caption" tone="muted">
              المخاطرة
            </Text>
            <Text
              role="bodySm"
              tone={record.risk === 'critical' || record.risk === 'high' ? 'danger' : 'neutral'}
            >
              {record.risk}
            </Text>
          </Box>
        </Box>

        {/* Effect & Rollback */}
        <Surface tone="default" border padding={2} radiusToken="md">
          <Box gap={1}>
            <Text role="caption" tone="muted">
              التأثير المتوقع
            </Text>
            <Text role="bodySm">{record.effectSummary}</Text>
            <Text role="caption" tone="muted">
              {record.auditRollbackHint}
            </Text>
            {record.evidence ? (
              <Text role="caption" tone="muted">
                الدليل: {record.evidence}
              </Text>
            ) : null}
          </Box>
        </Surface>

        {/* Actions — all disabled in UI/UX phase */}
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button variant="primary" disabled style={{ flexGrow: 1 }}>
            تغيير الحالة
          </Button>
          <Button variant="secondary" disabled style={{ flexGrow: 1 }}>
            Rollback
          </Button>
        </Box>
      </Box>
    </Surface>
  );
}

export function DshPlatformServicesWorkspace() {
  return (
    <Box gap={4}>
      {/* Signal strip */}
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="الخدمات المفعّلة"
            value={String(PREVIEW_SERVICE_RECORDS.filter((s) => s.status === 'live').length)}
            description="عدد الخدمات التي تعمل حاليًا عالميًا أو في بيئة الإنتاج."
            tone="best"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="الخدمات التجريبية"
            value={String(PREVIEW_SERVICE_RECORDS.filter((s) => s.status === 'pilot').length)}
            description="خدمات في وضع تجريبي مقيّد بنطاق جغرافي أو شريحة مستخدمين."
            tone="brand"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="أزرار التنفيذ"
            value="معطّلة"
            description="جميع أزرار التغيير والتراجع معطّلة في مرحلة UI/UX."
            tone="warning"
          />
        </Box>
      </Box>

      {/* Note */}
      <Surface tone="warning" border padding={2} radiusToken="lg">
        <Text role="bodySm">
          هذا القسم لتفعيل وضبط الخدمات على مستوى المنصة. لا تتضمن هذه المرحلة أي تنفيذ حي — جميع
          الأزرار معطّلة ريثما تُفتح مرحلة runtime.
        </Text>
      </Surface>

      {/* Service cards */}
      <WebSectionCard
        title="خدمات المنصة"
        description="التحكم المركزي بتفعيل الخدمات وظهورها ونطاقها وحالتها التشغيلية."
      >
        <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
          {PREVIEW_SERVICE_RECORDS.map((record) => (
            <ServiceCard key={record.id} record={record} />
          ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}
