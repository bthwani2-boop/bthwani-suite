// Auto-generated screen for platform_captain_support
// Surface: app-captain | Service: platform
// Operation: GET /api/support
// Description: Unified support and help screen

import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components/ServiceIcon';

interface SupportItem {
  id: string;
  title: string;
  description: string;
  icon: 'emergency' | 'phone' | 'email' | 'build' | 'bug-report' | 'help' | 'menu-book';
  action: 'call' | 'email' | 'navigate' | 'link';
  value?: string;
}

interface AutoPlatformCaptainSupportProps {
  navigation?: any;
}

export const AutoPlatformCaptainSupport: React.FC<AutoPlatformCaptainSupportProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const supportItems: SupportItem[] = [
    { id: 'emergency', title: t('platform.app-captain.mobile.auto_platform_captain_support.forEmergenciesAndSafety'), description: t('platform.app-captain.mobile.auto_platform_captain_support.forEmergenciesAndSafety'), icon: 'emergency', action: 'call', value: '911' },
    { id: 'customer_support', title: t('platform.app-captain.mobile.auto_platform_captain_support.generalInquiriesAndHelp'), description: t('platform.app-captain.mobile.auto_platform_captain_support.generalInquiriesAndHelp'), icon: 'phone', action: 'call', value: '+9668001234567' },
    { id: 'technical_support', title: t('platform.app-captain.mobile.auto_platform_captain_support.appIssuesAndTroubleshooting'), description: t('platform.app-captain.mobile.auto_platform_captain_support.appIssuesAndTroubleshooting'), icon: 'build', action: 'email', value: 'support@bthwani.example' },
    { id: 'report_issue', title: t('platform.app-captain.mobile.auto_platform_captain_support.reportServiceIssue'), description: t('platform.app-captain.mobile.auto_platform_captain_support.reportServiceIssue'), icon: 'bug-report', action: 'navigate', value: 'platform_captain_incident_create' },
    { id: 'faq', title: t('platform.app-captain.mobile.auto_platform_captain_support.faq'), description: t('platform.app-captain.mobile.auto_platform_captain_support.faq'), icon: 'help', action: 'link', value: 'https://bthwani.com/faq' },
    { id: 'user_guide', title: t('platform.app-captain.mobile.auto_platform_captain_support.learnHowToUseApp'), description: t('platform.app-captain.mobile.auto_platform_captain_support.learnHowToUseApp'), icon: 'menu-book', action: 'link', value: 'https://bthwani.com/guide' },
  ];

  const handleSupportAction = useCallback(async (item: SupportItem) => {
    switch (item.action) {
      case 'call':
        const phoneUrl = `tel:${item.value}`;
        try {
          await Linking.openURL(phoneUrl);
        } catch (error) {
          Alert.alert(t('platform.app-captain.mobile.auto_platform_captain_support.cannotPlaceCall'), t('platform.app-captain.mobile.auto_platform_captain_support.cannotPlaceCall'));
        }
        break;

      case 'email':
        const emailUrl = `mailto:${item.value}`;
        try {
          await Linking.openURL(emailUrl);
        } catch (error) {
          Alert.alert(t('platform.app-captain.mobile.auto_platform_captain_support.cannotOpenEmailApp'), t('platform.app-captain.mobile.auto_platform_captain_support.cannotOpenEmailApp'));
        }
        break;

      case 'navigate':
        navigation?.navigate(item.value);
        break;

      case 'link':
        try {
          await Linking.openURL(item.value!);
        } catch (error) {
          Alert.alert(t('platform.app-captain.mobile.auto_platform_captain_support.cannotOpenLink'), t('platform.app-captain.mobile.auto_platform_captain_support.cannotOpenLink'));
        }
        break;
    }
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>الدعم والمساعدة</Text>
          <Text style={styles.subtitle}>نحن هنا لمساعدتك في أي وقت</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>خيارات الدعم</Text>
          <View style={styles.sectionCard}>
            {supportItems.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, idx < supportItems.length - 1 && styles.menuItemBorder, { flexDirection: 'row', direction: layoutDirection }]}
                onPress={() => handleSupportAction(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuItemLeft, { flexDirection: 'row', direction: layoutDirection }]}>
                  <View style={styles.menuItemIcon}>
                    <ServiceIcon name={item.icon} size={22} color={semanticRoles.primaryCTA} />
                  </View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemLabel}>{item.title}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                </View>
                <ServiceIcon name="chevron-left" size={20} color={semanticRoles.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>معلومات التواصل</Text>
          <View style={styles.infoCard}>
            <Text style={styles.contactText}>
              دعم العملاء: 24/7{'\n'}
              الدعم الفني: 8 صباحاً - 8 مساءً{'\n'}
              البريد: support@bthwani.example{'\n'}
              الموقع: www.bthwani.com
            </Text>
          </View>

          <Text style={styles.sectionTitle}>تنبيه</Text>
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>في حالات الطوارئ</Text>
            <Text style={styles.emergencyText}>
              اتصل برقم الطوارئ فوراً. سلامتك وأمانك أولويتنا الأولى.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: BTHWANI_SPACING.xl * 2 },
  header: {
    paddingVertical: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  menuItemText: { flex: 1 },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  menuItemDescription: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    lineHeight: 22,
  },
  emergencyCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  emergencyText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    lineHeight: 20,
  },
});

export default AutoPlatformCaptainSupport;
