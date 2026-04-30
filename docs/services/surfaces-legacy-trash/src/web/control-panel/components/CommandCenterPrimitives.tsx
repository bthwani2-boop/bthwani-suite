'use client';

import React from 'react';
import Link from 'next/link';
import { DirectionalIcon } from '@bthwani/ui-kit';
import {
  ArrowUpRight,
  ChevronLeft,
  Clock3,
  type LucideIcon,
} from 'lucide-react';

export type OverviewTone =
  | 'orange'
  | 'red'
  | 'blue'
  | 'green'
  | 'indigo'
  | 'slate'
  | 'amber';

export type OverviewBadgeTone =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'info'
  | 'critical';

export interface OverviewKpiItem {
  key: string;
  title: string;
  subtitle: string;
  value: string | number;
  trend: number;
  positive: boolean;
  href: string;
  icon: LucideIcon;
  tone: OverviewTone;
}

export interface OverviewQueueAction {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'normal';
  href: string;
  icon: LucideIcon;
  owner: string;
  dueLabel: string;
  count?: number;
}

export interface WorkspaceLaunchItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  tone: OverviewTone;
}

export interface OverviewInsightItem {
  id: string;
  title: string;
  description: string;
  tone?: OverviewBadgeTone;
}

export interface OverviewHealthSignal {
  id: string;
  label: string;
  detail: string;
  status: 'stable' | 'attention' | 'critical';
}

export interface OverviewAlertItem {
  id: string;
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
  tone: OverviewBadgeTone;
}

export interface OverviewActivityItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  href?: string;
  tone: OverviewBadgeTone;
}

const toneClasses: Record<
  OverviewTone,
  {
    iconWrap: string;
    iconText: string;
    accentText: string;
    accentSurface: string;
    accentBorder: string;
  }
> = {
  orange: {
    iconWrap: 'bg-orange-50',
    iconText: 'text-orange-600',
    accentText: 'text-orange-600',
    accentSurface: 'bg-orange-50',
    accentBorder: 'border-orange-200',
  },
  red: {
    iconWrap: 'bg-red-50',
    iconText: 'text-red-600',
    accentText: 'text-red-600',
    accentSurface: 'bg-red-50',
    accentBorder: 'border-red-200',
  },
  blue: {
    iconWrap: 'bg-blue-50',
    iconText: 'text-blue-600',
    accentText: 'text-blue-600',
    accentSurface: 'bg-blue-50',
    accentBorder: 'border-blue-200',
  },
  green: {
    iconWrap: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    accentText: 'text-emerald-600',
    accentSurface: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
  },
  indigo: {
    iconWrap: 'bg-indigo-50',
    iconText: 'text-indigo-600',
    accentText: 'text-indigo-600',
    accentSurface: 'bg-indigo-50',
    accentBorder: 'border-indigo-200',
  },
  slate: {
    iconWrap: 'bg-slate-100',
    iconText: 'text-slate-600',
    accentText: 'text-slate-600',
    accentSurface: 'bg-slate-100',
    accentBorder: 'border-slate-200',
  },
  amber: {
    iconWrap: 'bg-amber-50',
    iconText: 'text-amber-600',
    accentText: 'text-amber-600',
    accentSurface: 'bg-amber-50',
    accentBorder: 'border-amber-200',
  },
};

const badgeClasses: Record<OverviewBadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  info: 'bg-blue-50 text-blue-700',
  critical: 'bg-red-50 text-red-700',
};

const activityDotClasses: Record<OverviewBadgeTone, string> = {
  neutral: 'bg-slate-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  critical: 'bg-red-500',
};

const priorityStyles: Record<
  OverviewQueueAction['priority'],
  { badge: string; text: string; surface: string; ring: string }
> = {
  critical: {
    badge: 'حرج',
    text: 'text-red-700',
    surface: 'bg-red-50',
    ring: 'ring-red-200',
  },
  high: {
    badge: 'مرتفع',
    text: 'text-amber-700',
    surface: 'bg-amber-50',
    ring: 'ring-amber-200',
  },
  normal: {
    badge: 'قياسي',
    text: 'text-blue-700',
    surface: 'bg-blue-50',
    ring: 'ring-blue-200',
  },
};

const healthClasses: Record<OverviewHealthSignal['status'], string> = {
  stable: 'bg-emerald-50 text-emerald-700',
  attention: 'bg-amber-50 text-amber-700',
  critical: 'bg-red-50 text-red-700',
};

function resolveAlertTone(tone: OverviewBadgeTone): string {
  return badgeClasses[tone];
}

export function OverviewBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: OverviewBadgeTone;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClasses[tone]}`}
    >
      {label}
    </span>
  );
}

export function SectionHeader({
  title,
  description,
  icon,
  action,
  iconTone = 'orange',
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  iconTone?: OverviewTone;
}) {
  const tone = toneClasses[iconTone];

  return (
    <div className='mb-4 flex items-center justify-between gap-3'>
      <div className='flex items-center gap-3'>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone.iconWrap} ${tone.iconText}`}
        >
          {icon}
        </div>
        <div>
          <h2 className='text-lg font-bold text-gray-900'>{title}</h2>
          <p className='text-xs text-gray-500'>{description}</p>
        </div>
      </div>
      {action ? <div className='shrink-0'>{action}</div> : null}
    </div>
  );
}

export function FocusKpiCard({
  item,
  locale,
  onNavigate,
}: {
  item: OverviewKpiItem;
  locale: string;
  onNavigate?: (eventId: string, target: string) => void;
}) {
  const Icon = item.icon;
  const tone = toneClasses[item.tone];
  const value =
    typeof item.value === 'number'
      ? item.value.toLocaleString(locale)
      : item.value;

  return (
    <Link
      href={item.href}
      onClick={() => onNavigate?.(`focus-kpi:${item.key}`, item.href)}
      className='group block rounded-2xl border border-slate-200/70 bg-linear-to-b from-white to-slate-50/60 p-5 shadow-[0_4px_18px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
    >
      <div className='mb-4 flex items-start justify-between gap-3'>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.iconWrap}`}
        >
          <Icon className={`h-5 w-5 ${tone.iconText}`} />
        </div>
        <div
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            item.positive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {item.positive ? '+' : '-'}
          {Math.abs(item.trend)}%
        </div>
      </div>
      <div className='mb-1 text-3xl font-bold text-gray-900'>{value}</div>
      <div className='mb-2 text-sm font-medium text-gray-700'>{item.title}</div>
      <div className='flex items-center justify-between text-xs text-gray-500'>
        <span>{item.subtitle}</span>
        <ArrowUpRight
          className={`h-4 w-4 text-gray-300 transition-colors ${tone.accentText}`}
        />
      </div>
    </Link>
  );
}

export function QueueActionRow({
  item,
  onNavigate,
}: {
  item: OverviewQueueAction;
  onNavigate?: (eventId: string, target: string) => void;
}) {
  const Icon = item.icon;
  const style = priorityStyles[item.priority];

  return (
    <div className='rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_8px_22px_rgba(15,23,42,0.08)]'>
      <div className='flex flex-wrap items-start gap-3'>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.surface}`}
        >
          <Icon className={`h-5 w-5 ${style.text}`} />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='mb-1 flex flex-wrap items-center gap-2'>
            <h3 className='text-sm font-semibold text-gray-900'>
              {item.title}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${style.surface} ${style.text} ring-1 ${style.ring}`}
            >
              {style.badge}
            </span>
            {item.count !== undefined ? (
              <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700'>
                {item.count}
              </span>
            ) : null}
          </div>
          <p className='mb-2 text-sm text-gray-600'>{item.description}</p>
          <div className='flex flex-wrap items-center gap-3 text-xs text-gray-500'>
            <span>المالك: {item.owner}</span>
            <span className='flex items-center gap-1'>
              <Clock3 className='h-3.5 w-3.5' />
              {item.dueLabel}
            </span>
          </div>
        </div>
        <Link
          href={item.href}
          onClick={() => onNavigate?.(`queue-action:${item.id}`, item.href)}
          className='inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100'
        >
          نفذ الآن
          <DirectionalIcon
            icon={ChevronLeft}
            mirrorInRTL={true}
            className='h-4 w-4'
          />
        </Link>
      </div>
    </div>
  );
}

export function WorkspaceLaunchCard({
  item,
  onNavigate,
}: {
  item: WorkspaceLaunchItem;
  onNavigate?: (eventId: string, target: string) => void;
}) {
  const Icon = item.icon;
  const tone = toneClasses[item.tone];

  return (
    <Link
      href={item.href}
      onClick={() => onNavigate?.(`workspace:${item.id}`, item.href)}
      className='group flex min-h-[132px] flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
    >
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${tone.iconWrap}`}
      >
        <Icon className={`h-5 w-5 ${tone.iconText}`} />
      </div>
      <div>
        <h3 className='mb-1 text-sm font-semibold text-gray-900'>
          {item.title}
        </h3>
        <p className='line-clamp-2 text-xs leading-5 text-gray-500'>
          {item.subtitle}
        </p>
      </div>
      <div
        className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${tone.accentText}`}
      >
        دخول سريع
        <ArrowUpRight className='h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
      </div>
    </Link>
  );
}

export function InsightNote({
  title,
  description,
  tone = 'neutral',
}: {
  title: string;
  description: string;
  tone?: OverviewBadgeTone;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${resolveAlertTone(tone)} border-transparent`}
    >
      <div className='mb-1 text-xs font-bold text-slate-900'>{title}</div>
      <div className='text-xs leading-5 text-slate-600'>{description}</div>
    </div>
  );
}

export function HealthSignalList({ items }: { items: OverviewHealthSignal[] }) {
  return (
    <div className='space-y-2'>
      {items.map(signal => (
        <div
          key={signal.id}
          className='flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/70 px-3 py-3'
        >
          <div>
            <div className='text-sm font-medium text-slate-800'>
              {signal.label}
            </div>
            <div className='text-xs text-slate-500'>{signal.detail}</div>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${healthClasses[signal.status]}`}
          >
            {signal.status === 'stable'
              ? 'مستقر'
              : signal.status === 'attention'
                ? 'يتطلب مراقبة'
                : 'يتطلب تدخلًا'}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AlertSignalList({
  items,
  onNavigate,
}: {
  items: OverviewAlertItem[];
  onNavigate?: (eventId: string, target: string) => void;
}) {
  return (
    <div className='space-y-2'>
      {items.map(item => {
        const content = (
          <div
            className={`rounded-xl border border-slate-200/70 px-3 py-3 ${resolveAlertTone(item.tone)}`}
          >
            <div className='mb-1 text-xs font-bold text-slate-900'>
              {item.title}
            </div>
            <div className='text-xs leading-5 text-slate-600'>
              {item.description}
            </div>
            {item.href && item.actionLabel ? (
              <div className='mt-2 text-xs font-semibold text-orange-700'>
                {item.actionLabel}
              </div>
            ) : null}
          </div>
        );

        if (!item.href) return <div key={item.id}>{content}</div>;

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() =>
              onNavigate?.(`overview-alert:${item.id}`, item.href!)
            }
            className='block'
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}

export function ActivityTimeline({
  items,
  emptyMessage,
  onNavigate,
}: {
  items: OverviewActivityItem[];
  emptyMessage?: string;
  onNavigate?: (eventId: string, target: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500'>
        {emptyMessage ?? 'لا يوجد نشاط حديث بعد.'}
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {items.map(item => {
        const inner = (
          <div className='rounded-xl border border-slate-200/70 bg-white px-4 py-3 transition-colors hover:bg-slate-50'>
            <div className='mb-1 flex items-center gap-2'>
              <span
                className={`h-2.5 w-2.5 rounded-full ${activityDotClasses[item.tone]}`}
              />
              <div className='text-sm font-semibold text-slate-900'>
                {item.title}
              </div>
            </div>
            <div className='mb-2 text-xs leading-5 text-slate-600'>
              {item.description}
            </div>
            <div className='text-[11px] font-medium text-slate-500'>
              {item.meta}
            </div>
          </div>
        );

        if (!item.href) return <div key={item.id}>{inner}</div>;

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => onNavigate?.(`activity:${item.id}`, item.href!)}
            className='block'
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

export function EmptyActionCenter({
  href,
  onNavigate,
}: {
  href: string;
  onNavigate?: (eventId: string, target: string) => void;
}) {
  return (
    <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-8 text-center'>
      <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm'>
        <ChevronLeft className='h-6 w-6 rotate-180' />
      </div>
      <h3 className='mb-1 text-sm font-bold text-slate-900'>
        لا توجد عناصر ملحة حاليًا
      </h3>
      <p className='mb-4 text-xs text-slate-500'>
        يمكنك الانتقال مباشرة إلى مساحة العمل الرئيسية أو فتح أوامر النظام.
      </p>
      <Link
        href={href}
        onClick={() => onNavigate?.('action-center:empty-cta', href)}
        className='inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600'
      >
        افتح المساحة الرئيسية
        <DirectionalIcon
          icon={ChevronLeft}
          mirrorInRTL={true}
          className='h-4 w-4'
        />
      </Link>
    </div>
  );
}
