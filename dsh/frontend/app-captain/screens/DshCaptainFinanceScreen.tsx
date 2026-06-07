import React from 'react';
import type { WltCaptainFinanceSection } from '../../data/dshFinancePreview';
import { WltDshCaptainBridge } from '../../../../wlt/frontend/dsh/app-captain';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshCaptainFinanceScreenState } from '../../data/operational-statuses.preview-data';

export type DshCaptainFinanceScreenProps = {
	section?: WltCaptainFinanceSection;
	state?: DshCaptainFinanceScreenState;
	onBack?: () => void;
	onRetry?: () => void;
	dshAuthBearerToken?: string | null;
	dshClientId?: string | null;
};

export function DshCaptainFinanceScreen({
	section = 'cod-liability',
	state = 'ready',
	onBack,
	onRetry,
	dshAuthBearerToken,
	dshClientId,
}: DshCaptainFinanceScreenProps) {
	if (state !== 'ready') {
		return (
			<DshOperationScreen
				state={state}
				title="Ø§Ù„Ù…Ø§Ù„ÙŠØ©"
				subtitle="Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ù…Ø±Ø¨ÙˆØ·Ø© Ø§Ù„Ø¢Ù† Ø¨Ø¬Ø³Ø± WLT Ù…ÙˆØ­Ø¯ Ù„Ø¹Ø±Ø¶ COD ÙˆØ§Ù„Ø£Ø±Ø¨Ø§Ø­ ÙˆØ§Ù„ØªØ³ÙˆÙŠØ© ÙÙŠ ÙˆØ¶Ø¹ preview ÙÙ‚Ø·."
				onRetry={onRetry}
			/>
		);
	}

	return (
		<WltDshCaptainBridge
			section={section}
			onBack={onBack}
			dshAuthBearerToken={dshAuthBearerToken}
			dshClientId={dshClientId}
		/>
	);
}

export function DshCaptainCodBalanceScreen(props: Omit<DshCaptainFinanceScreenProps, 'section'> = {}) {
	return <DshCaptainFinanceScreen {...props} section="cod-liability" />;
}

export default DshCaptainFinanceScreen;
