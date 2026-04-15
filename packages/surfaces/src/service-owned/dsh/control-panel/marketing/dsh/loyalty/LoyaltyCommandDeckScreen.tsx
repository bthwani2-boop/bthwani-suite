import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BthBox,
  BthButton,
  BthKeyValueList,
  BthListItem,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard, BthWebSignalCard } from '@bthwani/ui-kit/web';
import {
  loyaltyCommercialLaneItems,
  loyaltyCommercialKeyValues,
  loyaltyCommercialSignals,
} from './loyaltyCommerceData';

export type LoyaltyCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
};

export function LoyaltyCommandDeckScreen({ hubHref = '/operations/dsh', operationsHref = '/operations' }: LoyaltyCommandDeckScreenProps) {
  const router = useRouter();

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={['Loyalty', 'Subscription', 'Coupon']}
        eyebrow="DSH commercial loyalty"
        title="Subscription, points, and coupon truth in one owned lane"
        description="The marketing control panel now shows the same commercial truth that the client and partner surfaces consume: plans, points, promos, and sync state stay visible together."
        metaItems={[
          'Subscription family + entitlements',
          'Points accrual + redemption',
          'Coupon application inside pricing',
        ]}
        primaryAction={{ label: 'Open operations hub', href: hubHref }}
        secondaryAction={{ label: 'Open marketing workspace', href: operationsHref }}
      />

      <BthBox gap={2}>
        {loyaltyCommercialSignals.map((signal) => (
          <BthWebSignalCard
            key={signal.title}
            title={signal.title}
            value={signal.value}
            description={signal.description}
            tone={signal.title === 'Subscription tier' ? 'best' : undefined}
          />
        ))}
      </BthBox>

      <BthWebSectionCard title="Commercial state" description="The customer and branch views should point to the same commercial contract, not separate stories.">
        <BthBox gap={3}>
          <BthKeyValueList items={loyaltyCommercialKeyValues} />
          <BthSurface tone="raised" gap={2}>
            {loyaltyCommercialLaneItems.map((item) => (
              <BthListItem
                key={item.title}
                title={item.title}
                subtitle={item.subtitle}
                meta={item.meta}
                badgeLabel={item.badgeLabel}
              />
            ))}
          </BthSurface>
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title="Surface alignment" description="These are the related customer and partner surfaces already carrying the same commercial truth.">
        <BthBox gap={2}>
          <BthText role="bodySm" tone="muted">
            Client loyalty, checkout promo, and partner subscription review should all remain consistent with the same points, coupon, and entitlement rules.
          </BthText>
          <BthButton label="Open operations hub" onPress={() => router.push(hubHref)} />
          <BthButton label="Open marketing workspace" tone="secondary" onPress={() => router.push(operationsHref)} />
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  );
}

export default LoyaltyCommandDeckScreen;
