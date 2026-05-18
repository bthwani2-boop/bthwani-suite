import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  Badge,
  Button,
  Divider,
  Icon,
  Radio,
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

  // 1. Tab State
  const [activeTab, setActiveTab] = React.useState<'my-plan' | 'plans' | 'payment' | 'benefits'>('my-plan');

  // 2. Core Plan States
  const initialCurrentPlanId = subscriptionPlanCards.find((plan) => plan.current)?.id ?? 'weekly';
  const [currentPlanId, setCurrentPlanId] = React.useState(initialCurrentPlanId);
  const [selectedPlanId, setSelectedPlanId] = React.useState(initialCurrentPlanId);

  // 3. Payment Method States
  const [paymentProfileIndex, setPaymentProfileIndex] = React.useState(0);
  const [showPaymentOptions, setShowPaymentOptions] = React.useState(false);

  // 4. Auto-Renew State
  const [autoRenew, setAutoRenew] = React.useState(true);

  // 5. Coupon States
  const [couponOpen, setCouponOpen] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = React.useState(0); // 0.2 for 20% discount

  // 6. Success State
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
    setCurrentPlanId(selectedPlanId);
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

  // Change flags
  const isPlanChanged = selectedPlanId !== currentPlanId;
  const isPaymentChanged = paymentProfileIndex !== 0;
  const isAutoRenewChanged = autoRenew !== true;
  const isCouponChanged = appliedCoupon !== null;

  const hasChanges = isPlanChanged || isPaymentChanged || isAutoRenewChanged || isCouponChanged;

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

      {/* Flat Header section */}
      <View style={{ gap: spacing[1], paddingHorizontal: spacing[2], marginBottom: spacing[1] }}>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text role="titleLg" style={{ textAlign: 'right', color: theme.text }}>
            {subscriptionHeroCopy.title}
          </Text>
          <Badge tone="brand" label={subscriptionHeroCopy.eyebrow} />
        </View>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {subscriptionHeroCopy.subtitle}
        </Text>
      </View>

      {/* Tabs Menu */}
      <View
        style={{
          flexDirection: 'row-reverse',
          borderBottomWidth: 1,
          borderBottomColor: theme.line,
          marginBottom: spacing[2],
        }}
      >
        {[
          { id: 'my-plan', label: 'خطتي' },
          { id: 'plans', label: 'الباقات' },
          { id: 'payment', label: 'الدفع' },
          { id: 'benefits', label: 'المزايا' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => {
                setActiveTab(tab.id as any);
                setSuccessMessage(null);
              }}
              style={{
                flex: 1,
                paddingVertical: spacing[3],
                borderBottomWidth: 2,
                borderBottomColor: isActive ? theme.brand : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                role="bodyStrong"
                style={{
                  color: isActive ? theme.brand : theme.text,
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Tab Contents */}
      {activeTab === 'my-plan' && (
        <View style={{ gap: spacing[4] }}>
          <View
            style={{
              padding: spacing[4],
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.line,
              backgroundColor: theme.surface,
              gap: spacing[3],
            }}
          >
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Text role="titleMd" style={{ color: theme.brand }}>
                  {currentPlan.title}
                </Text>
                <Badge label="الخطة النشطة" tone="success" />
              </View>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'baseline', gap: spacing[1] }}>
                <Text role="titleLg" style={{ color: theme.text }}>
                  {currentPlan.price} ريال
                </Text>
                <Text role="bodySm" tone="muted">
                  / {currentPlan.cadence.includes('أسبوع') ? 'أسبوع' : 'شهر'}
                </Text>
              </View>
            </View>

            <Divider style={{ marginVertical: spacing[1] }} />

            <Switch
              label="التجديد التلقائي للاشتراك"
              description="تفعيل هذا الخيار يضمن استمرار مميزات بثواني برو دون انقطاع."
              value={autoRenew}
              onValueChange={setAutoRenew}
            />

            <Divider style={{ marginVertical: spacing[1] }} />

            <View style={{ gap: spacing[2] }}>
              <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.text }}>
                مزايا خطتك الحالية:
              </Text>
              {currentPlan.note.split(' • ').map((feature, idx) => (
                <View key={idx} style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                  <Icon name="checkmark-circle" tone="success" size={16} />
                  <Text role="bodyMd" style={{ textAlign: 'right', flex: 1 }}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {activeTab === 'plans' && (
        <View style={{ gap: spacing[3] }}>
          <Text role="titleSm" style={{ textAlign: 'right', paddingHorizontal: spacing[1] }}>
            الباقات المتاحة للاشتراك
          </Text>

          {subscriptionPlanCards.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const isSelected = plan.id === selectedPlanId;

            return (
              <View
                key={plan.id}
                style={{
                  borderRadius: 16,
                  borderWidth: isSelected ? 1.5 : 1,
                  borderColor: isSelected ? theme.brand : theme.line,
                  backgroundColor: theme.surface,
                  overflow: 'hidden',
                }}
              >
                <Pressable
                  onPress={() => {
                    setSelectedPlanId(plan.id);
                    setSuccessMessage(null);
                  }}
                  style={{
                    padding: spacing[3.5],
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: spacing[2],
                  }}
                >
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[3], flex: 1 }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: isSelected ? theme.brand : theme.lineStrong,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && (
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.brand }} />
                      )}
                    </View>

                    <View style={{ gap: spacing[0.5], alignItems: 'flex-end', flex: 1 }}>
                      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
                        <Text role="bodyStrong" style={{ color: isSelected ? theme.brand : theme.text }}>
                          {plan.title}
                        </Text>
                        {plan.highlight ? (
                          <Badge label={plan.highlight} tone={plan.id === 'family' ? 'warning' : 'info'} />
                        ) : null}
                        {isCurrent ? <Badge label="الخطة الحالية" tone="success" /> : null}
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row-reverse', alignItems: 'baseline', gap: spacing[1] }}>
                    <Text role="titleMd" style={{ color: isSelected ? theme.brand : theme.text }}>
                      {plan.price} ريال
                    </Text>
                    <Text role="caption" tone="muted">
                      / {plan.cadence.includes('أسبوع') ? 'أسبوع' : 'شهر'}
                    </Text>
                  </View>
                </Pressable>

                {isSelected && (
                  <View
                    style={{
                      padding: spacing[3.5],
                      backgroundColor: theme.brandSurface,
                      borderTopWidth: 1,
                      borderTopColor: theme.line,
                      gap: spacing[3],
                    }}
                  >
                    <View style={{ gap: spacing[2] }}>
                      <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.brand }}>
                        مزايا الباقة:
                      </Text>
                      {plan.note.split(' • ').map((feature, idx) => (
                        <View key={idx} style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                          <Icon name="checkmark-circle" tone="brand" size={14} />
                          <Text role="bodyMd" style={{ textAlign: 'right', flex: 1 }}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {!isCurrent && (
                      <Button
                        label="اختيار هذه الباقة"
                        tone="brand"
                        onPress={applySelectedPlan}
                        style={{ borderRadius: 12, marginTop: spacing[1] }}
                      />
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {activeTab === 'payment' && (
        <View style={{ gap: spacing[4] }}>
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.line,
              backgroundColor: theme.surface,
              overflow: 'hidden',
            }}
          >
            <Pressable
              onPress={() => setShowPaymentOptions((prev) => !prev)}
              style={{
                padding: spacing[4],
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ gap: spacing[1], alignItems: 'flex-end', flex: 1 }}>
                <Text role="bodyStrong" style={{ color: theme.text }}>
                  طريقة الدفع الحالية
                </Text>
                <Text role="bodySm" tone="muted">
                  المستعملة في عمليات التجديد والترقية تلقائياً
                </Text>
              </View>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Text role="bodyStrong" style={{ color: theme.brand }}>
                  {selectedPaymentProfile.label}
                </Text>
                <Icon name={showPaymentOptions ? 'chevron-up' : 'chevron-down'} tone="brand" size={20} />
              </View>
            </Pressable>

            {showPaymentOptions && (
              <View
                style={{
                  padding: spacing[3],
                  backgroundColor: theme.brandSurface,
                  borderTopWidth: 1,
                  borderTopColor: theme.line,
                  gap: spacing[2],
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
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: active ? theme.brand : theme.line,
                        backgroundColor: active ? theme.surface : 'transparent',
                        width: '100%',
                      }}
                    />
                  );
                })}
              </View>
            )}
          </View>

          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.line,
              backgroundColor: theme.surface,
              overflow: 'hidden',
            }}
          >
            <Pressable
              onPress={() => setCouponOpen((prev) => !prev)}
              style={{
                padding: spacing[4],
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ gap: spacing[1], alignItems: 'flex-end', flex: 1 }}>
                <Text role="bodyStrong" style={{ color: theme.text }}>
                  هل لديك قسيمة اشتراك ترويجية؟
                </Text>
                <Text role="bodySm" tone="muted">
                  أدخل رمز القسيمة للحصول على خصم فوري
                </Text>
              </View>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                {appliedCoupon ? (
                  <Badge label="نشطة" tone="success" />
                ) : (
                  <Text role="bodyStrong" style={{ color: theme.brand }}>
                    إضافة
                  </Text>
                )}
                <Icon name={couponOpen ? 'chevron-up' : 'chevron-down'} tone="brand" size={20} />
              </View>
            </Pressable>

            {couponOpen && (
              <View
                style={{
                  padding: spacing[3],
                  backgroundColor: theme.brandSurface,
                  borderTopWidth: 1,
                  borderTopColor: theme.line,
                  gap: spacing[3],
                }}
              >
                {appliedCoupon ? (
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: spacing[3],
                      backgroundColor: theme.surface,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: theme.success,
                      width: '100%',
                    }}
                  >
                    <View style={{ alignItems: 'flex-end', flex: 1 }}>
                      <Text role="bodyStrong" style={{ color: theme.success, textAlign: 'right' }}>
                        تم تطبيق القسيمة ({appliedCoupon})
                      </Text>
                      <Text role="caption" tone="success" style={{ textAlign: 'right' }}>
                        خصم 20% ساري على الباقة المختارة
                      </Text>
                    </View>
                    <Pressable
                      onPress={handleRemoveCoupon}
                      style={{
                        paddingHorizontal: spacing[3],
                        paddingVertical: spacing[2],
                        borderRadius: 8,
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
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                      <View style={{ flex: 1 }}>
                        <TextField
                          placeholder="أدخل رمز القسيمة (مثال: BTH20)"
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
                        style={{ height: 48 }}
                      />
                    </View>
                    {couponError ? (
                      <Text role="caption" tone="danger" style={{ textAlign: 'right' }}>
                        {couponError}
                      </Text>
                    ) : (
                      <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                        أدخل رمز القسيمة BTH20 للحصول على خصم 20% تجريبي.
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}

      {activeTab === 'benefits' && (
        <View style={{ gap: spacing[3] }}>
          <Text role="titleSm" style={{ textAlign: 'right', paddingHorizontal: spacing[1] }}>
            مزايا ومنافع "بثواني برو"
          </Text>

          <View
            style={{
              padding: spacing[4],
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.line,
              backgroundColor: theme.surface,
              gap: spacing[4],
            }}
          >
            {[
              {
                icon: 'checkmark-circle',
                title: 'توصيل مجاني وسريع',
                desc: 'احصل على توصيل مجاني كامل لجميع طلباتك المؤهلة من المتاجر المشاركة مع أولوية وسرعة تسليم مضاعفة.',
              },
              {
                icon: 'checkmark-circle',
                title: 'عروض وخصومات حصرية',
                desc: 'الوصول الحصري لأقوى العروض وحملات الخصم الترويجية الخاصة بالمشتركين فقط بالتعاون مع شركائنا.',
              },
              {
                icon: 'checkmark-circle',
                title: 'حزمة مشاركة عائلية',
                desc: 'أضف أفراد عائلتك في حساب واحد مشترك للاستمتاع بجميع المزايا مع باقة برو عائلي المتكاملة.',
              },
            ].map((benefit, idx) => (
              <View key={idx} style={{ flexDirection: 'row-reverse', gap: spacing[3], alignItems: 'flex-start' }}>
                <View style={{ marginTop: spacing[1] }}>
                  <Icon name={benefit.icon} tone="brand" size={20} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text role="bodyStrong" style={{ color: theme.text, textAlign: 'right' }}>
                    {benefit.title}
                  </Text>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginTop: spacing[0.5] }}>
                    {benefit.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Change Summary Card & bottom CTA - Appears ONLY when actual modifications are present */}
      {hasChanges && (
        <View style={{ gap: spacing[3], marginTop: spacing[2] }}>
          <View
            style={{
              padding: spacing[4],
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.line,
              backgroundColor: theme.brandSurface,
              gap: spacing[2],
            }}
          >
            <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.brand }}>
              ملخص التغييرات
            </Text>
            <Divider style={{ marginVertical: spacing[1] }} />

            <View style={{ gap: spacing[2] }}>
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text role="bodySm" tone="muted">الباقة الحالية</Text>
                <Text role="bodyStrong">{currentPlan.title}</Text>
              </View>

              {isPlanChanged && (
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text role="bodySm" tone="muted">الباقة الجديدة المحددة</Text>
                  <Text role="bodyStrong" style={{ color: theme.brand }}>{selectedPlan.title}</Text>
                </View>
              )}

              {isPaymentChanged && (
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text role="bodySm" tone="muted">طريقة الدفع الجديدة</Text>
                  <Text role="bodyStrong">{selectedPaymentProfile.label}</Text>
                </View>
              )}

              {isAutoRenewChanged && (
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text role="bodySm" tone="muted">التجديد التلقائي</Text>
                  <Text role="bodyStrong" style={{ color: autoRenew ? theme.success : theme.danger }}>
                    {autoRenew ? 'نشط دورياً' : 'غير نشط'}
                  </Text>
                </View>
              )}

              {appliedCoupon && (
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text role="bodySm" tone="muted">الخصم المطبق (20%)</Text>
                  <Text role="bodyStrong" style={{ color: theme.success }}>
                    -{discountAmount.toFixed(0)} ريال
                  </Text>
                </View>
              )}

              <Divider style={{ marginVertical: spacing[1] }} />

              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text role="bodyStrong" style={{ color: theme.text }}>المجموع الإجمالي</Text>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'baseline', gap: spacing[1] }}>
                  {appliedCoupon && (
                    <Text role="bodySm" tone="muted" style={{ textDecorationLine: 'line-through', marginLeft: spacing[2] }}>
                      {originalPrice} ريال
                    </Text>
                  )}
                  <Text role="titleLg" style={{ color: theme.brand }}>
                    {finalPrice.toFixed(0)} ريال
                  </Text>
                  <Text role="bodySm" tone="muted">
                    / {selectedPlan.cadence.includes('أسبوع') ? 'أسبوع' : 'شهر'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Button
            label={isPlanChanged ? 'تأكيد وترقية الاشتراك' : 'حفظ وإرسال التعديلات'}
            tone="brand"
            onPress={applySelectedPlan}
            style={{ borderRadius: 16 }}
          />
        </View>
      )}
    </ScrollView>
  );
}

export default DshSubscriptionsScreen;
