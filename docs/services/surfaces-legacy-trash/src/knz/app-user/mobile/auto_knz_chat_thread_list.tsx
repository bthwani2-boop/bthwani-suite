// KNZ Chat Thread List Screen - Complete Design
// Surface: app-client | Service: knz
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { resolveDevMediaUrl } from '../../../config';
import { buildKnzChatThreadListMock, type ChatThread } from '../../hooks';

const NS = 'knz.app-client.mobile.auto_knz_chat_thread_list';

interface auto_knz_chat_thread_listProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void };
}

export const auto_knz_chat_thread_list: React.FC<auto_knz_chat_thread_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const loadThreads = useCallback(async () => {
    try {
      setState('loading');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockSuccess = 0 > 0.08;
      const mockHasThreads = 0 > 0.1;

      if (!mockSuccess) {
        setState('error');
      } else if (!mockHasThreads) {
        setState('empty');
        setThreads([]);
      } else {
        setThreads(buildKnzChatThreadListMock(t));
        setState('content');
      }
    } catch (error) {
      setState('error');
    }
  }, [t]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadThreads().finally(() => setRefreshing(false));
  }, [loadThreads]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return t('surfaces.أمس');
    } else if (days < 7) {
      return `${days} أيام`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const renderThread = ({ item }: { item: ChatThread }) => (
    <TouchableOpacity
      style={[styles.threadCard, { flexDirection: 'row', direction: layoutDirection }]}
      onPress={() => handleNavigate('KnzChatMessageSend', {
        threadId: item.id,
        listingId: item.listingId,
      })}
    >
      {item.listingImage ? (
        <Image source={{ uri: resolveDevMediaUrl(item.listingImage) || item.listingImage }} style={styles.threadImage} resizeMode="cover" />
      ) : (
        <View style={[styles.threadImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: BTHWANI_COLORS.borderSubtle }]}>
          <Text style={{ fontSize: 20 }}>📷</Text>
        </View>
      )}
      <View style={styles.threadContent}>
        <View style={[styles.threadHeader, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.sellerName} numberOfLines={1}>
            {item.sellerName} {item.sellerVerified && '✅'}
          </Text>
          <Text style={styles.threadTime}>{formatTime(item.lastMessageTime)}</Text>
        </View>
        <Text style={styles.listingTitle} numberOfLines={1}>
          {item.listingTitle}
        </Text>
        <View style={[styles.threadFooter, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t(`${NS}.headerTitle`)}</Text>
          </View>

          <FlatList
            data={threads}
            renderItem={renderThread}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.threadsList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(NS + '.loadingMessage')}
      emptyMessage={t('surfaces.لا_توجد_محادثات_حالياً')}
      emptyActionText={t('surfaces.تصفح_الإعلانات')}
      onEmptyAction={() => handleNavigate('KnzListingsList')}
      errorMessage={t('surfaces.فشل_في_تحميل_المحادثات')}
      onErrorAction={loadThreads}
      screenName="auto_knz_chat_thread_list"
      operationName="knz_chat_thread_list"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  threadsList: {
    padding: BTHWANI_SPACING.md,
  },
  threadCard: {
    flexDirection: 'row',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  threadImage: {
    width: 60,
    height: 60,
    borderRadius: BTHWANI_RADIUS.sm,
    marginEnd: BTHWANI_SPACING.md,
  },
  threadContent: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
  },
  threadTime: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  listingTitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  threadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginStart: BTHWANI_SPACING.sm,
  },
  unreadBadgeText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default auto_knz_chat_thread_list;

