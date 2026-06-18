export type DshLoadingStateModel = {
  readonly isLoading: boolean;
  readonly loadingLabel?: string;
};

export function buildDshLoadingState(label?: string): DshLoadingStateModel {
  return { isLoading: true, loadingLabel: label };
}

export const DSH_IDLE_STATE: DshLoadingStateModel = { isLoading: false };
