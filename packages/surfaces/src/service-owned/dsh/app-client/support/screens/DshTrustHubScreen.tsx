import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../patterns/screens/DshOperationScreen';
import { clientSupportDefinitions, type ClientSupportScreenId } from './DshClientGeneratedSupportScreens';

type TrustScreenId = 'order-proof-code-generate' | 'order-proof-verify' | 'order-escrow-hold' | 'order-escrow-release';

export type DshTrustHubScreenProps = {
  screenId: TrustScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshTrustHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshTrustHubScreenProps) {
  const definition = clientSupportDefinitions[screenId as ClientSupportScreenId];
  const [proofCode, setProofCode] = React.useState('482901');

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel={screenId === 'order-proof-code-generate' ? 'Generate code' : screenId === 'order-proof-verify' ? 'Verify handoff' : screenId === 'order-escrow-hold' ? 'Hold funds' : 'Release funds'}
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Trust lane" value="Protected" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Handoff state" value="Verified" deltaLabel="Proof and funds remain explicit" tone="success" />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthTextField
              label="Proof code"
              value={proofCode}
              onChangeText={setProofCode}
              hint="Keep proof and escrow inside a dedicated trust lane instead of collapsing them into generic order review."
            />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Order id', value: 'dsh-10021' },
                { label: 'Protected amount', value: '78 SAR' },
                { label: 'Outcome', value: definition.primaryOutcome, tone: 'brand' },
              ]}
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {[
              { title: 'Proof code', subtitle: 'Generate and verify handoff without leaving the trust lane.', meta: 'Proof', badgeLabel: 'Code' },
              { title: 'Escrow state', subtitle: 'Hold and release protected funds with visible status.', meta: 'Funds', badgeLabel: 'Escrow' },
            ].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshTrustHubScreen;