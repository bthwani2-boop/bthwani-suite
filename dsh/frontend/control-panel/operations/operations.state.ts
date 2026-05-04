import {
  resolveDshStateCopy,
  type DshScreenState,
  useDshControlPanelText,
} from './shared';

export type OperationsViewState = DshScreenState;

export function resolveOperationsStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<OperationsViewState, 'ready'>,
) {
  return resolveDshStateCopy(text, state);
}