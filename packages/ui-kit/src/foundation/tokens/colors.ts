import { rawColorPalettes, semanticColorRoles, withAlpha } from './source';

export const neutralPalette = rawColorPalettes.neutral;
export const brandPalette = rawColorPalettes.brand;
export const successPalette = rawColorPalettes.success;
export const warningPalette = rawColorPalettes.warning;
export const dangerPalette = rawColorPalettes.danger;
export const infoPalette = rawColorPalettes.info;

export { withAlpha };

export const colorPalette = semanticColorRoles;

export type PaletteKey = keyof typeof colorPalette;
