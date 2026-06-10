import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  Badge,
  borders,
  Box,
  Button,
  Icon,
  KeyValueList,
  SectionHeader,
  Divider,
  Text,
  TextField,
  useTheme,
  colorPalette,
  spacing,
  radius,
} from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import { getDshCaptainFlowPolicy } from '../contracts/dshCaptainBinding.contracts';
import { getDshFlowPolicySummary, resolveDshOnDemandPolicyLabel } from '../../shared/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared';

export type DshCaptainPickupDropoffScreenProps = {
  // ML-029: added 'out-for-delivery' and 'navigating-to-dropoff' in-transit states
  mode: 'pickup' | 'arrival' | 'dropoff' | 'out-for-delivery' | 'navigating-to-dropoff';
  orderId: string;
  storeName: string;
  customerName: string;
  address: string;
  itemsCount: number;
  dropoffOtp?: string;
  onConfirm: () => void;
  onReportIssue: () => void;
  onBack?: () => void;
  // Called when captain rings doorbell — caller updates client SmartTrackingCard to bell_rang proximity state
  onRingBell?: () => void;
};

export function DshCaptainPickupDropoffScreen({
  mode = 'pickup',
  orderId = 'ORD-9021',
  storeName = 'Burger Lab',
  customerName = 'أحمد محمد',
  address = 'حي العليا، الرياض',
  itemsCount = 3,
  dropoffOtp,
  onConfirm,
  onReportIssue,
  onBack,
  onRingBell,
}: DshCaptainPickupDropoffScreenProps) {
  const { theme } = useTheme();
  const pickupFlowPolicy = getDshCaptainFlowPolicy('captain-order-pickup');
  const pickupFlowSummary = getDshFlowPolicySummary('captain-order-pickup');
  const [bellRung, setBellRung] = React.useState(false);
  const [otpInput, setOtpInput] = React.useState('');
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [otpError, setOtpError] = React.useState(false);
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const showsHandoffContext = mode === 'pickup' || mode === 'arrival' || mode === 'dropoff';

  const handleRingBell = () => {
    setBellRung(true);
    onRingBell?.();
  };

  const handleVerifyOtp = () => {
    if (!dropoffOtp) {
      setOtpVerified(true);
      return;
    }
    if (otpInput.trim() === dropoffOtp) {
      setOtpVerified(true);
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  const config = {
    pickup: {
      title: 'استلام من المتجر',
      subtitle: 'تأكد من استلام جميع الأصناف قبل المغادرة.',
      badge: 'مرحلة الاستلام',
      targetLabel: 'المتجر',
      targetValue: storeName,
      cta: 'تأكيد الاستلام',
      checklist: [
        'التأكد من رقم الطلب مطق مع الفاتورة',
        'التحقق من حالة التغليف ودرجة الحرارة',
        'استلام جميع ملحقات الطلب (مشروبات، صوصات)',
      ],
    },
    arrival: {
      title: 'وصول للعميل',
      subtitle: 'أبلغ العميل بوصولك للموقع المحدد.',
      badge: 'وصلت للموقع',
      targetLabel: 'العميل',
      targetValue: customerName,
      cta: 'تأكيد الوصول',
      checklist: [
        'ركن المركبة في مكان آمن',
        'التحقق من دقة الموقع الجغرافي',
        'تجهيز الطلب للتسليم',
      ],
    },
    dropoff: {
      title: 'تسليم الطلب',
      subtitle: 'سلم الطلب للعميل وأنهِ المهمة.',
      badge: 'مرحلة التسليم',
      targetLabel: 'العميل',
      targetValue: customerName,
      cta: 'تأكيد التسليم النهائي',
      checklist: [
        'تسليم الطلب للعميل مباشرة',
        'التأكد من استلام المبلغ (في حال الدفع النقدي)',
        'شكر العميل وطلب تقييم الخدمة',
      ],
    },
    // ML-029: in-transit states between pickup confirmation and dropoff arrival
    'out-for-delivery': {
      title: 'في طريقك للتسليم',
      subtitle: 'الطلب معك وأنت في الطريق للعميل.',
      badge: 'في التوصيل',
      targetLabel: 'العميل',
      targetValue: customerName,
      cta: 'تأكيد الوصول للموقع',
      checklist: [
        'اتبع المسار المحدد لأسرع وصول',
        'تواصل مع العميل إذا لزم الأمر',
      ],
    },
    'navigating-to-dropoff': {
      title: 'التنقل للموقع',
      subtitle: 'أنت في طريقك لنقطة تسليم العميل.',
      badge: 'في التنقل',
      targetLabel: 'الوجهة',
      targetValue: address,
      cta: 'وصلت إلى الموقع',
      checklist: [
        'تحقق من دقة العنوان',
        'أبلغ العميل باقتراب وصولك',
      ],
    },
  }[mode];

  return (
    <DshOperationScreen
      title={config.title}
      subtitle={config.subtitle}
      content={
        <Box gap={4} style={{ paddingHorizontal: spacing[1] }}>
          <Box gap={3}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Badge label={config.badge} tone="warning" />
              <Text role="caption" tone="soft">#{orderId}</Text>
            </Box>

            <KeyValueList
              items={[
                { label: config.targetLabel, value: config.targetValue, tone: 'brand' },
                { label: 'العنوان', value: address },
                { label: 'عدد الأصناف', value: `${itemsCount} أصناف`, tone: 'success' },
              ]}
            />

            <Divider />

            <Box gap={2} paddingY={2}>
              <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
                <Box gap={1} style={{ alignItems: 'flex-end', flex: 1 }}>
                  <Text role="bodyStrong" style={{ textAlign: 'right' }}>سياسة تنفيذ الاستلام والتسليم</Text>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                    {pickupFlowSummary?.nextPolicyActionPreview ?? 'ابدأ بملخص المهمة، ثم افتح قائمة التحقق أو التفاصيل عند الحاجة.'}
                  </Text>
                </Box>
                <Badge label={resolveDshOnDemandPolicyLabel(pickupFlowPolicy)} tone="brand" />
              </Box>
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                {`مالك قرار التصعيد: ${resolveDshControlPanelSectionLabel('operations')}`}
              </Text>
              {showsHandoffContext ? (
                <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                  handoff يظهر هنا فقط ضمن سياق الاستلام أو التسليم، وليس كمسار شريك داخلي مستقل.
                </Text>
              ) : null}
            </Box>
            <Button
              label={detailsVisible ? 'إخفاء قائمة التحقق' : 'فتح قائمة التحقق'}
              tone={detailsVisible ? 'secondary' : 'ghost'}
              size="sm"
              fullWidth={false}
              onPress={() => setDetailsVisible((current) => !current)}
            />
          </Box>

          {detailsVisible ? (
            <>
              <Divider />
              <Box gap={3} style={{ paddingVertical: spacing[1] }}>
                <SectionHeader
                  title="قائمة التحقق"
                  subtitle="يرجى مراجعة النقاط التالية لضمان جودة الخدمة."
                />
                <Box gap={2}>
                  {config.checklist.map((item, index) => (
                    <View key={index} style={styles.checkItem}>
                      <View style={styles.checkCircle}>
                        <Icon name="checkmark" size={12} color={colorPalette.white} />
                      </View>
                      <Text role="bodySm" style={styles.checkText}>{item}</Text>
                    </View>
                  ))}
                </Box>
              </Box>
            </>
          ) : null}

          {mode === 'arrival' && (
            <>
              <Divider />
              <Box gap={2} paddingY={2}>
                <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
                  <Badge label={bellRung ? 'تم قرع الجرس' : 'جرس الوصول'} tone={bellRung ? 'success' : 'warning'} />
                  <Icon name="notifications-outline" size={20} tone={bellRung ? 'success' : 'brand'} />
                </Box>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  {bellRung
                    ? 'تم إرسال إشعار الوصول للعميل. انتظر رده أو انتقل إلى تثبيت التسليم.'
                    : 'اضغط على الجرس لإعلام العميل بوصولك. سيظهر تنبيه الوصول في تطبيقه.'}
                </Text>
                {!bellRung && (
                  <Button label="قرع الجرس" tone="primary" size="sm" fullWidth={false} onPress={handleRingBell} />
                )}
              </Box>

              {dropoffOtp ? (
                <>
                  <Divider />
                  <Box gap={2} paddingY={2}>
                    <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
                      <Badge label={otpVerified ? 'تم التحقق' : 'OTP التسليم'} tone={otpVerified ? 'success' : 'warning'} />
                      <Icon name="shield-checkmark-outline" size={18} tone={otpVerified ? 'success' : 'default'} />
                    </Box>
                    {otpVerified ? (
                      <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.success }}>
                        تم التحقق من رمز التسليم. يمكنك تأكيد التسليم الآن.
                      </Text>
                    ) : (
                      <>
                        <TextField
                          label="رمز التسليم (OTP)"
                          value={otpInput}
                          onChangeText={(v) => { setOtpInput(v); setOtpError(false); }}
                          placeholder="أدخل الرمز المرسل للعميل"
                          keyboardType="number-pad"
                          maxLength={6}
                        />
                        {otpError && (
                          <Text role="caption" style={{ color: theme.danger, textAlign: 'right' }}>
                            الرمز غير صحيح. تحقق من العميل وأعد المحاولة.
                          </Text>
                        )}
                        <Button
                          label="تحقق من الرمز"
                          tone="primary"
                          size="sm"
                          fullWidth={false}
                          disabled={otpInput.trim().length === 0}
                          onPress={handleVerifyOtp}
                        />
                      </>
                    )}
                  </Box>
                </>
              ) : null}
            </>
          )}

          <Box paddingY={2}>
            <Pressable onPress={onReportIssue} style={styles.issueButton}>
              <Icon name="warning-outline" size={16} color={colorPalette.brand} />
              <Text role="bodySm" style={styles.issueText}>أواجه مشكلة في {mode === 'pickup' ? 'الاستلام' : 'التسليم'}</Text>
            </Pressable>
          </Box>
        </Box>
      }
      primaryActionLabel={config.cta}
      onPrimaryAction={onConfirm}
      secondaryActionLabel="الرجوع"
      onSecondaryAction={onBack}
    />
  );
}

const styles = StyleSheet.create({
  checkItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: spacing[3],
    paddingVertical: spacing[1],
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: colorPalette.brandStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkText: {
    flex: 1,
    color: colorPalette.brandStrong,
    textAlign: 'right',
  },
  issueButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderWidth: borders.hairline,
    borderColor: colorPalette.brand,
    borderRadius: radius.md,
    borderStyle: 'dashed',
  },
  issueText: {
    color: colorPalette.brand,
  },
});
