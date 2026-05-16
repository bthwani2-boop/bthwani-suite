'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';

export function DshPlatformHealthWorkspace() {
  return (
    <Box gap={4}>
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="حالة الخدمات"
            value="4 خدمات نشطة"
            description="جميع الخدمات الحية تعمل بشكل طبيعي وتستقبل الطلبات."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="حالة المزودين"
            value="Google AI يحتاج اختبار"
            description="جميع المزودين الأساسيين يعملون. مزود الذكاء الاصطناعي في بيئة Sandbox وينتظر الاختبار."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="آخر تحديث إعدادات"
            value="منذ ساعتين"
            description="تم تعديل حد أهلية الكابتن من قبل: Admin-Ahmed"
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

      <WebSectionCard
        title="التحذيرات النشطة"
        description="مراقبة حية للمتغيرات والمزودين التي تتطلب انتباه أو تدخل."
      >
        <Box gap={3}>
          <Surface tone="warning" border padding={3} radiusToken="xl">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Box gap={1}>
                <Text role="titleMd">خدمة غير ظاهرة للعملاء</Text>
                <Text role="bodySm">
                  خدمة "الاستلام من المتجر" (Store Pickup) مفعلة ولكنها غير ظاهرة للعملاء (Internal Only).
                </Text>
              </Box>
              <Button variant="secondary" disabled>
                مراجعة الخدمة
              </Button>
            </Box>
          </Surface>

          <Surface tone="danger" border padding={3} radiusToken="xl">
            <Box layoutDirection="row" justify="space-between" align="center">
              <Box gap={1}>
                <Text role="titleMd">تأخير في الاستجابة (Latency)</Text>
                <Text role="bodySm">
                  تم رصد تأخير في استجابة "مزود الدفع" (Telr) خلال الـ 15 دقيقة الماضية. النظام يعمل ولكن تحت المراقبة.
                </Text>
              </Box>
              <Button variant="secondary" disabled>
                مراجعة المزود
              </Button>
            </Box>
          </Surface>
        </Box>
      </WebSectionCard>
    </Box>
  );
}
