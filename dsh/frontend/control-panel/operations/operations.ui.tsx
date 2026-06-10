'use client';

import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';

export type OperationsConfidenceLevel = 'high' | 'medium' | 'low';

export function ConfidenceBadge({ level }: { level: OperationsConfidenceLevel }) {
  const { theme } = useTheme();
  const confidenceStyles: Record<OperationsConfidenceLevel, { label: string; backgroundColor: string; color: string }> = {
    high: { label: 'ثقة عالية', backgroundColor: theme.successSurface, color: theme.success },
    medium: { label: 'ثقة متوسطة', backgroundColor: theme.warningSurface, color: theme.warning },
    low: { label: 'ثقة منخفضة', backgroundColor: theme.dangerSurface, color: theme.danger },
  };
  const { label, backgroundColor, color } = confidenceStyles[level];

  return (
    <span
      style={{
        fontSize: '10px',
        fontWeight: 700,
        padding: '2px 6px',
        borderRadius: '99px',
        backgroundColor,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

export type OperationsSuggestionCardProps = {
  title?: string;
  label: string;
  reason: string;
  confidence: OperationsConfidenceLevel;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

/**
 * @deprecated Use WebControlPanelRecommendation or WebControlPanelDecisionRow from @bthwani/ui-kit/web
 */
export function OperationsSuggestionCard({
  title = 'توصية النظام',
  label,
  reason,
  confidence,
  children,
  actions,
}: OperationsSuggestionCardProps) {
  const { theme } = useTheme();
  return (
    <Box
      gap={2}
      style={{
        marginTop: '4px',
        padding: '12px',
        backgroundColor: theme.surfaceInset,
        border: `1px solid ${theme.lineStrong}`,
        borderRadius: '12px',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
          <Text role="caption" weight="black" style={{ color: theme.brandHeaderBackground, whiteSpace: 'nowrap' }}>{title}:</Text>
          <Text role="bodyStrong" style={{ color: theme.brandHeaderBackground, flex: 1, minWidth: 0 }}>{label}</Text>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <ConfidenceBadge level={confidence} />
          {children}
        </div>
      </div>
      <Text role="caption" tone="muted" style={{ lineHeight: '1.4' }}>السبب: {reason}</Text>
      {actions && <div style={{ marginTop: 4 }}>{actions}</div>}
    </Box>
  );
}
