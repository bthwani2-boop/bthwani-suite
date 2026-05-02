import { useDirection } from '@bthwani/ui-kit';

type DshLocale = 'ar' | 'en';

const enDshControlPanelText = {
  common: {
    live: 'Live',
    liveNow: 'Direct',
    planned: 'Planned',
    controlPanel: 'Control Panel',
    operations: 'Operations',
    operationsWorkspace: 'Operations Workspace',
    openOperationsWorkspace: 'Open operations workspace',
    openGeneralOperations: 'Open general operations',
    backToHub: 'Back to DSH',
    backToOrders: 'Back to orders',
    openOrders: 'Open orders',
    openSupport: 'Open support',
      stateLoadingTitle: 'Loading assignment details',
    visibleUpdate: 'Visible refresh',
    openSheinProxy: 'Open manual assignment',
    language: 'Language',
    period: 'Period',
    activeAlerts: 'Active alerts',
    currentPath: 'Current path',
    safePath: 'Safe path',
    safeExit: 'Safe exit',
    routeGuard: 'Route guard',
    routeGuardDescription: 'No child route opens before it is actually wired, so the single safe exit remains explicit.',
    arChip: 'AR',
    enChip: 'EN'
  },
  hub: {
    topFilters: {
      today: 'Today',
      queue: 'Queue',
      peak: 'Peak'
    },
    rootEyebrow: 'Primary entry',
    rootTitle: 'DSH operations hub',
    unavailableTitle: 'The surface is not ready yet, but the safe exit remains explicit.',
    workbenchesTitle: 'DSH workbenches',
    workbenchesDescription: 'Live routes open directly, while planned routes remain visible without pretending to be ready.',
    selectedScopeTitle: 'Selected scope',
    selectedScopeDescription: 'Switching inside this hub either changes the reading state or moves you into a live route when available.',
    plannedRoutesTitle: 'Planned routes',
    plannedRoutesDescription: 'They stay visible so the next extension is legible, but never behave like live links early.',
    safeTransitionTitle: 'Safe transition',
    safeTransitionDescription: 'Returning to general operations remains the stable live exit from this surface.',
    activeAlertsDescription: 'A small visual indicator that keeps feedback clear without introducing local runtime state.',
    quickActionsTitle: 'Quick access',
    quickActionsDescription: 'Open the live DSH routes directly when you already know the next step.',
    railTitle: 'DSH',
    railStatusReady: 'Phase one',
    heroDescriptionOverview: 'A first read of the state and the safe transitions before entering any child route.',
    heroDescriptionOrders: 'The central orders queue and its related detail surfaces.',
    heroDescriptionReassign: 'Re-route orders between available resources without breaking the active path.',
    heroDescriptionPeakMode: 'A flexible capacity mode when traffic rises and extra room is needed.',
      requestLabel: 'Assignment',
    heroDescriptionSheinProxy: 'A reusable manual assignment lane for platform-owned batches.',
    heroDescriptionArrivalBell: 'Arrival and live notification settings near handoff.',
    stateLoadingTitle: 'Preparing the DSH surface',
    stateLoadingDescription: 'The structure is already visible and the path stays preserved until the next data or routes arrive.',
    stateEmptyTitle: 'No active items yet',
    stateEmptyDescription: 'This slice is still in baseline mode, and you can safely return to general operations or rebuild it later.',
    stateOfflineTitle: 'Connection temporarily unavailable',
    stateOfflineDescription: 'The surface stays clear, but child route activation is deferred until connectivity returns.',
    stateDisabledTitle: 'This route is not enabled yet',
    stateDisabledDescription: 'This landing remains preserved as part of the wave plan, but it does not open child routes before the next wiring slice.',
    stateErrorTitle: 'Unable to load the DSH surface',
    stateErrorDescription: 'You can return to the safe path or retry after the current environment is stabilized.',
    workbenches: {
      overview: {
        label: 'DSH overview',
        description: 'A first read of the state and the safe transitions before entering any child route.',
        routeHint: '/operations/dsh',
        statusLabel: 'Live'
      },
      dashboard: {
        label: 'Dashboard',
        description: 'The closure matrix and evidence rows for the control-panel surface.',
        routeHint: '/operations?workspace=dashboard',
        statusLabel: 'Live'
      },
      'captain-ops': {
        label: 'Captain ops',
        description: 'Captain readiness, proof review, and COD exceptions stay explicit.',
        routeHint: '/operations?workspace=captain-ops',
        statusLabel: 'Live'
      },
      'field-ops': {
        label: 'Field ops',
        description: 'Visits, onboarding, and geo pin review remain visible.',
        routeHint: '/operations?workspace=field-ops',
        statusLabel: 'Live'
      },
      finance: {
        label: 'Finance',
        description: 'Settlement summary and financial control remain visible.',
        routeHint: '/operations?workspace=finance',
        statusLabel: 'Live'
      },
      settlements: {
        label: 'Settlements',
        description: 'Partner and captain payouts stay grouped in one lane.',
        routeHint: '/operations?workspace=settlements',
        statusLabel: 'Live'
      },
      cod: {
        label: 'COD',
        description: 'Collected and pending cash-on-delivery items remain explicit.',
        routeHint: '/operations?workspace=cod',
        statusLabel: 'Live'
      },
      refunds: {
        label: 'Refunds',
        description: 'Refund queue visibility stays available for local review.',
        routeHint: '/operations?workspace=refunds',
        statusLabel: 'Live'
      },
      issues: {
        label: 'Issues',
        description: 'Support and dispute lanes remain ready for escalation.',
        routeHint: '/operations?workspace=issues',
        statusLabel: 'Live'
      },
      serviceability: {
        label: 'Serviceability',
        description: 'Zones, coverage, and delivery constraints remain visible.',
        routeHint: '/operations?workspace=serviceability',
        statusLabel: 'Live'
      },
      'guard-status': {
        label: 'Guard status',
        description: 'PASS/WARN/BLOCKED guard state is visible and reviewable.',
        routeHint: '/operations?workspace=guard-status',
        statusLabel: 'Live'
      },
      evidence: {
        label: 'Evidence',
        description: 'The evidence matrix stays available for closure routing.',
        routeHint: '/operations?workspace=evidence',
        statusLabel: 'Live'
      },
      orders: {
        label: 'Orders',
        description: 'The central orders queue and its related detail surfaces.',
        routeHint: '/operations/dsh/orders',
        statusLabel: 'Live'
      },
      reassign: {
        label: 'Reassign',
        description: 'Re-route orders between available resources without breaking the active path.',
        routeHint: '/operations/dsh/reassign',
        statusLabel: 'Live'
      },
      peakMode: {
        label: 'Peak mode',
        description: 'A flexible capacity mode when traffic rises and extra room is needed.',
        routeHint: '/operations/dsh/peak-mode',
        statusLabel: 'Live'
      },
      zoneSet: {
        label: 'Zone set',
        description: 'Guard the delivery scope with clearer operational boundaries.',
        routeHint: '/operations/dsh/zone-set',
        statusLabel: 'Pending wiring'
      },
      sheinProxy: {
        label: 'Manual assignment',
        description: 'A reusable assignment lane for platform-owned batches.',
        routeHint: '/operations/dsh/sheinproxy',
        statusLabel: 'Pending wiring'
      },
      arrivalBell: {
        label: 'Arrival bell',
        description: 'Arrival and live notification settings near handoff.',
        routeHint: '/operations/dsh/bell',
        statusLabel: 'Live'
      }
    },
    actions: {
      openOrders: 'Open orders',
      openArrivalBell: 'Open arrival bell',
      openReassign: 'Open reassign',
      openPeakMode: 'Open peak mode'
    }
  },
  orders: {
    pageEyebrow: 'DSH / operations / orders',
    pageTitle: 'DSH orders',
    pageDescription: 'A tighter operational queue with a single-step return path to the hub or the wider operations surface.',
    heroEyebrow: 'Operational queue',
    heroTitle: 'Open DSH orders',
    heroDescription: 'This page gives a direct operational queue, with a clear path back to the hub and a safe path back to operations.',
    stateLoadingTitle: 'Loading the orders list',
    stateLoadingDescription: 'The surface is live, and the orders state stays visible until sync completes or the source returns.',
    stateEmptyTitle: 'No open orders right now',
    stateEmptyDescription: 'The route is ready, but the current queue is temporarily empty and can safely return to the hub later.',
    stateOfflineTitle: 'Connection unavailable',
    stateOfflineDescription: 'The orders list will return when connectivity is restored, while the current path stays explicit.',
    stateDisabledTitle: 'The orders list is not enabled yet',
    stateDisabledDescription: 'This page is visually live, but richer interaction is deferred to a later wiring slice.',
    stateErrorTitle: 'Unable to load orders',
    stateErrorDescription: 'You can return to the hub or retry after the current state is stabilized.',
    badgesLabel: 'orders',
    assignedTitle: 'Assigned',
    assignedDescription: 'Orders that already have clear ownership and can move into detail directly.',
    newTitle: 'New',
    newDescription: 'Orders that entered the queue and need an initial decision.',
    reviewTitle: 'In review',
    reviewDescription: 'Orders that need a deeper read before any handoff or escalation.',
    listTitle: 'Orders list',
    listDescription: 'Each row summarizes the order, its destination, state, and estimated execution time. Opening it moves into the live detail route.',
    openDetail: 'Open details',
    etaPrefix: 'ETA'
  },
  zoneSet: {
    pageEyebrow: 'DSH / operations / zone-set',
    pageTitle: 'Zone set',
    pageDescription: 'Delivery boundaries and zone policies in a denser structure, without a fake runtime toggle.',
    unavailableDescription: 'The surface keeps a clear decision path even when data is missing or paused.',
    heroEyebrow: 'Operational boundaries',
    heroTitle: 'Zone set workspace',
    heroDescription: 'This surface shows where delivery boundaries make sense and where they should stay blocked, while keeping operations workspace as the primary contract.',
    stateLoadingTitle: 'Preparing zone set',
    stateLoadingDescription: 'The route is live, and delivery boundaries and zone policies appear once this phase completes.',
    stateEmptyTitle: 'No boundary pressure currently requires zone set',
    stateEmptyDescription: 'The situation is stable right now and no area needs boundary changes at this moment.',
    stateOfflineTitle: 'Connection unavailable',
    stateOfflineDescription: 'The path stays preserved, but zone reads will wait until connectivity returns.',
    stateDisabledTitle: 'Zone set is not fully enabled',
    stateDisabledDescription: 'This slice stabilizes reading and policy only, while actual execution stays out of scope.',
    stateErrorTitle: 'Unable to load zone set',
    stateErrorDescription: 'You can return to the hub or retry from the same path.',
    signals: {
      reviewZones: 'Review zones',
      reviewZonesDescription: 'Cases that zone set must not hide instead of solving their real issue.',
      configuredZones: 'Configured zones',
      configuredZonesDescription: 'Zones currently measured in this slice.',
      protectedZones: 'Protected zones',
      protectedZonesDescription: 'Zones that need a boundary decision or closer observation.',
      freeDeliveryZones: 'Free delivery zones',
      freeDeliveryZonesDescription: 'Visible delivery space that can absorb activity when needed.'
    },
    policiesTitle: 'Zone set policies',
    policiesDescription: 'These rules define where this surface stops: reading and policy only, no hidden mutation.',
    lanesTitle: 'Boundary zones',
    lanesDescription: 'Each card gives a fast read of load, capacity, and recommendation without pretending direct enablement exists here.'
  },
  sheinProxyRequestLegacy: {
    pageEyebrow: 'DSH / operations / assignment / detail',
    pageTitlePrefix: 'Assignment details',
    pageDescription: 'A compact view of the current manual assignment with a clear path to estimate, offer, and schedule.',
    unavailableDescription: 'The route stays explicit even when assignment details are not ready.',
    heroEyebrow: 'Manual assignment',
    identityTitle: 'Assignment identity',
    identityDescription: 'The core data that anchors the current assignment before moving to the next step.',
    pricingDescription: 'A single place for amount, shipping, fee, and the visible total.',
    timelineDescription: 'The timeline shows where the assignment is now and what the closest next step is.',
    stateLoadingTitle: 'Loading assignment details',
    nextStepDescription: 'The surface suggests the next action based on the assignment stage.',
    stateLoadingDescription: 'The route is live, and the assignment details appear once this data slice loads.',
    stateEmptyTitle: 'Assignment not found',
    stateEmptyDescription: 'The requested id does not match an assignment currently in this queue.',
    stateOfflineTitle: 'Connection unavailable',
    stateOfflineDescription: 'Assignment details will return when connectivity is restored while the path remains explicit.',
    stateDisabledTitle: 'Assignment details are not enabled yet',
    stateDisabledDescription: 'This surface is visually ready, but deeper assignment actions are deferred to a later slice.',
    stateErrorTitle: 'Unable to load assignment details',
    stateErrorDescription: 'You can return to the queue or retry from the same path.',
    stageLabels: {
      detail: 'Detail',
      estimate: 'Estimate',
      offer: 'Offer',
      schedule: 'Schedule'
    },
    stageDescriptions: {
      detail: 'Review the assignment identity and core details.',
      estimate: 'Check the estimate before sending the offer.',
      offer: 'The offer is out and waiting for a decision.',
      schedule: 'Lock the pickup or delivery window.'
    },
    statusLabels: {
      underReview: 'Under review',
      estimated: 'Estimated',
      offered: 'Offer sent',
      scheduled: 'Scheduled',
      approved: 'Approved',
      cancelled: 'Cancelled'
    },
    nextActionLabels: {
      underReview: 'Open estimate',
      estimated: 'Send offer',
      offered: 'Await customer response',
      scheduled: 'Check pickup window',
      approved: 'Prepare handoff',
      cancelled: 'Review cancellation'
    },
    requestLabel: 'Assignment',
    customerLabel: 'Customer',
    productLabel: 'Product',
    quantityLabel: 'Quantity',
    statusLabel: 'Status',
    amountLabel: 'Amount',
    shippingLabel: 'Shipping',
    serviceFeeLabel: 'Service fee',
    totalLabel: 'Total',
    updatedLabel: 'Updated',
    nextActionLabel: 'Next action',
    pricingTitle: 'Pricing breakdown',
    noteLabel: 'Operational note',
    retryLabel: 'Retry',
    backToList: 'Back to list',
    openHub: 'Back to hub',
    openOperations: 'Open operations',
    openSupport: 'Open support',
    openDetail: 'Open detail',
    openEstimate: 'Open estimate',
    openOffer: 'Open offer',
    openSchedule: 'Open schedule'
  },
  orderDetail: {
    pageEyebrow: 'DSH / operations / orders / detail',
    pageTitlePrefix: 'Order',
    pageDescription: 'Order identity, arrival sequence, and next action in a denser layout with less repetition.',
    unavailableDescription: 'The surface keeps a clear exit back to the orders list even when data is missing or paused.',
    heroEyebrow: 'Operational detail',
    backToOrders: 'Back to orders',
    stateLoadingTitlePrefix: 'Loading order',
    stateLoadingDescription: 'The route is live, and the order detail appears as soon as loading completes or you retry.',
    stateEmptyTitlePrefix: 'Order',
    stateEmptyTitleSuffix: 'was not found',
    stateEmptyDescription: 'The requested identifier does not exist in the current queue, and you can safely return to the orders list.',
    stateOfflineTitle: 'Connection unavailable',
    stateOfflineDescription: 'Order detail returns after connectivity is restored while the current path remains explicit.',
    stateDisabledTitle: 'Detail is not enabled yet',
    stateDisabledDescription: 'This surface is visually ready, but some deeper execution actions are deferred to a later slice.',
    stateErrorTitle: 'Unable to load order detail',
    stateErrorDescription: 'You can return to the orders list or retry from the same path.',
    signals: {
      status: 'Status',
      statusDescription: 'The current state of this order inside the operational queue.',
      destination: 'Destination',
      destinationDescription: 'The reference drop-off point for this order.',
      eta: 'ETA',
      etaDescription: 'The current estimated time to completion or handling.',
      amount: 'Value',
      amountDescription: 'The current displayed amount in this visual slice.'
    },
    identityTitle: 'Order identity',
    identityDescription: 'A stable summary of the identifier, route, and the main operational note.',
    routeLabel: 'Route',
    finalDestinationLabel: 'Final destination',
    noteLabel: 'Operational note',
    arrivalTitle: 'Arrival sequence',
    arrivalDescription: 'Shows arrival, ring activity, acknowledgement, and any active block reason.',
    arrivedLabel: 'Arrival',
    ringLogLabel: 'Ring log',
    acknowledgementLabel: 'Customer acknowledgement',
    cooldownLabel: 'Cooldown and block reason',
    noArrivalData: 'No arrival data yet',
    noRingsYet: 'No attempts yet',
    noAcknowledgementYet: 'No acknowledgement has arrived yet',
    unavailable: 'Unavailable',
    noCurrentBlock: 'No current block',
    ringAttempts: 'attempts',
    openArrivalBellWorkspace: 'Open arrival bell workspace',
    decisionTitle: 'Operational decision',
    decisionDescription: 'What the primary action is now, and which alternatives remain acceptable in this path.',
    primaryActionLabel: 'Primary action',
    secondaryActionLabel: 'Secondary action',
    supportPathLabel: 'Support path',
    openReassignWorkspace: 'Open reassign workspace'
  },
  sheinProxy: {
    pageEyebrow: 'DSH / operations / manual assignment',
    pageTitle: 'Manual assignment',
    pageDescription: 'A compact queue for reusable manual assignments with route review and next-step decisions.',
    unavailableDescription: 'The route stays explicit even when assignments are paused or not ready.',
    heroEyebrow: 'Assignment queue',
    heroTitle: 'Manual assignment requests',
    heroDescription: 'This surface keeps general assignments readable and points to the next operational step without pretending to mutate state.',
    stateLoadingTitle: 'Preparing the manual assignment queue',
    stateLoadingDescription: 'The route is live, and the assignment list appears once the current data slice loads.',
    stateEmptyTitle: 'No manual assignments right now',
    stateEmptyDescription: 'The queue is ready, but there are no active manual assignments to review at the moment.',
    stateOfflineTitle: 'Connection unavailable',
    stateOfflineDescription: 'The manual assignment queue returns when connectivity is restored while the path remains explicit.',
    stateDisabledTitle: 'The manual assignment queue is not enabled yet',
    stateDisabledDescription: 'This surface is visually ready, but deeper assignment actions are deferred to a later slice.',
    stateErrorTitle: 'Unable to load the manual assignment queue',
    stateErrorDescription: 'You can return to the hub or retry from the same path.',
    signals: {
      pending: 'Under review',
      pendingDescription: 'Requests waiting for an initial decision.',
      estimated: 'Estimated',
      estimatedDescription: 'Requests with a pricing estimate ready.',
      offered: 'Offer sent',
      offeredDescription: 'Requests awaiting customer response.',
      scheduled: 'Scheduled',
      scheduledDescription: 'Requests already assigned a pickup window.'
    },
    statusLabels: {
      underReview: 'Under review',
      estimated: 'Estimated',
      offered: 'Offer sent',
      scheduled: 'Scheduled',
      approved: 'Approved',
      cancelled: 'Cancelled'
    },
    nextActionLabels: {
      underReview: 'Open estimate',
      estimated: 'Send offer',
      offered: 'Await customer response',
      scheduled: 'Check pickup window',
      approved: 'Prepare handoff',
      cancelled: 'Review cancellation'
    },
    tableTitle: 'Manual assignments',
    tableDescription: 'Each row shows the assignment, its pricing state, and the next action candidate.',
    allRequestsLabel: 'All assignments',
    tableEmptyTitle: 'No assignments match this filter',
    tableEmptyDescription: 'Try another queue slice or return to the full list.',
    selectedTitle: 'Selected assignment',
    selectedDescription: 'A compact breakdown of the currently focused assignment.',
    requestLabel: 'Assignment',
    customerLabel: 'Customer',
    productLabel: 'Product',
    quantityLabel: 'Quantity',
    statusLabel: 'Status',
    amountLabel: 'Amount',
    shippingLabel: 'Shipping',
    serviceFeeLabel: 'Service fee',
    totalLabel: 'Total',
    updatedLabel: 'Updated',
    nextActionLabel: 'Next action',
    pricingTitle: 'Pricing breakdown',
    notesLabel: 'Operational note',
    inspectRequest: 'Inspect assignment',
    retryLabel: 'Retry',
    backToList: 'Back to list',
    backToHub: 'Back to hub'
  },
  sheinProxyRequest: {
    pageEyebrow: 'DSH / operations / assignment / detail',
    pageTitlePrefix: 'Assignment details',
    pageDescription: 'A compact view of the current manual assignment with a clear path to estimate, offer, and schedule.',
    unavailableDescription: 'The route stays explicit even when assignment details are not ready.',
    heroEyebrow: 'Manual assignment',
    identityTitle: 'Assignment identity',
    identityDescription: 'The core data that anchors the current assignment before moving to the next step.',
    pricingDescription: 'A single place for amount, shipping, fee, and the visible total.',
    timelineDescription: 'The timeline shows where the assignment is now and what the closest next step is.',
    nextStepTitle: 'Next step',
    nextStepDescription: 'The surface suggests the next action based on the assignment stage.',
    stateLoadingTitle: 'Loading assignment details',
    stateLoadingDescription: 'The route is live, and the assignment details appear once this data slice loads.',
    stateEmptyTitle: 'Assignment not found',
    stateEmptyDescription: 'The requested id does not match an assignment currently in this queue.',
    stateOfflineTitle: 'Connection unavailable',
    stateOfflineDescription: 'Assignment details will return when connectivity is restored while the path remains explicit.',
    stateDisabledTitle: 'Assignment details are not enabled yet',
    stateDisabledDescription: 'This surface is visually ready, but deeper assignment actions are deferred to a later slice.',
    stateErrorTitle: 'Unable to load assignment details',
    stateErrorDescription: 'You can return to the queue or retry from the same path.',
    stageLabels: {
      detail: 'Detail',
      estimate: 'Estimate',
      offer: 'Offer',
      schedule: 'Schedule'
    },
    stageDescriptions: {
      detail: 'Review the request identity and core details.',
      estimate: 'Check the estimate before sending the offer.',
      offer: 'The offer is out and waiting for a decision.',
      schedule: 'Lock the pickup or delivery window.'
    },
    statusLabels: {
      underReview: 'Under review',
      estimated: 'Estimated',
      offered: 'Offer sent',
      scheduled: 'Scheduled',
      approved: 'Approved',
      cancelled: 'Cancelled'
    },
    nextActionLabels: {
      underReview: 'Open estimate',
      estimated: 'Send offer',
      offered: 'Await customer response',
      scheduled: 'Check pickup window',
      approved: 'Prepare handoff',
      cancelled: 'Review cancellation'
    },
    requestLabel: 'Request',
    customerLabel: 'Customer',
    productLabel: 'Product',
    quantityLabel: 'Quantity',
    statusLabel: 'Status',
    amountLabel: 'Amount',
    shippingLabel: 'Shipping',
    serviceFeeLabel: 'Service fee',
    totalLabel: 'Total',
    updatedLabel: 'Updated',
    nextActionLabel: 'Next action',
    pricingTitle: 'Pricing breakdown',
    noteLabel: 'Operational note',
    retryLabel: 'Retry',
    backToList: 'Back to list',
    openHub: 'Back to hub',
    openOperations: 'Open operations',
    openSupport: 'Open support',
    openDetail: 'Open detail',
    openEstimate: 'Open estimate',
    openOffer: 'Open offer',
    openSchedule: 'Open schedule'
  },
  reassign: {
    pageEyebrow: 'DSH / operations / reassign',
    pageTitle: 'Reassign',
    pageDescription: 'A denser reading of transfer decisions without introducing a fake operational submit path.',
    unavailableDescription: 'The route stays explicit even when cases are missing or paused.',
    heroEyebrow: 'Operational decision',
    heroTitle: 'Reassign workspace',
    heroDescription: 'This surface makes the decision clear: who needs a transfer, why, and what fallback is suggested, while keeping execution out of this slice.',
    stateLoadingTitle: 'Preparing the reassign surface',
    stateLoadingDescription: 'The route is live, and the decision and candidates appear once this phase completes.',
    stateEmptyTitle: 'No reassign cases right now',
    stateEmptyDescription: 'The current queue does not contain active transfer decisions at the moment.',
    stateOfflineTitle: 'Connection unavailable',
    stateOfflineDescription: 'The route is preserved, but reassign cases do not update until connectivity returns.',
    stateDisabledTitle: 'Reassign is not fully enabled',
    stateDisabledDescription: 'This slice stabilizes reading and decision only, while actual execution is deferred.',
    stateErrorTitle: 'Unable to load the reassign surface',
    stateErrorDescription: 'You can return to the hub or retry from the same path.',
    signals: {
      active: 'Active cases',
      activeDescription: 'Orders with visible operational pressure or a clear transfer candidate.',
      urgent: 'Urgent cases',
      urgentDescription: 'Need a fast decision before they become delay or escalation.',
      blocked: 'Blocked cases',
      blockedDescription: 'Need a broader workspace or support before any next step.',
      fallbacks: 'Ready fallbacks',
      fallbacksDescription: 'Captains or backup routes already visible inside this slice.'
    },
    candidatesTitle: 'Reassign candidates',
    candidatesDescription: 'Each card shows the delivery, linked order, reason, priority, and suggested fallback without pretending a runtime mutation exists.',
    currentCaptainLabel: 'Current',
    fallbackCaptainLabel: 'Fallback',
    decisionTitle: 'Decision logic',
    decisionDescription: 'The goal here is not execution, but decision ordering: when to return to the workspace, when to review orders, and when to escalate.',
    primaryDecisionTitle: 'Primary action',
    primaryDecisionLabel: 'Open operations workspace',
    primaryDecisionDescription: 'The contract is explicit: opening the operations workspace remains the primary exit after reading the decision.',
    secondaryDecisionTitle: 'Secondary action',
    secondaryDecisionLabel: 'Return to orders',
    secondaryDecisionDescription: 'Going back to the queue is useful when you want to compare more than one case before a transfer.',
    supportDecisionTitle: 'Support path',
    supportDecisionLabel: 'Escalate blocked cases only',
    supportDecisionDescription: 'Escalation remains for blocked cases that cannot be resolved from this surface.'
  },
  peakMode: {
    pageEyebrow: 'DSH / operations / peak-mode',
    pageTitle: 'Peak mode',
    pageDescription: 'Pressure zones and policies in a denser structure, without a fake runtime toggle.',
    unavailableDescription: 'The surface keeps a clear decision path even when data is missing or paused.',
    heroEyebrow: 'Operational capacity',
    heroTitle: 'Peak mode workspace',
    heroDescription: 'This surface shows where capacity expansion makes sense and where it should be blocked, while keeping open operations workspace as the primary contract.',
    stateLoadingTitle: 'Preparing peak mode',
    stateLoadingDescription: 'The route is live, and pressure zones and capacity policies appear once this phase completes.',
    stateEmptyTitle: 'No pressure currently requires peak mode',
    stateEmptyDescription: 'The situation is stable right now and no area needs capacity expansion at this moment.',
    stateOfflineTitle: 'Connection unavailable',
    stateOfflineDescription: 'The route stays preserved, but pressure and capacity readings will not update until connectivity returns.',
    stateDisabledTitle: 'Peak mode is not fully enabled',
    stateDisabledDescription: 'This slice stabilizes reading and policy only, while actual execution stays out of scope.',
    stateErrorTitle: 'Unable to load peak mode',
    stateErrorDescription: 'You can return to the hub or retry from the same path.',
    signals: {
      activeZones: 'Active zones',
      activeZonesDescription: 'Zones currently measured in this slice.',
      pressureZones: 'Pressure zones',
      pressureZonesDescription: 'Zones that need a capacity decision or closer observation.',
      flexCaptains: 'Flex captains',
      flexCaptainsDescription: 'Visible reserve that can absorb part of the pressure when needed.',
      protectedQueues: 'Protected queues',
      protectedQueuesDescription: 'Cases that peak mode must not hide instead of solving their real issue.'
    },
    policiesTitle: 'Peak mode policies',
    policiesDescription: 'These rules define where this surface stops: reading and policy only, no hidden mutation.',
    lanesTitle: 'Pressure zones',
    lanesDescription: 'Each card gives a fast read of load, capacity, and recommendation without pretending direct enablement exists here.'
  },
  arrivalBell: {
    pageEyebrow: 'DSH / operations / arrival-bell',
    pageTitle: 'Arrival bell',
    pageDescription: 'Arrival and ring cases in a clearer, denser reading without any local direction override.',
    unavailableDescription: 'The route remains explicit even when data is not ready or available.',
    heroEyebrow: 'Operational workspace',
    heroTitle: 'Arrival bell workspace',
    heroDescription: 'This surface does not execute runtime actions, but it stabilizes the correct operational reading and gives a real path from the hub into arrival states.',
    stateLoadingTitle: 'Preparing arrival bell workspace',
    stateLoadingDescription: 'The structure is present, and the captain and customer lanes appear once this slice completes.',
    stateEmptyTitle: 'No arrival bell cases right now',
    stateEmptyDescription: 'The route is live, but there are no arrival or ring states needing attention at this moment.',
    stateOfflineTitle: 'Connection unavailable',
    stateOfflineDescription: 'The route stays explicit, but arrival and ring states do not refresh until connectivity returns.',
    stateDisabledTitle: 'Arrival bell is not fully enabled',
    stateDisabledDescription: 'This slice stabilizes reading and navigation only, while deeper execution comes later.',
    stateErrorTitle: 'Unable to load arrival bell',
    stateErrorDescription: 'You can return to the hub or retry from the same path without losing orientation.',
    signals: {
      activeArrivals: 'Active arrivals',
      activeArrivalsDescription: 'Cases with a real presence inside the arrival workflow.',
      awaitingAcknowledgement: 'Awaiting acknowledgement',
      awaitingAcknowledgementDescription: 'Orders where the captain arrived but the customer has not confirmed yet.',
      blockedRings: 'Blocked rings',
      blockedRingsDescription: 'Cases under cooldown or an operational block that must not become a fake CTA.',
      resolvedToday: 'Resolved today',
      resolvedTodayDescription: 'A visual daily closure indicator only inside this slice.'
    },
    captainLaneTitle: 'Captain lane',
    captainLaneDescription: 'Shows who arrived, who rang, and which cases need a broader ops decision instead of repeating the local attempt.',
    customerLaneTitle: 'Customer lane',
    customerLaneDescription: 'Shows acknowledgement, silence, and the cases that should return to the wider workspace instead of pushing into a missing detail path.'
  },
  fixtures: {
    orders: {
      rows: [
        {
          id: 'ORD-24018',
          customer: 'Direct customer',
          route: 'Central warehouse -> Nakheel district',
          amount: '62.00 SAR',
          eta: '14 min',
          statusLabel: 'New',
          statusTone: 'brand',
          createdLabel: '10:14 AM',
          destinationLabel: 'Nakheel district - Street 4',
          captainLabel: 'Unassigned',
          notes: 'This order needs a fast assignment opening from the primary queue.'
        },
        {
          id: 'ORD-24019',
          customer: 'Trial customer',
          route: 'East warehouse -> Street 12',
          amount: '48.50 SAR',
          eta: '22 min',
          statusLabel: 'Confirmed',
          statusTone: 'success',
          createdLabel: '10:26 AM',
          destinationLabel: 'Street 12 - Almasa tower',
          captainLabel: 'Captain Samer',
          notes: 'The order is confirmed and moving within a normal ETA.'
        },
        {
          id: 'ORD-24020',
          customer: 'Recovery customer',
          route: 'West warehouse -> Industrial zone',
          amount: '91.75 SAR',
          eta: '31 min',
          statusLabel: 'Needs review',
          statusTone: 'warning',
          createdLabel: '10:41 AM',
          destinationLabel: 'Industrial zone - Gate 3',
          captainLabel: 'Under review',
          notes: 'The address is clear, but the order needs captain capability confirmation before assignment.'
        },
        {
          id: 'ORD-24021',
          customer: 'VIP customer',
          route: 'Main hub -> Coastal road',
          amount: '124.00 SAR',
          eta: '41 min',
          statusLabel: 'Suspended',
          statusTone: 'danger',
          createdLabel: '10:55 AM',
          destinationLabel: 'Coastal road - Marina gate',
          captainLabel: 'Assignment stopped',
          notes: 'The order is paused until the suspension reason is reviewed and operational escalation is resolved.'
        }
      ],
      arrivalTimelines: {
        'ORD-24018': {
          arrived: false,
          arrivedLabel: 'Not arrived yet',
          ringCount: 0,
          lastRingLabel: 'No ring yet',
          acknowledged: false,
          acknowledgedLabel: 'Customer has not acknowledged yet',
          cooldownLabel: 'Available now',
          blockReason: 'No current block'
        },
        'ORD-24019': {
          arrived: true,
          arrivedLabel: 'Arrived at 10:42 AM',
          ringCount: 1,
          lastRingLabel: 'Last ring at 10:43 AM',
          acknowledged: true,
          acknowledgedLabel: 'Customer acknowledged at 10:44 AM',
          cooldownLabel: 'Cooldown ended',
          blockReason: 'No current block'
        },
        'ORD-24020': {
          arrived: true,
          arrivedLabel: 'Arrived at 10:58 AM',
          ringCount: 2,
          lastRingLabel: 'Last ring at 11:01 AM',
          acknowledged: false,
          acknowledgedLabel: 'No customer acknowledgement',
          cooldownLabel: 'Cooldown until 11:04 AM',
          blockReason: 'Waiting for ops review before another ring'
        },
        'ORD-24021': {
          arrived: false,
          arrivedLabel: 'Arrival blocked',
          ringCount: 0,
          lastRingLabel: 'Suspended',
          acknowledged: false,
          acknowledgedLabel: 'No acknowledgement',
          cooldownLabel: 'Unavailable',
          blockReason: 'The order is suspended and needs operational escalation before any new attempt'
        }
      },
      actionPlans: {
        brand: {
          primaryLabel: 'Open operations workspace',
          primaryDescription: 'The order is new and needs a fast entry into the wider operational workspace before any deeper step.',
          secondaryLabel: 'Review the orders queue',
          secondaryDescription: 'Returning to the list helps compare this order against the rest of the open cases.',
          supportLabel: 'Escalate to support',
          supportDescription: 'Support remains a fallback path if the decision stalls or the inputs change.'
        },
        warning: {
          primaryLabel: 'Open operations workspace',
          primaryDescription: 'This case needs a clear ops decision before another ring or continued assignment.',
          secondaryLabel: 'Return to orders for comparison',
          secondaryDescription: 'Going back to the queue helps measure this review against other cases.',
          supportLabel: 'Transfer to support',
          supportDescription: 'Support is appropriate when the review cannot be resolved from inside this surface.'
        },
        danger: {
          primaryLabel: 'Open operations workspace',
          primaryDescription: 'The order is suspended, and the best first step is to move back into the wider workspace for a broader decision.',
          secondaryLabel: 'Open the orders queue',
          secondaryDescription: 'Returning to the queue gives a broader view of nearby critical cases.',
          supportLabel: 'Open support now',
          supportDescription: 'Escalation is appropriate here because it shortens the path when suspension continues without a direct fix.'
        },
        defaultPlan: {
          primaryLabel: 'Open operations workspace',
          primaryDescription: 'The order is relatively stable, but this surface still points back to the wider workspace as the contract-compliant primary action.',
          secondaryLabel: 'Return to the orders list',
          secondaryDescription: 'Returning to the list makes it easier to continue through the queue or move to another order.',
          supportLabel: 'Open support',
          supportDescription: 'Support remains a secondary path when a human or operational exception is needed.'
        }
      }
    },
    peakMode: {
      summary: {
        activeZones: 5,
        pressureZones: 2,
        flexCaptains: 11,
        protectedQueues: 3
      },
      policies: [
        {
          label: 'Multi-order capacity',
          statusLabel: 'Suggested only',
          description: 'This surface shows where a logical capacity expansion fits, but it does not mutate runtime state directly.'
        },
        {
          label: 'Sensitive queue protection',
          statusLabel: 'Protected',
          description: 'Critical or blocked orders stay outside any capacity expansion so peak mode does not hide the real issue.'
        },
        {
          label: 'Return to workspace',
          statusLabel: 'Required',
          description: 'The contract requires opening the operations workspace as the primary exit after reading the decision.'
        }
      ],
      lanes: [
        {
          zoneLabel: 'Nakheel district',
          loadLabel: 'High pressure',
          captainCapacityLabel: '4 flex captains',
          queueLabel: '12 open orders',
          recommendationLabel: 'Good candidate for expansion',
          note: 'This area fits peak mode because fallbacks are ready and the pressure is temporary, not structural.',
          tone: 'warning'
        },
        {
          zoneLabel: 'Coastal road',
          loadLabel: 'Critical pressure',
          captainCapacityLabel: 'Limited fallback',
          queueLabel: '7 orders with friction',
          recommendationLabel: 'Do not enable before deeper review',
          note: 'Pressure here may hide a deeper operational issue, so this surface must not expose a direct toggle.',
          tone: 'danger'
        },
        {
          zoneLabel: 'Street 12',
          loadLabel: 'Manageable pressure',
          captainCapacityLabel: '3 flex captains',
          queueLabel: '5 active orders',
          recommendationLabel: 'Monitor only',
          note: 'Observation is enough for now without expansion or escalation.',
          tone: 'brand'
        },
        {
          zoneLabel: 'Industrial zone',
          loadLabel: 'Stable',
          captainCapacityLabel: 'Reserve available',
          queueLabel: '3 orders',
          recommendationLabel: 'Ready if needed',
          note: 'This area holds spare capacity but does not need immediate activation.',
          tone: 'success'
        }
      ]
    },
    reassign: {
      summary: {
        activeCases: 6,
        urgentCases: 2,
        blockedCases: 1,
        readyFallbacks: 4
      },
      candidates: [
        {
          deliveryId: 'DEL-8102',
          orderId: 'ORD-24020',
          currentCaptain: 'Field captain',
          fallbackCaptain: 'Captain Nawaf',
          reasonLabel: 'Traffic congestion',
          priorityLabel: 'Urgent',
          statusLabel: 'Needs a decision now',
          note: 'The likely path is to move into a ready fallback within a short window.',
          tone: 'warning'
        },
        {
          deliveryId: 'DEL-8103',
          orderId: 'ORD-24021',
          currentCaptain: 'Assignment paused',
          fallbackCaptain: 'Not defined',
          reasonLabel: 'Operational suspension',
          priorityLabel: 'Urgent',
          statusLabel: 'Blocked',
          note: 'This case needs a wider workspace or support before any real transfer.',
          tone: 'danger'
        },
        {
          deliveryId: 'DEL-8104',
          orderId: 'ORD-24019',
          currentCaptain: 'Captain Samer',
          fallbackCaptain: 'Captain Rashid',
          reasonLabel: 'Customer request',
          priorityLabel: 'Normal',
          statusLabel: 'Fallback ready',
          note: 'The decision is clear and can be tracked from the operations workspace without runtime mutation now.',
          tone: 'success'
        },
        {
          deliveryId: 'DEL-8105',
          orderId: 'ORD-24018',
          currentCaptain: 'Unassigned',
          fallbackCaptain: 'Fast captain',
          reasonLabel: 'No captain available',
          priorityLabel: 'Normal',
          statusLabel: 'Candidate',
          note: 'This case fits an early queue decision before it turns into friction.',
          tone: 'brand'
        }
      ]
    },
    arrivalBell: {
      summary: {
        activeArrivals: 7,
        awaitingAcknowledgement: 3,
        blockedRings: 2,
        resolvedToday: 18
      },
      captainLane: [
        {
          orderId: 'ORD-24019',
          actorLabel: 'Captain Samer',
          statusLabel: 'Arrived and logged arrival',
          etaLabel: '2 min ago',
          ringLabel: 'One ring',
          actionHint: 'Awaiting customer acknowledgement or wider workspace follow-up.',
          tone: 'success'
        },
        {
          orderId: 'ORD-24020',
          actorLabel: 'Field captain',
          statusLabel: 'Arrived but ringing is restricted',
          etaLabel: '5 min ago',
          ringLabel: '2 rings',
          actionHint: 'An active cooldown exists and needs an ops decision before another ring.',
          tone: 'warning'
        },
        {
          orderId: 'ORD-24021',
          actorLabel: 'Assignment paused',
          statusLabel: 'Arrival is disrupted',
          etaLabel: 'Unavailable',
          ringLabel: 'No attempts',
          actionHint: 'This is an escalation case and must not become a fake operational CTA.',
          tone: 'danger'
        }
      ],
      customerLane: [
        {
          orderId: 'ORD-24019',
          actorLabel: 'Customer acknowledged arrival',
          statusLabel: 'I am coming',
          etaLabel: '10:44 AM',
          ringLabel: 'Acknowledged',
          actionHint: 'The wider queue can continue while this case remains visible.',
          tone: 'success'
        },
        {
          orderId: 'ORD-24018',
          actorLabel: 'No notice yet',
          statusLabel: 'Waiting for first ring',
          etaLabel: '14 min',
          ringLabel: '0 rings',
          actionHint: 'This case is still early and does not need support or escalation yet.',
          tone: 'brand'
        },
        {
          orderId: 'ORD-24020',
          actorLabel: 'No acknowledgement',
          statusLabel: 'Needs follow-up',
          etaLabel: '11:04 AM',
          ringLabel: '2 rings',
          actionHint: 'This case should return to the wider workspace to decide the next step.',
          tone: 'warning'
        }
      ]
    },
    zoneSet: {
      summary: {
        configuredZones: 5,
        protectedZones: 2,
        freeDeliveryZones: 4,
        reviewZones: 3
      },
      policies: [
        {
          label: 'Read first',
          statusLabel: 'Disciplined',
          description: 'This surface shows where reading ends and broader operational decision-making begins.'
        },
        {
          label: 'Protect sensitive zones',
          statusLabel: 'Protected',
          description: 'Sensitive zones stay protected instead of turning into a fake toggle or shortcut.'
        },
        {
          label: 'Free delivery space',
          statusLabel: 'Available',
          description: 'Free zones stay visible as absorbable capacity when demand rises.'
        }
      ],
      lanes: [
        {
          zoneLabel: 'Nakheel district',
          feeLabel: 'Visible fee',
          etaLabel: '14 min',
          statusLabel: 'Good for review',
          recommendationLabel: 'Initial candidate',
          note: 'This zone needs a clear read before any expansion.',
          tone: 'warning'
        },
        {
          zoneLabel: 'Coastal road',
          feeLabel: 'Higher fee',
          etaLabel: '31 min',
          statusLabel: 'Protected',
          recommendationLabel: 'Do not open now',
          note: 'This lane needs a wider boundary decision instead of a direct open.',
          tone: 'danger'
        },
        {
          zoneLabel: 'Street 12',
          feeLabel: 'Stable fee',
          etaLabel: '22 min',
          statusLabel: 'Ready',
          recommendationLabel: 'Monitor only',
          note: 'The zone is balanced and does not need extra movement right now.',
          tone: 'success'
        },
        {
          zoneLabel: 'Industrial zone',
          feeLabel: 'Flexible fee',
          etaLabel: '19 min',
          statusLabel: 'Expandable',
          recommendationLabel: 'Available when needed',
          note: 'This lane keeps spare capacity ready when pressure rises.',
          tone: 'brand'
        }
      ]
    }
  }
};

export type DshControlPanelText = typeof enDshControlPanelText;

const arDshControlPanelText = {
  common: {
    live: 'حي',
    liveNow: 'مباشر',
    planned: 'مخطط',
    controlPanel: 'لوحة التحكم',
    operations: 'العمليات',
    operationsWorkspace: 'مساحة العمليات',
    openOperationsWorkspace: 'افتح مساحة العمليات',
    openGeneralOperations: 'افتح العمليات العامة',
    backToHub: 'العودة إلى مركز DSH',
    backToOrders: 'العودة إلى الطلبات',
    openOrders: 'افتح الطلبات',
    openSupport: 'افتح الدعم',
    safePath: 'المسار الآمن',
    visibleUpdate: 'آخر تحديث مرئي',
    openSheinProxy: 'افتح الإسناد اليدوي',
    language: 'اللغة',
    period: 'الفترة',
    activeAlerts: 'التنبيهات النشطة',
    currentPath: 'المسار الحالي',
    safeExit: 'الخروج الآمن',
    routeGuard: 'حارس المسار',
    routeGuardDescription: 'لا يُفتح أي مسار فرعي قبل تثبيته، لذلك يبقى الخروج الحي الوحيد واضحًا وآمنًا.',
    arChip: 'AR',
    enChip: 'EN'
  },
  hub: {
    topFilters: {
      today: 'اليوم',
      queue: 'الطابور',
      peak: 'الذروة'
    },
    rootEyebrow: 'الهبوط الرئيسي',
    rootTitle: 'مركز تشغيل DSH',
    unavailableTitle: 'السطح غير جاهز بعد لكن مسار الرجوع الآمن يبقى واضحًا.',
    workbenchesTitle: 'مساحات DSH',
    workbenchesDescription: 'المسارات الحية تفتح مباشرة، أما المسارات المخططة فتظل مرئية فقط حتى لا يظهر أي وعد ناقص في العربية أو الإنجليزية.',
    selectedScopeTitle: 'المجال المختار',
    selectedScopeDescription: 'التبديل داخل هذا المركز يغيّر القراءة فقط أو ينقلك إلى المسار الحي عندما يكون متاحًا.',
    plannedRoutesTitle: 'المسارات المخططة',
    plannedRoutesDescription: 'تبقى مرئية حتى لا يضيع الامتداد القادم، لكنها لا تتصرف كروابط حية قبل الجاهزية.',
    safeTransitionTitle: 'الانتقال الآمن',
    safeTransitionDescription: 'الرجوع إلى العمليات العامة يبقى الخروج الحي الثابت من هذا السطح.',
    activeAlertsDescription: 'مؤشر مرئي بسيط يحافظ على تغذية راجعة واضحة دون حالة تشغيل محلية أو موازية.',
    quickActionsTitle: 'وصول سريع',
    quickActionsDescription: 'افتح مسارات DSH الحية مباشرة عندما تكون الخطوة التالية معروفة بالفعل.',
    railTitle: 'DSH',
    railStatusReady: 'المرحلة الأولى',
    heroDescriptionOverview: 'لقطة أولى للحالة والانتقالات الآمنة قبل الدخول في أي مسار فرعي.',
    heroDescriptionOrders: 'الطابور المركزي للطلبات والتفاصيل المرتبطة بها.',
    heroDescriptionReassign: 'تحويل الطلبات بين الموارد المتاحة بدون كسر المسار الحالي.',
    heroDescriptionPeakMode: 'تشغيل مرن عندما ترتفع الحركة وتحتاج سعة إضافية.',
    heroDescriptionZoneSet: 'تقييد النطاقات وتشغيلها بوضوح تشغيلي أعلى.',
    heroDescriptionSheinProxy: 'مسار إسناد يدوي عام للدفعات المملوكة للمنصة.',
    heroDescriptionArrivalBell: 'إعدادات الوصول والتنبيهات الحية عند الاقتراب من التسليم.',
    stateLoadingTitle: 'جار تجهيز سطح DSH',
    stateLoadingDescription: 'الهيكل مرئي الآن، وسيبقى المسار محفوظًا حتى تكتمل البيانات أو الروابط التالية.',
    stateEmptyTitle: 'لا توجد عناصر مفعلة بعد',
    stateEmptyDescription: 'هذا المسار ما يزال في الوضع الأساسي، ويمكنك الرجوع إلى العمليات العامة أو إعادة البناء في خطوة لاحقة.',
    stateOfflineTitle: 'الاتصال غير متاح مؤقتًا',
    stateOfflineDescription: 'السطح يبقى واضحًا، لكن تفعيل المسارات الفرعية مؤجل حتى تعود الشبكة أو يكتمل الربط.',
    stateDisabledTitle: 'المسار غير مفعّل بعد',
    stateDisabledDescription: 'هذا الهبوط محفوظ كجزء من الخطة المرحلية لكنه لا يفتح المسارات الفرعية قبل خطوة الربط التالية.',
    stateErrorTitle: 'تعذر تحميل سطح DSH',
    stateErrorDescription: 'يمكنك العودة إلى المسار الآمن أو إعادة المحاولة بعد تثبيت البيئة الحالية.',
    workbenches: {
      overview: {
        label: 'نظرة عامة على DSH',
        description: 'لقطة أولى للحالة والانتقالات الآمنة قبل الدخول في أي مسار فرعي.',
        routeHint: '/operations/dsh',
        statusLabel: 'حي'
      },
      dashboard: {
        label: 'لوحة الإغلاق',
        description: 'مصفوفة الإغلاق وصفوف الأدلة لسطح التحكم.',
        routeHint: '/operations?workspace=dashboard',
        statusLabel: 'حي'
      },
      'captain-ops': {
        label: 'عمليات القبطان',
        description: 'جاهزية القبطان ومراجعة الأدلة واستثناءات COD تبقى واضحة.',
        routeHint: '/operations?workspace=captain-ops',
        statusLabel: 'حي'
      },
      'field-ops': {
        label: 'عمليات الميدان',
        description: 'الزيارات والتفعيل ومراجعة النقطة الجغرافية تبقى ظاهرة.',
        routeHint: '/operations?workspace=field-ops',
        statusLabel: 'حي'
      },
      finance: {
        label: 'المالية',
        description: 'ملخص التسوية والرقابة المالية يبقيان ظاهرين.',
        routeHint: '/operations?workspace=finance',
        statusLabel: 'حي'
      },
      settlements: {
        label: 'التسويات',
        description: 'مدفوعات الشركاء والقبطان تبقى في مسار واحد.',
        routeHint: '/operations?workspace=settlements',
        statusLabel: 'حي'
      },
      cod: {
        label: 'COD',
        description: 'العناصر المقبوضة والمعلقة تبقى واضحة للمراجعة.',
        routeHint: '/operations?workspace=cod',
        statusLabel: 'حي'
      },
      refunds: {
        label: 'الاستردادات',
        description: 'قائمة الاستردادات تبقى متاحة للمراجعة المحلية.',
        routeHint: '/operations?workspace=refunds',
        statusLabel: 'حي'
      },
      issues: {
        label: 'القضايا',
        description: 'مسارات الدعم والنزاعات تبقى جاهزة للتصعيد.',
        routeHint: '/operations?workspace=issues',
        statusLabel: 'حي'
      },
      serviceability: {
        label: 'قابلية الخدمة',
        description: 'المناطق والتغطية والقيود التشغيلية تبقى واضحة.',
        routeHint: '/operations?workspace=serviceability',
        statusLabel: 'حي'
      },
      'guard-status': {
        label: 'حالة الحارس',
        description: 'حالة PASS/WARN/BLOCKED تبقى ظاهرة وقابلة للمراجعة.',
        routeHint: '/operations?workspace=guard-status',
        statusLabel: 'حي'
      },
      evidence: {
        label: 'الأدلة',
        description: 'مصفوفة الأدلة تبقى متاحة لتوجيه الإغلاق.',
        routeHint: '/operations?workspace=evidence',
        statusLabel: 'حي'
      },
      orders: {
        label: 'الطلبات',
        description: 'الطابور المركزي للطلبات والتفاصيل المرتبطة بها.',
        routeHint: '/operations/dsh/orders',
        statusLabel: 'حي'
      },
      reassign: {
        label: 'إعادة التوزيع',
        description: 'تحويل الطلبات بين الموارد المتاحة بدون كسر المسار الحالي.',
        routeHint: '/operations/dsh/reassign',
        statusLabel: 'حي'
      },
      peakMode: {
        label: 'وضع الذروة',
        description: 'تشغيل مرن عندما ترتفع الحركة وتحتاج سعة إضافية.',
        routeHint: '/operations/dsh/peak-mode',
        statusLabel: 'حي'
      },
      zoneSet: {
        label: 'ضبط المناطق',
        description: 'تقييد النطاقات وتشغيلها بوضوح تشغيلي أعلى.',
        routeHint: '/operations/dsh/zone-set',
        statusLabel: 'قيد الربط'
      },
      sheinProxy: {
        label: 'الإسناد اليدوي',
        description: 'مسار عام لإسناد دفعات مملوكة للمنصة.',
        routeHint: '/operations/dsh/sheinproxy',
        statusLabel: 'قيد الربط'
      },
      arrivalBell: {
        label: 'جرس الوصول',
        description: 'إعدادات الوصول والتنبيهات الحية عند الاقتراب من التسليم.',
        routeHint: '/operations/dsh/bell',
        statusLabel: 'حي'
      }
    },
    actions: {
      openOrders: 'افتح الطلبات',
      openArrivalBell: 'افتح جرس الوصول',
      openReassign: 'افتح إعادة التوزيع',
      openPeakMode: 'افتح وضع الذروة'
    }
  },
  orders: {
    pageEyebrow: 'DSH / العمليات / الطلبات',
    pageTitle: 'طلبات DSH',
    pageDescription: 'طابور تشغيلي أكثر ضغطًا مع مسار رجوع مباشر إلى المركز أو إلى سطح العمليات الأوسع.',
    heroEyebrow: 'الطابور التشغيلي',
    heroTitle: 'الطلبات المفتوحة في DSH',
    heroDescription: 'هذه الصفحة تمنحك طابورًا تشغيليًا مباشرًا، مع مسار واضح للعودة إلى المركز ومسار آمن للعودة إلى العمليات.',
    stateLoadingTitle: 'جار تحميل قائمة الطلبات',
    stateLoadingDescription: 'السطح حي، وتبقى حالة الطلبات مرئية حتى يكتمل التزامن أو يعود المصدر.',
    stateEmptyTitle: 'لا توجد طلبات مفتوحة الآن',
    stateEmptyDescription: 'المسار جاهز، لكن الطابور الحالي فارغ مؤقتًا ويمكنك العودة إلى المركز بأمان لاحقًا.',
    stateOfflineTitle: 'الاتصال غير متاح',
    stateOfflineDescription: 'ستعود قائمة الطلبات عند استعادة الاتصال، مع بقاء المسار الحالي واضحًا.',
    stateDisabledTitle: 'قائمة الطلبات غير مفعّلة بعد',
    stateDisabledDescription: 'هذه الصفحة حية بصريًا، لكن التفاعل الأعمق مؤجل إلى شريحة ربط لاحقة.',
    stateErrorTitle: 'تعذر تحميل الطلبات',
    stateErrorDescription: 'يمكنك العودة إلى المركز أو إعادة المحاولة بعد تثبيت الحالة الحالية.',
    badgesLabel: 'الطلبات',
    assignedTitle: 'المعيّنة',
    assignedDescription: 'طلبات لديها ملكية واضحة ويمكن الانتقال منها مباشرة إلى التفاصيل.',
    newTitle: 'جديدة',
    newDescription: 'طلبات دخلت الطابور وتحتاج قرارًا أوليًا سريعًا.',
    reviewTitle: 'تحت المراجعة',
    reviewDescription: 'طلبات تحتاج قراءة أعمق قبل أي تحويل أو تصعيد.',
    listTitle: 'قائمة الطلبات',
    listDescription: 'كل صف يلخص الطلب، وجهته، حالته، والوقت المقدر للتنفيذ. الضغط عليه يفتح صفحة التفاصيل الحية.',
    openDetail: 'افتح التفاصيل',
    etaPrefix: 'المتوقع:'
  },
  zoneSet: {
    pageEyebrow: 'DSH / العمليات / ضبط المناطق',
    pageTitle: 'ضبط المناطق',
    pageDescription: 'حدود التسليم وسياسات المناطق ضمن بنية أكثر ضغطًا، وبدون تبديل تشغيلي كاذب.',
    unavailableDescription: 'السطح يحافظ على مسار قرار واضح حتى عند غياب البيانات أو توقفها.',
    heroEyebrow: 'حدود تشغيلية',
    heroTitle: 'مساحة ضبط المناطق',
    heroDescription: 'هذا السطح يوضح أين تكون حدود التسليم منطقية وأين يجب أن تبقى محجوبة، مع الحفاظ على مساحة العمليات كعقد أساسي.',
    stateLoadingTitle: 'جار تجهيز ضبط المناطق',
    stateLoadingDescription: 'المسار حي، وتظهر حدود التسليم وسياسات المناطق بعد اكتمال هذه المرحلة.',
    stateEmptyTitle: 'لا يوجد ضغط حدودي يتطلب ضبط المناطق الآن',
    stateEmptyDescription: 'الوضع مستقر حاليًا ولا توجد منطقة تحتاج تعديل حدود في هذه اللحظة.',
    stateOfflineTitle: 'الاتصال غير متاح',
    stateOfflineDescription: 'يبقى المسار محفوظًا، لكن قراءات الحدود والمناطق لن تتحدث حتى يعود الاتصال.',
    stateDisabledTitle: 'ضبط المناطق غير مفعّل بالكامل',
    stateDisabledDescription: 'هذه الشريحة تثبّت القراءة والسياسة فقط، بينما يبقى التنفيذ الفعلي خارج النطاق.',
    stateErrorTitle: 'تعذر تحميل ضبط المناطق',
    stateErrorDescription: 'يمكنك العودة إلى المركز أو إعادة المحاولة من نفس المسار.',
    signals: {
      reviewZones: 'مناطق المراجعة',
      reviewZonesDescription: 'حالات يجب ألا يخفيها ضبط المناطق بدل معالجة مشكلتها الفعلية.',
      configuredZones: 'المناطق المضبوطة',
      configuredZonesDescription: 'المناطق المقاسة حاليًا داخل هذه الشريحة.',
      protectedZones: 'المناطق المحمية',
      protectedZonesDescription: 'مناطق تحتاج قرار حدودي أو مراقبة أقرب.',
      freeDeliveryZones: 'مناطق التسليم الحر',
      freeDeliveryZonesDescription: 'مساحة تسليم ظاهرة يمكنها استيعاب النشاط عند الحاجة.'
    },
    policiesTitle: 'سياسات ضبط المناطق',
    policiesDescription: 'هذه القواعد تحدد أين يتوقف هذا السطح: قراءة وسياسة فقط، من دون أي تعديل مخفي.',
    lanesTitle: 'مناطق الحدود',
    lanesDescription: 'كل بطاقة تمنح قراءة سريعة للحمل والسعة والتوصية من دون الادعاء بوجود تفعيل مباشر هنا.'
  },
  sheinProxyRequestLegacy: {
    pageEyebrow: 'DSH / العمليات / وسيط شي إن / الطلب',
    pageTitlePrefix: 'تفاصيل الطلب',
    pageDescription: 'عرض مضغوط للطلب الوسيط الحالي مع مسار واضح نحو التقدير والعرض والجدولة.',
    unavailableDescription: 'المسار يبقى واضحًا حتى عندما تكون تفاصيل الطلب غير جاهزة.',
    heroEyebrow: 'طلب وسيط',
    identityTitle: 'هوية الطلب',
    identityDescription: 'البيانات الأساسية التي تثبت الطلب الحالي قبل الانتقال إلى الخطوة التالية.',
    pricingDescription: 'تفصيل القيمة والشحن والرسوم مع الإجمالي المرئي في مكان واحد.',
    timelineDescription: 'الخط الزمني يوضح أين يقف الطلب الآن وما الخطوة القادمة الأقرب.',
    nextStepTitle: 'الخطوة التالية',
    nextStepDescription: 'السطح يقترح الإجراء التالي بناءً على مرحلة الطلب الحالية.',
    stateLoadingTitle: 'جار تحميل تفاصيل الطلب',
    stateLoadingDescription: 'المسار حي، وتظهر تفاصيل الطلب بعد اكتمال تحميل هذه القطعة من البيانات.',
    stateEmptyTitle: 'الطلب غير موجود',
    stateEmptyDescription: 'المعرف المطلوب لا يطابق أي طلب حاضر في هذا الطابور.',
    stateOfflineTitle: 'الاتصال غير متاح',
    stateOfflineDescription: 'تفاصيل الطلب ستعود عند استعادة الاتصال مع بقاء المسار الحالي واضحًا.',
    stateDisabledTitle: 'تفاصيل الطلب غير مفعلة بعد',
    stateDisabledDescription: 'هذا السطح جاهز بصريًا، لكن تفعيل الخطوات الأعمق مؤجل إلى مرحلة لاحقة.',
    stateErrorTitle: 'تعذر تحميل تفاصيل الطلب',
    stateErrorDescription: 'يمكنك العودة إلى الطابور أو إعادة المحاولة من نفس المسار.',
    stageLabels: {
      detail: 'التفاصيل',
      estimate: 'التقدير',
      offer: 'العرض',
      schedule: 'الجدولة'
    },
    stageDescriptions: {
      detail: 'مراجعة هوية الطلب ومحتواه الأساسي.',
      estimate: 'فحص التقدير قبل إرسال العرض.',
      offer: 'العرض أُرسل وينتظر القرار.',
      schedule: 'تثبيت نافذة الاستلام أو التسليم.'
    },
    statusLabels: {
      underReview: 'قيد المراجعة',
      estimated: 'مقدّرة',
      offered: 'تم إرسال العرض',
      scheduled: 'مجدولة',
      approved: 'معتمدة',
      cancelled: 'ملغاة'
    },
    nextActionLabels: {
      underReview: 'افتح التقدير',
      estimated: 'أرسل العرض',
      offered: 'انتظر رد العميل',
      scheduled: 'تحقق من نافذة الاستلام',
      approved: 'جهّز التسليم',
      cancelled: 'راجع الإلغاء'
    },
    requestLabel: 'الطلب',
    customerLabel: 'العميل',
    productLabel: 'المنتج',
    quantityLabel: 'الكمية',
    statusLabel: 'الحالة',
    amountLabel: 'القيمة',
    shippingLabel: 'الشحن',
    serviceFeeLabel: 'رسوم الخدمة',
    totalLabel: 'الإجمالي',
    updatedLabel: 'آخر تحديث',
    nextActionLabel: 'الخطوة التالية',
    pricingTitle: 'تفصيل التسعير',
    noteLabel: 'ملاحظة تشغيلية',
    retryLabel: 'إعادة المحاولة',
    backToList: 'العودة إلى القائمة',
    openHub: 'العودة إلى المركز',
    openOperations: 'افتح العمليات',
    openSupport: 'افتح الدعم',
    openDetail: 'افتح التفاصيل',
    openEstimate: 'افتح التقدير',
    openOffer: 'افتح العرض',
    openSchedule: 'افتح الجدولة'
  },
  orderDetail: {
    pageEyebrow: 'DSH / العمليات / الطلبات / التفاصيل',
    pageTitlePrefix: 'تفاصيل',
    pageDescription: 'هوية الطلب، التسلسل التشغيلي، وقرار الإجراء التالي ضمن بنية أكثر ضغطًا وأقل تكرارًا.',
    unavailableDescription: 'السطح يحتفظ بخروج واضح إلى قائمة الطلبات حتى عند غياب البيانات أو توقفها.',
    heroEyebrow: 'تفاصيل تشغيلية',
    backToOrders: 'العودة إلى الطلبات',
    stateLoadingTitlePrefix: 'جار تحميل الطلب',
    stateLoadingDescription: 'المسار حي، وتبقى تفاصيل الطلب مرئية بمجرد اكتمال التحميل أو إعادة المحاولة.',
    stateEmptyTitlePrefix: 'الطلب',
    stateEmptyTitleSuffix: 'غير موجود',
    stateEmptyDescription: 'المعرف المطلوب غير موجود ضمن الطابور الحالي، ويمكن العودة إلى قائمة الطلبات بدون فقدان الاتجاه.',
    stateOfflineTitle: 'الاتصال غير متاح',
    stateOfflineDescription: 'تفاصيل الطلب ستعود بعد استعادة الاتصال، مع بقاء المسار الحالي معروفًا وآمنًا.',
    stateDisabledTitle: 'التفاصيل غير مفعلة بعد',
    stateDisabledDescription: 'هذا السطح جاهز بصريًا لكن بعض إجراءات التنفيذ التفصيلية مؤجلة إلى خطوة لاحقة.',
    stateErrorTitle: 'تعذر تحميل تفاصيل الطلب',
    stateErrorDescription: 'يمكنك الرجوع إلى قائمة الطلبات أو إعادة المحاولة من نفس المسار.',
    signals: {
      status: 'الحالة',
      statusDescription: 'الوضع الحالي لهذا الطلب داخل الطابور التشغيلي.',
      destination: 'الوجهة',
      destinationDescription: 'نقطة التسليم المرجعية لهذا الطلب.',
      eta: 'الوقت المتوقع',
      etaDescription: 'الوقت التقديري الحالي حتى إتمام التسليم أو المعالجة.',
      amount: 'القيمة',
      amountDescription: 'القيمة الحالية كما تظهر في هذا العرض البصري.'
    },
    identityTitle: 'هوية الطلب',
    identityDescription: 'ملخص ثابت وواضح للمعرف والمسار والملاحظات التشغيلية الأساسية.',
    routeLabel: 'المسار',
    finalDestinationLabel: 'الوجهة النهائية',
    noteLabel: 'ملاحظة تشغيلية',
    arrivalTitle: 'تسلسل الوصول',
    arrivalDescription: 'يوضح الوصول، الرن، الإقرار، وسبب المنع الحالي إن وجد.',
    arrivedLabel: 'الوصول',
    ringLogLabel: 'سجل الرن',
    acknowledgementLabel: 'إقرار العميل',
    cooldownLabel: 'التبريد وسبب المنع',
    noArrivalData: 'لا توجد بيانات وصول بعد',
    noRingsYet: 'لا توجد محاولات حتى الآن',
    noAcknowledgementYet: 'لم يصل أي إقرار بعد',
    unavailable: 'غير متاح',
    noCurrentBlock: 'لا يوجد منع حالي',
    ringAttempts: 'محاولات',
    openArrivalBellWorkspace: 'افتح مساحة جرس الوصول',
    decisionTitle: 'قرار التشغيل',
    decisionDescription: 'ما هو الإجراء الأساسي الآن، وما البدائل المقبولة داخل هذا المسار.',
    primaryActionLabel: 'الإجراء الأساسي',
    secondaryActionLabel: 'الإجراء الثانوي',
    supportPathLabel: 'مسار الدعم',
    openReassignWorkspace: 'افتح مساحة إعادة التوزيع'
  },
  sheinProxy: {
    pageEyebrow: 'DSH / العمليات / الإسناد',
    pageTitle: 'الإسناد اليدوي',
    pageDescription: 'طابور مضغوط لإسنادات يدوية قابلة لإعادة الاستخدام مع مراجعة التسعير والخطوة التالية.',
    unavailableDescription: 'المسار يبقى واضحًا حتى عندما تكون الطلبات متوقفة أو غير جاهزة.',
    heroEyebrow: 'طابور الإسناد',
    heroTitle: 'طلبات الإسناد اليدوي',
    heroDescription: 'هذا السطح يجعل الإسنادات العامة مقروءة ويقترح الخطوة التشغيلية التالية بدون التظاهر بتعديل الحالة مباشرة.',
    stateLoadingTitle: 'جار تجهيز طابور الوساطة',
    stateLoadingDescription: 'المسار حي، وتظهر قائمة الطلبات بعد اكتمال تحميل هذه الحزمة من البيانات.',
    stateEmptyTitle: 'لا توجد طلبات تطابق هذا الفلتر',
    stateEmptyDescription: 'جرّب قسمًا آخر من الطابور أو ارجع إلى القائمة الكاملة.',
    stateOfflineTitle: 'الاتصال غير متاح',
    stateOfflineDescription: 'الطابور يعود عند استعادة الاتصال بينما يظل المسار الحالي واضحًا.',
    stateDisabledTitle: 'طابور الوساطة غير مفعّل بعد',
    stateDisabledDescription: 'هذا السطح جاهز بصريًا، لكن عمليات الوساطة الأعمق مؤجلة إلى خطوة لاحقة.',
    stateErrorTitle: 'تعذر تحميل طابور الوساطة',
    stateErrorDescription: 'يمكنك العودة إلى المركز أو إعادة المحاولة من نفس المسار.',
    signals: {
      pending: 'قيد المراجعة',
      pendingDescription: 'طلبات تنتظر قرارًا أوليًا.',
      estimated: 'مقدّرة',
      estimatedDescription: 'طلبات جاهزة بتقدير سعري مرئي.',
      offered: 'تم إرسال العرض',
      offeredDescription: 'طلبات تنتظر رد العميل على العرض.',
      scheduled: 'مجدولة',
      scheduledDescription: 'طلبات حُددت لها نافذة استلام بالفعل.'
    },
    statusLabels: {
      underReview: 'قيد المراجعة',
      estimated: 'مقدّرة',
      offered: 'تم إرسال العرض',
      scheduled: 'مجدولة',
      approved: 'معتمدة',
      cancelled: 'ملغاة'
    },
    nextActionLabels: {
      underReview: 'افتح التقدير',
      estimated: 'أرسل العرض',
      offered: 'انتظر رد العميل',
      scheduled: 'تحقق من نافذة الاستلام',
      approved: 'جهّز التسليم',
      cancelled: 'راجع الإلغاء'
    },
    tableTitle: 'طلبات الوساطة',
    tableDescription: 'كل صف يوضح الطلب، وحالة التسعير، والخطوة التالية المرشحة.',
    allRequestsLabel: 'كل الطلبات',
    tableEmptyTitle: 'لا توجد طلبات تطابق هذا الفلتر',
    tableEmptyDescription: 'جرّب قسمًا آخر من الطابور أو ارجع إلى القائمة الكاملة.',
    selectedTitle: 'الطلب المختار',
    selectedDescription: 'تفصيل مضغوط للطلب الذي عليه التركيز حاليًا.',
    requestLabel: 'الطلب',
    customerLabel: 'العميل',
    productLabel: 'المنتج',
    quantityLabel: 'الكمية',
    statusLabel: 'الحالة',
    amountLabel: 'القيمة',
    shippingLabel: 'الشحن',
    serviceFeeLabel: 'رسوم الخدمة',
    totalLabel: 'الإجمالي',
    updatedLabel: 'آخر تحديث',
    nextActionLabel: 'الخطوة التالية',
    pricingTitle: 'تفصيل التسعير',
    notesLabel: 'ملاحظة تشغيلية',
    inspectRequest: 'افحص الطلب',
    retryLabel: 'إعادة المحاولة',
    backToList: 'العودة إلى القائمة',
    backToHub: 'العودة إلى المركز'
  },
  sheinProxyRequest: {
    pageEyebrow: 'DSH / العمليات / وسيط شي إن / الطلب',
    pageTitlePrefix: 'تفاصيل الطلب',
    pageDescription: 'عرض مضغوط للطلب الوسيط الحالي مع مسار واضح نحو التقدير والعرض والجدولة.',
    unavailableDescription: 'المسار يبقى واضحًا حتى عندما تكون تفاصيل الطلب غير جاهزة.',
    heroEyebrow: 'طلب وسيط',
    identityTitle: 'هوية الطلب',
    identityDescription: 'البيانات الأساسية التي تثبت الطلب الحالي قبل الانتقال إلى الخطوة التالية.',
    pricingDescription: 'تفصيل القيمة والشحن والرسوم مع الإجمالي المرئي في مكان واحد.',
    timelineDescription: 'الخط الزمني يوضح أين يقف الطلب الآن وما الخطوة القادمة الأقرب.',
    nextStepTitle: 'الخطوة التالية',
    nextStepDescription: 'السطح يقترح الإجراء التالي بناءً على مرحلة الطلب الحالية.',
    stateLoadingTitle: 'جار تحميل تفاصيل الطلب',
    stateLoadingDescription: 'المسار حي، وتظهر تفاصيل الطلب بعد اكتمال تحميل هذه القطعة من البيانات.',
    stateEmptyTitle: 'الطلب غير موجود',
    stateEmptyDescription: 'المعرف المطلوب لا يطابق أي طلب حاضر في هذا الطابور.',
    stateOfflineTitle: 'الاتصال غير متاح',
    stateOfflineDescription: 'تفاصيل الطلب ستعود عند استعادة الاتصال مع بقاء المسار الحالي واضحًا.',
    stateDisabledTitle: 'تفاصيل الطلب غير مفعلة بعد',
    stateDisabledDescription: 'هذا السطح جاهز بصريًا، لكن تفعيل الخطوات الأعمق مؤجل إلى مرحلة لاحقة.',
    stateErrorTitle: 'تعذر تحميل تفاصيل الطلب',
    stateErrorDescription: 'يمكنك العودة إلى الطابور أو إعادة المحاولة من نفس المسار.',
    stageLabels: {
      detail: 'التفاصيل',
      estimate: 'التقدير',
      offer: 'العرض',
      schedule: 'الجدولة'
    },
    stageDescriptions: {
      detail: 'مراجعة هوية الطلب ومحتواه الأساسي.',
      estimate: 'فحص التقدير قبل إرسال العرض.',
      offer: 'العرض أُرسل وينتظر القرار.',
      schedule: 'تثبيت نافذة الاستلام أو التسليم.'
    },
    statusLabels: {
      underReview: 'قيد المراجعة',
      estimated: 'مقدّرة',
      offered: 'تم إرسال العرض',
      scheduled: 'مجدولة',
      approved: 'معتمدة',
      cancelled: 'ملغاة'
    },
    nextActionLabels: {
      underReview: 'افتح التقدير',
      estimated: 'أرسل العرض',
      offered: 'انتظر رد العميل',
      scheduled: 'تحقق من نافذة الاستلام',
      approved: 'جهّز التسليم',
      cancelled: 'راجع الإلغاء'
    },
    requestLabel: 'الطلب',
    customerLabel: 'العميل',
    productLabel: 'المنتج',
    quantityLabel: 'الكمية',
    statusLabel: 'الحالة',
    amountLabel: 'القيمة',
    shippingLabel: 'الشحن',
    serviceFeeLabel: 'رسوم الخدمة',
    totalLabel: 'الإجمالي',
    updatedLabel: 'آخر تحديث',
    nextActionLabel: 'الخطوة التالية',
    pricingTitle: 'تفصيل التسعير',
    noteLabel: 'ملاحظة تشغيلية',
    retryLabel: 'إعادة المحاولة',
    backToList: 'العودة إلى القائمة',
    openHub: 'العودة إلى المركز',
    openOperations: 'افتح العمليات',
    openSupport: 'افتح الدعم',
    openDetail: 'افتح التفاصيل',
    openEstimate: 'افتح التقدير',
    openOffer: 'افتح العرض',
    openSchedule: 'افتح الجدولة'
  },
  reassign: {
    pageEyebrow: 'DSH / العمليات / إعادة التوزيع',
    pageTitle: 'إعادة التوزيع',
    pageDescription: 'قراءة قرار النقل بشكل مضغوط وواضح بدون إدخال إجراء إرسال تشغيلي كاذب.',
    unavailableDescription: 'المسار يبقى واضحًا حتى لو غابت الحالات أو توقفت البيانات.',
    heroEyebrow: 'قرار تشغيلي',
    heroTitle: 'مساحة إعادة التوزيع',
    heroDescription: 'هذا السطح يرفع وضوح القرار: من يحتاج نقلًا، ولماذا، وما البديل المقترح، مع إبقاء التنفيذ الفعلي خارج هذا العرض.',
    stateLoadingTitle: 'جار تجهيز سطح إعادة التوزيع',
    stateLoadingDescription: 'المسار حي، وسيظهر القرار والمرشحون بمجرد اكتمال هذه المرحلة.',
    stateEmptyTitle: 'لا توجد حالات لإعادة التوزيع',
    stateEmptyDescription: 'الطابور الحالي لا يحتوي على قرارات نقل نشطة في هذه اللحظة.',
    stateOfflineTitle: 'الاتصال غير متاح',
    stateOfflineDescription: 'المسار محفوظ، لكن حالات إعادة التوزيع لن تتحدّث حتى يعود الاتصال.',
    stateDisabledTitle: 'إعادة التوزيع غير مفعلة بالكامل',
    stateDisabledDescription: 'هذا العرض يثبّت القراءة والقرار فقط، بينما التنفيذ الفعلي مؤجل إلى خطوة لاحقة.',
    stateErrorTitle: 'تعذر تحميل سطح إعادة التوزيع',
    stateErrorDescription: 'يمكنك الرجوع إلى المركز أو إعادة المحاولة من نفس المسار.',
    signals: {
      active: 'الحالات النشطة',
      activeDescription: 'طلبات لديها ضغط تشغيلي أو مرشح نقل واضح.',
      urgent: 'الحالات العاجلة',
      urgentDescription: 'تحتاج قرارًا سريعًا قبل أن تتحول إلى تأخر أو تصعيد.',
      blocked: 'الحالات المحجوبة',
      blockedDescription: 'تحتاج مساحة تشغيل أوسع أو دعمًا قبل أي خطوة أخرى.',
      fallbacks: 'بدائل جاهزة',
      fallbacksDescription: 'كباتن أو مسارات احتياطية متاحة بصريًا في هذا العرض.'
    },
    candidatesTitle: 'المرشحون لإعادة التوزيع',
    candidatesDescription: 'كل بطاقة تعرض رقم التسليم والطلب المرتبط والسبب والأولوية والبديل المقترح بدون التظاهر بوجود تنفيذ تشغيلي فعلي.',
    currentCaptainLabel: 'الحالي',
    fallbackCaptainLabel: 'البديل',
    decisionTitle: 'منطق القرار',
    decisionDescription: 'الهدف هنا ليس التنفيذ، بل ترتيب القرار: متى تعود إلى مساحة العمليات، ومتى تراجع الطلب، ومتى تصعّد الحالة.',
    primaryDecisionTitle: 'الإجراء الأساسي',
    primaryDecisionLabel: 'افتح مساحة العمليات',
    primaryDecisionDescription: 'العقد يطلب بوضوح أن يكون فتح مساحة العمليات هو الخروج الرئيسي بعد قراءة القرار.',
    secondaryDecisionTitle: 'الإجراء الثانوي',
    secondaryDecisionLabel: 'ارجع إلى الطلبات',
    secondaryDecisionDescription: 'الرجوع إلى الطابور مناسب عندما تريد مقارنة أكثر من حالة قبل اعتماد أي نقل.',
    supportDecisionTitle: 'مسار الدعم',
    supportDecisionLabel: 'صعّد المحجوب فقط',
    supportDecisionDescription: 'التصعيد يبقى للحالات المعطلة أو غير القابلة للحسم من هذا السطح.'
  },
  peakMode: {
    pageEyebrow: 'DSH / العمليات / وضع الذروة',
    pageTitle: 'وضع الذروة',
    pageDescription: 'مناطق الضغط والسياسات مع بنية أكثر ضغطًا وبدون زر تشغيل كاذب.',
    unavailableDescription: 'السطح يحافظ على مسار قرار واضح حتى عند غياب البيانات أو توقفها.',
    heroEyebrow: 'سعة تشغيلية',
    heroTitle: 'مساحة وضع الذروة',
    heroDescription: 'هذا السطح يعرض أين يكون توسيع السعة منطقيًا وأين يجب منعه، مع الحفاظ على فتح مساحة العمليات كقرار رئيسي وفق العقد.',
    stateLoadingTitle: 'جار تجهيز وضع الذروة',
    stateLoadingDescription: 'المسار حي، وستظهر سياسات السعة ومناطق الضغط بعد اكتمال هذه المرحلة.',
    stateEmptyTitle: 'لا توجد ضغوط تتطلب وضع الذروة الآن',
    stateEmptyDescription: 'الوضع مستقر حاليًا ولا توجد مناطق مرشحة لتوسيع السعة في هذه اللحظة.',
    stateOfflineTitle: 'الاتصال غير متاح',
    stateOfflineDescription: 'يبقى المسار محفوظًا لكن قراءات الضغط والسعة لن تتحدّث حتى يعود الاتصال.',
    stateDisabledTitle: 'وضع الذروة غير مفعّل بالكامل',
    stateDisabledDescription: 'هذا العرض يثبت القراءة والسياسة فقط، بينما التنفيذ الفعلي خارج النطاق الحالي.',
    stateErrorTitle: 'تعذر تحميل وضع الذروة',
    stateErrorDescription: 'يمكنك الرجوع إلى المركز أو إعادة المحاولة من نفس المسار.',
    signals: {
      activeZones: 'المناطق النشطة',
      activeZonesDescription: 'المناطق التي تُقاس ضمن هذا العرض.',
      pressureZones: 'مناطق الضغط',
      pressureZonesDescription: 'مناطق تحتاج قرارًا حول السعة أو مراقبة أقرب.',
      flexCaptains: 'كباتن مرنون',
      flexCaptainsDescription: 'احتياطي مرئي يمكنه امتصاص جزء من الضغط عند الحاجة.',
      protectedQueues: 'طوابير محمية',
      protectedQueuesDescription: 'حالات يجب ألّا يغطيها وضع الذروة بدل معالجة أصل المشكلة.'
    },
    policiesTitle: 'سياسات وضع الذروة',
    policiesDescription: 'هذه القواعد توضح أين ينتهي هذا السطح: قراءة وسياسة، بلا تفعيل مباشر ولا تعديل مخفي.',
    lanesTitle: 'مناطق الضغط',
    lanesDescription: 'كل بطاقة تعطي قراءة سريعة للحمل والسعة والتوصية، بدون التظاهر بإمكانية التفعيل المباشر من هنا.'
  },
  arrivalBell: {
    pageEyebrow: 'DSH / العمليات / جرس الوصول',
    pageTitle: 'جرس الوصول',
    pageDescription: 'حالات الوصول والرن ضمن قراءة أوضح وأكثر ضغطًا دون أي اتجاه محلي.',
    unavailableDescription: 'المسار يظل واضحًا حتى عندما لا تكون البيانات جاهزة أو متاحة.',
    heroEyebrow: 'مساحة تشغيلية',
    heroTitle: 'مساحة جرس الوصول',
    heroDescription: 'هذا السطح لا ينفذ إجراءات تشغيل مباشرة، لكنه يثبت القراءة التشغيلية الصحيحة ويعطي مسارًا حقيقيًا من مركز DSH إلى حالات الوصول والرن.',
    stateLoadingTitle: 'جار تجهيز مساحة جرس الوصول',
    stateLoadingDescription: 'الهيكل حاضر، وسيظهر صف الكابتن والعميل بوضوح بعد اكتمال هذه الخطوة.',
    stateEmptyTitle: 'لا توجد حالات لجرس الوصول الآن',
    stateEmptyDescription: 'المسار حي، لكن لا توجد حالات وصول أو رن تحتاج متابعة في هذه اللحظة.',
    stateOfflineTitle: 'الاتصال غير متاح',
    stateOfflineDescription: 'يبقى المسار واضحًا، لكن حالات الوصول والرن لا تُحدّث حتى يعود الاتصال.',
    stateDisabledTitle: 'مسار جرس الوصول غير مفعّل بالكامل',
    stateDisabledDescription: 'هذا العرض يثبّت القراءة والتنقل فقط، أما التنفيذ التفصيلي فيأتي لاحقًا.',
    stateErrorTitle: 'تعذر تحميل جرس الوصول',
    stateErrorDescription: 'يمكنك الرجوع إلى المركز أو إعادة المحاولة من نفس المسار بدون فقدان الاتجاه.',
    signals: {
      activeArrivals: 'الوصولات النشطة',
      activeArrivalsDescription: 'حالات لديها حضور فعلي داخل مسار الوصول.',
      awaitingAcknowledgement: 'بانتظار الإقرار',
      awaitingAcknowledgementDescription: 'طلبات وصل فيها الكابتن لكن العميل لم يؤكد بعد.',
      blockedRings: 'الرنات المحجوبة',
      blockedRingsDescription: 'حالات تحت تبريد أو منع تشغيلي ولا يجب تحويلها إلى إجراء زائف.',
      resolvedToday: 'مغلق اليوم',
      resolvedTodayDescription: 'مؤشر مرئي فقط على الإغلاق اليومي داخل هذا العرض.'
    },
    captainLaneTitle: 'مسار الكابتن',
    captainLaneDescription: 'يوضح من وصل، ومن رن، وما الحالات التي تتطلب قرار عمليات أوسع بدل تكرار المحاولة محليًا.',
    customerLaneTitle: 'مسار العميل',
    customerLaneDescription: 'يعرض الإقرار، وغياب الرد، والحالات التي يجب أن تعود إلى مساحة العمليات بدل دفع المستخدم إلى تفاصيل غير موجودة.'
  },
  fixtures: {
    orders: {
      rows: [
        {
          id: 'ORD-24018',
          customer: 'عميل مباشر',
          route: 'المخزن المركزي → حي النخيل',
          amount: '62.00 SAR',
          eta: '14 دقيقة',
          statusLabel: 'جديد',
          statusTone: 'brand',
          createdLabel: '10:14 صباحًا',
          destinationLabel: 'حي النخيل - شارع 4',
          captainLabel: 'لم يعيّن بعد',
          notes: 'طلب يحتاج فتح تعيين سريع من الطابور الأساسي.'
        },
        {
          id: 'ORD-24019',
          customer: 'عميل تجريبي',
          route: 'المخزن الشرقي → شارع 12',
          amount: '48.50 SAR',
          eta: '22 دقيقة',
          statusLabel: 'مؤكد',
          statusTone: 'success',
          createdLabel: '10:26 صباحًا',
          destinationLabel: 'شارع 12 - برج الماسة',
          captainLabel: 'كابتن سامر',
          notes: 'الطلب مؤكد ويتحرك ضمن ETA طبيعي.'
        },
        {
          id: 'ORD-24020',
          customer: 'عميل استرداد',
          route: 'المخزن الغربي → المنطقة الصناعية',
          amount: '91.75 SAR',
          eta: '31 دقيقة',
          statusLabel: 'بحاجة مراجعة',
          statusTone: 'warning',
          createdLabel: '10:41 صباحًا',
          destinationLabel: 'المنطقة الصناعية - بوابة 3',
          captainLabel: 'قيد الفحص',
          notes: 'العنوان واضح لكن الطلب يتطلب تأكيد قدرة الكابتن قبل الإسناد.'
        },
        {
          id: 'ORD-24021',
          customer: 'عميل VIP',
          route: 'المركز الرئيس → الطريق الساحلي',
          amount: '124.00 SAR',
          eta: '41 دقيقة',
          statusLabel: 'معلق',
          statusTone: 'danger',
          createdLabel: '10:55 صباحًا',
          destinationLabel: 'الطريق الساحلي - بوابة المرسى',
          captainLabel: 'تم إيقاف الإسناد',
          notes: 'الطلب موقوف حتى مراجعة سبب التعليق والتصعيد التشغيلي.'
        }
      ],
      arrivalTimelines: {
        'ORD-24018': {
          arrived: false,
          arrivedLabel: 'لم يصل بعد',
          ringCount: 0,
          lastRingLabel: 'لا توجد رنة',
          acknowledged: false,
          acknowledgedLabel: 'لم يؤكد العميل بعد',
          cooldownLabel: 'متاح الآن',
          blockReason: 'لا يوجد منع حالي'
        },
        'ORD-24019': {
          arrived: true,
          arrivedLabel: 'وصل 10:42 صباحًا',
          ringCount: 1,
          lastRingLabel: 'آخر رنة 10:43 صباحًا',
          acknowledged: true,
          acknowledgedLabel: 'العميل أكد الوصول 10:44 صباحًا',
          cooldownLabel: 'انتهى التبريد',
          blockReason: 'لا يوجد منع حالي'
        },
        'ORD-24020': {
          arrived: true,
          arrivedLabel: 'وصل 10:58 صباحًا',
          ringCount: 2,
          lastRingLabel: 'آخر رنة 11:01 صباحًا',
          acknowledged: false,
          acknowledgedLabel: 'لا يوجد إقرار من العميل',
          cooldownLabel: 'تبريد حتى 11:04 صباحًا',
          blockReason: 'بانتظار مراجعة التشغيل قبل إعادة الرن'
        },
        'ORD-24021': {
          arrived: false,
          arrivedLabel: 'الوصول متوقف',
          ringCount: 0,
          lastRingLabel: 'معلّق',
          acknowledged: false,
          acknowledgedLabel: 'لا يوجد إقرار',
          cooldownLabel: 'غير متاح',
          blockReason: 'الطلب معلق ويتطلب تصعيدًا تشغيليًا قبل أي محاولة جديدة'
        }
      },
      actionPlans: {
        brand: {
          primaryLabel: 'افتح مساحة العمليات',
          primaryDescription: 'الطلب جديد ويحتاج دخولًا سريعًا إلى مساحة العمليات قبل تنفيذ أي إجراء أعمق.',
          secondaryLabel: 'راجع طابور الطلبات',
          secondaryDescription: 'الرجوع إلى القائمة مفيد لمقارنة هذا الطلب مع بقية الحالات المفتوحة.',
          supportLabel: 'صعّد إلى الدعم',
          supportDescription: 'يبقى الدعم مسارًا احتياطيًا إذا تعطل القرار أو تغيّرت المعطيات.'
        },
        warning: {
          primaryLabel: 'افتح مساحة العمليات',
          primaryDescription: 'هذه الحالة تحتاج قرار تشغيل واضح قبل إعادة الرن أو الاستمرار في الإسناد.',
          secondaryLabel: 'ارجع إلى الطلبات للمقارنة',
          secondaryDescription: 'يساعدك الرجوع إلى الطابور على قياس أولوية هذه المراجعة مقابل بقية الطلبات.',
          supportLabel: 'حوّل إلى الدعم',
          supportDescription: 'الدعم مناسب عندما تصبح المراجعة غير قابلة للحسم من داخل هذا السطح.'
        },
        danger: {
          primaryLabel: 'افتح مساحة العمليات',
          primaryDescription: 'الطلب معلق، وأفضل إجراء أولي هو العودة إلى مساحة العمليات الكاملة لقرار تشغيلي أوسع.',
          secondaryLabel: 'افتح طابور الطلبات',
          secondaryDescription: 'يوفر الرجوع إلى القائمة رؤية أشمل على الحالات الحرجة المجاورة.',
          supportLabel: 'افتح الدعم فورًا',
          supportDescription: 'التصعيد مناسب هنا لأنه يختصر الطريق عند استمرار التعليق أو غياب حل مباشر.'
        },
        defaultPlan: {
          primaryLabel: 'افتح مساحة العمليات',
          primaryDescription: 'الطلب مستقر نسبيًا، لكن السطح الحالي يوجهك إلى مساحة العمليات كإجراء رئيسي متوافق مع العقد.',
          secondaryLabel: 'ارجع إلى قائمة الطلبات',
          secondaryDescription: 'الرجوع إلى القائمة يسهّل متابعة الطابور والانتقال إلى طلب آخر عند الحاجة.',
          supportLabel: 'افتح الدعم',
          supportDescription: 'الدعم يبقى مسارًا ثانويًا عند وجود احتياج بشري أو تشغيلي خاص.'
        }
      }
    },
    peakMode: {
      summary: {
        activeZones: 5,
        pressureZones: 2,
        flexCaptains: 11,
        protectedQueues: 3
      },
      policies: [
        {
          label: 'تعدد الطلبات',
          statusLabel: 'مقترح فقط',
          description: 'السطح الحالي يوضح أين يكون تفعيل السعة المنطقية مناسبًا، لكنه لا يبدّل حالة تشغيل فعلية.'
        },
        {
          label: 'حماية الطوابير الحساسة',
          statusLabel: 'محمي',
          description: 'الطلبات الحرجة أو المحجوبة تبقى خارج أي توسيع سعة حتى لا يتحول وضع الذروة إلى إخفاء للمشكلة.'
        },
        {
          label: 'العودة إلى مساحة العمليات',
          statusLabel: 'إجباري',
          description: 'العقد يفرض أن يكون فتح مساحة العمليات هو المخرج الرئيسي بعد قراءة القرار.'
        }
      ],
      lanes: [
        {
          zoneLabel: 'حي النخيل',
          loadLabel: 'ضغط مرتفع',
          captainCapacityLabel: '4 كباتن مرنون',
          queueLabel: '12 طلبًا مفتوحًا',
          recommendationLabel: 'مرشح لتوسيع السعة',
          note: 'هذه المنطقة تناسب وضع الذروة لأن البدائل جاهزة والضغط مؤقت لا هيكلي.',
          tone: 'warning'
        },
        {
          zoneLabel: 'الطريق الساحلي',
          loadLabel: 'ضغط حرج',
          captainCapacityLabel: 'بديل محدود',
          queueLabel: '7 طلبات مع تعثرات',
          recommendationLabel: 'لا تفعّل قبل مراجعة أعمق',
          note: 'الضغط هنا قد يخفي مشكلة تشغيلية أعمق، لذلك لا يجب تقديم تفعيل مباشر من هذا السطح.',
          tone: 'danger'
        },
        {
          zoneLabel: 'شارع 12',
          loadLabel: 'ضغط قابل للإدارة',
          captainCapacityLabel: '3 كباتن مرنون',
          queueLabel: '5 طلبات نشطة',
          recommendationLabel: 'مراقبة فقط',
          note: 'تكفي المراقبة حاليًا دون توسيع سعة أو تصعيد.',
          tone: 'brand'
        },
        {
          zoneLabel: 'المنطقة الصناعية',
          loadLabel: 'مستقر',
          captainCapacityLabel: 'احتياطي متاح',
          queueLabel: '3 طلبات',
          recommendationLabel: 'جاهز عند الحاجة',
          note: 'هذه المنطقة تحمل سعة احتياطية لكنها لا تحتاج تفعيلًا فوريًا.',
          tone: 'success'
        }
      ]
    },
    reassign: {
      summary: {
        activeCases: 6,
        urgentCases: 2,
        blockedCases: 1,
        readyFallbacks: 4
      },
      candidates: [
        {
          deliveryId: 'DEL-8102',
          orderId: 'ORD-24020',
          currentCaptain: 'كابتن ميداني',
          fallbackCaptain: 'كابتن نواف',
          reasonLabel: 'ازدحام مروري',
          priorityLabel: 'عاجلة',
          statusLabel: 'يحتاج قرار الآن',
          note: 'الأقرب أن ينتقل القرار إلى fallback جاهز خلال نافذة قصيرة.',
          tone: 'warning'
        },
        {
          deliveryId: 'DEL-8103',
          orderId: 'ORD-24021',
          currentCaptain: 'إسناد موقوف',
          fallbackCaptain: 'غير محدد',
          reasonLabel: 'تعليق تشغيلي',
          priorityLabel: 'عاجلة',
          statusLabel: 'محجوب',
          note: 'هذه الحالة تحتاج مساحة تشغيل أوسع أو دعمًا قبل أي نقل فعلي.',
          tone: 'danger'
        },
        {
          deliveryId: 'DEL-8104',
          orderId: 'ORD-24019',
          currentCaptain: 'كابتن سامر',
          fallbackCaptain: 'كابتن راشد',
          reasonLabel: 'طلب العميل',
          priorityLabel: 'عادية',
          statusLabel: 'بديل جاهز',
          note: 'القرار واضح ويمكن تتبعه من مساحة العمليات بدون إدخال تشغيل مباشر الآن.',
          tone: 'success'
        },
        {
          deliveryId: 'DEL-8105',
          orderId: 'ORD-24018',
          currentCaptain: 'لم يعيّن بعد',
          fallbackCaptain: 'كابتن سريع',
          reasonLabel: 'عدم توفر كابتن',
          priorityLabel: 'عادية',
          statusLabel: 'مرشح',
          note: 'هذه الحالة مناسبة كقرار مبكر في الطابور قبل أن تتحول إلى تعثر.',
          tone: 'brand'
        }
      ]
    },
    arrivalBell: {
      summary: {
        activeArrivals: 7,
        awaitingAcknowledgement: 3,
        blockedRings: 2,
        resolvedToday: 18
      },
      captainLane: [
        {
          orderId: 'ORD-24019',
          actorLabel: 'كابتن سامر',
          statusLabel: 'وصل وسجل الوصول',
          etaLabel: 'منذ 2 د',
          ringLabel: 'رنة واحدة',
          actionHint: 'بانتظار إقرار العميل أو متابعة مساحة العمليات.',
          tone: 'success'
        },
        {
          orderId: 'ORD-24020',
          actorLabel: 'كابتن ميداني',
          statusLabel: 'وصل لكن الرن مقيّد',
          etaLabel: 'منذ 5 د',
          ringLabel: '2 رنات',
          actionHint: 'يوجد تبريد نشط ويتطلب قرار عمليات قبل إعادة الرن.',
          tone: 'warning'
        },
        {
          orderId: 'ORD-24021',
          actorLabel: 'إسناد موقوف',
          statusLabel: 'الوصول متعثر',
          etaLabel: 'غير متاح',
          ringLabel: 'لا توجد محاولات',
          actionHint: 'هذه حالة تصعيد ولا يجب تحويلها إلى إجراء تشغيلي كاذب.',
          tone: 'danger'
        }
      ],
      customerLane: [
        {
          orderId: 'ORD-24019',
          actorLabel: 'العميل أكد الوصول',
          statusLabel: 'أنا قادم',
          etaLabel: '10:44 صباحًا',
          ringLabel: 'تم الإقرار',
          actionHint: 'يمكن متابعة بقية الطابور مع بقاء الحالة مرئية.',
          tone: 'success'
        },
        {
          orderId: 'ORD-24018',
          actorLabel: 'لم يصل إشعار بعد',
          statusLabel: 'بانتظار أول رنة',
          etaLabel: '14 دقيقة',
          ringLabel: '0 رنات',
          actionHint: 'الحالة مبكرة ولا تحتاج دعمًا أو تصعيدًا بعد.',
          tone: 'brand'
        },
        {
          orderId: 'ORD-24020',
          actorLabel: 'لا يوجد إقرار',
          statusLabel: 'يحتاج متابعة',
          etaLabel: '11:04 صباحًا',
          ringLabel: '2 رنات',
          actionHint: 'هذه الحالة تستدعي الرجوع إلى مساحة العمليات الكاملة لتقرير الخطوة التالية.',
          tone: 'warning'
        }
      ]
    },
    zoneSet: {
      summary: {
        configuredZones: 5,
        protectedZones: 2,
        freeDeliveryZones: 4,
        reviewZones: 3
      },
      policies: [
        {
          label: 'القراءة أولًا',
          statusLabel: 'منضبط',
          description: 'يوضح هذا السطح أين تنتهي القراءة وأين يبدأ القرار التشغيلي الأوسع.'
        },
        {
          label: 'حماية المناطق الحساسة',
          statusLabel: 'محمي',
          description: 'المناطق التي تحتاج حماية لا تتحول إلى تبديل زائف أو تسهيل غير مبرر.'
        },
        {
          label: 'مساحة التسليم الحرة',
          statusLabel: 'متاح',
          description: 'المناطق الحرة تبقى مرئية كقدرة استيعاب عند الحاجة.'
        }
      ],
      lanes: [
        {
          zoneLabel: 'حي النخيل',
          feeLabel: 'رسوم مرئية',
          etaLabel: '14 دقيقة',
          statusLabel: 'مناسب للمراجعة',
          recommendationLabel: 'مرشح أولي',
          note: 'هذه المنطقة تحتاج قراءة واضحة قبل أي توسع.',
          tone: 'warning'
        },
        {
          zoneLabel: 'الطريق الساحلي',
          feeLabel: 'رسوم أعلى',
          etaLabel: '31 دقيقة',
          statusLabel: 'محمي',
          recommendationLabel: 'لا يفتح الآن',
          note: 'هذا المسار يحتاج قرار حدودي أوسع بدل فتح مباشر.',
          tone: 'danger'
        },
        {
          zoneLabel: 'شارع 12',
          feeLabel: 'رسوم مستقرة',
          etaLabel: '22 دقيقة',
          statusLabel: 'جاهز',
          recommendationLabel: 'مراقبة فقط',
          note: 'الوضع هنا متوازن ولا يحتاج أي حركة إضافية.',
          tone: 'success'
        },
        {
          zoneLabel: 'المنطقة الصناعية',
          feeLabel: 'رسوم مرنة',
          etaLabel: '19 دقيقة',
          statusLabel: 'قابل للتوسعة',
          recommendationLabel: 'متاح عند الحاجة',
          note: 'يوفر هذا المسار سعة جاهزة عند ارتفاع الضغط.',
          tone: 'brand'
        }
      ]
    },
  }
};

const dshControlPanelTextCatalog = {
  ar: arDshControlPanelText,
  en: enDshControlPanelText,
} as const;

export function getDshControlPanelText(locale: DshLocale = 'ar') {
  return dshControlPanelTextCatalog[locale];
}

export function formatDshWorkbenchSubtitle(
  workbenchDescription: string,
  filterLabel: string,
  locale: DshLocale = 'ar',
) {
  const resolvedLocale = locale;

  if (resolvedLocale === 'en') {
    return `${workbenchDescription} The current slice stays honest: ${filterLabel} is the active context, and only the safe routes are live now.`;
  }

  return `${workbenchDescription} يبقى هذا العرض صريحًا: ${filterLabel} هو السياق الحالي، والمسارات الآمنة فقط هي المفعلة الآن.`;
}


export function useDshControlPanelText() {
  const { language } = useDirection();
  return getDshControlPanelText(language === 'en' ? 'en' : 'ar');
}



