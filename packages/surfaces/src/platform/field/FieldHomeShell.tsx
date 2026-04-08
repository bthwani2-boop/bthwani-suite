import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { BthBox, BthButton, BthScreenHeader, BthSurface, BthText, UiKitProvider } from '@bthwani/ui-kit';

const primaryAreas = [
  'الجولات',
  'الزيارات',
  'المهام المفتوحة'
] as const;

const shortcuts = [
  'بدء الجولة',
  'الزيارات المجدولة',
  'المهام العاجلة'
] as const;

export function FieldHomeShell() {
  return (
    <UiKitProvider direction="rtl" language="ar">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <BthBox padding={5} gap={5} style={{ flexGrow: 1 }}>
            <BthScreenHeader
              title="عمليات الميدان"
              subtitle="هذه هي نقطة البداية الحقيقية لتطبيق الميدان."
              actionLabel="ابدأ الجولة"
              onActionPress={() => {}}
            />

            <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
              <BthText role="label" tone="inverse">نقطة البداية الرسمية</BthText>
              <BthText role="titleLg" tone="inverse">نقطة انطلاق ميدانية فعلية</BthText>
              <BthText role="bodyMd" tone="inverse">تطبيق الميدان يحتاج home shell واضحة تُظهر الأعمال اليومية الأساسية بدل أي preview route أو service entry مؤقتة.</BthText>
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
              <BthText role="bodySm" tone="muted">app-field سطح رسمي ويجب أن يملك shell حقيقية مستقلة طويلة الأمد.</BthText>
            </BthSurface>

            <BthButton label="ابدأ الجولة" onPress={() => {}} />
          </BthBox>
        </ScrollView>
      </SafeAreaView>
    </UiKitProvider>
  );
}

export default FieldHomeShell;