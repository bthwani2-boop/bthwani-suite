import React from 'react';
import type { WltCaptainFinanceSection } from '../../data/dshFinancePreview';
import { WltDshCaptainBridge } from '../../../../wlt/frontend/app-captain/dsh';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshCaptainFinanceScreenState } from '../../data/operational-statuses.preview-data';

export type DshCaptainFinanceScreenProps = {
	section?: WltCaptainFinanceSection;
	state?: DshCaptainFinanceScreenState;
	onBack?: () => void;
	onRetry?: () => void;
};

export function DshCaptainFinanceScreen({
	section = 'cod-liability',
	state = 'ready',
	onBack,
	onRetry,
}: DshCaptainFinanceScreenProps) {
	if (state !== 'ready') {
		return (
			<DshOperationScreen
				state={state}
				title="المالية"
				subtitle="المالية مربوطة الآن بجسر WLT موحد لعرض COD والأرباح والتسوية في وضع preview فقط."
				onRetry={onRetry}
			/>
		);
	}

	return <WltDshCaptainBridge section={section} onBack={onBack} />;
}

export function DshCaptainCodBalanceScreen(props: Omit<DshCaptainFinanceScreenProps, 'section'> = {}) {
	return <DshCaptainFinanceScreen {...props} section="cod-liability" />;
}

export default DshCaptainFinanceScreen;
