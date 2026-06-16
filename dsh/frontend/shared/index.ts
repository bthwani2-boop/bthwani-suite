// ── BThwani Full-Stack DSH Shared — Topic-First SSOT ─────────────────────────
// Rule: no JSX, no ui-kit, no Tamagui. Design authority: @bthwani/ui-kit only.
// WLT finance mutations: wlt/frontend/dsh/shared only.
// Import order: topic-first, then layer-compat re-exports.
// ─────────────────────────────────────────────────────────────────────────────

// ── Topics ────────────────────────────────────────────────────────────────────

export * from './full-stack';
export * from './catalog';
export * from './marketing';
export * from './notifications';
export * from './support';
export * from './partner';
export * from './operations';
export * from './products';
export * from './orders';
export * from './stores';
export * from './cart';
export * from './checkout';
export * from './captain';
export * from './delivery';
export * from './finance-boundary';
export * from './presentation-models';

// Identity-Access Topic — roles, permissions, surface visibility, audit
export * from './identity-access';

// Discovery Topic — home feed, store list, service dial, category rails
export * from './discovery';

// Platform Topic — feature flags, platform vars, runtime env config
export * from './platform';

// Control-Panel Topic — admin workspaces, governance map, operations registry, cross-surface closure
export * from './control-panel';

// Media Topic — media API client, image resolution, entity media hooks, captain-pod downstream
export * from './media';

// Runtime Topic — auth client, flow registry, surface binding, price formatting, runtime contracts
export * from './runtime';
