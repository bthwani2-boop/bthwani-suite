'use client';

/**
 * McpwPartnerScreen — Modern Clean Hub Design
 */

import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import {
  Handshake,
  ChevronLeft,
  Store,
  UserCheck,
  ShoppingBag,
  Package,
  Film,
  Coins,
  Settings,
} from 'lucide-react';

interface QuickLinkProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

function QuickLink({
  title,
  description,
  href,
  icon,
  color,
  badge,
}: QuickLinkProps) {
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

export default function McpwPartnerScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
            }}
          >
            <Handshake size={28} color='#FFF' />
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
              الشركاء
            </h1>
            <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>
              إدارة الشركاء والمتاجر والمنتجات
            </p>
          </div>
        </div>
      </div>

      {/* القسم الرئيسي */}
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
              backgroundColor: '#F59E0B12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Handshake size={20} color='#F59E0B' />
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
              أقسام الشركاء
            </h2>
            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
              إدارة الشركاء والمتاجر
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 12,
        }}
      >
        <QuickLink
          title='ترشيحات المتاجر'
          description='مراجعة طلبات الانضمام الجديدة'
          href='/partner/store-nominations'
          icon={<UserCheck size={22} color='#F97316' />}
          color='#F97316'
          badge='5'
        />
        <QuickLink
          title='قائمة الشركاء'
          description='جميع الشركاء المسجلين'
          href='/partner/list'
          icon={<Handshake size={22} color='#3B82F6' />}
          color='#3B82F6'
        />
        <QuickLink
          title='الطلبات'
          description='طلبات الشركاء والمتاجر'
          href='/partner/orders'
          icon={<ShoppingBag size={22} color='#8B5CF6' />}
          color='#8B5CF6'
        />
        <QuickLink
          title='المتاجر'
          description='إدارة متاجر الشركاء'
          href='/partner/stores'
          icon={<Store size={22} color='#10B981' />}
          color='#10B981'
        />
        <QuickLink
          title='المنتجات'
          description='منتجات الشركاء'
          href='/partner/products'
          icon={<Package size={22} color='#EC4899' />}
          color='#EC4899'
        />
        <QuickLink
          title='الشورتات'
          description='فيديوهات الشركاء القصيرة'
          href='/partner/shorts'
          icon={<Film size={22} color='#6366F1' />}
          color='#6366F1'
        />
        <QuickLink
          title='الأرباح'
          description='تتبع أرباح الشركاء'
          href='/partner/earnings'
          icon={<Coins size={22} color='#22C55E' />}
          color='#22C55E'
        />
        <QuickLink
          title='الإعدادات'
          description='إعدادات الشركاء'
          href='/partner/settings'
          icon={<Settings size={22} color='#64748B' />}
          color='#64748B'
        />
      </div>
    </div>
  );
}
