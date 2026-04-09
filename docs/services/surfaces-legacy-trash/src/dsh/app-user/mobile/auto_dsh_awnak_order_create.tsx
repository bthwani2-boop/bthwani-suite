// Awnak Manual Order Form – dsh_awnak_order_create
// Surface: app-client | Service: dsh
// Single vertical form for manual delivery requests.

import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenState, ScreenWrapper } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit/i18n';

type OrderType =
  | 'PERSONAL_ITEMS'
  | 'FOOD'
  | 'HEAVY_WEIGHT'
  | 'LARGE_SIZE'
  | 'CAKE'
  | 'FRAGILE'
  | 'OTHER';

interface AddressState {
  label: string;
}

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

interface PricingEstimate {
  priceEstimate: number;
  currency: string;
}

export const AwnakOrderCreateScreen: React.FC<Props> = ({ navigation, onNavigate }) => {
  const { t, isRTL } = useI18n();
  const [screenState, setScreenState] = useState<ScreenState>('loading');

  const [fromAddress, setFromAddress] = useState<AddressState | null>(null);
  const [toAddress, setToAddress] = useState<AddressState | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('PERSONAL_ITEMS');
  const [date, setDate] = useState('');
  const [time, setTime] = useState<'now' | 'scheduled'>('now');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');

  const [errorFrom, setErrorFrom] = useState<string | null>(null);
  const [errorTo, setErrorTo] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [errorSchedule, setErrorSchedule] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState<PricingEstimate | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setScreenState('content'), 300);
    return () => clearTimeout(timeout);
  }, []);

  const handlePickAddress = (kind: 'from' | 'to') => {
    const navigate = (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        navigation.navigate(screen, params ?? {});
      } else if (onNavigate) {
        onNavigate(screen, params ?? {});
      }
    };

    // For now just navigate to existing addresses list with a selection intent.
    navigate('UserAddressesList', {
      awnakSelectFor: kind,
    });
  };

  const validate = (): boolean => {
    setErrorFrom(null);
    setErrorTo(null);
    setErrorType(null);
    setErrorSchedule(null);

    let ok = true;

    if (!fromAddress) {
      setErrorFrom(
        t('dsh.app-client.mobile.auto_dsh_awnak_order_create.validationFromRequired')
      );
      ok = false;
    }

    if (!toAddress) {
      setErrorTo(
        t('dsh.app-client.mobile.auto_dsh_awnak_order_create.validationToRequired')
      );
      ok = false;
    }

    if (!orderType) {
      setErrorType(
        t('dsh.app-client.mobile.auto_dsh_awnak_order_create.validationTypeRequired')
      );
      ok = false;
    }

    if (time === 'scheduled') {
      if (!date || !scheduledTime) {
        setErrorSchedule(
          t('dsh.app-client.mobile.auto_dsh_awnak_order_create.validationScheduleRequired')
        );
        ok = false;
      }
    }

    return ok;
  };

  const mockPricingEstimate = (): PricingEstimate => {
    // Simple deterministic mock: base + type multiplier
    const base = 15;
    const multiplier: Record<OrderType, number> = {
      PERSONAL_ITEMS: 1,
      FOOD: 1.1,
      HEAVY_WEIGHT: 1.6,
      LARGE_SIZE: 1.5,
      CAKE: 1.3,
      FRAGILE: 1.4,
      OTHER: 1.2,
    };
    const priceEstimate = Math.round(base * multiplier[orderType]);
    return { priceEstimate, currency: 'SAR' };
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Note: when operation dsh_awnak_order_create exists,
      // call pricing/estimate endpoint here instead of mock.
      const est = mockPricingEstimate();
      setEstimate(est);
    } finally {
      setSubmitting(false);
    }
  };

  if (screenState !== 'content') {
    return (
      <ScreenWrapper
        state={screenState}
        screenName='auto_dsh_awnak_order_create'
        operationName='dsh_awnak_order_create'
        loadingMessage={t(
          'dsh.app-client.mobile.auto_dsh_awnak_order_create.loadingMessage'
        )}
        errorMessage={t(
          'dsh.app-client.mobile.auto_dsh_awnak_order_create.errorMessage'
        )}
      />
    );
  }

  const behavior = Platform.OS === 'ios' ? 'padding' : undefined;

  const orderTypeOptions: { value: OrderType; label: string }[] = [
    {
      value: 'PERSONAL_ITEMS',
      label: t(
        'dsh.app-client.mobile.auto_dsh_awnak_order_create.orderTypePersonalItems'
      ),
    },
    {
      value: 'FOOD',
      label: t('dsh.app-client.mobile.auto_dsh_awnak_order_create.orderTypeFood'),
    },
    {
      value: 'HEAVY_WEIGHT',
      label: t(
        'dsh.app-client.mobile.auto_dsh_awnak_order_create.orderTypeHeavyWeight'
      ),
    },
    {
      value: 'LARGE_SIZE',
      label: t(
        'dsh.app-client.mobile.auto_dsh_awnak_order_create.orderTypeLargeSize'
      ),
    },
    {
      value: 'CAKE',
      label: t('dsh.app-client.mobile.auto_dsh_awnak_order_create.orderTypeCake'),
    },
    {
      value: 'FRAGILE',
      label: t(
        'dsh.app-client.mobile.auto_dsh_awnak_order_create.orderTypeFragile'
      ),
    },
    {
      value: 'OTHER',
      label: t('dsh.app-client.mobile.auto_dsh_awnak_order_create.orderTypeOther'),
    },
  ];

  return (
    <ScreenWrapper
      state='content'
      screenName='auto_dsh_awnak_order_create'
      operationName='dsh_awnak_order_create'
    >
      <KeyboardAvoidingView style={styles.flex} behavior={behavior} keyboardVerticalOffset={80}>
        <View style={styles.container}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps='handled'
          >
            <View style={styles.header}>
              <Text style={styles.title}>
                {t('dsh.app-client.mobile.auto_dsh_awnak_order_create.title')}
              </Text>
              <Text style={styles.subtitle}>
                {t('dsh.app-client.mobile.auto_dsh_awnak_order_create.subtitle')}
              </Text>
            </View>

            {/* From / To address */}
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.addressCard}
                onPress={() => handlePickAddress('from')}
              >
                <Text style={styles.addressLabel}>
                  {t('dsh.app-client.mobile.auto_dsh_awnak_order_create.fromAddress')}
                </Text>
                <Text style={styles.addressValue} numberOfLines={2}>
                  {fromAddress?.label ||
                    t(
                      'dsh.app-client.mobile.auto_dsh_awnak_order_create.addressPlaceholder'
                    )}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.swapIcon}
                disabled
              >
                <Text style={styles.swapIconText}>{isRTL ? '⇄' : '⇆'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addressCard}
                onPress={() => handlePickAddress('to')}
              >
                <Text style={styles.addressLabel}>
                  {t('dsh.app-client.mobile.auto_dsh_awnak_order_create.toAddress')}
                </Text>
                <Text style={styles.addressValue} numberOfLines={2}>
                  {toAddress?.label ||
                    t(
                      'dsh.app-client.mobile.auto_dsh_awnak_order_create.addressPlaceholder'
                    )}
                </Text>
              </TouchableOpacity>
            </View>
            {errorFrom && <Text style={styles.errorText}>{errorFrom}</Text>}
            {errorTo && <Text style={styles.errorText}>{errorTo}</Text>}

            {/* Order type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t('dsh.app-client.mobile.auto_dsh_awnak_order_create.orderTypeLabel')}
              </Text>
              <View style={styles.segmentGroup}>
                {orderTypeOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.segmentItem,
                      orderType === option.value && styles.segmentItemActive,
                    ]}
                    onPress={() => setOrderType(option.value)}
                  >
                    <Text
                      style={[
                        styles.segmentItemText,
                        orderType === option.value && styles.segmentItemTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errorType && <Text style={styles.errorText}>{errorType}</Text>}
            </View>

            {/* Schedule */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t('dsh.app-client.mobile.auto_dsh_awnak_order_create.timeLabel')}
              </Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.segmentItem,
                    styles.segmentItemFullWidth,
                    time === 'now' && styles.segmentItemActive,
                  ]}
                  onPress={() => setTime('now')}
                >
                  <Text
                    style={[
                      styles.segmentItemText,
                      time === 'now' && styles.segmentItemTextActive,
                    ]}
                  >
                    {t('dsh.app-client.mobile.auto_dsh_awnak_order_create.timeNow')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentItem,
                    styles.segmentItemFullWidth,
                    time === 'scheduled' && styles.segmentItemActive,
                  ]}
                  onPress={() => setTime('scheduled')}
                >
                  <Text
                    style={[
                      styles.segmentItemText,
                      time === 'scheduled' && styles.segmentItemTextActive,
                    ]}
                  >
                    {t(
                      'dsh.app-client.mobile.auto_dsh_awnak_order_create.timeLater'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>

              {time === 'scheduled' && (
                <View style={styles.row}>
                  <View style={styles.halfField}>
                    <TextInput
                      style={styles.input}
                      placeholder={t(
                        'dsh.app-client.mobile.auto_dsh_awnak_order_create.datePlaceholder'
                      )}
                      value={date}
                      onChangeText={setDate}
                    />
                  </View>
                  <View style={styles.halfField}>
                    <TextInput
                      style={styles.input}
                      placeholder={t(
                        'dsh.app-client.mobile.auto_dsh_awnak_order_create.timePlaceholder'
                      )}
                      value={scheduledTime}
                      onChangeText={setScheduledTime}
                    />
                  </View>
                </View>
              )}
              {errorSchedule && (
                <Text style={styles.errorText}>{errorSchedule}</Text>
              )}
            </View>

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t('dsh.app-client.mobile.auto_dsh_awnak_order_create.notesLabel')}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t(
                  'dsh.app-client.mobile.auto_dsh_awnak_order_create.notesPlaceholder'
                )}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>

            {estimate && (
              <View style={styles.estimateBox}>
                <Text style={styles.estimateTitle}>
                  {t(
                    'dsh.app-client.mobile.auto_dsh_awnak_order_create.estimateTitle'
                  )}
                </Text>
                <Text style={styles.estimateValue}>
                  {estimate.priceEstimate.toFixed(0)} {estimate.currency}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                submitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitText}>
                {t(
                  'dsh.app-client.mobile.auto_dsh_awnak_order_create.submitButton'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  header: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 13,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.lg,
  },
  addressCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.borderSubtle,
    backgroundColor: BTHWANI_COLORS.surface,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  addressLabel: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs / 2,
  },
  addressValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
  },
  swapIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BTHWANI_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.borderSubtle,
  },
  swapIconText: {
    fontSize: 18,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  fieldGroup: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  segmentGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  segmentItem: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.borderSubtle,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    backgroundColor: BTHWANI_COLORS.surface,
  },
  segmentItemFullWidth: {
    flex: 1,
    alignItems: 'center',
  },
  segmentItemActive: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: BTHWANI_COLORS.primarySubtle,
  },
  segmentItemText: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  segmentItemTextActive: {
    color: BTHWANI_COLORS.primary,
    fontWeight: '700',
  },
  halfField: {
    flex: 1,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.borderSubtle,
    backgroundColor: BTHWANI_COLORS.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  errorText: {
    marginTop: -BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.lg,
    fontSize: 12,
    color: BTHWANI_COLORS.danger,
  },
  estimateBox: {
    padding: BTHWANI_SPACING.md,
    borderRadius: 12,
    backgroundColor: BTHWANI_COLORS.surface,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.borderSubtle,
  },
  estimateTitle: {
    fontSize: 13,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  estimateValue: {
    fontSize: 18,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
  },
  footer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.lg,
    paddingTop: BTHWANI_SPACING.sm,
    backgroundColor: BTHWANI_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.borderSubtle,
  },
  submitButton: {
    borderRadius: 999,
    backgroundColor: BTHWANI_COLORS.primary,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    color: BTHWANI_COLORS.onPrimary,
  },
});

const auto_dsh_awnak_order_create = AwnakOrderCreateScreen;
export default auto_dsh_awnak_order_create;


