// §86 Unified app-user screen — الدعم الفني
// Placeholder until auto_support_tickets_list is wired; uses theme tokens only.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';

export const SupportTicketsListScreen: React.FC<{ navigation?: any }> = ({
  navigation,
}) => {
  const { t, rowStyle, textAlignStartStyle } = useDirection();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.title, textAlignStartStyle]}>
        {t('support.title')}
      </Text>
      <Text style={[styles.subtitle, textAlignStartStyle]}>
        {t('support.subtitle')}
      </Text>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, textAlignStartStyle]}>
          {t('support.live_support')}
        </Text>
        <Text style={[styles.cardText, textAlignStartStyle]}>
          {t('support.no_tickets_message')}
        </Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {t('support.open_new_ticket')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.quickActionsRow, rowStyle]}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            💬 {t('support.whatsapp')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            📞 {t('support.call_support')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, textAlignStartStyle]}>
          {t('support.how_to_use_app')}
        </Text>
        <View style={styles.helpList}>
          <TouchableOpacity style={styles.helpItem}>
            <Text style={[styles.helpItemTitle, textAlignStartStyle]}>
              {t('support.create_order_title')}
            </Text>
            <Text style={[styles.helpItemSubtitle, textAlignStartStyle]}>
              {t('support.create_order_desc')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem}>
            <Text style={[styles.helpItemTitle, textAlignStartStyle]}>
              {t('support.reorder_title')}
            </Text>
            <Text style={[styles.helpItemSubtitle, textAlignStartStyle]}>
              {t('support.reorder_desc')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem}>
            <Text style={[styles.helpItemTitle, textAlignStartStyle]}>
              {t('support.manage_addresses_title')}
            </Text>
            <Text style={[styles.helpItemSubtitle, textAlignStartStyle]}>
              {t('support.manage_addresses_desc')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem}>
            <Text style={[styles.helpItemTitle, textAlignStartStyle]}>
              {t('support.preferences_notifications_title')}
            </Text>
            <Text style={[styles.helpItemSubtitle, textAlignStartStyle]}>
              {t('support.preferences_notifications_desc')}
            </Text>
          </TouchableOpacity>
        </View>
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
  title: {
    color: semanticRoles.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    color: semanticRoles.textMuted,
    fontSize: 16,
    marginBottom: BTHWANI_SPACING.lg,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardTitle: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: BTHWANI_SPACING.sm,
  },
  cardText: {
    color: semanticRoles.text,
    fontSize: 14,
    marginBottom: BTHWANI_SPACING.lg,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.lg,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor: semanticRoles.surface,
  },
  secondaryButtonText: {
    color: semanticRoles.text,
    fontSize: 14,
    fontWeight: '500',
  },
  helpList: {
    marginTop: BTHWANI_SPACING.md,
  },
  helpItem: {
    paddingVertical: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.surfaceSubtle,
  },
  helpItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  helpItemSubtitle: {
    fontSize: 13,
    color: semanticRoles.textMuted,
  },
});

export default SupportTicketsListScreen;
