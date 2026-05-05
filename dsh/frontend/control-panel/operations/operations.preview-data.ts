export const COMMAND_CENTER_PREVIEW = {
  signals: [
    { id: 'command-center-open-orders', title: 'Open orders', value: '128', description: 'Orders moving through the live hub.', tone: 'brand' },
    { id: 'command-center-dispatch-risk', title: 'Dispatch risk', value: '9', description: 'Orders needing manual assignment.', tone: 'warning' },
    { id: 'command-center-captain-cover', title: 'Captain cover', value: '42', description: 'Available captains visible now.', tone: 'best' },
    { id: 'command-center-escalations', title: 'Escalations', value: '17', description: 'Open exceptions waiting for ownership.', tone: 'danger' },
  ] as const,
  decisionBoard: {
    title: 'Command center decision board',
    purpose: 'Keep the operating pulse visible and decide which lane needs intervention now.',
    primaryDecision: 'Which lane needs the next intervention: live orders, dispatch, capacity, or audit?',
    nextAction: 'Open the screen selector and move directly to the owning hub.',
    blockers: 'Any unresolved exception or missing evidence keeps the workspace in preview mode.',
    ownerSurface: 'operations',
    evidenceHint: 'screen selector coverage, live queue status, and canonical route proof',
    routeHint: '/operations',
    decisionTone: 'brand',
  },
  actions: [
    { id: 'command-center-live-orders', label: 'Open live orders', description: 'Go straight to the order queue and detail panel.', href: '/operations?workspace=live-orders', badge: 'Queue', tone: 'primary' },
    { id: 'command-center-dispatch', label: 'Open dispatch assignment', description: 'Switch into manual assignment and captain coverage.', href: '/operations?workspace=dispatch-assignment', badge: 'Assignment', tone: 'secondary' },
    { id: 'command-center-capacity', label: 'Open area capacity', description: 'Review area pressure before it turns into a backlog.', href: '/operations?workspace=area-capacity', badge: 'Pressure', tone: 'secondary' },
    { id: 'command-center-audit', label: 'Open audit & SLA', description: 'Check evidence, support, and SLA health.', href: '/operations?workspace=audit-support-sla', badge: 'Proof', tone: 'secondary' },
  ] as const,
  disclosures: [
    { id: 'command-center-dsh-state', label: 'DSH state copy', description: 'The preview keeps the state language short and recoverable.', href: '/operations?workspace=command-center', badge: 'State' },
    { id: 'command-center-canonical', label: 'Canonical screen map', description: 'Eight folders now represent the active operations model.', href: '/operations?workspace=command-center', badge: 'Map' },
  ] as const,
};

export const OPERATIONS_PULSE_METRICS = COMMAND_CENTER_PREVIEW.signals.map((signal) => ({
  id: signal.id,
  title: signal.title,
  value: signal.value,
  description: signal.description,
  tone: signal.tone,
}));

export const LIVE_ORDERS_PREVIEW = {
  signals: [
    { id: 'live-orders-queue', title: 'Queue depth', value: '26', description: 'Orders waiting for the next decision.', tone: 'brand' },
    { id: 'live-orders-open-chat', title: 'Open chat threads', value: '11', description: 'Orders with active support or captain chat.', tone: 'warning' },
    { id: 'live-orders-at-risk', title: 'At risk', value: '6', description: 'Orders blocked by payment, proof, or assignment.', tone: 'danger' },
    { id: 'live-orders-resolved', title: 'Resolved today', value: '91', description: 'Orders already closed or handed off cleanly.', tone: 'best' },
  ] as const,
  decisionBoard: {
    title: 'Live orders decision board',
    purpose: 'Keep the live queue, order detail, and chat support in one preview lane.',
    primaryDecision: 'Which order needs detail, chat, or a proxy fulfillment handoff?',
    nextAction: 'Open an order row and inspect the detail or chat panel.',
    blockers: 'A missing order id or unresolved handoff keeps the queue in preview mode.',
    ownerSurface: 'operations',
    evidenceHint: 'queue state, detail panel, and chat trail',
    routeHint: '/operations?workspace=live-orders',
    decisionTone: 'brand',
  },
  orders: [
    { id: 'LO-1024', title: 'Order LO-1024', status: 'Ready for assignment', ownerSurface: 'dispatch-assignment', blocker: 'Captain not yet confirmed', evidence: 'Customer promised ETD 14:30', primaryActionLabel: 'Open detail', secondaryActionLabel: 'Open chat', evidenceActionLabel: 'View evidence', tone: 'warning', systemSuggestion: { label: 'Ø§ÙØªØ­ Ø§Ù„Ø¥Ø³Ù†Ø§Ø¯ ÙÙˆØ±Ø§Ù‹', reason: 'Ø¬Ø§Ù‡Ø² Ù„Ù„Ø§Ø³ØªÙ„Ø§Ù… ÙˆÙ„Ø§ ÙƒØ§Ø¨ØªÙ† Ù…Ø¤ÙƒØ¯', confidence: 'high', actionLabel: 'ÙØªØ­ Ø§Ù„Ø¥Ø³Ù†Ø§Ø¯', secondaryActionLabel: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ø§Ù„Ø¯Ø¹Ù…', auditRequired: false } },
    { id: 'LO-1077', title: 'Order LO-1077', status: 'Needs proof review', ownerSurface: 'audit-support-sla', blocker: 'Photo proof still pending', evidence: 'Support note attached', primaryActionLabel: 'Open detail', secondaryActionLabel: 'Open chat', evidenceActionLabel: 'View evidence', tone: 'danger', systemSuggestion: { label: 'Ø§Ø·Ù„Ø¨ Ø§Ù„Ø¥Ø«Ø¨Ø§Øª Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±', reason: 'ØµÙˆØ±Ø© Ø§Ù„Ø¥Ø«Ø¨Ø§Øª Ù…ÙÙ‚ÙˆØ¯Ø© ÙˆØ§Ù„ÙˆÙ‚Øª ÙŠÙ…Ø±', confidence: 'high', actionLabel: 'Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø¥Ø«Ø¨Ø§Øª', secondaryActionLabel: 'ØªØµØ¹ÙŠØ¯', auditRequired: true } },
    { id: 'LO-1099', title: 'Order LO-1099', status: 'Captain en route', ownerSurface: 'captain-operations', blocker: 'Dropoff window tightening', evidence: 'Route last updated 3m ago', primaryActionLabel: 'Open detail', secondaryActionLabel: 'Open chat', evidenceActionLabel: 'View evidence', tone: 'best', systemSuggestion: { label: 'ØªØ§Ø¨Ø¹ ÙˆÙ‚Øª Ø§Ù„ØªØ³Ù„ÙŠÙ…', reason: 'Ù†Ø§ÙØ°Ø© Ø§Ù„ØªØ³Ù„ÙŠÙ… ØªØ¶ÙŠÙ‚ ÙˆØ§Ù„Ù…Ø³Ø§Ø± Ù‚Ø¯ÙŠÙ… 3 Ø¯Ù‚Ø§Ø¦Ù‚', confidence: 'medium', actionLabel: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ø§Ù„ÙƒØ§Ø¨ØªÙ†', secondaryActionLabel: null, auditRequired: false } },
  ] as const,
  detail: [
    { id: 'detail-route', label: 'Route and ETA', value: '34 min', description: 'A clear runway to hand off or hold.', tone: 'brand' },
    { id: 'detail-proof', label: 'Proof state', value: 'Awaiting', description: 'The evidence lane remains explicit.', tone: 'warning' },
  ] as const,
  chat: [
    { id: 'chat-1', role: 'Support', text: 'Customer confirms the dropoff window can move by 10 minutes.' },
    { id: 'chat-2', role: 'Captain', text: 'Captain accepted the new route and is checking the pin now.' },
  ] as const,
  actions: [
    { id: 'live-orders-dispatch', label: 'Open dispatch assignment', description: 'Move the row into assignment when manual routing is needed.', href: '/operations?workspace=dispatch-assignment', badge: 'Assign', tone: 'primary' },
    { id: 'live-orders-audit', label: 'Open audit support', description: 'Escalate the row into proof and SLA review.', href: '/operations?workspace=audit-support-sla', badge: 'Proof', tone: 'secondary' },
    { id: 'live-orders-capacity', label: 'Open capacity', description: 'Check if area pressure is the hidden blocker.', href: '/operations?workspace=area-capacity', badge: 'Capacity', tone: 'secondary' },
  ] as const,
  disclosures: [
    { id: 'live-orders-route', label: 'Canonical route', description: 'The live-orders lane now owns detail and chat.', href: '/operations?workspace=live-orders', badge: 'Route' },
    { id: 'live-orders-proxy', label: 'Proxy fulfillment panel', description: 'Proxy work should route here or to dispatch assignment.', href: '/operations?workspace=dispatch-assignment', badge: 'Proxy' },
  ] as const,
};

export const DISPATCH_ASSIGNMENT_PREVIEW = {
  signals: [
    { id: 'dispatch-unassigned', title: 'Unassigned', value: '14', description: 'Orders without an owner.', tone: 'brand' },
    { id: 'dispatch-captains', title: 'Available captains', value: '31', description: 'Captain pool ready for manual assignment.', tone: 'best' },
    { id: 'dispatch-reassign', title: 'Reassigns', value: '7', description: 'Orders already bounced once.', tone: 'warning' },
    { id: 'dispatch-peak', title: 'Peak mode', value: '3', description: 'Orders moved into pressure management.', tone: 'danger' },
  ] as const,
  decisionBoard: {
    title: 'Dispatch assignment decision board',
    purpose: 'Keep assignment, reassign, and captain coverage in one workflow.',
    primaryDecision: 'Which order should be assigned, reassigned, or bumped into peak mode?',
    nextAction: 'Select a row and confirm the captain or escalation path.',
    blockers: 'A missing captain or pressure spike must stay visible before the handoff.',
    ownerSurface: 'operations',
    evidenceHint: 'assignment queue, captain pool, and peak-mode readiness',
    routeHint: '/operations?workspace=dispatch-assignment',
    decisionTone: 'warning',
  },
  assignments: [
    { id: 'DA-2001', title: 'Assignment DA-2001', status: 'Awaiting captain', ownerSurface: 'dispatch-assignment', blocker: 'No captain accepted yet', evidence: 'Coverage window 18 min', primaryActionLabel: 'Assign captain', secondaryActionLabel: 'Reassign', evidenceActionLabel: 'View coverage', tone: 'warning', systemSuggestion: { label: 'Ø£Ø³Ù†Ø¯ Ø¥Ù„Ù‰ ÙƒØ§Ø¨ØªÙ† Ù‚Ø±ÙŠØ¨', reason: 'Ø§Ù„Ø£Ù‚Ø±Ø¨ ÙˆÙ…ØªØ§Ø­ Ø§Ù„Ø¢Ù†', confidence: 'high', actionLabel: 'ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø¥Ø³Ù†Ø§Ø¯', secondaryActionLabel: 'Ø¥Ø¹Ø§Ø¯Ø© ØªØ¹ÙŠÙŠÙ†', auditRequired: false } },
    { id: 'DA-2002', title: 'Assignment DA-2002', status: 'Needs reassign', ownerSurface: 'dispatch-assignment', blocker: 'First captain declined', evidence: 'Fallback captain available', primaryActionLabel: 'Assign captain', secondaryActionLabel: 'Reassign', evidenceActionLabel: 'View coverage', tone: 'danger', systemSuggestion: { label: 'Ø£Ø¹Ø¯ Ø§Ù„Ø¥Ø³Ù†Ø§Ø¯ Ø¥Ù„Ù‰ ÙƒØ§Ø¨ØªÙ† Ø¨Ø¯ÙŠÙ„', reason: 'Ø§Ù„Ù‚Ø¨ÙˆÙ„ Ø£Ø¹Ù„Ù‰ ÙˆØªÙˆÙØ± Ø£Ø³Ø±Ø¹', confidence: 'medium', actionLabel: 'Ø¥Ø¹Ø§Ø¯Ø© ØªØ¹ÙŠÙŠÙ†', secondaryActionLabel: 'ØªØ®Ø·ÙŠ', auditRequired: false } },
    { id: 'DA-2003', title: 'Assignment DA-2003', status: 'Peak mode candidate', ownerSurface: 'area-capacity', blocker: 'Area pressure climbing', evidence: 'Coverage window tightening', primaryActionLabel: 'Assign captain', secondaryActionLabel: 'Reassign', evidenceActionLabel: 'View coverage', tone: 'best', systemSuggestion: { label: 'Ø£Ø¯Ø®Ù„ ÙˆØ¶Ø¹ Ø§Ù„Ø¶ØºØ·', reason: 'Ø§Ù„Ø¶ØºØ· Ù…Ø±ØªÙØ¹ ÙˆÙŠØªØ·Ù„Ø¨ ØªØ¯Ø®Ù„Ø§Ù‹', confidence: 'low', actionLabel: 'ÙØªØ­ ÙˆØ¶Ø¹ Ø§Ù„Ø¶ØºØ·', secondaryActionLabel: 'ØªØ¬Ø§Ù‡Ù„', auditRequired: true } },
  ] as const,
  captains: [
    { id: 'captain-1', label: 'Captain A', value: 'Available', description: 'Fast response and strong coverage.', tone: 'best' },
    { id: 'captain-2', label: 'Captain B', value: 'Busy', description: 'Currently on a higher priority run.', tone: 'warning' },
    { id: 'captain-3', label: 'Captain C', value: 'Standby', description: 'Ready for the next manual assignment.', tone: 'brand' },
  ] as const,
  actions: [
    { id: 'dispatch-peak-mode', label: 'Open peak mode', description: 'Escalate the lane into pressure management.', href: '/operations?workspace=area-capacity', badge: 'Pressure', tone: 'primary' },
    { id: 'dispatch-captain-ops', label: 'Open captain operations', description: 'Switch to captain readiness and availability.', href: '/operations?workspace=captain-operations', badge: 'Crew', tone: 'secondary' },
    { id: 'dispatch-live-orders', label: 'Return to live orders', description: 'Jump back to detail and chat when needed.', href: '/operations?workspace=live-orders', badge: 'Queue', tone: 'secondary' },
  ] as const,
  disclosures: [
    { id: 'dispatch-canonical', label: 'Canonical hub', description: 'Dispatch assignment is the new home for manual routing.', href: '/operations?workspace=dispatch-assignment', badge: 'Hub' },
    { id: 'dispatch-proxy', label: 'Proxy fulfillment', description: 'Proxy flows can be normalized into this lane.', href: '/operations?workspace=dispatch-assignment', badge: 'Proxy' },
  ],
};

export const CAPTAIN_OPERATIONS_PREVIEW = {
  signals: [
    { id: 'captain-ready', title: 'Ready captains', value: '31', description: 'Captains ready for the next assignment.', tone: 'best' },
    { id: 'captain-busy', title: 'Busy captains', value: '19', description: 'Captains currently active on the road.', tone: 'warning' },
    { id: 'captain-offline', title: 'Offline', value: '4', description: 'Captains temporarily unavailable.', tone: 'danger' },
    { id: 'captain-coverage', title: 'Coverage score', value: '94%', description: 'Combined coverage pressure for the crew.', tone: 'brand' },
  ],
  decisionBoard: {
    title: 'Captain operations decision board',
    purpose: 'Make captain coverage, readiness, and pressure visible at a glance.',
    primaryDecision: 'Do we need to reassign, pause, or promote a captain now?',
    nextAction: 'Open the captain roster and choose the next coverage move.',
    blockers: 'A captain without readiness evidence should remain visible in the queue.',
    ownerSurface: 'operations',
    evidenceHint: 'crew roster, readiness, and coverage pressure',
    routeHint: '/operations?workspace=captain-operations',
    decisionTone: 'brand',
  },
  captains: [
    { id: 'CP-01', title: 'Captain CP-01', status: 'Online', ownerSurface: 'dispatch-assignment', blocker: 'Assigned to order LO-1099', evidence: 'Last check-in 2m ago', primaryActionLabel: 'View profile', secondaryActionLabel: 'Reassign', evidenceActionLabel: 'View route', tone: 'best', systemSuggestion: { label: 'Ø£Ø¹Ø·Ù‡ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„ØªØ§Ù„ÙŠ', reason: 'Ù…ØªØ§Ø­ ÙˆØªÙ‚ÙŠÙŠÙ…Ù‡ Ù…Ù…ØªØ§Ø²', confidence: 'high', actionLabel: 'Ø¥Ø³Ù†Ø§Ø¯ Ø·Ù„Ø¨', secondaryActionLabel: null, auditRequired: false } },
    { id: 'CP-02', title: 'Captain CP-02', status: 'Needs rest', ownerSurface: 'area-capacity', blocker: 'Coverage window is tight', evidence: 'Shift length 6h 30m', primaryActionLabel: 'View profile', secondaryActionLabel: 'Reassign', evidenceActionLabel: 'View route', tone: 'warning', systemSuggestion: { label: 'Ø£Ø¹Ø·Ù‡ Ø§Ø³ØªØ±Ø§Ø­Ø© Ø§Ù„Ø¢Ù†', reason: 'ÙˆØ±Ø¯ÙŠØ© 6.5 Ø³Ø§Ø¹Ø© â€” Ø®Ø·Ø± Ø§Ù†Ø®ÙØ§Ø¶ Ø£Ø¯Ø§Ø¡', confidence: 'medium', actionLabel: 'Ù…Ù†Ø­ Ø§Ø³ØªØ±Ø§Ø­Ø©', secondaryActionLabel: 'ØªØ¹ÙŠÙŠÙ† Ø·Ù„Ø¨ Ø®ÙÙŠÙ', auditRequired: false } },
    { id: 'CP-03', title: 'Captain CP-03', status: 'Ready', ownerSurface: 'dispatch-assignment', blocker: 'Waiting for the next manual assignment', evidence: 'Standby window open', primaryActionLabel: 'View profile', secondaryActionLabel: 'Reassign', evidenceActionLabel: 'View route', tone: 'brand', systemSuggestion: { label: 'Ø£Ø³Ù†Ø¯ Ø¥Ù„ÙŠÙ‡ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ø¹Ø§Ù„Ù‚', reason: 'Ù…ØªØ§Ø­ Ø¹Ù„Ù‰ Ø§Ù„ÙÙˆØ± ÙˆÙ†Ø§ÙØ°Ø© Ø§Ù„Ø§Ø³ØªØ¹Ø¯Ø§Ø¯ Ù…ÙØªÙˆØ­Ø©', confidence: 'high', actionLabel: 'Ø¥Ø³Ù†Ø§Ø¯ Ø·Ù„Ø¨', secondaryActionLabel: null, auditRequired: false } },
  ],
  actions: [
    { id: 'captain-dispatch', label: 'Open dispatch assignment', description: 'Move directly into assignment if coverage changes.', href: '/operations?workspace=dispatch-assignment', badge: 'Assign', tone: 'primary' },
    { id: 'captain-capacity', label: 'Open area capacity', description: 'Inspect pressure before changing the crew mix.', href: '/operations?workspace=area-capacity', badge: 'Pressure', tone: 'secondary' },
  ],
  disclosures: [
    { id: 'captain-roster', label: 'Crew roster', description: 'Captain operations owns readiness and coverage signals.', href: '/operations?workspace=captain-operations', badge: 'Roster' },
  ],
};

export const PARTNER_STORES_PREVIEW = {
  signals: [
    { id: 'stores-ready', title: 'Ready stores', value: '68', description: 'Stores ready for the next handoff.', tone: 'best' },
    { id: 'stores-prep', title: 'Prep pressure', value: '13', description: 'Stores currently under prep pressure.', tone: 'warning' },
    { id: 'stores-intake', title: 'Intake blockers', value: '5', description: 'Stores waiting on an intake decision.', tone: 'danger' },
    { id: 'stores-visible', title: 'Visible stores', value: '94', description: 'Total store rows kept in the preview lane.', tone: 'brand' },
  ],
  decisionBoard: {
    title: 'Partner stores decision board',
    purpose: 'Show store readiness, prep pressure, and intake blockers in one lane.',
    primaryDecision: 'Do we keep a store live, pause it, or push it back into assignment?',
    nextAction: 'Open a store row and verify the readiness evidence.',
    blockers: 'A missing readiness marker keeps the store in preview only.',
    ownerSurface: 'operations',
    evidenceHint: 'store readiness, prep state, and intake blockers',
    routeHint: '/operations?workspace=partner-stores',
    decisionTone: 'best',
  },
  stores: [
    { id: 'ST-2401', title: 'Store ST-2401', status: 'Ready', ownerSurface: 'partner-stores', blocker: 'No blocker', evidence: 'Prep checklist signed', primaryActionLabel: 'Open store', secondaryActionLabel: 'Pause store', evidenceActionLabel: 'View evidence', tone: 'best', systemSuggestion: { label: 'Ù„Ø§ ØªØ¯Ø®Ù„ Ù…Ø·Ù„ÙˆØ¨', reason: 'Ø§Ù„Ù…ØªØ¬Ø± Ø¬Ø§Ù‡Ø² ÙˆØ§Ù„Ù‚Ø§Ø¦Ù…Ø© Ù…ÙƒØªÙ…Ù„Ø©', confidence: 'high', actionLabel: 'Ø¹Ø±Ø¶ Ø§Ù„ØªÙØ§ØµÙŠÙ„', secondaryActionLabel: null, auditRequired: false } },
    { id: 'ST-2402', title: 'Store ST-2402', status: 'Prep pressure', ownerSurface: 'partner-stores', blocker: 'Stock update pending', evidence: 'Prep window ends in 12m', primaryActionLabel: 'Open store', secondaryActionLabel: 'Pause store', evidenceActionLabel: 'View evidence', tone: 'warning', systemSuggestion: { label: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ø§Ù„Ù…ØªØ¬Ø± â€” Ù†Ø§ÙØ°Ø© 12 Ø¯Ù‚ÙŠÙ‚Ø©', reason: 'ØªØ­Ø¯ÙŠØ« Ø§Ù„Ù…Ø®Ø²ÙˆÙ† Ù…Ø¹Ù„Ù‚ ÙˆØ§Ù„ÙˆÙ‚Øª ÙŠØ¶ÙŠÙ‚', confidence: 'high', actionLabel: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ø§Ù„Ù…ØªØ¬Ø±', secondaryActionLabel: 'Ø¥ÙŠÙ‚Ø§Ù Ù…Ø¤Ù‚Øª', auditRequired: false } },
    { id: 'ST-2403', title: 'Store ST-2403', status: 'Intake blocker', ownerSurface: 'partner-stores', blocker: 'Needs owner approval', evidence: 'Approval request open', primaryActionLabel: 'Open store', secondaryActionLabel: 'Pause store', evidenceActionLabel: 'View evidence', tone: 'danger', systemSuggestion: { label: 'ØµØ¹Ù‘Ø¯ Ø·Ù„Ø¨ Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø© ÙÙˆØ±Ø§Ù‹', reason: 'Ø·Ù„Ø¨ Ø§Ø³ØªÙ„Ø§Ù… Ù…ÙØªÙˆØ­ Ø¨Ø¯ÙˆÙ† ØµØ§Ø­Ø¨ Ù‚Ø±Ø§Ø±', confidence: 'medium', actionLabel: 'ØªØµØ¹ÙŠØ¯ Ù„Ù„Ù…Ø´Ø±Ù', secondaryActionLabel: 'Ø¥ÙŠÙ‚Ø§Ù Ù…Ø¤Ù‚Øª', auditRequired: true } },
  ],
  actions: [
    { id: 'stores-dispatch', label: 'Open dispatch assignment', description: 'Hand the store back into assignment when the queue moves.', href: '/operations?workspace=dispatch-assignment', badge: 'Assign', tone: 'primary' },
    { id: 'stores-live-orders', label: 'Open live orders', description: 'Inspect the order queue that depends on the store.', href: '/operations?workspace=live-orders', badge: 'Queue', tone: 'secondary' },
  ],
  disclosures: [
    { id: 'stores-readiness', label: 'Readiness line', description: 'Partner stores normalize store intake and handoff pressure.', href: '/operations?workspace=partner-stores', badge: 'Ready' },
  ],
};

export const AREA_CAPACITY_PREVIEW = {
  signals: [
    { id: 'capacity-busy', title: 'Busy areas', value: '8', description: 'Areas currently under visible pressure.', tone: 'danger' },
    { id: 'capacity-supply', title: 'Low supply', value: '5', description: 'Areas with a thin captain reserve.', tone: 'warning' },
    { id: 'capacity-windows', title: 'Reserved windows', value: '22', description: 'Capacity windows already reserved for delivery.', tone: 'best' },
    { id: 'capacity-pressure', title: 'Pressure modes', value: '3', description: 'Mode pressure currently being monitored.', tone: 'brand' },
  ],
  decisionBoard: {
    title: 'Area capacity decision board',
    purpose: 'Keep area pressure and capacity windows visible before the lane overloads.',
    primaryDecision: 'Do we stay in normal operation or shift into peak mode now?',
    nextAction: 'Open peak mode or zone set if the pressure is structural.',
    blockers: 'Reserved windows and pressure modes remain explicit in the preview.',
    ownerSurface: 'operations',
    evidenceHint: 'busy area, captain supply, and reserved windows',
    routeHint: '/operations?workspace=area-capacity',
    decisionTone: 'warning',
  },
  areas: [
    { id: 'AR-01', title: 'Area AR-01', status: 'High pressure', ownerSurface: 'dispatch-assignment', blocker: 'Captain supply low', evidence: 'Reserved window 14:00-15:30', primaryActionLabel: 'Open area', secondaryActionLabel: 'Shift mode', evidenceActionLabel: 'View window', tone: 'danger', systemSuggestion: { label: 'ÙØ¹Ù‘Ù„ Bonus ÙÙˆØ±Ø§Ù‹', reason: 'ØªØºØ·ÙŠØ© Ù…Ù†Ø®ÙØ¶Ø© ÙˆØ§Ù„Ø¶ØºØ· ÙŠØ±ØªÙØ¹', confidence: 'high', actionLabel: 'ØªÙØ¹ÙŠÙ„ Bonus Area', secondaryActionLabel: 'ØªÙ‚Ù„ÙŠÙ„ Ø§Ù„Ù†Ø·Ø§Ù‚', auditRequired: false, risk: 'critical' } },
    { id: 'AR-02', title: 'Area AR-02', status: 'Tight but stable', ownerSurface: 'captain-operations', blocker: 'Coverage about to drop', evidence: 'Window reserved for surge', primaryActionLabel: 'Open area', secondaryActionLabel: 'Shift mode', evidenceActionLabel: 'View window', tone: 'warning', systemSuggestion: { label: 'Ø±Ø§Ù‚Ø¨ ÙˆØ§Ø³ØªØ¹Ø¯ Ù„ØªÙ‚Ù„ÙŠÙ„ Ø§Ù„Ù†Ø·Ø§Ù‚', reason: 'Ø§Ù„ØªØºØ·ÙŠØ© Ø³ØªÙ†Ø®ÙØ¶ Ø®Ù„Ø§Ù„ 15 Ø¯Ù‚ÙŠÙ‚Ø©', confidence: 'medium', actionLabel: 'ØªÙ‚Ù„ÙŠÙ„ Ø§Ù„Ù†Ø·Ø§Ù‚', secondaryActionLabel: 'Ù†Ù‚Ù„ ÙƒØ¨Ø§ØªÙ†', auditRequired: false, risk: 'medium' } },
    { id: 'AR-03', title: 'Area AR-03', status: 'Healthy', ownerSurface: 'partner-stores', blocker: 'No current blocker', evidence: 'Delivery mode balanced', primaryActionLabel: 'Open area', secondaryActionLabel: 'Shift mode', evidenceActionLabel: 'View window', tone: 'best', systemSuggestion: { label: 'ÙŠÙ…ÙƒÙ† Ù†Ù‚Ù„ ÙƒØ¨Ø§ØªÙ† Ù„Ù„Ù…Ù†Ø§Ø·Ù‚ Ø§Ù„Ù…Ø¶ØºÙˆØ·Ø©', reason: 'Ø§Ù„Ù…Ù†Ø·Ù‚Ø© Ù…ØªÙˆØ§Ø²Ù†Ø© ÙˆÙ„Ø¯ÙŠÙ‡Ø§ ÙØ§Ø¦Ø¶', confidence: 'medium', actionLabel: 'Ù†Ù‚Ù„ ÙƒØ¨Ø§ØªÙ†', secondaryActionLabel: null, auditRequired: false, risk: 'low' } },
  ],
  actions: [
    { id: 'capacity-peak', label: 'Open peak mode', description: 'Move into pressure management when needed.', href: '/operations?workspace=dispatch-assignment', badge: 'Pressure', tone: 'primary' },
    { id: 'capacity-zone-set', label: 'Open zone set', description: 'Review the area boundaries that define this lane.', href: '/operations?workspace=area-capacity', badge: 'Boundary', tone: 'secondary' },
    { id: 'capacity-serviceability', label: 'Open serviceability', description: 'Re-read coverage and delivery availability.', href: '/operations?workspace=area-capacity', badge: 'Coverage', tone: 'secondary' },
  ],
  disclosures: [
    { id: 'capacity-reserve', label: 'Reserve line', description: 'Capacity windows and peak mode remain readable here.', href: '/operations?workspace=area-capacity', badge: 'Reserve' },
  ],
};

export const EXCEPTIONS_ESCALATIONS_PREVIEW = {
  signals: [
    { id: 'exceptions-open', title: 'Open exceptions', value: '17', description: 'Exceptions still awaiting recovery.', tone: 'danger' },
    { id: 'exceptions-sla-breach', title: 'SLA breaches', value: '4', description: 'Issues already outside the target.', tone: 'warning' },
    { id: 'exceptions-serviceability', title: 'Serviceability', value: '3', description: 'Cases blocked by coverage or eligibility.', tone: 'brand' },
    { id: 'exceptions-recovered', title: 'Recovered today', value: '29', description: 'Issues closed with an explicit owner.', tone: 'best' },
  ],
  decisionBoard: {
    title: 'Exceptions and escalations decision board',
    purpose: 'Track the exception queue, owner routing, and recovery path in one preview lane.',
    primaryDecision: 'Which exception needs owner escalation or SLA recovery first?',
    nextAction: 'Select a queue item and move it to the right recovery path.',
    blockers: 'Any open owner assignment keeps the queue visible.',
    ownerSurface: 'operations',
    evidenceHint: 'exception queue, owner routing, and recovery status',
    routeHint: '/operations?workspace=exceptions-escalations',
    decisionTone: 'danger',
  },
  exceptions: [
    { id: 'EX-4101', title: 'Exception EX-4101', status: 'Owner missing', ownerSurface: 'audit-support-sla', blocker: 'No recovery owner assigned', evidence: 'SLA timer at 31m', primaryActionLabel: 'Assign owner', secondaryActionLabel: 'Escalate', evidenceActionLabel: 'View SLA', tone: 'danger', systemSuggestion: { label: 'Ø¹ÙŠÙ‘Ù† Ù…Ø§Ù„ÙƒØ§Ù‹ ÙÙˆØ±Ø§Ù‹ â€” SLA 31 Ø¯Ù‚ÙŠÙ‚Ø©', reason: 'Ù„Ø§ Ù…Ø§Ù„Ùƒ Ù…Ø³Ø¬Ù„ ÙˆØ§Ù„Ø¹Ø¯Ø§Ø¯ ÙŠØ¹Ù…Ù„', confidence: 'high', actionLabel: 'ØªØ¹ÙŠÙŠÙ† Ù…Ø§Ù„Ùƒ', secondaryActionLabel: 'ØªØµØ¹ÙŠØ¯ Ù„Ù„Ø¥Ø¯Ø§Ø±Ø©', auditRequired: true } },
    { id: 'EX-4102', title: 'Exception EX-4102', status: 'Serviceability risk', ownerSurface: 'area-capacity', blocker: 'Area pressure still high', evidence: 'Coverage gap on map', primaryActionLabel: 'Assign owner', secondaryActionLabel: 'Escalate', evidenceActionLabel: 'View SLA', tone: 'warning', systemSuggestion: { label: 'ØªØ­Ù‚Ù‚ Ù…Ù† ÙØ¬ÙˆØ© Ø§Ù„ØªØºØ·ÙŠØ© ÙÙŠ Ø§Ù„Ø®Ø±ÙŠØ·Ø©', reason: 'Ø¶ØºØ· Ø§Ù„Ù…Ù†Ø·Ù‚Ø© Ù„Ø§ ÙŠØ²Ø§Ù„ Ù…Ø±ØªÙØ¹Ø§Ù‹', confidence: 'medium', actionLabel: 'ÙØªØ­ Ø§Ù„Ù…Ù†Ø§Ø·Ù‚', secondaryActionLabel: 'ØªØµØ¹ÙŠØ¯', auditRequired: false } },
    { id: 'EX-4103', title: 'Exception EX-4103', status: 'Recoverable', ownerSurface: 'live-orders', blocker: 'Waiting on proof confirmation', evidence: 'Recovery action queued', primaryActionLabel: 'Assign owner', secondaryActionLabel: 'Escalate', evidenceActionLabel: 'View SLA', tone: 'best', systemSuggestion: { label: 'Ø£ØºÙ„Ù‚ Ø¨Ø¹Ø¯ ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø¥Ø«Ø¨Ø§Øª', reason: 'Ø¥Ø¬Ø±Ø§Ø¡ Ø§Ù„Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ø¬Ø§Ù‡Ø² â€” ÙÙ‚Ø· ÙŠØ­ØªØ§Ø¬ ØªØ£ÙƒÙŠØ¯', confidence: 'high', actionLabel: 'Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ø§Ø³ØªØ«Ù†Ø§Ø¡', secondaryActionLabel: null, auditRequired: false } },
  ],
  actions: [
    { id: 'exceptions-audit', label: 'Open audit & SLA', description: 'Send the exception into proof and support review.', href: '/operations?workspace=audit-support-sla', badge: 'Proof', tone: 'primary' },
    { id: 'exceptions-capacity', label: 'Open area capacity', description: 'Check whether pressure is the actual blocker.', href: '/operations?workspace=area-capacity', badge: 'Capacity', tone: 'secondary' },
  ],
  disclosures: [
    { id: 'exceptions-canonical', label: 'Canonical exception hub', description: 'The exceptions-escalations lane now owns the recovery queue.', href: '/operations?workspace=exceptions-escalations', badge: 'Hub' },
  ],
};

export const AUDIT_SUPPORT_SLA_PREVIEW = {
  signals: [
    { id: 'audit-open', title: 'Manual audits', value: '12', description: 'Open manual action audits.', tone: 'brand' },
    { id: 'audit-support', title: 'Support tickets', value: '6', description: 'Support cases waiting for a bridge.', tone: 'warning' },
    { id: 'audit-sla', title: 'SLA risk', value: '5', description: 'Items in danger of breaching the target.', tone: 'danger' },
    { id: 'audit-evidence', title: 'Evidence complete', value: '84%', description: 'How much of the queue has closure proof.', tone: 'best' },
  ],
  decisionBoard: {
    title: 'Audit, support and SLA decision board',
    purpose: 'Keep manual action audit, support bridge, and SLA discipline in the same preview lane.',
    primaryDecision: 'Which ticket needs evidence, support, or SLA recovery now?',
    nextAction: 'Open an item and route it into the correct proof path.',
    blockers: 'Any missing evidence keeps the audit queue open.',
    ownerSurface: 'operations',
    evidenceHint: 'manual action audit, support bridge, and SLA timing',
    routeHint: '/operations?workspace=audit-support-sla',
    decisionTone: 'brand',
  },
  audits: [
    { id: 'AU-7001', title: 'Audit AU-7001', status: 'Needs proof', ownerSurface: 'audit-support-sla', blocker: 'Receipt image missing', evidence: 'Audit trail open', primaryActionLabel: 'Open audit', secondaryActionLabel: 'Escalate', evidenceActionLabel: 'View proof', tone: 'danger', systemSuggestion: { label: 'Ø§Ø·Ù„Ø¨ ØµÙˆØ±Ø© Ø§Ù„Ø¥ÙŠØµØ§Ù„ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±', reason: 'ØµÙˆØ±Ø© Ø§Ù„Ø¥ÙŠØµØ§Ù„ Ù…ÙÙ‚ÙˆØ¯Ø© ÙˆØ³Ø¬Ù„ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ Ù…ÙØªÙˆØ­', confidence: 'high', actionLabel: 'Ø·Ù„Ø¨ Ø¥Ø«Ø¨Ø§Øª', secondaryActionLabel: 'ØªØµØ¹ÙŠØ¯', auditRequired: true, needsEvidence: true } },
    { id: 'AU-7002', title: 'Audit AU-7002', status: 'Support bridge', ownerSurface: 'audit-support-sla', blocker: 'Customer reply pending', evidence: 'Bridge request created', primaryActionLabel: 'Open audit', secondaryActionLabel: 'Escalate', evidenceActionLabel: 'View proof', tone: 'warning', systemSuggestion: { label: 'ØªØ§Ø¨Ø¹ Ø±Ø¯ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø®Ù„Ø§Ù„ 10 Ø¯Ù‚Ø§Ø¦Ù‚', reason: 'Ø·Ù„Ø¨ Ø§Ù„Ø¬Ø³Ø± Ø£ÙÙ†Ø´Ø¦ â€” Ø§Ù„Ø¹Ù…ÙŠÙ„ Ù„Ù… ÙŠØ±Ø¯ Ø¨Ø¹Ø¯', confidence: 'medium', actionLabel: 'Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¹Ù…ÙŠÙ„', secondaryActionLabel: 'Ø¥ØºÙ„Ø§Ù‚ Ø¨Ø¯ÙˆÙ† Ø±Ø¯', auditRequired: false, needsEvidence: false } },
    { id: 'AU-7003', title: 'Audit AU-7003', status: 'Ready to close', ownerSurface: 'audit-support-sla', blocker: 'No blocker', evidence: 'Evidence package complete', primaryActionLabel: 'Open audit', secondaryActionLabel: 'Escalate', evidenceActionLabel: 'View proof', tone: 'best', systemSuggestion: { label: 'Ø£ØºÙ„Ù‚ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ â€” Ø§Ù„Ø¥Ø«Ø¨Ø§Øª Ù…ÙƒØªÙ…Ù„', reason: 'Ø­Ø²Ù…Ø© Ø§Ù„Ø¥Ø«Ø¨Ø§Øª Ù…ÙƒØªÙ…Ù„Ø© ÙˆÙ„Ø§ Ø¹ÙˆØ§Ø¦Ù‚', confidence: 'high', actionLabel: 'Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚', secondaryActionLabel: null, auditRequired: false, needsEvidence: false } },
  ],
  supportTickets: [
    { id: 'SUP-51', label: 'Support ticket SUP-51', value: 'Open', description: 'Bridge to the customer is already in motion.', tone: 'warning' },
    { id: 'SUP-52', label: 'Support ticket SUP-52', value: 'Closed', description: 'Evidence has already been attached.', tone: 'best' },
    { id: 'SUP-53', label: 'Support ticket SUP-53', value: 'At risk', description: 'Requires SLA recovery before end of day.', tone: 'danger' },
  ],
  actions: [
    { id: 'audit-live-orders', label: 'Open live orders', description: 'Return to the order queue when the audit is resolved.', href: '/operations?workspace=live-orders', badge: 'Queue', tone: 'primary' },
    { id: 'audit-exceptions', label: 'Open exceptions', description: 'Escalate the item back into the exception queue.', href: '/operations?workspace=exceptions-escalations', badge: 'Risk', tone: 'secondary' },
  ],
  disclosures: [
    { id: 'audit-canonical', label: 'Canonical proof hub', description: 'Audit support and SLA now own the evidence lane.', href: '/operations?workspace=audit-support-sla', badge: 'Proof' },
  ],
};
