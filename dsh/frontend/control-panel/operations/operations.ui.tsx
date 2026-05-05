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

export function OperationsSuggestionCard({
  title = 'توصية النظام',
  label,
  reason,
  confidence,
  children,
  actions,
}: OperationsSuggestionCardProps) {
  return (
    <div
      style={{
        marginTop: '4px',
        padding: '6px 8px',
        backgroundColor: 'rgba(10,47,92,0.03)',
        border: '1px solid rgba(10,47,92,0.07)',
        borderRadius: '8px',
        display: 'grid',
        gap: '4px',
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
          minWidth: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flexWrap: 'wrap' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#0A2F5C', lineHeight: 1.25, whiteSpace: 'nowrap' }}>
            {title}:
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0A2F5C', lineHeight: 1.35, minWidth: 0 }}>
            {label}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
          <ConfidenceBadge level={confidence} />
          {children}
        </div>
      </div>
      <div
        style={{
          fontSize: '11px',
          color: '#64748B',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2 as unknown as number,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}
      >
        السبب: {reason}
      </div>
      {actions ? (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0' }}>{actions}</div>
      ) : null}
    </div>
  );
}
