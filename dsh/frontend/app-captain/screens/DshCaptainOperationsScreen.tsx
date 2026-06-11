import React from 'react';
import { Pressable, View } from 'react-native';
import { Badge, Box, Button, Divider, KeyValueList, MobileScrollView, Text, TextField, useTheme,
  spacing,
} from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshCaptainOrderStage } from '../../shared/dsh-order-preview.contract';
import type { DshCaptainProfileSnapshot } from '../../shared/client-state';
import { getOperationsSupportFlowsForSurface, type DshOperationsSupportFlowId } from '../../shared/support-flows';
import { type DshCaptainRegistryFlowId } from '../contracts/dshCaptainBinding.contracts';



export type CaptainSupportScreenId =
	| 'chat-read-ack'
	| 'chat-send'
	| 'cod-liability'
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
	const { theme } = useTheme();

	return (
		<DshOperationScreen
			title={title}
			subtitle={subtitle}
			content={
				<Box gap={4}>
					<Box gap={2}>
						<Text role="bodyStrong">{heroTitle}</Text>
						<Text role="bodySm" tone="muted">{heroDescription}</Text>
					</Box>

					{keyValues?.length ? (
						<>
							<Divider />
							<KeyValueList items={keyValues} />
						</>
					) : null}

					{listItems?.length ? (
						<>
							<Divider />
							<Box padding={0} gap={0}>
								{listItems.map((item, index, arr) => (
									<View
										key={`${title}-${item.title}`}
										style={{
											paddingHorizontal: 0,
											paddingVertical: spacing[3],
											borderBottomWidth: index === arr.length - 1 ? 0 : 1,
											borderBottomColor: theme.line,
											gap: spacing[1],
										}}
									>
										<Box layoutDirection="row" justify="space-between" align="center" style={{ flexDirection: 'row-reverse' }}>
											<Text role="bodyStrong" style={{ textAlign: 'right' }}>{item.title}</Text>
											{item.badgeLabel ? <Badge label={item.badgeLabel} tone="brand" /> : null}
										</Box>
										<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{item.subtitle}</Text>
										<Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{item.meta}</Text>
									</View>
								))}
							</Box>
						</>
					) : null}

					{inputLabel ? (
						<>
							<Divider />
							<TextField label={inputLabel} value={draftValue} onChangeText={setDraftValue} hint={inputHint} />
						</>
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

const EXECUTION_ITEMS: ReadonlyArray<{ id: CaptainSupportScreenId; title: string; subtitle: string; badgeLabel: string }> = [
	{ id: 'orders-offers-list', title: 'مراجعة عروض الطلبات', subtitle: 'ابدأ من أول عرض مفتوح قبل الالتزام بمهمة جديدة.', badgeLabel: 'عروض' },
	{ id: 'orders-list', title: 'الصف النشط', subtitle: 'أبقِ الطلبات المفتوحة في صف واحد واضح.', badgeLabel: 'صف' },
	{ id: 'order-get', title: 'لقطة الطلب', subtitle: 'افتح تفاصيل الرحلة الحالية من دون مغادرة المسار.', badgeLabel: 'قراءة' },
	{ id: 'order-pickup', title: 'تأكيد الاستلام', subtitle: 'نفّذ خطوة الاستلام عند الوصول إلى الفرع.', badgeLabel: 'استلام' },
	{ id: 'order-deliver', title: 'تأكيد التسليم', subtitle: 'أغلق الرحلة الحالية بعد الوصول للعميل.', badgeLabel: 'تسليم' },
	{ id: 'proof-upload', title: 'رفع الإثبات', subtitle: 'اختم المهمة برفع دليل التسليم المختصر.', badgeLabel: 'إثبات' },
];

const captainSupportFlowToScreenId: Partial<Record<DshOperationsSupportFlowId, CaptainSupportScreenId>> = {
	'courier-not-arrived': 'order-pickup',
	'customer-not-responding': 'chat-send',
	'handoff-mismatch': 'order-pickup',
	'delivery-failed': 'order-deliver',
	'proof-of-delivery': 'proof-upload',
	'store-wait-time': 'order-pickup',
};

const captainSupportFlowToRegistryFlowId: Partial<Record<DshOperationsSupportFlowId, DshCaptainRegistryFlowId>> = {
	'courier-not-arrived': 'captain-order-pickup',
	'customer-not-responding': 'captain-map-navigation',
	'handoff-mismatch': 'captain-order-pickup',
	'delivery-failed': 'captain-map-navigation',
	'proof-of-delivery': 'captain-proof-of-delivery',
	'store-wait-time': 'captain-order-pickup',
};

const CAPTAIN_OPERATIONAL_SUPPORT_ITEMS = getOperationsSupportFlowsForSurface('app-captain').map((flow) => ({
	flowId: flow.flowId,
	title: flow.title,
	subtitle: flow.description,
	badgeLabel: flow.severity === 'danger' ? 'حرج' : flow.severity === 'warning' ? 'يتطلب قرارًا' : 'متابعة',
	screenId: captainSupportFlowToScreenId[flow.flowId] ?? 'orders-list',
}));

function resolvePrimaryActionScreen(stage: DshCaptainOrderStage): CaptainSupportScreenId {
	if (stage === 'offer') return 'order-accept';
	if (stage === 'accepted' || stage === 'pickup') return 'order-pickup';
	if (stage === 'delivery') return 'order-deliver';
	if (stage === 'proof' || stage === 'closed') return 'proof-upload';
	return 'orders-list';
}

function resolvePrimaryActionLabel(stage: DshCaptainOrderStage) {
	if (stage === 'offer') return 'فتح القبول';
	if (stage === 'accepted' || stage === 'pickup') return 'فتح الاستلام';
	if (stage === 'delivery') return 'فتح التسليم';
	if (stage === 'proof' || stage === 'closed') return 'فتح الإثبات';
	return 'فتح الصف النشط';
}

// ─── Flat row — no cards, no elevation, just borderBottom ─────────────────────
function FlatRow({
	title,
	subtitle,
	meta,
	badgeLabel,
	badgeTone = 'brand',
	isLast = false,
	onPress,
}: {
	title: string;
	subtitle?: string;
	meta?: string;
	badgeLabel?: string;
	badgeTone?: React.ComponentProps<typeof Badge>['tone'];
	isLast?: boolean;
	onPress?: () => void;
}) {
	const { theme } = useTheme();

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={title}
			onPress={onPress}
			style={({ pressed }) => ({
				flexDirection: 'row-reverse',
				alignItems: 'flex-start',
				justifyContent: 'space-between',
				paddingVertical: 14,
				backgroundColor: pressed ? theme.surfaceInset : theme.surface,
				borderBottomWidth: isLast ? 0 : 1,
				borderBottomColor: theme.line,
				gap: spacing[3],
			})}
		>
			<View style={{ flex: 1, gap: 3, alignItems: 'flex-end' }}>
				<Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={2}>{title}</Text>
				{subtitle ? <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={2}>{subtitle}</Text> : null}
				{meta ? <Text role="caption" tone="muted" style={{ textAlign: 'right' }} numberOfLines={2}>{meta}</Text> : null}
			</View>
			{badgeLabel ? (
				<View style={{ paddingTop: 2, flexShrink: 0 }}>
					<Badge label={badgeLabel} tone={badgeTone} />
				</View>
			) : null}
		</Pressable>
	);
}

// ─── Section group — label + flat rows, no cards ──────────────────────────────
function FlatSection({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	const { theme } = useTheme();
	return (
		<Box padding={0} gap={0}>
			<Text
				role="label"
				tone="muted"
				style={{ paddingBottom: spacing[2], textAlign: 'right', color: theme.textMuted }}
			>
				{label}
			</Text>
			{children}
		</Box>
	);
}

export function DshCaptainSupportDirectoryScreen({ onOpenScreen }: { onOpenScreen?: (screenId: CaptainSupportScreenId) => void }) {
	const { theme } = useTheme();
	const currentActionScreenId = resolvePrimaryActionScreen(ACTIVE_ORDER_PREVIEW.stage);

	return (
		<MobileScrollView padding={4} gap={6} contentContainerStyle={{ paddingBottom: spacing[10] }}>

			{/* ─── Active mission summary ──────────────────────────────── */}
			<Box gap={3}>
				<Box gap={1}>
					<Text role="bodyStrong" style={{ textAlign: 'right' }}>
						{CAPTAIN_PROFILE_PREVIEW.displayName} · {CAPTAIN_PROFILE_PREVIEW.tierLabel}
					</Text>
					<Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
						{CAPTAIN_PROFILE_PREVIEW.readinessLabel}
					</Text>
				</Box>
				<KeyValueList
					items={[
						{ label: 'الاستلام', value: ACTIVE_ORDER_PREVIEW.pickupLabel },
						{ label: 'التسليم', value: ACTIVE_ORDER_PREVIEW.dropoffLabel },
						{ label: 'ETA', value: ACTIVE_ORDER_PREVIEW.etaLabel, tone: 'info' },
						{ label: 'المرحلة', value: ACTIVE_ORDER_PREVIEW.currentStageLabel, tone: 'brand' },
					]}
				/>
				<Box gap={2}>
					<Button label={resolvePrimaryActionLabel(ACTIVE_ORDER_PREVIEW.stage)} onPress={() => onOpenScreen?.(currentActionScreenId)} />
					<Button label="لقطة الطلب" tone="secondary" onPress={() => onOpenScreen?.('order-get')} />
				</Box>
			</Box>

			<Divider />

			{/* ─── خطوات التنفيذ الفوري ──────────────────────────────── */}
			<FlatSection label="خطوات التنفيذ الفوري">
				{EXECUTION_ITEMS.map((item, index, arr) => (
					<FlatRow
						key={item.id}
						title={item.title}
						subtitle={item.subtitle}
						badgeLabel={item.badgeLabel}
						isLast={index === arr.length - 1}
						onPress={() => onOpenScreen?.(item.id)}
					/>
				))}
			</FlatSection>

			<Divider />

			{/* ─── مشاكل شائعة في الميدان ──────────────────────────────── */}
			<FlatSection label="مشاكل شائعة">
				{CAPTAIN_OPERATIONAL_SUPPORT_ITEMS.map((item, index, arr) => (
					<FlatRow
						key={item.flowId}
						title={item.title}
						subtitle={item.subtitle}
						badgeLabel={item.badgeLabel}
						badgeTone={item.badgeLabel === 'حرج' ? 'danger' : item.badgeLabel === 'يتطلب قرارًا' ? 'warning' : 'default'}
						isLast={index === arr.length - 1}
						onPress={() => onOpenScreen?.(item.screenId)}
					/>
				))}
			</FlatSection>

		</MobileScrollView>
	);
}
