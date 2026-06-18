// Pure resolver helpers for banner and video target selection.
// No React dependency — all functions are pure or data-driven only.

import type { MarketingBannerRecord, SmartBannerTargetType, SmartTargetSummary, BannerDraft, VideoDraft, VideoEditorWorkspaceTab, MarketingVideoTargetType, MarketingVideoRecord } from './marketing.types';
import { SMART_TARGET_OPTIONS, SUBSCRIPTION_OPTIONS, VIDEO_TARGET_TYPE_OPTIONS } from './marketing.types';

// ── Banner helpers ─────────────────────────────────────────────────────────

export function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

export function getAvailableTargetTypes(): ReadonlyArray<{ value: SmartBannerTargetType; label: string; description: string }> {
  return SMART_TARGET_OPTIONS;
}

export function getSubscriptionOptions(): ReadonlyArray<{ value: string; label: string }> {
  return SUBSCRIPTION_OPTIONS;
}

export function buildSmartTargetSummary(draft: Pick<BannerDraft, 'targetType' | 'targetId'>): SmartTargetSummary {
  const option = SMART_TARGET_OPTIONS.find((o) => o.value === draft.targetType);
  return {
    type: draft.targetType,
    id: draft.targetId || undefined,
    label: option?.label ?? draft.targetType,
  };
}

export function isBannerPublishable(banner: Pick<MarketingBannerRecord, 'imageUrl' | 'title'>): boolean {
  return Boolean(banner.imageUrl && banner.title);
}

// ── Video helpers ──────────────────────────────────────────────────────────

export function getVideoTargetTypeOptions(): Array<{ value: MarketingVideoTargetType; label: string; description: string }> {
  return VIDEO_TARGET_TYPE_OPTIONS;
}

export function getDefaultVideoDraft(): VideoDraft {
  return {
    title: '',
    subtitle: '',
    videoUrl: '',
    posterUrl: '',
    durationSeconds: '0',
    ctaLabel: '',
    highlight: '',
    targetId: '',
    targetExtra: '',
    order: '0',
    status: 'draft',
    audience: 'all',
    source: 'marketing',
    mute: true,
    autoplay: true,
    loop: true,
    targetType: 'home',
    reviewState: 'none',
  };
}

export function getVideoEditorTabs(): ReadonlyArray<{ id: VideoEditorWorkspaceTab; label: string }> {
  return [
    { id: 'content', label: 'المحتوى' },
    { id: 'media', label: 'الوسائط' },
    { id: 'target', label: 'الاستهداف' },
    { id: 'publish', label: 'النشر' },
  ];
}

export function createDraft(item?: MarketingVideoRecord | null): VideoDraft {
  const id = item?.id;
  const title = item?.title ?? '';
  const subtitle = item?.subtitle ?? '';
  const status = item?.status ?? 'draft';
  const audience = item?.audience ?? 'client';
  const source = item?.source ?? 'marketing';
  const videoUrl = item?.videoUrl ?? '';
  const posterUrl = item?.posterUrl ?? '';
  const durationSeconds = String(item?.durationSeconds ?? 15);
  const mute = item?.mute ?? true;
  const autoplay = item?.autoplay ?? true;
  const loop = item?.loop ?? true;
  const ctaLabel = item?.ctaLabel ?? 'اكتشف الآن';
  const highlight = item?.highlight ?? '';
  const targetType = item?.targetType ?? 'home';
  const targetId = item?.targetId ?? 'home';
  const targetExtra = item?.targetExtra ?? '';
  const order = String(item?.order ?? 1);
  const reviewState = item?.reviewState ?? 'none';

  return {
    id,
    title,
    subtitle,
    status,
    audience,
    source,
    videoUrl,
    posterUrl,
    durationSeconds,
    mute,
    autoplay,
    loop,
    ctaLabel,
    highlight,
    targetType,
    targetId,
    targetExtra,
    order,
    reviewState,
  };
}
