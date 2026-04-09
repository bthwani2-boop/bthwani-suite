'use client';

import Link from 'next/link';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { LucideIcon, ArrowRight, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { ReactNode } from 'react';
import DirectionalIcon from './DirectionalIcon';

export type WorkItemPriority = 'critical' | 'high' | 'normal' | 'low';
export type WorkItemType = 'action' | 'alert' | 'task';

export interface WorkQueueItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  priority: WorkItemPriority;
  type: WorkItemType;
  badge?: string;
  badgeColor?: string;
}

export interface WorkQueueV2Props {
  /**  List of work items to display */
  items: WorkQueueItem[];
  /**  Maximum items to display (defaults to 4) */
  maxItems?: number;
  /**  Header title */
  title: string;
  /**  Optional custom footer */
  footerContent?: ReactNode;
  /**  Callback when an item is clicked */
  onItemClick?: (itemId: string) => void;
}

/**
 * Priority badge colors
 */
const priorityColors = {
  critical: { bg: '#FEE2E2', text: '#DC2626', icon: '#DC2626' },
  high: { bg: '#FEF3C7', text: '#D97706', icon: '#D97706' },
  normal: { bg: '#DBEAFE', text: '#2563EB', icon: '#2563EB' },
  low: { bg: '#E5E7EB', text: '#6B7280', icon: '#6B7280' },
};

/**
 * WorkQueueV2 — Priority-based work queue with icons and badges
 * 
 * Features:
 * - Priority indicators (critical, high, normal, low)
 * - Type badges (action, alert, task)
 * - Limited items display (max 4 by default)
 * - Clean, scannable layout
 * - RTL-compatible
 * 
 * Usage:
 * <WorkQueueV2
 *   title="Today's Work"
 *   items={[
 *     { id: '1', title: 'Driver offline', priority: 'critical', type: 'alert', ... },
 *   ]}
 *   maxItems={4}
 * />
 */
export const WorkQueueV2 = ({
  items,
  maxItems = 4,
  title,
  footerContent,
  onItemClick,
}: WorkQueueV2Props) => {
  const { t } = useI18n();
  const displayItems = items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  const getPriorityIcon = (priority: WorkItemPriority) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="h-4 w-4" strokeWidth={2} />;
      case 'high':
        return <Clock className="h-4 w-4" strokeWidth={2} />;
      case 'normal':
      case 'low':
      default:
        return <CheckCircle className="h-4 w-4" strokeWidth={2} />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2
          className="text-sm font-semibold"
          style={{ color: semanticRoles.textMuted }}
        >
          {title}
        </h2>
        {hasMore && (
          <span
            className="text-xs font-medium px-2 py-1 rounded"
            style={{
              backgroundColor: `${semanticRoles.primaryCTA}15`,
              color: semanticRoles.primaryCTA,
            }}
          >
            +{items.length - maxItems}
          </span>
        )}
      </div>

      {/* Items Container */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
      >
        {displayItems.length > 0 ? (
          <ul className="divide-y" style={{ borderColor: semanticRoles.border }}>
            {displayItems.map((item, idx) => (
              <li key={item.id} className="group">
                <Link
                  href={item.href}
                  onClick={() => onItemClick?.(item.id)}
                  className="flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-black/2 active:bg-black/5"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  {/* Priority Badge — Pulsing animation for critical */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      item.priority === 'critical' ? 'animate-pulse' : ''
                    }`}
                    style={{
                      backgroundColor: priorityColors[item.priority].bg,
                      color: priorityColors[item.priority].icon,
                    }}
                  >
                    {getPriorityIcon(item.priority)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: semanticRoles.text }}
                      >
                        {item.title}
                      </p>
                      {item.badge && (
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 animate-pulse"
                          style={{
                            backgroundColor: item.badgeColor || `${priorityColors[item.priority].icon}20`,
                            color: item.badgeColor || priorityColors[item.priority].icon,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs mt-0.5 line-clamp-2"
                      style={{ color: semanticRoles.textSecondary }}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow — Smooth slide-right on hover, RTL-aware */}
                  <DirectionalIcon
                    icon={ArrowRight}
                    className="h-4 w-4 shrink-0 transition-all duration-300 group-hover:translate-x-1"
                    mirrorInRTL={true}
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center">
            <p
              className="text-sm"
              style={{ color: semanticRoles.textSecondary }}
            >
              {t('states.empty')}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {footerContent && (
        <div className="mt-3">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default WorkQueueV2;
