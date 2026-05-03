import type { useDshControlPanelText } from './dshControlPanelText';

export type DshScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export function resolveDshStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<DshScreenState, 'ready'>,
) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.hub.stateLoadingTitle,
      description: text.hub.stateLoadingDescription,
      actionLabel: text.common.openGeneralOperations,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: text.hub.stateEmptyTitle,
      description: text.hub.stateEmptyDescription,
      actionLabel: text.common.openGeneralOperations,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.hub.stateOfflineTitle,
      description: text.hub.stateOfflineDescription,
      actionLabel: text.common.openGeneralOperations,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.hub.stateDisabledTitle,
      description: text.hub.stateDisabledDescription,
      actionLabel: text.common.openGeneralOperations,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.hub.stateErrorTitle,
    description: text.hub.stateErrorDescription,
    actionLabel: text.common.openGeneralOperations,
  };
}