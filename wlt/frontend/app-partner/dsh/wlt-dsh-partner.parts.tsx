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
} from '@bthwani/ui-kit';
import type { WltDshPartnerWalletTransaction } from './wlt-dsh-partner.adapter';
import { useWltDshPartnerWalletPreview } from './useWltDshPartnerWalletPreview';

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

function resolveServiceModeEnabled(serviceModes: readonly ServiceModeInput[] | undefined, modeId: 'pickup' | 'delivery' | 'scheduled', fallback: boolean) {
  const matched = serviceModes?.find((mode) => {
    if (modeId === 'pickup') return mode.id === 'pickup';
    if (modeId === 'delivery') return mode.id === 'delivery' || mode.id === 'store-delivery';

    return mode.id === 'scheduled' || mode.id === 'seconds';
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
  const { partnerPreview, previewTransactions } = useWltDshPartnerWalletPreview();
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string | null>(null);
  const [activeActionId, setActiveActionId] = React.useState<PartnerDshWalletActionId | null>(null);

  const linkedScopeLabel = React.useMemo(() => resolveLinkedScopeLabel(activeZoneLabel, branchLabel), [activeZoneLabel, branchLabel]);
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
      percentage: '0%',
      icon: 'hand-left-outline' as const,
      enabled: resolveServiceModeEnabled(serviceModes, 'pickup', true),
    },
    {
      id: 'delivery' as const,
      title: 'توصيل المتجر',
      percentage: '8%',
      icon: 'car-outline' as const,
      enabled: resolveServiceModeEnabled(serviceModes, 'delivery', true),
    },
    {
      id: 'scheduled' as const,
      title: 'توصيل بثواني',
      percentage: '15%',
      icon: 'flash-outline' as const,
      enabled: resolveServiceModeEnabled(serviceModes, 'scheduled', false),
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

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          ملخص مالي سريع
        </Text>
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 10 }}>
          <CompactMetric label="الرصيد المتاح" value={partnerPreview.summary.totalLabel} tone="success" />
          <CompactMetric label="المستحقات" value={partnerPreview.nextSettlementLabel} tone="warning" />
          <CompactMetric label="آخر تسوية" value={partnerPreview.records[0]?.timeLabel ?? 'اليوم'} tone="info" />
        </View>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          الحسابات والتسويات
        </Text>
        <KeyValueList
          dense
          items={[
            { label: 'الخطة المالية', value: 'نشطة', tone: 'success' },
            { label: 'التحصيل القادم', value: 'خلال يومين', tone: 'warning' },
            { label: 'مرجع التسوية', value: 'دفعة محلية' },
            { label: 'النطاق المرتبط', value: linkedScopeLabel, tone: 'info' },
            { label: 'حالة الدورة', value: partnerPreview.cycleStatus, tone: 'success' },
          ]}
        />
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          آخر الحركات
        </Text>
        {visibleTransactions.length === 0 ? (
          <StateView
            stateId="empty"
            title="لا توجد حركات مالية بعد"
            description="عند وصول أول تسوية أو عمولة أو دفعة مستحقة ستظهر هنا داخل نفس المساحة."
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

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          توزيع العمولة حسب وضع الخدمة
        </Text>
        <Box gap={2}>
          {commissionRows.map((row) => (
            <Surface key={row.id} tone="default" padding={3} gap={2}>
              <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flex: 1, flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
                  <Icon name={row.icon} size={18} tone="brand" />
                  <Text role="bodyStrong" style={{ textAlign: 'right' }}>
                    {row.title}
                  </Text>
                </View>
                <Badge label={row.enabled ? 'مفعّل' : 'غير مفعّل'} tone={row.enabled ? 'success' : 'warning'} />
                <Text role="bodyStrong" style={{ textAlign: direction === 'rtl' ? 'left' : 'right' }}>
                  {row.percentage}
                </Text>
              </View>
            </Surface>
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          إجراء مالي سريع
        </Text>
        {financialActionsDisabled ? (
          <StateView
            kind="warning"
            title="الإجراءات المالية مقفلة مؤقتًا"
            description="راجع الصلاحية أو حالة الحساب قبل محاولة تنفيذ إجراء مالي من هذه المساحة."
          />
        ) : (
          <Box gap={3}>
            <ActionRow icon="wallet-outline" title="فتح المحفظة الموسعة" subtitle="الانتقال إلى العرض الموسع أو اللوحة المرتبطة إذا كانت متاحة." onPress={() => openAction('expanded-wallet')} />
            <ActionRow icon="document-text-outline" title="مراجعة التسويات" subtitle="فتح المراجعة السريعة للتسويات الحالية من نفس السياق." onPress={() => openAction('settlements')} />
            <ActionRow icon="download-outline" title="تنزيل ملخص مالي" subtitle="عرض التقرير المختصر أو تجهيز ملف الملخص عند توفر الربط." onPress={() => openAction('report')} />
          </Box>
        )}
      </Surface>

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
