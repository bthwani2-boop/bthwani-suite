'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit';
import {
  ArrowUpLeft,
  BookOpen,
  Boxes,
  CircleCheck,
  Code,
  FileText,
  Home,
  Layers,
  Server,
  ToggleLeft,
  Truck,
} from 'lucide-react';
import {
  McpwCategorySection,
  McpwQuickLinkCard,
  McpwSectionHeader,
} from '../components/McpwDesignSystem';
import {
  RestoredHubHeader,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';
import { McpwEsfWorkspacePage } from './services/esf/McpwEsfReadonlyWorkspacePage';
import { McpwKwdWorkspacePage } from './services/kwd/McpwKwdWorkspacePage';
import { McpwMrfWorkspacePage } from './services/mrf/McpwMrfWorkspacePage';
import { SndWorkspacePage } from './services/Snd/SndWorkspacePage';

type ServiceId =
  | 'esf'
  | 'mrf'
  | 'kwd'
  | 'snd'
  | 'dsh'
  | 'knz'
  | 'amn'
  | 'wlt'
  | 'arb';

type ServiceCode =
  | 'ESF'
  | 'MRF'
  | 'KWD'
  | 'SND'
  | 'DSH'
  | 'KNZ'
  | 'AMN'
  | 'WLT'
  | 'ARB';

type CoreServiceId = 'dsh' | 'knz' | 'amn' | 'wlt' | 'arb';

interface BasicServiceFocusScreenProps {
  serviceId: ServiceId;
  serviceCode: ServiceCode;
  serviceName: string;
  summary: string;
  basicItems: string[];
  serviceDomain: string;
  ownershipModel: string;
  relatedScopes: string[];
  keySignals: string[];
  mainActionHref: string;
  mainActionLabel: string;
  monetizedAdsHint?: string;
}

interface McpwCoreServiceSectionPageProps {
  serviceId: CoreServiceId;
  serviceCode: 'DSH' | 'KNZ' | 'AMN' | 'WLT' | 'ARB';
  serviceName: string;
  sectionTitle: string;
  sectionSummary: string;
  bullets: string[];
  primaryHref: string;
  primaryLabel: string;
}

interface CatalogService {
  id: string;
  code: string;
  description: string;
  enabled: boolean;
  icon?: ReactNode;
  href?: string;
}

interface ServiceMeta {
  tier: 'core' | 'limited';
  scope: string;
  managedIn: string;
  dataPoints: string[];
}

interface RuntimeVarResolveResponse {
  key: string;
  resolved_value?: boolean | string | number | object;
  value?: boolean | string | number | object;
  source?: 'variable' | 'default' | 'fallback' | 'computed';
}

interface RuntimeVarUpsertRequest {
  key: string;
  value: boolean | string | number | object;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  category?: string;
}

interface RuntimeVarUpsertResponse {
  key: string;
  value: boolean | string | number | object;
  updated_at?: string;
  updated_by?: string;
  updatedAt?: string | null;
}

const HeartIcon = () => (
  <svg
    className='h-5 w-5 text-red-600'
    fill='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    />
  </svg>
);

const SERVICE_META: Record<string, ServiceMeta> = {
  dsh: {
    tier: 'core',
    scope: 'تشغيل عميق ومتكامل',
    managedIn: 'عمليات + مالية + تحليلات',
    dataPoints: ['طلبات', 'تشغيل', 'تحصيل'],
  },
  knz: {
    tier: 'core',
    scope: 'خدمة أساسية ضمن المسار التشغيلي',
    managedIn: 'قسم الخدمات + نقاط التشغيل',
    dataPoints: ['العروض', 'الطلبات', 'الحالة التشغيلية'],
  },
  amn: {
    tier: 'core',
    scope: 'خدمة أساسية مفعلة',
    managedIn: 'قسم الخدمات + نقاط التشغيل',
    dataPoints: ['الطلبات', 'الحالة', 'الاستجابة'],
  },
  wlt: {
    tier: 'core',
    scope: 'خدمة أساسية مالية وتشغيلية',
    managedIn: 'قسم الخدمات + المالية',
    dataPoints: ['الرصيد', 'التحويلات', 'العمولات'],
  },
  arb: {
    tier: 'core',
    scope: 'خدمة أساسية مرتبطة بالشركاء',
    managedIn: 'قسم الخدمات + الشركاء',
    dataPoints: ['الحجوزات', 'التوفر', 'الحالة'],
  },
  esf: {
    tier: 'limited',
    scope: 'تمركز مبسط داخل قسم الخدمات فقط',
    managedIn: 'قسم الخدمات (صفحة مبسطة)',
    dataPoints: ['حالة الخدمة', 'المسار الأساسي', 'التفعيل/التعطيل'],
  },
  mrf: {
    tier: 'limited',
    scope: 'تمركز مبسط داخل قسم الخدمات فقط',
    managedIn: 'قسم الخدمات (صفحة مبسطة)',
    dataPoints: ['حالة الخدمة', 'الأساسيات', 'التفعيل/التعطيل'],
  },
  kwd: {
    tier: 'limited',
    scope: 'تمركز مبسط داخل قسم الخدمات فقط',
    managedIn: 'قسم الخدمات (صفحة مبسطة)',
    dataPoints: ['حالة الخدمة', 'الأساسيات', 'التفعيل/التعطيل'],
  },
};

const INITIAL_SERVICES: CatalogService[] = [
  {
    id: 'esf',
    code: 'ESF',
    description: '',
    enabled: true,
    icon: <HeartIcon />,
    href: '/service-catalog/services/esf',
  },
  {
    id: 'dsh',
    code: 'DSH',
    description: '',
    enabled: true,
    icon: <span className='text-2xl'>🍔</span>,
    href: '/service-catalog/services/dsh',
  },
  {
    id: 'knz',
    code: 'KNZ',
    description: '',
    enabled: true,
    icon: <span className='text-2xl'>📦</span>,
    href: '/service-catalog/services/knz',
  },
  {
    id: 'arb',
    code: 'ARB',
    description: '',
    enabled: true,
    icon: <span className='text-2xl'>🏠</span>,
    href: '/service-catalog/services/arb',
  },
  {
    id: 'amn',
    code: 'AMN',
    description: '',
    enabled: true,
    icon: <span className='text-2xl'>🚗</span>,
    href: '/service-catalog/services/amn',
  },
  {
    id: 'kwd',
    code: 'KWD',
    description: '',
    enabled: true,
    icon: <span className='text-2xl'>💼</span>,
    href: '/service-catalog/services/kwd',
  },
  {
    id: 'mrf',
    code: 'MRF',
    description: '',
    enabled: true,
    icon: <span className='text-2xl'>🔍</span>,
    href: '/service-catalog/services/mrf',
  },
  {
    id: 'wlt',
    code: 'WLT',
    description: '',
    enabled: true,
    icon: <span className='text-2xl'>💳</span>,
    href: '/service-catalog/services/wlt',
  },
];

function BasicServiceFocusScreen({
  serviceId,
  serviceCode,
  serviceName,
  summary,
  basicItems,
  serviceDomain,
  ownershipModel,
  relatedScopes,
  keySignals,
  mainActionHref,
  mainActionLabel,
  monetizedAdsHint,
}: BasicServiceFocusScreenProps) {
  const { isRTL } = useI18n();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const key = `VAR_SVC_${serviceCode}_ENABLED`;

      try {
        const response = await fetch(
          `/api/platform/governance/runtime-vars/key/${encodeURIComponent(key)}/resolve`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          setEnabled(true);
          return;
        }

        const data: RuntimeVarResolveResponse = await response.json();
        const value = data?.resolved_value ?? data?.value;
        setEnabled(
          typeof value === 'boolean'
            ? value
            : String(value).toLowerCase() === 'true'
        );
      } catch {
        setEnabled(true);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [serviceCode]);

  const handleToggle = async () => {
    if (loading || toggling) {
      return;
    }

    const previous = enabled;
    const next = !previous;
    const key = `VAR_SVC_${serviceCode}_ENABLED`;

    setEnabled(next);
    setToggling(true);

    try {
      const response = await fetch(
        '/api/platform/governance/runtime-vars/upsert',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            key,
            value: next,
            type: 'boolean',
            description: `Service enablement toggle for ${serviceCode}`,
            category: 'features',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('toggle_failed');
      }
    } catch {
      setEnabled(previous);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className='w-full min-w-0 px-4 py-6 md:px-6'
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className='mx-auto w-full max-w-7xl'>
        <div
          className='grid grid-cols-1 gap-4 lg:grid-cols-12'
          data-service-id={serviceId}
        >
          <div className='lg:col-span-8'>
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <div>
                  <p className='text-xs font-semibold tracking-wide text-orange-600'>
                    {serviceCode}
                  </p>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    {serviceName}
                  </h1>
                </div>
                <Link
                  href='/service-catalog/services'
                  className='inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                  رجوع للخدمات
                </Link>
              </div>

              <p className='mb-5 text-sm text-gray-600'>{summary}</p>

              <div className='mb-5 grid grid-cols-1 gap-3 md:grid-cols-2'>
                <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
                  <p className='mb-1 text-xs font-semibold text-gray-500'>
                    نطاق الخدمة
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {serviceDomain}
                  </p>
                </div>
                <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
                  <p className='mb-1 text-xs font-semibold text-gray-500'>
                    نموذج الإدارة
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {ownershipModel}
                  </p>
                </div>
              </div>

              <div className='mb-5 rounded-xl border border-gray-100 bg-gray-50 p-4'>
                <h2 className='mb-3 text-base font-semibold text-gray-900'>
                  الأساسيات فقط
                </h2>
                <ul className='space-y-2'>
                  {basicItems.map(item => (
                    <li
                      key={item}
                      className='flex items-start gap-2 text-sm text-gray-700'
                    >
                      <CircleCheck className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
                <h2 className='mb-3 text-base font-semibold text-gray-900'>
                  بيانات الخدمة المعروضة
                </h2>
                <ul className='space-y-2'>
                  {keySignals.map(signal => (
                    <li
                      key={signal}
                      className='flex items-start gap-2 text-sm text-gray-700'
                    >
                      <CircleCheck className='mt-0.5 h-4 w-4 shrink-0 text-blue-600' />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='lg:col-span-4'>
            <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
              <div className='mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-sm font-semibold text-gray-900'>
                      حالة الخدمة
                    </p>
                    <p className='text-xs text-gray-600'>
                      {loading
                        ? 'جاري التحميل...'
                        : enabled
                          ? 'الخدمة مفعلة'
                          : 'الخدمة معطلة'}
                    </p>
                    <p className='mt-1 text-[11px] text-gray-500'>
                      VAR_SVC_{serviceCode}_ENABLED
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={handleToggle}
                    disabled={loading || toggling}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${
                      enabled
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-gray-500 hover:bg-gray-600'
                    } ${loading || toggling ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    {toggling ? '...' : enabled ? 'تعطيل' : 'تفعيل'}
                  </button>
                </div>
              </div>

              <div className='mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4'>
                <h2 className='mb-3 text-base font-semibold text-gray-900'>
                  النطاقات المرتبطة
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {relatedScopes.map(scope => (
                    <span
                      key={scope}
                      className='rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700'
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              {monetizedAdsHint ? (
                <div className='mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
                  <span className='font-semibold'>ملاحظة استراتيجية:</span>{' '}
                  {monetizedAdsHint}
                </div>
              ) : null}

              <Link
                href={mainActionHref}
                className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600'
              >
                {mainActionLabel}
                <ArrowUpLeft className='h-4 w-4' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function McpwCoreServiceSectionPage({
  serviceId,
  serviceCode,
  serviceName,
  sectionTitle,
  sectionSummary,
  bullets,
  primaryHref,
  primaryLabel,
}: McpwCoreServiceSectionPageProps) {
  const { isRTL } = useI18n();

  return (
    <div
      className='w-full min-w-0 px-4 py-6 md:px-6'
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className='mx-auto w-full max-w-6xl'>
        <div
          className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'
          data-service-id={serviceId}
        >
          <div className='mb-4 flex items-center justify-between gap-3'>
            <div>
              <p className='text-xs font-semibold tracking-wide text-orange-600'>
                {serviceCode}
              </p>
              <h1 className='text-2xl font-bold text-gray-900'>
                {serviceName}
              </h1>
              <p className='mt-1 text-sm font-semibold text-gray-700'>
                {sectionTitle}
              </p>
            </div>
            <Link
              href={`/service-catalog/services/${serviceId}`}
              className='inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
            >
              رجوع للخدمة
            </Link>
          </div>

          <p className='mb-5 text-sm text-gray-600'>{sectionSummary}</p>

          <div className='mb-5 rounded-xl border border-gray-100 bg-gray-50 p-4'>
            <h2 className='mb-3 text-base font-semibold text-gray-900'>
              ما الذي يُدار في هذا القسم
            </h2>
            <ul className='space-y-2'>
              {bullets.map(item => (
                <li
                  key={item}
                  className='flex items-start gap-2 text-sm text-gray-700'
                >
                  <CircleCheck className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={primaryHref}
            className='inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600'
          >
            {primaryLabel}
            <ArrowUpLeft className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function McpwDshQueueSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='dsh'
      serviceCode='DSH'
      serviceName='خدمة DSH'
      sectionTitle='قسم الوارد والتشغيل'
      sectionSummary='إدارة قائمة الوارد التشغيلي ونقاط المعالجة اليومية لخدمة DSH.'
      bullets={['طلبات جديدة', 'حالات متأخرة', 'تدخلات عاجلة']}
      primaryHref='/operations/dsh'
      primaryLabel='فتح تشغيل DSH'
    />
  );
}

export function McpwDshSettingsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='dsh'
      serviceCode='DSH'
      serviceName='خدمة DSH'
      sectionTitle='قسم الإعدادات'
      sectionSummary='إدارة الإعدادات التشغيلية الأساسية والحدود والسياسات لخدمة DSH.'
      bullets={['سياسات التشغيل', 'حدود التنفيذ', 'خيارات التفعيل']}
      primaryHref='/governance/runtime-vars'
      primaryLabel='فتح إعدادات DSH'
    />
  );
}

export function McpwDshInsightsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='dsh'
      serviceCode='DSH'
      serviceName='خدمة DSH'
      sectionTitle='قسم التحليلات'
      sectionSummary='متابعة المؤشرات الأساسية للأداء والجودة والزمن التشغيلي لخدمة DSH.'
      bullets={['معدل الإنجاز', 'زمن المعالجة', 'مؤشرات الجودة']}
      primaryHref='/analytics/dsh-orders'
      primaryLabel='فتح تحليلات DSH'
    />
  );
}

export function McpwKnzQueueSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='knz'
      serviceCode='KNZ'
      serviceName='خدمة KNZ'
      sectionTitle='قسم الوارد'
      sectionSummary='إدارة العناصر الواردة لKNZ مع تسلسل واضح للمعالجة اليومية.'
      bullets={['عناصر جديدة', 'قيد المراجعة', 'بحاجة تدخل']}
      primaryHref='/operations/knz'
      primaryLabel='فتح تشغيل KNZ'
    />
  );
}

export function McpwKnzSettingsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='knz'
      serviceCode='KNZ'
      serviceName='خدمة KNZ'
      sectionTitle='قسم الإعدادات'
      sectionSummary='ضبط قواعد KNZ التشغيلية وربط الإعدادات بمسار الخدمة الرئيسي.'
      bullets={['قواعد قبول', 'سياسات النشر', 'حدود التحكم']}
      primaryHref='/governance/runtime-vars'
      primaryLabel='فتح إعدادات KNZ'
    />
  );
}

export function McpwKnzInsightsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='knz'
      serviceCode='KNZ'
      serviceName='خدمة KNZ'
      sectionTitle='قسم التحليلات'
      sectionSummary='تحليل أداء KNZ ومؤشرات التدفق والاعتمادية.'
      bullets={['معدل النشر', 'نسبة الرفض', 'زمن الإغلاق']}
      primaryHref='/analytics'
      primaryLabel='فتح تحليلات KNZ'
    />
  );
}

export function McpwAmnQueueSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='amn'
      serviceCode='AMN'
      serviceName='خدمة AMN'
      sectionTitle='قسم الوارد'
      sectionSummary='متابعة الوارد اليومي في AMN وإدارة أولويات التشغيل.'
      bullets={['رحلات نشطة', 'حالات عالقة', 'طلبات عاجلة']}
      primaryHref='/operations/amn'
      primaryLabel='فتح تشغيل AMN'
    />
  );
}

export function McpwAmnSettingsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='amn'
      serviceCode='AMN'
      serviceName='خدمة AMN'
      sectionTitle='قسم الإعدادات'
      sectionSummary='ضبط حدود AMN التشغيلية وربطها بالمتغيرات الحاكمة.'
      bullets={['تكوين الخدمة', 'سياسات الاستجابة', 'حدود الأمان']}
      primaryHref='/governance/runtime-vars'
      primaryLabel='فتح إعدادات AMN'
    />
  );
}

export function McpwAmnInsightsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='amn'
      serviceCode='AMN'
      serviceName='خدمة AMN'
      sectionTitle='قسم التحليلات'
      sectionSummary='عرض مؤشرات الخدمة وسرعة المعالجة وجودة الإغلاق.'
      bullets={['الرحلات المكتملة', 'معدل النجاح', 'الزمن المتوسط']}
      primaryHref='/analytics'
      primaryLabel='فتح تحليلات AMN'
    />
  );
}

export function McpwWltQueueSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='wlt'
      serviceCode='WLT'
      serviceName='خدمة WLT'
      sectionTitle='قسم الوارد'
      sectionSummary='متابعة طلبات WLT الواردة ومسارها التشغيلي.'
      bullets={['طلبات تحويل', 'تسويات معلقة', 'حالات فشل']}
      primaryHref='/finance'
      primaryLabel='فتح تشغيل WLT'
    />
  );
}

export function McpwWltSettingsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='wlt'
      serviceCode='WLT'
      serviceName='خدمة WLT'
      sectionTitle='قسم الإعدادات'
      sectionSummary='إدارة متغيرات WLT التشغيلية والمالية عبر نقطة موحدة.'
      bullets={['حدود مالية', 'سياسات التحويل', 'إعدادات التسوية']}
      primaryHref='/governance/runtime-vars'
      primaryLabel='فتح إعدادات WLT'
    />
  );
}

export function McpwWltInsightsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='wlt'
      serviceCode='WLT'
      serviceName='خدمة WLT'
      sectionTitle='قسم التحليلات'
      sectionSummary='تحليل أداء WLT المالي والتشغيلي.'
      bullets={['حجم التسويات', 'معدل نجاح التحويل', 'نقاط التعثر']}
      primaryHref='/finance'
      primaryLabel='فتح تحليلات WLT'
    />
  );
}

export function McpwArbQueueSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='arb'
      serviceCode='ARB'
      serviceName='خدمة ARB'
      sectionTitle='قسم الوارد'
      sectionSummary='إدارة الوارد اليومي للحجوزات والحالات التشغيلية في ARB.'
      bullets={['حجوزات جديدة', 'حالات معلقة', 'تدخلات عاجلة']}
      primaryHref='/operations/arb'
      primaryLabel='فتح تشغيل ARB'
    />
  );
}

export function McpwArbSettingsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='arb'
      serviceCode='ARB'
      serviceName='خدمة ARB'
      sectionTitle='قسم الإعدادات'
      sectionSummary='تكوين ضوابط ARB التشغيلية مع ربط واضح بالحوكمة.'
      bullets={['قواعد الحجز', 'ضوابط المطابقة', 'حدود التنفيذ']}
      primaryHref='/governance/runtime-vars'
      primaryLabel='فتح إعدادات ARB'
    />
  );
}

export function McpwArbInsightsSectionPage() {
  return (
    <McpwCoreServiceSectionPage
      serviceId='arb'
      serviceCode='ARB'
      serviceName='خدمة ARB'
      sectionTitle='قسم التحليلات'
      sectionSummary='عرض تحليلات ARB للأداء ونتائج التشغيل.'
      bullets={['نسبة الإغلاق', 'الوقت لكل حالة', 'مؤشرات الجودة']}
      primaryHref='/analytics'
      primaryLabel='فتح تحليلات ARB'
    />
  );
}

export function McpwEsfBasicServicePage() {
  return <McpwEsfWorkspacePage />;
}

export function McpwMrfBasicServicePage() {
  return <McpwMrfWorkspacePage />;
}

export function McpwKwdBasicServicePage() {
  return <McpwKwdWorkspacePage />;
}

export function McpwSndBasicServicePage() {
  return <SndWorkspacePage />;
}

export function McpwDshBasicServicePage() {
  return (
    <BasicServiceFocusScreen
      serviceId='dsh'
      serviceCode='DSH'
      serviceName='خدمة DSH'
      summary='تم توحيد نقطة دخول DSH داخل قسم الخدمات، مع إبقاء التنفيذ التشغيلي عبر مسارات DSH الداخلية.'
      basicItems={[
        'نقطة دخول واحدة من قسم الخدمات',
        'الوصول السريع للطلبات/التشغيل/التحصيل',
        'تقليل التشتت بين الأقسام',
      ]}
      serviceDomain='إدارة عمليات DSH'
      ownershipModel='واجهة خدمة ضمن service-catalog'
      relatedScopes={['الطلبات', 'التشغيل', 'التحصيل']}
      keySignals={['حالة الطلبات', 'سرعة التنفيذ', 'نسبة النجاح']}
      mainActionHref='/operations/dsh'
      mainActionLabel='فتح عمليات DSH'
    />
  );
}

export function McpwKnzBasicServicePage() {
  return (
    <BasicServiceFocusScreen
      serviceId='knz'
      serviceCode='KNZ'
      serviceName='خدمة KNZ'
      summary='واجهة KNZ أصبحت مرتبطة بقسم الخدمات مباشرة كنقطة توجيه تشغيلية موحدة.'
      basicItems={[
        'دخول موحد من service-catalog',
        'التحكم في دورة العروض/الإعلانات',
        'مسار متابعة واضح بدون تكرار ملاحي',
      ]}
      serviceDomain='إدارة KNZ التشغيلية'
      ownershipModel='واجهة خدمة ضمن service-catalog'
      relatedScopes={['العروض', 'الإعلانات', 'الطلبات']}
      keySignals={['حالة الإعلانات', 'القبول/الرفض', 'زمن المعالجة']}
      mainActionHref='/operations/knz'
      mainActionLabel='فتح عمليات KNZ'
    />
  );
}

export function McpwAmnBasicServicePage() {
  return (
    <BasicServiceFocusScreen
      serviceId='amn'
      serviceCode='AMN'
      serviceName='خدمة AMN'
      summary='نقطة AMN في لوحة التحكم أصبحت ضمن قسم الخدمات مع تدفق واضح للتشغيل والمتابعة.'
      basicItems={[
        'نقطة دخول واحدة للخدمة',
        'تجميع تتبع الرحلات والحالات',
        'تحسين وضوح مسار فريق التشغيل',
      ]}
      serviceDomain='إدارة تشغيل AMN'
      ownershipModel='واجهة خدمة ضمن service-catalog'
      relatedScopes={['الرحلات', 'الحالة', 'الاستجابة']}
      keySignals={['الرحلات النشطة', 'الزمن التشغيلي', 'حالات الفشل']}
      mainActionHref='/operations/amn'
      mainActionLabel='فتح عمليات AMN'
    />
  );
}

export function McpwWltBasicServicePage() {
  return (
    <BasicServiceFocusScreen
      serviceId='wlt'
      serviceCode='WLT'
      serviceName='خدمة WLT'
      summary='واجهة WLT مرتبطة بقسم الخدمات كنقطة إدارة موحدة، مع ربط مباشر بالشاشات المالية.'
      basicItems={[
        'دخول موحد من service-catalog',
        'تجميع حالات الرصيد/التحويلات',
        'وضوح مسار القرار المالي',
      ]}
      serviceDomain='إدارة WLT المالية والتشغيلية'
      ownershipModel='واجهة خدمة ضمن service-catalog'
      relatedScopes={['الرصيد', 'التسويات', 'العمولات']}
      keySignals={['الرصيد الحالي', 'حالات التحويل', 'أعطال التسوية']}
      mainActionHref='/finance'
      mainActionLabel='فتح لوحة المالية'
    />
  );
}

export function McpwArbBasicServicePage() {
  return (
    <BasicServiceFocusScreen
      serviceId='arb'
      serviceCode='ARB'
      serviceName='خدمة ARB'
      summary='واجهة ARB صارت مرتبطة بقسم الخدمات مباشرة مع مسار تشغيل موحد وقابل للتتبع.'
      basicItems={[
        'مدخل خدمة واحد',
        'متابعة حجوزات الشركاء',
        'فصل واضح بين العرض والتنفيذ',
      ]}
      serviceDomain='إدارة حجوزات ARB'
      ownershipModel='واجهة خدمة ضمن service-catalog'
      relatedScopes={['الحجوزات', 'الحالة', 'المطابقات']}
      keySignals={['الحجوزات المفتوحة', 'معدل الإغلاق', 'تعارضات الحالة']}
      mainActionHref='/operations/arb'
      mainActionLabel='فتح عمليات ARB'
    />
  );
}

export function McpwServiceCatalogScreen() {
  const { isRTL } = useI18n();

  return (
    <div className='w-full max-w-full min-w-0' dir={isRTL ? 'rtl' : 'ltr'}>
      <McpwSectionHeader
        title='كتالوج الخدمات'
        subtitle='إدارة الخدمات والوحدات والتكاملات'
        icon={<FileText size={28} color='#FFF' strokeWidth={2} />}
        gradientFrom='#6366F1'
        gradientTo='#4F46E5'
        shadowColor='rgba(99, 102, 241, 0.3)'
      />

      <McpwCategorySection
        title='خدمات المنصة'
        description='الخدمات المتاحة في المنصة'
        icon={<FileText size={20} color='#6366F1' />}
        color='#6366F1'
      >
        <McpwQuickLinkCard
          title='خدمة التوصيل DSH'
          description='توصيل البقالة والطلبات للعملاء'
          href='/operations/dsh'
          icon={<Truck size={22} color='#F97316' />}
          color='#F97316'
        />
        <McpwQuickLinkCard
          title='خدمة التنظيف ESF'
          description='خدمات التنظيف والصيانة المنزلية'
          href='/service-catalog/services/esf'
          icon={<Home size={22} color='#06B6D4' />}
          color='#06B6D4'
        />
        <McpwQuickLinkCard
          title='الخدمات'
          description='جميع الخدمات المتاحة في المنصة'
          href='/service-catalog/services'
          icon={<Server size={22} color='#3B82F6' />}
          color='#3B82F6'
        />
        <McpwQuickLinkCard
          title='APIs'
          description='واجهات برمجة التطبيقات'
          href='/service-catalog/apis'
          icon={<Code size={22} color='#8B5CF6' />}
          color='#8B5CF6'
        />
        <McpwQuickLinkCard
          title='الوحدات'
          description='وحدات النظام والمكونات'
          href='/service-catalog/modules'
          icon={<Boxes size={22} color='#22C55E' />}
          color='#22C55E'
        />
        <McpwQuickLinkCard
          title='التوثيق'
          description='وثائق الخدمات والتكاملات'
          href='/service-catalog/documentation'
          icon={<BookOpen size={22} color='#EC4899' />}
          color='#EC4899'
        />
      </McpwCategorySection>
    </div>
  );
}

export function ServiceCatalogServicesIndexPage() {
  const { t, isRTL } = useI18n();
  const [services, setServices] = useState<CatalogService[]>(INITIAL_SERVICES);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    void loadServiceStatus();
  }, []);

  const loadServiceStatus = async () => {
    setLoading(true);

    try {
      const serviceStatuses = await Promise.all(
        INITIAL_SERVICES.map(async service => {
          const varKey = `VAR_SVC_${service.code}_ENABLED`;

          try {
            const response = await fetch(
              `/api/platform/governance/runtime-vars/key/${encodeURIComponent(varKey)}/resolve`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
              }
            );

            if (!response.ok) {
              console.warn(`Failed to load ${varKey}: ${response.status}`);
              return { serviceId: service.id, enabled: true };
            }

            const data: RuntimeVarResolveResponse = await response.json();
            const resolvedValue = data?.resolved_value ?? data?.value;
            const enabled =
              typeof resolvedValue === 'boolean'
                ? resolvedValue
                : String(resolvedValue).toLowerCase() === 'true';

            return { serviceId: service.id, enabled };
          } catch (error) {
            console.error(`Error loading ${varKey}:`, error);
            return { serviceId: service.id, enabled: true };
          }
        })
      );

      setServices(prev =>
        prev.map(service => {
          const status = serviceStatuses.find(
            item => item.serviceId === service.id
          );
          return status ? { ...service, enabled: status.enabled } : service;
        })
      );
    } catch (error) {
      console.error('Failed to load service statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (serviceId: string) => {
    const service = services.find(item => item.id === serviceId);

    if (!service) {
      return;
    }

    const varKey = `VAR_SVC_${service.code}_ENABLED`;
    const newValue = !service.enabled;
    const previousValue = service.enabled;

    setServices(prev =>
      prev.map(item =>
        item.id === serviceId ? { ...item, enabled: newValue } : item
      )
    );

    setToggling(serviceId);

    try {
      const requestBody: RuntimeVarUpsertRequest = {
        key: varKey,
        value: newValue,
        type: 'boolean',
        description: `Service enablement toggle for ${service.code}`,
        category: 'features',
      };

      const response = await fetch(
        '/api/platform/governance/runtime-vars/upsert',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          response.status === 403
            ? t('control panel.no_permission_edit_service')
            : response.status === 401
              ? t('control panel.login_first')
              : t('control panel.update_state_failed_with_detail', {
                  status: String(response.status),
                  detail: errorText,
                })
        );
      }

      const data: RuntimeVarUpsertResponse = await response.json();

      if (typeof data.value === 'boolean' && data.value !== newValue) {
        throw new Error(t('control panel.server_value_mismatch'));
      }

      const serviceName = t(`control panel.service_${serviceId}_name`);
      alert(
        newValue
          ? `✅ ${t('control panel.toast_service_enabled', { name: serviceName })}`
          : `⚠️ ${t('control panel.toast_service_disabled', { name: serviceName })}`
      );
    } catch (error) {
      setServices(prev =>
        prev.map(item =>
          item.id === serviceId ? { ...item, enabled: previousValue } : item
        )
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : t('control panel.حدث_خطأ_غير_متوقع_أثناء_تحديث_حالة_ا');

      alert(`❌ ${errorMessage}`);
      console.error('Failed to toggle service:', error);
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className='w-full bg-slate-50 p-4 sm:p-6' dir={isRTL ? 'rtl' : 'ltr'}>
      <div className='mx-auto max-w-6xl'>
        <RestoredHubHeader
          title={t('control panel.services_title')}
          subtitle={t('control panel.services_subtitle')}
          icon={<Layers size={28} color='#FFF' />}
          gradientFrom='#F97316'
          gradientTo='#EA580C'
          shadowColor='rgba(249, 115, 22, 0.28)'
        />

        <RestoredHubSectionIntro
          title='قائمة الخدمات'
          description='تفعيل أو تعطيل الخدمات والوحدات التشغيلية مع عرض السياق الإداري لكل خدمة'
          icon={<ToggleLeft size={20} color='#F97316' />}
          accentColor='#F97316'
        />

        <div className='space-y-3'>
          {loading ? (
            <div className='py-12 text-center'>
              <p className='text-slate-500'>
                {t('control panel.loading_services_state')}
              </p>
            </div>
          ) : (
            services.map(service => (
              <div
                key={service.id}
                id={`service-${service.id}`}
                className='rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:shadow-md'
              >
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex min-w-0 items-start gap-4'>
                    {service.icon ? (
                      <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600'>
                        {service.icon}
                      </div>
                    ) : null}

                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex flex-wrap items-center gap-3'>
                        {service.enabled && service.href ? (
                          <a
                            href={service.href}
                            className='text-base font-semibold text-orange-600 hover:underline'
                          >
                            {t(`control panel.service_${service.id}_name`)}
                          </a>
                        ) : (
                          <h3 className='text-base font-semibold text-slate-900'>
                            {t(`control panel.service_${service.id}_name`)}
                          </h3>
                        )}

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-xs ${
                            service.enabled
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {service.enabled
                            ? t('control panel.service_enabled_label')
                            : t('control panel.service_disabled_label')}
                        </span>
                      </div>

                      <p
                        className='text-sm text-slate-600'
                        title={t(`control panel.service_${service.id}`)}
                      >
                        {t(`control panel.service_${service.id}`)}
                      </p>

                      <div className='mt-2 flex flex-wrap items-center gap-2'>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] ${
                            SERVICE_META[service.id]?.tier === 'core'
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {SERVICE_META[service.id]?.tier === 'core'
                            ? 'خدمة أساسية'
                            : 'خدمة محدودة'}
                        </span>

                        <span className='text-xs text-slate-500'>
                          {SERVICE_META[service.id]?.scope}
                        </span>
                      </div>

                      <div className='mt-3 flex flex-wrap items-center gap-2'>
                        <span className='text-xs font-semibold text-slate-800'>
                          نطاق الإدارة:
                        </span>
                        <p className='mb-1 text-xs font-semibold text-slate-800'>
                          {SERVICE_META[service.id]?.managedIn}
                        </p>
                        {(SERVICE_META[service.id]?.dataPoints ?? []).map(
                          point => (
                            <span
                              key={`${service.id}-${point}`}
                              className='rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600'
                            >
                              {point}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='shrink-0'>
                    <label className='inline-flex cursor-pointer items-center'>
                      <input
                        type='checkbox'
                        className='sr-only'
                        checked={service.enabled}
                        onChange={() => handleToggle(service.id)}
                        disabled={loading || toggling === service.id}
                      />
                      <div
                        className={`relative inline-block h-6 w-12 rounded-full transition-colors ${
                          loading || toggling === service.id
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        } ${service.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <span
                          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                            service.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />

                        {toggling === service.id ? (
                          <span className='absolute inset-0 flex items-center justify-center text-slate-900'>
                            <svg
                              className='h-3 w-3 animate-spin'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                            >
                              <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                              />
                              <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                              />
                            </svg>
                          </span>
                        ) : null}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default McpwServiceCatalogScreen;

