import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BthBox,
  BthButton,
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
import { UnifiedMobileTopBar } from '../shared/UnifiedMobileTopBar';

const { AmnEntryScreen } = amn.amnAppClient;
const { ArbEntryScreen } = arb.arbAppClient;
const { EsfEntryScreen } = esf.esfAppClient;
const { KnzEntryScreen } = knz.knzAppClient;
const { KwdEntryScreen } = kwd.kwdAppClient;
const { MrfEntryScreen } = mrf.mrfAppClient;
const { SndEntryScreen } = snd.sndAppClient;
const { WltEntryScreen } = wlt.wltAppClient;
const { DshSurfaceHost } = dsh.dshAppClient;
type DshCommandTarget = React.ComponentProps<typeof DshSurfaceHost>['command']['target'];

type ClientRoute =
  | 'home'
  | 'dsh'
  | 'amn-entry'
  | 'arb-entry'
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

export function ClientSurfaceHost() {
  const [route, setRoute] = React.useState<ClientRoute>('home');
  const [accountSheetVisible, setAccountSheetVisible] = React.useState(false);
  const [accountSheetTab, setAccountSheetTab] = React.useState<AccountSheetTab>('menu');
  const [dshCommand, setDshCommand] = React.useState<{ token: number; target: DshCommandTarget }>({
    token: 0,
    target: 'home',
  });
  const { direction, language, setLanguage } = useDirection();
  const uiText = useUiText();

  const serviceEntries = React.useMemo<ServiceEntry[]>(
    () => [
      { id: 'dsh', title: uiText.serviceNames.dsh, route: 'dsh', iconName: 'bicycle-outline' },
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

  const openDsh = React.useCallback((target: DshCommandTarget) => {
    setDshCommand((current) => ({ token: current.token + 1, target }));
    setRoute('dsh');
  }, []);

  const closeAccountSheet = React.useCallback(() => {
    setAccountSheetVisible(false);
    setAccountSheetTab('menu');
  }, []);

  const renderUnifiedTopBar = React.useCallback(() => {
    return (
      <UnifiedMobileTopBar
        title={uiText.topBar.brandName}
        subtitle={uiText.topBar.brandTagline}
        locationLabel={uiText.topBar.location}
        actions={[
          {
            id: 'account',
            iconName: 'person-outline',
            accessibilityLabel: uiText.accountSheet.title,
            onPress: () => {
              setAccountSheetTab('menu');
              setAccountSheetVisible(true);
            },
          },
          {
            id: 'notifications',
            iconName: 'notifications-outline',
            badgeCount: 5,
            accessibilityLabel: uiText.accountSheet.tabs.notifications,
            onPress: () => openDsh('orders-list'),
          },
          {
            id: 'cart',
            iconName: 'cart-outline',
            accessibilityLabel: uiText.serviceHub.availableServices,
            onPress: () => openDsh('cart-get'),
          },
          {
            id: 'search',
            iconName: 'search-outline',
            accessibilityLabel: 'Search',
            onPress: () => openDsh('stores-list'),
          },
        ]}
        ticker={{
          statusLabel: uiText.serviceHub.newsStatus,
          message: uiText.serviceHub.newsPlaceholder,
          onPress: () => openDsh('home'),
        }}
      />
    );
  }, [openDsh, uiText]);

  const renderSubSurface = () => {
    if (route === 'dsh') {
      return <DshSurfaceHost command={dshCommand} onExit={() => setRoute('home')} />;
    }

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
      <BthBox style={{ flex: 1 }} background="background">
        {renderUnifiedTopBar()}
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
          {renderSubSurface()}
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
                  openDsh('orders');
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

  return (
    <BthBox style={{ flex: 1 }} background="background">
      {renderUnifiedTopBar()}

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
                openDsh('orders');
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