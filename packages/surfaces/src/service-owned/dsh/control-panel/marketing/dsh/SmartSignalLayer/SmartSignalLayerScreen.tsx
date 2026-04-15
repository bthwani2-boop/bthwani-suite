'use client';

import { Platform } from 'react-native';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
	BthBox,
	BthButton,
	BthNewsTickerBar,
	BthTabs,
	BthText,
	BthTextField,
	useDirection,
	useUiText,
} from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard, BthWebSignalCard } from '@bthwani/ui-kit/web';
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
import { dshPartnerIntakeItems } from '../../../partners/dsh/workflow';

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
		<BthBox paddingX={2} paddingY={1} radiusToken="pill" background={tone} border borderToken="hairline" borderTone="line">
			<BthText role="caption">{label}</BthText>
		</BthBox>
	);
}

function ItemActionButton({ label, tone = 'secondary', onPress }: { label: string; tone?: ItemActionTone; onPress: () => void }) {
	return <BthButton label={label} tone={tone} size="sm" fullWidth={false} onPress={onPress} />;
}

function laneLabel(item: MarketingNewsTickerItem, locale: MarketingNewsTickerLocale) {
	return `${resolveMarketingTickerSourceLabel(locale, item.source)} · ${resolveMarketingTickerAudienceLabel(locale, item.audience)} · ${resolveMarketingTickerPriorityLabel(locale, item.priority)} · ${resolveMarketingTickerDeliveryLabel(locale, item.deliveryMode)}`;
}

function resolveMarketingCategoryLanes(): ReadonlyArray<MarketingCategoryLane> {
	const grouped = new Map<string, Array<(typeof dshPartnerIntakeItems)[number]>>();

	dshPartnerIntakeItems
		.filter((item) => item.stage === 'pending-marketing' || item.stage === 'published')
		.forEach((item) => {
			const currentItems = grouped.get(item.categoryLabel) ?? [];
			currentItems.push(item);
			grouped.set(item.categoryLabel, currentItems);
		});

	return [...grouped.entries()].map(([categoryLabel, items]) => ({
		categoryLabel,
	pendingCount: items.filter((item) => item.stage === 'pending-marketing').length,
		publishedCount: items.filter((item) => item.stage === 'published').length,
		items,
	}));
}

export function ControlPanelDshMarketingScreen({
	hubHref = '/operations/dsh',
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

	return (
		<BthBox gap={4}>
			<BthWebMissionHeroCard
				badges={[copy.heroEyebrow, resolveMarketingTickerAudienceLabel(locale, audienceFocus), activePreview?.statusLabel ?? copy.noActiveLabel]}
				eyebrow={copy.heroEyebrow}
				title={copy.heroTitle}
				description={copy.heroDescription}
				metaItems={[
					`${copy.activeLabel}: ${activePreview ? activePreview.statusLabel : copy.noActiveLabel}`,
					`${copy.automaticLabel}: ${counts.automatic}`,
					`${copy.manualLabel}: ${counts.manual}`,
				]}
				primaryAction={{ label: marketingCopy.openOperations, href: operationsHref }}
				secondaryAction={{ label: marketingCopy.openDashboard, href: hubHref }}
			/>

			<BthWebSectionCard title={copy.audienceFocusTitle} description={copy.audienceFocusDescription}>
				<BthBox gap={3}>
					<BthTabs<MarketingNewsTickerAudience>
						items={audienceTabs}
						value={audienceFocus}
						onValueChange={setAudienceFocus}
						variant="pill"
						stretch
					/>
					<BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
						<Pill label={`${copy.totalLabel}: ${counts.total}`} tone="surfaceInset" />
						<Pill label={`${copy.activeLabel}: ${counts.active}`} tone="successSurface" />
						<Pill label={`${copy.suppressedLabel}: ${counts.suppressed}`} tone="warningSurface" />
						<Pill label={`${copy.pinnedLabel}: ${counts.pinned}`} tone="brandSurface" />
					</BthBox>
				</BthBox>
			</BthWebSectionCard>

			<BthWebSectionCard
				title={locale === 'en' ? 'Category handoff lane' : 'مسار الفئات للتسويق'}
				description={locale === 'en' ? 'Approved partner items appear here before the catalog or client app.' : 'العناصر التي قبلها الشركاء تظهر هنا قبل الكتالوج أو تطبيق العميل.'}
			>
				<BthBox gap={3}>
					{marketingCategoryLanes.length > 0 ? marketingCategoryLanes.map((lane) => (
						<BthBox key={lane.categoryLabel} padding={3} gap={2} border radiusToken="xl" background="surfaceRaised" borderTone="line">
							<BthBox layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
								<BthBox gap={1} style={{ flexGrow: 1, minWidth: 0 }}>
									<BthText role="bodyStrong">{lane.categoryLabel}</BthText>
									<BthText role="bodySm" tone="muted">
										{locale === 'en'
											? `Ready for marketing: ${lane.pendingCount} · Published: ${lane.publishedCount}`
											: `جاهز للتسويق: ${lane.pendingCount} · منشور: ${lane.publishedCount}`}
									</BthText>
								</BthBox>
								<BthBox layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
									<Pill label={locale === 'en' ? 'Partner approved' : 'مقبول من الشركاء'} tone="successSurface" />
									<Pill label={locale === 'en' ? 'Before client app' : 'قبل تطبيق العميل'} tone="brandSurface" />
								</BthBox>
							</BthBox>
							<BthBox gap={2}>
								{lane.items.map((item) => (
									<BthBox key={item.id} padding={3} gap={1} border radiusToken="lg" background="surfaceInset">
										<BthBox layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
											<BthText role="bodyStrong">{item.productName}</BthText>
											<BthText role="caption" tone={item.stage === 'published' ? 'success' : 'warning'}>
												{item.stage === 'published'
													? (locale === 'en' ? 'Published' : 'منشور')
													: (locale === 'en' ? 'Marketing review' : 'مراجعة تسويقية')}
											</BthText>
										</BthBox>
										<BthText role="bodySm" tone="muted">
											{item.categoryLabel} · {item.ownerLabel} · {item.submittedAt}
										</BthText>
										<BthText role="bodySm" tone="muted">
											{item.note}
										</BthText>
									</BthBox>
								))}
							</BthBox>
						</BthBox>
					)) : (
						<BthText role="bodySm" tone="muted">
							{locale === 'en' ? 'No partner-approved categories yet.' : 'لا توجد فئات مقبولة من الشركاء حتى الآن.'}
						</BthText>
					)}
				</BthBox>
			</BthWebSectionCard>

			<BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
				<BthWebSignalCard title={copy.totalLabel} value={String(counts.total)} description={copy.planDescription} />
				<BthWebSignalCard title={copy.automaticLabel} value={String(counts.automatic)} description={copy.automaticLaneTitle} tone={counts.automatic > 0 ? 'best' : 'neutral'} />
				<BthWebSignalCard title={copy.manualLabel} value={String(counts.manual)} description={copy.manualLaneTitle} />
				<BthWebSignalCard title={copy.suppressedLabel} value={String(counts.suppressed)} description={copy.suppressedLaneTitle} />
			</BthBox>

			<BthWebSectionCard title={copy.editorTitle} description={copy.editorDescription}>
				<BthBox gap={4}>
					<BthBox layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
						<BthBox gap={3} style={{ flexGrow: 1, minWidth: 0 }}>
							<BthBox gap={1}>
								<BthText role="bodyStrong">{copy.selectedLabel}: {selectedTicker?.id ?? '—'}</BthText>
								<BthText role="bodySm" tone="muted">
									{selectedTicker ? laneLabel(selectedTicker, locale) : copy.noActiveLabel}
								</BthText>
								<BthText role="bodySm" tone="muted">
									{selectedPreview ? `${selectedPreview.statusLabel} · ${selectedPreview.windowLabel}` : copy.noActiveLabel}
								</BthText>
							</BthBox>

							<BthTextField
								label={copy.messageLabel}
								value={draft.message}
								onChangeText={(value) => {
									setDraft((current) => ({ ...current, message: value }));
									setValidationError(null);
								}}
								placeholder={locale === 'en' ? 'Type a ticker message' : 'اكتب رسالة الإشعار'}
								multiline
								numberOfLines={4}
								error={validationError ?? undefined}
								hint={copy.messageHint}
							/>

							<BthText role="label">{copy.statusLabel}</BthText>
							<BthTabs<MarketingNewsTickerStatus>
								items={[
									{ value: 'draft', label: locale === 'en' ? 'Draft' : 'مسودة' },
									{ value: 'published', label: locale === 'en' ? 'Published' : 'منشور' },
								]}
								value={draft.status}
								onValueChange={(status) => setDraft((current) => ({ ...current, status }))}
								variant="pill"
								stretch
							/>

							<BthText role="label">{copy.sourceLabel}</BthText>
							<BthTabs<MarketingNewsTickerSource>
								items={sourceTabs}
								value={draft.source}
								onValueChange={(source) => setDraft((current) => ({ ...current, source }))}
								variant="pill"
								stretch
							/>

							<BthText role="label">{copy.audienceLabel}</BthText>
							<BthTabs<MarketingNewsTickerAudience>
								items={audienceTabs}
								value={draft.audience}
								onValueChange={(audience) => setDraft((current) => ({ ...current, audience }))}
								variant="pill"
								stretch
							/>

							<BthText role="label">{copy.priorityLabel}</BthText>
							<BthTabs<MarketingNewsTickerPriority>
								items={priorityTabs}
								value={draft.priority}
								onValueChange={(priority) => setDraft((current) => ({ ...current, priority }))}
								variant="pill"
								stretch
							/>

							<BthText role="label">{copy.deliveryLabel}</BthText>
							<BthTabs<MarketingNewsTickerDeliveryMode>
								items={deliveryTabs}
								value={draft.deliveryMode}
								onValueChange={(deliveryMode) => setDraft((current) => ({ ...current, deliveryMode }))}
								variant="pill"
								stretch
							/>

							<BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
								<BthTextField
									label={copy.openHourLabel}
									value={draft.openHour}
									onChangeText={(value) => setDraft((current) => ({ ...current, openHour: value }))}
									keyboardType="number-pad"
									placeholder="08"
									hint="00 - 23"
								/>
								<BthTextField
									label={copy.closeHourLabel}
									value={draft.closeHour}
									onChangeText={(value) => setDraft((current) => ({ ...current, closeHour: value }))}
									keyboardType="number-pad"
									placeholder="23"
									hint="00 - 23"
								/>
							</BthBox>

							<BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
								<BthTextField
									label={copy.cooldownLabel}
									value={draft.cooldownMinutes}
									onChangeText={(value) => setDraft((current) => ({ ...current, cooldownMinutes: value }))}
									keyboardType="number-pad"
									placeholder="30"
									hint={locale === 'en' ? 'Prevent immediate repeats' : 'منع التكرار السريع'}
								/>
								<BthTextField
									label={copy.repeatGapLabel}
									value={draft.repeatGapMinutes}
									onChangeText={(value) => setDraft((current) => ({ ...current, repeatGapMinutes: value }))}
									keyboardType="number-pad"
									placeholder="60"
									hint={locale === 'en' ? 'Spacing between repeats' : 'المدة بين التكرارات'}
								/>
							</BthBox>

							<BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
								<BthButton label={copy.saveAction} onPress={handleSaveTicker} fullWidth={false} />
								<BthButton label={copy.newDraftAction} tone="secondary" onPress={handleCreateDraft} fullWidth={false} />
								<BthButton
									label={draft.deliveryMode === 'pinned' ? copy.pinAction : draft.deliveryMode === 'manual' ? copy.manualAction : copy.autoAction}
									tone="secondary"
									onPress={() => {
										if (selectedTicker) {
											handleSetDeliveryMode(selectedTicker, draft.deliveryMode);
										}
									}}
									fullWidth={false}
								/>
								<BthButton
									label={selectedTicker?.status === 'published' ? copy.pauseAction : copy.publishAction}
									tone={selectedTicker?.status === 'published' ? 'secondary' : 'success'}
									onPress={() => {
										if (selectedTicker) {
											handleToggleTicker(selectedTicker);
										}
									}}
									fullWidth={false}
								/>
							</BthBox>

							<BthText role="bodySm" tone="muted">
								{copy.messageHint}
							</BthText>
						</BthBox>

						<BthBox gap={3} style={{ flexGrow: 1, minWidth: 0 }}>
							<BthWebSectionCard title={copy.smartPreviewTitle} description={copy.smartPreviewDescription}>
								<BthBox gap={3}>
									<BthNewsTickerBar
										statusLabel={activePreview?.statusLabel ?? copy.noActiveLabel}
										message={activePreview?.message ?? (locale === 'en' ? 'No active message for this audience yet.' : 'لا توجد رسالة نشطة لهذا الجمهور حتى الآن.')}
										onPress={() => router.push(hubHref)}
									/>
									<BthText role="bodySm" tone="muted">
										{smartPlan.activeItem || selectedTicker ? `${copy.selectedLabel}: ${laneLabel((smartPlan.activeItem ?? selectedTicker) as MarketingNewsTickerItem, locale)}` : copy.noActiveLabel}
									</BthText>
									<BthText role="bodySm" tone="muted">
										{copy.reasonReady}: {smartPlan.activeEntry ? resolveMarketingTickerPlanReasonLabel(locale, smartPlan.activeEntry.reason) : copy.noActiveLabel}
									</BthText>
									<BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
										<BthButton label={copy.markDisplayedAction} onPress={() => { if (smartPlan.activeItem) { handleMarkDisplayed(smartPlan.activeItem); } }} fullWidth={false} />
										<BthButton label={marketingCopy.openDashboard} tone="secondary" onPress={() => router.push(hubHref)} fullWidth={false} />
										<BthButton label={marketingCopy.openOperations} tone="secondary" onPress={() => router.push(operationsHref)} fullWidth={false} />
									</BthBox>
								</BthBox>
							</BthWebSectionCard>
						</BthBox>
					</BthBox>
				</BthBox>
			</BthWebSectionCard>

			<BthWebSectionCard title={copy.planTitle} description={copy.planDescription}>
				<BthBox gap={4}>
					<BthBox gap={2}>
						<BthText role="bodyStrong">{copy.automaticLaneTitle}</BthText>
						<BthBox gap={2}>
							{orderedAutomaticEntries.length > 0 ? orderedAutomaticEntries.map((entry) => {
								const preview = resolveMarketingTickerPreviewForItem(currentTime, entry.item, locale);
								const isActive = entry.state === 'active';
								return (
									<BthBox
										key={entry.item.id}
										padding={3}
										gap={2}
										border
										radiusToken="xl"
										background={isActive ? 'brandSurface' : 'surfaceRaised'}
										borderTone={isActive ? 'brand' : 'line'}
									>
										<BthBox layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
											<BthBox gap={1} style={{ flexGrow: 1, minWidth: 0 }}>
												<BthText role="bodyStrong">{entry.item.message}</BthText>
												<BthText role="bodySm" tone="muted">
													{entry.item.id} · {preview.windowLabel}
												</BthText>
											</BthBox>
											<BthBox layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
												<Pill label={resolveMarketingTickerSourceLabel(locale, entry.item.source)} tone={resolveBackgroundTone(entry.item.source)} />
												<Pill label={resolveMarketingTickerAudienceLabel(locale, entry.item.audience)} tone={resolveBackgroundTone(entry.item.audience)} />
												<Pill label={resolveMarketingTickerPriorityLabel(locale, entry.item.priority)} tone={resolveBackgroundTone(entry.item.priority)} />
												<Pill label={resolveMarketingTickerDeliveryLabel(locale, entry.item.deliveryMode)} tone={resolveBackgroundTone(entry.item.deliveryMode)} />
											</BthBox>
										</BthBox>
										<BthText role="bodySm" tone="muted">
											{laneLabel(entry.item, locale)} · {entry.state === 'active' ? copy.activeLabel : copy.reasonReady}: {resolveMarketingTickerPlanReasonLabel(locale, entry.reason)}
										</BthText>
										<BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
											<ItemActionButton label={copy.loadAction} tone="secondary" onPress={() => handleSelectTicker(entry.item)} />
											<ItemActionButton label={copy.markDisplayedAction} tone="success" onPress={() => handleMarkDisplayed(entry.item)} />
											<ItemActionButton
												label={entry.item.deliveryMode === 'pinned' ? copy.pinAction : entry.item.deliveryMode === 'manual' ? copy.manualAction : copy.autoAction}
												tone="secondary"
												onPress={() => handleSetDeliveryMode(entry.item, entry.item.deliveryMode === 'pinned' ? 'auto' : entry.item.deliveryMode === 'auto' ? 'manual' : 'pinned')}
											/>
										</BthBox>
									</BthBox>
								);
							}) : (
								<BthText role="bodySm" tone="muted">
									{copy.noActiveLabel}
								</BthText>
							)}
						</BthBox>
					</BthBox>

					<BthBox gap={2}>
						<BthText role="bodyStrong">{copy.manualLaneTitle}</BthText>
						<BthBox gap={2}>
							{orderedManualEntries.length > 0 ? orderedManualEntries.map((entry) => {
								const preview = resolveMarketingTickerPreviewForItem(currentTime, entry.item, locale);
								return (
									<BthBox key={entry.item.id} padding={3} gap={2} border radiusToken="xl" background="surfaceRaised" borderTone="line">
										<BthBox layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
											<BthBox gap={1} style={{ flexGrow: 1, minWidth: 0 }}>
												<BthText role="bodyStrong">{entry.item.message}</BthText>
												<BthText role="bodySm" tone="muted">
													{entry.item.id} · {preview.windowLabel}
												</BthText>
											</BthBox>
											<BthBox layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
												<Pill label={resolveMarketingTickerSourceLabel(locale, entry.item.source)} tone={resolveBackgroundTone(entry.item.source)} />
												<Pill label={resolveMarketingTickerAudienceLabel(locale, entry.item.audience)} tone={resolveBackgroundTone(entry.item.audience)} />
												<Pill label={resolveMarketingTickerPriorityLabel(locale, entry.item.priority)} tone={resolveBackgroundTone(entry.item.priority)} />
											</BthBox>
										</BthBox>
										<BthText role="bodySm" tone="muted">
											{copy.reasonReady}: {resolveMarketingTickerPlanReasonLabel(locale, entry.reason)}
										</BthText>
										<BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
											<ItemActionButton label={copy.loadAction} tone="secondary" onPress={() => handleSelectTicker(entry.item)} />
											<ItemActionButton label={copy.publishAction} tone="success" onPress={() => handleToggleTicker(entry.item)} />
											<ItemActionButton label={copy.deleteAction} tone="danger" onPress={() => handleDeleteTicker(entry.item)} />
										</BthBox>
									</BthBox>
								);
							}) : (
								<BthText role="bodySm" tone="muted">
									{locale === 'en' ? 'No manual items yet.' : 'لا توجد عناصر يدوية حتى الآن.'}
								</BthText>
							)}
						</BthBox>
					</BthBox>

					<BthBox gap={2}>
						<BthText role="bodyStrong">{copy.suppressedLaneTitle}</BthText>
						<BthBox gap={2}>
							{orderedSuppressedEntries.length > 0 ? orderedSuppressedEntries.map((entry) => (
								<BthBox key={entry.item.id} padding={3} gap={1} border radiusToken="xl" background="surfaceInset" borderTone="warning">
									<BthText role="bodyStrong">{entry.item.message}</BthText>
									<BthText role="bodySm" tone="muted">
										{entry.item.id} · {resolveMarketingTickerPlanReasonLabel(locale, entry.reason)}
									</BthText>
									<BthText role="bodySm" tone="muted">
										{laneLabel(entry.item, locale)}
									</BthText>
								</BthBox>
							)) : (
								<BthText role="bodySm" tone="muted">
									{locale === 'en' ? 'Nothing is being suppressed right now.' : 'لا يوجد محتوى مكبوت حاليًا.'}
								</BthText>
							)}
						</BthBox>
					</BthBox>
				</BthBox>
			</BthWebSectionCard>
		</BthBox>
	);
}

export default ControlPanelDshMarketingScreen;