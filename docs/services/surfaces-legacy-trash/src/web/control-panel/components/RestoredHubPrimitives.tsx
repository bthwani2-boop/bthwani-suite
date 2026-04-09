'use client';

import Link from 'next/link';
import { DirectionalIcon, useI18n } from '@bthwani/ui-kit';
import { ChevronLeft } from 'lucide-react';

export interface RestoredHubHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  shadowColor: string;
  action?: React.ReactNode;
}

export function RestoredHubHeader({
  title,
  subtitle,
  icon,
  gradientFrom,
  gradientTo,
  shadowColor,
  action,
}: RestoredHubHeaderProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${shadowColor}`,
            }}
          >
            {icon}
          </div>
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#1A1A1A',
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>
              {subtitle}
            </p>
          </div>
        </div>
        {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
      </div>
    </div>
  );
}

export interface RestoredHubSectionIntroProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
}

export function RestoredHubSectionIntro({
  title,
  description,
  icon,
  accentColor,
}: RestoredHubSectionIntroProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: `${accentColor}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <div>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#1A1A1A',
              margin: 0,
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function RestoredHubGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

export function RestoredHubCompactGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}

export interface RestoredHubQuickLinkProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

export function RestoredHubQuickLink({
  title,
  description,
  href,
  icon,
  color,
  badge,
}: RestoredHubQuickLinkProps) {
  const { isRTL } = useI18n();

  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 16,
        border: '1px solid #E8E8E8',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}15`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E8E8E8';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: `${color}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#1A1A1A',
              margin: 0,
            }}
          >
            {title}
          </h3>
          {badge && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 12,
                backgroundColor: color,
                color: '#FFF',
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
      <DirectionalIcon
        icon={ChevronLeft}
        mirrorInRTL={true}
        size={20}
        style={{
          color: '#CCC',
          flexShrink: 0,
          transform: isRTL ? 'rotate(0)' : 'rotate(180deg)',
        }}
      />
    </Link>
  );
}

export function RestoredHubCompactLink({
  title,
  description,
  href,
  icon,
  color,
  badge,
}: RestoredHubQuickLinkProps) {
  const { isRTL } = useI18n();

  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 18px',
        backgroundColor: '#FFF',
        borderRadius: 14,
        border: '1px solid #E8E8E8',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = `0 8px 18px ${color}14`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E8E8E8';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: `${color}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            {title}
          </h3>
          {badge ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 999,
                backgroundColor: `${color}12`,
                color,
              }}
            >
              {badge}
            </span>
          ) : null}
        </div>
        <p style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.45 }}>
          {description}
        </p>
      </div>
      <DirectionalIcon
        icon={ChevronLeft}
        mirrorInRTL={true}
        size={18}
        style={{
          color: '#CCC',
          flexShrink: 0,
          transform: isRTL ? 'rotate(0)' : 'rotate(180deg)',
        }}
      />
    </Link>
  );
}
