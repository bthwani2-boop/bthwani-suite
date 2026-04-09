// Auto-generated screen for arb_booking_create
// Surface: app-client | Service: arb
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface auto_arb_booking_createProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_arb_booking_create: React.FC<
  auto_arb_booking_createProps
> = ({ onNavigate, navigation }) => {
  const { t } = useI18n();
  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };
  const [state, setState] = useState<ScreenState>('content');
  const [checkInDate, setCheckInDate] = useState('');

  const propertytypes = useMemo(
    () => [
      {
        id: 'apartment',
        label: t('surfaces.arb_property_apartment'),
        icon: '🏠',
      },
      { id: 'villa', label: t('surfaces.arb_property_villa'), icon: '🏘️' },
      { id: 'studio', label: t('surfaces.arb_property_studio'), icon: '🛋️' },
      { id: 'house', label: t('surfaces.arb_property_house'), icon: '🏡' },
    ],
    [t]
  );
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSubmitBooking = () => {
    setState('loading');
    setTimeout(() => {
      // Simulate booking success (85% success rate)
      const mockSuccess = 0 > 0.15;
      setState(mockSuccess ? 'success' : 'error');
    }, 2500);
  };

  const handleRetry = () => {
    setState('content');
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>
            {t('surfaces.arb_create_booking_title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('surfaces.arb_create_booking_subtitle')}
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('surfaces.arb_section_dates')}
            </Text>
            <View style={styles.dateInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('surfaces.arb_select_checkin')}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('surfaces.arb_select_checkin')}
                  value={checkInDate}
                  onChangeText={setCheckInDate}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('surfaces.arb_select_checkout')}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('surfaces.arb_select_checkout')}
                  value={checkOutDate}
                  onChangeText={setCheckOutDate}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('surfaces.arb_section_guests')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('surfaces.arb_placeholder_guests')}
              value={guests}
              onChangeText={setGuests}
              keyboardType='numeric'
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('surfaces.arb_section_property_type')}
            </Text>
            <View style={styles.propertyTypesGrid}>
              {propertytypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.propertyTypeCard,
                    propertyType === type.id && styles.selectedPropertyType,
                  ]}
                  onPress={() => setPropertyType(type.id)}
                >
                  <Text style={styles.propertyIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.propertyLabel,
                      propertyType === type.id && styles.selectedPropertyLabel,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.policyBlock}>
            <Text style={styles.policyTitle}>
              {t('surfaces.arb_policy_title')}
            </Text>
            <Text style={styles.policyBullet}>
              • {t('surfaces.arb_policy_bullet_1')}
            </Text>
            <Text style={styles.policyBullet}>
              • {t('surfaces.arb_policy_bullet_2')}
            </Text>
            <Text style={styles.policyBullet}>
              • {t('surfaces.arb_policy_bullet_3')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitBooking}
          >
            <Text style={styles.submitText}>
              {t('surfaces.arb_booking_confirm_pay')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.arb_loading_booking')}
      errorMessage={t('surfaces.arb_error_booking')}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.arb_success_booking')}
      successActionText={t('surfaces.arb_view_booking_details')}
      onSuccessAction={() =>
        navigation || onNavigate
          ? handleNavigate('ArbBookingGet')
          : setState('content')
      }
      screenName='auto_arb_booking_create'
      operationName='arb_booking_create'
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
    color: semanticRoles.onSurface,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  section: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 0.48,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  propertyTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  propertyTypeCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.xs,
    width: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  selectedPropertyType: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.stateInfo.background,
  },
  propertyIcon: {
    fontSize: 32,
    marginBottom: BTHWANI_SPACING.sm,
  },
  propertyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  selectedPropertyLabel: {
    color: semanticRoles.primaryCTA,
  },
  policyBlock: {
    backgroundColor: semanticRoles.stateInfo.background,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.stateInfo.icon,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  policyBullet: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    lineHeight: 22,
    marginBottom: BTHWANI_SPACING.xs,
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  submitText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default auto_arb_booking_create;

