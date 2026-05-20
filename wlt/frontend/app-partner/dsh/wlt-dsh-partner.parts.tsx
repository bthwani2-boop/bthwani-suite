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
  SegmentedControl,
  ActionStrip,
} from '@bthwani/ui-kit';
import type { WltDshPartnerWalletTransaction } from './wlt-dsh-partner.adapter';
import { useWltDshPartnerWalletPreview } from './useWltDshPartnerWalletPreview';
import { getWltDshPartnerCommissionLabel, getWltDshPartnerOperationalModeCommission } from './wlt-dsh-partner.ui-copy';
import { getWltDshStoreDeliveryFinancePreview } from '../../shared/finance';

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

function TransactionRow({
  item,
  onPress,
}: {
  item: PartnerDshWalletTransaction;
  onPress: (transaction: PartnerDshWalletTransaction) => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  const amountColor = resolveToneColor(theme, item.amountTone);

  return (
    <Pressable
      accessibilityRole={item.hasDetails ? 'button' : undefined}
      accessibilityLabel={item.title}
      disabled={!item.hasDetails}
      onPress={() => onPress(item)}
      style={({ pressed }) => [{ opacity: item.hasDetails && pressed ? 0.96 : 1 }]}
    >
      <Surface tone="raised" padding={3} gap={2}>
        <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, flexDirection: rowDirection, alignItems: 'center', gap: 10, minWidth: 0 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.surfaceInset,
                borderWidth: 1,
                borderColor: theme.line,
                flexShrink: 0,
              }}
            >
              <Icon name={item.icon} size={18} tone="brand" />
            </View>

            <View style={{ flex: 1, gap: 4, minWidth: 0, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
              <Text role="bodyStrong" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
                {item.title}
              </Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={2}>
                {item.subtitle}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 5, flexShrink: 0 }}>
            <Text role="bodyStrong" style={{ color: amountColor, textAlign: direction === 'rtl' ? 'left' : 'right' }}>
              {item.amountLabel}
            </Text>
            {item.statusLabel ? <Badge label={item.statusLabel} tone={item.statusTone ?? 'default'} /> : null}
            <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 4 }}>
              <Text role="caption" tone="soft" style={{ textAlign: direction === 'rtl' ? 'left' : 'right' }}>
                {item.timeLabel}
              </Text>
              {item.hasDetails ? <Icon name="chevron-forward-outline" mirrored tone="muted" size={16} /> : null}
            </View>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}>
      <Surface tone="raised" padding={3} gap={2}>
        <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, flexDirection: rowDirection, alignItems: 'center', gap: 10, minWidth: 0 }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.surfaceInset,
                borderWidth: 1,
                borderColor: theme.line,
                flexShrink: 0,
              }}
            >
              <Icon name={icon} size={17} tone="brand" />
            </View>

            <View style={{ flex: 1, gap: 4, minWidth: 0, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
              <Text role="bodyStrong" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
                {title}
              </Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>
          </View>

          <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
        </View>
      </Surface>
    </Pressable>
  );
}

function resolveActionPanelCopy(actionId: PartnerDshWalletActionId) {
  if (actionId === 'settlements') {
    return {
      title: 'مراجعة التسويات',
      description: 'ستظهر مراجعة التسويات التفصيلية من نفس مساحة المالية فور تفعيل الربط التشغيلي.',
    };
  }

  if (actionId === 'report') {
    return {
      title: 'الملخص المالي',
      description: 'سيتم عرض التقرير المختصر أو تنزيله من هذا المسار عند جاهزية الربط الخاص بالتقارير.',
    };
  }

  return {
    title: 'المحفظة الموسعة',
    description: 'هذه المساحة جاهزة لاستقبال العرض الموسع للمحفظة إذا لم يتوفر ربط مباشر من المضيف بعد.',
  };
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
  const [activeActionId, setActiveActionId] = React.useState<PartnerDshWalletActionId | null>(null);
  const [activeTab, setActiveTab] = React.useState<'summary' | 'cycle' | 'transactions' | 'modes' | 'courier'>('summary');

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
      return;
    }

    if (actionId === 'settlements' && onOpenSettlementReview) {
      onOpenSettlementReview();
      return;
    }

    if (actionId === 'report' && onOpenFinancialReport) {
      onOpenFinancialReport();
      return;
    }

    setActiveActionId(actionId);
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

  const actionPanel = activeActionId ? resolveActionPanelCopy(activeActionId) : null;

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

      <SegmentedControl
        options={[
          { value: 'summary', label: 'الملخص' },
          { value: 'cycle', label: 'التسوية' },
          { value: 'transactions', label: 'الحركات' },
          { value: 'modes', label: 'العمولات' },
          { value: 'courier', label: 'المندوب' },
        ]}
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as any);
          setSelectedTransactionId(null);
          setActiveActionId(null);
        }}
        style={{ marginBottom: 4 }}
      />

      {/* ─── TAB 1: SUMMARY ─── */}
      {activeTab === 'summary' && (
        <Box gap={4}>
          <Surface tone="raised" padding={3} gap={3}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
              ملخص مالي سريع — ر.ي (ريال يمني)
            </Text>
            <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 10 }}>
              <CompactMetric label="إجمالي المبيعات" value={partnerPreview.grossSalesLabel} tone="info" />
              <CompactMetric label="صافي التسوية" value={partnerPreview.netSettlementLabel} tone="success" />
              <CompactMetric label="التسوية القادمة" value={partnerPreview.nextSettlementLabel} tone="warning" />
            </View>
          </Surface>

          <Surface tone="raised" padding={0} gap={0} style={{ overflow: 'hidden' }}>
            <Text role="label" tone="muted" style={{ paddingHorizontal: 16, paddingTop: 16 }}>
              إجراء مالي سريع
            </Text>
            <Text role="caption" tone="muted" style={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 8 }}>
              عرض سريع للأقسام التفصيلية للمحفظة من مساحة واحدة.
            </Text>
            {financialActionsDisabled ? (
              <StateView
                stateId="empty"
                title="الإجراءات المالية مقفلة مؤقتًا"
                description="راجع الصلاحية أو حالة الحساب قبل محاولة تنفيذ إجراء مالي."
              />
            ) : (
              <Box gap={0}>
                <ActionStrip
                  icon="document-text-outline"
                  title="مراجعة الدورة المالية والتسويات"
                  subtitle="تفاصيل مستحقات الدورة الحالية وتواريخ الدفع."
                  navigationChevron
                  onPress={() => setActiveTab('cycle')}
                />
                <ActionStrip
                  icon="swap-horizontal-outline"
                  title="عرض الحركات المفصلة"
                  subtitle="استعراض قائمة الحركات المكتملة وآخر التسويات."
                  navigationChevron
                  onPress={() => setActiveTab('transactions')}
                />
                <ActionStrip
                  icon="bicycle-outline"
                  title="توزيع عمولات أوضاع التشغيل"
                  subtitle="مراجعة شروط ورسوم الخدمات المختلفة للتوصيل."
                  navigationChevron
                  onPress={() => setActiveTab('modes')}
                />
                <ActionStrip
                  icon="download-outline"
                  title="تنزيل ملخص مالي"
                  subtitle="تحميل كشف مالي مختصر للفترة الحالية."
                  navigationChevron
                  onPress={() => openAction('report')}
                />
                <ActionStrip
                  icon="wallet-outline"
                  title="فتح المحفظة الموسعة"
                  subtitle="إدارة الحسابات البنكية وإعدادات الدفع المتقدمة."
                  navigationChevron
                  onPress={() => openAction('expanded-wallet')}
                />
              </Box>
            )}
          </Surface>
        </Box>
      )}

      {/* ─── TAB 2: CYCLE ─── */}
      {activeTab === 'cycle' && (
        <Box gap={4}>
          <Surface tone="raised" padding={3} gap={3}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
              تفصيل الدورة المالية والتسويات
            </Text>
            <KeyValueList
              dense
              items={[
                { label: 'إجمالي المبيعات (Gross Sales)', value: partnerPreview.grossSalesLabel, tone: 'info' },
                { label: 'عمولة المنصة (Platform Commission)', value: `-${partnerPreview.platformCommissionLabel}`, tone: 'warning' },
                { label: 'خصومات واستردادات (Deductions/Refunds)', value: `-${partnerPreview.deductionsLabel}`, tone: 'warning' },
                { label: 'رسوم توصيل المتجر (Store Delivery Fee)', value: `+${storeDeliveryPreview.totalFeeLabel}`, tone: 'success' },
                { label: 'تعويض موصل المتجر (Store Courier Compensation)', value: `-${storeDeliveryPreview.totalCompensationLabel}`, tone: 'warning' },
                { label: 'صافي التسوية المتوقع (Net Settlement)', value: partnerPreview.netSettlementLabel, tone: 'success' },
              ]}
            />
          </Surface>

          <Surface tone="raised" padding={3} gap={3}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
              الجدول الزمني والتواريخ
            </Text>
            <KeyValueList
              dense
              items={[
                { label: 'حالة الدورة الحالية', value: partnerPreview.cycleStatus, tone: 'success' },
                { label: 'تاريخ بدء الدورة', value: partnerPreview.cycleStartDate },
                { label: 'تاريخ نهاية الدورة', value: partnerPreview.cycleEndDate },
                { label: 'موعد الصرف القادم', value: partnerPreview.nextPayoutDate, tone: 'info' },
                { label: 'نطاق الفرع المرتبط', value: linkedScopeLabel },
              ]}
            />
          </Surface>
        </Box>
      )}

      {/* ─── TAB 3: TRANSACTIONS ─── */}
      {activeTab === 'transactions' && (
        <Box gap={4}>
          <Surface tone="raised" padding={3} gap={3}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
              آخر الحركات
            </Text>
            {visibleTransactions.length === 0 ? (
              <StateView
                stateId="empty"
                title="لا توجد حركات مالية بعد"
                description="عند وصول أول تسوية أو عمولة أو دفعة مستحقة ستظهر هنا."
              />
            ) : (
              <Box gap={3}>
                {visibleTransactions.map((item) => (
                  <TransactionRow key={item.id} item={item} onPress={(transaction) => setSelectedTransactionId(transaction.id)} />
                ))}
              </Box>
            )}
          </Surface>

          {selectedTransaction ? (
            <Surface tone="inset" padding={3} gap={3}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }}>
                تفاصيل الحركة
              </Text>
              <KeyValueList
                dense
                items={[
                  { label: 'العنوان', value: selectedTransaction.title },
                  { label: 'الوصف', value: selectedTransaction.subtitle },
                  { label: 'المبلغ', value: selectedTransaction.amountLabel, tone: selectedTransaction.amountTone ?? 'info' },
                  { label: 'الحالة', value: selectedTransaction.statusLabel ?? 'بدون حالة ظاهرة', tone: selectedTransaction.statusTone ?? 'default' },
                  { label: 'الوقت', value: selectedTransaction.timeLabel },
                ]}
              />
              <Button label="إخفاء التفاصيل" tone="ghost" fullWidth={false} onPress={() => setSelectedTransactionId(null)} />
            </Surface>
          ) : null}
        </Box>
      )}

      {/* ─── TAB 4: FULFILLMENT MODES / COMMISSION ─── */}
      {activeTab === 'modes' && (
        <Box gap={4}>
          <Surface tone="raised" padding={3} gap={3}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
              توزيع العمولة حسب وضع الخدمة
            </Text>
            <Box gap={3}>
              {commissionRows.map((row) => {
                let costLabel = '';
                let payResponsibility = '';
                let netRevenueDesc = '';

                if (row.id === 'bthwani_delivery') {
                  costLabel = 'يتحملها العميل والمنصة (كابتن بثواني)';
                  payResponsibility = 'شركة بثواني (تسوية كابتن تلقائية)';
                  netRevenueDesc = 'صافي قيمة الطلب بعد خصم عمولة المنصة ورسوم التوصيل';
                } else if (row.id === 'partner_delivery') {
                  costLabel = 'يتحملها المتجر (موصل المتجر)';
                  payResponsibility = 'المتجر يدفع لموصله (تسوية داخلية)';
                  netRevenueDesc = 'كامل قيمة الطلب والرسوم مطروحاً منها عمولة المنصة';
                } else {
                  costLabel = 'لا يوجد (العميل يستلم بنفسه)';
                  payResponsibility = 'لا ينطبق (بدون موصل)';
                  netRevenueDesc = 'كامل قيمة الطلب مطروحاً منها عمولة المنصة فقط';
                }

                return (
                  <Surface key={row.id} tone="default" padding={3} gap={3}>
                    <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
                        <Icon name={row.icon} size={18} tone="brand" />
                        <Text role="bodyStrong" style={{ textAlign: 'right' }}>
                          {row.title}
                        </Text>
                      </View>
                      <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                        <Badge label={row.enabled ? 'مفعّل' : 'غير مفعّل'} tone={row.enabled ? 'success' : 'warning'} />
                        <Text role="bodyStrong" style={{ textAlign: direction === 'rtl' ? 'left' : 'right' }}>
                          {row.percentage}
                        </Text>
                      </View>
                    </View>
                    <KeyValueList
                      dense
                      items={[
                        { label: 'عبء تكلفة الموصل', value: costLabel },
                        { label: 'جهة صرف المستحقات', value: payResponsibility },
                        { label: 'وصف الإيراد الصافي', value: netRevenueDesc },
                      ]}
                    />
                  </Surface>
                );
              })}
            </Box>
          </Surface>
        </Box>
      )}

      {/* ─── TAB 5: COURIER / STORE DELIVERY ─── */}
      {activeTab === 'courier' && (
        <Box gap={4}>
          <Surface tone="raised" padding={3} gap={3}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
              سياسة توصيل المتجر الحالية
            </Text>
            <KeyValueList
              dense
              items={[
                { label: 'السياسة الحالية النشطة', value: 'توصيل مجاني (Free Delivery)', tone: 'success' },
                { label: 'مستوى تسعير التوصيل للعميل', value: 'تسعير بثواني الموحد (بثواني كابتن)' },
                { label: 'إجمالي رسوم التوصيل المحصلة للفرع', value: storeDeliveryPreview.totalFeeLabel, tone: 'success' },
                { label: 'إجمالي مستحقات موصلي المتجر (التعويضات)', value: storeDeliveryPreview.totalCompensationLabel, tone: 'warning' },
              ]}
            />

            <Surface
              tone="default"
              padding={3}
              gap={2}
              style={{
                backgroundColor: theme.warningSurface,
                borderColor: theme.warning,
                borderWidth: 1,
                borderRadius: 14,
              }}
            >
              <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start' }}>
                <Icon name="warning" tone="warning" size={18} />
                <Text role="bodySm" tone="warning" style={{ flex: 1, textAlign: 'right' }}>
                  تنبيه: يتم تسوية مستحقات مناديب المتجر داخلياً بواسطة إدارة المتجر، ولا تنطبق عليها تسويات كباتن بثواني (Captain Payouts).
                </Text>
              </View>
            </Surface>
          </Surface>
        </Box>
      )}

      {actionPanel ? (
        <Surface tone="inset" padding={3} gap={3}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>
            {actionPanel.title}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {actionPanel.description}
          </Text>
          <Button label="إغلاق" tone="ghost" fullWidth={false} onPress={() => setActiveActionId(null)} />
        </Surface>
      ) : null}
    </MobileScrollView>
  );
}

export default PartnerDshWalletBridgeView;
