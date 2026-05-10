import React from 'react';
import { Box, Card, KeyValueList, SectionHeader, Surface, Text, useTheme } from '@bthwani/ui-kit';
import { loyaltyRewardsFixture } from './loyaltyCommercialDeck';

export type DshLoyaltyRewardsScreenProps = {
  compact?: boolean;
};

export function DshLoyaltyRewardsScreen({ compact = false }: DshLoyaltyRewardsScreenProps) {
  const { theme } = useTheme();
  const { metrics, sections } = loyaltyRewardsFixture;

  function LoyaltyMetricCard({ label, value, helperText, tone }: { label: string; value: string; helperText: string; tone: 'brand' | 'info' | 'warning' | 'success'; }) {
    const accent = {
      brand: theme.brand,
      info: theme.info,
      warning: theme.warning,
      success: theme.success,
    }[tone];

    return (
      <Card
        title={label}
        subtitle={helperText}
        style={{ flexBasis: '48%', flexGrow: 1, borderRadius: 18, borderWidth: 1, borderColor: theme.line }}
      >
        <Text role="hero" style={{ color: accent }}>
          {value}
        </Text>
      </Card>
    );
  }

  function LoyaltySectionCard({
    title,
    subtitle,
    items,
  }: {
    title: string;
    subtitle: string;
    items: Array<{ label: string; value: string; helperText?: string; tone?: 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }>;
  }) {
    return (
      <Card
        title={title}
        subtitle={subtitle}
        style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line }}
      >
        <KeyValueList items={items} dense />
      </Card>
    );
  }

  return (
    <Box gap={compact ? 2 : 3}>
      <Surface
        tone="raised"
        gap={2}
        padding={compact ? 2 : 3}
        style={{
          borderWidth: 1,
          borderColor: theme.brand,
          borderRadius: 22,
          backgroundColor: theme.brandSurface,
        }}
      >
        <SectionHeader
          title={loyaltyRewardsFixture.title}
          subtitle={loyaltyRewardsFixture.subtitle}
        />
      </Surface>

      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        {metrics.map((metric) => (
          <LoyaltyMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            helperText={metric.helperText}
            tone={metric.tone}
          />
        ))}
      </Box>

      <Box gap={2}>
        {sections.map((section) => (
          <LoyaltySectionCard
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            items={section.items}
          />
        ))}
      </Box>
    </Box>
  );
}

export default DshLoyaltyRewardsScreen;
