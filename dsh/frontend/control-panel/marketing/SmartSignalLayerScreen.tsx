'use client';

import { Platform } from 'react-native';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
	Button,
	NewsTickerBar,
	Surface,
	Tabs,
	Text,
	TextField,
	useDirection,
	useUiText,
} from '@bthwani/ui-kit';
import { WebMissionHeroCard, WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from '../shared';
import {
	buildMarketingTickerPlan,
	createMarketingTickerDraft,
	getMarketingTickerItems,
	markMarketingTickerDisplayed,
	removeMarketingTickerItem,
	resolveMarketingTickerAudienceLabel,
	resolveMarketingTickerDeliveryLabel,
	resolveMarketingTickerPlanReasonLabel,
	resolveMarketingTickerPriorityLabel,
	resolveMarketingTickerPreviewForItem,
	resolveMarketingTickerSourceLabel,
	toggleMarketingTickerStatus,
	upsertMarketingTickerItem,
	type MarketingNewsTickerAudience,
	type MarketingNewsTickerDeliveryMode,
	type MarketingNewsTickerItem,
	type MarketingNewsTickerKind,
	type MarketingNewsTickerLocale,
	type MarketingNewsTickerPriority,
	type MarketingNewsTickerSeverity,
	type MarketingNewsTickerSource,
	type MarketingNewsTickerStatus,
} from './news-ticker-store';
import { dshPartnerIntakeItems } from '../partners/workflow';

export type ControlPanelDshMarketingScreenProps = {
	hubHref?: string;
	operationsHref?: string;
};

type MarketingTickerDraft = {
	message: string;
	kind: MarketingNewsTickerKind;
	severity: MarketingNewsTickerSeverity;
	status: MarketingNewsTickerStatus;
	source: MarketingNewsTickerSource;
	audience: MarketingNewsTickerAudience;
	deliveryMode: MarketingNewsTickerDeliveryMode;
	priority: MarketingNewsTickerPriority;
	openHour: string;
	closeHour: string;
	cooldownMinutes: string;
	repeatGapMinutes: string;
};

type SmartCopy = {
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	audienceFocusTitle: string;
	audienceFocusDescription: string;
	editorTitle: string;
	editorDescription: string;
	selectedLabel: string;
	messageLabel: string;
	messageHint: string;
	messageRequiredError: string;
	sourceLabel: string;
	audienceLabel: string;
	priorityLabel: string;
	deliveryLabel: string;
	statusLabel: string;
	openHourLabel: string;
	closeHourLabel: string;
	cooldownLabel: string;
	repeatGapLabel: string;
	saveAction: string;
	newDraftAction: string;
	publishAction: string;
	pauseAction: string;
	pinAction: string;
	autoAction: string;
	manualAction: string;
	markDisplayedAction: string;
	loadAction: string;
	deleteAction: string;
	smartPreviewTitle: string;
	smartPreviewDescription: string;
	planTitle: string;
	planDescription: string;
	automaticLaneTitle: string;
	manualLaneTitle: string;
	suppressedLaneTitle: string;
	totalLabel: string;
	automaticLabel: string;
	manualLabel: string;
	pinnedLabel: string;
	activeLabel: string;
	suppressedLabel: string;
	sourceOperations: string;
	sourceCustomer: string;
	sourceMarketing: string;
	sourceSystem: string;
	audienceAll: string;
	audienceClient: string;
	audienceOperations: string;
	priorityCritical: string;
	priorityHigh: string;
	priorityNormal: string;
	priorityLow: string;
	deliveryAuto: string;
	deliveryManual: string;
	deliveryPinned: string;
	noActiveLabel: string;
	reasonReady: string;
	reasonDuplicate: string;
	reasonCooldown: string;
	reasonOutsideWindow: string;
	reasonDraft: string;
	reasonAudience: string;
};

type PillTone = 'surfaceInset' | 'surfaceRaised' | 'infoSurface' | 'successSurface' | 'warningSurface' | 'dangerSurface' | 'brandSurface';

type ItemActionTone = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

type MarketingCategoryLane = {
	categoryLabel: string;
	pendingCount: number;
	publishedCount: number;
	items: ReadonlyArray<(typeof dshPartnerIntakeItems)[number]>;
};

const copyByLocale: Record<MarketingNewsTickerLocale, SmartCopy> = {
	ar: {
		heroEyebrow: 'مساعد الإشعارات الذكي',
		heroTitle: 'محرك إشعارات شامل وذكي',
		heroDescription: 'إشعارات العمليات والعميل والتسويق والنظام كلها تحت إدارة واحدة مع أولوية وتهدئة وعدم تكرار.',
		audienceFocusTitle: 'الجمهور النشط',
		audienceFocusDescription: 'اختر الجمهور الذي تريد أن ترى له الخطة الحالية.',
		editorTitle: 'ضبط العنصر',
		editorDescription: 'ادخل الرسالة، المصدر، الجمهور، الأولوية، وطريقة الإرسال لكل عنصر.',
		selectedLabel: 'العنصر المحدد',
		messageLabel: 'نص الرسالة',
		messageHint: 'اكتب رسالة قصيرة وواضحة ومباشرة.',
		messageRequiredError: 'نص الرسالة مطلوب.',
		sourceLabel: 'المصدر',
		audienceLabel: 'الجمهور',
		priorityLabel: 'الأولوية',
		deliveryLabel: 'طريقة الإرسال',
		statusLabel: 'الحالة',
		openHourLabel: 'بداية الظهور',
		closeHourLabel: 'نهاية الظهور',
		cooldownLabel: 'فترة التهدئة (دقيقة)',
		repeatGapLabel: 'فاصل التكرار (دقيقة)',
		saveAction: 'حفظ',
		newDraftAction: 'مسودة جديدة',
		publishAction: 'نشر',
		pauseAction: 'إيقاف',
		pinAction: 'تثبيت',
		autoAction: 'تلقائي',
		manualAction: 'يدوي',
		markDisplayedAction: 'سجّل أنه ظهر الآن',
		loadAction: 'تحميل',
		deleteAction: 'حذف',
		smartPreviewTitle: 'المعاينة الذكية الآن',
		smartPreviewDescription: 'هذه هي الرسالة التي يختارها المحرك الآن للجمهور النشط.',
		planTitle: 'خطة البث الذكي',
		planDescription: 'التلقائي يظهر أولًا، اليدوي محفوظ للمراجعة، والمكرر أو المبكر يُكتم.',
		automaticLaneTitle: 'المسار التلقائي',
		manualLaneTitle: 'المسار اليدوي',
		suppressedLaneTitle: 'المحتوى المكبوت',
		totalLabel: 'الإجمالي',
		automaticLabel: 'تلقائي',
		manualLabel: 'يدوي',
		pinnedLabel: 'مثبت',
		activeLabel: 'نشط الآن',
		suppressedLabel: 'مكبوت',
		sourceOperations: 'العمليات',
		sourceCustomer: 'العميل',
		sourceMarketing: 'التسويق',
		sourceSystem: 'النظام',
		audienceAll: 'الكل',
		audienceClient: 'العميل',
		audienceOperations: 'العمليات',
		priorityCritical: 'حرج',
		priorityHigh: 'عالي',
		priorityNormal: 'عادي',
		priorityLow: 'منخفض',
		deliveryAuto: 'تلقائي',
		deliveryManual: 'يدوي',
		deliveryPinned: 'مثبت',
		noActiveLabel: 'لا توجد رسالة نشطة الآن',
		reasonReady: 'جاهز',
		reasonDuplicate: 'مكرر',
		reasonCooldown: 'ضمن فترة التهدئة',
		reasonOutsideWindow: 'خارج نافذة العرض',
		reasonDraft: 'مسودة',
		reasonAudience: 'غير مناسب للجمهور',
	},
	en: {
		heroEyebrow: 'Smart notification assistant',
		heroTitle: 'A smart, broad notification engine',
		heroDescription: 'Operations, customer, marketing, and system notices are controlled in one place with priority, cooldowns, and deduping.',
		audienceFocusTitle: 'Active audience',
		audienceFocusDescription: 'Choose the audience for the current plan.',
		editorTitle: 'Item controls',
		editorDescription: 'Edit the message, source, audience, priority, and delivery mode for each item.',
		selectedLabel: 'Selected item',
		messageLabel: 'Message text',
		messageHint: 'Keep it short, clear, and actionable.',
		messageRequiredError: 'Message text is required.',
		sourceLabel: 'Source',
		audienceLabel: 'Audience',
		priorityLabel: 'Priority',
		deliveryLabel: 'Delivery mode',
		statusLabel: 'Status',
		openHourLabel: 'Start hour',
		closeHourLabel: 'End hour',
		cooldownLabel: 'Cooldown minutes',
		repeatGapLabel: 'Repeat gap minutes',
		saveAction: 'Save',
		newDraftAction: 'New draft',
		publishAction: 'Publish',
		pauseAction: 'Pause',
		pinAction: 'Pin',
		autoAction: 'Auto',
		manualAction: 'Manual',
		markDisplayedAction: 'Mark as shown now',
		loadAction: 'Load',
		deleteAction: 'Delete',
		smartPreviewTitle: 'Live smart preview',
		smartPreviewDescription: 'This is the message the engine would choose for the active audience right now.',
		planTitle: 'Smart delivery plan',
		planDescription: 'Automatic comes first, manual stays review-safe, and duplicates or early repeats are suppressed.',
		automaticLaneTitle: 'Automatic lane',
		manualLaneTitle: 'Manual lane',
		suppressedLaneTitle: 'Suppressed content',
		totalLabel: 'Total',
		automaticLabel: 'Automatic',
		manualLabel: 'Manual',
		pinnedLabel: 'Pinned',
		activeLabel: 'Active now',
		suppressedLabel: 'Suppressed',
		sourceOperations: 'Operations',
		sourceCustomer: 'Customer',
		sourceMarketing: 'Marketing',
		sourceSystem: 'System',
		audienceAll: 'All',
		audienceClient: 'Client',
		audienceOperations: 'Operations',
		priorityCritical: 'Critical',
		priorityHigh: 'High',
		priorityNormal: 'Normal',
		priorityLow: 'Low',
		deliveryAuto: 'Auto',
		deliveryManual: 'Manual',
		deliveryPinned: 'Pinned',
		noActiveLabel: 'No active message right now',
		reasonReady: 'Ready',
		reasonDuplicate: 'Duplicate',
		reasonCooldown: 'On cooldown',
		reasonOutsideWindow: 'Outside display window',
		reasonDraft: 'Draft',
		reasonAudience: 'Audience mismatch',
	},
};

function getCopy(locale: MarketingNewsTickerLocale) {
	return copyByLocale[locale];
}

function normalizeHour(value: string) {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) {
		return 0;
	}

	return Math.max(0, Math.min(23, Math.floor(parsed)));
}

function normalizeMinutes(value: string) {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) {
		return 0;
	}

	return Math.max(0, Math.floor(parsed));
}

function formatHour(value: number) {
	return `${String(Math.max(0, Math.min(23, Math.floor(value)))).padStart(2, '0')}:00`;
}

function buildDraftFromTicker(ticker: MarketingNewsTickerItem): MarketingTickerDraft {
	return {
		message: ticker.message,
		kind: ticker.kind,
		severity: ticker.severity,
		status: ticker.status,
		source: ticker.source,
		audience: ticker.audience,
		deliveryMode: ticker.deliveryMode,
		priority: ticker.priority,
		openHour: String(ticker.openHour).padStart(2, '0'),
		closeHour: String(ticker.closeHour).padStart(2, '0'),
		cooldownMinutes: String(ticker.cooldownMinutes),
		repeatGapMinutes: String(ticker.repeatGapMinutes),
	};
}

function createEmptyDraft(locale: MarketingNewsTickerLocale): MarketingTickerDraft {
	return {
		message: locale === 'en' ? 'New ticker message' : 'رسالة إشعار جديدة',
		kind: 'order',
		severity: 'info',
		status: 'draft',
		source: 'customer',
		audience: 'client',
		deliveryMode: 'manual',
		priority: 'normal',
		openHour: '08',
		closeHour: '23',
		cooldownMinutes: '30',
		repeatGapMinutes: '60',
	};
}

function resolveKindLabel(locale: MarketingNewsTickerLocale, kind: MarketingNewsTickerKind) {
	if (kind === 'order') {
		return locale === 'en' ? 'Order' : 'طلب';
	}

	if (kind === 'promo') {
		return locale === 'en' ? 'Promo' : 'ترويجي';
	}

	return locale === 'en' ? 'Platform' : 'المنصة';
}

function resolveBackgroundTone(kind: MarketingNewsTickerKind | MarketingNewsTickerSource | MarketingNewsTickerAudience | MarketingNewsTickerPriority | MarketingNewsTickerDeliveryMode | MarketingNewsTickerSeverity | MarketingNewsTickerStatus): PillTone {
	if (kind === 'system' || kind === 'danger' || kind === 'critical') {
		return 'dangerSurface';
	}

	if (kind === 'promo' || kind === 'marketing' || kind === 'high') {
		return 'brandSurface';
	}

	if (kind === 'success' || kind === 'pinned') {
		return 'successSurface';
	}

	if (kind === 'warning' || kind === 'manual') {
		return 'warningSurface';
	}

	return 'infoSurface';
}

function Pill({ label, tone }: { label: string; tone: PillTone }) {
	return (
		<Box paddingX={2} paddingY={1} radiusToken="pill" background={tone} border borderToken="hairline" borderTone="line">
			<Text role="caption">{label}</Text>
		</Box>
	);
}

function ItemActionButton({ label, tone = 'secondary', onPress }: { label: string; tone?: ItemActionTone; onPress: () => void }) {
	return <Button label={label} tone={tone} size="sm" fullWidth={false} onPress={onPress} />;
}

function laneLabel(item: MarketingNewsTickerItem, locale: MarketingNewsTickerLocale) {
	return `${resolveMarketingTickerSourceLabel(locale, item.source)} · ${resolveMarketingTickerAudienceLabel(locale, item.audience)} · ${resolveMarketingTickerPriorityLabel(locale, item.priority)} · ${resolveMarketingTickerDeliveryLabel(locale, item.deliveryMode)}`;
}

function resolveMarketingCategoryLanes(): ReadonlyArray<MarketingCategoryLane> {
	const grouped = new Map<string, Array<(typeof dshPartnerIntakeItems)[number]>>();

	dshPartnerIntakeItems
		.filter((item) => item.queue === 'marketing-review')
		.forEach((item) => {
			const currentItems = grouped.get(item.categoryLabel) ?? [];
			currentItems.push(item);
			grouped.set(item.categoryLabel, currentItems);
		});

	return [...grouped.entries()].map(([categoryLabel, items]) => ({
		categoryLabel,
		pendingCount: items.length,
		publishedCount: 0,
		items,
	}));
}

export function ControlPanelDshMarketingScreen({
	hubHref = '/operations',
	operationsHref = '/operations',
}: ControlPanelDshMarketingScreenProps) {
	const router = useRouter();
	const { language } = useDirection();
	const uiText = useUiText();
	const locale: MarketingNewsTickerLocale = String(language).toLowerCase().startsWith('en') ? 'en' : 'ar';
	const marketingCopy = uiText.controlPanel.marketing;
	const copy = getCopy(locale);

	const [tickers, setTickers] = React.useState<ReadonlyArray<MarketingNewsTickerItem>>(() => getMarketingTickerItems());
	const [selectedTickerId, setSelectedTickerId] = React.useState<string | null>(() => getMarketingTickerItems()[0]?.id ?? null);
	const [audienceFocus, setAudienceFocus] = React.useState<MarketingNewsTickerAudience>('client');
	const marketingCategoryLanes = React.useMemo(() => resolveMarketingCategoryLanes(), []);
	const [draft, setDraft] = React.useState<MarketingTickerDraft>(() => {
		const initialTicker = getMarketingTickerItems()[0];
		return initialTicker ? buildDraftFromTicker(initialTicker) : createEmptyDraft(locale);
	});
	const [validationError, setValidationError] = React.useState<string | null>(null);
	const [currentTime, setCurrentTime] = React.useState(() => new Date());

	React.useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);

		return () => clearInterval(timer);
	}, []);

	React.useEffect(() => {
		const selectedTicker = tickers.find((ticker) => ticker.id === selectedTickerId);
		if (!selectedTicker) {
			return;
		}

		setDraft(buildDraftFromTicker(selectedTicker));
		setValidationError(null);
	}, [selectedTickerId, tickers]);

	const smartPlan = React.useMemo(() => buildMarketingTickerPlan(currentTime, audienceFocus, tickers), [audienceFocus, currentTime, tickers]);
	const selectedTicker = React.useMemo(() => tickers.find((ticker) => ticker.id === selectedTickerId) ?? smartPlan.activeItem ?? null, [selectedTickerId, smartPlan.activeItem, tickers]);
	const selectedPreview = React.useMemo(() => (selectedTicker ? resolveMarketingTickerPreviewForItem(currentTime, selectedTicker, locale) : null), [currentTime, locale, selectedTicker]);
	const activePreview = React.useMemo(() => (smartPlan.activeItem ? resolveMarketingTickerPreviewForItem(currentTime, smartPlan.activeItem, locale) : null), [currentTime, locale, smartPlan.activeItem]);

	const counts = React.useMemo(() => {
		const published = tickers.filter((ticker) => ticker.status === 'published');
		return {
			total: tickers.length,
			automatic: published.filter((ticker) => ticker.deliveryMode === 'auto').length,
			manual: published.filter((ticker) => ticker.deliveryMode === 'manual').length,
			pinned: published.filter((ticker) => ticker.deliveryMode === 'pinned').length,
			active: smartPlan.activeItem ? 1 : 0,
			suppressed: smartPlan.suppressedCount,
		};
	}, [smartPlan.activeItem, smartPlan.suppressedCount, tickers]);

	function refreshTickers() {
		setTickers(getMarketingTickerItems());
	}

	function handleSelectTicker(ticker: MarketingNewsTickerItem) {
		setSelectedTickerId(ticker.id);
		setDraft(buildDraftFromTicker(ticker));
		setValidationError(null);
	}

	function handleCreateDraft() {
		const created = createMarketingTickerDraft();
		const saved = upsertMarketingTickerItem(created);
		refreshTickers();
		setSelectedTickerId(saved.id);
		setDraft(buildDraftFromTicker(saved));
		setValidationError(null);
	}

	function handleSaveTicker() {
		const normalizedMessage = draft.message.trim();
		if (!normalizedMessage) {
			setValidationError(copy.messageRequiredError);
			return;
		}

		const nextTicker = upsertMarketingTickerItem({
			...(selectedTicker ?? createMarketingTickerDraft()),
			message: normalizedMessage,
			kind: draft.kind,
			severity: draft.severity,
			status: draft.status,
			source: draft.source,
			audience: draft.audience,
			deliveryMode: draft.deliveryMode,
			priority: draft.priority,
			openHour: normalizeHour(draft.openHour),
			closeHour: normalizeHour(draft.closeHour),
			cooldownMinutes: normalizeMinutes(draft.cooldownMinutes),
			repeatGapMinutes: normalizeMinutes(draft.repeatGapMinutes),
		});

		refreshTickers();
		setSelectedTickerId(nextTicker.id);
		setDraft(buildDraftFromTicker(nextTicker));
		setValidationError(null);
	}

	function handleToggleTicker(ticker: MarketingNewsTickerItem) {
		const nextTicker = toggleMarketingTickerStatus(ticker.id);
		if (!nextTicker) {
			return;
		}

		refreshTickers();
		if (ticker.id === selectedTickerId) {
			setDraft(buildDraftFromTicker(nextTicker));
		}
	}

	function handleDeleteTicker(ticker: MarketingNewsTickerItem) {
		removeMarketingTickerItem(ticker.id);
		const nextTickers = getMarketingTickerItems();

		if (nextTickers.length === 0) {
			const fallback = upsertMarketingTickerItem(createMarketingTickerDraft());
			refreshTickers();
			setSelectedTickerId(fallback.id);
			setDraft(buildDraftFromTicker(fallback));
			setValidationError(null);
			return;
		}

		refreshTickers();
		const nextSelected = nextTickers[0];
		setSelectedTickerId(nextSelected.id);
		setDraft(buildDraftFromTicker(nextSelected));
		setValidationError(null);
	}

	function handleSetDeliveryMode(ticker: MarketingNewsTickerItem, deliveryMode: MarketingNewsTickerDeliveryMode) {
		const updated = upsertMarketingTickerItem({
			...ticker,
			deliveryMode,
		});
		refreshTickers();
		if (ticker.id === selectedTickerId) {
			setDraft(buildDraftFromTicker(updated));
		}
	}

	function handleMarkDisplayed(ticker: MarketingNewsTickerItem) {
		const updated = markMarketingTickerDisplayed(ticker.id, currentTime);
		if (!updated) {
			return;
		}

		refreshTickers();
		if (ticker.id === selectedTickerId) {
			setDraft(buildDraftFromTicker(updated));
		}
	}

	const audienceTabs = [
		{ value: 'client' as const, label: copy.audienceClient },
		{ value: 'operations' as const, label: copy.audienceOperations },
		{ value: 'all' as const, label: copy.audienceAll },
	] as const;

	const sourceTabs = [
		{ value: 'customer' as const, label: copy.sourceCustomer },
		{ value: 'operations' as const, label: copy.sourceOperations },
		{ value: 'marketing' as const, label: copy.sourceMarketing },
		{ value: 'system' as const, label: copy.sourceSystem },
	] as const;

	const priorityTabs = [
		{ value: 'critical' as const, label: copy.priorityCritical },
		{ value: 'high' as const, label: copy.priorityHigh },
		{ value: 'normal' as const, label: copy.priorityNormal },
		{ value: 'low' as const, label: copy.priorityLow },
	] as const;

	const deliveryTabs = [
		{ value: 'auto' as const, label: copy.deliveryAuto },
		{ value: 'manual' as const, label: copy.deliveryManual },
		{ value: 'pinned' as const, label: copy.deliveryPinned },
	] as const;

	const orderedAutomaticEntries = [...smartPlan.automaticEntries];
	const orderedManualEntries = [...smartPlan.manualEntries];
	const orderedSuppressedEntries = [...smartPlan.suppressedEntries];
	const primaryPreview = activePreview ?? selectedPreview;

	return (
		<Box gap={4}>
			<WebMissionHeroCard
				dense
				badges={[
					copy.heroEyebrow,
					resolveMarketingTickerAudienceLabel(locale, audienceFocus),
					primaryPreview?.statusLabel ?? copy.noActiveLabel,
				]}
				eyebrow={locale === 'en' ? 'Marketing signal command' : 'غرفة قيادة الإشارات الذكية'}
				title={locale === 'en' ? 'Smart-signal command center' : 'غرفة قيادة الإشارات الذكية'}
				metaItems={[
					`${copy.activeLabel}: ${primaryPreview?.statusLabel ?? copy.noActiveLabel}`,
					`${copy.automaticLabel}: ${counts.automatic}`,
					`${copy.suppressedLabel}: ${counts.suppressed}`,
				]}
				primaryAction={{ label: marketingCopy.openOperations, href: operationsHref }}
				secondaryAction={{ label: marketingCopy.openDashboard, href: hubHref }}
			/>


			<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
				<WebSignalCard title={copy.totalLabel} value={String(counts.total)} description={copy.planDescription} />
				<WebSignalCard title={copy.automaticLabel} value={String(counts.automatic)} description={copy.automaticLaneTitle} tone={counts.automatic > 0 ? 'best' : 'neutral'} />
				<WebSignalCard title={copy.manualLabel} value={String(counts.manual)} description={copy.manualLaneTitle} />
				<WebSignalCard title={copy.pinnedLabel} value={String(counts.pinned)} description={copy.smartPreviewTitle} />
			</Box>
			<WebSectionCard title={copy.audienceFocusTitle}>
				<Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
					<Surface tone="brand" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 300 }}>
						<Text role="titleSm" tone="inverse">{copy.smartPreviewTitle}</Text>
						<Tabs<MarketingNewsTickerAudience>
							items={audienceTabs}
							value={audienceFocus}
							onValueChange={setAudienceFocus}
							variant="pill"
							stretch
						/>
						<NewsTickerBar
							statusLabel={primaryPreview?.statusLabel ?? copy.noActiveLabel}
							message={primaryPreview?.message ?? (locale === 'en' ? 'No active message for this audience yet.' : 'لا توجد رسالة فعالة لهذا الجمهور حتى الآن.')}
							onPress={() => router.push(hubHref)}
						/>
						<Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
							<Pill label={`${copy.activeLabel}: ${counts.active}`} tone="successSurface" />
							<Pill label={`${copy.suppressedLabel}: ${counts.suppressed}`} tone="warningSurface" />
							<Pill label={`${copy.pinnedLabel}: ${counts.pinned}`} tone="brandSurface" />
						</Box>
					</Surface>

					<Surface tone="raised" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 320 }}>
						<Text role="titleSm">{locale === 'en' ? 'Category handoff lane' : 'مسار تسليم الفئات للتسويق'}</Text>
						<Box gap={2}>
							{marketingCategoryLanes.length > 0 ? marketingCategoryLanes.map((lane) => (
								<Box key={lane.categoryLabel} padding={3} gap={2} border radiusToken="xl" background="surfaceInset" borderTone="line">
									<Box layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
										<Text role="bodyStrong">{lane.categoryLabel}</Text>
										<Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
											<Pill label={`${locale === 'en' ? 'Review' : 'مراجعة'}: ${lane.pendingCount}`} tone="warningSurface" />
											<Pill label={`${locale === 'en' ? 'Published' : 'منشور'}: ${lane.publishedCount}`} tone="successSurface" />
										</Box>
									</Box>
									{lane.items.slice(0, 2).map((item) => (
										<Text key={item.id} role="bodySm" tone="muted">
											{item.storeName} · {item.ownerLabel}
										</Text>
									))}
								</Box>
							)) : (
								<Text role="bodySm" tone="muted">
									{locale === 'en' ? 'No partner-approved categories yet.' : 'لا توجد فئات جاهزة حتى الآن.'}
								</Text>
							)}
						</Box>
					</Surface>
				</Box>
			</WebSectionCard>

			<WebSectionCard title={copy.editorTitle}>
				<Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
					<Surface tone="raised" padding={4} gap={3} style={{ flexGrow: 1, minWidth: 340 }}>
						<Box gap={1}>
							<Text role="bodyStrong">{copy.selectedLabel}: {selectedTicker ? (locale === 'en' ? 'Live marketing message' : 'رسالة تسويقية نشطة') : '—'}</Text>
							<Text role="bodySm" tone="muted">
								{selectedTicker ? laneLabel(selectedTicker, locale) : copy.noActiveLabel}
							</Text>
						</Box>

						<TextField
							label={copy.messageLabel}
							value={draft.message}
							onChangeText={(value) => {
								setDraft((current) => ({ ...current, message: value }));
								setValidationError(null);
							}}
							placeholder={locale === 'en' ? 'Type a ticker message' : 'اكتب رسالة التنبيه'}
							multiline
							numberOfLines={4}
							error={validationError ?? undefined}
							hint={copy.messageHint}
						/>

						<Text role="label">{copy.statusLabel}</Text>
						<Tabs<MarketingNewsTickerStatus>
							items={[
								{ value: 'draft', label: locale === 'en' ? 'Draft' : 'مسودة' },
								{ value: 'published', label: locale === 'en' ? 'Published' : 'منشور' },
							]}
							value={draft.status}
							onValueChange={(status) => setDraft((current) => ({ ...current, status }))}
							variant="pill"
							stretch
						/>

						<Text role="label">{copy.sourceLabel}</Text>
						<Tabs<MarketingNewsTickerSource>
							items={sourceTabs}
							value={draft.source}
							onValueChange={(source) => setDraft((current) => ({ ...current, source }))}
							variant="pill"
							stretch
						/>

						<Text role="label">{copy.audienceLabel}</Text>
						<Tabs<MarketingNewsTickerAudience>
							items={audienceTabs}
							value={draft.audience}
							onValueChange={(audience) => setDraft((current) => ({ ...current, audience }))}
							variant="pill"
							stretch
						/>

						<Text role="label">{copy.priorityLabel}</Text>
						<Tabs<MarketingNewsTickerPriority>
							items={priorityTabs}
							value={draft.priority}
							onValueChange={(priority) => setDraft((current) => ({ ...current, priority }))}
							variant="pill"
							stretch
						/>

						<Text role="label">{copy.deliveryLabel}</Text>
						<Tabs<MarketingNewsTickerDeliveryMode>
							items={deliveryTabs}
							value={draft.deliveryMode}
							onValueChange={(deliveryMode) => setDraft((current) => ({ ...current, deliveryMode }))}
							variant="pill"
							stretch
						/>

						<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
							<TextField
								label={copy.openHourLabel}
								value={draft.openHour}
								onChangeText={(value) => setDraft((current) => ({ ...current, openHour: value }))}
								keyboardType="number-pad"
								placeholder="08"
								hint="00 - 23"
							/>
							<TextField
								label={copy.closeHourLabel}
								value={draft.closeHour}
								onChangeText={(value) => setDraft((current) => ({ ...current, closeHour: value }))}
								keyboardType="number-pad"
								placeholder="23"
								hint="00 - 23"
							/>
						</Box>

						<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
							<TextField
								label={copy.cooldownLabel}
								value={draft.cooldownMinutes}
								onChangeText={(value) => setDraft((current) => ({ ...current, cooldownMinutes: value }))}
								keyboardType="number-pad"
								placeholder="30"
							/>
							<TextField
								label={copy.repeatGapLabel}
								value={draft.repeatGapMinutes}
								onChangeText={(value) => setDraft((current) => ({ ...current, repeatGapMinutes: value }))}
								keyboardType="number-pad"
								placeholder="60"
							/>
						</Box>

						<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
							<Button label={copy.saveAction} onPress={handleSaveTicker} fullWidth={false} />
							<Button label={copy.newDraftAction} tone="secondary" onPress={handleCreateDraft} fullWidth={false} />
							<Button label={selectedTicker?.status === 'published' ? copy.pauseAction : copy.publishAction} tone={selectedTicker?.status === 'published' ? 'secondary' : 'success'} onPress={() => { if (selectedTicker) { handleToggleTicker(selectedTicker); } }} fullWidth={false} />
						</Box>
					</Surface>

					<Box gap={3} style={{ flexGrow: 1, minWidth: 300 }}>
						<Surface tone="brand" padding={4} gap={3}>
							<Text role="titleSm" tone="inverse">{copy.smartPreviewTitle}</Text>
							<Text role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>
								{primaryPreview ? `${primaryPreview.statusLabel} · ${primaryPreview.windowLabel}` : copy.noActiveLabel}
							</Text>
							<Text role="bodySm" tone="inverse" style={{ opacity: 0.88 }}>
								{primaryPreview?.message ?? (locale === 'en' ? 'No active signal at the moment.' : 'لا توجد إشارة نشطة حاليًا.')}
							</Text>
							<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
								<Button label={copy.markDisplayedAction} onPress={() => { if (smartPlan.activeItem) { handleMarkDisplayed(smartPlan.activeItem); } }} fullWidth={false} />
								<Button label={marketingCopy.openDashboard} tone="secondary" onPress={() => router.push(hubHref)} fullWidth={false} />
							</Box>
						</Surface>

						<Surface tone="inset" padding={4} gap={2}>
							<Text role="titleSm">{locale === 'en' ? 'Selection summary' : 'ملخص العنصر المحدد'}</Text>
							<Text role="bodySm" tone="muted">
								{selectedTicker ? laneLabel(selectedTicker, locale) : copy.noActiveLabel}
							</Text>
							<Text role="bodySm" tone="muted">
								{copy.reasonReady}: {smartPlan.activeEntry ? resolveMarketingTickerPlanReasonLabel(locale, smartPlan.activeEntry.reason) : copy.noActiveLabel}
							</Text>
						</Surface>
					</Box>
				</Box>
			</WebSectionCard>

			<WebSectionCard title={copy.planTitle}>
				<Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
					<Surface tone="raised" padding={4} gap={2} style={{ flexGrow: 1, minWidth: 300 }}>
						<Text role="titleSm">{copy.automaticLaneTitle}</Text>
						{orderedAutomaticEntries.length > 0 ? orderedAutomaticEntries.map((entry) => {
							const preview = resolveMarketingTickerPreviewForItem(currentTime, entry.item, locale);
							const isActive = entry.state === 'active';
							return (
								<Box key={entry.item.id} padding={3} gap={2} border radiusToken="xl" background={isActive ? 'brandSurface' : 'surfaceInset'} borderTone={isActive ? 'brand' : 'line'}>
									<Text role="bodyStrong">{entry.item.message}</Text>
									<Text role="bodySm" tone="muted">{resolveMarketingTickerAudienceLabel(locale, entry.item.audience)} · {preview.windowLabel}</Text>
									<Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
										<Pill label={resolveMarketingTickerPriorityLabel(locale, entry.item.priority)} tone={resolveBackgroundTone(entry.item.priority)} />
										<Pill label={resolveMarketingTickerDeliveryLabel(locale, entry.item.deliveryMode)} tone={resolveBackgroundTone(entry.item.deliveryMode)} />
									</Box>
									<ItemActionButton label={copy.loadAction} tone="secondary" onPress={() => handleSelectTicker(entry.item)} />
								</Box>
							);
						}) : <Text role="bodySm" tone="muted">{copy.noActiveLabel}</Text>}
					</Surface>

					<Surface tone="raised" padding={4} gap={2} style={{ flexGrow: 1, minWidth: 300 }}>
						<Text role="titleSm">{copy.manualLaneTitle}</Text>
						{orderedManualEntries.length > 0 ? orderedManualEntries.map((entry) => {
							const preview = resolveMarketingTickerPreviewForItem(currentTime, entry.item, locale);
							return (
								<Box key={entry.item.id} padding={3} gap={2} border radiusToken="xl" background="surfaceInset" borderTone="line">
									<Text role="bodyStrong">{entry.item.message}</Text>
									<Text role="bodySm" tone="muted">{resolveMarketingTickerAudienceLabel(locale, entry.item.audience)} · {preview.windowLabel}</Text>
									<Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
										<ItemActionButton label={copy.loadAction} tone="secondary" onPress={() => handleSelectTicker(entry.item)} />
										<ItemActionButton label={copy.publishAction} tone="success" onPress={() => handleToggleTicker(entry.item)} />
									</Box>
								</Box>
							);
						}) : <Text role="bodySm" tone="muted">{locale === 'en' ? 'No manual items yet.' : 'لا توجد عناصر يدوية حتى الآن.'}</Text>}
					</Surface>

					<Surface tone="inset" padding={4} gap={2} style={{ flexGrow: 1, minWidth: 280 }}>
						<Text role="titleSm">{copy.suppressedLaneTitle}</Text>
						{orderedSuppressedEntries.length > 0 ? orderedSuppressedEntries.map((entry) => (
							<Box key={entry.item.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised" borderTone="warning">
								<Text role="bodyStrong">{entry.item.message}</Text>
								<Text role="bodySm" tone="muted">{resolveMarketingTickerPlanReasonLabel(locale, entry.reason)}</Text>
							</Box>
						)) : <Text role="bodySm" tone="muted">{locale === 'en' ? 'Nothing is suppressed right now.' : 'لا يوجد محتوى مكبوت حاليًا.'}</Text>}
					</Surface>
				</Box>
			</WebSectionCard>
		</Box>
	);
}

export default ControlPanelDshMarketingScreen;
