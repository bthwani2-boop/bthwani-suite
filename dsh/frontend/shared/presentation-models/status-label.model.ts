export type DshStatusTone = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

export type DshStatusLabelModel = {
  readonly label: string;
  readonly tone: DshStatusTone;
  readonly description?: string;
};

export function buildDshStatusLabel(
  label: string,
  tone: DshStatusTone,
  description?: string,
): DshStatusLabelModel {
  return { label, tone, description };
}
