// Canonical location: dsh/frontend/shared/adapters/marketing/video-target-utils.ts
// Authority: dsh/frontend/shared — moved from control-panel/marketing/video-target-utils.ts
// Pure resolver helpers for video target selection.
// No React dependency — all functions are pure or data-driven only.

import type { VideoDraft, VideoEditorWorkspaceTab } from '../../contracts/marketing/video-types';
import { VIDEO_TARGET_TYPE_OPTIONS } from '../../contracts/marketing/video-types';

export function getVideoTargetTypeOptions() {
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
