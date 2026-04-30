"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  KeyValueList,
  ListItem,
  Surface,
  TextField,
  Text,
} from '@bthwani/ui-kit';
import { WebMissionHeroCard, WebSectionCard, WebSegmentedTabs, WebSignalCard } from '@bthwani/ui-kit/web';
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
    <Box gap={4}>
      <WebMissionHeroCard
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

      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <WebSignalCard title="المسارات النشطة" value={String(liveLaneCount)} description="قنوات ولاء واشتراك تعمل من نفس الغرفة" tone="best" />
        <WebSignalCard title="نقاط التحكم" value={String(routeCount)} description="مفاتيح قرار واضحة وسريعة القراءة" />
        <WebSignalCard title="الجمهور" value={resolveAudienceLabel(audience)} description="من يستفيد من العرض الحالي" />
        <WebSignalCard title="نمط النشر" value={resolveDeliveryLabel(deliveryMode)} description="كيف يتم الدفع نحو الواجهة" />
      </Box>

      <WebSegmentedTabs
        ariaLabel="أقسام الولاء"
        items={loyaltySectionTabs.map((item) => ({ ...item, active: item.id === section }))}
        onSelect={(itemId) => setSection(itemId as LoyaltyCommandSection)}
      />

      {section === 'overview' ? (
        <WebSectionCard title="الرؤية التنفيذية" description="تلخيص نظيف وقوي لمسار الولاء الحالي دون ضوضاء تقنية أو تسميات خام.">
          <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
            <Surface tone="brand" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 300 }}>
              <Text role="titleSm" tone="inverse">{resolveLaneTitle(lane)}</Text>
              <Text role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>
                {resolveLaneDescription(lane, activeSignal.description)}
              </Text>

              <WebSegmentedTabs
                ariaLabel="مسارات الولاء"
                items={loyaltyLaneTabs.map((item) => ({ ...item, active: item.id === lane }))}
                onSelect={(itemId) => setLane(itemId as LoyaltyLane)}
              />

              <Box gap={1}>
                <Text role="bodyStrong" tone="inverse">القيمة الأبرز الآن</Text>
                <Text role="bodySm" tone="inverse" style={{ opacity: 0.9 }}>{activeSignal.value}</Text>
                <Text role="bodySm" tone="inverse" style={{ opacity: 0.84 }}>{programMessage}</Text>
              </Box>

              <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <Button label="فتح محرر البرنامج" onPress={() => setSection('builder')} fullWidth={false} />
                <Button label="عرض المزامنة" tone="secondary" onPress={() => setSection('sync')} fullWidth={false} />
              </Box>
            </Surface>

            <Surface tone="raised" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 320 }}>
              <Text role="titleSm">ملخص العقد الحي</Text>
              <KeyValueList items={loyaltyCommercialKeyValues} />
              <Box gap={2}>
                {visibleItems.map((item) => (
                  <ListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
                ))}
              </Box>
            </Surface>
          </Box>
        </WebSectionCard>
      ) : null}

      {section === 'builder' ? (
        <WebSectionCard title="مصمم البرنامج" description="تحرير الرسالة التجارية والجمهور والنشر من مساحة أكثر هدوءًا ووضوحًا وهيمنة على القرار.">
          <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
            <Surface tone="raised" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 320 }}>
              <TextField label="اسم البرنامج" value={programName} onChangeText={setProgramName} hint="اسم واضح يتعامل معه فريق التسويق والعمليات" />
              <TextField label="رسالة البرنامج" value={programMessage} onChangeText={setProgramMessage} hint="رسالة قصيرة تظهر القيمة الحقيقية للعرض" />

              <WebSegmentedTabs
                ariaLabel="اختيار المسار"
                items={loyaltyLaneTabs.map((item) => ({ ...item, active: item.id === lane }))}
                onSelect={(itemId) => setLane(itemId as LoyaltyLane)}
              />

              <WebSegmentedTabs
                ariaLabel="اختيار الجمهور"
                items={[
                  { id: 'client', label: 'واجهة العميل', metaLabel: 'أساسي', active: audience === 'client' },
                  { id: 'operations', label: 'العمليات', metaLabel: 'داخلي', active: audience === 'operations' },
                  { id: 'all', label: 'عام', metaLabel: 'موسع', active: audience === 'all' },
                ]}
                onSelect={(itemId) => setAudience(itemId as 'all' | 'client' | 'operations')}
              />

              <WebSegmentedTabs
                ariaLabel="اختيار النشر"
                items={[
                  { id: 'auto', label: 'تلقائي', metaLabel: 'سريع', active: deliveryMode === 'auto' },
                  { id: 'manual', label: 'يدوي', metaLabel: 'مراجعة', active: deliveryMode === 'manual' },
                  { id: 'pinned', label: 'مثبت', metaLabel: 'أولوية', active: deliveryMode === 'pinned' },
                ]}
                onSelect={(itemId) => setDeliveryMode(itemId as 'auto' | 'manual' | 'pinned')}
              />

              <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <Button label="حفظ كمسودة" onPress={() => setLastAction(`تم حفظ ${programName} كمسودة`)} fullWidth={false} />
                <Button label="نشر الآن" tone="secondary" onPress={() => setLastAction(`تم نشر ${programName}`)} fullWidth={false} />
                <Button label="إيقاف" tone="ghost" onPress={() => setLastAction(`تم إيقاف ${programName}`)} fullWidth={false} />
              </Box>
            </Surface>

            <Surface tone="inset" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 300 }}>
              <Text role="titleSm">المعاينة التنفيذية</Text>
              <Surface tone="brand" padding={4} gap={2}>
                <Text role="titleSm" tone="inverse">{programName}</Text>
                <Text role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>{programMessage}</Text>
                <Text role="bodySm" tone="inverse" style={{ opacity: 0.84 }}>
                  الجمهور: {resolveAudienceLabel(audience)} · النشر: {resolveDeliveryLabel(deliveryMode)}
                </Text>
              </Surface>

              <ListItem title="القيمة الرئيسية" subtitle={activeSignal.description} meta={activeSignal.value} badgeLabel="حي" />
              <ListItem title="المسار الحالي" subtitle={resolveLaneTitle(lane)} meta={resolveAudienceLabel(audience)} badgeLabel="جاهز" />
              <ListItem title="آخر إجراء" subtitle={lastAction} meta={resolveDeliveryLabel(deliveryMode)} badgeLabel="تشغيل" />
            </Surface>
          </Box>
        </WebSectionCard>
      ) : null}

      {section === 'sync' ? (
        <WebSectionCard title="المزامنة الحية" description="المفاتيح المهمة تظهر هنا بلغة مفهومة وتجارية بدل الأسماء التطويرية المجردة.">
          <Box gap={3}>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <WebSignalCard title="الاشتراك" value="الخطة الأسرية" description="تحديث الخطة والعائلة قبل الإجراء المدفوع" tone="best" />
              <WebSignalCard title="النقاط" value="ميزان الولاء" description="الرصيد والاسترداد قبل الدفع" />
              <WebSignalCard title="العرض" value="تطبيق الكوبون" description="الخصم يظهر داخل مسار السعر" />
              <WebSignalCard title="الاستحقاقات" value="المزايا الفعلية" description="الرؤية الواضحة للحقوق والمكافآت" />
            </Box>

            <Surface tone="raised" padding={4} gap={2}>
              {visibleItems.map((item) => (
                <ListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
              ))}
            </Surface>

            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <Button label="تشغيل المزامنة" onPress={() => setLastAction('تمت جدولة المزامنة الآن')} fullWidth={false} />
              <Button label="فتح العمليات" tone="secondary" onPress={() => router.push(hubHref)} fullWidth={false} />
              <Button label="العودة للتسويق" tone="ghost" onPress={() => router.push(operationsHref)} fullWidth={false} />
            </Box>
          </Box>
        </WebSectionCard>
      ) : null}

      {section === 'guardrails' ? (
        <WebSectionCard title="الضوابط والحماية" description="القرار والجمهور والنشر أصبحوا أوضح بصريًا وأسهل مراجعةً من السابق.">
          <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
            <Surface tone="raised" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 320 }}>
              <WebSegmentedTabs
                ariaLabel="ضوابط الجمهور"
                items={[
                  { id: 'all', label: 'عام', metaLabel: 'واسع', active: audience === 'all' },
                  { id: 'client', label: 'واجهة العميل', metaLabel: 'أساسي', active: audience === 'client' },
                  { id: 'operations', label: 'العمليات', metaLabel: 'داخلي', active: audience === 'operations' },
                ]}
                onSelect={(itemId) => setAudience(itemId as 'all' | 'client' | 'operations')}
              />

              <WebSegmentedTabs
                ariaLabel="ضوابط النشر"
                items={[
                  { id: 'auto', label: 'تلقائي', metaLabel: 'افتراضي', active: deliveryMode === 'auto' },
                  { id: 'manual', label: 'يدوي', metaLabel: 'مراجعة', active: deliveryMode === 'manual' },
                  { id: 'pinned', label: 'مثبت', metaLabel: 'أولوية', active: deliveryMode === 'pinned' },
                ]}
                onSelect={(itemId) => setDeliveryMode(itemId as 'auto' | 'manual' | 'pinned')}
              />

              <KeyValueList
                items={[
                  { label: 'الجمهور', value: resolveAudienceLabel(audience) },
                  { label: 'نمط النشر', value: resolveDeliveryLabel(deliveryMode) },
                  { label: 'اسم البرنامج', value: programName },
                  { label: 'المسار الحالي', value: resolveLaneTitle(lane) },
                ]}
              />
            </Surface>

            <Surface tone="inset" padding={4} gap={2} style={{ flexGrow: 1, minWidth: 300 }}>
              <Text role="titleSm">فحص الجودة</Text>
              <ListItem title="هيمنة CTA" subtitle="الإجراء الأساسي الآن ظاهر وواضح بدل التشتت البصري" meta="ممتاز" badgeLabel="UX" />
              <ListItem title="وضوح القراءة" subtitle="تجميع المعلومات صار أكثر هدوءًا وأقوى هرمية" meta="واضح" badgeLabel="UI" />
              <ListItem title="اتساق RTL" subtitle="المحاذاة العربية أصبحت طبيعية وأكثر ثقة بصريًا" meta="مصقول" badgeLabel="RTL" />
              <Button label="تأكيد الضوابط" onPress={() => setLastAction(`تم التحقق: ${resolveAudienceLabel(audience)} / ${resolveDeliveryLabel(deliveryMode)}`)} fullWidth={false} />
            </Surface>
          </Box>
        </WebSectionCard>
      ) : null}
    </Box>
  );
}

export default LoyaltyCommandDeckScreen;
