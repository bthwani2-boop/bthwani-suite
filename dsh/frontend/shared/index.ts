// ── BThwani Full-Stack DSH Shared ────────────────────────────────────────────
// Capability gateways — each sub-directory owns its domain.
// Rule: no JSX, no ui-kit, no Tamagui in this layer.
// Design authority: @bthwani/ui-kit only.
// WLT finance mutations: wlt/frontend/dsh/shared only.
// ─────────────────────────────────────────────────────────────────────────────

// Full-Stack capability coverage map (13 capabilities)
export * from './full-stack';

// WLT Finance Boundary — DSH read-only bridge (no mutations)
export * from './finance-boundary';

// Presentation Models — data-only UI models (no JSX, no ui-kit)
export * from './presentation-models';

// API Clients — HTTP adapters for all DSH backend endpoints
export * from './api';

// Contracts — data shapes, type definitions, identity models
export * from './contracts';

// State Machines — lifecycle models, journey maps, approval flows
export * from './state-machines';

// Policies — role-based permissions, flow registry, access control
export * from './policies';

// Adapters — data mappers, operational adapters, commercial feature mapping
export * from './adapters';

// Control-Panel Models — governance map, section registries, CP contracts
export * from './control-panel';

// Media — image resolution and media path utilities
export * from './media';

// Runtime — surface runtime contracts, operational bindings, platform providers
export * from './runtime';
