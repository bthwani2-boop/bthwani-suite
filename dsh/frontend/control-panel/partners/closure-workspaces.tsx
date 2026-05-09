import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { WebControlPanelRecommendation } from '@bthwani/ui-kit/web';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame } from '../shared';

type PartnerReviewKind = 'activation' | 'documents';

function buildPartnerRows(kind: PartnerReviewKind) {
  const baseRows = kind === 'activation'
    ? [
        { id: 'partner-activation', title: 'تفعيل الشريك', status: 'معلق', blocker: 'جاهزية التفعيل تحتاج تأكيداً.', evidence: 'دليل حزمة التفعيل', tone: 'warning' as const },
        { id: 'catalog-handoff', title: 'تسليم الكتالوج', status: 'جاهز', blocker: 'تسليم الكتالوج يجب الإقرار به محلياً.', evidence: 'دليل تسليم الكتالوج', tone: 'brand' as const },
        { id: 'marketing-handoff', title: 'تسليم التسويق', status: 'متابَع', blocker: 'تسليم التسويق لا يزال يحتاج فحص مسار نهائي.', evidence: 'دليل مسار التسويق', tone: 'best' as const },
      ]
    : [
        { id: 'identity-proof', title: 'إثبات الهوية', status: 'معلق', blocker: 'دليل الهوية ناقص أو غير مكتمل.', evidence: 'وثائق الهوية', tone: 'warning' as const },
        { id: 'store-nomination', title: 'ترشيح المتجر', status: 'جاهز', blocker: 'ترشيح المتجر يحتاج مراجعة محلية.', evidence: 'دليل ترشيح المتجر', tone: 'brand' as const },
        { id: 'document-completeness', title: 'اكتمال الوثائق', status: 'متابَع', blocker: 'الحزمة قريبة من الاكتمال لكنها تحتاج توقيعاً.', evidence: 'دليل اكتمال الوثائق', tone: 'best' as const },
      ];

  return baseRows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    ownerSurface: 'partners',
    blocker: row.blocker,
    evidence: row.evidence,
    primaryActionLabel: 'اعتماد',
    secondaryActionLabel: 'طلب وثائق',
    evidenceActionLabel: kind === 'activation' ? 'فتح التسليم' : 'فتح العائق',
    tone: row.tone,
  }));
}

function PartnerReviewBoard({
  title,
  purpose,
  kind,
}: {
  title: string;
  purpose: string;
  kind: PartnerReviewKind;
}) {
  const items = React.useMemo(() => buildPartnerRows(kind), [kind]);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);
  const [lastAction, setLastAction] = React.useState('جاهز لمراجعة الشريك');
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <Box gap={4}>
      <ControlPanelDshWorkspaceFrame
        eyebrow={kind === 'activation' ? 'تفعيل الشريك' : 'مراجعة الوثائق'}
        title={title}
        description="غرفة تحكم شريك محلية مع حالة العنصر المحدد وإجراءات الاعتماد وتوجيه التسليم أو العائق الصريح."
        badges={['partners', kind]}
        metaItems={[selectedItem?.status ?? 'معلق', lastAction]}
        decisionBoard={{
          title: `لوحة ${title}`,
          purpose,
          primaryDecision: selectedItem?.status ?? 'معلق',
          nextAction: lastAction,
          blockers: selectedItem?.blocker ?? 'اختر صف شريك.',
          ownerSurface: 'partners',
          evidenceHint: selectedItem?.evidence ?? 'دليل الشريك',
          routeHint: '/partners',
          decisionTone: selectedItem?.tone,
        }}
        primaryAction={{ label: 'فتح تسليم الكتالوج', href: '/catalogs' }}
        secondaryAction={{ label: 'فتح تسليم التسويق', href: '/marketing' }}
        signals={[
          { id: `${kind}-pending`, title: 'معلق', value: 'مرئي', description: 'العناصر المعلقة لمراجعة الشريك.', tone: 'warning' },
          { id: `${kind}-ready`, title: 'جاهز', value: 'مرئي', description: 'العناصر الجاهزة للإجراء المحلي.', tone: 'best' },
          { id: `${kind}-handoff`, title: 'تسليم', value: 'متابَع', description: 'التسليم المحدد صريح.', tone: 'brand' },
        ]}
      />

      <ControlPanelDshActionQueue
        title={kind === 'activation' ? 'صف التفعيل' : 'صف الوثائق'}
        purpose="اختر صفاً، اعتمد أو اطلب وثائق، ثم افتح التسليم أو العائق محلياً."
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => {
          setSelectedId(item.id);
          setLastAction(`اعتماد: ${item.title}`);
        }}
        secondaryAction={(item) => {
          setSelectedId(item.id);
          setLastAction(`طلب وثائق: ${item.title}`);
        }}
        evidenceAction={(item) => {
          setSelectedId(item.id);
          setLastAction(kind === 'activation' ? `فتح التسليم: ${item.title}` : `فتح العائق: ${item.title}`);
        }}
      />

      <WebControlPanelRecommendation
        title={kind === 'activation' ? 'تسليم الشريك' : 'عائق الوثيقة'}
        reason={selectedItem ? `${selectedItem.title} · ${selectedItem.evidence}` : 'اختر صفاً للمتابعة.'}
        primaryAction={selectedItem ? {
          id: 'approve',
          label: 'اعتماد',
          onAction: () => selectedItem && setLastAction(`اعتماد: ${selectedItem.title}`),
        } : undefined}
        secondaryAction={selectedItem ? {
          id: 'request-docs',
          label: 'طلب وثائق',
          onAction: () => selectedItem && setLastAction(`طلب وثائق: ${selectedItem.title}`),
        } : undefined}
      />
    </Box>
  );
}

export function ControlPanelDshPartnerActivationScreen() {
  return (
    <PartnerReviewBoard
      kind="activation"
      title="استقبال تفعيل الشريك"
      purpose="إبقاء الاستقبال والتفعيل ومراجعة الوثائق في غرفة تحكم مضغوطة."
    />
  );
}

export function ControlPanelDshPartnerDocumentReviewScreen() {
  return (
    <PartnerReviewBoard
      kind="documents"
      title="مراجعة وثائق الشريك"
      purpose="إبقاء جاهزية الشريك مرتبطة بدليل الوثيقة وتسليم التفعيل."
    />
  );
}

export default ControlPanelDshPartnerActivationScreen;
