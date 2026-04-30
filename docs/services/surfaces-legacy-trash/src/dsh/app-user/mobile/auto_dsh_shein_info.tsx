// SHEIN Info Screen – App Client Mobile
// Surface: app-client | Service: dsh
// Information screen about SHEIN proxy service

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';

interface Props {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const SheinInfoScreen: React.FC<Props> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [screenState, setScreenState] = useState<'content' | 'navigating'>('content');

  const handleCreateRequest = async () => {
    setScreenState('navigating');

    // Simulate brief loading for UX feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    const screen = 'DshExternalOrderCreate';
    onNavigate?.(screen);
    navigation?.navigate(screen);
  };

  return (
    <ScreenWrapper state="content" screenName="SheinInfoScreen">
      <ScrollView style={styles.container}>
        <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.title}>خدمة SHEIN بالوكالة</Text>
          <Text style={styles.subtitle}>
            اشترِ منتجات SHEIN بسهولة من خلال خدماتنا
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ما هي الخدمة؟</Text>
            <Text style={styles.sectionText}>
              خدمة SHEIN بالوكالة تتيح لك شراء أي منتج من موقع SHEIN الإلكتروني.
              نحن نقوم بشراء المنتج نيابة عنك وشحنه إليك مباشرة.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>كيف تعمل؟</Text>
            <View style={styles.stepsList}>
              <View style={[styles.step, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  اختر المنتج من موقع SHEIN وانسخ رابط المنتج
                </Text>
              </View>

              <View style={[styles.step, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  أدخل التفاصيل (الرابط، الكمية، المقاس، الملاحظات) في نموذج الطلب
                </Text>
              </View>

              <View style={[styles.step, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  {t('dsh.app-client.mobile.auto_dsh_shein_info.reviewNotice')}
                </Text>
              </View>

              <View style={[styles.step, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>
                  {t('dsh.app-client.mobile.auto_dsh_shein_info.approveNotice')}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>مزايا الخدمة</Text>
            <View style={styles.benefitsList}>
              <View style={[styles.benefit, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.benefitBullet}>•</Text>
                <Text style={styles.benefitText}>شحن مجاني للطلبات فوق 50 دولار</Text>
              </View>
              <View style={[styles.benefit, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.benefitBullet}>•</Text>
                <Text style={styles.benefitText}>تتبع كامل للطلب من البداية للنهاية</Text>
              </View>
              <View style={[styles.benefit, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.benefitBullet}>•</Text>
                <Text style={styles.benefitText}>دعم فني على مدار الساعة</Text>
              </View>
              <View style={[styles.benefit, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.benefitBullet}>•</Text>
                <Text style={styles.benefitText}>ضمان استلام المنتج أو استرداد المبلغ</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>أسعار الخدمة</Text>
            <Text style={styles.sectionText}>
              رسوم الخدمة تبدأ من 3 دولارات حسب قيمة المنتج والشحن.
              السعر النهائي يشمل: سعر المنتج + الشحن الدولي + رسوم الخدمة.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>أوقات التسليم</Text>
            <Text style={styles.sectionText}>
              متوسط وقت التسليم: 15-20 يوم من تاريخ الشراء.
              قد يختلف حسب الموقع الجغرافي والظروف الجوية.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>تنبيه مهم:</Text>
            <Text style={styles.warningText}>
              تأكد من صحة رابط المنتج والمواصفات المطلوبة قبل التقديم.
              جميع الطلبات تخضع للمراجعة والموافقة.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.ctaButton, screenState === 'navigating' && styles.ctaButtonDisabled]}
            onPress={handleCreateRequest}
            disabled={screenState === 'navigating'}
          >
            <Text style={styles.ctaText}>
              {screenState === 'navigating' ? t('dsh.app-client.mobile.auto_dsh_shein_info.loadingMessage') : 'ابدأ طلبك الآن'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.borderSubtle,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
  },
  content: {
    padding: BTHWANI_SPACING.contentH,
  },
  section: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 22,
  },
  stepsList: {
    gap: BTHWANI_SPACING.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BTHWANI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: BTHWANI_COLORS.onPrimary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 20,
  },
  benefitsList: {
    gap: BTHWANI_SPACING.sm,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.sm,
  },
  benefitBullet: {
    fontSize: 16,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
    marginTop: -2,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: BTHWANI_COLORS.warningSubtle,
    borderRadius: 8,
    padding: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.lg,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  warningText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 20,
  },
  footer: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  ctaButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: 999,
    paddingVertical: BTHWANI_SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: BTHWANI_COLORS.onPrimary,
  },
});

const auto_dsh_shein_info = SheinInfoScreen;
export default auto_dsh_shein_info;

