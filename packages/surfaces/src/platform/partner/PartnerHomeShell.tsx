import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { BthBox, BthButton, BthScreenHeader, BthSurface, BthText, UiKitProvider } from '@bthwani/ui-kit';

const primaryAreas = [
  'الطلبات',
  'المنتجات',
  'ساعات العمل'
] as const;

const shortcuts = [
  'الطلبات الجديدة',
  'إدارة المنتجات',
  'تحديث التوفر'
] as const;

export function PartnerHomeShell() {
  return (
    <UiKitProvider direction="rtl" language="ar">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <BthBox padding={5} gap={5} style={{ flexGrow: 1 }}>
            <BthScreenHeader
              title="لوحة الشريك"
              subtitle="هذه هي نقطة البداية الحقيقية لتطبيق الشريك."
              actionLabel="إدارة الطلبات"
              onActionPress={() => {}}
            />

            <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
              <BthText role="label" tone="inverse">نقطة البداية الرسمية</BthText>
              <BthText role="titleLg" tone="inverse">تشغيل الشريك من shell رسمية</BthText>
              <BthText role="bodyMd" tone="inverse">البداية الصحيحة لتطبيق الشريك هي home shell تُظهر المهام الأساسية، لا شاشة preview مرتبطة بخدمة واحدة.</BthText>
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
              <BthText role="bodySm" tone="muted">DSH يظل ضمن feature flows الداخلية، وليس الشاشة الافتراضية عند فتح التطبيق.</BthText>
            </BthSurface>

            <BthButton label="إدارة الطلبات" onPress={() => {}} />
          </BthBox>
        </ScrollView>
      </SafeAreaView>
    </UiKitProvider>
  );
}

export default PartnerHomeShell;