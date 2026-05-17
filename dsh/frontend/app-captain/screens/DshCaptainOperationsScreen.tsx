import React from 'react';
import { Box, KeyValueList, ListItem, SectionHeader, Surface, Text, TextField, Button, MobileScrollView } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshCaptainOrderStage } from '../data/captain-orders.preview-data';
import type { DshCaptainProfileSnapshot } from '../data/captain-profile.preview-data';

type DshCaptainFlowKey = 'entry' | 'orders' | 'finance' | 'profile' | 'operations';

type DshCaptainFlowNode = {
	id: DshCaptainFlowKey;
	label: string;
	next: readonly DshCaptainFlowKey[];
};

const dshCaptainFlowMap: Record<DshCaptainFlowKey, DshCaptainFlowNode> = {
	entry: {
		id: 'entry',
		label: 'مدخل الكابتن',
		next: ['orders', 'operations'],
	},
	orders: {
		id: 'orders',
		label: 'الطلبات',
		next: ['finance', 'profile', 'operations'],
	},
	finance: {
		id: 'finance',
		label: 'المالية',
		next: ['profile', 'operations'],
	},
	profile: {
		id: 'profile',
		label: 'الملف',
		next: ['operations'],
	},
	operations: {
		id: 'operations',
		label: 'التشغيل',
		next: ['orders'],
	},
} as const;

export type CaptainSupportScreenId =
	| 'chat-read-ack'
	| 'chat-send'
	| 'cod-balance'
	| 'order-accept'
	| 'order-deliver'
	| 'order-details'
	| 'order-get'
	| 'order-pickup'
	| 'orders-list'
	| 'orders-offers-list'
	| 'profile-get'
	| 'proof-upload'
	| 'tier-evaluate'
	| 'tier-info'
	| 'map';

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
}) {
	const [draftValue, setDraftValue] = React.useState('');

	return (
		<DshOperationScreen
			title={title}
			subtitle={subtitle}
			content={
				<Box gap={3}>
					<Surface tone="brand" gap={3}>
						<SectionHeader title={heroTitle} subtitle={heroDescription} />
					</Surface>

					{keyValues?.length ? (
						<Surface tone="raised" gap={3}>
							<SectionHeader title="تفاصيل المسار" subtitle="تبقى فقط التفاصيل اللازمة لإجراء الكابتن الفوري ظاهرة." />
							<KeyValueList items={keyValues} />
						</Surface>
					) : null}

					{listItems?.length ? (
						<Surface tone="default" gap={3}>
							<SectionHeader title="الصف الحالي" subtitle="كل عنصر يحافظ على قرار المسار التالي واضحًا." />
							<Box gap={2}>
								{listItems.map((item) => (
									<ListItem key={`${title}-${item.title}`} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
								))}
							</Box>
						</Surface>
					) : null}

					{inputLabel ? (
						<Surface tone="raised" gap={3}>
							<SectionHeader title="إدخال المسودة" subtitle="إدخال واحد موجز من الكابتن يبقي المسار مركزًا." />
							<TextField label={inputLabel} value={draftValue} onChangeText={setDraftValue} hint={inputHint} />
						</Surface>
					) : null}
				</Box>
			}
			primaryActionLabel={primaryLabel}
			secondaryActionLabel={secondaryLabel ?? (onBack ? 'العودة' : undefined)}
			onPrimaryAction={onPrimaryAction}
			onSecondaryAction={onSecondaryAction ?? onBack}
		/>
	);
}

export function DshCaptainChatReadAckScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="تأكيد قراءة دردشة الكابتن"
			subtitle="أكد أحدث محادثة تشغيلية من دون مغادرة مسار الطلب النشط."
			heroTitle="الرسائل التشغيلية غير المقروءة"
			heroDescription="يمسح الكابتن التواصل غير المقروء مع البقاء مركزًا على خطوة المسار التالية."
			primaryLabel="وضع علامة مقروء"
			secondaryLabel="العودة إلى دليل الدعم"
			listItems={[
				{ title: 'الفرع', subtitle: 'الطلب جاهز عند الكاونتر 2.', meta: 'منذ دقيقتين', badgeLabel: 'غير مقروء' },
				{ title: 'العميل', subtitle: 'يرجى الاتصال عند الوصول.', meta: 'منذ 5 دقائق', badgeLabel: 'غير مقروء' },
			]}
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

export function DshCaptainChatSendScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
	return (
		<SimpleSupportScreen
			title="إرسال رسالة الكابتن"
			subtitle="أرسل رسالة مرتبطة بالمسار من مساحة كتابة مركزة."
			heroTitle="التواصل على المسار"
			heroDescription="استخدم رسالة قصيرة واحدة حتى يتمكن الطرف المستلم من التصرف فورًا."
			primaryLabel="إرسال الرسالة"
			secondaryLabel="العودة إلى دليل الدعم"
			inputLabel="الرسالة"
			inputHint="مثال: وصلت إلى بوابة الاستلام وأنتظر التسليم."
			onBack={props.onBack}
			onSecondaryAction={props.onSecondaryAction}
		/>
	);
}

const CAPTAIN_PROFILE_PREVIEW: DshCaptainProfileSnapshot = {
	displayName: 'الكابتن ناصر',
	tierLabel: 'الطبقة الذهبية',
	readinessLabel: 'جاهز للاستلام خلال 8 دقائق',
};

const ACTIVE_ORDER_PREVIEW: {
	orderId: string;
	pickupLabel: string;
	dropoffLabel: string;
	etaLabel: string;
	currentStageLabel: string;
	nextActionLabel: string;
	proofLabel: string;
	stage: DshCaptainOrderStage;
} = {
	orderId: 'captain-order-9021',
	pickupLabel: 'Burger Lab - فرع حطين',
	dropoffLabel: 'حي العليا، طريق الملك فهد',
	etaLabel: 'الوصول إلى الاستلام خلال 8 دقائق',
	currentStageLabel: 'في الطريق إلى الاستلام',
	nextActionLabel: 'أكد الاستلام فور التقاط الطلب ثم انتقل للتسليم',
	proofLabel: 'يتبقى رفع إثبات التسليم بعد الإغلاق',
	stage: 'pickup',
};

const PRIMARY_FLOW_ORDER: readonly DshCaptainFlowKey[] = ['entry', 'orders', 'operations'];
const SECONDARY_FLOW_ORDER: readonly DshCaptainFlowKey[] = ['finance', 'profile'];

const FLOW_NODE_COPY: Record<DshCaptainFlowKey, { subtitle: string; badgeLabel: string }> = {
	entry: {
		subtitle: 'ابدأ من العرض المفتوح ثم ثبّت قرار القبول قبل أي انتقال آخر.',
		badgeLabel: 'بداية',
	},
	orders: {
		subtitle: 'القبول والتفاصيل والاستلام والتسليم تبقى في خط تنفيذ واحد.',
		badgeLabel: 'تنفيذ',
	},
	operations: {
		subtitle: 'التشغيل هنا يعني دعم هذه المهمة فقط: تواصل، تأكيد، وإثبات.',
		badgeLabel: 'تشغيل',
	},
	finance: {
		subtitle: 'التحصيل يبقى ثانويًا بعد تثبيت المهمة الحالية وعدم قطع المسار.',
		badgeLabel: 'مالية',
	},
	profile: {
		subtitle: 'الملف والطبقة يدعمان الجاهزية، لكنهما لا يقودان الرحلة النشطة.',
		badgeLabel: 'ملف',
	},
};

const EXECUTION_ITEMS: ReadonlyArray<{ id: CaptainSupportScreenId; title: string; subtitle: string; badgeLabel: string }> = [
	{ id: 'orders-offers-list', title: 'مراجعة عروض الطلبات', subtitle: 'ابدأ من أول عرض مفتوح قبل الالتزام بمهمة جديدة.', badgeLabel: 'عروض' },
	{ id: 'orders-list', title: 'الصف النشط', subtitle: 'أبقِ الطلبات المفتوحة في صف واحد واضح.', badgeLabel: 'صف' },
	{ id: 'order-get', title: 'لقطة الطلب', subtitle: 'افتح تفاصيل الرحلة الحالية من دون مغادرة المسار.', badgeLabel: 'قراءة' },
	{ id: 'order-pickup', title: 'تأكيد الاستلام', subtitle: 'نفّذ خطوة الاستلام عند الوصول إلى الفرع.', badgeLabel: 'استلام' },
	{ id: 'order-deliver', title: 'تأكيد التسليم', subtitle: 'أغلق الرحلة الحالية بعد الوصول للعميل.', badgeLabel: 'تسليم' },
	{ id: 'proof-upload', title: 'رفع الإثبات', subtitle: 'اختم المهمة برفع دليل التسليم المختصر.', badgeLabel: 'إثبات' },
];

const SUPPORT_ITEMS: ReadonlyArray<{ id: CaptainSupportScreenId; title: string; subtitle: string; badgeLabel: string }> = [
	{ id: 'chat-read-ack', title: 'تأكيد قراءة الدردشة', subtitle: 'امسح الرسائل التشغيلية غير المقروءة للمهمة الحالية.', badgeLabel: 'تواصل' },
	{ id: 'chat-send', title: 'إرسال رسالة', subtitle: 'أرسل تحديثًا موجزًا مرتبطًا بالمسار.', badgeLabel: 'تواصل' },
	{ id: 'cod-balance', title: 'رصيد الدفع عند الاستلام', subtitle: 'راجع التحصيل عند الحاجة بعد تثبيت الخطوة النشطة.', badgeLabel: 'مالية' },
	{ id: 'profile-get', title: 'ملف الكابتن', subtitle: 'اقرأ الملف فقط عندما تحتاج مرجع الجاهزية.', badgeLabel: 'ملف' },
	{ id: 'tier-info', title: 'معلومات الطبقة', subtitle: 'افهم مزايا الطبقة الحالية من دون تعطيل التنفيذ.', badgeLabel: 'طبقة' },
	{ id: 'tier-evaluate', title: 'تقييم الطبقة', subtitle: 'راجع الجاهزية التالية بعد إغلاق المهمة الحالية.', badgeLabel: 'طبقة' },
	{ id: 'map', title: 'خريطة الحرارة', subtitle: 'راجع مناطق الطلب المرتفع لتمركز أفضل.', badgeLabel: 'خريطة' },
];

function resolvePrimaryActionScreen(stage: DshCaptainOrderStage): CaptainSupportScreenId {
	if (stage === 'offer') {
		return 'order-accept';
	}

	if (stage === 'accepted' || stage === 'pickup') {
		return 'order-pickup';
	}

	if (stage === 'delivery') {
		return 'order-deliver';
	}

	if (stage === 'proof' || stage === 'closed') {
		return 'proof-upload';
	}

	return 'orders-list';
}

function resolvePrimaryActionLabel(stage: DshCaptainOrderStage) {
	if (stage === 'offer') {
		return 'فتح القبول';
	}

	if (stage === 'accepted' || stage === 'pickup') {
		return 'فتح الاستلام';
	}

	if (stage === 'delivery') {
		return 'فتح التسليم';
	}

	if (stage === 'proof' || stage === 'closed') {
		return 'فتح الإثبات';
	}

	return 'فتح الصف النشط';
}

function resolveFlowNodeScreen(flowKey: DshCaptainFlowKey, stage: DshCaptainOrderStage): CaptainSupportScreenId {
	if (flowKey === 'entry') {
		return 'orders-offers-list';
	}

	if (flowKey === 'orders') {
		return 'orders-list';
	}

	if (flowKey === 'operations') {
		return resolvePrimaryActionScreen(stage);
	}

	if (flowKey === 'finance') {
		return 'cod-balance';
	}

	return 'profile-get';
}

function resolveNextNodesLabel(flowKey: DshCaptainFlowKey) {
	const nextLabels = dshCaptainFlowMap[flowKey].next.map((nextKey) => dshCaptainFlowMap[nextKey].label);
	return nextLabels.length > 0 ? `التالي: ${nextLabels.join(' ثم ')}` : 'لا توجد خطوة لاحقة.';
}

export function DshCaptainSupportDirectoryScreen({ onOpenScreen }: { onOpenScreen?: (screenId: CaptainSupportScreenId) => void }) {
	const currentActionScreenId = resolvePrimaryActionScreen(ACTIVE_ORDER_PREVIEW.stage);

	return (
		<MobileScrollView padding={4} gap={4}>
			<Text role="titleLg">غرفة تشغيل الكابتن</Text>
			<Text role="bodyMd" tone="muted">
				مسار تشغيل فردي مملوك للكابتن الحالي فقط. لا توجد خريطة أسطول عامة ولا لوحة مراقبة إدارية خارج سياق الطلب النشط.
			</Text>

			<Surface tone="brand" gap={3}>
				<SectionHeader
					title={`المهمة الحالية · ${CAPTAIN_PROFILE_PREVIEW.displayName}`}
					subtitle={`${CAPTAIN_PROFILE_PREVIEW.tierLabel} · ${CAPTAIN_PROFILE_PREVIEW.readinessLabel}`}
				/>
				<Box gap={1}>
					<Text role="bodyStrong">{ACTIVE_ORDER_PREVIEW.pickupLabel}</Text>
					<Text role="bodySm" tone="muted">{ACTIVE_ORDER_PREVIEW.dropoffLabel}</Text>
					<Text role="caption" tone="soft">{ACTIVE_ORDER_PREVIEW.etaLabel}</Text>
				</Box>
				<Box gap={1}>
					<Text role="bodySm">المرحلة الحالية: {ACTIVE_ORDER_PREVIEW.currentStageLabel}</Text>
					<Text role="bodySm">الإجراء التالي: {ACTIVE_ORDER_PREVIEW.nextActionLabel}</Text>
					<Text role="caption" tone="soft">{ACTIVE_ORDER_PREVIEW.proofLabel}</Text>
					<Text role="caption" tone="soft">حالة الربط الحالية: معاينة واجهة فقط داخل app-captain.</Text>
				</Box>
				<Button label={resolvePrimaryActionLabel(ACTIVE_ORDER_PREVIEW.stage)} onPress={() => onOpenScreen?.(currentActionScreenId)} />
				<Button label="فتح لقطة الطلب" tone="secondary" onPress={() => onOpenScreen?.('order-get')} />
			</Surface>

			<Surface tone="raised" gap={3}>
				<SectionHeader title="نبض الرحلة" subtitle="الترتيب التالي يشرح رحلة الكابتن من العرض حتى التنفيذ والإثبات فقط." />
				<Box gap={2}>
					{PRIMARY_FLOW_ORDER.map((flowKey) => (
						<ListItem
							key={flowKey}
							title={dshCaptainFlowMap[flowKey].label}
							subtitle={FLOW_NODE_COPY[flowKey].subtitle}
							meta={resolveNextNodesLabel(flowKey)}
							badgeLabel={FLOW_NODE_COPY[flowKey].badgeLabel}
							onPress={() => onOpenScreen?.(resolveFlowNodeScreen(flowKey, ACTIVE_ORDER_PREVIEW.stage))}
						/>
					))}
				</Box>
			</Surface>

			<Surface tone="raised" gap={3}>
				<SectionHeader title="خطوات التنفيذ الفوري" subtitle="هذه هي الشاشات الوحيدة التي يحتاجها الكابتن داخل المهمة الحالية." />
				<Box gap={2}>
					{EXECUTION_ITEMS.map((item) => (
						<ListItem
							key={item.id}
							title={item.title}
							subtitle={item.subtitle}
							meta="افتح الخطوة التالية من خط التنفيذ المملوك للكابتن"
							badgeLabel={item.badgeLabel}
							onPress={() => onOpenScreen?.(item.id)}
						/>
					))}
				</Box>
			</Surface>

			<Surface tone="default" gap={3}>
				<SectionHeader title="الدعم المسموح بعد تثبيت المهمة" subtitle="التواصل والمالية والملف تبقى ثانوية بعد قرار التنفيذ الحالي." />
				<Box gap={2}>
					{SUPPORT_ITEMS.map((item) => (
						<ListItem
							key={item.id}
							title={item.title}
							subtitle={item.subtitle}
							meta="افتح أداة دعم مرتبطة بالمهمة الحالية فقط"
							badgeLabel={item.badgeLabel}
							onPress={() => onOpenScreen?.(item.id)}
						/>
					))}
				</Box>
			</Surface>

			<Surface tone="raised" gap={3}>
				<SectionHeader title="مسارات مساندة" subtitle="تظل هذه المسارات مرئية لكن خارج قلب التنفيذ حتى لا يضيع تركيز الكابتن." />
				<Box gap={2}>
					{SECONDARY_FLOW_ORDER.map((flowKey) => (
						<ListItem
							key={flowKey}
							title={dshCaptainFlowMap[flowKey].label}
							subtitle={FLOW_NODE_COPY[flowKey].subtitle}
							meta={resolveNextNodesLabel(flowKey)}
							badgeLabel={FLOW_NODE_COPY[flowKey].badgeLabel}
							onPress={() => onOpenScreen?.(resolveFlowNodeScreen(flowKey, ACTIVE_ORDER_PREVIEW.stage))}
						/>
					))}
				</Box>
			</Surface>
		</MobileScrollView>
	);
}
