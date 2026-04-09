import {
  rawBorderScale,
  rawBreakpointScale,
  rawColorPalettes,
  rawElevationScale,
  rawMotionScale,
  rawOpacityScale,
  rawRadiusScale,
  rawSafeAreaScale,
  rawSizingScale,
  rawSpacingScale,
  rawTypographyScale,
  rawZIndexScale,
  semanticColorRoles,
  tokenSourceMetadata
} from './source';

export type BthCssVariableMap = Record<string, string>;

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function toPixel(value: number) {
  return value === 0 ? '0' : `${value}px`;
}

function toMilliseconds(value: number) {
  return value === 0 ? '0ms' : `${value}ms`;
}

function appendVariables(target: BthCssVariableMap, entries: Record<string, string>) {
  for (const [name, value] of Object.entries(entries)) {
    target[name] = value;
  }
}

function createPaletteCssVariables() {
  const variables: BthCssVariableMap = {};

  for (const [paletteName, paletteValues] of Object.entries(rawColorPalettes)) {
    for (const [tokenName, tokenValue] of Object.entries(paletteValues)) {
      variables[`--bth-palette-${toKebabCase(paletteName)}-${tokenName}`] = tokenValue;
    }
  }

  for (const [semanticRole, tokenValue] of Object.entries(semanticColorRoles)) {
    variables[`--bth-color-${toKebabCase(semanticRole)}`] = tokenValue;
  }

  return variables;
}

function createScaleCssVariables(prefix: string, values: Record<string, number>, formatter: (value: number) => string) {
  const variables: BthCssVariableMap = {};

  for (const [tokenName, tokenValue] of Object.entries(values)) {
    variables[`--bth-${prefix}-${toKebabCase(tokenName)}`] = formatter(tokenValue);
  }

  return variables;
}

function createTypographyCssVariables() {
  const variables: BthCssVariableMap = {};

  for (const [familyName, familyValue] of Object.entries(rawTypographyScale.fontFamilies)) {
    variables[`--bth-font-family-${toKebabCase(familyName)}`] = familyValue;
  }

  for (const [weightName, weightValue] of Object.entries(rawTypographyScale.fontWeights)) {
    variables[`--bth-font-weight-${toKebabCase(weightName)}`] = weightValue;
  }

  for (const [spacingName, spacingValue] of Object.entries(rawTypographyScale.letterSpacings)) {
    variables[`--bth-letter-spacing-${toKebabCase(spacingName)}`] = `${spacingValue}px`;
  }

  for (const [roleName, roleValues] of Object.entries(rawTypographyScale.textRoles)) {
    for (const [propertyName, propertyValue] of Object.entries(roleValues)) {
      const variableName = `--bth-text-role-${toKebabCase(roleName)}-${toKebabCase(propertyName)}`;

      if (typeof propertyValue === 'number') {
        variables[variableName] = `${propertyValue}px`;
      } else {
        variables[variableName] = String(propertyValue);
      }
    }
  }

  return variables;
}

export function createTokenCssVariables() {
  const variables: BthCssVariableMap = {};

  appendVariables(variables, createPaletteCssVariables());
  appendVariables(variables, createScaleCssVariables('spacing', rawSpacingScale, toPixel));
  appendVariables(variables, createScaleCssVariables('radius', rawRadiusScale, toPixel));
  appendVariables(variables, createScaleCssVariables('size', rawSizingScale, toPixel));
  appendVariables(variables, createScaleCssVariables('breakpoint', rawBreakpointScale, toPixel));
  appendVariables(variables, createScaleCssVariables('safe-area', rawSafeAreaScale, toPixel));
  appendVariables(variables, createScaleCssVariables('motion', rawMotionScale, toMilliseconds));
  appendVariables(variables, createScaleCssVariables('border', rawBorderScale, toPixel));
  appendVariables(variables, createScaleCssVariables('z-index', rawZIndexScale, String));
  appendVariables(variables, createScaleCssVariables('opacity', rawOpacityScale, String));
  appendVariables(variables, createScaleCssVariables('elevation', rawElevationScale, String));
  appendVariables(variables, createTypographyCssVariables());

  return variables;
}

export function createTokenCssDeclarations() {
  return Object.entries(createTokenCssVariables())
    .map(([variableName, variableValue]) => `  ${variableName}: ${variableValue};`)
    .join('\n');
}

export function createTokenCssBlock(selector = ':root') {
  return `${selector} {\n${createTokenCssDeclarations()}\n}`;
}

export function createNativeTokenOutput() {
  return {
    metadata: tokenSourceMetadata,
    colors: {
      raw: rawColorPalettes,
      semantic: semanticColorRoles
    },
    spacing: rawSpacingScale,
    radius: rawRadiusScale,
    elevation: rawElevationScale,
    motion: rawMotionScale,
    sizing: rawSizingScale,
    breakpoints: rawBreakpointScale,
    safeArea: rawSafeAreaScale,
    borders: rawBorderScale,
    zIndex: rawZIndexScale,
    opacity: rawOpacityScale,
    typography: rawTypographyScale
  };
}

export const bthTokenCssVariables = createTokenCssVariables();

export const bthNativeTokenOutput = createNativeTokenOutput();