import React from 'react';
import {
  Box,
  Button,
  Chip,
  ListItem,
  MobileStickyPrimaryAction,
  StateView,
  Surface,
  Text,
  TextField,
  SelectField,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';
import {
  getPartnerOfferItems,
  upsertPartnerOfferItem,
  type PartnerOfferRecord,
  type PartnerOfferStatus,
  type PartnerOfferType,
} from '../../shared/partner-offer.preview-store';

type AnalyticsWorkspaceState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'no-analytics' | 'no-campaigns';

export type PromotionsScreenProps = {
  storeName: string;
  branchLabel: string;
  activeZoneLabel: string;
  todayHoursLabel: string;
  state?: AnalyticsWorkspaceState;
};

type IntakeFormState = {
  open: boolean;
  title: string;
  offerType: PartnerOfferType;
  valueLabel: string;
  eligibility: string;
};

const INITIAL_FORM: IntakeFormState = {
  open: false,
  title: '',
  offerType: 'discount',
  valueLabel: '',
  eligibility: 'الكل',
};

function translateStatus(status: PartnerOfferStatus): { label: string; tone: 'default' | 'warning' | 'brand' | 'success' | 'danger' } {
  switch (status) {
    case 'inbound': return { label: 'في الانتظار', tone: 'default' };
    case 'review': return { label: 'قيد المراجعة', tone: 'warning' };
    case 'marketing-ready': return { label: 'جاهز للنشر', tone: 'brand' };
    case 'published': return { label: 'نشط', tone: 'success' };
    case 'paused': return { label: 'موقوف', tone: 'warning' };
    case 'rejected': return { label: 'مرفوض', tone: 'danger' };
    case 'archived': return { label: 'مؤرشف', tone: 'default' };
    default: return { label: status, tone: 'default' };
  }
}

function translateOfferType(type: PartnerOfferType): string {
  switch (type) {
    case 'discount': return 'خصم مباشر';
    case 'free-delivery': return 'توصيل مجاني';
    case 'bundle': return 'حزمة';
    case 'buy-x-get-y': return 'اشتر واحصل على';
    case 'coupon': return 'كوبون';
    default: return type;
  }
}

function renderState(state: Exclude<AnalyticsWorkspaceState, 'ready'>) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تجهيز العروض" description="يتم الآن تحميل بيانات عروضك." />;
  }
  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد عروض بعد" description="يمكنك تقديم أول عرض مقترح الآن." />;
  }
  if (state === 'offline') {
    return <StateView stateId="offline" title="غير متصل" description="أعد المحاولة عند عودة الاتصال." />;
  }
  return <StateView stateId="recoverableError" title="تعذر فتح العروض" description="حدث خلل مؤقت. أعد المحاولة." />;
}

export function PromotionsScreen({
  storeName,
  branchLabel,
  activeZoneLabel,
  todayHoursLabel,
  state = 'ready',
}: PromotionsScreenProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const [offers, setOffers] = React.useState<PartnerOfferRecord[]>([]);
  const [form, setForm] = React.useState<IntakeFormState>(INITIAL_FORM);
  const [submitMessage, setSubmitMessage] = React.useState('');

  React.useEffect(() => {
    const all = getPartnerOfferItems();
    setOffers(all.filter(o => o.partnerName === storeName || o.storeLabel === storeName || o.source === 'partner'));
  }, [storeName]);

  if (state !== 'ready') {
    return renderState(state);
  }

  const handleSubmitOffer = () => {
    if (!form.title.trim() || !form.valueLabel.trim()) {
      setSubmitMessage('يرجى ملء عنوان العرض وقيمته قبل الإرسال.');
      return;
    }
    upsertPartnerOfferItem({
      title: form.title.trim(),
      partnerName: storeName,
      storeLabel: storeName,
      storeId: '',
      productId: '',
      productLabel: '',
      category: '',
      offerType: form.offerType,
      status: 'inbound',
      source: 'partner',
      valueLabel: form.valueLabel.trim(),
      eligibility: form.eligibility.trim() || 'الكل',
      displayBadge: form.valueLabel.trim(),
    });
    const updated = getPartnerOfferItems();
    setOffers(updated.filter(o => o.partnerName === storeName || o.storeLabel === storeName || o.source === 'partner'));
    setForm(INITIAL_FORM);
    setSubmitMessage('تم إرسال العرض للمراجعة. سيتم إخطارك عند اتخاذ قرار.');
  };

  const activeOffers = offers.filter(o => o.status === 'published');
  const pendingOffers = offers.filter(o => o.status === 'inbound' || o.status === 'review' || o.status === 'marketing-ready');
  const rejectedOffers = offers.filter(o => o.status === 'rejected');

  return (
    <Box gap={4}>
      {/* Partner + Context */}
      <Surface tone="raised" padding={3} gap={2}>
        <Text role="titleSm">{storeName}</Text>
        <Text role="caption" tone="muted">
          {branchLabel} · {activeZoneLabel} · {todayHoursLabel}
        </Text>
      </Surface>

      {/* Active Offers */}
      <Surface tone="raised" padding={3} gap={3}>
        <Box gap={1}>
          <Text role="titleSm">العروض النشطة</Text>
          <Text role="bodySm" tone="muted">
            العروض التي اجتازت المراجعة وهي مرئية حالياً للعملاء.
          </Text>
        </Box>
        {activeOffers.length === 0 ? (
          <Text role="bodySm" tone="muted">لا توجد عروض نشطة حالياً.</Text>
        ) : (
          <Box gap={2}>
            {activeOffers.map(offer => {
              const statusMeta = translateStatus(offer.status);
              return (
                <ListItem
                  key={offer.id}
                  title={offer.title}
                  subtitle={`${translateOfferType(offer.offerType)} · ${offer.valueLabel}`}
                  meta={offer.activeFromDate && offer.activeToDate ? `${offer.activeFromDate} → ${offer.activeToDate}` : undefined}
                  badgeLabel={statusMeta.label}
                  badgeTone={statusMeta.tone}
                />
              );
            })}
          </Box>
        )}
      </Surface>

      {/* Pending / In-Review Offers */}
      {pendingOffers.length > 0 && (
        <Surface tone="raised" padding={3} gap={3}>
          <Box gap={1}>
            <Text role="titleSm">العروض قيد المراجعة</Text>
            <Text role="bodySm" tone="muted">
              هذه العروض وصلت للفريق التسويقي ويتم دراستها. لا يمكنك نشرها مباشرة.
            </Text>
          </Box>
          <Box gap={2}>
            {pendingOffers.map(offer => {
              const statusMeta = translateStatus(offer.status);
              return (
                <ListItem
                  key={offer.id}
                  title={offer.title}
                  subtitle={`${translateOfferType(offer.offerType)} · ${offer.valueLabel}`}
                  badgeLabel={statusMeta.label}
                  badgeTone={statusMeta.tone}
                />
              );
            })}
          </Box>
        </Surface>
      )}

      {/* Rejected Offers with reason */}
      {rejectedOffers.length > 0 && (
        <Surface tone="raised" padding={3} gap={3}>
          <Box gap={1}>
            <Text role="titleSm">العروض المرفوضة</Text>
            <Text role="bodySm" tone="muted">
              يمكنك مراجعة سبب الرفض وتعديل العرض وإعادة تقديمه.
            </Text>
          </Box>
          <Box gap={2}>
            {rejectedOffers.map(offer => (
              <Surface key={offer.id} tone="inset" padding={3} gap={2}>
                <Text role="bodyStrong">{offer.title}</Text>
                <Text role="bodySm" tone="muted">{translateOfferType(offer.offerType)} · {offer.valueLabel}</Text>
                {offer.rejectionReason ? (
                  <Surface tone="raised" padding={2} gap={1} style={{ borderWidth: 1, borderColor: theme.line }}>
                    <Text role="caption" style={{ fontWeight: '800', color: theme.danger }}>سبب الرفض:</Text>
                    <Text role="caption" tone="muted">{offer.rejectionReason}</Text>
                  </Surface>
                ) : (
                  <Text role="caption" tone="muted">لم يُذكر سبب. تواصل مع الفريق التسويقي للاستيضاح.</Text>
                )}
              </Surface>
            ))}
          </Box>
        </Surface>
      )}

      {/* Submit Intake Offer */}
      <Surface tone="raised" padding={3} gap={3}>
        <Box gap={1}>
          <Text role="titleSm">تقديم عرض مقترح</Text>
          <Text role="bodySm" tone="muted">
            يمكنك تقديم عرض مقترح للفريق التسويقي. العرض سيمر بمرحلة المراجعة قبل النشر.
          </Text>
        </Box>

        {!form.open ? (
          <Button
            label="تقديم عرض مقترح جديد"
            tone="secondary"
            fullWidth={false}
            onPress={() => setForm({ ...INITIAL_FORM, open: true })}
          />
        ) : (
          <Box gap={3}>
            <TextField
              label="عنوان العرض"
              value={form.title}
              onChangeText={v => setForm(f => ({ ...f, title: v }))}
              placeholder="مثال: خصم 20% على القهوة"
            />
            <SelectField
              label="نوع العرض"
              value={form.offerType}
              onValueChange={v => setForm(f => ({ ...f, offerType: v as PartnerOfferType }))}
              options={[
                { value: 'discount', label: 'خصم مباشر' },
                { value: 'free-delivery', label: 'توصيل مجاني' },
                { value: 'bundle', label: 'حزمة' },
                { value: 'buy-x-get-y', label: 'اشتر واحصل على' },
                { value: 'coupon', label: 'كوبون' },
              ]}
            />
            <TextField
              label="قيمة العرض"
              value={form.valueLabel}
              onChangeText={v => setForm(f => ({ ...f, valueLabel: v }))}
              placeholder="مثال: 20% أو توصيل مجاني"
            />
            <TextField
              label="شروط الأهلية"
              value={form.eligibility}
              onChangeText={v => setForm(f => ({ ...f, eligibility: v }))}
              placeholder="مثال: للطلبات فوق 50 ريال"
            />
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <Button label="إرسال للمراجعة" tone="brand" onPress={handleSubmitOffer} />
              <Button label="إلغاء" tone="ghost" onPress={() => setForm(INITIAL_FORM)} />
            </Box>
            {submitMessage ? (
              <Text role="caption" tone="muted">{submitMessage}</Text>
            ) : null}
          </Box>
        )}
      </Surface>

      {/* Info: no direct publish */}
      <Surface tone="inset" padding={3} gap={2}>
        <Text role="caption" tone="muted">
          ملاحظة: جميع العروض المقدمة تمر عبر مرحلة المراجعة التسويقية قبل أن تصبح مرئية للعملاء. لا يمكن النشر المباشر.
        </Text>
        <Text role="caption" tone="muted">
          {storeName} · {branchLabel} · {activeZoneLabel}
        </Text>
      </Surface>

      <MobileStickyPrimaryAction
        label="تقديم عرض مقترح"
        helperText="يمر عبر المراجعة التسويقية قبل النشر."
        onPress={() => setForm(f => ({ ...f, open: true }))}
      />
    </Box>
  );
}

export default PromotionsScreen;
