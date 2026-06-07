'use client';

import React from 'react';
import { MarketingReviewBoard } from './parts/MarketingReviewBoard';

export function ControlPanelDshVideoSubmissionsReviewScreen() {
  return (
    <MarketingReviewBoard
      kind="video"
      title="مراجعة تقديمات فيديو الشركاء"
      purpose="إبقاء مراجعة الفيديو مرتبطة بقرار الإصدار بدلاً من ملخص عام."
    />
  );
}

export default ControlPanelDshVideoSubmissionsReviewScreen;
