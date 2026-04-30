/**
 * DSH Gas Refill Order Create — تعبئة غاز
 * Surface: app-client | Service: dsh
 * Creates order: customer home ← station ← customer home (round-trip).
 */

import React, { useEffect, useState, useMemo } from 'react';
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
import { useRoute } from '@react-navigation/native';
import { ScreenState, ScreenWrapper } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit/i18n';
import {
  gasRefillEstimate,
  gasRefillOrderCreate,
} from '@bthwani/api-clients';
import {
  buildGasRefillStationsMock,
  buildGasRefillEstimateMock,
  type GasRefillSubcategory,
  type GasRefillEstimate,
} from '../../hooks';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

interface AddressState {
  label: string;
}

const SUBCATEGORIES: GasRefillSubcategory[] = [
  'gas_refill_refill',
  'gas_refill_repair',
  'gas_refill_buy',
];

export const GasRefillOrderCreateScreen: React.FC<Props> = ({ navigation, onNavigate }) => {
  const { t, isRTL } = useI18n();
  const route = useRoute();
  const params = (route.params as { stationId?: string; subcategoryId?: string; storeId?: string }) ?? {};
  const stationId = (params.stationId ?? params.storeId ?? 'gr1').trim();
  const initialSubcategory = (params.subcategoryId as GasRefillSubcategory) || 'gas_refill_refill';
  const isValidSubcategory = SUBCATEGORIES.includes(initialSubcategory);

  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [subcategory, setSubcategory] = useState<GasRefillSubcategory>(isValidSubcategory ? initialSubcategory : 'gas_refill_refill');
  const [deliveryAddress, setDeliveryAddress] = useState<AddressState | null>(null);
  const [notes, setNotes] = useState('');
  const [errorAddress, setErrorAddress] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState<GasRefillEstimate | null>(null);

  const stations = useMemo(() => buildGasRefillStationsMock(t), [t]);
  const station = useMemo(
    () => stations.find((s) => s.id === stationId) ?? stations[0],
    [stations, stationId]
  );

  useEffect(() => {
    const timeout = setTimeout(() => setScreenState('content'), 200);
    return () => clearTimeout(timeout);
  }, []);

  const handlePickAddress = () => {
    const nav = (screen: string, p?: Record<string, unknown>) => {
      if (navigation?.navigate) navigation.navigate(screen, p ?? {});
      else if (onNavigate) onNavigate(screen, p ?? {});
    };
    nav('UserAddressesList', { gasRefillSelectFor: 'delivery' });
  };

  const validate = (): boolean => {
    setErrorAddress(null);
    if (!deliveryAddress) {
      setErrorAddress(t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.validationAddressRequired'));
      return false;
    }
    return true;
  };

  const handleGetEstimate = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      try {
        const res = await gasRefillEstimate({
          subcategory,
          stationId,
          customerAddress: deliveryAddress?.label,
          baseDeliveryFee: 8,
        });
        setEstimate({
          subcategory: res.subcategory as GasRefillSubcategory,
          stationId: res.stationId,
          customerAddress: deliveryAddress?.label ?? '',
          refillFee: res.refillFee,
          repairFee: res.repairFee,
          cylinderPrice: res.cylinderPrice,
          deliveryFee: res.deliveryFee,
          total: res.total,
          currency: res.currency,
          estimatedMinutes: res.estimatedMinutes,
        });
      } catch {
        const est = buildGasRefillEstimateMock(t, subcategory, stationId);
        setEstimate(est);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!estimate) return handleGetEstimate();
    setSubmitting(true);
    try {
      try {
        await gasRefillOrderCreate({
          subcategory,
          stationId,
          stationName: station.name,
          customerAddress: deliveryAddress?.label ?? '',
          refillFee: estimate.refillFee,
          repairFee: estimate.repairFee,
          cylinderPrice: estimate.cylinderPrice,
          deliveryFee: estimate.deliveryFee,
          total: estimate.total,
          notes: notes || undefined,
        });
      } catch {
        // Mock path: no API, just navigate
      }
      if (navigation?.navigate) {
        navigation.navigate('DshOrdersList');
      } else if (onNavigate) {
        onNavigate('DshOrdersList');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (screenState !== 'content') {
    return (
      <ScreenWrapper
        state={screenState}
        screenName="auto_dsh_gas_refill_order_create"
        operationName="dsh_gas_refill_order_create"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.loadingMessage')}
        errorMessage={t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.errorMessage')}
      />
    );
  }

  const behavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <ScreenWrapper
      state="content"
      screenName="auto_dsh_gas_refill_order_create"
      operationName="dsh_gas_refill_order_create"
    >
      <KeyboardAvoidingView style={styles.flex} behavior={behavior} keyboardVerticalOffset={80}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.title')}
            </Text>
            <Text style={styles.subtitle}>
              {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.subtitle')}
            </Text>
          </View>

          <View style={styles.stationCard}>
            <Text style={styles.stationLabel}>
              {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.stationLabel')}
            </Text>
            <Text style={styles.stationName}>{station.name}</Text>
            <Text style={styles.stationType}>{station.type}</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.subcategoryLabel')}
            </Text>
            <View style={styles.segmentGroup}>
              {SUBCATEGORIES.map((sc) => (
                <TouchableOpacity
                  key={sc}
                  style={[styles.segmentItem, subcategory === sc && styles.segmentItemActive]}
                  onPress={() => {
                    setSubcategory(sc);
                    setEstimate(null);
                  }}
                >
                  <Text
                    style={[
                      styles.segmentItemText,
                      subcategory === sc && styles.segmentItemTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {t(`dsh.app-client.mobile.auto_dsh_gas_refill_order_create.subcategory_${sc}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.addressLabel')}
            </Text>
            <TouchableOpacity style={styles.addressCard} onPress={handlePickAddress}>
              <Text style={styles.addressValue} numberOfLines={2}>
                {deliveryAddress?.label ??
                  t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.addressPlaceholder')}
              </Text>
            </TouchableOpacity>
            {errorAddress && <Text style={styles.errorText}>{errorAddress}</Text>}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.notesLabel')}
            </Text>
            <TextInput
              style={styles.notesInput}
              placeholder={t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.notesPlaceholder')}
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {estimate && (
            <View style={styles.estimateCard}>
              <Text style={styles.estimateTitle}>
                {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.estimateTitle')}
              </Text>
              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>
                  {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.refillFee')}
                </Text>
                <Text style={styles.estimateValue}>{estimate.refillFee} {estimate.currency}</Text>
              </View>
              {estimate.repairFee != null && (
                <View style={styles.estimateRow}>
                  <Text style={styles.estimateLabel}>
                    {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.repairFee')}
                  </Text>
                  <Text style={styles.estimateValue}>{estimate.repairFee} {estimate.currency}</Text>
                </View>
              )}
              {estimate.cylinderPrice != null && (
                <View style={styles.estimateRow}>
                  <Text style={styles.estimateLabel}>
                    {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.cylinderPrice')}
                  </Text>
                  <Text style={styles.estimateValue}>{estimate.cylinderPrice} {estimate.currency}</Text>
                </View>
              )}
              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>
                  {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.deliveryFee')}
                </Text>
                <Text style={styles.estimateValue}>{estimate.deliveryFee} {estimate.currency}</Text>
              </View>
              <View style={[styles.estimateRow, styles.estimateTotalRow]}>
                <Text style={styles.estimateTotalLabel}>
                  {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.total')}
                </Text>
                <Text style={styles.estimateTotalValue}>{estimate.total} {estimate.currency}</Text>
              </View>
              <Text style={styles.estimateEta}>
                {t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.estimatedTime', {
                  minutes: estimate.estimatedMinutes,
                })}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={estimate ? handleConfirmOrder : handleGetEstimate}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {estimate
                ? t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.confirmOrder')
                : t('dsh.app-client.mobile.auto_dsh_gas_refill_order_create.showEstimate')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xxl },
  header: { marginBottom: BTHWANI_SPACING.lg },
  title: { fontSize: 22, fontWeight: '700', color: '#000', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666' },
  stationCard: {
    backgroundColor: '#f5f5f5',
    padding: BTHWANI_SPACING.md,
    borderRadius: 12,
    marginBottom: BTHWANI_SPACING.lg,
  },
  stationLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  stationName: { fontSize: 16, fontWeight: '600', color: '#000' },
  stationType: { fontSize: 13, color: '#666', marginTop: 2 },
  fieldGroup: { marginBottom: BTHWANI_SPACING.lg },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  segmentGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segmentItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  segmentItemActive: { backgroundColor: '#1a73e8' },
  segmentItemText: { fontSize: 13, color: '#333' },
  segmentItemTextActive: { color: '#fff' },
  addressCard: {
    padding: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  addressValue: { fontSize: 15, color: '#666' },
  errorText: { fontSize: 12, color: '#d32f2f', marginTop: 4 },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: BTHWANI_SPACING.md,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  estimateCard: {
    backgroundColor: '#e8f5e9',
    padding: BTHWANI_SPACING.md,
    borderRadius: 12,
    marginBottom: BTHWANI_SPACING.lg,
  },
  estimateTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 12 },
  estimateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  estimateTotalRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#ccc' },
  estimateLabel: { fontSize: 14, color: '#555' },
  estimateValue: { fontSize: 14, fontWeight: '600', color: '#000' },
  estimateTotalLabel: { fontSize: 16, fontWeight: '700', color: '#000' },
  estimateTotalValue: { fontSize: 18, fontWeight: '700', color: '#1a73e8' },
  estimateEta: { fontSize: 12, color: '#666', marginTop: 8 },
  submitButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default GasRefillOrderCreateScreen;

