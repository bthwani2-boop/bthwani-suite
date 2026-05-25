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
  ActionStrip,
  Divider,
  Icon,
} from '@bthwani/ui-kit';
import { dshNotificationsFixtures } from '../../data/notifications.preview-data';
import { subscriptionPlanCards } from '../../data/subscriptions.preview-data';
import { DshLoyaltyRewardsScreen } from '../parts/LoyaltyRewardsScreen';
import { DshOperationScreen, type DshOperationScreenProps } from '../parts/OperationScreen';
import { DshSubscriptionsScreen } from '../parts/SubscriptionsScreen';
import { getCampaignItems } from '../../data/campaign.preview-store';
import {
  DSH_LOYALTY_UI_BOUNDARY_NOTE,
  getCampaignVisibilityRecord,
  getPartnerOfferVisibilityRecord,
  isClientVisibleStatus,
  isMarketingRenderable,
} from '../../data/commercial.preview-contract';
import { getEntitlements, getLoyaltyRewards, getLoyaltyTiers } from '../../data/loyalty.preview-store';
import { getPartnerOfferItems } from '../../data/partner-offer.preview-store';

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
  subscription: 'الاشتراكات',
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
}: {
  hint: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: spacing[3] }}>
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right', paddingHorizontal: spacing[3] }}>
        {hint}
      </Text>
      <View style={{ height: 1, backgroundColor: theme.line }} />
      {children}
    </View>
  );
}

function BenefitListRow({
  row,
  isLast = false,
  onActionPress,
}: {
  row: BenefitRow;
  isLast?: boolean;
  onActionPress?: (row: BenefitRow) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const { theme } = useTheme();
  const iconMap: Record<string, import('@bthwani/ui-kit/src/components/icons').IconName> = {
    subscription: 'star-outline',
    offers: 'pricetag-outline',
    loyalty: 'wallet-outline',
    history: 'time-outline',
    now: 'flash-outline'
  };
  const icon = iconMap[row.targetSection ?? 'offers'];

  return (
    <ActionStrip
      icon={icon}
      title={row.title}
      subtitle={
        <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{row.subtitle}</Text>
          {row.badgeLabel && <Badge label={row.badgeLabel} tone={row.badgeTone ?? 'default'} />}
        </View>
      }
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      hideDivider={isLast}
    >
      <View style={{ gap: spacing[3], paddingTop: spacing[1] }}>
        {row.helperText && (
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right', lineHeight: 20 }}>
            {row.helperText}
          </Text>
        )}
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'flex-start', marginTop: spacing[1] }}>
          {row.actionLabel && (
            <Button
              label={row.actionLabel}
              tone="brand"
              size="sm"
              fullWidth={false}
              style={{ minWidth: 120, borderRadius: 8 }}
              onPress={() => {
                onActionPress?.(row);
                setExpanded(false);
              }}
            />
          )}
        </View>
      </View>
    </ActionStrip>
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
  const liveOffers = getPartnerOfferItems().filter((offer) => (
    isMarketingRenderable(getPartnerOfferVisibilityRecord(offer, { targetSurface: 'benefits' }))
  ));
  const liveCampaigns = getCampaignItems().filter((campaign) => (
    isMarketingRenderable(getCampaignVisibilityRecord(campaign, { targetSurface: 'benefits' }))
  ));
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
      helperText: activeEntitlements.length > 0
        ? `${activeEntitlements.length} ميزة مرتبطة بمستواك • ${DSH_LOYALTY_UI_BOUNDARY_NOTE}`
        : DSH_LOYALTY_UI_BOUNDARY_NOTE,
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
          subtitle: 'مزايا اشتراكك النشط جاهزة للاستخدام',
          badgeLabel: 'نشط للمشتركين',
          badgeTone: 'success' as const,
          actionLabel: 'تطبيق الميزة',
          helperText: `التوصيل المجاني والمزايا الحصرية الخاصة بـ "${currentPlan.title}" جاهزة للتطبيق على طلبك القادم.`,
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
        <ContentCard hint={sectionHints.now}>
          <Box gap={0}>
            {nowRows.map((row, index) => (
              <BenefitListRow
                key={row.id}
                row={row}
                isLast={index === nowRows.length - 1}
                onActionPress={(r: BenefitRow) => handleRowAction(r, `انتقلنا إلى ${sectionLabels[(r.targetSection ?? 'now') as DshBenefitsSection]}.`)}
              />
            ))}
          </Box>
        </ContentCard>
      );
    }

    if (focusedSection === 'loyalty') {
      return (
        <ContentCard hint={sectionHints.loyalty}>
          <DshLoyaltyRewardsScreen compact onStatusChange={setFeedback} />
        </ContentCard>
      );
    }

    if (focusedSection === 'subscription') {
      return (
        <ContentCard hint={sectionHints.subscription}>
          <DshSubscriptionsScreen compact onStatusChange={setFeedback} />
        </ContentCard>
      );
    }

    if (focusedSection === 'offers') {
      return (
        <ContentCard hint={sectionHints.offers}>
          {offersRows.length > 0 ? (
            <Box gap={0}>
              {offersRows.map((row, index) => (
                <BenefitListRow
                  key={row.id}
                  row={row}
                  isLast={index === offersRows.length - 1}
                  onActionPress={(r: BenefitRow) => {
                    const msg = r.id === 'subscribers-benefit'
                      ? `تم تطبيق مزايا "${r.title}" على طلبك القادم بنجاح.`
                      : `تم تجهيز "${r.title}" للاستخدام في طلبك القادم.`;
                    setFeedback(msg);
                  }}
                />
              ))}
            </Box>
          ) : (
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              لا توجد عروض أو كوبونات متاحة الآن. نعرض هنا فقط العناصر التي اجتازت بوابة الشريك والنشر والظهور.
            </Text>
          )}
        </ContentCard>
      );
    }

    return (
      <ContentCard hint={sectionHints.history}>
        {historyRows.length > 0 ? (
          <Box gap={0}>
            {historyRows.map((row, index) => (
              <BenefitListRow
                key={row.id}
                row={row}
                isLast={index === historyRows.length - 1}
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
        {/* Success Message Banner (Coherent with Subscriptions screen style) */}
        {feedback ? (
          <View
            style={{
              marginBottom: spacing[2],
              backgroundColor: theme.successSurface,
              padding: spacing[3],
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.success,
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Icon name="checkmark-circle" tone="success" size={20} />
            <Text role="bodyStrong" style={{ color: theme.success, textAlign: 'right', flex: 1 }}>
              {feedback}
            </Text>
          </View>
        ) : null}

        {renderContent()}
      </MobileScrollView>
    </View>
  );
}

export default DshBenefitsHubScreen;
