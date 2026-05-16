'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { PREVIEW_APPEARANCE_RECORDS } from './appearance.preview';
import { AppearanceRecord } from './appearance.types';

function AppearanceRecordCard({ record }: { record: AppearanceRecord }) {
  return (
    <Surface tone="raised" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 320, minWidth: 0 }}>
      <Box gap={3}>
        <Box layoutDirection="row" justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', rowGap: 8 }}>
          <Box gap={1}>
            <Text role="titleMd">{record.label}</Text>
            <Text role="caption" tone="muted">ID: {record.id}</Text>
          </Box>
          <Surface tone={record.status === 'preview-only' ? 'warning' : 'neutral'} padding={1} radiusToken="pill" border={false}>
            <Text role="caption">{record.status}</Text>
          </Surface>
        </Box>

        <Box gap={2}>
          <Box layoutDirection="row" justify="space-between" align="center">
            <Text role="caption" tone="muted">المالك</Text>
            <Text role="bodySm" weight="medium">{record.owner}</Text>
          </Box>
          <Box layoutDirection="row" justify="space-between" align="center">
            <Text role="caption" tone="muted">النطاق</Text>
            <Text role="bodySm">{record.scope}</Text>
          </Box>
          <Box layoutDirection="row" justify="space-between" align="center">
            <Text role="caption" tone="muted">المخاطرة</Text>
            <Text role="bodySm" tone={record.risk === 'visual-identity' || record.risk === 'high' ? 'danger' : 'neutral'}>{record.risk}</Text>
          </Box>
        </Box>

        <Surface tone="default" border padding={2} radiusToken="md">
          <Box gap={2}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="caption" tone="muted">الحالي (Before):</Text>
              <Text role="caption" weight="medium">{record.currentPreviewValue}</Text>
            </Box>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="caption" tone="muted">المقترح (After):</Text>
              <Text role="caption" weight="medium">{record.proposedPreviewValue}</Text>
            </Box>
          </Box>
        </Surface>

        <Box gap={1}>
          <Text role="caption" tone="muted">التأثير والسبب</Text>
          <Text role="bodySm">{record.effectSummary}</Text>
          {record.reason ? <Text role="bodySm" tone="muted">السبب: {record.reason}</Text> : null}
        </Box>

        <Box gap={1}>
          <Text role="caption" tone="muted">ملاحظة النظام المركزي</Text>
          <Text role="bodySm">{record.centralColorSystemNote}</Text>
        </Box>

        <Box gap={1}>
          <Text role="caption" tone="muted">Audit / Rollback</Text>
          <Text role="bodySm">{record.auditRollbackHint}</Text>
          {record.evidence ? <Text role="bodySm" tone="muted">الدليل: {record.evidence}</Text> : null}
          {record.rollbackTarget ? <Text role="bodySm" tone="muted">هدف التراجع: {record.rollbackTarget}</Text> : null}
        </Box>

        <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
          <Button variant="primary" disabled style={{ flexGrow: 1 }}>Apply / Activate</Button>
          <Button variant="secondary" disabled style={{ flexGrow: 1 }}>Rollback</Button>
        </Box>
      </Box>
    </Surface>
  );
}

export function DshPlatformAppearanceWorkspace() {
  return (
    <Box gap={4}>
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
          <WebSignalCard
            title="Central Color System Status"
            value="System Token Driven"
            description="مصدر الحقيقة للألوان هو النظام المركزي داخل @bthwani/ui-kit/design tokens. لا يسمح بإدخال ألوان عشوائية."
            tone="brand"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
          <WebSignalCard
            title="Accessibility / Contrast Check"
            value="Preview Validated"
            description="أي لون لا يمر باختبار contrast/readability لا يعتمد. يعرض preview لحالة التباين والوضوح."
            tone="warning"
          />
        </Box>
      </Box>

      <WebSectionCard
        title="Approved Palettes"
        description="لوحة بثواني الأساسية. التفعيل الحقيقي لاحقًا يجب أن يكون عبر tokens/semantic palette وليس hardcoded colors داخل الشاشات."
      >
        <Box gap={3}>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Box padding={3} radiusToken="md" style={{ flexGrow: 1, flexBasis: 120, backgroundColor: '#0A2F5C' }}>
              <Box gap={1}>
                <Text role="bodySm" style={{ color: '#FFFFFF' }} weight="bold">Deep Blue</Text>
                <Text role="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>#0A2F5C</Text>
              </Box>
            </Box>
            <Box padding={3} radiusToken="md" style={{ flexGrow: 1, flexBasis: 120, backgroundColor: '#FF500D' }}>
              <Box gap={1}>
                <Text role="bodySm" style={{ color: '#FFFFFF' }} weight="bold">Orange</Text>
                <Text role="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>#FF500D</Text>
              </Box>
            </Box>
            <Surface tone="default" border padding={3} radiusToken="md" style={{ flexGrow: 1, flexBasis: 120 }}>
              <Box gap={1}>
                <Text role="bodySm" weight="bold">White</Text>
                <Text role="caption" tone="muted">#FFFFFF</Text>
              </Box>
            </Surface>
          </Box>
          <Text role="caption" tone="muted">
            يسمح بصريًا بعرض close tints/shades المعتمدة فقط، لكن كـ preview. لا توجد ألوان عشوائية.
          </Text>
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="Appearance Overrides & Campaigns"
        description="استعراض وضبط Service Appearance Overrides و Campaign / Seasonal Theme بطريقة محكومة."
      >
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PREVIEW_APPEARANCE_RECORDS.map((record) => (
            <AppearanceRecordCard key={record.id} record={record} />
          ))}
        </Box>
      </WebSectionCard>

    </Box>
  );
}
