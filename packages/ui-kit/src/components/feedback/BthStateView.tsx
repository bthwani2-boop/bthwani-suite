import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { type BthStateId, type BthStateKind, getBthStateDefinition } from '../../states';
import { BthButton } from '../actions/BthButton';
import { BthSurface, BthText } from '../../primitives';

export type BthStateViewProps = {
  kind?: BthStateKind;
  stateId?: BthStateId;
  language?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function BthStateView({ kind, stateId, language, title, description, actionLabel, onActionPress }: BthStateViewProps) {
  const { language: contextLanguage } = useDirection();
  const { theme } = useTheme();
  const stateDefinition = stateId ? getBthStateDefinition(stateId, language ?? contextLanguage) : undefined;
  const resolvedKind = kind ?? stateDefinition?.kind ?? 'empty';
  const resolvedTitle = title ?? stateDefinition?.title ?? (resolvedKind === 'loading' ? 'جار التحميل' : 'No state title');
  const resolvedDescription = description ?? stateDefinition?.description;
  const resolvedActionLabel = actionLabel ?? stateDefinition?.actionLabel;
  const tone = stateDefinition?.tone ?? (resolvedKind === 'error' ? 'danger' : resolvedKind === 'success' ? 'success' : resolvedKind === 'warning' ? 'warning' : resolvedKind === 'loading' ? 'info' : 'neutral');
  const appearance = {
    neutral: { surfaceTone: 'inset' as const, accentColor: theme.lineStrong, textTone: 'muted' as const, buttonTone: 'secondary' as const },
    info: { surfaceTone: 'info' as const, accentColor: theme.info, textTone: 'info' as const, buttonTone: 'secondary' as const },
    success: { surfaceTone: 'success' as const, accentColor: theme.success, textTone: 'success' as const, buttonTone: 'success' as const },
    warning: { surfaceTone: 'warning' as const, accentColor: theme.warning, textTone: 'warning' as const, buttonTone: 'secondary' as const },
    danger: { surfaceTone: 'danger' as const, accentColor: theme.danger, textTone: 'danger' as const, buttonTone: 'danger' as const }
  }[tone];

  return (
    <BthSurface tone={appearance.surfaceTone} padding={6} gap={4} style={{ alignItems: 'center' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', gap: spacing[3], width: '100%' }}>
        <View style={{ width: 56, height: 5, borderRadius: 999, backgroundColor: appearance.accentColor }} />
        {resolvedKind === 'loading' ? <ActivityIndicator color={appearance.accentColor} size="large" /> : null}
        <View style={{ alignItems: 'center', gap: spacing[2], width: '100%' }}>
          <BthText role="titleSm" align="center">{resolvedTitle}</BthText>
          {resolvedDescription ? <BthText role="bodyMd" tone={appearance.textTone} align="center">{resolvedDescription}</BthText> : null}
        </View>
        {resolvedActionLabel && onActionPress ? (
          <BthButton label={resolvedActionLabel} onPress={onActionPress} fullWidth={false} tone={appearance.buttonTone} />
        ) : null}
      </View>
    </BthSurface>
  );
}
