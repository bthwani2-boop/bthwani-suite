import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  BthUnifiedMobileTopBar,
  type BthUnifiedMobileTopBarAction,
  type BthUnifiedMobileTopBarProps,
  type BthUnifiedMobileTopBarTicker,
} from '@bthwani/ui-kit';

export type UnifiedMobileTopBarAction = {
  id: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  badgeCount?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export type UnifiedMobileTopBarTicker = BthUnifiedMobileTopBarTicker;

export type UnifiedMobileTopBarProps = Omit<BthUnifiedMobileTopBarProps, 'actions' | 'locationIcon'> & {
  actions?: UnifiedMobileTopBarAction[];
};

export function UnifiedMobileTopBar({ actions = [], ...props }: UnifiedMobileTopBarProps) {
  const mappedActions: BthUnifiedMobileTopBarAction[] = actions.map((action) => ({
    id: action.id,
    icon: <Ionicons name={action.iconName} size={21} color="#FFFFFF" />,
    badgeCount: action.badgeCount,
    onPress: action.onPress,
    accessibilityLabel: action.accessibilityLabel,
  }));

  return (
    <BthUnifiedMobileTopBar
      {...props}
      locationIcon={<Ionicons name="location-outline" size={14} color="#FFFFFF" />}
      actions={mappedActions}
    />
  );
}

export default UnifiedMobileTopBar;