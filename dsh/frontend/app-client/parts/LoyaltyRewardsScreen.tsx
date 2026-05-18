import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Surface,
  Text,
  spacing,
  useTheme,
} from '@bthwani/ui-kit';
import { loyaltyRewardsFixture } from '../data/loyalty-commercial.preview-data';

export type DshLoyaltyRewardsScreenProps = {
  title?: string;
  compact?: boolean;
  onStatusChange?: (message: string) => void;
};

type RewardRow = {
  label: string;
  value: string;
  helperText?: string;
};

function LoyaltyActionRow({
  title,
  subtitle,
  badgeLabel,
  badgeTone,
  actionLabel,
  helperText,
  onActionPress,
  showDivider = false,
}: {
  title: string;
  subtitle: string;
  badgeLabel?: string;
  badgeTone?: 'default' | 'success' | 'warning' | 'danger' | 'brand' | 'info';
  actionLabel?: string;
  helperText?: string;
  onActionPress?: () => void;
  showDivider?: boolean;
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
            {badgeLabel ? <Badge label={badgeLabel} tone={badgeTone ?? 'default'} /> : null}
            <Text role="bodyStrong" numberOfLines={1} style={{ textAlign: 'right' }}>
              {title}
            </Text>
          </View>
          <Text role="bodySm" tone="muted" numberOfLines={2} style={{ textAlign: 'right', width: '100%' }}>
            {subtitle}
          </Text>
          {helperText ? (
            <Text role="caption" tone="soft" numberOfLines={1} style={{ textAlign: 'right', width: '100%' }}>
              {helperText}
            </Text>
          ) : null}
        </View>

        {actionLabel ? (
          <Button
            label={actionLabel}
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={onActionPress}
          />
        ) : null}
      </View>
    </View>
  );
}

export function DshLoyaltyRewardsScreen({
  title = 'النقاط والولاء',
  compact = false,
  onStatusChange,
}: DshLoyaltyRewardsScreenProps = {}) {
  const { theme } = useTheme();
  const { metrics, sections } = loyaltyRewardsFixture;
  const rewardsSection = sections.find((section) => section.title.includes('المكافآت'));
  const tierSection = sections.find((section) => section.title.includes('مزايا المستوى'));
  const [showAllRewards, setShowAllRewards] = React.useState(false);
  const [selectedRewardLabel, setSelectedRewardLabel] = React.useState('');

  const rewardItems: RewardRow[] = (rewardsSection?.items ?? []).map((item) => ({
    label: item.label,
    value: item.value,
    helperText: item.helperText,
  }));
  const visibleRewards = showAllRewards ? rewardItems : rewardItems.slice(0, 3);
  const tierHighlight = tierSection?.items?.[0];

  const content = (
    <Box gap={3}>
      {!compact ? (
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Text role="titleSm" style={{ textAlign: 'right' }}>
            {title}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            الرصيد والمستوى وأقرب المكافآت القابلة للاستبدال في عرض واحد.
          </Text>
        </Box>
      ) : null}

      <LoyaltyActionRow
        title="الرصيد الحالي"
        subtitle={metrics[0] ? `${metrics[0].value} • ${metrics[0].helperText}` : 'لا يوجد رصيد ظاهر حاليًا.'}
        badgeLabel="نقاط"
        badgeTone="brand"
        actionLabel="استخدم"
        helperText="سيتم تجهيز أقرب استبدال على الطلب القادم."
        onActionPress={() => onStatusChange?.(`تم تجهيز رصيد ${metrics[0]?.value ?? 'النقاط'} للاستخدام في الطلب القادم.`)}
      />

      <LoyaltyActionRow
        title="المستوى الحالي"
        subtitle={metrics[1] ? `${metrics[1].value} • ${metrics[1].helperText}` : 'لا يوجد مستوى ظاهر حاليًا.'}
        badgeLabel="مستوى"
        badgeTone="success"
        actionLabel="المزايا"
        helperText={tierHighlight?.label ?? 'لا توجد مزايا مرتبطة بالمستوى الحالي.'}
        onActionPress={() => onStatusChange?.(`المزايا المرتبطة بالمستوى الحالي: ${tierHighlight?.label ?? 'غير متاحة الآن'}.`)}
        showDivider
      />

      {visibleRewards.map((reward, index) => {
        const isSelected = selectedRewardLabel === reward.label;
        return (
          <LoyaltyActionRow
            key={`${reward.label}-${reward.value}`}
            title={reward.label}
            subtitle={reward.helperText ?? 'مكافأة قابلة للاستبدال.'}
            badgeLabel={reward.value}
            badgeTone="warning"
            actionLabel={isSelected ? 'جاهزة' : 'اخترها'}
            helperText={isSelected ? 'تم تجهيز هذه المكافأة للاستخدام.' : 'اختر المكافأة الأقرب للطلب القادم.'}
            onActionPress={() => {
              setSelectedRewardLabel(reward.label);
              onStatusChange?.(`تم اختيار ${reward.label} كمكافأة جاهزة للاستخدام.`);
            }}
            showDivider={index === 0}
          />
        );
      })}

      {rewardItems.length > 3 ? (
        <Button
          label={showAllRewards ? 'إخفاء الباقي' : 'عرض الكل'}
          tone="secondary"
          size="sm"
          fullWidth={false}
          onPress={() => setShowAllRewards((current) => !current)}
        />
      ) : null}
    </Box>
  );

  if (compact) {
    return content;
  }

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
      {content}
    </Surface>
  );
}

export default DshLoyaltyRewardsScreen;
