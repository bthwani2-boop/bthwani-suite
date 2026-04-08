import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { BthBox, BthButton, BthScreenHeader, BthSurface, BthText, UiKitProvider } from '@bthwani/ui-kit';

const primaryAreas = [
  'الخدمات',
  'الطلبات',
  'العناوين'
] as const;

const shortcuts = [
  'عرض الخدمات',
  'الطلبات الجارية',
  'إدارة العناوين'
] as const;

export function ClientHomeShell() {
  return (
    <UiKitProvider direction="rtl" language="ar">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <BthBox padding={5} gap={5} style={{ flexGrow: 1 }}>
            <BthScreenHeader
              title="الرئيسية"
              subtitle="هذه هي نقطة البداية الحقيقية لتطبيق العميل."
              actionLabel="ابدأ طلبك الآن"
              onActionPress={() => {}}
            />

            <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
              <BthText role="label" tone="inverse">نقطة البداية الرسمية</BthText>
              <BthText role="titleLg" tone="inverse">تجربة عميل فعلية من أول شاشة</BthText>
              <BthText role="bodyMd" tone="inverse">تم قطع الدخول المباشر إلى DSH preview. هذه الشاشة هي shell البداية الرسمية، وDSH يبقى feature flow داخليًا.</BthText>
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
              <BthText role="bodySm" tone="muted">تطبيق العميل يجب أن يبدأ من Home Shell حقيقية، وليس من service entry تجريبية.</BthText>
            </BthSurface>

            <BthButton label="ابدأ طلبك الآن" onPress={() => {}} />
          </BthBox>
        </ScrollView>
      </SafeAreaView>
    </UiKitProvider>
  );
}

export default ClientHomeShell;