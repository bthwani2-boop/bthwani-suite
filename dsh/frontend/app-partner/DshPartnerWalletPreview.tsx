import React from 'react';
import { Box, Surface, Text, Icon, Button } from '@bthwani/ui-kit';

export type DshPartnerWalletPreviewProps = {
  onBack?: () => void;
  onOpenExpandedWallet?: () => void;
};

export function DshPartnerWalletPreview({ onBack, onOpenExpandedWallet }: DshPartnerWalletPreviewProps) {
  return (
    <Surface tone="raised" padding={4} gap={4} style={{ flex: 1 }}>
      <Box layoutDirection="row" align="center" gap={3}>
        <Surface tone="brand" padding={2} radiusToken="md">
          <Icon name="wallet-outline" size={24} tone="brandContrast" />
        </Surface>
        <Box gap={1}>
          <Text role="titleSm">المحفظة الرقمية</Text>
          <Text role="caption" tone="muted">مساحة معاينة واجهة المحفظة [UI_PREVIEW_ONLY]</Text>
        </Box>
      </Box>

      <Surface tone="inset" padding={4} gap={3} radiusToken="lg">
        <Text role="label" tone="muted">الرصيد المتاح</Text>
        <Text role="titleLg" style={{ color: '#0A2F5C' }}>٣,٤٢٠.٠٠ ر.س</Text>
        <Box layoutDirection="row" gap={2}>
          <Text role="caption" tone="success">↑ +١٢٪ هذا الأسبوع</Text>
        </Box>
      </Surface>

      <Box gap={3}>
        <Text role="bodyStrong">آخر العمليات</Text>
        {[
          { id: '1', title: 'تسوية مبيعات الأمس', amount: '+٤٥٠.٠٠ ر.س', date: 'اليوم، ٠٨:٠٠ ص' },
          { id: '2', title: 'عمولة منصة بثواني', amount: '-٤٥.٠٠ ر.س', date: 'أمس، ١٠:٣٠ م' },
        ].map(item => (
          <Surface key={item.id} tone="default" padding={3} layoutDirection="row" align="center" justify="space-between">
            <Box gap={1}>
              <Text role="bodySm">{item.title}</Text>
              <Text role="caption" tone="muted">{item.date}</Text>
            </Box>
            <Text role="bodySm" tone={item.amount.startsWith('+') ? 'success' : 'danger'}>{item.amount}</Text>
          </Surface>
        ))}
      </Box>

      <Box gap={2} marginTop="auto">
        <Button label="عرض تفاصيل المحفظة الكاملة" tone="primary" onPress={onOpenExpandedWallet} />
        <Button label="رجوع" tone="ghost" onPress={onBack} />
      </Box>

      <Surface tone="default" padding={2} radiusToken="sm" style={{ backgroundColor: '#FEF3C7' }}>
        <Text role="caption" style={{ color: '#D97706', textAlign: 'center' }}>
          هذه الواجهة هي معاينة محلية لـ DSH. الربط الفعلي مع WLT يتطلب Public Boundary.
        </Text>
      </Surface>
    </Surface>
  );
}

export default DshPartnerWalletPreview;
