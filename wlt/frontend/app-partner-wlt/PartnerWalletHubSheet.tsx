import React from 'react';
import { Box, Button, colorPalette, Icon, SheetFrame, Text } from '@bthwani/ui-kit';

export type PartnerWalletHubDestination =
  | 'wlt_sudad_home'
  | 'wlt_partner_ledger_get'
  | 'wlt_partner_finance_overview'
  | 'wlt_partner_settlements_list'
  | 'wlt_payouts_list'
  | 'wlt_payout_request'
  | 'partner_subscription';

type WalletAction = {
  id: PartnerWalletHubDestination;
  label: string;
  subtitle: string;
  icon: string;
  enabled: boolean;
};

type PartnerWalletHubSheetProps = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (destination: PartnerWalletHubDestination) => void;
};

const walletActions: readonly WalletAction[] = [
  {
    id: 'wlt_sudad_home',
    label: 'سداد',
    subtitle: 'الدفع والتحصيل من قناة مالية موحّدة.',
    icon: 'receipt-outline',
    enabled: true,
  },
  {
    id: 'wlt_partner_ledger_get',
    label: 'دفتر الحساب',
    subtitle: 'تتبّع الحركات والقيود المالية بشكل واضح.',
    icon: 'book-outline',
    enabled: true,
  },
  {
    id: 'wlt_partner_finance_overview',
    label: 'نظرة مالية',
    subtitle: 'ملخص الأداء المالي والموقف الحالي.',
    icon: 'analytics-outline',
    enabled: true,
  },
  {
    id: 'wlt_partner_settlements_list',
    label: 'التسويات',
    subtitle: 'مراجعة التسويات المفتوحة والمغلقة.',
    icon: 'document-text-outline',
    enabled: true,
  },
  {
    id: 'wlt_payouts_list',
    label: 'المدفوعات',
    subtitle: 'عرض المدفوعات السابقة والدفعات الجارية.',
    icon: 'card-outline',
    enabled: true,
  },
  {
    id: 'wlt_payout_request',
    label: 'طلب سحب',
    subtitle: 'تقديم طلب السحب من نفس المسار المالي.',
    icon: 'wallet-outline',
    enabled: true,
  },
  {
    id: 'partner_subscription',
    label: 'الاشتراك والفوترة',
    subtitle: 'متاح الآن داخل مسار الشريك الحالي.',
    icon: 'diamond-outline',
    enabled: true,
  },
];

export function PartnerWalletHubSheet({ visible, onClose, onNavigate }: PartnerWalletHubSheetProps) {
  return (
    <SheetFrame visible={visible} title="المحفظة والحسابات المالية" onClose={onClose}>
      <Text role="bodySm" tone="muted">
        نافذة مالية موحدة. العناصر غير المتاحة بعد ستظل قيد الإتاحة بدون روابط وهمية.
      </Text>

      <Box gap={2}>
        {walletActions.map((action) => (
          <Button
            key={action.id}
            label={action.label}
            tone={action.enabled ? 'secondary' : 'ghost'}
            disabled={!action.enabled}
            leadingAccessory={<Icon name={action.icon as any} size={16} color={action.enabled ? colorPalette.brandStrong : colorPalette.disabledInk} />}
            trailingAccessory={
              action.enabled ? (
                <Icon name="chevron-back" size={16} color={colorPalette.brandStrong} />
              ) : (
                <Text role="caption" tone="muted">
                  قريبًا
                </Text>
              )
            }
            onPress={() => {
              if (!action.enabled) {
                return;
              }
              onNavigate(action.id);
              onClose();
            }}
          />
        ))}
      </Box>
    </SheetFrame>
  );
}

export default PartnerWalletHubSheet;
