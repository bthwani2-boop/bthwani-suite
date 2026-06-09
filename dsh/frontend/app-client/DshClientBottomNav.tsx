import React from 'react';
import { BottomNavBar } from '@bthwani/ui-kit';

const CLIENT_BOTTOM_NAV_ITEMS = [
  { id: 'favorites', label: 'المفضلة', icon: 'home-outline', activeIcon: 'home' },
  { id: 'orders', label: 'طلباتي', icon: 'receipt-outline', activeIcon: 'receipt' },
  { id: 'wallet', label: 'المحفظة', icon: 'wallet-outline', activeIcon: 'wallet' },
  { id: 'profile', label: 'حسابي', icon: 'person-outline', activeIcon: 'person' },
] as const;

type DshClientBottomNavProps = {
  route: string;
  handleServiceLauncherPress: () => void;
  handleClientBottomNavSelect: (id: string) => void;
};

export function DshClientBottomNav({
  route,
  handleServiceLauncherPress,
  handleClientBottomNavSelect,
}: DshClientBottomNavProps) {
  const bottomNavActiveId: 'favorites' | 'orders' | 'wallet' | 'profile' =
    route === 'orders-list' ? 'orders'
    : route === 'wlt-home' ? 'wallet'
    : route === 'my-space' ? 'profile'
    : 'favorites';

  return (
    <BottomNavBar
      activeId={bottomNavActiveId}
      direction="rtl"
      launcherLabel="الخدمات"
      launcherIcon="grid"
      onLauncherPress={handleServiceLauncherPress}
      onSelect={handleClientBottomNavSelect}
      items={CLIENT_BOTTOM_NAV_ITEMS}
    />
  );
}
