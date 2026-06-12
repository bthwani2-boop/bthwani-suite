'use client';

import React from 'react';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';
import { WebControlPanelRecommendation } from '@bthwani/ui-kit/web';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame } from '../../shared';
import {
  getCampaignItems,
  upsertCampaignItem,
  getMarketingVideoItems,
  upsertMarketingVideoItem,
} from '../../../data/legacy-preview/marketing.preview-data';
import { getPartnerOfferItems, approvePartnerOfferItem, rejectPartnerOfferItem } from '../../../data/legacy-preview/offers.preview-data';
import { useMarketingPermissions } from '../marketing-permissions.contract';

export type MarketingReviewKind = 'approval' | 'video';

export type MarketingReviewRow = Record<'id' | 'title', string> & {
  status: string;
  ownerSurface: string;
  blocker: string;
  evidence: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  evidenceActionLabel: string;
  tone: 'brand' | 'best' | 'warning' | 'danger';
};

export function buildMarketingRows(kind: MarketingReviewKind): MarketingReviewRow[] {
  if (kind === 'approval') {
    const pendingCampaigns = getCampaignItems().filter(c => c.status === 'pending');
    const reviewOffers = getPartnerOfferItems().filter(o => o.status === 'review');
    const campaignRows: MarketingReviewRow[] = pendingCampaigns.map(c => ({
      id: c.id,
      title: c.title,
      status: 'بانتظار الموافقة',
      ownerSurface: 'marketing',
      blocker: `الحملة "${c.title}" بانتظار اعتماد التسويق قبل النشر.`,
      evidence: `الهدف: ${c.goal} · الأولوية: ${c.priority} · القنوات: ${c.channels.length}`,
      primaryActionLabel: 'اعتماد ونشر',
      secondaryActionLabel: 'إعادة للمسودة',
      evidenceActionLabel: 'فتح تفاصيل الحملة',
      tone: 'warning' as const,
    }));
    const offerRows: MarketingReviewRow[] = reviewOffers.map(o => ({
      id: o.id,
      title: o.title,
      status: 'قيد المراجعة',
      ownerSurface: 'marketing',
      blocker: `عرض "${o.title}" من ${o.partnerName} — ينتظر اعتماد التسويق للانتقال إلى marketing-ready.`,
      evidence: `النوع: ${o.offerType} · القيمة: ${o.valueLabel}`,
      primaryActionLabel: 'قبول للتسويق',
      secondaryActionLabel: 'رفض العرض',
      evidenceActionLabel: 'فتح بوابة العرض',
      tone: 'brand' as const,
    }));
    const rows = [...campaignRows, ...offerRows];
    if (rows.length === 0) {
      return [{ id: 'empty-approval', title: 'لا توجد عناصر تحتاج اعتماداً حالياً', status: 'فارغ', ownerSurface: 'marketing', blocker: 'كل الحملات والعروض في حالة مستقرة.', evidence: 'لا يوجد دليل مطلوب', primaryActionLabel: 'اعتماد', secondaryActionLabel: 'طلب تعديل', evidenceActionLabel: 'فتح التسليم', tone: 'best' as const }];
    }
    return rows;
  }

  const videoRows = getMarketingVideoItems().filter(v => v.reviewState === 'pending' || v.reviewState === 'none');
  const rows: MarketingReviewRow[] = videoRows.map(v => ({
    id: v.id,
    title: v.title,
    status: v.reviewState === 'pending' ? 'قيد المراجعة' : 'لم يُرسَل بعد',
    ownerSurface: 'marketing',
    blocker: v.reviewState === 'pending' ? `الفيديو "${v.title}" ينتظر قرار الاعتماد أو الرفض.` : `الفيديو "${v.title}" لم يُرسَل للمراجعة بعد.`,
    evidence: `المدة: ${v.durationSeconds}ث · الجمهور: ${v.audience}`,
    primaryActionLabel: 'اعتماد',
    secondaryActionLabel: 'رفض',
    evidenceActionLabel: 'فتح الفيديو',
    tone: v.reviewState === 'pending' ? 'warning' as const : 'brand' as const,
  }));
  if (rows.length === 0) {
    return [{ id: 'empty-video', title: 'لا توجد فيديوهات بانتظار المراجعة', status: 'فارغ', ownerSurface: 'marketing', blocker: 'كل الفيديوهات معتمدة أو مرفوضة.', evidence: 'لا يوجد دليل مطلوب', primaryActionLabel: 'اعتماد', secondaryActionLabel: 'رفض', evidenceActionLabel: 'فتح الدليل', tone: 'best' as const }];
  }
  return rows;
}

export type MarketingReviewBoardProps = Record<'title', string> & {
  purpose: string;
  kind: MarketingReviewKind;
};

export function MarketingReviewBoard({
  title,
  purpose,
  kind,
}: MarketingReviewBoardProps) {
  const { hasPermission } = useMarketingPermissions();
  const [items, setItems] = React.useState(() => buildMarketingRows(kind));
  const refresh = React.useCallback(() => setItems(buildMarketingRows(kind)), [kind]);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);
  const [lastAction, setLastAction] = React.useState('جاهز للمراجعة التسويقية');
  const [confirmPending, setConfirmPending] = React.useState<{ targetRef: string; type: 'primary' | 'secondary'; label: string } | null>(null);
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  const applyPrimaryAction = React.useCallback((targetRef: string) => {
    if (kind === 'approval') {
      const campaigns = getCampaignItems();
      const campaign = campaigns.find(c => c.id === targetRef);
      if (campaign) { upsertCampaignItem({ ...campaign, status: 'published' }); refresh(); return; }
      approvePartnerOfferItem(targetRef);
      refresh();
    } else {
      const videos = getMarketingVideoItems();
      const video = videos.find(v => v.id === targetRef);
      if (video) { upsertMarketingVideoItem({ ...video, reviewState: 'approved' }); refresh(); }
    }
  }, [kind, refresh]);

  const applySecondaryAction = React.useCallback((targetRef: string) => {
    if (kind === 'approval') {
      const campaigns = getCampaignItems();
      const campaign = campaigns.find(c => c.id === targetRef);
      if (campaign) { upsertCampaignItem({ ...campaign, status: 'draft' }); refresh(); return; }
      const offers = getPartnerOfferItems();
      const offer = offers.find(o => o.id === targetRef);
      if (offer) { rejectPartnerOfferItem(offer.id, 'مرفوض من صف المراجعة التسويقية.'); refresh(); return; }
    } else {
      const videos = getMarketingVideoItems();
      const video = videos.find(v => v.id === targetRef);
      if (video) { upsertMarketingVideoItem({ ...video, reviewState: 'rejected' }); refresh(); }
    }
  }, [kind, refresh]);

  const executeConfirm = React.useCallback(() => {
    if (!confirmPending) return;
    const item = items.find(i => i.id === confirmPending.targetRef);
    if (!item) { setConfirmPending(null); return; }
    if (confirmPending.type === 'primary') {
      applyPrimaryAction(confirmPending.targetRef);
      setLastAction(`${item.primaryActionLabel}: ${item.title}`);
    } else {
      applySecondaryAction(confirmPending.targetRef);
      setLastAction(`${item.secondaryActionLabel}: ${item.title}`);
    }
    setConfirmPending(null);
  }, [confirmPending, items, applyPrimaryAction, applySecondaryAction]);

  const cancelConfirm = React.useCallback(() => setConfirmPending(null), []);

  const selectedItem2 = selectedItem;

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

      {confirmPending && (
        <Surface tone="inset" padding={4} gap={3}>
          <Text role="bodyStrong">{confirmPending.label}</Text>
          <Box layoutDirection="row" gap={2}>
            <Button label="تأكيد" tone="danger" size="sm" fullWidth={false} onPress={executeConfirm} disabled={confirmPending.type === 'primary' ? !hasPermission('marketing.approve') : !hasPermission('marketing.edit')} />
            <Button label="إلغاء" tone="ghost" size="sm" fullWidth={false} onPress={cancelConfirm} />
          </Box>
        </Surface>
      )}

      <ControlPanelDshActionQueue
        title={kind === 'approval' ? 'صف الاعتماد' : 'صف الفيديو'}
        purpose="اختر صفاً، اعتمد أو اطلب تعديلاً، ثم افتح الدليل أو التسليم محلياً."
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => {
          if (item.id.startsWith('empty')) return;
          setSelectedId(item.id);
          setConfirmPending({ targetRef: item.id, type: 'primary', label: `${item.primaryActionLabel}: "${item.title}"` });
        }}
        secondaryAction={(item) => {
          if (item.id.startsWith('empty')) return;
          setSelectedId(item.id);
          setConfirmPending({ targetRef: item.id, type: 'secondary', label: `${item.secondaryActionLabel}: "${item.title}"` });
        }}
        evidenceAction={(item) => {
          setSelectedId(item.id);
          setLastAction(kind === 'approval' ? `فتح التسليم: ${item.title}` : `فتح الدليل: ${item.title}`);
        }}
      />

      <WebControlPanelRecommendation
        title={kind === 'approval' ? 'تسليم التسويق' : 'دليل الفيديو'}
        reason={selectedItem2 ? `${selectedItem2.title} · ${selectedItem2.evidence}` : 'اختر صفاً للمتابعة.'}
        primaryAction={selectedItem2 && !selectedItem2.id.startsWith('empty') ? {
          id: 'approve',
          label: selectedItem2.primaryActionLabel,
          onAction: () => setConfirmPending({ targetRef: selectedItem2.id, type: 'primary', label: `${selectedItem2.primaryActionLabel}: "${selectedItem2.title}"` }),
        } : undefined}
        secondaryAction={selectedItem2 && !selectedItem2.id.startsWith('empty') ? {
          id: 'edit',
          label: selectedItem2.secondaryActionLabel,
          onAction: () => setConfirmPending({ targetRef: selectedItem2.id, type: 'secondary', label: `${selectedItem2.secondaryActionLabel}: "${selectedItem2.title}"` }),
        } : undefined}
      />
    </Box>
  );
}
