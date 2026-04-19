export * from './surface-meta';
export * from './surface-catalog';
export * from './family.catalog';
export * from './awnak/screens';
export * from './categories/screens';
export * from './cart/screens';
export * from './discovery/screens';
export * from './entry/screens';
export * from './favorites/screens';
export * from './gas/screens';
export * from './bell';
export * from './home/screens';
export * from './my_space/screens';
export * from './notifications/screens';
export * from './loyalty/screens';
// orders folder consolidated into checkout/screens to avoid duplication
export * from './shein/screens';
export * from './stores/screens';
export * from './support/screens';
// 'tracking' and 'checkout' families were consolidated; explicit exports removed.
export { DshSurfaceHost } from './DshSurfaceHost';
export type { DshCommandTarget, DshRoute } from './DshSurfaceHost';

