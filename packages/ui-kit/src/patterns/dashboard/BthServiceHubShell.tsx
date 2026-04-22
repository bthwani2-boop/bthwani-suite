import React from 'react';
import { ScrollView, View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthScreenHeader, BthSearchField, BthSectionHeader, BthServiceTileCard, BthStateView } from '../../components';
import type { BthServiceTileCardProps } from '../../components/display/BthServiceTileCard';

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
