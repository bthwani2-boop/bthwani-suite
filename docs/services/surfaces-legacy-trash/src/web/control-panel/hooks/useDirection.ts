'use client';

import { useMemo } from 'react';
import { useI18n } from '@bthwani/ui-kit/i18n';

/**
 * useDirection — Consistent RTL/LTR direction handling
 *
 * Single source of truth for direction in CONTROL PANEL dashboard.
 * Derives all direction properties from useI18n context.
 *
 * Returns:
 * - isRTL: boolean
 * - direction: 'rtl' | 'ltr'
 * - flexDir: Tailwind flex-row or flex-row-reverse
 * - textAlign: text-right or text-left
 *
 * Usage:
 * const { isRTL, direction } = useDirection();
 * <div style={{ direction }} className={flexDir}>
 */
export function useDirection() {
  const { isRTL } = useI18n();

  return useMemo(
    () => ({
      isRTL,
      direction: isRTL ? ('rtl' as const) : ('ltr' as const),
      flexDir: isRTL ? 'flex-row-reverse' : 'flex-row',
      textAlign: isRTL ? 'text-right' : 'text-left',
      justifyContent: isRTL ? 'justify-end' : 'justify-start',
      items: isRTL ? 'items-end' : 'items-start',
    }),
    [isRTL]
  );
}

export default useDirection;

