export type DshErrorSeverity = 'transient' | 'fatal' | 'validation' | 'policy';

export type DshErrorStateModel = {
  readonly hasError: boolean;
  readonly errorMessage?: string;
  readonly severity: DshErrorSeverity;
  readonly retryLabel?: string;
  readonly canRetry: boolean;
};

export function buildDshErrorState(
  message: string,
  opts: { severity?: DshErrorSeverity; retryLabel?: string; canRetry?: boolean } = {},
): DshErrorStateModel {
  return {
    hasError: true,
    errorMessage: message,
    severity: opts.severity ?? 'transient',
    retryLabel: opts.retryLabel ?? 'حاول مرة أخرى',
    canRetry: opts.canRetry ?? true,
  };
}

export const DSH_NO_ERROR: DshErrorStateModel = {
  hasError: false,
  severity: 'transient',
  canRetry: false,
};
