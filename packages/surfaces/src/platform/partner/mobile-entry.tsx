import React from 'react';
import * as ScreenModule from '../../dsh/app-partner/orders-inbox/screens/PartnerOrdersInboxScreen';

const ResolvedScreen =
  (ScreenModule as any).default ??
  (ScreenModule as any).PartnerOrdersInboxScreen;

if (!ResolvedScreen) {
  throw new Error('No usable export found in ../../dsh/app-partner/orders-inbox/screens/PartnerOrdersInboxScreen');
}

export default ResolvedScreen;
export * from '../../dsh/app-partner/orders-inbox/screens/PartnerOrdersInboxScreen';
