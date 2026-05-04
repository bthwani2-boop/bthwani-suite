import type { useDshControlPanelText } from './shared/dshControlPanelText';

export type OperationsViewState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

type StateViewCopy = {
  stateId?: 'loading' | 'empty' | 'offline' | 'recoverableError';
  kind?: 'warning';
  title: string;
  description: string;
  actionLabel: string;
};

const STATE_COPY: Record<Exclude<OperationsViewState, 'ready'>, StateViewCopy> = {
  loading: {
    stateId: 'loading',
    title: 'Loading operations preview',
    description: 'The preview workspace is preparing the next operational state.',
    actionLabel: 'Open operations',
  },
  empty: {
    stateId: 'empty',
    title: 'Nothing to show yet',
    description: 'No operational sample is available for the current workspace.',
    actionLabel: 'Open operations',
  },
  error: {
    stateId: 'recoverableError',
    title: 'Preview data is unavailable',
    description: 'The workspace can recover after the next refresh.',
    actionLabel: 'Open operations',
  },
  offline: {
    stateId: 'offline',
    title: 'Operations preview is offline',
    description: 'Restore connectivity or reload the workspace to continue.',
    actionLabel: 'Open operations',
  },
  disabled: {
    kind: 'warning',
    title: 'Preview mode is disabled',
    description: 'The operational preview is hidden until the workspace is ready again.',
    actionLabel: 'Open operations',
  },
};

export function resolveOperationsStateCopy(state: Exclude<OperationsViewState, 'ready'>): StateViewCopy;
export function resolveOperationsStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<OperationsViewState, 'ready'>,
): StateViewCopy;
export function resolveOperationsStateCopy(
  textOrState: ReturnType<typeof useDshControlPanelText> | Exclude<OperationsViewState, 'ready'>,
  state?: Exclude<OperationsViewState, 'ready'>,
) {
  const resolvedState = (typeof textOrState === 'string' ? textOrState : state) as Exclude<OperationsViewState, 'ready'>;
  return STATE_COPY[resolvedState];
}