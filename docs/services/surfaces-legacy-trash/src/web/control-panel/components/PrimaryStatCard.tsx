'use client';

/**
 * Reusable KPI/stat card for CONTROL PANEL dashboard. RTL-safe (logical properties).
 */
import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import type { LucideIcon } from 'lucide-react';

export interface PrimaryStatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  trendLabel?: string;
  icon?: LucideIcon;
  iconColor?: string;
  /** Locale for number formatting (e.g. 'ar-SA') */
  locale?: string;
}

export function PrimaryStatCard({
  label,
  value,
  trend,
  trendLabel,
  icon: Icon,
  iconColor,
  locale = 'ar-SA',
}: PrimaryStatCardProps) {
  const borderColor = iconColor ? `${iconColor}80` : semanticRoles.border;
  return (
    <div
      className="relative rounded-lg p-6 transition-all duration-200 hover:shadow-sm"
      style={{
        backgroundColor: semanticRoles.surface,
        border: `1px solid ${semanticRoles.border}`,
        borderInlineStartWidth: 4,
        borderInlineStartColor: borderColor,
      }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            {Icon && iconColor && (
              <div
                className="shrink-0 rounded-md p-1.5"
                style={{
                  backgroundColor: `${iconColor}20`,
                  color: iconColor,
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
            )}
            <div
              className="text-[13px] font-medium uppercase tracking-wide"
              style={{ color: semanticRoles.textMuted }}
            >
              {label}
            </div>
          </div>
          <div
            className="text-[36px] font-bold leading-none tracking-tight"
            style={{ color: semanticRoles.text }}
          >
            {typeof value === 'number' ? value.toLocaleString(locale) : value}
          </div>
        </div>
      </div>
      {trend && (
        <div
          className="flex items-center gap-2 border-t pt-3"
          style={{ borderColor: semanticRoles.border }}
        >
          <span
            className="text-[12px] font-semibold"
            style={{
              color: trend.isPositive
                ? semanticRoles.stateSuccess.icon
                : semanticRoles.stateError.icon,
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span
            className="text-[12px]"
            style={{ color: semanticRoles.textMuted }}
          >
            {trendLabel ?? ''}
          </span>
        </div>
      )}
    </div>
  );
}

