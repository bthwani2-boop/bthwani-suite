import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { bthColors, bthRadius, bthSpacing, type BthTone } from '../foundation';
import { BthButton } from './button';

export type BthStateViewProps = {
  title: string;
  subtitle?: string;
  tone?: BthTone;
  loading?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BthStateView({ title, subtitle, tone = 'muted', loading = false, actionLabel, onActionPress, style }: BthStateViewProps) {
  return (
    <View style={[styles.root, style]}>
      {loading ? <ActivityIndicator color={bthColors.brand.orange} /> : <View style={styles.mark} />}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel ? <BthButton tone={tone} onPress={onActionPress}>{actionLabel}</BthButton> : null}
    </View>
  );
}

export function BthEmptyState(props: Omit<BthStateViewProps, 'tone'>) {
  return <BthStateView tone="muted" {...props} />;
}

export function BthLoadingState(props: Omit<BthStateViewProps, 'loading'>) {
  return <BthStateView loading {...props} />;
}

export function BthErrorState(props: Omit<BthStateViewProps, 'tone'>) {
  return <BthStateView tone="danger" {...props} />;
}

export function BthSuccessState(props: Omit<BthStateViewProps, 'tone'>) {
  return <BthStateView tone="success" {...props} />;
}

export const AppEmptyState = BthEmptyState;
export const AppLoadingState = BthLoadingState;
export const AppSuccessState = BthSuccessState;
export const ScreenState = BthStateView;
export const Loading = BthLoadingState;
export const ErrorBoundary = BthErrorState;
export const BthStateGallery = BthStateView;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: bthColors.surface.card,
    borderColor: bthColors.line.soft,
    borderRadius: bthRadius.xl,
    borderWidth: 1,
    gap: bthSpacing.md,
    padding: bthSpacing.xxl,
  },
  mark: {
    backgroundColor: bthColors.surface.raised,
    borderRadius: bthRadius.pill,
    height: 40,
    width: 40,
  },
  title: {
    color: bthColors.text.strong,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: bthColors.text.muted,
    fontSize: 14,
    textAlign: 'center',
  },
});
