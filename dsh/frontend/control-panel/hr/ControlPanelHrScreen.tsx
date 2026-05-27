'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';

export function ControlPanelHrScreen() {
  return (
    <Box paddingX={4} paddingY={4} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box style={{ flexShrink: 0, paddingBottom: '24px' }}>
        <Box layoutDirection="row" align="center" gap={3}>
          <Box gap={1}>
            <Box layoutDirection="row" align="center" gap={2}>
              <Text role="titleLg">الموارد البشرية</Text>
              <Surface tone="brand" padding={1} radiusToken="xs" border={false}>
                <Text role="caption" tone="inverse">إدارة الفريق</Text>
              </Surface>
            </Box>
            <Text role="bodySm" tone="muted">
              إدارة فرق التشغيل والحضور والجاهزية للعمليات.
            </Text>
          </Box>
        </Box>
      </Box>

      <Box style={{ flexShrink: 0, paddingBottom: '24px' }}>
        <Surface tone="warning" border padding={3} radiusToken="md">
          <Text role="bodySm" tone="warning" align="center">
            Preview only / Demo mode: محاكاة محلية، لا يوجد API أو قاعدة بيانات. لا يوجد runtime mutation.
          </Text>
        </Surface>
      </Box>

      <Box style={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
        <Box gap={4}>
          <WebSectionCard title="فريق التشغيل" description="استعراض أفراد فريق التشغيل وحالتهم الحالية.">
            <Surface tone="raised" border padding={4} radiusToken="xl">
              <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '16px' }}>
                <Text role="bodySm" tone="muted">قائمة الفريق للعرض فقط.</Text>
                <Button tone="secondary" label="استعراض الفريق (محاكاة)" onPress={() => {}} />
              </Box>
            </Surface>
          </WebSectionCard>

          <WebSectionCard title="الجاهزية والحضور" description="تتبع جاهزية الموظفين وجدول المناوبات.">
            <Surface tone="default" border padding={4} radiusToken="xl">
              <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '16px' }}>
                <Text role="bodySm" tone="muted">حالة الجاهزية الحالية.</Text>
                <Button tone="secondary" label="مراجعة الجاهزية" onPress={() => {}} />
              </Box>
            </Surface>
          </WebSectionCard>

          <WebSectionCard title="أدوار HR" description="الأدوار والصلاحيات المخصصة لمهام الموارد البشرية.">
            <Surface tone="raised" border padding={4} radiusToken="xl">
              <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '16px' }}>
                <Text role="bodySm" tone="muted">توزيع الأدوار الداخلية للقسم.</Text>
                <Button tone="secondary" label="عرض الأدوار (محاكاة)" onPress={() => {}} />
              </Box>
            </Surface>
          </WebSectionCard>

          <WebSectionCard title="طلبات الموارد البشرية" description="الإجازات، والموافقات التشغيلية للموظفين.">
            <Surface tone="inset" border padding={4} radiusToken="xl">
              <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '16px' }}>
                <Text role="bodySm" tone="muted">لا توجد طلبات حقيقية.</Text>
                <Button tone="primary" label="عرض الطلبات التجريبية" onPress={() => {}} />
              </Box>
            </Surface>
          </WebSectionCard>

          <WebSectionCard title="سياسات الموظفين" description="اللوائح الداخلية، التوجيهات، وإرشادات الجاهزية.">
            <Surface tone="default" border padding={4} radiusToken="xl">
              <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '16px' }}>
                <Text role="bodySm" tone="muted">السياسات الحالية للمنصة.</Text>
                <Button tone="secondary" label="استعراض السياسات" onPress={() => {}} />
              </Box>
            </Surface>
          </WebSectionCard>
        </Box>
      </Box>
    </Box>
  );
}

export default ControlPanelHrScreen;
