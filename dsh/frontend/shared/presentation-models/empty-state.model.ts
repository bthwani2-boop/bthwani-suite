export type DshEmptyStateTone = 'neutral' | 'warning' | 'danger' | 'success' | 'info';

export type DshEmptyStateModel = {
  readonly title: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly tone: DshEmptyStateTone;
  readonly iconName?: string;
};

export function buildDshEmptyState(
  title: string,
  opts: Partial<Omit<DshEmptyStateModel, 'title'>> = {},
): DshEmptyStateModel {
  return {
    title,
    description: opts.description,
    actionLabel: opts.actionLabel,
    tone: opts.tone ?? 'neutral',
    iconName: opts.iconName,
  };
}
