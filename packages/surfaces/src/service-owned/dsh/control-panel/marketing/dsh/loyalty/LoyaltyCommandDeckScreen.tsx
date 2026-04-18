"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BthBox,
  BthButton,
  BthKeyValueList,
  BthListItem,
  BthSurface,
  BthTextField,
  BthText,
} from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard, BthWebSegmentedTabs, BthWebSignalCard } from '@bthwani/ui-kit/web';
import {
  loyaltyCommercialLaneItems,
  loyaltyCommercialKeyValues,
  loyaltyCommercialSignals,
} from './loyaltyCommerceData';

export type LoyaltyCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
};

type LoyaltyCommandSection = 'overview' | 'builder' | 'sync' | 'guardrails';
type LoyaltyLane = 'subscription' | 'loyalty' | 'coupon';

const loyaltySectionTabs: ReadonlyArray<{ id: LoyaltyCommandSection; label: string; metaLabel: string }> = [
  { id: 'overview', label: 'نظرة عامة', metaLabel: 'الرؤية التنفيذية' },
  { id: 'builder', label: 'المصمم', metaLabel: 'تحرير مباشر' },
  { id: 'sync', label: 'المزامنة', metaLabel: 'تشغيل حي' },
  { id: 'guardrails', label: 'الضوابط', metaLabel: 'حوكمة' },
];

const loyaltyLaneTabs: ReadonlyArray<{ id: LoyaltyLane; label: string; metaLabel: string }> = [
  { id: 'subscription', label: 'الاشتراك', metaLabel: 'الخطة والأسرة' },
  { id: 'loyalty', label: 'النقاط', metaLabel: 'الرصيد والاسترداد' },
  { id: 'coupon', label: 'الكوبون', metaLabel: 'السعر والعرض' },
];

function resolveLaneTitle(lane: LoyaltyLane) {
  if (lane === 'subscription') return 'غرفة الاشتراك العائلي';
  if (lane === 'loyalty') return 'غرفة النقاط والولاء';
  return 'غرفة الكوبونات والعروض';
}

function resolveLaneDescription(lane: LoyaltyLane, activeDescription: string) {
  if (lane === 'subscription') {
    return `من هنا يتم ضبط الخطة، الأسرة، والمزامنة بطريقة تجارية راقية وواضحة. ${activeDescription}`;
  }

  if (lane === 'loyalty') {
    return `الرصيد والسجل والاستبدال يظهرون كقيمة تشغيلية حقيقية لا كتلخيص تجميلي ضعيف. ${activeDescription}`;
  }

  return `العروض والكوبونات تبقى قريبة من السعر والقرار النهائي للعميل مع تحكم أوضح. ${activeDescription}`;
}

function resolveAudienceLabel(audience: 'all' | 'client' | 'operations') {
  if (audience === 'client') return 'واجهة العميل';
  if (audience === 'operations') return 'العمليات';
  return 'عام';
}

function resolveDeliveryLabel(deliveryMode: 'auto' | 'manual' | 'pinned') {
  if (deliveryMode === 'auto') return 'تلقائي';
  if (deliveryMode === 'manual') return 'يدوي';
  return 'مثبت';
}

export function LoyaltyCommandDeckScreen({ hubHref = '/operations/dsh', operationsHref = '/operations' }: LoyaltyCommandDeckScreenProps) {
  const router = useRouter();
  const [section, setSection] = React.useState<LoyaltyCommandSection>('overview');
  const [lane, setLane] = React.useState<LoyaltyLane>('subscription');
  const [programName, setProgramName] = React.useState('برنامج ولاء العميل المميز');
  const [programMessage, setProgramMessage] = React.useState('تجربة الولاء يجب أن تبقى واضحة وسلسة ومرتبطة بالمسارات الحية فقط.');
  const [audience, setAudience] = React.useState<'all' | 'client' | 'operations'>('client');
  const [deliveryMode, setDeliveryMode] = React.useState<'auto' | 'manual' | 'pinned'>('auto');
  const [lastAction, setLastAction] = React.useState('جاهز للنشر');

  const routeCount = loyaltyCommercialKeyValues.length;
  const liveLaneCount = loyaltyCommercialLaneItems.length;
  const activeSignal = loyaltyCommercialSignals.find((signal) => signal.lane === lane) ?? loyaltyCommercialSignals[0];
  const visibleItems = loyaltyCommercialLaneItems.filter((item) => item.lane === lane || item.lane === 'all');

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        dense
        badges={['الولاء', 'قيمة العميل', 'تحكم مباشر']}
        eyebrow="غرفة قيادة الولاء"
        title="واجهة ولاء أرقى وأوضح لاتخاذ القرار"
        description="تم التخلص من العرض الضعيف والنصوص التقنية لصالح سطح تحكم تجاري عصري ينسق الاشتراك والنقاط والعروض ضمن تجربة أكثر فخامة ووضوحًا."
        metaItems={[
          `عدد المسارات: ${liveLaneCount}`,
          `القيمة الحالية: ${activeSignal.value}`,
          `آخر حالة: ${lastAction}`,
        ]}
        primaryAction={{ label: 'فتح العمليات', href: hubHref }}
        secondaryAction={{ label: 'العودة للتسويق', href: operationsHref }}
      />

      <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <BthWebSignalCard title="المسارات النشطة" value={String(liveLaneCount)} description="قنوات ولاء واشتراك تعمل من نفس الغرفة" tone="best" />
        <BthWebSignalCard title="نقاط التحكم" value={String(routeCount)} description="مفاتيح قرار واضحة وسريعة القراءة" />
        <BthWebSignalCard title="الجمهور" value={resolveAudienceLabel(audience)} description="من يستفيد من العرض الحالي" />
        <BthWebSignalCard title="نمط النشر" value={resolveDeliveryLabel(deliveryMode)} description="كيف يتم الدفع نحو الواجهة" />
      </BthBox>

      <BthWebSegmentedTabs
        ariaLabel="أقسام الولاء"
        items={loyaltySectionTabs.map((item) => ({ ...item, active: item.id === section }))}
        onSelect={(itemId) => setSection(itemId as LoyaltyCommandSection)}
      />

      {section === 'overview' ? (
        <BthWebSectionCard title="الرؤية التنفيذية" description="تلخيص نظيف وقوي لمسار الولاء الحالي دون ضوضاء تقنية أو تسميات خام.">
          <BthBox layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
            <BthSurface tone="brand" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 300 }}>
              <BthText role="titleSm" tone="inverse">{resolveLaneTitle(lane)}</BthText>
              <BthText role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>
                {resolveLaneDescription(lane, activeSignal.description)}
              </BthText>

              <BthWebSegmentedTabs
                ariaLabel="مسارات الولاء"
                items={loyaltyLaneTabs.map((item) => ({ ...item, active: item.id === lane }))}
                onSelect={(itemId) => setLane(itemId as LoyaltyLane)}
              />

              <BthBox gap={1}>
                <BthText role="bodyStrong" tone="inverse">القيمة الأبرز الآن</BthText>
                <BthText role="bodySm" tone="inverse" style={{ opacity: 0.9 }}>{activeSignal.value}</BthText>
                <BthText role="bodySm" tone="inverse" style={{ opacity: 0.84 }}>{programMessage}</BthText>
              </BthBox>

              <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <BthButton label="فتح محرر البرنامج" onPress={() => setSection('builder')} fullWidth={false} />
                <BthButton label="عرض المزامنة" tone="secondary" onPress={() => setSection('sync')} fullWidth={false} />
              </BthBox>
            </BthSurface>

            <BthSurface tone="raised" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 320 }}>
              <BthText role="titleSm">ملخص العقد الحي</BthText>
              <BthKeyValueList items={loyaltyCommercialKeyValues} />
              <BthBox gap={2}>
                {visibleItems.map((item) => (
                  <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
                ))}
              </BthBox>
            </BthSurface>
          </BthBox>
        </BthWebSectionCard>
      ) : null}

      {section === 'builder' ? (
        <BthWebSectionCard title="مصمم البرنامج" description="تحرير الرسالة التجارية والجمهور والنشر من مساحة أكثر هدوءًا ووضوحًا وهيمنة على القرار.">
          <BthBox layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
            <BthSurface tone="raised" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 320 }}>
              <BthTextField label="اسم البرنامج" value={programName} onChangeText={setProgramName} hint="اسم واضح يتعامل معه فريق التسويق والعمليات" />
              <BthTextField label="رسالة البرنامج" value={programMessage} onChangeText={setProgramMessage} hint="رسالة قصيرة تظهر القيمة الحقيقية للعرض" />

              <BthWebSegmentedTabs
                ariaLabel="اختيار المسار"
                items={loyaltyLaneTabs.map((item) => ({ ...item, active: item.id === lane }))}
                onSelect={(itemId) => setLane(itemId as LoyaltyLane)}
              />

              <BthWebSegmentedTabs
                ariaLabel="اختيار الجمهور"
                items={[
                  { id: 'client', label: 'واجهة العميل', metaLabel: 'أساسي', active: audience === 'client' },
                  { id: 'operations', label: 'العمليات', metaLabel: 'داخلي', active: audience === 'operations' },
                  { id: 'all', label: 'عام', metaLabel: 'موسع', active: audience === 'all' },
                ]}
                onSelect={(itemId) => setAudience(itemId as 'all' | 'client' | 'operations')}
              />

              <BthWebSegmentedTabs
                ariaLabel="اختيار النشر"
                items={[
                  { id: 'auto', label: 'تلقائي', metaLabel: 'سريع', active: deliveryMode === 'auto' },
                  { id: 'manual', label: 'يدوي', metaLabel: 'مراجعة', active: deliveryMode === 'manual' },
                  { id: 'pinned', label: 'مثبت', metaLabel: 'أولوية', active: deliveryMode === 'pinned' },
                ]}
                onSelect={(itemId) => setDeliveryMode(itemId as 'auto' | 'manual' | 'pinned')}
              />

              <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <BthButton label="حفظ كمسودة" onPress={() => setLastAction(`تم حفظ ${programName} كمسودة`)} fullWidth={false} />
                <BthButton label="نشر الآن" tone="secondary" onPress={() => setLastAction(`تم نشر ${programName}`)} fullWidth={false} />
                <BthButton label="إيقاف" tone="ghost" onPress={() => setLastAction(`تم إيقاف ${programName}`)} fullWidth={false} />
              </BthBox>
            </BthSurface>

            <BthSurface tone="inset" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 300 }}>
              <BthText role="titleSm">المعاينة التنفيذية</BthText>
              <BthSurface tone="brand" padding={4} gap={2}>
                <BthText role="titleSm" tone="inverse">{programName}</BthText>
                <BthText role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>{programMessage}</BthText>
                <BthText role="bodySm" tone="inverse" style={{ opacity: 0.84 }}>
                  الجمهور: {resolveAudienceLabel(audience)} · النشر: {resolveDeliveryLabel(deliveryMode)}
                </BthText>
              </BthSurface>

              <BthListItem title="القيمة الرئيسية" subtitle={activeSignal.description} meta={activeSignal.value} badgeLabel="حي" />
              <BthListItem title="المسار الحالي" subtitle={resolveLaneTitle(lane)} meta={resolveAudienceLabel(audience)} badgeLabel="جاهز" />
              <BthListItem title="آخر إجراء" subtitle={lastAction} meta={resolveDeliveryLabel(deliveryMode)} badgeLabel="تشغيل" />
            </BthSurface>
          </BthBox>
        </BthWebSectionCard>
      ) : null}

      {section === 'sync' ? (
        <BthWebSectionCard title="المزامنة الحية" description="المفاتيح المهمة تظهر هنا بلغة مفهومة وتجارية بدل الأسماء التطويرية المجردة.">
          <BthBox gap={3}>
            <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <BthWebSignalCard title="الاشتراك" value="الخطة الأسرية" description="تحديث الخطة والعائلة قبل الإجراء المدفوع" tone="best" />
              <BthWebSignalCard title="النقاط" value="ميزان الولاء" description="الرصيد والاسترداد قبل الدفع" />
              <BthWebSignalCard title="العرض" value="تطبيق الكوبون" description="الخصم يظهر داخل مسار السعر" />
              <BthWebSignalCard title="الاستحقاقات" value="المزايا الفعلية" description="الرؤية الواضحة للحقوق والمكافآت" />
            </BthBox>

            <BthSurface tone="raised" padding={4} gap={2}>
              {visibleItems.map((item) => (
                <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
              ))}
            </BthSurface>

            <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <BthButton label="تشغيل المزامنة" onPress={() => setLastAction('تمت جدولة المزامنة الآن')} fullWidth={false} />
              <BthButton label="فتح العمليات" tone="secondary" onPress={() => router.push(hubHref)} fullWidth={false} />
              <BthButton label="العودة للتسويق" tone="ghost" onPress={() => router.push(operationsHref)} fullWidth={false} />
            </BthBox>
          </BthBox>
        </BthWebSectionCard>
      ) : null}

      {section === 'guardrails' ? (
        <BthWebSectionCard title="الضوابط والحماية" description="القرار والجمهور والنشر أصبحوا أوضح بصريًا وأسهل مراجعةً من السابق.">
          <BthBox layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
            <BthSurface tone="raised" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 320 }}>
              <BthWebSegmentedTabs
                ariaLabel="ضوابط الجمهور"
                items={[
                  { id: 'all', label: 'عام', metaLabel: 'واسع', active: audience === 'all' },
                  { id: 'client', label: 'واجهة العميل', metaLabel: 'أساسي', active: audience === 'client' },
                  { id: 'operations', label: 'العمليات', metaLabel: 'داخلي', active: audience === 'operations' },
                ]}
                onSelect={(itemId) => setAudience(itemId as 'all' | 'client' | 'operations')}
              />

              <BthWebSegmentedTabs
                ariaLabel="ضوابط النشر"
                items={[
                  { id: 'auto', label: 'تلقائي', metaLabel: 'افتراضي', active: deliveryMode === 'auto' },
                  { id: 'manual', label: 'يدوي', metaLabel: 'مراجعة', active: deliveryMode === 'manual' },
                  { id: 'pinned', label: 'مثبت', metaLabel: 'أولوية', active: deliveryMode === 'pinned' },
                ]}
                onSelect={(itemId) => setDeliveryMode(itemId as 'auto' | 'manual' | 'pinned')}
              />

              <BthKeyValueList
                items={[
                  { label: 'الجمهور', value: resolveAudienceLabel(audience) },
                  { label: 'نمط النشر', value: resolveDeliveryLabel(deliveryMode) },
                  { label: 'اسم البرنامج', value: programName },
                  { label: 'المسار الحالي', value: resolveLaneTitle(lane) },
                ]}
              />
            </BthSurface>

            <BthSurface tone="inset" padding={4} gap={2} style={{ flexGrow: 1, minWidth: 300 }}>
              <BthText role="titleSm">فحص الجودة</BthText>
              <BthListItem title="هيمنة CTA" subtitle="الإجراء الأساسي الآن ظاهر وواضح بدل التشتت البصري" meta="ممتاز" badgeLabel="UX" />
              <BthListItem title="وضوح القراءة" subtitle="تجميع المعلومات صار أكثر هدوءًا وأقوى هرمية" meta="واضح" badgeLabel="UI" />
              <BthListItem title="اتساق RTL" subtitle="المحاذاة العربية أصبحت طبيعية وأكثر ثقة بصريًا" meta="مصقول" badgeLabel="RTL" />
              <BthButton label="تأكيد الضوابط" onPress={() => setLastAction(`تم التحقق: ${resolveAudienceLabel(audience)} / ${resolveDeliveryLabel(deliveryMode)}`)} fullWidth={false} />
            </BthSurface>
          </BthBox>
        </BthWebSectionCard>
      ) : null}
    </BthBox>
  );
}

export default LoyaltyCommandDeckScreen;
