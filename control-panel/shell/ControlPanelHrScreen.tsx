'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import styles from '../dsh/frontend/control-panel/shared/control-panel-surface.module.css'; // wait, I might not need this if I don't use styles.

export function ControlPanelHrScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      <header>
        <Box gap={1}>
          <Text role="titleLg">الموارد البشرية</Text>
          <Text role="bodySm" tone="muted">
            إدارة فرق التشغيل والحضور والجاهزية للعمليات.
          </Text>
        </Box>
      </header>

      <Surface tone="warning" border padding={3} radiusToken="md">
        <Text role="bodySm" tone="warning" align="center">
          وضع تجريبي (Demo / Preview only): جميع الإجراءات محاكاة محلية فقط لعرض التقسيم الهيكلي ولا تتصل بقاعدة بيانات (No API/DB/Mutation).
        </Text>
      </Surface>

      <Box gap={4}>
        <WebSectionCard
          title="فريق التشغيل والأدوار"
          description="استعراض أفراد الفريق، توزيع الأدوار، وحالات الموظفين."
        >
          <Surface tone="raised" border padding={4} radiusToken="xl">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Box gap={1}>
                <Text role="titleMd">إدارة الفريق</Text>
                <Text role="bodySm" tone="muted">صلاحيات العرض فقط للمحاكاة.</Text>
              </Box>
              <Button tone="secondary" label="إضافة عضو (Demo)" onPress={() => {}} />
            </Box>
          </Surface>
        </WebSectionCard>

        <WebSectionCard
          title="الحضور والجاهزية"
          description="تتبع جاهزية الموظفين التشغيليين والمناوبات."
        >
          <Surface tone="default" border padding={4} radiusToken="xl">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Box gap={1}>
                <Text role="titleMd">جدول المناوبات</Text>
                <Text role="bodySm" tone="muted">استعراض الجاهزية الحالية.</Text>
              </Box>
              <Button tone="secondary" label="تحديث الجاهزية" onPress={() => {}} />
            </Box>
          </Surface>
        </WebSectionCard>

        <WebSectionCard
          title="طلبات HR وسياسات الموظفين"
          description="الإجازات، الموافقات الإدارية، وسياسات الموظفين الداخلية."
        >
          <Surface tone="inset" border padding={4} radiusToken="xl">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Box gap={1}>
                <Text role="titleMd">الطلبات المعلقة</Text>
                <Text role="bodySm" tone="muted">لا توجد طلبات حقيقية، محاكاة فقط.</Text>
              </Box>
              <Button tone="primary" label="عرض السياسات" onPress={() => {}} />
            </Box>
          </Surface>
        </WebSectionCard>
      </Box>
    </div>
  );
}

export default ControlPanelHrScreen;
