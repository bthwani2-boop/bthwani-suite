import { createTokenCssBlock, createNativeTokenOutput } from '../tokens';
import { highContrastTheme, lightTheme, darkTheme, resolveSemanticTheme, semanticThemeByMode, type SemanticTheme, type ThemeMode } from './semantic';

export type BthThemeCssVariableMap = Record<string, string>;

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function resolveColorScheme(mode: ThemeMode) {
  return mode === 'dark' || mode === 'high-contrast' ? 'dark' : 'light';
}

export function createThemeCssVariables(theme: SemanticTheme) {
  const variables: BthThemeCssVariableMap = {};

  for (const [themeKey, themeValue] of Object.entries(theme)) {
    if (themeKey === 'mode') {
      continue;
    }

    variables[`--bth-${toKebabCase(themeKey)}`] = themeValue;
  }

  variables['--bth-color-scheme'] = resolveColorScheme(theme.mode);

  return variables;
}

export function createThemeCssDeclarations(theme: SemanticTheme) {
  return Object.entries(createThemeCssVariables(theme))
    .map(([variableName, variableValue]) => `  ${variableName}: ${variableValue};`)
    .concat(`  color-scheme: ${resolveColorScheme(theme.mode)};`)
    .join('\n');
}

export function createThemeCssBlock(theme: SemanticTheme, selector: string) {
  return `${selector} {\n${createThemeCssDeclarations(theme)}\n}`;
}

export function buildBthWebThemeStyleSheet(rootSelector = '[data-bth-root="true"]') {
  return [
    createTokenCssBlock(rootSelector),
    createThemeCssBlock(lightTheme, `${rootSelector}, ${rootSelector}[data-bth-theme='light']`),
    createThemeCssBlock(darkTheme, `${rootSelector}[data-bth-theme='dark']`),
    createThemeCssBlock(highContrastTheme, `${rootSelector}[data-bth-theme='high-contrast']`)
  ].join('\n\n');
}

export function createNativeThemeOutput(mode: ThemeMode) {
  return {
    mode,
    theme: resolveSemanticTheme(mode),
    tokens: createNativeTokenOutput()
  };
}

export const bthThemeModes = Object.freeze(Object.keys(semanticThemeByMode) as ThemeMode[]);

export const bthNativeThemeOutputs = Object.freeze(
  Object.fromEntries(bthThemeModes.map((mode) => [mode, createNativeThemeOutput(mode)])) as Record<ThemeMode, ReturnType<typeof createNativeThemeOutput>>
);