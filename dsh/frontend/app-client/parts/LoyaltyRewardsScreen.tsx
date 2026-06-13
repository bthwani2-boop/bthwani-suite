import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Divider,
  Surface,
  Text,
  spacing,
  useTheme,
  ActionStrip,
} from '@bthwani/ui-kit';
import type { LoyaltyClientMetric, LoyaltyClientSection } from '../../shared/commercial-contract';

export type DshLoyaltyRewardsScreenProps = {
  title?: string;
  compact?: boolean;
  metrics?: LoyaltyClientMetric[];
  sections?: LoyaltyClientSection[];
  onStatusChange?: (message: string) => void;
};

type RewardRow = {
  label: string;
  value: string;
  helperText?: string;
};

export function DshLoyaltyRewardsScreen({
  title = 'النقاط والولاء',
  compact = false,
  metrics = [],
  sections = [],
  onStatusChange,
}: DshLoyaltyRewardsScreenProps = {}) {
  const { theme } = useTheme();
  const rewardsSection = sections.find((section) => section.title.includes('المكافآت'));
  const tierSection = sections.find((section) => section.title.includes('مزايا المستوى'));
  const [showAllRewards, setShowAllRewards] = React.useState(false);
  const [selectedRewardLabel, setSelectedRewardLabel] = React.useState('');
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

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

      <View style={{ paddingTop: spacing[2] }}>
        <Divider />
        <ActionStrip
          icon="wallet-outline"
          title="الرصيد الحالي"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {metrics[0] ? `${metrics[0].value} • ${metrics[0].helperText}` : 'لا يوجد رصيد ظاهر حاليًا.'}
              </Text>
              <Badge label="نقاط" tone="brand" />
            </View>
          }
          expanded={expandedRow === 'balance'}
          onPress={() => setExpandedRow(expandedRow === 'balance' ? null : 'balance')}
          hideDivider={false}
        >
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginBottom: spacing[2] }}>سيتم تجهيز أقرب استبدال على الطلب القادم.</Text>
          <Button label="استخدم" tone="secondary" size="sm" onPress={() => onStatusChange?.(`تم تجهيز رصيد ${metrics[0]?.value ?? 'النقاط'} للاستخدام في الطلب القادم.`)} />
        </ActionStrip>

        <ActionStrip
          icon="star-outline"
          title="المستوى الحالي"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {metrics[1] ? `${metrics[1].value} • ${metrics[1].helperText}` : 'لا يوجد مستوى ظاهر حاليًا.'}
              </Text>
              <Badge label="مستوى" tone="success" />
            </View>
          }
          expanded={expandedRow === 'tier'}
          onPress={() => setExpandedRow(expandedRow === 'tier' ? null : 'tier')}
          hideDivider={visibleRewards.length === 0}
        >
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginBottom: spacing[2] }}>{tierHighlight?.label ?? 'لا توجد مزايا مرتبطة بالمستوى الحالي.'}</Text>
          <Button label="المزايا" tone="secondary" size="sm" onPress={() => onStatusChange?.(`المزايا المرتبطة بالمستوى الحالي: ${tierHighlight?.label ?? 'غير متاحة الآن'}.`)} />
        </ActionStrip>

        {visibleRewards.map((reward, index) => {
          const isSelected = selectedRewardLabel === reward.label;
          const rowId = `reward-${index}`;
          return (
            <ActionStrip
              key={`${reward.label}-${reward.value}`}
              icon="gift-outline"
              title={reward.label}
              subtitle={
                <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                    {reward.helperText ?? 'مكافأة قابله للاستبدال.'}
                  </Text>
                  <Badge label={reward.value} tone="warning" />
                </View>
              }
              expanded={expandedRow === rowId}
              onPress={() => setExpandedRow(expandedRow === rowId ? null : rowId)}
              hideDivider={index === visibleRewards.length - 1}
            >
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginBottom: spacing[2] }}>{isSelected ? 'تم تجهيز هذه المكافأة للاستخدام.' : 'اختر المكافأة الأقرب للطلب القادم.'}</Text>
              <Button
                label={isSelected ? 'جاهزة' : 'اخترها'}
                tone={isSelected ? 'brand' : 'secondary'}
                size="sm"
                onPress={() => {
                  setSelectedRewardLabel(reward.label);
                  onStatusChange?.(`تم اختيار ${reward.label} كمكافأة جاهزة للاستخدام.`);
                  setExpandedRow(null);
                }}
              />
            </ActionStrip>
          );
        })}
      </View>


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
