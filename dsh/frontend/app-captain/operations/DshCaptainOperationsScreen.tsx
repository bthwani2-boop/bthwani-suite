import React from 'react';
import { Button, KeyValueList, ListItem, MobileScrollView, SectionHeader, StateView, Surface, Text, TextField } from '@bthwani/ui-kit';
import type { DshCaptainOperationsScreenState, DshCaptainOperationsSnapshot } from './dshCaptainOperationsModel';

export type CaptainSupportScreenId =
  | 'chat-read-ack'
  | 'chat-send'
  | 'cod-balance'
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

export type DshCaptainOperationsScreenProps = {
  section?: 'availability' | 'route-readiness' | 'safety';
  state?: DshCaptainOperationsScreenState;
  snapshot?: DshCaptainOperationsSnapshot;
  onBack?: () => void;
  onRetry?: () => void;
};

const demoSnapshot: DshCaptainOperationsSnapshot = {
  availabilityLabel: 'متاح',
  routeReadinessLabel: 'جاهز للمسار',
  safetyLabel: 'سلامة مستقرة',
};

function AvailabilitySection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainOperationsSnapshot }) {
  return (
    <Surface tone="brand" gap={3}>
      <SectionHeader title="إتاحة الكابتن" subtitle="تشغيل الكابتن نفسه، وليس الطلب." />
      <KeyValueList
        items={[
          { label: 'الحالة', value: snapshot.availabilityLabel, tone: 'success' },
          { label: 'الاستعداد', value: 'متابعة الطلبات مباشرة' },
        ]}
      />
    </Surface>
  );
}

function RouteReadinessSection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainOperationsSnapshot }) {
  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader title="جاهزية المسار" subtitle="تأكد من جاهزية الطريق قبل الإرسال أو التوجيه." />
      <KeyValueList
        items={[
          { label: 'الملخص', value: snapshot.routeReadinessLabel, tone: 'brand' },
          { label: 'التوجيه', value: 'محدد محليًا' },
        ]}
      />
    </Surface>
  );
}

function SafetySection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainOperationsSnapshot }) {
  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader title="السلامة" subtitle="مؤشرات السلامة يجب أن تبقى قصيرة وواضحة." />
      <Text role="bodySm" tone="muted">
        {snapshot.safetyLabel}
      </Text>
    </Surface>
  );
}

function renderOperationsState(state: DshCaptainOperationsScreenState, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تحميل العمليات" description="تبقى الجاهزية ظاهرة عند وصول البيانات." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد بيانات تشغيلية" description="أعد التحميل عند توفر إشارات الإتاحة أو السلامة." actionLabel={onRetry ? 'إعادة التحميل' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'error') {
    return <StateView stateId="recoverableError" title="تعذر تحميل العمليات" description="حاول مرة أخرى من دون مغادرة مسار التشغيل." actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
  }

  return null;
}

export function DshCaptainOperationsScreen({
  section = 'availability',
  state = 'ready',
  snapshot = demoSnapshot,
  onBack,
  onRetry,
}: DshCaptainOperationsScreenProps) {
  if (state !== 'ready') {
    return (
      <MobileScrollView padding={4} gap={4}>
        {renderOperationsState(state, onRetry)}
      </MobileScrollView>
    );
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <Text role="titleLg">التشغيل</Text>
      <Text role="bodyMd" tone="muted">
        جاهزية الكابتن، المسار، والسلامة بدون أي backend أو mutation.
      </Text>

      {section === 'availability' ? <AvailabilitySection snapshot={snapshot} /> : null}
      {section === 'route-readiness' ? <RouteReadinessSection snapshot={snapshot} /> : null}
      {section === 'safety' ? <SafetySection snapshot={snapshot} /> : null}

      {section === 'availability' ? <RouteReadinessSection snapshot={snapshot} /> : null}
      {section === 'availability' ? <SafetySection snapshot={snapshot} /> : null}

      <Button label="العودة" tone="ghost" onPress={onBack} />
    </MobileScrollView>
  );
}

function SimpleSupportScreen({
  title,
  subtitle,
  heroTitle,
  heroDescription,
  primaryLabel,
  secondaryLabel,
  keyValues,
  listItems,
  inputLabel,
  inputHint,
  onPrimaryAction,
  onSecondaryAction,
  onBack,
}: {
  title: string;
  subtitle: string;
  heroTitle: string;
  heroDescription: string;
  primaryLabel: string;
  secondaryLabel?: string;
  keyValues?: Array<{ label: string; value: string; tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }>;
  listItems?: Array<{ title: string; subtitle: string; meta: string; badgeLabel?: string }>;
  inputLabel?: string;
  inputHint?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onBack?: () => void;
}) {
  const [draftValue, setDraftValue] = React.useState('');

  return (
    <MobileScrollView padding={4} gap={4}>
      <Text role="titleLg">{title}</Text>
      <Text role="bodyMd" tone="muted">{subtitle}</Text>

      <Surface tone="brand" gap={3}>
        <SectionHeader title={heroTitle} subtitle={heroDescription} />
      </Surface>

      {keyValues?.length ? (
        <Surface tone="raised" gap={3}>
          <SectionHeader title="تفاصيل المسار" subtitle="تبقى فقط التفاصيل اللازمة لإجراء الكابتن الفوري ظاهرة." />
          <KeyValueList items={keyValues} />
        </Surface>
      ) : null}

      {listItems?.length ? (
        <Surface tone="default" gap={3}>
          <SectionHeader title="الصف الحالي" subtitle="كل عنصر يحافظ على قرار المسار التالي واضحًا." />
          <MobileScrollView gap={2}>
            {listItems.map((item) => (
              <ListItem key={`${title}-${item.title}`} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </MobileScrollView>
        </Surface>
      ) : null}

      {inputLabel ? (
        <Surface tone="raised" gap={3}>
          <SectionHeader title="إدخال المسودة" subtitle="إدخال واحد موجز من الكابتن يبقي المسار مركزًا." />
          <TextField label={inputLabel} value={draftValue} onChangeText={setDraftValue} hint={inputHint} />
        </Surface>
      ) : null}

      <Button label={primaryLabel} onPress={onPrimaryAction} />
      {secondaryLabel ? <Button label={secondaryLabel} tone="secondary" onPress={onSecondaryAction ?? onBack} /> : null}
    </MobileScrollView>
  );
}

export function DshCaptainChatReadAckScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <SimpleSupportScreen
      title="تأكيد قراءة دردشة الكابتن"
      subtitle="أكد أحدث محادثة تشغيلية من دون مغادرة مسار الطلب النشط."
      heroTitle="الرسائل التشغيلية غير المقروءة"
      heroDescription="يمسح الكابتن التواصل غير المقروء مع البقاء مركزًا على خطوة المسار التالية."
      primaryLabel="وضع علامة مقروء"
      secondaryLabel="العودة إلى دليل الدعم"
      listItems={[
        { title: 'الفرع', subtitle: 'الطلب جاهز عند الكاونتر 2.', meta: 'منذ دقيقتين', badgeLabel: 'غير مقروء' },
        { title: 'العميل', subtitle: 'يرجى الاتصال عند الوصول.', meta: 'منذ 5 دقائق', badgeLabel: 'غير مقروء' },
      ]}
      onBack={props.onBack}
      onSecondaryAction={props.onSecondaryAction}
    />
  );
}

export function DshCaptainChatSendScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
  return (
    <SimpleSupportScreen
      title="إرسال رسالة الكابتن"
      subtitle="أرسل رسالة مرتبطة بالمسار من مساحة كتابة مركزة."
      heroTitle="التواصل على المسار"
      heroDescription="استخدم رسالة قصيرة واحدة حتى يتمكن الطرف المستلم من التصرف فورًا."
      primaryLabel="إرسال الرسالة"
      secondaryLabel="العودة إلى دليل الدعم"
      inputLabel="الرسالة"
      inputHint="مثال: وصلت إلى بوابة الاستلام وأنتظر التسليم."
      onBack={props.onBack}
      onSecondaryAction={props.onSecondaryAction}
    />
  );
}

export function DshCaptainSupportDirectoryScreen({ onOpenScreen }: { onOpenScreen?: (screenId: CaptainSupportScreenId) => void }) {
  const groups: Array<{
    title: string;
    subtitle: string;
    items: Array<{ id: CaptainSupportScreenId; title: string; subtitle: string; badgeLabel: string }>;
  }> = [
    {
      title: 'مسار التنفيذ',
      subtitle: 'دورة مسار الكابتن من العرض حتى الإتمام.',
      items: [
        { id: 'orders-offers-list', title: 'قائمة عروض الطلبات', subtitle: 'راجع العروض المفتوحة قبل الالتزام.', badgeLabel: 'عروض' },
        { id: 'orders-list', title: 'قائمة الطلبات', subtitle: 'تصفح صف المسار النشط.', badgeLabel: 'صف' },
        { id: 'order-accept', title: 'قبول الطلب', subtitle: 'اقبل الطلب.', badgeLabel: 'تنفيذ' },
        { id: 'order-get', title: 'عرض الطلب', subtitle: 'افتح لقطة المسار.', badgeLabel: 'قراءة' },
        { id: 'order-details', title: 'تفاصيل الطلب', subtitle: 'افحص تفاصيل الطلب.', badgeLabel: 'قراءة' },
        { id: 'order-pickup', title: 'استلام الطلب', subtitle: 'أكد الاستلام.', badgeLabel: 'تنفيذ' },
        { id: 'order-deliver', title: 'تسليم الطلب', subtitle: 'أكد التسليم.', badgeLabel: 'إغلاق' },
        { id: 'proof-upload', title: 'رفع الإثبات', subtitle: 'ارفع دليل التسليم.', badgeLabel: 'إثبات' },
      ],
    },
    {
      title: 'دعم الكابتن',
      subtitle: 'التواصل والرصيد والملف الشخصي والأداء.',
      items: [
        { id: 'chat-read-ack', title: 'تأكيد قراءة الدردشة', subtitle: 'امسح رسائل المسار غير المقروءة.', badgeLabel: 'تواصل' },
        { id: 'chat-send', title: 'إرسال رسالة', subtitle: 'أرسل رسالة مسار.', badgeLabel: 'تواصل' },
        { id: 'cod-balance', title: 'رصيد الدفع عند الاستلام', subtitle: 'راجع تحصيل النقد.', badgeLabel: 'مالية' },
        { id: 'profile-get', title: 'ملف الكابتن', subtitle: 'اقرأ ملف الكابتن.', badgeLabel: 'ملف' },
        { id: 'tier-evaluate', title: 'تقييم الطبقة', subtitle: 'قيّم جاهزية الطبقة التالية.', badgeLabel: 'طبقة' },
        { id: 'tier-info', title: 'معلومات الطبقة', subtitle: 'اقرأ مزايا الطبقة الحالية.', badgeLabel: 'طبقة' },
      ],
    },
  ];

  return (
    <MobileScrollView padding={4} gap={4}>
      <Text role="titleLg">دليل دعم الكابتن</Text>
      <Text role="bodyMd" tone="muted">
        دليل مركزي لباقي أسطح DSH الخاصة بالكابتن حتى يصبح كل مسار مسمّى قابلًا للوصول من خط تنفيذ واحد مملوك.
      </Text>

      {groups.map((group) => (
        <Surface key={group.title} tone="raised" gap={3}>
          <SectionHeader title={group.title} subtitle={group.subtitle} />
          <MobileScrollView gap={2}>
            {group.items.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                meta="افتح سطح الكابتن المسمّى"
                badgeLabel={item.badgeLabel}
                onPress={() => onOpenScreen?.(item.id)}
              />
            ))}
          </MobileScrollView>
        </Surface>
      ))}
    </MobileScrollView>
  );
}

export default DshCaptainOperationsScreen;
