import React from 'react';
import { Box, Divider, Icon, Text, Badge } from '@bthwani/ui-kit';
import { View } from 'react-native';
import { borders } from '@bthwani/ui-kit';
import { useTheme } from '@bthwani/ui-kit';
import { CaptainAccountNavRow } from './CaptainAccountNavRow';

type NavItem = {
  title: string;
  subtitle: string;
  badgeLabel?: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  onPress: () => void;
};

type ChipTone = 'success' | 'warning' | 'default';

type Props = {
  captainDisplayName: string;
  walletBalanceLabel?: string;
  availabilityLabel: string;
  availabilityChipTone: ChipTone;
  walletSummaryLabel: string;
  navItems: readonly NavItem[];
};

export function DshCaptainAccountHubContent({
  captainDisplayName,
  walletBalanceLabel,
  availabilityLabel,
  availabilityChipTone,
  walletSummaryLabel,
  navItems,
}: Props) {
  const { theme } = useTheme();

  return (
    <Box gap={4}>
      <Box gap={4}>
        <Box layoutDirection="row" align="center" gap={3} style={{ flexDirection: 'row-reverse' }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.brandSurface, alignItems: 'center', justifyContent: 'center', borderWidth: borders.hairline, borderColor: theme.brand + '44' }}>
            <Icon name="person" size={28} tone="brand" />
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
            <Text role="titleSm" style={{ color: theme.text }}>{captainDisplayName}</Text>
            <Box layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
              <Badge label="كابتن DSH" tone="success" />
              <Badge label={availabilityLabel} tone={availabilityChipTone} />
            </Box>
          </View>
        </Box>

        <Divider />

        <Box layoutDirection="row" gap={3} style={{ flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
          <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}>
            <Text role="caption" tone="muted">التقييم</Text>
            <Text role="bodyStrong" tone="info">4.9 ★</Text>
          </View>
          <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}>
            <Text role="caption" tone="muted">المستوى</Text>
            <Text role="bodyStrong" tone="brand">Elite 3</Text>
          </View>
          <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}>
            <Text role="caption" tone="muted">{walletSummaryLabel}</Text>
            <Text role="bodyStrong" tone="success">{walletBalanceLabel ?? '—'}</Text>
          </View>
        </Box>
      </Box>

      <Divider />

      <Box gap={0}>
        {navItems.map((item) => (
          <CaptainAccountNavRow
            key={item.title}
            title={item.title}
            subtitle={item.subtitle}
            badgeLabel={item.badgeLabel}
            icon={item.icon}
            onPress={item.onPress}
          />
        ))}
      </Box>
    </Box>
  );
}
