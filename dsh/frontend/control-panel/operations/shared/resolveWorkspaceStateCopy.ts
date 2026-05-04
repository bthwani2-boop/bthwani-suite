import type { useDshControlPanelText } from './dshControlPanelText';

export type DshWorkspaceScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export function resolveWorkspaceStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<DshWorkspaceScreenState, 'ready'>,
) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.hub.stateLoadingTitle,
      description: text.hub.stateLoadingDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: text.hub.stateEmptyTitle,
      description: text.hub.stateEmptyDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.hub.stateOfflineTitle,
      description: text.hub.stateOfflineDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.hub.stateDisabledTitle,
      description: text.hub.stateDisabledDescription,
      actionLabel: text.common.backToHub,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.hub.stateErrorTitle,
    description: text.hub.stateErrorDescription,
    actionLabel: text.common.backToHub,
  };
}