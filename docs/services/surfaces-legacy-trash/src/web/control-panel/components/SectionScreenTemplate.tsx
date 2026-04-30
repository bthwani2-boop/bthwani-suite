'use client';

/**
 * SectionScreenTemplate — Modern Professional Layout
 * Smart, smooth, RTL-safe.
 */

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export interface SectionScreenTemplateProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  primaryAction?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

export function SectionScreenTemplate({
  title,
  subtitle,
  icon: Icon,
  primaryAction,
  filters,
  children,
  contentClassName = '',
}: SectionScreenTemplateProps) {
  const { isRTL } = useI18n();
  const resolvedContentClassName = ['min-h-0 flex-1', contentClassName]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className='w-full max-w-full min-w-0 h-full min-h-0 flex flex-col'
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <header className='flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-gray-200'>
        <div className='flex items-center gap-3 flex-1 min-w-0'>
          {Icon && (
            <div
              className='w-11 h-11 rounded-xl flex items-center justify-center shrink-0'
              style={{
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
              }}
            >
              <Icon size={22} color='#FFF' strokeWidth={2} />
            </div>
          )}
          <div className='min-w-0'>
            <h1 className='text-[20px] font-bold text-gray-900 leading-tight'>
              {title}
            </h1>
            {subtitle && (
              <p className='text-[13px] text-gray-500 mt-1'>{subtitle}</p>
            )}
          </div>
        </div>
        {primaryAction && <div className='shrink-0'>{primaryAction}</div>}
      </header>

      {filters && <div className='mb-4'>{filters}</div>}

      <div className={resolvedContentClassName}>{children}</div>
    </div>
  );
}
