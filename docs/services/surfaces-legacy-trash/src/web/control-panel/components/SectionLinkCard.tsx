'use client';

/**
 * Reusable section link card for CONTROL PANEL quick links / hub. RTL-safe.
 */
import React from 'react';
import Link from 'next/link';
import { semanticRoles, DirectionalIcon } from '@bthwani/ui-kit';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export interface SectionLinkCardProps {
  href: string;
  title: string;
  description: string;
  actionLabel: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export function SectionLinkCard({
  href,
  title,
  description,
  actionLabel,
  icon: Icon,
  iconBgColor,
  iconColor,
}: SectionLinkCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border p-6 transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: semanticRoles.surface,
        border: `1px solid ${semanticRoles.border}`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 rounded-lg p-3"
          style={{
            backgroundColor: iconBgColor ?? semanticRoles.surfaceSubtle,
            color: iconColor ?? semanticRoles.textMuted,
          }}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="mb-1.5 text-[16px] font-semibold leading-snug"
            style={{ color: semanticRoles.text }}
          >
            {title}
          </h3>
          <p
            className="mb-4 line-clamp-2 text-[14px] leading-relaxed"
            style={{ color: semanticRoles.textSecondary }}
          >
            {description}
          </p>
          <div
            className="inline-flex items-center gap-1.5 text-[14px] font-medium transition-all group-hover:gap-2"
            style={{ color: semanticRoles.primaryCTA }}
          >
            {actionLabel}
            <DirectionalIcon icon={ArrowRight} mirrorInRTL={true} className="h-4 w-4" strokeWidth={2}  />
          </div>
        </div>
      </div>
    </Link>
  );
}

