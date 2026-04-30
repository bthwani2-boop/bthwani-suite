
// Primary operationId: chat_messages_list
/**
 * DSH Partner Order Chat Messages List — chat_messages_list. ScreenId: APP_CLIENT_DSH_PARTNER_ORDER_CHAT_MESSAGES_LIST.
 * Implements Gate-UI-3 (States), Gate-UI-5 (Trace/Audit).
 * Uses partnerOrderChatMessagesList from dsh-orders-api.
 */

import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { partnerOrderChatMessagesList, partnerOrderChatReadAck } from '@bthwani/api-clients';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

// States for Gate-UI-3
type State = 'loading' | 'normal' | 'empty' | 'error';

interface ChatMessage {
  id: string;
  message: string;
  senderId: string;
  senderType: 'partner' | 'customer';
  timestamp: string;
  read: boolean;
}

export function DshPartnerOrderChatMessagesListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const orderId = (route.params as { orderId?: string })?.orderId || '';

  const [state, setState] = useState<State>('loading');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [traceId, setTraceId] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastReadMessageIds, setLastReadMessageIds] = useState<string[]>([]);

  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);

  const generateTraceId = () => `dsh_partner_order_chat_messages_list_${Date.now()}_${(0).toString(36).substr(2, 9)}`;

  const loadMessages = async (isRefresh = false) => {
    const requestTraceId = generateTraceId();
    setTraceId(requestTraceId);

    if (!isRefresh) {
      setState('loading');
    }
    setErrorMessage('');

    try {
      const chatMessages = await partnerOrderChatMessagesList(orderId);

      // Gate-UI-5: Audit success
      setTraceId(`list_${(chatMessages as { messages?: unknown[] })?.messages?.length ?? 0}`);

      const messages = (chatMessages.messages as ChatMessage[]) || [];
      setMessages(messages);
      setState(messages.length === 0 ? 'empty' : 'normal');
    } catch (error: any) {
      // Gate-UI-5: Audit error
      setErrorMessage(error.message || t('dsh.mobile.dsh.DshPartnerOrderChatMessagesListScreen.errorMessage'));
      setState('error');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMessages(true);
    setRefreshing(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Mark messages as read when they become visible (Gate-UI-5: Trace/Audit)
  useEffect(() => {
    const markMessagesAsRead = async () => {
      const unreadMessageIds = messages
        .filter(msg => !msg.read && msg.senderType === 'customer')
        .map(msg => msg.id)
        .filter(id => !lastReadMessageIds.includes(id));

      if (unreadMessageIds.length > 0) {
        try {
          await partnerOrderChatReadAck(orderId, unreadMessageIds);
          // Update local state to reflect read status
          setMessages(prev => prev.map(msg =>
            unreadMessageIds.includes(msg.id) ? { ...msg, read: true } : msg
          ));

          setLastReadMessageIds(prev => [...prev, ...unreadMessageIds]);
        } catch (error) {
          // Continue silently - this is not critical for user experience
        }
      }
    };

    if (messages.length > 0 && state === 'normal') {
      markMessagesAsRead();
    }
  }, [messages, state, orderId, lastReadMessageIds]);

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isPartnerMessage = item.senderType === 'partner';

    return (
      <View style={[styles.messageContainer, isPartnerMessage && styles.partnerMessage]}>
        <View style={[styles.messageBubble, isPartnerMessage && styles.partnerBubble]}>
          <Text style={[styles.messageText, isPartnerMessage && styles.partnerText]}>
            {item.message}
          </Text>
          <Text style={[styles.messageTime, textAlignStart, isPartnerMessage && styles.partnerTime]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
        {!item.read && (
          <View style={styles.unreadIndicator} />
        )}
      </View>
    );
  };

  const renderLoading = () => (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colorTokens.success['500']} />
      <Text style={styles.loadingText}>جاري تحميل الرسائل...</Text>
      {traceId && (
        <Text style={styles.traceText}>Trace ID: {traceId}</Text>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.center}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyText}>💬</Text>
      </View>
      <Text style={styles.emptyTitle}>لا توجد رسائل</Text>
      <Text style={styles.emptyMessage}>
        لم يتم إرسال أي رسائل لهذا الطلب بعد
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.center}>
      <View style={styles.errorIcon}>
        <Text style={styles.errorText}>⚠</Text>
      </View>
      <Text style={styles.errorTitle}>فشل في تحميل الرسائل</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadMessages()}>
        <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNormal = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>رسائل الطلب</Text>
        <Text style={styles.orderIdText}>طلب رقم: {orderId}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colorTokens.success['500']]}
            tintColor={colorTokens.success['500']}
          />
        }
        inverted
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.sendMessageButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.sendMessageButtonText}>إرسال رسالة جديدة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.markAllReadButton}
          onPress={async () => {
            const unreadMessageIds = messages
              .filter(msg => !msg.read && msg.senderType === 'customer')
              .map(msg => msg.id);

            if (unreadMessageIds.length > 0) {
              try {
                await partnerOrderChatReadAck(orderId, unreadMessageIds);
                setMessages(prev => prev.map(msg =>
                  unreadMessageIds.includes(msg.id) ? { ...msg, read: true } : msg
                ));
                setLastReadMessageIds(prev => [...prev, ...unreadMessageIds]);
              } catch (error) {
                }
            }
          }}
        >
          <Text style={styles.markAllReadButtonText}>تحديد الكل كمقروء</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>العودة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!orderId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>معرف الطلب مطلوب</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {state === 'loading' && renderLoading()}
      {state === 'normal' && renderNormal()}
      {state === 'empty' && renderEmpty()}
      {state === 'error' && renderError()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTokens.neutral['50'],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorTokens.neutral['200'],
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorTokens.neutral['900'],
  },
  orderIdText: {
    fontSize: 14,
    color: colorTokens.neutral['500'],
    marginTop: 4,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  partnerMessage: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    backgroundColor: colorTokens.primary['50'],
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
    borderBottomLeftRadius: 4,
  },
  partnerBubble: {
    backgroundColor: colorTokens.success['500'],
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: colorTokens.neutral['900'],
    lineHeight: 20,
  },
  partnerText: {
    color: BTHWANI_COLORS.surface,
  },
  messageTime: {
    fontSize: 12,
    color: colorTokens.neutral['500'],
    marginTop: 4,
  },
  partnerTime: {
    color: colorTokens.success['50'],
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colorTokens.primary['500'],
    marginStart: 8,
  },
  actions: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colorTokens.neutral['200'],
  },
  sendMessageButton: {
    backgroundColor: colorTokens.success['500'],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  sendMessageButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: colorTokens.error['500'],
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colorTokens.neutral['500'],
  },
  traceText: {
    marginTop: 8,
    fontSize: 12,
    color: colorTokens.neutral['400'],
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colorTokens.neutral['200'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.neutral['900'],
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: colorTokens.neutral['500'],
    textAlign: 'center',
    lineHeight: 20,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colorTokens.error['500'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 40,
    color: BTHWANI_COLORS.surface,
    fontWeight: 'bold',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.neutral['900'],
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: colorTokens.neutral['500'],
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colorTokens.error['500'],
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  markAllReadButton: {
    backgroundColor: colorTokens.primary['500'],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  markAllReadButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

