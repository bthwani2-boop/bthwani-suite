import React from 'react';
import { BthBox } from '@bthwani/ui-kit';
import {
	ControlPanelDshMarketingScreen as SmartSignalLayerScreen,
	type ControlPanelDshMarketingScreenProps as SmartSignalLayerScreenProps,
} from './SmartSignalLayer';
import { LoyaltyCommandDeckScreen, type LoyaltyCommandDeckScreenProps } from './loyalty';

export type ControlPanelDshMarketingScreenProps = SmartSignalLayerScreenProps & LoyaltyCommandDeckScreenProps;

export function ControlPanelDshMarketingScreen(props: ControlPanelDshMarketingScreenProps) {
	return (
		<BthBox gap={4}>
			<SmartSignalLayerScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />
			<LoyaltyCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />
		</BthBox>
	);
}

export default ControlPanelDshMarketingScreen;
