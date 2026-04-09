/**
 * ServiceIcon Component
 * Uses Ionicons where a stable mapping exists, with text fallback for legacy names.
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colorTokens, useI18n } from '@bthwani/ui-kit';

interface ServiceIconProps {
  name: string;
  size?: number;
  color?: string;
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const IONICON_MAP: Record<string, IoniconName> = {
  'directions-car': 'car-outline',
  restaurant: 'restaurant-outline',
  'account-balance-wallet': 'wallet-outline',
  home: 'home-outline',
  store: 'storefront-outline',
  campaign: 'megaphone-outline',
  work: 'briefcase-outline',
  search: 'search-outline',
  'local-hospital': 'medkit-outline',
  build: 'construct-outline',
  person: 'person-outline',
  'search-icon': 'search-outline',
  close: 'close',
  star: 'star-outline',
  'support-agent': 'headset-outline',
  construction: 'construct-outline',
  grid: 'grid-outline',
  list: 'list-outline',
  'check-circle': 'checkmark-circle-outline',
  visibility: 'eye-outline',
  inventory: 'cube-outline',
  payment: 'card-outline',
  assessment: 'analytics-outline',
  description: 'document-text-outline',
  'receipt-long': 'receipt-outline',
  notes: 'create-outline',
  settings: 'settings-outline',
  reply: 'arrow-undo-outline',
  'shopping-cart': 'cart-outline',
  'add-shopping-cart': 'cart-outline',
  notifications: 'notifications-outline',
  new: 'sparkles-outline',
  'chevron-left': 'chevron-back',
  'chevron-right': 'chevron-forward',
  'arrow-left': 'arrow-back',
  'arrow-right': 'arrow-forward',
  map: 'map-outline',
  'play-arrow': 'play-outline',
  'location-on': 'location-outline',
  'location-off': 'location-outline',
  phone: 'call-outline',
  message: 'chatbubble-outline',
  help: 'help-circle-outline',
  edit: 'create-outline',
  upload: 'cloud-upload-outline',
  badge: 'card-outline',
  send: 'paper-plane-outline',
  subscriptions: 'clipboard-outline',
  analytics: 'bar-chart-outline',
  schedule: 'time-outline',
  'swap-horiz': 'swap-horizontal-outline',
  emergency: 'warning-outline',
  'bug-report': 'bug-outline',
  'menu-book': 'book-outline',
  'account-balance': 'business-outline',
  receipt: 'receipt-outline',
  event: 'calendar-outline',
  'report-problem': 'warning-outline',
  'local-shipping': 'car-outline',
  groups: 'people-outline',
  tune: 'options-outline',
  'toggle-on': 'toggle-outline',
  layers: 'layers-outline',
  radar: 'locate-outline',
  image: 'image-outline',
  'person-add': 'person-add-outline',
  'service-food': 'restaurant-outline',
  'service-market': 'storefront-outline',
  'service-contract': 'document-text-outline',
  'service-shield': 'shield-checkmark-outline',
  'service-briefcase': 'briefcase-outline',
  'service-report': 'clipboard-outline',
  'service-people': 'people-outline',
  'service-support': 'headset-outline',
  'service-wallet': 'wallet-outline',
  'service-generic': 'apps-outline',
};

const TEXT_ICON_MAP: Record<string, string> = {
  'directions-car': '🚗',
  restaurant: '🍕',
  'account-balance-wallet': '💳',
  home: '🏠',
  store: '🏪',
  campaign: '📢',
  work: '💼',
  search: '🔍',
  'local-hospital': '🚨',
  build: '🛠️',
  person: '👤',
  'search-icon': '🔍',
  close: '✕',
  star: '⭐',
  'support-agent': '💬',
  construction: '🏗️',
  grid: '📋',
  list: '📋',
  'check-circle': '✅',
  visibility: '👁️',
  inventory: '📦',
  payment: '💳',
  assessment: '📊',
  description: '📄',
  notes: '📝',
  settings: '⚙️',
  reply: '↩️',
  gavel: '⚖️',
  'shopping-cart': '🛒',
  'add-shopping-cart': '🛒',
  notifications: '🔔',
  new: '✨',
  'chevron-left': '←',
  'chevron-right': '→',
  map: '🗺️',
  'play-arrow': '▶️',
  'location-on': '📍',
  'location-off': '📍',
  phone: '📞',
  message: '💬',
  help: '❓',
  edit: '✏️',
  upload: '📤',
  badge: '🪪',
  send: '📤',
  'mark-chat-read': '✓💬',
  'person-add': '👤➕',
  subscriptions: '📋',
  analytics: '📈',
  schedule: '🕐',
  'swap-horiz': '🔄',
  'military-tech': '🎖️',
  emergency: '🚨',
  'bug-report': '🐛',
  'menu-book': '📚',
  'account-balance': '🏦',
  receipt: '🧾',
  event: '📅',
  'report-problem': '⚠️',
  'local-shipping': '🚚',
  groups: '👥',
  percent: '％',
  tune: '🎛️',
  'toggle-on': '🔛',
  layers: '🗂️',
  radar: '📡',
  // Home screen service icons (avoid fallback dot in EN/AR)
  'service-food': '🍕',
  'service-market': '🏪',
  'service-contract': '📄',
  'service-shield': '🛡️',
  'service-briefcase': '💼',
  'service-report': '📋',
  'service-people': '👥',
  'service-support': '💬',
  'service-wallet': '💳',
  'service-generic': '📦',
};

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  name,
  size = 24,
  color = colorTokens.neutral['950'],
}) => {
  const { isRTL } = useI18n();

  const resolvedName =
    name === 'chevron-left' ? (isRTL ? 'chevron-right' : 'chevron-left') :
    name === 'chevron-right' ? (isRTL ? 'chevron-left' : 'chevron-right') :
    name === 'arrow-left' ? (isRTL ? 'arrow-right' : 'arrow-left') :
    name === 'arrow-right' ? (isRTL ? 'arrow-left' : 'arrow-right') :
    name;

  const ioniconName =
    IONICON_MAP[resolvedName] ??
    (resolvedName.startsWith('service-')
      ? IONICON_MAP['service-generic']
      : undefined);

  if (ioniconName) {
    return <Ionicons name={ioniconName} size={size} color={color} style={styles.icon} />;
  }

  const icon =
    TEXT_ICON_MAP[resolvedName] ??
    (resolvedName.startsWith('service-')
      ? TEXT_ICON_MAP['service-generic']
      : null) ??
    TEXT_ICON_MAP['home'] ??
    '◆';

  return <Text style={[styles.icon, { fontSize: size, color }]}>{icon}</Text>;
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
