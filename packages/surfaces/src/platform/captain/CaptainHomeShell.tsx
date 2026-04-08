import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { BthBox, BthButton, BthScreenHeader, BthSurface, BthText, UiKitProvider } from '@bthwani/ui-kit';

const primaryAreas = [
  'المهام',
  'الأرباح',
  'الحالة'
] as const;

const shortcuts = [
  'المهام الحالية',
  'ملخص الأرباح',
  'تبديل الحالة'
] as const;

export function CaptainHomeShell() {
  return (
    <UiKitProvider direction="rtl" language="ar">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <BthBox padding={5} gap={5} style={{ flexGrow: 1 }}>
            <BthScreenHeader
              title="مهام الكابتن"
              subtitle="هذه هي نقطة البداية الحقيقية لتطبيق الكابتن."
              actionLabel="ابدأ الاستلام"
              onActionPress={() => {}}
            />

            <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
              <BthText role="label" tone="inverse">نقطة البداية الرسمية</BthText>
              <BthText role="titleLg" tone="inverse">بداية تشغيلية حقيقية للكابتن</BthText>
              <BthText role="bodyMd" tone="inverse">تطبيق الكابتن يجب أن يبدأ من shell تُظهر المهام والحالة والاختصارات، لا من preview service entry.</BthText>
            </BthSurface>

            <BthSurface tone="raised" padding={5} gap={4} radiusToken="xl">
              <BthText role="label">المساحات الأساسية</BthText>
              {primaryAreas.map((item) => (
                <BthSurface key={item} tone="default" padding={4} gap={2} radiusToken="lg">
                  <BthText role="bodyStrong">{item}</BthText>
                  <BthText role="bodySm" tone="muted">هذه مساحة رئيسية داخل التطبيق الحقيقي وليست preview route.</BthText>
                </BthSurface>
              ))}
            </BthSurface>

            <BthSurface tone="default" padding={5} gap={4} radiusToken="xl">
              <BthText role="label">اختصارات البداية</BthText>
              <View style={{ gap: 12 }}>
                {shortcuts.map((item) => (
                  <BthButton key={item} label={item} tone="secondary" onPress={() => {}} />
                ))}
              </View>
            </BthSurface>

            <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
              <BthText role="label">حكم معماري</BthText>
              <BthText role="bodySm" tone="muted">البدء من home shell يمنع خلط feature preview مع التشغيل الفعلي للتطبيق.</BthText>
            </BthSurface>

            <BthButton label="ابدأ الاستلام" onPress={() => {}} />
          </BthBox>
        </ScrollView>
      </SafeAreaView>
    </UiKitProvider>
  );
}

export default CaptainHomeShell;