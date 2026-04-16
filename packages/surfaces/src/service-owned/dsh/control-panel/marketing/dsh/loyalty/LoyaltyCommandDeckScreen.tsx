import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BthBox,
  BthButton,
  BthKeyValueList,
  BthListItem,
  BthSurface,
  BthTextField,
  BthText,
} from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard, BthWebSegmentedTabs, BthWebSignalCard } from '@bthwani/ui-kit/web';
import {
  loyaltyCommercialLaneItems,
  loyaltyCommercialKeyValues,
  loyaltyCommercialSignals,
} from './loyaltyCommerceData';

export type LoyaltyCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
};

type LoyaltyCommandSection = 'overview' | 'builder' | 'sync' | 'guardrails';
type LoyaltyLane = 'subscription' | 'loyalty' | 'coupon';

const loyaltySectionTabs: ReadonlyArray<{ id: LoyaltyCommandSection; label: string; metaLabel: string }> = [
  { id: 'overview', label: 'Overview', metaLabel: 'Live contract' },
  { id: 'builder', label: 'Builder', metaLabel: 'Edit' },
  { id: 'sync', label: 'Sync', metaLabel: 'Routes' },
  { id: 'guardrails', label: 'Guardrails', metaLabel: 'Control' },
];

const loyaltyLaneTabs: ReadonlyArray<{ id: LoyaltyLane; label: string; metaLabel: string }> = [
  { id: 'subscription', label: 'Subscription', metaLabel: 'Family + tier' },
  { id: 'loyalty', label: 'Loyalty', metaLabel: 'Points + balance' },
  { id: 'coupon', label: 'Coupon', metaLabel: 'Pricing lane' },
];

export function LoyaltyCommandDeckScreen({ hubHref = '/operations/dsh', operationsHref = '/operations' }: LoyaltyCommandDeckScreenProps) {
  const router = useRouter();
  const [section, setSection] = React.useState<LoyaltyCommandSection>('builder');
  const [lane, setLane] = React.useState<LoyaltyLane>('subscription');
  const [programName, setProgramName] = React.useState('DSH loyalty control');
  const [programMessage, setProgramMessage] = React.useState('Subscription, points, and coupon truth stay on live routes.');
  const [audience, setAudience] = React.useState<'all' | 'client' | 'operations'>('client');
  const [deliveryMode, setDeliveryMode] = React.useState<'auto' | 'manual' | 'pinned'>('auto');
  const [lastAction, setLastAction] = React.useState('Idle');

  const routeCount = loyaltyCommercialKeyValues.length;
  const liveLaneCount = loyaltyCommercialLaneItems.length;

  const activeSignal = loyaltyCommercialSignals.find((signal) => signal.title === (lane === 'subscription' ? 'Subscription tier' : lane === 'loyalty' ? 'Points balance' : 'Coupon lane')) ?? loyaltyCommercialSignals[0];

  const setAction = (message: string) => {
    setLastAction(message);
  };

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={['Control', 'Loyalty', 'Subscription']}
        eyebrow="DSH commercial loyalty"
        title="Subscription, points, and coupon control in one owned lane"
        description="This surface edits the live commercial contract instead of presenting a read-only summary. Every panel below is a control path: build, sync, guardrails, and route entry."
        metaItems={[
          'Live route-backed contract',
          'Editable commercial lanes',
          'Publish and sync controls',
        ]}
        primaryAction={{ label: 'Open operations hub', href: hubHref }}
        secondaryAction={{ label: 'Open marketing workspace', href: operationsHref }}
      />

      <BthWebSegmentedTabs
        ariaLabel="Loyalty control sections"
        items={loyaltySectionTabs.map((item) => ({ ...item, active: item.id === section }))}
        onSelect={(itemId) => setSection(itemId as LoyaltyCommandSection)}
      />

      {section === 'overview' ? (
        <BthWebSectionCard title="Commercial state" description="The customer and branch views should point to the same commercial contract, not separate stories.">
          <BthBox gap={3}>
            <BthBox gap={2}>
              <BthWebSignalCard title="Live lanes" value={String(liveLaneCount)} description="Route-backed commercial lanes now owned by this surface." tone="best" />
              <BthWebSignalCard title="Route targets" value={String(routeCount)} description="Actual route identifiers attached to the control deck." />
              <BthWebSignalCard title="Selected lane" value={lane} description={activeSignal.description} />
            </BthBox>
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
            <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <BthButton label="Open operations hub" onPress={() => router.push(hubHref)} />
              <BthButton label="Open marketing workspace" tone="secondary" onPress={() => router.push(operationsHref)} />
            </BthBox>
          </BthBox>
        </BthWebSectionCard>
      ) : null}

      {section === 'builder' ? (
        <BthWebSectionCard title="Program builder" description="Edit the active loyalty contract before it is published or paused.">
          <BthBox gap={3}>
            <BthTextField label="Program name" value={programName} onChangeText={setProgramName} hint="What operators will recognise as the current program." />
            <BthTextField label="Program message" value={programMessage} onChangeText={setProgramMessage} hint="The message that will anchor the live lane copy." />

            <BthWebSegmentedTabs
              ariaLabel="Loyalty lanes"
              items={loyaltyLaneTabs.map((item) => ({ ...item, active: item.id === lane }))}
              onSelect={(itemId) => setLane(itemId as LoyaltyLane)}
            />

            <BthBox gap={2}>
              <BthText role="bodySm" tone="muted">
                Audience: {audience} · Delivery: {deliveryMode} · Last action: {lastAction}
              </BthText>
              <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <BthButton label="Save draft" onPress={() => setAction(`Draft saved for ${programName}`)} />
                <BthButton label="Publish now" tone="secondary" onPress={() => setAction(`Published ${programName}`)} />
                <BthButton label="Pause" tone="ghost" onPress={() => setAction(`Paused ${programName}`)} />
              </BthBox>
            </BthBox>

            <BthSurface tone="raised" gap={2}>
              <BthText role="bodyStrong">Selected lane</BthText>
              <BthText role="bodySm" tone="muted">{activeSignal.title} · {activeSignal.description}</BthText>
            </BthSurface>
          </BthBox>
        </BthWebSectionCard>
      ) : null}

      {section === 'sync' ? (
        <BthWebSectionCard title="Live sync" description="These controls point at the real routes that keep subscription, loyalty, and coupon state aligned.">
          <BthBox gap={3}>
            <BthBox gap={2}>
              <BthWebSignalCard title="Sync route" value="subscription-sync" description="Refresh subscription state before the next paid action." tone="best" />
              <BthWebSignalCard title="Points route" value="loyalty-points-user-balance" description="Open the live points balance before redemption." />
              <BthWebSignalCard title="Coupon route" value="promo-apply" description="Keep pricing and coupon application in the live checkout lane." />
            </BthBox>
            <BthSurface tone="raised" gap={2}>
              {loyaltyCommercialLaneItems.map((item) => (
                <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
              ))}
            </BthSurface>
            <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <BthButton label="Sync now" onPress={() => setAction('Sync queued from the live route deck')} />
              <BthButton label="Open operations hub" tone="secondary" onPress={() => router.push(hubHref)} />
              <BthButton label="Open marketing workspace" tone="ghost" onPress={() => router.push(operationsHref)} />
            </BthBox>
          </BthBox>
        </BthWebSectionCard>
      ) : null}

      {section === 'guardrails' ? (
        <BthWebSectionCard title="Guardrails" description="Audience and delivery controls stay visible so marketing decisions do not become invisible status text.">
          <BthBox gap={3}>
            <BthWebSegmentedTabs
              ariaLabel="Audience guardrails"
              items={[
                { id: 'all', label: 'All', metaLabel: 'Broadcast', active: audience === 'all' },
                { id: 'client', label: 'Client', metaLabel: 'Customer lane', active: audience === 'client' },
                { id: 'operations', label: 'Operations', metaLabel: 'Internal lane', active: audience === 'operations' },
              ]}
              onSelect={(itemId) => setAudience(itemId as 'all' | 'client' | 'operations')}
            />

            <BthWebSegmentedTabs
              ariaLabel="Delivery guardrails"
              items={[
                { id: 'auto', label: 'Auto', metaLabel: 'Default', active: deliveryMode === 'auto' },
                { id: 'manual', label: 'Manual', metaLabel: 'Review', active: deliveryMode === 'manual' },
                { id: 'pinned', label: 'Pinned', metaLabel: 'Priority', active: deliveryMode === 'pinned' },
              ]}
              onSelect={(itemId) => setDeliveryMode(itemId as 'auto' | 'manual' | 'pinned')}
            />

            <BthKeyValueList
              items={[
                { label: 'Audience', value: audience },
                { label: 'Delivery mode', value: deliveryMode },
                { label: 'Program name', value: programName },
                { label: 'Program lane', value: lane },
              ]}
            />

            <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <BthButton label="Validate guardrails" onPress={() => setAction(`Validated ${audience} / ${deliveryMode}`)} />
              <BthButton label="Open entitlements" tone="secondary" onPress={() => router.push(hubHref)} />
              <BthButton label="Return to operations" tone="ghost" onPress={() => router.push(operationsHref)} />
            </BthBox>
          </BthBox>
        </BthWebSectionCard>
      ) : null}
    </BthBox>
  );
}

export default LoyaltyCommandDeckScreen;
