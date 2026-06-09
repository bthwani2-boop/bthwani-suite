import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
	Badge,
	borders,
	Box,
	Button,
	Divider,
	Icon,
	KeyValueList,
	ListItem,
	MobileScrollView,
	SectionHeader,
	StateView,
	Surface,
	Text,
	TextField,
	useTheme,
} from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../parts/OperationScreen';
import type {
	DshCaptainOrderAction,
	DshCaptainOrderBellItem,
	DshCaptainOrderId,
	DshCaptainOrderMessage,
	DshCaptainOrderMode,
	DshCaptainOrderProofStatus,
	DshCaptainOrderServiceType,
	DshCaptainOrderStage,
	DshCaptainOrdersScreenState,
} from '../../shared/dsh-order-preview.contract';

type ServiceBadge = { badgeLabel: string; badgeTone: 'warning' | 'info' | 'brand' };

function resolveServiceTypeBadge(serviceType: DshCaptainOrderServiceType): ServiceBadge {
	if (serviceType === 'awnak') {
		return { badgeLabel: 'عونك', badgeTone: 'info' };
	}
	if (serviceType === 'shein-final-mile') {
		return { badgeLabel: 'SHEIN - تسليم نهائي', badgeTone: 'brand' };
	}
	return { badgeLabel: 'توصيل بثواني', badgeTone: 'warning' };
}

export type DshCaptainOrderDetailSummary = {
	orderId: DshCaptainOrderId;
	pickupLabel: string;
	dropoffLabel: string;
	etaLabel: string;
	currentStageLabel: string;
	nextActionLabel: string;
};

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

const demoSummary: DshCaptainOrderDetailSummary = {
	orderId: 'captain-order-9021',
	pickupLabel: 'Burger Lab - فرع حطين',
	dropoffLabel: 'حي العليا، طريق الملك فهد',
	etaLabel: 'مدة الوصول إلى الاستلام: 8 دقائق',
	currentStageLabel: 'في الطريق إلى الاستلام',
	nextActionLabel: 'أكد الاستلام بعد التقاط الطلب',
};

const demoBellItems: DshCaptainOrderBellItem[] = [
	{
		id: 'captain-order-9021',
		serviceType: 'standard',
		fulfillmentMode: 'bthwani_delivery',
		title: 'طلب جديد رقم 9021',
		subtitle: 'Burger Lab بانتظار كابتن يقبل المسار.',
		meta: 'التالي: مراجعة ثم قبول',
	},
	{
		id: 'captain-order-9024',
		serviceType: 'standard',
		fulfillmentMode: 'bthwani_delivery',
		title: 'طلب جديد رقم 9024',
		subtitle: 'Green Bowl تحتاج مراجعة فورية قبل أن يكبر الصف.',
		meta: 'التالي: فتح تفاصيل الطلب',
	},
	{
		id: 'captain-order-awn-3104',
		serviceType: 'awnak',
		fulfillmentMode: 'bthwani_delivery',
		title: 'طلب نقل محلي رقم 3104',
		subtitle: 'نقل طعام — من شارع حدة إلى باب اليمن. مجدول الآن.',
		meta: 'التالي: استلام العنصر من المُرسِل وتوصيله مباشرة',
	},
	{
		id: 'captain-order-spx-2078',
		serviceType: 'shein-final-mile',
		fulfillmentMode: 'bthwani_delivery',
		title: 'تسليم نهائي SHEIN رقم 2078',
		subtitle: 'استلام من نقطة الفرز بثواني وتوصيل إلى العميل لمى ناصر.',
		meta: 'التالي: استلام الطرد من نقطة الفرز فقط — لا شراء ولا استيراد',
	},
];

const demoMessages: DshCaptainOrderMessage[] = [
	{
		id: 'msg-1',
		sender: 'العميل',
		text: 'أبقي التحديثات قصيرة لو سمحت، وأنا جاهز عند الوصول.',
		time: '09:12',
		side: 'start',
	},
	{
		id: 'msg-2',
		sender: 'الكابتن',
		text: 'تم تأكيد الاستلام، والطلب الآن في الطريق.',
		time: '09:13',
		side: 'end',
	},
	{
		id: 'msg-3',
		sender: 'العميل',
		text: 'ممتاز، أخبرني قبل دقيقة من الوصول.',
		time: '09:14',
		side: 'start',
	},
];

const demoState: DshCaptainOrdersScreenState = 'ready';

function renderOrdersState(state: DshCaptainOrdersScreenState, onRetry?: () => void) {
	// ML-026: availability-toggle — shown while captain toggles availability on/off
	if (state === 'availability-toggle') {
		return (
			<StateView
				stateId="loading"
				title="جارٍ تحديث حالة التوفر..."
				description="يُرجى الانتظار بينما يتم تسجيل حالتك."
			/>
		);
	}

	// ML-027: offer-accepting, offer-accepted, and loading-assignment states
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

const OrderInboxSection = React.memo(function OrderInboxSection({
	items = demoBellItems,
	onOpenOrder,
	onOpenNextOrder,
	onRetry,
}: Pick<DshCaptainOrdersScreenProps, 'items' | 'onOpenOrder' | 'onOpenNextOrder' | 'onRetry'>) {
	const nextOrder = items[0];

	const handleOpenNextOrder = () => {
		if (!nextOrder) {
			onRetry?.();
			return;
		}

		if (onOpenNextOrder) {
			onOpenNextOrder(nextOrder.id);
			return;
		}

		onOpenOrder?.(nextOrder.id);
	};

	if (!nextOrder) {
		return <DshOperationScreen state="empty" title="صندوق طلبات الكابتن" subtitle="مسار الصندوق أولًا يبقي الطلب الفوري واضحًا ويزيل ضجيج اللوحة." onRetry={onRetry} />;
	}

	const { theme } = useTheme();

	return (
		<MobileScrollView padding={4} gap={5} contentContainerStyle={{ paddingBottom: 40 }}>
			<Box gap={2}>
				<Text role="bodyStrong" style={{ textAlign: 'right' }}>{nextOrder.title}</Text>
				<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{nextOrder.subtitle}</Text>
				<Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{nextOrder.meta}</Text>
			</Box>

			<Box gap={2}>
				<Button label="فتح الطلب التالي" onPress={handleOpenNextOrder} />
				{onRetry ? <Button label="تحديث الطلبات" tone="secondary" onPress={onRetry} /> : null}
			</Box>

			{items.length > 1 ? (
				<>
					<Divider />
					<Text role="label" tone="muted" style={{ textAlign: 'right', color: theme.textMuted }}>الطلبات في الصف</Text>
					<Box padding={0} gap={0}>
						{items.map((item, index, arr) => {
							const { badgeLabel, badgeTone } = resolveServiceTypeBadge(item.serviceType);
							return (
								<Pressable
									key={item.id}
									onPress={() => onOpenOrder?.(item.id)}
									style={({ pressed }) => ({
										flexDirection: 'row-reverse',
										alignItems: 'flex-start',
										justifyContent: 'space-between',
										paddingVertical: 14,
										backgroundColor: pressed ? theme.surfaceInset : theme.surface,
										borderBottomWidth: index === arr.length - 1 ? 0 : 1,
										borderBottomColor: theme.line,
										gap: 12,
									})}
								>
									<View style={{ flex: 1, gap: 3, alignItems: 'flex-end' }}>
										<Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>{item.title}</Text>
										<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>{item.subtitle}</Text>
										<Text role="caption" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>{item.meta}</Text>
									</View>
									<View style={{ paddingTop: 2, flexShrink: 0 }}>
										<Badge label={badgeLabel} tone={badgeTone} />
									</View>
								</Pressable>
							);
						})}
					</Box>
				</>
			) : null}
		</MobileScrollView>
	);
});

const OrderDetailSection = React.memo(function OrderDetailSection({
	summary = demoSummary,
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
	const { theme } = useTheme();
	const [bellRung, setBellRung] = React.useState(false);
	const [localMessages, setLocalMessages] = React.useState<DshCaptainOrderMessage[]>(demoMessages);
	const [draftText, setDraftText] = React.useState('');

	const primaryActionLabel = onConfirmPickup ? 'تأكيد الاستلام' : onConfirmDelivery ? 'تأكيد التسليم' : undefined;
	const primaryAction = onConfirmPickup ?? onConfirmDelivery;
	const secondaryActionLabel = onOpenNextOrder ? 'فتح الطلب التالي' : onRetry ? 'إعادة المحاولة' : undefined;
	const secondaryAction = onOpenNextOrder ?? onRetry;

	return (
		<DshOperationScreen
			title="تفاصيل الطلب"
			subtitle="مهمة نشطة مع تواصل متكامل وجرس تنبيه ذكي مباشر داخل نفس شاشة الطلب."
			content={
				<Box gap={4} style={{ paddingHorizontal: 4 }}>
					{/* بطاقة تفاصيل الطلب الرئيسية */}
					<Box gap={3} style={{ paddingVertical: 4 }}>
						<Box gap={1} style={{ alignItems: 'flex-end' }}>
							<Badge label="طلب الكابتن" tone="warning" />
							<Text role="titleLg" style={{ textAlign: 'right' }}>{summary.orderId}</Text>
							<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
								{summary.currentStageLabel}
							</Text>
						</Box>

						<KeyValueList
							items={[
								{ label: 'الاستلام', value: summary.pickupLabel, tone: 'brand' },
								{ label: 'التسليم', value: summary.dropoffLabel },
								{ label: 'الوقت المتوقع', value: summary.etaLabel, tone: 'warning' },
								{ label: 'الخطوة التالية', value: summary.nextActionLabel, tone: 'success' },
							]}
						/>
					</Box>

					<Divider />

					<Box gap={3} style={{ paddingVertical: 4 }}>
						<SectionHeader title="قواعد الالتقاط والتسليم" subtitle="أسباب الرفض والفشل وإثباتات التسليم تبقى إلزامية داخل نفس المسار." />
						<KeyValueList
							items={[
								{ label: 'سبب إجباري', value: 'رفض العرض / فشل الالتقاط / فشل التسليم', tone: 'warning' },
								{ label: 'Fallback buttons', value: 'الدعم · الجرس · فتح التذكرة', tone: 'brand' },
								{ label: 'PoD states', value: 'idle → required → uploaded', tone: 'success' },
							]}
						/>
					</Box>

					<Divider />

					{/* جرس تنبيه الكابتن المدمج والمباشر */}
					<Box gap={2} style={{ paddingVertical: 8, paddingHorizontal: 12, borderLeftWidth: 4, borderLeftColor: bellRung ? theme.success : theme.warning }}>
						<Box style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
							<Badge label={bellRung ? 'تم إرسال التنبيه' : 'جرس تنبيه الكابتن'} tone={bellRung ? 'success' : 'warning'} />
							<Icon name="notifications-outline" size={20} tone={bellRung ? 'success' : 'warning'} />
						</Box>
						<Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginTop: 4 }}>
							{bellRung
								? 'تم إرسال رنة جرس تنبيه للكابتن داخل الطلب لتحديث حالة الوصول الفوري بنجاح.'
								: 'يرجى قرع الجرس لإرسال رنة تنبيه فوري للكابتن وتنبيهه للوصول دون الحاجة للاتصال الخارجي.'}
						</Text>
						{!bellRung && (
							<Button
								label="قرع جرس تنبيه الكابتن"
								tone="warning"
								size="sm"
								fullWidth={false}
								onPress={() => {
									setBellRung(true);
									const systemMsg: DshCaptainOrderMessage = {
										id: `bell-ring-${Date.now()}`,
										sender: 'النظام',
										text: '🔔 تم قرع جرس تنبيه الكابتن فوريًا وتحديث الحالة بنجاح.',
										time: 'الآن',
										side: 'start'
									};
									setLocalMessages(current => [...current, systemMsg]);
								}}
							/>
						)}
					</Box>

					<Divider />

					{/* قسم المحادثة والمراسلة المتكامل */}
					<Box gap={3} style={{ paddingVertical: 4 }}>
						<SectionHeader
							title="مراسلة وتواصل الطلب"
							subtitle="دردشة مباشرة ثنائية بين الكابتن والعميل في سياق الطلب."
						/>

						<ScrollView
							style={{ maxHeight: 180, minHeight: 110, paddingVertical: 8 }}
							contentContainerStyle={{ gap: 8 }}
							showsVerticalScrollIndicator={false}
						>
							{localMessages.map((msg) => {
								const isSystem = msg.sender === 'النظام';
								const isOutbound = msg.side === 'end';
								return (
									<Box
										key={msg.id}
										style={{
											alignSelf: isSystem ? 'center' : isOutbound ? 'flex-end' : 'flex-start',
											maxWidth: '85%',
											width: 'auto'
										}}
									>
										<Box
											background={isSystem ? 'surfaceInset' : isOutbound ? 'brand' : 'surface'}
											border={!isSystem && !isOutbound}
											borderTone="line"
											radiusToken="md"
											style={{
												padding: 10,
												borderTopRightRadius: isOutbound && !isSystem ? 2 : 12,
												borderTopLeftRadius: !isOutbound && !isSystem ? 2 : 12,
												direction: 'rtl',
											}}
										>
											<Box style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, gap: 12 }}>
												<Text role="caption" weight="bold" style={{ color: isOutbound ? theme.textInverse : theme.brand }}>
													{msg.sender}
												</Text>
												<Text role="caption" tone="muted">
													{msg.time}
												</Text>
											</Box>
											<Text role="bodySm" style={{ textAlign: 'right', color: isOutbound ? theme.textInverse : theme.text }}>
												{msg.text}
											</Text>
										</Box>
									</Box>
								);
							})}
						</ScrollView>

						<Box gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 10 }}>
							<TextField
								value={draftText}
								onChangeText={setDraftText}
								placeholder="اكتب رسالة للكابتن هنا..."
								style={{ minHeight: 44 }}
							/>
							<Box style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
								<Button
									size="sm"
									fullWidth={false}
									label="إرسال الرسالة"
									disabled={!draftText.trim()}
									onPress={() => {
										if (!draftText.trim()) return;
										const userMsg: DshCaptainOrderMessage = {
											id: `msg-${Date.now()}`,
											sender: 'الكابتن',
											text: draftText.trim(),
											time: 'الآن',
											side: 'end'
										};
										setLocalMessages(current => [...current, userMsg]);
										setDraftText('');
									}}
								/>
								<Text role="caption" tone="muted">
									التواصل مشفر ومغلق داخل الطلب.
								</Text>
							</Box>
						</Box>
					</Box>
				</Box>
			}
			primaryActionLabel={primaryActionLabel}
			secondaryActionLabel={secondaryActionLabel}
			tertiaryActionLabel={onBackToInbox ? 'العودة إلى الصندوق' : undefined}
			onPrimaryAction={primaryAction}
			onSecondaryAction={secondaryAction}
			onTertiaryAction={onBackToInbox}
			onRetry={onRetry}
		/>
	);
});

const ComposerActionButton = React.memo(function ComposerActionButton({
	iconName,
	accessibilityLabel,
	disabled = false,
	onPress,
}: {
	iconName: React.ComponentProps<typeof Icon>['name'];
	accessibilityLabel: string;
	disabled?: boolean;
	onPress?: () => void;
}) {
	const { theme } = useTheme();

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			disabled={disabled}
			onPress={onPress}
			hitSlop={8}
			style={({ pressed }) => ({
				width: 42,
				height: 42,
				borderRadius: 21,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: disabled ? theme.disabledSurface : pressed ? theme.surfaceInset : theme.surface,
				borderWidth: borders.hairline,
				borderColor: disabled ? theme.line : theme.lineStrong,
				opacity: disabled ? 0.55 : 1,
			})}
		>
			<Icon name={iconName} size={18} tone={disabled ? 'soft' : 'brand'} />
		</Pressable>
	);
});

const OrderChatBubble = React.memo(function OrderChatBubble({ message }: { message: DshCaptainOrderMessage }) {
	const isOutbound = message.side === 'end';
	const { theme } = useTheme();

	return (
		<Box style={{ alignSelf: isOutbound ? 'flex-end' : 'flex-start', width: '100%', maxWidth: '86%' }}>
			<Box
				background={isOutbound ? 'brand' : 'surface'}
				border={!isOutbound}
				borderTone="line"
				radiusToken="lg"
				style={{
					padding: 12,
					gap: 8,
				}}
			>
				<Box layoutDirection="row" justify="space-between" align="center" gap={2}>
					<Badge label={message.sender} tone={isOutbound ? 'brand' : 'default'} />
					<Text role="caption" tone={isOutbound ? 'inverse' : 'soft'}>{message.time}</Text>
				</Box>
				<Text role="bodySm" tone={isOutbound ? 'inverse' : 'default'}>
					{message.text}
				</Text>
			</Box>
		</Box>
	);
});

const OrderChatSection = React.memo(function OrderChatSection({
	orderId = demoSummary.orderId,
	pickupLabel = demoSummary.pickupLabel,
	dropoffLabel = demoSummary.dropoffLabel,
	state = 'active',
}: {
	orderId?: DshCaptainOrderId;
	pickupLabel?: string;
	dropoffLabel?: string;
	state?: 'active' | 'readOnly';
}) {
	const { theme } = useTheme();
	const isReadOnly = state === 'readOnly';
	const [draft, setDraft] = React.useState('');
	const [attachments, setAttachments] = React.useState<Array<'voice' | 'camera' | 'video' | 'attachment'>>([]);
	const [isSending, setIsSending] = React.useState(false);
	const [composerState, setComposerState] = React.useState<'idle' | 'typing' | 'with-attachment' | 'sending' | 'success' | 'error' | 'disabled'>(isReadOnly ? 'disabled' : 'idle');
	const [messages, setMessages] = React.useState<DshCaptainOrderMessage[]>(demoMessages);

	const canSend = !isReadOnly && !isSending && (draft.trim().length > 0 || attachments.length > 0);

	React.useEffect(() => {
		if (isReadOnly) {
			setComposerState('disabled');
			return;
		}

		if (isSending) {
			setComposerState('sending');
			return;
		}

		if (draft.trim().length > 0) {
			setComposerState('typing');
			return;
		}

		if (attachments.length > 0) {
			setComposerState('with-attachment');
			return;
		}

		setComposerState('idle');
	}, [attachments.length, draft, isReadOnly, isSending]);

	const toggleAttachment = (kind: 'voice' | 'camera' | 'video' | 'attachment') => {
		if (isReadOnly || isSending) {
			return;
		}

		setAttachments((current) => (current.includes(kind)
			? current.filter((item) => item !== kind)
			: [...current, kind]));
	};

	const handleSend = () => {
		if (!canSend) {
			return;
		}

		const text = draft.trim();
		const attachmentsLabel = attachments.length ? ` [مرفقات: ${attachments.join('، ')}]` : '';

		setIsSending(true);
		setComposerState('sending');

		Promise.resolve()
			.then(async () => {
				await new Promise((resolve) => globalThis.setTimeout(resolve, 220));
				setMessages((current) => [
					...current,
					{
						id: `msg-${current.length + 1}`,
						sender: 'الكابتن',
						text: `${text || 'تم إرسال مرفقات مرتبطة بالطلب'}${attachmentsLabel}`,
						time: 'الآن',
						side: 'end',
					},
				]);
				setDraft('');
				setAttachments([]);
				setComposerState('success');
			})
			.catch(() => {
				setComposerState('error');
			})
			.finally(() => {
				setIsSending(false);
			});
	};

	const composerHint = isReadOnly
		? 'تم تسليم الطلب. التواصل هنا للقراءة فقط.'
		: composerState === 'sending'
			? 'جاري الإرسال...'
			: composerState === 'success'
				? 'تم الإرسال بنجاح.'
				: composerState === 'error'
					? 'تعذر الإرسال. حاول مرة أخرى.'
					: composerState === 'with-attachment'
						? 'المرفقات جاهزة، أضف نصًا اختياريًا ثم أرسل.'
						: 'الرسائل المختصرة فقط داخل هذا المسار.';

	return (
		<DshOperationScreen
			title="محادثة الطلب"
			subtitle="تحديثات قصيرة، مرفقات خفيفة، ومتابعة مباشرة من نفس الطلب."
			content={
				<Box gap={3}>
					<Box gap={2}>
						<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
							<Badge label={`#${orderId}`} tone="brand" />
							<Badge label={isReadOnly ? 'مقروء فقط' : 'نشط'} tone={isReadOnly ? 'success' : 'warning'} />
						</Box>
						<Text role="bodySm" tone="muted">
							{pickupLabel} · {dropoffLabel}
						</Text>
					</Box>

					<Box gap={3} style={{ paddingVertical: 4 }}>
						<Box gap={1}>
							<Text role="titleSm">سجل تواصل الطلب</Text>
							<Text role="bodySm" tone="muted">
								تحديثات قصيرة، مرفقات خفيفة، ومتابعة مباشرة من نفس الطلب.
							</Text>
						</Box>

						<ScrollView style={{ maxHeight: 380 }} contentContainerStyle={{ gap: 12 }} showsVerticalScrollIndicator={false}>
							{messages.map((message) => (
								<OrderChatBubble key={message.id} message={message} />
							))}
						</ScrollView>

						<Divider />

						<Box
							background={isReadOnly ? 'surfaceInset' : 'surface'}
							border
							borderTone="line"
							radiusToken="md"
							style={{
								padding: 12,
								gap: 8,
							}}
						>
							<TextField
								value={draft}
								onChangeText={setDraft}
								editable={!isReadOnly}
								placeholder={isReadOnly ? 'الطلب مغلق الآن' : 'اكتب رسالة مختصرة...'}
								multiline
								numberOfLines={3}
								style={{ minHeight: 92, textAlignVertical: 'top' }}
							/>
							<Box layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
								<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
									<ComposerActionButton iconName="mic-outline" accessibilityLabel="رسالة صوتية" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('voice')} />
									<ComposerActionButton iconName="camera-outline" accessibilityLabel="التقاط صورة" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('camera')} />
									<ComposerActionButton iconName="videocam-outline" accessibilityLabel="التقاط فيديو" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('video')} />
									<ComposerActionButton iconName="attach-outline" accessibilityLabel="إرفاق ملف" disabled={isReadOnly || isSending} onPress={() => toggleAttachment('attachment')} />
								</Box>
								<Button
									label={isReadOnly ? 'مقفل' : isSending ? 'جاري الإرسال' : 'إرسال'}
									tone={isReadOnly ? 'secondary' : 'primary'}
									size="sm"
									fullWidth={false}
									disabled={!canSend}
									loading={isSending}
									onPress={handleSend}
								/>
							</Box>
							<Text role="caption" tone="muted">
								{composerHint}
							</Text>
						</Box>
					</Box>
				</Box>
			}
		/>
	);
});

const OrderBellSection = React.memo(function OrderBellSection({
	items = demoBellItems,
	onOpenInbox,
	onOpenNextOrder,
	onRetry,
	onBack,
}: {
	items?: DshCaptainOrderBellItem[];
	onOpenInbox?: () => void;
	onOpenNextOrder?: () => void;
	onRetry?: () => void;
	onBack?: () => void;
}) {
	const { theme } = useTheme();
	const summary = {
		inboxLabel: 'صندوق طلبات الكابتن',
		approvalLabel: 'بحاجة إلى موافقة',
		urgentLabel: 'رنات الطلبات العاجلة',
		nextActionLabel: 'رنّة الطلب الجديدة يجب أن تدفع الكابتن إلى الموافقة أو الصندوق مباشرة من دون ضوضاء إضافية.',
	};

	return (
		<DshOperationScreen
			title="جرس الطلبات الجديدة للكابتن"
			subtitle="تنبيه واضح ومختصر يدفع نحو الصندوق أو أول طلب يحتاج قرارًا سريعًا."
			content={
				<Box gap={4} style={{ paddingHorizontal: 4 }}>
					<Box gap={3} style={{ paddingVertical: 4 }}>
						<Box gap={1} style={{ alignItems: 'flex-end' }}>
							<Badge label="طلبات جديدة" tone="warning" />
							<Text role="titleLg" style={{ textAlign: 'right' }}>جرس الطلبات الجديدة للكابتن</Text>
							<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
								هذا الجرس يلفت الانتباه فقط عند وصول طلب جديد أو عند الحاجة إلى موافقة سريعة من الكابتن.
							</Text>
						</Box>

						<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
							<Box
								background="surface"
								border
								borderTone="line"
								radiusToken="md"
								style={{
									padding: 12,
									flex: 1,
									minWidth: 80,
									gap: 4,
								}}
							>
								<Text role="caption" tone="muted">طلبات جديدة</Text>
								<Text role="titleSm">{String(items.length)}</Text>
							</Box>
							<Box
								background="surface"
								border
								borderTone="line"
								radiusToken="md"
								style={{
									padding: 12,
									flex: 1,
									minWidth: 80,
									gap: 4,
								}}
							>
								<Text role="caption" tone="muted">بحاجة إلى موافقة</Text>
								<Text role="titleSm">2</Text>
							</Box>
							<Box
								background="surface"
								border
								borderTone="line"
								radiusToken="md"
								style={{
									padding: 12,
									flex: 1,
									minWidth: 80,
									gap: 4,
								}}
							>
								<Text role="caption" tone="muted">رنات عاجلة</Text>
								<Text role="titleSm">1</Text>
							</Box>
						</Box>
					</Box>

					<Divider />

					<KeyValueList
						items={[
							{ label: 'الحالة', value: summary.approvalLabel, tone: 'brand' },
							{ label: 'الأولوية', value: summary.urgentLabel, tone: 'warning' },
						]}
					/>

					<Divider />

					<Box padding={0} gap={0}>
						{items.map((item, index, arr) => (
							<Pressable
								key={item.id}
								style={({ pressed }) => ({
									flexDirection: 'row-reverse',
									alignItems: 'flex-start',
									justifyContent: 'space-between',
									paddingVertical: 14,
									backgroundColor: pressed ? theme.surfaceInset : theme.surface,
									borderBottomWidth: index === arr.length - 1 ? 0 : 1,
									borderBottomColor: theme.line,
									gap: 12,
								})}
							>
								<View style={{ flex: 1, gap: 3, alignItems: 'flex-end' }}>
									<Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>{item.title}</Text>
									{item.subtitle ? <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>{item.subtitle}</Text> : null}
									{item.meta ? <Text role="caption" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>{item.meta}</Text> : null}
								</View>
								{item.serviceType ? <View style={{ paddingTop: 2, flexShrink: 0 }}><Badge label={resolveServiceTypeBadge(item.serviceType).badgeLabel} tone={resolveServiceTypeBadge(item.serviceType).badgeTone} /></View> : null}
							</Pressable>
						))}
					</Box>
				</Box>
			}
			primaryActionLabel={onOpenNextOrder ? 'فتح أول طلب' : undefined}
			secondaryActionLabel={onOpenInbox ? 'صندوق الطلبات' : undefined}
			tertiaryActionLabel={onBack ? 'العودة' : onRetry ? 'إعادة المحاولة' : undefined}
			onPrimaryAction={onOpenNextOrder}
			onSecondaryAction={onOpenInbox}
			onTertiaryAction={onBack ?? onRetry}
			onRetry={onRetry}
		/>
	);
});

const OrderActionSection = React.memo(function OrderActionSection({
	action,
	summary = demoSummary,
	onActionPress,
	onBackToInbox,
}: {
	action: Exclude<DshCaptainOrderAction, 'proof-upload' | 'back-to-inbox' | 'next-order'>;
	summary?: DshCaptainOrderDetailSummary;
	onActionPress?: (action: DshCaptainOrderAction) => void;
	onBackToInbox?: () => void;
}) {
	const actionCopy: Record<typeof action, { title: string; subtitle: string; primaryLabel: string; secondaryLabel?: string; kind: DshCaptainOrderStage }> = {
		accept: {
			title: 'قبول الطلب',
			subtitle: 'أكد أن الكابتن قبل الطلب والتزم بالاستلام.',
			primaryLabel: 'قبول الطلب',
			secondaryLabel: 'العودة إلى دليل الدعم',
			kind: 'accepted',
		},
		'order-offer-reject': {
			title: 'رفض العرض',
			subtitle: 'ارفض العرض مع سبب تشغيلي ظاهر.',
			primaryLabel: 'رفض الطلب',
			secondaryLabel: 'العودة إلى دليل الدعم',
			kind: 'offer',
		},
		pickup: {
			title: 'استلام الطلب',
			subtitle: 'أكد استلام الفرع قبل بدء مرحلة التوصيل.',
			primaryLabel: 'تأكيد الاستلام',
			secondaryLabel: 'العودة إلى دليل الدعم',
			kind: 'pickup',
		},
		deliver: {
			title: 'تسليم الطلب',
			subtitle: 'أغلق المسار مع تأكيد التسليم النهائي.',
			primaryLabel: 'تأكيد التسليم',
			secondaryLabel: 'العودة إلى دليل الدعم',
			kind: 'delivery',
		},
	};

	const copy = actionCopy[action];

	return (
		<DshOperationScreen
			title={copy.title}
			subtitle={copy.subtitle}
			content={
				<KeyValueList
					items={[
						{ label: 'الطلب', value: summary.orderId, tone: 'brand' },
						{ label: 'الاستلام', value: summary.pickupLabel },
						{ label: 'التسليم', value: summary.dropoffLabel },
						{ label: 'المرحلة', value: summary.currentStageLabel, tone: 'warning' },
					]}
				/>
			}
			primaryActionLabel={copy.primaryLabel}
			secondaryActionLabel={copy.secondaryLabel}
			onPrimaryAction={() => onActionPress?.(action)}
			onSecondaryAction={onBackToInbox}
		/>
	);

});

const OrderProofSection = React.memo(function OrderProofSection({
	summary = demoSummary,
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
							{ label: 'الطلب', value: summary.orderId, tone: 'brand' },
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
	const activeItems = items ?? demoBellItems;
	const activeSummary = summary ?? demoSummary;

	const openNextOrderFromOverview = () => {
		const nextOrderId = activeItems[0]?.id ?? activeSummary.orderId;

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
				onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? demoSummary.orderId)}
				onBackToInbox={onBackToInbox}
				onRetry={onRetry}
			/>
		);
	}

	if (resolvedSection === 'chat') {
		return (
			<OrderChatSection
				orderId={summary?.orderId ?? demoSummary.orderId}
				pickupLabel={summary?.pickupLabel}
				dropoffLabel={summary?.dropoffLabel}
			/>
		);
	}

	if (resolvedSection === 'bell') {
		return <OrderBellSection items={items} onOpenInbox={onBackToInbox} onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? demoSummary.orderId)} onRetry={onRetry} />;
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
		return <OrderBellSection items={items} onOpenInbox={onBackToInbox} onOpenNextOrder={() => onOpenNextOrder?.(summary?.orderId ?? demoSummary.orderId)} onRetry={onRetry} />;
	}

	return (
		<DshOperationScreen
			title="طلبات الكابتن"
			subtitle="نظرة موحدة على الصندوق والمهمة النشطة والجرس بنفس الغلاف البصري المستخدم في تطبيق العميل."
			content={
				<Box gap={4} style={{ paddingHorizontal: 4 }}>
					<Box gap={3} style={{ paddingVertical: 4 }}>
						<SectionHeader title="الطلب التالي" subtitle="أولوية واحدة واضحة قبل أي انتقال آخر." />
						<Text role="bodyStrong">{activeItems[0]?.title ?? `طلب #${activeSummary.orderId}`}</Text>
						<Text role="bodySm" tone="muted">{activeItems[0]?.subtitle ?? activeSummary.currentStageLabel}</Text>
					</Box>

					<Divider />

					<Box gap={3} style={{ paddingVertical: 4 }}>
						<SectionHeader title="المهمة النشطة" subtitle="تفاصيل مختصرة للمهمة الجارية." />
						<KeyValueList
							items={[
								{ label: 'الطلب', value: activeSummary.orderId, tone: 'brand' },
								{ label: 'الاستلام', value: activeSummary.pickupLabel },
								{ label: 'التسليم', value: activeSummary.dropoffLabel },
								{ label: 'الخطوة التالية', value: activeSummary.nextActionLabel, tone: 'success' },
							]}
						/>
					</Box>

					<Divider />

					<Box gap={3} style={{ paddingVertical: 4 }}>
						<SectionHeader title="الرنات الحالية" subtitle="أقصر قائمة ممكنة للطلبات التي تنتظر قرارًا." />
						<Box gap={2}>
							{activeItems.slice(0, 3).map((item) => (
								<ListItem key={item.id} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={resolveServiceTypeBadge(item.serviceType).badgeLabel} badgeTone={resolveServiceTypeBadge(item.serviceType).badgeTone} onPress={() => onOpenOrder?.(item.id)} />
							))}
						</Box>
					</Box>

					<Divider />

					<Box gap={2} style={{ paddingVertical: 4 }}>
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
		state: props.state ?? demoState,
		items: props.items ?? demoBellItems,
		summary: props.summary ?? demoSummary,
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
	summary = demoSummary,
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
	summary: _summary,
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

function SimpleSupportScreen({
	title,
	subtitle,
	heroTitle,
	heroDescription,
	primaryLabel,
	secondaryLabel,
	keyValues,
	listItems,
	inputLabel,
	inputHint,
	onPrimaryAction,
	onSecondaryAction,
	onBack,
	onRetry,
}: {
	title: string;
	subtitle: string;
	heroTitle: string;
	heroDescription: string;
	primaryLabel: string;
	secondaryLabel?: string;
	keyValues?: Array<{ label: string; value: string; tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }>;
	listItems?: Array<{ title: string; subtitle: string; meta: string; badgeLabel?: string }>;
	inputLabel?: string;
	inputHint?: string;
	onPrimaryAction?: () => void;
	onSecondaryAction?: () => void;
	onBack?: () => void;
	onRetry?: () => void;
}) {
	const { theme } = useTheme();
	const [draftValue, setDraftValue] = React.useState('');

	return (
		<MobileScrollView padding={4} gap={5} contentContainerStyle={{ paddingBottom: 40 }}>
			{/* Hero — flat label + description, no card */}
			<Box gap={2}>
				<Text role="bodyStrong" style={{ textAlign: 'right' }}>{heroTitle}</Text>
				<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{heroDescription}</Text>
			</Box>

			{/* Key values — plain rows with borderBottom separator */}
			{keyValues?.length ? (
				<>
					<Divider />
					<KeyValueList items={keyValues} />
				</>
			) : null}

			{/* List items — flat pressable rows */}
			{listItems?.length ? (
				<>
					<Divider />
					<Box padding={0} gap={0}>
						{listItems.map((item, index, arr) => (
							<View
								key={`${title}-${item.title}`}
								style={{
									flexDirection: 'row-reverse',
									alignItems: 'flex-start',
									justifyContent: 'space-between',
									paddingVertical: 12,
									borderBottomWidth: index === arr.length - 1 ? 0 : 1,
									borderBottomColor: theme.line,
									gap: 12,
								}}
							>
								<View style={{ flex: 1, gap: 3, alignItems: 'flex-end' }}>
									<Text role="bodyStrong" style={{ textAlign: 'right' }}>{item.title}</Text>
									<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{item.subtitle}</Text>
									<Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{item.meta}</Text>
								</View>
								{item.badgeLabel ? <View style={{ paddingTop: 2, flexShrink: 0 }}><Badge label={item.badgeLabel} tone="brand" /></View> : null}
							</View>
						))}
					</Box>
				</>
			) : null}

			{/* Input — plain, no Surface wrapper */}
			{inputLabel ? (
				<>
					<Divider />
					<TextField
						label={inputLabel}
						value={draftValue}
						onChangeText={setDraftValue}
						hint={inputHint}
					/>
				</>
			) : null}

			<Divider />

			{/* Actions */}
			<Box gap={2}>
				<Button label={primaryLabel} onPress={onPrimaryAction} />
				{secondaryLabel ? <Button label={secondaryLabel} tone="secondary" onPress={onSecondaryAction ?? onBack} /> : null}
				{onRetry ? <Button label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
			</Box>
		</MobileScrollView>
	);
}

export function DshCaptainOrderGetScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="عرض الطلب"
			subtitle="افتح العرض المقروء المدمج للمسار المخصص."
			heroTitle="عرض المسار المخصص"
			heroDescription="يمكن للكابتن إعادة تحميل سياق المسار من دون إعادة فتح الصندوق."
			primaryLabel="تحديث لقطة المسار"
			secondaryLabel="العودة إلى دليل الدعم"
			keyValues={[
				{ label: 'الطلب', value: 'رقم 9021' },
				{ label: 'الوقت المتوقع الحالي', value: '8 دقائق' },
				{ label: 'أثر الازدحام', value: 'متوسط', tone: 'warning' },
			]}
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

export function DshCaptainOrderDetailsScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="تفاصيل الطلب"
			subtitle="راجع لقطة المسار الموجهة للكابتن."
			heroTitle="لقطة طلب الكابتن"
			heroDescription="لا ينبغي أن تبقى ظاهرة هنا إلا الاستلام والتسليم والتوقيت والمرحلة الحالية."
			primaryLabel="تحديث تفاصيل الطلب"
			secondaryLabel="العودة إلى دليل الدعم"
			keyValues={[
				{ label: 'الاستلام', value: 'Burger Lab - فرع حطين' },
				{ label: 'التسليم', value: 'حي العليا' },
				{ label: 'المرحلة', value: 'متجه إلى الاستلام', tone: 'brand' },
			]}
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

export function DshCaptainOrdersListScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="قائمة الطلبات"
			subtitle="تصفح كل طلبات الكابتن من شاشة صف مركزة واحدة."
			heroTitle="صف مسار الكابتن"
			heroDescription="تكمّل هذه القائمة صندوق الطلبات برؤية أوسع لكنها ما زالت موجهة للطلبات."
			primaryLabel="تحديث قائمة الطلبات"
			secondaryLabel="العودة إلى دليل الدعم"
			listItems={[
				{ title: 'الطلب رقم 9021', subtitle: 'Burger Lab إلى العليا', meta: 'الاستلام خلال 8 دقائق', badgeLabel: 'التالي' },
				{ title: 'الطلب رقم 9024', subtitle: 'Green Bowl إلى طريق الملك فهد', meta: 'الاستلام خلال 15 دقيقة', badgeLabel: 'في الصف' },
			]}
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

export function DshCaptainOrdersOffersListScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="قائمة عروض الطلبات"
			subtitle="راجع عروض الطلبات المفتوحة التي لم تقبل بعد."
			heroTitle="عروض الطلبات المتاحة"
			heroDescription="يبقى مراجعة العروض منفصلة عن الطلبات المقبولة حتى يعرف الكابتن مستوى الالتزام دائمًا."
			primaryLabel="تحديث العروض"
			secondaryLabel="العودة إلى دليل الدعم"
			listItems={[
				{ title: 'عرض رقم 440', subtitle: 'Bean House إلى الوسط', meta: 'الدفع المتوقع 22 ر.ي', badgeLabel: 'مفتوح' },
				{ title: 'عرض رقم 441', subtitle: 'Green Bowl إلى الدائري', meta: 'الدفع المتوقع 19 ر.ي', badgeLabel: 'مفتوح' },
			]}
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

export type DshCaptainOrderAcceptScreenProps = {
	orderId?: string;
	onBack?: () => void;
	onAccept?: (orderId: string) => void;
	onDecline?: (orderId: string) => void;
	onSecondaryAction?: () => void; // fallback compatibility
};

export function DshCaptainOrderAcceptScreen({
	orderId = 'captain-order-9021',
	onBack,
	onAccept,
	onDecline,
	onSecondaryAction,
}: DshCaptainOrderAcceptScreenProps) {
	const customSummary = {
		orderId: orderId,
		pickupLabel: 'Burger Lab - فرع حطين',
		dropoffLabel: 'حي العليا، طريق الملك فهد',
		etaLabel: 'مدة الوصول إلى الاستلام: 8 دقائق',
		currentStageLabel: 'في انتظار قبول الكابتن',
		nextActionLabel: 'اقبل المهمة لبدء التوصيل',
	};

	return (
		<Box gap={4} style={{ flex: 1 }}>
			<OrderActionSection
				action="accept"
				summary={customSummary}
				onActionPress={() => {
					if (onAccept) {
						onAccept(orderId);
					} else {
						onSecondaryAction?.();
					}
				}}
				onBackToInbox={onBack}
			/>
			{onDecline && (
				<Box paddingX={4} style={{ paddingBottom: 16 }}>
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
