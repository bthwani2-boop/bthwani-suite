import React from 'react';
import { View } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { radius, spacing } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthSurface, BthText } from '../../primitives';
import { BthEmptyState } from '../feedback';

export type BthDataTableColumn<Row extends Record<string, unknown>> = {
  id: string;
  header: string;
  renderCell: (row: Row) => React.ReactNode;
  align?: 'start' | 'center' | 'end';
  grow?: number;
};

export type BthDataTableProps<Row extends Record<string, unknown>> = {
  columns: readonly BthDataTableColumn<Row>[];
  rows: readonly Row[];
  rowKey: keyof Row | ((row: Row, index: number) => string);
  caption?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  dense?: boolean;
  language?: string;
};

function resolveCellAlignment(direction: 'rtl' | 'ltr', align: 'start' | 'center' | 'end') {
  if (align === 'center') {
    return 'center';
  }

  if (align === 'end') {
    return direction === 'rtl' ? 'flex-start' : 'flex-end';
  }

  return direction === 'rtl' ? 'flex-end' : 'flex-start';
}

export function BthDataTable<Row extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  caption,
  emptyTitle,
  emptyDescription,
  dense = false,
  language
}: BthDataTableProps<Row>) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowGap = dense ? spacing[2] : spacing[3];

  if (rows.length === 0) {
    return <BthEmptyState title={emptyTitle} description={emptyDescription} language={language} />;
  }

  return (
    <BthSurface tone="raised" padding={0} gap={0} radiusToken="xl" style={{ overflow: 'hidden' }}>
      {caption ? (
        <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[2] }}>
          <BthText role="caption" tone="muted">{caption}</BthText>
        </View>
      ) : null}
      <View
        style={{
          flexDirection: resolveRowDirection(direction),
          paddingHorizontal: spacing[4],
          paddingBottom: spacing[2],
          gap: spacing[3]
        }}
      >
        {columns.map((column) => (
          <View key={column.id} style={{ flex: column.grow ?? 1, alignItems: resolveCellAlignment(direction, column.align ?? 'start') }}>
            <BthText role="caption" tone="soft" align={column.align ?? 'start'}>{column.header}</BthText>
          </View>
        ))}
      </View>
      <View style={{ gap: 1, backgroundColor: theme.line }}>
        {rows.map((row, index) => {
          const resolvedKey = typeof rowKey === 'function' ? rowKey(row, index) : String(row[rowKey] ?? index);

          return (
            <View
              key={resolvedKey}
              style={{
                flexDirection: resolveRowDirection(direction),
                alignItems: 'stretch',
                gap: spacing[3],
                paddingHorizontal: spacing[4],
                paddingVertical: rowGap,
                backgroundColor: index % 2 === 0 ? theme.surfaceRaised : theme.surface
              }}
            >
              {columns.map((column) => (
                <View
                  key={column.id}
                  style={{
                    flex: column.grow ?? 1,
                    alignItems: resolveCellAlignment(direction, column.align ?? 'start'),
                    justifyContent: 'center',
                    minHeight: 36
                  }}
                >
                  {typeof column.renderCell(row) === 'string' || typeof column.renderCell(row) === 'number' ? (
                    <BthText role={dense ? 'bodySm' : 'bodyMd'} align={column.align ?? 'start'}>
                      {String(column.renderCell(row))}
                    </BthText>
                  ) : (
                    column.renderCell(row)
                  )}
                </View>
              ))}
            </View>
          );
        })}
      </View>
      <View style={{ height: 1, backgroundColor: theme.line, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl }} />
    </BthSurface>
  );
}