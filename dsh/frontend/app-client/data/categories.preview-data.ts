/**
 * Surface adapter — re-exports from central DSH domain preview data owner.
 * Domain entities live in dsh/frontend/data — this file is a backwards-compat
 * surface adapter for app-client internal use only.
 *
 * Do NOT import this from any surface other than app-client.
 * Other surfaces must import directly from dsh/frontend/data.
 */
export * from '../../data/categories.preview-data';
