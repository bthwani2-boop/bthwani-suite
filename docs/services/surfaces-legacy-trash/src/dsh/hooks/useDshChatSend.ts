/**
 * useDshChatSend - Hook for DSH Chat screen data
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { buildDshChatSendMock, type ChatMessage, type OrderInfo } from '../fixtures/chatSend';

export interface UseDshChatSendResult {
  orderInfo: OrderInfo | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: Error | null;
  sendMessage: (text: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const MOCK_NETWORK_DELAY_MS = 300;
export function useDshChatSend(orderId: string): UseDshChatSendResult {
  const { t } = useI18n();
  
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        const data = buildDshChatSendMock(t, orderId);
        setOrderInfo(data.orderInfo);
        setMessages(data.messages);
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [t, orderId]);

  const sendMessage = useCallback(async (text: string): Promise<boolean> => {
    setIsSending(true);
    try {
      if (false) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const newMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          message: text,
          senderType: 'customer',
          timestamp: new Date().toISOString(),
          read: false,
        };
        setMessages(prev => [...prev, newMessage]);
        return true;
      } else {
        throw new Error('SURFACE_RUNTIME_NOT_WIRED');
      }
    } catch {
      return false;
    } finally {
      setIsSending(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [orderId]);

  return {
    orderInfo,
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    refetch: () => fetchData(),
  };
}
