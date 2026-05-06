import React from 'react';
import {
  Box,
  Button,
  Chip,
  KeyValueList,
  ListItem,
  MobileStickyPrimaryAction,
  StateView,
  Surface,
  Text,
  useDirection,
} from '@bthwani/ui-kit';

type AnalyticsWorkspaceState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'no-analytics' | 'no-campaigns';

type MetricTone = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

type MetricTileProps = {
  label: string;
  value: string;
  tone?: MetricTone;
};

type RecommendationCardProps = {
  title: string;
  reason: string;
  actionLabel: string;
};

type OfferLineProps = {
  label: string;
  value: string;
  tone?: MetricTone;
};

export type AnalyticsGrowthMarketingWorkspaceContentProps = {
  storeName: string;
  branchLabel: string;
  activeZoneLabel: string;
  todayHoursLabel: string;
  state?: AnalyticsWorkspaceState;
};

const summaryMetrics = [
  { label: 'مبيعات اليوم', value: '1,280 ر.س', tone: 'brand' as const },
  { label: 'معدل الإكمال', value: '84%', tone: 'success' as const },
  { label: 'أفضل فئة', value: 'برغر مميز', tone: 'info' as const },
  { label: 'فرصة النمو', value: '12% رفع محتمل', tone: 'warning' as const },
] as const;

const recommendations = [
  {
    title: 'فعّل عرضًا على المنتجات الأكثر طلبًا',
    reason: 'البرغر والوجبات العائلية تسحب معظم الطلب هذا الأسبوع.',
    actionLabel: 'إنشاء عرض',
  },
  {
    title: 'راقب الصنف منخفض التوفر',
    reason: 'أحد المنتجات القريبة من النفاد يحتاج إشارة دعم قبل الذروة.',
    actionLabel: 'مراجعة',
  },
  {
    title: 'حسّن زمن التجهيز في وقت الذروة',
    reason: 'التحضير يطول قليلًا بعد 7 مساءً مقارنة ببداية النوبة.',
    actionLabel: 'لاحقًا',
  },
] as const;

const activeOffers = [
  {
    label: 'الحالة الحالية',
    value: 'عرض نهاية الأسبوع نشط',
    tone: 'success' as const,
  },
  {
    label: 'خصم مقترح',
    value: '10% على الوجبات الأعلى طلبًا',
    tone: 'brand' as const,
  },
  {
    label: 'حملة مقترحة',
    value: 'اشترِ أكثر ووفّر',
    tone: 'warning' as const,
  },
] as const;

const growthItems = [
  {
    title: 'برغر كلاسيك',
    subtitle: 'أفضل منتج في اليوم الحالي.',
    meta: '1,280 ر.س مبيعات',
    badgeLabel: 'Top',
  },
  {
    title: 'حلويات',
    subtitle: 'فئة ترتفع بسرعة مع الطلبات المسائية.',
    meta: '+18% هذا الأسبوع',
    badgeLabel: 'Rise',
  },
  {
    title: 'بطاطس حارة',
    subtitle: 'يستفيد من عرض محدود لرفع التحويل.',
    meta: 'يحتاج دعمًا تسويقيًا',
    badgeLabel: 'Promo',
  },
  {
    title: 'عصير ليمون',
    subtitle: 'أداء أضعف بعد الذروة ويحتاج مراجعة.',
    meta: 'راجع التسعير',
    badgeLabel: 'Watch',
  },
] as const;

const planItems = [
  { label: 'الخطة الحالية', value: 'Growth Plus', tone: 'brand' as const },
  { label: 'حالة الاشتراك', value: 'نشط حتى 14 يومًا', tone: 'success' as const },
  { label: 'ميزة مقترحة', value: 'عروض موجهة حسب السلة', tone: 'info' as const },
  { label: 'إيقاع المراجعة', value: 'أسبوعي', tone: 'default' as const },
] as const;

function MetricTile({ label, value, tone = 'default' }: MetricTileProps) {
  return (
    <Surface tone="default" padding={3} gap={1} style={{ flex: 1, minWidth: 118, borderWidth: 1 }}>
      <Text role="caption" tone="muted" numberOfLines={1}>
        {label}
      </Text>
      <Text role="bodyStrong" tone={tone} numberOfLines={2}>
        {value}
      </Text>
    </Surface>
  );
}

function RecommendationCard({ title, reason, actionLabel }: RecommendationCardProps) {
  return (
    <Surface tone="default" padding={3} gap={2}>
      <Box gap={1}>
        <Text role="bodyStrong" numberOfLines={2}>
          {title}
        </Text>
        <Text role="bodySm" tone="muted" numberOfLines={2}>
          {reason}
        </Text>
      </Box>
      <Button label={actionLabel} size="sm" tone="secondary" fullWidth={false} />
    </Surface>
  );
}

function OfferLine({ label, value, tone = 'default' }: OfferLineProps) {
  return (
    <Box gap={1} style={{ flex: 1, minWidth: 128 }}>
      <Text role="caption" tone="muted">
        {label}
      </Text>
      <Text role="bodyMd" tone={tone} numberOfLines={2}>
        {value}
      </Text>
    </Box>
  );
}

function renderState(state: Exclude<AnalyticsWorkspaceState, 'ready'>) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تجهيز التحليلات" description="نستعرض الآن مؤشرات النمو والعروض داخل نفس المساحة." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد بيانات بعد" description="ستظهر ملخصات الأداء عندما تتوفر أول مجموعة بيانات محلية." />;
  }

  if (state === 'offline') {
    return <StateView stateId="offline" title="التحليلات غير متصلة" description="أعد المحاولة عند عودة الاتصال أو اعتمد على الملخص المحلي الحالي." />;
  }

  if (state === 'no-analytics') {
    return <StateView stateId="empty" title="لا توجد بيانات تحليلية كافية" description="أكمل النشاط اليومي أولًا ثم أعد فتح مساحة النمو." actionLabel="مراجعة الخطة" />;
  }

  if (state === 'no-campaigns') {
    return <StateView stateId="empty" title="لا توجد حملات تسويقية مفعلة" description="يمكنك إنشاء أول عرض سريع من نفس الصفحة دون مغادرة السطح." actionLabel="إنشاء عرض سريع" />;
  }

  return <StateView stateId="recoverableError" title="تعذر فتح التحليلات" description="حدث خلل مؤقت. أعد المحاولة من دون فقدان السياق." />;
}

export function AnalyticsGrowthMarketingWorkspaceContent({
  storeName,
  branchLabel,
  activeZoneLabel,
  todayHoursLabel,
  state = 'ready',
}: AnalyticsGrowthMarketingWorkspaceContentProps) {
  const { direction } = useDirection();
  const [toolMessage, setToolMessage] = React.useState('التوصيات محلية وتُحدث قرار التسويق داخل الصفحة فقط.');
  const [marketingView, setMarketingView] = React.useState<'active' | 'suggested'>('active');

  if (state !== 'ready') {
    return renderState(state);
  }

  return (
    <Box gap={4}>
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          نظرة سريعة
        </Text>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap' }} gap={2}>
          {summaryMetrics.map((metric) => (
            <MetricTile key={metric.label} label={metric.label} value={metric.value} tone={metric.tone} />
          ))}
        </Box>
        <Text role="caption" tone="muted">
          {storeName} · {branchLabel} · {activeZoneLabel}
        </Text>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Box gap={1}>
          <Text role="titleSm">توصيات اليوم</Text>
          <Text role="bodySm" tone="muted">
            خطوات قصيرة قابلة للتنفيذ دون فتح لوحة خارجية.
          </Text>
        </Box>
        <Box gap={2}>
          {recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.title} {...recommendation} />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Box gap={1}>
          <Text role="titleSm">العروض والتسويق</Text>
          <Text role="bodySm" tone="muted">
            حالة العروض الحالية وما يمكن إطلاقه بسرعة لرفع الطلب.
          </Text>
        </Box>

        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap' }} gap={2}>
          <Chip label={marketingView === 'active' ? 'الحملات النشطة' : 'الحملات المقترحة'} selected tone={marketingView === 'active' ? 'success' : 'brand'} onPress={() => setMarketingView((current) => (current === 'active' ? 'suggested' : 'active'))} />
          <Chip label="خصومات محدودة" tone="warning" />
          <Chip label="عروض موسمية" tone="info" />
        </Box>

        <KeyValueList
          dense
          items={activeOffers.map((item) => ({ label: item.label, value: item.value, tone: item.tone }))}
        />

        <Surface tone="inset" padding={3} gap={2}>
          <Text role="bodyStrong">
            {marketingView === 'active' ? 'العرض الحالي' : 'الحملة المقترحة'}
          </Text>
          <Text role="bodySm" tone="muted">
            {marketingView === 'active'
              ? 'العرض الحالي يركز على المنتجات الأعلى طلبًا مع خصم محدود وزمن واضح.'
              : 'الحملة المقترحة تربط الخصم بالمنتجات التي تظهر فيها فرصة تحويل أعلى.'}
          </Text>
          <Button
            label={marketingView === 'active' ? 'مراجعة فرص التسويق' : 'إنشاء عرض سريع'}
            tone="secondary"
            fullWidth={false}
            onPress={() => setToolMessage('تم فتح مسار التسويق المحلي داخل الصفحة فقط.')}
          />
        </Surface>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Box gap={1}>
          <Text role="titleSm">فرص المنتجات والفئات</Text>
          <Text role="bodySm" tone="muted">
            أفضل المنتجات، الفئات الصاعدة، وما يحتاج دعمًا أو عرضًا.
          </Text>
        </Box>
        <Box gap={2}>
          {growthItems.map((item) => (
            <ListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Box gap={1}>
          <Text role="titleSm">الخطة والاشتراك</Text>
          <Text role="bodySm" tone="muted">
            الخطة الحالية وما الذي يدعم النمو القادم.
          </Text>
        </Box>
        <KeyValueList dense items={planItems.map((item) => ({ label: item.label, value: item.value, tone: item.tone }))} />
        <Surface tone="inset" padding={3} gap={1}>
          <Text role="bodyStrong">ميزة مقترحة للنمو</Text>
          <Text role="bodySm" tone="muted">
            خصّص عروضًا ذكية حسب السلة والوقت اليومي، ثم راقب أثرها قبل التوسع.
          </Text>
          <Button label="مراجعة الخطة" tone="secondary" fullWidth={false} onPress={() => setToolMessage('تم فتح مراجعة الخطة محليًا.')} />
        </Surface>
      </Surface>

      <Surface tone="inset" padding={3} gap={2}>
        <OfferLine label="الفرع" value={branchLabel} tone="default" />
        <OfferLine label="ساعات اليوم" value={todayHoursLabel} tone="default" />
        <OfferLine label="الرسالة المحلية" value={toolMessage} tone="brand" />
      </Surface>

      <MobileStickyPrimaryAction
        label="إنشاء عرض سريع"
        helperText="المقترحات محلية وتعمل داخل الصفحة فقط."
        onPress={() => setToolMessage('تم فتح إنشاء عرض سريع محليًا.')}
      />
    </Box>
  );
}

export default AnalyticsGrowthMarketingWorkspaceContent;
