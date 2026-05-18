import React from 'react';
import { Pressable, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  MobileScrollView,
  Surface,
  Text,
  safeArea,
  spacing,
  useTheme,
} from '@bthwani/ui-kit';
import { dshNotificationsFixtures } from '../data/notifications.preview-data';
import { subscriptionPlanCards } from '../data/subscriptions-commercial.preview-data';
import { DshLoyaltyRewardsScreen } from '../parts/LoyaltyRewardsScreen';
import { DshOperationScreen, type DshOperationScreenProps } from '../parts/OperationScreen';
import { DshSubscriptionsScreen } from '../parts/SubscriptionsScreen';
import { getCampaignItems } from '../../shared/campaign.preview-store';
import {
  isClientVisibleStatus,
  normalizeCommercialStatus,
} from '../../shared/commercial.preview-contract';
import { getEntitlements, getLoyaltyRewards, getLoyaltyTiers } from '../../shared/loyalty.preview-store';
import { getPartnerOfferItems } from '../../shared/partner-offer.preview-store';

type DshBenefitsSection = 'now' | 'loyalty' | 'subscription' | 'offers' | 'history';

export type DshBenefitsInitialSection = DshBenefitsSection | 'available';

export type DshBenefitsHubScreenProps = Omit<DshOperationScreenProps, 'title' | 'subtitle'> & {
  initialSection?: DshBenefitsInitialSection;
  onBack?: () => void;
  screenId?: string;
};

type BenefitRow = {
  id: string;
  title: string;
  subtitle: string;
  badgeLabel?: string;
  badgeTone?: 'default' | 'success' | 'warning' | 'danger' | 'brand' | 'info';
  actionLabel?: string;
  helperText?: string;
  targetSection?: DshBenefitsSection;
};

type SectionPickerItem = {
  value: DshBenefitsSection;
  label: string;
  summary: string;
  badgeLabel: string;
  badgeTone: 'default' | 'success' | 'warning' | 'danger' | 'brand' | 'info';
  iconName: React.ComponentProps<typeof Icon>['name'];
};

const sectionRows: SectionPickerItem[] = [
  {
    value: 'now',
    label: 'الأولوية الآن',
    summary: 'أقصر طريق لما يفيد الطلب القادم مباشرة.',
    badgeLabel: 'ذكي',
    badgeTone: 'brand',
    iconName: 'flash-outline',
  },
  {
    value: 'loyalty',
    label: 'النقاط والمكافآت',
    summary: 'الرصيد، المستوى، وأقرب ثلاث مكافآت.',
    badgeLabel: 'نقاط',
    badgeTone: 'info',
    iconName: 'star-outline',
  },
  {
    value: 'subscription',
    label: 'الاشتراك',
    summary: 'الخطة الحالية والتبديل عند الحاجة فقط.',
    badgeLabel: 'خطة',
    badgeTone: 'default',
    iconName: 'card-outline',
  },
  {
    value: 'offers',
    label: 'العروض والكوبونات',
    summary: 'ثلاث فرص قابلة للاستخدام بدل قائمة طويلة.',
    badgeLabel: 'متاح',
    badgeTone: 'success',
    iconName: 'pricetag-outline',
  },
  {
    value: 'history',
    label: 'السجل المختصر',
    summary: 'آخر ثلاث إشعارات يمكن الرجوع منها للمسار المناسب.',
    badgeLabel: 'حديث',
    badgeTone: 'warning',
    iconName: 'time-outline',
  },
];

const sectionLabels: Record<DshBenefitsSection, string> = {
  now: 'الأولوية الآن',
  loyalty: 'النقاط والمكافآت',
  subscription: 'الاشتراك',
  offers: 'العروض والكوبونات',
  history: 'السجل المختصر',
};

const sectionDescriptions: Record<DshBenefitsSection, string> = {
  now: 'ثلاثة صفوف فقط لما يمكن استخدامه أو مراجعته الآن.',
  loyalty: 'الرصيد، المستوى، والمكافآت الأقرب بدون شاشة منفصلة.',
  subscription: 'الخطة الحالية مع خيار تبديل واضح عند الحاجة.',
  offers: 'العرض الجاهز، ما يحتاج نقاط، وما يخص المشتركين.',
  history: 'آخر الأحداث مع فتح سريع للمسار المرتبط بها.',
};

function normalizeBenefitsSection(
  screenId?: string,
  initialSection?: DshBenefitsInitialSection,
): DshBenefitsSection {
  const requested = initialSection === 'available' ? 'now' : initialSection;
  if (requested) {
    return requested;
  }

  const normalizedScreenId = (screenId ?? '').toLowerCase();
  if (
    normalizedScreenId === 'subscription'
    || normalizedScreenId === 'subscriptions'
    || normalizedScreenId.startsWith('subscription')
  ) {
    return 'subscription';
  }

  if (
    normalizedScreenId === 'entitlements-get'
    || normalizedScreenId.startsWith('loyalty')
    || normalizedScreenId.includes('entitlement')
  ) {
    return 'loyalty';
  }

  if (
    normalizedScreenId.includes('promo')
    || normalizedScreenId.includes('offer')
    || normalizedScreenId.includes('coupon')
    || normalizedScreenId.includes('campaign')
    || normalizedScreenId.includes('commercial')
  ) {
    return 'offers';
  }

  if (normalizedScreenId.includes('history') || normalizedScreenId.includes('notification')) {
    return 'history';
  }

  return 'now';
}

function resolveStateSubtitle(section: DshBenefitsSection) {
  if (section === 'loyalty') {
    return 'نعرض النقاط والمكافآت من نفس المسار بدل فتح شاشة منفصلة.';
  }
  if (section === 'subscription') {
    return 'نعرض الاشتراك الحالي وخيارات الباقة من نفس المسار.';
  }
  if (section === 'offers') {
    return 'نعرض العروض والكوبونات المتاحة من نفس الصفحة.';
  }
  if (section === 'history') {
    return 'نعرض آخر السجل والتنبيهات المرتبطة بالمزايا.';
  }
  return 'نجهّز ملخص المزايا الحالية داخل صفحة قصيرة وموحّدة.';
}

function BenefitsHeader({
  onBack,
}: {
  onBack?: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Surface
      tone="raised"
      padding={3}
      gap={2}
      style={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderWidth: 1,
        borderColor: theme.line,
        paddingTop: safeArea.comfortable + spacing[2],
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[3],
          minHeight: 46,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="العودة"
          disabled={!onBack}
          hitSlop={8}
          onPress={onBack}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: theme.line,
            backgroundColor: theme.surface,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: onBack ? (pressed ? 0.9 : 1) : 0,
          })}
        >
          <Icon name="chevron-back-outline" size={18} color={theme.text} />
        </Pressable>

        <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
          <Text role="titleMd" style={{ textAlign: 'right' }}>
            مزاياي
          </Text>
          <Text role="bodySm" tone="muted" numberOfLines={1} style={{ textAlign: 'right' }}>
            النقاط، الاشتراك، العروض والكوبونات
          </Text>
        </View>
      </View>
    </Surface>
  );
}

function HeroMetricRow({
  label,
  value,
  helperText,
}: {
  label: string;
  value: string;
  helperText: string;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[3],
        paddingVertical: spacing[2],
      }}
    >
      <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
        <Text role="bodyStrong" numberOfLines={1} style={{ textAlign: 'right' }}>
          {label}
        </Text>
        <Text role="caption" tone="soft" numberOfLines={1} style={{ textAlign: 'right' }}>
          {helperText}
        </Text>
      </View>
      <Text role="bodyStrong" style={{ textAlign: 'left', color: theme.text }}>
        {value}
      </Text>
    </View>
  );
}

function BenefitFocusRow({
  item,
  active,
  onPress,
}: {
  item: SectionPickerItem;
  active: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: 18,
        backgroundColor: active ? theme.brandSurface : pressed ? theme.surfaceInset : 'transparent',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[3],
      })}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[3],
        }}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: spacing[3],
            flex: 1,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: active ? theme.brand : theme.line,
              backgroundColor: active ? theme.surface : theme.surfaceInset,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={item.iconName} size={18} color={active ? theme.brand : theme.textSoft} />
          </View>

          <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: spacing[2],
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              <Badge label={item.badgeLabel} tone={item.badgeTone} />
              <Text role="bodyStrong" numberOfLines={1} style={{ textAlign: 'right' }}>
                {item.label}
              </Text>
            </View>
            <Text role="bodySm" tone="muted" numberOfLines={2} style={{ textAlign: 'right', width: '100%' }}>
              {item.summary}
            </Text>
          </View>
        </View>

        <Icon name="chevron-back-outline" size={18} color={active ? theme.brand : theme.textSoft} />
      </View>
    </Pressable>
  );
}

function CompactBenefitRow({
  row,
  showDivider = false,
  onActionPress,
}: {
  row: BenefitRow;
  showDivider?: boolean;
  onActionPress?: (row: BenefitRow) => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        borderTopWidth: showDivider ? 1 : 0,
        borderTopColor: theme.line,
        paddingTop: showDivider ? spacing[3] : 0,
        marginTop: showDivider ? spacing[3] : 0,
      }}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: spacing[3],
        }}
      >
        <View style={{ flex: 1, alignItems: 'flex-end', gap: spacing[1] }}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: spacing[2],
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            {row.badgeLabel ? <Badge label={row.badgeLabel} tone={row.badgeTone ?? 'default'} /> : null}
            <Text role="bodyStrong" numberOfLines={1} style={{ textAlign: 'right' }}>
              {row.title}
            </Text>
          </View>
          <Text role="bodySm" tone="muted" numberOfLines={2} style={{ textAlign: 'right', width: '100%' }}>
            {row.subtitle}
          </Text>
          {row.helperText ? (
            <Text role="caption" tone="soft" numberOfLines={1} style={{ textAlign: 'right', width: '100%' }}>
              {row.helperText}
            </Text>
          ) : null}
        </View>

        {row.actionLabel ? (
          <Button
            label={row.actionLabel}
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => onActionPress?.(row)}
          />
        ) : null}
      </View>
    </View>
  );
}

function SectionPanel({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <Surface
      tone="raised"
      padding={3}
      gap={3}
      style={{
        borderWidth: 1,
        borderColor: theme.line,
        borderRadius: 22,
      }}
    >
      <Box gap={1} style={{ alignItems: 'flex-end' }}>
        <Text role="titleSm" style={{ textAlign: 'right' }}>
          {title}
        </Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {subtitle}
        </Text>
      </Box>
      {children}
      {footer}
    </Surface>
  );
}

export function DshBenefitsHubScreen({
  initialSection,
  onBack,
  onPrimaryAction,
  onRetry,
  onSecondaryAction,
  screenId,
  state = 'ready',
}: DshBenefitsHubScreenProps) {
  const { theme } = useTheme();
  const resolvedInitialSection = normalizeBenefitsSection(screenId, initialSection);
  const [focusedSection, setFocusedSection] = React.useState<DshBenefitsSection>(resolvedInitialSection);
  const [selectionMessage, setSelectionMessage] = React.useState('');

  React.useEffect(() => {
    setFocusedSection(resolvedInitialSection);
  }, [resolvedInitialSection]);

  React.useEffect(() => {
    setSelectionMessage('');
  }, [focusedSection]);

  if (state !== 'ready') {
    return (
      <DshOperationScreen
        state={state}
        title="مزاياي"
        subtitle={resolveStateSubtitle(resolvedInitialSection)}
        onPrimaryAction={onPrimaryAction}
        onRetry={onRetry}
        onSecondaryAction={onSecondaryAction}
      />
    );
  }

  const loyaltyTiers = getLoyaltyTiers();
  const activeTier = loyaltyTiers[loyaltyTiers.length - 1];
  const activeRewards = getLoyaltyRewards().filter((reward) => isClientVisibleStatus(reward.status));
  const activeEntitlements = getEntitlements().filter((entitlement) => entitlement.status === 'active');
  const currentPlan = subscriptionPlanCards.find((plan) => plan.current) ?? subscriptionPlanCards[0];
  const liveOffers = getPartnerOfferItems().filter((offer) => {
    const normalizedStatus = normalizeCommercialStatus(offer.status);
    return normalizedStatus ? isClientVisibleStatus(normalizedStatus) : false;
  });
  const liveCampaigns = getCampaignItems().filter((campaign) => {
    const normalizedStatus = normalizeCommercialStatus(campaign.status);
    return normalizedStatus ? isClientVisibleStatus(normalizedStatus) : false;
  });
  const commercialNotifications = dshNotificationsFixtures
    .filter((item) => item.category === 'offer' || item.category === 'subscription')
    .slice(0, 3);
  const couponReward = activeRewards.find((reward) => reward.title.includes('كوبون'));

  const nowRows: BenefitRow[] = [
    {
      id: 'now-offer',
      title: liveOffers[0]?.title ?? 'لا يوجد عرض مباشر الآن',
      subtitle: liveOffers[0]
        ? `${liveOffers[0].displayBadge} • ${liveOffers[0].eligibility}`
        : 'أول فرصة قابلة للاستخدام ستظهر هنا فور توفرها.',
      badgeLabel: liveOffers[0] ? 'جاهز' : 'قريبًا',
      badgeTone: liveOffers[0] ? 'success' : 'default',
      actionLabel: liveOffers[0] ? 'استخدمه' : 'راجع',
      helperText: liveOffers[0]?.storeLabel || liveOffers[0]?.partnerName,
      targetSection: 'offers',
    },
    {
      id: 'now-loyalty',
      title: `رصيدك ${activeTier?.minimumPoints ?? 0} نقطة`,
      subtitle: `مستوى ${activeTier?.name ?? 'فضي'} مع ${activeRewards.length} مكافآت قابلة للمراجعة الآن.`,
      badgeLabel: 'نقاط',
      badgeTone: 'brand',
      actionLabel: 'افتح',
      helperText: `${activeEntitlements.length} مزايا مرتبطة بالمستوى الحالي`,
      targetSection: 'loyalty',
    },
    {
      id: 'now-subscription',
      title: currentPlan?.title ?? 'بدون اشتراك محدد',
      subtitle: `${currentPlan?.price ?? '—'} • ${currentPlan?.cadence ?? 'لا توجد دورة واضحة'}`,
      badgeLabel: 'اشتراك',
      badgeTone: 'info',
      actionLabel: 'بدّل',
      helperText: 'الخطة الحالية وخيار تبديل الباقة من نفس الصفحة.',
      targetSection: 'subscription',
    },
  ];

  const offersRows: BenefitRow[] = [
    ...liveOffers.slice(0, 2).map((offer) => ({
      id: offer.id,
      title: offer.title,
      subtitle: `${offer.displayBadge} • ${offer.eligibility}`,
      badgeLabel: 'متاح',
      badgeTone: 'success' as const,
      actionLabel: 'جهّزه',
      helperText: offer.storeLabel || offer.partnerName,
    })),
    ...(couponReward
      ? [{
          id: couponReward.id,
          title: couponReward.title,
          subtitle: couponReward.description ?? 'استبدال مباشر على طلبك القادم.',
          badgeLabel: 'يحتاج نقاط',
          badgeTone: 'warning' as const,
          actionLabel: 'استبدل',
          helperText: `${couponReward.pointsCost} نقطة`,
        }]
      : []),
    ...(currentPlan?.current
      ? [{
          id: 'subscribers-benefit',
          title: currentPlan.title,
          subtitle: currentPlan.highlight,
          badgeLabel: 'للمشتركين',
          badgeTone: 'info' as const,
          actionLabel: 'افتح',
          helperText: currentPlan.note,
        }]
      : []),
    ...liveCampaigns.slice(0, 1).map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      subtitle: campaign.subtitle,
      badgeLabel: 'متاح',
      badgeTone: 'brand' as const,
      actionLabel: 'راجع',
      helperText: campaign.goal,
    })),
  ].slice(0, 3);

  const historyRows: BenefitRow[] = commercialNotifications.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    badgeLabel: item.category === 'subscription' ? 'اشتراك' : 'عرض',
    badgeTone: item.category === 'subscription' ? 'info' : 'warning',
    actionLabel: item.category === 'subscription' ? 'افتح الاشتراك' : 'افتح العرض',
    helperText: item.relativeTime ?? item.meta,
    targetSection: item.category === 'subscription' ? 'subscription' : 'offers',
  }));

  const handleCrossSectionAction = (row: BenefitRow, fallbackMessage: string) => {
    if (row.targetSection) {
      setFocusedSection(row.targetSection);
      setSelectionMessage(fallbackMessage);
      return;
    }

    setSelectionMessage(fallbackMessage);
  };

  const renderSectionContent = () => {
    if (focusedSection === 'now') {
      return (
        <SectionPanel
          title={sectionLabels.now}
          subtitle={sectionDescriptions.now}
          footer={selectionMessage ? <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{selectionMessage}</Text> : undefined}
        >
          <View>
            {nowRows.map((row, index) => (
              <CompactBenefitRow
                key={row.id}
                row={row}
                showDivider={index > 0}
                onActionPress={(selectedRow) => handleCrossSectionAction(selectedRow, `فتحنا مسار ${sectionLabels[selectedRow.targetSection ?? 'now']} مباشرة.`)}
              />
            ))}
          </View>
        </SectionPanel>
      );
    }

    if (focusedSection === 'loyalty') {
      return (
        <SectionPanel
          title={sectionLabels.loyalty}
          subtitle={sectionDescriptions.loyalty}
          footer={selectionMessage ? <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{selectionMessage}</Text> : undefined}
        >
          <DshLoyaltyRewardsScreen compact onStatusChange={setSelectionMessage} />
        </SectionPanel>
      );
    }

    if (focusedSection === 'subscription') {
      return (
        <SectionPanel
          title={sectionLabels.subscription}
          subtitle={sectionDescriptions.subscription}
          footer={selectionMessage ? <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{selectionMessage}</Text> : undefined}
        >
          <DshSubscriptionsScreen compact onStatusChange={setSelectionMessage} />
        </SectionPanel>
      );
    }

    if (focusedSection === 'offers') {
      return (
        <SectionPanel
          title={sectionLabels.offers}
          subtitle={sectionDescriptions.offers}
          footer={selectionMessage ? <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{selectionMessage}</Text> : undefined}
        >
          <View>
            {offersRows.length > 0 ? (
              offersRows.map((row, index) => (
                <CompactBenefitRow
                  key={row.id}
                  row={row}
                  showDivider={index > 0}
                  onActionPress={(selectedRow) => setSelectionMessage(`تم تجهيز ${selectedRow.title} للاستخدام في الطلب القادم.`)}
                />
              ))
            ) : (
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                لا توجد عروض أو كوبونات مرئية الآن ضمن البيانات الحالية.
              </Text>
            )}
          </View>
        </SectionPanel>
      );
    }

    return (
      <SectionPanel
        title={sectionLabels.history}
        subtitle={sectionDescriptions.history}
        footer={selectionMessage ? <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{selectionMessage}</Text> : undefined}
      >
        <View>
          {historyRows.length > 0 ? (
            historyRows.map((row, index) => (
              <CompactBenefitRow
                key={row.id}
                row={row}
                showDivider={index > 0}
                onActionPress={(selectedRow) => handleCrossSectionAction(selectedRow, `رجعناك إلى مسار ${sectionLabels[selectedRow.targetSection ?? 'history']} من السجل.`)}
              />
            ))
          ) : (
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              لا يوجد سجل مختصر حاليًا.
            </Text>
          )}
        </View>
      </SectionPanel>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <BenefitsHeader onBack={onBack ?? onSecondaryAction ?? onPrimaryAction} />

      <MobileScrollView
        fill
        padding={3}
        gap={3}
        contentContainerStyle={{
          paddingBottom: safeArea.comfortable + spacing[12],
          paddingTop: spacing[1],
        }}
      >
        <Surface
          tone="brand"
          padding={3}
          gap={2}
          style={{
            borderWidth: 1,
            borderColor: theme.line,
            borderRadius: 24,
          }}
        >
          <Box gap={1} style={{ alignItems: 'flex-end' }}>
            <Text role="titleSm" style={{ textAlign: 'right' }}>
              مزاياك جاهزة
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              صفحة قصيرة تقترح الخطوة الأنسب ثم تفتح لك المسار النشط فقط.
            </Text>
          </Box>

          <HeroMetricRow
            label="النقاط"
            value={`${activeTier?.minimumPoints ?? 0} نقطة`}
            helperText={`المستوى الحالي: ${activeTier?.name ?? 'فضي'}`}
          />
          <HeroMetricRow
            label="المكافآت"
            value={String(activeRewards.length)}
            helperText="جاهزة أو قريبة للاستخدام"
          />
          <HeroMetricRow
            label="الاشتراك"
            value={currentPlan?.price ?? '—'}
            helperText={currentPlan?.title ?? 'بدون اشتراك'}
          />

          <Button
            label="استخدم في الطلب القادم"
            tone="brand"
            size="sm"
            fullWidth={false}
            onPress={() => setFocusedSection('offers')}
          />
        </Surface>

        <Surface
          tone="raised"
          padding={1}
          gap={0}
          style={{
            borderWidth: 1,
            borderColor: theme.line,
            borderRadius: 22,
          }}
        >
          {sectionRows.map((item, index) => (
            <View
              key={item.value}
              style={{
                borderTopWidth: index > 0 ? 1 : 0,
                borderTopColor: theme.line,
              }}
            >
              <BenefitFocusRow
                item={item}
                active={focusedSection === item.value}
                onPress={() => setFocusedSection(item.value)}
              />
            </View>
          ))}
        </Surface>

        {renderSectionContent()}
      </MobileScrollView>
    </View>
  );
}

export default DshBenefitsHubScreen;
