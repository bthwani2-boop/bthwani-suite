import React from 'react';
import { BthBox, BthButton, BthMobileScrollView, BthScreenHeader, BthSurface, BthText } from '@bthwani/ui-kit';
import { UnifiedMobileTopBar } from '../shared/UnifiedMobileTopBar';
import { MobileAccountSheet, type MobileAccountTypeOption } from '../shared/MobileAccountSheet';

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

type PartnerServiceType = 'dsh' | 'arb';

const partnerTypeOptions: readonly MobileAccountTypeOption[] = [
  { id: 'dsh', label: 'DSH', description: 'تشغيل الطلبات والتسليم' },
  { id: 'arb', label: 'ARB', description: 'تشغيل عرب الشركاء والمسارات' },
];

export function PartnerSurfaceHost() {
  const [activeServiceType, setActiveServiceType] = React.useState<PartnerServiceType>('dsh');
  const [accountSheetVisible, setAccountSheetVisible] = React.useState(false);

  const activePrimaryAreas =
    activeServiceType === 'dsh'
      ? primaryAreas
      : (['قائمة عرب', 'جدولة المسارات', 'تتبع التوزيع'] as const);

  const activeShortcuts =
    activeServiceType === 'dsh'
      ? shortcuts
      : (['فتح عرب اليوم', 'تحديث مسار', 'مراجعة التسليمات'] as const);

  const topBar = (
    <UnifiedMobileTopBar
      title="بثواني"
      subtitle={activeServiceType === 'dsh' ? 'لوحة الشريك - DSH' : 'لوحة الشريك - ARB'}
      locationLabel="الرياض، فرع الياسمين"
      actions={[
        {
          id: 'profile',
          iconName: 'person-outline',
          accessibilityLabel: 'الحساب',
          onPress: () => setAccountSheetVisible(true),
        },
        { id: 'notifications', iconName: 'notifications-outline', badgeCount: 3, accessibilityLabel: 'الإشعارات' },
        { id: 'orders', iconName: 'receipt-outline', accessibilityLabel: 'الطلبات' },
        { id: 'search', iconName: 'search-outline', accessibilityLabel: 'بحث' },
      ]}
      ticker={{
        statusLabel: activeServiceType === 'dsh' ? 'نشط' : 'ARB نشط',
        message:
          activeServiceType === 'dsh'
            ? 'المساحة مخصصة للتحديثات العاجلة الخاصة بعمليات الشريك'
            : 'وضع ARB مفعل. الواجهة تعمل الآن ضمن سياق ARB الكامل.',
      }}
    />
  );

  const accountSheet = (
    <MobileAccountSheet
      visible={accountSheetVisible}
      onClose={() => setAccountSheetVisible(false)}
      onOpenProfile={() => {}}
      typeOptions={partnerTypeOptions}
      activeTypeId={activeServiceType}
      onSelectType={(typeId) => {
        setActiveServiceType(typeId === 'arb' ? 'arb' : 'dsh');
      }}
      typeSwitchTitle="تغيير نوع تشغيل الشريك"
      typeSwitchPrompt="بدّل بين DSH و ARB. عند التبديل يتم تحديث محتوى التطبيق بالكامل حسب النوع المختار."
    />
  );

  return (
    <BthBox style={{ flex: 1 }} background="background">
      {topBar}
      <BthSurface
        tone="raised"
        padding={0}
        gap={0}
        radiusToken="none"
        border={false}
        style={{
          flex: 1,
          marginTop: -2,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}
      >
        <BthMobileScrollView fill padding={5} gap={5}>
          <BthScreenHeader
            title={activeServiceType === 'dsh' ? 'لوحة الشريك' : 'لوحة الشريك - ARB'}
            subtitle={
              activeServiceType === 'dsh'
                ? 'هذه هي نقطة البداية الحقيقية لتطبيق الشريك.'
                : 'هذه هي نقطة البداية الحقيقية لتشغيل الشريك على نوع ARB.'
            }
            actionLabel={activeServiceType === 'dsh' ? 'إدارة الطلبات' : 'إدارة عرب'}
            onActionPress={() => {}}
          />

          <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
            <BthText role="label" tone="inverse">نقطة البداية الرسمية</BthText>
            <BthText role="titleLg" tone="inverse">
              {activeServiceType === 'dsh' ? 'تشغيل الشريك من shell رسمية' : 'تشغيل ARB من shell رسمية'}
            </BthText>
            <BthText role="bodyMd" tone="inverse">
              {activeServiceType === 'dsh'
                ? 'البداية الصحيحة لتطبيق الشريك هي home shell تُظهر المهام الأساسية، لا شاشة preview مرتبطة بخدمة واحدة.'
                : 'البداية الصحيحة لوضع ARB هي shell تشغيلية تعرض المسارات والمهام ذات العلاقة بهذا النوع فقط.'}
            </BthText>
          </BthSurface>

          <BthSurface tone="raised" padding={5} gap={4} radiusToken="xl">
            <BthText role="label">المساحات الأساسية</BthText>
            {activePrimaryAreas.map((item) => (
              <BthSurface key={item} tone="default" padding={4} gap={2} radiusToken="lg">
                <BthText role="bodyStrong">{item}</BthText>
                <BthText role="bodySm" tone="muted">هذه مساحة رئيسية داخل التطبيق الحقيقي وليست preview route.</BthText>
              </BthSurface>
            ))}
          </BthSurface>

          <BthSurface tone="default" padding={5} gap={4} radiusToken="xl">
            <BthText role="label">اختصارات البداية</BthText>
            <BthBox gap={3}>
              {activeShortcuts.map((item) => (
                <BthButton key={item} label={item} tone="secondary" onPress={() => {}} />
              ))}
            </BthBox>
          </BthSurface>

          <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
            <BthText role="label">حكم معماري</BthText>
            <BthText role="bodySm" tone="muted">
              {activeServiceType === 'dsh'
                ? 'DSH يظل ضمن feature flows الداخلية، وليس الشاشة الافتراضية عند فتح التطبيق.'
                : 'عند اختيار ARB يجب أن تظهر فقط عناصر ARB بدون خلط مع مسارات DSH.'}
            </BthText>
          </BthSurface>

          <BthButton label={activeServiceType === 'dsh' ? 'إدارة الطلبات' : 'إدارة عرب'} onPress={() => {}} />
        </BthMobileScrollView>
      </BthSurface>
      {accountSheet}
    </BthBox>
  );
}

export default PartnerSurfaceHost;