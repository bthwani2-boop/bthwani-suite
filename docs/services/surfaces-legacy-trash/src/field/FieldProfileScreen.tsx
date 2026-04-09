/**
 * FieldProfileScreen — Profile Screen for Field Operations
 * §87 SSoT in packages/surfaces
 * §UX-SUPREME-001: Unified Design - Same Tokens, Layout for all types
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../mobile/components';
import { AnimatedCard } from '../mobile/components/MicroInteractions';

export interface FieldProfileScreenProps {
  navigation?: { navigate: (name: string) => void };
}

export const FieldProfileScreen: React.FC<FieldProfileScreenProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const ns = 'field.FieldProfileScreen';
  const profileActions = [
    { screen: 'platform_field_profile_get', label: t(`${ns}.accountInfo`), icon: 'person' },
    { screen: 'platform_field_settings', label: t(`${ns}.settings`), icon: 'settings' },
    { screen: 'platform_field_support', label: t(`${ns}.support`), icon: 'support-agent' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <ServiceIcon name="person" size={64} color={semanticRoles.primaryCTA} />
        </View>
        <Text style={styles.name}>{t(`${ns}.accountInfo`)}</Text>
        <Text style={styles.subtitle}>{t(`${ns}.manageAccount`)}</Text>
      </View>

      <View style={styles.section}>
        {profileActions.map((action) => (
          <AnimatedCard
            key={action.screen}
            style={styles.actionCard}
            onPress={() => navigation?.navigate(action.screen)}
          >
            <View style={[styles.actionContent, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.actionIconContainer}>
                <ServiceIcon name={action.icon} size={24} color={semanticRoles.primaryCTA} />
              </View>
              <Text style={styles.actionText}>{action.label}</Text>
              <ServiceIcon name="chevron-right" size={20} color={semanticRoles.textMuted} />
            </View>
          </AnimatedCard>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  content: {
    padding: BTHWANI_SPACING.contentH,
  },
  header: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingVertical: BTHWANI_SPACING.xl,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: semanticRoles.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 3,
    borderColor: semanticRoles.primaryCTA + '20',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  section: {
    gap: BTHWANI_SPACING.md,
  },
  actionCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.primaryCTA + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
});
