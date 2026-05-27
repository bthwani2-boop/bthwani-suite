'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import styles from '../../dsh/frontend/control-panel/shared/control-panel-surface.module.css';

export function ControlPanelHrScreen() {
  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <div className={styles.surfaceHeaderGlyphMinus} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>الموارد البشرية</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>إدارة الفريق</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>
              إدارة فرق التشغيل والحضور والجاهزية للعمليات.
            </p>
          </Box>
        </div>
      </header>

      <Box paddingX={4} paddingY={3}>
        <Surface tone="warning" border padding={3} radiusToken="md">
          <Text role="bodySm" tone="warning" align="center">
            Preview only / Demo mode: محاكاة محلية، لا يوجد API أو قاعدة بيانات. لا يوجد runtime mutation.
          </Text>
        </Surface>
      </Box>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
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
        </div>
      </main>
    </div>
  );
}

export default ControlPanelHrScreen;
