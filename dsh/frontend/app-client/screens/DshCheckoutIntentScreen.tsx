// Removed Ionicons import
import React, { useState, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ImageSourcePropType, Image } from 'react-native';

import {
  Box,
  Button,
  Surface,
  Text,
  TopBar,
  colorPalette,
  spacing,
  useDirection,
  useTheme,
  StateView,
  radius,
  Icon,
  Toast,
  Sheet,
  IconButton,
} from '@bthwani/ui-kit';

// Premium authentic Omani food/grocery items
const DEFAULT_CART_ITEMS = [
  { id: 'p1', title: 'برياني لحم غنم فاخر', priceValue: 4.500, qty: 2, imageUri: 'dsh.product.meat.v1' },
  { id: 'p2', title: 'حمص باللحم والصنوبر', priceValue: 2.000, qty: 1, imageUri: 'dsh.product.hummus.v1' },
  { id: 'p3', title: 'فتوش طازج بالرمان', priceValue: 1.500, qty: 1, imageUri: 'dsh.product.salad.v1' },
];

const RECOMMENDED_PRODUCTS = [
  { id: 'r1', title: 'أصابع جبنة موزاريلا', priceValue: 1.800, imageUri: 'dsh.product.cheese.v1' },
  { id: 'r2', title: 'ورق عنب بدبس الرمان', priceValue: 2.200, imageUri: 'dsh.product.grapeleaves.v1' },
  { id: 'r3', title: 'سلطة كينوا بالمانجو', priceValue: 2.500, imageUri: 'dsh.product.quinoa.v1' },
  { id: 'r4', title: 'أم علي بالفستق واللوز', priceValue: 1.500, imageUri: 'dsh.product.umali.v1' },
  { id: 'r5', title: 'مياه معدنية فوارة', priceValue: 0.400, imageUri: 'dsh.product.water.v1' },
];

export type DshCheckoutIntentScreenProps = {
  // ML-006: order-created; ML-009: payment error; ML-010: blocked+retry; ML-015: quote-loading
  state?: 'ready' | 'loading' | 'quote-loading' | 'error' | 'disabled' | 'blocked' | 'order-created';
  paymentErrorMessage?: string;
  onViewOrder?: () => void;
  address?: string;
  subtotal?: string;
  deliveryFee?: string;
  total?: string;
  eta?: string;
  paymentMethods?: Array<{ id: string; label: string; icon: string; isSelected: boolean }>;
  onBack?: () => void;
  onConfirm?: () => void;
  onSelectPaymentMethod?: (id: string) => void;
  onChangeAddress?: () => void;
  onRetry?: () => void;

  // New interactive cart props
  items?: Array<{ id: string; title: string; priceValue: number; qty: number; imageUri?: string }>;
  onItemsChange?: (items: Array<{ id: string; title: string; priceValue: number; qty: number; imageUri?: string }>) => void;
};

function formatOmaniRial(value: number): string {
  try {
    return `${value.toFixed(3)} ر.ع.`;
  } catch {
    return `${value} ر.ع.`;
  }
}

export function DshCheckoutIntentScreen({
  state = 'ready',
  address = 'مسقط، الخوير، شارع المها، بناية رقم 123',
  subtotal: propSubtotal,
  deliveryFee = '1.500 ر.ع.',
  total: propTotal,
  eta = '30 - 45 دقيقة',
  paymentMethods = [
    { id: 'wallet', label: 'المحفظة', icon: 'wallet-outline', isSelected: true },
    { id: 'card', label: 'بطاقة بنكية', icon: 'card-outline', isSelected: false },
    { id: 'cod', label: 'دفع عند الاستلام', icon: 'cash-outline', isSelected: false },
  ],
  paymentErrorMessage = 'فشلت عملية الدفع. يُرجى التحقق من طريقة الدفع والمحاولة مرة أخرى.',
  onBack,
  onConfirm,
  onSelectPaymentMethod,
  onChangeAddress,
  onRetry,
  onViewOrder,
  items,
  onItemsChange,
}: DshCheckoutIntentScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';
  const { theme } = useTheme();

  // Internal stateful cart for interactive, fluid edits
  const [cartItems, setCartItems] = useState(() => items || DEFAULT_CART_ITEMS);
  const [lastRemovedItem, setLastRemovedItem] = useState<{ item: typeof DEFAULT_CART_ITEMS[0]; index: number } | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{
    visible: boolean;
    title: string;
    description?: string;
    tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
    actionLabel?: string;
    onActionPress?: () => void;
  } | null>(null);

  // Payment method local state
  const [selectedMethodId, setSelectedMethodId] = useState(() => {
    const selected = paymentMethods.find((m) => m.isSelected);
    return selected ? selected.id : 'wallet';
  });

  const showToast = (
    title: string,
    tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' = 'info',
    description?: string,
    actionLabel?: string,
    onActionPress?: () => void
  ) => {
    setToast({ visible: true, title, tone, description, actionLabel, onActionPress });
  };

  const handleSelectPaymentMethod = (id: string) => {
    setSelectedMethodId(id);
    onSelectPaymentMethod?.(id);
  };

  // Real-time calculated totals
  const deliveryFeeNum = 1.500;
  const calculatedSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.priceValue * item.qty), 0);
  }, [cartItems]);

  const calculatedTotal = useMemo(() => {
    return calculatedSubtotal + deliveryFeeNum;
  }, [calculatedSubtotal]);

  // Sync back to parent if callback exists
  const updateCartItems = (newItems: typeof cartItems) => {
    setCartItems(newItems);
    onItemsChange?.(newItems);
  };

  // Quantity control handlers
  const handleIncrement = (id: string) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
    updateCartItems(updated);
  };

  const handleDecrement = (id: string) => {
    const targetItem = cartItems.find((item) => item.id === id);
    if (!targetItem) return;

    if (targetItem.qty <= 1) {
      // Remove item with Undo toast
      const index = cartItems.findIndex((item) => item.id === id);
      const updated = cartItems.filter((item) => item.id !== id);
      setLastRemovedItem({ item: targetItem, index });
      updateCartItems(updated);

      showToast(
        `تم حذف "${targetItem.title}" من السلة`,
        'warning',
        undefined,
        'تراجع',
        () => {
          // Restore item
          const restored = [...updated];
          restored.splice(index, 0, targetItem);
          updateCartItems(restored);
          setLastRemovedItem(null);
          showToast(`تمت استعادة "${targetItem.title}"`, 'success');
        }
      );
    } else {
      const updated = cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, qty: item.qty - 1 };
        }
        return item;
      });
      updateCartItems(updated);
    }
  };

  const handleRemoveDirectly = (id: string) => {
    const targetItem = cartItems.find((item) => item.id === id);
    if (!targetItem) return;

    const index = cartItems.findIndex((item) => item.id === id);
    const updated = cartItems.filter((item) => item.id !== id);
    setLastRemovedItem({ item: targetItem, index });
    updateCartItems(updated);

    showToast(
      `تم حذف "${targetItem.title}"`,
      'warning',
      undefined,
      'تراجع',
      () => {
        const restored = [...updated];
        restored.splice(index, 0, targetItem);
        updateCartItems(restored);
        setLastRemovedItem(null);
        showToast(`تمت استعادة "${targetItem.title}"`, 'success');
      }
    );
  };

  // Recommendation Quick Add handler
  const handleAddRecommendation = (prod: typeof RECOMMENDED_PRODUCTS[0]) => {
    const existing = cartItems.find((item) => item.id === prod.id);
    if (existing) {
      handleIncrement(prod.id);
      showToast(`تمت زيادة كمية "${prod.title}" في السلة`, 'success');
    } else {
      const newItem = {
        id: prod.id,
        title: prod.title,
        priceValue: prod.priceValue,
        qty: 1,
        imageUri: prod.imageUri,
      };
      updateCartItems([...cartItems, newItem]);
      showToast(`تمت إضافة "${prod.title}" إلى السلة`, 'success');
    }
  };

  if (state === 'loading') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تأكيد الطلب" onBack={onBack} />
        <StateView stateId="loading" title="جاري التحقق من التوفر..." description="نحن نتأكد من إمكانية التوصيل لموقعك حالياً." />
      </Surface>
    );
  }

  if (state === 'quote-loading') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تأكيد الطلب" onBack={onBack} />
        <StateView stateId="loading" title="جاري حساب تكلفة التوصيل..." description="يُجزى الانتظار بينما نحسب التكلفة والوقت المتوقع." />
      </Surface>
    );
  }

  if (state === 'order-created') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تم إنشاء الطلب" onBack={onBack} />
        <StateView
          stateId="success"
          title="تم تأكيد طلبك بنجاح"
          description="سيتم إعلامك عند قبول المتجر للطلب وبدء التحضير."
          actionLabel="تتبع الطلب"
          onActionPress={onViewOrder}
        />
      </Surface>
    );
  }

  if (state === 'error') {
    return (
      <Surface style={styles.root}>
        <TopBar title="فشل الدفع" onBack={onBack} />
        <StateView
          stateId="error"
          title="تعذّر إتمام الدفع"
          description={paymentErrorMessage}
          actionLabel="إعادة المحاولة"
          onActionPress={onRetry}
        />
      </Surface>
    );
  }

  if (state === 'blocked') {
    return (
      <Surface style={styles.root}>
        <TopBar title="الخدمة غير متوفرة" onBack={onBack} />
        <StateView
          stateId="blocked"
          title="عذراً، الموقع خارج نطاق التغطية"
          description="المتجر لا يدعم التوصيل إلى عنوانك الحالي في الوقت الحالي."
          actionLabel="تغيير العنوان"
          onActionPress={onChangeAddress}
        />
        {onRetry && (
          <Box padding={4}>
            <Button label="إعادة المحاولة" tone="secondary" onPress={onRetry} />
          </Box>
        )}
      </Surface>
    );
  }

  return (
    <Surface style={styles.root}>
      <TopBar title="تأكيد الطلب" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Section: Delivery Address */}
        <Box padding={spacing[4]} borderBottomWidth={1} borderBottomColor={colorPalette.line}>
          <View style={[styles.sectionHeader, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
            <Pressable onPress={onChangeAddress}>
              <Text role="bodySm" style={styles.actionText}>تغيير</Text>
            </Pressable>
            <Text role="titleMd" style={styles.sectionTitle}>عنوان التوصيل</Text>
          </View>
          <View style={[styles.addressCard, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
            <Icon name="location" size={24} color={colorPalette.orange} style={styles.sectionIcon} />
            <View style={styles.addressInfo}>
              <Text role="bodyMd" style={styles.addressText} numberOfLines={2}>{address}</Text>
            </View>
          </View>
        </Box>

        {/* Section: ETA Preview */}
        <Box padding={spacing[4]} backgroundColor={colorPalette.lightSurface} margin={spacing[4]} borderRadius={radius.md}>
          <View style={[styles.etaRow, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
            <Icon name="time-outline" size={20} color={colorPalette.deepBlue} />
            <Text role="bodyMd" style={styles.etaText}>
              الوقت المتوقع للوصول: <Text role="titleSm" style={{ color: colorPalette.orange }}>{eta}</Text>
            </Text>
          </View>
        </Box>

        {/* Section: Interactive Cart Items List */}
        <Box padding={spacing[4]} borderBottomWidth={1} borderBottomColor={colorPalette.line}>
          <Text role="titleMd" style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left', marginBottom: spacing[3] }]}>
            مراجعة المنتجات في السلة
          </Text>

          {cartItems.length === 0 ? (
            <View style={styles.emptyCartZone}>
              <Icon name="cart-outline" size={40} color={colorPalette.deepBlueLighter} />
              <Text role="bodyMd" style={{ color: colorPalette.deepBlueLighter, marginTop: spacing[2] }}>
                السلة فارغة حالياً
              </Text>
            </View>
          ) : (
            <View style={styles.cartList}>
              {cartItems.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    { flexDirection: isRtl ? 'row' : 'row-reverse' }
                  ]}
                >
                  {/* Left (Product Title & Price) */}
                  <View style={[styles.itemDetails, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                    <Text role="bodyStrong" style={styles.itemTitle}>{item.title}</Text>
                    <Text role="bodySm" style={styles.itemPrice}>
                      {formatOmaniRial(item.priceValue)} × {item.qty}
                    </Text>
                  </View>

                  {/* Right (Quantity Controls & Action) */}
                  <View style={[styles.quantityControlRow, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
                    <Pressable
                      style={styles.quantityBtn}
                      onPress={() => handleDecrement(item.id)}
                    >
                      <Text style={styles.quantityBtnText}>−</Text>
                    </Pressable>

                    <Text role="bodyStrong" style={styles.quantityText}>{item.qty}</Text>

                    <Pressable
                      style={styles.quantityBtn}
                      onPress={() => handleIncrement(item.id)}
                    >
                      <Text style={styles.quantityBtnText}>+</Text>
                    </Pressable>

                    <Pressable
                      style={styles.deleteBtn}
                      onPress={() => handleRemoveDirectly(item.id)}
                    >
                      <Icon name="trash-outline" size={18} color={colorPalette.danger} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Box>

        {/* Section: Recommended Products (Quick Add) */}
        <Box padding={spacing[4]} borderBottomWidth={1} borderBottomColor={colorPalette.line}>
          <Text role="titleMd" style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left', marginBottom: spacing[3] }]}>
            قد تعجبك هذه المنتجات أيضاً
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.recommendScroll,
              { flexDirection: isRtl ? 'row-reverse' : 'row' }
            ]}
          >
            {RECOMMENDED_PRODUCTS.map((prod) => (
              <Pressable
                key={prod.id}
                style={styles.recommendCard}
                onPress={() => handleAddRecommendation(prod)}
              >
                <View style={styles.recommendImagePlaceholder}>
                  <Icon name="restaurant-outline" size={24} color={colorPalette.orange} />
                </View>
                <Text role="bodySm" numberOfLines={1} style={styles.recommendTitle}>{prod.title}</Text>
                <Text role="bodySm" style={styles.recommendPrice}>{formatOmaniRial(prod.priceValue)}</Text>

                <View style={styles.recommendAddIcon}>
                  <Icon name="add-circle" size={20} color={colorPalette.deepBlue} />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Box>

        {/* Section: Payment Method */}
        <Box padding={spacing[4]}>
          <Text role="titleMd" style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>طريقة الدفع</Text>
          <View style={styles.paymentList}>
            {paymentMethods.map((method) => {
              const isSelected = selectedMethodId === method.id;
              return (
                <Pressable
                  key={method.id}
                  onPress={() => handleSelectPaymentMethod(method.id)}
                  style={[
                    styles.paymentItem,
                    { flexDirection: isRtl ? 'row' : 'row-reverse' },
                    isSelected && styles.paymentItemSelected,
                  ]}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={[styles.paymentInfo, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
                    <Text role="bodyMd" style={[styles.paymentLabel, isSelected && { color: colorPalette.deepBlue }]}>
                      {method.label}
                    </Text>
                    <Icon name={method.icon as any} size={24} color={isSelected ? colorPalette.deepBlue : colorPalette.deepBlueLighter} />
                  </View>
                </Pressable>
              );
            })}
          </View>
          {selectedMethodId === 'cod' && (
            <Box marginTop={spacing[2]} padding={spacing[3]} backgroundColor={colorPalette.orangeSurface} borderRadius={radius.sm}>
              <Text role="bodySm" style={{ color: colorPalette.orange, textAlign: isRtl ? 'right' : 'left' }}>
                * سيتم إضافة رسوم بسيطة عند اختيار الدفع عند الاستلام.
              </Text>
            </Box>
          )}
        </Box>

        {/* Section: Order Summary (Dynamic recalculation!) */}
        <Box padding={spacing[4]} marginTop={spacing[2]}>
          <Text role="titleMd" style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>ملخص الحساب</Text>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryRow, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
              <Text role="bodyMd" style={styles.summaryLabel}>المجموع الفرعي</Text>
              <Text role="bodyMd" style={styles.summaryValue}>
                {cartItems.length > 0 ? formatOmaniRial(calculatedSubtotal) : (propSubtotal || '0.000 ر.ع.')}
              </Text>
            </View>
            <View style={[styles.summaryRow, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
              <Text role="bodyMd" style={styles.summaryLabel}>رسوم التوصيل</Text>
              <Text role="bodyMd" style={styles.summaryValue}>{deliveryFee}</Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.summaryRow, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
              <Text role="titleMd" style={styles.totalLabel}>الإجمالي</Text>
              <Text role="titleMd" style={styles.totalValue}>
                {cartItems.length > 0 ? formatOmaniRial(calculatedTotal) : (propTotal || '1.500 ر.ع.')}
              </Text>
            </View>
          </View>
        </Box>
      </ScrollView>

      {/* Footer: Confirm Button */}
      <Box padding={spacing[4]} borderTopWidth={1} borderTopColor={colorPalette.line}>
        <Pressable
          style={[styles.confirmButton, cartItems.length === 0 && { opacity: 0.6 }]}
          onPress={cartItems.length > 0 ? onConfirm : undefined}
          disabled={cartItems.length === 0}
        >
          <Text role="titleMd" style={styles.confirmButtonText}>تأكيد الطلب</Text>
        </Pressable>
      </Box>

      {/* Root level safe Toast rendering to prevent clipping */}
      <Toast
        visible={toast?.visible ?? false}
        title={toast?.title ?? ''}
        description={toast?.description}
        tone={toast?.tone}
        onDismiss={() => setToast(null)}
        actionLabel={toast?.actionLabel}
        onActionPress={toast?.onActionPress}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colorPalette.white,
  },
  content: {
    paddingBottom: spacing[8],
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionTitle: {
    color: colorPalette.deepBlue,
    fontWeight: '700',
  },
  sectionIcon: {
    marginHorizontal: spacing[2],
  },
  actionText: {
    color: colorPalette.orange,
    fontWeight: '600',
  },
  addressCard: {
    alignItems: 'flex-start',
  },
  addressInfo: {
    flex: 1,
  },
  addressText: {
    color: colorPalette.deepBlueLighter,
    lineHeight: 22,
  },
  etaRow: {
    alignItems: 'center',
    gap: spacing[2],
  },
  etaText: {
    color: colorPalette.deepBlue,
  },
  emptyCartZone: {
    paddingVertical: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorPalette.lightSurface,
    borderRadius: radius.md,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: colorPalette.line,
  },
  cartList: {
    gap: spacing[3],
  },
  itemCard: {
    backgroundColor: colorPalette.lightSurface,
    padding: spacing[3],
    borderRadius: radius.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorPalette.line,
  },
  itemDetails: {
    flex: 1,
    gap: spacing[1],
  },
  itemTitle: {
    color: colorPalette.deepBlue,
    fontSize: 15,
  },
  itemPrice: {
    color: colorPalette.deepBlueLighter,
  },
  quantityControlRow: {
    alignItems: 'center',
    gap: spacing[2],
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colorPalette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colorPalette.line,
  },
  quantityBtnText: {
    fontSize: 18,
    color: colorPalette.deepBlue,
    fontWeight: '600',
    lineHeight: 20,
  },
  quantityText: {
    minWidth: 24,
    textAlign: 'center',
    color: colorPalette.deepBlue,
    fontSize: 16,
  },
  deleteBtn: {
    padding: spacing[2],
    marginLeft: spacing[1],
  },
  recommendScroll: {
    gap: spacing[3],
    paddingVertical: spacing[1],
  },
  recommendCard: {
    width: 130,
    backgroundColor: colorPalette.white,
    borderWidth: 1,
    borderColor: colorPalette.line,
    borderRadius: radius.md,
    padding: spacing[2],
    alignItems: 'center',
    position: 'relative',
  },
  recommendImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colorPalette.lightSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  recommendTitle: {
    color: colorPalette.deepBlue,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  recommendPrice: {
    color: colorPalette.orange,
    fontSize: 12,
    marginTop: spacing[1],
    fontWeight: '700',
  },
  recommendAddIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  paymentList: {
    marginTop: spacing[4],
  },
  paymentItem: {
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colorPalette.line,
    marginBottom: spacing[3],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  paymentItemSelected: {
    borderColor: colorPalette.deepBlue,
    backgroundColor: colorPalette.lightSurface,
  },
  paymentInfo: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing[3],
  },
  paymentLabel: {
    color: colorPalette.deepBlueLighter,
    fontWeight: '600',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colorPalette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colorPalette.deepBlue,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colorPalette.deepBlue,
  },
  summaryCard: {
    backgroundColor: colorPalette.lightSurface,
    borderRadius: 16,
    padding: spacing[4],
    marginTop: spacing[3],
  },
  summaryRow: {
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  summaryLabel: {
    color: colorPalette.deepBlueLighter,
  },
  summaryValue: {
    color: colorPalette.deepBlue,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colorPalette.line,
    marginVertical: spacing[2],
  },
  totalLabel: {
    color: colorPalette.deepBlue,
    fontWeight: '700',
  },
  totalValue: {
    color: colorPalette.orange,
    fontWeight: '700',
  },
  confirmButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colorPalette.deepBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colorPalette.deepBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: colorPalette.white,
    fontWeight: '700',
  },
});
