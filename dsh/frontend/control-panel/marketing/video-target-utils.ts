import type { MarketingVideoRecord } from '../../shared/dsh-marketing-types';
import type { VideoDraft } from './video-types';

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
