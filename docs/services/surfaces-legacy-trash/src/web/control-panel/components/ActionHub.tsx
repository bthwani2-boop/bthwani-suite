'use client';
import { DirectionalIcon } from '@bthwani/ui-kit';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit/i18n';
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ActionItem {
  id: string;
  title: string;
  count?: number;
  priority: 'critical' | 'high' | 'normal';
  href: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

interface ActionHubProps {
  items: ActionItem[];
  maxVisible?: number;
  title?: string;
  onActionComplete?: (id: string) => void;
}

const priorityStyles = {
  critical: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-500 text-white',
    ring: 'ring-rose-100',
  },
  high: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-500 text-white',
    ring: 'ring-amber-100',
  },
  normal: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-500 text-white',
    ring: 'ring-blue-100',
  },
};

function ActionRow({ item, onAction }: { item: ActionItem; onAction?: () => void }) {
  const { t, isRTL } = useI18n();
  const style = priorityStyles[item.priority];
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={(e) => {
        if (item.onAction) {
          e.preventDefault();
          item.onAction();
          onAction?.();
        }
      }}
      className="group flex items-center gap-4 p-4 -mx-4 rounded-xl transition-colors hover:bg-gray-50"
    >
      <div className={`
        relative w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center
        ring-2 ring-offset-2 ${style.ring}
        transition-transform group-hover:scale-105
      `}>
        <Icon className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
        <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${style.dot} ring-2 ring-white`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 truncate">{item.title}</span>
          {item.priority === 'critical' && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${style.badge}`}>
              URGENT
            </span>
          )}
        </div>
        {item.count !== undefined && (
          <span className="text-sm text-gray-500">{item.count} {t('control panel.action_hub.items')}</span>
        )}
      </div>

      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        bg-gray-900 text-white
        transition-all group-hover:gap-3 group-hover:bg-gray-800
      `}>
        {item.actionLabel || t('common.view')}
        <DirectionalIcon icon={ArrowRight} mirrorInRTL={true} className="w-4 h-4 transition-transform group-hover:translate-x-0.5  rtl:group-hover:-translate-x-0.5"  />
      </div>
    </Link>
  );
}

export function ActionHub({ items, maxVisible = 3, title, onActionComplete }: ActionHubProps) {
  const { t, isRTL } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const sorted = [...items].sort((a, b) => {
    const order = { critical: 0, high: 1, normal: 2 };
    return order[a.priority] - order[b.priority];
  });

  const visible = expanded ? sorted : sorted.slice(0, maxVisible);
  const hasMore = sorted.length > maxVisible;
  const criticalCount = sorted.filter((i) => i.priority === 'critical').length;

  if (!items.length) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <p className="text-lg font-semibold text-gray-900">{t('control panel.action_hub.all_clear')}</p>
        <p className="text-sm text-gray-500 mt-1">{t('control panel.action_hub.all_clear_desc')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title || t('control panel.action_hub.title')}</h3>
            {criticalCount > 0 && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {t('control panel.action_hub.critical_pending', { count: criticalCount })}
              </p>
            )}
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
          {items.length} {t('control panel.action_hub.items')}
        </span>
      </div>

      {/* Items */}
      <div className="px-6 py-2 divide-y divide-gray-50">
        {visible.map((item) => (
          <ActionRow key={item.id} item={item} onAction={() => onActionComplete?.(item.id)} />
        ))}
      </div>

      {/* Expand */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-violet-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          {expanded ? (
            <>{t('control panel.action_hub.show_less')} <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>{t('control panel.action_hub.show_more', { count: sorted.length - maxVisible })} <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
}

export default ActionHub;

