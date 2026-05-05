import React from 'react';

export type ExpoVectorIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'color' | 'style'> & {
  readonly name?: string;
  readonly size?: number;
  readonly color?: string;
  readonly style?: unknown;
};

function toWebStyle(style: unknown): React.CSSProperties | undefined {
  if (!style || Array.isArray(style) || typeof style !== 'object') {
    return undefined;
  }

  return style as React.CSSProperties;
}

const VectorIconShim = React.forwardRef<HTMLSpanElement, ExpoVectorIconProps>(
  ({ name, size = 16, color = 'currentColor', style, ...rest }, ref) => {
    const numericSize = Number.isFinite(size) ? Number(size) : 16;

    return (
      <span
        {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
        ref={ref}
        aria-hidden="true"
        data-bthwani-web-vector-icon-shim={String(name ?? '')}
        style={{
          display: 'inline-flex',
          width: numericSize,
          minWidth: numericSize,
          height: numericSize,
          alignItems: 'center',
          justifyContent: 'center',
          color,
          fontSize: Math.max(10, Math.round(numericSize * 0.7)),
          lineHeight: 1,
          verticalAlign: 'middle',
          ...toWebStyle(style),
        }}
      >
        •
      </span>
    );
  },
);

VectorIconShim.displayName = 'BthwaniWebVectorIconShim';

export const Ionicons = Object.assign(VectorIconShim, {
  glyphMap: {} as Record<string, number>,
});

export const MaterialIcons = Ionicons;
export const MaterialCommunityIcons = Ionicons;
export const FontAwesome = Ionicons;
export const FontAwesome5 = Ionicons;
export const FontAwesome6 = Ionicons;
export const Feather = Ionicons;
export const Entypo = Ionicons;
export const AntDesign = Ionicons;
export const EvilIcons = Ionicons;
export const Foundation = Ionicons;
export const Octicons = Ionicons;
export const SimpleLineIcons = Ionicons;
export const Zocial = Ionicons;

export default Ionicons;
