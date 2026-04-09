// HomeScreen - §86 SSoT Home Screen Component
// §30 Tokens-only; Unified Simple Design
// §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Unified Design

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { ServiceIcon } from '../components/ServiceIcon';
import {
  BTHWANI_COLORS,
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  Loading,
  semanticRoles,
  useDirection,
  useFeatureFlag,
} from '@bthwani/ui-kit';

import {
  AnimatedCard,
  LoadingSkeletonCard,
} from '../components/MicroInteractions';
import { rawFetch } from '@bthwani/api-clients';
import {
  getOrderedServices,
  trackServiceUsage,
} from '@bthwani/states/preferences';

const NS = 'mobile.app-user.HomeScreen';

interface HomeScreenProps {
  navigation?: any; // React Navigation
  onNavigate?: (screen: string) => void;
}

interface ServiceConfig {
  key: string; // Service key (DSH, KNZ, etc.)
  title: string;
  description: string;
  screen: string;
  category?: string;
}

// Default service order (by usage frequency)
// Note: USER (Profile) is excluded - available via BottomNavigationBar
const DEFAULT_ORDER = [
  'DSH',
  'KNZ',
  'ARB',
  'AMN',
  'KWD',
  'MRF',
  'ESF',
  'SND',
  'WLT',
];

const SERVICE_ICONS: Record<string, string> = {
  DSH: 'service-food',
  KNZ: 'service-market',
  ARB: 'service-contract',
  AMN: 'service-shield',
  KWD: 'service-briefcase',
  MRF: 'service-report',
  ESF: 'service-people',
  SND: 'service-support',
  WLT: 'service-wallet',
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  onNavigate,
}) => {
  const {
    t,
    alignItemsStartStyle,
    rowStyle,
    textAlignStartStyle,
    resolveGridVisualOrder,
    resolveMobileHomePresentation,
    resolveMobileReadingLayout,
  } = useDirection();
  const { width } = useWindowDimensions();
  const readingLayout = resolveMobileReadingLayout(width);
  const homePresentation = resolveMobileHomePresentation();
  const isStackedSectionHeader =
    readingLayout.sectionHeaderLayout === 'stacked';
  const isSectionHeaderTitleFirst =
    homePresentation.sectionHeaderChildrenOrder === 'title-first';

  const ALL_SERVICES: ServiceConfig[] = useMemo(
    () => [
      {
        key: 'DSH',
        title: t(`${NS}.DSH_title`),
        description: t(`${NS}.DSH_description`),
        screen: 'DshHome',
        category: t(`${NS}.DSH_category`),
      },
      {
        key: 'KNZ',
        title: t(`${NS}.KNZ_title`),
        description: t(`${NS}.KNZ_description`),
        screen: 'KnzHome',
        category: t(`${NS}.KNZ_category`),
      },
      {
        key: 'ARB',
        title: t(`${NS}.ARB_title`),
        description: t(`${NS}.ARB_description`),
        screen: 'ArbHome',
        category: t(`${NS}.ARB_category`),
      },
      {
        key: 'AMN',
        title: t(`${NS}.AMN_title`),
        description: t(`${NS}.AMN_description`),
        screen: 'AmnHome',
        category: t(`${NS}.AMN_category`),
      },
      {
        key: 'KWD',
        title: t(`${NS}.KWD_title`),
        description: t(`${NS}.KWD_description`),
        screen: 'KwdHome',
        category: t(`${NS}.KWD_category`),
      },
      {
        key: 'MRF',
        title: t(`${NS}.MRF_title`),
        description: t(`${NS}.MRF_description`),
        screen: 'MrfHome',
        category: t(`${NS}.MRF_category`),
      },
      {
        key: 'ESF',
        title: t(`${NS}.ESF_title`),
        description: t(`${NS}.ESF_description`),
        screen: 'EsfHome',
        category: t(`${NS}.ESF_category`),
      },
      {
        key: 'SND',
        title: t(`${NS}.SND_title`),
        description: t(`${NS}.SND_description`),
        screen: 'SndHome',
        category: t(`${NS}.SND_category`),
      },
      {
        key: 'WLT',
        title: t(`${NS}.WLT_title`),
        description: t(`${NS}.WLT_description`),
        screen: 'WltHome',
        category: t(`${NS}.WLT_category`),
      },
    ],
    [t]
  );
  const isNewSurfaceEnabled = useFeatureFlag('user-mobile-surface-v1');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderedServiceKeys, setOrderedServiceKeys] =
    useState<string[]>(DEFAULT_ORDER);
  const [loading, setLoading] = useState(true);
  // Service flags - check which services are enabled (RULE_OPERATIONAL_EXCELLENCE §4.4.2.2)
  const [serviceFlags, setServiceFlags] = useState<Record<string, boolean>>({});
  const [serviceFlagsLoading, setServiceFlagsLoading] = useState(true);

  // Load service flags (RULE_OPERATIONAL_EXCELLENCE §4.4.2.2)
  useEffect(() => {
    const loadServiceFlags = async () => {
      try {
        let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(
          /\/+$/,
          ''
        );
        if (baseUrl.endsWith('/api')) {
          baseUrl = baseUrl.slice(0, -4);
        }

        const url = `${baseUrl}/config/service-flags`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await rawFetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const flags: Record<string, boolean> = {};

            // Parse service flags response
            if (data?.services) {
              Object.keys(data.services).forEach(serviceKey => {
                const service = data.services[serviceKey];
                flags[serviceKey.toUpperCase()] = service?.enabled ?? true;
              });
            }

            setServiceFlags(flags);
          } else {
            // Default to all enabled on error
            const defaultFlags: Record<string, boolean> = {};
            ALL_SERVICES.forEach(s => {
              defaultFlags[s.key] = true;
            });
            setServiceFlags(defaultFlags);
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          // Default to all enabled on error
          const defaultFlags: Record<string, boolean> = {};
          ALL_SERVICES.forEach(s => {
            defaultFlags[s.key] = true;
          });
          setServiceFlags(defaultFlags);
        }
      } catch (error) {
        // Default to all enabled on error
        const defaultFlags: Record<string, boolean> = {};
        ALL_SERVICES.forEach(s => {
          defaultFlags[s.key] = true;
        });
        setServiceFlags(defaultFlags);
      } finally {
        setServiceFlagsLoading(false);
      }
    };

    loadServiceFlags();

    // Refresh service flags every 60 seconds (TTL)
    const interval = setInterval(() => {
      loadServiceFlags();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Load ordered services and favorites
  useEffect(() => {
    const loadServices = async () => {
      try {
        const allKeys = ALL_SERVICES.map(s => s.key);
        const ordered = await getOrderedServices(allKeys, DEFAULT_ORDER);

        setOrderedServiceKeys(ordered);
      } catch (error) {
        setOrderedServiceKeys(DEFAULT_ORDER);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleNavigate = useCallback(
    async (service: ServiceConfig) => {
      // Track service usage
      await trackServiceUsage(service.key);

      // Navigate
      if (navigation) {
        navigation.navigate(service.screen);
      } else if (onNavigate) {
        onNavigate(service.screen);
      }
    },
    [navigation, onNavigate]
  );

  // Get filtered and ordered services
  const getDisplayServices = useCallback(() => {
    let services = orderedServiceKeys
      .map(key => ALL_SERVICES.find(s => s.key === key))
      .filter((s): s is ServiceConfig => s !== undefined);

    // Filter out disabled services (RULE_OPERATIONAL_EXCELLENCE §4.4.2.2)
    if (!serviceFlagsLoading && Object.keys(serviceFlags).length > 0) {
      services = services.filter(service => {
        const isEnabled = serviceFlags[service.key] ?? true; // Default to enabled if not found
        return isEnabled;
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      services = services.filter(
        service =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.category?.toLowerCase().includes(query)
      );
    }

    return services;
  }, [orderedServiceKeys, searchQuery, serviceFlags, serviceFlagsLoading]);

  const allDisplayServices = getDisplayServices();
  const hasSearchQuery = searchQuery.trim().length > 0;
  const displayServices = allDisplayServices;
  const orderedDisplayServices = useMemo(
    () => resolveGridVisualOrder(displayServices, readingLayout.gridColumns),
    [displayServices, readingLayout.gridColumns, resolveGridVisualOrder]
  );

  if (!isNewSurfaceEnabled) {
    return (
      <View style={styles.container}>
        <View style={styles.statusCard}>
          <ServiceIcon
            name='construction'
            size={48}
            color={semanticRoles.primaryCTA}
          />
          <Text style={styles.title}>{t(`${NS}.underDevTitle`)}</Text>
          <Text style={styles.subtitle}>{t(`${NS}.underDevSubtitle`)}</Text>
          <Text style={styles.description}>
            {t(`${NS}.underDevDescription`)}
          </Text>
          <Text style={styles.progress}>
            ✅ {t(`${NS}.underDevProgress1`)}
            {'\n'}✅ {t(`${NS}.underDevProgress2`)}
            {'\n'}✅ {t(`${NS}.underDevProgress3`)}
            {'\n'}
            🔄 {t(`${NS}.underDevProgress4`)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.headerIntroCard, alignItemsStartStyle]}>
          <Text style={[styles.welcomeTitle, textAlignStartStyle]}>
            {t(`${NS}.welcomeTitle`)}
          </Text>
          <Text style={[styles.welcomeSubtitle, textAlignStartStyle]}>
            {t(`${NS}.welcomeSubtitle`)}
          </Text>
        </View>

        {homePresentation.inlineSearchVisible ? (
          <View style={[styles.searchContainer, rowStyle]}>
            <ServiceIcon
              name='search-icon'
              size={20}
              color={semanticRoles.textMuted}
            />
            <View style={styles.searchIconSpacer} />
          </View>
        ) : null}
      </View>

      <View style={styles.servicesSection}>
        <View
          style={[
            styles.sectionHeader,
            rowStyle,
            styles.layoutNeutral,
            isStackedSectionHeader ? styles.sectionHeaderStacked : null,
          ]}
        >
          {isSectionHeaderTitleFirst ? (
            <View style={styles.sectionTextBlock}>
              <Text style={[styles.sectionTitle, textAlignStartStyle]}>
                {hasSearchQuery
                  ? t(`${NS}.searchResultsLabel`)
                  : t(`${NS}.servicesSectionTitle`)}
              </Text>
              {hasSearchQuery ? (
                <Text style={[styles.sectionHint, textAlignStartStyle]}>
                  {t(`${NS}.searchResultsHint`)}
                </Text>
              ) : null}
            </View>
          ) : (
            <View style={styles.sectionCountPill}>
              <Text style={styles.sectionCountText}>
                {t(`${NS}.resultsCount`, { count: displayServices.length })}
              </Text>
            </View>
          )}
          {isSectionHeaderTitleFirst ? (
            <View style={styles.sectionCountPill}>
              <Text style={styles.sectionCountText}>
                {t(`${NS}.resultsCount`, { count: displayServices.length })}
              </Text>
            </View>
          ) : (
            <View style={styles.sectionTextBlock}>
              <Text style={[styles.sectionTitle, textAlignStartStyle]}>
                {hasSearchQuery
                  ? t(`${NS}.searchResultsLabel`)
                  : t(`${NS}.servicesSectionTitle`)}
              </Text>
              {hasSearchQuery ? (
                <Text style={[styles.sectionHint, textAlignStartStyle]}>
                  {t(`${NS}.searchResultsHint`)}
                </Text>
              ) : null}
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingSkeletonCard key={index} lines={2} showAvatar={true} />
            ))}
          </View>
        ) : displayServices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              {t(`${NS}.noServicesMatchSearch`)}
            </Text>
            <Text style={styles.emptyHint}>{t(`${NS}.noServicesHint`)}</Text>
            <TouchableOpacity
              style={styles.emptyAction}
              onPress={() => setSearchQuery('')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyActionText}>
                {t(`${NS}.clearSearch`)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.servicesList, styles.layoutNeutral]}>
            {orderedDisplayServices.map(service => {
              const primaryColor = semanticRoles.primaryCTA;
              const iconName = SERVICE_ICONS[service.key] ?? 'service-generic';

              return (
                <AnimatedCard
                  key={service.key}
                  style={[
                    styles.serviceItem,
                    { width: `${readingLayout.gridItemWidthPercent}%` },
                  ]}
                  onPress={() => handleNavigate(service)}
                >
                  <View style={[styles.serviceCard]}>
                    <View style={[styles.serviceIconRow, alignItemsStartStyle]}>
                      <View
                        style={[
                          styles.serviceIconContainer,
                          {
                            backgroundColor: BTHWANI_COLORS.accentTint,
                          },
                        ]}
                      >
                        <View style={styles.serviceIconInner}>
                          <ServiceIcon
                            name={iconName}
                            size={24}
                            color={primaryColor}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.serviceTextBlock}>
                      <Text
                        style={[styles.serviceTitle, textAlignStartStyle]}
                        numberOfLines={2}
                      >
                        {service.title}
                      </Text>
                      <Text
                        style={[styles.serviceDescription, textAlignStartStyle]}
                        numberOfLines={1}
                      >
                        {service.description}
                      </Text>
                    </View>
                  </View>
                </AnimatedCard>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingTop: BTHWANI_SPACING.sm,
    paddingBottom: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.sm,
  },
  headerIntroCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.accentTint,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: semanticRoles.text,
    marginBottom: 4,
    alignSelf: 'stretch',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
    lineHeight: 20,
    alignSelf: 'stretch',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    minHeight: 52,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  searchIconSpacer: {
    width: BTHWANI_SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: semanticRoles.text,
    paddingVertical: BTHWANI_SPACING.xs,
  },
  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  servicesSection: {
    flex: 1,
    paddingTop: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  layoutNeutral: {
    direction: 'ltr',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.sm,
  },
  sectionHeaderStacked: {
    alignItems: 'stretch',
  },
  sectionTextBlock: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: semanticRoles.text,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    lineHeight: 18,
  },
  sectionCountPill: {
    backgroundColor: BTHWANI_COLORS.accentTint,
    borderRadius: 999,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.accentTint,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: semanticRoles.accentStrong,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
  },
  loadingText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: BTHWANI_SPACING.md,
  },
  emptyText: {
    fontSize: 16,
    color: semanticRoles.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  emptyHint: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyAction: {
    marginTop: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.accent,
    borderRadius: 999,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  emptyActionText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 13,
    fontWeight: '700',
  },
  servicesList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  serviceItem: {
    height: 118,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
    overflow: 'hidden',
  },
  serviceCard: {
    width: '100%',
    height: '100%',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
    justifyContent: 'flex-start',
  },
  serviceIconRow: {
    width: '100%',
    marginBottom: 6,
  },
  serviceTextBlock: {
    minWidth: 0,
    width: '100%',
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: semanticRoles.text,
    lineHeight: 18,
    alignSelf: 'stretch',
  },
  serviceDescription: {
    fontSize: 10,
    color: semanticRoles.textMuted,
    marginTop: 2,
    lineHeight: 13,
    alignSelf: 'stretch',
  },
  serviceIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.accentTint,
    marginBottom: 6,
  },
  serviceIconInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    margin: BTHWANI_SPACING.xl,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.xxl,
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
    lineHeight: 20,
  },
  progress: {
    fontSize: 12,
    color: semanticRoles.primaryCTA,
    textAlign: 'center',
    lineHeight: 18,
  },
});
