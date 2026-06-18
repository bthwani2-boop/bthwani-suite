export type DshActionVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type DshActionLabelModel = {
  readonly label: string;
  readonly variant: DshActionVariant;
  readonly iconName?: string;
  readonly isDestructive?: boolean;
  readonly isDisabled?: boolean;
};

export function buildDshActionLabel(
  label: string,
  variant: DshActionVariant = 'primary',
  opts: Partial<Pick<DshActionLabelModel, 'iconName' | 'isDestructive' | 'isDisabled'>> = {},
): DshActionLabelModel {
  return { label, variant, ...opts };
}
