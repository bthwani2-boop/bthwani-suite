import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Chip, KeyValueList, ListItem, MobileStickyPrimaryAction, StateView, Surface, Text, useDirection } from '@bthwani/ui-kit';

import { dshPromotionCandidates, type DshPromotionCandidate } from '../../shared/workflow';

type PromotionEligibilityState = 'ready' | 'empty' | 'pending' | 'blocked' | 'loading';

export type DshPartnerPromotionEligibilityScreenProps = {
  marketingHref?: string;
  catalogHref?: string;
  state?: PromotionEligibilityState;
};

function resolveApprovalTone(state: DshPromotionCandidate['status']) {
  if (state === 'marketing-ready') return 'success';
  if (state === 'partner-review' || state === 'draft') return 'warning';
  return 'danger';
}

function resolveEligibilityTone(state: DshPromotionCandidate['eligibility']) {
  if (state === 'eligible') return 'success';
  if (state === 'review') return 'warning';
  return 'danger';
}

function resolveStatusLabel(state: DshPromotionCandidate['status']) {
  if (state === 'draft') return 'وارد من الشريك';
  if (state === 'partner-review') return 'تحت مراجعة الشركاء';
  if (state === 'marketing-ready') return 'جاهز للتسويق';
  return 'مرفوض';
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
  const [selectedId, setSelectedId] = React.useState(dshPromotionCandidates[0]?.id ?? '');
  const [actionMessage, setActionMessage] = React.useState('المراجعة الحالية تحدد جاهزية العنصر ليُنشر في قسم التسويق.');

  const selectedItem = dshPromotionCandidates.find((item) => item.id === selectedId) ?? dshPromotionCandidates[0];

  React.useEffect(() => {
    if (!dshPromotionCandidates.some((item) => item.id === selectedId)) {
      setSelectedId(dshPromotionCandidates[0]?.id ?? '');
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
          <Chip label={resolveStatusLabel(selectedItem?.status ?? 'draft')} tone={resolveApprovalTone(selectedItem?.status ?? 'draft')} selected />
          <Chip label={selectedItem?.kind === 'product' ? 'منتج' : 'متجر'} tone="brand" />
          <Chip label={selectedItem?.eligibility === 'eligible' ? 'مؤهل للظهور' : selectedItem?.eligibility === 'review' ? 'يتطلب تعديل' : 'محجوب'} tone={resolveEligibilityTone(selectedItem?.eligibility ?? 'review')} />
          <Chip label={selectedItem?.availability} tone="info" />
        </Box>
      </Surface>

      <Surface tone="default" padding={3} gap={3}>
        <Box gap={1}>
          <Text role="bodyStrong">نوايا الترويج من الشركاء (Intent Queue)</Text>
          <Text role="bodySm" tone="muted">
            راجع العناصر المؤهلة، وإذا كانت مستوفية للشروط أرسلها إلى التسويق.
          </Text>
        </Box>

        <Box gap={2}>
          {dshPromotionCandidates.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={`${item.subtitle}`}
              meta={resolveStatusLabel(item.status)}
              badgeLabel={item.eligibility === 'eligible' ? 'مؤهل' : item.eligibility === 'review' ? 'يُراجع' : 'ممنوع'}
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
            { label: 'العنصر', value: selectedItem?.title ?? 'غير محدد', tone: 'brand' },
            { label: 'النوع', value: selectedItem?.kind === 'product' ? 'منتج' : 'متجر', tone: 'default' },
            { label: 'حالة الاعتماد', value: resolveStatusLabel(selectedItem?.status ?? 'draft'), tone: resolveApprovalTone(selectedItem?.status ?? 'draft') },
            { label: 'الجاهزية', value: selectedItem?.eligibility === 'eligible' ? 'مؤهل للتسويق' : selectedItem?.eligibility === 'review' ? 'تحت المراجعة' : 'مرفوض', tone: resolveEligibilityTone(selectedItem?.eligibility ?? 'review') },
            { label: 'ملاحظة', value: selectedItem?.offerHint ?? '', tone: 'default' },
          ]}
        />
      </Surface>

      <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap' }} gap={2}>
        <Button
          label={selectedItem?.status === 'marketing-ready' ? 'مُرسل للتسويق' : 'إرسال إلى التسويق'}
          tone="primary"
          fullWidth={false}
          disabled={selectedItem?.status === 'marketing-ready' || selectedItem?.eligibility !== 'eligible'}
          onPress={() => setActionMessage(`تم تسليم نية الترويج إلى قسم التسويق لجدولتها كبنر.`)}
        />
        <Button label="رفض النية" tone="ghost" fullWidth={false} onPress={() => setActionMessage(`تم رفض نية الترويج وإعادتها للشريك.`)} style={{ color: '#991b1b' }} />
      </Box>

      <MobileStickyPrimaryAction
        label={selectedItem?.status === 'marketing-ready' ? 'مُرسل للتسويق' : 'إرسال إلى التسويق'}
        disabled={selectedItem?.status === 'marketing-ready' || selectedItem?.eligibility !== 'eligible'}
        helperText={actionMessage}
        onPress={() => setActionMessage(`تم تسليم النية إلى قسم التسويق.`)}
      />
    </Box>
  );
}

export default DshPartnerPromotionEligibilityScreen;
