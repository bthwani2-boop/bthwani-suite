import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../patterns/screens/DshOperationScreen';
import { clientSupportDefinitions, type ClientSupportScreenId } from '../../support/screens/DshClientGeneratedSupportScreens';
import { loyaltyCheckoutItems, loyaltyCheckoutKeyValues } from '../loyaltyCheckoutDeck';

type CheckoutScreenId = 'checkout-gate' | 'estimate-get' | 'pricing-preview' | 'pricing-snapshot-get' | 'promo-apply';

export type DshCheckoutHubScreenProps = {
  screenId: CheckoutScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshCheckoutHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshCheckoutHubScreenProps) {
  const definition = clientSupportDefinitions[screenId as ClientSupportScreenId];
  const [promoCode, setPromoCode] = React.useState('');

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel={screenId === 'promo-apply' ? 'Apply and continue' : 'Continue to review'}
      secondaryActionLabel="Back to support"
      tertiaryActionLabel="Open order review"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onTertiaryAction={onPrimaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Checkout route" value={screenId} deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Promo lane" value={screenId === 'promo-apply' ? 'Open' : 'Read only'} deltaLabel="Live pricing flow" tone="success" />
            <BthStatCard label="Live items" value={String(loyaltyCheckoutItems.length)} deltaLabel="Route-backed checkpoints" tone="warning" />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Items subtotal lane', value: 'pricing-preview' },
                { label: 'Delivery fee lane', value: 'delivery-eta-get' },
                { label: 'Applied discount lane', value: screenId === 'promo-apply' ? 'promo-apply' : 'checkout-gate', tone: 'brand' },
                ...loyaltyCheckoutKeyValues,
              ]}
            />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthTextField
              label="Promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              hint="Keep promo application inside the pricing lane instead of sending the customer away."
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {[...loyaltyCheckoutItems,
              { title: 'Checkout gate', subtitle: 'Open the real checkout gate before submit.', meta: 'Gate', badgeLabel: 'Route' },
              { title: 'Estimate snapshot', subtitle: 'Open the real estimate route before commit.', meta: 'Estimate', badgeLabel: 'Route' },
            ].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshCheckoutHubScreen;