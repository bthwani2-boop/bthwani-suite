import React from 'react';
import { BackHandler, Platform } from 'react-native';
import {
  BthBadge,
  BthBox,
  BthButton,
  BthCard,
  BthKeyValueList,
  BthListItem,
  BthMobileScrollView,
  BthSearchField,
  BthScreenHeader,
  BthSectionHeader,
  BthStatCard,
  BthSurface,
  BthText,
  BthTopBar,
} from '@bthwani/ui-kit';
import { dshField } from '@bthwani/surfaces/app-field';
import { MobileAccountSheet, type MobileAccountTypeOption } from '../shared/MobileAccountSheet';

const {
  DshEntryScreen,
  DshFieldStoreActivationRequestScreen,
  DshInventoryManagementScreen,
  DshFieldStoreGeoPinScreen,
  DshFieldStoreVisitLogScreen,
  dshFieldActivationWorkspaceFixtureValues,
  dshFieldStoreGeoPinFixtureValues,
  dshFieldStoreVisitLogFixtureEvidence,
  dshFieldStoreVisitLogFixtureValues,
} = dshField;

type DshEntryScreenState = React.ComponentProps<typeof DshEntryScreen>['state'];
type DshFieldStoreActivationRequestState = React.ComponentProps<typeof DshFieldStoreActivationRequestScreen>['state'];
type DshFieldStoreActivationRequestValues = React.ComponentProps<typeof DshFieldStoreActivationRequestScreen>['values'];
type DshFieldStoreGeoPinState = React.ComponentProps<typeof DshFieldStoreGeoPinScreen>['state'];
type DshFieldStoreGeoPinValues = React.ComponentProps<typeof DshFieldStoreGeoPinScreen>['values'];
type DshFieldStoreVisitLogState = React.ComponentProps<typeof DshFieldStoreVisitLogScreen>['state'];
type DshFieldStoreVisitLogValues = React.ComponentProps<typeof DshFieldStoreVisitLogScreen>['values'];

type FieldRoute = 'home' | 'entry' | 'activation' | 'geo-pin' | 'visit-log' | 'inventory-management';
type FieldPreviewState = 'ready' | 'loading' | 'empty' | 'error' | 'success' | 'offline' | 'disabled';
type FieldServiceType = 'dsh' | 'arb';

const fieldTypeOptions: readonly MobileAccountTypeOption[] = [
  { id: 'dsh', label: 'DSH', description: 'تشغيل التفعيل والتثبيت والزيارة' },
  { id: 'arb', label: 'ARB', description: 'تشغيل المسارات الميدانية لـ ARB' },
];

const primaryAreas = [
  'طلبات التفعيل',
  'تثبيت الموقع',
  'إثبات الزيارة'
] as const;

const shortcuts = [
  'بدء التفعيل',
  'تأكيد الموقع',
  'سجل الزيارة',
  'إدخال منتج'
] as const;

const fieldOperationsSnapshot = [
  { label: 'طلبات التفعيل اليوم', value: '12', deltaLabel: '+3 جديدة', tone: 'brand' as const },
  { label: 'مواقع بانتظار التثبيت', value: '4', deltaLabel: 'أولوية اليوم', tone: 'warning' as const },
  { label: 'زيارات أغلقت بنجاح', value: '9', deltaLabel: '75% من الهدف', tone: 'success' as const },
] as const;

const upcomingFieldVisits = [
  {
    id: 'visit-101',
    title: 'محمصة الساحة - حي الياسمين',
    subtitle: 'تفعيل أولي + مراجعة الجاهزية مع المالك.',
    meta: 'الآن | المطلوب: فتح طلب التفعيل',
    badgeLabel: 'أولوية',
  },
  {
    id: 'visit-102',
    title: 'مخبز الزاوية - النرجس',
    subtitle: 'تثبيت الإحداثية بعد اعتماد المدخل الصحيح للشحن.',
    meta: 'بعد 25 دقيقة | المطلوب: تأكيد الموقع',
    badgeLabel: 'موقع',
  },
  {
    id: 'visit-103',
    title: 'سوق البستان - العقيق',
    subtitle: 'إغلاق سجل الزيارة ورفع ملاحظات التشغيل الأولى.',
    meta: 'بعد 45 دقيقة | المطلوب: توثيق الزيارة',
    badgeLabel: 'إثبات',
  },
] as const;

const previewStateOptions: { id: FieldPreviewState; label: string }[] = [
  { id: 'ready', label: 'جاهز' },
  { id: 'loading', label: 'تحميل' },
  { id: 'empty', label: 'فارغ' },
  { id: 'error', label: 'خطأ' },
  { id: 'success', label: 'نجاح' },
  { id: 'offline', label: 'دون اتصال' },
  { id: 'disabled', label: 'معطل' },
];

function toEntryState(state: FieldPreviewState): DshEntryScreenState {
  if (state === 'loading') {
    return 'loading';
  }

  if (state === 'empty') {
    return 'empty';
  }

  return 'ready';
}

function toActivationState(state: FieldPreviewState): DshFieldStoreActivationRequestState {
  return state;
}

function toGeoPinState(state: FieldPreviewState): DshFieldStoreGeoPinState {
  return state;
}

function toVisitLogState(state: FieldPreviewState): DshFieldStoreVisitLogState {
  return state;
}

export function FieldSurfaceHost() {
  const [activeServiceType, setActiveServiceType] = React.useState<FieldServiceType>('dsh');
  const [route, setRoute] = React.useState<FieldRoute>('entry');
  const [previewState, setPreviewState] = React.useState<FieldPreviewState>('ready');
  const [homeSearchQuery, setHomeSearchQuery] = React.useState('');
  const [accountSheetVisible, setAccountSheetVisible] = React.useState(false);
  const [activationValues, setActivationValues] = React.useState<DshFieldStoreActivationRequestValues>(dshFieldActivationWorkspaceFixtureValues);
  const [geoPinValues, setGeoPinValues] = React.useState<DshFieldStoreGeoPinValues>(dshFieldStoreGeoPinFixtureValues);
  const [visitLogValues, setVisitLogValues] = React.useState<DshFieldStoreVisitLogValues>(dshFieldStoreVisitLogFixtureValues);
  const routeHistoryRef = React.useRef<FieldRoute[]>(['entry']);
  const routeTransitionFromBackRef = React.useRef(false);

  const filteredFieldVisits = React.useMemo(() => {
    const query = homeSearchQuery.trim().toLowerCase();

    if (!query) {
      return upcomingFieldVisits;
    }

    return upcomingFieldVisits.filter((item) => {
      const haystack = `${item.title} ${item.subtitle} ${item.meta} ${item.badgeLabel}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [homeSearchQuery]);

  React.useEffect(() => {
    const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1];

    if (route !== previousRoute) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(route);
      }
    }
  }, [route]);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (accountSheetVisible) {
        setAccountSheetVisible(false);
        return true;
      }

      if (routeHistoryRef.current.length > 1) {
        routeTransitionFromBackRef.current = true;
        routeHistoryRef.current.pop();
        const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'entry';
        setRoute(previousRoute);
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [accountSheetVisible]);

  const handleBackHome = () => {
    setRoute('home');
    setPreviewState('ready');
  };

  const handleSelectServiceType = React.useCallback((typeId: string) => {
    const nextType: FieldServiceType = typeId === 'arb' ? 'arb' : 'dsh';
    setActiveServiceType(nextType);
    setRoute('home');
    setPreviewState('ready');
  }, []);

  const handleActivationRetryOrNext = () => {
    if (previewState === 'success') {
      setPreviewState('ready');
      setRoute('geo-pin');
      return;
    }

    setPreviewState('ready');
  };

  const handleGeoPinRetryOrNext = () => {
    if (previewState === 'success') {
      setPreviewState('ready');
      setRoute('visit-log');
      return;
    }

    setPreviewState('ready');
  };

  const handleVisitLogRetryOrNext = () => {
    if (previewState === 'success') {
      handleBackHome();
      return;
    }

    setPreviewState('ready');
  };

  const handleInventoryManagementBack = () => {
    setRoute('home');
  };

  const renderFieldFlow = () => {
    if (route === 'entry') {
      return (
        <DshEntryScreen
          state={toEntryState(previewState)}
          onOpenActivationPress={() => {
            setPreviewState('ready');
            setRoute('activation');
          }}
          onOpenGeoPinPress={() => {
            setPreviewState('ready');
            setRoute('geo-pin');
          }}
          onOpenVisitLogPress={() => {
            setPreviewState('ready');
            setRoute('visit-log');
          }}
        />
      );
    }

    if (route === 'activation') {
      return (
        <DshFieldStoreActivationRequestScreen
          state={toActivationState(previewState)}
          values={activationValues}
          onChange={(field, value) => setActivationValues((current) => ({ ...current, [field]: value }))}
          onSubmit={() => setPreviewState('success')}
          onRetry={handleActivationRetryOrNext}
        />
      );
    }

    if (route === 'geo-pin') {
      return (
        <DshFieldStoreGeoPinScreen
          state={toGeoPinState(previewState)}
          values={geoPinValues}
          onChange={(field, value) => setGeoPinValues((current) => ({ ...current, [field]: value }))}
          onCapturePin={() => setPreviewState('ready')}
          onConfirmPin={() => setPreviewState('success')}
          onRetry={handleGeoPinRetryOrNext}
        />
      );
    }

    if (route === 'visit-log') {
      return (
        <DshFieldStoreVisitLogScreen
          state={toVisitLogState(previewState)}
          values={visitLogValues}
          evidenceItems={dshFieldStoreVisitLogFixtureEvidence}
          onChange={(field, value) => setVisitLogValues((current) => ({ ...current, [field]: value }))}
          onSubmit={() => setPreviewState('success')}
          onRetry={handleVisitLogRetryOrNext}
        />
      );
    }

    if (route === 'inventory-management') {
      return <DshInventoryManagementScreen onBack={handleInventoryManagementBack} />;
    }

    return null;
  };

  const topBar = (
    <BthTopBar
      variant="brand"
      title="بثواني"
      subtitle={activeServiceType === 'dsh' ? 'تشغيل الميدان - DSH' : 'تشغيل الميدان - ARB'}
      locationLabel="الرياض، مسار التغطية الشمالي"
      actions={[
        {
          id: 'profile',
          icon: <Ionicons name="person-outline" size={21} color="#FFFFFF" />,
          accessibilityLabel: 'الحساب',
          onPress: () => setAccountSheetVisible(true),
        },
        { id: 'notifications', icon: <Ionicons name="notifications-outline" size={21} color="#FFFFFF" />, badgeCount: 3, accessibilityLabel: 'الإشعارات' },
        {
          id: 'geo',
          icon: <Ionicons name="navigate-outline" size={21} color="#FFFFFF" />,
          accessibilityLabel: 'الموقع',
          onPress: () => {
            if (activeServiceType === 'dsh') {
              setRoute('geo-pin');
            }
          },
        },
        { id: 'search', icon: <Ionicons name="search-outline" size={21} color="#FFFFFF" />, accessibilityLabel: 'بحث' },
      ]}
      ticker={{
        statusLabel: activeServiceType === 'dsh' ? 'نشط' : 'ARB نشط',
        message:
          activeServiceType === 'dsh'
            ? 'المساحة مخصصة لتحديثات فرق الميدان والحالة التشغيلية'
            : 'تم تفعيل وضع ARB. سيتم تحميل المسارات الميدانية الخاصة بـ ARB فور اكتمال الربط.',
        onPress: () => {
          if (activeServiceType === 'dsh') {
            setRoute('entry');
          }
        },
      }}
    />
  );

  const accountSheet = (
    <MobileAccountSheet
      visible={accountSheetVisible}
      onClose={() => setAccountSheetVisible(false)}
      onOpenProfile={handleBackHome}
      typeOptions={fieldTypeOptions}
      activeTypeId={activeServiceType}
      onSelectType={handleSelectServiceType}
      typeSwitchTitle="تغيير نوع تشغيل الميدان"
      typeSwitchPrompt="اختر DSH أو ARB. عند التبديل يتم إعادة ضبط المسار وتحديث التطبيق بالكامل بحسب النوع الجديد."
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
              title="عمليات الميدان - ARB"
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

  if (route !== 'home') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthBox padding={4} gap={3}>
          <BthButton label="العودة للرئيسية" tone="secondary" onPress={handleBackHome} />
          <BthSurface tone="inset" padding={3} gap={2} radiusToken="lg">
            <BthText role="label">معاينة Phase 12</BthText>
            <BthText role="bodySm" tone="muted">
              غيّر حالة الشاشة الحالية للتأكد من تغطية shell لجميع الحالات القانونية قبل الربط النهائي.
            </BthText>
            <BthBox gap={2}>
              {previewStateOptions.map((option) => (
                <BthButton
                  key={option.id}
                  label={option.label}
                  tone={previewState === option.id ? 'primary' : 'secondary'}
                  onPress={() => setPreviewState(option.id)}
                />
              ))}
            </BthBox>
          </BthSurface>
        </BthBox>
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
          {renderFieldFlow()}
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
          <BthSurface tone="raised" padding={4} gap={4} radiusToken="xl">
            <BthBox layoutDirection="row" justify="space-between" align="center" gap={3}>
              <BthBox gap={1} style={{ flex: 1 }}>
                <BthText role="label" tone="muted">الحساب التشغيلي</BthText>
                <BthText role="titleSm">مشرف الميدان - ناصر القحطاني</BthText>
                <BthText role="bodySm" tone="muted">الفريق الشمالي | بداية الوردية 08:00 ص</BthText>
              </BthBox>
              <BthBox align="flex-start" gap={2}>
                <BthBadge label="مفعل" tone="success" />
                <BthBadge label="3 إشعارات جديدة" tone="warning" />
              </BthBox>
            </BthBox>

            <BthBox layoutDirection="row" gap={2}>
              <BthButton label="الإشعارات" tone="secondary" size="sm" fullWidth={false} onPress={() => {}} />
              <BthButton label="الحساب" tone="secondary" size="sm" fullWidth={false} onPress={() => {}} />
              <BthButton label="المهام" tone="ghost" size="sm" fullWidth={false} onPress={() => setRoute('entry')} />
            </BthBox>

            <BthSearchField
              label="ابحث داخل الزيارات والمتاجر"
              value={homeSearchQuery}
              onChangeText={setHomeSearchQuery}
              hint="ابحث باسم المتجر أو الحي أو نوع المهمة."
            />
          </BthSurface>

          <BthScreenHeader
            title="عمليات الميدان"
            subtitle="لوحة تشغيل يومية لفرق الميدان، مع انتقال مباشر إلى التفعيل، تثبيت الموقع، وإثبات الزيارة."
            actionLabel="افتح مساحة العمل"
            onActionPress={() => setRoute('entry')}
          />

          <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
            <BthText role="label" tone="inverse">وردية اليوم</BthText>
            <BthText role="titleLg" tone="inverse">تشغيل ميداني منظم من أول شاشة</BthText>
            <BthText role="bodyMd" tone="inverse">الواجهة الآن تعرض أولويات الفريق، المهمة التالية، ومسارات التنفيذ الأساسية بدل شاشة تمهيدية عامة.</BthText>
            <BthBox gap={2}>
              <BthBadge label="المنطقة: شمال الرياض" tone="info" />
              <BthBadge label="الحالة: وردية نشطة" tone="success" />
            </BthBox>
          </BthSurface>

          <BthSurface tone="raised" padding={5} gap={4} radiusToken="xl">
            <BthSectionHeader
              title="ملخص التشغيل"
              subtitle="مؤشرات سريعة قبل الدخول إلى أي مسار تنفيذي."
            />
            <BthBox gap={3}>
              {fieldOperationsSnapshot.map((item) => (
                <BthStatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  deltaLabel={item.deltaLabel}
                  tone={item.tone}
                />
              ))}
            </BthBox>
          </BthSurface>

          <BthCard
            title="المهمة التالية"
            subtitle="نقطة الدخول الأوضح لفريق الميدان الآن."
            footer={<BthButton label="ابدأ طلب التفعيل" onPress={() => { setPreviewState('ready'); setRoute('activation'); }} />}
          >
            <BthKeyValueList
              items={[
                { label: 'المتجر', value: 'محمصة الساحة - حي الياسمين' },
                { label: 'نوع المهمة', value: 'تفعيل أولي + مراجعة جاهزية', tone: 'brand' },
                { label: 'نافذة التنفيذ', value: 'خلال 20 دقيقة' },
                { label: 'الخطوة التالية', value: 'فتح طلب التفعيل ثم الانتقال لتثبيت الموقع' },
              ]}
            />
          </BthCard>

          <BthSurface tone="default" padding={5} gap={4} radiusToken="xl">
            <BthSectionHeader
              title="الزيارات القريبة"
              subtitle="قائمة تشغيلية سريعة بدلاً من مساحة وصفية عامة."
            />
            <BthBox gap={2}>
              {filteredFieldVisits.map((item) => (
                <BthListItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  badgeLabel={item.badgeLabel}
                  onPress={() => {
                    setPreviewState('ready');

                    if (item.id === 'visit-101') {
                      setRoute('activation');
                      return;
                    }

                    if (item.id === 'visit-102') {
                      setRoute('geo-pin');
                      return;
                    }

                    setRoute('visit-log');
                  }}
                />
              ))}
              {filteredFieldVisits.length === 0 ? (
                <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
                  <BthText role="bodyStrong">لا توجد نتائج مطابقة</BthText>
                  <BthText role="bodySm" tone="muted">جرّب اسم متجر آخر أو امسح خانة البحث للعودة إلى الزيارات القريبة.</BthText>
                </BthSurface>
              ) : null}
            </BthBox>
          </BthSurface>

          <BthSurface tone="default" padding={5} gap={4} radiusToken="xl">
            <BthSectionHeader
              title="اختصارات التنفيذ"
              subtitle="إجراءات مباشرة إلى مسارات العمل الأساسية."
            />
            <BthBox gap={3}>
              {shortcuts.map((item, index) => (
                <BthButton
                  key={item}
                  label={item}
                  tone="secondary"
                  onPress={() => {
                    setPreviewState('ready');

                    if (index === 0) {
                      setRoute('activation');
                      return;
                    }

                    if (index === 1) {
                      setRoute('geo-pin');
                      return;
                    }

                    if (index === 2) {
                      setRoute('visit-log');
                      return;
                    }

                    setRoute('inventory-management');
                  }}
                />
              ))}
            </BthBox>
          </BthSurface>

          <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
            <BthText role="label">حكم معماري</BthText>
            <BthText role="bodySm" tone="muted">app-field يبدأ من shell تشغيلية طويلة الأمد، بينما تبقى معاينات Phase 12 داخل المسارات نفسها للتحقق قبل الإغلاق النهائي.</BthText>
          </BthSurface>

          <BthButton label="افتح مساحة العمل" onPress={() => setRoute('entry')} />
        </BthMobileScrollView>
      </BthSurface>
      {accountSheet}
    </BthBox>
  );
}

export default FieldSurfaceHost;