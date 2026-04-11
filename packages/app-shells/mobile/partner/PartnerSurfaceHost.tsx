import React from 'react';
import { BthBox, BthButton, BthMobileScrollView, BthScreenHeader, BthSurface, BthText } from '@bthwani/ui-kit';
import { dsh } from '@bthwani/surfaces';
import { UnifiedMobileTopBar } from '../shared/UnifiedMobileTopBar';
import { MobileAccountSheet, type MobileAccountTypeOption } from '../shared/MobileAccountSheet';

const { DshEntryScreen, PartnerOrdersInboxScreen, PartnerOrderDetailScreen } = dsh.dshAppPartner;

type PartnerRoute = 'home' | 'entry' | 'inbox' | 'detail';

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
  const [route, setRoute] = React.useState<PartnerRoute>('entry');
  const [activeOrderId, setActiveOrderId] = React.useState('partner-order-1042');

  const activePrimaryAreas =
    activeServiceType === 'dsh'
      ? primaryAreas
      : (['قائمة عرب', 'جدولة المسارات', 'تتبع التوزيع'] as const);

  const activeShortcuts =
    activeServiceType === 'dsh'
      ? shortcuts
      : (['فتح عرب اليوم', 'تحديث مسار', 'مراجعة التسليمات'] as const);

  const activeOrderSummary = React.useMemo(() => {
    if (activeOrderId === 'partner-order-1048') {
      return {
        orderId: 'partner-order-1048',
        merchantName: 'Green Bowl',
        customerName: 'Nora A.',
        serviceWindowLabel: '18 min to SLA',
        nextActionLabel: 'confirm packaging',
        readinessNote: 'Packaging check is pending before the order moves to handoff.',
      };
    }

    if (activeOrderId === 'partner-order-1051') {
      return {
        orderId: 'partner-order-1051',
        merchantName: 'Bean House',
        customerName: 'Sara M.',
        serviceWindowLabel: '24 min to SLA',
        nextActionLabel: 'open order workspace',
        readinessNote: 'Dispatch slot is booked and customer wait time is increasing.',
      };
    }

    return {
      orderId: 'partner-order-1042',
      merchantName: 'Burger Lab',
      customerName: 'Omar A.',
      serviceWindowLabel: '12 min to SLA',
      nextActionLabel: 'confirm ready and release to captain',
      readinessNote: 'Packaging is complete and handoff lane is available.',
    };
  }, [activeOrderId]);

  const partnerEntryState = 'ready' as const;

  const openOrdersBoard = () => {
    setRoute('entry');
  };

  const openOrderWorkspace = () => {
    setActiveOrderId('partner-order-1042');
    setRoute('detail');
  };

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
        { id: 'orders', iconName: 'receipt-outline', accessibilityLabel: 'الطلبات', onPress: openOrdersBoard },
        { id: 'search', iconName: 'search-outline', accessibilityLabel: 'بحث', onPress: openOrderWorkspace },
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

  if (activeServiceType === 'arb') {
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
              title="عمليات الشريك - ARB"
              subtitle="التطبيق الآن في سياق ARB بالكامل."
              actionLabel="تحديث المسارات"
              onActionPress={() => {}}
            />

            <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
              <BthText role="label" tone="inverse">وضع التشغيل الحالي</BthText>
              <BthText role="titleLg" tone="inverse">تم تفعيل نوع ARB</BthText>
              <BthText role="bodyMd" tone="inverse">كل محتوى التطبيق الآن موجّه إلى مسارات ARB، مع منع خلط مسارات DSH داخل نفس السياق.</BthText>
            </BthSurface>

            <BthSurface tone="raised" padding={5} gap={4} radiusToken="xl">
              <BthText role="label">المساحات الأساسية - ARB</BthText>
              <BthSurface tone="default" padding={4} gap={2} radiusToken="lg">
                <BthText role="bodyStrong">إدارة المسارات</BthText>
                <BthText role="bodySm" tone="muted">تجهيز المسار، ترتيب نقاط الخدمة، ومتابعة الإنجاز.</BthText>
              </BthSurface>
              <BthSurface tone="default" padding={4} gap={2} radiusToken="lg">
                <BthText role="bodyStrong">مهام الميدان</BthText>
                <BthText role="bodySm" tone="muted">عرض المهام المرتبطة بنوع ARB فقط.</BthText>
              </BthSurface>
            </BthSurface>

            <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
              <BthText role="label">حالة الربط</BthText>
              <BthText role="bodySm" tone="muted">واجهات ARB الميدانية قيد التوسعة، لكن التبديل مطبق ويبدّل سياق التطبيق بالكامل بالفعل.</BthText>
            </BthSurface>
          </BthMobileScrollView>
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'entry') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <DshEntryScreen
            state={partnerEntryState}
            onOpenOffersPress={() => setRoute('inbox')}
            onOpenExecutionPress={() => {
              setActiveOrderId('partner-order-1042');
              setRoute('detail');
            }}
            onOpenProofCapturePress={() => {
              setActiveServiceType('arb');
            }}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'inbox') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <PartnerOrdersInboxScreen
            onOpenOrder={(orderId) => {
              setActiveOrderId(orderId);
              setRoute('detail');
            }}
            onOpenNextOrder={(orderId) => {
              setActiveOrderId(orderId);
              setRoute('detail');
            }}
            onRetry={() => setRoute('inbox')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'detail') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <PartnerOrderDetailScreen
            summary={activeOrderSummary}
            onConfirmReady={() => setRoute('inbox')}
            onOpenNextOrder={() => setRoute('inbox')}
            onBackToInbox={() => setRoute('inbox')}
            onRetry={() => setRoute('detail')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

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
            actionLabel={activeServiceType === 'dsh' ? 'ابدأ من entry' : 'إدارة عرب'}
            onActionPress={activeServiceType === 'dsh' ? openOrdersBoard : undefined}
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
              {activeShortcuts.map((item, index) => (
                <BthButton
                  key={item}
                  label={item}
                  tone="secondary"
                  onPress={() => {
                    if (activeServiceType !== 'dsh') {
                      return;
                    }

                    if (index === 0) {
                      setRoute('entry');
                      return;
                    }

                    if (index === 1) {
                      setActiveOrderId('partner-order-1048');
                      setRoute('detail');
                      return;
                    }

                    setActiveOrderId('partner-order-1051');
                    setRoute('inbox');
                  }}
                />
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

          <BthButton label={activeServiceType === 'dsh' ? 'ابدأ من entry' : 'إدارة عرب'} onPress={activeServiceType === 'dsh' ? openOrdersBoard : undefined} />
        </BthMobileScrollView>
      </BthSurface>
      {accountSheet}
    </BthBox>
  );
}

export default PartnerSurfaceHost;