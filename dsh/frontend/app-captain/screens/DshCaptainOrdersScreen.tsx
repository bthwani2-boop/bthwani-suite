import {
	Box,
	Button,
	Divider,
	KeyValueList,
	ListItem,
	MobileScrollView,
	SectionHeader,
	StateView,
	Surface,
	Text,
	spacing,
} from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../parts/OperationScreen';
import { OrderInboxSection, resolveServiceTypeBadge } from '../parts/OrderInboxSection';
import { OrderDetailSection } from '../parts/OrderDetailSection';
import { OrderChatSection } from '../parts/OrderChatSection';
import { OrderBellSection } from '../parts/OrderBellSection';
import { OrderActionSection } from '../parts/OrderActionSection';
import { OrderProofSection } from '../parts/OrderProofSection';
import { SimpleSupportScreen } from '../parts/SimpleSupportScreen';
import type {
	DshCaptainOrderAction,
	DshCaptainOrderBellItem,
	DshCaptainOrderDetailSummary,
	DshCaptainOrderId,
	DshCaptainOrderMessage,
	DshCaptainOrderMode,
	DshCaptainOrderProofStatus,
	DshCaptainOrdersScreenState,
} from '../../shared/orders';

export type { DshCaptainOrderDetailSummary } from '../../shared/orders';

export type DshCaptainOrdersScreenProps = {
	section?: DshCaptainOrderMode;
	state?: DshCaptainOrdersScreenState;
	items?: DshCaptainOrderBellItem[];
	summary?: DshCaptainOrderDetailSummary;
	messages?: DshCaptainOrderMessage[];
	proofStatus?: DshCaptainOrderProofStatus;
	onOpenOrder?: (orderId: DshCaptainOrderId) => void;
	onOpenNextOrder?: (orderId: DshCaptainOrderId) => void;
	onBackToInbox?: () => void;
	onRetry?: () => void;
	onActionPress?: (action: DshCaptainOrderAction) => void;
};

function renderOrdersState(state: DshCaptainOrdersScreenState, onRetry?: () => void) {
	if (state === 'availability-toggle') {
		return (
			<StateView
				stateId="loading"
				title="جارٍ تحديث حالة التوفر..."
				description="يُرجى الانتظار بينما يتم تسجيل حالتك."
			/>
		);
	}

	if (state === 'loading-assignment') {
		return (
			<StateView
				stateId="loading"
				title="جارٍ تحميل تفاصيل المهمة..."
				description="تم قبول الطلب. جارٍ جلب تفاصيل الاستلام والتسليم."
			/>
		);
	}

	if (state === 'offer-accepting') {
		return (
			<StateView
				stateId="loading"
				title="جارٍ قبول العرض..."
				description="يُرجى الانتظار بينما يتم تسجيل قبول الطلب."
			/>
		);
	}

	if (state === 'offer-accepted') {
		return (
			<StateView
				stateId="success"
				title="تم قبول الطلب بنجاح"
				description="سيتم توجيهك إلى تفاصيل الطلب الآن."
				actionLabel={onRetry ? 'عرض تفاصيل الطلب' : undefined}
				onActionPress={onRetry}
			/>
		);
	}

	if (state === 'loading') {
		return (
			<StateView
				stateId="loading"
				title="جارٍ تحميل صندوق الكابتن"
				description="أبقِ الطلب التالي ظاهرًا فور توفر بيانات الصف."
			/>
		);
	}

	if (state === 'empty') {
		return (
			<StateView
				stateId="empty"
				title="لا توجد طلبات الآن"
				description="ابقَ جاهزًا. الطلبات الجديدة ستصل هنا أولًا."
				actionLabel={onRetry ? 'تحديث الطلبات' : undefined}
				onActionPress={onRetry}
			/>
		);
	}

	if (state === 'delivered') {
		return (
			<StateView
				kind="success"
				title="تم تسليم كل الطلبات"
				description="أداء ممتاز. حدّث الشاشة لالتقاط المهمة التالية."
				actionLabel={onRetry ? 'التحقق من طلبات جديدة' : undefined}
				onActionPress={onRetry}
			/>
		);
	}

	if (state === 'error') {
		return (
			<StateView
				stateId="recoverableError"
				title="صندوق الطلبات غير متاح"
				description="أعد المحاولة وواصل من الطلب التالي من دون تغيير المسار."
				actionLabel="إعادة المحاولة"
				onActionPress={onRetry}
			/>
		);
	}

	return null;
}

function renderSection({
	section,
	state,
	items,
	summary,
	proofStatus,
	onOpenOrder,
	onOpenNextOrder,
	onBackToInbox,
	onRetry,
	onActionPress,
}: DshCaptainOrdersScreenProps) {
	if (state && state !== 'ready') {
		if (state === 'delivered') {
			return renderOrdersState(state, onRetry);
		}

		const mappedState: DshOperationScreenState = (state === 'empty' || state === 'error' || state === 'loading') ? state : 'loading';
		return <DshOperationScreen state={mappedState} title="طلبات الكابتن" subtitle="مسار الطلبات النشطة داخل تطبيق الكابتن." onRetry={onRetry} />;
	}

	const resolvedSection = section ?? 'full';
	const activeItems = items ?? [];

	const openNextOrderFromOverview = () => {
		const nextOrderId = activeItems[0]?.id ?? summary?.orderId;
		if (onOpenNextOrder) {
			onOpenNextOrder(nextOrderId);
			return;
		}
		onOpenOrder?.(nextOrderId);
	};

	if (resolvedSection === 'inbox') {
		return <OrderInboxSection items={items} onOpenOrder={onOpenOrder} onOpenNextOrder={onOpenNextOrder} onRetry={onRetry} />;
	}

	if (resolvedSection === 'detail' || resolvedSection === 'order-details' || resolvedSection === 'order-get') {
		return (
			<OrderDetailSection
				summary={summary}
				onConfirmPickup={() => onActionPress?.('pickup')}
				onConfirmDelivery={() => onActionPress?.('deliver')}
				onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? '')}
				onBackToInbox={onBackToInbox}
				onRetry={onRetry}
			/>
		);
	}

	if (resolvedSection === 'chat') {
		return (
			<OrderChatSection
				orderId={summary?.orderId}
				pickupLabel={summary?.pickupLabel}
				dropoffLabel={summary?.dropoffLabel}
			/>
		);
	}

	if (resolvedSection === 'bell') {
		return <OrderBellSection items={items} onOpenInbox={onBackToInbox} onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? '')} onRetry={onRetry} />;
	}

	if (resolvedSection === 'accept') {
		return <OrderActionSection action="accept" summary={summary} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
	}

	if (resolvedSection === 'offer-reject') {
		return <OrderActionSection action="order-offer-reject" summary={summary} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
	}

	if (resolvedSection === 'pickup') {
		return <OrderActionSection action="pickup" summary={summary} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
	}

	if (resolvedSection === 'deliver') {
		return <OrderActionSection action="deliver" summary={summary} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
	}

	if (resolvedSection === 'proof') {
		return <OrderProofSection summary={summary} status={proofStatus} onActionPress={onActionPress} onBackToInbox={onBackToInbox} />;
	}

	if (resolvedSection === 'orders-list') {
		return <OrderInboxSection items={items} onOpenOrder={onOpenOrder} onOpenNextOrder={onOpenNextOrder} onRetry={onRetry} />;
	}

	if (resolvedSection === 'orders-offers-list') {
		return <OrderBellSection items={items} onOpenInbox={onBackToInbox} onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? '')} onRetry={onRetry} />;
	}

	return (
		<DshOperationScreen
			title="طلبات الكابتن"
			subtitle="نظرة موحدة على الصندوق والمهمة النشطة والجرس بنفس الغلاف البصري المستخدم في تطبيق العميل."
			content={
				<Box gap={4} style={{ paddingHorizontal: spacing[1] }}>
					<Box gap={3} style={{ paddingVertical: spacing[1] }}>
						<SectionHeader title="الطلب التالي" subtitle="أولوية واحدة واضحة قبل أي انتقال آخر." />
						<Text role="bodyStrong">{activeItems[0]?.title ?? (summary?.orderId ? `طلب #${summary.orderId}` : '')}</Text>
						<Text role="bodySm" tone="muted">{activeItems[0]?.subtitle ?? summary?.currentStageLabel ?? ''}</Text>
					</Box>

					<Divider />

					<Box gap={3} style={{ paddingVertical: spacing[1] }}>
						<SectionHeader title="المهمة النشطة" subtitle="تفاصيل مختصرة للمهمة الجارية." />
						<KeyValueList
							items={[
								{ label: 'الطلب', value: summary?.orderId ?? '', tone: 'brand' },
								{ label: 'الاستلام', value: summary?.pickupLabel ?? '' },
								{ label: 'التسليم', value: summary?.dropoffLabel ?? '' },
								{ label: 'الخطوة التالية', value: summary?.nextActionLabel ?? '', tone: 'success' },
							]}
						/>
					</Box>

					<Divider />

					<Box gap={3} style={{ paddingVertical: spacing[1] }}>
						<SectionHeader title="الرنات الحالية" subtitle="أقصر قائمة ممكنة للطلبات التي تنتظر قرارًا." />
						<Box gap={2}>
							{activeItems.slice(0, 3).map((item) => (
								<ListItem key={item.id} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={resolveServiceTypeBadge(item.serviceType).badgeLabel} badgeTone={resolveServiceTypeBadge(item.serviceType).badgeTone} onPress={() => onOpenOrder?.(item.id)} />
							))}
						</Box>
					</Box>

					<Divider />

					<Box gap={2} style={{ paddingVertical: spacing[1] }}>
						<Text role="bodyStrong">حالة الإثبات: {proofStatus ?? 'idle'}</Text>
						<Text role="bodySm" tone="muted">
							عندما تصل المهمة إلى الإغلاق، انتقل إلى رفع الإثبات من شريط الإجراءات السفلي بدل تناثر الأزرار داخل الصفحة.
						</Text>
					</Box>
				</Box>
			}
			primaryActionLabel="فتح الطلب التالي"
			secondaryActionLabel={onBackToInbox ? 'صندوق الطلبات' : undefined}
			tertiaryActionLabel={onActionPress ? 'رفع الإثبات' : undefined}
			onPrimaryAction={openNextOrderFromOverview}
			onSecondaryAction={onBackToInbox}
			onTertiaryAction={() => onActionPress?.('proof-upload')}
			onRetry={onRetry}
		/>
	);
}

export function DshCaptainOrdersScreen(props: DshCaptainOrdersScreenProps = {}) {
	return renderSection({
		section: props.section ?? 'full',
		state: props.state ?? 'ready',
		items: props.items,
		summary: props.summary,
		proofStatus: props.proofStatus ?? 'idle',
		onOpenOrder: props.onOpenOrder,
		onOpenNextOrder: props.onOpenNextOrder,
		onBackToInbox: props.onBackToInbox,
		onRetry: props.onRetry,
		onActionPress: props.onActionPress,
	});
}

export function CaptainOrdersInboxScreen(props: Pick<DshCaptainOrdersScreenProps, 'state' | 'items' | 'onOpenOrder' | 'onOpenNextOrder' | 'onRetry'> = {}) {
	return <DshCaptainOrdersScreen {...props} section="inbox" />;
}

export function CaptainOrderDetailScreen({
	summary,
	onConfirmPickup,
	onConfirmDelivery,
	onOpenNextOrder,
	onBackToInbox,
	onRetry,
}: {
	summary?: DshCaptainOrderDetailSummary;
	onConfirmPickup?: () => void;
	onConfirmDelivery?: () => void;
	onOpenNextOrder?: () => void;
	onBackToInbox?: () => void;
	onRetry?: () => void;
}) {
	return (
		<OrderDetailSection
			summary={summary}
			onConfirmPickup={onConfirmPickup}
			onConfirmDelivery={onConfirmDelivery}
			onOpenNextOrder={onOpenNextOrder}
			onBackToInbox={onBackToInbox}
			onRetry={onRetry}
		/>
	);
}

export function CaptainPickupConfirmSheet({
	visible,
	orderTitle,
	state = 'ready',
	onConfirm,
	onCancel,
}: {
	visible: boolean;
	orderTitle: string;
	state?: 'ready' | 'loading' | 'success' | 'error';
	onConfirm: () => void;
	onCancel: () => void;
}) {
	if (!visible) {
		return null;
	}

	return (
		<Surface tone="raised" padding={4} gap={3} radiusToken="xl">
			{state === 'loading' ? (
				<StateView stateId="loading" title="جاري تأكيد الاستلام..." description="" />
			) : state === 'success' ? (
				<StateView stateId="success" title="تم الاستلام بنجاح" description="تم تحديث حالة الطلب إلى مستلم." actionLabel="موافق" onActionPress={onConfirm} />
			) : state === 'error' ? (
				<StateView stateId="blockingError" title="فشل تأكيد الاستلام" description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً." actionLabel="إغلاق" onActionPress={onCancel} />
			) : (
				<>
					<SectionHeader title="تأكيد الاستلام" subtitle="أقر باستلام الطلب قبل نقله إلى المرحلة التالية." />
					<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{orderTitle}</Text>
					<Box gap={2}>
						<Button label="تأكيد الاستلام" onPress={onConfirm} />
						<Button label="إلغاء" tone="ghost" onPress={onCancel} />
					</Box>
				</>
			)}
		</Surface>
	);
}

export function CaptainDeliveryConfirmSheet({ visible, orderTitle, onConfirm, onCancel }: { visible: boolean; orderTitle: string; onConfirm: () => void; onCancel: () => void; }) {
	if (!visible) {
		return null;
	}

	return (
		<Surface tone="raised" padding={4} gap={3} radiusToken="xl">
			<SectionHeader title="تأكيد التسليم" subtitle="أغلق الطلب بعد استلام العميل له." />
			<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{orderTitle}</Text>
			<Box gap={2}>
				<Button label="تأكيد التسليم" onPress={onConfirm} />
				<Button label="إلغاء" tone="ghost" onPress={onCancel} />
			</Box>
		</Surface>
	);
}

export function DshCaptainOrderChatScreen({
	orderId,
	pickupLabel,
	dropoffLabel,
	state = 'active',
}: {
	orderId: string;
	pickupLabel: string;
	dropoffLabel: string;
	state?: 'active' | 'readOnly';
}) {
	return <OrderChatSection orderId={orderId} pickupLabel={pickupLabel} dropoffLabel={dropoffLabel} state={state} />;
}

export function DshCaptainBellScreen({
	state,
	items,
	onOpenInbox,
	onOpenNextOrder,
	onRetry,
	onBack,
}: {
	state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
	summary?: {
		inboxLabel: string;
		approvalLabel: string;
		urgentLabel: string;
		nextActionLabel: string;
	};
	items?: DshCaptainOrderBellItem[];
	onOpenInbox?: () => void;
	onOpenNextOrder?: () => void;
	onRetry?: () => void;
	onBack?: () => void;
}) {
	if (state && state !== 'ready') {
		const stateCopy = {
			loading: { stateId: 'loading' as const, title: 'جارٍ تجهيز جرس الكابتن', description: 'ستظهر رنّة الطلب التالية بمجرد وصول بيانات الصف.', actionLabel: 'إعادة المحاولة' },
			empty: { stateId: 'empty' as const, title: 'لا توجد رنات طلب جديدة', description: 'يبقى الجرس هادئًا حتى يصل طلب جديد إلى الصف.', actionLabel: 'فتح الصندوق' },
			offline: { stateId: 'offline' as const, title: 'جرس الكابتن غير متصل', description: 'أعد الاتصال لاسترجاع مسار التنبيه المباشر للطلبات الجديدة.', actionLabel: 'إعادة المحاولة' },
			disabled: { kind: 'warning' as const, title: 'جرس الكابتن متوقف', description: 'يمكن إبقاء الجرس للقراءة فقط حتى يعاد تفعيل صف DSH.', actionLabel: 'فتح الصندوق' },
			error: { stateId: 'recoverableError' as const, title: 'تعذر تحميل جرس الكابتن', description: 'أعد تحميل المسار نفسه مع إبقاء صف التنبيه ظاهرًا.', actionLabel: 'إعادة المحاولة' },
			ready: null,
		}[state];

		if (!stateCopy) {
			return null;
		}

		return (
			<MobileScrollView padding={4} gap={4}>
				<StateView {...stateCopy} onActionPress={onRetry ?? onOpenInbox ?? onBack} />
			</MobileScrollView>
		);
	}

	return (
		<OrderBellSection
			items={items}
			onOpenInbox={onOpenInbox}
			onOpenNextOrder={onOpenNextOrder}
			onRetry={onRetry}
			onBack={onBack}
		/>
	);
}

export type DshCaptainOrderAcceptScreenProps = {
	orderId?: string;
	onBack?: () => void;
	onAccept?: (orderId: string) => void;
	onDecline?: (orderId: string) => void;
	onSecondaryAction?: () => void;
};

export function DshCaptainOrderAcceptScreen({
	orderId,
	onBack,
	onAccept,
	onDecline,
	onSecondaryAction,
}: DshCaptainOrderAcceptScreenProps) {
	const customSummary = orderId ? {
		orderId,
		pickupLabel: '',
		dropoffLabel: '',
		etaLabel: '',
		currentStageLabel: 'في انتظار قبول الكابتن',
		nextActionLabel: 'اقبل المهمة لبدء التوصيل',
	} : undefined;

	return (
		<Box gap={4} style={{ flex: 1 }}>
			<OrderActionSection
				action="accept"
				summary={customSummary}
				onActionPress={() => {
					if (onAccept && orderId) {
						onAccept(orderId);
					} else {
						onSecondaryAction?.();
					}
				}}
				onBackToInbox={onBack}
			/>
			{onDecline && orderId && (
				<Box paddingX={4} style={{ paddingBottom: spacing[4] }}>
					<Button
						label="رفض المهمة (Decline)"
						tone="danger"
						onPress={() => onDecline(orderId)}
					/>
				</Box>
			)}
		</Box>
	);
}

export function DshCaptainOrderGetScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="عرض الطلب"
			heroTitle="عرض المسار المخصص"
			heroDescription="يمكن للكابتن إعادة تحميل سياق المسار من دون إعادة فتح الصندوق."
			primaryLabel="تحديث لقطة المسار"
			secondaryLabel="العودة إلى دليل الدعم"
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

export function DshCaptainOrderDetailsScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="تفاصيل الطلب"
			heroTitle="لقطة طلب الكابتن"
			heroDescription="لا ينبغي أن تبقى ظاهرة هنا إلا الاستلام والتسليم والتوقيت والمرحلة الحالية."
			primaryLabel="تحديث تفاصيل الطلب"
			secondaryLabel="العودة إلى دليل الدعم"
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

export function DshCaptainOrdersListScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="قائمة الطلبات"
			heroTitle="صف مسار الكابتن"
			heroDescription="تكمّل هذه القائمة صندوق الطلبات برؤية أوسع لكنها ما زالت موجهة للطلبات."
			primaryLabel="تحديث قائمة الطلبات"
			secondaryLabel="العودة إلى دليل الدعم"
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

export function DshCaptainOrdersOffersListScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="قائمة عروض الطلبات"
			heroTitle="عروض الطلبات المتاحة"
			heroDescription="يبقى مراجعة العروض منفصلة عن الطلبات المقبولة حتى يعرف الكابتن مستوى الالتزام دائمًا."
			primaryLabel="تحديث العروض"
			secondaryLabel="العودة إلى دليل الدعم"
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

export function DshCaptainOrderOfferRejectScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<OrderActionSection
			action="order-offer-reject"
			onActionPress={() => props.onSecondaryAction?.()}
			onBackToInbox={props.onBack}
		/>
	);
}

export function DshCaptainOrderPickupScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<OrderActionSection
			action="pickup"
			onActionPress={() => props.onSecondaryAction?.()}
			onBackToInbox={props.onBack}
		/>
	);
}

export function DshCaptainOrderDeliverScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<OrderActionSection
			action="deliver"
			onActionPress={() => props.onSecondaryAction?.()}
			onBackToInbox={props.onBack}
		/>
	);
}

export function DshCaptainProofUploadScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<OrderProofSection
			onActionPress={() => props.onSecondaryAction?.()}
			onBackToInbox={props.onBack}
		/>
	);
}

export function DshCaptainJobRejectScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return <DshCaptainOrderOfferRejectScreen {...props} />;
}

export { DshCaptainOrdersScreen as default };
