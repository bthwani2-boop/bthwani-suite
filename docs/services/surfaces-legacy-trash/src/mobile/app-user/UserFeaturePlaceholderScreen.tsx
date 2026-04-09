/**
 * §86 Placeholder for app-user screens (user domain) when auto_user_* file is not yet present.
 * One component for all user routes per T0 path verification — zero duplication.
 * Displays route label for traceability; uses theme tokens only.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';

function getRouteLabels(t: (key: string) => string): Record<string, string> {
  return {
    UserAddressCreate: t('surfaces.إضافة_عنوان'),
    UserAddressDefaultSet: t('surfaces.تعيين_العنوان_الافتراضي'),
    UserAddressDelete: t('surfaces.حذف_عنوان'),
    UserAddressUpdate: t('surfaces.تعديل_عنوان'),
    UserAddressesList: 'عناويني',
    UserContextGet: t('surfaces.سياق_المستخدم'),
    UserNotificationRead: t('surfaces.قراءة_إشعار'),
    UserNotificationsList: t('surfaces.الإشعارات'),
    UserOtpSend: t('surfaces.إرسال_رمز_التحقق'),
    UserOtpVerify: t('surfaces.التحقق_من_الرمز'),
    UserPreferencesGet: t('surfaces.التفضيلات'),
    UserPreferencesUpdate: t('surfaces.تحديث_التفضيلات'),
    UserProfileUpdate: t('surfaces.تعديل_الملف_الشخصي'),
    UserPushTokenUpsert: t('surfaces.رمز_الدفع'),
    UserSessionCreate: t('surfaces.تسجيل_الدخول'),
    UserSessionEnd: t('surfaces.تسجيل_الخروج'),
    UserSessionRefresh: t('surfaces.تجديد_الجلسة'),
  };
}

export interface UserFeaturePlaceholderScreenProps {
  routeKey?: string;
  navigation?: unknown;
}

export const UserFeaturePlaceholderScreen: React.FC<
  UserFeaturePlaceholderScreenProps
> = ({ routeKey = 'UserFeature' }) => {
  const { t, textAlignStartStyle } = useDirection();
  const ROUTE_LABELS = useMemo(() => getRouteLabels(t), [t]);
  const label = ROUTE_LABELS[routeKey] ?? routeKey;
  return (
    <View style={styles.container}>
      <Text style={[styles.title, textAlignStartStyle]}>{label}</Text>
      <Text style={[styles.subtitle, textAlignStartStyle]}>
        شاشة قيد الإعداد — ربط مع auto_user_* عند توفر الملف
      </Text>
      <View style={styles.card}>
        <Text style={[styles.cardText, textAlignStartStyle]}>
          RouteKey: {routeKey}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    color: semanticRoles.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    color: semanticRoles.textMuted,
    fontSize: 16,
    marginBottom: BTHWANI_SPACING.xl,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardText: {
    color: semanticRoles.text,
    fontSize: 14,
  },
});

export default UserFeaturePlaceholderScreen;
