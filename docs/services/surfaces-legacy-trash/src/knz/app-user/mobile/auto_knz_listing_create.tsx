// Auto-generated screen for knz_listing_create
// Surface: app-client | Service: knz
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KNZ_CATEGORIES, KNZ_YEMEN_CITIES, KNZ_LISTING_TYPES } from '../../shared/knz-constants';
import { rawFetch } from '@bthwani/api-clients';

const NS = 'knz.app-client.mobile.auto_knz_listing_create';
const NS_COMMON = 'knz.app-client.mobile.common';
const CITY_KEYS = ['citySanaa', 'cityAden', 'cityTaiz', 'cityIbb', 'cityHodeidah', 'cityDhamar', 'cityMukalla', 'citySeiyun', 'cityAmran', 'cityAlBayda', 'cityAlJawf', 'cityAlMahwit', 'cityHajjah', 'cityMarib', 'cityRaymah', 'citySaada', 'cityAbyan', 'cityAlDalea', 'cityAlMahra', 'cityHadramout', 'citySocotra', 'cityLahj', 'cityShabwa'] as const;

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

interface auto_knz_listing_createProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void; goBack?: () => void };
}

export const auto_knz_listing_create: React.FC<auto_knz_listing_createProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const listingTypeLabels = useMemo(() => ({
    sale: t(`${NS_COMMON}.listingTypeSale`),
    rent: t(`${NS_COMMON}.listingTypeRent`),
    service: t(`${NS_COMMON}.listingTypeService`),
    wanted: t(`${NS_COMMON}.listingTypeWanted`),
  }), [t]);
  const categoryLabels = useMemo(() => ({
    vehicles: t(`${NS_COMMON}.categoryVehicles`),
    real_estate: t(`${NS_COMMON}.categoryRealEstate`),
    services: t(`${NS_COMMON}.categoryServices`),
    home_garden: t(`${NS_COMMON}.categoryHomeGarden`),
    electronics: t(`${NS_COMMON}.categoryElectronics`),
    jobs: t(`${NS_COMMON}.categoryJobs`),
    family_kids: t(`${NS_COMMON}.categoryFamilyKids`),
    sports: t(`${NS_COMMON}.categorySports`),
    animals: t(`${NS_COMMON}.categoryAnimals`),
    numbers_plates: t(`${NS_COMMON}.categoryNumbersPlates`),
    travel: t(`${NS_COMMON}.categoryTravel`),
    other: t(`${NS_COMMON}.categoryOther`),
  }), [t]);
  const cityLabels = useMemo(() => CITY_KEYS.map((k) => t(`${NS_COMMON}.${k}`)), [t]);
  const [state, setState] = useState<ScreenState>('content');
  const [mode, setMode] = useState<'quick' | 'full'>('quick');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [listingType, setListingType] = useState<string>('sale');
  const [deliveryAvailableFromSeller, setDeliveryAvailableFromSeller] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [preferredContactChannel, setPreferredContactChannel] = useState<'chat' | 'call' | 'whatsapp'>('chat');

  const loadAccountContactDefaults = useCallback(async () => {
    try {
      const baseUrl = getBaseUrl();
      const res = await rawFetch(`${baseUrl}/api/knz/accounts/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) return;
      const json = await res.json();
      const account = json?.data?.account;
      if (!account) return;
      if (typeof account.primaryPhone === 'string' && !contactPhone) {
        setContactPhone(account.primaryPhone);
      }
      if (typeof account.whatsappNumber === 'string' && !whatsappNumber) {
        setWhatsappNumber(account.whatsappNumber);
      }
      if (typeof account.preferredContactChannel === 'string') {
        if (
          account.preferredContactChannel === 'chat' ||
          account.preferredContactChannel === 'call' ||
          account.preferredContactChannel === 'whatsapp'
        ) {
          setPreferredContactChannel(account.preferredContactChannel);
        }
      }
    } catch {
      // في بيئة التطوير قد لا يتوفر userId بعد؛ نتجاهل الخطأ بهدوء
    }
  }, [contactPhone, whatsappNumber]);

  useEffect(() => {
    void loadAccountContactDefaults();
  }, [loadAccountContactDefaults]);

  const handleSubmitListing = () => {
    const hasBaseFields = title && price && category && location;
    const needsDescription = mode === 'full';

    if (!hasBaseFields || (needsDescription && !description)) {
      setState('error');
      return;
    }

    setState('loading');
    // مبدئياً، نُبقي الإرسال محاكاة كما هو، مع تضمين بيانات التواصل في الـ payload لاحقاً عند ربط API فعلي
    setTimeout(() => {
      const mockSuccess = 0 > 0.2;
      setState(mockSuccess ? 'success' : 'error');
    }, 3000);
  };

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const handleRetry = () => setState('content');

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{t(`${NS}.pageTitle`)}</Text>
          <Text style={styles.subtitle}>{t(`${NS}.subtitle`)}</Text>

          <View style={[styles.modeRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity
              style={[styles.modeChip, mode === 'quick' && styles.modeChipSelected]}
              onPress={() => setMode('quick')}
            >
              <Text style={[styles.modeChipText, mode === 'quick' && styles.modeChipTextSelected]}>
                {t(`${NS}.modeQuick`)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeChip, mode === 'full' && styles.modeChipSelected]}
              onPress={() => setMode('full')}
            >
              <Text style={[styles.modeChipText, mode === 'full' && styles.modeChipTextSelected]}>
                {t(`${NS}.modeFull`)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {mode === 'quick' ? t(`${NS}.sectionTitleQuick`) : t(`${NS}.sectionTitleBasic`)}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelTitle`)}</Text>
              <TextInput
                style={styles.input}
                placeholder={t(`${NS}.titlePlaceholder`)}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            {mode === 'full' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t(`${NS}.inputLabelDescription`)}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t(`${NS}.descriptionPlaceholder`)}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />
                <TouchableOpacity
                  style={styles.templateButton}
                  onPress={() =>
                    setDescription(
                      description ||
                        `• ${listingType === 'sale' ? t(`${NS_COMMON}.conditionUsed`) : t(`${NS_COMMON}.conditionNew`)}\n• ...`,
                    )
                  }
                >
                  <Text style={styles.templateButtonText}>{t(`${NS}.templateButtonText`)}</Text>
                </TouchableOpacity>
                <Text style={styles.inputHint}>{t(`${NS}.descriptionHint`)}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`${NS}.sectionContact`)}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelPhone`)}</Text>
              <TextInput
                style={styles.input}
                placeholder={t(`${NS}.phonePlaceholder`)}
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
              />
              <Text style={styles.inputHint}>{t(`${NS}.phoneHint`)}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelWhatsapp`)}</Text>
              <TextInput
                style={styles.input}
                placeholder={t(`${NS}.phonePlaceholder`)}
                value={whatsappNumber}
                onChangeText={setWhatsappNumber}
                keyboardType="phone-pad"
              />
              <Text style={styles.inputHint}>{t(`${NS}.whatsappHint`)}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelContactChannel`)}</Text>
              <View style={[styles.contactChannelRow, { flexDirection: 'row', direction: layoutDirection }]}>
                {(['chat', 'call', 'whatsapp'] as const).map((channel) => (
                  <TouchableOpacity
                    key={channel}
                    style={[
                      styles.contactChannelChip,
                      preferredContactChannel === channel && styles.contactChannelChipSelected,
                    ]}
                    onPress={() => setPreferredContactChannel(channel)}
                  >
                    <Text
                      style={[
                        styles.contactChannelChipText,
                        preferredContactChannel === channel && styles.contactChannelChipTextSelected,
                      ]}
                    >
                      {channel === 'chat' ? t(`${NS}.contactChat`) : channel === 'call' ? t(`${NS}.contactCall`) : t(`${NS}.contactWhatsapp`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.inputHint}>{t(`${NS}.contactChannelHint`)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`${NS}.sectionDetails`)}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelPrice`)}</Text>
              <TextInput
                style={styles.input}
                placeholder={t(`${NS}.enterPrice`)}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelListingType`)}</Text>
              <View style={[styles.listingTypeRow, { flexDirection: 'row', direction: layoutDirection }]}>
                {KNZ_LISTING_TYPES.map((ty) => (
                  <TouchableOpacity
                    key={ty.code}
                    style={[
                      styles.listingTypeChip,
                      listingType === ty.code && styles.listingTypeChipSelected,
                    ]}
                    onPress={() => setListingType(ty.code)}
                  >
                    <Text
                      style={[
                        styles.listingTypeChipText,
                        listingType === ty.code && styles.listingTypeChipTextSelected,
                      ]}
                    >
                      {listingTypeLabels[ty.code]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelDelivery`)}</Text>
              <TouchableOpacity
                style={[styles.deliveryToggle, deliveryAvailableFromSeller && styles.deliveryToggleOn]}
                onPress={() => setDeliveryAvailableFromSeller((v) => !v)}
              >
                <Text
                  style={[
                    styles.deliveryToggleText,
                    deliveryAvailableFromSeller && styles.deliveryToggleTextOn,
                  ]}
                >
                  {deliveryAvailableFromSeller ? t(`${NS}.deliveryOn`) : t(`${NS}.deliveryOptional`)}
                </Text>
              </TouchableOpacity>
              <Text style={styles.deliveryHint}>{t(`${NS}.deliveryHint`)}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelCity`)}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityScroll}>
                {KNZ_YEMEN_CITIES.map((city, i) => (
                  <TouchableOpacity
                    key={city}
                    style={[styles.cityChip, location === city && styles.selectedCityChip]}
                    onPress={() => setLocation(city)}
                  >
                    <Text style={[styles.cityChipText, location === city && styles.selectedCityChipText]}>{cityLabels[i]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {location ? <Text style={styles.inputHint}>{t(`${NS}.selectedLabel`)} {cityLabels[KNZ_YEMEN_CITIES.indexOf(location)] ?? location}</Text> : null}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`${NS}.sectionCategory`)}</Text>
            <View style={[styles.categoriesGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              {KNZ_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.code}
                  style={[
                    styles.categoryCard,
                    category === cat.code && styles.selectedCategory
                  ]}
                  onPress={() => setCategory(cat.code)}
                >
                  <Text style={[
                    styles.categoryLabel,
                    category === cat.code && styles.selectedCategoryLabel
                  ]}>
                    {categoryLabels[cat.code]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {mode === 'full' && (
            <View style={styles.photoSection}>
              <Text style={styles.sectionTitle}>{t(`${NS}.sectionPhotos`)}</Text>
              <TouchableOpacity style={styles.photoUpload}>
                <Text style={styles.photoIcon}>📷</Text>
                <Text style={styles.photoText}>{t(`${NS}.photoTapToAdd`)}</Text>
                <Text style={styles.photoSubtext}>{t(`${NS}.photoSubtext`)}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.termsBanner, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.termsIcon}>⚖️</Text>
            <Text style={styles.termsText}>{t(`${NS}.termsText`)}</Text>
          </View>

          {mode === 'quick' && (
            <Text style={styles.helperNote}>{t(`${NS}.helperNoteQuick`)}</Text>
          )}

          {mode === 'full' && (
            <Text style={styles.helperNote}>{t(`${NS}.helperNoteFull`)}</Text>
          )}

          {(() => {
            const hasBase = title && price && category && location;
            const needsDescription = mode === 'full';
            const isValid = hasBase && (!needsDescription || !!description);

            return (
              <TouchableOpacity
                style={[styles.submitButton, !isValid && styles.disabledButton]}
                onPress={handleSubmitListing}
                disabled={!isValid}
              >
                <Text style={[styles.submitText, !isValid && styles.disabledText]}>
                  {mode === 'quick' ? t(`${NS}.submitQuick`) : t(`${NS}.submitFull`)}
                </Text>
              </TouchableOpacity>
            );
          })()}
          {deliveryAvailableFromSeller && (
            <Text style={styles.deliverySubmitNote}>{t(`${NS}.deliverySubmitNote`)}</Text>
          )}
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(`${NS}.loadingMessage`)}
      errorMessage={t(`${NS}.errorMessage`)}
      onErrorAction={handleRetry}
      successMessage={t(`${NS}.successMessage`)}
      successActionText={t(`${NS}.successActionText`)}
      onSuccessAction={() => handleNavigate('KnzListingsList')}
      screenName="auto_knz_listing_create"
      operationName="knz_listing_create"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  modeChip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  modeChipSelected: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  modeChipText: {
    fontSize: 13,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  modeChipTextSelected: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontWeight: '700',
  },
  section: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.xs,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  selectedCategory: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '15',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  selectedCategoryLabel: {
    color: semanticRoles.primaryCTA,
  },
  listingTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  listingTypeChip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  listingTypeChipSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '15',
  },
  listingTypeChipText: {
    fontSize: 14,
    color: semanticRoles.text,
  },
  listingTypeChipTextSelected: {
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  cityScroll: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  cityChip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    marginEnd: BTHWANI_SPACING.sm,
  },
  selectedCityChip: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '15',
  },
  cityChipText: {
    fontSize: 14,
    color: semanticRoles.text,
  },
  selectedCityChipText: {
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  inputHint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  photoSection: {
    padding: BTHWANI_SPACING.contentH,
  },
  photoUpload: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: semanticRoles.border,
  },
  photoIcon: {
    fontSize: 40,
    marginBottom: BTHWANI_SPACING.sm,
    color: semanticRoles.textMuted,
  },
  photoText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  photoSubtext: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  termsBanner: {
    backgroundColor: semanticRoles.warning + '20',
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: semanticRoles.warning,
  },
  termsIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  deliveryToggle: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    marginBottom: BTHWANI_SPACING.sm,
  },
  deliveryToggleOn: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '15',
  },
  deliveryToggleText: {
    fontSize: 15,
    color: semanticRoles.text,
  },
  deliveryToggleTextOn: {
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  deliveryHint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  deliverySubmitNote: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginTop: BTHWANI_SPACING.sm,
    marginHorizontal: BTHWANI_SPACING.contentH,
  },
  helperNote: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.sm,
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: semanticRoles.textMuted,
  },
  submitText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: semanticRoles.surface,
  },
  templateButton: {
    marginTop: BTHWANI_SPACING.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  templateButtonText: {
    fontSize: 12,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  contactChannelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  contactChannelChip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  contactChannelChipSelected: {
    backgroundColor: semanticRoles.primaryCTA + '15',
    borderColor: semanticRoles.primaryCTA,
  },
  contactChannelChipText: {
    fontSize: 13,
    color: semanticRoles.text,
  },
  contactChannelChipTextSelected: {
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
});

export default auto_knz_listing_create;

