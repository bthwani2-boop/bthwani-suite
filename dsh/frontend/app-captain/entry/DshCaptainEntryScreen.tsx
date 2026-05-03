import React from 'react';
import {
  Box,
  Button,
  Card,
  DashboardShell,
  StateView,
  Text,
} from '@bthwani/ui-kit';

export type DshEntryScreenState = 'ready' | 'loading' | 'empty';

export type DshEntryScreenProps = {
  state?: DshEntryScreenState;
  onOpenOffersPress?: () => void;
  onOpenExecutionPress?: () => void;
  onOpenProofCapturePress?: () => void;
};

function renderHero(state: DshEntryScreenState, onOpenOffersPress?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="لا توجد عروض نشطة الآن"
        description="أبقِ مدخل العروض ظاهرًا حتى يتمكن الكابتن من إعادة المحاولة من دون مغادرة الصدفة التشغيلية."
        actionLabel="فتح العروض"
        onActionPress={onOpenOffersPress}
      />
    );
  }

  return (
    <Card
      title="مدخل تشغيل الكابتن"
      subtitle="نقطة بداية واحدة لمراجعة العروض والتنفيذ النشط وتسليم الإثبات."
      footer={<Button label="فتح العروض" onPress={onOpenOffersPress} />}
    />
  );
}

function renderOffersSection(onOpenOffersPress?: () => void, onOpenExecutionPress?: () => void) {
  return (
    <Box gap={3}>
      <Card
        title="مراجعة العروض الواردة"
        subtitle="ابدأ من قائمة عروض الكابتن حتى يصبح قرار الإرسال التالي واضحًا خلال ثوانٍ."
        footer={<Button label="عرض العروض" tone="secondary" onPress={onOpenOffersPress} />}
      />
      <Card
        title="فتح مساحة التنفيذ"
        subtitle="العمل المقبول وأفعال الرفض والدردشة التشغيلية تبقى مجمعة في نمط كابتن واحد."
        footer={<Button label="فتح التنفيذ" tone="ghost" onPress={onOpenExecutionPress} />}
      />
    </Box>
  );
}

function renderCompletionSection(onOpenProofCapturePress?: () => void) {
  return (
    <Box gap={3}>
      <Card
        title="التقاط إثبات التسليم"
        subtitle="يبقى رفع الإثبات بوابة إغلاق واضحة قبل إقفال الطلب بالكامل."
        footer={<Button label="فتح إثبات التسليم" tone="secondary" onPress={onOpenProofCapturePress} />}
      />
      <Card
        title="ابقَ داخل مسار كابتن واحد"
        subtitle="تبقى المالية والطبقات والمجموعات غير الحرجة خارج هذا المدخل الأول حتى تظل إجراءات التسليم هي الأساسية."
      />
    </Box>
  );
}

export function DshCaptainEntryScreen({
  state = 'ready',
  onOpenOffersPress,
  onOpenExecutionPress,
  onOpenProofCapturePress,
}: DshEntryScreenProps) {
  return (
    <DashboardShell
      title="مدخل الكابتن"
      subtitle="مدخل أحادي الغرض لعمليات تسليم app-captain وأول خطوة إرسال."
      hero={renderHero(state, onOpenOffersPress)}
      sections={
        state === 'ready'
          ? [
              {
                title: 'العروض والقبول',
                subtitle: 'نمط مدخل قائمة مفتوحة وتسليم التنفيذ للكابتن.',
                content: renderOffersSection(onOpenOffersPress, onOpenExecutionPress),
              },
              {
                title: 'التنفيذ والإثبات',
                subtitle: 'تظل بوابة الإتمام وتسليم التقاط الإثبات واضحة ومباشرة.',
                content: renderCompletionSection(onOpenProofCapturePress),
              },
            ]
          : [
              {
                title: 'حالة المدخل',
                subtitle: 'تحتفظ الشاشة بهدف واحد واضح للكابتن أثناء التعامل مع الحالات الأساسية.',
                content: (
                  <Box>
                    <Text role="bodyMd" tone="muted">
                      حالة المدخل نشطة. لا يتم تنفيذ منطق أعمال أو طلبات شبكة هنا.
                    </Text>
                  </Box>
                ),
              },
            ]
      }
    />
  );
}

export { DshCaptainEntryScreen as DshEntryScreen };
