'use client';

/**
 * McpwHrEmployeesScreen — Employee Management
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import {
  Users,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import { McpwSectionHeader, McpwListCard } from '../components/McpwDesignSystem';
import {
  mockEmployees,
  EMPLOYEE_STATUS_CONFIG,
  EMPLOYEES_STATS,
  type EmployeeFixture,
} from './fixtures/employees';

function EmployeeCard({ name, role, department, email, phone, location, joinDate, status }: EmployeeFixture) {
  const statusStyle = EMPLOYEE_STATUS_CONFIG[status];

  return (
    <McpwListCard
      title={name}
      subtitle={role}
      icon={<Users size={24} color="#6B7280" />}
      iconColor="#3B82F6"
      status={{ label: statusStyle.label, bg: statusStyle.bg, text: statusStyle.text }}
      actions={
        <button className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
          <MoreVertical size={16} color="#6B7280" />
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Building2 size={14} color="#9CA3AF" className="shrink-0" />
          <span className="text-[13px] text-gray-600">{department}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={14} color="#9CA3AF" className="shrink-0" />
          <span className="text-[13px] text-gray-600 truncate">{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} color="#9CA3AF" className="shrink-0" />
          <span className="text-[13px] text-gray-600">{phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} color="#9CA3AF" className="shrink-0" />
          <span className="text-[13px] text-gray-600">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} color="#9CA3AF" className="shrink-0" />
          <span className="text-[13px] text-gray-600">انضم في {joinDate}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          عرض التفاصيل
        </button>
      </div>
    </McpwListCard>
  );
}

export default function McpwHrEmployeesScreen() {
  const { isRTL } = useI18n();

  return (
    <div className="w-full max-w-full min-w-0" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Link
        href="/hr"
        className="inline-flex items-center gap-2 text-gray-500 no-underline text-sm mb-6 hover:text-gray-700"
      >
        <DirectionalIcon icon={ArrowLeft} mirrorInRTL={true} size={18} className={''}  />
        الموارد البشرية
      </Link>

      <McpwSectionHeader
        title="الموظفين"
        subtitle="إدارة بيانات الموظفين"
        icon={<Users size={28} color="#FFF" strokeWidth={2} />}
        gradientFrom="#3B82F6"
        gradientTo="#2563EB"
        shadowColor="rgba(59, 130, 246, 0.3)"
        primaryAction={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all">
            <Plus size={18} />
            إضافة موظف
          </button>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search
            size={18}
            color="#9CA3AF"
            className="absolute top-1/2 -translate-y-1/2"
            style={{ [isRTL ? 'right' : 'left']: 14 }}
          />
          <input
            type="text"
            placeholder="البحث عن موظف..."
            className="w-full py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            style={{ paddingInlineStart: 44 }}
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50">
          <Filter size={18} />
          فلترة
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {EMPLOYEES_STATS.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold m-0" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[13px] text-gray-500 mt-1 m-0">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockEmployees.map((employee, i) => (
          <EmployeeCard key={i} {...employee} />
        ))}
      </div>
    </div>
  );
}
