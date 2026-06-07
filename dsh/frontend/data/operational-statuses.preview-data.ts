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
		label: 'ØªØ¬Ù‡ÙŠØ² Ø§Ù„ØªØ³Ø¹ÙŠØ±',
		title: 'ØªØ¬Ù‡ÙŠØ² Ø§Ù„ØªØ³Ø¹ÙŠØ±',
		description: 'ÙŠØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø±Ø³ÙˆÙ… ÙˆØ§Ù„ÙˆÙ‚Øª Ø§Ù„Ù…ØªÙˆÙ‚Ø¹ ÙˆØ£Ø«Ø± Ø§Ù„Ø¹Ø±ÙˆØ¶ Ù‚Ø¨Ù„ Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¯ÙØ¹.',
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
		label: 'ÙØ­Øµ Ù‚Ø§Ø¨Ù„ÙŠØ© Ø§Ù„ØªÙˆØµÙŠÙ„',
		title: 'ÙØ­Øµ Ù‚Ø§Ø¨Ù„ÙŠØ© Ø§Ù„ØªÙˆØµÙŠÙ„',
		description: 'ÙŠØªÙ… Ø§Ù„ØªØ£ÙƒØ¯ Ù…Ù† Ø£Ù† Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø¯Ø§Ø®Ù„ Ù†Ø·Ø§Ù‚ Ø§Ù„Ø®Ø¯Ù…Ø© Ù‚Ø¨Ù„ Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø©.',
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
		label: 'Ø§Ù„Ù…ØªØ¬Ø± Ù…ØªØ§Ø­',
		title: 'Ø§Ù„Ù…ØªØ¬Ø± Ù…ØªØ§Ø­',
		description: 'Ø§Ù„Ù…ØªØ¬Ø± ÙŠØ³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª ÙˆÙŠÙ…ÙƒÙ† Ù„Ù„Ø¹Ù…ÙŠÙ„ Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø¥Ù„Ù‰ Ø§Ù„Ø³Ù„Ø© ÙˆØ§Ù„Ø¯ÙØ¹.',
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
		label: 'Ø§Ù„Ù…ØªØ¬Ø± ØºÙŠØ± Ù…ØªØ§Ø­',
		title: 'Ø§Ù„Ù…ØªØ¬Ø± ØºÙŠØ± Ù…ØªØ§Ø­',
		description: 'Ø§Ù„Ù…ØªØ¬Ø± Ù„Ø§ ÙŠØ³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¢Ù† ÙˆÙŠØ¬Ø¨ Ø¥Ø¸Ù‡Ø§Ø± Ø¨Ø¯ÙŠÙ„ Ø£Ùˆ Ù…Ø³Ø§Ø± Ø¯Ø¹Ù… ÙˆØ§Ø¶Ø­.',
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
		label: 'Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø®Ø§Ø±Ø¬ Ø§Ù„ØªØºØ·ÙŠØ©',
		title: 'Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø®Ø§Ø±Ø¬ Ø§Ù„ØªØºØ·ÙŠØ©',
		description: 'Ø§Ù„ÙˆØ¬Ù‡Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ø®Ø§Ø±Ø¬ Ù†Ø·Ø§Ù‚ Ø§Ù„Ø®Ø¯Ù…Ø© ÙˆÙŠØ¬Ø¨ ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø£Ùˆ Ø§Ø®ØªÙŠØ§Ø± Ø¨Ø¯ÙŠÙ„.',
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
		label: 'Ø§Ù„Ø¹Ù†Ø§ØµØ± ØºÙŠØ± Ù…ØªØ§Ø­Ø©',
		title: 'Ø§Ù„Ø¹Ù†Ø§ØµØ± ØºÙŠØ± Ù…ØªØ§Ø­Ø©',
		description: 'Ø¨Ø¹Ø¶ Ø§Ù„Ø¹Ù†Ø§ØµØ± Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© ØºÙŠØ± Ù…ØªØ§Ø­Ø© Ø§Ù„Ø¢Ù† ÙˆÙŠØ¬Ø¨ Ø¥Ø¸Ù‡Ø§Ø± Ø¨Ø¯ÙŠÙ„ ÙˆØ§Ø¶Ø­ Ø£Ùˆ Ø¥Ø¹Ø§Ø¯Ø© Ø¶Ø¨Ø· Ø§Ù„Ø³Ù„Ø© Ù‚Ø¨Ù„ Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø©.',
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
		label: 'Ø§Ù„Ø³Ù„Ø© ÙØ§Ø±ØºØ©',
		title: 'Ø§Ù„Ø³Ù„Ø© ÙØ§Ø±ØºØ©',
		description: 'Ø£Ø¶Ù Ù…Ù†ØªØ¬Ù‹Ø§ ÙˆØ§Ø­Ø¯Ù‹Ø§ Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„ Ù‚Ø¨Ù„ Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¯ÙØ¹.',
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
		label: 'Ø§Ù„Ø³Ù„Ø© Ø¬Ø§Ù‡Ø²Ø©',
		title: 'Ø§Ù„Ø³Ù„Ø© Ø¬Ø§Ù‡Ø²Ø©',
		description: 'Ø§Ù„Ø³Ù„Ø© ØªØ­ØªÙˆÙŠ Ø¹Ù†Ø§ØµØ± ÙˆÙŠÙ…ÙƒÙ† Ù„Ù„Ø¹Ù…ÙŠÙ„ Ù…Ø±Ø§Ø¬Ø¹ØªÙ‡Ø§ Ù‚Ø¨Ù„ Ø§Ù„Ø¯ÙØ¹.',
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
		label: 'Ø§Ù„Ø¯ÙØ¹ Ø¬Ø§Ù‡Ø²',
		title: 'Ø§Ù„Ø¯ÙØ¹ Ø¬Ø§Ù‡Ø²',
		description: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù†ÙˆØ§Ù† ÙˆØ§Ù„Ø±Ø³ÙˆÙ… ÙˆØ·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¯ÙØ¹ Ø¬Ø§Ù‡Ø²Ø© Ù„Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠØ©.',
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
		label: 'Ø§Ù„Ø¯ÙØ¹ Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©',
		title: 'Ø§Ù„Ø¯ÙØ¹ Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©',
		description: 'ÙŠØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ù‚Ø±Ø§Ø± Ø§Ù„Ø¯ÙØ¹ Ù‚Ø¨Ù„ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ.',
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
		label: 'ÙØ´Ù„ Ø§Ù„Ø¯ÙØ¹',
		title: 'ÙØ´Ù„ Ø§Ù„Ø¯ÙØ¹',
		description: 'ØªØ¹Ø°Ø± ØªØ«Ø¨ÙŠØª Ù‚Ø±Ø§Ø± Ø§Ù„Ø¯ÙØ¹ ÙˆÙŠØ¬Ø¨ ØªÙˆØ¶ÙŠØ­ Ø³Ø¨Ø¨ Ø§Ù„ÙØ´Ù„ Ù…Ø¹ Ø¥Ø¨Ù‚Ø§Ø¡ Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© ÙˆØ§Ù„Ø¯Ø¹Ù… ÙˆØ§Ø¶Ø­Ù‹Ø§.',
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
		label: 'ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø·Ù„Ø¨',
		title: 'ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø·Ù„Ø¨',
		description: 'ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø·Ù„Ø¨ ÙˆÙ‡Ùˆ Ø¨Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„ØªØ£ÙƒÙŠØ¯ Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ.',
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
		label: 'ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨',
		title: 'ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨',
		description: 'ØªÙ… Ù‚Ø¨ÙˆÙ„ Ø§Ù„Ø·Ù„Ø¨ ÙˆÙŠÙ…ÙƒÙ† Ù…ØªØ§Ø¨Ø¹Ø© Ø­Ø§Ù„ØªÙ‡ Ù…Ù† ØµÙØ­Ø© Ø§Ù„ØªØªØ¨Ø¹.',
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
		label: 'Ø§Ù„ØªØªØ¨Ø¹ Ù†Ø´Ø·',
		title: 'Ø§Ù„ØªØªØ¨Ø¹ Ù†Ø´Ø·',
		description: 'Ø§Ù„Ø·Ù„Ø¨ Ù‚ÙŠØ¯ Ø§Ù„ØªÙ†ÙÙŠØ° ÙˆÙŠÙ…ÙƒÙ† Ù„Ù„Ø¹Ù…ÙŠÙ„ Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø­Ø§Ù„Ø© ÙˆØ§Ù„ÙˆÙ‚Øª Ø§Ù„Ù…ØªÙˆÙ‚Ø¹ ÙˆØ§Ù„Ø¯Ø¹Ù….',
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
		label: 'ØªÙ… Ø§Ù„ØªØ³Ù„ÙŠÙ…',
		title: 'ØªÙ… Ø§Ù„ØªØ³Ù„ÙŠÙ…',
		description: 'ÙˆØµÙ„ Ø§Ù„Ø·Ù„Ø¨ Ù„Ù„Ø¹Ù…ÙŠÙ„ ÙˆÙŠÙ…ÙƒÙ†Ù‡ ØªÙ‚ÙŠÙŠÙ… Ø§Ù„ØªØ¬Ø±Ø¨Ø© Ø£Ùˆ Ø·Ù„Ø¨ Ø§Ù„Ø¯Ø¹Ù… Ø¹Ù†Ø¯ Ø§Ù„Ø­Ø§Ø¬Ø©.',
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
		label: 'ØªÙ… Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø·Ù„Ø¨',
		title: 'ØªÙ… Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø·Ù„Ø¨',
		description: 'ØªÙ… Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø·Ù„Ø¨ ÙˆÙŠØ¬Ø¨ ØªÙˆØ¶ÙŠØ­ Ø§Ù„Ø³Ø¨Ø¨ ÙˆØ­Ø§Ù„Ø© Ø£ÙŠ Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ù„Ù„Ø¹Ù…ÙŠÙ„.',
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
		label: 'ÙØ´Ù„ ØªÙ†ÙÙŠØ° Ø§Ù„Ø·Ù„Ø¨',
		title: 'ÙØ´Ù„ ØªÙ†ÙÙŠØ° Ø§Ù„Ø·Ù„Ø¨',
		description: 'ØªØ¹Ø°Ø± ØªÙ†ÙÙŠØ° Ø§Ù„Ø·Ù„Ø¨ ÙˆÙŠØ¬Ø¨ Ø¥Ø¸Ù‡Ø§Ø± Ù…Ø³Ø§Ø± ØªØ¹Ø§ÙÙ Ø£Ùˆ Ø¯Ø¹Ù… ÙˆØ§Ø¶Ø­ Ù„Ù„Ø¹Ù…ÙŠÙ„.',
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
		label: 'Ø§Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©',
		title: 'Ø§Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©',
		description: 'ÙŠÙˆØ¬Ø¯ Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø© ÙˆÙŠØ¬Ø¨ Ø¥Ø¸Ù‡Ø§Ø± Ø­Ø§Ù„ØªÙ‡ Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ù„Ù„Ø¹Ù…ÙŠÙ„.',
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
		label: 'ØªÙ… Ø§Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯',
		title: 'ØªÙ… Ø§Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯',
		description: 'Ø§ÙƒØªÙ…Ù„Øª Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯ ÙˆÙŠÙ…ÙƒÙ† Ø¹Ø±Ø¶ Ø§Ù„Ø£Ø«Ø± Ø§Ù„Ù…Ø§Ù„ÙŠ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ Ù„Ù„Ø¹Ù…ÙŠÙ„.',
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
		label: 'Ø§Ù„Ø¯Ø¹Ù… Ù…Ø·Ù„ÙˆØ¨',
		title: 'Ø§Ù„Ø¯Ø¹Ù… Ù…Ø·Ù„ÙˆØ¨',
		description: 'Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø¨Ø£Ù…Ø§Ù† Ø¨Ø¯ÙˆÙ† ØªØ¯Ø®Ù„ Ø§Ù„Ø¯Ø¹Ù… Ø£Ùˆ ØªÙˆØ¶ÙŠØ­ Ø³Ø¨Ø¨ Ø§Ù„Ù…Ø´ÙƒÙ„Ø©.',
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
		label: 'Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø¸Ø§Ù‡Ø±',
		title: 'Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø¸Ø§Ù‡Ø±',
		description: 'ÙŠÙˆØ¬Ø¯ Ø±ØµÙŠØ¯ Ø£Ùˆ ØªØ¹ÙˆÙŠØ¶ Ø¸Ø§Ù‡Ø± Ù„Ù„Ø¹Ù…ÙŠÙ„ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø­ÙØ¸Ø©.',
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
		label: 'Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø¸Ø§Ù‡Ø±',
		title: 'Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø¸Ø§Ù‡Ø±',
		description: 'ØªØ¸Ù‡Ø± Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø±ØªØ¨Ø·Ø© Ø¨Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø¶Ù…Ù† Ù…Ø³Ø§Ø± Ø§Ù„Ø¹Ù…ÙŠÙ„.',
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
	entry: { id: 'entry', label: 'Ù…Ø¯Ø®Ù„ Ø§Ù„ÙƒØ§Ø¨ØªÙ†', description: 'Ù†Ù‚Ø·Ø© Ø§Ù„Ø¨Ø¯Ø§ÙŠØ© Ø§Ù„Ù…Ø®ØªØµØ±Ø©.', group: 'entry', terminal: false },
	orders: { id: 'orders', label: 'Ø§Ù„Ø·Ù„Ø¨Ø§Øª', description: 'Ù…Ø³Ø§Ø± Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ.', group: 'orders', terminal: false },
	finance: { id: 'finance', label: 'Ø§Ù„Ù…Ø§Ù„ÙŠØ©', description: 'Ø³Ø·Ø­ Ø§Ù„Ø±ØµÙŠØ¯ ÙˆØ§Ù„ØªØ³ÙˆÙŠØ©.', group: 'finance', terminal: false },
	profile: { id: 'profile', label: 'Ø§Ù„Ù…Ù„Ù', description: 'Ù…Ù„Ù Ø§Ù„ÙƒØ§Ø¨ØªÙ† ÙˆÙ…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø·Ø¨Ù‚Ø©.', group: 'profile', terminal: false },
	operations: { id: 'operations', label: 'Ø§Ù„ØªØ´ØºÙŠÙ„', description: 'Ø§Ù„Ø¬Ø§Ù‡Ø²ÙŠØ© ÙˆØ§Ù„Ù…Ø³Ø§Ø± ÙˆØ§Ù„Ø³Ù„Ø§Ù…Ø©.', group: 'operations', terminal: false },
	'order-accept': { id: 'order-accept', label: 'Ù‚Ø¨ÙˆÙ„ Ø§Ù„Ø·Ù„Ø¨', description: 'Ø­Ø§Ù„Ø© Ù‚Ø¨ÙˆÙ„ Ø§Ù„Ø¹Ø±Ø¶.', group: 'orders', terminal: false },
	'order-offer-reject': { id: 'order-offer-reject', label: 'Ø±ÙØ¶ Ø§Ù„Ø¹Ø±Ø¶', description: 'Ø­Ø§Ù„Ø© Ø±ÙØ¶ Ø¹Ø±Ø¶ Ø§Ù„Ø·Ù„Ø¨.', group: 'orders', terminal: false },
	'order-pickup': { id: 'order-pickup', label: 'Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', description: 'Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….', group: 'orders', terminal: false },
	'order-deliver': { id: 'order-deliver', label: 'Ø§Ù„ØªØ³Ù„ÙŠÙ…', description: 'Ù…Ø±Ø­Ù„Ø© Ø§Ù„ØªØ³Ù„ÙŠÙ….', group: 'orders', terminal: false },
	'proof-upload': { id: 'proof-upload', label: 'Ø±ÙØ¹ Ø§Ù„Ø¥Ø«Ø¨Ø§Øª', description: 'Ù…Ø±Ø­Ù„Ø© Ø¥Ø«Ø¨Ø§Øª Ø§Ù„ØªØ³Ù„ÙŠÙ….', group: 'orders', terminal: false },
	'cod-liability': { id: 'cod-liability', label: 'Ø°Ù…Ø© COD', description: 'Ù…Ø³Ø§Ø± Ø§Ù„Ø°Ù…Ø© Ø§Ù„Ù†Ù‚Ø¯ÙŠØ© Ø§Ù„Ù…Ø³ØªØ­Ù‚Ø©.', group: 'finance', terminal: false },
	'profile-get': { id: 'profile-get', label: 'Ù…Ù„Ù Ø§Ù„ÙƒØ§Ø¨ØªÙ†', description: 'Ù„Ù‚Ø·Ø© Ø§Ù„Ù…Ù„Ù.', group: 'profile', terminal: false },
	'tier-info': { id: 'tier-info', label: 'Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø·Ø¨Ù‚Ø©', description: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø·Ø¨Ù‚Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©.', group: 'profile', terminal: false },
	'tier-evaluate': { id: 'tier-evaluate', label: 'ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø·Ø¨Ù‚Ø©', description: 'ÙØ­Øµ Ø£Ù‡Ù„ÙŠØ© Ø§Ù„Ø·Ø¨Ù‚Ø©.', group: 'profile', terminal: false },
	terminal: { id: 'terminal', label: 'Ù†Ù‡Ø§Ø¦ÙŠ', description: 'Ø­Ø§Ù„Ø© Ø®ØªØ§Ù…ÙŠØ©.', group: 'terminal', terminal: true },
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
 * PREVIEW_ONLY â€” local display snapshot for captain finance labels.
 * Financial truth (COD, earnings, eligibility, settlement) is owned by WLT.
 * Authoritative type: WltCaptainFinanceSnapshot (wlt/frontend/dsh/control-panel/dshFinancePreview.ts).
 * bthwani_delivery only â€” partner_delivery (store_courier_mode) is not captain payout.
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
