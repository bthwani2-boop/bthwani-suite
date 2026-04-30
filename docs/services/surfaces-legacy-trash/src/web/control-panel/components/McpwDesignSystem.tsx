'use client';
import { DirectionalIcon } from '@bthwani/ui-kit';

/**
 * McpwDesignSystem — Unified design components for CONTROL PANEL
 *
 * Smart, modern, smooth, RTL-safe.
 * Single source of truth for section screens.
 */

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';

export interface McpwHubPageProps {
  children: React.ReactNode;
  className?: string;
}

export function McpwHubPage({
  children,
  className = '',
}: McpwHubPageProps) {
  const { isRTL } = useI18n();

  return (
    <div
      className={[
        'relative w-full max-w-full min-w-0 space-y-6 overflow-hidden rounded-[30px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-44 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_58%)]'
      />
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// McpwQuickLinkCard — One-click card, smooth hover, RTL
// ═══════════════════════════════════════════════════════════════════════════
export interface McpwQuickLinkCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

export function McpwQuickLinkCard({
  href,
  title,
  description,
  icon,
  color,
  badge,
}: McpwQuickLinkCardProps) {
  return (
    <Link
      href={href}
      className='group flex min-h-[124px] min-w-0 flex-col justify-between rounded-[20px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]'
      style={
        {
          borderColor: `${color}22`,
        } as React.CSSProperties
      }
    >
      <div className='flex items-start justify-between gap-3'>
        <div
          className='flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] transition-transform duration-200 group-hover:scale-[1.04]'
          style={{ backgroundColor: `${color}14` }}
        >
          {icon}
        </div>
        <DirectionalIcon
          icon={ChevronLeft}
          mirrorInRTL={true}
          size={18}
          className='shrink-0 text-slate-300 transition-transform duration-200 group-hover:text-slate-500 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5'
        />
      </div>
      <div className='min-w-0'>
        <div className='mb-1 flex items-center gap-2'>
          <h3 className='truncate text-[15px] font-semibold text-slate-900'>
            {title}
          </h3>
          {badge && (
            <span
              className='shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white'
              style={{ backgroundColor: color }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className='line-clamp-2 text-[13px] leading-6 text-slate-500'>
          {description}
        </p>
        <div className='mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange-600'>
          دخول سريع
        </div>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// McpwCategorySection — Section header + responsive grid
// ═══════════════════════════════════════════════════════════════════════════
export interface McpwCategorySectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}

export function McpwCategorySection({
  title,
  description,
  icon,
  color,
  children,
}: McpwCategorySectionProps) {
  return (
    <section className='rounded-[26px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] sm:p-5'>
      <div className='mb-5 flex items-center gap-3'>
        <div
          className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'
          style={{ backgroundColor: `${color}18` }}
        >
          {icon}
        </div>
        <div>
          <h2 className='text-[17px] font-bold text-slate-900'>{title}</h2>
          <p className='text-[13px] text-slate-500'>{description}</p>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {children}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// McpwSectionHeader — Page header with icon
// ═══════════════════════════════════════════════════════════════════════════
export interface McpwSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  shadowColor: string;
  primaryAction?: React.ReactNode;
}

export function McpwSectionHeader({
  title,
  subtitle,
  icon,
  gradientFrom,
  gradientTo,
  shadowColor,
  primaryAction,
}: McpwSectionHeaderProps) {
  return (
    <div className='flex flex-wrap items-start justify-between gap-4 rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_10px_32px_rgba(15,23,42,0.06)] backdrop-blur sm:p-6'>
      <div className='flex items-center gap-4'>
        <div
          className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl'
          style={{
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            boxShadow: `0 8px 24px ${shadowColor}40`,
          }}
        >
          {icon}
        </div>
        <div>
          <h1 className='text-[26px] font-extrabold tracking-tight text-slate-900'>
            {title}
          </h1>
          {subtitle && <p className='mt-1 text-[14px] text-slate-500'>{subtitle}</p>}
        </div>
      </div>
      {primaryAction && <div className='shrink-0'>{primaryAction}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// McpwListCard — List/card for Employees, Campaigns, etc.
// ═══════════════════════════════════════════════════════════════════════════
export interface McpwListCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  status?: { label: string; bg: string; text: string };
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function McpwListCard({
  title,
  subtitle,
  icon,
  iconColor = '#6B7280',
  status,
  actions,
  children,
}: McpwListCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-200 hover:border-gray-200 hover:shadow-lg min-w-0">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3 items-center min-w-0">
          {icon && (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${iconColor}18` }}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-900 truncate">{title}</h3>
            {subtitle && <p className="text-[13px] text-gray-500 truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {status && (
            <span
              className="text-[12px] font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: status.bg, color: status.text }}
            >
              {status.label}
            </span>
          )}
          {actions}
        </div>
      </div>
      {children && <div className="mt-4 pt-4 border-t border-gray-100">{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// McpwInfoBanner — Soft info/coming-soon banner
// ═══════════════════════════════════════════════════════════════════════════
export interface McpwInfoBannerProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant?: 'info' | 'warning' | 'success';
}

export function McpwInfoBanner({
  title,
  description,
  icon,
  variant = 'info',
}: McpwInfoBannerProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500',
      title: 'text-blue-900',
      desc: 'text-blue-700',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-500',
      title: 'text-amber-900',
      desc: 'text-amber-700',
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-500',
      title: 'text-emerald-900',
      desc: 'text-emerald-700',
    },
  };
  const s = styles[variant];

  return (
    <div
      className={`flex items-center gap-4 p-5 rounded-2xl border mb-8 ${s.bg} ${s.border}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white ${s.iconBg}`}>
        {icon}
      </div>
      <div>
        <h3 className={`text-[15px] font-semibold ${s.title}`}>{title}</h3>
        <p className={`text-[13px] mt-0.5 ${s.desc}`}>{description}</p>
      </div>
    </div>
  );
}

