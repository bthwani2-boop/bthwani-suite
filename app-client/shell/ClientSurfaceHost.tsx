import React from 'react';
import { BackHandler, Platform, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Box,
  Button,
  Icon,
  SectionHeader,
  ServiceTileCard,
  SheetFrame,
  StateView,
  Surface,
  Text,
  TopBar,
  useDirection,
  useUiText,
} from '@bthwani/ui-kit';
import {
  amnAppClient,
  arbAppClient,
  dshAppClient,
  esfAppClient,
  knzAppClient,
  kwdAppClient,
  mrfAppClient,
  sndAppClient,
  wltAppClient,
  appClientSurfaceOwned,
  useServiceLabels,
} from '../composition';

const { AmnEntryScreen } = amnAppClient;
const { ArbEntryScreen } = arbAppClient;
const { DshSurfaceHost } = dshAppClient;
const { EsfEntryScreen } = esfAppClient;
const { KnzEntryScreen } = knzAppClient;
const { KwdEntryScreen } = kwdAppClient;
const { MrfEntryScreen } = mrfAppClient;
const { SndEntryScreen } = sndAppClient;
const { WltHomeGetScreen, WltTopupScreen } = wltAppClient;


const { ClientEntrySurface } = appClientSurfaceOwned.ClientEntry;
const { ClientLoginSurface } = appClientSurfaceOwned.ClientLogin;
const { ClientSearchSurface } = appClientSurfaceOwned.ClientSearch;
const { ClientAccountSurface } = appClientSurfaceOwned.ClientAccount;
const { ClientNotificationsSurface } = appClientSurfaceOwned.ClientNotifications;
const { ClientSupportSurface } = appClientSurfaceOwned.ClientSupport;
const { ClientSettingsSurface } = appClientSurfaceOwned.ClientSettings;
type DshCommandTarget = React.ComponentProps<typeof DshSurfaceHost>['command']['target'];
type DshApprovedVideoReelsViewerRenderer = React.ComponentProps<typeof DshSurfaceHost>['renderApprovedVideoReelsViewer'];

type ClientRoute =
  | 'entry'
  | 'login'
  | 'search'
  | 'home'
  | 'account'
  | 'notifications'
  | 'support'
  | 'settings'
  | 'dsh'
  | 'amn-entry'
  | 'arb-entry'
  | 'esf-entry'
  | 'knz-entry'
  | 'kwd-entry'
  | 'mrf-entry'
  | 'snd-entry'
  | 'wlt-entry'
  | 'wlt-home';

type AccountSheetTab = 'menu' | 'settings';

type ServiceEntry = {
  id: string;
  title: string;
  route: ClientRoute;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
};

export function ClientSurfaceHost({ renderApprovedVideoReelsViewer }: { renderApprovedVideoReelsViewer?: DshApprovedVideoReelsViewerRenderer } = {}) {
  const [route, setRoute] = React.useState<ClientRoute>('entry');
  const [accountSheetVisible, setAccountSheetVisible] = React.useState(false);
  const [accountSheetTab, setAccountSheetTab] = React.useState<AccountSheetTab>('menu');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = React.useState(false);
  const [loginIdentity, setLoginIdentity] = React.useState('');
  const [loginVerificationCode, setLoginVerificationCode] = React.useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = React.useState('');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [compactProfileEnabled, setCompactProfileEnabled] = React.useState(false);
  const [privacyModeEnabled, setPrivacyModeEnabled] = React.useState(false);
  const [accessibilityModeEnabled, setAccessibilityModeEnabled] = React.useState(false);
  const [notificationItems, setNotificationItems] = React.useState([
    {
      id: 'notif-1',
      title: 'تحديث عام',
      subtitle: 'تم تجهيز التطبيق للدخول الأولي والانتقال بين الأقسام العامة.',
      meta: 'الآن',
      badgeLabel: 'جديد',
    },
    {
      id: 'notif-2',
      title: 'تنبيه الحساب',
      subtitle: 'يمكنك مراجعة الهوية العامة والإعدادات من نفس المسار.',
      meta: 'اليوم',
      badgeLabel: 'عام',
    },
  ]);
  const [dshCommand, setDshCommand] = React.useState<{ token: number; target: DshCommandTarget }>({
    token: 0,
    target: 'home',
  });
  const { direction, language, setLanguage } = useDirection();
  const uiText = useUiText();
  const serviceLabels = useServiceLabels();
  const routeOwnsTopBar = route === 'dsh';
  const closeAccountSheet = React.useCallback(() => {
    setAccountSheetVisible(false);
    setAccountSheetTab('menu');
  }, []);

  const handleOpenDshService = React.useCallback((serviceId: string) => {
    if (serviceId === 'dsh') {
      setRoute('dsh');
      return;
    }

    if (serviceId === 'amn') {
      setRoute('amn-entry');
      return;
    }

    if (serviceId === 'arb') {
      setRoute('arb-entry');
      return;
    }

    if (serviceId === 'wlt') {
      setRoute('wlt-entry');
      return;
    }

    if (serviceId === 'knz') {
      setRoute('knz-entry');
      return;
    }

    if (serviceId === 'esf') {
      setRoute('esf-entry');
      return;
    }

    if (serviceId === 'kwd') {
      setRoute('kwd-entry');
      return;
    }

    if (serviceId === 'mrf') {
      setRoute('mrf-entry');
      return;
    }

    if (serviceId === 'snd') {
      setRoute('snd-entry');
      return;
    }

    setRoute('dsh');
  }, []);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (accountSheetVisible) {
        closeAccountSheet();
        return true;
      }

      if (route === 'dsh') {
        return false;
      }

      if (route === 'entry' || route === 'home') {
        BackHandler.exitApp();
        return true;
      }

      if (route === 'login') {
        setRoute('entry');
        return true;
      }

      setRoute('home');
      return true;
    });

    return () => subscription.remove();
  }, [accountSheetVisible, closeAccountSheet, route]);

  const serviceEntries = React.useMemo<ServiceEntry[]>(
    () => [
      { id: 'dsh', title: serviceLabels.dsh, route: 'dsh', iconName: 'bicycle-outline' },
      { id: 'knz', title: serviceLabels.knz, route: 'knz-entry', iconName: 'book-outline' },
      { id: 'amn', title: serviceLabels.amn, route: 'amn-entry', iconName: 'shield-checkmark-outline' },
      { id: 'arb', title: serviceLabels.arb, route: 'arb-entry', iconName: 'document-text-outline' },
      { id: 'wlt', title: serviceLabels.wlt, route: 'wlt-entry', iconName: 'wallet-outline' },
      { id: 'esf', title: serviceLabels.esf, route: 'esf-entry', iconName: 'medkit-outline' },
      { id: 'kwd', title: serviceLabels.kwd, route: 'kwd-entry', iconName: 'construct-outline' },
      { id: 'mrf', title: serviceLabels.mrf, route: 'mrf-entry', iconName: 'ribbon-outline' },
      { id: 'snd', title: serviceLabels.snd, route: 'snd-entry', iconName: 'document-attach-outline' },
    ],
    [uiText],
  );

  const globalSearchResults = React.useMemo(() => {
    const searchEntries = [
      ...serviceEntries.map((service) => ({
        id: `service-${service.id}`,
        title: service.title,
        subtitle: 'خدمة عامة متاحة من الصفحة الرئيسية',
        badgeLabel: 'خدمة',
        keywords: service.title,
        onPress: () => setRoute(service.route),
      })),
      {
        id: 'global-account',
        title: 'الحساب',
        subtitle: 'الوصول إلى الهوية العامة وخيارات الحساب',
        badgeLabel: 'عام',
        keywords: 'الحساب الهوية profile account',
        onPress: () => setRoute(isAuthenticated ? 'account' : 'login'),
      },
      {
        id: 'global-notifications',
        title: 'الإشعارات',
        subtitle: 'عرض التنبيهات العامة والتنقل إلى صندوق الإشعارات',
        badgeLabel: 'عام',
        keywords: 'الإشعارات التنبيهات notifications',
        onPress: () => setRoute('notifications'),
      },
      {
        id: 'global-settings',
        title: 'الإعدادات',
        subtitle: 'تفضيلات اللغة والخصوصية والوضع المختصر',
        badgeLabel: 'عام',
        keywords: 'الإعدادات اللغة الخصوصية settings',
        onPress: () => setRoute('settings'),
      },
      {
        id: 'global-support',
        title: 'الدعم',
        subtitle: 'أسئلة شائعة ومسار التواصل العام',
        badgeLabel: 'عام',
        keywords: 'الدعم المساعدة support help',
        onPress: () => setRoute('support'),
      },
    ];

    const query = globalSearchQuery.trim().toLowerCase();
    if (!query) {
      return searchEntries;
    }

    return searchEntries.filter((entry) => {
      const haystack = `${entry.title} ${entry.subtitle} ${entry.keywords}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [globalSearchQuery, isAuthenticated, serviceEntries]);

  const openDsh = React.useCallback((target: DshCommandTarget) => {
    setDshCommand((current) => ({ token: current.token + 1, target }));
    setRoute('dsh');
  }, []);

  const renderUnifiedTopBar = React.useCallback(() => {
    return (
      <TopBar
        variant="brand"
        title={uiText.topBar.brandName}
        subtitle={uiText.topBar.brandTagline}
        locationLabel={uiText.topBar.location}
        actions={[
          {
            id: 'account',
            icon: <Icon name="person-outline" size={21} color="#FFFFFF" />,
            accessibilityLabel: uiText.accountSheet.title,
            onPress: () => {
              setAccountSheetTab('menu');
              setAccountSheetVisible(true);
            },
          },
          {
            id: 'notifications',
            icon: <Icon name="notifications-outline" size={21} color="#FFFFFF" />,
            badgeCount: notificationItems.length,
            accessibilityLabel: uiText.accountSheet.tabs.notifications,
            onPress: () => setRoute('notifications'),
          },
          {
            id: 'search',
            icon: <Icon name="search-outline" size={21} color="#FFFFFF" />,
            accessibilityLabel: 'البحث',
            onPress: () => setRoute('search'),
          },
        ]}
        ticker={{
          statusLabel: uiText.serviceHub.newsStatus,
          message: uiText.serviceHub.newsPlaceholder,
          onPress: () => openDsh('home'),
        }}
      />
    );
  }, [notificationItems.length, openDsh, uiText]);

  const showUnifiedTopBar = route !== 'dsh' && route !== 'entry' && route !== 'login';


  const renderSubSurface = () => {
    if (route === 'entry') {
      return (
        <ClientEntrySurface
          appName={uiText.topBar.brandName}
          userLabel="أهلًا بك"
          primaryServiceLabel="دخول أنيق وسريع"
          secondaryServiceLabel="خدمات مشتركة في مكان واحد"
          onEnterApp={() => setRoute('home')}
          onOpenLogin={() => setRoute('login')}
          onOpenAccount={() => setRoute(isAuthenticated ? 'account' : 'login')}
          onOpenNotifications={() => setRoute('notifications')}
          onOpenSupport={() => setRoute('support')}
        />
      );
    }

    if (route === 'login') {
      return (
        <ClientEntrySurface
          appName={uiText.topBar.brandName}
          userLabel="أهلًا بك"
          primaryServiceLabel="دخول أنيق وسريع"
          secondaryServiceLabel="خدمات مشتركة في مكان واحد"
          onEnterApp={() => setRoute('home')}
          onOpenLogin={() => setRoute('login')}
          onOpenAccount={() => setRoute(isAuthenticated ? 'account' : 'login')}
          onOpenNotifications={() => setRoute('notifications')}
          onOpenSupport={() => setRoute('support')}
          openLogin={true}
        />
      );
    }

    if (route === 'account') {
      return (
        <ClientAccountSurface
          snapshot={{
            displayName: isDeveloperMode ? 'وضع المطور' : uiText.topBar.brandName,
            phoneLabel: 'غير مضاف',
            languageLabel: language === 'ar' ? 'العربية' : 'English',
            securityLabel: isDeveloperMode ? 'مطور محلي' : 'قياسي',
            emailLabel: isDeveloperMode ? 'developer@bthwani.app' : 'general@bthwani.app',
          }}
          notificationsEnabled={notificationsEnabled}
          compactProfileEnabled={compactProfileEnabled}
          onEditProfile={() => setRoute('settings')}
          onEditPhone={() => setRoute('settings')}
          onEditLanguage={() => setRoute('settings')}
          onEditSecurity={() => setRoute('settings')}
          onToggleNotifications={setNotificationsEnabled}
          onToggleCompactProfile={setCompactProfileEnabled}
        />
      );
    }

    if (route === 'search') {
      return (
        <ClientSearchSurface
          queryValue={globalSearchQuery}
          onChangeQuery={setGlobalSearchQuery}
          results={globalSearchResults}
          onBack={() => setRoute('home')}
          onClearQuery={() => setGlobalSearchQuery('')}
        />
      );
    }

    if (route === 'settings') {
      return (
        <ClientSettingsSurface
          snapshot={{
            languageLabel: language === 'ar' ? 'العربية' : 'English',
            themeLabel: 'فاتح',
            notificationsEnabled,
            compactModeEnabled: compactProfileEnabled,
            privacyModeEnabled,
            accessibilityModeEnabled,
          }}
          onOpenLanguage={() => {
            setAccountSheetTab('settings');
            setAccountSheetVisible(true);
          }}
          onOpenTheme={() => {
            setAccountSheetTab('settings');
            setAccountSheetVisible(true);
          }}
          onOpenPrivacy={() => setPrivacyModeEnabled((current) => !current)}
          onOpenAccessibility={() => setAccessibilityModeEnabled((current) => !current)}
          onToggleNotifications={setNotificationsEnabled}
          onToggleCompactMode={setCompactProfileEnabled}
          onTogglePrivacyMode={setPrivacyModeEnabled}
          onToggleAccessibilityMode={setAccessibilityModeEnabled}
          onResetPreferences={() => {
            setNotificationsEnabled(true);
            setCompactProfileEnabled(false);
            setPrivacyModeEnabled(false);
            setAccessibilityModeEnabled(false);
          }}
        />
      );
    }

    if (route === 'notifications') {
      return (
        <ClientNotificationsSurface
          unreadCount={notificationItems.length}
          items={notificationItems}
          onOpenInbox={() => openDsh('orders-list')}
          onClearAll={() => setNotificationItems([])}
        />
      );
    }

    if (route === 'support') {
      return (
        <ClientSupportSurface
          faqCount={8}
          ticketCount={notificationItems.length}
          onOpenFaq={() => openDsh('home')}
          onOpenTickets={() => openDsh('orders-list')}
          onContactSupport={() => openDsh('home')}
          onSendFeedback={() => setRoute('support')}
        />
      );
    }

    if (route === 'dsh') {
      return <DshSurfaceHost command={dshCommand} onExit={() => setRoute('home')} onOpenService={handleOpenDshService} renderApprovedVideoReelsViewer={renderApprovedVideoReelsViewer} />;
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
        <WltHomeGetScreen />
      );
    }

    if (route === 'wlt-home') {
      return (
        <WltHomeGetScreen />
      );
    }

    return null;
  };

  if (route === 'entry' || route === 'login') {
    return (
      <Box style={{ flex: 1 }} background="background">
        {renderSubSurface()}
      </Box>
    );
  }

  if (route !== 'home') {
    return (
      <Box style={{ flex: 1 }} background="background">
        {!routeOwnsTopBar ? renderUnifiedTopBar() : null}
        {routeOwnsTopBar ? (
          renderSubSurface()
        ) : (
          <Surface
            tone="raised"
            padding={0}
            gap={0}
            radiusToken="none"
            border={false}
            style={{
              flex: 1,
              marginTop: showUnifiedTopBar ? -2 : 0,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              overflow: 'hidden',
            }}
          >
            {renderSubSurface()}
          </Surface>
        )}

        <SheetFrame
          visible={accountSheetVisible}
          title={accountSheetTab === 'settings' ? uiText.accountSheet.languageTitle : uiText.accountSheet.title}
          onClose={closeAccountSheet}
        >
          {accountSheetTab === 'menu' ? (
            <>
              <Button
                label={isAuthenticated ? 'الحساب' : 'تسجيل الدخول'}
                tone="secondary"
                onPress={() => {
                  closeAccountSheet();
                  setRoute(isAuthenticated ? 'account' : 'login');
                }}
              />
              <Button
                label="الدعم"
                tone="secondary"
                onPress={() => {
                  closeAccountSheet();
                  setRoute('support');
                }}
              />
              <Button
                label="الإعدادات"
                tone="primary"
                onPress={() => {
                  closeAccountSheet();
                  setRoute('settings');
                }}
              />
            </>
          ) : (
            <>
              <Text role="bodySm" tone="muted">{uiText.accountSheet.languagePrompt}</Text>
              <Box layoutDirection="row" gap={2}>
                <Button
                  label={uiText.accountSheet.languageArabic}
                  tone={language === 'ar' ? 'primary' : 'secondary'}
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() => {
                    setLanguage('ar');
                  }}
                />
                <Button
                  label={uiText.accountSheet.languageEnglish}
                  tone={language === 'en' ? 'primary' : 'secondary'}
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() => {
                    setLanguage('en');
                  }}
                />
              </Box>
              <Button label={uiText.accountSheet.back} tone="ghost" onPress={() => setAccountSheetTab('menu')} />
            </>
          )}
        </SheetFrame>
      </Box>
    );
  }

  return (
    <Box style={{ flex: 1 }} background="background">
      {showUnifiedTopBar ? renderUnifiedTopBar() : null}

      <Surface
        tone="raised"
        padding={0}
        gap={0}
        radiusToken="none"
        border={false}
        style={{
          flex: 1,
          marginTop: showUnifiedTopBar ? -2 : 0,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}
      >
        <Box padding={4} gap={2} style={{ flex: 1 }}>
          <SectionHeader
            title={uiText.serviceHub.availableServices}
            subtitle={uiText.serviceHub.chooseService}
            count={serviceEntries.length}
          />
          {serviceEntries.length === 0 ? (
            <StateView stateId="empty" />
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {serviceEntries.map((service) => (
                  <View key={service.id} style={{ width: '48.5%', marginBottom: 10 }}>
                    <ServiceTileCard
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
        </Box>
      </Surface>

      <SheetFrame
        visible={accountSheetVisible}
        title={accountSheetTab === 'settings' ? uiText.accountSheet.languageTitle : uiText.accountSheet.title}
        onClose={closeAccountSheet}
      >
        {accountSheetTab === 'menu' ? (
          <>
            <Button
              label={isAuthenticated ? 'الحساب' : 'تسجيل الدخول'}
              tone="secondary"
              onPress={() => {
                closeAccountSheet();
                setRoute(isAuthenticated ? 'account' : 'login');
              }}
            />
            <Button
              label="الدعم"
              tone="secondary"
              onPress={() => {
                closeAccountSheet();
                setRoute('support');
              }}
            />
            <Button
              label="الإعدادات"
              tone="primary"
              onPress={() => {
                closeAccountSheet();
                setRoute('settings');
              }}
            />
          </>
        ) : (
          <>
            <Text role="bodySm" tone="muted">{uiText.accountSheet.languagePrompt}</Text>
            <Box layoutDirection="row" gap={2}>
              <Button
                label={uiText.accountSheet.languageArabic}
                tone={language === 'ar' ? 'primary' : 'secondary'}
                fullWidth={false}
                style={{ flex: 1 }}
                onPress={() => {
                  setLanguage('ar');
                }}
              />
              <Button
                label={uiText.accountSheet.languageEnglish}
                tone={language === 'en' ? 'primary' : 'secondary'}
                fullWidth={false}
                style={{ flex: 1 }}
                onPress={() => {
                  setLanguage('en');
                }}
              />
            </Box>
            <Button label={uiText.accountSheet.back} tone="ghost" onPress={() => setAccountSheetTab('menu')} />
          </>
        )}
      </SheetFrame>
    </Box>
  );
}

export default ClientSurfaceHost;
