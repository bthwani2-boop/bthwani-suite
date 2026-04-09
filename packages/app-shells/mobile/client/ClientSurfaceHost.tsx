import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BthBox,
  BthButton,
  BthMobileTopBar,
  BthNewsTickerBar,
  BthSectionHeader,
  BthServiceTileCard,
  BthSheetFrame,
  BthStateView,
  BthSurface,
  BthText,
  useDirection,
  useUiText,
} from '@bthwani/ui-kit';
import { amn, arb, dsh, esf, knz, kwd, mrf, snd, wlt } from '@bthwani/surfaces';

const { AmnEntryScreen } = amn.amnAppClient;
const { ArbEntryScreen } = arb.arbAppClient;
const {
  DshCreateOrderScreen,
  DshEntryScreen,
  DshOrderSuccessState,
  DshOrdersListScreen,
  DshReviewOrderScreen,
  DshTrackingScreen,
} = dsh.dshAppClient;
const { EsfEntryScreen } = esf.esfAppClient;
const { KnzEntryScreen } = knz.knzAppClient;
const { KwdEntryScreen } = kwd.kwdAppClient;
const { MrfEntryScreen } = mrf.mrfAppClient;
const { SndEntryScreen } = snd.sndAppClient;
const { WltEntryScreen } = wlt.wltAppClient;

type ClientRoute =
  | 'home'
  | 'amn-entry'
  | 'arb-entry'
  | 'dsh-entry'
  | 'dsh-create'
  | 'dsh-review'
  | 'dsh-success'
  | 'dsh-orders'
  | 'dsh-tracking'
  | 'esf-entry'
  | 'knz-entry'
  | 'kwd-entry'
  | 'mrf-entry'
  | 'snd-entry'
  | 'wlt-entry';

type AccountSheetTab = 'menu' | 'settings';

type ServiceEntry = {
  id: string;
  title: string;
  route: ClientRoute;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
};

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

export function ClientSurfaceHost() {
  const [route, setRoute] = React.useState<ClientRoute>('home');
  const [accountSheetVisible, setAccountSheetVisible] = React.useState(false);
  const [accountSheetTab, setAccountSheetTab] = React.useState<AccountSheetTab>('menu');
  const [createOrderValues, setCreateOrderValues] = React.useState<CreateOrderValues>(initialCreateOrderValues);
  const [ordersQuery, setOrdersQuery] = React.useState('');
  const { direction, language, setLanguage } = useDirection();
  const uiText = useUiText();

  const serviceEntries = React.useMemo<ServiceEntry[]>(
    () => [
      { id: 'dsh', title: uiText.serviceNames.dsh, route: 'dsh-entry', iconName: 'bicycle-outline' },
      { id: 'knz', title: uiText.serviceNames.knz, route: 'knz-entry', iconName: 'book-outline' },
      { id: 'amn', title: uiText.serviceNames.amn, route: 'amn-entry', iconName: 'shield-checkmark-outline' },
      { id: 'arb', title: uiText.serviceNames.arb, route: 'arb-entry', iconName: 'document-text-outline' },
      { id: 'wlt', title: uiText.serviceNames.wlt, route: 'wlt-entry', iconName: 'wallet-outline' },
      { id: 'esf', title: uiText.serviceNames.esf, route: 'esf-entry', iconName: 'medkit-outline' },
      { id: 'kwd', title: uiText.serviceNames.kwd, route: 'kwd-entry', iconName: 'construct-outline' },
      { id: 'mrf', title: uiText.serviceNames.mrf, route: 'mrf-entry', iconName: 'ribbon-outline' },
      { id: 'snd', title: uiText.serviceNames.snd, route: 'snd-entry', iconName: 'document-attach-outline' },
    ],
    [uiText],
  );

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

  const closeAccountSheet = React.useCallback(() => {
    setAccountSheetVisible(false);
    setAccountSheetTab('menu');
  }, []);

  const renderDshFlow = () => {
    if (route === 'amn-entry') {
      return (
        <AmnEntryScreen
          onStartPress={() => setRoute('home')}
          onBrowsePress={() => setRoute('home')}
          onTrackOrdersPress={() => setRoute('home')}
        />
      );
    }

    if (route === 'arb-entry') {
      return (
        <ArbEntryScreen
          onStartPress={() => setRoute('home')}
          onBrowsePress={() => setRoute('home')}
          onTrackOrdersPress={() => setRoute('home')}
        />
      );
    }

    if (route === 'dsh-entry') {
      return (
        <DshEntryScreen
          onStartDelivery={() => setRoute('dsh-create')}
          onBrowseStores={() => setRoute('dsh-create')}
          onOpenOrders={() => setRoute('dsh-orders')}
          onRetry={() => setRoute('dsh-entry')}
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

    if (route === 'esf-entry') {
      return (
        <EsfEntryScreen
          onStartPress={() => setRoute('home')}
          onBrowsePress={() => setRoute('home')}
          onTrackOrdersPress={() => setRoute('home')}
        />
      );
    }

    if (route === 'knz-entry') {
      return (
        <KnzEntryScreen
          onStartPress={() => setRoute('home')}
          onBrowsePress={() => setRoute('home')}
          onTrackOrdersPress={() => setRoute('home')}
        />
      );
    }

    if (route === 'kwd-entry') {
      return (
        <KwdEntryScreen
          onStartPress={() => setRoute('home')}
          onBrowsePress={() => setRoute('home')}
          onTrackOrdersPress={() => setRoute('home')}
        />
      );
    }

    if (route === 'mrf-entry') {
      return (
        <MrfEntryScreen
          onStartPress={() => setRoute('home')}
          onBrowsePress={() => setRoute('home')}
          onTrackOrdersPress={() => setRoute('home')}
        />
      );
    }

    if (route === 'snd-entry') {
      return (
        <SndEntryScreen
          onStartPress={() => setRoute('home')}
          onBrowsePress={() => setRoute('home')}
          onTrackOrdersPress={() => setRoute('home')}
        />
      );
    }

    if (route === 'wlt-entry') {
      return (
        <WltEntryScreen
          onStartPress={() => setRoute('home')}
          onBrowsePress={() => setRoute('home')}
          onTrackOrdersPress={() => setRoute('home')}
        />
      );
    }

    return null;
  };

  if (route !== 'home') {
    return (
      <>
        <BthBox padding={4} gap={3}>
          <BthButton label={uiText.common.backHome} tone="secondary" onPress={() => setRoute('home')} />
        </BthBox>
        {renderDshFlow()}
      </>
    );
  }

  return (
    <BthBox style={{ flex: 1 }} background="background">
      <BthBox
        background="brand"
        paddingX={4}
        paddingY={2}
        gap={1}
        style={{
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <BthMobileTopBar
          title={uiText.topBar.brandName}
          subtitle={uiText.topBar.brandTagline}
          locationLabel={uiText.topBar.location}
          locationIcon={<Ionicons name="location-outline" size={14} color="#FFFFFF" />}
          accountBadgeCount={5}
          accountIcon={<Ionicons name="person-outline" size={21} color="#FFFFFF" />}
          notificationsIcon={<Ionicons name="notifications-outline" size={21} color="#FFFFFF" />}
          cartIcon={<Ionicons name="cart-outline" size={21} color="#FFFFFF" />}
          searchIcon={<Ionicons name="search-outline" size={21} color="#FFFFFF" />}
          onPressAccount={() => {
            setAccountSheetTab('menu');
            setAccountSheetVisible(true);
          }}
          onPressNotifications={() => setRoute('dsh-orders')}
          onPressCart={() => setRoute('dsh-orders')}
          onPressSearch={() => setRoute('dsh-entry')}
        />

        <BthNewsTickerBar
          statusLabel={uiText.serviceHub.newsStatus}
          message={uiText.serviceHub.newsPlaceholder}
          onPress={() => setRoute('dsh-entry')}
        />
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
        <BthBox padding={4} gap={2} style={{ flex: 1 }}>
          <BthSectionHeader
            title={uiText.serviceHub.availableServices}
            subtitle={uiText.serviceHub.chooseService}
            count={serviceEntries.length}
          />
          {serviceEntries.length === 0 ? (
            <BthStateView stateId="empty" />
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {serviceEntries.map((service) => (
                  <View key={service.id} style={{ width: '48.5%', marginBottom: 10 }}>
                    <BthServiceTileCard
                      title={service.title}
                      icon={<Ionicons name={service.iconName} size={16} color="#F97316" />}
                      titleOnly
                      minHeight={118}
                      onPress={() => setRoute(service.route)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </BthBox>
      </BthSurface>

      <BthSheetFrame
        visible={accountSheetVisible}
        title={accountSheetTab === 'settings' ? uiText.accountSheet.languageTitle : uiText.accountSheet.title}
        onClose={closeAccountSheet}
      >
        {accountSheetTab === 'menu' ? (
          <>
            <BthButton
              label={uiText.accountSheet.tabs.profile}
              tone="secondary"
              onPress={() => {
                closeAccountSheet();
                setRoute('amn-entry');
              }}
            />
            <BthButton
              label={uiText.accountSheet.tabs.notifications}
              tone="secondary"
              onPress={() => {
                closeAccountSheet();
                setRoute('dsh-orders');
              }}
            />
            <BthButton
              label={uiText.accountSheet.tabs.settings}
              tone="primary"
              onPress={() => setAccountSheetTab('settings')}
            />
          </>
        ) : (
          <>
            <BthText role="bodySm" tone="muted">{uiText.accountSheet.languagePrompt}</BthText>
            <BthBox layoutDirection="row" gap={2}>
              <BthButton
                label={uiText.accountSheet.languageArabic}
                tone={language === 'ar' ? 'primary' : 'secondary'}
                fullWidth={false}
                style={{ flex: 1 }}
                onPress={() => {
                  setLanguage('ar');
                }}
              />
              <BthButton
                label={uiText.accountSheet.languageEnglish}
                tone={language === 'en' ? 'primary' : 'secondary'}
                fullWidth={false}
                style={{ flex: 1 }}
                onPress={() => {
                  setLanguage('en');
                }}
              />
            </BthBox>
            <BthButton label={uiText.accountSheet.back} tone="ghost" onPress={() => setAccountSheetTab('menu')} />
          </>
        )}
      </BthSheetFrame>
    </BthBox>
  );
}

export default ClientSurfaceHost;