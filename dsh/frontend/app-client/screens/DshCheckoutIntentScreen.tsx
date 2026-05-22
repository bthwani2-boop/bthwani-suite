// Removed Ionicons import
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  Box,
  Button,
  Surface,
  Text,
  TopBar,
  colorPalette,
  spacing,
  useDirection,
  StateView,
  radius,
  Icon,
} from '@bthwani/ui-kit';

export type DshCheckoutIntentScreenProps = {
  // ML-006: order-created; ML-009: payment-failed; ML-010: quote-unavailable; ML-015: quote-loading/quote-failed/quote-success
  state?: 'ready' | 'loading' | 'quote-loading' | 'quote-failed' | 'quote-success' | 'error' | 'payment-failed' | 'quote-unavailable' | 'disabled' | 'blocked' | 'order-created';
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
};

function CheckoutContextNotice({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <Box margin={spacing[4]} padding={spacing[4]} backgroundColor={colorPalette.lightSurface} borderRadius={radius.md}>
      <Text role="titleSm" style={{ color: colorPalette.deepBlue, marginBottom: spacing[1] }}>{title}</Text>
      <Text role="bodySm" style={{ color: colorPalette.deepBlueLighter, lineHeight: 20 }}>{body}</Text>
    </Box>
  );
}

export function DshCheckoutIntentScreen({
  state = 'ready',
  address = 'مسقط، الخوير، شارع المها، بناية رقم 123',
  subtotal = '12.500 ر.ع.',
  deliveryFee = '1.500 ر.ع.',
  total = '14.000 ر.ع.',
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
}: DshCheckoutIntentScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  if (state === 'loading') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تأكيد الطلب" />
        <StateView stateId="loading" title="جاري التحقق من التوفر..." description="نحن نتأكد من إمكانية التوصيل لموقعك حالياً." />
      </Surface>
    );
  }

  // ML-015: explicit quote-loading state separate from generic loading
  if (state === 'quote-loading') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تأكيد الطلب" />
        <StateView stateId="loading" title="جاري حساب تكلفة التوصيل..." description="يُرجى الانتظار بينما نحسب التكلفة والوقت المتوقع." />
      </Surface>
    );
  }

  if (state === 'order-created') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تم إنشاء الطلب" />
        <StateView
          stateId="success"
          title="تم تأكيد طلبك بنجاح"
          description="سيتم إعلامك عند قبول المتجر للطلب وبدء التحضير."
          actionLabel="تتبع الطلب"
          onActionPress={onViewOrder}
        />
        <CheckoutContextNotice
          title="رؤية الطلب بعد الإنشاء"
          body="التتبع والدعم والبدائل ستبقى داخل نفس الطلب فقط. أي رؤية دفع أو استرداد لاحقة ستظهر كمرجع WLT للقراءة فقط."
        />
      </Surface>
    );
  }

  if (state === 'error' || state === 'payment-failed') {
    return (
      <Surface style={styles.root}>
        <TopBar title="فشل الدفع" />
        <StateView
          stateId="error"
          title="تعذّر إتمام الدفع"
          description={paymentErrorMessage}
          actionLabel="إعادة المحاولة"
          onActionPress={onRetry}
        />
        <CheckoutContextNotice
          title="حدود الدفع والاسترداد"
          body="قرار الدفع أو الاسترداد يبقى لدى WLT. هذه الشاشة تشرح الفشل وتعيدك للمسار الصحيح فقط، ولا تنفذ أي تعديل مالي محلي."
        />
      </Surface>
    );
  }

  // ML-015: quote failed — serviceability calculation error
  if (state === 'quote-failed') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تأكيد الطلب" />
        <StateView
          stateId="error"
          title="تعذّر حساب تكلفة التوصيل"
          description="تعذّر الحصول على عرض سعر التوصيل. يُرجى المحاولة مرة أخرى."
          actionLabel="إعادة المحاولة"
          onActionPress={onRetry}
        />
      </Surface>
    );
  }

  // ML-015: quote success — serviceability confirmed, ready to confirm order
  if (state === 'quote-success') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تأكيد الطلب" />
        <StateView
          stateId="success"
          title="تم التحقق من التوصيل"
          description="التوصيل متاح إلى عنوانك. يمكنك تأكيد الطلب الآن."
          actionLabel="تأكيد الطلب"
          onActionPress={onConfirm}
        />
      </Surface>
    );
  }

  if (state === 'blocked' || state === 'quote-unavailable') {
    return (
      <Surface style={styles.root}>
        <TopBar title="الخدمة غير متوفرة" />
        <StateView
          stateId="blocked"
          title="عذراً، الموقع خارج نطاق التغطية"
          description="المتجر لا يدعم التوصيل إلى عنوانك الحالي في الوقت الحالي."
          actionLabel="تغيير العنوان"
          onActionPress={onChangeAddress}
        />
        <CheckoutContextNotice
          title="عدم التوفر والبدائل"
          body="عدم التوفر هنا يعني غياب الخدمة أو التغطية لهذا العنوان. إذا توفرت بدائل أو handoff لاحق فسيظهر داخل نفس الطلب، وليس عبر شاشة مالية مستقلة."
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
      <TopBar title="تأكيد الطلب" />
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
            <Text role="bodyMd" style={styles.etaText}>الوقت المتوقع للوصول: <Text role="titleSm" style={{ color: colorPalette.orange }}>{eta}</Text></Text>
          </View>
        </Box>

        <CheckoutContextNotice
          title="سياق الطلب والـ WLT"
          body="Checkout intent يسلّم قرار الدفع إلى WLT فقط. إذا تعثر الدفع أو ظهر refund لاحق فستبقى الرؤية للقراءة فقط هنا، بينما البدائل أو نفاد العناصر ستفتح من داخل الطلب نفسه."
        />

        {/* Section: Payment Method */}
        <Box padding={spacing[4]}>
          <Text role="titleMd" style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>طريقة الدفع</Text>
          <View style={styles.paymentList}>
            {paymentMethods.map((method) => (
              <Pressable
                key={method.id}
                onPress={() => onSelectPaymentMethod?.(method.id)}
                style={[
                  styles.paymentItem,
                  { flexDirection: isRtl ? 'row' : 'row-reverse' },
                  method.isSelected && styles.paymentItemSelected,
                ]}
              >
                <View style={[styles.radioCircle, method.isSelected && styles.radioCircleActive]}>
                  {method.isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={[styles.paymentInfo, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
                  <Text role="bodyMd" style={[styles.paymentLabel, method.isSelected && { color: colorPalette.deepBlue }]}>
                    {method.label}
                  </Text>
                  <Icon name={method.icon as string} size={24} color={method.isSelected ? colorPalette.deepBlue : colorPalette.deepBlueLighter} />
                </View>
              </Pressable>
            ))}
          </View>
          {paymentMethods.find(m => m.id === 'cod' && m.isSelected) && (
            <Box marginTop={spacing[2]} padding={spacing[3]} backgroundColor={colorPalette.orangeSurface} borderRadius={radius.sm}>
              <Text role="bodySm" style={{ color: colorPalette.orange, textAlign: isRtl ? 'right' : 'left' }}>
                * سيتم إضافة رسوم بسيطة عند اختيار الدفع عند الاستلام.
              </Text>
            </Box>
          )}
        </Box>

        {/* Section: Order Summary */}
        <Box padding={spacing[4]} marginTop={spacing[2]}>
          <Text role="titleMd" style={[styles.sectionTitle, { textAlign: isRtl ? 'right' : 'left' }]}>ملخص الحساب</Text>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryRow, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
              <Text role="bodyMd" style={styles.summaryLabel}>المجموع الفرعي</Text>
              <Text role="bodyMd" style={styles.summaryValue}>{subtotal}</Text>
            </View>
            <View style={[styles.summaryRow, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
              <Text role="bodyMd" style={styles.summaryLabel}>رسوم التوصيل</Text>
              <Text role="bodyMd" style={styles.summaryValue}>{deliveryFee}</Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.summaryRow, { flexDirection: isRtl ? 'row' : 'row-reverse' }]}>
              <Text role="titleMd" style={styles.totalLabel}>الإجمالي</Text>
              <Text role="titleMd" style={styles.totalValue}>{total}</Text>
            </View>
          </View>
        </Box>
      </ScrollView>

      {/* Footer: Confirm Button */}
      <Box padding={spacing[4]} borderTopWidth={1} borderTopColor={colorPalette.line}>
        <Pressable style={styles.confirmButton} onPress={onConfirm}>
          <Text role="titleMd" style={styles.confirmButtonText}>تأكيد الطلب</Text>
        </Pressable>
      </Box>
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
  },
  sectionIcon: {
    marginHorizontal: spacing[2],
  },
  actionText: {
    color: colorPalette.orange,
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
  },
  divider: {
    height: 1,
    backgroundColor: colorPalette.line,
    marginVertical: spacing[2],
  },
  totalLabel: {
    color: colorPalette.deepBlue,
  },
  totalValue: {
    color: colorPalette.orange,
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
  },
});
