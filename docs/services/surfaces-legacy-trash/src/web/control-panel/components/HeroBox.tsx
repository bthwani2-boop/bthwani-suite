'use client';

import Link from 'next/link';
import { semanticRoles } from '@bthwani/ui-kit';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';
import DirectionalIcon from './DirectionalIcon';

export interface HeroBoxProps {
  /**  Primary action title (e.g., "5 Pending Payouts") */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Action href link */
  href: string;
  /** Custom icon (defaults to CheckCircle) */
  icon?: ReactNode;
  /** Background color for icon (defaults to primary success) */
  iconBgColor?: string;
  /** Icon color (defaults to primary CTA) */
  iconColor?: string;
  /** Call-to-action button label (defaults to "View") */
  actionLabel?: string;
  /** Optional loading state */
  isLoading?: boolean;
  /** Optional disabled state */
  isDisabled?: boolean;
}

/**
 * HeroBox — Primary CTA component for urgent actions
 *
 * Features:
 * - Smooth hover animation (scale + shadow)
 * - Icon fade-in animation
 * - Arrow movement on hover
 * - RTL-compatible
 * - Accessible focus states
 *
 * Usage:
 * <HeroBox
 *   title="5 Pending Payouts"
 *   subtitle="Approve pending transactions"
 *   href="/finance/payouts?status=pending"
 *   actionLabel="Approve All"
 * />
 */
export const HeroBox = ({
  title,
  subtitle,
  href,
  icon,
  iconBgColor = semanticRoles.stateSuccess.background,
  iconColor = semanticRoles.stateSuccess.icon,
  actionLabel = 'View',
  isLoading = false,
  isDisabled = false,
}: HeroBoxProps) => {
  const content = (
    <div
      className='relative flex flex-wrap items-center gap-4 rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]'
      style={{
        backgroundColor: semanticRoles.surface,
        borderColor: isDisabled ? semanticRoles.border : iconColor,
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      {/* Icon Container — Smooth scale animation */}
      <div
        className='flex h-14 w-14 shrink-0 items-center justify-center rounded-lg transition-all duration-300 hover:scale-110'
        style={{
          backgroundColor: `${iconColor}20`,
          color: iconColor,
        }}
      >
        {icon || <CheckCircle className='h-7 w-7' strokeWidth={2} />}
      </div>

      {/* Text Content */}
      <div className='min-w-0 flex-1'>
        <div
          className='text-base font-semibold leading-snug'
          style={{ color: semanticRoles.text }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            className='mt-1 text-sm'
            style={{ color: semanticRoles.textSecondary }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Action Arrow — Smooth translate animation, RTL-aware */}
      <div
        className='flex shrink-0 items-center gap-2 transition-all duration-300 group-hover:translate-x-1'
        style={{ color: iconColor }}
      >
        <span className='text-sm font-medium hidden sm:inline'>
          {actionLabel}
        </span>
        <DirectionalIcon
          icon={ArrowRight}
          className='h-5 w-5 transition-transform duration-300'
          mirrorInRTL={true}
        />
      </div>
    </div>
  );

  if (isDisabled) {
    return content;
  }

  return (
    <Link
      href={href}
      className='group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
    >
      {content}
    </Link>
  );
};

export default HeroBox;
