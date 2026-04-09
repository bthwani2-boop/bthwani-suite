'use client';

import { semanticRoles } from '@bthwani/ui-kit';
import { LucideIcon, InboxIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface EmptyStateProps {
  /**  Icon to display */
  icon?: LucideIcon;
  /**  Title text */
  title: string;
  /**  Subtitle or description */
  description?: string;
  /**  Optional action button label */
  actionLabel?: string;
  /**  Optional action button callback */
  onAction?: () => void;
  /**  Custom content below description */
  children?: ReactNode;
}

/**
 * EmptyState — No data / no results state
 * 
 * Features:
 * - Icon support (Lucide)
 * - Title + description
 * - Optional CTA
 * - Clean, centered layout
 * - RTL-compatible
 * 
 * Usage:
 * <EmptyState
 *   title="No pending tasks"
 *   description="You're all caught up!"
 *   icon={CheckCircle}
 * />
 */
export const EmptyState = ({
  icon: Icon = InboxIcon,
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div
        className="mb-4 p-3 rounded-full"
        style={{
          backgroundColor: `${semanticRoles.primaryCTA}10`,
          color: semanticRoles.primaryCTA,
        }}
      >
        <Icon className="h-8 w-8" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: semanticRoles.text }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className="text-sm mb-6 max-w-md"
          style={{ color: semanticRoles.textSecondary }}
        >
          {description}
        </p>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: semanticRoles.primaryCTA,
            color: 'white',
          }}
        >
          {actionLabel}
        </button>
      )}

      {/* Custom Content */}
      {children}
    </div>
  );
};

export default EmptyState;
