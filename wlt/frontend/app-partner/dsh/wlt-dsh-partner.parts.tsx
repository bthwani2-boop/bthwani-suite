import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
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
  Divider,
  ActionStrip,
  spacing,
} from '@bthwani/ui-kit';
import type { WltDshPartnerWalletTransaction } from './wlt-dsh-partner.adapter';
import { useWltDshPartnerWalletPreview } from './useWltDshPartnerWalletPreview';
import { getWltDshPartnerCommissionLabel, getWltDshPartnerOperationalModeCommission } from './wlt-dsh-partner.ui-copy';
import {
  getWltDshStoreDeliveryFinancePreview,
  getWltDshOrderCommissionBreakdown,
  type WltDshFulfillmentMode,
  type WltDshOrderLineItemApplicability,
} from '../../control-panel/dsh/financeContracts';

type PartnerDshWalletViewState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'no-transactions';
type PartnerDshWalletActionId = 'expanded-wallet' | 'settlements' | 'report';
type PartnerDshTransactionTone = 'default' | 'success' | 'warning' | 'danger' | 'info';
type WalletTabId = 'summary' | 'cycle' | 'transactions' | 'modes' | 'courier';

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
  dshAuthBearerToken?: string | null;
  dshClientId?: string | null;
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
  if (tone === 'success') return theme.success;
  if (tone === 'warning') return theme.warning;
  if (tone === 'danger') return theme.danger;
  if (tone === 'info') return theme.info;
  return theme.brand;
}

function resolveBranchShortLabel(branchLabel?: string) {
  if (!branchLabel) return 'الفرع الحالي';
  const segments = branchLabel.split('،').map((s) => s.trim()).filter(Boolean);
  return segments.at(-1) ?? branchLabel;
}

function resolveLinkedScopeLabel(activeZoneLabel?: string, branchLabel?: string) {
  const branchShortLabel = resolveBranchShortLabel(branchLabel);
  if (!activeZoneLabel) return branchShortLabel;
  const primaryZone = activeZoneLabel.split('/').map((s) => s.trim()).filter(Boolean)[0];
  return primaryZone ? `${primaryZone} / ${branchShortLabel}` : branchShortLabel;
}

function resolveServiceModeEnabled(
  serviceModes: readonly ServiceModeInput[] | undefined,
  modeId: 'pickup' | 'partner_delivery' | 'bthwani_delivery',
  fallback: boolean,
) {
  const matched = serviceModes?.find((mode) => {
    if (modeId === 'pickup') return mode.id === 'pickup';
    if (modeId === 'partner_delivery') {
      return (
        mode.id === 'partner_delivery' ||
        mode.id === 'partner delivery' ||
        mode.id === 'delivery' ||
        mode.id === 'store-delivery' ||
        mode.id === 'store delivery'
      );
    }
    return mode.id === 'bthwani_delivery' || mode.id === 'scheduled' || mode.id === 'seconds';
  });
  return matched?.enabled ?? fallback;
}

function formatApplicability(app: WltDshOrderLineItemApplicability) {
  if (app.applies) {
    if (app.label.endsWith('— WLT')) return 'تُحدد بواسطة WLT runtime';
    if (app.label.endsWith('— حسب سياسة المتجر')) return 'حسب سياسة المتجر';
    if (app.label.endsWith('— حسب اتفاق المتجر')) return 'حسب اتفاق المتجر';
    return app.label;
  }
  return app.reason;
}





// ─── Financial stream card — بطاقة حركة مالية مع تفاصيل inline ──
function FinancialStreamCard({
  item,
  isExpanded,
  onToggle,
}: {
  item: WltDshPartnerWalletTransaction;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { theme } = useTheme();
  const { direction } = useDirection();

  const detailItems = [
    { label: 'نوع الحركة', value: item.kindLabel ?? item.kind ?? '—' },
    { label: 'المصدر', value: item.sourceOrderLabel ?? item.settlementCycleLabel ?? '—' },
    { label: 'أثر التسوية', value: item.includedInNetSettlementLabel ?? '—' },
    ...(item.sourceTruthLabel
      ? [{ label: 'مصدر الحقيقة', value: `${item.sourceTruthLabel} / ${item.runtimeBindingLabel ?? 'غير مربوط بعد'}` }]
      : []),
    { label: 'السياسة', value: item.policyLabel ?? '—' },
    ...(item.isStoreCourierCompensation
      ? [{ label: 'ملاحظة', value: 'تعويض موصل المتجر داخلي من المتجر، وليس تسوية كابتن بثواني.' }]
      : []),
    ...(item.isCaptainPayout
      ? [{ label: 'ملاحظة', value: 'هذا البند يخص كابتن بثواني فقط — لا يتعلق بالشريك مباشرة.' }]
      : []),
    { label: 'الحالة', value: item.statusLabel ?? 'مكتمل' },
    { label: 'رقم المرجعية', value: item.id },
    { label: 'التوقيت', value: item.timeLabel },
  ].filter((d) => d.value && d.value !== '—');

  return (
    <View style={{ overflow: 'hidden' }}>
      {/* رأس البطاقة */}
      <Pressable onPress={onToggle} accessibilityRole="button">
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingVertical: 10,
            gap: 10,
          }}
        >
          {/* أيقونة + نص (كتلة واحدة على اليمين RTL) */}
          <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <Icon name={item.icon} size={20} tone="brand" />
            <View style={{ flex: 1, gap: 3 }}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>
                {item.title}
              </Text>
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }} numberOfLines={1}>
                {item.subtitle}
              </Text>
              {item.kindLabel ? (
                <Badge label={item.kindLabel} tone="default" />
              ) : null}
            </View>
          </View>

          {/* المبلغ + الحالة + chevron (على اليسار في RTL) */}
          <View style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 4, minWidth: 80 }}>
            <Text
              role="bodyStrong"
              style={{ color: resolveToneColor(theme, item.amountTone), textAlign: direction === 'rtl' ? 'left' : 'right' }}
              numberOfLines={1}
            >
              {item.amountLabel}
            </Text>
            <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
              {item.statusLabel ? (
                <Badge label={item.statusLabel} tone={item.statusTone ?? 'default'} />
              ) : null}
            </View>
          </View>

          <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
        </View>
      </Pressable>

      {/* التفاصيل المنسدلة داخل نفس البطاقة */}
      {isExpanded ? (
        <Box paddingY={2} gap={2}>
          <Divider />
          <KeyValueList dense items={detailItems} />
          {item.previewNoticeLabel ? (
            <Text role="caption" tone="muted" style={{ textAlign: 'right', marginTop: 6 }}>
              {item.previewNoticeLabel}
            </Text>
          ) : null}
        </Box>
      ) : null}
    </View>
  );
}

// ─── تبويب الملخص ─────────────────────────────────────────────────
function SummaryTab({
  partnerPreview,
  storeDeliveryPreview,
  openAction,
}: {
  partnerPreview: ReturnType<typeof useWltDshPartnerWalletPreview>['partnerPreview'];
  storeDeliveryPreview: ReturnType<typeof getWltDshStoreDeliveryFinancePreview>;
  openAction: (id: PartnerDshWalletActionId) => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Box gap={4}>
      {/* Cohesive Premium summary block */}
      <Surface
        tone="raised"
        padding={3}
        style={{
          borderRadius: 16,
        }}
      >
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingVertical: 6,
          }}
        >
          {/* Column 1: صافي التسوية */}
          <View style={{ flex: 1, gap: 4, paddingHorizontal: 8 }}>
            <Text role="caption" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
              صافي التسوية
            </Text>
            <Text role="titleSm" style={{ color: theme.success, textAlign: direction === 'rtl' ? 'right' : 'left', fontWeight: 'bold' }} numberOfLines={1}>
              {partnerPreview.netSettlementLabel}
            </Text>
          </View>

          {/* Divider */}
          <View style={{ width: 1, height: 32, backgroundColor: theme.line }} />

          {/* Column 2: إجمالي المبيعات */}
          <View style={{ flex: 1, gap: 4, paddingHorizontal: 8 }}>
            <Text role="caption" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
              إجمالي المبيعات
            </Text>
            <Text role="titleSm" style={{ color: theme.info, textAlign: direction === 'rtl' ? 'right' : 'left', fontWeight: 'bold' }} numberOfLines={1}>
              {partnerPreview.grossSalesLabel}
            </Text>
          </View>

          {/* Divider */}
          <View style={{ width: 1, height: 32, backgroundColor: theme.line }} />

          {/* Column 3: التسوية القادمة */}
          <View style={{ flex: 1, gap: 4, paddingHorizontal: 8 }}>
            <Text role="caption" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
              التسوية القادمة
            </Text>
            <Text role="titleSm" style={{ color: theme.warning, textAlign: direction === 'rtl' ? 'right' : 'left', fontWeight: 'bold' }} numberOfLines={1}>
              {partnerPreview.nextSettlementLabel}
            </Text>
          </View>
        </View>
      </Surface>

      {/* ملاحظة البيانات التجريبية - Notice Compact */}
      <Surface
        tone="warning"
        padding={2}
        border={false}
        style={{ borderRadius: 8 }}
      >
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 6, alignItems: 'center' }}>
          <Icon name="warning" tone="warning" size={14} />
          <Text role="caption" tone="warning" style={{ flex: 1, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
            معاينة مالية — ليست تسوية منفذة
          </Text>
        </View>
      </Surface>

      {/* إجراءات مضغوطة - أزرار عملية أنيقة بجانب بعضها */}
      <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 12, marginTop: 4 }}>
        <Button
          label="تنزيل ملخص مالي"
          tone="secondary"
          icon={<Icon name="download-outline" size={16} tone="brand" />}
          size="sm"
          fullWidth
          style={{ flex: 1 }}
          onPress={() => openAction('report')}
        />
        <Button
          label="فتح المحفظة الموسعة"
          tone="secondary"
          icon={<Icon name="wallet-outline" size={16} tone="brand" />}
          size="sm"
          fullWidth
          style={{ flex: 1 }}
          onPress={() => openAction('expanded-wallet')}
        />
      </View>
    </Box>
  );
}

// ─── تبويب التسوية ────────────────────────────────────────────────
function CycleTab({
  partnerPreview,
  storeDeliveryPreview,
}: {
  partnerPreview: ReturnType<typeof useWltDshPartnerWalletPreview>['partnerPreview'];
  storeDeliveryPreview: ReturnType<typeof getWltDshStoreDeliveryFinancePreview>;
}) {
  return (
    <Box gap={4}>
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
  );
}

// ─── تبويب الحركات ────────────────────────────────────────────────
function TransactionsTab({
  visibleTransactions,
  selectedTransactionId,
  onToggle,
}: {
  visibleTransactions: readonly WltDshPartnerWalletTransaction[];
  selectedTransactionId: string | null;
  onToggle: (id: string) => void;
}) {
  if (visibleTransactions.length === 0) {
    return (
      <Box padding={4}>
        <StateView
          stateId="empty"
          title="لا توجد حركات مالية بعد"
          description="عند وصول أول تسوية أو عمولة ستظهر هنا."
        />
      </Box>
    );
  }

  return (
    <Box gap={0}>
      {visibleTransactions.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <Divider />}
          <FinancialStreamCard
            item={item}
            isExpanded={selectedTransactionId === item.id}
            onToggle={() => onToggle(item.id)}
          />
        </React.Fragment>
      ))}
    </Box>
  );
}

// ─── تبويب العمولات — كل mode بطاقة مالية مستقلة ───────────────
type CommissionModeId = 'pickup' | 'partner_delivery' | 'bthwani_delivery';

function CommissionModeCard({
  id,
  title,
  icon,
  enabled,
  percentage,
  serviceModes,
  isExpanded,
  onToggle,
}: {
  id: CommissionModeId;
  title: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  enabled: boolean;
  percentage: string;
  serviceModes?: readonly ServiceModeInput[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const modeId: WltDshFulfillmentMode =
    id === 'pickup' ? 'pickup' : id === 'partner_delivery' ? 'partner_delivery' : 'bthwani_delivery';
  const breakdown = getWltDshOrderCommissionBreakdown(modeId);

  const modeDetails = (() => {
    if (id === 'pickup') {
      return {
        deliveryFeeNote: 'لا توجد رسوم توصيل — استلام مباشر من المتجر',
        courierNote: 'لا يوجد موصل',
        captainNote: 'لا ينطبق — لا يوجد كابتن بثواني في هذا الوضع',
        netImpact: 'الشريك يستلم كامل قيمة الطلب مطروحًا منها عمولة المنصة',
        captainPayoutApplies: false,
      };
    }
    if (id === 'partner_delivery') {
      return {
        deliveryFeeNote: 'رسوم التوصيل: يدفعها العميل — تذهب للمتجر حسب السياسة',
        courierNote: 'موصل المتجر — يُدفع داخليًا من المتجر',
        captainNote: 'لا ينطبق — الموصل من المتجر وليس من بثواني',
        netImpact: 'الشريك: إجمالي الطلب + رسوم التوصيل − عمولة المنصة. التعويض داخلي للموصل.',
        captainPayoutApplies: false,
      };
    }
    return {
      deliveryFeeNote: 'رسوم التوصيل: يدفعها العميل — حسب تسعير بثواني',
      courierNote: 'كابتن بثواني — تسوية WLT captain payout',
      captainNote: 'ينطبق — الكابتن يحصل على WLT payout مستقل عن تسوية الشريك',
      netImpact: 'الشريك: إجمالي الطلب − عمولة المنصة − رسوم كابتن بثواني (حسب عقد WLT)',
      captainPayoutApplies: true,
    };
  })();

  return (
    <View style={{ overflow: 'hidden', opacity: enabled ? 1 : 0.65 }}>
      {/* رأس البطاقة */}
      <Pressable onPress={onToggle} accessibilityRole="button">
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingVertical: 10,
            gap: 10,
          }}
        >
          <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <Icon name={icon} size={20} tone={enabled ? 'brand' : 'soft'} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>
                {title}
              </Text>
              <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                <Badge
                  label={enabled ? 'مفعّل' : 'غير نشط'}
                  tone={enabled ? 'success' : 'warning'}
                />
                <Text role="caption" tone="muted">• {percentage}</Text>
              </View>
            </View>
          </View>
          <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
        </View>
      </Pressable>

      {/* التفاصيل */}
      {isExpanded ? (
        <Box paddingY={2} gap={3}>
          <Divider />
          <KeyValueList
            dense
            items={[
              { label: 'رسوم التوصيل', value: modeDetails.deliveryFeeNote },
              { label: 'عبء الموصل', value: modeDetails.courierNote },
              { label: 'كابتن بثواني', value: modeDetails.captainNote },
              { label: 'عمولة المنصة', value: formatApplicability(breakdown.platformCommission) },
              { label: 'مستحقات الكابتن (WLT)', value: modeDetails.captainPayoutApplies ? formatApplicability(breakdown.captainPayout) : 'لا ينطبق' },
              { label: 'أثر صافي الشريك', value: modeDetails.netImpact },
              { label: 'صافي مستحقات المتجر', value: formatApplicability(breakdown.partnerNet) },
            ]}
          />
          {/* CTA */}
          {id === 'partner_delivery' ? (
            <Button label="إعداد توصيل المتجر" tone="secondary" size="sm" icon={<Icon name="settings-outline" size={16} tone="brand" />} />
          ) : id === 'bthwani_delivery' && !enabled ? (
            <Button label="مراجعة السياسة" tone="ghost" size="sm" icon={<Icon name="document-text-outline" size={16} tone="brand" />} />
          ) : (
            <Button label="عرض الحركات المرتبطة" tone="ghost" size="sm" icon={<Icon name="swap-horizontal-outline" size={16} tone="brand" />} />
          )}
        </Box>
      ) : null}
    </View>
  );
}

function ModesTab({
  serviceModes,
}: {
  serviceModes?: readonly ServiceModeInput[];
}) {
  const [expandedModeId, setExpandedModeId] = React.useState<CommissionModeId | null>(null);

  const modes: { id: CommissionModeId; title: string; icon: React.ComponentProps<typeof Icon>['name']; defaultEnabled: boolean }[] = [
    { id: 'pickup', title: 'استلام بنفسي', icon: 'hand-left-outline', defaultEnabled: true },
    { id: 'partner_delivery', title: 'توصيل المتجر', icon: 'storefront-outline', defaultEnabled: true },
    { id: 'bthwani_delivery', title: 'توصيل بثواني', icon: 'bicycle-outline', defaultEnabled: false },
  ];

  return (
    <Box gap={2}>
      <Text role="caption" tone="muted" style={{ textAlign: 'right', marginBottom: 4 }}>
        كل وضع تشغيل يحمل أثرًا ماليًا مختلفًا. اضغط لرؤية تفاصيل العمولة وأثر التسوية.
      </Text>
      {modes.map((mode, index) => {
        const enabled = resolveServiceModeEnabled(serviceModes, mode.id, mode.defaultEnabled);
        const percentage = getWltDshPartnerCommissionLabel(getWltDshPartnerOperationalModeCommission(mode.id));
        return (
          <React.Fragment key={mode.id}>
            {index > 0 && <Divider />}
            <CommissionModeCard
              id={mode.id}
              title={mode.title}
              icon={mode.icon}
              enabled={enabled}
              percentage={percentage}
              serviceModes={serviceModes}
              isExpanded={expandedModeId === mode.id}
              onToggle={() => setExpandedModeId(expandedModeId === mode.id ? null : mode.id)}
            />
          </React.Fragment>
        );
      })}
    </Box>
  );
}

// ─── تبويب توصيل المتجر ──────────────────────────────────────────
function CourierTab({
  storeDeliveryPreview,
  direction,
}: {
  storeDeliveryPreview: ReturnType<typeof getWltDshStoreDeliveryFinancePreview>;
  direction: 'rtl' | 'ltr';
}) {
  const hasPolicy = storeDeliveryPreview.totalFeeLabel !== '٠ ر.ي';

  if (!hasPolicy) {
    return (
      <Box gap={4}>
        <StateView
          stateId="empty"
          title="لم يتم تحديد سياسة توصيل المتجر بعد"
          description="حدد السياسة لتفعيل توصيل المتجر وتتبع الرسوم والتعويضات."
        />
        <Button label="إعداد موصل المتجر" tone="primary" size="sm" icon={<Icon name="settings-outline" size={16} tone="brand" />} />
      </Box>
    );
  }

  return (
    <Box gap={4}>
      {/* السياسة الحالية */}
      <KeyValueList
        dense
        items={[
          { label: 'السياسة الحالية النشطة', value: 'توصيل مجاني للعميل', tone: 'success' },
          { label: 'رسوم التوصيل', value: 'مستحقة من العميل — تذهب للمتجر حسب السياسة' },
          { label: 'إجمالي رسوم التوصيل المحصلة', value: storeDeliveryPreview.totalFeeLabel, tone: 'success' },
          { label: 'إجمالي مستحقات موصلي المتجر', value: storeDeliveryPreview.totalCompensationLabel, tone: 'warning' },
          { label: 'تسوية الكابتن تنطبق؟', value: 'لا — موصل المتجر يُسوَّى داخلياً' },
        ]}
      />

      {/* تنبيه الفصل المالي */}
      <Surface tone="warning" padding={3} gap={2} style={{ borderRadius: 10 }}>
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start' }}>
          <Icon name="warning" tone="warning" size={16} />
          <Text role="bodySm" tone="warning" style={{ flex: 1, textAlign: 'right' }}>
            تعويض موصل المتجر داخلي من المتجر، وليس تسوية كابتن بثواني. لا تخلط بين الاثنين.
          </Text>
        </View>
      </Surface>

      {/* CTA */}
      <Button label="إعداد موصل المتجر" tone="ghost" size="sm" icon={<Icon name="settings-outline" size={16} tone="brand" />} />
    </Box>
  );
}

// ─── الشاشة الرئيسية ─────────────────────────────────────────────
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
  dshAuthBearerToken,
  dshClientId,
}: PartnerDshWalletBridgeProps) {
  const { direction } = useDirection();
  const { partnerPreview, previewTransactions } = useWltDshPartnerWalletPreview(dshClientId || undefined, dshAuthBearerToken);
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string | null>(null);
  const [expandedSection, setExpandedSection] = React.useState<WalletTabId | null>('summary');

  const linkedScopeLabel = React.useMemo(
    () => resolveLinkedScopeLabel(activeZoneLabel, branchLabel),
    [activeZoneLabel, branchLabel],
  );
  const storeDeliveryPreview = React.useMemo(() => getWltDshStoreDeliveryFinancePreview(), []);

  const sourceTransactions = transactions ?? previewTransactions;
  const visibleTransactions = state === 'no-transactions' ? [] : sourceTransactions;

  function openAction(actionId: PartnerDshWalletActionId) {
    if (actionId === 'expanded-wallet' && onOpenExpandedWallet) {
      onOpenExpandedWallet();
    } else if (actionId === 'settlements' && onOpenSettlementReview) {
      onOpenSettlementReview();
    } else if (actionId === 'report' && onOpenFinancialReport) {
      onOpenFinancialReport();
    }
  }

  // حالة الخطأ / التحميل / الفراغ
  if (state !== 'ready' && state !== 'no-transactions') {
    const stateCopy = resolveStateCopy(state);
    return (
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: screenBottomInset }}>
        <TopBar
          variant="secondary"
          title="المحفظة والحسابات المالية"
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={
            onBack
              ? {
                  id: 'back',
                  icon: <Icon name="arrow-back" size={24} tone="brand" />,
                  mirrorInRtl: true,
                  accessibilityLabel: 'رجوع',
                  onPress: onBack,
                }
              : undefined
          }
        />
        <StateView {...stateCopy} onActionPress={onBack} />
      </MobileScrollView>
    );
  }

  return (
    <MobileScrollView
      fill
      gap={0}
      contentContainerStyle={{ paddingBottom: screenBottomInset }}
    >
      {/* Header مختصر */}
      <TopBar
        variant="secondary"
        title="المحفظة والحسابات المالية"
        trailingAction={
          onBack
            ? {
                id: 'back',
                icon: <Icon name="arrow-back" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'رجوع',
                onPress: onBack,
              }
            : undefined
        }
      />

      {/* الفرع / النطاق */}
      <View
        style={{
          flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <Icon name="location-outline" size={14} tone="soft" />
        <Text role="caption" tone="soft" numberOfLines={1} style={{ flex: 1, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
          {linkedScopeLabel}
        </Text>
      </View>

      {/* قائمة الأقسام المالية القابلة للطي — بنمط صفحة طلباتي */}
      <Box padding={4}>
        {/* 1. الملخص المالي */}
        <ActionStrip
          icon="receipt-outline"
          title="الملخص المالي"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {`${partnerPreview.netSettlementLabel} • صافي التسوية • ريال يمني`}
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label="نشط" tone="success" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#المحفظة</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'summary'}
          onPress={() => setExpandedSection(expandedSection === 'summary' ? null : 'summary')}
          hideDivider={false}
          trailingAction={
            <Icon name={expandedSection === 'summary' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <SummaryTab
            partnerPreview={partnerPreview}
            storeDeliveryPreview={storeDeliveryPreview}
            openAction={openAction}
          />
        </ActionStrip>

        {/* 2. دورة التسوية */}
        <ActionStrip
          icon="receipt-outline"
          title="دورة التسوية"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {`${partnerPreview.cycleStartDate} إلى ${partnerPreview.cycleEndDate}`}
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label={partnerPreview.cycleStatus} tone="success" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#التسوية</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'cycle'}
          onPress={() => setExpandedSection(expandedSection === 'cycle' ? null : 'cycle')}
          hideDivider={false}
          trailingAction={
            <Icon name={expandedSection === 'cycle' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <CycleTab
            partnerPreview={partnerPreview}
            storeDeliveryPreview={storeDeliveryPreview}
          />
        </ActionStrip>

        {/* 3. الحركات المالية */}
        <ActionStrip
          icon="receipt-outline"
          title="آخر الحركات المالية"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {visibleTransactions.length === 1 ? 'حركة مالية واحدة مسجلة' : `${visibleTransactions.length} حركات مالية مسجلة`}
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label="محدث" tone="default" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#سجل_الحركات</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'transactions'}
          onPress={() => setExpandedSection(expandedSection === 'transactions' ? null : 'transactions')}
          hideDivider={false}
          trailingAction={
            <Icon name={expandedSection === 'transactions' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <TransactionsTab
            visibleTransactions={visibleTransactions}
            selectedTransactionId={selectedTransactionId}
            onToggle={(id) => setSelectedTransactionId(selectedTransactionId === id ? null : id)}
          />
        </ActionStrip>

        {/* 4. العمولات التشغيلية */}
        <ActionStrip
          icon="receipt-outline"
          title="العمولات التشغيلية"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                عمولة المنصة حسب أوضاع التوصيل والاستلام
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label="٣ أوضاع تشغيل" tone="default" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#العمولات</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'modes'}
          onPress={() => setExpandedSection(expandedSection === 'modes' ? null : 'modes')}
          hideDivider={false}
          trailingAction={
            <Icon name={expandedSection === 'modes' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <ModesTab serviceModes={serviceModes} />
        </ActionStrip>

        {/* 5. توصيل المتجر */}
        <ActionStrip
          icon="receipt-outline"
          title="توصيل المتجر"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {`${storeDeliveryPreview.totalFeeLabel} رسوم محصلة • ${storeDeliveryPreview.totalCompensationLabel} تعويضات`}
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label="سياسة نشطة" tone="success" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#توصيل_المتجر</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'courier'}
          onPress={() => setExpandedSection(expandedSection === 'courier' ? null : 'courier')}
          hideDivider={true}
          trailingAction={
            <Icon name={expandedSection === 'courier' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <CourierTab storeDeliveryPreview={storeDeliveryPreview} direction={direction} />
        </ActionStrip>
      </Box>
    </MobileScrollView>
  );
}

export default PartnerDshWalletBridgeView;
