'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';

export function DshPlatformAuditWorkspace() {
  const { auditEvents } = useDemoPlatformState();

  return (
    <Box gap={4}>
      <WebSectionCard
        title="سجل التغييرات والتراجع (Audit & Rollback)"
        description="تتبع من قام بالتغييرات، ومتى، والسبب، مع توفر خيار التراجع (Rollback) الفوري للإعدادات السابقة."
      >
        <Box gap={3}>
          {auditEvents.map((event) => (
            <Surface key={event.id} tone="raised" border padding={3} radiusToken="xl">
              <Box gap={3}>
                <Box layoutDirection="row" justify="space-between" align="center">
                  <Box gap={1}>
                    <Text role="titleMd">{event.action}</Text>
                    <Text role="caption" tone="muted">
                      المسؤول: {event.operator} • {event.timestamp.toLocaleTimeString()}
                    </Text>
                  </Box>
                  <Surface tone={event.status === 'success' ? 'success' : event.status === 'warning' ? 'warning' : 'danger'} padding={1} radiusToken="pill" border={false}>
                    <Text role="caption" tone={event.status === 'warning' ? 'muted' : 'inverse'}>
                      {event.status === 'success' ? 'مُطبّق بنجاح (Mock)' : event.status === 'warning' ? 'مسودة تجريبية' : 'تراجع / إيقاف (Mock)'}
                    </Text>
                  </Surface>
                </Box>

                <Surface tone="default" border padding={3} radiusToken="md">
                  <Box layoutDirection="row" gap={4}>
                    <Box gap={1}>
                      <Text role="caption" tone="muted">القيمة القديمة:</Text>
                      <Text role="bodySm" tone="danger">{event.oldValue}</Text>
                    </Box>
                    <Box gap={1}>
                      <Text role="caption" tone="muted">القيمة الجديدة:</Text>
                      <Text role="bodySm" tone="success">{event.newValue}</Text>
                    </Box>
                    <Box gap={1} style={{ flexGrow: 1 }}>
                      <Text role="caption" tone="muted">السبب:</Text>
                      <Text role="bodySm">{event.reason}</Text>
                    </Box>
                  </Box>
                </Surface>

                <Box layoutDirection="row" gap={4}>
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
                  <Button variant="danger" disabled={!event.rollbackAvailable}>
                    تراجع عن هذا التعديل (Rollback)
                  </Button>
                </Box>
              </Box>
            </Surface>
          ))}

          {/* Audit Record 1 */}
          <Surface tone="raised" border padding={3} radiusToken="xl">
            <Box gap={3}>
              <Box layoutDirection="row" justify="space-between" align="center">
                <Box gap={1}>
                  <Text role="titleMd">تعديل حد أهلية الكابتن</Text>
                  <Text role="caption" tone="muted">
                    المسؤول: Admin-Ahmed • قبل ساعتين
                  </Text>
                </Box>
                <Surface tone="success" padding={1} radiusToken="pill" border={false}>
                  <Text role="caption" tone="inverse">
                    مُطبّق بنجاح
                  </Text>
                </Surface>
              </Box>

              <Surface tone="default" border padding={3} radiusToken="md">
                <Box layoutDirection="row" gap={4}>
                  <Box gap={1}>
                    <Text role="caption" tone="muted">القيمة القديمة:</Text>
                    <Text role="bodySm" tone="danger">4.5</Text>
                  </Box>
                  <Box gap={1}>
                    <Text role="caption" tone="muted">القيمة الجديدة:</Text>
                    <Text role="bodySm" tone="success">4.2</Text>
                  </Box>
                  <Box gap={1} style={{ flexGrow: 1 }}>
                    <Text role="caption" tone="muted">السبب:</Text>
                    <Text role="bodySm">زيادة عدد الكباتن المتاحين في أوقات الذروة بناءً على توجيهات الإدارة التشغيلية.</Text>
                  </Box>
                </Box>
              </Surface>

              <Box layoutDirection="row" gap={4}>
                <Box gap={1} style={{ flexGrow: 1 }}>
                  <Text role="caption" tone="muted">النطاق المتأثر:</Text>
                  <Text role="bodySm">محافظة صنعاء</Text>
                </Box>
                <Box gap={1} style={{ flexGrow: 1 }}>
                  <Text role="caption" tone="muted">الأثر المتوقع:</Text>
                  <Text role="bodySm">زيادة +15% في القبول</Text>
                </Box>
              </Box>

              <Box layoutDirection="row" justify="flex-end">
                <Button variant="danger" disabled>
                  تراجع عن هذا التعديل (Rollback)
                </Button>
              </Box>
            </Box>
          </Surface>

          {/* Audit Record 2 */}
          <Surface tone="raised" border padding={3} radiusToken="xl">
            <Box gap={3}>
              <Box layoutDirection="row" justify="space-between" align="center">
                <Box gap={1}>
                  <Text role="titleMd">تحديث مزود الدفع (Payment Provider)</Text>
                  <Text role="caption" tone="muted">
                    المسؤول: System-Bot (Auto Failover) • قبل 3 أيام
                  </Text>
                </Box>
                <Surface tone="warning" padding={1} radiusToken="pill" border={false}>
                  <Text role="caption" tone="inverse">
                    تفعيل الطوارئ
                  </Text>
                </Surface>
              </Box>

              <Surface tone="default" border padding={3} radiusToken="md">
                <Box layoutDirection="row" gap={4}>
                  <Box gap={1}>
                    <Text role="caption" tone="muted">القيمة القديمة:</Text>
                    <Text role="bodySm" tone="danger">Telr (الأساسي)</Text>
                  </Box>
                  <Box gap={1}>
                    <Text role="caption" tone="muted">القيمة الجديدة:</Text>
                    <Text role="bodySm" tone="success">Paymob (البديل)</Text>
                  </Box>
                  <Box gap={1} style={{ flexGrow: 1 }}>
                    <Text role="caption" tone="muted">السبب:</Text>
                    <Text role="bodySm">استجابة لـ Downtime موثق في المزود الأساسي لمدة تجاوزت 5 دقائق.</Text>
                  </Box>
                </Box>
              </Surface>

              <Box layoutDirection="row" gap={4}>
                <Box gap={1} style={{ flexGrow: 1 }}>
                  <Text role="caption" tone="muted">النطاق المتأثر:</Text>
                  <Text role="bodySm">Global</Text>
                </Box>
                <Box gap={1} style={{ flexGrow: 1 }}>
                  <Text role="caption" tone="muted">الأثر المتوقع:</Text>
                  <Text role="bodySm">تجنب فشل 30% من عمليات الدفع المتوقعة</Text>
                </Box>
              </Box>

              <Box layoutDirection="row" justify="flex-end">
                <Button variant="secondary" disabled>
                  استعادة المزود الأساسي
                </Button>
              </Box>
            </Box>
          </Surface>

        </Box>
      </WebSectionCard>
    </Box>
  );
}
