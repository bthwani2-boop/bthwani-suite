'use client';

import React from 'react';
import { Text, Box } from '@bthwani/ui-kit';

export type CommandCenterScreenProps = { hubHref: string; };

export function CommandCenterScreen({ hubHref }: CommandCenterScreenProps) {
  return (
    <Box gap={4}>
      <Box gap={1}>
        <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>غرفة القيادة</Text>
        <Text role="bodySm" tone="muted">متابعة الأداء العام والتدخلات السريعة</Text>
      </Box>

      {/* Operational Pulse Content */}
      <Box style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(10, 47, 92, 0.05)', borderStyle: 'solid' }}>
        <Text role="bodySm">لا توجد تنبيهات حرجة حالياً. النظام يعمل بكفاءة.</Text>
      </Box>
    </Box>
  );
}

export default CommandCenterScreen;
