'use client';

/**
 * McpwOperationsScreen — Operations hub aligned with the restored partner spirit.
 */

import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import {
  Package,
  ChevronLeft,
  ShoppingCart,
  RefreshCw,
  Zap,
  Map,
  Truck,
  Wallet,
  Shield,
  Building2,
  Coins,
} from 'lucide-react';
import {
  ServiceSwitcher,
  getServiceContext,
  isLimitedService,
  resolveSectionService,
} from '../components/ServiceContext';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface QuickLinkProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

function QuickLink({ title, description, href, icon, color, badge }: QuickLinkProps) {
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
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}15`;
      }}
      onMouseLeave={(e) => {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', margin: 0 }}>{title}</h3>
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
        <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.5 }}>{description}</p>
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

export default function McpwOperationsScreen() {
  const { isRTL } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawService = searchParams.get('service');
  const activeService = resolveSectionService('operations', rawService);
  const activeServiceMeta = getServiceContext(activeService);

  useEffect(() => {
    if (rawService && isLimitedService(rawService)) {
      router.replace(`/service-catalog/services/${rawService}`);
    }
  }, [rawService, router]);

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.28)',
            }}
          >
            <Package size={28} color='#FFF' />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>العمليات</h1>
            <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>
              إدارة ومتابعة جميع العمليات والخدمات
            </p>
          </div>
        </div>
      </div>

      <ServiceSwitcher
        section='operations'
        activeService={activeService}
        basePath='/operations'
      />

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: `${activeService === 'dsh' ? '#3B82F6' : '#6366F1'}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {activeService === 'dsh' ? (
              <Truck size={20} color='#3B82F6' />
            ) : (
              <Building2 size={20} color='#6366F1' />
            )}
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
              {activeService === 'dsh' ? 'أقسام العمليات' : `عمليات ${activeServiceMeta.label}`}
            </h2>
            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
              {activeService === 'dsh'
                ? 'إدارة الطلبات والتغطية والتشغيل اليومي'
                : `عرض تشغيلي مخصص لخدمة ${activeServiceMeta.label}`}
            </p>
          </div>
        </div>
      </div>

      {activeService === 'dsh' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 12,
          }}
        >
          <QuickLink
            title='لوحة العمليات'
            description='نظرة شاملة على عمليات التوصيل الجارية'
            href='/operations/dsh'
            icon={<Package size={22} color='#F97316' />}
            color='#F97316'
            badge='نشط'
          />
          <QuickLink
            title='الطلبات'
            description='إدارة ومتابعة طلبات العملاء'
            href='/operations/dsh/orders'
            icon={<ShoppingCart size={22} color='#3B82F6' />}
            color='#3B82F6'
          />
          <QuickLink
            title='إعادة التعيين'
            description='إعادة تعيين الطلبات للكباتن'
            href='/operations/dsh/reassign'
            icon={<RefreshCw size={22} color='#8B5CF6' />}
            color='#8B5CF6'
          />
          <QuickLink
            title='وضع الذروة'
            description='إدارة أوقات الذروة والضغط العالي'
            href='/operations/dsh/peak-mode'
            icon={<Zap size={22} color='#EF4444' />}
            color='#EF4444'
          />
          <QuickLink
            title='المناطق'
            description='إدارة مناطق التغطية والتوصيل'
            href='/operations/dsh/zone-set'
            icon={<Map size={22} color='#10B981' />}
            color='#10B981'
          />
          <QuickLink
            title='الربط المالي'
            description='عرض الحركات المالية المرتبطة بطلبات DSH عبر WLT'
            href='/finance?service=dsh'
            icon={<Wallet size={22} color='#22C55E' />}
            color='#22C55E'
          />
          <QuickLink
            title='المراقبة والحماية'
            description='متابعة الحماية والتدخلات الحرجة أثناء التشغيل'
            href='/governance?service=dsh'
            icon={<Shield size={22} color='#64748B' />}
            color='#64748B'
          />
          <QuickLink
            title='العوائد التشغيلية'
            description='مؤشرات الحصيلة والربحية المرتبطة بالعمليات'
            href='/analytics?service=dsh'
            icon={<Coins size={22} color='#F59E0B' />}
            color='#F59E0B'
          />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 12,
          }}
        >
          <QuickLink
            title={`لوحة ${activeServiceMeta.label}`}
            description='وضع تشغيل الخدمة الحالية ضمن سياق العمليات'
            href={`/service-catalog/services#service-${activeService}`}
            icon={<Package size={22} color='#6366F1' />}
            color='#6366F1'
            badge='Context'
          />
          <QuickLink
            title='المهام الجارية'
            description={`المهام المرتبطة بخدمة ${activeServiceMeta.label}`}
            href={`/service-catalog/services#service-${activeService}`}
            icon={<ShoppingCart size={22} color='#3B82F6' />}
            color='#3B82F6'
          />
          <QuickLink
            title='الربط المالي'
            description='عرض العلاقة المالية المرتبطة بالخدمة المختارة عبر WLT'
            href={`/finance?service=${activeService}`}
            icon={<Wallet size={22} color='#22C55E' />}
            color='#22C55E'
          />
        </div>
      )}
    </div>
  );
}
