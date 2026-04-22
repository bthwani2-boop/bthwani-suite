/**
 * Lean UI Kit providers facade.
 *
 * Canonical rule:
 * - src/providers.tsx is only a thin public facade.
 * - real provider implementation stays in src/providers/index.ts during transition.
 * - this prevents ../providers imports from resolving to an empty placeholder.
 */

export * from './providers/index';
