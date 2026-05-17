'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';

export function DshPlatformHealthWorkspace() {
  const { addAuditEvent } = useDemoPlatformState();
  const [dismissedWarnings, setDismissedWarnings] = React.useState<Set<string>>(new Set());
  const [lastHealthCheck, setLastHealthCheck] = React.useState<string>('لم يتم الفحص بعد');
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);

  const dismissWarning = (warningId: string) => {
    setDismissedWarnings((prev) => new Set([...prev, warningId]));
  };

  const handleHealthCheck = (checkType: string) => {
    const now = 'الآن (Demo)';
    setLastHealthCheck(now);

    addAuditEvent({
      action: `فحص صحة المنصة: ${checkType}`,
      operator: 'Demo Admin',
      status: 'success',
      oldValue: lastHealthCheck,
      newValue: 'نتيجة الفحص: سليم (Mock)',
      reason: 'فحص دوري مطلوب من المشغل',
      scope: 'Global',
      impact: 'لا يوجد أثر — فحص محاكاة فقط',
      rollbackAvailable: false,
    });
    setShowConfirm(null);
  };

  return (
    <Box gap={4}>
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="حالة الخدمات العليا"
            value="2 نشطة"
            description="DSH وWLT تعمل بشكل طبيعي. 7 خدمات مقررة لم تُضَف بعد."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="حالة المزودين"
            value="مزود الدفع يحتاج اختبار"
            description="الخرائط، SMS، الاستضافة، التخزين، الإشعارات نشطة. Telr في Sandbox ينتظر الاختبار."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="آخر تحديث إعدادات"
            value={lastHealthCheck === 'لم يتم الفحص بعد' ? 'قبل ساعتين' : lastHealthCheck}
            description="تم تعديل حد رصيد محفظة الكابتن للأهلية."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="آخر Rollback"
            value="لا يوجد تراجع حديث"
            description="لم يتم التراجع عن أي إعدادات خلال الـ 24 ساعة الماضية."
            tone="neutral"
          />
        </Box>
      </Box>

      {/* Demo Mode action buttons */}
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => setShowConfirm('فحص الخدمات')}>فحص الخدمات (تجريبي)</Button>
        <Button variant="secondary" onClick={() => setShowConfirm('فحص المزودين')}>فحص المزودين (تجريبي)</Button>
        <Button variant="primary" onClick={() => setShowConfirm('إعادة اختبار الصحة الكاملة')}>إعادة اختبار الصحة (تجريبي)</Button>
      </Box>

      {showConfirm && (
        <Surface tone="warning" border padding={3} radiusToken="md">
          <Box gap={2}>
            <Text role="titleSm">تأكيد الإجراء التجريبي: {showConfirm}</Text>
            <Text role="bodySm">لن يتم الاتصال بأي مزود أو خدمة حقيقية. هذه محاكاة محلية.</Text>
            <Box layoutDirection="row" gap={2}>
              <Button variant="primary" onClick={() => handleHealthCheck(showConfirm)}>تأكيد المحاكاة</Button>
              <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
            </Box>
          </Box>
        </Surface>
      )}

      <WebSectionCard
        title="التحذيرات النشطة"
        description="مراقبة للمتغيرات والمزودين التي تتطلب انتباه أو تدخل."
      >
        <Box gap={3}>
          {!dismissedWarnings.has('store-pickup') && (
            <Surface tone="warning" border padding={3} radiusToken="xl">
              <Box layoutDirection="row" justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', rowGap: 8 }}>
                <Box gap={1} style={{ flexGrow: 1 }}>
                  <Text role="titleMd">قدرة غير مرئية للعملاء</Text>
                  <Text role="bodySm">
                    قدرة "الاستلام من المتجر" (Store Pickup) داخل DSH مفعلة ولكنها غير ظاهرة للعملاء (Internal Only).
                    تحقق من Rollouts لتعديل مرحلة الإطلاق.
                  </Text>
                </Box>
                <Button variant="secondary" onClick={() => {
                  dismissWarning('store-pickup');
                  addAuditEvent({
                    action: 'إغلاق تحذير: قدرة Store Pickup غير مرئية للعملاء',
                    operator: 'Demo Admin',
                    status: 'warning',
                    oldValue: 'تحذير نشط',
                    newValue: 'تحذير مُغلق (محلياً)',
                    reason: 'مراجعة وإقرار من المشغل',
                    scope: 'DSH — Global',
                    impact: 'لا يوجد تغيير فعلي في الإعدادات',
                    rollbackAvailable: false,
                  });
                }}>
                  إغلاق التحذير (تجريبي)
                </Button>
              </Box>
            </Surface>
          )}

          {!dismissedWarnings.has('telr-latency') && (
            <Surface tone="danger" border padding={3} radiusToken="xl">
              <Box layoutDirection="row" justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', rowGap: 8 }}>
                <Box gap={1} style={{ flexGrow: 1 }}>
                  <Text role="titleMd">مزود الدفع يحتاج اختبار</Text>
                  <Text role="bodySm">
                    مزود الدفع (Telr) في بيئة Sandbox ولم يُختبر بعد. تفعيله كمزود افتراضي يتطلب نتيجة اختبار ناجحة أولاً.
                    انتقل إلى Providers لإجراء الاختبار.
                  </Text>
                </Box>
                <Button variant="secondary" onClick={() => {
                  dismissWarning('telr-latency');
                  addAuditEvent({
                    action: 'إغلاق تحذير: مزود الدفع Telr يحتاج اختبار',
                    operator: 'Demo Admin',
                    status: 'warning',
                    oldValue: 'تحذير نشط',
                    newValue: 'تحذير مُغلق (محلياً)',
                    reason: 'مراجعة وإقرار من المشغل — الاختبار مجدول',
                    scope: 'Global — Providers',
                    impact: 'لا يوجد تغيير فعلي في المزود',
                    rollbackAvailable: false,
                  });
                }}>
                  إغلاق التحذير (تجريبي)
                </Button>
              </Box>
            </Surface>
          )}

          {dismissedWarnings.size === 2 && (
            <Surface tone="success" border padding={3} radiusToken="xl">
              <Text role="bodySm" tone="success" align="center">
                جميع التحذيرات مُغلقة (محلياً). لا يوجد تحذيرات نشطة في هذه المحاكاة.
              </Text>
            </Surface>
          )}
        </Box>
      </WebSectionCard>
    </Box>
  );
}
