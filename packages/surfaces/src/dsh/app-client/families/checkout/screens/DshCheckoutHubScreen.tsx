import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../_shared/screens';
import { clientSupportDefinitions, type ClientSupportScreenId } from '../../support/screens/DshClientGeneratedSupportScreens';

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
  const [promoCode, setPromoCode] = React.useState('BTH20');

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
            <BthStatCard label="Estimated total" value="78 SAR" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="ETA confidence" value="25 min" deltaLabel="Stable before submit" tone="success" />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Items subtotal', value: '56 SAR' },
                { label: 'Delivery fee', value: '22 SAR' },
                { label: 'Applied discount', value: screenId === 'promo-apply' ? '12 SAR' : '0 SAR', tone: 'brand' },
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
            {[
              { title: 'Checkout gate', subtitle: 'Keep final blockers visible before submit.', meta: 'Gate', badgeLabel: 'Ready' },
              { title: 'Estimate snapshot', subtitle: 'Read pricing confidence before commit.', meta: 'Estimate', badgeLabel: 'Cost' },
              { title: 'Promo application', subtitle: 'Apply visible savings without leaving the current step.', meta: 'Promo', badgeLabel: 'Discount' },
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