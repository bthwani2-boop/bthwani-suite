/**
 * PartnerMapScreen — Map View for Partner Operations
 * §87 SSoT in packages/surfaces
 * §UX-SUPREME-001: Unified Design - Same Tokens, Layout for all types
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import { ServiceIcon } from '../mobile/components';

export const PartnerMapScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ServiceIcon name="map" size={64} color={semanticRoles.primaryCTA} />
        <Text style={styles.title}>الخريطة</Text>
        <Text style={styles.subtitle}>عرض المتاجر والمواقع على الخريطة</Text>
        <Text style={styles.note}>سيتم إضافة الخريطة قريباً</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  content: {
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
