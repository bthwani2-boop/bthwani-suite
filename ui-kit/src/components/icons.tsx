import * as React from 'react';
import { type StyleProp, type TextStyle } from 'react-native';
import { useDirection, useTheme } from '../providers';

// ─── Ionicons interop ──────────────────────────────────────────────────────────
// @expo/vector-icons ships pure-ESM .js files (`export default createIconSet(…)`).
// Metro's CJS/ESM interop sometimes resolves the module namespace object instead
// of the default export, resulting in `Cannot read property 'default' of undefined`.
// The safe pattern: require the BUILD path directly and extract `.default` with a
// CJS fallback so Metro always gets the class regardless of interop mode.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _IoniconsModule = require('@expo/vector-icons/build/Ionicons');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const Ionicons: React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}> =
  // ESM default interop: module.default ?? module itself (CJS class export)
  (_IoniconsModule?.default ?? _IoniconsModule);

// ─── Types ────────────────────────────────────────────────────────────────────

// Keep the icon name type compatible with the full Ionicons glyph set.
// We derive it loosely so we don't need a direct import of the class for the type.
export type IconName = string;

export type IconTone =
  | 'default'
  | 'muted'
  | 'soft'
  | 'inverse'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type IconProps = {
  name: IconName;
  size?: number;
  tone?: IconTone;
  color?: string;
  mirrored?: boolean;
  style?: StyleProp<TextStyle>;
};

// ─── Icon component ───────────────────────────────────────────────────────────

export function Icon({
  name,
  size = 20,
  tone = 'default',
  color,
  mirrored = false,
  style,
}: IconProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const toneColor: string = ({
    default: theme.text,
    muted: theme.textMuted,
    soft: theme.textSoft,
    inverse: theme.brandContrast,
    brand: theme.brand,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,
    info: theme.info,
  } as Record<IconTone, string>)[tone];

  const resolvedColor = color ?? toneColor;
  const shouldMirror = mirrored && direction === 'rtl';

  return (
    <Ionicons
      name={name}
      size={size}
      color={resolvedColor}
      style={[shouldMirror ? { transform: [{ scaleX: -1 }] } : undefined, style]}
    />
  );
}
