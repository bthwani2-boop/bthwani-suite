// Auto-generated unified screen for UserNotificationsList
// Surface: app-user | Service: user
// §30 States: Loading / Error / Empty / Success / Content
// §86 Unified app-user screen — الإشعارات

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  ScreenState,
  ScreenWrapper,
  colorTokens,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';

import { buildNotificationsListMock } from '../fixtures/notificationsList';
import type { Notification } from '../fixtures/notificationsList';

interface UserNotificationsListScreenProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const UserNotificationsListScreen: React.FC<
  UserNotificationsListScreenProps
> = ({ onNavigate, navigation }) => {
  const { t, forwardCaret, languageInfo, textAlignStartStyle } = useDirection();
  const NS = 'mobile.app-user.UserNotificationsListScreen';
  const [state, setState] = useState<ScreenState>('loading');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // Backend integration call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate success (90% success rate)
        const mockSuccess = 0 > 0.1;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadNotifications();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    } else if (onNavigate) {
      onNavigate(screen);
    }
  };

  const notifications = useMemo(() => buildNotificationsListMock(t, NS), [t]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'promotion':
        return '🎉';
      case 'system':
        return 'ℹ️';
      case 'support':
        return '💬';
      default:
        return '🔔';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return colorTokens.primary['500'];
      case 'promotion':
        return colorTokens.warning['500'];
      case 'system':
        return colorTokens.neutral['500'];
      case 'support':
        return colorTokens.success['600'];
      default:
        return semanticRoles.primaryCTA;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
  });

  const handleMarkAsRead = (notificationId: string) => {
    // Simulate marking as read
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on actionUrl
    if (notification.actionUrl) {
      handleNavigate(notification.actionUrl);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return t('surfaces.منذ_أقل_من_ساعة');
    } else if (diffHours < 24) {
      return `منذ ${Math.floor(diffHours)} ساعة`;
    } else if (diffDays < 7) {
      return `منذ ${Math.floor(diffDays)} يوم`;
    } else {
      return date.toLocaleDateString(languageInfo.localeTag);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <View
          style={[
            styles.typeIcon,
            { backgroundColor: getTypeColor(item.type) },
          ]}
        >
          <Text style={styles.iconText}>{getTypeIcon(item.type)}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.notificationContent}>
        <Text
          style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]}
        >
          {item.title}
        </Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>

      {item.actionUrl && (
        <View style={styles.actionIndicator}>
          <Text style={styles.actionText}>{forwardCaret}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const filterButtons = useMemo(
    () => [
      { key: 'all', label: t(`${NS}.all`), count: notifications.length },
      {
        key: 'unread',
        label: t(`${NS}.unread`),
        count: notifications.filter(n => !n.isRead).length,
      },
      {
        key: 'read',
        label: t(`${NS}.read`),
        count: notifications.filter(n => n.isRead).length,
      },
    ],
    [t, notifications]
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('surfaces.الإشعارات')}</Text>
            <Text style={styles.subtitle}>
              {t('surfaces.ابقَ_على_اطلاع_بآخر_الأخبار_والتحديثات')}
            </Text>
          </View>

          <View style={styles.filters}>
            {filterButtons.map(button => (
              <TouchableOpacity
                key={button.key}
                style={[
                  styles.filterButton,
                  filter === button.key && styles.activeFilterButton,
                ]}
                onPress={() => setFilter(button.key as any)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === button.key && styles.activeFilterText,
                  ]}
                >
                  {button.label} ({button.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.notificationsSection}>
            <Text style={[styles.sectionTitle, textAlignStartStyle]}>
              {filter === 'all'
                ? t('surfaces.جميع_الإشعارات')
                : filter === 'unread'
                  ? t('surfaces.الإشعارات_غير_المقروءة')
                  : t('surfaces.الإشعارات_المقروءة')}{' '}
              ({filteredNotifications.length})
            </Text>
            <FlatList
              data={filteredNotifications}
              keyExtractor={item => item.id}
              renderItem={renderNotification}
              contentContainerStyle={styles.notificationsList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigate('UserProfile')}
          >
            <Text style={styles.backText}>
              {t('surfaces.العودة_للملف_الشخصي')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_الإشعارات')}
      errorMessage={t('surfaces.فشل_في_تحميل_الإشعارات')}
      onErrorAction={handleRetry}
      screenName={t('surfaces.UserNotificationsListScreen')}
      operationName='user_notifications_list'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  filters: {
    flexDirection: 'row',
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.sm,
  },
  filterButton: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.textMuted,
  },
  activeFilterButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  filterText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  activeFilterText: {
    color: semanticRoles.primaryCTAText,
  },
  notificationsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  notificationsList: {
    padding: BTHWANI_SPACING.contentH,
  },
  notificationCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: 'semanticRoles.shadow',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    borderRightWidth: 4,
    borderRightColor: semanticRoles.primaryCTA,
  },
  notificationHeader: {
    marginEnd: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: semanticRoles.primaryCTA,
    marginTop: BTHWANI_SPACING.xs,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  unreadTitle: {
    color: semanticRoles.primaryCTA,
  },
  notificationMessage: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  actionIndicator: {
    marginStart: BTHWANI_SPACING.md,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 18,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.textMuted,
  },
  backText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserNotificationsListScreen;
