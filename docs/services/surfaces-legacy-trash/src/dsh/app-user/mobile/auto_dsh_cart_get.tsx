// DSH Cart Screen - Enhanced Modern Design
// Surface: app-client | Service: dsh | Operation: GET /api/dsh/cart
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { dshCartGet } from '@bthwani/api-clients/dsh/dsh-cart-api';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface CartItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  image: string;
  specialInstructions?: string;
}

interface DefaultAddress {
  label: string;
  description?: string;
}

interface DefaultPaymentMethod {
  brand: string;
  last4: string;
}

interface auto_dsh_cart_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_cart_get: React.FC<auto_dsh_cart_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<ScreenState>('loading');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartStoreId, setCartStoreId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [defaultAddress] = useState<DefaultAddress | null>({
    label: t('dsh.app-client.mobile.auto_dsh_cart_get.home'),
    description: t('dsh.app-client.mobile.auto_dsh_cart_get.sanaaAlTahrir'),
  });
  const [defaultPayment] = useState<DefaultPaymentMethod | null>({
    brand: 'Visa',
    last4: '1234',
  });

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        (navigation.navigate as (s: string, p?: Record<string, unknown>) => void)(
          screen,
          params,
        );
      } else if (onNavigate) {
          (onNavigate as (screen: string, params?: Record<string, unknown>) => void)(screen, params);
      }
    },
    [navigation, onNavigate]
  );

  const loadCart = useCallback(async () => {
    try {
      setState('loading');
      const json = await dshCartGet();
      if (!json?.success) throw new Error(json?.error || 'Failed to load cart');
      const rawItems = json?.data?.items ?? [];
      const storeId =
        json?.data?.storeId != null ? String(json.data.storeId) : json?.data?.store_id != null ? String(json.data.store_id) : null;
      setCartStoreId(storeId);
      const items: CartItem[] = rawItems.map(
        (it: {
          id?: string;
          name?: string;
          restaurant?: string;
          price?: number;
          quantity?: number;
          image?: string;
          specialInstructions?: string;
        }) => ({
          id: it?.id ?? '',
          name: it?.name ?? '',
          restaurant: it?.restaurant ?? '',
          price: it?.price ?? 0,
          quantity: it?.quantity ?? 1,
          image: it?.image ?? '📦',
          specialInstructions: it?.specialInstructions,
        })
      );
      setCartItems(items);
      setState(items.length > 0 ? 'content' : 'empty');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCart();
    setRefreshing(false);
  }, [loadCart]);

  const handleRetry = () => {
    loadCart();
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems(items =>
      items
        .map(item =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateDelivery = () => 10;
  const calculateTax = () => Math.round(calculateSubtotal() * 0.15);
  const calculateGrandTotal = () =>
    calculateSubtotal() + calculateDelivery() + calculateTax();

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, { flexDirection: 'row', direction: layoutDirection }]}>
      <View style={styles.itemImageContainer}>
        <Text style={styles.itemEmoji}>{item.image}</Text>
      </View>

      <View style={styles.itemContent}>
        <View style={[styles.itemHeader, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemRestaurant} numberOfLines={1}>
              {item.restaurant}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {item.specialInstructions && (
          <View style={[styles.instructionsContainer, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.instructionsIcon}>📝</Text>
            <Text style={styles.instructionsText}>
              {item.specialInstructions}
            </Text>
          </View>
        )}

        <View style={[styles.itemFooter, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={[styles.quantityContainer, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, -1)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.quantityValueContainer}>
              <Text style={styles.quantityValue}>{item.quantity}</Text>
            </View>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.itemTotalPrice}>
            {item.price * item.quantity} ريال
          </Text>
        </View>
      </View>
    </View>
  );

  if (state === 'content' && cartItems.length > 0) {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>سلة التسوق</Text>
            <Text style={styles.subtitle}>{cartItems.length} صنف في السلة</Text>
          </View>

          {defaultAddress && (
            <TouchableOpacity
              style={[styles.addressStrip, { flexDirection: 'row', direction: layoutDirection }]}
              activeOpacity={0.8}
              onPress={() => handleNavigate('UserAddressesList')}
            >
              <View style={styles.addressIconWrap}>
                <Text style={styles.addressIcon}>📍</Text>
              </View>
              <View style={styles.addressTextWrap}>
                <Text style={styles.addressLabel}>التوصيل إلى</Text>
                <Text style={styles.addressTitle} numberOfLines={1}>
                  {defaultAddress.label}
                </Text>
                {defaultAddress.description ? (
                  <Text style={styles.addressDescription} numberOfLines={1}>
                    {defaultAddress.description}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.addressChevron}>تغيير</Text>
            </TouchableOpacity>
          )}

          {defaultPayment && (
            <TouchableOpacity
              style={[styles.paymentStrip, { flexDirection: 'row', direction: layoutDirection }]}
              activeOpacity={0.8}
              onPress={() => handleNavigate('WltTopup')}
            >
              <View style={styles.paymentIconWrap}>
                <Text style={styles.paymentIcon}>💳</Text>
              </View>
              <View style={styles.paymentTextWrap}>
                <Text style={styles.paymentLabel}>الدفع بواسطة</Text>
                <Text style={styles.paymentTitle} numberOfLines={1}>
                  {defaultPayment.brand} **** {defaultPayment.last4}
                </Text>
              </View>
              <Text style={styles.paymentChevron}>تغيير</Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={cartItems}
            keyExtractor={item => item.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />

          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>ملخص الطلب</Text>

              <View style={[styles.summaryRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.summaryLabel}>المجموع الفرعي</Text>
                <Text style={styles.summaryValue}>
                  {calculateSubtotal()} ريال
                </Text>
              </View>

              <View style={[styles.summaryRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.summaryLabel}>رسوم التوصيل</Text>
                <Text style={styles.summaryValue}>
                  {calculateDelivery()} ريال
                </Text>
              </View>

              <View style={[styles.summaryRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.summaryLabel}>الضريبة المضافة (15%)</Text>
                <Text style={styles.summaryValue}>{calculateTax()} ريال</Text>
              </View>

              <View style={styles.divider} />

              <View style={[styles.totalRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.totalLabel}>المجموع الكلي</Text>
                <Text style={styles.totalValue}>
                  {calculateGrandTotal()} ريال
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => handleNavigate('DshCheckoutGate', cartStoreId ? { storeId: cartStoreId } : undefined)}
            >
              <Text style={styles.checkoutButtonText}>متابعة الدفع</Text>
              <Text style={styles.checkoutButtonSubtext}>
                {calculateGrandTotal()} ريال
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_cart_get.loadingMessage')}
      emptyMessage={t('dsh.app-client.mobile.auto_dsh_cart_get.cartIsEmpty')}
      emptyActionText={t('dsh.app-client.mobile.auto_dsh_cart_get.browseRestaurant')}
      onEmptyAction={() => handleNavigate('DshStoresList')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_cart_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName='auto_dsh_cart_get'
      operationName='dsh_cart_get'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  cartList: {
    padding: BTHWANI_SPACING.contentH,
  },
  addressStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  addressIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.sm,
  },
  addressIcon: {
    fontSize: 20,
  },
  addressTextWrap: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: 2,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  addressDescription: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  addressChevron: {
    fontSize: 13,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
    marginStart: BTHWANI_SPACING.sm,
  },
  paymentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  paymentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.sm,
  },
  paymentIcon: {
    fontSize: 20,
  },
  paymentTextWrap: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: 2,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  paymentChevron: {
    fontSize: 13,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
    marginStart: BTHWANI_SPACING.sm,
  },
  cartItem: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    shadowColor: semanticRoles.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: semanticRoles.surfaceSubtle,
  },
  itemImageContainer: {
    width: 96,
    height: 96,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  itemEmoji: {
    fontSize: 48,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  itemInfo: {
    flex: 1,
    marginEnd: BTHWANI_SPACING.sm,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  itemRestaurant: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 18,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.accent + '15',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  instructionsIcon: {
    fontSize: 14,
    marginEnd: BTHWANI_SPACING.xs,
  },
  instructionsText: {
    fontSize: 12,
    color: semanticRoles.accentStrong,
    flex: 1,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
  quantityValueContainer: {
    minWidth: 40,
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  itemTotalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  summaryContainer: {
    backgroundColor: semanticRoles.surface,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.surfaceSubtle,
    paddingTop: BTHWANI_SPACING.lg,
  },
  summaryCard: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.md,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  divider: {
    height: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
    marginVertical: BTHWANI_SPACING.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  checkoutButton: {
    backgroundColor: semanticRoles.primaryCTA,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    shadowColor: semanticRoles.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: BTHWANI_SPACING.xs,
  },
  checkoutButtonSubtext: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    opacity: 0.9,
  },
});

export default auto_dsh_cart_get;


