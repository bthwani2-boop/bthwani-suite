import React from 'react';
import { View } from 'react-native';
import { BthSurface, BthText } from '@bthwani/ui-kit';

export function DshProxyHubScreen(props: any) {
  return (
    <BthSurface tone="raised" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <BthText role="bodySm">وحدة الوكيل (عنصر نائب) — DshProxyHubScreen</BthText>
    </BthSurface>
  );
}

export default DshProxyHubScreen;
