import * as React from 'react';
import { getMarketingTickerItems, buildMarketingTickerPlan } from '../../data/news-ticker.preview-store';

export function useHomeTickerState({
  isTickerHidden,
  currentTime,
  currentLanguage,
  tickerAction,
  onOpenOrders,
  onOpenTracking,
  onOpenDiscovery,
}: {
  isTickerHidden: boolean;
  currentTime: Date;
  currentLanguage: 'ar' | 'en' | 'fr' | string;
  tickerAction?: () => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onOpenDiscovery?: () => void;
}) {
  const tickerState = React.useMemo(() => {
    if (isTickerHidden) {
      return null;
    }

    const clientPlan = buildMarketingTickerPlan(currentTime, 'client', getMarketingTickerItems());
    const activeItem = clientPlan.activeItem;

    if (!activeItem) {
      return {
        isOpen: true,
        statusLabel: currentLanguage === 'ar' ? 'مباشر' : 'Live',
        message: currentLanguage === 'ar' ? 'استعرض المتاجر والطلبات النشطة' : 'Browse stores and active orders',
        isMarketing: false,
      };
    }

    return {
      isOpen: true,
      statusLabel: currentLanguage === 'ar' ? 'مباشر' : 'Live',
      message: activeItem.message,
      isMarketing: true,
      actionTarget: activeItem.actionTarget,
      needsBinding: true,
    };
  }, [currentLanguage, currentTime, isTickerHidden]);

  const handleTickerAction = React.useCallback(() => {
    if (!tickerState) return;

    if (tickerState.isMarketing) {
      if (tickerState.actionTarget === 'orders') {
        onOpenOrders?.();
      } else if (tickerState.actionTarget === 'tracking') {
        onOpenTracking?.();
      } else if (tickerState.actionTarget === 'promo') {
        onOpenDiscovery?.(); // Fallback for promo
      }
    } else if (tickerAction) {
      tickerAction();
    }
  }, [tickerState, tickerAction, onOpenOrders, onOpenTracking, onOpenDiscovery]);

  return { tickerState, handleTickerAction };
}
