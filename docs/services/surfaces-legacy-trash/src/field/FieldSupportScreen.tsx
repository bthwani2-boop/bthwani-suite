/**
 * FieldSupportScreen — Support Screen for Field Operations
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

export const FieldSupportScreen: React.FC = () => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const ns = 'field.FieldSupportScreen';
  const supportActions = [
    { label: t(`${ns}.callSupport`), icon: 'phone', action: () => {} },
    { label: t(`${ns}.messageSupport`), icon: 'message', action: () => {} },
    { label: t(`${ns}.faq`), icon: 'help', action: () => {} },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <ServiceIcon name="support-agent" size={64} color={semanticRoles.primaryCTA} />
        <Text style={styles.title}>{t(`${ns}.title`)}</Text>
        <Text style={styles.subtitle}>{t(`${ns}.subtitle`)}</Text>
      </View>

      <View style={styles.section}>
        {supportActions.map((action, index) => (
          <AnimatedCard
            key={index}
            style={styles.actionCard}
            onPress={action.action}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
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
