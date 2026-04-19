import React from 'react';
import { BthBox, BthCard, BthKeyValueList, BthSectionHeader, BthSurface, BthText, useTheme } from '@bthwani/ui-kit';
import { loyaltyRewardsFixture } from '../loyaltyCommercialDeck';

export type LoyaltyRewardsPageProps = {
  compact?: boolean;
};

export function LoyaltyRewardsPage({ compact = false }: LoyaltyRewardsPageProps) {
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
      <BthCard
        title={label}
        subtitle={helperText}
        style={{ flexBasis: '48%', flexGrow: 1, borderRadius: 18, borderWidth: 1, borderColor: theme.line }}
      >
        <BthText role="hero" style={{ color: accent }}>
          {value}
        </BthText>
      </BthCard>
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
      <BthCard
        title={title}
        subtitle={subtitle}
        style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line }}
      >
        <BthKeyValueList items={items} dense />
      </BthCard>
    );
  }

  return (
    <BthBox gap={compact ? 2 : 3}>
      <BthSurface
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
        <BthSectionHeader
          title={loyaltyRewardsFixture.title}
          subtitle={loyaltyRewardsFixture.subtitle}
        />
      </BthSurface>

      <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        {metrics.map((metric) => (
          <LoyaltyMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            helperText={metric.helperText}
            tone={metric.tone}
          />
        ))}
      </BthBox>

      <BthBox gap={2}>
        {sections.map((section) => (
          <LoyaltySectionCard
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            items={section.items}
          />
        ))}
      </BthBox>
    </BthBox>
  );
}

export default LoyaltyRewardsPage;