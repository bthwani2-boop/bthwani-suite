'use client';

/**
 * McpwMarketingPromotionsScreen — Promotions Management
 */

import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import {
  Tag,
  Plus,
  Search,
  Filter,
  Calendar,
  Percent,
  Gift,
  ArrowLeft,
  Copy,
  MoreVertical,
  Users,
  ShoppingCart,
} from 'lucide-react';

interface PromoCardProps {
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: string;
  minOrder: string;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'scheduled' | 'depleted';
}

function PromoCard({ code, description, type, value, minOrder, usageLimit, usedCount, startDate, endDate, status }: PromoCardProps) {
  const statusConfig = {
    active: { bg: '#DCFCE7', text: '#16A34A', label: 'نشط' },
    expired: { bg: '#FEE2E2', text: '#DC2626', label: 'منتهي' },
    scheduled: { bg: '#DBEAFE', text: '#2563EB', label: 'مجدول' },
    depleted: { bg: '#F3F4F6', text: '#6B7280', label: 'مستنفد' },
  };

  const typeIcons = {
    percentage: Percent,
    fixed: Tag,
    free_delivery: Gift,
  };

  const typeLabels = {
    percentage: 'نسبة مئوية',
    fixed: 'مبلغ ثابت',
    free_delivery: 'توصيل مجاني',
  };

  const config = statusConfig[status];
  const TypeIcon = typeIcons[type];
  const usagePercentage = (usedCount / usageLimit) * 100;

  return (
    <div
      style={{
        backgroundColor: '#FFF',
        borderRadius: 16,
        border: '1px solid #E8E8E8',
        padding: 20,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TypeIcon size={22} color="#374151" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', margin: 0, fontFamily: 'monospace' }}>{code}</h3>
              <button
                style={{
                  padding: 4,
                  borderRadius: 4,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <Copy size={14} color="#9CA3AF" />
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{typeLabels[type]}</p>
          </div>
        </div>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            backgroundColor: config.bg,
            color: config.text,
          }}
        >
          {config.label}
        </span>
      </div>

      <p style={{ fontSize: 14, color: '#374151', margin: '0 0 16px', lineHeight: 1.5 }}>{description}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 4px' }}>قيمة الخصم</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#16A34A', margin: 0 }}>{value}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 4px' }}>الحد الأدنى للطلب</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', margin: 0 }}>{minOrder}</p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>الاستخدام</span>
          <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{usedCount} / {usageLimit}</span>
        </div>
        <div style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${usagePercentage}%`,
              backgroundColor: usagePercentage > 80 ? '#EF4444' : usagePercentage > 50 ? '#F59E0B' : '#22C55E',
              borderRadius: 3,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{startDate} - {endDate}</span>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          تعديل
        </button>
      </div>
    </div>
  );
}

export default function McpwMarketingPromotionsScreen() {
  const { isRTL } = useI18n();

  const promos: PromoCardProps[] = [
    {
      code: 'WELCOME50',
      description: 'خصم ترحيبي للمستخدمين الجدد على الطلب الأول',
      type: 'percentage',
      value: '50%',
      minOrder: '50 ر.س',
      usageLimit: 10000,
      usedCount: 4520,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
    },
    {
      code: 'RAMADAN24',
      description: 'عرض رمضان - خصم على جميع الطلبات',
      type: 'fixed',
      value: '15 ر.س',
      minOrder: '75 ر.س',
      usageLimit: 5000,
      usedCount: 3200,
      startDate: '2024-03-10',
      endDate: '2024-04-09',
      status: 'active',
    },
    {
      code: 'FREEDEL',
      description: 'توصيل مجاني على الطلبات أكثر من 100 ر.س',
      type: 'free_delivery',
      value: 'توصيل مجاني',
      minOrder: '100 ر.س',
      usageLimit: 2000,
      usedCount: 2000,
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      status: 'depleted',
    },
    {
      code: 'SUMMER24',
      description: 'عرض الصيف القادم - خصم حصري',
      type: 'percentage',
      value: '30%',
      minOrder: '60 ر.س',
      usageLimit: 8000,
      usedCount: 0,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      status: 'scheduled',
    },
  ];

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Back Link */}
      <Link
        href="/marketing"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: '#6B7280',
          textDecoration: 'none',
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <DirectionalIcon icon={ArrowLeft} mirrorInRTL={true} size={18} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }}  />
        التسويق
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
              }}
            >
              <Tag size={28} color="#FFF" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>أكواد الخصم</h1>
              <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>
                إدارة العروض والأكواد الترويجية
              </p>
            </div>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: '#8B5CF6',
              color: '#FFF',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={18} />
            كود جديد
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search
            size={18}
            color="#9CA3AF"
            style={{
              position: 'absolute',
              [isRTL ? 'right' : 'left']: 14,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="البحث عن كود..."
            style={{
              width: '100%',
              padding: '12px 14px',
              paddingInlineStart: 44,
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
            fontSize: 14,
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          <Filter size={18} />
          فلترة
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الأكواد', value: '24', color: '#8B5CF6' },
          { label: 'نشط', value: '8', color: '#22C55E' },
          { label: 'إجمالي الاستخدام', value: '٤٥,٢٣٠', color: '#3B82F6' },
          { label: 'قيمة الخصومات', value: '١٨٠ ألف', color: '#F59E0B' },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFF',
              borderRadius: 12,
              border: '1px solid #E8E8E8',
              padding: 16,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 24, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Promos Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 16,
        }}
      >
        {promos.map((promo, i) => (
          <PromoCard key={i} {...promo} />
        ))}
      </div>
    </div>
  );
}
