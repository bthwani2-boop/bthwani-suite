export const NativeModulesProxy = {};
export const Platform = {};
export const EventSubscriptionVendor = {};

export function requireNativeModule<T = Record<string, never>>(): T {
  return {} as T;
}

export function requireOptionalNativeModule<T = Record<string, never>>(): T | null {
  return null;
}

export class EventEmitter {
  constructor(..._args: unknown[]) {}

  addListener(..._args: unknown[]) {
    return { remove: () => undefined };
  }

  removeAllListeners(..._args: unknown[]) {
    return undefined;
  }

  removeSubscription(..._args: unknown[]) {
    return undefined;
  }

  emit(..._args: unknown[]) {
    return undefined;
  }
}

export class SharedObject {}
export class SharedRef {}

export function registerWebModule(..._args: unknown[]) {
  return undefined;
}

export default {};
