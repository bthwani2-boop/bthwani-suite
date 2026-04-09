/**
 * DSH Orders Create Screen - dsh_orders_create
 * Allows partner to create a new order from cart or direct entry.
 * Uses only @bthwani/ui-kit and React Native for build compatibility.
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput as RNTextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenWrapper, semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  customer_id: string;
  items: OrderItem[];
  delivery_address_id: string;
  payment_method: 'cash' | 'card' | 'wallet';
  special_instructions?: string;
  estimated_delivery_time?: string;
}

export function DshOrdersCreateScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderData, setOrderData] = useState<Partial<OrderData>>({
    items: [],
    payment_method: 'cash',
  });

  const cartId = (route.params as { cartId?: string })?.cartId;

  const loadCartData = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await new Promise((r) => setTimeout(r, 400));
      setOrderData((prev) => ({
        ...prev,
        customer_id: 'cust-001',
        delivery_address_id: 'addr-001',
        items: [
          { id: 'item-001', name: t('dsh.mobile.dsh.DshOrdersCreateScreen.mockItemName'), quantity: 1, price: 25 },
        ],
        payment_method: 'cash',
      }));
    } catch {
      setError(t('dsh.mobile.dsh.DshOrdersCreateScreen.errorGeneric'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (cartId) loadCartData(cartId);
  }, [cartId, loadCartData]);

  const addOrderItem = () => {
    setOrderData((prev) => ({
      ...prev,
      items: [
        ...(prev.items ?? []),
        { id: `item_${Date.now()}`, name: '', quantity: 1, price: 0 },
      ],
    }));
  };

  const updateOrderItem = (itemId: string, updates: Partial<OrderItem>) => {
    setOrderData((prev) => ({
      ...prev,
      items: (prev.items ?? []).map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeOrderItem = (itemId: string) => {
    setOrderData((prev) => ({
      ...prev,
      items: (prev.items ?? []).filter((item) => item.id !== itemId),
    }));
  };

  const calculateTotal = () =>
    (orderData.items ?? []).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validateOrder = (): string | null => {
    if (!orderData.customer_id) return t('dsh.mobile.dsh.DshOrdersCreateScreen.validationCustomerRequired');
    if (!orderData.items?.length) return t('dsh.mobile.dsh.DshOrdersCreateScreen.validationItemsRequired');
    if (!orderData.delivery_address_id) return t('dsh.mobile.dsh.DshOrdersCreateScreen.validationAddressRequired');
    for (const item of orderData.items) {
      if (!item.name.trim()) return t('dsh.mobile.dsh.DshOrdersCreateScreen.validationItemNameRequired');
      if (item.quantity <= 0) return t('dsh.mobile.dsh.DshOrdersCreateScreen.validationQuantityRequired');
      if (item.price <= 0) return t('dsh.mobile.dsh.DshOrdersCreateScreen.validationPriceRequired');
    }
    return null;
  };

  const handleCreateOrder = async () => {
    const err = validateOrder();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const orderId = `order_${Date.now()}`;
      setShowSuccess(true);
      setTimeout(() => {
        (navigation.navigate as (s: string, p?: object) => void)?.(
          'DshPartnerOrderDetailScreen',
          { orderId }
        );
      }, 1500);
    } catch {
      setError(t('dsh.mobile.dsh.DshOrdersCreateScreen.errorSubmit'));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !orderData.items?.length) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.mobile.dsh.DshOrdersCreateScreen.loadingMessage')}
      />
    );
  }

  if (error && !orderData.items?.length) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error}
        onErrorAction={cartId ? () => loadCartData(cartId) : undefined}
      />
    );
  }

  const total = calculateTotal();

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textAlignStart]}>{t('dsh.mobile.dsh.DshOrdersCreateScreen.sectionTitleItems')}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={addOrderItem}>
            <Text style={styles.addBtnText}>{t('dsh.mobile.dsh.DshOrdersCreateScreen.addBtnText')}</Text>
          </TouchableOpacity>
        </View>

        {(orderData.items ?? []).length === 0 ? (
          <Text style={[styles.emptyHint, textAlignStart]}>{t('dsh.mobile.dsh.DshOrdersCreateScreen.emptyHint')}</Text>
        ) : (
          (orderData.items ?? []).map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemRow}>
                <Text style={styles.itemIndex}>{index + 1}</Text>
                <TouchableOpacity onPress={() => removeOrderItem(item.id)}>
                  <Text style={styles.removeText}>{t('dsh.mobile.dsh.DshOrdersCreateScreen.removeText')}</Text>
                </TouchableOpacity>
              </View>
              <RNTextInput
                style={[styles.input, textAlignStart]}
                placeholder={t('dsh.mobile.dsh.DshOrdersCreateScreen.placeholderCustomerId')}
                value={item.name}
                onChangeText={(name) => updateOrderItem(item.id, { name })}
              />
              <View style={styles.row}>
                <RNTextInput
                  style={[styles.inputSmall, textAlignStart]}
                  placeholder={t('dsh.mobile.dsh.DshOrdersCreateScreen.placeholderAddress')}
                  value={String(item.quantity)}
                  onChangeText={(q) =>
                    updateOrderItem(item.id, { quantity: parseInt(q, 10) || 1 })
                  }
                  keyboardType="numeric"
                />
                <RNTextInput
                  style={[styles.inputSmall, textAlignStart]}
                  placeholder={t('dsh.mobile.dsh.DshOrdersCreateScreen.placeholderNotes')}
                  value={String(item.price)}
                  onChangeText={(p) =>
                    updateOrderItem(item.id, { price: parseFloat(p) || 0 })
                  }
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={[styles.subtotal, textAlignStart]}>
                المجموع: {(item.price * item.quantity).toFixed(2)} ر.س
              </Text>
            </View>
          ))
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textAlignStart]}>{t('dsh.mobile.dsh.DshOrdersCreateScreen.sectionTitleDetails')}</Text>
          <RNTextInput
            style={[styles.input, textAlignStart]}
            placeholder={t('dsh.mobile.dsh.DshOrdersCreateScreen.placeholderSpecialInstructions')}
            value={orderData.customer_id ?? ''}
            onChangeText={(customer_id) =>
              setOrderData((p) => ({ ...p, customer_id }))
            }
          />
          <RNTextInput
            style={[styles.input, textAlignStart]}
            placeholder={t('dsh.mobile.dsh.DshOrdersCreateScreen.placeholderPaymentNote')}
            value={orderData.delivery_address_id ?? ''}
            onChangeText={(delivery_address_id) =>
              setOrderData((p) => ({ ...p, delivery_address_id }))
            }
          />
          <View style={styles.paymentRow}>
            {(['cash', 'card', 'wallet'] as const).map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.chip,
                  orderData.payment_method === method && styles.chipSelected,
                ]}
                onPress={() =>
                  setOrderData((p) => ({ ...p, payment_method: method }))
                }
              >
                <Text style={styles.chipText}>
                  {method === 'cash' ? t('dsh.mobile.dsh.DshOrdersCreateScreen.paymentMethodCash') : method === 'card' ? t('dsh.mobile.dsh.DshOrdersCreateScreen.paymentCard') : t('dsh.mobile.dsh.DshOrdersCreateScreen.paymentWallet')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleCreateOrder}
          disabled={loading || !orderData.items?.length}
        >
          <Text style={styles.submitBtnText}>
            {loading ? t('dsh.mobile.dsh.DshOrdersCreateScreen.buttonSubmitting') : t('dsh.mobile.dsh.DshOrdersCreateScreen.createOrderButton')}
          </Text>
        </TouchableOpacity>

        {orderData.items && orderData.items.length > 0 && (
          <Text style={[styles.totalLine, textAlignStart]}>
            {t('dsh.mobile.dsh.DshOrdersCreateScreen.totalLine', { total: total.toFixed(2) })}
          </Text>
        )}
      </ScrollView>

      {showSuccess && (
        <View style={styles.successOverlay}>
          <Text style={styles.successText}>{t('dsh.mobile.dsh.DshOrdersCreateScreen.successText')}</Text>
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: semanticRoles.accentHover,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addBtnText: { color: semanticRoles.primaryCTA, fontWeight: '600' },
  emptyHint: { color: semanticRoles.textSecondary, marginBottom: 16 },
  itemCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIndex: { fontWeight: '700', color: semanticRoles.text },
  removeText: { color: semanticRoles.error, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 16,
  },
  inputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 4,
    fontSize: 14,
  },
  row: { flexDirection: 'row', marginBottom: 8 },
  subtotal: { fontSize: 12, color: semanticRoles.textSecondary },
  paymentRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  chipSelected: {
    backgroundColor: semanticRoles.accentHover,
    borderColor: semanticRoles.primaryCTA,
  },
  chipText: { fontSize: 14 },
  errorBox: {
    backgroundColor: semanticRoles.stateError.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: { color: semanticRoles.error },
  submitBtn: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  totalLine: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  successOverlay: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    backgroundColor: 'BTHWANI_COLORS.overlay',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 18,
    fontWeight: '700',
  },
});
