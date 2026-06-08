'use client';

import React from 'react';
import { MarketingReviewBoard } from './parts/MarketingReviewBoard';

export function ControlPanelDshMarketingApprovalScreen() {
  return (
    <MarketingReviewBoard
      kind="approval"
      title="اعتماد الحملات والعروض"
      purpose="إبقاء الاعتماد ومراجعة الفيديو وبوابة الإصدار مرئية في مساحة مضغوطة."
    />
  );
}

export default ControlPanelDshMarketingApprovalScreen;
