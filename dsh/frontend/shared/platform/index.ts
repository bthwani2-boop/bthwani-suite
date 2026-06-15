// Platform topic — feature flags, platform vars, runtime environment config.
// Rule: read-only consumers; no direct local apply without API backing.

export * from './feature-flags';
export * from './platform-vars';
export * from './platform-vars.policy';
export * from './platform-vars.view-model';
export * from './platform-vars.session';
export * from './local-temp-id';
