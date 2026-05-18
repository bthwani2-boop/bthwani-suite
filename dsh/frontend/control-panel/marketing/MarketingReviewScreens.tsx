import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { WebControlPanelRecommendation } from '@bthwani/ui-kit/web';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame } from '../shared';

type MarketingReviewKind = 'approval' | 'video';

type MarketingReviewRow = {
  id: string;
  title: string;
  status: string;
  ownerSurface: string;
  blocker: string;
  evidence: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  evidenceActionLabel: string;
  tone: 'brand' | 'best' | 'warning' | 'danger';
};

function buildMarketingRows(kind: MarketingReviewKind) {
  const baseRows = kind === 'approval'
    ? [
        { id: 'campaign-approval', title: 'اعتماد الحملة', status: 'جاهز', blocker: 'بوابة الإصدار تحتاج مراجعة محلية نهائية.', evidence: 'دليل الحملة وبوابة الإصدار', tone: 'brand' as const },
        { id: 'offer-review', title: 'مراجعة العرض', status: 'في الانتظار', blocker: 'نسخة العرض تحتاج وضوحاً قبل الإصدار.', evidence: 'نسخة العرض ودليل السياسة', tone: 'warning' as const },
        { id: 'handoff-review', title: 'مراجعة التسليم', status: 'متابَع', blocker: 'تسليم الأسطح لا يزال يحتاج تأكيداً.', evidence: 'سلسلة التسليم ودليل المالك', tone: 'best' as const },
      ]
    : [
        { id: 'video-review', title: 'مراجعة الفيديو', status: 'جاهز', blocker: 'التقديم يحتاج اعتماداً نهائياً أو تعديلاً.', evidence: 'دليل الفيديو وبوابة الإصدار', tone: 'brand' as const },
        { id: 'banner-review', title: 'مراجعة البنر', status: 'في الانتظار', blocker: 'النسخة المرئية لا تزال تحتاج قراراً محلياً.', evidence: 'دليل البنر وتسليم المسار', tone: 'warning' as const },
        { id: 'growth-review', title: 'مراجعة النمو', status: 'متابَع', blocker: 'دليل مسار النمو لا يزال ظاهراً.', evidence: 'دليل النمو وتسليم المالك', tone: 'best' as const },
      ];

  return baseRows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    ownerSurface: 'marketing',
    blocker: row.blocker,
    evidence: row.evidence,
    primaryActionLabel: 'اعتماد',
    secondaryActionLabel: 'طلب تعديل',
    evidenceActionLabel: kind === 'approval' ? 'فتح التسليم' : 'فتح الدليل',
    tone: row.tone,
  })) satisfies readonly MarketingReviewRow[];
}

function MarketingReviewBoard({
  title,
  purpose,
  kind,
}: {
  title: string;
  purpose: string;
  kind: MarketingReviewKind;
}) {
  const items = React.useMemo(() => buildMarketingRows(kind), [kind]);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);
  const [lastAction, setLastAction] = React.useState('جاهز للمراجعة التسويقية');
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <Box gap={4}>
      <ControlPanelDshWorkspaceFrame
        eyebrow={kind === 'approval' ? 'اعتماد التسويق' : 'مراجعة الفيديو'}
        title={title}
        description="مسار مراجعة تسويقية محلي مع حالة العنصر المحدد وإجراءات الاعتماد وتسليم الدليل الصريح."
        badges={['marketing', kind]}
        metaItems={[selectedItem?.status ?? 'جاهز', lastAction]}
        decisionBoard={{
          title: `لوحة ${title}`,
          purpose,
          primaryDecision: selectedItem?.status ?? 'جاهز',
          nextAction: lastAction,
          blockers: selectedItem?.blocker ?? 'اختر صف تسويق.',
          ownerSurface: 'marketing',
          evidenceHint: selectedItem?.evidence ?? 'دليل التسويق',
          routeHint: '/marketing',
          decisionTone: selectedItem?.tone,
        }}
        primaryAction={{ label: 'فتح اعتماد التسويق', href: '/marketing' }}
        secondaryAction={{ label: 'فتح لوحة المراقبة', href: '/operations?workspace=dashboard' }}
        signals={[
          { id: `${kind}-ready`, title: 'جاهز', value: 'مرئي', description: 'العناصر الجاهزة قابلة للتحديد.', tone: 'best' },
          { id: `${kind}-queued`, title: 'في الانتظار', value: 'مرئي', description: 'العناصر في الانتظار لا تزال تحتاج مراجعة.', tone: 'warning' },
          { id: `${kind}-handoff`, title: 'تسليم', value: 'متابَع', description: 'دليل التسليم صريح.', tone: 'brand' },
        ]}
      />

      <ControlPanelDshActionQueue
        title={kind === 'approval' ? 'صف الاعتماد' : 'صف الفيديو'}
        purpose="اختر صفاً، اعتمد أو اطلب تعديلاً، ثم افتح الدليل أو التسليم محلياً."
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => {
          setSelectedId(item.id);
          setLastAction(`اعتماد: ${item.title}`);
        }}
        secondaryAction={(item) => {
          setSelectedId(item.id);
          setLastAction(`طلب تعديل: ${item.title}`);
        }}
        evidenceAction={(item) => {
          setSelectedId(item.id);
          setLastAction(kind === 'approval' ? `فتح التسليم: ${item.title}` : `فتح الدليل: ${item.title}`);
        }}
      />

      <WebControlPanelRecommendation
        title={kind === 'approval' ? 'تسليم التسويق' : 'دليل الفيديو'}
        reason={selectedItem ? `${selectedItem.title} · ${selectedItem.evidence}` : 'اختر صفاً للمتابعة.'}
        primaryAction={selectedItem ? {
          id: 'approve',
          label: 'اعتماد',
          onAction: () => selectedItem && setLastAction(`اعتماد: ${selectedItem.title}`),
        } : undefined}
        secondaryAction={selectedItem ? {
          id: 'edit',
          label: 'طلب تعديل',
          onAction: () => selectedItem && setLastAction(`طلب تعديل: ${selectedItem.title}`),
        } : undefined}
      />
    </Box>
  );
}

export function ControlPanelDshMarketingApprovalScreen() {
  return (
    <MarketingReviewBoard
      kind="approval"
      title="اعتماد الحملات والعروض"
      purpose="إبقاء الاعتماد ومراجعة الفيديو وبوابة الإصدار مرئية في مساحة مضغوطة."
    />
  );
}

export function ControlPanelDshVideoSubmissionsReviewScreen() {
  return (
    <MarketingReviewBoard
      kind="video"
      title="مراجعة تقديمات فيديو الشركاء"
      purpose="إبقاء مراجعة الفيديو مرتبطة بقرار الإصدار بدلاً من ملخص عام."
    />
  );
}

export default ControlPanelDshMarketingApprovalScreen;
