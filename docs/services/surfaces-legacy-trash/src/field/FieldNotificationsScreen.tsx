/**
 * FieldNotificationsScreen — Notifications Screen for Field Operations
 * §87 SSoT in packages/surfaces
 * §UX-SUPREME-001: Unified Design - Same Tokens, Layout for all types
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import { ServiceIcon } from '../mobile/components';

export const FieldNotificationsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.emptyContainer}>
        <ServiceIcon name="notifications" size={64} color={semanticRoles.primaryCTA} />
        <Text style={styles.title}>الإشعارات</Text>
        <Text style={styles.subtitle}>لا توجد إشعارات جديدة</Text>
        <Text style={styles.note}>سيتم عرض الإشعارات هنا</Text>
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
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
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
    marginBottom: BTHWANI_SPACING.md,
  },
  note: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontStyle: 'italic',
  },
});
