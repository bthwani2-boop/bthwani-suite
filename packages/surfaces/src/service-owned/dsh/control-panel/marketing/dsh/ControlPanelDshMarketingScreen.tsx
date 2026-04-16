import React from 'react';
import { BthBox } from '@bthwani/ui-kit';
import { BthWebSegmentedTabs } from '@bthwani/ui-kit/web';
import {
	ControlPanelDshMarketingScreen as SmartSignalLayerScreen,
	type ControlPanelDshMarketingScreenProps as SmartSignalLayerScreenProps,
} from './SmartSignalLayer';
import { LoyaltyCommandDeckScreen, type LoyaltyCommandDeckScreenProps } from './loyalty';

export type ControlPanelDshMarketingScreenProps = SmartSignalLayerScreenProps & LoyaltyCommandDeckScreenProps;

type MarketingControlView = 'loyalty' | 'signals';

export function ControlPanelDshMarketingScreen(props: ControlPanelDshMarketingScreenProps) {
	const [activeView, setActiveView] = React.useState<MarketingControlView>('loyalty');

	return (
		<BthBox gap={4}>
			<BthWebSegmentedTabs
				ariaLabel="DSH marketing control view"
				items={[
					{ id: 'loyalty', label: 'Loyalty control', metaLabel: 'Owned lane', active: activeView === 'loyalty' },
					{ id: 'signals', label: 'Smart signals', metaLabel: 'Live planner', active: activeView === 'signals' },
				]}
				onSelect={(itemId) => setActiveView(itemId as MarketingControlView)}
			/>

			{activeView === 'signals' ? (
				<SmartSignalLayerScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />
			) : (
				<LoyaltyCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />
			)}
		</BthBox>
	);
}

export default ControlPanelDshMarketingScreen;
