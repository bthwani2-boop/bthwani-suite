'use client';

/**
 * McpwMarketingCampaignsScreen — Marketing Campaigns Management
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import {
  ArrowLeft,
  Megaphone,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Target,
} from 'lucide-react';
import {
  McpwSectionHeader,
  McpwListCard,
} from '../../components/McpwDesignSystem';

interface CampaignCardProps {
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  budget: string;
  spent: string;
  reach: number;
  conversions: number;
  status: 'active' | 'paused' | 'scheduled' | 'completed';
}

function CampaignCard({
  name,
  type,
  startDate,
  endDate,
  budget,
  spent,
  reach,
  conversions,
  status,
}: CampaignCardProps) {
  const statusConfig = {
    active: { bg: '#DCFCE7', text: '#16A34A', label: 'نشطة' },
    paused: { bg: '#FEF3C7', text: '#D97706', label: 'متوقفة' },
    scheduled: { bg: '#DBEAFE', text: '#2563EB', label: 'مجدولة' },
    completed: { bg: '#F3F4F6', text: '#6B7280', label: 'مكتملة' },
  };
  const config = statusConfig[status];

  return (
    <McpwListCard
      title={name}
      subtitle={type}
      icon={<Megaphone size={24} color='#F97316' />}
      iconColor='#F97316'
      status={{ label: config.label, bg: config.bg, text: config.text }}
      actions={
        <button className='p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors'>
          <MoreVertical size={16} color='#6B7280' />
        </button>
      }
    >
      <div className='flex gap-4 mb-4'>
        <div className='flex-1'>
          <p className='text-[12px] text-gray-400 m-0 mb-1'>الفترة</p>
          <p className='text-[13px] text-gray-700 m-0'>
            {startDate} - {endDate}
          </p>
        </div>
        <div className='flex-1'>
          <p className='text-[12px] text-gray-400 m-0 mb-1'>الميزانية</p>
          <p className='text-[13px] text-gray-700 m-0'>
            {spent} / {budget}
          </p>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-3 pt-4 border-t border-gray-100'>
        <div className='flex items-center gap-2'>
          <Eye size={16} color='#9CA3AF' className='shrink-0' />
          <div>
            <p className='text-[14px] font-semibold text-gray-900 m-0'>
              {reach.toLocaleString('ar-SA')}
            </p>
            <p className='text-[11px] text-gray-400 m-0'>مشاهدة</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Target size={16} color='#9CA3AF' className='shrink-0' />
          <div>
            <p className='text-[14px] font-semibold text-gray-900 m-0'>
              {conversions.toLocaleString('ar-SA')}
            </p>
            <p className='text-[11px] text-gray-400 m-0'>تحويل</p>
          </div>
        </div>
      </div>
    </McpwListCard>
  );
}

export default function McpwMarketingCampaignsScreen() {
  const { isRTL } = useI18n();

  const campaigns: CampaignCardProps[] = [
    {
      name: 'حملة رمضان 2024',
      type: 'ترويج موسمي',
      startDate: '2024-03-10',
      endDate: '2024-04-09',
      budget: '50,000 ر.س',
      spent: '32,500 ر.س',
      reach: 125000,
      conversions: 3240,
      status: 'active',
    },
    {
      name: 'خصم المستخدم الجديد',
      type: 'اكتساب عملاء',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: '100,000 ر.س',
      spent: '45,000 ر.س',
      reach: 89000,
      conversions: 5600,
      status: 'active',
    },
    {
      name: 'حملة الصيف',
      type: 'توعية العلامة',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      budget: '75,000 ر.س',
      spent: '0 ر.س',
      reach: 0,
      conversions: 0,
      status: 'scheduled',
    },
    {
      name: 'برنامج الإحالة',
      type: 'تسويق الإحالة',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      budget: '25,000 ر.س',
      spent: '18,750 ر.س',
      reach: 45000,
      conversions: 1890,
      status: 'paused',
    },
  ];

  return (
    <div
      className='w-full max-w-full min-w-0'
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <Link
        href='/marketing'
        className='inline-flex items-center gap-2 text-gray-500 no-underline text-sm mb-6 hover:text-gray-700'
      >
        <DirectionalIcon
          icon={ArrowLeft}
          mirrorInRTL={true}
          size={18}
          className={''}
        />
        التسويق
      </Link>

      <McpwSectionHeader
        title='الحملات التسويقية'
        subtitle='إدارة وتتبع الحملات التسويقية'
        icon={<Megaphone size={28} color='#FFF' strokeWidth={2} />}
        gradientFrom='#F97316'
        gradientTo='#EA580C'
        shadowColor='rgba(249, 115, 22, 0.3)'
        primaryAction={
          <button className='inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all'>
            <Plus size={18} />
            حملة جديدة
          </button>
        }
      />

      <div className='flex gap-3 mb-6'>
        <div className='flex-1 relative'>
          <Search
            size={18}
            color='#9CA3AF'
            className='absolute top-1/2 -translate-y-1/2'
            style={{ [isRTL ? 'right' : 'left']: 14 }}
          />
          <input
            type='text'
            placeholder='البحث عن حملة...'
            className='w-full py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400'
            style={{ paddingInlineStart: 44 }}
          />
        </div>
        <button className='inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50'>
          <Filter size={18} />
          فلترة
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {[
          { label: 'إجمالي الحملات', value: '12', color: '#F97316' },
          { label: 'نشطة', value: '5', color: '#22C55E' },
          { label: 'إجمالي الإنفاق', value: '٢٥٠ ألف', color: '#3B82F6' },
          { label: 'التحويلات', value: '١٢,٤٣٠', color: '#8B5CF6' },
        ].map((stat, i) => (
          <div
            key={i}
            className='bg-white rounded-2xl border border-gray-100 p-4 text-center'
          >
            <p className='text-2xl font-bold m-0' style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className='text-[13px] text-gray-500 mt-1 m-0'>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {campaigns.map((campaign, i) => (
          <CampaignCard key={i} {...campaign} />
        ))}
      </div>
    </div>
  );
}
