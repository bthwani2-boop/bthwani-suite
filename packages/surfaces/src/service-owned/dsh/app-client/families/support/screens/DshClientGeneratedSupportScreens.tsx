import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../patterns/screens/DshOperationScreen';

export type ClientSupportScreenId =
	| 'awnak-order-create'
	| 'booking-create'
	| 'chat-read-ack'
	| 'chat-send'
	| 'checkout-gate'
	| 'delivery-attempt-create'
	| 'delivery-attempts-list'
	| 'delivery-close'
	| 'delivery-eta-get'
	| 'delivery-get'
	| 'delivery-reassign'
	| 'delivery-track-get'
	| 'entitlements-get'
	| 'estimate-create'
	| 'estimate-get'
	| 'external-order-create'
	| 'gas-refill-order-create'
	| 'listing-status-update'
	| 'loyalty-points-redeem'
	| 'loyalty-points-user-balance'
	| 'loyalty-points-user-history'
	| 'order-accept'
	| 'order-cancel'
	| 'order-complete'
	| 'order-create'
	| 'order-escrow-hold'
	| 'order-escrow-release'
	| 'order-get'
	| 'order-issue-flag'
	| 'order-proof-code-generate'
	| 'order-proof-verify'
	| 'order-rate'
	| 'order-receipt-get'
	| 'order-status-get'
	| 'order-status-update'
	| 'pricing-preview'
	| 'pricing-snapshot-get'
	| 'promo-apply'
	| 'proxy-request-create'
	| 'proxy-request-approve'
	| 'proxy-request-review'
	| 'proxy-request-reject'
	| 'proxy-request-tracking'
	| 'review-create'
	| 'reviews-list'
	| 'service-modes-resolve'
	| 'shein-info'
	| 'subscription-family-get'
	| 'subscription-family-members-get'
	| 'subscription-family-members-post'
	| 'subscription-pro-catalog'
	| 'subscription-sync'
	| 'subscription-tier-get'
	| 'subscription-upgrade-post'
	| 'zone-set';

export type ClientGeneratedSupportScreenProps = {
	state?: DshOperationScreenState;
	onPrimaryAction?: () => void;
	onSecondaryAction?: () => void;
	onRetry?: () => void;
};

export type ClientSupportKind = 'create' | 'order' | 'delivery' | 'loyalty' | 'subscription' | 'proxy' | 'chat' | 'settings' | 'review';

export type ClientSupportGroupId =
	| 'create-checkout'
	| 'order-delivery'
	| 'messaging-reviews'
	| 'subscription-loyalty'
	| 'proxy-controls';

type ClientSupportDefinition = {
	title: string;
	subtitle: string;
	badgeLabel: string;
	kind: ClientSupportKind;
	group: ClientSupportGroupId;
	stageLabel: string;
	primaryOutcome: string;
};

export const clientSupportDefinitions: Record<ClientSupportScreenId, ClientSupportDefinition> = {
	'awnak-order-create': {
		title: 'Awnak order create',
		subtitle: 'Alternative create lane for customer requests that still resolves into the canonical order flow.',
		badgeLabel: 'Create',
		kind: 'create',
		group: 'create-checkout',
		stageLabel: 'Alternative create',
		primaryOutcome: 'Request created with the same downstream order checkpoints.',
	},
	'booking-create': {
		title: 'Booking create',
		subtitle: 'Booking-style request capture with a compact entry path and explicit next step.',
		badgeLabel: 'Create',
		kind: 'create',
		group: 'create-checkout',
		stageLabel: 'Booking',
		primaryOutcome: 'Booking intent is created without forcing a long manual path.',
	},
	'chat-read-ack': {
		title: 'Chat read acknowledgement',
		subtitle: 'Confirms the customer has consumed the latest delivery or support message.',
		badgeLabel: 'Comms',
		kind: 'chat',
		group: 'messaging-reviews',
		stageLabel: 'Conversation read state',
		primaryOutcome: 'Message state is acknowledged and thread context stays clean.',
	},
	'chat-send': {
		title: 'Chat send',
		subtitle: 'Short outbound messaging lane attached to the current order context.',
		badgeLabel: 'Comms',
		kind: 'chat',
		group: 'messaging-reviews',
		stageLabel: 'Conversation send state',
		primaryOutcome: 'A concise message is sent without leaving the customer journey.',
	},
	'checkout-gate': {
		title: 'Checkout gate',
		subtitle: 'Final readiness checkpoint before the customer commits the order.',
		badgeLabel: 'Checkout',
		kind: 'order',
		group: 'create-checkout',
		stageLabel: 'Pre-submit control',
		primaryOutcome: 'The order can move forward with visible constraints and no hidden blockers.',
	},
	'delivery-attempt-create': {
		title: 'Delivery attempt create',
		subtitle: 'Starts a fresh delivery attempt while keeping failure recovery close to the customer.',
		badgeLabel: 'Delivery',
		kind: 'delivery',
		group: 'order-delivery',
		stageLabel: 'Attempt creation',
		primaryOutcome: 'A new delivery attempt is recorded and pushed into active tracking.',
	},
	'delivery-attempts-list': {
		title: 'Delivery attempts list',
		subtitle: 'Reads attempt history so the customer can understand handoff quality and retries.',
		badgeLabel: 'Delivery',
		kind: 'delivery',
		group: 'order-delivery',
		stageLabel: 'Attempt history',
		primaryOutcome: 'Previous attempts are visible before another recovery action is chosen.',
	},
	'delivery-close': {
		title: 'Delivery close',
		subtitle: 'Closes the active delivery lane after final handoff completion or issue resolution.',
		badgeLabel: 'Delivery',
		kind: 'delivery',
		group: 'order-delivery',
		stageLabel: 'Closeout',
		primaryOutcome: 'The delivery lane is closed with a clear final state.',
	},
	'delivery-eta-get': {
		title: 'Delivery ETA get',
		subtitle: 'Reads current ETA confidence without making the customer hunt through status fragments.',
		badgeLabel: 'Tracking',
		kind: 'delivery',
		group: 'order-delivery',
		stageLabel: 'ETA visibility',
		primaryOutcome: 'ETA is visible with enough context to decide whether escalation is needed.',
	},
	'delivery-get': {
		title: 'Delivery get',
		subtitle: 'Reads the delivery snapshot with enough detail to understand the active handoff state.',
		badgeLabel: 'Tracking',
		kind: 'delivery',
		group: 'order-delivery',
		stageLabel: 'Delivery snapshot',
		primaryOutcome: 'The customer sees the current delivery state without losing order context.',
	},
	'delivery-reassign': {
		title: 'Delivery reassign',
		subtitle: 'Supports reassignment when the active delivery lane is no longer the fastest path to completion.',
		badgeLabel: 'Delivery',
		kind: 'delivery',
		group: 'order-delivery',
		stageLabel: 'Captain reassignment',
		primaryOutcome: 'A reassignment path is surfaced while preserving customer visibility.',
	},
	'delivery-track-get': {
		title: 'Delivery track get',
		subtitle: 'Keeps the live movement lane readable for the customer during in-flight delivery.',
		badgeLabel: 'Tracking',
		kind: 'delivery',
		group: 'order-delivery',
		stageLabel: 'Live movement',
		primaryOutcome: 'The active route remains trackable with one dominant next action.',
	},
	'entitlements-get': {
		title: 'Entitlements get',
		subtitle: 'Reads customer access and benefit eligibility without mixing it into checkout decisions.',
		badgeLabel: 'Account',
		kind: 'settings',
		group: 'subscription-loyalty',
		stageLabel: 'Eligibility read',
		primaryOutcome: 'Benefit eligibility is visible before the customer takes the next paid action.',
	},
	'estimate-create': {
		title: 'Estimate create',
		subtitle: 'Builds an estimate quickly so the customer can decide before committing the order.',
		badgeLabel: 'Create',
		kind: 'create',
		group: 'create-checkout',
		stageLabel: 'Estimate preparation',
		primaryOutcome: 'A fresh estimate is prepared as a low-friction pre-order checkpoint.',
	},
	'estimate-get': {
		title: 'Estimate get',
		subtitle: 'Reads the active estimate so pricing confidence remains visible before checkout.',
		badgeLabel: 'Pricing',
		kind: 'order',
		group: 'create-checkout',
		stageLabel: 'Estimate read',
		primaryOutcome: 'The customer can validate cost and timing before submitting.',
	},
	'external-order-create': {
		title: 'External order create',
		subtitle: 'Captures orders sourced from outside the core browse path while keeping the main flow intact.',
		badgeLabel: 'Create',
		kind: 'create',
		group: 'create-checkout',
		stageLabel: 'External intake',
		primaryOutcome: 'External demand enters the same controlled order lifecycle.',
	},
	'gas-refill-order-create': {
		title: 'Gas refill order create',
		subtitle: 'Specialized create lane for refill scenarios that need a faster route into confirmation.',
		badgeLabel: 'Create',
		kind: 'create',
		group: 'create-checkout',
		stageLabel: 'Refill intake',
		primaryOutcome: 'Refill demand is captured without bloating the standard order path.',
	},
	'listing-status-update': {
		title: 'Listing status update',
		subtitle: 'Surfaces listing visibility changes separately from the shopper decision path.',
		badgeLabel: 'Control',
		kind: 'settings',
		group: 'proxy-controls',
		stageLabel: 'Listing visibility',
		primaryOutcome: 'Availability changes are visible without breaking the current order state.',
	},
	'loyalty-points-redeem': {
		title: 'Loyalty points redeem',
		subtitle: 'Redeems loyalty value while keeping the customer anchored in the active purchase path.',
		badgeLabel: 'Loyalty',
		kind: 'loyalty',
		group: 'subscription-loyalty',
		stageLabel: 'Value redemption',
		primaryOutcome: 'Points are converted into visible order value with minimal friction.',
	},
	'loyalty-points-user-balance': {
		title: 'Loyalty points user balance',
		subtitle: 'Reads the current points balance so redemption choices are not blind.',
		badgeLabel: 'Loyalty',
		kind: 'loyalty',
		group: 'subscription-loyalty',
		stageLabel: 'Balance visibility',
		primaryOutcome: 'The customer can see available value before deciding to redeem.',
	},
	'loyalty-points-user-history': {
		title: 'Loyalty points user history',
		subtitle: 'Shows accrual and redemption history in one place to reduce support confusion.',
		badgeLabel: 'Loyalty',
		kind: 'loyalty',
		group: 'subscription-loyalty',
		stageLabel: 'History read',
		primaryOutcome: 'Past point activity is readable and tied back to the customer account.',
	},
	'order-accept': {
		title: 'Order accept',
		subtitle: 'Confirms the order can advance from intent into an active execution state.',
		badgeLabel: 'Order',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Acceptance',
		primaryOutcome: 'The order moves into the live lifecycle with visible confirmation.',
	},
	'order-cancel': {
		title: 'Order cancel',
		subtitle: 'Provides a controlled cancellation lane with an explicit recovery path.',
		badgeLabel: 'Order',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Cancellation',
		primaryOutcome: 'The order is cancelled cleanly and the customer can still recover next steps.',
	},
	'order-complete': {
		title: 'Order complete',
		subtitle: 'Closes the active order state once delivery and proof expectations are satisfied.',
		badgeLabel: 'Order',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Completion',
		primaryOutcome: 'The order is completed with a clear transition into review or follow-up.',
	},
	'order-create': {
		title: 'Order create',
		subtitle: 'Canonical create lane used when the customer is ready to turn intent into an order.',
		badgeLabel: 'Create',
		kind: 'create',
		group: 'create-checkout',
		stageLabel: 'Canonical order create',
		primaryOutcome: 'The customer enters the standard order flow without unnecessary branching.',
	},
	'order-escrow-hold': {
		title: 'Order escrow hold',
		subtitle: 'Makes protected order funds visible when the delivery state still needs verification.',
		badgeLabel: 'Protection',
		kind: 'delivery',
		group: 'order-delivery',
		stageLabel: 'Escrow hold',
		primaryOutcome: 'Protected funds remain held until the order state becomes safe to release.',
	},
	'order-escrow-release': {
		title: 'Order escrow release',
		subtitle: 'Releases protected funds only after the delivery or proof state is resolved.',
		badgeLabel: 'Protection',
		kind: 'delivery',
		group: 'order-delivery',
		stageLabel: 'Escrow release',
		primaryOutcome: 'Protected funds are released with visible confidence signals.',
	},
	'order-get': {
		title: 'Order get',
		subtitle: 'Reads the current order snapshot so the customer sees state without extra taps.',
		badgeLabel: 'Read',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Order snapshot',
		primaryOutcome: 'The order snapshot is visible and ready to branch into the next action.',
	},
	'order-issue-flag': {
		title: 'Order issue flag',
		subtitle: 'Surfaces issue escalation while keeping the current order frame intact.',
		badgeLabel: 'Issue',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Issue escalation',
		primaryOutcome: 'A problem is flagged quickly without losing the live order context.',
	},
	'order-proof-code-generate': {
		title: 'Order proof code generate',
		subtitle: 'Generates proof when a trusted final handoff confirmation is needed.',
		badgeLabel: 'Proof',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Proof preparation',
		primaryOutcome: 'A proof code is generated for the next handoff checkpoint.',
	},
	'order-proof-verify': {
		title: 'Order proof verify',
		subtitle: 'Verifies the handoff code before completion is allowed to proceed.',
		badgeLabel: 'Proof',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Proof verification',
		primaryOutcome: 'The handoff can be trusted before the order closes.',
	},
	'order-rate': {
		title: 'Order rate',
		subtitle: 'Captures the customer rating at the moment the outcome is still fresh.',
		badgeLabel: 'Review',
		kind: 'review',
		group: 'messaging-reviews',
		stageLabel: 'Rating capture',
		primaryOutcome: 'The completed order receives a quick rating without a long survey path.',
	},
	'order-receipt-get': {
		title: 'Order receipt get',
		subtitle: 'Reads the customer receipt with pricing and completion detail in one view.',
		badgeLabel: 'Receipt',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Receipt read',
		primaryOutcome: 'The customer can confirm paid details after the order closes.',
	},
	'order-status-get': {
		title: 'Order status get',
		subtitle: 'Reads the active status when the customer needs a concise answer fast.',
		badgeLabel: 'Status',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Status read',
		primaryOutcome: 'Order status is visible without re-opening multiple surfaces.',
	},
	'order-status-update': {
		title: 'Order status update',
		subtitle: 'Supports explicit status progression without hiding the next downstream impact.',
		badgeLabel: 'Status',
		kind: 'order',
		group: 'order-delivery',
		stageLabel: 'Status progression',
		primaryOutcome: 'The new state is applied with clear awareness of the next step.',
	},
	'pricing-preview': {
		title: 'Pricing preview',
		subtitle: 'Shows cost expectations before the customer commits to checkout.',
		badgeLabel: 'Pricing',
		kind: 'order',
		group: 'create-checkout',
		stageLabel: 'Cost preview',
		primaryOutcome: 'Pricing confidence is visible before order submission.',
	},
	'pricing-snapshot-get': {
		title: 'Pricing snapshot get',
		subtitle: 'Reads the locked pricing snapshot so disputes are reduced before submit.',
		badgeLabel: 'Pricing',
		kind: 'order',
		group: 'create-checkout',
		stageLabel: 'Pricing snapshot',
		primaryOutcome: 'A stable pricing view is available when the customer needs certainty.',
	},
	'promo-apply': {
		title: 'Promo apply',
		subtitle: 'Applies promotional value at the point where it matters to conversion.',
		badgeLabel: 'Pricing',
		kind: 'order',
		group: 'create-checkout',
		stageLabel: 'Promo application',
		primaryOutcome: 'Promo value is applied without forcing the customer out of checkout.',
	},
	'proxy-request-create': {
		title: 'Proxy request create',
		subtitle: 'Starts a customer proxy request with a short, controlled entry path.',
		badgeLabel: 'Proxy',
		kind: 'create',
		group: 'proxy-controls',
		stageLabel: 'Request initiation',
		primaryOutcome: 'A proxy request is started without spreading the flow across multiple screens.',
	},
	'proxy-request-approve': {
		title: 'Proxy request approve',
		subtitle: 'Approves the proxy request with a clear signal about what will happen next.',
		badgeLabel: 'Proxy',
		kind: 'proxy',
		group: 'proxy-controls',
		stageLabel: 'Approval lane',
		primaryOutcome: 'The proxy request can move forward with approval visibility.',
	},
	'proxy-request-review': {
		title: 'Proxy request review',
		subtitle: 'Lets the customer inspect proxy details before approval or escalation.',
		badgeLabel: 'Proxy',
		kind: 'proxy',
		group: 'proxy-controls',
		stageLabel: 'Review lane',
		primaryOutcome: 'The customer can review proxy context before choosing the next action.',
	},
	'proxy-request-reject': {
		title: 'Proxy request reject',
		subtitle: 'Closes the proxy request when the customer decides not to continue.',
		badgeLabel: 'Proxy',
		kind: 'proxy',
		group: 'proxy-controls',
		stageLabel: 'Rejection lane',
		primaryOutcome: 'The request is rejected with the decision kept visible in the flow.',
	},
	'proxy-request-tracking': {
		title: 'Proxy request tracking',
		subtitle: 'Tracks the proxy request after approval so the customer stays oriented.',
		badgeLabel: 'Proxy',
		kind: 'proxy',
		group: 'proxy-controls',
		stageLabel: 'Tracking lane',
		primaryOutcome: 'Proxy progress remains visible after the decision is made.',
	},
	'review-create': {
		title: 'Review create',
		subtitle: 'Creates the detailed review entry after the quick rating moment.',
		badgeLabel: 'Review',
		kind: 'review',
		group: 'messaging-reviews',
		stageLabel: 'Review authoring',
		primaryOutcome: 'The customer can leave structured feedback without friction.',
	},
	'reviews-list': {
		title: 'Reviews list',
		subtitle: 'Reads prior reviews so the customer can confirm what feedback already exists.',
		badgeLabel: 'Review',
		kind: 'review',
		group: 'messaging-reviews',
		stageLabel: 'Review history',
		primaryOutcome: 'Feedback history stays visible and consistent with the current order.',
	},
	'service-modes-resolve': {
		title: 'Service modes resolve',
		subtitle: 'Makes the active service mode explicit before the customer chooses the next lane.',
		badgeLabel: 'Control',
		kind: 'settings',
		group: 'proxy-controls',
		stageLabel: 'Mode selection',
		primaryOutcome: 'The correct service mode is visible before the journey branches further.',
	},
	'shein-info': {
		title: 'Shein info',
		subtitle: 'Keeps Shein proxy context readable when the customer needs policy or request detail.',
		badgeLabel: 'Proxy',
		kind: 'proxy',
		group: 'proxy-controls',
		stageLabel: 'External proxy info',
		primaryOutcome: 'External proxy detail is visible without breaking the main order frame.',
	},
	'subscription-family-get': {
		title: 'Subscription family get',
		subtitle: 'Reads the customer family subscription context in one consolidated surface.',
		badgeLabel: 'Subscription',
		kind: 'subscription',
		group: 'subscription-loyalty',
		stageLabel: 'Family plan read',
		primaryOutcome: 'The family plan becomes visible before member actions are taken.',
	},
	'subscription-family-members-get': {
		title: 'Subscription family members get',
		subtitle: 'Reads family member access so entitlement changes stay explainable.',
		badgeLabel: 'Subscription',
		kind: 'subscription',
		group: 'subscription-loyalty',
		stageLabel: 'Member visibility',
		primaryOutcome: 'Family members are visible before a membership action is taken.',
	},
	'subscription-family-members-post': {
		title: 'Subscription family members post',
		subtitle: 'Adds or updates family members while preserving plan context.',
		badgeLabel: 'Subscription',
		kind: 'subscription',
		group: 'subscription-loyalty',
		stageLabel: 'Member update',
		primaryOutcome: 'Family member changes happen without leaving the subscription lane.',
	},
	'subscription-pro-catalog': {
		title: 'Subscription pro catalog',
		subtitle: 'Shows the available pro catalog so upgrades are not made blind.',
		badgeLabel: 'Subscription',
		kind: 'subscription',
		group: 'subscription-loyalty',
		stageLabel: 'Plan catalog',
		primaryOutcome: 'Available plans stay visible before upgrade decisions are made.',
	},
	'subscription-sync': {
		title: 'Subscription sync',
		subtitle: 'Synchronizes the subscription state when customer entitlement data needs refresh.',
		badgeLabel: 'Subscription',
		kind: 'subscription',
		group: 'subscription-loyalty',
		stageLabel: 'State sync',
		primaryOutcome: 'Subscription state is refreshed before the next customer action.',
	},
	'subscription-tier-get': {
		title: 'Subscription tier get',
		subtitle: 'Reads the active tier so the customer understands current plan depth.',
		badgeLabel: 'Subscription',
		kind: 'subscription',
		group: 'subscription-loyalty',
		stageLabel: 'Tier read',
		primaryOutcome: 'The active tier is visible before an upgrade or member action.',
	},
	'subscription-upgrade-post': {
		title: 'Subscription upgrade post',
		subtitle: 'Upgrades the plan through a compact lane that keeps benefit changes visible.',
		badgeLabel: 'Subscription',
		kind: 'subscription',
		group: 'subscription-loyalty',
		stageLabel: 'Upgrade path',
		primaryOutcome: 'Plan upgrades happen with visible benefit and member impact.',
	},
	'zone-set': {
		title: 'Zone set',
		subtitle: 'Surfaces the effective service zone separately from shopping and checkout decisions.',
		badgeLabel: 'Control',
		kind: 'settings',
		group: 'proxy-controls',
		stageLabel: 'Zone control',
		primaryOutcome: 'Zone context is explicit before the customer continues the journey.',
	},
};

export const clientSupportDirectoryGroups: Array<{
	id: ClientSupportGroupId;
	title: string;
	subtitle: string;
	itemIds: ClientSupportScreenId[];
}> = [
	{
		id: 'create-checkout',
		title: 'Create and checkout',
		subtitle: 'All creation, estimate, pricing, and pre-submit controls in one place.',
		itemIds: [
			'awnak-order-create',
			'booking-create',
			'estimate-create',
			'external-order-create',
			'gas-refill-order-create',
			'order-create',
			'estimate-get',
			'checkout-gate',
			'pricing-preview',
			'pricing-snapshot-get',
			'promo-apply',
		],
	},
	{
		id: 'order-delivery',
		title: 'Order and delivery control',
		subtitle: 'Execution, proof, status, protection, and tracking decisions stay together.',
		itemIds: [
			'order-accept',
			'order-cancel',
			'order-complete',
			'order-get',
			'order-issue-flag',
			'order-proof-code-generate',
			'order-proof-verify',
			'order-receipt-get',
			'order-status-get',
			'order-status-update',
			'order-escrow-hold',
			'order-escrow-release',
			'delivery-attempt-create',
			'delivery-attempts-list',
			'delivery-close',
			'delivery-eta-get',
			'delivery-get',
			'delivery-reassign',
			'delivery-track-get',
		],
	},
	{
		id: 'messaging-reviews',
		title: 'Messaging and review',
		subtitle: 'Conversation, rating, and feedback surfaces that follow the completed order.',
		itemIds: ['chat-read-ack', 'chat-send', 'order-rate', 'review-create', 'reviews-list'],
	},
	{
		id: 'subscription-loyalty',
		title: 'Subscription and loyalty',
		subtitle: 'Benefits, family plans, upgrades, points, and entitlement visibility.',
		itemIds: [
			'entitlements-get',
			'loyalty-points-redeem',
			'loyalty-points-user-balance',
			'loyalty-points-user-history',
			'subscription-family-get',
			'subscription-family-members-get',
			'subscription-family-members-post',
			'subscription-pro-catalog',
			'subscription-sync',
			'subscription-tier-get',
			'subscription-upgrade-post',
		],
	},
	{
		id: 'proxy-controls',
		title: 'Proxy and service controls',
		subtitle: 'Proxy requests, external context, and service-control surfaces that should stay out of the main shopping lane.',
		itemIds: ['proxy-request-create', 'proxy-request-approve', 'proxy-request-review', 'proxy-request-reject', 'proxy-request-tracking', 'shein-info', 'service-modes-resolve', 'listing-status-update', 'zone-set'],
	},
];

function primaryLabelByKind(kind: ClientSupportKind) {
	if (kind === 'create') return 'Open create flow';
	if (kind === 'delivery') return 'Open tracking';
	if (kind === 'loyalty') return 'Open loyalty context';
	if (kind === 'subscription') return 'Open subscription context';
	if (kind === 'proxy') return 'Open proxy context';
	if (kind === 'review') return 'Open review flow';
	if (kind === 'settings') return 'Return to service context';
	if (kind === 'chat') return 'Open conversation';
	return 'Open order flow';
}

function buildSupportContent(
	definition: ClientSupportDefinition,
	draftValue: string,
	setDraftValue: (nextValue: string) => void,
) {
	const guidanceItems = [
		{
			title: definition.stageLabel,
			subtitle: definition.primaryOutcome,
			meta: 'Primary emphasis',
			badgeLabel: definition.badgeLabel,
		},
		{
			title: 'Next handoff',
			subtitle: 'Keep the customer in one clear lane after this step completes.',
			meta: 'Flow control',
			badgeLabel: 'Next',
		},
	];

	if (definition.kind === 'chat') {
		return (
			<BthBox gap={3}>
				<BthSurface tone="brand" gap={3}>
					<BthStatCard label="Conversation lane" value="Live" deltaLabel={definition.stageLabel} tone="info" />
					<BthStatCard label="Expected behavior" value="Short" deltaLabel="Actionable and explicit" tone="success" />
				</BthSurface>
				<BthSurface tone="raised" gap={3}>
					<BthTextField
						label="Message draft"
						value={draftValue}
						onChangeText={setDraftValue}
						hint="Keep the note short, concrete, and tied to the active delivery or order."
					/>
				</BthSurface>
			</BthBox>
		);
	}

	if (definition.kind === 'proxy') {
		return (
			<BthBox gap={3}>
				<BthSurface tone="brand" gap={3}>
					<BthStatCard label="Proxy state" value="Focused" deltaLabel={definition.stageLabel} tone="info" />
					<BthStatCard label="Decision style" value="Guarded" deltaLabel="Review before commit" tone="success" />
				</BthSurface>
				<BthSurface tone="raised" gap={3}>
					<BthKeyValueList
						items={[
							{ label: 'Surface', value: definition.title },
							{ label: 'Purpose', value: definition.primaryOutcome, tone: 'brand' },
							{ label: 'Scope', value: 'Proxy and external request handling' },
						]}
					/>
				</BthSurface>
				<BthSurface tone="raised" gap={2}>
					{guidanceItems.map((item) => (
						<BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
					))}
				</BthSurface>
			</BthBox>
		);
	}

	if (definition.kind === 'subscription' || definition.kind === 'loyalty') {
		return (
			<BthBox gap={3}>
				<BthSurface tone="brand" gap={3}>
					<BthStatCard label="Benefit state" value="Visible" deltaLabel={definition.stageLabel} tone="info" />
					<BthStatCard label="Customer confidence" value="High" deltaLabel="Value is explicit before action" tone="success" />
				</BthSurface>
				<BthSurface tone="raised" gap={3}>
					<BthKeyValueList
						items={[
							{ label: 'Surface', value: definition.title },
							{ label: 'Customer benefit', value: definition.primaryOutcome, tone: 'brand' },
							{ label: 'Category', value: definition.kind === 'subscription' ? 'Subscription management' : 'Loyalty value' },
						]}
					/>
				</BthSurface>
			</BthBox>
		);
	}

	if (definition.kind === 'delivery') {
		return (
			<BthBox gap={3}>
				<BthSurface tone="brand" gap={3}>
					<BthStatCard label="Delivery lane" value="Active" deltaLabel={definition.stageLabel} tone="info" />
					<BthStatCard label="Recovery bias" value="Fast" deltaLabel="Minimize taps during active delivery" tone="success" />
				</BthSurface>
				<BthSurface tone="raised" gap={2}>
					{guidanceItems.map((item) => (
						<BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
					))}
				</BthSurface>
			</BthBox>
		);
	}

	if (definition.kind === 'review') {
		return (
			<BthBox gap={3}>
				<BthSurface tone="brand" gap={3}>
					<BthStatCard label="Feedback lane" value="Ready" deltaLabel={definition.stageLabel} tone="info" />
					<BthStatCard label="Friction target" value="Low" deltaLabel="Capture sentiment while the order is still fresh" tone="success" />
				</BthSurface>
				<BthSurface tone="raised" gap={2}>
					{guidanceItems.map((item) => (
						<BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
					))}
				</BthSurface>
			</BthBox>
		);
	}

	return (
		<BthBox gap={3}>
			<BthSurface tone="brand" gap={3}>
				<BthStatCard label="Current lane" value="Ready" deltaLabel={definition.stageLabel} tone="info" />
				<BthStatCard label="Primary outcome" value="Visible" deltaLabel="One dominant next action" tone="success" />
			</BthSurface>
			<BthSurface tone="raised" gap={3}>
				<BthKeyValueList
					items={[
						{ label: 'Surface', value: definition.title },
						{ label: 'Purpose', value: definition.primaryOutcome, tone: 'brand' },
						{ label: 'Group', value: definition.group },
					]}
				/>
			</BthSurface>
		</BthBox>
	);
}

function createClientSupportScreen(id: ClientSupportScreenId) {
	return function GeneratedClientSupportScreen({
		state = 'ready',
		onPrimaryAction,
		onSecondaryAction,
		onRetry,
	}: ClientGeneratedSupportScreenProps) {
		const [draftValue, setDraftValue] = React.useState('');
		const definition = clientSupportDefinitions[id];

		return (
			<DshOperationScreen
				state={state}
				title={definition.title}
				subtitle={definition.subtitle}
				content={buildSupportContent(definition, draftValue, setDraftValue)}
				primaryActionLabel={primaryLabelByKind(definition.kind)}
				secondaryActionLabel="Back to support directory"
				onPrimaryAction={onPrimaryAction}
				onSecondaryAction={onSecondaryAction}
				onRetry={onRetry}
			/>
		);
	};
}

export const clientSupportScreenRegistry: Record<ClientSupportScreenId, React.ComponentType<ClientGeneratedSupportScreenProps>> = {
	'awnak-order-create': createClientSupportScreen('awnak-order-create'),
	'booking-create': createClientSupportScreen('booking-create'),
	'chat-read-ack': createClientSupportScreen('chat-read-ack'),
	'chat-send': createClientSupportScreen('chat-send'),
	'checkout-gate': createClientSupportScreen('checkout-gate'),
	'delivery-attempt-create': createClientSupportScreen('delivery-attempt-create'),
	'delivery-attempts-list': createClientSupportScreen('delivery-attempts-list'),
	'delivery-close': createClientSupportScreen('delivery-close'),
	'delivery-eta-get': createClientSupportScreen('delivery-eta-get'),
	'delivery-get': createClientSupportScreen('delivery-get'),
	'delivery-reassign': createClientSupportScreen('delivery-reassign'),
	'delivery-track-get': createClientSupportScreen('delivery-track-get'),
	'entitlements-get': createClientSupportScreen('entitlements-get'),
	'estimate-create': createClientSupportScreen('estimate-create'),
	'estimate-get': createClientSupportScreen('estimate-get'),
	'external-order-create': createClientSupportScreen('external-order-create'),
	'gas-refill-order-create': createClientSupportScreen('gas-refill-order-create'),
	'listing-status-update': createClientSupportScreen('listing-status-update'),
	'loyalty-points-redeem': createClientSupportScreen('loyalty-points-redeem'),
	'loyalty-points-user-balance': createClientSupportScreen('loyalty-points-user-balance'),
	'loyalty-points-user-history': createClientSupportScreen('loyalty-points-user-history'),
	'order-accept': createClientSupportScreen('order-accept'),
	'order-cancel': createClientSupportScreen('order-cancel'),
	'order-complete': createClientSupportScreen('order-complete'),
	'order-create': createClientSupportScreen('order-create'),
	'order-escrow-hold': createClientSupportScreen('order-escrow-hold'),
	'order-escrow-release': createClientSupportScreen('order-escrow-release'),
	'order-get': createClientSupportScreen('order-get'),
	'order-issue-flag': createClientSupportScreen('order-issue-flag'),
	'order-proof-code-generate': createClientSupportScreen('order-proof-code-generate'),
	'order-proof-verify': createClientSupportScreen('order-proof-verify'),
	'order-rate': createClientSupportScreen('order-rate'),
	'order-receipt-get': createClientSupportScreen('order-receipt-get'),
	'order-status-get': createClientSupportScreen('order-status-get'),
	'order-status-update': createClientSupportScreen('order-status-update'),
	'pricing-preview': createClientSupportScreen('pricing-preview'),
	'pricing-snapshot-get': createClientSupportScreen('pricing-snapshot-get'),
	'promo-apply': createClientSupportScreen('promo-apply'),
	'proxy-request-create': createClientSupportScreen('proxy-request-create'),
	'proxy-request-approve': createClientSupportScreen('proxy-request-approve'),
	'proxy-request-review': createClientSupportScreen('proxy-request-review'),
	'proxy-request-reject': createClientSupportScreen('proxy-request-reject'),
	'proxy-request-tracking': createClientSupportScreen('proxy-request-tracking'),
	'review-create': createClientSupportScreen('review-create'),
	'reviews-list': createClientSupportScreen('reviews-list'),
	'service-modes-resolve': createClientSupportScreen('service-modes-resolve'),
	'shein-info': createClientSupportScreen('shein-info'),
	'subscription-family-get': createClientSupportScreen('subscription-family-get'),
	'subscription-family-members-get': createClientSupportScreen('subscription-family-members-get'),
	'subscription-family-members-post': createClientSupportScreen('subscription-family-members-post'),
	'subscription-pro-catalog': createClientSupportScreen('subscription-pro-catalog'),
	'subscription-sync': createClientSupportScreen('subscription-sync'),
	'subscription-tier-get': createClientSupportScreen('subscription-tier-get'),
	'subscription-upgrade-post': createClientSupportScreen('subscription-upgrade-post'),
	'zone-set': createClientSupportScreen('zone-set'),
};
