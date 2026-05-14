import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, resolveRowDirection, spacing, type RadiusToken } from '../foundation';
import { getBThwaniAppearanceTokens, type BThwaniAppearanceMode } from '../appearance';
import { useBThwaniAppearance, useDirection } from '../providers';
import { Box, Text } from '../primitives';
import { Button, Chip, type ButtonProps, type ChipProps } from './button';
import { Card, type CardProps } from './card';

export type GlassCardProps = Omit<CardProps, 'tone'> & {
  emphasis?: 'subtle' | 'strong';
};

export function GlassCard({ emphasis = 'subtle', ...props }: GlassCardProps) {
  return <Card tone={emphasis === 'strong' ? 'glassStrong' : 'glass'} {...props} />;
}

export type GlassChipProps = Omit<ChipProps, 'tone'> & {
  emphasis?: 'subtle' | 'strong';
};

export function GlassChip({ emphasis = 'subtle', ...props }: GlassChipProps) {
  return <Chip tone={emphasis === 'strong' ? 'glassStrong' : 'glass'} {...props} />;
}

export type GlassActionButtonProps = Omit<ButtonProps, 'tone'> & {
  emphasis?: 'subtle' | 'strong';
};

export function GlassActionButton({ emphasis = 'subtle', ...props }: GlassActionButtonProps) {
  return <Button tone={emphasis === 'strong' ? 'glassStrong' : 'glass'} {...props} />;
}

export type GlassHeroOverlayProps = {
  children?: React.ReactNode;
  strength?: 'default' | 'strong';
  radiusToken?: RadiusToken;
  style?: StyleProp<ViewStyle>;
};

export function GlassHeroOverlay({
  children,
  strength = 'default',
  radiusToken = 'xl',
  style,
}: GlassHeroOverlayProps) {
  const { tokens } = useBThwaniAppearance();

  return (
    <Box
      padding={0}
      gap={0}
      radiusToken={radiusToken}
      style={[
        {
          backgroundColor: strength === 'strong' ? tokens.heroOverlayStrong : tokens.heroOverlay,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </Box>
  );
}

export type AppearanceOptionCardProps = Omit<CardProps, 'tone' | 'title' | 'subtitle' | 'children' | 'footer'> & {
  title: string;
  description: string;
  mode: BThwaniAppearanceMode;
  selected?: boolean;
  modeLabel?: string;
  statusLabel?: string;
};

export function AppearanceOptionCard({
  title,
  description,
  mode,
  selected = false,
  modeLabel,
  statusLabel = 'Foundation only',
  ...cardProps
}: AppearanceOptionCardProps) {
  const { direction } = useDirection();
  const rowDirection = resolveRowDirection(direction);
  const preview = getBThwaniAppearanceTokens(mode);
  const resolvedModeLabel = modeLabel ?? (mode === 'lightPremium' ? 'Light premium' : 'Dark glass');
  const previewSummary = mode === 'lightPremium'
    ? 'Base light with selective glass accents.'
    : 'Full dark glass foundation for premium surfaces.';

  return (
    <GlassCard
      {...cardProps}
      emphasis={selected ? 'strong' : 'subtle'}
      title={title}
      subtitle={description}
      footer={(
        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: rowDirection, alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
            <GlassChip label={resolvedModeLabel} selected={selected} emphasis={selected ? 'strong' : 'subtle'} />
            <Text role="bodySm" tone="muted">
              {statusLabel}
            </Text>
          </View>
          <GlassHeroOverlay
            strength={selected ? 'strong' : 'default'}
            radiusToken="lg"
            style={{ padding: spacing[3], gap: spacing[2] }}
          >
            <Text role="bodyStrong" style={{ color: preview.glassText }}>
              {previewSummary}
            </Text>
            <Text role="bodySm" style={{ color: preview.glassMutedText }}>
              No app adoption in this phase.
            </Text>
          </GlassHeroOverlay>
          <View style={{ flexDirection: rowDirection, gap: spacing[2] }}>
            <View
              style={{
                flex: 1,
                minHeight: 56,
                borderRadius: radius.lg,
                backgroundColor: preview.surface,
                borderWidth: 1,
                borderColor: preview.border,
              }}
            />
            <View
              style={{
                flex: 1,
                minHeight: 56,
                borderRadius: radius.lg,
                backgroundColor: preview.glassSurfaceStrong,
                borderWidth: 1,
                borderColor: preview.glassBorder,
              }}
            />
            <View
              style={{
                flex: 1,
                minHeight: 56,
                borderRadius: radius.lg,
                backgroundColor: preview.actionSelectedBackground,
                borderWidth: 1,
                borderColor: preview.accent,
              }}
            />
          </View>
        </View>
      )}
    />
  );
}
