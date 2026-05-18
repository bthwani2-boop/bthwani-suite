import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  Badge,
  Button,
  Divider,
  Icon,
  Radio,
  SectionHeader,
  spacing,
  Surface,
  Switch,
  Text,
  TextField,
  useTheme,
} from '@bthwani/ui-kit';
import { subscriptionHeroCopy, subscriptionPlanCards } from '../data/subscriptions-commercial.preview-data';

export type DshSubscriptionsScreenProps = {};

export function DshSubscriptionsScreen({}: DshSubscriptionsScreenProps = {}) {
  const { theme } = useTheme();

  // 1. Core Plan States
  const initialCurrentPlanId = subscriptionPlanCards.find((plan) => plan.current)?.id ?? 'weekly';
  const [currentPlanId, setCurrentPlanId] = React.useState(initialCurrentPlanId);
  const [selectedPlanId, setSelectedPlanId] = React.useState(initialCurrentPlanId);

  // 2. Payment Method States
  const [paymentProfileIndex, setPaymentProfileIndex] = React.useState(0);
  const [showPaymentOptions, setShowPaymentOptions] = React.useState(false);

  // 3. Auto-Renew State
  const [autoRenew, setAutoRenew] = React.useState(true);

  // 4. Coupon States
  const [couponOpen, setCouponOpen] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = React.useState(0); // 0.2 for 20% discount

  // 5. Success State
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const paymentProfiles = React.useMemo(
    () => [
      { id: 'mada', label: 'مدى **** 4821', detail: 'تنتهي 03/27' },
      { id: 'visa', label: 'Visa **** 9055', detail: 'تنتهي 11/28' },
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

  const applySelectedPlan = () => {
    setCurrentPlanId(selectedPlan.id);
    setSuccessMessage(`تم تحديث اشتراكك وتفعيل باقة (${selectedPlan.title}) بنجاح!`);
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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing[4], gap: spacing[4], paddingBottom: spacing[6] }}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Banner */}
      {successMessage ? (
        <Surface
          tone="raised"
          padding={3}
          style={{
            borderRadius: 16,
            backgroundColor: theme.successSurface,
            borderColor: theme.success,
            borderWidth: 1,
          }}
        >
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[3] }}>
            <Icon name="checkmark-circle" tone="success" size={24} />
            <Text role="bodyStrong" style={{ color: theme.success, textAlign: 'right', flex: 1 }}>
              {successMessage}
            </Text>
          </View>
        </Surface>
      ) : null}

      {/* Main Hero Header */}
      <Surface tone="raised" gap={2} padding={4} style={{ borderRadius: 24, borderWidth: 1, borderColor: theme.line }}>
        <SectionHeader
          title={subscriptionHeroCopy.title}
          subtitle={subscriptionHeroCopy.subtitle}
          trailing={<Badge tone="brand" label={subscriptionHeroCopy.eyebrow} />}
        />
        <Divider style={{ marginVertical: spacing[1] }} />
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {subscriptionHeroCopy.note}
        </Text>
      </Surface>

      {/* Plans Section */}
      <View style={{ gap: spacing[3] }}>
        <Text role="titleSm" style={{ textAlign: 'right', paddingHorizontal: spacing[2] }}>
          الباقات المتاحة للاشتراك
        </Text>

        {subscriptionPlanCards.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isSelected = plan.id === selectedPlanId;

          return (
            <Surface
              key={plan.id}
              tone={isSelected ? 'raised' : 'default'}
              padding={4}
              gap={3}
              style={{
                borderRadius: 20,
                borderWidth: 2,
                borderColor: isSelected ? theme.brand : isCurrent ? theme.success : theme.line,
                backgroundColor: isSelected ? theme.surfaceRaised : theme.surface,
              }}
            >
              <Pressable
                onPress={() => {
                  setSelectedPlanId(plan.id);
                  setSuccessMessage(null);
                }}
                style={{ width: '100%', gap: spacing[2] }}
              >
                {/* Plan Header */}
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                    <Text role="titleMd" style={{ textAlign: 'right', color: isSelected ? theme.brand : theme.text }}>
                      {plan.title}
                    </Text>
                    {plan.highlight ? (
                      <Badge label={plan.highlight} tone={plan.id === 'family' ? 'warning' : 'info'} />
                    ) : null}
                  </View>

                  {/* Status Indicator Badge */}
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                    {isCurrent ? <Badge label="الخطة الحالية" tone="success" /> : null}
                    {isSelected && !isCurrent ? <Badge label="مختارة" tone="brand" /> : null}
                    {!isSelected && !isCurrent ? (
                      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: theme.lineStrong }} />
                    ) : (
                      <Icon name="checkmark-circle" tone={isCurrent ? 'success' : 'brand'} size={22} />
                    )}
                  </View>
                </View>

                {/* Plan Price details */}
                <View style={{ flexDirection: 'row-reverse', alignItems: 'baseline', gap: spacing[1] }}>
                  <Text role="titleLg" style={{ color: isSelected ? theme.brand : theme.text }}>
                    {plan.price} ريال
                  </Text>
                  <Text role="bodySm" tone="muted">
                    / {plan.cadence.includes('أسبوع') ? 'أسبوع' : 'شهر'}
                  </Text>
                </View>

                {/* Details Accordion (Opens directly under the selected plan) */}
                {isSelected ? (
                  <View
                    style={{
                      marginTop: spacing[2],
                      gap: spacing[2],
                      borderTopWidth: 1,
                      borderTopColor: theme.line,
                      paddingTop: spacing[3],
                    }}
                  >
                    <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.brand, marginBottom: spacing[1] }}>
                      مزايا الباقة ومواصفاتها:
                    </Text>
                    {plan.note.split(' • ').map((feature, idx) => (
                      <View key={idx} style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2], justifyContent: 'flex-start' }}>
                        <Icon name="checkmark-circle" tone="brand" size={16} />
                        <Text role="bodyMd" style={{ textAlign: 'right', flex: 1 }}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text role="caption" tone="muted" numberOfLines={1} style={{ textAlign: 'right' }}>
                    {plan.note}
                  </Text>
                )}
              </Pressable>
            </Surface>
          );
        })}
      </View>

      {/* Payment Method Section */}
      <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 24, borderWidth: 1, borderColor: theme.line }}>
        <Pressable
          onPress={() => setShowPaymentOptions((prev) => !prev)}
          style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
        >
          <View style={{ gap: spacing[1], alignItems: 'flex-end', flex: 1 }}>
            <Text role="titleSm" style={{ textAlign: 'right' }}>
              طريقة الدفع
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              اختر طريقة الدفع المفضلة لديك أو غيرها
            </Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
            <Text role="bodyStrong" style={{ color: theme.brand }}>
              {selectedPaymentProfile.label}
            </Text>
            <Icon name={showPaymentOptions ? 'chevron-up' : 'chevron-down'} tone="brand" size={20} />
          </View>
        </Pressable>

        {/* Payment Dropdown immediately underneath */}
        {showPaymentOptions ? (
          <View
            style={{
              marginTop: spacing[2],
              gap: spacing[2],
              borderTopWidth: 1,
              borderTopColor: theme.line,
              paddingTop: spacing[3],
            }}
          >
            {paymentProfiles.map((profile, index) => {
              const active = index === paymentProfileIndex;
              return (
                <Radio
                  key={profile.id}
                  label={profile.label}
                  description={profile.detail}
                  selected={active}
                  onSelect={() => {
                    setPaymentProfileIndex(index);
                    setShowPaymentOptions(false);
                  }}
                  style={{
                    padding: spacing[3],
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: active ? theme.brand : theme.line,
                    backgroundColor: active ? theme.brandSurface : theme.surface,
                    width: '100%',
                  }}
                />
              );
            })}
          </View>
        ) : null}
      </Surface>

      {/* Auto-Renewal Toggle Section */}
      <Surface tone="raised" padding={4} style={{ borderRadius: 24, borderWidth: 1, borderColor: theme.line }}>
        <Switch
          label="التجديد التلقائي للاشتراك"
          description="تفعيل هذا الخيار يضمن استمرار مميزات بثواني برو دون انقطاع."
          value={autoRenew}
          onValueChange={setAutoRenew}
        />
      </Surface>

      {/* Coupon & Promotions Section */}
      <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 24, borderWidth: 1, borderColor: theme.line }}>
        <Pressable
          onPress={() => setCouponOpen((prev) => !prev)}
          style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
        >
          <View style={{ gap: spacing[1], alignItems: 'flex-end', flex: 1 }}>
            <Text role="titleSm" style={{ textAlign: 'right' }}>
              هل لديك قسيمة اشتراك؟
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              أضف قسيمة للحصول على خصومات حصرية
            </Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
            {appliedCoupon ? <Badge label="نشطة" tone="success" /> : null}
            <Icon name={couponOpen ? 'chevron-up' : 'chevron-down'} tone="brand" size={20} />
          </View>
        </Pressable>

        {/* Coupon input form directly underneath */}
        {couponOpen ? (
          <View
            style={{
              marginTop: spacing[2],
              gap: spacing[3],
              borderTopWidth: 1,
              borderTopColor: theme.line,
              paddingTop: spacing[3],
            }}
          >
            {appliedCoupon ? (
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: spacing[3],
                  backgroundColor: theme.successSurface,
                  borderRadius: 16,
                  width: '100%',
                }}
              >
                <View style={{ alignItems: 'flex-end', flex: 1 }}>
                  <Text role="bodyStrong" style={{ color: theme.success, textAlign: 'right' }}>
                    تم تطبيق القسيمة ({appliedCoupon}) بنجاح!
                  </Text>
                  <Text role="bodySm" style={{ color: theme.success, textAlign: 'right' }}>
                    حصلت على خصم 20% على باقتك الحالية.
                  </Text>
                </View>
                <Pressable
                  onPress={handleRemoveCoupon}
                  style={{
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[2],
                    borderRadius: 12,
                    backgroundColor: theme.danger,
                  }}
                >
                  <Text role="bodyStrong" style={{ color: theme.brandContrast }}>
                    إزالة
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={{ gap: spacing[2] }}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2], width: '100%' }}>
                  <View style={{ flex: 1 }}>
                    <TextField
                      placeholder="مثال: BTH20"
                      value={couponCode}
                      onChangeText={(t) => {
                        setCouponCode(t);
                        setCouponError(null);
                      }}
                      error={couponError ?? undefined}
                    />
                  </View>
                  <Button
                    label="تطبيق"
                    size="md"
                    tone="brand"
                    fullWidth={false}
                    onPress={handleApplyCoupon}
                    style={{ height: 48, alignSelf: 'flex-start' }}
                  />
                </View>
                {couponError ? (
                  <Text role="caption" tone="danger" style={{ textAlign: 'right' }}>
                    {couponError}
                  </Text>
                ) : (
                  <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                    أدخل الرمز BTH20 للحصول على خصم 20% تجريبي.
                  </Text>
                )}
              </View>
            )}
          </View>
        ) : null}
      </Surface>

      {/* Change Summary Card */}
      <Surface
        tone="raised"
        padding={4}
        gap={3}
        style={{
          borderRadius: 24,
          borderWidth: 1,
          borderColor: theme.line,
          backgroundColor: theme.brandSurface,
        }}
      >
        <Text role="titleSm" style={{ textAlign: 'right', color: theme.brand }}>
          ملخص التغييرات
        </Text>
        <Divider style={{ marginVertical: spacing[1] }} />

        <View style={{ gap: spacing[2] }}>
          {/* Current Plan vs Selected */}
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text role="bodySm" tone="muted">الباقة الحالية</Text>
            <Text role="bodyStrong">{currentPlan.title}</Text>
          </View>

          {currentPlanId !== selectedPlanId ? (
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodySm" tone="muted">الباقة الجديدة المحددة</Text>
              <Text role="bodyStrong" style={{ color: theme.brand }}>{selectedPlan.title}</Text>
            </View>
          ) : null}

          {/* Payment Method */}
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text role="bodySm" tone="muted">طريقة الدفع</Text>
            <Text role="bodyStrong">{selectedPaymentProfile.label}</Text>
          </View>

          {/* Auto Renew Status */}
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text role="bodySm" tone="muted">التجديد التلقائي</Text>
            <Text role="bodyStrong" style={{ color: autoRenew ? theme.success : theme.danger }}>
              {autoRenew ? 'نشط دورياً' : 'غير نشط'}
            </Text>
          </View>

          {/* Coupon discount details */}
          {appliedCoupon ? (
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodySm" tone="muted">الخصم المطبق (20%)</Text>
              <Text role="bodyStrong" style={{ color: theme.success }}>
                -{discountAmount.toFixed(0)} ريال
              </Text>
            </View>
          ) : null}

          <Divider style={{ marginVertical: spacing[1] }} />

          {/* Final Total Amount */}
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text role="bodyStrong" style={{ color: theme.text }}>المجموع الإجمالي</Text>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'baseline', gap: spacing[1] }}>
              {appliedCoupon ? (
                <Text role="bodySm" tone="muted" style={{ textDecorationLine: 'line-through', marginLeft: spacing[2] }}>
                  {originalPrice} ريال
                </Text>
              ) : null}
              <Text role="titleLg" style={{ color: theme.brand }}>
                {finalPrice.toFixed(0)} ريال
              </Text>
              <Text role="bodySm" tone="muted">
                / {selectedPlan.cadence.includes('أسبوع') ? 'أسبوع' : 'شهر'}
              </Text>
            </View>
          </View>
        </View>
      </Surface>

      {/* One single primary CTA button */}
      <Button
        label={selectedPlanId === currentPlanId ? 'حفظ وإرسال التعديلات' : 'تأكيد وترقية الاشتراك'}
        tone="brand"
        onPress={applySelectedPlan}
        style={{ marginTop: spacing[2], borderRadius: 16 }}
      />
    </ScrollView>
  );
}

export default DshSubscriptionsScreen;
