import React, { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { bthColors, bthElevation, bthRadius, bthSpacing, bthToneColors, type BthTone } from '../foundation';

export type BthCardProps = {
  children: ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BthCard({ children, padded = true, style }: BthCardProps) {
  return <View style={[styles.card, padded ? styles.padded : undefined, style]}>{children}</View>;
}

export const Card = BthCard;

export type BthBadgeProps = {
  label: string;
  tone?: BthTone;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function BthBadge({ label, tone = 'muted', style, textStyle }: BthBadgeProps) {
  const toneColor = bthToneColors[tone];

  return (
    <View style={[styles.badge, { backgroundColor: toneColor.background, borderColor: toneColor.border }, style]}>
      <Text style={[styles.badgeText, { color: toneColor.foreground }, textStyle]}>{label}</Text>
    </View>
  );
}

export const BthChip = BthBadge;

export type BthStatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  tone?: BthTone;
};

export function BthStatCard({ title, value, subtitle, tone = 'primary' }: BthStatCardProps) {
  return (
    <BthCard>
      <BthBadge label={title} tone={tone} />
      <Text style={styles.statValue}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </BthCard>
  );
}

export type SummaryCardProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function SummaryCard({ title, subtitle, children }: SummaryCardProps) {
  return (
    <BthCard>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </BthCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: bthColors.surface.card,
    borderColor: bthColors.line.soft,
    borderRadius: bthRadius.xl,
    borderWidth: 1,
    ...bthElevation.soft,
  },
  padded: {
    padding: bthSpacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: bthRadius.pill,
    borderWidth: 1,
    paddingHorizontal: bthSpacing.md,
    paddingVertical: bthSpacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: bthColors.text.strong,
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: bthColors.text.muted,
    fontSize: 14,
    marginTop: bthSpacing.xs,
  },
  statValue: {
    color: bthColors.text.strong,
    fontSize: 24,
    fontWeight: '800',
    marginTop: bthSpacing.md,
  },
});
