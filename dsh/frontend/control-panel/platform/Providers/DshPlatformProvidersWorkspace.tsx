'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';

type ProviderSlotProps = {
  type: string;
  currentProvider: string;
  fallbackProvider: string;
  status: string;
  env: string;
  lastTest: string;
  lastActivation: string;
  tone: 'brand' | 'warning' | 'danger' | 'default' | 'success';
};

function ProviderSlot({
  type,
  currentProvider,
  fallbackProvider,
  status,
  env,
  lastTest,
  lastActivation,
  tone,
}: ProviderSlotProps) {
  const { addAuditEvent } = useDemoPlatformState();
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = React.useState(status);
  const [currentTone, setCurrentTone] = React.useState(tone);
  const [lastTestTime, setLastTestTime] = React.useState(lastTest);
  const [isMaskedKey, setIsMaskedKey] = React.useState(true);

  const handleConfirm = (action: string) => {
    let newStatus = currentStatus;
    let newTone = currentTone;
    let newTest = lastTestTime;
    let impact = 'لا يوجد أثر كبير';

    if (action === 'تفعيل كمزود افتراضي للمنصة') {
      newStatus = 'نشط';
      newTone = 'success';
      impact = `تحويل الحركة لتتم عبر المزود: ${currentProvider}`;
    } else if (action === 'إيقاف') {
      newStatus = 'موقوف';
      newTone = 'danger';
      impact = `إيقاف المزود والاعتماد على البديل: ${fallbackProvider}`;
    } else if (action === 'اختبار الاتصال') {
      newTest = 'الآن (Pass)';
      impact = 'تحديث حالة الاتصال محلياً';
    } else if (action === 'إضافة مفتاح API') {
      impact = 'تم تحديث المفتاح محلياً (محاكاة فقط)';
      setIsMaskedKey(true); // reset mock input
    }

    setCurrentStatus(newStatus);
    setCurrentTone(newTone);
    setLastTestTime(newTest);
    setShowConfirm(null);

    addAuditEvent({
      action: `إجراء مزود ${type}: ${action}`,
      operator: 'Demo Admin',
      status: 'success',
      oldValue: `${currentStatus}`,
      newValue: `${newStatus}`,
      reason: 'محاكاة محلية',
      scope: 'Global',
      impact,
      rollbackAvailable: true,
    });
  };
  return (
    <Surface tone="raised" border padding={4} radiusToken="xl">
      <Box gap={3}>
        <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', rowGap: 8 }}>
          <Box gap={1}>
            <Text role="titleMd">مزود {type}</Text>
            <Text role="caption" tone="muted">الحالي: {currentProvider} | البديل: {fallbackProvider}</Text>
          </Box>
          <Surface tone={currentTone} padding={1} radiusToken="pill" border={false}>
            <Text role="caption" tone={currentTone === 'default' ? 'muted' : 'inverse'}>{currentStatus}</Text>
          </Surface>
        </Box>

        <Surface tone="default" border padding={3} radiusToken="md">
          <Box layoutDirection="row" justify="space-between" align="center">
            <Box gap={1}>
              <Text role="caption" tone="muted">مفتاح API (Secret)</Text>
              <Text role="bodySm" weight="bold">••••••••••••••••</Text>
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted">البيئة</Text>
              <Text role="bodySm">{env}</Text>
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted">آخر اختبار</Text>
              <Text role="bodySm">{lastTestTime}</Text>
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted">آخر تفعيل</Text>
              <Text role="bodySm">{lastActivation}</Text>
            </Box>
          </Box>
        </Surface>

        {!showConfirm ? (
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => setShowConfirm('إضافة مفتاح API')}>إضافة مفتاح API (Mock)</Button>
            <Button variant="secondary" onClick={() => setShowConfirm('اختبار الاتصال')}>اختبار الاتصال</Button>
            <Button variant="primary" onClick={() => setShowConfirm('تفعيل كمزود افتراضي للمنصة')}>تفعيل</Button>
            <Button variant="danger" onClick={() => setShowConfirm('إيقاف')}>إيقاف</Button>
            <Button variant="secondary" onClick={() => setShowConfirm('تغيير المزود البديل')}>تغيير البديل (Demo)</Button>
            <Button variant="secondary" onClick={() => setShowConfirm('Rollback')}>Rollback (Demo)</Button>
          </Box>
        ) : (
          <Surface tone="warning" border padding={3} radiusToken="md">
            <Box gap={2}>
              <Text role="titleSm">تأكيد الإجراء التجريبي: {showConfirm}</Text>
              <Text role="bodySm">
                {showConfirm === 'إضافة مفتاح API'
                  ? 'هذا إدخال تجريبي فقط. لا يتم حفظ مفاتيح حقيقية ولا الاتصال بأي مزود.'
                  : 'محاكاة محلية. لن يتم تغيير إعدادات المنصة الحقيقية.'}
              </Text>

              {showConfirm === 'إضافة مفتاح API' && (
                <Surface tone="default" border padding={2} radiusToken="md">
                  <Text role="bodySm" tone="muted">••••••••••••• (Mock Input)</Text>
                </Surface>
              )}

              <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                <Button variant="primary" onClick={() => handleConfirm(showConfirm)}>تأكيد المحاكاة</Button>
                <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
              </Box>
            </Box>
          </Surface>
        )}
      </Box>
    </Surface>
  );
}

export function DshPlatformProvidersWorkspace() {
  return (
    <Box gap={4}>
      <WebSignalCard
        title="إدارة الأسرار والمزودين (Secrets & Config Control Plane)"
        value="وضع الـ Mock الآمن"
        description="المفاتيح لا تُحفظ في الكود بتاتاً. هذه الواجهة هي Mock لتصميم الـ Control Plane الخاص بالأسرار والإعدادات لاحقًا، ولن تقوم بأي اتصال حي."
        tone="brand"
      />

      <WebSectionCard
        title="المزودون الأساسيون (Provider Slots)"
        description="التحكم بمزودي البنية التحتية، مفاتيح الربط، والـ Failover."
      >
        <Box gap={4}>
          <ProviderSlot
            type="الخرائط (Maps)"
            currentProvider="Google Maps"
            fallbackProvider="Mapbox"
            status="نشط"
            env="إنتاج (Production)"
            lastTest="قبل ساعة"
            lastActivation="قبل شهر"
            tone="success"
          />
          <ProviderSlot
            type="رسائل الجوال (SMS)"
            currentProvider="Twillio"
            fallbackProvider="Unifonic"
            status="نشط"
            env="إنتاج (Production)"
            lastTest="قبل 5 دقائق"
            lastActivation="قبل شهر"
            tone="success"
          />
          <ProviderSlot
            type="الدفع (Payment)"
            currentProvider="Telr"
            fallbackProvider="Paymob"
            status="يحتاج اختبار"
            env="Sandbox"
            lastTest="لم يختبر"
            lastActivation="-"
            tone="warning"
          />
          <ProviderSlot
            type="الاستضافة (Hosting)"
            currentProvider="AWS"
            fallbackProvider="GCP"
            status="نشط"
            env="إنتاج (Production)"
            lastTest="قبل دقيقة"
            lastActivation="قبل سنة"
            tone="success"
          />
          <ProviderSlot
            type="التخزين (Storage)"
            currentProvider="AWS S3"
            fallbackProvider="Cloudflare R2"
            status="نشط"
            env="إنتاج (Production)"
            lastTest="قبل 10 دقائق"
            lastActivation="قبل 6 أشهر"
            tone="success"
          />
          <ProviderSlot
            type="البريد (Email)"
            currentProvider="SendGrid"
            fallbackProvider="Mailgun"
            status="غير مضاف"
            env="-"
            lastTest="-"
            lastActivation="-"
            tone="default"
          />
          <ProviderSlot
            type="الإشعارات (Push)"
            currentProvider="Firebase"
            fallbackProvider="OneSignal"
            status="نشط"
            env="إنتاج (Production)"
            lastTest="قبل 3 ساعات"
            lastActivation="قبل شهرين"
            tone="success"
          />
        </Box>
      </WebSectionCard>
    </Box>
  );
}
