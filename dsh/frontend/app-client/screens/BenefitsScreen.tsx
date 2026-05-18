import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
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

const sectionLabels: Record<DshBenefitsSection, string> = {
  now: 'الأولوية الآن',
  loyalty: 'النقاط والمكافآت',
  subscription: 'الاشتراك',
  offers: 'العروض والكوبونات',
  history: 'السجل المختصر',
};

const sectionHints: Record<DshBenefitsSection, string> = {
  now: 'أهم ما يمكنك الاستفادة منه قبل طلبك القادم',
  loyalty: 'رصيدك الحالي ومكافآتك المتاحة للاستبدال',
  subscription: 'خطتك الحالية وخيار التعديل متى احتجت',
  offers: 'العروض والكوبونات المتاحة لاستخدامها الآن',
  history: 'آخر التنبيهات المرتبطة بمزاياك',
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
  if (section === 'loyalty') return 'رصيدك الحالي ومكافآتك المتاحة';
  if (section === 'subscription') return 'خطتك الحالية وخيار التعديل';
  if (section === 'offers') return 'العروض المتاحة لاستخدامها الآن';
  if (section === 'history') return 'آخر التنبيهات المرتبطة بمزاياك';
  return 'أهم ما يمكنك الاستفادة منه الآن';
}

function ScreenHeader({ title }: { title: string }) {
  const { theme } = useTheme();

  return (
    <Surface
      tone="raised"
      padding={3}
      gap={0}
      style={{
        borderRadius: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.line,
        paddingTop: safeArea.comfortable + spacing[2],
        minHeight: 44 + safeArea.comfortable + spacing[2],
        justifyContent: 'flex-end',
      }}
    >
      <Text role="titleMd" style={{ textAlign: 'right' }}>
        {title}
      </Text>
    </Surface>
  );
}

function ContentCard({
  hint,
  children,
  feedback,
}: {
  hint: string;
  children: React.ReactNode;
  feedback?: string;
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
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
        {hint}
      </Text>
      <View style={{ height: 1, backgroundColor: theme.line }} />
      {children}
      {feedback ? (
        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
          {feedback}
        </Text>
      ) : null}
    </Surface>
  );
}

function BenefitListRow({
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

export function DshBenefitsHubScreen({
  initialSection,
  onPrimaryAction,
  onRetry,
  onSecondaryAction,
  screenId,
  state = 'ready',
}: DshBenefitsHubScreenProps) {
  const { theme } = useTheme();
  const resolvedInitialSection = normalizeBenefitsSection(screenId, initialSection);
  const [focusedSection, setFocusedSection] = React.useState<DshBenefitsSection>(resolvedInitialSection);
  const [feedback, setFeedback] = React.useState('');

  React.useEffect(() => {
    setFocusedSection(resolvedInitialSection);
  }, [resolvedInitialSection]);

  React.useEffect(() => {
    setFeedback('');
  }, [focusedSection]);

  if (state !== 'ready') {
    return (
      <DshOperationScreen
        state={state}
        title={sectionLabels[resolvedInitialSection] ?? 'مزاياي'}
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
      title: liveOffers[0]?.title ?? 'لا يوجد عرض متاح الآن',
      subtitle: liveOffers[0]
        ? `${liveOffers[0].displayBadge} • ${liveOffers[0].eligibility}`
        : 'سيظهر أول عرض متاح لك هنا فور توفره.',
      badgeLabel: liveOffers[0] ? 'جاهز' : 'قريبًا',
      badgeTone: liveOffers[0] ? 'success' : 'default',
      actionLabel: liveOffers[0] ? 'استخدمه' : undefined,
      helperText: liveOffers[0]?.storeLabel || liveOffers[0]?.partnerName,
      targetSection: 'offers',
    },
    {
      id: 'now-loyalty',
      title: `${activeTier?.minimumPoints ?? 0} نقطة`,
      subtitle: `مستوى ${activeTier?.name ?? 'فضي'} — ${activeRewards.length} مكافأة متاحة للاستبدال الآن`,
      badgeLabel: 'نقاط',
      badgeTone: 'brand',
      actionLabel: 'استبدل',
      helperText: activeEntitlements.length > 0 ? `${activeEntitlements.length} ميزة مرتبطة بمستواك` : undefined,
      targetSection: 'loyalty',
    },
    {
      id: 'now-subscription',
      title: currentPlan?.title ?? 'بدون اشتراك',
      subtitle: `${currentPlan?.price ?? '—'} • ${currentPlan?.cadence ?? ''}`,
      badgeLabel: 'اشتراك',
      badgeTone: 'info',
      actionLabel: 'إدارة',
      helperText: currentPlan?.highlight,
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
      actionLabel: 'استخدم',
      helperText: offer.storeLabel || offer.partnerName,
    })),
    ...(couponReward
      ? [{
          id: couponReward.id,
          title: couponReward.title,
          subtitle: couponReward.description ?? 'يُطبَّق مباشرة على طلبك القادم.',
          badgeLabel: `${couponReward.pointsCost} نقطة`,
          badgeTone: 'warning' as const,
          actionLabel: 'استبدل',
        }]
      : []),
    ...(currentPlan?.current
      ? [{
          id: 'subscribers-benefit',
          title: currentPlan.title,
          subtitle: currentPlan.highlight,
          badgeLabel: 'للمشتركين',
          badgeTone: 'info' as const,
          actionLabel: 'تفعيل',
          helperText: currentPlan.note,
        }]
      : []),
    ...liveCampaigns.slice(0, 1).map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      subtitle: campaign.subtitle,
      badgeLabel: 'حملة',
      badgeTone: 'brand' as const,
      actionLabel: 'شارك',
      helperText: campaign.goal,
    })),
  ].slice(0, 3);

  const historyRows: BenefitRow[] = commercialNotifications.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    badgeLabel: item.category === 'subscription' ? 'اشتراك' : 'عرض',
    badgeTone: item.category === 'subscription' ? 'info' : 'warning',
    actionLabel: item.category === 'subscription' ? 'الاشتراك' : 'العرض',
    helperText: item.relativeTime ?? item.meta,
    targetSection: item.category === 'subscription' ? 'subscription' : 'offers',
  }));

  const handleRowAction = (row: BenefitRow, feedbackMsg: string) => {
    if (row.targetSection) {
      setFocusedSection(row.targetSection);
      return;
    }
    setFeedback(feedbackMsg);
  };

  const renderContent = () => {
    if (focusedSection === 'now') {
      return (
        <ContentCard hint={sectionHints.now} feedback={feedback}>
          <Box gap={0}>
            {nowRows.map((row, index) => (
              <BenefitListRow
                key={row.id}
                row={row}
                showDivider={index > 0}
                onActionPress={(r: BenefitRow) => handleRowAction(r, `انتقلنا إلى ${sectionLabels[(r.targetSection ?? 'now') as DshBenefitsSection]}.`)}
              />
            ))}
          </Box>
        </ContentCard>
      );
    }

    if (focusedSection === 'loyalty') {
      return (
        <ContentCard hint={sectionHints.loyalty} feedback={feedback}>
          <DshLoyaltyRewardsScreen compact onStatusChange={setFeedback} />
        </ContentCard>
      );
    }

    if (focusedSection === 'subscription') {
      return (
        <ContentCard hint={sectionHints.subscription} feedback={feedback}>
          <DshSubscriptionsScreen compact onStatusChange={setFeedback} />
        </ContentCard>
      );
    }

    if (focusedSection === 'offers') {
      return (
        <ContentCard hint={sectionHints.offers} feedback={feedback}>
          {offersRows.length > 0 ? (
            <Box gap={0}>
              {offersRows.map((row, index) => (
                <BenefitListRow
                  key={row.id}
                  row={row}
                  showDivider={index > 0}
                  onActionPress={(r: BenefitRow) => setFeedback(`تم تجهيز "${r.title}" للاستخدام في طلبك القادم.`)}
                />
              ))}
            </Box>
          ) : (
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              لا توجد عروض أو كوبونات متاحة الآن.
            </Text>
          )}
        </ContentCard>
      );
    }

    return (
      <ContentCard hint={sectionHints.history} feedback={feedback}>
        {historyRows.length > 0 ? (
          <Box gap={0}>
            {historyRows.map((row, index) => (
              <BenefitListRow
                key={row.id}
                row={row}
                showDivider={index > 0}
                onActionPress={(r: BenefitRow) => handleRowAction(r, `انتقلنا إلى ${sectionLabels[(r.targetSection ?? 'history') as DshBenefitsSection]}.`)}
              />
            ))}
          </Box>
        ) : (
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            لا يوجد سجل حاليًا.
          </Text>
        )}
      </ContentCard>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <ScreenHeader title={sectionLabels[focusedSection] ?? 'مزاياي'} />

      <MobileScrollView
        fill
        padding={3}
        gap={3}
        contentContainerStyle={{
          paddingBottom: safeArea.comfortable + spacing[12],
          paddingTop: spacing[2],
        }}
      >
        {renderContent()}
      </MobileScrollView>
    </View>
  );
}

export default DshBenefitsHubScreen;
