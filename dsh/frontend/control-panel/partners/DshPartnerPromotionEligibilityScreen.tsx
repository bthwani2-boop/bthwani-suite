import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Chip, KeyValueList, ListItem, MobileStickyPrimaryAction, StateView, Surface, Text, useDirection } from '@bthwani/ui-kit';

type PromotionEligibilityState = 'ready' | 'empty' | 'pending' | 'blocked' | 'loading';

type PartnerPromotionCandidate = {
  id: string;
  storeName: string;
  categoryLabel: string;
  approvalState: 'approved' | 'pending' | 'rejected';
  operationalState: 'active' | 'paused' | 'busy' | 'open' | 'closed';
  categoryReadiness: 'ready' | 'partial' | 'blocked';
  featuredEligibility: 'eligible' | 'review' | 'blocked';
  notes: string;
};

export type DshPartnerPromotionEligibilityScreenProps = {
  marketingHref?: string;
  catalogHref?: string;
  state?: PromotionEligibilityState;
};

const partnerPromotionCandidates: readonly PartnerPromotionCandidate[] = [
  {
    id: 'store-yasmin',
    storeName: 'متجر الياسمين',
    categoryLabel: 'منتجات جاهزة للعرض',
    approvalState: 'approved',
    operationalState: 'active',
    categoryReadiness: 'ready',
    featuredEligibility: 'eligible',
    notes: 'جاهز للترويج الآن ويمكن تسليمه للتسويق دون مراجعة إضافية.',
  },
  {
    id: 'store-saha',
    storeName: 'محمصة الساحة',
    categoryLabel: 'مقاهٍ ومحمصات',
    approvalState: 'pending',
    operationalState: 'busy',
    categoryReadiness: 'partial',
    featuredEligibility: 'review',
    notes: 'يحتاج استكمال إشارات الجاهزية قبل الظهور ضمن البانر التالي.',
  },
  {
    id: 'store-wadi',
    storeName: 'مقهى الوادي',
    categoryLabel: 'مقاهٍ',
    approvalState: 'rejected',
    operationalState: 'paused',
    categoryReadiness: 'blocked',
    featuredEligibility: 'blocked',
    notes: 'محجوب حاليًا حتى تُستكمل الملاحظات التشغيلية والوثائق.',
  },
] as const;

function resolveApprovalTone(state: PartnerPromotionCandidate['approvalState']) {
  if (state === 'approved') return 'success';
  if (state === 'pending') return 'warning';
  return 'danger';
}

function resolveOperationalTone(state: PartnerPromotionCandidate['operationalState']) {
  if (state === 'active' || state === 'open') return 'success';
  if (state === 'busy') return 'info';
  if (state === 'paused') return 'warning';
  return 'danger';
}

function resolveReadinessTone(state: PartnerPromotionCandidate['categoryReadiness']) {
  if (state === 'ready') return 'success';
  if (state === 'partial') return 'warning';
  return 'danger';
}

function resolveFeaturedTone(state: PartnerPromotionCandidate['featuredEligibility']) {
  if (state === 'eligible') return 'success';
  if (state === 'review') return 'warning';
  return 'danger';
}

export function DshPartnerPromotionEligibilityScreen({
  marketingHref = '/marketing',
  catalogHref = '/catalogs',
  state = 'ready',
}: DshPartnerPromotionEligibilityScreenProps) {
  const router = useRouter();
  const { direction } = useDirection();
  const [selectedId, setSelectedId] = React.useState(partnerPromotionCandidates[0]?.id ?? '');
  const [actionMessage, setActionMessage] = React.useState('الأهلية هنا محلية وتُستخدم فقط لتوجيه الشريك إلى المسار المناسب.');

  const selectedItem = partnerPromotionCandidates.find((item) => item.id === selectedId) ?? partnerPromotionCandidates[0];

  React.useEffect(() => {
    if (!partnerPromotionCandidates.some((item) => item.id === selectedId)) {
      setSelectedId(partnerPromotionCandidates[0]?.id ?? '');
    }
  }, [selectedId]);

  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ فحص الأهلية" description="نراجع أهلية الشريك والمتجر قبل تمرير أي عرض إلى التسويق." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد عناصر مؤهلة الآن" description="أضف متجرًا أو منتجًا جاهزًا ثم أعد فتح مسار الأهلية." actionLabel="فتح التسويق" onActionPress={() => router.push(marketingHref)} />;
  }

  if (state === 'pending') {
    return <StateView stateId="loading" title="الأهلية قيد المراجعة" description="هذه مجرد معاينة محلية لحالة pending قبل اعتماد الظهور." />;
  }

  if (state === 'blocked') {
    return <StateView stateId="blockingError" title="الأهلية محجوبة" description="أكمل الجاهزية التشغيلية والوثائق قبل طلب الظهور." actionLabel="فتح الكتالوج" onActionPress={() => router.push(catalogHref)} />;
  }

  return (
    <Box gap={3}>
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          جاهزية الشريك للظهور
        </Text>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap' }} gap={2}>
          <Chip label={selectedItem?.approvalState === 'approved' ? 'معتمد' : selectedItem?.approvalState === 'pending' ? 'قيد المراجعة' : 'مرفوض'} tone={resolveApprovalTone(selectedItem?.approvalState ?? 'pending')} selected />
          <Chip label={selectedItem?.operationalState === 'active' ? 'نشط' : selectedItem?.operationalState === 'busy' ? 'مشغول' : selectedItem?.operationalState === 'paused' ? 'موقوف' : selectedItem?.operationalState === 'open' ? 'مفتوح' : 'مغلق'} tone={resolveOperationalTone(selectedItem?.operationalState ?? 'paused')} />
          <Chip label={selectedItem?.categoryReadiness === 'ready' ? 'جاهز للفئة' : selectedItem?.categoryReadiness === 'partial' ? 'جاهزية جزئية' : 'محجوب'} tone={resolveReadinessTone(selectedItem?.categoryReadiness ?? 'partial')} />
          <Chip label={selectedItem?.featuredEligibility === 'eligible' ? 'قابل للترويج' : selectedItem?.featuredEligibility === 'review' ? 'تحت مراجعة التسويق' : 'غير مؤهل'} tone={resolveFeaturedTone(selectedItem?.featuredEligibility ?? 'review')} />
        </Box>
      </Surface>

      <Surface tone="default" padding={3} gap={3}>
        <Box gap={1}>
          <Text role="bodyStrong">مرشحو الظهور</Text>
          <Text role="bodySm" tone="muted">
            اختر متجرًا أو منتجًا جاهزًا ليمر إلى التسويق بعد تحقق الأهلية فقط.
          </Text>
        </Box>

        <Box gap={2}>
          {partnerPromotionCandidates.map((item) => (
            <ListItem
              key={item.id}
              title={item.storeName}
              subtitle={`${item.categoryLabel} · ${item.notes}`}
              meta={item.approvalState === 'approved' ? 'جاهز' : item.approvalState === 'pending' ? 'ينتظر' : 'محجوب'}
              badgeLabel={item.featuredEligibility === 'eligible' ? 'Promo' : item.featuredEligibility === 'review' ? 'Review' : 'Blocked'}
              onPress={() => setSelectedId(item.id)}
            />
          ))}
        </Box>
      </Surface>

      <Surface tone="inset" padding={3} gap={2}>
        <Text role="bodyStrong">تفاصيل الأهلية</Text>
        <KeyValueList
          dense
          items={[
            { label: 'الشريك/المتجر', value: selectedItem?.storeName ?? 'غير محدد', tone: 'brand' },
            { label: 'حالة الاعتماد', value: selectedItem?.approvalState === 'approved' ? 'معتمد' : selectedItem?.approvalState === 'pending' ? 'قيد المراجعة' : 'مرفوض', tone: resolveApprovalTone(selectedItem?.approvalState ?? 'pending') },
            { label: 'الجاهزية التشغيلية', value: selectedItem?.operationalState === 'active' ? 'نشط' : selectedItem?.operationalState === 'busy' ? 'مشغول' : selectedItem?.operationalState === 'paused' ? 'موقوف' : selectedItem?.operationalState === 'open' ? 'مفتوح' : 'مغلق', tone: resolveOperationalTone(selectedItem?.operationalState ?? 'paused') },
            { label: 'جاهزية الفئة', value: selectedItem?.categoryReadiness === 'ready' ? 'جاهز' : selectedItem?.categoryReadiness === 'partial' ? 'جزئي' : 'محجوب', tone: resolveReadinessTone(selectedItem?.categoryReadiness ?? 'partial') },
            { label: 'أهلية الترويج', value: selectedItem?.featuredEligibility === 'eligible' ? 'مؤهل' : selectedItem?.featuredEligibility === 'review' ? 'تحت المراجعة' : 'محجوب', tone: resolveFeaturedTone(selectedItem?.featuredEligibility ?? 'review') },
          ]}
        />
        <Text role="bodySm" tone="muted">
          {selectedItem?.notes}
        </Text>
      </Surface>

      <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap' }} gap={2}>
        <Button label="طلب مراجعة الأهلية" tone="primary" fullWidth={false} onPress={() => setActionMessage(`تم طلب مراجعة الأهلية: ${selectedItem?.storeName ?? 'غير محدد'}`)} />
        <Button label="فتح التسويق" tone="secondary" fullWidth={false} onPress={() => router.push(marketingHref)} />
        <Button label="فتح الكتالوج" tone="ghost" fullWidth={false} onPress={() => router.push(catalogHref)} />
      </Box>

      <MobileStickyPrimaryAction
        label="طلب إبراز المتجر"
        helperText={actionMessage}
        onPress={() => setActionMessage(`تم إرسال نية الترويج: ${selectedItem?.storeName ?? 'غير محدد'}`)}
      />
    </Box>
  );
}

export default DshPartnerPromotionEligibilityScreen;