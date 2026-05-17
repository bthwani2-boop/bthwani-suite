'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';

export function DshPlatformAuditWorkspace() {
  const { auditEvents, rollbackEvent } = useDemoPlatformState();

  return (
    <Box gap={4}>
      <WebSectionCard
        title="سجل التغييرات والتراجع (Audit & Rollback)"
        description="تتبع من قام بالتغييرات، ومتى، والسبب، مع توفر خيار التراجع (Rollback) الفوري للإعدادات السابقة."
      >
        <Box gap={3}>
          {auditEvents.length === 0 && (
            <Surface tone="default" border padding={4} radiusToken="xl">
              <Text role="bodySm" tone="muted" align="center">لا توجد أحداث تدقيق حتى الآن. ابدأ بتنفيذ إجراء تجريبي.</Text>
            </Surface>
          )}

          {auditEvents.map((event) => (
            <Surface key={event.id} tone="raised" border padding={3} radiusToken="xl">
              <Box gap={3}>
                <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', rowGap: 8 }}>
                  <Box gap={1}>
                    <Text role="titleMd">{event.action}</Text>
                    <Text role="caption" tone="muted">
                      المسؤول: {event.operator} • {event.timestamp}
                    </Text>
                  </Box>
                  <Surface
                    tone={event.status === 'success' ? 'success' : event.status === 'warning' ? 'warning' : 'danger'}
                    padding={1}
                    radiusToken="pill"
                    border={false}
                  >
                    <Text role="caption" tone={event.status === 'warning' ? 'muted' : 'inverse'}>
                      {event.status === 'success'
                        ? 'مُطبّق بنجاح (Mock)'
                        : event.status === 'warning'
                        ? 'مسودة تجريبية'
                        : 'تراجع / إيقاف (Mock)'}
                    </Text>
                  </Surface>
                </Box>

                <Surface tone="default" border padding={3} radiusToken="md">
                  <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
                    <Box gap={1} style={{ flexGrow: 1 }}>
                      <Text role="caption" tone="muted">القيمة القديمة:</Text>
                      <Text role="bodySm" tone="danger">{event.oldValue}</Text>
                    </Box>
                    <Box gap={1} style={{ flexGrow: 1 }}>
                      <Text role="caption" tone="muted">القيمة الجديدة:</Text>
                      <Text role="bodySm" tone="success">{event.newValue}</Text>
                    </Box>
                    <Box gap={1} style={{ flexGrow: 1 }}>
                      <Text role="caption" tone="muted">السبب:</Text>
                      <Text role="bodySm">{event.reason}</Text>
                    </Box>
                  </Box>
                </Surface>

                <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
                  <Box gap={1} style={{ flexGrow: 1 }}>
                    <Text role="caption" tone="muted">النطاق المتأثر:</Text>
                    <Text role="bodySm">{event.scope}</Text>
                  </Box>
                  <Box gap={1} style={{ flexGrow: 1 }}>
                    <Text role="caption" tone="muted">الأثر المتوقع:</Text>
                    <Text role="bodySm">{event.impact}</Text>
                  </Box>
                </Box>

                <Box layoutDirection="row" justify="flex-end">
                  <Button
                    variant="danger"
                    disabled={!event.rollbackAvailable}
                    onClick={() => rollbackEvent(event.id)}
                  >
                    تراجع عن هذا التعديل (Rollback تجريبي)
                  </Button>
                </Box>
              </Box>
            </Surface>
          ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}
