'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit/i18n';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  href?: string;
  icon?: LucideIcon;
  sparkline?: number[];
}

interface SmartMetricStripProps {
  metrics: MetricItem[];
  isLoading?: boolean;
}

function MiniChart({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data.length) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 40;
  const w = 80;
  
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="opacity-60">
      <defs>
        <linearGradient id={`grad-${positive}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={positive ? '#10B981' : '#F43F5E'} stopOpacity="0.2" />
          <stop offset="100%" stopColor={positive ? '#10B981' : '#F43F5E'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,${h} L${pts.split(' ').map(p => p).join(' L')} L${w},${h} Z`}
        fill={`url(#grad-${positive})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={positive ? '#10B981' : '#F43F5E'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetricCard({ metric, isLoading }: { metric: MetricItem; isLoading?: boolean }) {
  const { isRTL } = useI18n();
  const Icon = metric.icon;

  const inner = (
    <div className={`
      relative overflow-hidden rounded-2xl bg-white p-6
      border border-gray-100
      transition-all duration-300
      ${metric.href ? 'hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 cursor-pointer group' : ''}
    `}>
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-4 w-24 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                </div>
              )}
              <span className="text-sm font-medium text-gray-500">{metric.label}</span>
            </div>
            {metric.href && (
              <ArrowUpRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold text-gray-900 tracking-tight">
                {typeof metric.value === 'number' ? metric.value.toLocaleString('ar-SA') : metric.value}
              </div>
              {metric.trend && (
                <div className={`
                  inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium
                  ${metric.trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
                `}>
                  {metric.trend.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {metric.trend.isPositive ? '+' : ''}{metric.trend.value}%
                </div>
              )}
            </div>
            {metric.sparkline && metric.trend && (
              <MiniChart data={metric.sparkline} positive={metric.trend.isPositive} />
            )}
          </div>
        </>
      )}
    </div>
  );

  return metric.href ? <Link href={metric.href} className="block">{inner}</Link> : inner;
}

export function SmartMetricStrip({ metrics, isLoading }: SmartMetricStripProps) {
  const { isRTL } = useI18n();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {metrics.map((m) => <MetricCard key={m.id} metric={m} isLoading={isLoading} />)}
    </div>
  );
}

export default SmartMetricStrip;
