import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { BthBox, BthButton, BthScreenHeader, BthSurface, BthText, UiKitProvider } from '@bthwani/ui-kit';
import {
  DshCreateOrderScreen,
  DshEntryScreen,
  DshOrderSuccessState,
  DshOrdersListScreen,
  DshReviewOrderScreen,
  DshTrackingScreen,
} from '../../dsh/app-client';

type ClientRoute =
  | 'home'
  | 'dsh-entry'
  | 'dsh-create'
  | 'dsh-review'
  | 'dsh-success'
  | 'dsh-orders'
  | 'dsh-tracking';

type CreateOrderValues = {
  pickupAddress: string;
  dropoffAddress: string;
  contactName: string;
  contactPhone: string;
  note: string;
};

const initialCreateOrderValues: CreateOrderValues = {
  pickupAddress: 'Riyadh Park, Gate 2',
  dropoffAddress: 'Olaya, King Fahad Road',
  contactName: 'Ahmad',
  contactPhone: '0501234567',
  note: '',
};

const initialOrders = [
  {
    id: 'dsh-10021',
    title: 'Order #10021',
    subtitle: 'Riyadh Park to Olaya',
    statusLabel: 'In transit',
    meta: 'ETA 18 min',
  },
  {
    id: 'dsh-10019',
    title: 'Order #10019',
    subtitle: 'Hittin to Al Malqa',
    statusLabel: 'Delivered',
    meta: 'Today 03:10 PM',
  },
];

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
  const [route, setRoute] = React.useState<ClientRoute>('home');
  const [createOrderValues, setCreateOrderValues] = React.useState<CreateOrderValues>(initialCreateOrderValues);
  const [ordersQuery, setOrdersQuery] = React.useState('');

  const filteredOrders = React.useMemo(() => {
    const query = ordersQuery.trim().toLowerCase();
    if (!query) {
      return initialOrders;
    }

    return initialOrders.filter((order) => {
      const haystack = `${order.title} ${order.subtitle} ${order.statusLabel} ${order.meta}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [ordersQuery]);

  const reviewBlocks = React.useMemo(
    () => ({
      route: [
        { id: 'pickup', label: 'Pickup', value: createOrderValues.pickupAddress || 'Not provided' },
        { id: 'dropoff', label: 'Dropoff', value: createOrderValues.dropoffAddress || 'Not provided' },
      ],
      contact: [
        { id: 'name', label: 'Contact name', value: createOrderValues.contactName || 'Not provided' },
        { id: 'phone', label: 'Contact phone', value: createOrderValues.contactPhone || 'Not provided' },
      ],
      pricing: [
        { id: 'base', label: 'Delivery fee', value: '22 SAR' },
        { id: 'eta', label: 'Estimated time', value: '25 min' },
      ],
    }),
    [createOrderValues],
  );

  const trackingTimeline = React.useMemo(
    () => [
      { id: 'created', title: 'Order created', detail: 'Your request was confirmed.', done: true },
      { id: 'assigned', title: 'Captain assigned', detail: 'A captain accepted your order.', done: true },
      { id: 'pickup', title: 'Pickup in progress', detail: 'Captain is heading to pickup location.', done: false },
      { id: 'dropoff', title: 'On the way to dropoff', detail: 'Live tracking will appear here.', done: false },
    ],
    [],
  );

  const handleCreateOrderChange = React.useCallback((field: keyof CreateOrderValues, value: string) => {
    setCreateOrderValues((current) => ({ ...current, [field]: value }));
  }, []);

  const renderDshFlow = () => {
    if (route === 'dsh-entry') {
      return (
        <DshEntryScreen
          onStartPress={() => setRoute('dsh-create')}
          onBrowsePress={() => setRoute('dsh-create')}
          onTrackOrdersPress={() => setRoute('dsh-orders')}
        />
      );
    }

    if (route === 'dsh-create') {
      return (
        <DshCreateOrderScreen
          values={createOrderValues}
          onChange={handleCreateOrderChange}
          onContinue={() => setRoute('dsh-review')}
        />
      );
    }

    if (route === 'dsh-review') {
      return (
        <DshReviewOrderScreen
          blocks={reviewBlocks}
          onEdit={() => setRoute('dsh-create')}
          onSubmit={() => setRoute('dsh-success')}
        />
      );
    }

    if (route === 'dsh-success') {
      return (
        <BthBox padding={4}>
          <DshOrderSuccessState onNext={() => setRoute('dsh-tracking')} />
        </BthBox>
      );
    }

    if (route === 'dsh-orders') {
      return (
        <DshOrdersListScreen
          items={filteredOrders}
          query={ordersQuery}
          onQueryChange={setOrdersQuery}
          onOpenOrder={() => setRoute('dsh-tracking')}
        />
      );
    }

    if (route === 'dsh-tracking') {
      return (
        <DshTrackingScreen
          currentStatusLabel="On route"
          timeline={trackingTimeline}
          onSupport={() => setRoute('dsh-orders')}
          onRetry={() => setRoute('dsh-tracking')}
          onNextAction={() => setRoute('dsh-orders')}
        />
      );
    }

    return null;
  };

  if (route !== 'home') {
    return (
      <UiKitProvider direction="rtl" language="ar">
        <SafeAreaView style={{ flex: 1 }}>
          <BthBox padding={4} gap={3}>
            <BthButton label="العودة للرئيسية" tone="secondary" onPress={() => setRoute('home')} />
          </BthBox>
          {renderDshFlow()}
        </SafeAreaView>
      </UiKitProvider>
    );
  }

  return (
    <UiKitProvider direction="rtl" language="ar">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <BthBox padding={5} gap={5} style={{ flexGrow: 1 }}>
            <BthScreenHeader
              title="الرئيسية"
              subtitle="هذه هي نقطة البداية الحقيقية لتطبيق العميل."
              actionLabel="ابدأ طلبك الآن"
              onActionPress={() => setRoute('dsh-entry')}
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
                {shortcuts.map((item, index) => (
                  <BthButton
                    key={item}
                    label={item}
                    tone="secondary"
                    onPress={() => {
                      if (index === 0) {
                        setRoute('dsh-entry');
                        return;
                      }

                      if (index === 1) {
                        setRoute('dsh-orders');
                        return;
                      }

                      setRoute('dsh-create');
                    }}
                  />
                ))}
              </View>
            </BthSurface>

            <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
              <BthText role="label">حكم معماري</BthText>
              <BthText role="bodySm" tone="muted">تطبيق العميل يجب أن يبدأ من Home Shell حقيقية، وليس من service entry تجريبية.</BthText>
            </BthSurface>

            <BthButton label="ابدأ طلبك الآن" onPress={() => setRoute('dsh-entry')} />
          </BthBox>
        </ScrollView>
      </SafeAreaView>
    </UiKitProvider>
  );
}

export default ClientHomeShell;