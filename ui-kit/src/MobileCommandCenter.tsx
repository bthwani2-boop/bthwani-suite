import React from 'react';
import { Pressable, View } from 'react-native';
import { Button } from './components/button';
import { Icon } from './components/icons';
import { resolveRowDirection } from './foundation';
import { Box, MobileScrollView, Surface, Text } from './primitives';
import { useDirection, useTheme } from './providers';

// ----- Types -----
export type MobileCommandState = 'ready' | 'loading' | 'empty' | 'offline' | 'disabled' | 'error';

export type MobileCommandViewState = MobileCommandState;

export type MobileCommandStateConfig = Record<string, any>;

export type MobileCommandSummaryItem = {
  id: string;
  label: string;
  value: string;
  tone?: string;
};

export type MobileCommandSectionItemData = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentProps<typeof Icon>['name'];
  meta?: string;
  statusLabel?: string;
  statusTone?: 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  onPress?: () => void;
};

export type MobileQuickActionItem = {
  id: string;
  label: string;
  icon?: string;
  onPress?: () => void;
  tone?: string;
};

// ----- Component props -----
export type MobileCommandCenterShellProps = {
  state?: MobileCommandState;
  stateConfig?: Record<string, any>;
  title?: string;
  description?: string;
  badgeLabel?: string;
  badgeTone?: string;
  headerNote?: string;
  summaryStrip?: React.ReactNode;
  quickActions?: React.ReactNode;
  children?: React.ReactNode;
};

export type MobileCommandSummaryStripProps = {
  items?: readonly MobileCommandSummaryItem[];
};

export type MobileCommandSectionListProps = {
  title?: string;
  subtitle?: string;
  items: readonly MobileCommandSectionItemData[];
};

export type MobileCommandSectionItemProps = {
  item: MobileCommandSectionItemData;
  isLast?: boolean;
};

export type MobileOperationalWorkspaceProps = {
  state?: MobileCommandState;
  stateConfig?: Record<string, any>;
  title?: string;
  description?: string;
  overview?: React.ReactNode;
  onBack?: () => void;
  children?: React.ReactNode;
  stickyPrimaryAction?: React.ReactNode;
};

export type MobileInlineManagementPanelProps = {
  title?: string;
  subtitle?: string;
  open?: boolean;
  onToggle?: () => void;
  summaryItems?: { label: string; value: string; tone?: string }[];
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

export type MobileQuickActionsProps = {
  title?: string;
  items?: readonly MobileQuickActionItem[];
};

export type MobileStickyPrimaryActionProps = {
  label: string;
  helperText?: string;
  onPress?: () => void;
  disabled?: boolean;
};

// ----- Minimal components -----
export function MobileCommandCenterShell({
  title,
  description,
  badgeLabel,
  badgeTone,
  summaryStrip,
  quickActions,
  children,
}: MobileCommandCenterShellProps) {
  return (
    <MobileScrollView padding={4} gap={4} contentContainerStyle={{ paddingBottom: 96 }}>
      <Surface tone="brand" gap={3}>
        <Box>
          {badgeLabel ? <Text role="label">{badgeLabel}</Text> : null}
          {title ? <Text role="titleLg">{title}</Text> : null}
          {description ? <Text role="bodySm" tone="muted">{description}</Text> : null}
        </Box>
      </Surface>

      {summaryStrip}

      <Box>{quickActions}</Box>

      <Box>{children}</Box>
    </MobileScrollView>
  );
}

export function MobileCommandSummaryStrip({ items = [] }: MobileCommandSummaryStripProps) {
  return (
    <Box layoutDirection="row" gap={3}>
      {items.map((it) => (
        <Surface key={it.id} tone="inset" padding={3} gap={1}>
          <Text role="caption">{it.label}</Text>
          <Text role="titleMd">{it.value}</Text>
        </Surface>
      ))}
    </Box>
  );
}

// RTL contract: keep icon + text in one cluster; keep the chevron isolated on the opposite side.
// Do not use space-between to split icon and text.
export function MobileCommandSectionItem({ item, isLast = false }: MobileCommandSectionItemProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const iconName = item.icon ?? 'ellipse-outline';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityState={{ disabled: !item.onPress }}
      disabled={!item.onPress}
      onPress={item.onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: pressed ? theme.surfaceInset : theme.surfaceRaised,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.line,
        },
      ]}
    >
      <View
        style={{
          width: '100%',
          flexDirection: resolveRowDirection(direction),
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: resolveRowDirection(direction),
            alignItems: 'center',
            gap: 12,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.surfaceInset,
              borderWidth: 1,
              borderColor: theme.line,
              flexShrink: 0,
            }}
          >
            <Icon name={iconName} size={18} tone="brand" />
          </View>

          <View style={{ flex: 1, minWidth: 0, gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
            <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'} numberOfLines={1}>
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'} numberOfLines={1}>
                {item.subtitle}
              </Text>
            ) : null}
            {item.meta || item.statusLabel ? (
              <Text role="caption" tone={item.statusTone ?? 'soft'} align={direction === 'rtl' ? 'end' : 'start'} numberOfLines={1}>
                {item.statusLabel ?? item.meta}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
        </View>
      </View>
    </Pressable>
  );
}

export function MobileCommandSectionList({ title, subtitle, items }: MobileCommandSectionListProps) {
  if (!items.length) {
    return null;
  }

  return (
    <Surface tone="raised" padding={0} gap={0} style={{ overflow: 'hidden' }}>
      <Box padding={4} gap={1}>
        {title ? <Text role="label" tone="muted" align="start">{title}</Text> : null}
        {subtitle ? <Text role="bodySm" tone="muted" align="start">{subtitle}</Text> : null}
      </Box>
      <View>
        {items.map((it, index) => (
          <MobileCommandSectionItem key={it.id} item={it} isLast={index === items.length - 1} />
        ))}
      </View>
    </Surface>
  );
}

export function MobileOperationalWorkspace({ title, description, overview, onBack, children, stickyPrimaryAction }: MobileOperationalWorkspaceProps) {
  return (
    <Box gap={3}>
      <Surface tone="raised" gap={2}>
        {title ? <Text role="titleMd">{title}</Text> : null}
        {description ? <Text role="bodySm" tone="muted">{description}</Text> : null}
        {overview}
      </Surface>
      <Box gap={2}>{children}</Box>
      {stickyPrimaryAction}
    </Box>
  );
}

export function MobileInlineManagementPanel({ title, subtitle, open, onToggle, summaryItems = [], children, footer }: MobileInlineManagementPanelProps) {
  return (
    <Box>
      <Button label={title ?? 'Manage'} onPress={onToggle} />
      {open ? (
        <Surface tone="inset" gap={2}>
          {subtitle ? <Text role="bodySm" tone="muted">{subtitle}</Text> : null}
          <Box gap={2}>
            {summaryItems.map((s, i) => (
              <Text key={i} role="bodySm">{s.label}: {s.value}</Text>
            ))}
          </Box>
          <Box>{children}</Box>
          {footer}
        </Surface>
      ) : null}
    </Box>
  );
}

export function MobileQuickActions({ title, items = [] }: MobileQuickActionsProps) {
  return (
    <Box gap={2}>
      {title ? <Text role="label">{title}</Text> : null}
      <Box layoutDirection="row" gap={2}>
        {items.map((it) => (
          <Button key={it.id} label={it.label} onPress={it.onPress} />
        ))}
      </Box>
    </Box>
  );
}

export function MobileStickyPrimaryAction({ label, helperText, onPress, disabled }: MobileStickyPrimaryActionProps) {
  return (
    <Surface tone="default" padding={3} gap={1}>
      <Button label={label} onPress={onPress} disabled={disabled} />
      {helperText ? <Text role="caption" tone="muted">{helperText}</Text> : null}
    </Surface>
  );
}

export default MobileCommandCenterShell;
