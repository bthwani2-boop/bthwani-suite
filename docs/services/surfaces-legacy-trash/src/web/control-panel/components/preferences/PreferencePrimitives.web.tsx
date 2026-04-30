'use client';

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';

interface PreferenceScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PreferenceScreenLayout({
  title,
  subtitle,
  children,
}: PreferenceScreenLayoutProps) {
  return (
    <div className="w-full">
      <header className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: semanticRoles.text }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-1 text-sm"
            style={{ color: semanticRoles.textSecondary }}
          >
            {subtitle}
          </p>
        )}
      </header>
      <main className="space-y-6">{children}</main>
    </div>
  );
}

interface PreferenceSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function PreferenceSection({
  title,
  description,
  children,
}: PreferenceSectionProps) {
  return (
    <section className="space-y-3">
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2
              className="text-sm font-semibold"
              style={{ color: semanticRoles.text }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className="text-xs"
              style={{ color: semanticRoles.textSecondary }}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

interface PreferenceCardProps {
  children: React.ReactNode;
}

export function PreferenceCard({ children }: PreferenceCardProps) {
  return (
    <div
      className="rounded-xl border p-4 sm:p-5"
      style={{
        backgroundColor: semanticRoles.surface,
        borderColor: semanticRoles.border,
      }}
    >
      {children}
    </div>
  );
}

interface PreferenceRowProps {
  title: string;
  subtitle?: string;
  trailingSlot?: React.ReactNode;
}

export function PreferenceRow({
  title,
  subtitle,
  trailingSlot,
}: PreferenceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0 flex-1">
        <div
          className="text-sm font-medium"
          style={{ color: semanticRoles.text }}
        >
          {title}
        </div>
        {subtitle && (
          <p
            className="mt-0.5 text-xs"
            style={{ color: semanticRoles.textSecondary }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {trailingSlot && <div className="shrink-0">{trailingSlot}</div>}
    </div>
  );
}

