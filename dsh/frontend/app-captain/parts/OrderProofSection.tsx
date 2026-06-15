import React from 'react';
import { Box, Divider, KeyValueList, TextField } from '@bthwani/ui-kit';
import { DshOperationScreen } from './OperationScreen';
import type {
	DshCaptainOrderAction,
	DshCaptainOrderDetailSummary,
	DshCaptainOrderProofStatus,
} from '../../shared/orders';

export const OrderProofSection = React.memo(function OrderProofSection({
	summary,
	status = 'idle',
	onActionPress,
	onBackToInbox,
}: {
	summary?: DshCaptainOrderDetailSummary;
	status?: DshCaptainOrderProofStatus;
	onActionPress?: (action: DshCaptainOrderAction) => void;
	onBackToInbox?: () => void;
}) {
	const [draft, setDraft] = React.useState('');

	return (
		<DshOperationScreen
			title="رفع الإثبات"
			subtitle="التقط الإثبات عندما يحتاج تأكيد التسليم النهائي إلى دعم وسائط."
			content={
				<Box gap={4}>
					<KeyValueList
						items={[
							{ label: 'الطلب', value: summary?.orderId ?? '', tone: 'brand' },
							{ label: 'الصيغة', value: 'صورة أو تأكيد موقّع' },
							{ label: 'الحالة', value: status, tone: 'warning' },
						]}
					/>
					<Divider />
					<TextField value={draft} onChangeText={setDraft} placeholder="وصف الإثبات..." multiline numberOfLines={3} />
				</Box>
			}
			primaryActionLabel="رفع الإثبات"
			secondaryActionLabel={onBackToInbox ? 'العودة إلى الصندوق' : undefined}
			onPrimaryAction={() => onActionPress?.('proof-upload')}
			onSecondaryAction={onBackToInbox}
		/>
	);
});
