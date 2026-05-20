import React from 'react';
import { Pressable, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  KeyValueList,
  MobileScrollView,
  StateView,
  Surface,
  Text,
  TopBar,
  useDirection,
  useTheme,
  ActionStrip,
  Divider,
} from '@bthwani/ui-kit';
import type { WltDshPartnerWalletTransaction } from './wlt-dsh-partner.adapter';
import { useWltDshPartnerWalletPreview } from './useWltDshPartnerWalletPreview';
import { getWltDshPartnerCommissionLabel, getWltDshPartnerOperationalModeCommission } from './wlt-dsh-partner.ui-copy';
import {
  getWltDshStoreDeliveryFinancePreview,
  getWltDshOrderCommissionBreakdown,
  type WltDshFulfillmentMode,
  type WltDshOrderLineItemApplicability,
} from '../../shared/finance';

type PartnerDshWalletViewState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'no-transactions';
type PartnerDshWalletActionId = 'expanded-wallet' | 'settlements' | 'report';
type PartnerDshTransactionTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

type ServiceModeInput = {
  id: string;
  enabled: boolean;
};

export type PartnerDshWalletTransaction = WltDshPartnerWalletTransaction;

export type PartnerDshWalletBridgeProps = {
  state?: PartnerDshWalletViewState;
  financialActionsDisabled?: boolean;
  branchLabel?: string;
  activeZoneLabel?: string;
  serviceModes?: readonly ServiceModeInput[];
  transactions?: readonly PartnerDshWalletTransaction[];
  onBack?: () => void;
  onOpenExpandedWallet?: () => void;
  onOpenSettlementReview?: () => void;
  onOpenFinancialReport?: () => void;
};

type WalletStateCopy = {
  stateId?: 'loading' | 'empty' | 'recoverableError' | 'offline';
  title: string;
  description: string;
  actionLabel?: string;
};

const screenBottomInset = 132;

function resolveStateCopy(state: Exclude<PartnerDshWalletViewState, 'ready' | 'no-transactions'>): WalletStateCopy {
  if (state === 'loading') {
    return {
      stateId: 'loading',
      title: 'جار تجهيز مساحة المالية',
      description: 'نرتب الرصيد والتسويات وآخر الحركات داخل مساحة واحدة للشريك.',
      actionLabel: 'إعادة المحاولة',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty',
      title: 'لا توجد بيانات مالية الآن',
      description: 'ستظهر هنا حركة الرصيد والتسويات والحسابات عند توفرها لهذا الفرع.',
      actionLabel: 'العودة',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline',
      title: 'المساحة المالية غير متصلة',
      description: 'أعد الاتصال لمتابعة الرصيد والتحصيل وآخر الحركات بدون مغادرة مساحة الشريك.',
      actionLabel: 'إعادة المحاولة',
    };
  }

  return {
    stateId: 'recoverableError',
    title: 'تعذر تحميل الصفحة المالية',
    description: 'أعد المحاولة لاسترجاع الملخص والحركات من نفس المسار.',
    actionLabel: 'إعادة المحاولة',
  };
}

function resolveToneColor(
  theme: ReturnType<typeof useTheme>['theme'],
  tone: PartnerDshTransactionTone | undefined,
) {
  if (tone === 'success') {
    return theme.success;
  }

  if (tone === 'warning') {
    return theme.warning;
  }

  if (tone === 'danger') {
    return theme.danger;
  }

  if (tone === 'info') {
    return theme.info;
  }

  return theme.brand;
}

function resolveBranchShortLabel(branchLabel?: string) {
  if (!branchLabel) {
    return 'الفرع الحالي';
  }

  const segments = branchLabel.split('،').map((segment) => segment.trim()).filter(Boolean);

  return segments.at(-1) ?? branchLabel;
}

function resolveLinkedScopeLabel(activeZoneLabel?: string, branchLabel?: string) {
  const branchShortLabel = resolveBranchShortLabel(branchLabel);

  if (!activeZoneLabel) {
    return branchShortLabel;
  }

  const primaryZone = activeZoneLabel.split('/').map((segment) => segment.trim()).filter(Boolean)[0];

  return primaryZone ? `${primaryZone} / ${branchShortLabel}` : branchShortLabel;
}

function resolveServiceModeEnabled(serviceModes: readonly ServiceModeInput[] | undefined, modeId: 'pickup' | 'partner_delivery' | 'bthwani_delivery', fallback: boolean) {
  const matched = serviceModes?.find((mode) => {
    if (modeId === 'pickup') return mode.id === 'pickup';
    // transitional aliases: legacy `delivery` plus textual `store delivery` / `partner delivery`
    // all map to canonical `partner_delivery` which is displayed as "توصيل المتجر".
    if (modeId === 'partner_delivery') {
      return mode.id === 'partner_delivery'
        || mode.id === 'partner delivery'
        || mode.id === 'delivery'
        || mode.id === 'store-delivery'
        || mode.id === 'store delivery';
    }
    // transitional aliases: legacy 'scheduled' / 'seconds' map to bthwani_delivery
    return mode.id === 'bthwani_delivery' || mode.id === 'scheduled' || mode.id === 'seconds';
  });

  return matched?.enabled ?? fallback;
}

function formatApplicability(app: WltDshOrderLineItemApplicability) {
  if (app.applies) {
    if (app.label === 'UI_PREVIEW_ONLY — WLT') {
      return 'تُحدد بواسطة WLT (قيد المعاينة)';
    }
    if (app.label === 'UI_PREVIEW_ONLY — حسب سياسة المتجر') {
      return 'حسب سياسة المتجر';
    }
    if (app.label === 'UI_PREVIEW_ONLY — حسب اتفاق المتجر') {
      return 'حسب اتفاق المتجر';
    }
    return app.label;
  }
  return app.reason;
}

function CompactMetric({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: PartnerDshTransactionTone;
}) {
  const { theme } = useTheme();
  const accentColor = resolveToneColor(theme, tone);

  return (
    <View
      style={{
        flex: 1,
        minWidth: 98,
        borderWidth: 1,
        borderColor: accentColor,
        borderRadius: 18,
        backgroundColor: theme.surface,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 6,
      }}
    >
      <Text role="caption" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>
        {label}
      </Text>
      <Text role="titleSm" style={{ textAlign: 'right', color: accentColor }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}



export function PartnerDshWalletBridgeView({
  state = 'ready',
  financialActionsDisabled = false,
  branchLabel = 'فرع الياسمين',
  activeZoneLabel = 'الياسمين / الندى',
  serviceModes,
  transactions,
  onBack,
  onOpenExpandedWallet,
  onOpenSettlementReview,
  onOpenFinancialReport,
}: PartnerDshWalletBridgeProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const { partnerPreview, previewTransactions } = useWltDshPartnerWalletPreview();
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string | null>(null);
  const [selectedModeId, setSelectedModeId] = React.useState<'pickup' | 'partner_delivery' | 'bthwani_delivery' | null>(null);
  const [activeTab, setActiveTab] = React.useState<'summary' | 'cycle' | 'transactions' | 'modes' | 'courier' | null>('summary');

  const linkedScopeLabel = React.useMemo(() => resolveLinkedScopeLabel(activeZoneLabel, branchLabel), [activeZoneLabel, branchLabel]);
  const storeDeliveryPreview = React.useMemo(() => getWltDshStoreDeliveryFinancePreview(), []);

  const sourceTransactions = transactions ?? previewTransactions;
  const visibleTransactions = state === 'no-transactions' ? [] : sourceTransactions;
  const selectedTransaction = visibleTransactions.find((item) => item.id === selectedTransactionId) ?? null;

  if (state !== 'ready' && state !== 'no-transactions') {
    const stateCopy = resolveStateCopy(state);

    return (
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: screenBottomInset }}>
        <TopBar
          variant="secondary"
          title="المحفظة والحسابات المالية"
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={onBack ? {
            id: 'back',
            icon: <Icon name="arrow-back" size={24} tone="brand" />,
            mirrorInRtl: true,
            accessibilityLabel: 'رجوع',
            onPress: onBack,
          } : undefined}
        />
        <StateView {...stateCopy} onActionPress={onBack} />
      </MobileScrollView>
    );
  }

  function openAction(actionId: PartnerDshWalletActionId) {
    if (actionId === 'expanded-wallet' && onOpenExpandedWallet) {
      onOpenExpandedWallet();
    } else if (actionId === 'settlements' && onOpenSettlementReview) {
      onOpenSettlementReview();
    } else if (actionId === 'report' && onOpenFinancialReport) {
      onOpenFinancialReport();
    }
  }

  const commissionRows = [
    {
      id: 'pickup' as const,
      title: 'استلم بنفسك',
      percentage: getWltDshPartnerCommissionLabel(getWltDshPartnerOperationalModeCommission('pickup')),
      icon: 'hand-left-outline' as const,
      enabled: resolveServiceModeEnabled(serviceModes, 'pickup', true),
    },
    {
      id: 'partner_delivery' as const,
      title: 'توصيل المتجر',
      percentage: getWltDshPartnerCommissionLabel(getWltDshPartnerOperationalModeCommission('partner_delivery')),
      icon: 'storefront-outline' as const,
      enabled: resolveServiceModeEnabled(serviceModes, 'partner_delivery', true),
    },
    {
      id: 'bthwani_delivery' as const,
      title: 'توصيل بثواني',
      percentage: getWltDshPartnerCommissionLabel(getWltDshPartnerOperationalModeCommission('bthwani_delivery')),
      icon: 'bicycle-outline' as const,
      enabled: resolveServiceModeEnabled(serviceModes, 'bthwani_delivery', false),
    },
  ];

  return (
    <MobileScrollView fill gap={4} contentContainerStyle={{ paddingBottom: screenBottomInset }}>
      <TopBar
        variant="secondary"
        title="المحفظة والحسابات المالية"
        trailingAction={onBack ? {
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onBack,
        } : undefined}
      />

      {/* SUMMARY ACCORDION */}
      <Surface tone="raised" padding={0} gap={0} style={{ overflow: 'hidden' }}>
        <ActionStrip
          icon="pie-chart-outline"
          title="ملخص مالي سريع"
          subtitle="نظرة عامة على المبيعات والتسوية القادمة"
          expanded={activeTab === 'summary'}
          onPress={() => setActiveTab(activeTab === 'summary' ? null : 'summary')}
          hideDivider={true}
          trailingAction={
            <Icon name={activeTab === 'summary' ? 'chevron-up' : 'chevron-down'} tone="muted" size={20} />
          }
        >
          <Box gap={4} padding={3}>
            <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 10 }}>
              <CompactMetric label="إجمالي المبيعات" value={partnerPreview.grossSalesLabel} tone="info" />
              <CompactMetric label="صافي التسوية" value={partnerPreview.netSettlementLabel} tone="success" />
              <CompactMetric label="التسوية القادمة" value={partnerPreview.nextSettlementLabel} tone="warning" />
            </View>
            <Box gap={2} marginTop={2}>
              <Button label="تنزيل ملخص مالي" tone="ghost" icon="download-outline" size="sm" onPress={() => openAction('report')} />
              <Button label="فتح المحفظة الموسعة" tone="ghost" icon="wallet-outline" size="sm" onPress={() => openAction('expanded-wallet')} />
            </Box>
          </Box>
        </ActionStrip>
      </Surface>

      {/* CYCLE ACCORDION */}
      <Surface tone="raised" padding={0} gap={0} style={{ overflow: 'hidden' }}>
        <ActionStrip
          icon="document-text-outline"
          title="الدورة المالية والتسويات"
          subtitle="تفاصيل مستحقات الدورة الحالية وتواريخ الدفع"
          expanded={activeTab === 'cycle'}
          onPress={() => setActiveTab(activeTab === 'cycle' ? null : 'cycle')}
          hideDivider={true}
          trailingAction={
            <Icon name={activeTab === 'cycle' ? 'chevron-up' : 'chevron-down'} tone="muted" size={20} />
          }
        >
          <Box gap={4} padding={3}>
            <KeyValueList
              dense
              items={[
                { label: 'إجمالي المبيعات', value: partnerPreview.grossSalesLabel, tone: 'info' },
                { label: 'عمولة المنصة', value: `-${partnerPreview.platformCommissionLabel}`, tone: 'warning' },
                { label: 'خصومات واستردادات', value: `-${partnerPreview.deductionsLabel}`, tone: 'warning' },
                { label: 'رسوم توصيل المتجر', value: `+${storeDeliveryPreview.totalFeeLabel}`, tone: 'success' },
                { label: 'تعويض موصل المتجر', value: `-${storeDeliveryPreview.totalCompensationLabel}`, tone: 'warning' },
                { label: 'صافي التسوية', value: partnerPreview.netSettlementLabel, tone: 'success' },
              ]}
            />
            <Divider />
            <KeyValueList
              dense
              items={[
                { label: 'حالة الدورة الحالية', value: partnerPreview.cycleStatus, tone: 'success' },
                { label: 'تاريخ بدء الدورة', value: partnerPreview.cycleStartDate },
                { label: 'تاريخ نهاية الدورة', value: partnerPreview.cycleEndDate },
                { label: 'موعد الصرف القادم', value: partnerPreview.nextPayoutDate, tone: 'info' },
              ]}
            />
          </Box>
        </ActionStrip>
      </Surface>

      {/* TRANSACTIONS ACCORDION */}
      <Surface tone="raised" padding={0} gap={0} style={{ overflow: 'hidden' }}>
        <ActionStrip
          icon="swap-horizontal-outline"
          title="عرض الحركات المفصلة"
          subtitle="قائمة الحركات المكتملة وآخر التسويات"
          expanded={activeTab === 'transactions'}
          onPress={() => setActiveTab(activeTab === 'transactions' ? null : 'transactions')}
          hideDivider={true}
          trailingAction={
            <Icon name={activeTab === 'transactions' ? 'chevron-up' : 'chevron-down'} tone="muted" size={20} />
          }
        >
          <Box gap={0}>
            {visibleTransactions.length === 0 ? (
              <Box padding={4}>
                <StateView
                  stateId="empty"
                  title="لا توجد حركات مالية بعد"
                  description="عند وصول أول تسوية أو عمولة ستظهر هنا."
                />
              </Box>
            ) : (
              visibleTransactions.map((item, index) => {
                const isExpanded = selectedTransactionId === item.id;
                return (
                  <ActionStrip
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    expanded={isExpanded}
                    onPress={() => setSelectedTransactionId(isExpanded ? null : item.id)}
                    trailingAction={
                      <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 4 }}>
                          <Text role="bodyStrong" style={{ color: resolveToneColor(theme, item.amountTone) }}>{item.amountLabel}</Text>
                          <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                            {!!item.statusLabel ? <Badge label={item.statusLabel} tone={item.statusTone ?? 'default'} /> : null}
                            <Text role="caption" tone="soft">{item.timeLabel}</Text>
                          </View>
                        </View>
                        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} tone="muted" size={20} />
                      </View>
                    }
                    hideDivider={index === visibleTransactions.length - 1}
                  >
                    <KeyValueList
                      dense
                      items={[
                        { label: 'المبلغ', value: item.amountLabel, tone: item.amountTone === 'success' ? 'success' : item.amountTone === 'danger' ? 'danger' : 'default' },
                        { label: 'الحالة', value: item.statusLabel ?? 'مكتمل', tone: item.statusTone ?? 'success' },
                        { label: 'رقم المرجعية', value: item.id },
                      ]}
                    />
                  </ActionStrip>
                );
              })
            )}
          </Box>
        </ActionStrip>
      </Surface>

      {/* MODES ACCORDION */}
      <Surface tone="raised" padding={0} gap={0} style={{ overflow: 'hidden' }}>
        <ActionStrip
          icon="bicycle-outline"
          title="توزيع عمولات أوضاع التشغيل"
          subtitle="شروط ورسوم الخدمات المختلفة للتوصيل"
          expanded={activeTab === 'modes'}
          onPress={() => setActiveTab(activeTab === 'modes' ? null : 'modes')}
          hideDivider={true}
          trailingAction={
            <Icon name={activeTab === 'modes' ? 'chevron-up' : 'chevron-down'} tone="muted" size={20} />
          }
        >
          <Box gap={0}>
            {commissionRows.map((row, index) => {
              const isExpanded = selectedModeId === row.id;
              const breakdown = getWltDshOrderCommissionBreakdown(
                row.id === 'pickup' ? 'pickup' : row.id === 'partner_delivery' ? 'partner_delivery' : 'bthwani_delivery'
              );
              return (
                <ActionStrip
                  key={row.id}
                  icon={row.icon}
                  title={row.title}
                  subtitle={
                    <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Badge label={row.enabled ? 'مفعّل في المتجر' : 'غير نشط حالياً'} tone={row.enabled ? 'success' : 'warning'} />
                      <Text role="caption" tone="muted">• {row.percentage}</Text>
                    </View>
                  }
                  expanded={isExpanded}
                  onPress={() => setSelectedModeId(isExpanded ? null : row.id)}
                  trailingAction={
                    <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} tone="muted" size={20} />
                  }
                  hideDivider={index === commissionRows.length - 1}
                >
                  <KeyValueList
                    dense
                    items={[
                      { label: 'رسوم التوصيل للعميل', value: formatApplicability(breakdown.deliveryFee) },
                      { label: 'عمولة المنصة', value: formatApplicability(breakdown.platformCommission) },
                      { label: 'مستحقات الكابتن', value: formatApplicability(breakdown.captainPayout) },
                      { label: 'صافي مستحقات المتجر', value: formatApplicability(breakdown.partnerNet) }
                    ]}
                  />
                </ActionStrip>
              );
            })}
          </Box>
        </ActionStrip>
      </Surface>

      {/* COURIER ACCORDION */}
      <Surface tone="raised" padding={0} gap={0} style={{ overflow: 'hidden' }}>
        <ActionStrip
          icon="storefront-outline"
          title="سياسة توصيل المتجر الحالية"
          subtitle="إعدادات ورسوم توصيل المتجر (Partner Delivery)"
          expanded={activeTab === 'courier'}
          onPress={() => setActiveTab(activeTab === 'courier' ? null : 'courier')}
          hideDivider={true}
          trailingAction={
            <Icon name={activeTab === 'courier' ? 'chevron-up' : 'chevron-down'} tone="muted" size={20} />
          }
        >
          <Box gap={4} padding={3}>
            <KeyValueList
              dense
              items={[
                { label: 'السياسة الحالية النشطة', value: 'توصيل مجاني (Free Delivery)', tone: 'success' },
                { label: 'مستوى تسعير التوصيل للعميل', value: 'تسعير بثواني الموحد (بثواني كابتن)' },
                { label: 'إجمالي رسوم التوصيل المحصلة', value: storeDeliveryPreview.totalFeeLabel, tone: 'success' },
                { label: 'إجمالي مستحقات موصلي المتجر', value: storeDeliveryPreview.totalCompensationLabel, tone: 'warning' },
              ]}
            />
            <Surface tone="warning" padding={3} gap={2} style={{ marginTop: 8 }}>
              <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start' }}>
                <Icon name="warning" tone="warning" size={18} />
                <Text role="bodySm" tone="warning" style={{ flex: 1, textAlign: 'right' }}>
                  تنبيه: يتم تسوية مستحقات مناديب المتجر داخلياً بواسطة إدارة المتجر، ولا تنطبق عليها تسويات كباتن بثواني.
                </Text>
              </View>
            </Surface>
          </Box>
        </ActionStrip>
      </Surface>
    </MobileScrollView>
  );
}

export default PartnerDshWalletBridgeView;
