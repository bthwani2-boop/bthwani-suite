/**
 * Work Queue Mock Data
 * Source of truth for work queue fixtures in CONTROL PANEL dashboard.
 */

import { DollarSign, Truck, Headphones, Shield, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface WorkQueueItemFixture {
  id: string;
  titleKey: string;
  descriptionKey: string;
  href: string | { pathname: string; query?: Record<string, string> };
  icon: LucideIcon;
  priority: 'critical' | 'high' | 'normal' | 'low';
  type: 'action' | 'alert' | 'task';
  badge?: string;
}

export interface KPIFixture {
  value: string;
  trend: number;
  isPositive: boolean;
}

export const mockWorkQueueItems: WorkQueueItemFixture[] = [
  {
    id: 'finance-payouts-pending',
    titleKey: 'control panel.queue.finance_payouts_title',
    descriptionKey: 'control panel.queue.finance_payouts_desc',
    href: { pathname: '/finance/payouts', query: { status: 'pending' } },
    icon: DollarSign,
    priority: 'critical',
    type: 'action',
    badge: 'URGENT',
  },
  {
    id: 'fleet-availability',
    titleKey: 'control panel.queue.fleet_availability_title',
    descriptionKey: 'control panel.queue.fleet_availability_desc',
    href: '/fleet/availability',
    icon: Truck,
    priority: 'high',
    type: 'alert',
  },
  {
    id: 'support-critical',
    titleKey: 'control panel.queue.support_critical_title',
    descriptionKey: 'control panel.queue.support_critical_desc',
    href: '/support',
    icon: Headphones,
    priority: 'high',
    type: 'alert',
  },
  {
    id: 'governance-alerts',
    titleKey: 'control panel.queue.governance_alerts_title',
    descriptionKey: 'control panel.queue.governance_alerts_desc',
    href: '/governance',
    icon: Shield,
    priority: 'normal',
    type: 'task',
  },
];

export const mockKPIs: Record<string, KPIFixture> = {
  totalOrders: { value: '2,847', trend: 12, isPositive: true },
  completedOrders: { value: '2,341', trend: 8, isPositive: true },
  inProgress: { value: '506', trend: 3, isPositive: false },
  issues: { value: '23', trend: 5, isPositive: false },
};

export const mockQuickAccessItems = [
  {
    href: '/operations',
    titleKey: 'control panel.quick_access.operations',
    descriptionKey: 'control panel.quick_access.operations_desc',
    icon: Package,
    iconBgColor: '#FFF3E0',
    iconColor: '#F97316',
  },
  {
    href: '/finance',
    titleKey: 'control panel.quick_access.finance',
    descriptionKey: 'control panel.quick_access.finance_desc',
    icon: DollarSign,
    iconBgColor: '#DCFCE7',
    iconColor: '#22C55E',
  },
  {
    href: '/support',
    titleKey: 'control panel.quick_access.support',
    descriptionKey: 'control panel.quick_access.support_desc',
    icon: Headphones,
    iconBgColor: '#DBEAFE',
    iconColor: '#3B82F6',
  },
];

