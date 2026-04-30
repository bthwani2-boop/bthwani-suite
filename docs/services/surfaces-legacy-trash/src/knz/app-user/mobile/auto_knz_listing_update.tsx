// Auto-generated screen for knz_listing_update
// Surface: app-client | Service: knz
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success
// Contract (Phase 0.2 خيار ب): الإرسال = entity_update(domain=KNZ, entityType=listing, entityId). استبدال المحاكاة عند توفر @bthwani/api-clients.

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KNZ_LISTING_TYPES } from '../../shared/knz-constants';
import { buildKnzListingUpdateMock } from '../../hooks';

const NS = 'knz.app-client.mobile.auto_knz_listing_update';
const NS_COMMON = 'knz.app-client.mobile.common';

interface auto_knz_listing_updateProps {
  listingId?: string;
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void; goBack?: () => void };
}

export const auto_knz_listing_update: React.FC<auto_knz_listing_updateProps> = ({
  listingId,
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const listingTypeLabels = useMemo(() => ({
    sale: t(`${NS_COMMON}.listingTypeSale`),
    rent: t(`${NS_COMMON}.listingTypeRent`),
    service: t(`${NS_COMMON}.listingTypeService`),
    wanted: t(`${NS_COMMON}.listingTypeWanted`),
  }), [t]);
  const [state, setState] = useState<ScreenState>('content');

  const handleNavigate = (screen: string, params?: Record<string, string>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('3800');
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState<string>('sale');
  const [deliveryAvailableFromSeller, setDeliveryAvailableFromSeller] = useState(true);

  const handleUpdateListing = () => {
    if (!title || !price || !description) {
      setState('error');
      return;
    }

    setState('loading');
    setTimeout(() => {
      // Simulate update success (80% success rate)
      const mockSuccess = 0 > 0.2;
      setState(mockSuccess ? 'success' : 'error');
    }, 2500);
  };

  const handleRetry = () => {
    setState('content');
  };

  const mockListing = useMemo(() => buildKnzListingUpdateMock(t), [t]);

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{t(`${NS}.pageTitle`)}</Text>
          <Text style={styles.listingId}>{mockListing.id}</Text>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>{t(`${NS}.statsTitle`)}</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockListing.stats.views}</Text>
                <Text style={styles.statLabel}>{t(`${NS}.views`)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockListing.stats.favorites}</Text>
                <Text style={styles.statLabel}>{t(`${NS}.favorites`)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockListing.stats.inquiries}</Text>
                <Text style={styles.statLabel}>{t(`${NS}.inquiries`)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`${NS}.sectionBasicInfo`)}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelTitle`)}</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={t(`${NS}.placeholderTitle`)}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelPrice`)}</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder={t(`${NS}.placeholderPrice`)}
                keyboardType="numeric"
                maxLength={8}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelListingType`)}</Text>
              <View style={styles.listingTypeRow}>
                {KNZ_LISTING_TYPES.map((ty) => (
                  <TouchableOpacity
                    key={ty.code}
                    style={[styles.listingTypeChip, listingType === ty.code && styles.listingTypeChipSelected]}
                    onPress={() => setListingType(ty.code)}
                  >
                    <Text style={[styles.listingTypeChipText, listingType === ty.code && styles.listingTypeChipTextSelected]}>{listingTypeLabels[ty.code]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`${NS}.sectionDelivery`)}</Text>
            <TouchableOpacity
              style={[styles.deliveryToggle, deliveryAvailableFromSeller && styles.deliveryToggleOn]}
              onPress={() => setDeliveryAvailableFromSeller((v) => !v)}
            >
              <Text style={[styles.deliveryToggleText, deliveryAvailableFromSeller && styles.deliveryToggleTextOn]}>
                {deliveryAvailableFromSeller ? t(`${NS}.deliveryOn`) : t(`${NS}.deliveryOptional`)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.deliveryHint}>{t(`${NS}.deliveryHint`)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`${NS}.sectionDetails`)}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t(`${NS}.inputLabelDescription`)}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder={t(`${NS}.placeholderDescription`)}
                multiline
                numberOfLines={6}
                maxLength={1000}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.currentInfoCard}>
            <Text style={styles.sectionTitle}>{t(`${NS}.sectionCurrentInfo`)}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t(`${NS}.categoryLabel`)}</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{mockListing.currentData.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t(`${NS}.conditionLabel`)}</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{mockListing.currentData.condition === 'used' ? t(`${NS}.used`) : t(`${NS}.new`)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t(`${NS}.locationLabel`)}</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{mockListing.currentData.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t(`${NS}.listingTypeLabel`)}</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{listingTypeLabels[listingType as keyof typeof listingTypeLabels] ?? listingType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t(`${NS}.deliveryFromSellerLabel`)}</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{deliveryAvailableFromSeller ? t(`${NS}.available`) : t(`${NS}.unavailable`)}</Text>
            </View>
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>{t(`${NS}.sectionPhotos`)}</Text>
            <Text style={styles.photoNote}>{t(`${NS}.photoNote`)}</Text>
            <TouchableOpacity style={styles.photoButton}>
              <Text style={styles.photoButtonText}>{t(`${NS}.managePhotos`)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.warningBanner}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>{t(`${NS}.warningText`)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.updateButton, (!title || !price || !description) && styles.disabledButton]}
            onPress={handleUpdateListing}
            disabled={!title || !price || !description}
          >
            <Text style={[styles.updateText, (!title || !price || !description) && styles.disabledText]}>
              {t(`${NS}.saveButton`)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => { if (navigation?.goBack) navigation.goBack(); else handleNavigate('KnzListingsList'); }}>
            <Text style={styles.cancelText}>{t(`${NS}.cancelButton`)}</Text>
          </TouchableOpacity>
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
      onSuccessAction={() => {
        if (listingId) handleNavigate('KnzListingGet', { listingId });
        else if (navigation?.goBack) navigation.goBack();
        else handleNavigate('KnzListingsList');
      }}
      screenName="auto_knz_listing_update"
      operationName="knz_listing_update"
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
  listingId: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  statsCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
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
    height: 120,
    textAlignVertical: 'top',
  },
  currentInfoCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  infoValue: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
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
  listingTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
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
  listingTypeChipText: { fontSize: 14, color: semanticRoles.text },
  listingTypeChipTextSelected: { color: semanticRoles.primaryCTA, fontWeight: '600' },
  deliveryHint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  photoSection: {
    padding: BTHWANI_SPACING.contentH,
  },
  photoNote: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
    lineHeight: 20,
  },
  photoButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  photoButtonText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  warningBanner: {
    backgroundColor: semanticRoles.warning + '20',
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: semanticRoles.warning,
  },
  warningIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
    lineHeight: 20,
  },
  updateButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: semanticRoles.textMuted,
  },
  updateText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: semanticRoles.surface,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  cancelText: {
    color: semanticRoles.primaryCTA,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_knz_listing_update;

