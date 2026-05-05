'use client';

import React from 'react';

export type OperationsConfidenceLevel = 'high' | 'medium' | 'low';

const CONFIDENCE_STYLES: Record<OperationsConfidenceLevel, { label: string; backgroundColor: string; color: string }> = {
  high: { label: 'ثقة عالية', backgroundColor: '#DCFCE7', color: '#16A34A' },
  medium: { label: 'ثقة متوسطة', backgroundColor: '#FEF3C7', color: '#D97706' },
  low: { label: 'ثقة منخفضة', backgroundColor: '#FEF2F2', color: '#DC2626' },
};

export function ConfidenceBadge({ level }: { level: OperationsConfidenceLevel }) {
  const { label, backgroundColor, color } = CONFIDENCE_STYLES[level];

  return (
    <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '99px', backgroundColor, color }}>
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

export function OperationsSuggestionCard({
  title = 'توصية النظام',
  label,
  reason,
  confidence,
  children,
  actions,
}: OperationsSuggestionCardProps) {
  return (
    <div style={{ marginTop: '8px', padding: '8px 10px', backgroundColor: 'rgba(10,47,92,0.03)', border: '1px solid rgba(10,47,92,0.07)', borderRadius: '6px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0A2F5C', marginBottom: '2px' }}>{title}: {label}</div>
      <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>السبب: {reason}</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        <ConfidenceBadge level={confidence} />
        {children}
      </div>
      {actions ? <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>{actions}</div> : null}
    </div>
  );
}