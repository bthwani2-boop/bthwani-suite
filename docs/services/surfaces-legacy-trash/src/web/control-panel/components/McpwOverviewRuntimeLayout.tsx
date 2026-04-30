'use client';

import React from 'react';
import { DirectionalIcon } from '@bthwani/ui-kit';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BellDot,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Command,
  Filter,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';

import type {
  OverviewActivityItem,
  OverviewAlertItem,
  OverviewBadgeTone,
  OverviewHealthSignal,
  OverviewInsightItem,
  OverviewKpiItem,
  OverviewQueueAction,
  OverviewTone,
  WorkspaceLaunchItem,
} from './CommandCenterPrimitivesRuntime';
import { RestoredHubHeader } from './RestoredHubPrimitives';

interface PeriodOption {
  id: string;
  label: string;
}

interface HeroSignalCard {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string | number;
  detail: string;
  tone: OverviewBadgeTone;
}

interface McpwOverviewRuntimeLayoutProps {
  isRTL: boolean;
  isRefreshing: boolean;
  selectedPeriodLabel: string;
  surfaceModeLabel: string;
  surfaceModeValue: string;
  surfaceModeTone: OverviewBadgeTone;
  lastUpdatedLabel: string;
  period: string;
  periodOptions: readonly PeriodOption[];
  onPeriodChange: (periodId: string) => void;
  onOpenCommandPalette: () => void;
  onRefresh: () => void;
  primaryAction: OverviewQueueAction;
  criticalCount: number;
  heroSignalCards: HeroSignalCard[];
  overviewInsights: OverviewInsightItem[];
  healthSignals: OverviewHealthSignal[];
  visibleHardError: string | null;
  onDismissError: () => void;
  usesFallbackQueue: boolean;
  locale: string;
  kpiCards: OverviewKpiItem[];
  isKpisLoading: boolean;
  actionItems: OverviewQueueAction[];
  isWorkLoading: boolean;
  alertItems: OverviewAlertItem[];
  workspaceCards: WorkspaceLaunchItem[];
  activityItems: OverviewActivityItem[];
  onNavigate: (eventId: string, target: string) => void;
}

type BottomSurfaceTab = 'workspaces' | 'activity';

const tonePalette: Record<
  OverviewTone,
  {
    iconBg: string;
    iconColor: string;
    borderColor: string;
    shadowColor: string;
  }
> = {
  orange: {
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    borderColor: '#FED7AA',
    shadowColor: 'rgba(249, 115, 22, 0.18)',
  },
  red: {
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    borderColor: '#FECACA',
    shadowColor: 'rgba(220, 38, 38, 0.16)',
  },
  blue: {
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    borderColor: '#BFDBFE',
    shadowColor: 'rgba(37, 99, 235, 0.16)',
  },
  green: {
    iconBg: '#ECFDF5',
    iconColor: '#059669',
    borderColor: '#A7F3D0',
    shadowColor: 'rgba(5, 150, 105, 0.16)',
  },
  indigo: {
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    borderColor: '#C7D2FE',
    shadowColor: 'rgba(79, 70, 229, 0.16)',
  },
  slate: {
    iconBg: '#F1F5F9',
    iconColor: '#475569',
    borderColor: '#CBD5E1',
    shadowColor: 'rgba(71, 85, 105, 0.14)',
  },
  amber: {
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
    borderColor: '#FDE68A',
    shadowColor: 'rgba(217, 119, 6, 0.16)',
  },
};

const badgePalette: Record<OverviewBadgeTone, { bg: string; text: string }> = {
  neutral: { bg: '#F1F5F9', text: '#475569' },
  success: { bg: '#ECFDF5', text: '#047857' },
  warning: { bg: '#FFFBEB', text: '#B45309' },
  info: { bg: '#EFF6FF', text: '#1D4ED8' },
  critical: { bg: '#FEF2F2', text: '#B91C1C' },
};

const priorityPalette: Record<
  OverviewQueueAction['priority'],
  { label: string; bg: string; text: string; border: string }
> = {
  critical: {
    label: 'حرج',
    bg: '#FEF2F2',
    text: '#B91C1C',
    border: '#FECACA',
  },
  high: {
    label: 'مرتفع',
    bg: '#FFFBEB',
    text: '#B45309',
    border: '#FDE68A',
  },
  normal: {
    label: 'قياسي',
    bg: '#EFF6FF',
    text: '#1D4ED8',
    border: '#BFDBFE',
  },
};

const healthPalette: Record<
  OverviewHealthSignal['status'],
  { bg: string; text: string; label: string }
> = {
  stable: { bg: '#ECFDF5', text: '#047857', label: 'مستقر' },
  attention: { bg: '#FFFBEB', text: '#B45309', label: 'يتطلب مراقبة' },
  critical: { bg: '#FEF2F2', text: '#B91C1C', label: 'يتطلب تدخلًا' },
};

const baseCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(226, 232, 240, 0.95)',
  borderRadius: 18,
  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
  transition: 'all 0.2s ease',
};

function interactiveEnter(
  event: React.MouseEvent<HTMLElement>,
  borderColor: string,
  shadowColor: string
) {
  event.currentTarget.style.borderColor = borderColor;
  event.currentTarget.style.transform = 'translateY(-2px)';
  event.currentTarget.style.boxShadow = `0 10px 26px ${shadowColor}`;
}

function interactiveLeave(event: React.MouseEvent<HTMLElement>) {
  event.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.95)';
  event.currentTarget.style.transform = 'translateY(0)';
  event.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.05)';
}

const OVERVIEW_ROOT_STYLE: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: 1480,
  margin: '0 auto',
  paddingBottom: 12,
};

const PRIMARY_PANEL_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.94)',
  border: '1px solid rgba(254, 215, 170, 0.72)',
  borderRadius: 30,
  padding: 18,
  boxShadow: '0 10px 36px rgba(15, 23, 42, 0.06)',
};

const SECTION_PANEL_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.92)',
  border: '1px solid rgba(226, 232, 240, 0.82)',
  borderRadius: 28,
  padding: 18,
  boxShadow: '0 6px 20px rgba(15, 23, 42, 0.04)',
  marginBottom: 20,
};

const ASIDE_PANEL_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.92)',
  border: '1px solid rgba(226, 232, 240, 0.82)',
  borderRadius: 22,
  padding: 14,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
};

const RUNTIME_CARD_STYLE: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(226, 232, 240, 0.85)',
  borderRadius: 18,
  padding: 14,
  boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
};

const CONTROL_BUTTON_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  borderRadius: 12,
  border: '1px solid rgba(226, 232, 240, 0.95)',
  backgroundColor: '#FFFFFF',
  color: '#334155',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
};

const TAB_BUTTON_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 12,
  border: '1px solid rgba(226, 232, 240, 0.95)',
  backgroundColor: '#FFFFFF',
  color: '#475569',
  padding: '8px 12px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
};

const PRIMARY_ACTION_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 16px',
  borderRadius: 12,
  backgroundColor: '#F97316',
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 700,
  textDecoration: 'none',
  boxShadow: '0 8px 20px rgba(249, 115, 22, 0.35)',
};

const MINI_TILE_STYLE: React.CSSProperties = {
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.9)',
  backgroundColor: 'rgba(255, 255, 255, 0.88)',
  padding: '10px 12px',
};

const SKELETON_CARD_STYLE: React.CSSProperties = {
  height: 138,
  borderRadius: 18,
  border: '1px solid rgba(226, 232, 240, 0.85)',
  backgroundColor: '#FFFFFF',
};

const SKELETON_ROW_STYLE: React.CSSProperties = {
  height: 96,
  borderRadius: 16,
  border: '1px solid rgba(226, 232, 240, 0.85)',
  backgroundColor: '#FFFFFF',
};

const DIVIDER_STYLE: React.CSSProperties = {
  height: 1,
  backgroundColor: 'rgba(226, 232, 240, 0.92)',
  margin: '16px 0',
};

function OverviewBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: OverviewBadgeTone;
}) {
  const palette = badgePalette[tone];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 700,
        backgroundColor: palette.bg,
        color: palette.text,
      }}
    >
      {label}
    </span>
  );
}

function SectionHeader({
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
  const tone = tonePalette[iconTone];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: tone.iconBg,
            color: tone.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
            {description}
          </p>
        </div>
      </div>
      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
    </div>
  );
}

function FocusKpiCard({
  item,
  locale,
  onNavigate,
}: {
  item: OverviewKpiItem;
  locale: string;
  onNavigate?: (eventId: string, target: string) => void;
}) {
  const tone = tonePalette[item.tone];
  const Icon = item.icon;
  const value =
    typeof item.value === 'number'
      ? item.value.toLocaleString(locale)
      : item.value;

  return (
    <Link
      href={item.href}
      onClick={() => onNavigate?.(`focus-kpi:${item.key}`, item.href)}
      onMouseEnter={event =>
        interactiveEnter(event, tone.borderColor, tone.shadowColor)
      }
      onMouseLeave={interactiveLeave}
      style={{
        ...baseCardStyle,
        display: 'block',
        textDecoration: 'none',
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: tone.iconBg,
            color: tone.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} />
        </div>
        <div
          style={{
            borderRadius: 999,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 700,
            backgroundColor: item.positive ? '#ECFDF5' : '#FEF2F2',
            color: item.positive ? '#047857' : '#B91C1C',
          }}
        >
          {item.positive ? '+' : '-'}
          {Math.abs(item.trend)}%
        </div>
      </div>

      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: '#334155',
          marginBottom: 8,
        }}
      >
        {item.title}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          fontSize: 12,
          color: '#64748B',
        }}
      >
        <span>{item.subtitle}</span>
        <ArrowUpRight size={16} color={tone.iconColor} />
      </div>
    </Link>
  );
}

function QueueActionRow({
  item,
  onNavigate,
}: {
  item: OverviewQueueAction;
  onNavigate?: (eventId: string, target: string) => void;
}) {
  const priority = priorityPalette[item.priority];
  const Icon = item.icon;

  return (
    <div style={{ ...baseCardStyle, padding: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: priority.bg,
            color: priority.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} />
        </div>

        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 6,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#0F172A',
                margin: 0,
              }}
            >
              {item.title}
            </h3>
            <span
              style={{
                borderRadius: 999,
                padding: '3px 8px',
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: priority.bg,
                color: priority.text,
                border: `1px solid ${priority.border}`,
              }}
            >
              {priority.label}
            </span>
            {item.count !== undefined ? (
              <span
                style={{
                  borderRadius: 999,
                  padding: '3px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                }}
              >
                {item.count}
              </span>
            ) : null}
          </div>
          <p
            style={{
              fontSize: 13,
              color: '#64748B',
              lineHeight: 1.7,
              margin: '0 0 8px',
            }}
          >
            {item.description}
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              fontSize: 12,
              color: '#64748B',
            }}
          >
            <span>المالك: {item.owner}</span>
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <Clock3 size={14} />
              {item.dueLabel}
            </span>
          </div>
        </div>

        <Link
          href={item.href}
          onClick={() => onNavigate?.(`queue-action:${item.id}`, item.href)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            borderRadius: 12,
            padding: '10px 14px',
            textDecoration: 'none',
            backgroundColor: '#FFF7ED',
            border: '1px solid #FED7AA',
            color: '#C2410C',
            fontSize: 14,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          نفذ الآن
          <DirectionalIcon icon={ChevronLeft} mirrorInRTL={true} size={16} />
        </Link>
      </div>
    </div>
  );
}

function WorkspaceLaunchCard({
  item,
  onNavigate,
}: {
  item: WorkspaceLaunchItem;
  onNavigate?: (eventId: string, target: string) => void;
}) {
  const tone = tonePalette[item.tone];
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={() => onNavigate?.(`workspace:${item.id}`, item.href)}
      onMouseEnter={event =>
        interactiveEnter(event, tone.borderColor, tone.shadowColor)
      }
      onMouseLeave={interactiveLeave}
      style={{
        ...baseCardStyle,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 122,
        padding: 14,
        textDecoration: 'none',
      }}
    >
      <div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: tone.iconBg,
            color: tone.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Icon size={20} />
        </div>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 6px',
          }}
        >
          {item.title}
        </h3>
        <p
          style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0 }}
        >
          {item.subtitle}
        </p>
      </div>

      <div
        style={{
          marginTop: 14,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          fontWeight: 700,
          color: tone.iconColor,
        }}
      >
        دخول سريع
        <ArrowUpRight size={14} color={tone.iconColor} />
      </div>
    </Link>
  );
}

function InsightNote({
  title,
  description,
  tone = 'neutral',
}: {
  title: string;
  description: string;
  tone?: OverviewBadgeTone;
}) {
  const palette = badgePalette[tone];

  return (
    <div
      style={{
        borderRadius: 14,
        padding: 14,
        backgroundColor: palette.bg,
        border: '1px solid rgba(226, 232, 240, 0.85)',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569' }}>
        {description}
      </div>
    </div>
  );
}

function HealthSignalList({ items }: { items: OverviewHealthSignal[] }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {items.map(signal => {
        const palette = healthPalette[signal.status];

        return (
          <div
            key={signal.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              borderRadius: 14,
              padding: '12px 14px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              backgroundColor: '#F8FAFC',
            }}
          >
            <div style={{ minWidth: 0, flex: '1 1 220px' }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#1E293B',
                  marginBottom: 2,
                }}
              >
                {signal.label}
              </div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
                {signal.detail}
              </div>
            </div>
            <span
              style={{
                borderRadius: 999,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: palette.bg,
                color: palette.text,
              }}
            >
              {palette.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AlertSignalList({
  items,
  onNavigate,
}: {
  items: OverviewAlertItem[];
  onNavigate?: (eventId: string, target: string) => void;
}) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {items.map(item => {
        const palette = badgePalette[item.tone];
        const content = (
          <div
            style={{
              borderRadius: 14,
              padding: 14,
              border: '1px solid rgba(226, 232, 240, 0.85)',
              backgroundColor: palette.bg,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: 4,
              }}
            >
              {item.title}
            </div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
              {item.description}
            </div>
            {item.href && item.actionLabel ? (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#C2410C',
                }}
              >
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
            onClick={() => onNavigate?.(`overview-alert:${item.id}`, item.href!)}
            style={{ textDecoration: 'none' }}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}

function ActivityTimeline({
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
      <div
        style={{
          borderRadius: 14,
          border: '1px dashed #CBD5E1',
          backgroundColor: '#F8FAFC',
          padding: '20px 16px',
          textAlign: 'center',
          fontSize: 13,
          color: '#64748B',
        }}
      >
        {emptyMessage ?? 'لا يوجد نشاط حديث بعد.'}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {items.map(item => {
        const palette = badgePalette[item.tone];
        const inner = (
          <div
            style={{
              borderRadius: 14,
              border: '1px solid rgba(226, 232, 240, 0.85)',
              backgroundColor: '#FFFFFF',
              padding: '14px 16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: palette.text,
                  flexShrink: 0,
                }}
              />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                {item.title}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                lineHeight: 1.7,
                color: '#475569',
                marginBottom: 8,
              }}
            >
              {item.description}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
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
            style={{ textDecoration: 'none' }}
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

function EmptyActionCenter({
  href,
  onNavigate,
}: {
  href: string;
  onNavigate?: (eventId: string, target: string) => void;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: '1px dashed #CBD5E1',
        backgroundColor: '#F8FAFC',
        padding: '32px 20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
        }}
      >
        <CheckCircle2 size={24} />
      </div>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: '#0F172A',
          margin: '0 0 6px',
        }}
      >
        لا توجد عناصر ملحة حاليًا
      </h3>
      <p
        style={{
          fontSize: 12,
          color: '#64748B',
          lineHeight: 1.7,
          margin: '0 0 16px',
        }}
      >
        يمكنك الانتقال مباشرة إلى مساحة العمل الرئيسية أو فتح أوامر النظام.
      </p>
      <Link
        href={href}
        onClick={() => onNavigate?.('action-center:empty-cta', href)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: 12,
          padding: '10px 16px',
          textDecoration: 'none',
          backgroundColor: '#F97316',
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        افتح المساحة الرئيسية
        <DirectionalIcon icon={ChevronLeft} mirrorInRTL={true} size={16} />
      </Link>
    </div>
  );
}

function OverviewSignalCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: HeroSignalCard) {
  const styles = {
    neutral: {
      border: 'rgba(226, 232, 240, 0.95)',
      surface: '#FFFFFF',
      iconBg: '#F1F5F9',
      iconColor: '#475569',
      badge: 'neutral' as const,
    },
    success: {
      border: '#A7F3D0',
      surface: '#ECFDF5',
      iconBg: '#D1FAE5',
      iconColor: '#047857',
      badge: 'success' as const,
    },
    warning: {
      border: '#FDE68A',
      surface: '#FFFBEB',
      iconBg: '#FEF3C7',
      iconColor: '#B45309',
      badge: 'warning' as const,
    },
    info: {
      border: '#BFDBFE',
      surface: '#EFF6FF',
      iconBg: '#DBEAFE',
      iconColor: '#1D4ED8',
      badge: 'info' as const,
    },
    critical: {
      border: '#FECACA',
      surface: '#FEF2F2',
      iconBg: '#FEE2E2',
      iconColor: '#B91C1C',
      badge: 'critical' as const,
    },
  }[tone];

  return (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${styles.border}`,
        backgroundColor: styles.surface,
        padding: 16,
        boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: styles.iconBg,
            color: styles.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} />
        </div>
        <OverviewBadge label={label} tone={styles.badge} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A' }}>
        {value}
      </div>
      <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: 1.7, color: '#475569' }}>
        {detail}
      </p>
    </div>
  );
}

export default function McpwOverviewRuntimeLayout({
  isRTL,
  isRefreshing,
  selectedPeriodLabel,
  surfaceModeLabel,
  surfaceModeValue,
  surfaceModeTone,
  lastUpdatedLabel,
  period,
  periodOptions,
  onPeriodChange,
  onOpenCommandPalette,
  onRefresh,
  primaryAction,
  criticalCount,
  heroSignalCards,
  overviewInsights,
  healthSignals,
  visibleHardError,
  onDismissError,
  usesFallbackQueue,
  locale,
  kpiCards,
  isKpisLoading,
  actionItems,
  isWorkLoading,
  alertItems,
  workspaceCards,
  activityItems,
  onNavigate,
}: McpwOverviewRuntimeLayoutProps) {
  const [bottomTab, setBottomTab] = React.useState<BottomSurfaceTab>('workspaces');
  const visibleInsights = overviewInsights.slice(0, 3);
  const visibleHealthSignals = healthSignals.slice(0, 4);
  const visibleActionItems = actionItems.slice(0, 3);
  const visibleAlertItems = alertItems.slice(0, 2);
  const visibleWorkspaceCards = workspaceCards.slice(0, 4);
  const visibleActivityItems = activityItems.slice(0, 2);

  return (
    <div style={OVERVIEW_ROOT_STYLE} dir={isRTL ? 'rtl' : 'ltr'}>
      <div
        aria-hidden
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          insetInline: 0,
          top: -96,
          zIndex: -10,
          height: 340,
          background:
            'radial-gradient(ellipse at top, rgba(249, 115, 22, 0.16), transparent 62%)',
        }}
      />
      <div
        aria-hidden
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: -20,
          zIndex: -10,
          width: 160,
          height: 160,
          borderRadius: 999,
          backgroundColor: 'rgba(254, 215, 170, 0.55)',
          filter: 'blur(48px)',
          left: isRTL ? undefined : '12%',
          right: isRTL ? '12%' : undefined,
        }}
      />

      <RestoredHubHeader
        title='النظرة العامة'
        subtitle='افهم الحالة خلال ثوانٍ، وابدأ من أفضل إجراء مقترح بنفس روح بقية لوحات CONTROL PANEL.'
        icon={<Sparkles size={28} color='#FFF' />}
        gradientFrom='#F97316'
        gradientTo='#EA580C'
        shadowColor='rgba(249, 115, 22, 0.30)'
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button onClick={onOpenCommandPalette} style={CONTROL_BUTTON_STYLE}>
              <Command size={16} />
              بحث وأوامر
            </button>

            <label style={{ ...CONTROL_BUTTON_STYLE, cursor: 'default' }}>
              <Filter size={16} color='#94A3B8' />
              <select
                value={period}
                aria-label='اختر الفترة الزمنية للنظرة العامة'
                onChange={event => onPeriodChange(event.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: '#334155',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {periodOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              style={{
                ...CONTROL_BUTTON_STYLE,
                opacity: isRefreshing ? 0.6 : 1,
                cursor: isRefreshing ? 'default' : 'pointer',
              }}
            >
              <RefreshCw size={16} />
              تحديث
            </button>
          </div>
        }
      />

      <section style={{ marginBottom: 20 }}>
        <div style={PRIMARY_PANEL_STYLE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 14 }}>
              <OverviewBadge label={`الفترة: ${selectedPeriodLabel}`} tone='info' />
              <OverviewBadge label={surfaceModeLabel} tone={surfaceModeTone} />
              <OverviewBadge label={`آخر تحديث: ${lastUpdatedLabel}`} tone='neutral' />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(300px, 0.95fr)', gap: 14, alignItems: 'stretch' }}>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    borderRadius: 24,
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    background:
                      'linear-gradient(180deg, rgba(255, 247, 237, 0.96), rgba(248, 250, 252, 0.96))',
                    padding: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: '#EA580C', marginBottom: 8 }}>
                    <Target size={16} />
                    المهمة الموصى بها الآن
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A', marginBottom: 8 }}>
                    {primaryAction.title}
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: '#475569', margin: '0 0 12px' }}>
                    {primaryAction.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <OverviewBadge label={`المالك: ${primaryAction.owner}`} tone='neutral' />
                    <OverviewBadge label={primaryAction.dueLabel} tone={criticalCount > 0 ? 'warning' : 'info'} />
                    {primaryAction.count !== undefined ? (
                      <OverviewBadge label={`عدد العناصر: ${primaryAction.count}`} tone='info' />
                    ) : null}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))', gap: 8 }}>
                    <div style={MINI_TILE_STYLE}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 4 }}>القرار المطلوب</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                        {criticalCount > 0 ? 'حسم فوري' : 'استئناف منظم'}
                      </div>
                    </div>
                    <div style={MINI_TILE_STYLE}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 4 }}>نافذة التنفيذ</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                        {primaryAction.dueLabel}
                      </div>
                    </div>
                    <div style={MINI_TILE_STYLE}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 4 }}>ميزانية النقر</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>1-2 نقرات</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 12 }}>
                  <Link
                    href={primaryAction.href}
                    onClick={() => onNavigate('overview:primary-cta', primaryAction.href)}
                    style={PRIMARY_ACTION_STYLE}
                  >
                    <Zap size={16} />
                    {criticalCount > 0 ? `معالجة العاجل (${criticalCount})` : 'ابدأ من الإجراء الموصى به'}
                  </Link>

                  <Link
                    href='/operations'
                    onClick={() => onNavigate('overview:open-operations', '/operations')}
                    style={CONTROL_BUTTON_STYLE}
                  >
                    افتح العمليات
                  </Link>
                </div>
              </div>

              <div style={{ minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, alignContent: 'start' }}>
                {heroSignalCards.map(card => (
                  <OverviewSignalCard key={card.id} {...card} />
                ))}
              </div>
            </div>

            <div style={DIVIDER_STYLE} />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 14 }}>
              <div style={RUNTIME_CARD_STYLE}>
                <SectionHeader
                  title='ملخص القرار'
                  description='الخلاصة العملية بدل النصوص الطويلة'
                  icon={<Sparkles size={20} />}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                  {visibleInsights.map(note => (
                    <InsightNote key={note.id} title={note.title} description={note.description} tone={note.tone} />
                  ))}
                </div>
              </div>

              <div style={RUNTIME_CARD_STYLE}>
                <SectionHeader
                  title='صحة الخدمات'
                  description='جاهزية مختصرة دون عمود جانبي طويل'
                  icon={<ShieldCheck size={20} />}
                />
                <HealthSignalList items={visibleHealthSignals} />
              </div>
            </div>
        </div>
      </section>

      {visibleHardError ? (
        <div style={{ marginBottom: 24, borderRadius: 18, border: '1px solid #FCD34D', backgroundColor: '#FFFBEB', padding: '14px 16px', color: '#B45309' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <AlertTriangle size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#92400E', marginBottom: 4 }}>
                تعذر تحديث النظرة العامة
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7 }}>{visibleHardError}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={onRefresh}
                style={{
                  borderRadius: 10,
                  border: '1px solid #FCD34D',
                  backgroundColor: '#FFFFFF',
                  color: '#92400E',
                  padding: '8px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                إعادة المحاولة
              </button>
              <button
                onClick={onDismissError}
                style={{
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#92400E',
                  padding: '8px 10px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                إخفاء
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section style={SECTION_PANEL_STYLE}>
        <SectionHeader
          title='شريط التركيز'
          description='أهم الأرقام التي يجب أن تراها أولًا'
          icon={<BarChart3 size={20} />}
          action={usesFallbackQueue ? <OverviewBadge label='قيم مرجعية ذكية' tone='warning' /> : null}
        />

        {isKpisLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} style={SKELETON_CARD_STYLE} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
            {kpiCards.map(item => (
              <FocusKpiCard key={item.key} item={item} locale={locale} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>

      <section style={SECTION_PANEL_STYLE}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 0.9fr)', gap: 16, alignItems: 'start' }}>
          <div style={{ minWidth: 0 }}>
            <SectionHeader
              title='يحتاج انتباهك الآن'
              description='قائمة تنفيذ مختصرة بأولوية واضحة وإجراء مباشر'
              icon={<Zap size={20} />}
              action={<OverviewBadge label={`${actionItems.length} عناصر فعالة`} tone='neutral' />}
            />

            <div style={{ display: 'grid', gap: 12 }}>
              {isWorkLoading ? (
                Array.from({ length: 3 }).map((_, index) => <div key={index} style={SKELETON_ROW_STYLE} />)
              ) : actionItems.length === 0 ? (
                <EmptyActionCenter href='/operations' onNavigate={onNavigate} />
              ) : (
                visibleActionItems.map(item => <QueueActionRow key={item.id} item={item} onNavigate={onNavigate} />)
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ ...ASIDE_PANEL_STYLE, borderRadius: 18 }}>
              <SectionHeader
                title='تنبيهات موجهة'
                description='إشارات قابلة للتنفيذ من دون فتح طبقات إضافية'
                icon={<BellDot size={20} />}
                iconTone='amber'
              />
              <AlertSignalList items={visibleAlertItems} onNavigate={onNavigate} />
            </div>

            <div
              style={{
                borderRadius: 18,
                border: '1px solid rgba(15, 23, 42, 0.12)',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                padding: 16,
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: '#FED7AA', marginBottom: 8 }}>Smart Defaults</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
                {usesFallbackQueue ? 'الوضع المرجعي فعّال' : 'الوضع التشغيلي مباشر'}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: '#CBD5E1', margin: '0 0 14px' }}>
                السطح يحافظ على المسار الأسرع للمستخدم مع إظهار مستوى الجاهزية الحقيقي بدل إخفائه وراء زخرفة شكلية.
              </p>
              <div style={{ display: 'grid', gap: 8, fontSize: 12, color: '#CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', padding: '10px 12px' }}>
                  <span>الهدف</span>
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>قرار خلال ثوانٍ</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', padding: '10px 12px' }}>
                  <span>ميزانية النقر</span>
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>1-2 نقرات</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', padding: '10px 12px' }}>
                  <span>مصدر القراءة</span>
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{surfaceModeValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...SECTION_PANEL_STYLE, marginBottom: 8 }}>
        <SectionHeader
          title='الوصول السريع'
          description='بدّل بين المساحات والنشاط بدل إظهار القسمين معًا'
          icon={bottomTab === 'workspaces' ? <Users size={20} /> : <Activity size={20} />}
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type='button'
                onClick={() => setBottomTab('workspaces')}
                style={{
                  ...TAB_BUTTON_STYLE,
                  backgroundColor: bottomTab === 'workspaces' ? '#FFF7ED' : '#FFFFFF',
                  borderColor: bottomTab === 'workspaces' ? '#FED7AA' : 'rgba(226, 232, 240, 0.95)',
                  color: bottomTab === 'workspaces' ? '#C2410C' : '#475569',
                }}
              >
                <Users size={15} />
                المساحات
              </button>
              <button
                type='button'
                onClick={() => setBottomTab('activity')}
                style={{
                  ...TAB_BUTTON_STYLE,
                  backgroundColor: bottomTab === 'activity' ? '#EFF6FF' : '#FFFFFF',
                  borderColor: bottomTab === 'activity' ? '#BFDBFE' : 'rgba(226, 232, 240, 0.95)',
                  color: bottomTab === 'activity' ? '#1D4ED8' : '#475569',
                }}
              >
                <Activity size={15} />
                النشاط
              </button>
            </div>
          }
        />

        {bottomTab === 'workspaces' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <OverviewBadge label={`${visibleWorkspaceCards.length} مساحات ظاهرة`} tone='neutral' />
              <Link
                href='/operations'
                onClick={() => onNavigate('workspace:view-all', '/operations')}
                style={{ textDecoration: 'none', fontSize: 14, fontWeight: 700, color: '#EA580C' }}
              >
                عرض كل المساحات
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {visibleWorkspaceCards.map(item => (
                <WorkspaceLaunchCard key={item.id} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </>
        ) : visibleActivityItems.length === 0 ? (
          <ActivityTimeline
            items={visibleActivityItems}
            onNavigate={onNavigate}
            emptyMessage='لا يوجد نشاط حديث بعد، لكن المسارات الأساسية جاهزة.'
          />
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <OverviewBadge label={`${visibleActivityItems.length} أحداث حديثة`} tone='neutral' />
              <div style={{ fontSize: 12, color: '#64748B' }}>
                آخر ما حدث على السطح دون قائمة طويلة
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              {visibleActivityItems.map(item => {
                const palette = badgePalette[item.tone];

                return item.href ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => onNavigate(`activity:${item.id}`, item.href!)}
                    style={{ ...RUNTIME_CARD_STYLE, textDecoration: 'none', display: 'block' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: palette.text, flexShrink: 0 }} />
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{item.title}</div>
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginBottom: 8 }}>
                      {item.description}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{item.meta}</div>
                  </Link>
                ) : (
                  <div key={item.id} style={RUNTIME_CARD_STYLE}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: palette.text, flexShrink: 0 }} />
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{item.title}</div>
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginBottom: 8 }}>
                      {item.description}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{item.meta}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
