import React from 'react';
import {
  Box,
  Button,
  KeyValueList,
  ListItem,
  MobileScrollView,
  SectionHeader,
  StateView,
  StatCard,
  Surface,
  Text,
  TextField,
} from '@bthwani/ui-kit';

export type CaptainSupportScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'success' | 'disabled';

export type CaptainSupportScreenId =
  | 'chat-read-ack'
  | 'chat-send'
  | 'cod-balance'
  | 'job-reject'
  | 'order-accept'
  | 'order-deliver'
  | 'order-details'
  | 'order-get'
  | 'order-pickup'
  | 'orders-list'
  | 'orders-offers-list'
  | 'profile-get'
  | 'proof-upload'
  | 'tier-evaluate'
  | 'tier-info';

type CaptainMetric = {
  label: string;
  value: string;
  deltaLabel: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

type CaptainConfig = {
  id: CaptainSupportScreenId;
  title: string;
  subtitle: string;
  heroTitle: string;
  heroDescription: string;
  primaryLabel: string;
  secondaryLabel?: string;
  keyValues?: Array<{ label: string; value: string; tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }>;
  metrics?: CaptainMetric[];
  listItems?: Array<{ title: string; subtitle: string; meta: string; badgeLabel?: string }>;
  inputLabel?: string;
  inputHint?: string;
};

export type CaptainGeneratedSupportScreenProps = {
  state?: CaptainSupportScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

const captainSupportConfigs: Record<CaptainSupportScreenId, CaptainConfig> = {
  'chat-read-ack': {
    id: 'chat-read-ack',
    title: 'تأكيد قراءة دردشة الكابتن',
    subtitle: 'أكد أحدث محادثة تشغيلية من دون مغادرة مسار الطلب النشط.',
    heroTitle: 'الرسائل التشغيلية غير المقروءة',
    heroDescription: 'يمسح الكابتن التواصل غير المقروء مع البقاء مركزًا على خطوة المسار التالية.',
    primaryLabel: 'وضع علامة مقروء',
    secondaryLabel: 'العودة إلى دليل الدعم',
    listItems: [
      { title: 'الفرع', subtitle: 'الطلب جاهز عند الكاونتر 2.', meta: 'منذ دقيقتين', badgeLabel: 'غير مقروء' },
      { title: 'العميل', subtitle: 'يرجى الاتصال عند الوصول.', meta: 'منذ 5 دقائق', badgeLabel: 'غير مقروء' },
    ],
  },
  'chat-send': {
    id: 'chat-send',
    title: 'إرسال رسالة الكابتن',
    subtitle: 'أرسل رسالة مرتبطة بالمسار من مساحة كتابة مركزة.',
    heroTitle: 'التواصل على المسار',
    heroDescription: 'استخدم رسالة قصيرة واحدة حتى يتمكن الطرف المستلم من التصرف فورًا.',
    primaryLabel: 'إرسال الرسالة',
    secondaryLabel: 'العودة إلى دليل الدعم',
    inputLabel: 'الرسالة',
    inputHint: 'مثال: وصلت إلى بوابة الاستلام وأنتظر التسليم.',
  },
  'cod-balance': {
    id: 'cod-balance',
    title: 'رصيد الدفع عند الاستلام',
    subtitle: 'راجع رصيد الدفع عند الاستلام والتسوية المعلّقة.',
    heroTitle: 'وضوح الرصيد النقدي',
    heroDescription: 'يمكن للكابتن التحقق من النقد المحصّل قبل متابعة سير التسوية.',
    primaryLabel: 'تحديث الرصيد',
    secondaryLabel: 'العودة إلى دليل الدعم',
    metrics: [
      { label: 'المحصّل اليوم', value: '420 SAR', deltaLabel: 'النقد المستلم', tone: 'info' },
      { label: 'الإيداع المعلّق', value: '180 SAR', deltaLabel: 'يحتاج تسوية', tone: 'warning' },
      { label: 'الفارق', value: '0 SAR', deltaLabel: 'متوازن', tone: 'success' },
    ],
  },
  'job-reject': {
    id: 'job-reject',
    title: 'رفض المهمة',
    subtitle: 'ارفض طلبًا مع سبب تشغيلي ظاهر.',
    heroTitle: 'التعامل مع الاستثناءات',
    heroDescription: 'يجب أن يبقى الرفض نادرًا ومصرّحًا به بالكامل حتى تتم الإعادة بسلاسة.',
    primaryLabel: 'رفض الطلب',
    secondaryLabel: 'العودة إلى دليل الدعم',
    inputLabel: 'سبب الرفض',
    inputHint: 'مثال: مشكلة في المركبة أو حالة طريق غير آمنة.',
  },
  'order-accept': {
    id: 'order-accept',
    title: 'قبول الطلب',
    subtitle: 'أكد أن الكابتن قبل الطلب والتزم بالاستلام.',
    heroTitle: 'قبول الكابتن',
    heroDescription: 'ينقل القبول المسار من عمل في الصف إلى تنفيذ ملتزم.',
    primaryLabel: 'قبول الطلب',
    secondaryLabel: 'العودة إلى دليل الدعم',
    keyValues: [
      { label: 'موعد الاستلام المتوقع', value: '8 دقائق' },
      { label: 'منطقة التسليم', value: 'العليا' },
      { label: 'الالتزام', value: 'بانتظار تأكيد الكابتن', tone: 'warning' },
    ],
  },
  'order-deliver': {
    id: 'order-deliver',
    title: 'تسليم الطلب',
    subtitle: 'أغلق المسار مع تأكيد التسليم النهائي.',
    heroTitle: 'إغلاق المرحلة الأخيرة',
    heroDescription: 'يجب أن يؤكد الكابتن التسليم فقط بعد وضوح الإثبات وتسليم الطلب للمتلقي.',
    primaryLabel: 'تأكيد التسليم',
    secondaryLabel: 'العودة إلى دليل الدعم',
    keyValues: [
      { label: 'المستلم', value: 'تم تأكيد العميل' },
      { label: 'الإثبات', value: 'تم إدخال الرمز', tone: 'success' },
      { label: 'أثر الرصيد', value: 'يحدّث COD إن انطبق' },
    ],
  },
  'order-details': {
    id: 'order-details',
    title: 'تفاصيل الطلب',
    subtitle: 'راجع لقطة المسار الموجهة للكابتن.',
    heroTitle: 'لقطة طلب الكابتن',
    heroDescription: 'لا ينبغي أن تبقى ظاهرة هنا إلا الاستلام والتسليم والتوقيت والمرحلة الحالية.',
    primaryLabel: 'تحديث تفاصيل الطلب',
    secondaryLabel: 'العودة إلى دليل الدعم',
    keyValues: [
      { label: 'الاستلام', value: 'Burger Lab - فرع حطين' },
      { label: 'التسليم', value: 'حي العليا' },
      { label: 'المرحلة', value: 'متجه إلى الاستلام', tone: 'brand' },
    ],
  },
  'order-get': {
    id: 'order-get',
    title: 'عرض الطلب',
    subtitle: 'افتح العرض المقروء المدمج للمسار المخصص.',
    heroTitle: 'عرض المسار المخصص',
    heroDescription: 'يمكن للكابتن إعادة تحميل سياق المسار من دون إعادة فتح الصندوق.',
    primaryLabel: 'تحديث لقطة المسار',
    secondaryLabel: 'العودة إلى دليل الدعم',
    keyValues: [
      { label: 'الطلب', value: '#9021' },
      { label: 'الوقت المتوقع الحالي', value: '8 دقائق' },
      { label: 'أثر الازدحام', value: 'متوسط', tone: 'warning' },
    ],
  },
  'order-pickup': {
    id: 'order-pickup',
    title: 'استلام الطلب',
    subtitle: 'أكد استلام الفرع قبل بدء مرحلة التوصيل.',
    heroTitle: 'تأكيد الاستلام',
    heroDescription: 'الاستلام خطوة تأكيد منفصلة حتى يبقى خط زمن المسار صادقًا.',
    primaryLabel: 'تأكيد الاستلام',
    secondaryLabel: 'العودة إلى دليل الدعم',
    keyValues: [
      { label: 'الفرع', value: 'Burger Lab - فرع حطين' },
      { label: 'حالة الحزمة', value: 'جاهزة عند الكاونتر 2' },
      { label: 'الخطوة التالية', value: 'الانتقال إلى العميل', tone: 'brand' },
    ],
  },
  'orders-list': {
    id: 'orders-list',
    title: 'قائمة الطلبات',
    subtitle: 'تصفح كل طلبات الكابتن من شاشة صف مركزة واحدة.',
    heroTitle: 'صف مسار الكابتن',
    heroDescription: 'تكمّل هذه القائمة صندوق الطلبات برؤية أوسع لكنها ما زالت موجهة للطلبات.',
    primaryLabel: 'تحديث قائمة الطلبات',
    secondaryLabel: 'العودة إلى دليل الدعم',
    listItems: [
      { title: 'الطلب #9021', subtitle: 'Burger Lab إلى العليا', meta: 'الاستلام خلال 8 دقائق', badgeLabel: 'التالي' },
      { title: 'الطلب #9024', subtitle: 'Green Bowl إلى طريق الملك فهد', meta: 'الاستلام خلال 15 دقيقة', badgeLabel: 'في الصف' },
    ],
  },
  'orders-offers-list': {
    id: 'orders-offers-list',
    title: 'قائمة عروض الطلبات',
    subtitle: 'راجع عروض الطلبات المفتوحة التي لم تقبل بعد.',
    heroTitle: 'عروض الطلبات المتاحة',
    heroDescription: 'يبقى مراجعة العروض منفصلة عن الطلبات المقبولة حتى يعرف الكابتن مستوى الالتزام دائمًا.',
    primaryLabel: 'تحديث العروض',
    secondaryLabel: 'العودة إلى دليل الدعم',
    listItems: [
      { title: 'عرض #440', subtitle: 'Bean House إلى النخيل', meta: 'الدفع المتوقع 22 SAR', badgeLabel: 'مفتوح' },
      { title: 'عرض #441', subtitle: 'Green Bowl إلى العليا', meta: 'الدفع المتوقع 19 SAR', badgeLabel: 'مفتوح' },
    ],
  },
  'profile-get': {
    id: 'profile-get',
    title: 'ملف الكابتن',
    subtitle: 'اقرأ ملف الكابتن الحالي وحالة الجاهزية للمسار.',
    heroTitle: 'لقطة هوية الكابتن',
    heroDescription: 'يبقى ملف المسار متاحًا من دون مغادرة عائلة أسطح DSH.',
    primaryLabel: 'تحديث الملف',
    secondaryLabel: 'العودة إلى دليل الدعم',
    keyValues: [
      { label: 'الكابتن', value: 'الكابتن #9021' },
      { label: 'المركبة', value: 'دراجة نارية' },
      { label: 'الجاهزية', value: 'متصل وجاهز', tone: 'success' },
    ],
  },
  'proof-upload': {
    id: 'proof-upload',
    title: 'رفع الإثبات',
    subtitle: 'التقط الإثبات عندما يحتاج تأكيد التسليم النهائي إلى دعم وسائط.',
    heroTitle: 'أدلة التسليم',
    heroDescription: 'يبقى التقاط الإثبات منفصلًا عن تأكيد التسليم حتى يمكن التعامل مع الاستثناءات بوضوح.',
    primaryLabel: 'رفع الإثبات',
    secondaryLabel: 'العودة إلى دليل الدعم',
    keyValues: [
      { label: 'الصيغة المطلوبة', value: 'صورة أو تأكيد موقّع' },
      { label: 'الحالة الحالية', value: 'بانتظار الرفع', tone: 'warning' },
      { label: 'المتابعة', value: 'أغلق المسار بعد الإثبات' },
    ],
  },
  'tier-evaluate': {
    id: 'tier-evaluate',
    title: 'تقييم الطبقة',
    subtitle: 'راجع ما إذا كان الكابتن جاهزًا للطبقة التالية.',
    heroTitle: 'فحص التقدم في الطبقة',
    heroDescription: 'تبقى منطق الطبقة مرئية تشغيليًا حتى يعرف الكابتن ما يؤثر على الأهلية.',
    primaryLabel: 'تقييم الطبقة',
    secondaryLabel: 'العودة إلى دليل الدعم',
    metrics: [
      { label: 'معدل الإكمال', value: '97%', deltaLabel: 'آخر 30 يومًا', tone: 'success' },
      { label: 'معدل الإلغاء', value: '1.2%', deltaLabel: 'آخر 30 يومًا', tone: 'info' },
      { label: 'الحوادث', value: '0', deltaLabel: 'مشكلات السلامة', tone: 'success' },
    ],
  },
  'tier-info': {
    id: 'tier-info',
    title: 'معلومات الطبقة',
    subtitle: 'اقرأ المزايا والمتطلبات الحالية للطبقة النشطة.',
    heroTitle: 'مزايا الطبقة الحالية',
    heroDescription: 'يجب أن يفهم الكابتن ما تفتحه الطبقة الحالية وما تتطلبه الطبقة التالية.',
    primaryLabel: 'تحديث معلومات الطبقة',
    secondaryLabel: 'العودة إلى دليل الدعم',
    keyValues: [
      { label: 'الطبقة الحالية', value: 'ذهبية', tone: 'brand' },
      { label: 'مكافأة الأجر', value: '+8%' },
      { label: 'عتبة الطبقة التالية', value: '120 مسارًا مكتملًا' },
    ],
  },
};

function renderCaptainSupportState(state: Exclude<CaptainSupportScreenState, 'ready' | 'disabled'>, onRetry?: () => void, onBack?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="لا يوجد محتوى دعم للكابتن محمّل"
        description="أعد تحميل الشاشة وحافظ على سياق الطلب ثابتًا."
        actionLabel={onRetry ? 'إعادة تحميل شاشة الدعم' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <StateView
        stateId="offline"
        title="شاشة دعم الكابتن غير متصلة"
        description="أعد المحاولة عندما يعود الاتصال."
        actionLabel={onRetry ? 'إعادة المحاولة في شاشة الدعم' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <StateView
        stateId="success"
        title="اكتمل إجراء دعم الكابتن"
        description="أصبح مسار الدعم مكتملًا ويمكن للكابتن متابعة خطوة المسار التالية."
        actionLabel={onBack ? 'العودة إلى دليل الدعم' : undefined}
        onActionPress={onBack}
      />
    );
  }

  return (
    <StateView
      stateId="recoverableError"
      title="فشلت شاشة دعم الكابتن"
      description="أعد المحاولة من دون مغادرة مسار الدعم المرتبط بالطلب."
      actionLabel={onRetry ? 'إعادة محاولة خطوة الدعم' : undefined}
      onActionPress={onRetry}
    />
  );
}

function createCaptainSupportScreen(config: CaptainConfig) {
  return function GeneratedCaptainSupportScreen({
    state = 'ready',
    onPrimaryAction,
    onSecondaryAction,
    onRetry,
    onBack,
  }: CaptainGeneratedSupportScreenProps) {
    const [draftValue, setDraftValue] = React.useState('');

    if (state !== 'ready' && state !== 'disabled') {
      return renderCaptainSupportState(state, onRetry, onBack);
    }

    const isDisabled = state === 'disabled';

    return (
      <MobileScrollView padding={4} gap={4}>
        <Box gap={2}>
          <Text role="titleLg">{config.title}</Text>
          <Text role="bodyMd" tone="muted">{config.subtitle}</Text>
        </Box>

        <Surface tone="brand" gap={3}>
          <SectionHeader title={config.heroTitle} subtitle={config.heroDescription} />
          {config.metrics?.map((metric) => (
            <StatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              deltaLabel={metric.deltaLabel}
              tone={metric.tone ?? 'default'}
            />
          ))}
        </Surface>

        {config.keyValues?.length ? (
          <Surface tone="raised" gap={3}>
            <SectionHeader title="تفاصيل المسار" subtitle="تبقى فقط التفاصيل اللازمة لإجراء الكابتن الفوري ظاهرة." />
            <KeyValueList items={config.keyValues} />
          </Surface>
        ) : null}

        {config.listItems?.length ? (
          <Surface tone="default" gap={3}>
            <SectionHeader title="الصف الحالي" subtitle="كل عنصر يحافظ على قرار المسار التالي واضحًا." />
            <Box gap={2}>
              {config.listItems.map((item) => (
                <ListItem
                  key={`${config.id}-${item.title}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  badgeLabel={item.badgeLabel}
                />
              ))}
            </Box>
          </Surface>
        ) : null}

        {config.inputLabel ? (
          <Surface tone="raised" gap={3}>
            <SectionHeader title="إدخال المسودة" subtitle="إدخال واحد موجز من الكابتن يبقي المسار مركزًا." />
            <TextField
              label={config.inputLabel}
              value={draftValue}
              onChangeText={setDraftValue}
              hint={config.inputHint}
              editable={!isDisabled}
            />
          </Surface>
        ) : null}

        <Button label={config.primaryLabel} onPress={onPrimaryAction} disabled={isDisabled} />
        {config.secondaryLabel ? <Button label={config.secondaryLabel} tone="secondary" onPress={onSecondaryAction ?? onBack} /> : null}
      </MobileScrollView>
    );
  };
}

export const DshCaptainChatReadAckScreen = createCaptainSupportScreen(captainSupportConfigs['chat-read-ack']);
export const DshCaptainChatSendScreen = createCaptainSupportScreen(captainSupportConfigs['chat-send']);
export const DshCaptainCodBalanceScreen = createCaptainSupportScreen(captainSupportConfigs['cod-balance']);
export const DshCaptainJobRejectScreen = createCaptainSupportScreen(captainSupportConfigs['job-reject']);
export const DshCaptainOrderAcceptScreen = createCaptainSupportScreen(captainSupportConfigs['order-accept']);
export const DshCaptainOrderDeliverScreen = createCaptainSupportScreen(captainSupportConfigs['order-deliver']);
export const DshCaptainOrderDetailsScreen = createCaptainSupportScreen(captainSupportConfigs['order-details']);
export const DshCaptainOrderGetScreen = createCaptainSupportScreen(captainSupportConfigs['order-get']);
export const DshCaptainOrderPickupScreen = createCaptainSupportScreen(captainSupportConfigs['order-pickup']);
export const DshCaptainOrdersListScreen = createCaptainSupportScreen(captainSupportConfigs['orders-list']);
export const DshCaptainOrdersOffersListScreen = createCaptainSupportScreen(captainSupportConfigs['orders-offers-list']);
export const DshCaptainProfileGetScreen = createCaptainSupportScreen(captainSupportConfigs['profile-get']);
export const DshCaptainProofUploadScreen = createCaptainSupportScreen(captainSupportConfigs['proof-upload']);
export const DshCaptainTierEvaluateScreen = createCaptainSupportScreen(captainSupportConfigs['tier-evaluate']);
export const DshCaptainTierInfoScreen = createCaptainSupportScreen(captainSupportConfigs['tier-info']);

