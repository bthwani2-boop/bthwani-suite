/**
 * Lean UI Kit final family file: Card.tsx
 * Self-contained. No compat dependency.
 */

import * as React from 'react';
import { ActivityIndicator, Image, Modal as RNModal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { spacing } from './foundation';
import {
  BthSearchField,
  BthScreenHeader,
  BthSectionHeader,
  BthServiceTileCard,
  BthStateView,
  type BthServiceTileCardProps,
} from './components';
import { BthSurface } from './primitives';

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

export type BthCard = any;
export const BthCard: any = createLeanExport('BthCard');
export type BthBadge = any;
export const BthBadge: any = createLeanExport('BthBadge');
export type BthChip = any;
export const BthChip: any = createLeanExport('BthChip');
export type LegacyBthDashboardShell = any;
export const LegacyBthDashboardShell: any = createLeanExport('BthDashboardShell');
export type BthProductCard = any;
export const BthProductCard: any = createLeanExport('BthProductCard');
export type BthProductCardProps = any;
export const BthProductCardProps: any = createLeanExport('BthProductCardProps');
export type BthStatCard = any;
export const BthStatCard: any = createLeanExport('BthStatCard');
export type LegacyBthServiceHubShell = any;
export const LegacyBthServiceHubShell: any = createLeanExport('BthServiceHubShell');
export type BthWebMissionHeroCard = any;
export const BthWebMissionHeroCard: any = createLeanExport('BthWebMissionHeroCard');
export type BthWebSectionCard = any;
export const BthWebSectionCard: any = createLeanExport('BthWebSectionCard');
export type BthWebSignalCard = any;
export const BthWebSignalCard: any = createLeanExport('BthWebSignalCard');
export type Card = any;
export const Card: any = createLeanExport('Card');
export type scrollContentContainerStyle = any;
export const scrollContentContainerStyle: any = createLeanExport('scrollContentContainerStyle');
export type SummaryCard = any;
export const SummaryCard: any = createLeanExport('SummaryCard');

/** Auto-added exports required by current consumers. */

export type DashboardSection = {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
};

export type BthDashboardShellProps = {
  title: string;
  subtitle?: string;
  hero?: React.ReactNode;
  sections?: DashboardSection[];
};

export function BthDashboardShell({ title, subtitle, hero, sections = [] }: BthDashboardShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[5] }}>
      <BthScreenHeader title={title} subtitle={subtitle} />
      {hero ? <View>{hero}</View> : null}
      {sections.map((section, index) => (
        <View key={`${section.title}-${index}`} style={{ gap: spacing[3] }}>
          <BthSectionHeader title={section.title} subtitle={section.subtitle} />
          <View>{section.content}</View>
        </View>
      ))}
    </ScrollView>
  );
}

export type BthServiceHubSection = {
  id: string;
  title: string;
  subtitle?: string;
  count?: number | string;
  headingOrder?: 'title-first' | 'count-first';
  tiles: BthServiceTileCardProps[];
};

export type BthServiceHubShellProps = {
  title: string;
  subtitle?: string;
  sections: BthServiceHubSection[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  hero?: React.ReactNode;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
};

export function BthServiceHubShell({
  title,
  subtitle,
  sections,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  hero,
  emptyState,
  footer,
}: BthServiceHubShellProps) {
  const totalTiles = sections.reduce((sum, section) => sum + section.tiles.length, 0);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[5] }}>
      <BthScreenHeader title={title} subtitle={subtitle} />

      {hero ? <View>{hero}</View> : null}

      {onSearchChange ? (
        <BthSearchField
          value={searchValue ?? ''}
          onChangeText={onSearchChange}
          placeholder={searchPlaceholder}
        />
      ) : null}

      {totalTiles === 0
        ? (
          emptyState ?? <BthStateView stateId="empty" />
        )
        : sections.map((section) => (
          <View key={section.id} style={{ gap: spacing[3] }}>
            <BthSectionHeader
              title={section.title}
              subtitle={section.subtitle}
              count={section.count ?? section.tiles.length}
              headingOrder={section.headingOrder ?? 'title-first'}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
              {section.tiles.map((tile) => (
                <View key={tile.title} style={{ width: '48%' }}>
                  <BthServiceTileCard {...tile} />
                </View>
              ))}
            </View>
          </View>
        ))}

      {footer ? <View>{footer}</View> : null}
    </ScrollView>
  );
}

export type BthDetailScreenShellProps = {
  title: string;
  subtitle?: string;
  sections: Array<{
    title: string;
    subtitle?: string;
    content: React.ReactNode;
  }>;
};

export function BthDetailScreenShell({ title, subtitle, sections }: BthDetailScreenShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
      <BthScreenHeader title={title} subtitle={subtitle} />
      {sections.map((section, index) => (
        <BthSurface key={`${section.title}-${index}`}>
          <BthSectionHeader title={section.title} subtitle={section.subtitle} />
          <View>{section.content}</View>
        </BthSurface>
      ))}
    </ScrollView>
  );
}
