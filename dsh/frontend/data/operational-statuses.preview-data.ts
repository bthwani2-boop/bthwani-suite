// -----------------------------------------------------------------------------
// Client operational states
// -----------------------------------------------------------------------------
export type DshClientState =
	| 'quote'
	| 'serviceability'
	| 'store_open'
	| 'store_closed'
	| 'area_unserviceable'
	| 'item_unavailable'
	| 'cart_empty'
	| 'cart_ready'
	| 'checkout_ready'
	| 'payment_pending'
	| 'payment_failed'
	| 'order_created'
	| 'order_confirmed'
	| 'tracking_active'
	| 'delivered'
	| 'cancelled'
	| 'failed'
	| 'refund_pending'
	| 'refunded'
	| 'support_required'
	| 'wallet_credit_visible'
	| 'wallet_refund_visible';

export type DshClientStateGroup =
	| 'quote'
	| 'serviceability'
	| 'store'
	| 'cart'
	| 'checkout'
	| 'payment'
	| 'order'
	| 'tracking'
	| 'completion'
	| 'exception'
	| 'wallet'
	| 'support';

export type DshClientStateVisibility = {
	quoteVisible: boolean;
	serviceabilityVisible: boolean;
	storeStatusVisible: boolean;
	cartVisible: boolean;
	checkoutVisible: boolean;
	trackingVisible: boolean;
	supportVisible: boolean;
	walletCreditVisible: boolean;
	walletRefundVisible: boolean;
};

export type DshClientStateMeta = {
	state: DshClientState;
	group: DshClientStateGroup;
	label: string;
	title: string;
	description: string;
	visibility: DshClientStateVisibility;
	isTerminal: boolean;
	isException: boolean;
	walletVisible: boolean;
};

const hiddenVisibility: DshClientStateVisibility = {
	quoteVisible: false,
	serviceabilityVisible: false,
	storeStatusVisible: false,
	cartVisible: false,
	checkoutVisible: false,
	trackingVisible: false,
	supportVisible: false,
	walletCreditVisible: false,
	walletRefundVisible: false,
};

const clientStateMeta: Record<DshClientState, DshClientStateMeta> = {
	quote: {
		state: 'quote',
		group: 'quote',
		label: 'تجهيز التسعير',
		title: 'تجهيز التسعير',
		description: 'يتم التحقق من الرسوم والوقت المتوقع وأثر العروض قبل متابعة الدفع.',
		visibility: {
			...hiddenVisibility,
			quoteVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	serviceability: {
		state: 'serviceability',
		group: 'serviceability',
		label: 'فحص قابلية التوصيل',
		title: 'فحص قابلية التوصيل',
		description: 'يتم التأكد من أن عنوان العميل داخل نطاق الخدمة قبل المتابعة.',
		visibility: {
			...hiddenVisibility,
			serviceabilityVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	store_open: {
		state: 'store_open',
		group: 'store',
		label: 'المتجر متاح',
		title: 'المتجر متاح',
		description: 'المتجر يستقبل الطلبات ويمكن للعميل المتابعة إلى السلة والدفع.',
		visibility: {
			...hiddenVisibility,
			storeStatusVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	store_closed: {
		state: 'store_closed',
		group: 'store',
		label: 'المتجر غير متاح',
		title: 'المتجر غير متاح',
		description: 'المتجر لا يستقبل الطلبات الآن ويجب إظهار بديل أو مسار دعم واضح.',
		visibility: {
			...hiddenVisibility,
			storeStatusVisible: true,
			supportVisible: true,
		},
		isTerminal: false,
		isException: true,
		walletVisible: false,
	},
	area_unserviceable: {
		state: 'area_unserviceable',
		group: 'serviceability',
		label: 'العنوان خارج التغطية',
		title: 'العنوان خارج التغطية',
		description: 'الوجهة الحالية خارج نطاق الخدمة ويجب تعديل العنوان أو اختيار بديل.',
		visibility: {
			...hiddenVisibility,
			serviceabilityVisible: true,
			supportVisible: true,
		},
		isTerminal: false,
		isException: true,
		walletVisible: false,
	},
	item_unavailable: {
		state: 'item_unavailable',
		group: 'exception',
		label: 'العناصر غير متاحة',
		title: 'العناصر غير متاحة',
		description: 'بعض العناصر المطلوبة غير متاحة الآن ويجب إظهار بديل واضح أو إعادة ضبط السلة قبل المتابعة.',
		visibility: {
			...hiddenVisibility,
			cartVisible: true,
			checkoutVisible: true,
			supportVisible: true,
		},
		isTerminal: false,
		isException: true,
		walletVisible: false,
	},
	cart_empty: {
		state: 'cart_empty',
		group: 'cart',
		label: 'السلة فارغة',
		title: 'السلة فارغة',
		description: 'أضف منتجًا واحدًا على الأقل قبل متابعة الدفع.',
		visibility: {
			...hiddenVisibility,
			cartVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	cart_ready: {
		state: 'cart_ready',
		group: 'cart',
		label: 'السلة جاهزة',
		title: 'السلة جاهزة',
		description: 'السلة تحتوي عناصر ويمكن للعميل مراجعتها قبل الدفع.',
		visibility: {
			...hiddenVisibility,
			cartVisible: true,
			checkoutVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	checkout_ready: {
		state: 'checkout_ready',
		group: 'checkout',
		label: 'الدفع جاهز',
		title: 'الدفع جاهز',
		description: 'بيانات العنوان والرسوم وطريقة الدفع جاهزة للمراجعة النهائية.',
		visibility: {
			...hiddenVisibility,
			cartVisible: true,
			checkoutVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	payment_pending: {
		state: 'payment_pending',
		group: 'payment',
		label: 'الدفع قيد المعالجة',
		title: 'الدفع قيد المعالجة',
		description: 'يتم التحقق من قرار الدفع قبل إنشاء الطلب النهائي.',
		visibility: {
			...hiddenVisibility,
			checkoutVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	payment_failed: {
		state: 'payment_failed',
		group: 'payment',
		label: 'فشل الدفع',
		title: 'فشل الدفع',
		description: 'تعذر تثبيت قرار الدفع ويجب توضيح سبب الفشل مع إبقاء مسار المراجعة والدعم واضحًا.',
		visibility: {
			...hiddenVisibility,
			checkoutVisible: true,
			supportVisible: true,
		},
		isTerminal: false,
		isException: true,
		walletVisible: false,
	},
	order_created: {
		state: 'order_created',
		group: 'order',
		label: 'تم إنشاء الطلب',
		title: 'تم إنشاء الطلب',
		description: 'تم إنشاء الطلب وهو بانتظار التأكيد التشغيلي.',
		visibility: {
			...hiddenVisibility,
			checkoutVisible: true,
			trackingVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	order_confirmed: {
		state: 'order_confirmed',
		group: 'order',
		label: 'تم تأكيد الطلب',
		title: 'تم تأكيد الطلب',
		description: 'تم قبول الطلب ويمكن متابعة حالته من صفحة التتبع.',
		visibility: {
			...hiddenVisibility,
			trackingVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	tracking_active: {
		state: 'tracking_active',
		group: 'tracking',
		label: 'التتبع نشط',
		title: 'التتبع نشط',
		description: 'الطلب قيد التنفيذ ويمكن للعميل متابعة الحالة والوقت المتوقع والدعم.',
		visibility: {
			...hiddenVisibility,
			trackingVisible: true,
			supportVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: false,
	},
	delivered: {
		state: 'delivered',
		group: 'completion',
		label: 'تم التسليم',
		title: 'تم التسليم',
		description: 'وصل الطلب للعميل ويمكنه تقييم التجربة أو طلب الدعم عند الحاجة.',
		visibility: {
			...hiddenVisibility,
			trackingVisible: true,
		},
		isTerminal: true,
		isException: false,
		walletVisible: false,
	},
	cancelled: {
		state: 'cancelled',
		group: 'exception',
		label: 'تم إلغاء الطلب',
		title: 'تم إلغاء الطلب',
		description: 'تم إلغاء الطلب ويجب توضيح السبب وحالة أي استرداد للعميل.',
		visibility: {
			...hiddenVisibility,
			supportVisible: true,
			walletRefundVisible: true,
		},
		isTerminal: true,
		isException: true,
		walletVisible: true,
	},
	failed: {
		state: 'failed',
		group: 'exception',
		label: 'فشل تنفيذ الطلب',
		title: 'فشل تنفيذ الطلب',
		description: 'تعذر تنفيذ الطلب ويجب إظهار مسار تعافٍ أو دعم واضح للعميل.',
		visibility: {
			...hiddenVisibility,
			supportVisible: true,
			walletRefundVisible: true,
		},
		isTerminal: true,
		isException: true,
		walletVisible: true,
	},
	refund_pending: {
		state: 'refund_pending',
		group: 'wallet',
		label: 'الاسترداد قيد المعالجة',
		title: 'الاسترداد قيد المعالجة',
		description: 'يوجد استرداد قيد المعالجة ويجب إظهار حالته المالية للعميل.',
		visibility: {
			...hiddenVisibility,
			supportVisible: true,
			walletRefundVisible: true,
		},
		isTerminal: false,
		isException: true,
		walletVisible: true,
	},
	refunded: {
		state: 'refunded',
		group: 'wallet',
		label: 'تم الاسترداد',
		title: 'تم الاسترداد',
		description: 'اكتملت عملية الاسترداد ويمكن عرض الأثر المالي النهائي للعميل.',
		visibility: {
			...hiddenVisibility,
			walletRefundVisible: true,
		},
		isTerminal: true,
		isException: false,
		walletVisible: true,
	},
	support_required: {
		state: 'support_required',
		group: 'support',
		label: 'الدعم مطلوب',
		title: 'الدعم مطلوب',
		description: 'لا يمكن المتابعة بأمان بدون تدخل الدعم أو توضيح سبب المشكلة.',
		visibility: {
			...hiddenVisibility,
			supportVisible: true,
		},
		isTerminal: false,
		isException: true,
		walletVisible: false,
	},
	wallet_credit_visible: {
		state: 'wallet_credit_visible',
		group: 'wallet',
		label: 'رصيد المحفظة ظاهر',
		title: 'رصيد المحفظة ظاهر',
		description: 'يوجد رصيد أو تعويض ظاهر للعميل داخل المحفظة.',
		visibility: {
			...hiddenVisibility,
			walletCreditVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: true,
	},
	wallet_refund_visible: {
		state: 'wallet_refund_visible',
		group: 'wallet',
		label: 'استرداد المحفظة ظاهر',
		title: 'استرداد المحفظة ظاهر',
		description: 'تظهر معلومات الاسترداد المرتبطة بالمحفظة ضمن مسار العميل.',
		visibility: {
			...hiddenVisibility,
			walletRefundVisible: true,
		},
		isTerminal: false,
		isException: false,
		walletVisible: true,
	},
};

export function getDshClientStateMeta(state: DshClientState): DshClientStateMeta {
	return clientStateMeta[state];
}

export function isDshClientTerminalState(state: DshClientState): boolean {
	return clientStateMeta[state].isTerminal;
}

export function isDshClientExceptionState(state: DshClientState): boolean {
	return clientStateMeta[state].isException;
}

export function isDshClientWalletVisibleState(state: DshClientState): boolean {
	return clientStateMeta[state].walletVisible;
}

// -----------------------------------------------------------------------------
// Captain operational states
// -----------------------------------------------------------------------------
export type DshCaptainState =
	| 'entry'
	| 'orders'
	| 'finance'
	| 'profile'
	| 'operations'
	| 'order-accept'
	| 'order-offer-reject'
	| 'order-pickup'
	| 'order-deliver'
	| 'proof-upload'
	| 'cod-liability'
	| 'profile-get'
	| 'tier-info'
	| 'tier-evaluate'
	| 'terminal';

export type DshCaptainStateGroup = 'entry' | 'orders' | 'finance' | 'profile' | 'operations' | 'terminal';

export type DshCaptainStateMeta = {
	id: DshCaptainState;
	label: string;
	description: string;
	group: DshCaptainStateGroup;
	terminal: boolean;
};

const stateMetaMap: Record<DshCaptainState, DshCaptainStateMeta> = {
	entry: { id: 'entry', label: 'مدخل الكابتن', description: 'نقطة البداية المختصرة.', group: 'entry', terminal: false },
	orders: { id: 'orders', label: 'الطلبات', description: 'مسار الطلبات الأساسي.', group: 'orders', terminal: false },
	finance: { id: 'finance', label: 'المالية', description: 'سطح الرصيد والتسوية.', group: 'finance', terminal: false },
	profile: { id: 'profile', label: 'الملف', description: 'ملف الكابتن ومعلومات الطبقة.', group: 'profile', terminal: false },
	operations: { id: 'operations', label: 'التشغيل', description: 'الجاهزية والمسار والسلامة.', group: 'operations', terminal: false },
	'order-accept': { id: 'order-accept', label: 'قبول الطلب', description: 'حالة قبول العرض.', group: 'orders', terminal: false },
	'order-offer-reject': { id: 'order-offer-reject', label: 'رفض العرض', description: 'حالة رفض عرض الطلب.', group: 'orders', terminal: false },
	'order-pickup': { id: 'order-pickup', label: 'الاستلام', description: 'مرحلة الاستلام.', group: 'orders', terminal: false },
	'order-deliver': { id: 'order-deliver', label: 'التسليم', description: 'مرحلة التسليم.', group: 'orders', terminal: false },
	'proof-upload': { id: 'proof-upload', label: 'رفع الإثبات', description: 'مرحلة إثبات التسليم.', group: 'orders', terminal: false },
	'cod-liability': { id: 'cod-liability', label: 'ذمة COD', description: 'مسار الذمة النقدية المستحقة.', group: 'finance', terminal: false },
	'profile-get': { id: 'profile-get', label: 'ملف الكابتن', description: 'لقطة الملف.', group: 'profile', terminal: false },
	'tier-info': { id: 'tier-info', label: 'معلومات الطبقة', description: 'بيانات الطبقة الحالية.', group: 'profile', terminal: false },
	'tier-evaluate': { id: 'tier-evaluate', label: 'تقييم الطبقة', description: 'فحص أهلية الطبقة.', group: 'profile', terminal: false },
	terminal: { id: 'terminal', label: 'نهائي', description: 'حالة ختامية.', group: 'terminal', terminal: true },
};

export function getDshCaptainStateMeta(state: DshCaptainState): DshCaptainStateMeta {
	return stateMetaMap[state];
}

export function isDshCaptainOrderState(state: DshCaptainState): boolean {
	return getDshCaptainStateMeta(state).group === 'orders';
}

export function isDshCaptainFinanceState(state: DshCaptainState): boolean {
	return getDshCaptainStateMeta(state).group === 'finance';
}

export function isDshCaptainTerminalState(state: DshCaptainState): boolean {
	return getDshCaptainStateMeta(state).terminal;
}

// --- Finance screen types (merged from captain-finance.preview-data.ts) ---

export type DshCaptainFinanceScreenState = 'ready' | 'loading' | 'empty' | 'error';

export type DshCaptainFinanceSection = 'cod-liability' | 'earnings' | 'settlement';

/**
 * PREVIEW_ONLY — local display snapshot for captain finance labels.
 * Financial truth (COD, earnings, eligibility, settlement) is owned by WLT.
 * Authoritative type: WltCaptainFinanceSnapshot (wlt/frontend/control-panel/dsh/dshFinancePreview.ts).
 * bthwani_delivery only — partner_delivery (store_courier_mode) is not captain payout.
 */
export type DshCaptainFinanceSnapshot = {
	readonly isPreview: true;
	codBalanceLabel: string;
	earningsLabel: string;
	settlementLabel: string;
	pendingPayoutLabel?: string;
	cycleLabel?: string;
};

// --- Profile screen types (merged from captain-profile.preview-data.ts) ---

export type DshCaptainProfileScreenState = 'ready' | 'loading' | 'empty' | 'error';

export type DshCaptainProfileSection = 'profile-get' | 'tier-info' | 'tier-evaluate';

export type DshCaptainProfileSnapshot = {
	displayName: string;
	tierLabel: string;
	readinessLabel: string;
};

export function selectDshCaptainOperationalStatusesPreview(captainId?: string) {
  void captainId;
  return Object.values(stateMetaMap);
}
