import * as React from 'react';

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
    void currentTime;
    if (isTickerHidden) {
      return null;
    }

    // Marketing ticker items come from API — show neutral live status until endpoint is built.
    return {
      isOpen: true,
      statusLabel: currentLanguage === 'ar' ? 'مباشر' : 'Live',
      message: currentLanguage === 'ar' ? 'استعرض المتاجر والطلبات النشطة' : 'Browse stores and active orders',
      isMarketing: false,
    };
  }, [currentLanguage, currentTime, isTickerHidden]);

  const handleTickerAction = React.useCallback(() => {
    if (!tickerState) return;

    if (tickerState.isMarketing) {
      onOpenDiscovery?.();
    } else if (tickerAction) {
      tickerAction();
    }
  }, [tickerState, tickerAction, onOpenOrders, onOpenTracking, onOpenDiscovery]);

  return { tickerState, handleTickerAction };
}
