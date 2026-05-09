'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';

export type OperationsConfidenceLevel = 'high' | 'medium' | 'low';

const CONFIDENCE_STYLES: Record<OperationsConfidenceLevel, { label: string; backgroundColor: string; color: string }> = {
  high: { label: 'ثقة عالية', backgroundColor: '#DCFCE7', color: '#16A34A' },
  medium: { label: 'ثقة متوسطة', backgroundColor: '#FEF3C7', color: '#D97706' },
  low: { label: 'ثقة منخفضة', backgroundColor: '#FEF2F2', color: '#DC2626' },
};

export function ConfidenceBadge({ level }: { level: OperationsConfidenceLevel }) {
  const { label, backgroundColor, color } = CONFIDENCE_STYLES[level];

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
  return (
    <Box
      gap={2}
      style={{
        marginTop: '4px',
        padding: '12px',
        backgroundColor: 'rgba(10,47,92,0.03)',
        border: '1px solid rgba(10,47,92,0.08)',
        borderRadius: '12px',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
          <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C', whiteSpace: 'nowrap' }}>{title}:</Text>
          <Text role="bodyStrong" style={{ color: '#0A2F5C', flex: 1, minWidth: 0 }}>{label}</Text>
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
