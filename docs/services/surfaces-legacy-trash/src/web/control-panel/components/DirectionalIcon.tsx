'use client';

import React from 'react';
import { useI18n } from '@bthwani/ui-kit';

type IconComponent = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

export interface DirectionalIconProps {
  icon: IconComponent;
  className?: string;
  strokeWidth?: number;
  mirrorInRTL?: boolean;
}

/**
 * DirectionalIcon — RTL-aware icon wrapper
 *
 * Automatically flips icons that have directional meaning in RTL mode.
 * Use for: ArrowRight, ArrowLeft, ChevronRight, ChevronLeft, etc.
 *
 * Features:
 * - Reads direction from useI18n() context
 * - Applies CSS transform scaleX(-1) when mirroring needed
 * - No re-renders on language changes (React memo)
 * - Semantic direction property always respected
 *
 * Usage:
 * <DirectionalIcon
 *   icon={ArrowRight}
 *   className="h-5 w-5"
 *   mirrorInRTL={true}
 * />
 */
export const DirectionalIcon = ({
  icon: Icon,
  className,
  strokeWidth = 2,
  mirrorInRTL = false,
}: DirectionalIconProps) => {
  const { isRTL } = useI18n();

  const shouldMirror = mirrorInRTL && isRTL;

  return (
    <span
      style={
        shouldMirror
          ? {
              transform: 'scaleX(-1)',
              transformOrigin: 'center',
              display: 'inline-block',
            }
          : undefined
      }
    >
      <Icon className={className} strokeWidth={strokeWidth} />
    </span>
  );
};

export default DirectionalIcon;
