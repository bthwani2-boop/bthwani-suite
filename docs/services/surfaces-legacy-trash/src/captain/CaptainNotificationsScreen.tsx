/**
 * CaptainNotificationsScreen — Operational Notifications/Inbox
 * §UX-SUPREME-001: Operational alerts only, zero noise
 * 
 * Features:
 * - Operational notifications (trip/order/status changes)
 * - Filter: Current Trip / All
 * - Quick actions
 * - No non-operational notifications during trip
 */

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../mobile/components/ServiceIcon';

interface CaptainNotificationsScreenProps {
  navigation?: any;
}

interface Notification {
  id: string;
  type: 'trip' | 'order' | 'status' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    screen: string;
  };
}

export const CaptainNotificationsScreen: React.FC<CaptainNotificationsScreenProps> = ({
  navigation,
}) => {
  const { t } = useI18n();
  const [filter, setFilter] = useState<'all' | 'current'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const screenState: ScreenState = notifications.length === 0 ? 'empty' : 'content';

  const renderNotification = ({ item }: { item: Notification }) => {
    const getIcon = () => {
      switch (item.type) {
        case 'trip':
          return 'directions-car';
        case 'order':
          return 'restaurant';
        case 'status':
          return 'info';
        default:
          return 'notifications';
      }
    };

    const getColor = () => {
      switch (item.type) {
        case 'trip':
          return semanticRoles.stateInfo;
        case 'order':
          return semanticRoles.stateWarning;
        case 'status':
          return semanticRoles.stateSuccess;
        default:
          return semanticRoles.stateInfo;
      }
    };

    const color = getColor();

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.read && styles.notificationCardUnread,
        ]}
        onPress={() => {
          if (item.action) {
            navigation?.navigate(item.action.screen);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: color.background }]}>
          <ServiceIcon name={getIcon()} size={24} color={color.icon} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        {item.action && (
          <ServiceIcon name="chevron-left" size={20} color={semanticRoles.textMuted} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper
      state={screenState}
      emptyMessage={t('surfaces.captain_notifications_empty')}
      screenName={t('surfaces.CaptainNotificationsScreen')}
      operationName="captain_notifications"
    >
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        {/* Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}
            >
              {t('surfaces.captain_filter_all')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'current' && styles.filterButtonActive]}
            onPress={() => setFilter('current')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'current' && styles.filterTextActive,
              ]}
            >
              {t('surfaces.captain_filter_current_trip')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ServiceIcon name="notifications-off" size={64} color={semanticRoles.textMuted} />
              <Text style={styles.emptyText}>{t('surfaces.captain_notifications_empty')}</Text>
            </View>
          }
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  filterButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  filterButtonActive: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.textMuted,
  },
  filterTextActive: {
    color: semanticRoles.primaryCTAText,
  },
  listContent: {
    padding: BTHWANI_SPACING.md,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.surfaceSubtle,
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
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs / 2,
  },
  message: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs / 2,
  },
  timestamp: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.md,
    textAlign: 'center',
  },
});

export default CaptainNotificationsScreen;
