'use client';

/**
 * McpwFinanceScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import { useI18n } from '@bthwani/ui-kit';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DollarSign,
  CreditCard,
  FileText,
  TrendingUp,
  Banknote,
  CircleDollarSign,
  Receipt,
  Settings,
  Calculator,
  ArrowRightLeft,
} from 'lucide-react';
import {
  ServiceSwitcher,
  getServiceContext,
  isLimitedService,
  resolveSectionService,
} from '../components/ServiceContext';
import {
  RestoredHubGrid,
  RestoredHubHeader,
  RestoredHubQuickLink,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwFinanceScreen() {
  const { isRTL } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawService = searchParams.get('service');
  const activeService = resolveSectionService('finance', rawService);
  const activeServiceMeta = getServiceContext(activeService);

  useEffect(() => {
    if (rawService && isLimitedService(rawService)) {
      router.replace(`/service-catalog/services/${rawService}`);
    }
  }, [rawService, router]);

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title='المالية'
        subtitle='إدارة المدفوعات والتسويات والتقارير المالية'
        icon={<DollarSign size={28} color='#FFF' />}
        gradientFrom='#22C55E'
        gradientTo='#16A34A'
        shadowColor='rgba(34, 197, 94, 0.3)'
      />
      <ServiceSwitcher
        section='finance'
        activeService={activeService}
        basePath='/finance'
      />

      <RestoredHubSectionIntro
        title={`السياق المالي - ${activeServiceMeta.label}`}
        description='الربط المالي للخدمة المختارة داخل المحفظة والتسويات'
        icon={<TrendingUp size={20} color='#F97316' />}
        accentColor='#F97316'
      />
      <RestoredHubGrid>
        <RestoredHubQuickLink
          title='التدفق المالي التشغيلي'
          description={`تتبع حركة ${activeServiceMeta.label} المالية داخل WLT`}
          href={`/finance/ledger?service=${activeService}`}
          icon={<CircleDollarSign size={22} color='#F97316' />}
          color='#F97316'
          badge={activeServiceMeta.label}
        />
        <RestoredHubQuickLink
          title='الرابط التشغيلي'
          description='الانتقال إلى العمليات المرتبطة بنفس الخدمة المختارة'
          href={`/operations?service=${activeService}`}
          icon={<ArrowRightLeft size={22} color='#3B82F6' />}
          color='#3B82F6'
        />
        <RestoredHubQuickLink
          title='الصلة مع WLT'
          description={`لا يتم عرض ${activeServiceMeta.label} منفصلًا عن طبقة WLT المالية`}
          href={`/finance?service=wlt`}
          icon={<WalletProxyIcon />}
          color='#22C55E'
        />
        <RestoredHubQuickLink
          title='المدفوعات'
          description='دفعات الكباتن والشركاء'
          href='/finance/payouts'
          icon={<Banknote size={22} color='#22C55E' />}
          color='#22C55E'
        />
        <RestoredHubQuickLink
          title='التسويات'
          description='تسويات الحسابات والمعاملات'
          href='/finance/settlements'
          icon={<ArrowRightLeft size={22} color='#8B5CF6' />}
          color='#8B5CF6'
        />
        <RestoredHubQuickLink
          title='السجل المالي'
          description='سجل جميع المعاملات المالية'
          href='/finance/ledger'
          icon={<FileText size={22} color='#3B82F6' />}
          color='#3B82F6'
        />
        <RestoredHubQuickLink
          title='سجل الرسوم'
          description='تتبع الرسوم والخصومات'
          href='/finance/fee-ledger'
          icon={<Receipt size={22} color='#EC4899' />}
          color='#EC4899'
        />
        <RestoredHubQuickLink
          title='سعر الصرف'
          description='أسعار الذهب والعملات'
          href='/finance/exchange-price'
          icon={<TrendingUp size={22} color='#F59E0B' />}
          color='#F59E0B'
        />
        <RestoredHubQuickLink
          title='رسوم المزودين'
          description='إعدادات رسوم المزودين'
          href='/finance/provider-fees'
          icon={<Calculator size={22} color='#EF4444' />}
          color='#EF4444'
        />
        <RestoredHubQuickLink
          title='قواعد الخصم'
          description='قواعد الاستيعاب والخصم'
          href='/finance/absorption-rules'
          icon={<Settings size={22} color='#6366F1' />}
          color='#6366F1'
        />
      </RestoredHubGrid>
    </div>
  );
}

function WalletProxyIcon() {
  return <Banknote size={22} color='#22C55E' />;
}
