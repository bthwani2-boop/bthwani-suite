// KNZ Chat Message Send Screen - Complete Design
// Surface: app-client | Service: knz
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildKnzChatMessageSendMock, type ChatMessage, type ThreadInfo } from '../../hooks';

const NS = 'knz.app-client.mobile.auto_knz_chat_message_send';
const NS_COMMON = 'knz.app-client.mobile.common';

interface auto_knz_chat_message_sendProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void };
  route?: { params?: { threadId?: string; listingId?: string } };
}

export const auto_knz_chat_message_send: React.FC<auto_knz_chat_message_sendProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [threadInfo, setThreadInfo] = useState<ThreadInfo | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const threadId = route?.params?.threadId || 'THR-001';
  const listingId = route?.params?.listingId || 'LST-001';
  const initialChatData = useMemo(() => buildKnzChatMessageSendMock(t, threadId), [t, threadId]);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const loadChatData = useCallback(async () => {
    try {
      setState('loading');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setThreadInfo(initialChatData.threadInfo);
      setMessages(initialChatData.messages);
      setState('content');
    } catch (error) {
      setState('error');
    }
  }, [threadId, t, initialChatData]);

  useEffect(() => {
    loadChatData();
  }, [loadChatData]);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadChatData().finally(() => setRefreshing(false));
  }, [loadChatData]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: messageText.trim(),
      senderType: 'user',
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');
    setSending(true);

    // Simulate response
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: t(`${NS_COMMON}.mockMessage4`),
        senderType: 'seller',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, responseMessage]);
      setSending(false);
    }, 1500);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.senderType === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.sellerMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.sellerMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.sellerMessageText,
            ]}
          >
            {item.message}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isUser ? styles.userMessageTime : styles.sellerMessageTime,
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (state === 'content' && threadInfo) {
    return (
      <ScreenWrapper state="content">
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => handleNavigate('KnzChatThreadList')}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {threadInfo.sellerName} {threadInfo.sellerVerified && '✅'}
              </Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {threadInfo.listingTitle}
              </Text>
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.inputContainer, { flexDirection: 'row', direction: layoutDirection }]}>
            <TextInput
              style={styles.input}
              placeholder={t(`${NS_COMMON}.typeMessagePlaceholder`)}
              placeholderTextColor={semanticRoles.textMuted}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!messageText.trim() || sending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || sending}
            >
              <Text style={[
                styles.sendButtonText,
                (!messageText.trim() || sending) && styles.sendButtonTextDisabled,
              ]}>
                {sending ? '...' : t('surfaces.إرسال')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('knz.app-client.mobile.auto_knz_chat_message_send.loadingMessage')}
      errorMessage={t('knz.app-client.mobile.auto_knz_chat_message_send.errorMessage')}
      onErrorAction={loadChatData}
      screenName="auto_knz_chat_message_send"
      operationName="knz_chat_message_send"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  backButton: {
    marginEnd: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.sm,
  },
  backIcon: {
    fontSize: 24,
    color: semanticRoles.text,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs / 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  messagesList: {
    padding: BTHWANI_SPACING.md,
  },
  messageContainer: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  sellerMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  userMessageBubble: {
    backgroundColor: semanticRoles.primaryCTA,
    borderBottomRightRadius: BTHWANI_RADIUS.xs || 4,
  },
  sellerMessageBubble: {
    backgroundColor: semanticRoles.surface,
    borderBottomLeftRadius: BTHWANI_RADIUS.xs || 4,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: BTHWANI_SPACING.xs,
  },
  userMessageText: {
    color: semanticRoles.primaryCTAText,
  },
  sellerMessageText: {
    color: semanticRoles.text,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: semanticRoles.primaryCTAText,
    opacity: 0.8,
  },
  sellerMessageTime: {
    color: semanticRoles.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    fontSize: 14,
    color: semanticRoles.text,
    marginEnd: BTHWANI_SPACING.sm,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    minWidth: 70,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  sendButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: semanticRoles.textMuted,
  },
});

export default auto_knz_chat_message_send;

