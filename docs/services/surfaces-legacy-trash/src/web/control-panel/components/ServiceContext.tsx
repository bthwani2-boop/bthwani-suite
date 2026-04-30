'use client';

import Link from 'next/link';
import { Briefcase, Car, Package, Shield, Wallet } from 'lucide-react';

export type McpwServiceId =
  | 'dsh'
  | 'knz'
  | 'amn'
  | 'wlt'
  | 'arb'
  | 'mrf'
  | 'kwd'
  | 'snd';

export type McpwSectionId = 'operations' | 'finance' | 'analytics';

interface ServiceContextEntry {
  id: McpwServiceId;
  label: string;
  icon: React.ReactNode;
  colorClass: string;
}

const CORE_SECTION_SERVICES: Record<McpwSectionId, McpwServiceId[]> = {
  operations: ['dsh', 'knz', 'amn', 'wlt', 'arb'],
  finance: ['wlt', 'dsh', 'amn', 'arb', 'knz'],
  analytics: ['dsh', 'wlt', 'amn', 'arb', 'knz'],
};

const SERVICE_CONTEXT: Record<McpwServiceId, ServiceContextEntry> = {
  dsh: {
    id: 'dsh',
    label: 'DSH',
    icon: <Package className="h-4 w-4" />,
    colorClass: 'text-orange-600',
  },
  knz: {
    id: 'knz',
    label: 'KNZ',
    icon: <Briefcase className="h-4 w-4" />,
    colorClass: 'text-amber-600',
  },
  amn: {
    id: 'amn',
    label: 'AMN',
    icon: <Shield className="h-4 w-4" />,
    colorClass: 'text-rose-600',
  },
  wlt: {
    id: 'wlt',
    label: 'WLT',
    icon: <Wallet className="h-4 w-4" />,
    colorClass: 'text-emerald-600',
  },
  arb: {
    id: 'arb',
    label: 'ARB',
    icon: <Car className="h-4 w-4" />,
    colorClass: 'text-indigo-600',
  },
  mrf: { id: 'mrf', label: 'MRF', icon: <Package className="h-4 w-4" />, colorClass: 'text-sky-600' },
  kwd: { id: 'kwd', label: 'KWD', icon: <Package className="h-4 w-4" />, colorClass: 'text-violet-600' },
  snd: { id: 'snd', label: 'SND', icon: <Package className="h-4 w-4" />, colorClass: 'text-pink-600' },
};

const LIMITED_SERVICES: McpwServiceId[] = ['mrf', 'kwd', 'snd'];

const DEFAULT_SECTION_SERVICE: Record<McpwSectionId, McpwServiceId> = {
  operations: 'dsh',
  finance: 'wlt',
  analytics: 'dsh',
};

export function isLimitedService(service: string): service is McpwServiceId {
  return (LIMITED_SERVICES as string[]).includes(service);
}

export function resolveSectionService(section: McpwSectionId, rawService: string | null): McpwServiceId {
  if (!rawService) return DEFAULT_SECTION_SERVICE[section];
  const allowed = CORE_SECTION_SERVICES[section] as string[];
  if (allowed.includes(rawService)) return rawService as McpwServiceId;
  return DEFAULT_SECTION_SERVICE[section];
}

export function getSectionServiceIds(section: McpwSectionId): McpwServiceId[] {
  return CORE_SECTION_SERVICES[section];
}

export function getServiceContext(service: McpwServiceId): ServiceContextEntry {
  return SERVICE_CONTEXT[service];
}

interface ServiceSwitcherProps {
  section: McpwSectionId;
  activeService: McpwServiceId;
  basePath: string;
}

export function ServiceSwitcher({ section, activeService, basePath }: ServiceSwitcherProps) {
  const services = getSectionServiceIds(section);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-900">اختيار الخدمة</p>
        <p className="text-xs text-gray-500">سياق القسم: {section}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {services.map((serviceId) => {
          const entry = getServiceContext(serviceId);
          const isActive = serviceId === activeService;
          return (
            <Link
              key={serviceId}
              href={`${basePath}?service=${serviceId}`}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={entry.colorClass}>{entry.icon}</span>
              <span>{entry.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
