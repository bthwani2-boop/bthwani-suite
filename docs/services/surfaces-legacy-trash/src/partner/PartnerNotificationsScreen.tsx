/**
 * PartnerNotificationsScreen — إشعارات الشريك
 * §UX-SUPREME-001: Operational notifications (orders, bookings, payments)
 */

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../mobile/components/ServiceIcon';

interface PartnerNotificationsScreenProps {
  navigation?: { navigate: (name: string) => void };
}

interface Notification {
  id: string;
  type: 'order' | 'booking' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const PartnerNotificationsScreen: React.FC<PartnerNotificationsScreenProps> = ({
  navigation,
}) => {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const screenState: ScreenState = notifications.length === 0 ? 'empty' : 'content';

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.notificationCardUnread,
      ]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: semanticRoles.stateInfo.background }]}>
        <ServiceIcon name="notifications" size={24} color={semanticRoles.stateInfo.icon} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      state={screenState}
      emptyMessage={t('partner.PartnerNotificationsScreen.empty')}
      screenName="PartnerNotificationsScreen"
      operationName="partner_notifications_list"
    >
      <View style={styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBlock}>
              <ServiceIcon name="notifications-off" size={64} color={semanticRoles.textMuted} />
              <Text style={styles.emptyText}>{t('partner.PartnerNotificationsScreen.empty')}</Text>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  listContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xxl,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  notificationCardUnread: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '08',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  emptyBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.md,
  },
});

export default PartnerNotificationsScreen;
