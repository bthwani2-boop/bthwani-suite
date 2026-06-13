import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  Badge,
  Button,
  Divider,
  Icon,
  spacing,
  Switch,
  Text,
  TextField,
  ActionStrip,
  useTheme,
  radius,
} from '@bthwani/ui-kit';
import type { SubscriptionClientCard } from '../../shared/commercial-contract';

export type DshSubscriptionsScreenProps = {
  compact?: boolean;
  plans?: SubscriptionClientCard[];
  heroCopy?: { eyebrow?: string; title?: string; subtitle?: string; note?: string };
  onStatusChange?: (message: string) => void;
};

export function DshSubscriptionsScreen({
  compact = false,
  plans = [],
  heroCopy,
  onStatusChange,
}: DshSubscriptionsScreenProps = {}) {
  const { theme } = useTheme();
  const subscriptionPlanCards = plans;
  const subscriptionHeroCopy = heroCopy ?? { eyebrow: 'بثواني برو', title: 'الاشتراكات', subtitle: 'دفع وتبديل وإدارة من نفس الصفحة.', note: '' };

  // Core Plan States
  const initialCurrentPlanId = subscriptionPlanCards.find((plan) => plan.current)?.id ?? 'weekly';
  const [currentPlanId, setCurrentPlanId] = React.useState(initialCurrentPlanId);
  const [selectedPlanId, setSelectedPlanId] = React.useState(initialCurrentPlanId);

  // Accordion State
  const [expandedSection, setExpandedSection] = React.useState<'plan' | 'payment' | 'renew' | 'coupon' | null>(null);

  // Payment Method States
  const [paymentProfileIndex, setPaymentProfileIndex] = React.useState(0);

  // Auto-Renew State
  const [autoRenew, setAutoRenew] = React.useState(true);

  // Coupon States
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = React.useState(0);

  // Success State
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const paymentProfiles = React.useMemo(
    () => [
      { id: 'mada', label: 'مدى **** 4821', detail: 'تنتهي 03/27', icon: 'card' as const },
      { id: 'visa', label: 'Visa **** 9055', detail: 'تنتهي 11/28', icon: 'card' as const },
      { id: 'applepay', label: 'Apple Pay', detail: 'الافتراضي', icon: 'phone-portrait' as const },
    ],
    [],
  );

  const selectedPlan = subscriptionPlanCards.find((plan) => plan.id === selectedPlanId) ?? subscriptionPlanCards[0];
  const currentPlan = subscriptionPlanCards.find((plan) => plan.id === currentPlanId) ?? subscriptionPlanCards[0];
  const selectedPaymentProfile = paymentProfiles[paymentProfileIndex % paymentProfiles.length];

  // Price calculations
  const originalPrice = parseFloat(selectedPlan.price);
  const discountAmount = appliedCoupon ? originalPrice * couponDiscount : 0;
  const finalPrice = originalPrice - discountAmount;

  // Change flags
  const isPlanChanged = selectedPlanId !== currentPlanId;
  const isPaymentChanged = paymentProfileIndex !== 0;
  const isAutoRenewChanged = autoRenew !== true;
  const isCouponChanged = appliedCoupon !== null;

  const hasChanges = isPlanChanged || isPaymentChanged || isAutoRenewChanged || isCouponChanged;

  const applyChanges = () => {
    setCurrentPlanId(selectedPlanId);
    setExpandedSection(null);
    setSuccessMessage('تم تأكيد التغييرات وتحديث حالة الاشتراك بنجاح!');
    onStatusChange?.('تم تأكيد التغييرات وتحديث حالة الاشتراك بنجاح!');
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    const cleanedCode = couponCode.trim().toUpperCase();
    if (cleanedCode === 'BTH20') {
      setAppliedCoupon('BTH20');
      setCouponDiscount(0.2); // 20% off
      setCouponError(null);
    } else if (cleanedCode === '') {
      setCouponError('الرجاء إدخال رمز القسيمة أولاً');
    } else {
      setCouponError('رمز القسيمة غير صالح. جرب استخدام BTH20');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError(null);
  };

  const toggleSection = (section: 'plan' | 'payment' | 'renew' | 'coupon') => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'transparent' }} // Removed background container color
      contentContainerStyle={{ paddingBottom: spacing[10] }}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Message */}
      {successMessage && (
        <View style={{ margin: spacing[4], backgroundColor: theme.successSurface, padding: spacing[3], borderRadius: radius.sm2, borderWidth: 1, borderColor: theme.success, flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
          <Icon name="checkmark-circle" tone="success" size={20} />
          <Text role="bodyStrong" style={{ color: theme.success, textAlign: 'right', flex: 1 }}>
            {successMessage}
          </Text>
        </View>
      )}

      {/* Current Plan Minimal Flat Display */}
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[4], borderBottomWidth: 8, borderBottomColor: theme.surface }}>

        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ alignItems: 'flex-end', gap: spacing[1] }}>
            <Text role="titleMd" style={{ color: theme.brand }}>{currentPlan.title}</Text>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1] }}>
              <Icon name="checkmark-circle" tone="success" size={14} />
              <Text role="bodySm" tone="success">خطة نشطة</Text>
            </View>
          </View>
          <View style={{ alignItems: 'baseline', flexDirection: 'row-reverse', gap: spacing[1] }}>
            <Text role="titleMd" style={{ color: theme.text }}>{currentPlan.price} ريال</Text>
            <Text role="bodySm" tone="muted">/ {currentPlan.cadence.includes('أسبوع') ? 'أسبوع' : 'شهر'}</Text>
          </View>
        </View>
        {currentPlan.note.split(' • ')[0] && (
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginTop: spacing[3] }}>
            أهم ميزة: {currentPlan.note.split(' • ')[0]}
          </Text>
        )}
      </View>

      {/* Action Strip List (Completely Flat, No Containers) */}
      <View style={{ paddingTop: spacing[4] }}>
        <Text role="bodyStrong" tone="muted" style={{ textAlign: 'right', paddingHorizontal: spacing[4], marginBottom: spacing[2] }}>خيارات التحكم</Text>

        {/* Flat Divider Top */}
        <Divider />

        {/* Change Plan Strip */}
        <View>
          <ActionStrip
            icon="cube"
            title="تغيير الباقة"
            subtitle={selectedPlanId !== currentPlanId ? selectedPlan.title : 'اختر باقة تناسبك'}
            expanded={expandedSection === 'plan'}
            onPress={() => toggleSection('plan')}
            hideDivider
          >
            <View style={{ gap: spacing[4] }}>
              {subscriptionPlanCards.map((plan, index) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <View key={plan.id}>
                    {index > 0 && <Divider style={{ marginBottom: spacing[4] }} />}
                    <Pressable onPress={() => setSelectedPlanId(plan.id)} style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', gap: spacing[3], flex: 1 }}>
                        <View style={{ marginTop: 2 }}>
                          <Icon name={isSelected ? 'checkmark-circle' : 'ellipse-outline'} tone={isSelected ? 'brand' : 'muted'} size={24} />
                        </View>
                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                          <Text role="bodyStrong" style={{ color: isSelected ? theme.brand : theme.text }}>{plan.title}</Text>
                          {plan.highlight ? <Text role="caption" tone="brand" style={{ marginTop: 2 }}>{plan.highlight}</Text> : null}
                          <Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginTop: spacing[1] }}>{plan.note}</Text>
                        </View>
                      </View>
                      <Text role="bodyStrong" style={{ color: theme.text, marginLeft: spacing[2] }}>{plan.price} ريال</Text>
                    </Pressable>
                    {isSelected && plan.id !== currentPlanId && (
                      <View style={{ alignItems: 'flex-start', marginTop: spacing[3], marginRight: 36 }}>
                        <Button label="اختيار هذه الباقة" tone="brand" size="sm" onPress={() => setExpandedSection(null)} style={{ borderRadius: radius.xs2 }} />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ActionStrip>
        </View>
        <Divider />

        {/* Payment Strip */}
        <View>
          <ActionStrip
            icon="card"
            title="طريقة الدفع"
            subtitle={<Text role="bodySm" tone="muted" style={{ direction: 'ltr' }}>{selectedPaymentProfile.label}</Text>}
            expanded={expandedSection === 'payment'}
            onPress={() => toggleSection('payment')}
            hideDivider
          >
            <View style={{ gap: spacing[4] }}>
              {paymentProfiles.map((profile, index) => {
                const active = index === paymentProfileIndex;
                return (
                  <View key={profile.id}>
                    {index > 0 && <Divider style={{ marginBottom: spacing[4] }} />}
                    <Pressable onPress={() => setPaymentProfileIndex(index)} style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[3], flex: 1 }}>
                         <Icon name={active ? 'checkmark-circle' : 'ellipse-outline'} tone={active ? 'brand' : 'muted'} size={24} />
                         <Icon name={profile.icon} tone="muted" size={24} />
                         <View style={{ alignItems: 'flex-end', flex: 1 }}>
                            <Text role="bodyStrong" style={{ color: active ? theme.brand : theme.text }}>{profile.label}</Text>
                            <Text role="caption" tone="muted">{profile.detail}</Text>
                         </View>
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ActionStrip>
        </View>
        <Divider />

        {/* Auto Renew Strip */}
        <View>
          <ActionStrip
            icon="refresh"
            title="التجديد التلقائي"
            subtitle={<Text role="bodySm" tone={autoRenew ? 'success' : 'muted'}>{autoRenew ? 'مُفعل' : 'مُعطل'}</Text>}
            expanded={expandedSection === 'renew'}
            onPress={() => toggleSection('renew')}
            hideDivider
          >
            <View>
              <Switch label="تفعيل التجديد التلقائي" description="لضمان استمرار المزايا بدون انقطاع" value={autoRenew} onValueChange={setAutoRenew} />
            </View>
          </ActionStrip>
        </View>
        <Divider />

        {/* Coupon Strip */}
        <View>
          <ActionStrip
            icon="pricetag"
            title="القسيمة الترويجية"
            subtitle={
                appliedCoupon ? (
                  <Text role="bodySm" tone="success">تم التطبيق: {appliedCoupon}</Text>
                ) : (
                  <Text role="bodySm" tone="muted">أضف رمز الخصم</Text>
                )
            }
            expanded={expandedSection === 'coupon'}
            onPress={() => toggleSection('coupon')}
            hideDivider
          >
               {appliedCoupon ? (
                  <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                     <View style={{ alignItems: 'flex-end', flex: 1 }}>
                        <Text role="bodyStrong" tone="success" style={{ textAlign: 'right' }}>تم تطبيق القسيمة ({appliedCoupon})</Text>
                        <Text role="caption" tone="success" style={{ textAlign: 'right' }}>خصم {couponDiscount * 100}% نشط</Text>
                     </View>
                     <Button label="إزالة" size="sm" tone="danger" onPress={handleRemoveCoupon} />
                  </View>
               ) : (
                  <View style={{ gap: spacing[2] }}>
                     <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                        <View style={{ flex: 1 }}>
                           <TextField placeholder="رمز القسيمة" value={couponCode} onChangeText={(t) => { setCouponCode(t); setCouponError(null); }} error={couponError ?? undefined} />
                        </View>
                        <Button label="تطبيق" size="md" tone="brand" onPress={handleApplyCoupon} style={{ height: 48 }} />
                     </View>
                  </View>
               )}
          </ActionStrip>
        </View>
        <Divider />
      </View>

      {/* Summary Section (Only when changes are present) */}
      {hasChanges && (
         <View style={{ padding: spacing[4], gap: spacing[3], marginTop: spacing[2] }}>
            <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.brand }}>ملخص التعديلات</Text>
            <Divider />

            <View style={{ gap: spacing[3] }}>
               <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text role="bodySm" tone="muted">الباقة</Text>
                  <Text role="bodyStrong" style={{ color: isPlanChanged ? theme.brand : theme.text }}>{selectedPlan.title}</Text>
               </View>
               <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text role="bodySm" tone="muted">الدفع</Text>
                  <Text role="bodyStrong" style={{ direction: 'ltr', color: isPaymentChanged ? theme.brand : theme.text }}>{selectedPaymentProfile.label}</Text>
               </View>
               <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text role="bodySm" tone="muted">التجديد</Text>
                  <Text role="bodyStrong" style={{ color: isAutoRenewChanged ? (autoRenew ? theme.success : theme.danger) : theme.text }}>{autoRenew ? 'نشط' : 'معطل'}</Text>
               </View>
               {appliedCoupon && (
                  <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Text role="bodySm" tone="muted">الخصم</Text>
                     <Text role="bodyStrong" tone="success">-{discountAmount.toFixed(0)} ريال</Text>
                  </View>
               )}
               <Divider />
               <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'baseline', marginTop: spacing[1] }}>
                  <Text role="bodyStrong" style={{ color: theme.text }}>المجموع الإجمالي</Text>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'baseline', gap: spacing[1] }}>
                     {appliedCoupon && (
                        <Text role="bodySm" tone="muted" style={{ textDecorationLine: 'line-through', marginLeft: spacing[2] }}>
                           {originalPrice} ريال
                        </Text>
                     )}
                     <Text role="titleLg" style={{ color: theme.brand }}>{finalPrice.toFixed(0)} ريال</Text>
                  </View>
               </View>
            </View>
            <Button label="تأكيد التغييرات" tone="brand" size="lg" onPress={applyChanges} style={{ marginTop: spacing[4], borderRadius: radius.sm2 }} />
         </View>
      )}

    </ScrollView>
  );
}

export default DshSubscriptionsScreen;
