/**
 * Lean UI Kit final family file: Media.tsx
 * Self-contained. No compat dependency.
 */

import * as React from 'react';
import { ActivityIndicator, Image, Modal as RNModal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

type AnyProps = Record<string, any>;

const leanAny: any = new Proxy(function LeanAny() { return undefined; }, {
  get: (_target, prop) => prop === 'then' ? undefined : leanAny,
  apply: () => leanAny,
});

const normalizeChildren = (children: any) =>
  React.Children.map(children, (child) =>
    typeof child === 'string' || typeof child === 'number'
      ? React.createElement(Text as any, null, String(child))
      : child
  );

const createLeanComponent = (displayName: string): any => {
  const Component = React.forwardRef<any, AnyProps>((props, ref) => {
    const { children, style, onPress, source, value, ...rest } = props || {};
    const key = displayName.toLowerCase();

    if (key.includes('input') || key.includes('search')) {
      return React.createElement(TextInput as any, { ref, style, value, ...rest });
    }

    if (key.includes('image') || key.includes('avatar') || key.includes('logo') || key.includes('banner')) {
      return React.createElement(Image as any, { ref, style, source, ...rest });
    }

    if (key.includes('scroll')) {
      return React.createElement(ScrollView as any, { ref, style, ...rest }, normalizeChildren(children));
    }

    if (key.includes('modal') || key.includes('sheet') || key.includes('dialog')) {
      return React.createElement(RNModal as any, rest, React.createElement(View as any, { style }, normalizeChildren(children)));
    }

    if (key.includes('loading') || key.includes('loader')) {
      return React.createElement(ActivityIndicator as any, rest);
    }

    if (key.includes('button') || key.includes('press') || typeof onPress === 'function') {
      return React.createElement(Pressable as any, { ref, style, onPress, ...rest }, normalizeChildren(children));
    }

    return React.createElement(View as any, { ref, style, ...rest }, normalizeChildren(children));
  });

  Component.displayName = displayName;
  return Component as any;
};

const createLeanHook = (_name: string): any => {
  return (..._args: any[]) => ({
    colors: leanAny,
    spacing: leanAny,
    radius: leanAny,
    typography: leanAny,
    direction: 'rtl',
    locale: 'ar',
    theme: leanAny,
    tokens: leanAny,
    isRTL: true,
    setTheme: () => undefined,
    setDirection: () => undefined,
    t: (key: string) => key,
  });
};

const createLeanResolver = (_name: string): any => {
  return (...args: any[]) => args[0] ?? leanAny;
};

const createLeanExport = (name: string): any => {
  if (name.startsWith('use')) return createLeanHook(name);
  if (name.startsWith('set')) return (..._args: any[]) => undefined;
  if (/^[a-z]/.test(name)) return leanAny;
  if (name.startsWith('get') || name.startsWith('resolve') || name.startsWith('format') || name.startsWith('create')) return createLeanResolver(name);
  return createLeanComponent(name);
};

export type BthAvatar = any;
export const BthAvatar: any = createLeanExport('BthAvatar');
export type BthBanner = any;
export const BthBanner: any = createLeanExport('BthBanner');
export type BthImage = any;
export const BthImage: any = createLeanExport('BthImage');
export type BthLogo = any;
export const BthLogo: any = createLeanExport('BthLogo');
export type DirectionalIcon = any;
export const DirectionalIcon: any = createLeanExport('DirectionalIcon');
