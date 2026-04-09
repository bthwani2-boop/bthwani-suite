/**
 * useKnzChatMessageSend - Hook for KNZ Chat Message Send screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildKnzChatMessageSendMock,
  type ChatMessage,
  type ThreadInfo,
} from '../fixtures/chatMessageSend';

// ============================================
// Types
// ============================================

export interface UseKnzChatMessageSendResult {
  threadInfo: ThreadInfo | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isRefreshing: boolean;
  isSending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  sendMessage: (message: string) => Promise<boolean>;
}

// ============================================
// Configuration
// ============================================

const MOCK_NETWORK_DELAY_MS = 300;
// ============================================
// Hook Implementation
// ============================================

export function useKnzChatMessageSend(threadId: string): UseKnzChatMessageSendResult {
  const { t } = useI18n();
  
  const [threadInfo, setThreadInfo] = useState<ThreadInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!threadId) {
      setError(new Error('Thread ID is required'));
      setIsLoading(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildKnzChatMessageSendMock(t, threadId);
        setThreadInfo(data.threadInfo);
        setMessages(data.messages);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, threadId]);

  const sendMessage = useCallback(async (message: string): Promise<boolean> => {
    setIsSending(true);
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          message,
          senderType: 'user',
          timestamp: new Date().toISOString(),
          read: false,
        };
        setMessages(prev => [...prev, newMessage]);
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to send message'));
      return false;
    } finally {
      setIsSending(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetchData();
  }, [threadId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    threadInfo,
    messages,
    isLoading,
    isRefreshing,
    isSending,
    error,
    refetch: () => fetchData(false),
    refresh: () => fetchData(true),
    sendMessage,
  };
}
