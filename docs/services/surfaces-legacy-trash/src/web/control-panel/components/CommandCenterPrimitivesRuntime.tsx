'use client';

import type { LucideIcon } from 'lucide-react';

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

