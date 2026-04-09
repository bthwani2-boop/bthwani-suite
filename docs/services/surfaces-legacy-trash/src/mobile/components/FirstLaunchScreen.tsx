/**
 * FirstLaunchScreen - شاشة الترحيب الأولى بعد التثبيت
 * تظهر مرة واحدة عند أول فتح للتطبيق (صورة أو فيديو قصير).
 * الصورة/الفيديو يُضاف لاحقاً عبر الـ props.
 *
 * §UX: أول شيء يظهر للمستخدم في كل التطبيقات (app-user, app-partner, app-captain, app-field).
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import { ServiceIcon } from './ServiceIcon';

export interface FirstLaunchScreenProps {
  /** عند الضغط على "تخطي" أو عند إنهاء المشاهدة */
  onContinue: () => void;
  /** مصدر الصورة (اختياري — إن لم يُمرَّر يُعرض placeholder) */
  imageSource?: ImageSourcePropType | null;
  /** عنوان الترحيب (اختياري) */
  welcomeTitle?: string;
  /** نص توضيحي تحت الوسائط (اختياري) */
  subtitle?: string;
  /** محتوى إضافي (أزرار تسجيل الدخول وغيرها) يُعرض تحت الوسائط */
  children?: React.ReactNode;
  /** تخصيص نمط الحاوية */
  style?: ViewStyle;
}

const DEFAULT_WELCOME_KEY = 'surfaces.مرحبا_بك';
const DEFAULT_SUBTITLE =
  'وفر أكثر، تسوّق أسرع واستمتع بمزايا خاصة عند تسجيل الدخول أو عندما تنشئ حساباً';

export const FirstLaunchScreen: React.FC<FirstLaunchScreenProps> = ({
  onContinue,
  imageSource,
  welcomeTitle,
  subtitle = DEFAULT_SUBTITLE,
  children,
  style,
}) => {
  const { t } = useI18n();
  const displayTitle = welcomeTitle ?? t(DEFAULT_WELCOME_KEY);
  return (
    <View style={[styles.container, style]}>
      {/* زر تخطي — أعلى اليمين */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={onContinue}
        activeOpacity={0.8}
        accessibilityLabel={t('mobile.app-user.FirstLaunchScreen.skip')}
      >
        <Text style={styles.skipText}>{t('mobile.app-user.FirstLaunchScreen.skip')}</Text>
      </TouchableOpacity>

      {/* منطقة الصورة أو الفيديو — تُضاف الوسائط لاحقاً */}
      <View style={styles.mediaContainer}>
        {imageSource != null ? (
          <Image
            source={imageSource}
            style={styles.media}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.mediaPlaceholder}>
            <ServiceIcon name="image" size={48} color={semanticRoles.textMuted} />
            <Text style={styles.placeholderText}>
              الصورة أو الفيديو سوف تُضاف لاحقاً
            </Text>
          </View>
        )}
      </View>

      {/* نص الترحيب والنص التوضيحي */}
      <View style={styles.textBlock}>
        <Text style={styles.welcomeTitle}>{displayTitle}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {/* محتوى إضافي: أزرار تسجيل الدخول، إلخ */}
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
  },
  skipButton: {
    position: 'absolute',
    top: BTHWANI_SPACING.lg,
    end: BTHWANI_SPACING.lg,
    zIndex: 10,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  skipText: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  mediaContainer: {
    width: '100%',
    flex: 1,
    minHeight: 200,
    maxHeight: '50%',
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  placeholderText: {
    marginTop: BTHWANI_SPACING.md,
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  textBlock: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textSecondary,
    lineHeight: 22,
  },
  actions: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
    gap: BTHWANI_SPACING.md,
  },
});

export default FirstLaunchScreen;
