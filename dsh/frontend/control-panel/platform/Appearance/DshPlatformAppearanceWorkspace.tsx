'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';

export function DshPlatformAppearanceWorkspace() {
  const { addAuditEvent } = useDemoPlatformState();
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);
  const [activeTone, setActiveTone] = React.useState<'brand' | 'warning'>('brand');

  const handleConfirm = (action: string) => {
    if (action === 'معاينة حيّة (Simulation)') {
      setActiveTone('warning');
      addAuditEvent({
        action: 'محاكاة مظهر: تطبيق العميل - الهيدر',
        operator: 'Demo Admin',
        status: 'success',
        oldValue: 'Brand Primary',
        newValue: 'Brand Accent',
        reason: 'محاكاة الألوان محلياً',
        scope: 'تطبيق العميل',
        impact: 'تغيير لون الهيدر إلى البرتقالي',
        rollbackAvailable: true,
      });
    } else {
      addAuditEvent({
        action: `إجراء المظهر: ${action}`,
        operator: 'Demo Admin',
        status: 'warning',
        oldValue: activeTone,
        newValue: 'Brand Accent',
        reason: 'حفظ كمسودة تجريبية',
        scope: 'تطبيق العميل',
        impact: 'قيد الاعتماد',
        rollbackAvailable: true,
      });
    }
    setShowConfirm(null);
  };

  return (
    <Box gap={4}>
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
          <WebSignalCard
            title="نظام الألوان المركزي"
            value="مفعل ومقفل"
            description="جميع الألوان مرتبطة بنظام الـ Tokens المركزي. لا يسمح بإدخال ألوان عشوائية أو Hex codes يدوية."
            tone="brand"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
          <WebSignalCard
            title="فحص التباين (Contrast)"
            value="سليم 100%"
            description="نسبة التباين مطابقة لمعايير إمكانية الوصول."
            tone="neutral"
          />
        </Box>
      </Box>

      <WebSectionCard
        title="تخصيص هوية التطبيقات"
        description="التحكم بألوان وهوية كل تطبيق من النظام المركزي. لا يتم استخدام هذه الواجهة للحملات التسويقية."
      >
        <Box gap={4}>
          <Box layoutDirection="row" gap={3}>
            <Surface tone="default" border padding={2} radiusToken="md" style={{ flexGrow: 1 }}>
              <Text role="caption" tone="muted">التطبيق المستهدف</Text>
              <Text role="bodySm">تطبيق العميل (Client App)</Text>
            </Surface>
            <Surface tone="default" border padding={2} radiusToken="md" style={{ flexGrow: 1 }}>
              <Text role="caption" tone="muted">المكون (Component)</Text>
              <Text role="bodySm">الهيدر الرئيسي (Main Header)</Text>
            </Surface>
          </Box>

          <Surface tone="raised" border padding={4} radiusToken="xl">
            <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
              <Box gap={2} style={{ flexGrow: 1 }}>
                <Text role="titleMd">اللون الحالي (المطبق محلياً)</Text>
                <Surface tone={activeTone} padding={4} radiusToken="md">
                  <Text role="bodySm" tone="inverse" align="center">{activeTone === 'brand' ? 'Brand Primary (Deep Blue)' : 'Brand Accent (Orange)'}</Text>
                </Surface>
              </Box>

              <Box gap={2} style={{ flexGrow: 1 }}>
                <Text role="titleMd">اللون المقترح</Text>
                <Surface tone="warning" padding={4} radiusToken="md">
                  <Text role="bodySm" tone="inverse" align="center">Brand Accent (Orange)</Text>
                </Surface>
              </Box>

              <Box gap={2} style={{ flexGrow: 1 }}>
                <Text role="titleMd">معاينة قبل/بعد</Text>
                <Box layoutDirection="row" gap={1}>
                  <Surface tone={activeTone} padding={2} radiusToken="sm" style={{ flexGrow: 1 }}>
                    <Text role="caption" tone="inverse" align="center">قبل</Text>
                  </Surface>
                  <Surface tone="warning" padding={2} radiusToken="sm" style={{ flexGrow: 1 }}>
                    <Text role="caption" tone="inverse" align="center">بعد</Text>
                  </Surface>
                </Box>
                <Text role="caption" tone="muted">حالة التباين: ممتاز (Contrast Ratio: 4.8)</Text>
              </Box>
            </Box>

            {!showConfirm ? (
              <Box layoutDirection="row" gap={2} justify="flex-end" style={{ marginTop: 24 }}>
                <Button variant="secondary" onClick={() => setShowConfirm('معاينة حيّة (Simulation)')}>معاينة حيّة (Simulation)</Button>
                <Button variant="primary" onClick={() => setShowConfirm('طلب اعتماد')}>طلب اعتماد</Button>
                <Button variant="secondary" onClick={() => setShowConfirm('تطبيق لاحقًا Demo')}>تطبيق لاحقًا Demo</Button>
                <Button variant="danger" onClick={() => setShowConfirm('Rollback Demo')}>Rollback Demo</Button>
              </Box>
            ) : (
              <Surface tone="warning" border padding={3} radiusToken="md" style={{ marginTop: 24 }}>
                <Box gap={2}>
                  <Text role="titleSm">تأكيد الإجراء التجريبي: {showConfirm}</Text>
                  <Text role="bodySm">محاكاة التغيير اللوني محلياً ولن تؤثر على الإنتاج الفعلي.</Text>
                  <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                    <Button variant="primary" onClick={() => handleConfirm(showConfirm)}>تأكيد المحاكاة</Button>
                    <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
                  </Box>
                </Box>
              </Surface>
            )}
          </Surface>

        </Box>
      </WebSectionCard>
    </Box>
  );
}
